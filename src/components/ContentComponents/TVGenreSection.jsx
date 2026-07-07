import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useMovies } from "../../context/MoviesContext";

import {
    fetchTVByGenre,
    getImageUrl,
} from "../../services/Api";

function TVGenreSection() {

    const { tvGenres, loading, openMedia } = useMovies();

    const navigate = useNavigate();

    const scrollRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const [selectedGenre, setSelectedGenre] = useState(null);

    const [genreShows, setGenreShows] = useState([]);

    const [loadingGenreShows, setLoadingGenreShows] = useState(false);

    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        if (!loading && tvGenres.length > 0) {
            setSelectedGenre(tvGenres[0]);
        }
    }, [loading, tvGenres]);

    useEffect(() => {
        let cancelled = false;

        const loadShows = async () => {

            if (!selectedGenre) return;

            setLoadingGenreShows(true);

            const data = await fetchTVByGenre(selectedGenre.id);

            if (cancelled) return;

            setGenreShows(data || []);

            setVisibleCount(12);

            setLoadingGenreShows(false);
        };

        loadShows();

        return () => {
            cancelled = true;
        };

    }, [selectedGenre]);

    // wheel scroll
    useEffect(() => {

        const el = scrollRef.current;

        if (!el) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;

            e.preventDefault();

            el.scrollLeft += e.deltaY;
        };

        el.addEventListener("wheel", handleWheel, {
            passive: false,
        });

        return () =>
            el.removeEventListener("wheel", handleWheel);

    }, []);

    // drag scroll
    const handleMouseDown = (e) => {
        const el = scrollRef.current;

        setIsDragging(true);

        startX.current = e.clientX;

        scrollLeft.current = el.scrollLeft;
    };

    const handleMouseLeave = () => setIsDragging(false);

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {

        if (!isDragging) return;

        const el = scrollRef.current;

        e.preventDefault();

        const x = e.clientX;

        const walk = (x - startX.current) * 1.2;

        el.scrollLeft = scrollLeft.current - walk;
    };

    const formatRating = (rating) =>
        (Math.round(rating * 10) / 10).toFixed(1);

    return (
        <section className="py-16 bg-gradient-to-b from-black via-neutral-950 to-black text-white relative overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_65%)] animate-pulse pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                <h2 className="text-2xl md:text-4xl font-bold mb-6 tracking-wide">
                    Browse TV Shows by Genre
                </h2>

                {/* GENRES */}
                <div className="mb-10">

                    <div
                        ref={scrollRef}
                        className={`
              flex space-x-3 overflow-x-auto pb-3 scrollbar-hide select-none
              ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            `}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >

                        {tvGenres.slice(0, 21).map((genre) => (

                            <button
                                key={genre.id}
                                onClick={() => setSelectedGenre(genre)}
                                className={`
                  px-4 py-2 rounded-md text-sm whitespace-nowrap
                  border border-white/10
                  transition-all duration-300
                  ${selectedGenre?.id === genre.id
                                        ? "bg-red-600 text-white"
                                        : "bg-neutral-900/60 hover:bg-neutral-800"
                                    }
                `}
                            >
                                {genre.name}
                            </button>

                        ))}

                    </div>
                </div>

                {/* LOADER */}
                {loadingGenreShows && (
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* TV GRID */}
                {!loadingGenreShows && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">

                            {genreShows
                                .slice(0, visibleCount)
                                .map((show) => (

                                    <div
                                        key={show.id}
                                        onClick={() => openMedia(show.id, "tv")}
                                        className="group cursor-pointer hover:-translate-y-1 transition-all duration-500"
                                    >

                                        <div className="relative rounded-xl overflow-hidden bg-neutral-900">

                                            <div className="aspect-[2/3]">

                                                <img
                                                    src={
                                                        show.poster_path
                                                            ? getImageUrl(show.poster_path, "w500")
                                                            : "https://via.placeholder.com/500x750?text=No+Image"
                                                    }
                                                    alt={show.name}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-3">

                                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-xs">
                                                        View Details
                                                    </button>

                                                </div>

                                            </div>
                                        </div>

                                        {/* INFO */}
                                        <div className="mt-2 px-1">

                                            <h3 className="text-sm font-medium truncate">
                                                {show.name}
                                            </h3>

                                            <div className="flex items-center justify-between mt-2">

                                                <span className="text-yellow-400 text-xs">
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
                                                    </svg> {formatRating(show.vote_average)}
                                                </span>

                                                <span className="text-neutral-400 text-xs">
                                                    {show.first_air_date?.split("-")[0]}
                                                </span>

                                            </div>
                                        </div>

                                    </div>
                                ))}
                        </div>

                        {/* SHOW MORE */}
                        {visibleCount < genreShows.length && (
                            <div className="flex justify-center mt-10">

                                <button
                                    onClick={() => navigate(`/genre/tv/${selectedGenre.id}`)}
                                    className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    Show More
                                </button>

                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default TVGenreSection;
