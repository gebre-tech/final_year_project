#profile serializer
# #profiles/serializers.py
from rest_framework import serializers
from .models import Profile
from authentication.serializers import UserSerializer

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'profile_picture', 'last_seen']
