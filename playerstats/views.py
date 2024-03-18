import json
import os
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponse
from django.template import loader
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import datetime
import copy


def player_search(request):
    return render(request, 'player_search.html')


def private_profile(request):
    return render(request, 'private_profile.html')


@csrf_exempt
def search_players(request):
    if request.method == 'GET':
        search_query = request.GET.get('search', '')
        response = requests.get(
            f'https://api.worldofwarships.com/wows/account/list/',
            params={
                'application_id': settings.APPLICATION_ID,
                'search': search_query
            }
        )
        return JsonResponse(response.json())
    

def get_player_data(request, account_id):
    account_id = f'{account_id}'
    game_modes = ["pvp", "pve", "rank_solo"]
    
    # ---------------------------------------------------------------------------------
    # --------------------------- Get Account & Ship Stats ----------------------------
    # ---------------------------------------------------------------------------------
    
    account_extras = ["private.port", "statistics.clan", "statistics.club", "statistics.oper_div", "statistics.oper_solo", "statistics.pve", "statistics.pve_div2", "statistics.pve_div3", "statistics.pve_solo", "statistics.pvp_div2", "statistics.pvp_div3", "statistics.pvp_solo", "statistics.rank_div2", "statistics.rank_div3", "statistics.rank_solo"]
    
    account_json = requests.get(f'https://api.worldofwarships.com/wows/account/info/',
                                params={
                                    'application_id': settings.APPLICATION_ID,
                                    'account_id': account_id,
                                    'extra': ','.join(account_extras)
                                }).json()


    ship_json = requests.get(f'https://api.worldofwarships.com/wows/ships/stats/',
                            params={
                                'application_id': settings.APPLICATION_ID,
                                'account_id': account_id,
                                'extra': ','.join(["oper_div", "oper_solo", "pve", "rank_solo"])
                            }).json()
    
    account_data = account_json['data'][account_id]
    
    # Handle private accounts
    is_empty_account = not account_data
    is_private_account = account_data['hidden_profile']

    if is_empty_account or is_private_account:
        return redirect('private_profile')
    
    ship_data = ship_json['data'][account_id]
    
    # ---------------------------------------------------------------------------------
    # ----------------------------- Get Clan Battle Stats -----------------------------
    # ---------------------------------------------------------------------------------
    
    cw_seasons = {}
    clan_battle_file_path = os.path.join(settings.BASE_DIR, 'data', 'cw_seasons.json')
    
    # Try to load the ship encyclopedia from a file if it exists
    if os.path.exists(clan_battle_file_path):
        with open(clan_battle_file_path, 'r', encoding='utf-8') as file:
            cw_seasons = json.load(file)
    else:
        # If the file does not exist, fetch the data
        response = requests.get(f'https://api.worldofwarships.com/wows/clans/season/',
                                params={
                                    'application_id': settings.APPLICATION_ID
                                })
        if response.status_code == 200:
            cw_seasons = response.json()['data']
        else:
            print(f"Failed to retrieve data for Clan Battle Seasons")
            
        # Save the data to file
        with open(clan_battle_file_path, 'w') as file:
            json.dump(cw_seasons, file, indent=4, ensure_ascii=False)
    
    
    cw_stats = {}
    response = requests.get(f'https://api.worldofwarships.com/wows/clans/seasonstats/',
                            params={
                                'application_id': settings.APPLICATION_ID,
                                'account_id': account_id
                            })
    if response.status_code == 200:
        cw_stats = response.json()['data'][account_id]['seasons']
    else:
        print(f"Failed to retrieve data for Clan Battle Stats")
    
    
    # ---------------------------------------------------------------------------------
    # ----------------------------- Get Encyclopedia Info -----------------------------
    # ---------------------------------------------------------------------------------
    
    encyclopedia_info = requests.get(f'https://api.worldofwarships.com/wows/encyclopedia/info/',
                                        params={
                                            'application_id': settings.APPLICATION_ID
                                        }).json()


    # ---------------------------------------------------------------------------------
    # -------------------------- Get Ship Encyclopedia Data ---------------------------
    # ---------------------------------------------------------------------------------
    
    ship_ency_file_path = os.path.join(settings.BASE_DIR, 'data', 'ship_encyclopedia.json')
    old_ships_file_path = os.path.join(settings.BASE_DIR, 'data', 'ship_encyclopedia_old_ships.json')

    # Try to load the ship encyclopedia from a file if it exists
    if os.path.exists(ship_ency_file_path):
        with open(ship_ency_file_path, 'r', encoding='utf-8') as file:
            ship_encyclopedia = json.load(file)
    else:
        # If the file does not exist, fetch the data and save it to a file
        ship_encyclopedia = {}
        ship_types = ["AirCarrier", "Battleship", "Cruiser", "Destroyer", "Submarine"]
        nations = ["japan", "usa", "ussr", "germany", "uk", "france", "italy", "pan_asia", "europe", "netherlands", "pan_america", "spain", "commonwealth"]
        for nation in nations:
            for ship_type in ship_types:
                response = requests.get(f'https://api.worldofwarships.com/wows/encyclopedia/ships/',
                                        params={
                                            'application_id': settings.APPLICATION_ID,
                                            'nation': nation,
                                            'type': ship_type
                                        })
                if response.status_code == 200:
                    data = response.json()
                    ship_encyclopedia.update(data['data'])
                else:
                    print(f"Failed to retrieve data for {nation} {ship_type}")
        # Save the fetched data to a file
        with open(ship_ency_file_path, 'w') as file:
            json.dump(ship_encyclopedia, file, indent=4, ensure_ascii=False)
    
    if os.path.exists(old_ships_file_path):
        with open(old_ships_file_path, 'r') as file:
            old_ship_data = json.load(file)
        ship_encyclopedia.update(old_ship_data)
        
    
    # ---------------------------------------------------------------------------------
    # ----------------------------- Get Account Clan Tag ------------------------------
    # ---------------------------------------------------------------------------------
    
    account_clan = requests.get(f'https://api.worldofwarships.com/wows/clans/accountinfo/',
                                    params={
                                        'application_id': settings.APPLICATION_ID,
                                        'account_id': account_id,
                                        'extra': 'clan'
                                    }).json()


    # ---------------------------------------------------------------------------------
    # -------------------------------- Data Processing --------------------------------
    # ---------------------------------------------------------------------------------

    

    # adjust time to human readable time
    account_data['last_battle_time'] = datetime.datetime.fromtimestamp(account_data['last_battle_time'])
    account_data['updated_at'] = datetime.datetime.fromtimestamp(account_data['updated_at'])
    account_data['logout_at'] = datetime.datetime.fromtimestamp(account_data['logout_at'])

    
    # process account wide stats
    try:
        account_data['clan_tag'] = f"[{account_clan['data'][account_id]['clan']['tag']}] "
    except:
        account_data['clan_tag'] = ""
        
    for mode in game_modes:
        process_stats(account_data['statistics'], mode)

    process_stats(account_data['statistics'], 'clan')
    process_oper_stats(account_data['statistics'])


    # process individual ship stats
    for ship in ship_data:
        for mode in game_modes:
            process_stats(ship, mode)
        
        # operation stats
        process_oper_stats(ship)
        oper_battles = ship['oper']['battles']
        if oper_battles != 0:
            ship['oper']['avg_xp'] = '{:.2f}'.format(ship['oper']['xp'] / oper_battles)
    
    
    # process clan battle stats
    cw_stats_processed = process_cw_stats(cw_seasons, cw_stats)

    context = {
        'account_data': account_data, 
        'ship_data': ship_data,
        'cw_data': cw_stats_processed,
        'encyclopedia_info': encyclopedia_info['data'],
        'ship_encyclopedia': ship_encyclopedia
    }
    template = loader.get_template('player_stats.html')
    return HttpResponse(template.render(context, request))




def process_stats(json, mode):
    # Calculate Total Potential Damage
    json[mode]['total_agro'] = json[mode]['art_agro'] + json[mode]['torpedo_agro']

    # Calculate KD Ratio
    death = json[mode]['battles'] - json[mode]['survived_battles']
    if death == 0:
        death = 1
    json[mode]['kd'] = '{:.2f}'.format(json[mode]['frags'] / death)

    # Calculate AVG Stats
    battles = json[mode]['battles']
    if battles != 0:
        json[mode]['avg_damage_dealt'] = '{:.2f}'.format(json[mode]['damage_dealt'] / battles)
        json[mode]['avg_xp'] = '{:.2f}'.format(json[mode]['xp'] / battles)
        json[mode]['avg_frags'] = '{:.2f}'.format(json[mode]['frags'] / battles)
        json[mode]['avg_planes_killed'] = '{:.2f}'.format(json[mode]['planes_killed'] / battles)
        json[mode]['avg_agro'] = '{:.2f}'.format(json[mode]['total_agro'] / battles)
        json[mode]['avg_ships_spotted'] = '{:.2f}'.format(json[mode]['ships_spotted'] / battles)
        json[mode]['avg_damage_scouting'] = '{:.2f}'.format(json[mode]['damage_scouting'] / battles)
        json[mode]['win_rate'] = '{:.2%}'.format(json[mode]['wins'] / battles)
    
    # Calculate Hit Ratio
    weapon_types = ['main_battery','second_battery','torpedoes']
    for weapon in weapon_types:
        weapon_stats = json[mode][weapon]
        shots = weapon_stats['shots']
        if shots == 0:
            shots = 1
        weapon_stats['hit_ratio'] = '{:.2%}'.format(weapon_stats['hits'] / shots)
        

def process_oper_stats(json):
    # Fill in Missing wins_by_tasks Data
    for i in range(6):
        if f'{i}' not in json['oper_div']['wins_by_tasks']:
            json['oper_div']['wins_by_tasks'][f'{i}'] = 0
        if f'{i}' not in json['oper_solo']['wins_by_tasks']:
            json['oper_solo']['wins_by_tasks'][f'{i}'] = 0
    
    # Calculate Overall Stats
    json['oper'] = {"wins":-1,"losses":-1,"battles":-1,"survived_wins":-1,"xp":-1,"wins_by_tasks":{"0":-1,"1":-1,"2":-1,"3":-1,"4":-1,"5":-1},"survived_battles":-1}

    items = ['battles', 'wins', 'losses', 'survived_battles', 'survived_wins', 'xp']
    for i in items:
        json['oper'][i] = json['oper_solo'][i] + json['oper_div'][i]

    for i in range(6):
        json['oper']['wins_by_tasks'][f'{i}'] = json['oper_solo']['wins_by_tasks'][f'{i}'] + \
                                                json['oper_div']['wins_by_tasks'][f'{i}']

    # Calculate Win Rate
    battles = json['oper']['battles']
    if battles != 0:
        json['oper']['win_rate'] = '{:.2%}'.format(json['oper']['wins'] / battles)
    

def process_cw_stats(cw_seasons, cw_stats):
    processed = {}
    for season in cw_seasons:
        processed[season] = {}
        processed[season]['season_id'] = cw_seasons[season]['season_id']
        processed[season]['name'] = cw_seasons[season]['name']
        
        max_tier = cw_seasons[season]['ship_tier_max']
        min_tier = cw_seasons[season]['ship_tier_min']
        if max_tier == min_tier:
            processed[season]['tier'] = max_tier
        else:
            processed[season]['tier'] = f'{min_tier}-{max_tier}'
            
        processed[season]['start_time'] = datetime.datetime.fromtimestamp(cw_seasons[season]['start_time'])
        processed[season]['finish_time'] = datetime.datetime.fromtimestamp(cw_seasons[season]['finish_time'])
        
    for entry in cw_stats:
        seasonID = entry['season_id']
        processed[f'{seasonID}']['stats'] = copy.deepcopy(entry)
        
    return processed
