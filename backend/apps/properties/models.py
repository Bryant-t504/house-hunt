from django.db import models
from django.conf import settings

class Property(models.Model):
    """
    Property Model for GridNest listings.
    """
    
    class PropertyType(models.TextChoices):
        APARTMENT = 'APARTMENT', 'Apartment'
        HOUSE = 'HOUSE', 'House'
        STUDIO = 'STUDIO', 'Studio'
        ROOM = 'ROOM', 'Single Room'

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
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    property_type = models.CharField(
        max_length=20, 
        choices=PropertyType.choices, 
        default=PropertyType.APARTMENT
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
