import os
import requests
from supabase import create_client
from django.conf import settings

def get_supabase_client():
    """Get Supabase client using environment variables"""
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase credentials not found in environment variables")
    
    return create_client(supabase_url, supabase_key)

def upload_avatar_to_supabase(user, image_url):
    """Download and upload avatar to Supabase storage"""
    try:
        # Download the image from GitHub
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        # Generate a unique filename
        filename = f"avatar_{user.id}_{user.username}.png"
        bucket_name = os.getenv('SUPABASE_STORAGE_BUCKET', 'avatars')
        storage_path = f"users/{user.id}/{filename}"
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Delete existing file if it exists to avoid duplicate error
        try:
            supabase.storage.from_(bucket_name).remove([storage_path])
        except:
            # File doesn't exist, that's fine
            pass
        
        # Upload to Supabase storage
        supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=response.content,
            file_options={"content-type": "image/png"}
        )
        
        # Get the public URL
        public_url = f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{bucket_name}/{storage_path}"
        
        return {
            'path': storage_path,
            'url': public_url
        }
        
    except Exception as e:
        print(f"Error uploading avatar to Supabase: {e}")
        return None

def delete_avatar_from_supabase(storage_path):
    """Delete avatar from Supabase storage"""
    try:
        bucket_name = os.getenv('SUPABASE_STORAGE_BUCKET', 'avatars')
        supabase = get_supabase_client()
        
        supabase.storage.from_(bucket_name).remove([storage_path])
        return True
        
    except Exception as e:
        print(f"Error deleting avatar from Supabase: {e}")
        return False