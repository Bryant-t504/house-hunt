from django.urls import path
from .views import PropertyListCreateView, PropertyDetailView

urlpatterns = [
    # List all and Create
    path('', PropertyListCreateView.as_view(), name='property_list_create'),
    
    # Detail, Update, and Delete
    path('<int:pk>/', PropertyDetailView.as_view(), name='property_detail'),
]
