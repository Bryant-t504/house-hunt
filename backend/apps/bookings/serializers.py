from rest_framework import serializers
from django.utils import timezone

from .models import Booking
from apps.properties.serializers import PropertyListSerializer


class BookingSerializer(serializers.ModelSerializer):
    """
    Full serializer for Booking objects.

    - property_details: nested read-only snapshot of the listing.
    - tenant_username: display-only field.
    - landlord_username: derived from property.landlord — no landlord FK on Booking.
    - booking_date replaces legacy `preferred_date` field name.
    - Status choices are lowercase to match the model enum.
    """
    property_details = PropertyListSerializer(source='property', read_only=True)
    tenant_username = serializers.ReadOnlyField(source='tenant.username')
    # Derive landlord from the property — never stored on Booking directly
    landlord_username = serializers.ReadOnlyField(source='property.landlord.username')
    tenant_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            'id',
            'property',
            'property_details',
            'tenant',
            'tenant_username',
            'tenant_full_name',
            'landlord_username',
            'booking_date',
            'message',
            'status',
            'is_deleted',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'tenant',
            'tenant_username',
            'landlord_username',
            'status',
            'is_deleted',
            'created_at',
            'updated_at',
        )

    def validate(self, attrs):
        property_obj = attrs.get('property')
        booking_date = attrs.get('booking_date')
        user = self.context['request'].user

        # 1. Landlords cannot book their own property
        if property_obj and property_obj.landlord == user:
            raise serializers.ValidationError(
                "You cannot book a viewing for your own property."
            )

        # 2. Booking date must be today or in the future
        if booking_date and booking_date.date() < timezone.now().date():
            raise serializers.ValidationError(
                {"booking_date": "Booking date must be today or in the future."}
            )

        # 3. Prevent duplicate active bookings for the same property
        if property_obj:
            already_booked = Booking.objects.filter(
                tenant=user,
                property=property_obj,
                status__in=[Booking.Status.PENDING, Booking.Status.APPROVED],
                is_deleted=False,
            ).exists()
            if already_booked:
                raise serializers.ValidationError(
                    "You already have an active booking request for this property."
                )

        return attrs

    def get_tenant_full_name(self, obj):
        if obj.tenant.first_name or obj.tenant.last_name:
            return f"{obj.tenant.first_name} {obj.tenant.last_name}".strip()
        return obj.tenant.username


class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Restricted serializer for status transitions.
    Only `status` is writable — used by landlords (approve/reject)
    and tenants (cancel their own bookings).
    """
    class Meta:
        model = Booking
        fields = ('id', 'status')

    def validate_status(self, value):
        allowed = {
            Booking.Status.APPROVED,
            Booking.Status.REJECTED,
            Booking.Status.CANCELLED,
            Booking.Status.COMPLETED,
        }
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid status. Allowed transitions: "
                f"{[s.value for s in allowed]}"
            )
        return value
