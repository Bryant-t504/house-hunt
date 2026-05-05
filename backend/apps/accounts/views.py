from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()

class LogoutView(APIView):
    """
    API endpoint that allows users to log out by blacklisting their refresh token.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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
    queryset = User.objects.filter(role='landlord')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class VerifyLandlordView(generics.UpdateAPIView):
    """
    Allows Admins to verify a landlord.
    """
    queryset = User.objects.filter(role='landlord')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
            
        user = self.get_object()
        user.is_verified = not user.is_verified # Toggle verification
        user.save()
        return Response(UserSerializer(user).data)
