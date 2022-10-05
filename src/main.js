// Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': navigator.language,
    },
});

function likedMovieList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {

    const likedMovies = likedMovieList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

// Utils
const options = {
    // root
    rootMargin: '0px',
    threshold: 0
}

const callback = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) { 
            //console.log(entry);
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);  
        }
    });
};

const observer = new IntersectionObserver(callback, options);

function createMovies(movies, container, {lazyLoad = false, clean = false}) {

    if (clean) {
        // delete de preview list
        container.innerHTML = "";
    }

    // Generate list of movies
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', "https://media.istockphoto.com/vectors/error-page-not-found-vertical-banner-or-website-with-system-fatal-vector-id1254267333?k=20&m=1254267333&s=170667a&w=0&h=lyVbMipyYbIMF77szTSO4GQQQ4VuG977vjdsGspDr0k=");
        });
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
       });
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMovieList()[movie.id] && movieBtn.classList.toggle('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
            getLikedMovie()
        })

        if (lazyLoad) {
            observer.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

function createProviders(providers, container) {
    // delete de preview list
    container.innerHTML = "";

    providers.forEach(provider => {
        const providerContainer = document.createElement('div');
        providerContainer.classList.add('provider-container');

        const providerImg = document.createElement('img');
        providerImg.classList.add('provider-img');
        providerImg.setAttribute('src', 'https://www.themoviedb.org/t/p/original/' + provider.logo_path); 

        const Name = document.createElement('p');
        Name.classList.add('provider-Name');
        const providerName = document.createTextNode(provider.provider_name) 

        Name.appendChild(providerName)
        providerContainer.appendChild(Name)
        providerContainer.appendChild(providerImg)
        container.appendChild(providerContainer)
    }); 
}

function createProvidersError(container) {
    // delete de preview list
    container.innerHTML = "";

    const providerContainer = document.createElement('div');
    providerContainer.classList.add('provider-container');

    const Name = document.createElement('p');
    Name.classList.add('provider-Name');
    const providerName = document.createTextNode("No disponible aún en tu país");

    Name.appendChild(providerName);
    providerContainer.appendChild(Name);
    container.appendChild(providerContainer);
}

// Llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, {lazyLoad: true, clean: true});
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
    maxPage =  data.total_pages;
    console.log(maxPage);

    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        const pageIsNotMax = page < maxPage;
    
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie',{
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;
        
            createMovies(movies, genericSection, {lazyLoad: true, clean: false});
        }
    }
}

async function getMovieBySearch(query) {
    const { data } = await api('search/movie',{
        params: {
            query: query,
        }
    });
    const movies = data.results;
    maxPage =  data.total_pages;
    console.log(maxPage);

    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        const pageIsNotMax = page < maxPage;
    
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie',{
                params: {
                    query: query,
                    page,
                }
            });
            const movies = data.results;
        
            createMovies(movies, genericSection, {lazyLoad: true, clean: false});
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;
    maxPage =  data.total_pages;

    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}

async function getPaginatedTrendingMovies() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;


    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/week', {
            params: {
                page: page,
            },
        });
        const movies = data.results;
    
        createMovies(movies, genericSection, {lazyLoad: true, clean: false});
    }
}

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = Math.round(movie.vote_average);

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer, {lazyLoad: true, clean: true});
}

async function getWatchProviders(id) {
    const { data } = await api(`movie/${id}/watch/providers`);
    const providers = data.results; 

    if (Object.keys(providers).includes("GT")) {
        createProviders(providers.GT.flatrate, movieListProviders);
    } else {
        createProvidersError(movieListProviders)
        console.log(providers)
    }
}

function getLikedMovie() {
    const likedMovies = likedMovieList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true});
}