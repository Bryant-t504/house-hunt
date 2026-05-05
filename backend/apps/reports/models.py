from django.db import models
from django.conf import settings

from apps.properties.models import Property


class Report(models.Model):
    """
    A user-submitted report flagging a property for admin review.

    Lifecycle: PENDING → REVIEWED → RESOLVED
    `admin_response` is populated by the reviewing admin and is
    visible to the reporter after the report is resolved.
    `resolved_at` is set when status transitions to RESOLVED.
    """

    class Type(models.TextChoices):
        FRAUD = 'fraud', 'Fraud'
        SPAM = 'spam', 'Spam'
        MISLEADING = 'misleading', 'Misleading Information'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        REVIEWED = 'reviewed', 'Reviewed'
        RESOLVED = 'resolved', 'Resolved'

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports',
        help_text="The user who submitted this report.",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='reports',
        help_text="The property being reported.",
    )

    # ------------------------------------------------------------------ #
    # Report details
    # ------------------------------------------------------------------ #
    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.OTHER,
        db_index=True,
    )
    reason = models.TextField(
        help_text="Detailed explanation from the reporter.",
    )

    # ------------------------------------------------------------------ #
    # Admin moderation
    # ------------------------------------------------------------------ #
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    admin_response = models.TextField(
        blank=True,
        help_text="Admin's official response or action note.",
    )

    # ------------------------------------------------------------------ #
    # Timestamps
    # ------------------------------------------------------------------ #
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Set when status transitions to RESOLVED.",
    )

    def __str__(self) -> str:
        return (
            f"Report #{self.pk} [{self.get_type_display()}] "
            f"by {self.reporter.username} — {self.get_status_display()}"
        )

    class Meta:
        db_table = 'reports'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status'], name='idx_report_status'),
            models.Index(fields=['type'], name='idx_report_type'),
            models.Index(fields=['reporter'], name='idx_report_reporter'),
            models.Index(fields=['property'], name='idx_report_property'),
        ]
