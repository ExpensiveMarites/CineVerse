import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    EMBED_SERVERS,
    fetchMovieDetails,
    fetchMovieRecommendations,
    fetchSeasonDetails,
    fetchTVRecommendations,
    fetchTVShowDetails,
    getImageUrl,
    getEmbedUrls,
} from "../services/Api";
import { useMovies } from "../context/MoviesContext";

const DEFAULT_SERVER_ID = "vidzee";

function WatchPage() {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { openMedia } = useMovies();

    const mediaId = Number(id);
    const isMovie = mediaType === "movie";

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [serverId, setServerId] = useState(DEFAULT_SERVER_ID);
    const [recommendations, setRecommendations] = useState([]);
    const [seasonEpisodes, setSeasonEpisodes] = useState([]);

    const appliedQueryParamsRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => window.scrollTo(0, 0), 100);
        return () => clearTimeout(timer);
    }, [mediaId, mediaType]);

    useEffect(() => {
        if (!mediaId || !mediaType) return;

        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                setDetails(null);
                setSeasonEpisodes([]);

                const data = isMovie
                    ? await fetchMovieDetails(mediaId)
                    : await fetchTVShowDetails(mediaId);

                if (cancelled) return;
                setDetails(data);

                if (!isMovie) {
                    const firstAvailable = data?.seasons?.find((s) => s.season_number > 0);
                    const defaultSeason = firstAvailable ? firstAvailable.season_number : 1;
                    setSeason(defaultSeason);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Unable to load details.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [mediaId, mediaType, isMovie]);

    
    useEffect(() => {
        if (!mediaId || isMovie) return;
        if (appliedQueryParamsRef.current === mediaId) return;

        const params = new URLSearchParams(location.search);
        const querySeason = Number(params.get("season"));
        const queryEpisode = Number(params.get("episode"));

        if (Number.isInteger(querySeason) && querySeason > 0) {
            setSeason(querySeason);
        }
        if (Number.isInteger(queryEpisode) && queryEpisode > 0) {
            setEpisode(queryEpisode);
        }

        appliedQueryParamsRef.current = mediaId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaId, isMovie]);

    
    useEffect(() => {
        if (!mediaId || isMovie) return;

        let cancelled = false;
        const load = async () => {
            try {
                const data = await fetchSeasonDetails(mediaId, season);
                if (cancelled) return;

                setSeasonEpisodes(data || []);

                setEpisode((prevEpisode) => {
                    if (data?.length > 0 && !data.find((ep) => ep.episode_number === prevEpisode)) {
                        return data[0].episode_number;
                    }
                    return prevEpisode;
                });
            } catch (err) {
                console.error(err);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [mediaId, season, isMovie]);

    useEffect(() => {
        if (!mediaId || !mediaType) return;

        let cancelled = false;
        const loadRecommendations = async () => {
            try {
                const data = isMovie
                    ? await fetchMovieRecommendations(mediaId)
                    : await fetchTVRecommendations(mediaId);
                if (!cancelled) {
                    setRecommendations(data || []);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadRecommendations();
        return () => {
            cancelled = true;
        };
    }, [mediaId, mediaType, isMovie]);

    const embedUrls = useMemo(
        () => getEmbedUrls({ id: mediaId, type: mediaType, season, episode }),
        [mediaId, mediaType, season, episode]
    );

    const selectedServer = EMBED_SERVERS.find((server) => server.id === serverId) || EMBED_SERVERS[0];
    const embedUrl = isMovie
        ? `${selectedServer.movie}/${mediaId}`
        : `${selectedServer.tv}/${mediaId}/${season}/${episode}`;

    const changeEpisode = (value) => {
        setEpisode((prev) => {
            const next = prev + value;
            if (next < 1) return 1;
            const maxEpisode = seasonEpisodes?.reduce(
                (max, ep) => Math.max(max, ep.episode_number || 0),
                1
            );
            if (maxEpisode && next > maxEpisode) return maxEpisode;
            return next;
        });
    };

    const changeSeason = (value) => {
        const next = season + value;
        if (!details?.seasons) return;
        const minSeason = 1;
        const maxSeason = details.seasons.length;
        if (next < minSeason || next > maxSeason) return;
        setSeason(next);
    };

    const hasEpisodeControls = !isMovie && seasonEpisodes.length > 0;

    const title = isMovie ? details?.title : details?.name;
    const year = isMovie
        ? details?.release_date?.split("-")[0]
        : details?.first_air_date?.split("-")[0];

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate("/");
    };

    if (!mediaId || !mediaType) {
        return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Invalid content.</div>;
    }

    if (loading) {
        return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading content...</div>;
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <div className="text-center max-w-lg px-4">
                    <p className="text-lg font-semibold">{error || "Failed to load watch content."}</p>
                    <button
                        onClick={handleBack}
                        className="mt-6 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full text-white"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-14">
            <div className="relative overflow-hidden pt-6">
                <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none" />

                <div className="mx-auto w-full max-w-screen-2xl px-3 pt-16 sm:px-6 sm:pt-20 lg:px-8 xl:px-10">
                    <button
                        onClick={handleBack}
                        className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15 sm:mb-6"
                    >
                        ← Back
                    </button>

                    <div className={`grid items-start gap-6 md:gap-8 lg:gap-10 ${isMovie ? "grid-cols-1" : "xl:grid-cols-[1.7fr_0.8fr]"}`}>
                        {/* MAIN CONTENT: player + about/details */}
                        <div className="min-w-0 space-y-6">
                            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/80 shadow-xl">
                                <div className="relative aspect-video w-full overflow-hidden bg-black">
                                    <iframe
                                        key={`${mediaType}-${mediaId}-${serverId}-${season}-${episode}`}
                                        src={embedUrl}
                                        title="Watch player"
                                        className="h-full w-full"
                                        allowFullScreen
                                        onLoad={(e) => {
                                            // Prevent iframe from stealing focus and scrolling page
                                            setTimeout(() => {
                                                window.scrollTo(0, 0);
                                            }, 50);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-end md:justify-between">
                                    <div className="min-w-0">
                                        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
                                        <p className="mt-2 text-xs text-neutral-400 sm:text-sm">
                                            {year} • {isMovie ? "Movie" : "TV Series"}
                                        </p>
                                    </div>

                                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
                                        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 sm:min-w-[190px] sm:w-auto">
                                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Server</p>
                                            <select
                                                value={serverId}
                                                onChange={(e) => setServerId(e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white"
                                            >
                                                {EMBED_SERVERS.map((server) => (
                                                    <option key={server.id} value={server.id}>
                                                        {server.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {hasEpisodeControls && (
                                            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 sm:w-auto">
                                                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Episode</p>
                                                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                                                    <button
                                                        onClick={() => changeEpisode(-1)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="min-w-[36px] text-center text-lg font-semibold">{episode}</span>
                                                    <button
                                                        onClick={() => changeEpisode(1)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-3xl border border-white/10 bg-black/80 p-4 sm:p-6">
                                    <h2 className="text-xl font-semibold">About</h2>
                                    <p className="mt-4 text-neutral-300 leading-relaxed">
                                        {details?.overview || "No description available."}
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-black/80 p-6">
                                    <h2 className="text-xl font-semibold">Details</h2>
                                    <div className="mt-4 space-y-3 text-sm text-neutral-400">
                                        <p>
                                            <span className="font-semibold text-white">Genre:</span>{" "}
                                            {details?.genres?.map((g) => g.name).join(", ")}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Rating:</span>{" "}
                                            {details?.vote_average?.toFixed(1) || "N/A"}
                                        </p>
                                        {!isMovie && (
                                            <>
                                                <p>
                                                    <span className="font-semibold text-white">Seasons:</span>{" "}
                                                    {details?.number_of_seasons || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold text-white">Episodes:</span>{" "}
                                                    {details?.number_of_episodes || "N/A"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR: season selector + full episode guide (TV only) */}
                        {!isMovie && (
                            <div className="flex h-full flex-col gap-6 lg:sticky lg:top-24">
                                <div className="rounded-3xl border border-white/10 bg-black/80 p-4 sm:p-6">
                                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Season</p>
                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <button
                                            onClick={() => changeSeason(-1)}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10"
                                        >
                                            −
                                        </button>

                                        <select
                                            value={season}
                                            onChange={(e) => setSeason(Number(e.target.value))}
                                            className="w-full flex-1 rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white"
                                        >
                                            {details?.seasons?.filter(s => s.season_number > 0).map((s) => (
                                                <option key={s.id || s.season_number} value={s.season_number}>
                                                    {s.name || `Season ${s.season_number}`}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={() => changeSeason(1)}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {seasonEpisodes.length > 0 && (
                                    <div className="flex h-[320px] flex-col rounded-3xl border border-white/10 bg-black/80 p-4 sm:h-[420px] sm:p-6">
                                        <h2 className="text-xl font-semibold">Episode Guide</h2>
                                        <div className="scrollbar-hide mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                                            {seasonEpisodes.map((ep) => (
                                                <button
                                                    key={ep.id || ep.episode_number}
                                                    onClick={() => setEpisode(ep.episode_number)}
                                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${ep.episode_number === episode ? "border-red-600 bg-red-600/10" : "border-white/10 bg-white/5"}`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-semibold">Ep {ep.episode_number}</span>
                                                        <span className="text-sm text-neutral-400">{ep.runtime ? `${ep.runtime}m` : "--"}</span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                                                        {ep.name || ep.overview || "No title"}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RECOMMENDATIONS*/}
                    {recommendations.length > 0 && (
                        <section className="mt-10 rounded-3xl border border-white/10 bg-black/80 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold  ">Recomendations</h2>
                                    <p className="text-sm text-neutral-500">More picks based on this {isMovie ? "movie" : "TV Show"}.</p>
                                </div>
                                <button
                                    onClick={handleBack}
                                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                                >
                                    Browse more
                                </button>
                            </div>

                            <div className="mt-6 flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory custom-scrollbar">
                                {recommendations.slice(0, 6).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => openMedia(item.id, isMovie ? "movie" : "tv")}
                                        className="group min-w-[140px] max-w-[140px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70 text-left transition hover:border-red-600/50 sm:min-w-[180px] sm:max-w-[180px] md:min-w-[190px] md:max-w-[190px]"
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={getImageUrl(item.poster_path, "w500")}
                                                alt={item.title || item.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-white line-clamp-2">
                                                {item.title || item.name}
                                            </h3>
                                            <p className="mt-2 text-sm text-neutral-500">
                                                {(item.release_date || item.first_air_date || "").split("-")[0] || "Unknown"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <style>{`
                .scrollbar-hide {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

export default WatchPage;