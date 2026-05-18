import React, { useRef, useState } from "react";
import { getImageUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";

function MovieSlider({
  title,
  items = [],
  subtitle = "",
  id,
  type = "movie", // "movie" or "tv"
}) {
  const sliderRef = useRef(null);
  const { openMedia } = useMovies();




  const [activeIndex, setActiveIndex] = useState(0);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  // SCROLL BUTTONS
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

  // ACTIVE CARD TRACKING
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const children = Array.from(container.children);

    const containerCenter =
      container.scrollLeft + container.offsetWidth / 2;

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

  const loopedItems = [...items, ...items];

  return (
    <section
      id={id}
      className="py-16 bg-gradient-to-b from-black via-neutral-950 to-black text-white relative overflow-hidden"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.10),transparent_70%)] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90 pointer-events-none" />

      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-12">

          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-[0.18em]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-neutral-400 text-sm md:text-base mt-2 italic opacity-80">
                {subtitle}
              </p>
            )}
          </div>

          {/* SCROLL BUTTONS */}
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
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex space-x-6 pb-6 overflow-x-auto scroll-smooth snap-x cursor-grab scrollbar-hide"
          onMouseDown={startDrag}
          onMouseLeave={stopDrag}
          onMouseUp={stopDrag}
          onMouseMove={onDrag}
        >
          {Array.isArray(loopedItems) && loopedItems.length > 0 ? (
            loopedItems.map((item, index) => {
              const isMovie = type === "movie";


              const title = isMovie ? item.title : item.name;
              const year = (item.release_date || item.first_air_date)
                ? (item.release_date || item.first_air_date).split("-")[0]
                : "N/A";

              return (
                <div
                  key={`${item?.id}-${index}`}
                  onClick={() => openMedia(item.id, type)}
                  className={`min-w-[200px] md:min-w-[260px] snap-start relative group cursor-pointer transition-all duration-500 ${activeIndex === index
                    ? "scale-100 z-20"
                    : "scale-95 opacity-70"
                    }`}
                >
                  <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg group-hover:shadow-red-500/30 transition">

                    {/* IMAGE */}
                    <div className="relative aspect-[2/3]">
                      <img
                        src={getImageUrl(item.poster_path, "w500")}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">

                        <div className="space-y-2">

                          {/* RATING */}
                          <div className="flex justify-between text-sm">
                            <span className="text-yellow-400">
                              ⭐ {item.vote_average?.toFixed(1) || "N/A"}
                            </span>

                            <span className="text-white/70">
                              {year}
                            </span>
                          </div>

                          {/* BUTTON */}
                          <button onClick={() => openMedia(item.id, type)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm"
                          >
                            View Details
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TITLE */}
                  <div className="mt-3 px-1">
                    <h3 className="text-white text-sm truncate">
                      {title}
                    </h3>
                  </div>

                </div>
              );
            })
          ) : (
            <p className="text-neutral-400">No content available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MovieSlider;