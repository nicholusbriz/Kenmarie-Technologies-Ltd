from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    github_username = models.CharField(max_length=255, blank=True, null=True)
    github_avatar_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    
    @property
    def display_avatar_url(self):
        """Get the best available avatar URL"""
        if hasattr(self, 'avatar') and self.avatar and self.avatar.supabase_url:
            return self.avatar.supabase_url
        return self.github_avatar_url
    
    def __str__(self):
        return self.username

class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='avatar')
    supabase_path = models.CharField(max_length=500, blank=True, null=True)
    supabase_url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Avatar for {self.user.username}"
