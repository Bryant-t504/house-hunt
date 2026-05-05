from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Connect to a specific conversation by its integer ID.
    # Format: ws/chat/conv/<conversation_id>/
    re_path(
        r'^ws/chat/conv/(?P<conversation_id>\d+)/$',
        consumers.ChatConsumer.as_asgi(),
    ),
]
