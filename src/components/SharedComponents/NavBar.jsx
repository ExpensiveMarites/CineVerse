import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, X, Menu, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchSearchMovies, fetchSearchTVShows, getImageUrl, fetchGenres } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { genres, tvGenres, openMedia, favorites } = useMovies();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const searchContainerRef = useRef(null);

  const navigate = useNavigate();


  // scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;

    const delay = setTimeout(async () => {
      setIsSearching(true);

      try {
        const [movies, tv] = await Promise.all([
          fetchSearchMovies(query),
          fetchSearchTVShows(query)
        ]);

        const combined = [
          ...(movies || []).map(m => ({ ...m, mediaType: "movie" })),
          ...(tv || []).map(t => ({ ...t, mediaType: "tv" }))
        ];

        if (!cancelled) {
          setSearchResults(combined);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearchModal(false);
      }
    };

    if (showSearchModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showSearchModal]);



  const [isTablet, setIsTablet] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "glass py-5" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter cursor-pointer whitespace-nowrap">
            <span className="text-brand-red">CINE</span>
            <span className="text-white">VERSE</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-white">


            <Link to="/" className="hover:text-brand-red transition">
              Home
            </Link>

            <Link to="/" className="hover:text-brand-red transition">
              Movie
            </Link>

            <Link to="/tv-show" className="hover:text-brand-red transition">
              TV Shows
            </Link>

            <div className="relative group">
              <button
                onClick={() => isTablet && setShowGenreDropdown(!showGenreDropdown)}
                className="hover:text-brand-red transition cursor-pointer"
              >
                Genre
              </button>

              <div
                className={`absolute mt-2 w-[420px] lg:min-w-[500px] bg-neutral-900 text-white rounded-xl shadow-xl
                  transition-all duration-300 z-50 p-5 space-y-4lg:opacity-0 lg:invisible
                  lg:group-hover:opacity-100 lg:group-hover:visible
                  lg:translate-y-2 lg:group-hover:translate-y-0
                  ${isTablet ? "left-1/2 -translate-x-1/2" : "left-0"}
                  ${showGenreDropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}
                `}
              >

                {/* MOVIES */}
                <div>
                  <p className="text-red-600 mb-2 font-semibold">
                    Movie Genres
                  </p>

                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 mb-3">
                    {genres.map((genre) => (
                      <li
                        key={`movie-${genre.id}`}
                        onClick={() => {
                          navigate(`/genre/movie/${genre.id}`);
                          setShowGenreDropdown(false);
                        }}
                        className="px-2 lg:px-3 py-2 rounded-md hover:bg-red-700 cursor-pointer text-xs lg:text-sm text-center whitespace-nowrap truncate transition"
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TV */}
                <div>
                  <p className="text-yellow-400 mb-2 font-semibold mt-2">
                    TV Genres
                  </p>

                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
                    {tvGenres.map((genre) => (
                      <li
                        key={`tv-${genre.id}`}
                        onClick={() => {
                          navigate(`/genre/tv/${genre.id}`);
                          setShowGenreDropdown(false);
                        }}
                        className="px-2 lg:px-3 py-2 rounded-md hover:bg-yellow-500 cursor-pointer text-xs lg:text-sm text-center whitespace-nowrap truncate transition"
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">

          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 text-white hover:text-brand-red"
          >
            <Search size={22} />
          </button>


          <AnimatePresence>
            {showSearchModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24"
                onClick={() => setShowSearchModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl px-6"
                >
                  <div className="flex items-center bg-black/60 border border-white/10 rounded-xl px-4 py-4 gap-3">
                    <Search className="text-white/60 shrink-0" />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="w-full bg-transparent text-white outline-none text-lg"
                      autoFocus
                    />

                    <button
                      onClick={() => setShowSearchModal(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X />
                    </button>
                  </div>

                  <AnimatePresence>
                    {searchQuery.length > 0 && (
                      <motion.div className="mt-2 bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
                        {isSearching && (
                          <div className="p-4 text-center text-neutral-400 text-sm">
                            Searching...
                          </div>
                        )}

                        {!isSearching && searchResults.length > 0 && (
                          <ul className="divide-y divide-neutral-700 max-h-80 overflow-y-auto">
                            {searchResults.map((movie) => (
                              <li key={`${movie.mediaType}-${movie.id}`} className="hover:bg-neutral-700 transition">
                                <button
                                  onClick={() => {
                                    if (movie.mediaType === "tv") {
                                      openMedia(movie.id, "tv");
                                    } else {
                                      openMedia(movie.id, "movie");
                                    }

                                    setShowSearchModal(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 w-full text-left p-3"
                                >
                                  <img
                                    src={movie.poster_path ? getImageUrl(movie.poster_path, "w92") : "https://via.placeholder.com/92x138"}
                                    className="w-10 h-14 rounded object-cover bg-neutral-700"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-white truncate">
                                      {movie.title || movie.name}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                      {movie.release_date || movie.first_air_date}
                                    </p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => navigate("/favorites")}
            className="p-2 text-white hover:text-brand-red transition"
          >
            <div className="relative">
              <Heart size={22} />

              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </div>
          </button>


          <div className="flex items-center gap-2 pl-4 border-l border-white/20">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white"
          >
            {showMobileMenu ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div className="absolute top-full right-6 mt-3 w-52 bg-neutral-900 rounded-xl shadow-xl overflow-hidden md:hidden z-50">

            -
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-white hover:text-brand-red"
            >
              Home
            </Link>

            <a href="/" className="block px-4 py-3 text-white">
              Movie
            </a>
            <a href="/#popular" className="block px-4 py-3 text-white">
              TV Shows
            </a>

            <Link
              to="/genre/movie/28"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-white"
            >
              Movie Genres
            </Link>

            <Link
              to="/genre/tv/10759"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-white"
            >
              TV Genres
            </Link>


          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav >
  );
}

export default Navbar;
