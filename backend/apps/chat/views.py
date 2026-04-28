from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatHistoryView(generics.ListAPIView):
    """
    View to get all messages between the current user and another specific user.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs.get('other_user_id')
        
        # Filter messages where (sender=me AND receiver=them) OR (sender=them AND receiver=me)
        return Message.objects.filter(
            (Q(sender=user) & Q(receiver_id=other_user_id)) |
            (Q(sender_id=other_user_id) & Q(receiver=user))
        ).order_by('timestamp')

class SendMessageView(generics.CreateAPIView):
    """
    View to send a new message.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the sender to the current user
        serializer.save(sender=self.request.user)

class ConversationListView(generics.ListAPIView):
    """
    View to get a list of all users the current user has chatted with.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        
        # Get all users who have sent me a message or I have sent them one
        sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True)
        received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True)
        
        partner_ids = set(list(sent_to) + list(received_from))
        partners = User.objects.filter(id__in=partner_ids).values('id', 'username', 'role')
        
        return Response(partners)
