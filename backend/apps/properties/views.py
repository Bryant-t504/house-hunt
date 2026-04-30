from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Property
from .serializers import PropertySerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a property to edit it.
    Admins are also allowed to edit/delete for moderation.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are allowed to owner or staff
        return obj.landlord == request.user or request.user.is_staff

from .filters import PropertyFilter

class PropertyListCreateView(generics.ListCreateAPIView):
    """
    View to list all properties or create a new one.
    """
    serializer_class = PropertySerializer
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'city', 'address']
    
    def get_queryset(self):
        user = self.request.user
        from django.db.models import Q
        
        # Public listings must be available AND the property verified AND landlord verified
        public_filter = Q(is_available=True, verification_status='VERIFIED', landlord__is_verified=True)

        if user.is_authenticated:
            # Authenticated users see verified public listings OR their own listings
            return Property.objects.select_related('landlord').filter(public_filter | Q(landlord=user))
        
        # Unauthenticated users only see verified public listings
        return Property.objects.select_related('landlord').filter(public_filter)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Security: Only landlords (or admins) can create listings
        if self.request.user.role not in ['LANDLORD', 'ADMIN']:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only landlords can list properties.")
            
        # Automatically set the landlord to the current user
        # Note: Listing starts with verification_status='PENDING' by default
        serializer.save(landlord=self.request.user)

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to see, update or delete a specific property.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        
        # Security: If property is not verified, only the landlord or admin can see it
        if obj.verification_status != 'VERIFIED' and obj.landlord != user and not user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("This listing is pending verification and is not yet public.")
            
        return obj

    def perform_update(self, serializer):
        # Security: Re-verify landlord status on every update
        if not (self.request.user.role == 'LANDLORD' and self.request.user.is_verified) and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only verified landlords can update listings.")
        serializer.save()

# --- ADMIN ONLY VIEWS ---

class AdminPropertyListView(generics.ListAPIView):
    """
    Allows Admins to see ALL properties for verification/moderation.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAdminUser]

class VerifyPropertyView(generics.UpdateAPIView):
    """
    Allows Admins to change the verification status of a property.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            from rest_framework.response import Response
            return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        property_obj = self.get_object()
        new_status = request.data.get('verification_status')
        
        if new_status in ['VERIFIED', 'REJECTED', 'PENDING']:
            property_obj.verification_status = new_status
            property_obj.save()
            return Response(PropertySerializer(property_obj).data)
        
        return Response(
            {"detail": "Invalid status."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
