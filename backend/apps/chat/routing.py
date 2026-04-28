from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Room name can be a conversation ID or a combined user ID string
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
