import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import datetime


def get_player_data(request):
    application_id = '586c12b8bcdeebae9fa17747f47d67ec'
    account_id = '1005419424'
    response = requests.get(f'https://api.worldofwarships.com/wows/account/info/?application_id={application_id}&account_id={account_id}&extra=statistics.oper_div%2C+statistics.oper_solo')
    data = response.json()

    account_data = data['data'][account_id] # Just for convenience and readability
    account_data['last_battle_time'] = datetime.datetime.fromtimestamp(account_data['last_battle_time'])
    account_data['updated_at'] = datetime.datetime.fromtimestamp(account_data['updated_at'])
    account_data['logout_at'] = datetime.datetime.fromtimestamp(account_data['logout_at'])


    account_stats = data['data'][account_id]['statistics']
    account_stats['oper'] = {"wins":-1,"losses":-1,"battles":-1,"survived_wins":-1,"xp":-1,"wins_by_tasks":{"0":-1,"1":-1,"2":-1,"3":-1,"4":-1,"5":-1},"survived_battles":-1}

    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'battles')
    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'wins')
    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'losses')
    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'survived_battles')
    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'survived_wins')
    combine_oper(account_stats['oper'], account_stats['oper_solo'], account_stats['oper_div'], 'xp')

    try: account_stats['oper_div']['wins_by_tasks']['0']
    except: account_stats['oper_div']['wins_by_tasks']['0'] = 0
    try: account_stats['oper_div']['wins_by_tasks']['1']
    except: account_stats['oper_div']['wins_by_tasks']['1'] = 0

    for i in range(6):
        combine_oper(account_stats['oper']['wins_by_tasks'], account_stats['oper_solo']['wins_by_tasks'], account_stats['oper_div']['wins_by_tasks'], f'{i}')

    
    context = {'data': data}
    template = loader.get_template('player_stats.html')
    return HttpResponse(template.render(context, request))


def combine_oper(oper, oper_solo, oper_div, field):
    oper[field] = oper_solo[field] + oper_div[field]