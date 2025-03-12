#contacts/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer
from authentication.models import User
from rest_framework.permissions import IsAuthenticated

class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')

        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user == friend:
            return Response({"error": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

        if Contact.objects.filter(user=request.user, friend=friend).exists():
            return Response({"error": "Already friends"}, status=status.HTTP_400_BAD_REQUEST)

        contact = Contact.objects.create(user=request.user, friend=friend)
        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)

class GetContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contacts = Contact.objects.filter(user=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
