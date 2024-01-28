import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import datetime


def get_player_data(request):
    application_id = '586c12b8bcdeebae9fa17747f47d67ec'
    account_id = '1005419424'

    account_json = requests.get(f'https://api.worldofwarships.com/wows/account/info/?application_id={application_id}&account_id={account_id}&extra=statistics.oper_div%2C+statistics.oper_solo').json()

    ship_json = requests.get(f'https://api.worldofwarships.com/wows/ships/stats/?application_id={application_id}&account_id={account_id}&extra=oper_solo%2C+oper_div').json()

    account_data = account_json['data'][account_id] # Just for convenience and readability
    account_data['last_battle_time'] = datetime.datetime.fromtimestamp(account_data['last_battle_time'])
    account_data['updated_at'] = datetime.datetime.fromtimestamp(account_data['updated_at'])
    account_data['logout_at'] = datetime.datetime.fromtimestamp(account_data['logout_at'])

    # combine oper data for account_data
    account_stats = account_json['data'][account_id]['statistics']
    account_stats['oper'] = {"wins":-1,"losses":-1,"battles":-1,"survived_wins":-1,"xp":-1,"wins_by_tasks":{"0":-1,"1":-1,"2":-1,"3":-1,"4":-1,"5":-1},"survived_battles":-1}

    fill_oper_wins_by_tasks(account_stats)
    combine_oper_stats(account_stats)
    
    # combine oper data for ship_data
    ship_data = ship_json['data'][account_id]
    for ship in ship_data:
        ship['oper'] = {"wins":-1,"losses":-1,"battles":-1,"survived_wins":-1,"xp":-1,"wins_by_tasks":{"0":-1,"1":-1,"2":-1,"3":-1,"4":-1,"5":-1},"survived_battles":-1}
        fill_oper_wins_by_tasks(ship)
        combine_oper_stats(ship)
        
    
    context = {
        'account_data': account_data, 
        'ship_data': ship_data
    }
    template = loader.get_template('player_stats.html')
    return HttpResponse(template.render(context, request))


def combine_oper_stats(json):
    items = ['battles', 'wins', 'losses', 'survived_battles', 'survived_wins', 'xp']
    for i in items:
        json['oper'][i] = json['oper_solo'][i] + json['oper_div'][i]

    for i in range(6):
        json['oper']['wins_by_tasks'][f'{i}'] = json['oper_solo']['wins_by_tasks'][f'{i}'] + \
                                                json['oper_div']['wins_by_tasks'][f'{i}']


def fill_oper_wins_by_tasks(json):
    for i in range(6):
        if f'{i}' not in json['oper_div']['wins_by_tasks']:
            json['oper_div']['wins_by_tasks'][f'{i}'] = 0
        if f'{i}' not in json['oper_solo']['wins_by_tasks']:
            json['oper_solo']['wins_by_tasks'][f'{i}'] = 0