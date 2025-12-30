"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- CONFIG ---------------- */

const COLORS = [
  "#F97028",
  "#F489A3",
  "#F0BB0D",
  "#F3A20F",
  "#F97028",
  "#F489A3",
  "#F0BB0D",
  "#F3A20F",
  "#F97028",
];

const STRIP_COUNT = COLORS.length;

const SVG_WIDTH = 480.125;
const TOTAL_HEIGHT = 100;        // GSAP math height
const RENDER_HEIGHT = 391.325;   // visual height

const BG_WIDTH = 52;
const FG_WIDTH = 48;

/* 🔧 STRIPE SPACING CONTROL */
const COMPRESSION = .94; // smaller = closer stripes

/* Scroll tuning */
const SCROLL_MULTIPLIER = 11;
const BASE_OFFSET = 300;
const BASE_DURATION = 1180;

/* ---------------- COMPONENT ---------------- */

export default function GSAPVerticalStrips() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const OFFSET_STEP = BASE_OFFSET / SCROLL_MULTIPLIER;
    const DURATION = BASE_DURATION / SCROLL_MULTIPLIER;

    for (let i = 0; i < STRIP_COUNT; i++) {
      const bg = svgRef.current.querySelector(
        `#strip-bg-${i}`
      ) as SVGPathElement;

      const fg = svgRef.current.querySelector(
        `#strip-fg-${i}`
      ) as SVGPathElement;

      if (!bg || !fg) continue;

      const length = bg.getTotalLength();

      gsap.set([bg, fg], {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      const offset = i * OFFSET_STEP;

      gsap.to([bg, fg], {
        strokeDashoffset: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: `top+=${offset} 103%`,
          end: `top+=${offset + DURATION} 20%`,
          scrub: true,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  /* -------- CENTERING + SPACING MATH -------- */
  const STEP = (SVG_WIDTH / STRIP_COUNT) * COMPRESSION;
  const START_X = SVG_WIDTH / 2 + STEP * ((STRIP_COUNT - 1) / 2);

  return (
    <div className="relative z-0 mx-auto ">
      <div className=" flex items-center justify-center">
        {/* Perspective container */}
        <div
          className="2xl:[perspective:200px] xl:[perspective:240px] lg:[perspective:170px] md:[perspective:170px] [perspective:150px] 2xl:w-[482.125px] xl:w-[452px] lg:w-[321.413px] md:w-[416.225px] w-[247.238px] flex justify-center"
          
        >
          <svg
            ref={svgRef}
            width={SVG_WIDTH}
            height={RENDER_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${TOTAL_HEIGHT}`}
            preserveAspectRatio="none"
            className="
              block
              mx-auto
              [transform-style:preserve-3d]
              [transform:rotateX(45deg)]
            "
          >
            {/* BLACK STRIPS */}
            {Array.from({ length: STRIP_COUNT }).map((_, i) => {
              const x = START_X - i * STEP;

              return (
                <path
                  key={`bg-${i}`}
                  id={`strip-bg-${i}`}
                  d={`M${x} 0V${TOTAL_HEIGHT}`}
                  stroke="black"
                  strokeWidth={BG_WIDTH}
                />
              );
            })}

            {/* COLOR STRIPS */}
            {Array.from({ length: STRIP_COUNT }).map((_, i) => {
              const x = START_X - i * STEP;

              return (
                <path
                  key={`fg-${i}`}
                  id={`strip-fg-${i}`}
                  d={`M${x} 0V${TOTAL_HEIGHT}`}
                  stroke={COLORS[i]}
                  strokeWidth={FG_WIDTH}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
