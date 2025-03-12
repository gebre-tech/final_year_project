from rest_framework import serializers
from .models import Chat
from .models import ChatMessage  # Ensure this import is present

from authentication.serializers import UserSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'name', 'members', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'chat', 'content', 'attachment', 'timestamp', 'seen_by']






class ChatSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = Chat
        fields = ['id', 'sender', 'receiver', 'message', 'attachment', 'is_read', 'timestamp']

    def create(self, validated_data):
        # This is where you can handle message creation
        chat = Chat.objects.create(**validated_data)
        return chat
