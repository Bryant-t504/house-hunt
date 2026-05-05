from django.db import models
from django.conf import settings

from apps.properties.models import Property


class VerificationLog(models.Model):
    """
    Immutable audit record of an admin action on a property verification request.

    Design notes:
    - Records are append-only; they must NEVER be updated or deleted.
      Each verification decision (approve / reject) creates a new row.
    - `admin` FK uses PROTECT to prevent accidental deletion of an admin
      account that has active verification records — preserving the audit trail.
    - `property` FK uses CASCADE because if a property is hard-deleted
      (edge case), its verification logs are no longer meaningful.
      For soft-deleted properties, the property row is retained so FKs stay valid.
    - `reason` captures the admin's justification, required for accountability.
    """

    class Action(models.TextChoices):
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,   # Prevent deletion of admin with existing logs
        related_name='verification_logs',
        help_text="The admin/super_admin who performed this action.",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='verification_logs',
        help_text="The property that was reviewed.",
    )

    # ------------------------------------------------------------------ #
    # Decision
    # ------------------------------------------------------------------ #
    action = models.CharField(
        max_length=20,
        choices=Action.choices,
        db_index=True,
        help_text="The verification decision taken by the admin.",
    )
    reason = models.TextField(
        blank=True,
        help_text=(
            "Mandatory justification for rejections; "
            "optional notes for approvals."
        ),
    )

    # ------------------------------------------------------------------ #
    # Timestamp — immutable, set once on creation
    # ------------------------------------------------------------------ #
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"VerificationLog #{self.pk} | {self.property.title} "
            f"→ {self.get_action_display()} by {self.admin.username}"
        )

    class Meta:
        db_table = 'verification_logs'
        verbose_name = 'Verification Log'
        verbose_name_plural = 'Verification Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['property'], name='idx_verlog_property'),
            models.Index(fields=['admin'], name='idx_verlog_admin'),
            models.Index(fields=['action'], name='idx_verlog_action'),
        ]
