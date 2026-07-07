import { createContext, useContext, useEffect, useState } from "react";
import PlayerModal from "../components/SharedComponents/PlayerModal";
import {
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchGenres,
    fetchMovieVideos,
    fetchTrendingTVShows,
    fetchPopularTVShows,
    fetchTopRatedTVShows,
    fetchTVShowVideos,
    fetchTVGenres
} from "../services/Api";

const MoviesContext = createContext();

export const useMovies = () => useContext(MoviesContext);

export const MoviesProvider = ({ children }) => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);

    const [trendingTV, setTrendingTV] = useState([]);
    const [popularTV, setPopularTV] = useState([]);
    const [topRatedTV, setTopRatedTV] = useState([]);

    const [genres, setGenres] = useState([]);
    const [tvGenres, setTVGenres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMedia, setSelectedMedia] = useState(null);

    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

    const [showPlayer, setShowPlayer] = useState(false);
    const [playerContent, setPlayerContent] = useState(null);

    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem("favorites");
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            console.error("Error reading favorites", err);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        } catch (err) {
            console.error("Error saving favorites", err);
        }
    }, [favorites]);

    const addToFavorites = (item, mediaType) => {
        const type = mediaType || item.mediaType;
        if (!type) return;

        const exist = favorites.some(
            (fav) => fav.id === item.id && fav.mediaType === type
        );

        if (exist) return;

        const normalizedItem = {
            id: item.id,
            mediaType: type,

            // normalize title
            title: item.title || item.name || "Untitled",

            // normalize image
            poster_path: item.poster_path || item.backdrop_path || null,

            // normalize rating
            vote_average: item.vote_average || 0,

            // normalize dates
            release_date: item.release_date || null,
            first_air_date: item.first_air_date || null,
        };

        setFavorites((prev) => [...prev, normalizedItem]);
    };

    const removeFromFavorites = (id, mediaType) => {
        setFavorites(
            favorites.filter(
                (item) => !(item.id === id && item.mediaType === mediaType)
            )
        );
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [trending, popular, topRated, genreList, tvGenreList, tvTrending, tvPopular, tvTopRated] =
                    await Promise.all([
                        fetchTrendingMovies(),
                        fetchPopularMovies(),
                        fetchTopRatedMovies(),
                        fetchGenres(),
                        fetchTVGenres(),
                        fetchTrendingTVShows(),
                        fetchPopularTVShows(),
                        fetchTopRatedTVShows(),
                    ]);

                setTrendingMovies(trending || []);
                setPopularMovies(popular || []);
                setTopRatedMovies(topRated || []);
                setGenres(genreList || []);

                // TV Show
                setTVGenres(tvGenreList || []);
                setTrendingTV(tvTrending || []);
                setPopularTV(tvPopular || []);
                setTopRatedTV(tvTopRated || []);
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
        if (!selectedMedia) return;

        let cancelled = false;
        const media = selectedMedia;

        setVideos([]);

        const loadVideos = async () => {
            try {
                setVideosLoading(true);

                let data = [];

                if (media.type === "movie") {
                    data = await fetchMovieVideos(media.id);
                } else {
                    data = await fetchTVShowVideos(media.id);
                }

                if (!cancelled) {
                    setVideos(data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) {
                    setVideosLoading(false);
                }
            }
        };

        loadVideos();

        return () => {
            cancelled = true;
        };
    }, [selectedMedia]);


    const openMedia = (id, type) => {
        const mediaId = Number(id);

        if (!Number.isInteger(mediaId) || mediaId <= 0) return;
        if (type !== "movie" && type !== "tv") return;

        setSelectedMedia({ id: mediaId, type });
    };

    const closeMedia = () => {
        setSelectedMedia(null);
        setVideos([]);
    };

    const openPlayer = (media) => {
        const id = Number(media?.id);
        const type = media?.type;

        if (!Number.isInteger(id) || id <= 0) return;
        if (type !== "movie" && type !== "tv") return;

        const nextContent = {
            id,
            type,
            title: media.title,
            poster: media.poster,
            season: null,
            episode: null,
        };

        if (type === "tv") {
            const season = Number(media.season);
            const episode = Number(media.episode);

            if (
                !Number.isInteger(season) ||
                !Number.isInteger(episode) ||
                season <= 0 ||
                episode <= 0
            ) {
                return;
            }

            nextContent.season = season;
            nextContent.episode = episode;
        }

        setPlayerContent({
            ...nextContent,
        });

        setShowPlayer(true);
    };

    const closePlayer = () => {
        setShowPlayer(false);
        setPlayerContent(null);
    };


    return (
        <MoviesContext.Provider
            value={{
                // MOVIES
                trendingMovies,
                popularMovies,
                topRatedMovies,

                // TV
                trendingTV,
                popularTV,
                topRatedTV,

                // GENRES
                genres,
                tvGenres,

                // GLOBAL STATE
                loading,
                error,

                // MEDIA MODAL (IMPORTANT)
                selectedMedia,
                openMedia,
                closeMedia,

                // VIDEOS
                videos,
                videosLoading,

                // PLAYER
                showPlayer,
                playerContent,
                openPlayer,
                closePlayer,

                // FAVORITES
                favorites,
                addToFavorites,
                removeFromFavorites,

            }}
        >
            {children}
            {showPlayer && playerContent && (
                <PlayerModal
                    id={playerContent.id}
                    type={playerContent.type}
                    season={playerContent.season}
                    episode={playerContent.episode}
                    onClose={closePlayer}
                />
            )}

        </MoviesContext.Provider>
    );
};
