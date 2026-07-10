import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 text-neutral-400">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">

          <div>
            <Link to="/" className="mb-4 inline-block">
              <span className="text-2xl font-bold">
                <span className="text-brand-red">CINE</span>
                <span className="text-white">VERSE</span>
              </span>
            </Link>

            <p className="mb-3 text-sm leading-6 hidden sm:block">
              Discover and explore the latest movies from around the world. CineVerse gives you access to a vast collection of films across all genres.
            </p>

            <div className="flex items-center gap-3">
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="text-neutral-500 hover:text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l12.966 15.644z" />
                </svg>
              </a>

              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-neutral-500 hover:text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </a>

              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-neutral-500 hover:text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05H7.9V12h2.6V9.8c0-2.6 1.55-4.05 3.92-4.05 1.13 0 2.32.2 2.32.2v2.55h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.9h-2.4v7.05A10 10 0 0 0 22 12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-yellow-500">Home</Link></li>
              <li><Link to="/#trending" className="transition-colors hover:text-yellow-500">Trending</Link></li>
              <li><Link to="/#popular" className="transition-colors hover:text-yellow-500">Popular</Link></li>
              <li><Link to="/#top-rated" className="transition-colors hover:text-yellow-500">Top Rated</Link></li>
              <li><Link to="/" className="transition-colors hover:text-yellow-500">Browse by Genre</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-yellow-500">About</Link></li>
              <li><a href="mailto:contact@cineverse.com" className="transition-colors hover:text-yellow-500">Contact</a></li>
              <li><Link to="/tv-show" className="transition-colors hover:text-yellow-500">TV Shows</Link></li>
              <li><Link to="/favorites" className="transition-colors hover:text-yellow-500">Favorites</Link></li>
              <li><Link to="/#trending" className="transition-colors hover:text-yellow-500">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-3 text-sm hidden sm:block">Stay up to date with the latest movies and news.</p>

            <form className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none"
                />

                <button
                    type="button"
                    className="w-full rounded-lg bg-red-700 px-3 py-2 text-sm text-white transition-all hover:bg-yellow-500 sm:w-auto"
                >
                    Subscribe
                </button>
            </form>
          </div>

        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-800 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">
            &copy; CineVerse. All rights reserved. Powered by {" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-yellow-500 hover:text-yellow-400">
              TMDB API
            </a>
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <a href="/" className="transition-colors hover:text-yellow-500">Privacy Policy</a>
            <a href="/" className="transition-colors hover:text-yellow-500">Terms of Service</a>
            <a href="/" className="transition-colors hover:text-yellow-500">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
