from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Custom User model for GridNest.

    Extends AbstractUser to add PropTech-specific fields.
    Role is intentionally excluded from user-editable fields and must
    be set only by admins or the system (e.g. during registration flow).
    """

    class Role(models.TextChoices):
        TENANT = 'tenant', 'Tenant'
        LANDLORD = 'landlord', 'Landlord'
        ADMIN = 'admin', 'Admin'
        SUPER_ADMIN = 'super_admin', 'Super Admin'

    # Override email to enforce uniqueness at the DB level
    email = models.EmailField(unique=True)

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?\d{7,15}$',
                message=(
                    "Enter a valid phone number (7–15 digits, "
                    "optional leading '+')."
                ),
            )
        ],
        help_text="International format preferred, e.g. +254712345678",
    )

    # Role is assigned by the system; never exposed in user-facing forms.
    # Serialisers must mark this field as read_only=True.
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.TENANT,
        db_index=True,
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Set True once identity/document verification passes.",
    )

    last_active = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp of the user's most recent activity.",
    )

    # Soft-delete — never hard-delete users; preserve audit trail.
    is_deleted = models.BooleanField(default=False, db_index=True)

    # AbstractUser already provides: username, first_name, last_name,
    # is_staff, is_active, date_joined, last_login.
    # We add our own granular timestamps below.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Require email for authentication; username remains as a unique handle.
    REQUIRED_FIELDS = ['email', 'role']

    def __str__(self) -> str:
        return f"{self.username} ({self.get_role_display()})"

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['role'], name='idx_user_role'),
            models.Index(fields=['email'], name='idx_user_email'),
            models.Index(fields=['is_deleted'], name='idx_user_is_deleted'),
        ]
