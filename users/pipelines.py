from .models import Avatar
from .supabase_storage import upload_avatar_to_supabase

def save_github_user_data(backend, user, response, *args, **kwargs):
    """Custom pipeline to save GitHub user data and upload avatar to Supabase"""
    if backend.name == 'github':
        user.github_username = response.get('login')
        user.github_avatar_url = response.get('avatar_url')
        user.github_url = response.get('html_url')
        user.email = response.get('email') or user.email
        user.first_name = response.get('name', '').split()[0] if response.get('name') else ''
        user.last_name = ' '.join(response.get('name', '').split()[1:]) if response.get('name') and len(response.get('name', '').split()) > 1 else ''
        user.save()
        
        # Upload avatar to Supabase if user has an avatar
        avatar_url = response.get('avatar_url')
        if avatar_url:
            try:
                # Check if user already has an avatar
                avatar, created = Avatar.objects.get_or_create(user=user)
                
                # Upload new avatar to Supabase
                upload_result = upload_avatar_to_supabase(user, avatar_url)
                
                if upload_result:
                    # Update avatar record with Supabase info
                    avatar.supabase_path = upload_result['path']
                    avatar.supabase_url = upload_result['url']
                    avatar.save()
                    
            except Exception as e:
                print(f"Error in avatar pipeline: {e}")
                # Continue without failing the authentication process