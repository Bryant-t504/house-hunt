from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Translates User data into JSON for the frontend.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'bio', 'is_verified', 'is_staff')
        read_only_fields = ('role', 'is_verified', 'is_staff') # Users can't make themselves admins!

class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles new user registration.
    Includes validation for passwords and prevents privilege escalation.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'phone_number', 'role')

    def validate(self, attrs):
        # Security Check: Ensure passwords match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        # Ensure email is unique
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
            
        # Security: Prevent unauthorized role assignment (only Tenant or Landlord allowed)
        role = attrs.get('role', 'TENANT')
        if role not in [User.Role.TENANT, User.Role.LANDLORD]:
            attrs['role'] = User.Role.TENANT # Force to Tenant if invalid/Admin

        return attrs

    def create(self, validated_data):
        # Remove the password_confirm field
        validated_data.pop('password_confirm')
        
        # Use the provided role, default to TENANT
        role = validated_data.get('role', User.Role.TENANT)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            phone_number=validated_data.get('phone_number', '')
        )
        return user
