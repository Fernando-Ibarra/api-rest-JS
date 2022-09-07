const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// Utils
function createMovies(movies, container) {
    // delete de preview list
    container.innerHTML = "";
    // Generate list of movies
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    // delete de preview list
    container.innerHTML = "";

    // Generate list of categories
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTittle = document.createElement('h3');
        categoryTittle.classList.add('category-title');
        // Add event for changing the location 
        categoryTittle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        categoryTittle.setAttribute('id', 'id' + category.id);

        const categoryTitleText = document.createTextNode(category.name) 

        categoryTittle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTittle);
        container.appendChild(categoryContainer);
    });
}

// Llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

async function getMovieByCategory(id) {
    const { data } = await api('discover/movie',{
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getMovieBySearch(query) {
    const { data } = await api('search/movie',{
        params: {
            query: query,
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}