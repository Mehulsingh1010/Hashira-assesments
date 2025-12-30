'use client'
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function SunHomeInline() {
  const faceRef = useRef(null);
  const rightEyeRef = useRef(null);
  const winkRef = useRef(null);
  const sunContainerRef = useRef(null);

  const SVG_SRC = '/svg/sun.svg';

  useEffect(() => {
    const face = faceRef.current;
    const rightEye = rightEyeRef.current;
    const winkEye = winkRef.current;
    const sunContainer = sunContainerRef.current;

    if (!face || !sunContainer) return;

    gsap.set(face, { 
        x: 0, 
        y: 0, 
        rotation: -5, 
        transformOrigin: "50% 50%" 
    });
    
    if (winkEye) {
      gsap.set(winkEye, { opacity: 0 });
    }

    const handleMouseMove = (e) => {
  const sunRect = sunContainer.getBoundingClientRect();
  const sunCenterX = sunRect.left + sunRect.width / 2;
  const sunCenterY = sunRect.top + sunRect.height / 2;

  const deltaX = (e.clientX - sunCenterX) / 4; 
  const deltaY = (e.clientY - sunCenterY) / 4;

  const maxRadius = 55; 
  
  const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  let moveX = deltaX;
  let moveY = deltaY;

  if (currentDistance > maxRadius) {
    const ratio = maxRadius / currentDistance;
    moveX = deltaX * ratio;
    moveY = deltaY * ratio;
  }

  gsap.to(face, {
    x: moveX,
    y: moveY,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto"
  });
};

    const handleFaceMouseEnter = () => {
      gsap.to(rightEye, { opacity: 0, duration: 0.1 });
      gsap.to(winkEye, { opacity: 1, duration: 0.1 });
    };

    const handleFaceMouseLeave = () => {
      gsap.to(rightEye, { opacity: 1, duration: 0.1 });
      gsap.to(winkEye, { opacity: 0, duration: 0.1 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    sunContainer.addEventListener("mouseenter", handleFaceMouseEnter);
    sunContainer.addEventListener("mouseleave", handleFaceMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      sunContainer.removeEventListener("mouseenter", handleFaceMouseEnter);
      sunContainer.removeEventListener("mouseleave", handleFaceMouseLeave);
    };
  }, []);

  return (
    <div className="inline-flex items-center z-40">
      <div
        ref={sunContainerRef}
        className="h-[45.94px] w-[45.94px] md:w-[59px] lg:w-[45.5px] xl:w-[64px] 2xl:w-[67.9px] md:h-[59px] lg:h-[45.5px] xl:h-[64px] 2xl:h-[67.9px] pointer-events-auto relative flex-shrink-0 cursor-pointer"
      >
        {/* Rotating Sun */}
        <div className="animate-[spin_20s_linear_infinite] w-full h-full">
          <img src={SVG_SRC} alt="sun" className="w-full h-full" />
        </div>

        {/* Smiley Face Overlay */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 420 420"
        >
          {/* FACE GROUP: Managed by GSAP */}
          <g ref={faceRef}>
            {/* Left Eye */}
            <circle cx="170" cy="180" r="11" fill="#121212"/> 
            {/* Right Eye */}
            <circle ref={rightEyeRef} cx="230" cy="180" r="11" fill="#121212"/> 

            {/* Wink (Right Eye Position) */}
            <g ref={winkRef} transform="translate(220, 180)">
      <line 
        x1="0" y1="0" 
        x2="20" y2="0" 
        stroke="#121212" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
    </g>

            {/* Smile */}
            <path d="M160 240 Q200 270 240 240" stroke="#121212" strokeWidth="9" fill="none" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SunHomeInline;