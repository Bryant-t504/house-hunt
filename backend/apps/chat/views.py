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
        
        # Efficiently get all unique users who share a conversation with the current user
        # Exclude 'self' from the list of partners
        partners = User.objects.filter(
            conversations__participants=user
        ).exclude(
            id=user.id
        ).distinct().values('id', 'username', 'role')
        
        return Response(partners)
