import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q

from .models import Message, Conversation


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time chat.

    Room name format: `conv_<conversation_id>`
    e.g.  ws://host/ws/chat/conv_42/

    Security:
    - Anonymous connections are rejected immediately.
    - The user must be a verified participant (tenant or landlord) of the
      requested conversation — enforced in connect() before accepting.

    Schema alignment:
    - Messages are saved via the Conversation model (no receiver field).
    - created_at is used instead of the legacy `timestamp` field.
    """

    async def connect(self):
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return

        # URL pattern: ws/chat/conv_<id>/
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_conv_{self.conversation_id}'

        # Validate participation before accepting the connection
        conversation = await self.get_conversation_for_user(self.conversation_id)
        if not conversation:
            print(f"[ChatConsumer] Connection rejected: User {self.user.id} is not a participant in conversation {self.conversation_id}")
            await self.close()
            return

        self.conversation = conversation
        print(f"[ChatConsumer] Connection accepted for {self.user.username} in conversation {self.conversation_id}")

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )

    async def receive(self, text_data):
        """
        Incoming WebSocket frame from the browser.
        Expected payload: {"message": "<text>"}
        """
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        message_content = data.get('message', '').strip()
        if not message_content:
            return

        saved_msg = await self.save_message(message_content)

        if saved_msg:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_id': saved_msg.pk,
                    'message': message_content,
                    'sender_id': self.user.id,
                    'sender_username': self.user.username,
                    'created_at': saved_msg.created_at.isoformat(),
                },
            )
        else:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Failed to save message. Please try again.',
            }))

    async def chat_message(self, event):
        """
        Broadcast handler — pushes the event payload out to the WebSocket client.
        """
        await self.send(text_data=json.dumps(event))

    # ------------------------------------------------------------------ #
    # DB helpers (run synchronously via database_sync_to_async)
    # ------------------------------------------------------------------ #

    @database_sync_to_async
    def get_conversation_for_user(self, conversation_id):
        """
        Return the Conversation if the current user is a participant,
        else return None. Also rejects soft-deleted conversations.
        """
        return Conversation.objects.filter(
            pk=conversation_id,
            is_deleted=False,
        ).filter(
            Q(tenant=self.user) | Q(landlord=self.user)
        ).first()

    @database_sync_to_async
    def save_message(self, content):
        """
        Persist a Message inside an atomic block.
        Bumps conversation.updated_at so the thread surfaces at the top of list views.
        """
        from django.db import transaction
        from django.utils import timezone

        try:
            with transaction.atomic():
                msg = Message.objects.create(
                    conversation=self.conversation,
                    sender=self.user,
                    content=content,
                )
                # Bump conversation's updated_at for ordering in list views
                Conversation.objects.filter(pk=self.conversation.pk).update(
                    updated_at=timezone.now()
                )
                return msg
        except Exception as exc:
            print(f"[ChatConsumer] Error saving message: {exc}")
            return None
