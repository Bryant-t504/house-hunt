from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows users to register.
    Anyone can access this (AllowAny).
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint that allows users to view or edit their profile.
    Only logged-in users can access this.
    """
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # We return the user that is currently making the request
        return self.request.user

# --- ADMIN ONLY VIEWS ---

class AdminLandlordListView(generics.ListAPIView):
    """
    Allows Admins to see all landlords for verification.
    """
    queryset = User.objects.filter(role='LANDLORD')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class VerifyLandlordView(generics.UpdateAPIView):
    """
    Allows Admins to verify a landlord.
    """
    queryset = User.objects.filter(role='LANDLORD')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_verified = not user.is_verified # Toggle verification
        user.save()
        return Response(UserSerializer(user).data)
