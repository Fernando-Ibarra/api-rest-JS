const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML = "";
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer);
    });
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoriesPreviewList.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTittle = document.createElement('h3');
        categoryTittle.classList.add('category-title');
        categoryTittle.setAttribute('id', 'id' + category.id);

        const categoryTitleText = document.createTextNode(category.name) 

        categoryTittle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTittle);
        categoriesPreviewList.appendChild(categoryContainer);
    });
}