import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setError] = useState(false);

  const baseURL =
    "https://reacthttp-46f3e-default-rtdb.asia-southeast1.firebasedatabase.app";

  const fetchMovies = useCallback(async function () {
    setError(null);
    setisLoading(true);
    try {
      const response = await fetch(`${baseURL}/movies.json`);
      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      const loadedMovie = [];

      for (const key in data) {
        loadedMovie.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovie);
    } catch (error) {
      setError(error.message);
    } finally {
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(`${baseURL}/movies.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (!response.ok) throw new Error("Something went wrong while POST!");
      fetchMovies();
    } catch (error) {
      console.log(error);
    }
  };

  let content = "Found no movies. Try Fetching data.!!";
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (isLoading) {
    content = "Movies are being fetched. Please wait!!";
  }

  if (isError) content = isError;

  return (
    <div style={{ display: "flex" }}>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        <p style={{ marginTop: 20 }}>
          <button onClick={fetchMovies}>Fetch Movies</button>
        </p>
      </section>
      <section className="movie">{content}</section>
    </div>
  );
}

export default App;
