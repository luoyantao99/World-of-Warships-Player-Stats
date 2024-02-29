#  World of Warships Player Stats
This web application serves as a comprehensive platform for players of "World of Warships" to search and view detailed statistics about their accounts and individual ship performances. 

## 🛠️ Features
1. Player Search: Users can search for player accounts using a search query. This sends a request to the "World of Warships" API to retrieve a list of matching player accounts. When a specific player account is searched, it fetches detailed statistics about the player's performance, including battles played, victories, defeats, and other relevant data for different game modes (Random, Co-op, Ranked, and Operation). 

2. Statistics Visualization: The application dynamically generates detailed statistics for both the account and individual ships selected. It processes data fetched from the "World of Warships" API, including player stats and individual ship stats. This also includes displaying calculated statistics such as kill/death ratios, average experience per battle, hit ratios, and more. The data is then presented in a user-friendly interface, offering insights into performance metrics across different game modes. 

The web app leverages Django's web development framework for the backend, utilizing views to handle API requests and responses effectively. It also integrates front-end technologies for dynamic content rendering, including HTML, CSS, and JavaScript, to provide an interactive and responsive user experience. 

## 💻 Demo
https://youtu.be/gcNY6zv0LZM


## 📄 Documentation
### Prerequisites
1. Python (3.8 or newer)
2. Django (3.2 or newer)

### Installation
1. Clone the repository<br>
> First, clone this repository to your local machine using Git:
``` bash
git clone https://github.com/luoyantao99/World-of-Warships-Player-Stats.git
```

2. Install dependencies<br>
> Install the required Python packages:
``` bash
pip install -r requirements.txt
```

3. Configure the application<br>
> Open the view.py file in the playerstats directory and replace APPLICATION_ID with your actual World of Warships application ID:
``` bash
APPLICATION_ID = 'your_application_id_here'
```

4. Run the development server<br>
> Start the Django development server:
``` bash
python manage.py runserver
```
> You should see output indicating the server is running, usually on http://127.0.0.1:8000/player_stats/.

5. Access the application<br>
> Open a web browser and go to http://127.0.0.1:8000/player_stats/ to view the application. You should see the main interface where you can start searching for players and viewing stats.
