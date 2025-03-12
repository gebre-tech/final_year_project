#contacts/models.py
from django.db import models
from authentication.models import User

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contacts")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend_contacts")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.friend.username}"
