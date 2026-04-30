import django_filters
from .models import Property
from django.db.models import Q

class PropertyFilter(django_filters.FilterSet):
    """
    Custom filter set for Property listings.
    Supports range filtering for price and bedrooms, and list filtering for amenities.
    """
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    min_bedrooms = django_filters.NumberFilter(field_name="bedrooms", lookup_expr='gte')
    city = django_filters.CharFilter(field_name="city", lookup_expr='iexact')
    amenity = django_filters.CharFilter(method='filter_amenity')

    class Meta:
        model = Property
        fields = ['property_type', 'city']

    def filter_amenity(self, queryset, name, value):
        """
        Filters the JSONField 'amenities' to see if it contains the specified value.
        """
        if not value:
            return queryset
        # SQLite does not support __contains on JSONField directly.
        # However, it stores JSON as a text blob, so __icontains works for simple lists.
        return queryset.filter(amenities__icontains=f'"{value}"')
