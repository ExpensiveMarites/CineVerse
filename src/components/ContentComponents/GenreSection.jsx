import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../../context/MoviesContext";
import { fetchMoviesByGenre, getImageUrl } from "../../services/Api";

function GenreSection() {

  const { genres, loading, openMedia } = useMovies();

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // drag state
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [loadingGenreMovies, setLoadingGenreMovies] = useState(false);


  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (!loading && genres.length > 0) {
      setSelectedGenre(genres[0]);
    }
  }, [loading, genres]);

  useEffect(() => {
    let cancelled = false;

    const loadGenreMovies = async () => {
      if (!selectedGenre) return;

      setLoadingGenreMovies(true);

      const movies = await fetchMoviesByGenre(selectedGenre.id);

      if (cancelled) return;

      
      setGenreMovies(movies || []);

      
      setVisibleCount(12);

      setLoadingGenreMovies(false);
    };

    loadGenreMovies();

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

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => el.removeEventListener("wheel", handleWheel);
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

  if (loading || !selectedGenre) {
    return (
      <section className="py-16 bg-black relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15),transparent_60%)] animate-pulse" />
        <div className="absolute inset-0 opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(255,0,0,0.4)]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatRating = (rating) =>
    (Math.round(rating * 10) / 10).toFixed(1);

  return (
    <section className="py-16 bg-gradient-to-b from-black via-neutral-950 to-black text-white relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_65%)] animate-pulse pointer-events-none" />
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        <h2 className="
          text-2xl md:text-4xl font-bold
          text-white mb-6
          tracking-wide
          drop-shadow-[0_0_20px_rgba(255,0,0,0.25)]
        ">
          Browse by Genre
        </h2>

        {/* GENRE SCROLL */}
        <div className="mb-10">
          <div
            ref={scrollRef}
            className={`
              flex space-x-3 overflow-x-auto pb-3 scrollbar-hide select-none
              transition-all duration-300
              ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            `}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {genres.slice(0, 21).map((gen) => (
              <button
                key={gen.id}
                onClick={() => setSelectedGenre(gen)}
                className={`
                  px-4 py-2 rounded-md text-sm whitespace-nowrap
                  transition-all duration-300
                  border border-white/10
                  backdrop-blur-md
                  hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,0,0,0.25)]
                  ${selectedGenre?.id === gen.id
                    ? "bg-red-600 text-white shadow-[0_0_25px_rgba(255,0,0,0.35)]"
                    : "bg-neutral-900/60 hover:bg-neutral-800"
                  }
                `}
              >
                {gen.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOADER */}
        {loadingGenreMovies && (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.4)]"></div>
            </div>
          </div>
        )}

        {/* MOVIES GRID */}
        {!loadingGenreMovies && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">

              {genreMovies.slice(0, visibleCount).map((movie) => (
                <div
                  key={movie.id}
                  className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
                  onClick={() => openMedia(movie.id, "movie")}
                >

                  <div className="
                    relative rounded-xl overflow-hidden
                    bg-neutral-900
                    shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                    group-hover:shadow-[0_25px_80px_rgba(255,0,0,0.25)]
                    transition-all duration-500
                  ">

                    <div className="aspect-[2/3]">

                      <img
                        src={
                          movie.poster_path
                            ? getImageUrl(movie.poster_path, "w500")
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title}
                        className="
                          w-full h-full object-cover
                          transition-all duration-700
                          group-hover:scale-110 group-hover:brightness-75
                        "
                      />

                      <div className="
                        absolute inset-0
                        bg-gradient-to-t from-black via-black/40 to-transparent
                        opacity-0 group-hover:opacity-100
                        transition-all duration-500
                        flex flex-col justify-end p-3
                      ">
                        <button className="
                          mt-2 w-full bg-red-600 hover:bg-red-700
                          text-white py-2 rounded-md text-xs
                          shadow-[0_0_20px_rgba(255,0,0,0.3)]
                          transition-all duration-300
                        ">
                          View Details
                        </button>
                      </div>

                    </div>
                  </div>

                  <div className="mt-2 px-1">
                    <h3 className="text-white text-sm font-medium truncate opacity-90 group-hover:opacity-100 transition">
                      {movie.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <svg className="= text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        </svg>
                        <div className="flex items-center gap-1">

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
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

                          <span className="text-yellow-400 text-xs font-medium leading-none">
                            {formatRating(movie.vote_average)}
                          </span>

                        </div>
                      </div>

                      <span className="text-neutral-400 text-xs">
                        {movie.release_date?.split("-")[0]}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>


            {visibleCount < genreMovies.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => navigate(`/genre/movie/${selectedGenre.id}`)}
                  className="
                  relative px-8 py-3 rounded-full
                  bg-gradient-to-r from-red-600 to-red-800
                  text-white text-sm md:text-base font-semibold
                  tracking-wide
                  shadow-[0_0_30px_rgba(255,0,0,0.4)]
                  hover:scale-105
                  transition-all duration-300
                  overflow-hidden"
                >
                  <span className="relative z-10">Show More</span>

                  <div className="
                  absolute inset-0
                  bg-white/10 blur-xl opacity-0
                  hover:opacity-100
                  transition duration-500"
                  />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

export default GenreSection;
