/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

function SunPage({ svgSrc, isPreloaderComplete = true }) {
  const faceRef = useRef(null);
  const rightEyeRef = useRef(null);
  const winkRef = useRef(null);
  const sunContainerRef = useRef(null);
  const componentRef = useRef(null);
  const textBubbleRef = useRef(null);
  const textRef = useRef(null);
  const extraSvgRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isIntersectingFooter, setIsIntersectingFooter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isIntersectingHeroOrMain, setIsIntersectingHeroOrMain] = useState(true);

  const targetPhrase = "Friday 8th August, Manchester, UK";
  const words = targetPhrase.split(" ");
  const initialWidth = "310";

  const typewriterTLRef = useRef(null);
  const reverseTLRef = useRef(null);

  useEffect(() => {
    setIsVisible(!isIntersectingFooter && !isIntersectingHeroOrMain);
  }, [isIntersectingFooter, isIntersectingHeroOrMain]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainOrHeroElements = document.querySelectorAll(
        'main, [data-main="true"], [data-hero="true"]'
      );
      const footerElements = document.querySelectorAll(
        'footer, [data-footer="true"]'
      );

      let cleanupFns = [];

      const setupObserver = (elements, threshold, setter) => {
        if (elements.length > 0) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              setter(entry.isIntersecting);
            },
            { threshold: threshold }
          );

          elements.forEach((el) => observer.observe(el));

          cleanupFns.push(() => {
            elements.forEach((el) => observer.unobserve(el));
          });
        } else {
          if (elements === mainOrHeroElements) {
            setIsIntersectingHeroOrMain(false);
            console.warn(
              'No <main>, [data-main="true"], or [data-hero="true"] found.'
            );
          }
        }
      };

      setupObserver(mainOrHeroElements, 0.1, setIsIntersectingHeroOrMain);
      setupObserver(footerElements, 0.2, setIsIntersectingFooter);

      return () => {
        cleanupFns.forEach((fn) => fn());
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const component = componentRef.current;
    if (!component) return;

    if (isVisible) {
      gsap.to(component, {
        x: "0%",
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    } else {
      gsap.to(component, {
        x: "-400%",
        duration: 0.6,
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const face = faceRef.current;
    const rightEye = rightEyeRef.current;
    const winkEye = winkRef.current;
    const textBubble = textBubbleRef.current;
    const textElement = textRef.current;
    const extraSvg = extraSvgRef.current;

    if (!face || !isVisible) return;

    const verticalPadding = "8.53333px";
    const bubblePadding = {
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: "12.8px",
      paddingRight: "12.8px",
    };

    const collapsedState = {
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
      width: "0px",
      height: "0px",
    };

    const dotsWidth = "40px";
    const fixedHeight = "35.6px";

    if (isOpen) {
      if (reverseTLRef.current) {
        reverseTLRef.current.kill();
        reverseTLRef.current = null;
      }
      if (typewriterTLRef.current) {
        typewriterTLRef.current.kill();
        typewriterTLRef.current = null;
      }

      if (extraSvg) {
        gsap.to(extraSvg, { opacity: 1, duration: 0.2 });
      }

      gsap.to(rightEye, { opacity: 0, duration: 0.15 });
      gsap.to(winkEye, { opacity: 1, duration: 0.15 });

      if (textBubble && textElement) {
        gsap.set(textElement, { innerHTML: "" });
        gsap.set(textBubble, {
          ...collapsedState,
          width: dotsWidth,
          height: fixedHeight,
          opacity: 0,
          ...bubblePadding,
        });

        const typewriterTL = gsap.timeline({
          paused: true,
          onComplete: () => {
            typewriterTLRef.current = null;
          },
        });

        typewriterTLRef.current = typewriterTL;

        typewriterTL
          .to(
            textBubble,
            {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
              width: dotsWidth,
              height: fixedHeight,
              ...bubblePadding,
            },
            0
          )
          .to(textElement, { duration: 0.1, text: "..." }, 0.2)
          .to(textElement, { duration: 0.1, text: "..." }, "+=0.5")
          .to(
            textElement,
            {
              duration: 0.8,
              text: targetPhrase,
              ease: "none",
            },
            "<"
          )
          .to(
            textBubble,
            {
              width: initialWidth + "px",
              duration: 0.8,
              ease: "none",
            },
            "<"
          );

        typewriterTL.play();
      }
    } else {
      const currentText = textElement ? textElement.innerHTML : "";

      if (typewriterTLRef.current) {
        typewriterTLRef.current.kill();
        typewriterTLRef.current = null;
      }

      if (reverseTLRef.current) {
        reverseTLRef.current.kill();
        reverseTLRef.current = null;
      }

      const fadeOutDuration = 0.3;

      if (textBubble) {
        gsap.to(textBubble, {
          opacity: 0,
          duration: fadeOutDuration,
          ease: "power1.in",
        });
      }

      if (extraSvg) {
        gsap.to(extraSvg, {
          opacity: 0,
          duration: fadeOutDuration,
          ease: "power1.in",
        });
      }

      if (textBubble && textElement && currentText.length > 0) {
        gsap.set(textElement, { innerHTML: currentText });

        const reverseTL = gsap.timeline({
          onComplete: () => {
            gsap.to(rightEye, { opacity: 1, duration: 0 });
            gsap.to(winkEye, { opacity: 0, duration: 0 });
            gsap.set(textBubble, { ...collapsedState });
            gsap.set(textElement, { innerHTML: "" });
            reverseTLRef.current = null;
          },
        });

        reverseTLRef.current = reverseTL;

        const charsToReverse = currentText.length - 3;
        const reverseDuration = Math.max(
          0.1,
          (charsToReverse / targetPhrase.length) * 0.3
        );

        reverseTL.to(
          textElement,
          { duration: reverseDuration, text: "...", ease: "none" },
          0
        );

        reverseTL.to(
          textBubble,
          {
            width: dotsWidth,
            height: fixedHeight,
            duration: reverseDuration,
            ease: "power2.in",
          },
          0
        );
      } else {
        gsap.to(rightEye, { opacity: 1, duration: 0 });
        gsap.to(winkEye, { opacity: 0, duration: 0 });
        gsap.set(textBubble, { opacity: 0, duration: 0, ...collapsedState });
      }
    }
  }, [isOpen, isVisible, targetPhrase, initialWidth]);

  useEffect(() => {
    const face = faceRef.current;
    const rightEye = rightEyeRef.current;
    const winkEye = winkRef.current;
    const sunContainer = sunContainerRef.current;
    const textBubble = textBubbleRef.current;
    const textElement = textRef.current;
    const extraSvg = extraSvgRef.current;

    if (!face || !sunContainer || !isVisible) return;

    const verticalPadding = "8.53333px";
    const bubblePadding = {
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: "12.8px",
      paddingRight: "12.8px",
    };

    const collapsedState = {
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
      width: "0px",
      height: "0px",
    };

    const dotsWidth = "40px";
    const fixedHeight = "35.6px";

    if (face) {
      gsap.set(face, { opacity: 1 });
    }
    if (winkEye) {
      gsap.set(winkEye, { opacity: 0 });
    }
    if (textBubble) {
      gsap.set(textBubble, {
        overflow: "hidden",
        opacity: 0,
        ...collapsedState,
      });
    }
    if (textElement) {
      gsap.set(textElement, { innerHTML: "" });
    }

    const handleMouseMove = (e) => {
      const sunRect = sunContainer.getBoundingClientRect();
      const sunCenterX = sunRect.left + sunRect.width / 2;
      const sunCenterY = sunRect.top + sunRect.height / 2;

      const deltaX = e.clientX - sunCenterX;
      const deltaY = e.clientY - sunCenterY;

      const maxMove = 60;
      const divisor = 7;
      const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / divisor));
      const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / divisor));

      gsap.to(face, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleSunClick = (e) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    };

    const handleClickOutside = (e) => {
      if (
        sunContainer &&
        !sunContainer.contains(e.target) &&
        textBubble &&
        !textBubble.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleFaceMouseEnter = () => {
      if (isOpen) return;

      if (extraSvg) {
        gsap.to(extraSvg, { opacity: 1, duration: 0.2 });
      }

      if (reverseTLRef.current) {
        reverseTLRef.current.kill();
        reverseTLRef.current = null;
      }
      if (typewriterTLRef.current) {
        typewriterTLRef.current.kill();
        typewriterTLRef.current = null;
      }

      gsap.to(rightEye, { opacity: 0, duration: 0 });
      gsap.to(winkEye, { opacity: 1, duration: 0 });

      if (textBubble && textElement) {
        gsap.set(textElement, { innerHTML: "" });
        gsap.set(textBubble, {
          ...collapsedState,
          width: dotsWidth,
          height: fixedHeight,
          opacity: 0,
          ...bubblePadding,
        });

        const typewriterTL = gsap.timeline({
          paused: true,
          onComplete: () => {
            typewriterTLRef.current = null;
          },
        });

        typewriterTLRef.current = typewriterTL;

        typewriterTL
          .to(
            textBubble,
            {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
              width: dotsWidth,
              height: fixedHeight,
              ...bubblePadding,
            },
            0
          )
          .to(textElement, { duration: 0.1, text: "..." }, 0.2)
          .to(textElement, { duration: 0.1, text: "..." }, "+=0.5")
          .to(
            textElement,
            {
              duration: 0.8,
              text: targetPhrase,
              ease: "none",
            },
            "<"
          )
          .to(
            textBubble,
            {
              width: initialWidth + "px",
              duration: 0.8,
              ease: "none",
            },
            "<"
          );

        typewriterTL.play();
      }
    };

    const handleFaceMouseLeave = () => {
      if (isOpen) return;

      const currentText = textElement ? textElement.innerHTML : "";

      if (typewriterTLRef.current) {
        typewriterTLRef.current.kill();
        typewriterTLRef.current = null;
      }

      if (reverseTLRef.current) {
        reverseTLRef.current.kill();
        reverseTLRef.current = null;
      }

      const fadeOutDuration = 0.3;

      if (textBubble) {
        gsap.to(textBubble, {
          opacity: 0,
          duration: fadeOutDuration,
          ease: "power1.in",
        });
      }

      if (extraSvg) {
        gsap.to(extraSvg, {
          opacity: 0,
          duration: fadeOutDuration,
          ease: "power1.in",
        });
      }

      if (textBubble && textElement && currentText.length > 0) {
        gsap.set(textElement, { innerHTML: currentText });

        const reverseTL = gsap.timeline({
          onComplete: () => {
            gsap.to(rightEye, { opacity: 1, duration: 0 });
            gsap.to(winkEye, { opacity: 0, duration: 0 });
            gsap.set(textBubble, { ...collapsedState });
            gsap.set(textElement, { innerHTML: "" });
            reverseTLRef.current = null;
          },
        });

        reverseTLRef.current = reverseTL;

        const charsToReverse = currentText.length - 3;
        const reverseDuration = Math.max(
          0.1,
          (charsToReverse / targetPhrase.length) * 0.3
        );

        reverseTL.to(
          textElement,
          { duration: reverseDuration, text: "...", ease: "none" },
          0
        );

        reverseTL.to(
          textBubble,
          {
            width: dotsWidth,
            height: fixedHeight,
            duration: reverseDuration,
            ease: "power2.in",
          },
          0
        );
      } else {
        gsap.to(rightEye, { opacity: 1, duration: 0 });
        gsap.to(winkEye, { opacity: 0, duration: 0 });
        gsap.set(textBubble, { opacity: 0, duration: 0, ...collapsedState });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    sunContainer.addEventListener("click", handleSunClick);
    sunContainer.addEventListener("mouseenter", handleFaceMouseEnter);
    sunContainer.addEventListener("mouseleave", handleFaceMouseLeave);
    document.addEventListener("click", handleClickOutside);

    return () => {
      if (typewriterTLRef.current) typewriterTLRef.current.kill();
      if (reverseTLRef.current) reverseTLRef.current.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      sunContainer.removeEventListener("click", handleSunClick);
      sunContainer.removeEventListener("mouseenter", handleFaceMouseEnter);
      sunContainer.removeEventListener("mouseleave", handleFaceMouseLeave);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, targetPhrase, isOpen]);

  // Don't render the component at all while preloader is running
  // This is placed AFTER all hooks to comply with Rules of Hooks
  if (!isPreloaderComplete) {
    return null;
  }

  return (
    <div
      ref={componentRef}
      className="fixed  xl:bottom-[33px] md:bottom-[28px] md:left-[28px] bottom-[17px] left-[12px] xl:left-[33px] z-[999] flex items-center -translate-x-[400%]"
    >
      <div
        ref={sunContainerRef}
        className="h-[45.9375px] w-[45.9375px] md:w-[58.925px] md:h-[58.925px] lg:w-[45.5px] lg:h-[45.5px] xl:h-[64px] xl:w-[64px] 2xl:w-[67.9px] 2xl:h-[67.9px] cursor-pointer pointer-events-auto relative flex-shrink-0 mr-[12.8px]"
      >
        <div className="animate-[spin_20s_linear_infinite] w-full h-full">
          {svgSrc && <img src={svgSrc} alt="sun" className="w-full h-full" />}
        </div>

        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 420 420"
        >
          <g ref={faceRef}>
            <g ref={null} opacity="0" transform="translate(190 200) scale(2.5)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M11.8921 18C5.9557 19.2392 4.66149 14.9968 3.5863 11.9479C3.37455 11.3475 3.80655 10.6869 4.44285 10.6652C9.15161 10.5051 11.2843 10.3509 14.8793 8.66061C15.4922 8.37244 16.2307 8.80754 16.2719 9.48354C16.4616 12.6034 16.766 16.6483 11.8921 18Z"
                  fill="var(--color-light, white)"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M4.5 14C9.24535 14.5931 13.9652 13.5983 16 12"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
              </svg>
            </g>

            <circle ref={null} cx="170" cy="180" r="11" fill="#121212" />
            <circle ref={rightEyeRef} cx="230" cy="180" r="11" fill="#121212" />

            <g
              ref={winkRef}
              opacity="0"
              transform="translate(195 178) scale(3.5)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M10.5 2L14.5 1.49999"
                  stroke="#121212"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </g>

            <path
              ref={null}
              d="M160 240 Q200 270 240 240"
              stroke="#121212"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
        <svg
          ref={extraSvgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          viewBox="0 0 22 13"
          fill="none"
          className="absolute left-[50px] bottom-[5.5px] md:left-[63px] md:bottom-[12px] lg:left-[52px] lg:bottom-[5.1px] xl:bottom-[13px] xl:left-[71px] 2xl:left-[74px] xl-[] 2xl:bottom-[15.5px] z-10 opacity-0"
        >
          <path
            d="M13.2965 8.70441C15.5695 10.5858 18.4864 11.7165 21.6675 11.7165L21.67 1H8.70396C8.87681 7.22251 4.20993 10.3338 3 10.8523C7.39294 11.651 11.029 10.2151 13.2965 8.70441Z"
            fill="#FF6B35"
          />
          <path
            d="M21.6675 11.7165C18.4864 11.7165 15.5695 10.5858 13.2965 8.70441C11.029 10.2151 7.39294 11.651 3 10.8523C4.20993 10.3338 8.87681 7.22251 8.70396 1"
            stroke="#121212"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

   <div
  ref={textBubbleRef}
  className="bg-[#F97028] flex items-center rounded-[14.86px] text-white relative whitespace-nowrap border-[1.6px] border-[#121212] pointer-events-none overflow-hidden max-w-[199.95px] md:max-w-[257.663px] xl:max-w-[310.025px] tracking-[-0.424444px] text-[11.4872px] md:text-[14.7338px] xl:text-[16.9778px] leading-[14.9333px] xl:leading-[22.0711px] font-medium"
>

        <div
          className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[9.5px] border-t-transparent border-b-[9.5px] border-b-transparent border-r-[15px] border-r-[#121212]"
        />
        <div
          className="absolute left-[-13.5px] top-1/2 -translate-y-1/2 w-0 h-0 z-10 border-t-[7.5px] border-t-transparent border-b-[7.5px] border-b-transparent border-r-[13.5px] border-r-[#F97028]"
        />

        <p ref={textRef}></p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          viewBox="0 0 22 13"
          fill="none"
          className="absolute left-[-8px] bottom-[-0.5px] transition-all duration-700 ease-out"
        >
          <path
            d="M13.2965 8.70441C15.5695 10.5858 18.4864 11.7165 21.6675 11.7165L21.67 1H8.70396C8.87681 7.22251 4.20993 10.3338 3 10.8523C7.39294 11.651 11.029 10.2151 13.2965 8.70441Z"
            fill="#FF6B35"
          />
          <path
            d="M21.6675 11.7165C18.4864 11.7165 15.5695 10.5858 13.2965 8.70441C11.029 10.2151 7.39294 11.651 3 10.8523C4.20993 10.3338 8.87681 7.22251 8.70396 1"
            stroke="#121212"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default SunPage;