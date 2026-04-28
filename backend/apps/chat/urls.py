from django.urls import path
from .views import ChatHistoryView, SendMessageView, ConversationListView

urlpatterns = [
    # List of all people I'm chatting with
    path('conversations/', ConversationListView.as_view(), name='conversation_list'),
    
    # Message history with a specific person
    path('history/<int:other_user_id>/', ChatHistoryView.as_view(), name='chat_history'),
    
    # Send a new message
    path('send/', SendMessageView.as_view(), name='send_message'),
]
