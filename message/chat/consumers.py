import json
from django.contrib.auth.models import User
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage, ChatRoom

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.chat_group_name = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = self.scope["user"]
        chat = ChatRoom.objects.get(id=self.chat_id)
        
        # Message content or seen status
        if "message" in data:
            message = ChatMessage.objects.create(sender=sender, chat=chat, content=data["message"])
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "chat.message",
                    "message_id": message.id,
                    "content": message.content,
                    "sender": sender.username,
                    "seen": False,
                }
            )
        elif "seen" in data:
            message = ChatMessage.objects.get(id=data["message_id"])
            message.seen_by.add(sender)
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "chat.message.seen",
                    "message_id": message.id,
                    "seen": True,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def chat_message_seen(self, event):
        await self.send(text_data=json.dumps(event))
class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.chat_group_name = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = self.scope["user"]
        chat = ChatRoom.objects.get(id=self.chat_id)

        if "message" in data:
            message = ChatMessage.objects.create(sender=sender, chat=chat, content=data["message"])
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "chat.message",
                    "message_id": message.id,
                    "content": message.content,
                    "sender": sender.username,
                    "seen": False,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))