import React from "react";
import { Routes, Route } from "react-router-dom";

import MovieContent from "./components/ContentComponents/MovieContent";
import NavBar from "./components/SharedComponents/NavBar";
import Footer from "./components/SharedComponents/Footer";
import ScrollToTop from "./components/SharedComponents/ScrollToTop";
import ScrollToHash from "./components/SharedComponents/ScrollToHash";
import { MoviesProvider } from "./context/MoviesContext";
import GenrePages from "./pages/GenrePages";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailsRoot from "./components/SharedComponents/MovieDetailsRoot";

function App() {
  return (
    <MoviesProvider>
      <div className="min-h-screen">
        <NavBar />
        <ScrollToHash /> <ScrollToTop />

        <main>
          <Routes>

            <Route path="/" element={<MovieContent />} />


            <Route path="/genre/:genreId" element={<GenrePages />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          <MovieDetailsRoot />
        </main>

        <Footer />
      </div>
    </MoviesProvider>
  );
}

export default App;