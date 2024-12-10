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

    const res = await fetch(URL);
    const data = await res.json();
    // console.log(data);
    // console.log(data.Search);
    // console.log(data.Response);

    if (data.Response == "True")
        displayMovieList(data.Search);
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
        // console.log(movie.dataset.id);
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";

            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a8653d9a`);
            const movieDetails = await result.json();
            // console.log(movieDetails);

            displayMovieDetails(movieDetails);            
        });
    });

}

function displayMovieDetails(details) {
    console.log(details);
    
    resultGrid.innerHTML = ``;

}