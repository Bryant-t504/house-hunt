import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
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

        # Join the unique 'Room Group' for this specific conversation
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group when the user closes the tab or logs out
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Triggered when a user sends a message from the frontend.
        """
        data = json.loads(text_data)
        message_content = data['message']
        receiver_id = data['receiver_id']

        # Save to database asynchronously (so the server doesn't freeze)
        saved_msg = await self.save_message(receiver_id, message_content)

        # Broadcast the message to EVERYONE currently in this room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message', # This calls the chat_message method below
                'message': message_content,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'timestamp': saved_msg.timestamp.isoformat()
            }
        )

    async def chat_message(self, event):
        """
        This method is called when someone broadcasts to the group.
        It pushes the message out to the actual browser WebSocket.
        """
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, receiver_id, content):
        """
        Helper to save message to DB inside an async context.
        """
        receiver = User.objects.get(id=receiver_id)
        return Message.objects.create(
            sender=self.user,
            receiver=receiver,
            content=content
        )
