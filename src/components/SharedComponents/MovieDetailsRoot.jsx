import { useMovies } from "../../context/MoviesContext";
import MoviesDetail from "../ContentComponents/MoviesDetail";
import TVShowDetail from "../ContentComponents/TVShowDetail";

function MovieDetailsRoot() {
    const { selectedMedia } = useMovies();

    if (!selectedMedia) return null;

    return (
        <>
            {selectedMedia.type === "movie" && <MoviesDetail />}
            {selectedMedia.type === "tv" && <TVShowDetail />}
        </>
    );
}

export default MovieDetailsRoot;