from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('player_stats/', views.get_player_data, name='player_stats'),
    # include other paths as needed
]
