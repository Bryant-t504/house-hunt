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
        self.user1 = User.objects.create_user(
            username="user1", email="u1@test.com", password="Pass123!@#", role=User.Role.TENANT
        )
        self.user2 = User.objects.create_user(
            username="user2", email="u2@test.com", password="Pass123!@#", role=User.Role.LANDLORD
        )
        self.user3 = User.objects.create_user(
            username="user3", email="u3@test.com", password="Pass123!@#", role=User.Role.TENANT
        )
        
        # Create a conversation and add participants
        self.conversation = Conversation.objects.create()
        self.conversation.participants.add(self.user1, self.user2)

        # Create some messages between user1 and user2
        Message.objects.create(
            conversation=self.conversation,
            sender=self.user1, 
            receiver=self.user2, 
            content="Hello landlord!"
        )
        Message.objects.create(
            conversation=self.conversation,
            sender=self.user2, 
            receiver=self.user1, 
            content="Hi tenant!"
        )

    def test_chat_history_returns_correct_messages(self):
        """Test that chat history only returns messages between the two users."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('chat_history', kwargs={'other_user_id': self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_chat_history_excludes_other_conversations(self):
        """Test that user3 cannot see messages between user1 and user2."""
        self.client.force_authenticate(user=self.user3)
        url = reverse('chat_history', kwargs={'other_user_id': self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_conversation_list_returns_partners(self):
        """Test that conversation list shows only users you've chatted with."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('conversation_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        partner_ids = [p['id'] for p in response.data]
        self.assertIn(self.user2.id, partner_ids)
        self.assertNotIn(self.user3.id, partner_ids)

    def test_conversation_list_empty_for_new_user(self):
        """Test that a user with no messages has an empty conversation list."""
        self.client.force_authenticate(user=self.user3)
        url = reverse('conversation_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_unauthenticated_access_blocked(self):
        """Test that unauthenticated users cannot access chat endpoints."""
        url = reverse('chat_history', kwargs={'other_user_id': self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_message_via_api(self):
        """Test sending a message via REST API."""
        self.client.force_authenticate(user=self.user1)
        url = reverse('send_message')
        data = {
            "receiver": self.user2.id,
            "content": "Test message via API"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 3)
