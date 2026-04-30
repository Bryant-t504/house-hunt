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
        if user.is_staff:
            return Booking.objects.all()
        # Logic: If you are a tenant, see what you booked.
        # If you are a landlord, see who booked your properties.
        if user.role == 'LANDLORD':
            return Booking.objects.filter(property__landlord=user)
        return Booking.objects.filter(tenant=user)

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
        if user.is_staff:
            return Booking.objects.all()
        # Landlords can update bookings for their properties
        # Tenants can update (cancel) their own bookings
        from django.db.models import Q
        return Booking.objects.filter(Q(property__landlord=user) | Q(tenant=user))

    def patch(self, request, *args, **kwargs):
        user = request.user
        booking = self.get_object()
        new_status = request.data.get('status')

        # Security Logic:
        # 1. Tenants can ONLY set status to CANCELLED
        if user.role == 'TENANT' and not user.is_staff:
            if new_status != 'CANCELLED':
                return Response(
                    {"detail": "Tenants can only cancel their bookings."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if booking.tenant != user:
                return Response(
                    {"detail": "You can only cancel your own bookings."}, 
                    status=status.HTTP_403_FORBIDDEN
                )

        # 2. Landlords can set status to APPROVED or REJECTED
        if user.role == 'LANDLORD' and not user.is_staff:
            if new_status not in ['APPROVED', 'REJECTED']:
                return Response(
                    {"detail": "Landlords can only approve or reject bookings."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if booking.property.landlord != user:
                return Response(
                    {"detail": "You can only manage bookings for your own properties."}, 
                    status=status.HTTP_403_FORBIDDEN
                )

        return super().patch(request, *args, **kwargs)
