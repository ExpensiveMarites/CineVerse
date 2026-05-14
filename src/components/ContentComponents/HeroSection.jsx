import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const { trendingMovies, loading, addToFavorites } = useMovies();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const featuredMovies = trendingMovies?.slice(0, 5) || [];

  useEffect(() => {
    if (loading || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      const timeout = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 500);

      return () => clearTimeout(timeout);
    }, 8000);

    return () => clearInterval(interval);
  }, [loading, featuredMovies.length]);

  useEffect(() => {
    if (featuredMovies.length > 0) {
      setSelectedMovie(featuredMovies[currentSlide]);
    }
  }, [currentSlide, featuredMovies]);

  if (loading || featuredMovies.length === 0) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-neutral-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base">
            Loading movies...
          </p>
        </div>
      </div>
    );
  }

  // const [currentFavorites, setCurrentFavorites] = useState(0);
  // const navigate = useNavigate();

  // const handleFavorites = () => {
  //   navigate("/favorites")
  // }


  const currentMovie = featuredMovies[currentSlide];

  const formatRating = (rating) =>
    (Math.round(rating * 10) / 10).toFixed(1);

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${getImageUrl(
            currentMovie?.backdrop_path,
            "original"
          )})`,
        }}
      >
        {/* stronger overlay for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-end sm:items-center z-10 container mx-auto px-4 sm:px-8 pb-16 sm:pb-0">
        <div className="max-w-full sm:max-w-3xl transition-all duration-700 text-center sm:text-left">

          {/* TOP META */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="bg-brand-red text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-sm">
              FEATURED
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
                {currentMovie?.vote_average
                  ? formatRating(currentMovie.vote_average)
                  : "N/A"}
              </span>
            </div>

            <span className="text-neutral-400 hidden sm:inline">•</span>

            <span className="text-neutral-300 text-xs sm:text-sm">
              {currentMovie?.release_date || "Unknown"}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            {selectedMovie?.title || "Movie Title"}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-full sm:max-w-2xl line-clamp-3 md:line-clamp-4">
            {selectedMovie?.overview || "Movie Overview"}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">

            {/* WATCH NOW */}
            <button className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
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

            {/* WATCH LIST */}
            <button
              onClick={() => addToFavorites(currentMovie)}

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


      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center gap-1 sm:gap-2 z-10">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 w-6 sm:w-10 rounded-full transition-all ${index === currentSlide ? "bg-red-700" : "bg-white/40"
              }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSection;