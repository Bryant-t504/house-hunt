from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Message, Conversation

User = get_user_model()

class ChatTests(APITestCase):
    """
    Tests for Chat REST API endpoints and permissions.
    """
    def setUp(self):
        from apps.properties.models import Property
        from decimal import Decimal

        self.tenant1 = User.objects.create_user(
            username="tenant1", email="t1@test.com", password="Pass123!@#", role=User.Role.TENANT
        )
        self.landlord = User.objects.create_user(
            username="landlord", email="l@test.com", password="Pass123!@#", role=User.Role.LANDLORD, is_verified=True
        )
        self.tenant2 = User.objects.create_user(
            username="tenant2", email="t2@test.com", password="Pass123!@#", role=User.Role.TENANT
        )
        
        self.property = Property.objects.create(
            landlord=self.landlord,
            title="Test House",
            price=Decimal("1500.00"),
            status='active',
            is_verified=True
        )
        
        # Create a conversation
        self.conversation = Conversation.objects.create(
            property=self.property,
            tenant=self.tenant1,
            landlord=self.landlord
        )

        # Create some messages
        Message.objects.create(
            conversation=self.conversation,
            sender=self.tenant1, 
            content="Hello landlord!"
        )
        Message.objects.create(
            conversation=self.conversation,
            sender=self.landlord, 
            content="Hi tenant!"
        )

    def test_message_list_returns_correct_messages(self):
        """Test that history returns messages for a conversation."""
        self.client.force_authenticate(user=self.tenant1)
        url = reverse('message_list', kwargs={'conversation_id': self.conversation.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_chat_history_excludes_other_users(self):
        """Test that tenant2 cannot see messages of tenant1."""
        self.client.force_authenticate(user=self.tenant2)
        url = reverse('message_list', kwargs={'conversation_id': self.conversation.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_conversation_list_returns_mine(self):
        """Test that conversation list shows only user's conversations."""
        self.client.force_authenticate(user=self.tenant1)
        url = reverse('conversation_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.conversation.id)

    def test_conversation_list_empty_for_new_user(self):
        """Test that a user with no messages has an empty list."""
        self.client.force_authenticate(user=self.tenant2)
        url = reverse('conversation_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_unauthenticated_access_blocked(self):
        """Test that unauthenticated users cannot access chat endpoints."""
        url = reverse('message_list', kwargs={'conversation_id': self.conversation.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_message_via_api(self):
        """Test sending a message via REST API."""
        self.client.force_authenticate(user=self.tenant1)
        url = reverse('send_message', kwargs={'conversation_id': self.conversation.id})
        data = {
            "content": "Test message via API"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 3)

