import React, { useEffect, useRef, useState } from "react";
import { fetchMovieDetails, fetchTVShowDetails, getImageUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";

function MoviesDetail() {
    const { selectedMedia, closeMedia, videos, videosLoading, addToFavorites, openPlayer } = useMovies();

    const movieId = selectedMedia?.id;

    const [movie, setMovie] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [error, setIsError] = useState(null);
    const [isMuted, setIsMuted] = useState(true);

    const playerRef = useRef(null);
    const ytPlayerRef = useRef(null);

    useEffect(() => {
        setMovie(null);
        setIsLoading(true);
    }, [movieId]);

    const loadYouTubeAPI = () => {
        if (window.YT && window.YT.Player) return;

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
    };

    useEffect(() => {
        async function getDetails() {
            try {
                setIsLoading(true);
                setIsError(null);

                if (selectedMedia.type === "movie") {
                    const movieData = await fetchMovieDetails(movieId);
                    setMovie(movieData);
                } else {
                    const tvData = await fetchTVShowDetails(movieId);
                    setMovie(tvData);
                }

            } catch (err) {
                console.error(err);
                setIsError("Failed to load details");
            } finally {
                setIsLoading(false);
            }
        }

        if (movieId) getDetails();
    }, [movieId, selectedMedia?.type]);

    const trailer = videos && videos.length > 0 ? videos[0] : null;

    useEffect(() => {
        if (!trailer?.key) return;

        loadYouTubeAPI();

        const initPlayer = () => {
            ytPlayerRef.current = new window.YT.Player("yt-player", {
                videoId: trailer.key,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    fs: 0,
                    iv_load_policy: 3
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.seekTo(0);
                            event.target.playVideo();
                        }
                    }
                }
            });
        };

        window.onYouTubeIframeAPIReady = initPlayer;

        if (window.YT && window.YT.Player) {
            initPlayer();
        }
    }, [trailer]);

    const toggleSound = () => {
        if (!ytPlayerRef.current) return;

        if (isMuted) {
            ytPlayerRef.current.unMute();
        } else {
            ytPlayerRef.current.mute();
        }

        setIsMuted((prev) => !prev);
    };

    if (!movieId) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white">
                <div className="animate-pulse text-white/70">
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const formatRuntime = (m) =>
        !m ? "N/A" : `${Math.floor(m / 60)}h ${m % 60}m`;

    const formatRating = (r) =>
        r ? (Math.round(r * 10) / 10).toFixed(1) : "N/A";

    const formatRevenue = (r) =>
        r
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
            }).format(r)
            : "N/A";



    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 overflow-hidden">

            {/* MODAL WRAPPER */}
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.9)] bg-black">

                {/* CLOSE BUTTON */}
                <button
                    onClick={closeMedia}
                    className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center 
                               bg-black/50 backdrop-blur-md border border-white/10 
                               text-white/70 hover:text-white hover:bg-black/70 
                               rounded-full transition"
                >
                    ✕
                </button>

                {/* HERO */}
                <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">

                    {videosLoading ? (
                        <div className="w-full h-full flex items-center justify-center text-white/60">
                            Loading trailer...
                        </div>
                    ) : trailer ? (
                        <>
                            {/* 🎬 YOUTUBE PLAYER */}
                            <div
                                id="yt-player"
                                ref={playerRef}
                                className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 scale-100 brightness-110 contrast-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] opacity-60" />

                            <button
                                onClick={toggleSound}
                                className="absolute bottom-10 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm hover:bg-black/80 border border-white/10"
                            >
                                {isMuted ? "Unmute 🔊" : "Mute 🔇"}
                            </button>
                        </>
                    ) : (
                        <>

                            <div className="relative w-full h-full">
                                <img
                                    src={getImageUrl(movie?.backdrop_path, "original")}
                                    className="w-full h-full object-cover scale-105"
                                    alt="backdrop"
                                />

                                {/* fallback to poster if no backdrop */}
                                {!movie?.backdrop_path && (
                                    <img
                                        src={getImageUrl(movie?.poster_path)}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        alt="poster-fallback"
                                    />
                                )}

                                {/* cinematic overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                                {/* subtle animated glow */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15),transparent_70%)] animate-pulse" />
                            </div>
                        </>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-6 md:p-10 bg-black text-white">

                    <div className="md:flex gap-10 -mt-20 relative z-10">

                        {/* POSTER */}
                        <div className="w-40 md:w-64 flex-shrink-0">
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                <img
                                    src={getImageUrl(movie?.poster_path)}
                                    className="w-full h-full object-cover"
                                    alt="poster"
                                />
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-1">

                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                {movie?.title}
                                <span className="text-white/40 ml-3 text-2xl">
                                    ({movie?.release_date?.split("-")[0]})
                                </span>
                            </h1>

                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/70">
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-3 h-3 sm:w-4 sm:h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007
                                            5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527
                                            1.257 5.273c.27 1.136-.964 2.033-1.96 1.425L12 18.354
                                            7.373 21.18c-.996.608-2.23-.29-1.96-1.425l1.257-5.273
                                            -4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433
                                            2.082-5.006z"
                                            clipRule="evenodd"
                                        />
                                    </svg> {formatRating(movie?.vote_average)}</span>
                                <span>{formatRuntime(movie?.runtime)}</span>
                                <span>{movie?.release_date}</span>
                                <span className="bg-red-600/80 px-3 py-1 rounded-full text-xs">
                                    {movie?.adult ? "18+" : "PG-13"}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {movie?.genres?.map((g) => (
                                    <span
                                        key={g.id}
                                        className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-sm"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4  max-w-md mx-auto md:mx-0">

                                {/* WATCH NOW */}
                                <button
                                    onClick={() => {

                                        openPlayer({
                                            id: movie.id,
                                            type: selectedMedia.type,
                                            title: movie.title,
                                            poster: movie.poster_path,
                                        });
                                    }}
                                    className="flex-1 bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Now
                                </button>

                                {/* WATCHLIST */}
                                <button
                                    onClick={() => addToFavorites(movie, selectedMedia.type)}
                                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add to Watch List
                                </button>

                            </div>

                            <p className="mt-6 text-white/60 italic">
                                {movie?.tagline}
                            </p>

                            <p className="mt-6 text-white/80 leading-relaxed">
                                {movie?.overview}
                            </p>
                        </div>
                    </div>

                    {/* DETAILS (UNCHANGED) */}
                    <div className="mt-16 grid md:grid-cols-2 gap-10">

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Production Details</h2>
                            <div className="space-y-4 text-white/70">
                                <div>
                                    <p className="text-white/40">Budget</p>
                                    <p>{formatRevenue(movie?.budget)}</p>
                                </div>
                                <div>
                                    <p className="text-white/40">Revenue</p>
                                    <p>{formatRevenue(movie?.revenue)}</p>
                                </div>
                                <div>
                                    <p className="text-white/40">Status</p>
                                    <p>{movie?.status}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Audience Rating</h2>

                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold">
                                        {formatRating(movie?.vote_average)}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <p className="text-white/70">Votes: {movie?.vote_count}</p>
                                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-red-600 h-2 rounded-full"
                                            style={{
                                                width: `${(movie?.vote_average / 10) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/40 mt-4">
                                {movie?.vote_average ? "Audience ratings available" : "No ratings yet"}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default MoviesDetail;
