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
    except Exception as e:
        print(f"[get_user] Error decoding token: {e}")
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Middleware to handle JWT authentication for WebSockets.
    Expects token as a query parameter: ws://localhost:8000/ws/chat/?token=abc
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Try to get token from Query String (more robust fallback)
        query_string = scope.get('query_string', b'').decode()
        if 'token=' in query_string:
            from urllib.parse import parse_qs
            token = parse_qs(query_string).get('token', [None])[0]
            print(f"[ChatAuth] Found token in query string")
        
        # Fallback to protocols if query string is empty
        if not token:
            headers = dict(scope.get('headers', []))
            protocol_header = headers.get(b'sec-websocket-protocol', b'').decode()
            protocols = [p.strip() for p in protocol_header.split(',') if p.strip()]
            
            try:
                if 'access_token' in protocols:
                    token_index = protocols.index('access_token') + 1
                    if token_index < len(protocols):
                        token = protocols[token_index]
                        print(f"[ChatAuth] Found token in protocols")
            except (ValueError, IndexError):
                print(f"[ChatAuth] Malformed protocol header")
                pass

        if token:
            user = await get_user(token)
            scope['user'] = user
            if user.is_anonymous:
                print(f"[ChatAuth] Connection rejected: Invalid or expired token")
            else:
                print(f"[ChatAuth] User authenticated: {user.username} (ID: {user.id})")
        else:
            print(f"[ChatAuth] Connection rejected: No 'access_token' found in protocols")
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)
