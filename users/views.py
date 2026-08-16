from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

def login_view(request):
    """Login view - shows the login page"""
    return render(request, 'users/login.html')

@login_required
def logout_view(request):
    """Logout view"""
    logout(request)
    return redirect('/')

@login_required
def profile_view(request):
    """Profile view for logged in users"""
    return render(request, 'users/profile.html', {'user': request.user})
