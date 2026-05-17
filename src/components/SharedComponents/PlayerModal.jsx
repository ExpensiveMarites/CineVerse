import { useEffect } from "react";

const VIDEO_PROVIDERS = [
    "https://vidsrcme.su",
    "https://vsembed.su",
    "https://vidsrc-embed.ru"
];

function PlayerModal({ id, type, onClose, season, episode }) {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const getSrc = () => {
        const base = VIDEO_PROVIDERS[0];

        // MOVIE
        if (type === "movie") {
            return `${base}/embed/movie/${id}`;
        }

        // TV SHOW
        if (type === "tv") {
            const s = season || 1;
            const e = episode || 1;
            return `${base}/embed/tv/${id}/${s}/${e}`;
        }

        return "";
    };

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
            <iframe
                src={getSrc()}
                className="w-screen h-screen"
                allowFullScreen
            />
        </div>
    );
}

export default PlayerModal;