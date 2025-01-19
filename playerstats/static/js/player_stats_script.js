const nf = new Intl.NumberFormat('en-US');
const nf0d = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const nf2d = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const gameModeMapping = {
    "Random Battles": "pvp",
    "Co-op Battles": "pve",
    "Operations": "oper",
    "Ranked Battles": "rank_solo",
    "Ranked Battles (Legacy)": "rank_old",
    "Clan Battles": "clan"
};

const tier = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
    6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "★"
};

var accountData = JSON.parse(document.getElementById('account_data').textContent);
var shipData = JSON.parse(document.getElementById('ship_data').textContent);
var cwData = JSON.parse(document.getElementById('cw_data').textContent);
var shipEncy = JSON.parse(document.getElementById('ship_encyclopedia').textContent);


// ---------------------------------------------------------------------------------
// ------------------------- Account Stats Table Structure -------------------------
// ---------------------------------------------------------------------------------

const account_table_titles = [
    { label: 'Battle Statistics', key: '' },
    { label: 'Total Score', key: '' },
    { label: 'Average Score per Battle', key: '' },
    { label: 'Most per Battle', key: '' }
];

const account_table_columns = {
    'Battle Statistics': [
        { label: 'Win Rate', key: 'win_rate' },
        { label: 'Battles Played', key: 'battles' },
        { label: 'br', key: '' },
        { label: 'Victories', key: 'wins' },
        { label: 'Defeats', key: 'losses' },
        { label: 'Draws', key: 'draws' },
        { label: 'br', key: '' },
        { label: 'K/D Ratio', key: 'kd' },
        { label: 'Battles Survived', key: 'survived_battles' }
    ],
    'Total Score': [
        { label: 'Warships Destroyed', key: 'frags' },
        { label: 'Aircraft Destroyed', key: 'planes_killed' },
        { label: 'br', key: '' },
        { label: 'Damage', key: 'damage_dealt' },
        { label: 'Potential Damage', key: 'total_agro' },
        { label: 'Base XP', key: 'xp' },
        { label: 'br', key: '' },
        { label: 'Ships Spotted', key: 'ships_spotted' },
        { label: 'Spotting Damage', key: 'damage_scouting' }
    ],
    'Average Score per Battle': [
        { label: 'Warships Destroyed', key: 'avg_frags' },
        { label: 'Aircraft Destroyed', key: 'avg_planes_killed' },
        { label: 'br', key: '' },
        { label: 'Damage', key: 'avg_damage_dealt' },
        { label: 'Potential Damage', key: 'avg_agro' },
        { label: 'Base XP', key: 'avg_xp' },
        { label: 'br', key: '' },
        { label: 'Ships Spotted', key: 'avg_ships_spotted' },
        { label: 'Spotting Damage', key: 'avg_damage_scouting' }
    ],
    'Most per Battle': [
        { label: 'Warships Destroyed', key: 'max_frags_battle' },
        { label: 'Aircraft Destroyed', key: 'max_planes_killed' },
        { label: 'br', key: '' },
        { label: 'Damage', key: 'max_damage_dealt' },
        { label: 'Potential Damage', key: 'max_total_agro' },
        { label: 'Base XP', key: 'max_xp' },
        { label: 'br', key: '' },
        { label: 'Ships Spotted', key: 'max_ships_spotted' },
        { label: 'Spotting Damage', key: 'max_damage_scouting' }
    ]
};


// ---------------------------------------------------------------------------------
// ------------------------- Weapon Stats Table Structure --------------------------
// ---------------------------------------------------------------------------------

const weapons_table_titles = [
    { label: 'Main Battery', key: 'main_battery' },
    { label: 'Secondary Battery', key: 'second_battery' },
    { label: 'Torpedoes', key: 'torpedoes' },
    { label: 'Aircraft', key: 'aircraft' },
    { label: 'Ramming', key: 'ramming' }
];

const weapons_table_columns = {
    'Main Battery': [
        { label: 'Total Frags', key: 'frags' },
        { label: 'br', key: '' },
        { label: 'Max Frags', key: 'max_frags_battle' },
        { label: 'Ship Name', key: 'max_frags_ship_id' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Hit Ratio', key: 'hit_ratio' },
        { label: 'Shots Fired', key: 'shots' }
    ],
    'Secondary Battery': [
        { label: 'Total Frags', key: 'frags' },
        { label: 'br', key: '' },
        { label: 'Max Frags', key: 'max_frags_battle' },
        { label: 'Ship Name', key: 'max_frags_ship_id' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Hit Ratio', key: 'hit_ratio' },
        { label: 'Shots Fired', key: 'shots' }

    ],
    'Torpedoes': [
        { label: 'Total Frags', key: 'frags' },
        { label: 'br', key: '' },
        { label: 'Max Frags', key: 'max_frags_battle' },
        { label: 'Ship Name', key: 'max_frags_ship_id' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Hit Ratio', key: 'hit_ratio' },
        { label: 'Shots Fired', key: 'shots' }
    ],
    'Aircraft': [
        { label: 'Total Frags', key: 'frags' },
        { label: 'br', key: '' },
        { label: 'Max Frags', key: 'max_frags_battle' },
        { label: 'Ship Name', key: 'max_frags_ship_id' },
    ],
    'Ramming': [
        { label: 'Total Frags', key: 'frags' },
        { label: 'br', key: '' },
        { label: 'Max Frags', key: 'max_frags_battle' },
        { label: 'Ship Name', key: 'max_frags_ship_id' },
    ]
};


// ---------------------------------------------------------------------------------
// ------------------------- Operation Table Structure --------------------------
// ---------------------------------------------------------------------------------

const oper_table_titles = [
    { label: 'Operations', key: 'oper' },
    { label: 'Operations (Random)', key: 'oper_solo' },
    { label: 'Operations (Division)', key: 'oper_div' }
];

const oper_table_columns = {
    'Operations': [
        { label: 'Battles Played', key: 'battles' },
        { label: 'Victories', key: 'wins' },
        { label: 'Defeats', key: 'losses' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Wins (0 Star)', key: '0' },
        { label: 'Wins (1 Star)', key: '1' },
        { label: 'Wins (2 Stars)', key: '2' },
        { label: 'Wins (3 Stars)', key: '3' },
        { label: 'Wins (4 Stars)', key: '4' },
        { label: 'Wins (5 Stars)', key: '5' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Base XP', key: 'xp' }
    ],
    'Operations (Random)': [
        { label: 'Battles Played', key: 'battles' },
        { label: 'Victories', key: 'wins' },
        { label: 'Defeats', key: 'losses' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Wins (0 Star)', key: '0' },
        { label: 'Wins (1 Star)', key: '1' },
        { label: 'Wins (2 Stars)', key: '2' },
        { label: 'Wins (3 Stars)', key: '3' },
        { label: 'Wins (4 Stars)', key: '4' },
        { label: 'Wins (5 Stars)', key: '5' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Base XP', key: 'xp' }
    ],
    'Operations (Division)': [
        { label: 'Battles Played', key: 'battles' },
        { label: 'Victories', key: 'wins' },
        { label: 'Defeats', key: 'losses' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Wins (0 Star)', key: '0' },
        { label: 'Wins (1 Star)', key: '1' },
        { label: 'Wins (2 Stars)', key: '2' },
        { label: 'Wins (3 Stars)', key: '3' },
        { label: 'Wins (4 Stars)', key: '4' },
        { label: 'Wins (5 Stars)', key: '5' },
        { label: 'br', key: '' },
        { label: 'br', key: '' },
        { label: 'Base XP', key: 'xp' }
    ]
};


// ---------------------------------------------------------------------------------
// -------------------------------- Dropdown Menu ----------------------------------
// ---------------------------------------------------------------------------------

function selectDropdownOption(element) {
    const gameModeText = element.textContent.trim();
    const gameModeImage = document.getElementById('gameModeImage');
    const gameModeTextSpan = document.getElementById('gameModeText');
    currentGameMode = gameModeMapping[gameModeText];

    // Update dropdown button text and image
    gameModeTextSpan.textContent = gameModeText;
    gameModeImage.src = `${staticUrl}images/game_modes/${currentGameMode}.png`;

    // Update the URL to reflect the selected game mode
    const newURL = `/player_stats/${accountIdURL}/${currentGameMode}/`;
    history.pushState(null, '', newURL);

    show_player_stats();
    populate_ship_list();
}


// ---------------------- Dropdown Menu Click Event Listener ----------------------

// Toggle dropdown
document.addEventListener('click', function (event) {
    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownButton.contains(event.target)) {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    } else {
        // Hide dropdown if click outside
        if (!dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    }
});

// Hide the selection when an option is selected
document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelector('.dropdown-content').style.display = 'none';
    });
});

// Preselect dropdown option based on the current game mode
document.addEventListener("DOMContentLoaded", () => {
    const gameModeText = Object.keys(gameModeMapping).find(key => gameModeMapping[key] === currentGameMode);

    if (gameModeText) {
        const dropdownItems = document.querySelectorAll('.dropdown-content a');
        dropdownItems.forEach(item => {
            if (item.textContent.trim() === gameModeText) {
                selectDropdownOption(item);
            }
        });
    }
});


// ---------------------------------------------------------------------------------
// ------------------------------- Show Player Stats -------------------------------
// ---------------------------------------------------------------------------------

function show_player_stats() {
    // Hide all tables
    var tables = document.getElementsByClassName('table-container');
    for (var i = 0; i < tables.length; i++) {
        tables[i].style.display = 'none';
    }

    // Show the selected table
    var selectedTable = document.getElementById(currentGameMode);
    if (currentGameMode != 'oper') {
        selectedTable = document.getElementById('non_oper');
        build_player_stats(account_table_titles, account_table_columns, 'account');
        build_player_stats(weapons_table_titles, weapons_table_columns, 'weapon');
    }
    else {
        build_player_stats(oper_table_titles, oper_table_columns, 'oper');
    }
    if (selectedTable) {
        selectedTable.style.display = 'block';
    }
}


// ---------------------------------------------------------------------------------
// ------------------------------ Build Player Stats -------------------------------
// ---------------------------------------------------------------------------------

function build_player_stats(table_titles, table_columns, table_type) {
    var tableClass = '.' + table_type + '-stats-table'
    // Empty pre existing table if any
    const container = document.querySelector(tableClass);
    container.innerHTML = '';

    // Create the container for the stats
    const stats_container = document.createElement('div');
    stats_container.className = 'stats-container';

    // Build stats table
    build_stats_table(table_titles, table_columns, stats_container, accountData['statistics'])

    // Append the stats container to the desired location in the DOM
    document.querySelector(tableClass).appendChild(stats_container);
}


// ---------------------------------------------------------------------------------
// ------------------------------- Build Stats Table -------------------------------
// --------------------- (Used by Player Stats and Ship Stats) ---------------------
// ---------------------------------------------------------------------------------

function build_stats_table(table_titles, table_columns, stats_container, jsonData, isShip = false) {
    table_titles.forEach(title => {
        const column = document.createElement('div');
        column.className = 'stat-column';

        const columnTitle = document.createElement('div');
        columnTitle.className = 'column-title';
        columnTitle.textContent = title.label;
        column.appendChild(columnTitle);

        table_columns[title.label].forEach(stat => {
            if (stat.label != 'br') {
                const statRow = document.createElement('div');
                statRow.className = 'stat-row';

                const statLabel = document.createElement('div');
                statLabel.className = 'stat-label';
                statLabel.textContent = stat.label;
                statRow.appendChild(statLabel);

                const statValue = document.createElement('div');
                statValue.className = 'stat-value';
                // operation battles
                if (currentGameMode === 'oper') {
                    if (stat.label.includes("Star")) {
                        statValue.textContent = nf.format(jsonData[title.key]['wins_by_tasks'][stat.key]);
                    }
                    else {
                        statValue.textContent = nf.format(jsonData[title.key][stat.key]);
                    }
                }
                // non operation game mode
                else {
                    if (title.key) {
                        // weapon stats table
                        if (stat.label === 'Hit Ratio') {
                            statValue.textContent = jsonData[currentGameMode][title.key][stat.key];
                        }
                        else if (stat.label === 'Ship Name') {
                            var shipId = jsonData[currentGameMode][title.key][stat.key];
                            try {
                                shipId = shipEncy[shipId]['name'];
                            }
                            catch {
                            }
                            statValue.textContent = shipId;
                        }
                        else {
                            statValue.textContent = nf.format(jsonData[currentGameMode][title.key][stat.key]);
                        }
                    }
                    else {
                        // account & ship stats table
                        if (title.label.includes("Average") || stat.label === 'K/D Ratio') {
                            statValue.textContent = nf2d.format(jsonData[currentGameMode][stat.key]);
                        }
                        else if (stat.label === 'Win Rate') {
                            statValue.textContent = jsonData[currentGameMode][stat.key];
                        }
                        else {
                            statValue.textContent = nf.format(jsonData[currentGameMode][stat.key]);
                        }
                    }
                }
                statRow.appendChild(statValue);
                column.appendChild(statRow);
            }
            else {
                // Add a break for visual separation
                column.appendChild(document.createElement('br'));
            }
        });

        // Append the complete column to the stats container
        stats_container.appendChild(column);
    });

    // Adding the last battle time of every ship
    if (isShip) {
        const lastBattleTime = document.createElement('div');
        lastBattleTime.className = 'last-battle-info';
        lastBattleTime.style.width = '100%';
        lastBattleTime.style.textAlign = 'center';
        var date = new Date(jsonData['last_battle_time'] * 1000);
        lastBattleTime.textContent = 'Most Recent Battle (All Game Modes): ' + formatDate(date);
        stats_container.appendChild(lastBattleTime);
    }
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}


// ---------------------------------------------------------------------------------
// ------------------------------ Populate Ship List -------------------------------
// ---------------------------------------------------------------------------------

// Helper function to create a table cell and append it to a row
function createCell(row, content, className, isPremium, isImage = false) {
    var cell = row.insertCell();
    cell.className = className;

    if (isImage) {
        var img = document.createElement('img');
        img.src = content;
        img.alt = '';
        img.className = 'cell-image';
        cell.appendChild(img);
    }
    else {
        cell.textContent = content;
        if (isPremium) {
            cell.style.color = '#ffcc66';
        }
        if (className.includes('tier')) {
            cell.style.fontWeight = 'bold';
        }
    }
}

// Helper function to safely get ship encyclopedia data
function getShipEncyData(shipId, key, defaultValue = '') {
    try {
        return shipEncy[shipId][key];
    }
    catch {
        return defaultValue;
    }
}

function create_table_head() {
    var thead = document.getElementById('shipTable').getElementsByTagName('thead')[0];
    thead.innerHTML = ''; // Clear existing head
    var row = thead.insertRow();
    var headers = currentGameMode !== 'clan' ? [
        { text: "Nation", class: "nation" },
        { text: "Type", class: "ship-type" },
        { text: "Tier", class: "tier" },
        { text: "", class: "ship-icon" },
        { text: "Warship", class: "ship-name" },
        { text: "Battles", class: "battles" },
        { text: "Win Rate", class: "win-rate" },
        { text: "Avg Damage", class: "damage" },
        { text: "Avg Frags", class: "frags" },
        { text: "Avg XP", class: "xp" },
        { text: "K/D Ratio", class: "kd" }
    ] : [
        // Headers for 'clan battles' game mode
        { text: "Start Date", class: "date" },
        { text: "End Date", class: "date" },
        { text: "Season", class: "season-id" },
        { text: "", class: "season-icon" },
        { text: "Codename", class: "season-name" },
        { text: "Tier", class: "" },
        { text: "Battles", class: "" },
        { text: "Win Rate", class: "" },
        { text: "Highest Damage", class: "dmg" },
        { text: "Ship", class: "dmg-ship" }
    ];

    headers.forEach((header, index) => {
        var th = document.createElement('th');
        th.textContent = header.text;
        th.className = header.class;
        if (header.text) {
            th.setAttribute("onclick", `sort_ship_list(${index})`);
            th.style.cursor = "pointer";
        }
        row.appendChild(th);
    });
}

// Main function to populate the ship list
function populate_ship_list() {
    create_table_head();
    let shipList = document.getElementById('shipTable').getElementsByTagName('tbody')[0];
    shipList.innerHTML = ''; // Clear existing rows

    if (currentGameMode !== 'clan') {
        shipData.forEach(function (ship) {
            let shipStats = ship[currentGameMode]; // Access the current game mode data
            if (shipStats.battles > 0) {
                let row = document.createElement('tr');

                let isPremium = getShipEncyData(ship.ship_id, 'is_premium');
                let isSpecial = getShipEncyData(ship.ship_id, 'is_special');

                let nation = getShipEncyData(ship.ship_id, 'nation');
                let nation_image_path = staticUrl + 'images/nation_flags/' + nation + '.png';
                createCell(row, nation_image_path, 'nation', isPremium || isSpecial, true);

                let shipType = getShipEncyData(ship.ship_id, 'type');
                let type_image_path = staticUrl + 'images/ship_types/' + shipType;
                if (isPremium) type_image_path += '_premium.png';
                else if (isSpecial) type_image_path += '_special.png';
                else type_image_path += '_standard.png';
                createCell(row, type_image_path, 'ship-type', isPremium || isSpecial, true);

                createCell(row, tier[getShipEncyData(ship.ship_id, 'tier')], 'tier', isPremium || isSpecial);
                createCell(row, getShipEncyData(ship.ship_id, 'images', {}).small, 'ship-icon', isPremium || isSpecial, true);
                createCell(row, getShipEncyData(ship.ship_id, 'name', ship.ship_id), 'ship-name', isPremium || isSpecial);
                createCell(row, nf.format(shipStats.battles), 'battles', isPremium || isSpecial);
                createCell(row, shipStats.win_rate, 'win-rate', isPremium || isSpecial);
                createCell(row, nf.format(parseInt(shipStats.avg_damage_dealt)), 'damage', isPremium || isSpecial);
                createCell(row, nf2d.format(shipStats.avg_frags), 'frags', isPremium || isSpecial);
                createCell(row, nf0d.format(shipStats.avg_xp), 'xp', isPremium || isSpecial);
                createCell(row, nf2d.format(shipStats.kd), 'kd', isPremium || isSpecial);

                row.className = 'ship-item';
                row.onclick = function () { show_ship_stats(ship.ship_id, row); };
                shipList.appendChild(row);
            }
        });
        // Sort the table by "Battles" after populating
        sort_ship_list(5);
    }
    else {
        // New logic for clan battle
        for (let key in cwData) {
            let row = document.createElement('tr');
            row.insertCell().textContent = cwData[key].start_time.split('T')[0];
            row.insertCell().textContent = cwData[key].finish_time.split('T')[0];
            createCell(row, cwData[key].season_id, 'season-id', false);
            if (Number(key) < 100) {
                createCell(row, staticUrl + 'images/clan_seasons/SEASON_' + key + '.png', 'season-icon', false, true);
            }
            else {
                createCell(row, staticUrl + 'images/clan_seasons/CVC_BRAWL.png', 'season-icon', false, true);
            }
            createCell(row, cwData[key].name, 'season-name', false);
            row.insertCell().textContent = cwData[key].tier;
            if (cwData[key].hasOwnProperty('stats')) {
                let bts = cwData[key].stats.battles;
                let wins = cwData[key].stats.wins;
                row.insertCell().textContent = bts
                row.insertCell().textContent = ((wins / bts) * 100).toFixed(2) + '%'
                createCell(row, nf.format(cwData[key].stats.max_damage_dealt), 'dmg', false);
                let shipID = cwData[key].stats.max_damage_dealt_ship_id;
                createCell(row, getShipEncyData(shipID, 'name', shipID), 'dmg-ship', false);
            } else {
                row.insertCell().textContent = 0
                row.insertCell().textContent = '----'
                createCell(row, '----', 'dmg', false);
                createCell(row, '', 'dmg-ship', false);
            }
            shipList.appendChild(row);
        }
    }
}


// ---------------------------------------------------------------------------------
// ------------------------------- Build Ship Stats --------------------------------
// ---------------------------------------------------------------------------------

function show_ship_stats(shipId, clickedRow) {
    // Find the ship by shipId
    var ship = shipData.find(ship => ship.ship_id === shipId);
    if (!ship) return;

    // Check if this row already has a details row displayed
    var nextRow = clickedRow.nextElementSibling;
    var isDetailsShown = nextRow && nextRow.classList.contains('details-row');

    // Remove any previously displayed details row
    var existingDetails = document.querySelector('.details-row');
    if (existingDetails) {
        existingDetails.remove();
    }

    // If the details were already shown for this row, we're done
    if (isDetailsShown) return;
    // Otherwise, we proceed to show the details for this row

    var detailsRow = document.createElement('tr');
    detailsRow.className = 'details-row';
    var detailsCell = detailsRow.insertCell(0);
    detailsCell.colSpan = clickedRow.cells.length;

    // Create the stats container within the details cell
    var stats_container = document.createElement('div');
    stats_container.className = 'ship-stats-container';

    // Build stats table
    if (currentGameMode === 'oper') {
        build_stats_table(oper_table_titles, oper_table_columns, stats_container, ship, true)
    }
    else {
        build_stats_table(account_table_titles, account_table_columns, stats_container, ship, true)
    }

    detailsCell.appendChild(stats_container);

    // Insert the new details row below the clicked ship row
    clickedRow.parentNode.insertBefore(detailsRow, clickedRow.nextSibling);
}


// ---------------------------------------------------------------------------------
// -------------------------------- Sort Ship List ---------------------------------
// ---------------------------------------------------------------------------------

function sort_ship_list(n) {
    var table = document.getElementById("shipTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = Array.from(tbody.getElementsByTagName("TR"));

    // Determine the sort direction
    var isAscending = false;
    // var isAscending = table.getAttribute('data-sort-dir') === 'asc';
    table.setAttribute('data-sort-dir', isAscending ? 'desc' : 'asc');

    // Sort the rows
    rows.sort(function (rowA, rowB) {
        var cellA = rowA.getElementsByTagName("TD")[n];
        var cellB = rowB.getElementsByTagName("TD")[n];

        var valueA = isNaN(parseFloat(cellA.innerHTML)) ? cellA.innerHTML.toLowerCase() : parseFloat(cellA.innerHTML);
        var valueB = isNaN(parseFloat(cellB.innerHTML)) ? cellB.innerHTML.toLowerCase() : parseFloat(cellB.innerHTML);

        if (isAscending) {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    // Re-append rows to the tbody in the new order
    rows.forEach(function (row) {
        tbody.appendChild(row);
    });
}


// ---------------------------------------------------------------------------------
// --------------------------------- Player Search ---------------------------------
// ---------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('player-search');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        fetch(`/search_players/?search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                // Clear previous results
                resultsContainer.innerHTML = '';
                // Add new results to resultsContainer
                data['data'].forEach(player => {
                    const playerElement = document.createElement('div');
                    playerElement.textContent = player.nickname;
                    playerElement.dataset.accountId = player.account_id;
                    playerElement.classList.add('search-result-item');
                    resultsContainer.appendChild(playerElement);

                    // Add click event to each result to update the player stats
                    playerElement.addEventListener('click', () => {
                        const accountID = playerElement.dataset.accountId;
                        // Redirect to the new player stats page
                        window.location.href = `/player_stats/${accountID}`;
                    });
                });
            });
    });
});


// ---------------------------------------------------------------------------------
// ---------------------------------- Export Data ----------------------------------
// ---------------------------------------------------------------------------------

document.getElementById('export-data').addEventListener('click', function () {
    // Function to download data as a file
    function downloadData(data, filename) {
        var file = new Blob([JSON.stringify(data)], { type: 'application/json' });
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // Trigger downloads
    downloadData(accountData, accountData['account_id'] + '_Account-Data.json');
    downloadData(shipData, accountData['account_id'] + '_Ship-Data.json');
    downloadData(cwData, accountData['account_id'] + '_Clan-Data.json');
});


window.onload = function () {
    show_player_stats();
    populate_ship_list();
};