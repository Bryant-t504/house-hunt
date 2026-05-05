from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class Amenity(models.Model):
    """
    Lookup table for property amenities (e.g. WiFi, Parking, Pool).
    Managed by admins; referenced via PropertyAmenity through-model.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        db_table = 'amenities'
        verbose_name = 'Amenity'
        verbose_name_plural = 'Amenities'
        ordering = ['name']


class Property(models.Model):
    """
    A rental listing created and managed by a landlord.

    Lifecycle is controlled via `status`; `is_available` has been removed
    in favour of the explicit status enum as per the schema design.
    """

    class PropertyType(models.TextChoices):
        APARTMENT = 'apartment', 'Apartment'
        HOUSE = 'house', 'House'
        STUDIO = 'studio', 'Studio'
        ROOM = 'room', 'Single Room'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'       # Listed and visible to tenants
        HIDDEN = 'hidden', 'Hidden'       # Temporarily unlisted by landlord
        PENDING = 'pending', 'Pending'    # Awaiting admin verification
        OCCUPIED = 'occupied', 'Occupied' # Currently rented out

    # ------------------------------------------------------------------ #
    # Ownership
    # ------------------------------------------------------------------ #
    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='properties',
        help_text="The landlord who owns this listing.",
    )

    # ------------------------------------------------------------------ #
    # Core fields
    # ------------------------------------------------------------------ #
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255, db_index=True)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        db_index=True,
    )

    bedrooms = models.PositiveSmallIntegerField(default=1)
    bathrooms = models.PositiveSmallIntegerField(default=1)

    property_type = models.CharField(
        max_length=20,
        choices=PropertyType.choices,
        default=PropertyType.APARTMENT,
    )

    # ------------------------------------------------------------------ #
    # Lifecycle / visibility
    # ------------------------------------------------------------------ #
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Flipped to True after admin approves via VerificationLog.",
    )

    # Soft-delete — hides the listing without destroying relational data.
    is_deleted = models.BooleanField(default=False, db_index=True)

    # ------------------------------------------------------------------ #
    # Many-to-many amenities via through model
    # ------------------------------------------------------------------ #
    amenities = models.ManyToManyField(
        Amenity,
        through='PropertyAmenity',
        related_name='properties',
        blank=True,
    )

    # ------------------------------------------------------------------ #
    # Timestamps
    # ------------------------------------------------------------------ #
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.get_status_display()}) — {self.location}"

    class Meta:
        db_table = 'properties'
        verbose_name = 'Property'
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['location'], name='idx_property_location'),
            models.Index(fields=['price'], name='idx_property_price'),
            models.Index(fields=['status', 'is_deleted'], name='idx_property_status_deleted'),
            models.Index(fields=['landlord'], name='idx_property_landlord'),
        ]


class PropertyImage(models.Model):
    """
    One-to-many image gallery for a property listing.
    Images are soft-linked via URL (stored in object storage).
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
    )
    image_url = models.ImageField(
        upload_to='property_images/',
        max_length=500,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Image for {self.property.title} ({self.pk})"

    class Meta:
        db_table = 'property_images'
        verbose_name = 'Property Image'
        verbose_name_plural = 'Property Images'
        ordering = ['created_at']


class PropertyAmenity(models.Model):
    """
    Explicit through-model for the Property ↔ Amenity many-to-many.

    Using an explicit through-model (rather than implicit) allows future
    fields to be added (e.g. notes, order) without a schema overhaul.
    Composite PK enforced via unique_together.
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='property_amenities',
    )
    amenity = models.ForeignKey(
        Amenity,
        on_delete=models.CASCADE,
        related_name='amenity_properties',
    )

    def __str__(self) -> str:
        return f"{self.property.title} → {self.amenity.name}"

    class Meta:
        db_table = 'property_amenities'
        verbose_name = 'Property Amenity'
        verbose_name_plural = 'Property Amenities'
        unique_together = ('property', 'amenity')
        indexes = [
            models.Index(fields=['amenity'], name='idx_property_amenity_amenity'),
        ]
