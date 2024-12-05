import { useState, useEffect } from "react";
import Card from "./Card";
import { fetchData } from "../assets/getMovies";
import { SearchIcon } from "../icons";
import { useAuth } from '../contexts/AuthContext';

function Show() {
    const [movies, setMovies] = useState([]);
    const [searchImput, setSearchImput] = useState("");
    const [searchButton, setSearchButton] = useState("");

    // Books categories
    const categories = [1988, 1989, 2015, 2018, 2021, 2024];
    const { user } = useAuth();

    useEffect(() => {
        const getMovies = async () => {
            try {
                const edges = await fetchData();
                // console.log(edges);

                const movieData = edges.map(edge => {
                    const entity = edge.node.entity;
                    //const imageUrl = entity.primaryImage?.url;

                    return {
                        title: entity.titleText?.text || 'Untitle',
                        imageUrl: entity.primaryImage?.url,
                        year: entity.releaseDate?.year,
                        imdbLink: `https://www.imdb.com/title/${entity.id}`,
                    };
                });
                setMovies(movieData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        getMovies();
    }, []);

    // Filters
    const handleSearchChange = (e) => {
        setSearchImput(e.target.value)
        setSearchButton('')
    }
    const handleClickSearch = (e) => {
        setSearchButton(e.target.innerText)
        setSearchImput('')
    }

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchButton || searchImput.toLowerCase()) ||
        (movie.year && movie.year.toString().includes(searchButton || searchImput))
    )

    const handleScrollToSearch = () => {
        document.getElementById("movie-list").scrollIntoView({
            behavior: "smooth"
        });
    };

    return (
        <div>
            <div className="search-container">
                <h1>Welcome to the Virtual Library</h1>
                <p>BookUIS</p>
                <div className="input-container">
                    <button className="boton-buscar" onClick={handleScrollToSearch}><SearchIcon /></button>
                    <input
                        type="text"
                        placeholder="Search Movies...."
                        value={searchImput}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div className="handleClick-buttons">
                <h1>Categorias</h1>
                <div className="buttons">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={handleClickSearch}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="movie-list" id="movie-list">
                {filteredMovies.length > 0 ?
                    filteredMovies.map((movie, index) => (
                        <Card
                            key={index}
                            imageUrl={movie.imageUrl}
                            title={movie.title}
                            imdbLink={movie.imdbLink}
                            year={movie.year}
                        />
                    )) : (
                        <p>No movies found.....</p>
                    )
                }
            </div>
        </div>
    );
}

export default Show;
