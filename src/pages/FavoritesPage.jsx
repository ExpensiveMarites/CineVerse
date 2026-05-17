import { useMovies } from "../context/MoviesContext";
import { getImageUrl } from "../services/Api";
import { Heart, Trash2 } from "lucide-react";

function FavoritesPage() {
    const { favorites, openMedia, removeFromFavorites } = useMovies();


    const movieFavorites = favorites.filter(f => f.mediaType === "movie");
    const tvFavorites = favorites.filter(f => f.mediaType === "tv");

    const renderCard = (item) => (
        <div
            key={`${item.mediaType}-${item.id}`}
            className="relative group cursor-pointer"
        >
            {/* CARD */}
            <div
                onClick={() => openMedia(item.id, item.mediaType)}
                className="relative overflow-hidden rounded-2xl shadow-lg"
            >
                <img
                    src={
                        item.poster_path
                            ? getImageUrl(item.poster_path)
                            : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={item.title || item.name}
                    className="w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition" />

                {/* INFO */}
                <div className="absolute bottom-0 w-full p-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-yellow-400">
                        ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                    </span>

                    <span className="text-neutral-300">
                        {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                    </span>
                </div>

                {/* TITLE */}
                <div className="absolute bottom-8 p-3">
                    <h3 className="text-sm font-semibold line-clamp-2">
                        {item.title || item.name}
                    </h3>
                </div>
            </div>

            {/* REMOVE BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(item.id, item.mediaType);
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 
                p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-28 px-6 md:px-10 relative overflow-hidden pb-24 md:pb-32">

            {/* BACKGROUND */}
            <div className="absolute inset-0">
                <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-red-700/10 blur-[140px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black">
                        My Favorites
                    </h1>

                    <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent mx-auto my-4" />

                    <p className="text-neutral-400 text-sm md:text-base">
                        Your saved movies and TV shows
                    </p>
                </div>

                {/* EMPTY STATE */}
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <Heart size={70} className="text-neutral-700 mb-5" />
                        <h2 className="text-2xl font-bold mb-2">
                            No Favorites Yet
                        </h2>
                        <p className="text-neutral-500 max-w-md">
                            Start adding movies and TV shows to your favorites.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* MOVIES */}
                        {movieFavorites.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-xl font-bold mb-4 text-red-500">
                                    Movies
                                </h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {movieFavorites.map(renderCard)}
                                </div>
                            </div>
                        )}

                        {/* TV SHOWS */}
                        {tvFavorites.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-yellow-400">
                                    TV Shows
                                </h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {tvFavorites.map(renderCard)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default FavoritesPage;