from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    """
    Custom User Model for GridNest.
    Extends the default Django User to include roles and contact info.
    """
    
    # We define the roles as choices to keep the database clean
    class Role(models.TextChoices):
        TENANT = 'TENANT', 'Tenant'
        LANDLORD = 'LANDLORD', 'Landlord'
        ADMIN = 'ADMIN', 'Admin'

    # The 'role' field determines what the user can do on the platform
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.TENANT
    )
    
    email = models.EmailField(unique=True)
    
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\d{10,15}$',
                message="Phone number must be between 10 and 15 digits and contain only numbers."
            )
        ]
    )
    bio = models.TextField(max_length=500, blank=True)
    
    # For security: Landlords must be verified by an admin before their listings go live
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
