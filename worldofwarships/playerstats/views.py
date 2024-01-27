import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

import datetime
import pytz
from django.utils import timezone


def get_player_data(request):
    application_id = '586c12b8bcdeebae9fa17747f47d67ec'
    account_id = '1005419424'
    response = requests.get(f'https://api.worldofwarships.com/wows/account/info/?application_id={application_id}&account_id={account_id}&extra=statistics.oper_div%2C+statistics.oper_solo')
    data = response.json()

    data['data'][account_id]['last_battle_time'] = \
    datetime.datetime.fromtimestamp(data['data'][account_id]['last_battle_time'])
    data['data'][account_id]['updated_at'] = \
    datetime.datetime.fromtimestamp(data['data'][account_id]['updated_at'])
    data['data'][account_id]['logout_at'] = \
    datetime.datetime.fromtimestamp(data['data'][account_id]['logout_at'])
    
    context = {'data': data}
    
    template = loader.get_template('player_stats.html')
    return HttpResponse(template.render(context, request))

