#  World of Warships Player Stats
![Build Status](https://github.com/luoyantao99/World-of-Warships-Player-Stats/actions/workflows/django.yml/badge.svg)

This web application serves as a comprehensive platform for players of "World of Warships" to search and view detailed statistics about their accounts and individual ship performances. Unique to this application is the inclusion of detailed statistics for the often overlooked Operation game mode, filling a gap left by the official player profile. Additionally, Clan Battle statistics are shown for entertainment purposes. 

Access my website with this URL: http://wows-stats.duckdns.org

## 🛠️ Features
1. Player Search: Users can search for player accounts using a search query. This sends a request to the "World of Warships" API to retrieve a list of matching player accounts. When a specific player account is selected, it fetches detailed statistics about the player's performance, including battles played, victories, defeats, and other relevant data for different game modes (Random, Co-op, Ranked, and Operation). 

2. Statistics Visualization: The application dynamically generates detailed statistics for both the account and individual ships selected. It processes data fetched from Wargaming's API, including player stats and individual ship stats. This also includes displaying calculated statistics such as KD ratios, average experience per battle, hit ratios, and more. The data is then presented in a user-friendly interface, offering insights into performance metrics across different game modes. 

3. Clan Battle Statistics: Clan Battle and Clan Brawl statistics are displayed for each season. However, these stats are not intended to be taken seriously as individual player performance is not the primary focus; the key to success lies in the performance of the clan as a whole. 

4. Login Option: Players with private profiles can log in with their Wargaming account to view their own stats, even when others cannot. Players with public profiles can view additional stats after logging in, such as overall battle lifetime, credits, gold, free experience, number of port slots, and ships in port. 

5. Multi-threading for API Calls: To enhance performance and reduce latency, the application employs multi-threading for retrieving API calls, ensuring that data is fetched and displayed efficiently. 

The web app leverages Django's web development framework for the backend, utilizing views to handle API requests and responses effectively. It also integrates front-end technologies for dynamic content rendering, including HTML, CSS, and JavaScript, to provide an interactive and responsive user experience. 

## 📺 Video Demo
https://youtu.be/gcNY6zv0LZM

## 📄 To Do List
* Automated testing
* Intuitive UI for mobile devices
* Make player search work for other servers (EU, Asia)

## 📚 Documentation
### Prerequisites
1. Python (3.8 or newer)
2. Django (3.2 or newer)

### Installation
**1. Clone the repository**<br>
> First, clone this repository to your local machine using Git:
``` bash
git clone https://github.com/luoyantao99/World-of-Warships-Player-Stats.git
```

**2. Install dependencies**<br>
> Install the required Python packages:
``` bash
pip install -r requirements.txt
```

**3. Set up environment variables**<br>
> You need to register an application on https://developers.wargaming.net/. Once registered, the application is assigned with an application_id. The application_id is used as a key to identify your application when calling the API. In the same directory as ```settings.py```, create a file called ```.env```. Declare your environment variables in ```.env``` like this:
``` bash
APPLICATION_ID=your_application_id_here
```

**4. Run the development server**<br>
> Start the Django development server:
``` bash
python manage.py runserver
```
> You should see output indicating the server is running, usually on http://127.0.0.1:8000/.

**5. Access the application**<br>
> Open a web browser and go to http://127.0.0.1:8000/ to view the application. You should see the main interface where you can start searching for players and viewing stats.
