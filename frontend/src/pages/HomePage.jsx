import React from "react";
import Hero from "../components/home/Hero";
import TopPicks from "../components/home/TopPicks";
import Offers from "../components/home/Offers";
import StudentFavorites from "../components/home/StudentFavorites";

const HomePage = () => {
  return (
    <>
      <Hero />
      <TopPicks />
      <Offers />
      <StudentFavorites />
    </>
  );
};

export default HomePage;
