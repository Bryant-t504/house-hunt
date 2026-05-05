from django.db import models
from django.conf import settings

import builtins

from apps.properties.models import Property


class Booking(models.Model):
    """
    A tenant's request to view or rent a property.

    Design notes:
    - `landlord` is intentionally excluded — derive it from
      `booking.property.landlord` to avoid denormalization and the
      risk of landlord mismatch if property ownership changes.
    - Soft-delete is used to preserve audit history.
    """

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text="The property this booking is for.",
    )

    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tenant_bookings',
        help_text="The tenant who made this booking request.",
    )

    # NOTE: Do NOT add landlord_id here.
    # Use booking.property.landlord to derive the landlord at query time.
    # This prevents data inconsistency if a property is transferred.

    # ------------------------------------------------------------------ #
    # Booking details
    # ------------------------------------------------------------------ #
    booking_date = models.DateTimeField(
        help_text="Proposed date/time for property viewing or tenancy start.",
    )
    message = models.TextField(
        blank=True,
        help_text="Optional message or special request from the tenant.",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    # Soft-delete — cancelled/rejected bookings are never hard-deleted.
    is_deleted = models.BooleanField(default=False, db_index=True)

    # ------------------------------------------------------------------ #
    # Timestamps
    # ------------------------------------------------------------------ #
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return (
            f"Booking #{self.pk} | {self.tenant.username} → "
            f"{self.property.title} [{self.get_status_display()}]"
        )

    @builtins.property
    def landlord(self):
        """Convenience accessor — always derive from property."""
        return self.property.landlord

    class Meta:
        db_table = 'bookings'
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-booking_date']
        indexes = [
            models.Index(fields=['property'], name='idx_booking_property'),
            models.Index(fields=['tenant'], name='idx_booking_tenant'),
            models.Index(fields=['status'], name='idx_booking_status'),
            models.Index(fields=['is_deleted'], name='idx_booking_is_deleted'),
        ]
