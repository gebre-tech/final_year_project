"""
ASGI config for message project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.routing import websocket_urlpatterns  # Import your routing from the chat app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'message.settings')

# Define the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handles HTTP requests
    "websocket": AuthMiddlewareStack(  # WebSocket handling with authentication
        URLRouter(
            websocket_urlpatterns  # WebSocket URL routing
        )
    ),
})
