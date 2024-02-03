import { format } from "date-fns";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaInfo } from "react-icons/fa";
import MovieDetailsModal from "./MovieDetails";
import { key } from "../Request";
import axios from "axios";

const CarouselDetail = ({ movie, handleTrailerPlay, setShowTrailer, showtrailer }) => {
  const [open, setOpen] = useState(false);
  const [trailer, setTrailerData] = useState(null);

  useEffect(() => {
    const fetchUrl = async () => {
      // movie video data api  response
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${key}`
      );
      const videoData = videoResponse.data.results;
      const trailerVideoT = videoData.find(
        (video) => video.type.toLowerCase() === "trailer"
      );
      if (trailerVideoT) {
        const trailerData = videoData.filter(
          (video) => video.type.toLowerCase() === "trailer"
        );
        setTrailerData(trailerData);
      } else {
        const teaserData = videoData.filter(
          (video) => video.type.toLowerCase() === "teaser"
        );
        setTrailerData(teaserData);
      }
    };
    fetchUrl();
  }, movie);
  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  const handleDetails = (id) => {
    setOpen(true);
  };
  const handlePlayTrailer = (trailer) => {
  };

  return (
    <>
      <div className="z-10 absolute top-[30%] w-[51%] pl-32 pr-0 mr-0">
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          {movie?.original_title}
        </h1>
        <p className="text-gray-300 my-2 text-lg">
          Relased: {format(new Date(movie.release_date), "MMMM yyyy")}
        </p>
        <p className="w-full md:max-w-[70%] lg-max-w[50%] xl:max-w-[70%] text-white text-xl">
          {truncateString(movie.overview, 200)}
        </p>
        <div className="z-10 flex flex-row my-4">
          <Button
            size-xl
            color="gray"
            className="px-5 py-2"
            onClick={() => handleTrailerPlay(trailer)}
          >
            Play
          </Button>
          <Button
            size="xl"
            color="none"
            className="px-5 py-2 ml-4 text-white border rounded-lg shadow-lg hover:border-gray-300 hover:text-gray-300"
            onClick={() => handleDetails(movie.id)}
          >
            <FaInfo className="inline-block mr-2" /> Info
          </Button>

          {open && (
            <MovieDetailsModal
              open={open}
              onClose={() => setOpen(false)}
              movieId={movie.id}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default CarouselDetail;
