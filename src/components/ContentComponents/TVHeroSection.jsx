import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";

function TVHeroSection() {
    const { trendingTV, loading, addToFavorites, openPlayer } = useMovies();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedShow, setSelectedShow] = useState(null);

    const featuredTV = trendingTV?.slice(0, 5) || [];

    useEffect(() => {
        if (loading || featuredTV.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredTV.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [loading, featuredTV.length]);

    useEffect(() => {
        if (featuredTV.length > 0) {
            setSelectedShow(featuredTV[currentSlide]);
        }
    }, [currentSlide, featuredTV]);

    if (loading || featuredTV.length === 0) {
        return (
            <div className="relative w-full h-screen flex items-center justify-center bg-neutral-900">
                <div className="animate-pulse text-white/60">
                    Loading TV shows...
                </div>
            </div>
        );
    }

    const currentShow = featuredTV[currentSlide];

    const formatRating = (rating) =>
        rating ? (Math.round(rating * 10) / 10).toFixed(1) : "N/A";

    return (
        <div className="relative w-full h-screen overflow-hidden">

            {/* BACKGROUND */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                    backgroundImage: `url(${getImageUrl(
                        currentShow?.backdrop_path,
                        "original"
                    )})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-end sm:items-center z-10 container mx-auto px-4 sm:px-8 pb-16 sm:pb-0">

                <div className="max-w-full sm:max-w-3xl text-center sm:text-left">

                    {/* TOP META */}
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">

                        <span className="bg-brand-red text-white text-[10px] sm:text-xs px-2 py-1 rounded-sm">
                            FEATURED TV
                        </span>

                        <div className="flex items-center gap-1 text-yellow-400">
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
                            </svg>

                            <span className="text-xs sm:text-sm text-white">
                                {currentShow?.vote_average
                                    ? formatRating(currentShow.vote_average)
                                    : "N/A"}
                            </span>
                        </div>

                        <span className="text-neutral-300 text-xs sm:text-sm">
                            {currentShow?.first_air_date || "Unknown"}
                        </span>

                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl sm:text-5xl font-bold text-white mb-4">
                        {selectedShow?.name}
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="text-neutral-300 text-sm sm:text-lg mb-6 line-clamp-3">
                        {selectedShow?.overview || "No overview available."}
                    </p>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* WATCH NOW */}
                        <button
                            onClick={() => {
                                openPlayer({
                                    id: currentShow?.id,
                                    type: "tv",
                                    title: currentShow?.title,
                                    poster: currentShow?.poster_path,
                                });
                            }}
                            className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Now
                        </button>

                        {/* ADD TO WATCHLIST */}
                        <button
                            onClick={() => addToFavorites(currentShow, "tv")}

                            className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add to Watch List
                        </button>

                    </div>
                </div>
            </div>

            {/* DOT NAV */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {featuredTV.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 w-8 rounded-full transition-all ${index === currentSlide ? "bg-red-600" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}

export default TVHeroSection;