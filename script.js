const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

const formControl = document.querySelector('.form-control')
    .addEventListener('keyup', () => findMovies());


function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();

    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}


async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=a8653d9a`;

    try {
        const res = await fetch(URL);
        const data = await res.json();

        if (data.Response == "True") {
            displayMovieList(data.Search);
        }
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}


function displayMovieList(movies) {
    searchList.innerHTML = "";

    for (let i = 0; i < movies.length; i++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID;
        movieListItem.classList.add('search-list-item');

        if (movies[i].Poster != "N/A") {
            moviePoster = movies[i].Poster;
        } else {
            moviePoster = "image_not_found.png"
        }

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" >
            </div>
            <div class="search-item-info">
                <h3>${movies[i].Title}</h3>
                <p>${movies[i].Year}</p>
            </div>
            `;

        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');

    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";

            try {
                const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a8653d9a`);
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error("Error loading movie details:", error);
            }
        });
    });
}

function displayMovieDetails(details) {

    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p><b>Director:</b> ${details.Director}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>

        <div id="show-more-container">
            <button id="show-more-btn" class="show-more-btn">Show More</button>
            <div id="more-info" class="more-info hidden">
            <p><b>Type:</b> ${details.Type}</p>
            <p><b>Runtime:</b> ${details.Runtime}</p>
            <p><b>Box Office:</b> ${details.BoxOffice}</p>
            <p><b>Metascore:</b> ${details.Metascore}</p>
            <p><b>Rotten Tomatoes:</b> ${details.Ratings && details.Ratings[1] ? details.Ratings[1].Value : 'N/A'}</p>
            <p><b>IMDb Rating:</b> ${details.imdbRating}</p>
            <p><b>IMDb Votes:</b> ${details.imdbVotes}</p>
            <p><b>Country:</b> ${details.Country}</p>
            <p><b>Production:</b> ${details.Production}</p>
        </div>
    </div>
    `;

}

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});

//show-more-btn is loaded after calling displayMovieDetails() so  event delegation used here

document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'show-more-btn') {
        const moreInfo = document.getElementById('more-info');
        const button = document.getElementById('show-more-btn');

        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            button.textContent = 'Show Less';
        } else {
            moreInfo.classList.add('hidden');
            button.textContent = 'Show More';
        }
    }
});


