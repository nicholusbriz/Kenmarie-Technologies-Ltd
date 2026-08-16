from django.shortcuts import render

def index(request):
    return render(request, 'web/index.html')

def projects(request):
    return render(request, 'web/projects.html')

def deployments(request):
    return render(request, 'web/deployments.html')

def settings(request):
    return render(request, 'web/settings.html')

def github_integration(request):
    return render(request, 'web/github.html')

