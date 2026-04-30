from django.urls import path
from .views import (
    PropertyListCreateView, PropertyDetailView,
    AdminPropertyListView, VerifyPropertyView
)

urlpatterns = [
    # List all and Create
    path('', PropertyListCreateView.as_view(), name='property_list_create'),
    
    # Detail, Update, and Delete
    path('<int:pk>/', PropertyDetailView.as_view(), name='property_detail'),

    # Admin actions
    path('admin/list/', AdminPropertyListView.as_view(), name='admin_property_list'),
    path('admin/<int:pk>/verify/', VerifyPropertyView.as_view(), name='admin_property_verify'),
]
