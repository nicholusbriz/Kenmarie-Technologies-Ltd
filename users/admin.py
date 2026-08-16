from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Avatar

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'github_username', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'github_username']
    
    fieldsets = UserAdmin.fieldsets + (
        ('GitHub Information', {
            'fields': ('github_username', 'github_avatar_url', 'github_url')
        }),
    )

@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = ['user', 'supabase_url', 'uploaded_at', 'updated_at']
    list_filter = ['uploaded_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['uploaded_at', 'updated_at']
