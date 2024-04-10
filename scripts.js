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

function displayFilteredGames(games = globalData, pageIndex = 0) {
    console.log(`Displaying filtered games, count: ${games.length}`);
    const container = document.getElementById('game-container');
    container.innerHTML = '';  // Clear previous games

    const itemsPerPage = 30;  // Define how many items per page
    const pageData = games.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
    pageData.forEach(game => createGameCard(game));

    // Optionally update or create navigation for filtered games
    updatePagination(pageIndex, Math.ceil(games.length / itemsPerPage)); // Update pagination controls
}

function updatePagination(currentPageIndex, totalPages) {
    // Implement pagination updates here
}
function setupnavigation() {
    let nextPageButton = document.querySelector('.next-page-btn');
    let prevPageButton = document.querySelector('.prev-page-btn');

    if (!nextPageButton) {
        nextPageButton = document.createElement('button');
        nextPageButton.className = 'next-page-btn';
        nextPageButton.textContent = 'Next Page';
        document.body.appendChild(nextPageButton);
    }

    if (!prevPageButton) {
        prevPageButton = document.createElement('button');
        prevPageButton.className = 'prev-page-btn';
        prevPageButton.textContent = 'Previous Page';
        document.body.appendChild(prevPageButton);
    }

    nextPageButton.onclick = function() {
        if (currentPage < Math.floor(globalData.length / 30) - 1) {
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
            displayPage(currentPage);  // Optionally re-display the current page if search is cleared
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('filtered_output_file.json')
    .then(response => response.json())
    .then(data => {
        console.log("Data Loaded", data);
        globalData = data;
        setupnavigation();
        displayPage(0);  // Display the first page of results
        setupSearch();

        document.getElementById('sortOrder').addEventListener('change', () => sortAndFilterGames(globalData));
        sortAndFilterGames(globalData); // Initial sort and display
    })
    .catch(error => {
        console.error('Error loading the data:', error);
    });
});

function sortAndFilterGames(gamesData) {
    const sortOrder = document.getElementById('sortOrder').value;
    console.log("Sorting Order:", sortOrder);

    let sortedGames;
    switch (sortOrder) {
        case "newest":
            sortedGames = [...gamesData].sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "oldest":
            sortedGames = [...gamesData].sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "best-match": // Handle "Best Match" (default order)
        default:
            sortedGames = [...gamesData];
    }

    displayFilteredGames(sortedGames);
}
