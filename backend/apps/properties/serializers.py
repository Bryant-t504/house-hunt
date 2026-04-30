from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for Property listings.
    Includes the landlord's username for display.
    """
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    is_available = serializers.BooleanField(default=True)

    class Meta:
        model = Property
        fields = (
            'id', 'landlord', 'landlord_username', 'title', 
            'description', 'address', 'city', 'price', 
            'bedrooms', 'bathrooms', 'amenities',
            'property_type', 'image', 'is_available', 
            'verification_status', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'landlord', 'verification_status', 'created_at', 'updated_at')
