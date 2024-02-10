from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('player_stats/', views.get_player_data, name='player_stats'),
    path('player_stats/<int:account_id>/', views.get_player_data, name='player_stats'),
    path('search_players/', views.search_players, name='search_players'),
]
