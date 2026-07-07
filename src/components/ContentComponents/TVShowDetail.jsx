import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchTVShowDetails,
    fetchSeasonDetails,
    getImageUrl,
} from "../../services/Api";

import { useMovies } from "../../context/MoviesContext";

function TVShowDetail() {
    const navigate = useNavigate();
    const {
        selectedMedia,
        closeMedia,
        videos,
        videosLoading,
        addToFavorites,
    } = useMovies();

    const tvId = selectedMedia?.id;

    const [tv, setTv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodesBySeason, setEpisodesBySeason] = useState({});

    const playerRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const seasonRequestRef = useRef(0);
    const trailer = videos?.length > 0 ? videos[0] : null;
    const [isMuted, setIsMuted] = useState(true);

    const loadYouTubeAPI = () => {
        if (window.YT && window.YT.Player) return;

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
    };

    useEffect(() => {
        if (!trailer?.key) return;

        loadYouTubeAPI();

        const initPlayer = () => {
            ytPlayerRef.current = new window.YT.Player("tv-yt-player", {
                videoId: trailer.key,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    fs: 0,
                },
                events: {
                    onReady: (event) => event.target.playVideo(),
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.seekTo(0);
                            event.target.playVideo();
                        }
                    },
                },
            });
        };

        window.onYouTubeIframeAPIReady = initPlayer;

        if (window.YT && window.YT.Player) {
            initPlayer();
        }
    }, [trailer]);



    useEffect(() => {
        if (!tvId) return;

        let cancelled = false;

        async function loadTV() {
            try {
                setLoading(true);
                setTv(null);
                setSelectedSeason(null);
                setEpisodesBySeason({});

                const data = await fetchTVShowDetails(tvId);

                if (!cancelled && data?.id === tvId) {
                    setTv(data);
                }

            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadTV();

        return () => {
            cancelled = true;
        };
    }, [tvId]);

    const openSeason = async (seasonNumber) => {
        if (selectedSeason === seasonNumber) {
            setSelectedSeason(null);
            return;
        }

        setSelectedSeason(seasonNumber);

        if (episodesBySeason[seasonNumber]) return;

        const requestId = seasonRequestRef.current + 1;
        seasonRequestRef.current = requestId;

        try {
            const seasonData = await fetchSeasonDetails(
                tvId,
                seasonNumber
            );

            if (seasonRequestRef.current === requestId) {
                setEpisodesBySeason((prev) => ({
                    ...prev,
                    [seasonNumber]: seasonData || [],
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };



    if (!tvId) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white">
                Loading TV Show...
            </div>
        );
    }

    const toggleSound = () => {
        if (!ytPlayerRef.current) return;

        if (isMuted) {
            ytPlayerRef.current.unMute();
        } else {
            ytPlayerRef.current.mute();
        }

        setIsMuted((prev) => !prev);
    };


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

    const handleWatchFirstEpisode = async () => {
        const firstSeason = tv?.seasons?.find((season) => season.season_number > 0);
        if (!firstSeason) return;

        const seasonNumber = firstSeason.season_number;
        let seasonEpisodes = episodesBySeason[seasonNumber];

        if (!seasonEpisodes) {
            seasonEpisodes = await fetchSeasonDetails(tv.id, seasonNumber);
            setEpisodesBySeason((prev) => ({
                ...prev,
                [seasonNumber]: seasonEpisodes || [],
            }));
        }

        const firstEpisode = seasonEpisodes?.find((episodeItem) => episodeItem.episode_number > 0);
        if (!firstEpisode) return;

        try {
            closeMedia();
        } catch (e) {}
        navigate(`/watch/tv/${tv.id}?season=${seasonNumber}&episode=${firstEpisode.episode_number}`);
    };


    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 overflow-hidden">

            {/* MODAL */}
            <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.9)] bg-black">

                {/* CLOSE */}
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
                                id="tv-yt-player"
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
                                    src={getImageUrl(tv?.backdrop_path, "original")}
                                    className="w-full h-full object-cover scale-105"
                                    alt="backdrop"
                                />

                                {/* fallback to poster if no backdrop */}
                                {!tv?.backdrop_path && (
                                    <img
                                        src={tv?.poster_path ? getImageUrl(tv.poster_path) : ""}
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
                                    src={getImageUrl(tv?.poster_path)}
                                    className="w-full h-full object-cover"
                                    alt="poster"
                                />

                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-1">

                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                {tv?.name}

                                <span className="text-white/40 ml-3 text-2xl">
                                    ({tv?.first_air_date?.split("-")[0]})
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
                                    </svg> {tv?.vote_average?.toFixed(1)}
                                </span>

                                <span>
                                    {tv?.number_of_seasons} Seasons
                                </span>

                                <span>
                                    {tv?.number_of_episodes} Episodes
                                </span>

                                <span>
                                    {tv?.status}
                                </span>
                            </div>

                            {/* GENRES */}
                            <div className="mt-4 flex flex-wrap gap-2">

                                {tv?.genres?.map((g) => (
                                    <span
                                        key={g.id}
                                        className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-sm"
                                    >
                                        {g.name}
                                    </span>
                                ))}

                            </div>

                            {/* BUTTONS */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md">

                                <button
                                    onClick={handleWatchFirstEpisode}
                                    className="flex-1 bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg"
                                >
                                    Watch Now
                                </button>

                                <button
                                    onClick={() => addToFavorites(tv, selectedMedia.type)}
                                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg"
                                >
                                    Add to Watch List
                                </button>

                            </div>

                            <p className="mt-6 text-white/80 leading-relaxed">
                                {tv?.overview}
                            </p>

                        </div>
                    </div>

                    {/* SEASONS */}

                    {/* <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">
                            Seasons
                        </h2>
                        <div className="space-y-4">

                            {tv?.seasons
                                ?.filter((s) => s.season_number > 0)
                                .map((season) => (
                                    <div
                                        key={season.id}
                                        className="border border-white/10 rounded-2xl overflow-hidden bg-white/5"
                                    >
                                        
                                        <button
                                            onClick={() => openSeason(season.season_number)}
                                            className={`w-full flex items-center justify-between p-5 transition
                        
                        ${selectedSeason === season.season_number
                                                    ? "bg-red-600"
                                                    : "hover:bg-white/10"
                                                }
                        `}
                                        >
                                            <div className="text-left">

                                                <h3 className="font-bold text-lg">
                                                    {season.name}
                                                </h3>

                                                <p className="text-sm text-white/60">
                                                    {season.episode_count} Episodes
                                                </p>

                                            </div>

                                            <span className="text-2xl">
                                                {selectedSeason === season.season_number
                                                    ? "−"
                                                    : "+"}
                                            </span>

                                        </button>

                                        
                                        {selectedSeason === season.season_number && (

                                            <div className="p-5 grid md:grid-cols-2 gap-5">

                                                {(episodesBySeason[season.season_number] || []).map((episode) => (

                                                    <div
                                                        key={episode.id}
                                                        className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
                                                    >

                                                       
                                                        <div className="h-44 overflow-hidden">

                                                            <img
                                                                src={
                                                                    episode.still_path
                                                                        ? getImageUrl(
                                                                            episode.still_path,
                                                                            "w500"
                                                                        )
                                                                        : getImageUrl(tv.poster_path)
                                                                }
                                                                className="w-full h-full object-cover"
                                                                alt={episode.name}
                                                            />

                                                        </div>

                                                        
                                                        <div className="p-5">

                                                            <p className="text-red-400 text-sm mb-2">
                                                                Episode {episode.episode_number}
                                                            </p>

                                                            <h3 className="font-bold text-lg">
                                                                {episode.name}
                                                            </h3>

                                                            <p className="text-white/60 text-sm mt-2 line-clamp-3">
                                                                {episode.overview || "No overview available"}
                                                            </p>

                                                            <button
                                                                onClick={() => {
                                                                    try { closeMedia(); } catch (e) {}
                                                                    navigate(`/watch/tv/${tv.id}?season=${season.season_number}&episode=${episode.episode_number}`);
                                                                }}
                                                                className="mt-5 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition"
                                                            >
                                                                Watch Episode
                                                            </button>

                                                        </div>
                                                    </div>

                                                ))}

                                            </div>

                                        )}

                                    </div>

                                ))}
                        </div>
                    </div> */}

                    <div className="mt-16 grid md:grid-cols-2 gap-10">

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Production Details
                            </h2>

                            <div className="space-y-4 text-white/70">

                                <div>
                                    <p className="text-white/40">Status</p>
                                    <p>{tv?.status || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-white/40">First Air Date</p>
                                    <p>{tv?.first_air_date || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-white/40">Last Air Date</p>
                                    <p>{tv?.last_air_date || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-white/40">Seasons</p>
                                    <p>{tv?.number_of_seasons || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-white/40">Episodes</p>
                                    <p>{tv?.number_of_episodes || "N/A"}</p>
                                </div>

                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Audience Rating</h2>

                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold">
                                        {formatRating(tv?.vote_average)}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <p className="text-white/70">Votes: {tv?.vote_count}</p>
                                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-red-600 h-2 rounded-full"
                                            style={{
                                                width: `${(tv?.vote_average / 10) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/40 mt-4">
                                {tv?.vote_average ? "Audience ratings available" : "No ratings yet"}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TVShowDetail;
