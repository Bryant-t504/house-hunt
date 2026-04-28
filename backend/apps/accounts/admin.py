from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# We want the admin panel to show our custom fields (role, phone, etc.)
class CustomUserAdmin(UserAdmin):
    # Add our custom fields to the admin display list
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff')
    
    # Add filters so you can quickly find all "Landlords" or "Verified" users
    list_filter = ('role', 'is_verified', 'is_staff', 'is_superuser')
    
    # Allow editing these fields in the detail view
    fieldsets = UserAdmin.fieldsets + (
        ('GridNest Info', {'fields': ('role', 'phone_number', 'bio', 'is_verified')}),
    )
    
    # Allow adding these fields when creating a user in admin
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('GridNest Info', {'fields': ('role', 'phone_number', 'bio', 'is_verified')}),
    )

admin.site.register(User, CustomUserAdmin)
