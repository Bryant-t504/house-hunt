from rest_framework import serializers
from .models import Booking
from apps.properties.serializers import PropertySerializer

class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing requests.
    """
    # Nested serializer to show property details in the booking list
    property_details = PropertySerializer(source='property', read_only=True)
    tenant_username = serializers.ReadOnlyField(source='tenant.username')

    class Meta:
        model = Booking
        fields = (
            'id', 'property', 'property_details', 'tenant', 
            'tenant_username', 'preferred_date', 'message', 
            'status', 'created_at'
        )
        read_only_fields = ('id', 'tenant', 'status', 'created_at')

    def validate(self, attrs):
        # Logic check: A landlord cannot book their own property
        property_obj = attrs['property']
        user = self.context['request'].user
        
        if property_obj.landlord == user:
            raise serializers.ValidationError("You cannot book a viewing for your own property!")
            
        return attrs
