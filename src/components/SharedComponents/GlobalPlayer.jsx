import { useEffect, useState } from "react";
import { getVidSrcMovieUrl } from "../../services/Api";
import { useMovies } from "../../context/MoviesContext";

function GlobalPlayer() {
    const { showPlayer, playerMovieId, closePlayer } = useMovies();

    const [currentIndex, setCurrentIndex] = useState(0);

    const urls = playerMovieId
        ? getVidSrcMovieUrl(playerMovieId).providers
        : [];

    useEffect(() => {
        setCurrentIndex(0);
    }, [playerMovieId]);

    if (!showPlayer || !playerMovieId) return null;

    const handleError = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center">

            {/* CLOSE */}
            <button
                onClick={closePlayer}
                className="absolute top-5 right-5 z-50 text-white bg-black/70 w-10 h-10 rounded-full"
            >
                ✕
            </button>

            {/* PLAYER */}
            {urls[currentIndex] ? (
                <iframe
                    key={currentIndex}
                    src={urls[currentIndex]}
                    allowFullScreen
                    className="w-full h-full"
                    onError={handleError}
                    title="Movie Player"
                />
            ) : (
                <div className="text-white">
                    No working video source found.
                </div>
            )}
        </div>
    );
}

export default GlobalPlayer;