from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Property
from decimal import Decimal

User = get_user_model()

class PropertyTests(APITestCase):
    """
    Tests for GridNest Property CRUD and Search/Filter.
    """

    def setUp(self):
        # Create a verified landlord
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
        
        # Initial properties for filtering (must be VERIFIED to show in public feed)
        self.prop1 = Property.objects.create(
            landlord=self.landlord,
            title="Cheap Studio",
            description="Small studio near campus",
            price=Decimal("500.00"),
            address="123 Street",
            city="Nairobi",
            property_type=Property.PropertyType.STUDIO,
            bedrooms=1,
            amenities=["WiFi"],
            verification_status=Property.VerificationStatus.VERIFIED
        )
        self.prop2 = Property.objects.create(
            landlord=self.landlord,
            title="Luxury Villa",
            description="Big house with parking",
            price=Decimal("2500.00"),
            address="456 Avenue",
            city="Mombasa",
            property_type=Property.PropertyType.HOUSE,
            bedrooms=4,
            amenities=["WiFi", "Parking", "Pool"],
            verification_status=Property.VerificationStatus.VERIFIED
        )

    def test_search_by_keyword(self):
        """Test keyword search on title and description."""
        url = reverse('property_list_create')
        response = self.client.get(f"{url}?search=Luxury")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Villa")

    def test_filter_by_city(self):
        """Test exact city filter."""
        url = reverse('property_list_create')
        response = self.client.get(f"{url}?city=Mombasa")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['city'], "Mombasa")

    def test_filter_by_price_range(self):
        """Test min_price and max_price filters."""
        url = reverse('property_list_create')
        # Filter for properties up to 1000
        response = self.client.get(f"{url}?max_price=1000")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Cheap Studio")
        
        # Filter for properties above 2000
        response = self.client.get(f"{url}?min_price=2000")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Villa")

    def test_filter_by_bedrooms(self):
        """Test min_bedrooms filter."""
        url = reverse('property_list_create')
        response = self.client.get(f"{url}?min_bedrooms=3")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Villa")

    def test_filter_by_amenity(self):
        """Test filtering by amenity JSON array."""
        url = reverse('property_list_create')
        # Both have WiFi
        response = self.client.get(f"{url}?amenity=WiFi")
        self.assertEqual(len(response.data['results']), 2)
        
        # Only prop2 has Pool
        response = self.client.get(f"{url}?amenity=Pool")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Villa")

    def test_combined_filters(self):
        """Test multiple filters together."""
        url = reverse('property_list_create')
        response = self.client.get(f"{url}?city=Nairobi&max_price=1000&amenity=WiFi")
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Cheap Studio")

class PropertyVerificationTests(APITestCase):
    """
    Tests for property submission and verification workflow.
    """
    def setUp(self):
        self.landlord = User.objects.create_user(
            username="new_landlord", email="nl@test.com", password="Pass123!@#", role=User.Role.LANDLORD
        )
        self.tenant = User.objects.create_user(
            username="new_tenant", email="nt@test.com", password="Pass123!@#", role=User.Role.TENANT
        )
        self.admin = User.objects.create_superuser(
            username="admin", email="admin@test.com", password="Pass123!@#"
        )

    def test_landlord_can_submit_listing_unverified(self):
        """Test that unverified landlords can still submit properties."""
        self.client.force_authenticate(user=self.landlord)
        url = reverse('property_list_create')
        data = {
            "title": "Unverified Submission",
            "description": "Waiting for review",
            "price": "1000.00",
            "address": "789 Lane",
            "city": "Nairobi",
            "property_type": "APARTMENT"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['verification_status'], "PENDING")

    def test_pending_listing_is_hidden_from_public(self):
        """Test that PENDING listings do not show up in the public search."""
        Property.objects.create(
            landlord=self.landlord,
            title="Hidden Property",
            description="Should not see this",
            price=Decimal("1000.00"),
            address="789 Lane",
            city="Nairobi",
            verification_status=Property.VerificationStatus.PENDING
        )
        
        # Search as tenant
        self.client.force_authenticate(user=self.tenant)
        url = reverse('property_list_create')
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)

    def test_landlord_can_see_own_pending_listing(self):
        """Test that landlords can see their own listings even if PENDING."""
        Property.objects.create(
            landlord=self.landlord,
            title="My Pending Property",
            description="I should see this",
            price=Decimal("1000.00"),
            address="789 Lane",
            city="Nairobi",
            verification_status=Property.VerificationStatus.PENDING
        )
        
        self.client.force_authenticate(user=self.landlord)
        url = reverse('property_list_create')
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "My Pending Property")
