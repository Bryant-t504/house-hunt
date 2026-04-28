import os
import django

# Initialize Django before importing consumers or routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gridnest.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from apps.chat.middleware import JWTAuthMiddleware
import apps.chat.routing

application = ProtocolTypeRouter({
    # Standard HTTP requests
    "http": get_asgi_application(),
    
    # WebSocket requests
    "websocket": JWTAuthMiddleware(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns
        )
    ),
})
