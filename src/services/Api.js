const API_KEY = "41f5760a47d628244e79423b6ce18616";
const BASE_URL = "https://api.themoviedb.org/3";

// TRENDING
export const fetchTrendingMovies = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching trending movies", error);
        return [];
    }
};

// POPULAR
export const fetchPopularMovies = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular movies", error);
        return [];
    }
};

// TOP RATED
export const fetchTopRatedMovies = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching top rated movies", error);
        return [];
    }
};

// BY GENRE
// export const fetchMoviesByGenre = async (genreId) => {
//     try {
//         const response = await fetch(
//             `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`
//         );

//         const data = await response.json();
//         return data.results;
//     } catch (error) {
//         console.error("Error fetching movies by genre", error);
//         return [];
//     }
// };

export const fetchMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching movies by genre", error);
        return [];
    }
};


// GENRES
export const fetchGenres = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error("Error fetching genres", error);
        return [];
    }
};

// MOVIE DETAILS
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details", error);
        return null;
    }
};

// SEARCH
export const fetchSearchMovies = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching search movies", error);
        return [];
    }
};

// IMAGE HELPER
export const getImageUrl = (path, size = "original") => {
    if (!path)
        return "https://via.placeholder.com/400x600?text=No+Image+Available";
    return `https://image.tmdb.org/t/p/${size}${path}`;
};


export const fetchMovieVideos = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();

        if (!data.results) return [];

        // 🎯 Rank videos instead of filtering by YouTube
        const sortedVideos = data.results
            .filter((video) => video.type === "Trailer" || video.type === "Teaser")
            .sort((a, b) => {
                // 1. Official first
                if (a.official && !b.official) return -1;
                if (!a.official && b.official) return 1;

                // 2. Trailer before Teaser
                if (a.type === "Trailer" && b.type !== "Trailer") return -1;
                if (a.type !== "Trailer" && b.type === "Trailer") return 1;

                return 0;
            });

        return sortedVideos;
    } catch (error) {
        console.error("Error fetching movie videos", error);
        return [];
    }
};