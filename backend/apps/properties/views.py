from django.db.models import Q
from rest_framework import generics, permissions, status, filters
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Property
from .serializers import PropertySerializer, PropertyListSerializer


class IsLandlordOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission:
    - Read (GET/HEAD/OPTIONS): always allowed
    - Write: only the property's landlord or staff/admin
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.landlord == request.user or request.user.is_staff


import django_filters
from django_filters.rest_framework import DjangoFilterBackend

class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    min_bedrooms = django_filters.NumberFilter(field_name="bedrooms", lookup_expr='gte')
    search = django_filters.CharFilter(method='filter_search')
    amenity = django_filters.CharFilter(method='filter_amenity')
    city = django_filters.CharFilter(field_name="location", lookup_expr='icontains')

    class Meta:
        model = Property
        fields = ['property_type', 'status', 'is_verified', 'location']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) | 
            Q(description__icontains=value) | 
            Q(location__icontains=value)
        )

    def filter_amenity(self, queryset, name, value):
        return queryset.filter(amenities__name__iexact=value)


class PropertyListCreateView(generics.ListCreateAPIView):
    """
    GET  — List publicly visible properties (status=active, is_verified=True,
           landlord is verified). Authenticated users also see their own listings.
    POST — Create a new property (landlords only). Starts in status=pending.
    """
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at', 'bedrooms']
    ordering = ['-created_at']

    def get_serializer_class(self):
        # Use the lighter serializer for lists, full one for detail/create
        if self.request.method == 'GET':
            return PropertyListSerializer
        return PropertySerializer

    def get_queryset(self):
        user = self.request.user

        # A "public" listing: active status, admin-verified, landlord is verified
        public_filter = Q(
            status='active',
            is_verified=True,
            is_deleted=False,
            landlord__is_verified=True,
        )

        base_qs = Property.objects.select_related('landlord').prefetch_related(
            'amenities', 'images'
        )

        if user.is_authenticated:
            # Landlords also see their own pending/hidden listings
            own_filter = Q(landlord=user, is_deleted=False)
            return base_qs.filter(public_filter | own_filter).distinct()

        return base_qs.filter(public_filter)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user
        import logging
        logger = logging.getLogger('django')
        logger.error(f"DEBUG: User={user.username}, Role={user.role}")

        # Only landlords (and admins acting as landlords) may create listings
        # Using .lower() to handle any database inconsistencies
        if str(user.role).lower() not in ('landlord', 'admin', 'super_admin'):
            logger.error(f"DEBUG: Permission Denied for {user.username} with role {user.role}")
            raise PermissionDenied("Only landlords can create property listings.")
        
        # Landlord is auto-set; listing starts as 'pending' awaiting verification
        serializer.save(landlord=user, status='pending')


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    — Retrieve a single property.
    PATCH  — Landlord updates their own listing fields (not status/verification).
    DELETE — Soft-delete: sets is_deleted=True, never hard-deletes.
    """
    queryset = Property.objects.select_related('landlord').prefetch_related(
        'amenities', 'images'
    )
    serializer_class = PropertySerializer
    permission_classes = [IsLandlordOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        # Non-active / non-verified listings are private to the owner and staff
        is_public = obj.status == 'active' and obj.is_verified
        if not is_public and obj.landlord != user and not user.is_staff:
            raise PermissionDenied(
                "This listing is not yet public. Only the landlord or admin can view it."
            )
        return obj

    def perform_update(self, serializer):
        user = self.request.user
        if not (user.role == 'landlord' and user.is_verified) and not user.is_staff:
            raise PermissionDenied("Only verified landlords or admins can update listings.")
        serializer.save()

    def perform_destroy(self, instance):
        # Soft-delete — never hard-delete a property
        instance.is_deleted = True
        instance.save(update_fields=['is_deleted'])


# ─────────────────────────────────────────────────────────────
# ADMIN VIEWS
# ─────────────────────────────────────────────────────────────

class AdminPropertyListView(generics.ListAPIView):
    """
    Admin-only view: lists ALL properties including pending, hidden, and deleted.
    """
    queryset = Property.objects.select_related('landlord').order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'is_verified', 'is_deleted', 'property_type']
    search_fields = ['title', 'location', 'landlord__username']


class VerifyPropertyView(generics.UpdateAPIView):
    """
    Admin-only PATCH: transition a property's verification state.
    Valid status values: active, pending, hidden, occupied
    Also toggles is_verified accordingly.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        property_obj = self.get_object()
        new_status = request.data.get('status')
        valid_statuses = [s.value for s in Property.Status]

        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Choose from: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Flip is_verified based on admin decision
        is_verified = new_status == 'active'
        property_obj.status = new_status
        property_obj.is_verified = is_verified
        property_obj.save(update_fields=['status', 'is_verified'])

        return Response(PropertySerializer(property_obj).data)
