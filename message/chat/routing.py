from django.urls import re_path
from .consumers import ChatConsumer, GroupChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<chat_id>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/group-chat/(?P<chat_id>\w+)/$', GroupChatConsumer.as_asgi()),
]