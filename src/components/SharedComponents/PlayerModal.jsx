import { useEffect } from "react";
import { getEmbedUrls } from "../../services/Api";

function PlayerModal({ id, type, onClose, season, episode }) {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const src = getEmbedUrls({ id, type, season, episode })[0] || "";
    const playerKey = `${type}-${id}-${season || "movie"}-${episode || "movie"}`;

    return (
        <div className="fixed inset-0 bg-black z-[999]">

            {/* CLOSE BUTTON */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[1000] text-white text-3xl bg-black/50 px-3 py-1 rounded-full hover:bg-red-700"
            >
                ✕
            </button>
            
            

            {/* IFRAME */}
            {src ? (
                <iframe
                    key={playerKey}
                    src={src}
                    className="w-screen h-screen"
                    allowFullScreen
                    title="CineVerse Player"
                />
            ) : (
                <div className="w-screen h-screen flex items-center justify-center text-white">
                    Unable to load this title.
                </div>
            )}
        </div>
    );
}

export default PlayerModal;
