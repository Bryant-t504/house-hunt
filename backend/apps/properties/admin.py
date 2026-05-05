from django.contrib import admin
from .models import Property, PropertyImage, Amenity, PropertyAmenity

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAmenityInline(admin.TabularInline):
    model = PropertyAmenity
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'location', 'price', 'status', 'is_verified', 'is_deleted')
    list_filter = ('status', 'is_verified', 'is_deleted', 'property_type')
    search_fields = ('title', 'description', 'location', 'landlord__username')
    inlines = [PropertyImageInline, PropertyAmenityInline]
    actions = ['approve_properties', 'reject_properties']

    def approve_properties(self, request, queryset):
        queryset.update(status='active', is_verified=True)
    approve_properties.short_description = "Approve & verify selected properties"

    def reject_properties(self, request, queryset):
        queryset.update(status='hidden', is_verified=False)
    reject_properties.short_description = "Reject selected properties"

admin.site.register(Amenity)
