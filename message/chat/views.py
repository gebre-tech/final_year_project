#chat/views.py
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .models import ChatMessage, ChatRoom
from .serializers import ChatMessageSerializer, ChatRoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

# Send a message in a direct chat
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get("receiver_id")
        message = request.data.get("message")
        attachment = request.data.get("attachment", None)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=status.HTTP_404_NOT_FOUND)
        
        sender = request.user
        
        # Create a message for the chat (assuming a direct message)
        chat_message = ChatMessage.objects.create(
            sender=sender,
            chat=receiver,  # For direct chat, treat the receiver as a 'chat'
            content=message,
            attachment=attachment
        )

        # Serialize the message and return the response
        serializer = ChatMessageSerializer(chat_message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Get all messages between the authenticated user and another user
class GetMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # Get messages between the authenticated user and another user
        messages = ChatMessage.objects.filter(
            chat__members=request.user
        ).filter(
            sender_id=user_id
        ) | ChatMessage.objects.filter(
            chat__members=user_id
        ).filter(
            sender=request.user
        )

        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

# Mark a message as read
class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            # Ensure the user is a member of the chat
            if not message.chat.members.filter(id=request.user.id).exists():
                return Response({"error": "You cannot mark this message as read."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark the message as read by adding the user to the 'seen_by' field
            message.seen_by.add(request.user)
            message.save()

            return Response({"status": "Message marked as read"}, status=status.HTTP_200_OK)
        except ChatMessage.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)

# Upload a file as an attachment to a message
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_attachment(request, chat_id):
    file = request.FILES.get("file")
    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    file_name = default_storage.save(f"chat_attachments/{file.name}", ContentFile(file.read()))
    file_url = default_storage.url(file_name)

    return Response({"file_url": file_url})

# Create a new group chat
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group_chat(request):
    name = request.data.get("name")
    member_ids = request.data.get("members", [])
    members = User.objects.filter(id__in=member_ids)

    if not name or not members.exists():
        return Response({"error": "Group name and at least one member are required"}, status=400)

    # Create the group chat
    chat_room = ChatRoom.objects.create(name=name)
    chat_room.members.set(members)
    chat_room.members.add(request.user)  # Add creator to group
    chat_room.save()

    # Optionally, create an initial message announcing the creation of the group
    group_message = ChatMessage.objects.create(
        sender=request.user,
        chat=chat_room,
        content=f"Group '{name}' created."
    )

    # Return the created group chat data
    return Response(ChatRoomSerializer(chat_room).data)
