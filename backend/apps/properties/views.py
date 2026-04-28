from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Property
from .serializers import PropertySerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a property to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the property.
        return obj.landlord == request.user

class PropertyListCreateView(generics.ListCreateAPIView):
    """
    View to list all properties or create a new one.
    """
    queryset = Property.objects.filter(is_available=True)
    serializer_class = PropertySerializer
    filterset_fields = ['city', 'property_type']
    search_fields = ['title', 'description', 'city', 'address']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only logged in users can create
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Security: Check if user is a Landlord before allowing create
        if self.request.user.role != 'LANDLORD':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only landlords can list properties.")
            
        # Automatically set the landlord to the current user
        serializer.save(landlord=self.request.user)

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to see, update or delete a specific property.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsOwnerOrReadOnly]
