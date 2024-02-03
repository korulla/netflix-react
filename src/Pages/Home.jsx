import Main from "../Components/Main";
import Row from "../Components/Row/row";
import requests from "../Request";

export const Home = () => {
  return (
    <div className=" relative">
      <div className="mb-[200px]">
        <Main></Main>
      </div>
      <Row title="Up Coming" fetchUrl={requests?.requestUpcoming}></Row>
      <Row title="Trending" fetchUrl={requests?.requestTrending}></Row>
      <Row title="Now Playing" fetchUrl={requests?.requestNowPlaying}></Row>
      <Row title="Top Rated" fetchUrl={requests?.requestTopRated}></Row>
    </div>
  );
};
