import { Carousel } from "flowbite-react";
import CarouselDetail from "./CarouselDetail";
import { useState } from "react";

const Caraousel = ({ movies, setMovies }) => {
  const [trailer, setTrailerData] = useState(null);
  const [showtrailer, setShowTrailer] = useState(false);
  const [carousel, setCarousel] = useState(true);
  const [controls, setControls] = useState("");
  
  const detailTrailer = (data) => {
    setTrailerData(data);
    if (showtrailer) {
      setShowTrailer(false);
      setCarousel(true);
      setControls("");
    } else {
      setShowTrailer(true);
      setCarousel(false);
      setControls(" ");
    }
  };
  return (
    <>
      <div className="z-20 h-svh scrollbar-hide">
        <Carousel
          slideInterval={5000}
          slide={carousel}
          indicators={carousel}
          leftControl={controls}
          rightControl={controls}
        >
          {movies.map((movie, index) => (
            <>
              <div key={index} className="relative">
                <div className="absolute w-full h-screen bg-gradient-to-t from-[#000000]"></div>
                <img
                  className="h-full w-screen object-center"
                  key={index}
                  src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
                  alt={`Movie ${index + 1}`}
                />
                {showtrailer && (
                  <iframe
                    height="100%"
                    title="trailer"
                    width="100%"
                    src={`https://www.youtube.com/embed/${trailer[0].key}?autoplay=1&rel=0&controls=0&fs=0`}
                    allowFullScreen
                    allow="autoplay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                  ></iframe>
                )}
                <CarouselDetail
                  movie={movie}
                  key={movie.id}
                  handleTrailerPlay={detailTrailer}
                  showtrailer={showtrailer}
                  setShowTrailer={setShowTrailer}
                />
              </div>
            </>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default Caraousel;
