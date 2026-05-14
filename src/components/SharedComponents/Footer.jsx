import React from "react";

function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


                    <div>
                        <a href="/" className="inline-block mb-6">
                            <span className="text-2xl font-bold">
                                <span className="text-brand-red">CINE</span>
                                <span className="text-white">VERSE</span>
                            </span>
                        </a>

                        <p className="mb-4 text-sm">
                            Discover and explore the latest movies from around the world.
                            CineVerse gives you access to a vast collection of films across all genres.
                        </p>

                        <div className="flex space-x-4">
                            {/* Twitter */}
                            <a href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l12.966 15.644z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                            </a>

                            {/* Facebook */}
                            <a href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05H7.9V12h2.6V9.8c0-2.6 1.55-4.05 3.92-4.05 1.13 0 2.32.2 2.32.2v2.55h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.9h-2.4v7.05A10 10 0 0 0 22 12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-yellow-500">Home</a></li>
                            <li><a href="#trending" className="hover:text-yellow-500">Trending</a></li>
                            <li><a href="#popular" className="hover:text-yellow-500">Popular</a></li>
                            <li><a href="#top-rated" className="hover:text-yellow-500">Top Rated</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Browse by Genre</a></li>
                        </ul>
                    </div>

                    {/* RESOURCES */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-yellow-500">About</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Contact</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Blog</a></li>
                            <li><a href="#" className="hover:text-yellow-500">FAQ</a></li>
                            <li><a href="#" className="hover:text-yellow-500">Help Center</a></li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">
                            Stay up to date with the latest movies and news
                        </p>

                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="w-full bg-neutral-800 border-neutral-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50 text-sm"
                            />

                            <button className="w-full bg-red-700 hover:bg-yellow-500 text-white py-2 rounded-lg transition-all text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row justify-between">
                    <p className="text-xs">
                        &copy; CineVerse. All rights reserved.{" "}
                        <span className="hidden md:inline"> </span>
                        Powered by{" "}
                        <a href="#" className="text-yellow-500 hover:text-yellow-400">
                            TMDB API
                        </a>
                    </p>

                    <div className="flex space-x-4 mt-4 md:mt-0 text-xs">
                        <a href="#" className="hover:text-yellow-500">Privacy Policy</a>
                        <a href="#" className="hover:text-yellow-500">Terms of Service</a>
                        <a href="#" className="hover:text-yellow-500">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;