import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToHash() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) return;

        const id = hash.replace("#", "");
        const el = document.getElementById(id);

        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [pathname, hash]);

    return null;
}

export default ScrollToHash;