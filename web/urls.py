from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/', views.projects, name='projects'),
    path('deployments/', views.deployments, name='deployments'),
    path('settings/', views.settings, name='settings'),
    path('github/', views.github_integration, name='github'),
]
