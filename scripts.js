let globalData = [];
let currentPage = 0;

function createGameCard(game) {  
    const container = document.getElementById('game-container');

    const card = document.createElement('div');
    card.className = 'game-card';

    const image = document.createElement('img');
    image.src = game.img_url;
    image.alt = `Cover image for ${game.name}`;
    card.appendChild(image);

    const name = document.createElement('h2');
    name.textContent = game.name;
    card.appendChild(name);

    const price = document.createElement('p'); 
    price.textContent = !game.price || isNaN(parseFloat(game.price)) ? 'Price: Free' : `Price: $${(parseFloat(game.price) / 100).toFixed(2)}`;
    card.appendChild(price);

    const developer = document.createElement('p');
    developer.textContent = `Developed by: ${game.developer}`;
    card.appendChild(developer);
    
    const publisher = document.createElement('p');
    publisher.textContent = `Published by: ${game.publisher}`;
    card.appendChild(publisher);
    
    const date = document.createElement('p');
    date.textContent = `Release Date: ${game.date}`;
    card.appendChild(date);

    container.appendChild(card);
}


function displayPage(pageIndex) {
    console.log(`Displaying page: ${pageIndex}`);
    const container = document.getElementById('game-container');
    container.innerHTML = '';  // Clear existing content
    const pageData = globalData.slice(pageIndex * 30, (pageIndex + 1) * 30);
    console.log(`Displaying ${pageData.length} games`);
    pageData.forEach(game => createGameCard(game));
}

function displayFilteredGames(games = globalData) {
    console.log(`Displaying filtered games, count: ${games.length}`);
    const container = document.getElementById('game-container');
    container.innerHTML = '';  // Clear previous games
    games.forEach(game => createGameCard(game));
}

function setupnavigation() {
    const nextPageButton = document.createElement('button');
    nextPageButton.className = 'next-page-btn';
    nextPageButton.textContent = 'Next Page';
    nextPageButton.onclick = function() {
        if (currentPage < Math.floor(globalData.length / 20)) {
            currentPage++;
            displayPage(currentPage);
        }
    };
    const prevPageButton = document.createElement('button');
    prevPageButton.className = 'prev-page-btn';
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.onclick = function() {
        if (currentPage > 0) {
            currentPage--;
            displayPage(currentPage);
        }
    };

    document.body.appendChild(prevPageButton);
    document.body.appendChild(nextPageButton);
}
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.trim()) {
            const filteredData = globalData.filter(game =>
                game.name.toLowerCase().includes(searchTerm)
            );
            displayFilteredGames(filteredData);
        } else {
            displayPage(currentPage);  // Optionally re-display the current page if search is cleared
        }
    });
}

function sort 

document.addEventListener('DOMContentLoaded', function() {
    fetch('fixed_final_data_new.json')
    .then(response => response.json())
    .then(data => {
        console.log("Data Loaded", data);
        globalData = data;
        setupnavigation();
        displayPage(0);  // Display the first page of results
        setupSearch();
    })
});