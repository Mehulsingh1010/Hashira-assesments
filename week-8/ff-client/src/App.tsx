/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";

import WTE from "./_components/WTE";
import Community from "./_components/Community";
import Testimonial from "./_components/Testimonial";
import FAQ from "./_components/FAQ";
import CTO from "./_components/CTO";
import Footer from "./_components/Footer";
import Team from "./_components/Team";
import About from "./_components/About";
import SunPage from "./_components/Sun";
import StripesHomeMain from "./_components/StripesHome";
import LenisProvider from "./_components/LenisProvider";
import FAQsvg from "./_components/FAQsvg";

function App() {
  const [navVisible, setNavVisible] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (preloaderComplete && !isPopupOpen) {
      const timer = setTimeout(() => {
        setNavVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    } else if (isPopupOpen) {
      setNavVisible(false);
    }
  }, [preloaderComplete, isPopupOpen]);

  return (
    <div className="overflow-hidden">
       <LenisProvider>
      <SunPage 
        svgSrc="/svg/sun.svg" 
        isPreloaderComplete={preloaderComplete}
      />
      
      <StripesHomeMain
        onPreloaderComplete={() => {
          setPreloaderComplete(true);
        }}
      />

      <About onPopupChange={setIsPopupOpen} />

      <Team />
      <WTE />
      <Community />

      <Testimonial />
      {/* <FAQ /> */}
        <FAQsvg/>
      <CTO />

      <Footer />
      </LenisProvider>
    </div>
  );
}

export default App;