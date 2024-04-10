let globalData = [];
let currentPage = 0;
var showGames = true;
let showFreeOnly = false;


function createGameCard(game) {
    const container = document.getElementById('game-container');

    const card = document.createElement('div');
    card.className = 'game-card';

    const image = document.createElement('img');
    image.src = game.img_url;
    image.alt = `Cover image for ${game.name}`;
    card.appendChild(image);

    const name = document.createElement('a');
    name.href = game.url_info.url;  
    name.textContent = game.name;
    name.className = 'game-title';  
    name.target = "_blank";  
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
    const container = document.getElementById('game-container');
    container.innerHTML = '';  
    const pageData = globalData.slice(pageIndex * 30, (pageIndex + 1) * 30);
    pageData.forEach(game => createGameCard(game));
}

function displayFilteredGames(games = globalData, pageIndex = 0) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; 

    const itemsPerPage = 30;  
    const pageData = games.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
    pageData.forEach(game => createGameCard(game));

    updatePagination(pageIndex, Math.ceil(games.length / itemsPerPage)); // Update pagination controls
}

function updatePagination(currentPageIndex, totalPages) {
}
function setupnavigation() {
    let navWrapper = document.querySelector('.page-navigation');
    if (!navWrapper) {
        navWrapper = document.createElement('div');
        navWrapper.className = 'page-navigation';
        document.body.appendChild(navWrapper); // Ensure this targets a container element that is appropriate
    }

    let prevPageButton = document.querySelector('.prev-page-btn');
    if (!prevPageButton) {
        prevPageButton = document.createElement('button');
        prevPageButton.className = 'prev-page-btn';
        prevPageButton.textContent = 'Previous Page';
    }

    let nextPageButton = document.querySelector('.next-page-btn');
    if (!nextPageButton) {
        nextPageButton = document.createElement('button');
        nextPageButton.className = 'next-page-btn';
        nextPageButton.textContent = 'Next Page';
    }

    // Append buttons in the correct order
    navWrapper.appendChild(prevPageButton);
    navWrapper.appendChild(nextPageButton);

    nextPageButton.onclick = function() {
        if (currentPage < Math.floor(globalData.length / 30)) {
            currentPage++;
            displayPage(currentPage);
        }
    };

    prevPageButton.onclick = function() {
        if (currentPage > 0) {
            currentPage--;
            displayPage(currentPage);
        }
    };
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
            displayPage(currentPage); 
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('filtered_output_file.json')
    .then(response => response.json())
    .then(data => {
        globalData = data;
        setupnavigation();
        displayPage(0);
        setupSearch();

        document.getElementById('sortOrder').addEventListener('change', () => sortAndFilterGames(globalData));
        
        document.getElementById('showFreeOnly').addEventListener('change', function() {
            showFreeOnly = this.checked;
            sortAndFilterGames(globalData);
        });

        sortAndFilterGames(globalData);
    })
    .catch(error => {
        console.error('Error loading the data:', error);
    });
})

function sortAndFilterGames(gamesData) {
    const sortOrder = document.getElementById('sortOrder').value;

    let filteredGames = gamesData;
    if (showFreeOnly) {
        filteredGames = gamesData.filter(game => !game.price || parseFloat(game.price) === 0);
    }

    let sortedGames;
    switch (sortOrder) {
        case "newest":
            sortedGames = [...filteredGames].sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "oldest":
            sortedGames = [...filteredGames].sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "best-match":
        default:
            sortedGames = [...filteredGames];
    }

    displayFilteredGames(sortedGames);
}
