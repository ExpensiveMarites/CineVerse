import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, X, Menu, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchSearchMovies, getImageUrl, fetchGenres } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const searchContainerRef = useRef(null);

  const { openMovie, favorites } = useMovies();

  const [genres, setgenres] = useState([]);
  const navigate = useNavigate();


  // scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setIsSearching(true);
      const results = await fetchSearchMovies(searchQuery);
      setSearchResults(results || []);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delay);
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

  useEffect(() => {
    const loadGenres = async () => {
      const data = await fetchGenres();
      setgenres(data);
    }
    loadGenres();
  }, []);

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
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-black tracking-tighter cursor-pointer">
            <span className="text-brand-red">CINE</span>
            <span className="text-white">VERSE</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white">


            <Link to="/" className="hover:text-brand-red transition">
              Home
            </Link>

            <a href="/#trending" className="hover:text-brand-red transition">
              Trending
            </a>
            <a href="/#popular" className="hover:text-brand-red transition">
              Popular
            </a>
            <a href="/#top-rated" className="hover:text-brand-red transition">
              Top Rated
            </a>

            <div className="relative group">
              <span className="hover:text-brand-red transition cursor-pointer">
                Genre
              </span>

              <div className="absolute left-0 mt-2 min-w-[450px] bg-neutral-900 text-white rounded-xl shadow-xl
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               translate-y-2 group-hover:translate-y-0
               transition-all duration-300 z-50 p-4">

                <p className="text-red-600 ">Browse Genres</p>
                <ul className="grid grid-cols-4 ">
                  {genres.map((genre) => (
                    <li
                      key={genre.id}
                      onClick={() => navigate(`/genre/${genre.id}`)}
                      className="px-3 py-2 rounded-md  hover:bg-red-700 cursor-pointer text-sm text-center whitespace-nowrap"
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              </div>

            </div>


            {/* <div className="relative">
              <button
                onClick={() => {
                  if (isTablet) {
                    navigate(
                      genres.length > 0 ? `/genre/${genres[0].id}` : "/genre"
                    );
                    setShowMobileMenu(false);
                  }
                }}
                className="hover:text-brand-red transition cursor-pointer"
              >
                Genre
              </button>

              
              <AnimatePresence>
                {showGenreDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 min-w-[450px] bg-neutral-900 text-white rounded-xl shadow-xl z-50 p-4"
                  >

                    <p className="text-red-600">Browse Genres</p>

                    <ul className="grid grid-cols-4">
                      {genres.map((genre) => (
                        <li
                          key={genre.id}
                          onClick={() => {
                            navigate(`/genre/${genre.id}`);
                            setShowGenreDropdown(false);
                          }}
                          className="px-3 py-2 rounded-md hover:bg-red-700 cursor-pointer text-sm text-center whitespace-nowrap"
                        >
                          {genre.name}
                        </li>
                      ))}
                    </ul>

                  </motion.div>
                )}
              </AnimatePresence> */}

            {/* </div> */}
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

          {/* SEARCH MODAL (unchanged) */}
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
                              <li key={movie.id} className="hover:bg-neutral-700 transition">
                                <button
                                  onClick={() => {
                                    openMovie(movie.id);
                                    setShowSearchModal(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 w-full text-left p-3"
                                >
                                  <img
                                    src={getImageUrl(movie.poster_path, "w92")}
                                    className="w-10 h-14 rounded object-cover bg-neutral-700"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-white truncate">
                                      {movie.title}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                      {movie.release_date}
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

            <a href="/#trending" className="block px-4 py-3 text-white">
              Trending
            </a>
            <a href="/#popular" className="block px-4 py-3 text-white">
              Popular
            </a>
            <a href="/#top-rated" className="block px-4 py-3 text-white">
              Top Rated
            </a>
            <Link
              to={genres.length > 0 ? `/genre/${genres[0].id}` : "#"}
              className="block px-4 py-3 text-white"
              onClick={() => setShowMobileMenu(false)}
            >
              Genre
            </Link>


          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav >
  );
}

export default Navbar;