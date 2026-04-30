from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser

User = get_user_model()

@database_sync_to_async
def get_user(token):
    """
    Decodes the JWT token and returns the corresponding User.
    """
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Middleware to handle JWT authentication for WebSockets.
    Expects token as a query parameter: ws://localhost:8000/ws/chat/?token=abc
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Security Hardening: Move token from query string to Subprotocols
        # This prevents the JWT from being logged in plain text by web servers/proxies
        protocols = dict(scope.get('headers', [])).get(b'sec-websocket-protocol', b'').decode().split(', ')
        token = None
        
        # We expect protocol format: ['access_token', '<jwt_value>']
        if 'access_token' in protocols:
            token_index = protocols.index('access_token') + 1
            if token_index < len(protocols):
                token = protocols[token_index]

        if token:
            scope['user'] = await get_user(token)
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)
