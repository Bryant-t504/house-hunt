from django.contrib import admin
from .models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'city', 'price', 'verification_status', 'is_available')
    list_filter = ('verification_status', 'is_available', 'city', 'property_type')
    search_fields = ('title', 'description', 'address', 'landlord__username')
    actions = ['approve_properties', 'reject_properties']

    def approve_properties(self, request, queryset):
        queryset.update(verification_status='VERIFIED')
    approve_properties.short_description = "Approve selected properties"

    def reject_properties(self, request, queryset):
        queryset.update(verification_status='REJECTED')
    reject_properties.short_description = "Reject selected properties"
