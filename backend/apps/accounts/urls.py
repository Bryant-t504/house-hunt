from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView, UserProfileView, 
    AdminLandlordListView, VerifyLandlordView
)

urlpatterns = [
    # Login: Returns Access and Refresh tokens
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Refresh Token: Keeps the user logged in
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registration
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Profile (View/Update)
    path('profile/', UserProfileView.as_view(), name='user_profile'),

    # Admin actions
    path('admin/landlords/', AdminLandlordListView.as_view(), name='admin_landlords'),
    path('admin/landlords/<int:pk>/verify/', VerifyLandlordView.as_view(), name='admin_verify'),
]
