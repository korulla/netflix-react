import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieDetailsModal from "../MovieDetails";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { key } from "../../Request";
import ReactPlayer from "react-player/youtube";
import {
  PlayIcon,
  HeartIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import CloseIcon from '@mui/icons-material/Close';
import { db } from "../../firebase";
import { arrayUnion, arrayRemove, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { UserAuth } from "../../context/AuthContext";

const Movie = ({ item, setOpen, open }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [iconColors, setIconColors] = useState(["grey", "grey", "grey"]);
  const [like, setLike] = useState(false);
  const [trailerData, setTrailerData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const { user } = UserAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const showId = user?.email ? doc(db, 'users', user.email) : null;

  const toggleWatchlist = async () => {
    if (isInWatchlist) {
      await updateDoc(showId, {
        savedShows: arrayRemove({
          id: item.id,
          title: item.title,
          img: item.backdrop_path
        })
      });
    } else {
      await updateDoc(showId, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path
        })
      });
    }
  };

  useEffect(() => {
    if (showId) {
      const unsubscribe = onSnapshot(showId, (doc) => {
        const savedShows = doc.data()?.savedShows || [];
        setIsInWatchlist(savedShows.some(show => show.id === item.id));
      });
      return () => unsubscribe();
    }
  }, [user?.email, item.id]);


  useEffect(() => {
    const fetchMovies = async () => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=${key}`
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
    fetchMovies();
  }, [item.id]);

  const handleOnEnter = () => {
    setOpen(true);
  };

  const handleOnLeave = () => {
    setOpen(false);
  };

  const handleOnLeaveIcon = () => {
    setIconColors(["grey", "grey", "grey"]);
  };

  const handleColorChange = (index, isEnter) => {
    setIconColors((prevColors) =>
      prevColors.map((color, i) => (i === index && isEnter ? "white" : color))
    );
  };

  const handleDetails = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="w-[160px] sm:w-[200px] md:w-[400px] inline-block cursor-pointer relative p-2">
        <div onMouseEnter={handleOnEnter} onMouseLeave={handleOnLeave}>
          <img
            src={`https://image.tmdb.org/t/p/w780${item?.backdrop_path}`}
            alt=""
          />
          <motion.div
            className="absolute z-10 top-0 left-0 w-[129%] h-[200%] hover:bg-gray/100 opacity-0 hover:opacity-100 text-white ml-[51px]"
            initial="initial"
            whileHover="hover"
            variants={{
              initial: { scale: 1 },
              hover: {
                scale: open ? 1.2 : 1,
                transition: {
                  duration: 0.5,
                },
              },
            }}
            animate="hover"
          >
            <motion.img
              className="w-[100%] h-[70%] object-top object-cover absolute"
              src={`https://image.tmdb.org/t/p/original${item?.backdrop_path}`}
              initial="initial"
              variants={{
                initial: { top: "36px" },
                hover: {
                  top: open ? "36px" : 0,
                  transition: {
                    duration: 0.5,
                  },
                },
              }}
              animate="hover"
            />
            <div className="bg-black w-[101%] h-full relative top-[268px] text-white flex flex-col justify-start items-start">
              <div className="w-full h-auto flex">
                <h1 className="font-bold text-3xl whitespace-normal">
                  {item.title}
                </h1>
              </div>
              <div className="w-full h-auto flex flex-row">
                {iconColors.map((color, index) => (
                  <button
                    key={index}
                    className="text-white font-bold rounded-full"
                    onMouseEnter={() => handleColorChange(index, true)}
                    onMouseLeave={handleOnLeaveIcon}
                    onClick={index === 0 ? () => setPlaying(true) : (index === 2 ? handleDetails : null)}
                  >
                    {index === 0 ? (
                      playing ? (
                        <CloseIcon className="size-12" style={{ fill: "white" }} />
                      ) : (
                        <PlayIcon className="size-12" style={{ fill: color }} />
                      )
                    ) : index === 1 ? (
                      isInWatchlist ? (
                        <FaHeart onClick={toggleWatchlist} className="size-10"/>
                      ) : (
                        <FaRegHeart className="size-10" style={{ fill: color }} onClick={toggleWatchlist}/>
                      )
                    ) : (
                      <InformationCircleIcon className="size-12" style={{ fill: color }}  />
                    )}
                  </button>
                ))}
                {modalOpen && (
                  <MovieDetailsModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    movieId={item.id}
                    movieTitle={item.title}
                    movieImg={item.backdrop_path}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {playing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <button className="absolute top-4 right-4 text-white" onClick={() => setPlaying(false)}>
            <CloseIcon className="size-12" />
          </button>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerData?.[0]?.key}`}
            controls
            width="80%"
            height="80%"
            playing={true}
          />
        </div>
      )}
    </>
  );
};

export default Movie;
