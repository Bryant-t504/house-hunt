from django.urls import path
from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    MessageListView,
    SendMessageView,
)

urlpatterns = [
    # Conversation management
    path('conversations/', ConversationListView.as_view(), name='conversation_list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation_detail'),
    path('conversations/create/', ConversationCreateView.as_view(), name='conversation_create'),
    
    # Message management within a specific conversation
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message_list'),
    path('conversations/<int:conversation_id>/messages/send/', SendMessageView.as_view(), name='send_message'),
]
