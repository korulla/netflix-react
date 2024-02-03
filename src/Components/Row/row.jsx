import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Movie from "./Movie";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const heightVariants = {
  open: {
    height: "415px",
    transition: {
      duration: 0.5,
    },
  },
  closed: {
    height: "100%",
    transition: {
      duration: 0.5,
    },
  },
};

const Row = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState(null);
  const [open, setOpen] = useState(false);
  const controls = useAnimation();
  const [displayIcons, setDisplayIcons] = useState(true);
  const movieContainerRef = useRef(null);

  const handleOnMouseEnterDisplay = () => {
    setDisplayIcons(false);
  };

  const handleOnMouseLeaveDisplay = () => {
    setDisplayIcons(true);
  };

  const handleSlideLeft = () => {
    movieContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth", // Fixed: should be a string "smooth"
    });
  };

  const handleSlideRight = () => {
    movieContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth", // Fixed: should be a string "smooth"
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(fetchUrl);
        const data = response.data.results;
        setMovies(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [fetchUrl]);

  useEffect(() => {
    controls.start(open ? "open" : "closed");
  }, [open, controls]);

  return (
    <div className="relative mb-[100px]">
      <h2 className="text-white font-bold md:text-xl p-4 ">{title}</h2>
      <div className="ml-10 flex relative items-center">
        <div
          className="icons-container"
          style={{ display: displayIcons ? "block" : "none" }}
        >
          <MdChevronLeft
            onClick={handleSlideLeft}
            size={40}
            className="left-[-38px] top-[9px] h-[45%] z-20 bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer"
          />
          <MdChevronRight
            onClick={handleSlideRight}
            size={40}
            className="left-[-38px] top-[127px] h-[40%] z-20 bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer"
          />
        </div>
        <motion.div
          className="w-full  overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative  overflow-y-hidden"
          variants={heightVariants}
          initial="closed"
          animate={controls}
          onMouseEnter={handleOnMouseEnterDisplay}
          onMouseLeave={handleOnMouseLeaveDisplay}
          ref={movieContainerRef}
        >
          {movies &&
            movies.map((item, index) => (
              <Movie
                item={item}
                key={index}
                open={open}
                setOpen={setOpen}
              ></Movie>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Row;
