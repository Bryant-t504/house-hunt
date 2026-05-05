from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer, BookingUpdateSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    """
    View to list bookings or create a new one.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_qs = Booking.objects.select_related(
            'property__landlord', 'tenant'
        ).filter(is_deleted=False)

        if user.is_staff:
            return base_qs
        # Landlords see bookings on their listings; tenants see their own.
        if user.role == 'landlord':
            return base_qs.filter(property__landlord=user)
        return base_qs.filter(tenant=user)

    def perform_create(self, serializer):
        # Automatically set the tenant to the logged-in user
        serializer.save(tenant=self.request.user)

class BookingUpdateView(generics.UpdateAPIView):
    """
    View for Landlords (or Staff) to Approve/Reject a booking.
    """
    serializer_class = BookingUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        from django.db.models import Q
        base_qs = Booking.objects.select_related(
            'property__landlord', 'tenant'
        ).filter(is_deleted=False)

        if user.is_staff:
            return base_qs
        # Landlords manage bookings on their properties; tenants cancel their own.
        return base_qs.filter(Q(property__landlord=user) | Q(tenant=user))

    def patch(self, request, *args, **kwargs):
        user = request.user
        booking = self.get_object()
        new_status = request.data.get('status')

        # Security: enforce role-based status transition rules.

        # 1. Tenants can ONLY cancel their own bookings
        if user.role == 'tenant' and not user.is_staff:
            if new_status != Booking.Status.CANCELLED:
                return Response(
                    {"detail": "Tenants can only cancel their own bookings."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if booking.tenant != user:
                return Response(
                    {"detail": "You can only cancel your own bookings."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # 2. Landlords can approve, reject, or mark completed
        if user.role == 'landlord' and not user.is_staff:
            if new_status not in (
                Booking.Status.APPROVED,
                Booking.Status.REJECTED,
                Booking.Status.COMPLETED,
            ):
                return Response(
                    {"detail": "Landlords can approve, reject, or complete bookings."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if booking.property.landlord != user:
                return Response(
                    {"detail": "You can only manage bookings for your own properties."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().patch(request, *args, **kwargs)
