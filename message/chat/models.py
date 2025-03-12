from django.db import models

from django.conf import settings  # Import settings

class Chat(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_chats')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_chats')
    message = models.TextField(default='No message')  # Provide default value
    attachment = models.FileField(upload_to="chat_attachments/", blank=True, null=True)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.timestamp}"
class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="chat_rooms")
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    chat = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="chat_attachments/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    seen_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="seen_messages", blank=True)

    def is_seen(self):
        return self.seen_by.count() > 1  # If at least one other user saw it
