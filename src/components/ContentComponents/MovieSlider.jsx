import React, { useRef, useState } from "react";
import { getImageUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";

function MovieSlider({ title, movies = [], subtitle = "", id }) {
  const sliderRef = useRef(null);
  const { openMovie } = useMovies();

  const [activeIndex, setActiveIndex] = useState(0);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  // BUTTON SCROLL (UNCHANGED)
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  // DRAG SCROLL
  const startDrag = (e) => {
    isDown.current = true;
    sliderRef.current.classList.add("cursor-grabbing");

    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftPos.current = sliderRef.current.scrollLeft;
  };

  const stopDrag = () => {
    isDown.current = false;
    sliderRef.current.classList.remove("cursor-grabbing");
  };

  const onDrag = (e) => {
    if (!isDown.current) return;

    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    sliderRef.current.scrollLeft = scrollLeftPos.current - walk;
  };


  const handleScroll = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const children = Array.from(container.children);

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const loopedMovies = [...movies, ...movies];

  return (
    <section id={id} className="
      py-16 
      bg-gradient-to-b from-black via-neutral-950 to-black 
      text-white 
      relative overflow-hidden
    ">


      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.10),transparent_70%)] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90 pointer-events-none" />


      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-12">

          <div>
            <h2 className="
              text-3xl md:text-5xl
              font-extrabold
              tracking-[0.18em]
              uppercase
              text-white
              drop-shadow-[0_0_30px_rgba(255,0,0,0.25)]
            ">
              {title}
            </h2>

            {subtitle && (
              <p className="
                text-neutral-400 
                text-sm md:text-base 
                mt-2 italic 
                tracking-wide opacity-80
              ">
                {subtitle}
              </p>
            )}
          </div>


          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="
                p-2 rounded-full
                bg-black/40
                backdrop-blur-xl
                border border-white/10
                hover:bg-red-700
                hover:shadow-[0_0_25px_rgba(255,0,0,0.35)]
                text-white
                transition-all duration-300
              "
              aria-label="Scroll Left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="
                p-2 rounded-full
                bg-black/40
                backdrop-blur-xl
                border border-white/10
                hover:bg-red-700
                hover:shadow-[0_0_25px_rgba(255,0,0,0.35)]
                text-white
                transition-all duration-300
              "
              aria-label="Scroll Right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="
              flex space-x-6 pb-6
              snap-x overflow-x-auto scroll-smooth
              cursor-grab scrollbar-hide
              will-change-transform
            "
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={onDrag}
          >
            {Array.isArray(loopedMovies) && loopedMovies.length > 0 ? (
              loopedMovies.map((movie, index) => (
                <div
                  key={`${movie?.id}-${index}`}
                  onClick={() => openMovie(movie.id)}
                  className={`
                    min-w-[200px] md:min-w-[260px]
                    snap-start relative group cursor-pointer
                    transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${activeIndex === index ? "scale-100 z-20" : "scale-95 opacity-70"}
                  `}
                >
                  <div className="
                    rounded-2xl overflow-hidden
                    bg-neutral-900
                    shadow-[0_12px_50px_rgba(0,0,0,0.6)]
                    group-hover:shadow-[0_25px_80px_rgba(255,0,0,0.20)]
                    transition-all duration-500
                  ">

                    {/* IMAGE */}
                    <div className="relative aspect-[2/3]">
                      <img
                        src={getImageUrl(movie.poster_path, "w500")}
                        alt={movie.title}
                        className="
                          w-full h-full object-cover
                          transition-transform duration-700 ease-out
                          group-hover:scale-110 group-hover:brightness-75
                        "
                      />

                      {/* OVERLAY */}
                      <div className="
                        absolute inset-0
                        bg-gradient-to-t from-black via-black/40 to-transparent
                        opacity-0 group-hover:opacity-100
                        transition-all duration-500
                        flex flex-col justify-end p-4
                      ">

                        <div className="
                          space-y-3 
                          transform translate-y-6 
                          group-hover:translate-y-0 
                          transition-all duration-500
                        ">

                          <div className="flex items-center justify-between">
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
                              </svg> {movie.vote_average?.toFixed(1) || "N/A"}
                            </span>

                            <span className="text-neutral-300 text-sm">
                              {movie.release_date?.split("-")[0]}
                            </span>
                          </div>

                          <button
                            onClick={() => openMovie(movie.id)}
                            className="
                              w-full bg-red-600 hover:bg-red-700
                              text-white py-3 rounded-md text-sm
                              shadow-[0_0_25px_rgba(255,0,0,0.25)]
                              transition-all duration-300
                            "
                          >
                            View Details
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TITLE */}
                  <div className="mt-3 px-1">
                    <h3 className="
                      text-white text-sm font-medium truncate 
                      opacity-90 group-hover:opacity-100 
                      transition
                      tracking-wide
                    ">
                      {movie.title}
                    </h3>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-neutral-400">No movies available</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default MovieSlider;