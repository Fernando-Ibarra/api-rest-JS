let maxPage;
let page = 1;
let infiniteScroll;

// Events for changing the location
searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

arrowBtn.addEventListener('click', () => {
    history.back()
    //location.hash = '#home';
});


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    console.log({ location });

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    location.hash;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false});
    }
}

function homePage() {
    console.log('HOME!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log('MOVIE!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#category','id-name']
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    if (categoryName != "TV%20Movie" && categoryName != "Science%20Fiction" ) {
        nameCategory = categoryName;
    } else if (categoryName == "Science%20Fiction") {
        nameCategory = "Science Fiction";
    } else {
        nameCategory = "TV Movie";
    }
    
    headerCategoryTitle.innerHTML = nameCategory;

    getMovieByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
    
}

function movieDetailsPage() {
    console.log('MOVIE!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    // ['#movie','id']
    const [_, id] = location.hash.split('=');
    getMovieById(id);
    getWatchProviders(id);
}

function searchPage() {
    console.log('SEARCH!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search','elementobuscado']
    const [_, query] = location.hash.split('=');
    getMovieBySearch(query);
    searchFormInput.value = "";
    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive')
    
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}