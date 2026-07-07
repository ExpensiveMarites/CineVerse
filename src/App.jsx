import React from "react";
import { Routes, Route } from "react-router-dom";

import MovieContent from "./pages/MovieContent";
import NavBar from "./components/SharedComponents/NavBar";
import Footer from "./components/SharedComponents/Footer";
import ScrollToTop from "./components/SharedComponents/ScrollToTop";
import ScrollToHash from "./components/SharedComponents/ScrollToHash";
import GenrePages from "./pages/GenrePages";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailsRoot from "./components/SharedComponents/MovieDetailsRoot";
import TVShowContent from "./pages/TVShowContent";
import MediaGenrePage from "./pages/MediaGenrePage";
import WatchPage from "./pages/WatchPage";

function App() {
  return (
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
          <Route path="/watch/:mediaType/:id" element={<WatchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
        <MovieDetailsRoot />
      </main>

      <Footer />
    </div>
  );
}

export default App;
