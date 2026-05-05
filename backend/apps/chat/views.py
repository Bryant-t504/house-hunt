from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    ConversationListSerializer,
    MessageSerializer,
)


class ConversationListView(generics.ListAPIView):
    """
    GET — List all conversations the current user participates in
    (as either tenant or landlord), ordered by most recently updated.
    """
    serializer_class = ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            Conversation.objects
            .filter(
                Q(tenant=user) | Q(landlord=user),
                is_deleted=False,
            )
            .select_related('property', 'tenant', 'landlord')
            .order_by('-updated_at')
        )


class ConversationDetailView(generics.RetrieveAPIView):
    """
    GET — Retrieve a specific conversation and its messages.
    Only participants (tenant or landlord) may access it.
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(tenant=user) | Q(landlord=user),
            is_deleted=False,
        ).select_related('property', 'tenant', 'landlord').prefetch_related('messages__sender')

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if obj.tenant != user and obj.landlord != user:
            raise PermissionDenied("You are not a participant in this conversation.")
        return obj


class ConversationCreateView(generics.CreateAPIView):
    """
    POST — Create or retrieve the unique conversation thread for a
    (property, tenant, landlord) triplet.

    Uses get_or_create to enforce the UNIQUE constraint without returning 400.
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        from apps.properties.models import Property as PropertyModel
        from django.contrib.auth import get_user_model
        User = get_user_model()

        property_id = request.data.get('property')
        landlord_id = request.data.get('landlord')

        if not property_id or not landlord_id:
            return Response(
                {"detail": "Both 'property' and 'landlord' fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            property_obj = PropertyModel.objects.get(pk=property_id, is_deleted=False)
            landlord = User.objects.get(pk=landlord_id)
        except (PropertyModel.DoesNotExist, User.DoesNotExist) as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

        conversation, created = Conversation.objects.get_or_create(
            property=property_obj,
            tenant=request.user,
            landlord=landlord,
        )

        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(ConversationSerializer(conversation).data, status=http_status)


class MessageListView(generics.ListAPIView):
    """
    GET — Retrieve all messages for a specific conversation.
    Only participants may access. Messages ordered oldest → newest.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        conversation_id = self.kwargs['conversation_id']

        # Enforce participation before returning messages
        conversation = Conversation.objects.filter(
            pk=conversation_id,
            is_deleted=False,
        ).filter(Q(tenant=user) | Q(landlord=user)).first()

        if not conversation:
            raise PermissionDenied("Conversation not found or you are not a participant.")

        return (
            Message.objects
            .filter(conversation=conversation, is_deleted=False)
            .select_related('sender')
            .order_by('created_at')
        )


class SendMessageView(generics.CreateAPIView):
    """
    POST — Send a message within an existing conversation.
    Only the tenant or landlord of the conversation may post.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        conversation_id = self.kwargs['conversation_id']

        conversation = Conversation.objects.filter(
            pk=conversation_id,
            is_deleted=False,
        ).filter(Q(tenant=user) | Q(landlord=user)).first()

        if not conversation:
            raise PermissionDenied("Conversation not found or you are not a participant.")

        # Bump the conversation's updated_at so it surfaces at the top of the list
        from django.utils import timezone
        conversation.updated_at = timezone.now()
        conversation.save(update_fields=['updated_at'])

        serializer.save(sender=user, conversation=conversation)
