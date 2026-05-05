from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for individual chat messages.

    - sender_username: display-only convenience field.
    - No receiver field — recipient is derived from the Conversation context.
      Use the parent Conversation's tenant/landlord fields to determine
      which user is the "other" party.
    - created_at replaces legacy `timestamp` field name.
    """
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = (
            'id',
            'conversation',
            'sender',
            'sender_username',
            'content',
            'is_read',
            'is_deleted',
            'created_at',
        )
        read_only_fields = (
            'id',
            'conversation',
            'sender',
            'sender_username',
            'is_read',
            'is_deleted',
            'created_at',
        )


class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for Conversation threads.
    Includes a nested preview of recent messages and participant usernames.
    """
    tenant_username = serializers.ReadOnlyField(source='tenant.username')
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    property_title = serializers.ReadOnlyField(source='property.title')
    # Last 50 messages — views should use select_related + prefetch_related
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = (
            'id',
            'property',
            'property_title',
            'tenant',
            'tenant_username',
            'landlord',
            'landlord_username',
            'is_deleted',
            'created_at',
            'updated_at',
            'messages',
        )
        read_only_fields = (
            'id',
            'tenant_username',
            'landlord_username',
            'property_title',
            'is_deleted',
            'created_at',
            'updated_at',
        )


class ConversationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for the conversation list view —
    does NOT nest messages to avoid expensive queries.
    """
    tenant_username = serializers.ReadOnlyField(source='tenant.username')
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    property_title = serializers.ReadOnlyField(source='property.title')

    class Meta:
        model = Conversation
        fields = (
            'id',
            'property',
            'property_title',
            'tenant',
            'tenant_username',
            'landlord',
            'landlord_username',
            'updated_at',
        )
        read_only_fields = fields
