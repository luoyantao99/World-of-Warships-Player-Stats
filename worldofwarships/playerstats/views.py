import requests
from django.shortcuts import render
from django.http import HttpResponse

def get_player_data(request):
    return HttpResponse("Hello world!")

    if request.method == 'GET' and 'username' in request.GET:
        application_id = '586c12b8bcdeebae9fa17747f47d67ec'
        account_id = '1005419424'
        username = request.GET['username']
        response = requests.get(f'https://api.worldofwarships.com/wows/account/info/?application_id={application_id}&account_id={account_id}&extra=statistics.oper_solo')
        data = response.json()
        return render(data, 'player_stats.html', {'data': data})
    else:
        return render(request, 'player_stats.html')
