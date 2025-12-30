/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './Navbar';
import PreloaderAnimation from './PreloaderAnimation';
import HomeContent from './HomeContent';
import { calculateVerticalStripStyles } from '../utils/stripeCalculations';
import HeroTwinStrokes from './HeroTwinStrokes';

const StripesHomeMain = ({ onPreloaderComplete }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const navbarRef = useRef(null);
  const homeContentRef = useRef(null);
  const sunDateRef = useRef(null);
  const [verticalScrollPercent, setVerticalScrollPercent] = useState(0);
  const verticalContainerRef = useRef(null);

  const handleVerticalScroll = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      document.documentElement.scrollHeight > window.innerHeight
    ) {
      const newScrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setVerticalScrollPercent(newScrollPercent);
    }
  }, []);

  useEffect(() => {
    handleVerticalScroll();
    window.addEventListener("scroll", handleVerticalScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleVerticalScroll);
    };
  }, [handleVerticalScroll]);

  const getVerticalStripStyles = useCallback(
    (baseLength, index) =>
      calculateVerticalStripStyles(baseLength, index, verticalScrollPercent),
    [verticalScrollPercent]
  );

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloading(false);

    if (onPreloaderComplete) {
      setTimeout(() => {
        onPreloaderComplete();
      }, 100);
    }
  }, [onPreloaderComplete]);

  return (
    <div>
      <style>{`
        body { background: #f3ecd2; overflow-x: hidden; }
      `}</style>

      <Navbar ref={navbarRef} />

      {isPreloading && (
        <PreloaderAnimation
          onComplete={handlePreloaderComplete}
          navbarRef={navbarRef}
          homeContentRef={homeContentRef}
          sunDateRef={sunDateRef}
        />
      )}
  
      <HomeContent
        ref={homeContentRef}
        sunDateRef={sunDateRef}
        verticalContainerRef={verticalContainerRef}
        getVerticalStripStyles={getVerticalStripStyles}
      />

      {!isPreloading && <HeroTwinStrokes />}
    </div>
  );
};

export default StripesHomeMain;