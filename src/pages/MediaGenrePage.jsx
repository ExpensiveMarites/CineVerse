import React, { useEffect, useState, useRef } from "react";
import { useMovies } from "../context/MoviesContext";
import { fetchMoviesByGenre, fetchTVByGenre, getImageUrl } from "../services/Api";
import { useParams, useNavigate } from "react-router-dom";

function MediaGenrePage({ mediaType }) {
    const { genres, tvGenres, openMedia } = useMovies();
    const { genreId } = useParams();
    const navigate = useNavigate();

    const genreList =
        mediaType === "movie"
            ? genres || []
            : tvGenres || [];

    const selectedGenre = genreList?.find(
        (g) => g.id.toString() === genreId
    );

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filter, setFilter] = useState("popular");

    const sortMovies = (list, criteria) => {
        return [...list].sort((a, b) => {
            if (criteria === "rating") {
                return (b.vote_average || 0) - (a.vote_average || 0);
            }
            if (criteria === "year") {
                const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
                const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
                return dateB - dateA;
            }
            return (b.popularity || 0) - (a.popularity || 0);
        });
    };


    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            setPage(1);
            setHasMore(true);

            const data =
                mediaType === "movie"
                    ? await fetchMoviesByGenre(genreId, 1)
                    : await fetchTVByGenre(genreId, 1);

            setMovies(sortMovies(data || [], filter));
            setLoading(false);
        };

        loadMovies();
    }, [genreId]);

    // LOAD MORE
    const loadMoreMovies = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        const nextPage = page + 1;

        const data =
            mediaType === "movie"
                ? await fetchMoviesByGenre(genreId, nextPage)
                : await fetchTVByGenre(genreId, nextPage);

        if (!data || data.length === 0) {
            setHasMore(false);
            setLoadingMore(false);
            return;
        }

        setMovies((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            const newUnique = data.filter((m) => !ids.has(m.id));

            const sortedNewChunk = sortMovies(newUnique, filter);

            return [...prev, ...sortedNewChunk];
        });

        setPage(nextPage);
        setLoadingMore(false);
    };

    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        setMovies((prev) => sortMovies(prev, newFilter));
    };

    const handleMediaClick = (id) => {
        openMedia(id, mediaType);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMedia(id, mediaType);
        }
    };


    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const startDrag = (e) => {
        isDown.current = true;
        scrollRef.current.classList.add("cursor-grabbing");

        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const stopDrag = () => {
        isDown.current = false;
        scrollRef.current.classList.remove("cursor-grabbing");
    };

    const onDrag = (e) => {
        if (!isDown.current) return;

        e.preventDefault();

        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;

        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <section className="relative w-full min-h-screen bg-neutral-950 text-white flex flex-col lg:flex-row pt-16 md:pt-20 pb-10 lg:pb-16">


            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_50%)] animate-pulse" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" />
            </div>


            <aside className="sticky top-16 w-full lg:w-64 xl:w-72 flex-shrink-0 min-w-0 bg-neutral-950/80 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-white/5 lg:h-screen flex flex-col">

                <div className="hidden lg:block p-6 pb-4">
                    <h2 className="text-sm lg:text-base font-bold tracking-[0.35em] uppercase text-neutral-400 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-red-600 before:rounded-full">
                        Categories
                    </h2>
                </div>

                <div
                    ref={scrollRef}
                    onMouseDown={startDrag}
                    onMouseLeave={stopDrag}
                    onMouseUp={stopDrag}
                    onMouseMove={onDrag}
                    className="flex-1 min-h-0 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide cursor-grab select-none"
                >
                    <div className="flex w-max flex-nowrap lg:flex-col gap-2 sm:gap-3 lg:gap-2 px-3 sm:px-4 lg:px-6 py-3 lg:py-6 snap-x lg:snap-none">

                        {genreList.map((genre) => {
                            const isActive = genre.id.toString() === genreId;

                            return (
                                <button
                                    key={genre.id}
                                    onClick={() => navigate(`/genre/${mediaType}/${genre.id}`)}
                                    className={`
                                        flex-shrink-0 
                                        px-4 sm:px-5 lg:px-4
                                        py-2.5 sm:py-3 lg:py-3
                                        rounded-full lg:rounded-xl
                                        text-xs sm:text-sm lg:text-base
                                        font-medium whitespace-nowrap lg:whitespace-normal
                                        flex items-center justify-between
                                        transition-all duration-300 ease-out
                                        snap-start
                                        focus-visible:ring-2 focus-visible:ring-red-500
                                        ${isActive
                                            ? "bg-red-600 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] lg:translate-x-2"
                                            : "bg-white/5 lg:bg-transparent text-neutral-400 hover:text-white hover:bg-white/10"
                                        }
                                    `}
                                >
                                    <span className="truncate">{genre.name}</span>

                                    {isActive && (
                                        <span className="hidden lg:block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10">

                <header className="relative w-full h-[25vh] md:h-[30vh] lg:h-[35vh] flex flex-col justify-start pt-8 lg:pt-16 px-4 sm:px-6 lg:px-12 overflow-hidden bg-neutral-950 flex-shrink-0">

                    {!loading && movies[0]?.backdrop_path && (
                        <img
                            src={getImageUrl(movies[0].backdrop_path, "w1280")}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 transform-gpu transition-transform duration-[10s] ease-out hover:scale-105"
                            alt="background"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />

                    <div className="relative z-10 max-w-4xl lg:pt-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                            {selectedGenre?.name || "Genre"}
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg text-neutral-300 mt-3 md:mt-4 max-w-2xl leading-relaxed drop-shadow-md">
                            Explore our curated collection of {mediaType === "movie" ? "movies" : "TV shows"}{" "}
                            <span className="text-white font-medium">{selectedGenre?.name}</span>
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <select
                                value={filter}
                                onChange={handleFilterChange}
                                className="appearance-none bg-neutral-900 border border-white/10 text-white text-sm px-4 py-2 pr-10 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all cursor-pointer shadow-lg"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rating</option>
                                <option value="year">Newest First</option>
                            </select>
                        </div>
                    </div>
                </header>

                {/* GRID (UNCHANGED UI) */}
                <div className="w-full px-4 sm:px-6 lg:px-12 py-8 md:py-10 flex-1">

                    {loading ? (
                        <div className="w-full h-full min-h-[40vh] flex items-center justify-center">
                            <div className="w-14 h-14 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin shadow-[0_0_30px_rgba(220,38,38,0.5)]" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 items-start">

                                {movies.map((item) => {
                                    const year =
                                        item.release_date || item.first_air_date
                                            ? new Date(item.release_date || item.first_air_date).getFullYear()
                                            : "—";

                                    const rating = item.vote_average
                                        ? item.vote_average.toFixed(1)
                                        : "N/A";

                                    return (
                                        <article
                                            key={item.id}
                                            tabIndex={0}
                                            onClick={() => handleMediaClick(item.id)}
                                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                                            className="group relative flex flex-col gap-3 cursor-pointer outline-none animate-in fade-in zoom-in-95 duration-500 ease-out"
                                        >
                                            <div className="
                                                relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-neutral-900 
                                                shadow-[0_10px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/5
                                                transform-gpu transition-all duration-500 ease-out
                                                group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(220,38,38,0.25)] group-hover:ring-red-500/50
                                                group-focus-visible:-translate-y-2 group-focus-visible:shadow-[0_20px_40px_rgba(220,38,38,0.25)] group-focus-visible:ring-red-500
                                            ">
                                                <img
                                                    src={
                                                        item.poster_path
                                                            ? getImageUrl(item.poster_path, "w500")
                                                            : "https://via.placeholder.com/500x750?text=No+Image"
                                                    }
                                                    alt={item.title || item.name || "media"}
                                                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-[0.6] group-focus-visible:scale-110 group-focus-visible:brightness-[0.6]"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-end p-3 sm:p-4">
                                                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-200 mb-3 font-medium tracking-wide">
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
                                                            </svg> {rating}
                                                        </span>
                                                        <span className="bg-black/70 px-2 py-1 rounded-md">
                                                            {year}
                                                        </span>
                                                    </div>

                                                    <button className="w-full py-2 rounded-md text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="px-1 text-sm sm:text-base font-medium text-neutral-300 truncate transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                                                {item.title || item.name || "Untitled"}
                                            </h3>
                                        </article>
                                    );
                                })}

                            </div>

                            <div className="flex justify-center py-12">
                                {hasMore ? (
                                    <button
                                        onClick={loadMoreMovies}
                                        disabled={loadingMore}
                                        className="
                                            relative px-10 py-3.5 rounded-full text-sm font-bold tracking-wide uppercase
                                            text-white bg-gradient-to-r from-red-600 to-red-500
                                            shadow-[0_0_25px_rgba(220,38,38,0.35)]
                                            transition-all duration-300 ease-out outline-none
                                            hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]
                                            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:ring-red-500
                                            active:scale-95
                                            disabled:opacity-50 disabled:cursor-wait
                                            overflow-hidden
                                        "
                                    >
                                        {loadingMore ? "Loading..." : `Load More ${mediaType === "movie" ? "Movies" : "TV Shows"}`}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3 text-neutral-500 text-sm font-medium">
                                        <div className="w-10 h-px bg-white/10" />
                                        You've reached the end
                                        <div className="w-10 h-px bg-white/10" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </section>
    );
}

export default MediaGenrePage;