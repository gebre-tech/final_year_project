#contacts/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer
from authentication.models import User
from authentication.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

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
        paginator = PageNumberPagination()
        paginated_contacts = paginator.paginate_queryset(contacts, request)
        serializer = ContactSerializer(paginated_contacts, many=True)
        return paginator.get_paginated_response(serializer.data)

class SearchContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('query', '')
        contacts = Contact.objects.filter(user=request.user, friend__username__icontains=query)
        paginator = PageNumberPagination()
        paginated_contacts = paginator.paginate_queryset(contacts, request)
        serializer = ContactSerializer(paginated_contacts, many=True)
        return paginator.get_paginated_response(serializer.data)

class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('query', '')
        if not query:
            return Response({"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains(query))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
