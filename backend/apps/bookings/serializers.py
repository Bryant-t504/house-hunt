from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from apps.properties.serializers import PropertySerializer

class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing requests.
    """
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
        property_obj = attrs.get('property')
        preferred_date = attrs.get('preferred_date')
        user = self.context['request'].user
        
        # 1. Landlord cannot book their own property
        if property_obj and property_obj.landlord == user:
            raise serializers.ValidationError("You cannot book a viewing for your own property!")
            
        # 2. Date must be in the future
        if preferred_date and preferred_date < timezone.now():
            raise serializers.ValidationError({"preferred_date": "Viewing date must be in the future."})
            
        # 3. Prevent Double Booking
        if property_obj:
            existing_booking = Booking.objects.filter(
                tenant=user, 
                property=property_obj, 
                status__in=[Booking.Status.PENDING, Booking.Status.APPROVED]
            ).exists()
            if existing_booking:
                raise serializers.ValidationError("You already have an active viewing request for this property.")
                
        return attrs

class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for landlords to approve/reject bookings.
    Only the 'status' field is writable.
    """
    class Meta:
        model = Booking
        fields = ('id', 'status')
        
    def validate_status(self, value):
        if value not in [Booking.Status.APPROVED, Booking.Status.REJECTED, Booking.Status.CANCELLED]:
            raise serializers.ValidationError("Invalid status update.")
        return value
