import { useEffect, useState } from "react";
import requests from "../Request";
import axios from "axios";
import Carousel from "./Caraousel";

const Main = () => {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(requests.requestNowPlaying);
        setMovies(response.data.results);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Carousel movies = {movies} setMovies = {setMovies}  />

    </>
  );
};
export default Main;
