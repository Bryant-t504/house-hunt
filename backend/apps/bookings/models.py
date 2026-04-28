from django.db import models
from django.conf import settings
from apps.properties.models import Property

class Booking(models.Model):
    """
    Model to handle viewing requests.
    """
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        COMPLETED = 'COMPLETED', 'Completed'

    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='bookings'
    )
    
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='my_bookings'
    )
    
    preferred_date = models.DateTimeField()
    message = models.TextField(blank=True, help_text="Any special requests?")
    
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking by {self.tenant.username} for {self.property.title}"

    class Meta:
        ordering = ['-preferred_date']
