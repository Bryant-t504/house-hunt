from django.db import models
from django.conf import settings

from apps.properties.models import Property


class Conversation(models.Model):
    """
    Groups all messages between a specific tenant and landlord
    about a specific property.

    Design notes:
    - The UNIQUE constraint on (property, tenant, landlord) guarantees
      exactly one chat thread per participant pair per listing.
      This prevents ghost threads and duplicate conversation records.
    - property uses SET_NULL so chat history is preserved if a listing
      is soft-deleted or permanently removed.
    - Soft-delete on Conversation allows archiving without data loss.
    """

    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='conversations',
        help_text="The property this conversation is anchored to.",
    )
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tenant_conversations',
    )
    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='landlord_conversations',
    )

    # Soft-delete — preserves message history when a conversation is closed.
    is_deleted = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        prop_title = self.property.title if self.property else "Deleted Property"
        return (
            f"Conv #{self.pk} | {self.tenant.username} ↔ "
            f"{self.landlord.username} | {prop_title}"
        )

    class Meta:
        db_table = 'conversations'
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-updated_at']
        # Core business constraint: one thread per (property, tenant, landlord).
        unique_together = ('property', 'tenant', 'landlord')
        indexes = [
            models.Index(fields=['tenant'], name='idx_conversation_tenant'),
            models.Index(fields=['landlord'], name='idx_conversation_landlord'),
            models.Index(fields=['property'], name='idx_conversation_property'),
        ]


class Message(models.Model):
    """
    An individual chat message within a Conversation.

    Design notes:
    - No `receiver` field. The recipient is always the other party
      in the Conversation (derived at read time). Storing receiver_id
      would be redundant and could drift out of sync.
    - Composite index on (conversation_id, created_at) optimises the
      most common query: "load messages for conversation X in order".
    - Soft-delete allows message moderation without data destruction.
    """

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
    )

    # NOTE: No receiver field — receiver is derived from the Conversation.

    content = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)

    # Soft-delete — allows message-level moderation by admins.
    is_deleted = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"Msg #{self.pk} | Conv #{self.conversation_id} | "
            f"from {self.sender.username}"
        )

    class Meta:
        db_table = 'messages'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['created_at']
        indexes = [
            # Composite index — powers ordered message list per conversation.
            models.Index(
                fields=['conversation', 'created_at'],
                name='idx_messages_convo_time',
            ),
            models.Index(fields=['sender'], name='idx_message_sender'),
            models.Index(fields=['is_read'], name='idx_message_is_read'),
        ]
