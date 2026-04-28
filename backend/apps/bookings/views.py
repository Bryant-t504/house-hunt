from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    """
    View to list bookings or create a new one.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
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
    View for Landlords to Approve/Reject a booking.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Landlords can only update bookings for their own properties
        return Booking.objects.filter(property__landlord=self.request.user)

    def patch(self, request, *args, **kwargs):
        # Custom logic: Only landlords can change the status
        if request.user.role != 'LANDLORD':
            return Response(
                {"detail": "Only landlords can update booking status."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().patch(request, *args, **kwargs)
