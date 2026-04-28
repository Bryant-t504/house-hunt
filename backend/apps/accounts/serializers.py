from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Translates User data into JSON for the frontend.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'bio', 'is_verified', 'is_staff')
        read_only_fields = ('is_verified', 'is_staff') # Users can't make themselves admins!

class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles new user registration.
    Includes validation for passwords.
    """
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'role', 'phone_number')

    def validate(self, attrs):
        # Security Check: Ensure passwords match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        # Remove the password_confirm field before saving to the database
        validated_data.pop('password_confirm')
        
        # We use create_user (not create) to ensure the password is encrypted!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.TENANT),
            phone_number=validated_data.get('phone_number', '')
        )
        return user
