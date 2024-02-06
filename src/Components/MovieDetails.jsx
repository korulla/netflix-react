import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import axios from "axios";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { key } from "../Request";
import {
  Modal,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
// import { UserAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, arrayRemove, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

const MovieDetailsModal = ({ movieId, onClose, movieImg, movieTitle }) => {
  const [movieData, setMovieData] = useState(null);
  const [movieCast, setMovieCast] = useState(null);
  const [directore, setDirectore] = useState(null);
  const [producer, setProducer] = useState(null);
  const [genre, setGenre] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerData, setTrailerData] = useState(null);
  const { user } = UserAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  // const showId = doc(db, 'users', user?.email);
  const showId = user?.email ? doc(db, 'users', user.email) : null;


  const toggleWatchlist = async () => {
    // Check if showId exists before performing Firestore operation
    if (showId) {
      if (isInWatchlist) {
        await updateDoc(showId, {
          savedShows: arrayRemove({
            id: movieId,
            title: movieTitle,
            img: movieImg
          })
        });
      } else {
        await updateDoc(showId, {
          savedShows: arrayUnion({
            id: movieId,
            title: movieTitle,
            img: movieImg
          })
        });
      }
    } else{
      alert("sign in to add item")
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
      const savedShows = doc.data()?.savedShows || [];
      setIsInWatchlist(savedShows.some(show => show.id === movieId));
    });
    return () => unsubscribe();
  }, [user?.email, movieId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // movie data API call
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`
        );
        const data = response.data;
        setMovieData(data);

        // movie video data api  response
        const videoResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${key}`
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

        // movie Cast api call
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${key}`
        );
        const castData = castResponse.data;
        const castDataExclusive = castData.cast;
        setMovieCast(castDataExclusive);

        // crew details
        const crewData = castData.crew;
        const productionCrewData = data.production_companies;
        setProducer(productionCrewData);
        const director = crewData.find((crew) => crew.job === "Director");
        setDirectore(director);

        // genre data
        const genre = data.genres;
        setGenre(genre);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleClose = () => {
    onClose();
  };

  const handleTralerClose = () => {
    setShowTrailer(false);
  };

  const handlePlayTrailer = () => {
    setShowTrailer(true);
  };

  const cardSpring = useSpring({
    transform: "translate3d(0, 0, 0)",
    from: { transform: "translate3d(0, -100px, 0)" },
    config: config.gentle,
  });

  return (
    <Modal
      open={movieData !== null}
      onClose={onClose}
      className="text-white scrollbar-hide"
      style={{ overflowX: "hidden", maxHeight: "100%", overflowY: "auto" }}
    >
      <Box
        className="scrollbar-hide"
        sx={{
          text: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflow: "auto",
          overflowX: "hidden",
        }}
      >
        <animated.div style={cardSpring}>
          <Card
            className="scrollbar-hide"
            sx={{
              minWidth: 600,
              maxWidth: Math.min(1000, movieCast?.length * 160),
              overflowX: "hidden",
              border: "none",
              background: "black",
              position: "relative",
            }}
          >
            <IconButton
              sx={{
                color: "ButtonShadow",
                position: "absolute",
                variant: "outlined",
                right: 15,
                zIndex: 1000,
                size: "large",
              }}
              aria-label="delete"
              size="large"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>

            <div className="relative">
              <div className="absolute h-[400px] w-[100%] bg-gradient-to-t from-black"></div>
              <CardMedia
                className="object-cover object-top"
                component="img"
                image={`https://image.tmdb.org/t/p/original${movieData?.backdrop_path}`}
                alt={movieData?.title}
                sx={{
                  height: 400,
                }}
              />
              {showTrailer && trailerData && (
                <iframe
                  title="trailer"
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${trailerData[0].key}?autoplay=1`}
                  allowFullScreen
                  allow="autoplay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                  }}
                ></iframe>
              )}
            </div>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                className="text-white"
              >
                <h1 className="text-white text-3xl md:text-5xl font-bold ">
                  {movieData?.title}
                </h1>
              </Typography>
              <Grid className="my-5" container spacing={-50}>
                <Grid
                  className="max-w-[32%] mr-[102px]"
                  sx={{
                    maxWidth: "32%",
                    width: "32%",
                    minWidth: "32%",
                    marginRight: "-102px",
                  }}
                  item
                  xs={6}
                >
                  {showTrailer ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleTralerClose}
                    >
                      <CloseIcon sx={{ mr: 1 }} />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlayTrailer}
                    >
                      <PlayIcon sx={{ mr: 1 }} />
                      Play
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    marginLeft: -8,
                  }}
                >
                  {isInWatchlist ? (
                    <Button variant="contained" color="error" onClick={toggleWatchlist}>
                      <RemoveIcon sx={{ mr: 1 }} />
                      Remove from Watchlist
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" onClick={toggleWatchlist}>
                      <AddIcon sx={{ mr: 1 }} />
                      Add to Watchlist
                    </Button>
                  )}
                </Grid>
              </Grid>
              <div>
                <Grid item xs={12} className="flex justify-between">
                  <Typography
                    className="ml-[5px]"
                    variant="body2"
                    color="textSecondary"
                  >
                    <p className="text-gray-500 text-lg">
                      {movieData?.release_date
                        ? format(new Date(movieData.release_date), "MMMM yyyy")
                        : "Release date not available"}
                    </p>
                  </Typography>
                  <Typography sx={{ marginRight: 6 }}>
                    <p className="text-gray-500 text-lg">
                      Genre: {genre?.map((value) => value.name).join(", ")}
                    </p>
                  </Typography>
                </Grid>
              </div>
              <div></div>
              <div className="my-4">
                <Typography className="my-4">
                  <p className="w-full text-gray-300 text-xl">
                    {movieData?.overview}
                  </p>
                </Typography>
              </div>
              <div className="text-white">
                <Typography>
                  <p className="text-lg text-gray-300">
                    Director: {directore?.name}
                  </p>
                </Typography>
                <Typography>
                  <p className="text-lg text-gray-300">
                    Poduction:{" "}
                    {producer?.map((value) => value?.name).join(", ")}
                  </p>
                </Typography>
              </div>

              <Typography
                className="text-white flex justify-center items-center"
                variant="caption"
                gutterBottom
              >
                <h2 className="text-white text-3xl my-6">CAST</h2>
              </Typography>
              <Grid
                className="flex text-white w-[100%] ml-29px"
                container
                spacing={2}
                sx={{ overflow: "hidden" }}
              >
                {movieCast?.slice(0, 20).map((castMember) => (
                  <Grid
                    className="text-white"
                    item
                    key={castMember.id}
                    xs={3}
                    sx={{
                      marginBottom: 5,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      alt={castMember.original_name}
                      src={`https://image.tmdb.org/t/p/h632/${castMember.profile_path}`}
                      sx={{ width: 120, height: 120, marginRight: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="white"
                      alignSelf={"center"}
                    >
                      <p>{castMember.original_name}</p>
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </animated.div>
      </Box>
    </Modal>
  );
};

export default MovieDetailsModal;
