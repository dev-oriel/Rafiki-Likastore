import React from "react";
import Hero from "../components/home/Hero";
import TopPicks from "../components/home/TopPicks";
import Offers from "../components/home/Offers";
import StudentFavorites from "../components/home/StudentFavorites";

import PopularProducts from "../components/home/PopularProducts";
import Testimonials from "../components/home/Testimonials";
import AboutSection from "../components/home/AboutSection";

const HomePage = () => {
  return (
    <>
      <Hero />
      <TopPicks />
      <Offers />
      <StudentFavorites />
      <PopularProducts />
      <Testimonials />
      <AboutSection />
    </>
  );
};

export default HomePage;
