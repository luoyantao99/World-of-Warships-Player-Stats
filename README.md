#  World of Warships Player Stats

## 🛠️ Features
This web application serves as a comprehensive platform for players of "World of Warships" to search and view detailed statistics about their accounts and individual ship performances. It features two main functionalities:

1. Player Search: Users can search for player accounts using a search query. This sends a request to the "World of Warships" API to retrieve a list of matching player accounts. When a specific player account is searched, it fetches detailed statistics about the player's performance, including battles played, victories, defeats, and other relevant data for different game modes (Random, Co-op, Ranked, and Operation). 

2. Statistics Visualization: The application dynamically generates detailed statistics for both the account and individual ships selected. It processes data fetched from the "World of Warships" API, including player stats and individual ship stats. This also includes displaying calculated statistics such as kill/death ratios, average experience per battle, hit ratios, and more. The data is then presented in a user-friendly interface, offering insights into performance metrics across different game modes. 

The web app leverages Django's web development framework for the backend, utilizing views to handle API requests and responses effectively. It also integrates front-end technologies for dynamic content rendering, including HTML, CSS, and JavaScript, to provide an interactive and responsive user experience. 

## 💻 Demo
https://youtu.be/gcNY6zv0LZM