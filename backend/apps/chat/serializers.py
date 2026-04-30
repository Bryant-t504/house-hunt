from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for individual chat messages.
    """
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message
        fields = (
            'id', 'sender', 'sender_username', 'receiver', 
            'receiver_username', 'content', 
            'is_read', 'timestamp'
        )
        read_only_fields = ('id', 'sender', 'is_read', 'timestamp')
