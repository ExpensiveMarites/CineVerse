import { createContext, useContext, useEffect, useState } from "react";
import {
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchGenres,
    fetchMovieVideos,
} from "../services/Api";

const MoviesContext = createContext();

export const useMovies = () => useContext(MoviesContext);

export const MoviesProvider = ({ children }) => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [genres, setGenres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMovieId, setSelectedMovieId] = useState(null);


    const [movieVideos, setMovieVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie) => {
        const exist = favorites.some((fav) => fav.id === movie.id);

        if (!exist) {
            setFavorites([...favorites, movie])
        }
    };

    const removeFromFavorites = (id) => {
        setFavorites(favorites.filter((movie) => movie.id !== id))
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [trending, popular, topRated, genreList] =
                    await Promise.all([
                        fetchTrendingMovies(),
                        fetchPopularMovies(),
                        fetchTopRatedMovies(),
                        fetchGenres(),
                    ]);

                setTrendingMovies(trending || []);
                setPopularMovies(popular || []);
                setTopRatedMovies(topRated || []);
                setGenres(genreList || []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load movies");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);


    useEffect(() => {
        if (!selectedMovieId) return;

        const loadVideos = async () => {
            try {
                setVideosLoading(true);
                const videos = await fetchMovieVideos(selectedMovieId);
                setMovieVideos(videos || []);
            } catch (err) {
                console.error(err);
            } finally {
                setVideosLoading(false);
            }
        };

        loadVideos();
    }, [selectedMovieId]);


    const openMovie = (id) => {
        setSelectedMovieId(id);
        document.body.style.overflow = "hidden";
    };

    const closeMovie = () => {
        setSelectedMovieId(null);
        setMovieVideos([]);
        document.body.style.overflow = "";
    };

    return (
        <MoviesContext.Provider
            value={{
                trendingMovies,
                popularMovies,
                topRatedMovies,
                genres,
                loading,
                error,

                selectedMovieId,
                movieVideos,
                videosLoading,

                openMovie,
                closeMovie,

                favorites,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};