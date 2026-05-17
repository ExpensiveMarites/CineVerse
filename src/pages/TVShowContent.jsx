import React from "react";
import GenreSection from "../components/ContentComponents/GenreSection";
import TVHeroSection from "../components/ContentComponents/TVHeroSection";
import MovieSlider from "../components/ContentComponents/MovieSlider";
import { useMovies } from "../context/MoviesContext";
import TVGenreSection from "../components/ContentComponents/TVGenreSection";

function TVShowContent() {
    const {
        trendingTV,
        popularTV,
        topRatedTV,
        selectedTVId,
        closeTV,
        error,
    } = useMovies();

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
                <div className="text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>

                    <h2 className="text-2xl font-bold mt-4">Error Loading TV Shows</h2>
                    <p className="mt-2 text-neutral-400">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>

            <TVHeroSection />

            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950">

                {/* TRENDING TV */}
                <MovieSlider
                    title="Trending TV Shows"
                    subtitle="What everyone is binge-watching"
                    items={trendingTV}
                    id="trending-tv"
                    type="tv"
                />

                {/* POPULAR TV */}
                <MovieSlider
                    title="Popular TV Shows"
                    subtitle="Most watched series right now"
                    items={popularTV}
                    id="popular-tv"
                    type="tv"
                />


                <TVGenreSection />

                {/* TOP RATED TV */}
                <MovieSlider
                    title="Top Rated TV Shows"
                    subtitle="Highest rated series of all time"
                    items={topRatedTV}
                    id="top-rated-tv"
                    type="tv"
                />

                {/* TV DETAIL MODAL */}
                {selectedTVId && (
                    <div>
                        {/* Replace this later with TVShowDetail component */}
                        <p className="text-white">
                            TV Detail Modal Here (ID: {selectedTVId})
                        </p>
                    </div>
                )}

            </div>
        </>
    );
}

export default TVShowContent;