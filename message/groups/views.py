from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Group, GroupMessage
from .serializers import GroupSerializer, GroupMessageSerializer
from authentication.models import User
from rest_framework.permissions import IsAuthenticated

class CreateGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_name = request.data.get("name")
        members_ids = request.data.get("members", [])

        admin = request.user
        members = User.objects.filter(id__in=members_ids)

        group = Group.objects.create(name=group_name, admin=admin)
        group.members.set(members)
        group.save()

        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SendGroupMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_id = request.data.get("group_id")
        message = request.data.get("message")
        attachment = request.data.get("attachment", None)

        group = Group.objects.get(id=group_id)
        if group.admin != request.user:
            return Response({"error": "Only admins can send messages"}, status=status.HTTP_403_FORBIDDEN)

        group_message = GroupMessage.objects.create(
            group=group,
            sender=request.user,
            message=message,
            attachment=attachment
        )

        serializer = GroupMessageSerializer(group_message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GetGroupMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = Group.objects.get(id=group_id)
        messages = GroupMessage.objects.filter(group=group)
        serializer = GroupMessageSerializer(messages, many=True)
        return Response(serializer.data)

class AddMemberToGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id, user_id):
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)

        if group.admin != request.user:
            return Response({"error": "Only admins can add members"}, status=status.HTTP_403_FORBIDDEN)

        group.members.add(user)
        group.save()

        return Response({"status": "User added to group"}, status=status.HTTP_200_OK)

class RemoveMemberFromGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id, user_id):
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)

        if group.admin != request.user:
            return Response({"error": "Only admins can remove members"}, status=status.HTTP_403_FORBIDDEN)

        group.members.remove(user)
        group.save()

        return Response({"status": "User removed from group"}, status=status.HTTP_200_OK)
