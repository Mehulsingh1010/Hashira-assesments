/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STRIP_COUNT = 9;

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

const SVG_WIDTH = 482.125;
const TOTAL_HEIGHT = 1070;

const OVERLAP = 1.05;

const SCROLL_MULTIPLIER = 2.3;
const BASE_OFFSET = 176;
const BASE_DURATION = 2480;

export default function GSAPVerticalStrips() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        base: "(max-width: 767px)",
        md: "(min-width: 768px) and (max-width: 1023px)",
        lg: "(min-width: 1024px) and (max-width: 1279px)",
        xl: "(min-width: 1280px) and (max-width: 1535px)",
        xxl: "(min-width: 1536px)",
      },
      (context) => {
        const { base, md, lg, xl, xxl } = context.conditions;

        const getStart = (offset: number) => {
          if (xxl) return `top+=${offset} 0%`;
          if (xl) return `top+=${offset} 0%`;
          if (lg) return `top+=${offset} 0%`;
          if (md) return `top+=${offset} 0%`;
          return `top+=${offset} 0%`;
        };

        for (let i = 0; i < STRIP_COUNT; i++) {
          const bg = svgRef.current!.querySelector(
            `#strip-bg-${i}`
          ) as SVGPathElement;

          const fg = svgRef.current!.querySelector(
            `#strip-fg-${i}`
          ) as SVGPathElement;

          if (!bg || !fg) continue;

          const length = bg.getTotalLength();

          gsap.set([bg, fg], {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          const offset = (i * (BASE_OFFSET)) / SCROLL_MULTIPLIER;
          const duration = BASE_DURATION / SCROLL_MULTIPLIER;

          gsap.to([bg, fg], {
            strokeDashoffset: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "body",
              start: `top+=${offset} top`,
              end: `top+=${offset + duration} top`,
              scrub: true,
            },
          });
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const STEP = SVG_WIDTH / STRIP_COUNT;
  const STROKE_BG = STEP * OVERLAP;
  const STROKE_FG = STROKE_BG * 0.92;
  const START_X = SVG_WIDTH - STEP / 2;

  return (
    <div ref={containerRef} className=" w-[247.238px] md:w-[416.225px] lg:w-[321.413px] xl:w-[452px] 2xl:w-[482.125px] mx-auto">
      <div className="relative mx-auto flex justify-center">
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${SVG_WIDTH} ${TOTAL_HEIGHT}`}
          preserveAspectRatio="none"
          style={{ height: `${TOTAL_HEIGHT}px`, display: "block" }}
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
                strokeWidth={STROKE_BG}
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
                strokeWidth={STROKE_FG}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}