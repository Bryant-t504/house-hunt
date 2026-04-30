from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Booking
from apps.properties.models import Property
from decimal import Decimal

User = get_user_model()

class BookingTests(APITestCase):
    """
    Tests for Booking system.
    """
    def setUp(self):
        self.landlord = User.objects.create_user(
            username="landlord", 
            email="landlord@test.com", 
            password="Pass123!@#",
            role=User.Role.LANDLORD,
            is_verified=True
        )
        self.tenant = User.objects.create_user(
            username="tenant", 
            email="tenant@test.com", 
            password="Pass123!@#",
            role=User.Role.TENANT
        )
        self.admin = User.objects.create_superuser(
            username="admin", 
            email="admin@test.com", 
            password="Pass123!@#"
        )
        self.property = Property.objects.create(
            landlord=self.landlord,
            title="House",
            price=Decimal("1500.00"),
            address="123 Street",
            city="Nairobi",
            property_type=Property.PropertyType.HOUSE
        )
        self.future_date = (timezone.now() + timedelta(days=2)).isoformat()
        self.past_date = (timezone.now() - timedelta(days=2)).isoformat()

    def test_tenant_can_book_viewing(self):
        """Test tenant booking creation."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            "property": self.property.id,
            "preferred_date": self.future_date,
            "message": "I want to see this."
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.first().status, Booking.Status.PENDING)

    def test_landlord_cannot_book_own_property(self):
        """Test landlord blocked from booking their own."""
        self.client.force_authenticate(user=self.landlord)
        url = reverse('booking_list_create')
        data = {
            "property": self.property.id,
            "preferred_date": self.future_date
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_book_past_date(self):
        """Test past date validation."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            "property": self.property.id,
            "preferred_date": self.past_date
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prevent_double_booking(self):
        """Test tenant cannot double book the same property."""
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_list_create')
        data = {
            "property": self.property.id,
            "preferred_date": self.future_date
        }
        # First booking
        self.client.post(url, data, format='json')
        # Second identical booking
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already have an active viewing request", str(response.data))

    def test_landlord_can_approve_booking(self):
        """Test landlord can update booking status."""
        booking = Booking.objects.create(
            property=self.property, tenant=self.tenant, preferred_date=timezone.now()
        )
        self.client.force_authenticate(user=self.landlord)
        url = reverse('booking_update', kwargs={'pk': booking.id})
        data = {"status": "APPROVED"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.APPROVED)

    def test_tenant_cannot_approve_booking(self):
        """Test tenant cannot approve their own booking."""
        booking = Booking.objects.create(
            property=self.property, tenant=self.tenant, preferred_date=timezone.now()
        )
        self.client.force_authenticate(user=self.tenant)
        url = reverse('booking_update', kwargs={'pk': booking.id})
        data = {"status": "APPROVED"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.PENDING)
