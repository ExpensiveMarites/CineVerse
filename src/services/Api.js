const API_KEY = "41f5760a47d628244e79423b6ce18616";
const BASE_URL = "https://api.themoviedb.org/3";
const VIDEO_PROVIDERS = [
    "https://vidsrcme.su",
    "https://vsembed.su",
    "https://vidsrc-embed.ru"
];

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

export const getVidSrcMovieUrl = (movieId) => {
    return {
        providers: VIDEO_PROVIDERS.map((base) =>
            `${base}/embed/movie/${movieId}`
        )
    };
};

// export const getVidSrcMovieUrl = (movieId) => {
//     return `https://vidsrc.io/embed/movie${movieId}?autoplay=1`;
// };


// TV SHOWS API

export const fetchTrendingTVShows = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching trending TV shows", error);
        return [];
    }
};

export const fetchPopularTVShows = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular TV shows", error);
        return [];
    }
};

export const fetchTopRatedTVShows = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching top rated TV shows", error);
        return [];
    }
};

export const fetchTVShowDetails = async (tvId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching TV show details", error);
        return null;
    }
};

export const fetchSearchTVShows = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
        );

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error searching TV shows", error);
        return [];
    }
};

export const fetchTVShowVideos = async (tvId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();

        if (!data.results) return [];

        return data.results.filter(
            (video) => video.type === "Trailer" || video.type === "Teaser"
        );
    } catch (error) {
        console.error("Error fetching TV videos", error);
        return [];
    }
};

export const getVidSrcTVUrl = (tvId, season, episode) => {
    return {
        providers: VIDEO_PROVIDERS.map(
            (base) => `${base}/embed/tv/${tvId}/${season}/${episode}`
        )
    };
};

export const fetchTVSeasons = async (tvId) => {
    try {
        const res = await fetch(
            `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
        );

        const data = await res.json();
        return data.seasons;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchSeasonDetails = async (tvId, seasonNumber) => {
    try {
        const res = await fetch(
            `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
        );

        const data = await res.json();
        return data.episodes;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchTVGenres = async () => {
    try {
        const res = await fetch(
            `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        return data.genres;
    } catch (error) {
        console.error("Error fetching TV genres", error);
        return [];
    }
};

export const fetchTVByGenre = async (genreId, page = 1) => {
    try {
        const res = await fetch(
            `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`
        );

        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching TV shows by genre", error);
        return [];
    }
};