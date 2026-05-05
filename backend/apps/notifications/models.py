from django.db import models
from django.conf import settings


class Notification(models.Model):
    """
    System-generated alerts delivered to a specific user.

    Optional FKs (booking, conversation, property) provide contextual
    deep-links so the frontend can navigate the user directly to the
    relevant entity. All three are nullable — not every notification
    is tied to a specific entity.

    `type` acts as a routing hint for the frontend notification centre.
    """

    class Type(models.TextChoices):
        BOOKING = 'booking', 'Booking'
        MESSAGE = 'message', 'Message'
        VERIFICATION = 'verification', 'Verification'
        SYSTEM = 'system', 'System'

    # ------------------------------------------------------------------ #
    # Recipient
    # ------------------------------------------------------------------ #
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user this notification is addressed to.",
    )

    # ------------------------------------------------------------------ #
    # Content
    # ------------------------------------------------------------------ #
    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.SYSTEM,
        db_index=True,
    )
    message = models.TextField(
        help_text="Human-readable notification body shown in the UI.",
    )

    # ------------------------------------------------------------------ #
    # Optional contextual FK links (all nullable)
    # ------------------------------------------------------------------ #
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        help_text="Set when this notification relates to a booking event.",
    )
    conversation = models.ForeignKey(
        'chat.Conversation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        help_text="Set when this notification relates to a chat message.",
    )
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        help_text="Set when this notification relates to a property event.",
    )

    # ------------------------------------------------------------------ #
    # State
    # ------------------------------------------------------------------ #
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"Notification #{self.pk} [{self.get_type_display()}] "
            f"→ {self.user.username}"
        )

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read'], name='idx_notification_user_read'),
            models.Index(fields=['type'], name='idx_notification_type'),
            models.Index(fields=['created_at'], name='idx_notification_created_at'),
        ]
