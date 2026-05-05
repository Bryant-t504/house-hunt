from rest_framework import serializers
from .models import Property, PropertyImage, Amenity, PropertyAmenity


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ('id', 'name')


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image_url', 'created_at')
        read_only_fields = ('id', 'created_at')


class PropertySerializer(serializers.ModelSerializer):
    """
    Full serializer for Property listings.

    - landlord_username: display-only convenience field
    - amenities: nested read representation via AmenitySerializer
    - images: nested gallery via PropertyImageSerializer
    - status is read_only for tenants; exposed for landlord/admin filtering

    Note: is_available has been removed. Use `status` to determine availability.
    Active, verified listings have status='active' and is_verified=True.
    """
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    amenities = AmenitySerializer(many=True, read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Property
        fields = (
            'id',
            'landlord',
            'landlord_username',
            'title',
            'description',
            'location',
            'price',
            'bedrooms',
            'bathrooms',
            'property_type',
            'status',
            'is_verified',
            'is_deleted',
            'amenities',
            'images',
            'image',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'landlord',
            'landlord_username',
            'is_verified',   # Set only via VerificationLog workflow
            'is_deleted',    # Set only via soft-delete admin action
            'created_at',
            'updated_at',
        )

    def create(self, validated_data):
        image_data = validated_data.pop('image', None)
        property_obj = super().create(validated_data)
        if image_data:
            PropertyImage.objects.create(property=property_obj, image_url=image_data)
        return property_obj


class PropertyListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list views — avoids N+1 from nested amenity/image queries.
    Use PropertySerializer for detail views.
    """
    landlord_username = serializers.ReadOnlyField(source='landlord.username')
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = (
            'id',
            'landlord',
            'landlord_username',
            'title',
            'location',
            'price',
            'bedrooms',
            'bathrooms',
            'property_type',
            'status',
            'is_verified',
            'images',
            'created_at',
        )
        read_only_fields = fields

