#contacts/serializers.py
from rest_framework import serializers
from .models import Contact
from authentication.serializers import UserSerializer

class ContactSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    friend = UserSerializer(read_only=True)
    friend_id = serializers.IntegerField(source='friend.id', read_only=True)

    class Meta:
        model = Contact
        fields = ['user', 'friend', 'friend_id', 'created_at']

