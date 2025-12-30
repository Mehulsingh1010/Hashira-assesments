/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useCallback, useEffect } from 'react';
import { calculateSidePathStyles } from '../utils/stripeCalculations';
import SideStrokesSVG from './SideStrokesSVG';

const HeroTwinStrokes = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      document.documentElement.scrollHeight > window.innerHeight
    ) {
      const newScrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setScrollPercent(newScrollPercent);
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const getHeroSideStyles = useCallback(
    (baseLength, index, isLeft) =>
      calculateSidePathStyles(baseLength, index, isLeft, scrollPercent),
    [scrollPercent]
  );

  return (
    <div className="hidden lg:block">
      {/* Right Side Stroke */}
      <SideStrokesSVG
        sideClass="fixed  right-[-4.75em] z-[-1] pointer-events-none block"
        isLeft={false}
        calculateStyles={getHeroSideStyles}
      />

      {/* Left Side Stroke */}
      <SideStrokesSVG
        sideClass="fixed bottom-0 left-[-4.5em] z-[-1] pointer-events-none block"
        isLeft={true}
        calculateStyles={getHeroSideStyles}
      />
    </div>
  );
};

export default HeroTwinStrokes;