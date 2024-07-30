from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.player_search, name='player_search'),
    path('player_stats/<int:account_id>/', views.player_stats, name='player_stats'),
    path('player_stats/<int:account_id>/private/', views.private_profile, name='private_profile'),
    path('player_stats/<int:account_id>/<str:game_mode>/', views.player_stats, name='player_stats_with_mode'),
    path('search_players/', views.search_players, name='search_players'),
    path('login/redirect/', views.login_redirect, name='login_redirect'),
    path('login/response/', views.login_response, name='login_response'),
]
