#authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):  
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)  # Customizing username, if needed
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.email

    
