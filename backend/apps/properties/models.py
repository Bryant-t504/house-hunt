from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

class Property(models.Model):
    """
    Property Model for GridNest listings.
    """
    
    class PropertyType(models.TextChoices):
        APARTMENT = 'APARTMENT', 'Apartment'
        HOUSE = 'HOUSE', 'House'
        STUDIO = 'STUDIO', 'Studio'
        ROOM = 'ROOM', 'Single Room'

    class VerificationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'

    # The landlord who owns this listing (linked to our Custom User)
    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='properties'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Nairobi')
    
    # Use Decimal for money to avoid rounding errors
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    # Core listing details
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    amenities = models.JSONField(default=list, blank=True) # e.g. ["WiFi", "Parking"]
    
    property_type = models.CharField(
        max_length=20, 
        choices=PropertyType.choices, 
        default=PropertyType.APARTMENT
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )
    
    # upload_to creates a subfolder 'property_images' in our media folder
    image = models.ImageField(upload_to='property_images/', blank=True, null=True)
    
    is_available = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - ${self.price}"

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ['-created_at'] # Newest listings first
