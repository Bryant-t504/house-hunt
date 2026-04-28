from django.urls import path
from .views import BookingListCreateView, BookingUpdateView

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking_list_create'),
    path('<int:pk>/', BookingUpdateView.as_view(), name='booking_update'),
]
