from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import Booking
from apps.properties.models import Property

User = get_user_model()


class BookingTests(APITestCase):
    """
    Tests for the Booking system.

    Schema alignment notes:
    - `preferred_date` renamed → `booking_date`
    - `landlord` FK removed from Booking (derived from property)
    - Status choices are lowercase ('pending', 'approved', etc.)
    - Property uses `location` not `address`/`city`
    - Property status starts as 'pending', not auto-active
    """

    def setUp(self):
        self.landlord = User.objects.create_user(
            username='landlord',
            email='landlord@test.com',
            password='Pass123!@#',
            role=User.Role.LANDLORD,
            is_verified=True,
        )
        self.tenant = User.objects.create_user(
            username='tenant',
            email='tenant@test.com',
            password='Pass123!@#',
            role=User.Role.TENANT,
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='Pass123!@#',
        )
        self.property = Property.objects.create(
            landlord=self.landlord,
            title='Test House',
            description='A test property.',
            location='Nairobi, Kenya',
            price=Decimal('1500.00'),
            property_type=Property.PropertyType.HOUSE,
            status='active',
            is_verified=True,
        )
        self.future_date = (timezone.now() + timedelta(days=2)).isoformat()
        self.past_date = (timezone.now() - timedelta(days=2)).isoformat()

    def test_tenant_can_book_viewing(self):
        """Tenant can successfully create a booking."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            'property': self.property.id,
            'booking_date': self.future_date,
            'message': 'I would like to view this property.',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.first().status, Booking.Status.PENDING)

    def test_landlord_cannot_book_own_property(self):
        """Landlord is blocked from booking their own listing."""
        self.client.force_authenticate(user=self.landlord)
        url = reverse('booking_list_create')
        data = {
            'property': self.property.id,
            'booking_date': self.future_date,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_book_past_date(self):
        """Booking with a past date must be rejected."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            'property': self.property.id,
            'booking_date': self.past_date,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prevent_double_booking(self):
        """Tenant cannot submit a duplicate active booking for the same property."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            'property': self.property.id,
            'booking_date': self.future_date,
        }
        self.client.post(url, data, format='json')  # first booking
        response = self.client.post(url, data, format='json')  # duplicate
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already have an active booking', str(response.data))

    def test_landlord_can_approve_booking(self):
        """Landlord can approve a pending booking."""
        booking = Booking.objects.create(
            property=self.property,
            tenant=self.tenant,
            booking_date=timezone.now() + timedelta(days=1),
        )
        self.client.force_authenticate(user=self.landlord)
        url = reverse('booking_update', kwargs={'pk': booking.id})
        response = self.client.patch(url, {'status': 'approved'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.APPROVED)

    def test_tenant_cannot_approve_booking(self):
        """Tenant must not be able to approve their own booking."""
        booking = Booking.objects.create(
            property=self.property,
            tenant=self.tenant,
            booking_date=timezone.now() + timedelta(days=1),
        )
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_update', kwargs={'pk': booking.id})
        response = self.client.patch(url, {'status': 'approved'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.PENDING)
