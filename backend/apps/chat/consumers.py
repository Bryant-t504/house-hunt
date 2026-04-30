import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Conversation
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    """
    The Consumer handles the active WebSocket connection.
    It manages connecting, receiving messages, and broadcasting to others.
    """
    async def connect(self):
        self.user = self.scope["user"]
        
        # If the JWT middleware couldn't find a user, reject the connection
        if self.user.is_anonymous:
            await self.close()
            return

        # The room name is passed from the frontend (e.g., 'user_1_2')
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Security: Verify the user is actually part of this room
        try:
            ids = self.room_name.split('_')
            room_user_ids = [int(uid) for uid in ids]
        except (ValueError, IndexError):
            await self.close()
            return

        if self.user.id not in room_user_ids:
            # Reject: this user is not a participant in this room
            await self.close()
            return

        # Join the unique 'Room Group' for this specific conversation
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group when the user closes the tab or logs out
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    @database_sync_to_async
    def save_message(self, receiver_id, content):
        """
        Helper to save message to DB inside an async context.
        Uses atomicity to prevent duplicate conversations.
        """
        from django.db import transaction
        try:
            with transaction.atomic():
                receiver = User.objects.get(id=receiver_id)
                
                # We sort participant IDs to have a consistent lookup if we wanted a unique key
                # But here we just use the ManyToMany relationship
                conversation = Conversation.objects.filter(
                    participants=self.user
                ).filter(
                    participants=receiver
                ).first()
                
                if not conversation:
                    conversation = Conversation.objects.create()
                    conversation.participants.add(self.user, receiver)
                
                return Message.objects.create(
                    conversation=conversation,
                    sender=self.user,
                    receiver=receiver,
                    content=content
                )
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data.get('message', '')
        receiver_id = data.get('receiver_id')

        if not message_content or not receiver_id:
            return

        # Save to database
        saved_msg = await self.save_message(receiver_id, message_content)

        if saved_msg:
            # Broadcast the message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'sender_id': self.user.id,
                    'sender_username': self.user.username,
                    'timestamp': saved_msg.timestamp.isoformat()
                }
            )
        else:
            # Inform the sender that something went wrong
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Failed to send message.'
            }))

    async def chat_message(self, event):
        """
        This method is called when someone broadcasts to the group.
        It pushes the message out to the actual browser WebSocket.
        """
        await self.send(text_data=json.dumps(event))
