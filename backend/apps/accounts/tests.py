from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.properties.models import Property

User = get_user_model()

class AuthTests(APITestCase):
    """
    Tests for GridNest Authentication and RBAC.
    """

    def test_registration_success(self):
        """Test user can register successfully."""
        url = reverse('auth_register')
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "GridNestPassword123!",
            "password_confirm": "GridNestPassword123!",
            "phone_number": "0712345678"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'newuser')
        self.assertEqual(User.objects.get().role, User.Role.TENANT) # Should default to TENANT

    def test_duplicate_email_prevention(self):
        """Test duplicate emails are rejected."""
        User.objects.create_user(username="user1", email="same@example.com", password="Pass123!@#")
        url = reverse('auth_register')
        data = {
            "username": "user2",
            "email": "same@example.com",
            "password": "Pass123!@#",
            "password_confirm": "Pass123!@#",
            "phone_number": "0712345678"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_privilege_escalation_prevention(self):
        """Test users cannot register as ADMIN."""
        url = reverse('auth_register')
        data = {
            "username": "hacker",
            "email": "hacker@example.com",
            "password": "HackerPassword123!",
            "password_confirm": "HackerPassword123!",
            "role": "ADMIN" # Attempting to escalate
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='hacker')
        self.assertEqual(user.role, User.Role.TENANT) # Must be TENANT

    def test_landlord_registration(self):
        """Test user can register as LANDLORD."""
        url = reverse('auth_register')
        data = {
            "username": "landlord_test",
            "email": "landlord_test@example.com",
            "password": "LandlordPassword123!",
            "password_confirm": "LandlordPassword123!",
            "role": "LANDLORD",
            "phone_number": "1234567890"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='landlord_test')
        self.assertEqual(user.role, User.Role.LANDLORD)

    def test_weak_password_rejection(self):
        """Test weak passwords are rejected."""
        url = reverse('auth_register')
        data = {
            "username": "weakuser",
            "email": "weak@example.com",
            "password": "123",
            "password_confirm": "123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_landlord_verification_required(self):
        """Test unverified landlords cannot list properties."""
        # Create unverified landlord
        landlord = User.objects.create_user(
            username="landlord1", 
            email="l@example.com", 
            password="LandlordPass123!",
            role=User.Role.LANDLORD,
            is_verified=False
        )
        self.client.force_authenticate(user=landlord)
        
        url = reverse('property_list_create')
        data = {
            "title": "Unverified Property",
            "description": "Should not be allowed",
            "price": "1000",
            "address": "123 Street",
            "city": "Nairobi",
            "property_type": "APARTMENT"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['verification_status'], 'PENDING')

    def test_verified_landlord_can_list(self):
        """Test verified landlords can list properties."""
        landlord = User.objects.create_user(
            username="landlord2", 
            email="l2@example.com", 
            password="LandlordPass123!",
            role=User.Role.LANDLORD,
            is_verified=True
        )
        self.client.force_authenticate(user=landlord)
        
        url = reverse('property_list_create')
        data = {
            "title": "Verified Property",
            "description": "Should be allowed",
            "price": "1000",
            "address": "123 Street",
            "city": "Nairobi",
            "property_type": "APARTMENT",
            "num_bedrooms": 2,
            "num_bathrooms": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_endpoints_access_control(self):
        """Test that only admins can access verification endpoints."""
        url = reverse('admin_landlords')
        
        # Unauthenticated
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Tenant
        tenant = User.objects.create_user(username="t1", email="t1@ex.com", password="P", role=User.Role.TENANT)
        self.client.force_authenticate(user=tenant)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Landlord
        landlord = User.objects.create_user(username="l1", email="l1@ex.com", password="P", role=User.Role.LANDLORD)
        self.client.force_authenticate(user=landlord)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin
        admin = User.objects.create_superuser(username="admin_user", password="P", email="adm@ex.com")
        self.client.force_authenticate(user=admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_revoked_landlord_visibility(self):
        """Test that unverified landlords' properties are hidden from public search."""
        # 1. Create a verified landlord and property
        landlord = User.objects.create_user(
            username="revoked_landlord", 
            email="revoked@test.com", 
            password="Pass", 
            role=User.Role.LANDLORD, 
            is_verified=True
        )
        Property.objects.create(
            landlord=landlord, title="Test House", price=1000, 
            address="123", city="Test", property_type="HOUSE",
            verification_status='VERIFIED'
        )
        
        # 2. Verify property is public
        url = reverse('property_list_create')
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
        
        # 3. Revoke verification
        admin = User.objects.create_superuser(username="admin2", email="adm2@ex.com", password="P")
        self.client.force_authenticate(user=admin)
        verify_url = reverse('admin_verify', kwargs={'pk': landlord.id})
        self.client.patch(verify_url) # Toggles is_verified to False
        
        landlord.refresh_from_db()
        self.assertFalse(landlord.is_verified)
        
        # 4. Verify property is now hidden from public (logout admin first)
        self.client.logout()
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)
        
        # 5. Verify the landlord can still see their own property
        self.client.force_authenticate(user=landlord)
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
