"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Testimonial() {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const pinWrapperRef = useRef(null);

  useEffect(() => {
    const pinWrapper = pinWrapperRef.current;
    if (!pinWrapper || cardsRef.current.length === 0) return;

    // Reset cards to starting positions
    cardsRef.current.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, { y: 0, opacity: 1 });
      } else {
        gsap.set(card, { y: "800%", opacity: 0.8 }); 
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrapper,
        start: "top top",
        end: "+=300%", 
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (index === 0) return;
      tl.to(card, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      }, (index - 1) * 0.75);
    });

    // Refresh ScrollTrigger after a brief delay to recalculate positions
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const cardContainerStyle = "absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 w-[293.75px] md:w-[412.538px] lg:w-[432.35px] xl:w-[604.8px] 2xl:w-[641.95px] h-[175.35px] md:h-[245.725px] lg:h-[256.812px] xl:h-[358.337px] 2xl:h-[380.35px]";

  return (
    <section ref={containerRef} className="relative overflow-hidden px-[13px] md:px-[44.2px] lg:px-[45px] xl:px-[67px] lg:mt-[165px] md:mt-[185.338px] text-black">
      
      <div ref={pinWrapperRef} className="relative min-h-screen flex items-center justify-center will-change-transform">
        <div className="relative lg:px-[72px] xl:px-[101px] 2xl:px-[109px] w-full max-w-[1440px] mx-auto">
          
          {[1, 2, 3, 4, 5].map((num, i) => (
            <div 
              key={num}
              ref={(el) => {(cardsRef.current[i] = el)}} 
              className={`${cardContainerStyle}`}
              style={{ zIndex: 20 + i }} 
            >
              <img
                src={`/twitter/${num}.jpg`}
                alt=""
                className={`w-full h-full object-cover rounded-[39.3846px] md:rounded-[60px] border-[1.6px] shadow-[0px_8px_0px_0px_rgba(0,0,0,0.15)] top-[96px] md:top-[-55px] md:left-[146px] lg:left-[180px] xl:left-[265px] absolute will-change-transform
                  ${i === 0 ? 'rotate-4' : i === 1 ? 'rotate-2' : i === 3 ? 'rotate-[-2deg]' : i === 4 ? 'rotate-[-4deg]' : ''}`}
              />
            </div>
          ))}

          {/* Text layer */}
          <div className="relative z-[10] flex flex-col items-center md:flex-row md:items-center md:justify-start font-heading-xbold text-[55.7949px] md:text-[110.504px] lg:text-[125.156px] xl:text-[176px] 2xl:text-[186.756px] leading-[50.2154px] md:leading-normal text-center md:text-left">
            Flowfest
            <div className="flex items-center justify-center w-[127.213px] md:w-auto text-white text-[53.0051px] md:text-[104.978px] md:ml-4 lg:text-[118.898px] xl:text-[167.2px] 2xl:text-[177.418px] h-[51.95px] md:h-[102.912px] lg:h-[114.537px] xl:h-[162.025px] 2xl:h-[171.725px] md:px-[18.3712px] lg:px-[31.0481px] bg-[#F3A20F] rotate-[-1deg] rounded-lg border-[1.6px] border-black shadow-[0px_10px_0px_0px_rgba(0,0,0,0.15)]">
              Love
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;