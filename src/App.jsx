import React from "react";
import { Routes, Route } from "react-router-dom";

import MovieContent from "./pages/MovieContent";
import NavBar from "./components/SharedComponents/NavBar";
import Footer from "./components/SharedComponents/Footer";
import ScrollToTop from "./components/SharedComponents/ScrollToTop";
import ScrollToHash from "./components/SharedComponents/ScrollToHash";
import { MoviesProvider } from "./context/MoviesContext";
import GenrePages from "./pages/GenrePages";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailsRoot from "./components/SharedComponents/MovieDetailsRoot";
import GlobalPlayer from "./components/SharedComponents/GlobalPlayer";
import TVShowContent from "./pages/TVShowContent";
import MediaGenrePage from "./pages/MediaGenrePage";

function App() {
  return (
    <MoviesProvider>
      <div className="min-h-screen">
        <NavBar />
        <ScrollToHash /> <ScrollToTop />

        <main>
          <Routes>

            <Route path="/" element={<MovieContent />} />
            <Route path="tv-show" element={<TVShowContent />} />
            <Route
              path="/genre/movie/:genreId"
              element={<MediaGenrePage mediaType="movie" />}
            />

            <Route
              path="/genre/tv/:genreId"
              element={<MediaGenrePage mediaType="tv" />}
            />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          <MovieDetailsRoot />
          <GlobalPlayer />
        </main>

        <Footer />
      </div>
    </MoviesProvider>
  );
}

export default App;