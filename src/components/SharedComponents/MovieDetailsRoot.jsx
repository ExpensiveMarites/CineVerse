import { useMovies } from "../../context/MoviesContext";
import MoviesDetail from "../ContentComponents/MoviesDetail";

function MovieDetailsRoot() {
    const { selectedMovieId } = useMovies();

    if (!selectedMovieId) return null;

    return <MoviesDetail />;
}

export default MovieDetailsRoot;