/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ScrollTriggerStrips2 from "./AboutStripsBottom";

function About({ onPopupChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef(null);
  const count = 16;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;

      // Distance from center of viewport
      const scrollDistance = elementCenter - windowCenter;
      const maxDistance = window.innerHeight / 2 + rect.height / 2;

      // Progress from 0 to 1 as element moves through viewport
      const progress = Math.max(
        0,
        Math.min(1, (maxDistance - scrollDistance) / (maxDistance * 2))
      );

      // Smooth rotation: -20deg to +20deg as we scroll
      const rotationAmount = 40; // Total degrees of rotation range
      const newRotation = (progress - 0.5) * rotationAmount;
      setRotation(-newRotation);
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    if (onPopupChange) {
      onPopupChange(false);
    }
    setTimeout(() => {
      togglePopup(false);
      setIsClosing(false);
    }, 300);
  };

  const togglePopup = (forceValue: boolean | undefined) => {
    const newState = forceValue !== undefined ? forceValue : !isOpen;
    setIsOpen(newState);
    if (onPopupChange) {
      onPopupChange(newState);
    }
  };

  const styles = `
@keyframes slideLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 23.875px)); }
}

.animate-slide {
  display: flex;
  animation: slideLeft 8s linear infinite;
}

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes popOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.3);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes tiltIn {
    from {
      transform: rotate(-5deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  @keyframes tiltOut {
    from {
      transform: rotate(-1deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  .popup-overlay {
    animation: fadeIn 0.3s ease-out;
  }

  .popup-overlay.closing {
    animation: fadeOut 0.3s ease-in;
  }

  .popup-container {
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .popup-container.closing {
    animation: popOut 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.34);
  }

  .video-frame {
    animation: tiltIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .video-frame.closing {
    animation: tiltOut 0.4s ease-in;
  }
`;

  const borderColors = [
    "border-[#F97028]",
    "border-[#F489A3]",
    "border-[#F3A20F]",
    "border-[#F97028]",
    "border-[#F3A20F]",
    "border-[#F489A3]",
    "border-[#F0BB0D]",
    "border-[#F0BB0D]",
    "border-[#F97028]",
    "border-[#F489A3]",
    "border-[#F3A20F]",
    "border-[#F97028]",
    "border-[#F3A20F]",
    "border-[#F489A3]",
    "border-[#F0BB0D]",
    "border-[#F0BB0D]",
  ];

  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    image: [
      "/corousel/r1.avif", // Item 1 (Right side)
      "/corousel/r1.avif", // Item 2
      "/corousel/r3.avif", // Item 3
      "/corousel/r2.avif", // Item 4 (Changed from r1)
      "/corousel/r1.avif", // Item 5 (Changed from l1)
      "/corousel/r2.avif", // Item 6 (Changed from l2)
      "/corousel/r3.avif", // Item 7 (Changed from l3)
      "/corousel/r2.avif", // Item 8 (Changed from l1)

      "/corousel/l1.avif", // Item 9 (Left side)
      "/corousel/l1.avif", // Item 10
      "/corousel/l2.avif", // Item 11
      "/corousel/l3.avif", // Item 12 (Changed from r1)
      "/corousel/l1.avif", // Item 13 (Changed from l1)
      "/corousel/l2.avif", // Item 14 (Changed from l2)
      "/corousel/l3.avif", // Item 15 (Changed from l3)
      "/corousel/l4.avif", // Item 16 (Changed from l1)
    ][i],
    borderColor: borderColors[i],
  }));

  const firstHalf = items.slice(0, count / 2);
  const secondHalf = items.slice(count / 2);

  const renderHalfCircle = (itemsToRender: any[], side: string) => {
    return itemsToRender.map(
      (
        item: {
          id: React.Key | null | undefined;
          borderColor: any;
          image: string | Blob | undefined;
          name: string | undefined;
        },
        index: number
      ) => {
        const angleSpread =
          typeof window !== "undefined"
            ? window.innerWidth < 425
              ? 200
              : window.innerWidth < 769
              ? 340
              : window.innerWidth < 1025
              ? 200
              : 300
            : 360;

        const angle = (index / itemsToRender.length) * angleSpread;

        const radius =
          typeof window !== "undefined"
            ? window.innerWidth < 769
              ? 240
              : window.innerWidth < 1024
              ? 270
              : 300
            : 300;

        let adjustedAngle;

        // For mobile/tablet (top/bottom)
        if (side === "top" || side === "bottom") {
          adjustedAngle = side === "top" ? angle + 270 : angle + 90;
        } else {
          // For desktop (left/right)
          adjustedAngle = side === "left" ? angle : angle + 180;
        }

        const x = Math.cos((adjustedAngle - 90) * (Math.PI / 180)) * radius;
        const y = Math.sin((adjustedAngle - 90) * (Math.PI / 180)) * radius;

        return (
          <div
            key={item.id}
            className="absolute transition-transform duration-100 ease-out"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation}deg)`,
              width: "144px",
            }}
          >
            <div
              className={`rounded-lg shadow-xl w-[75.5625px] h-[75.5625px] md:w-[125.225px] md:h-[125.225px] lg:w-[95.1px] xl:w-[132.8px] 2xl:w-[144px] lg:h-[95.1px] xl:h-[132.8px] 2xl:h-[144px] flex items-center justify-center hover:shadow-2xl transition-shadow bg-white border-[1.6px] ${item.borderColor}`}
            >
              {" "}
              <img
                  src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                  alt={item.name}
                  className="h-full w-full object-cover rounded-lg"
                />
              {/* no nextjs img coz blob doesnt take that type or src (string) */}{" "}
            </div>
          </div>
        );
      }
    );
  };

  const sponsorContent = (
    <>
      {/* dot */}
      <div className="w-[20px] md:w-[35px] md:h-[35px] lg:h-[30px] lg:w-[30px] xl:w-[40px] xl:h-[40px] 2xl:h-[40px] h-[20px] 2xl:w-[40px] flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 25 25" fill="none">
          <circle
            cx="12.5"
            cy="12.5"
            r="1.5"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="flex-shrink-0 cursor-write xl:text-[30px] lg:text-[21.3333px] md:text-[27.6259px]">
        Sponsored by
      </div>

      {/* dot */}
      <div className="w-[20px] md:w-[35px] md:h-[35px] lg:h-[30px] lg:w-[30px] xl:w-[40px] xl:h-[40px] 2xl:h-[40px] h-[20px] 2xl:w-[40px] flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 25 25" fill="none">
          <circle
            cx="12.5"
            cy="12.5"
            r="1.5"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Osmos logo */}
      <div className="w-[88.225px] md:h-[24.8625px] md:w-[111.412px] lg:w-[86.0375px] lg:h-[19.2px] xl:w-[121px] xl:h-[27px] 2xl:w-[128.387px] h-[19.6875px] 2xl:h-[28.65px] flex-shrink-0 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox="0 0 121 27"
          fill="none"
        >
          <path
            d="M109.195 9.08854C108.771 9.51372 108.047 9.2126 108.047 8.61124V0H105.357V10.125C105.357 11.2434 104.454 12.15 103.34 12.15H93.254V14.85H101.832C102.431 14.85 102.731 15.577 102.307 16.0023L96.3374 21.9954L98.2389 23.9046L104.209 17.9115C104.632 17.4876 105.353 17.7856 105.357 18.3834V27H108.047V16.875C108.047 15.7566 108.95 14.85 110.064 14.85H120.15V12.15H111.567C110.973 12.1457 110.676 11.4259 111.093 11.0015L111.096 10.9977L117.067 5.00459L115.164 3.09543L109.195 9.08854Z"
            fill="currentColor"
          ></path>
          <path
            d="M10.8567 25.0952C4.23753 25.0952 0 20.2203 0 13.5446C0 6.8688 4.23753 2.025 10.8567 2.025C17.476 2.025 21.7135 6.8688 21.7135 13.5446C21.7135 20.2203 17.476 25.0952 10.8567 25.0952ZM3.55705 13.5446C3.55705 18.1089 5.62941 22.1454 10.8567 22.1454C16.084 22.1454 18.1564 18.1089 18.1564 13.5446C18.1564 8.9802 16.084 4.97475 10.8567 4.97475C5.62941 4.97475 3.55705 8.9802 3.55705 13.5446Z"
            fill="currentColor"
          ></path>
          <path
            d="M30.6976 25.0951C25.9034 25.0951 23.5217 22.6111 23.4289 19.3819H26.491C26.6148 21.2139 27.7282 22.6422 30.6667 22.6422C33.3268 22.6422 34.0381 21.4623 34.0381 20.3134C34.0381 18.3262 31.9348 18.1089 29.8934 17.6742C27.1406 17.0221 23.9856 16.2148 23.9856 12.9235C23.9856 10.1911 26.1817 8.35918 29.9862 8.35918C34.3165 8.35918 36.3889 10.6879 36.6054 13.4203H33.5433C33.3268 12.2094 32.6772 10.8121 30.0481 10.8121C28.0067 10.8121 27.1406 11.6194 27.1406 12.7993C27.1406 14.445 28.9036 14.6002 31.1306 15.097C34.0381 15.7801 37.1931 16.6185 37.1931 20.1582C37.1931 23.2321 34.8423 25.0951 30.6976 25.0951Z"
            fill="currentColor"
          ></path>
          <path
            d="M49.0483 14.5071C49.0483 12.3957 48.6152 10.9674 46.2954 10.9674C44.0375 10.9674 42.6146 12.5509 42.6146 14.9418V24.6604H39.5834V8.82493H42.6146V10.8121H42.6765C43.5116 9.60118 44.9654 8.35918 47.3471 8.35918C49.5432 8.35918 50.9041 9.35278 51.5227 11.1226H51.5846C52.729 9.60118 54.3374 8.35918 56.75 8.35918C59.9359 8.35918 61.5443 10.2843 61.5443 13.6687V24.6604H58.5131V14.5071C58.5131 12.3957 58.0801 10.9674 55.7603 10.9674C53.5023 10.9674 52.0795 12.5509 52.0795 14.9418V24.6604H49.0483V14.5071Z"
            fill="currentColor"
          ></path>
          <path
            d="M71.9179 25.1262C67.0001 25.1262 64.0307 21.7107 64.0307 16.7427C64.0307 11.8058 67.0001 8.32816 71.949 8.32816C76.836 8.32816 79.8053 11.7747 79.8053 16.7117C79.8053 21.6797 76.836 25.1262 71.9179 25.1262ZM67.1857 16.7427C67.1857 20.034 68.6705 22.6112 71.949 22.6112C75.166 22.6112 76.6503 20.034 76.6503 16.7427C76.6503 13.4204 75.166 10.8743 71.949 10.8743C68.6705 10.8743 67.1857 13.4204 67.1857 16.7427Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* dot */}
      <div className="w-[20px] md:w-[35px] md:h-[35px] lg:h-[30px] lg:w-[30px] xl:w-[40px] xl:h-[40px]  2xl:h-[40px] h-[20px] 2xl:w-[40px] flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 25 25" fill="none">
          <circle
            cx="12.5"
            cy="12.5"
            r="1.5"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Webflow logo */}
      <div className="w-[106.963px] md:h-[height22.1px] md:w-[130.962px] lg:w-[101.1px] lg:h-[17.0625px] xl:w-[142.212px] xl:h-[24px] 2xl:w-[150.887px] h-[18.05px] 2xl:h-[25.4625px] flex-shrink-0 flex items-center justify-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox="0 0 160 27"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.7295 0L29.095 27H16.2885L21.9945 15.81H21.7384C17.031 22.0003 10.0075 26.0753 0 27V15.9649C0 15.9649 6.40204 15.5819 10.1656 11.5736H0V0.000213272H11.425V9.51917L11.6815 9.5181L16.3501 0.000213272H24.9906V9.45883L25.247 9.4584L30.0909 0H42.7295Z"
            fill="currentColor"
          ></path>
          <path
            d="M117.079 24.0198H120.759V2.625H117.079V24.0198Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M96.7945 23.8013C97.5941 24.1381 98.4073 24.3065 99.234 24.3065C100.6 24.3065 101.822 23.9697 102.9 23.2961C103.978 22.6226 104.814 21.6941 105.407 20.5108C106 19.3185 106.297 17.9668 106.297 16.4558C106.297 14.9449 105.991 13.5932 105.38 12.4008C104.769 11.2084 103.92 10.2845 102.833 9.62916C101.745 8.9647 100.51 8.63702 99.1261 8.64615C98.2457 8.64615 97.4012 8.81908 96.5923 9.16498C95.7838 9.51083 95.1098 10.0024 94.5704 10.6395C94.5289 10.688 94.4883 10.737 94.4494 10.7865V2.63867H90.7563V24.0198H94.4223L94.4147 22.0223C94.5099 22.1401 94.611 22.2552 94.7189 22.3677C95.3027 22.9776 95.9949 23.4554 96.7945 23.8013ZM100.568 20.347C99.9663 20.7202 99.2788 20.9068 98.5063 20.9068C97.7426 20.9068 97.0416 20.7157 96.4036 20.3334C95.7656 19.942 95.2579 19.4095 94.8805 18.7359C94.512 18.0624 94.328 17.2978 94.328 16.4422C94.3191 15.5866 94.4985 14.822 94.867 14.1484C95.2443 13.4657 95.752 12.9378 96.39 12.5646C97.028 12.1823 97.7333 11.9957 98.5063 12.0049C99.2788 11.9957 99.9663 12.1778 100.568 12.551C101.179 12.9151 101.647 13.4384 101.97 14.1211C102.303 14.7947 102.469 15.5683 102.469 16.4422C102.469 17.316 102.303 18.0897 101.97 18.7632C101.647 19.4368 101.179 19.9647 100.568 20.347Z"
            fill="currentColor"
          ></path>
          <path
            d="M48.0605 3.92206H52.2655L56.0275 17.8385L60.029 3.92206H63.5333L67.8737 17.5592L71.4855 3.92206H75.3406L69.6527 24.0198H66.0269L61.6138 10.6974L57.5624 24.0198H53.8965L48.0605 3.92206Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M81.5504 24.3747C80.0857 24.3838 78.7649 24.0561 77.5879 23.3917C76.4198 22.7181 75.4987 21.7851 74.8248 20.5927C74.1597 19.4003 73.8271 18.0396 73.8271 16.5104C73.8271 15.0267 74.1686 13.6842 74.8518 12.4827C75.5347 11.2812 76.46 10.3436 77.6281 9.67009C78.7962 8.9965 80.0993 8.65973 81.5369 8.65973C83.1543 8.65973 84.5695 9.02384 85.7825 9.75199C87.0047 10.4802 87.9165 11.5133 88.5185 12.8513C89.1294 14.1802 89.3498 15.7048 89.1789 17.4252H77.634C77.6661 18.1105 77.835 18.734 78.1404 19.2957C78.4818 19.9146 78.9582 20.3971 79.5691 20.7429C80.1801 21.0888 80.8629 21.2617 81.6177 21.2617C82.1926 21.2527 82.7274 21.1525 83.2216 20.9614C83.7157 20.7611 84.1337 20.4926 84.4751 20.1558C84.8255 19.819 85.0725 19.4368 85.2164 19.009H89.071C88.8375 20.0557 88.3704 20.9887 87.6694 21.8079C86.9688 22.618 86.0879 23.2506 85.0277 23.7057C83.9675 24.1608 82.8082 24.3838 81.5504 24.3747ZM78.154 13.6705C77.9386 14.0509 77.7893 14.4605 77.7063 14.8993H85.3594C85.3035 14.3449 85.1347 13.8397 84.8525 13.3838C84.5289 12.8467 84.0889 12.4326 83.5317 12.1413C82.9745 11.841 82.3454 11.6908 81.6448 11.6908C80.8989 11.6908 80.2207 11.8637 79.6093 12.2096C78.9984 12.5555 78.5131 13.0425 78.154 13.6705Z"
            fill="currentColor"
          ></path>
          <path
            d="M109.006 8.97377C109.006 7.7541 109.28 6.67092 109.828 5.7243C110.376 4.76858 111.145 4.02674 112.133 3.49881C113.13 2.96178 114.294 2.68416 115.624 2.66595V5.98371C115.004 5.9928 114.474 6.1248 114.033 6.37967C113.602 6.62541 113.27 6.98494 113.036 7.45825C112.821 7.89402 112.705 8.39918 112.688 8.97377H115.543V12.1277H112.685V24.0198H109.006V12.1277H106.634V8.97377H109.006Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M130.113 24.3474C128.612 24.3474 127.269 24.0152 126.082 23.3507C124.905 22.6772 123.98 21.7487 123.306 20.5655C122.641 19.373 122.309 18.0214 122.309 16.5104C122.309 14.9903 122.641 13.6341 123.306 12.4417C123.98 11.2402 124.905 10.3073 126.082 9.6428C127.269 8.97835 128.612 8.64612 130.113 8.64612C131.622 8.64612 132.97 8.97835 134.156 9.6428C135.351 10.3073 136.281 11.2357 136.946 12.4281C137.611 13.6205 137.948 14.9812 137.957 16.5104C137.948 18.0214 137.611 19.373 136.946 20.5655C136.29 21.7487 135.365 22.6772 134.17 23.3507C132.974 24.0152 131.622 24.3474 130.113 24.3474ZM130.113 20.9204C130.903 20.9204 131.604 20.7384 132.215 20.3743C132.826 20.0011 133.298 19.4823 133.631 18.8178C133.963 18.1442 134.129 17.3751 134.129 16.5104C134.129 15.6366 133.963 14.8629 133.631 14.1893C133.298 13.5158 132.826 12.997 132.215 12.6329C131.604 12.2597 130.903 12.0731 130.113 12.0731C129.331 12.0731 128.634 12.2597 128.024 12.6329C127.421 12.997 126.954 13.5158 126.622 14.1893C126.289 14.8629 126.128 15.6366 126.137 16.5104C126.137 17.3751 126.303 18.1442 126.635 18.8178C126.977 19.4823 127.444 20.0011 128.037 20.3743C128.639 20.7384 129.331 20.9204 130.113 20.9204Z"
            fill="currentColor"
          ></path>
          <path
            d="M141.933 8.97375H137.835L142.27 24.0197H145.855L148.771 14.4099L151.921 24.0197H155.452L159.899 8.97375H156.193L153.671 18.3389L150.883 8.97375H147.297L144.523 18.5452L141.933 8.97375Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </>
  );

  return (
    <div className="">
      <div className="overflow-hidden mt-[-1340px] md:mt-[-1130px] lg:mt-[-1490px] xl:mt-[-1250px] 2xl:mt-[-1170px] ">
        <style>{styles}</style>
        <div className="pt-[178px] w-[1398.82px] md:w-[1992px] xl:w-[2164px] 2xl:w-[120%] ">
          <div className="relative h-[75.5625px] md:h-[85.2px] lg:h-[66.66px] xl:h-[96px] 2xl:h-[98.6625px] w- bg-[#F3A20F] text-white text-[21.3333px] 2xl:text-[31.8333px] font-heading-bold border-t-[1.6px] border-b-[1.6px] border-black shadow-[0px_6px_0px_0px] shadow-[rgb(0,0,0,0.2)] overflow-hidden">
            <div className="animate-slide flex items-center  gap-[19.6923px] 2xl:gap-[47.75px] h-full whitespace-nowrap">
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
              {sponsorContent}
            </div>
          </div>
        </div>
      </div>
      <div className=" ">
        <div
          id="about"
          ref={containerRef}
          className="overflow-hidden bg-black  lg:pt-[130.8px] px-[13.12px] md:px-[44.2px] pt-[151.8px] lg:px-[45.5px] xl:pt-[151.8px] xl:px-[64px] 2xl:pt-[153px]  2xl:px-[72px] "
        >
          <div className="w-full max-w-[1392px] mx-auto flex flex-col items-start">
            <div
              className="bg-[#3185f5] flex items-center rounded-t-[2px] pt-[3px] pb-[2px] px-[8px] z-10"
              style={{
                fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              }}
            >
              <svg
                className="h-[8px] w-[8px] xl:h-[11px] xl:w-[11px] flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 14"
                fill="none"
              >
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  stroke="currentColor"
                />
              </svg>
              <span className="ml-[4px] text-[9px] md:text-[10px] xl:text-[11px] leading-none whitespace-nowrap">
                What is FlowFest?
              </span>
            </div>

            <div className="w-full max-w-[1392px] mx-auto">
              <div className=" h-[689.03px] md:h-[810.575px] xl:h-[509px] lg:h-[340.612px] mx-auto relative bg-black  border-[#3185f5]  justify-between flex border-[2px] relative overflow-hidden z-[1]" >
                {/* BOTTOM carousel for mobile/tablet */}
                <div className=" lg:hidden">
                  <div
                    className="absolute  w-full bottom-[-160px] md:bottom-[-120px] lg:bottom-[-270px] pointer-events-none"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {renderHalfCircle(firstHalf, "top")}
                    </div>
                  </div>
                </div>

                {/* LEFT carousel for desktop */}
                <div className="w-[250px] hidden lg:block">
                  <div
                    className="absolute lg:left-[-300px] xl:left-[-250px] top-0 h-full w-[250px] pointer-events-none"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {renderHalfCircle(secondHalf, "left")}
                    </div>
                  </div>
                </div>

                <div>
                  <div className=" pt-[196.9px] md:pt-[257px] lg:pt-[68px] xl:pt-[101px] font-heading-bold text-[36.1026px] md:text-[59.8561px] lg:text-[46.2222px] xl:text-[65px] 2xl:text-[68.9722px] text-center leading-none">
                    <h2 className="m-0 p-0 leading-none">The No.1 Fest for:</h2>

                    <div className="bg-[#F3A20F] mt-1 md:mt-0 w-[245.488px] md:w-[549.25px]  lg:w-[423.263px] xl:w-[596.2px] 2xl:w-[634px] md:h-[65.7375px] lg:h-[49.875px] xl:h-[71.125px] 2xl:h-[75.2625px] border-[1.6px] border-black text-nowrap font-heading-bold text-[36.1026px] md:text-[56.8633px] lg:text-[43.9111px] xl:text-[61.75px] 2xl:text-[65.5236px] rounded-md px-[16.3809px] rotate-[-1deg] shadow-[0px_6px_0px_0px] shadow-[#353535] mx-auto  flex items-center justify-center rotate-[-3deg] md:rotate-none">
                      <h2 className="m-0 p-0 leading-none">
                        Web Designers{" "}
                        <span className="md:hidden">
                          {" "}
                          <br />
                        </span>{" "}
                        & Devs
                      </h2>
                    </div>
                  </div>

                  <div className="pt-[26.2564px] md:pt-[29.4676px] xl:pt-[31px] lg:pt-[22.7556px] w-[265.188px] md:w-[368.337px] lg:w-[284.438px] xl:w-[400] 2xl:w-[424px]  mx-auto text-center text-[13.1282px]  md:text-[14.7338px] lg:text-[11.3778px] xl:text-[16px] 2xl:text-[16.9778px] leading-[17.0667px] md:leading-[19.154px] lg:leading-[14.7911px] xl:leading-[20.8px] 2xl:leading-[22.0711px] font-[500]">
                    {" "}
                    <p>
                      It's like a conference, but it's outside, with steel
                      drums, pints and way cooler vibes. Listen to web design &
                      dev talks whilst having a belting time.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePopup(true)}
                    className=" hover:translate-y-[4px] transition-transform duration-200 cursor-pointer flex items-center mt-[26.2564px] md:mt-[29.4676px] lg:mt-[22.7556px] xl:mt-[33px] mx-auto xl:w-[236.163px] w-[224.962px] md:w-[217.65px] lg:w-[167.225px] 2xl:w-[250px] h-[45.125px]  md:h-[44.2px] xl:h-[48px] lg:h-[34.125px] 2xl:h-[51px] rounded-[30px] bg-[#FFFEFB] px-[22.974px] md:px-[18.417px] lg:px-[14.22px] xl:px-[20px] 2xl:px-[22px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 28 28"
                      className=" h-[16px] w-[16px] mr-1 md:h-[20px] md:mr-[3px]  md:w-[20px] lg:w-[14px] lg:h-[14px] xl:w-[18px] 2xl:w-[20px] xl:h-[18px] xl:mr-[2px] 2xl:h-[20px] mb-[-1px] flex-shrink-0"
                      fill="#F489A3"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeMiterlimit="10"
                    >
                      <path d="M4 12V4.46282C4 2.9235 5.66611 1.96122 6.99944 2.73045L13.5333 6.5L20.0639 10.2676C21.398 11.0373 21.398 12.9627 20.0639 13.7324L13.5333 17.5L6.99945 21.2696C5.66611 22.0388 4 21.0765 4 19.5372V12Z" />
                    </svg>

                    <p className="text-nowrap text-black text-[14.76px] md:text-[14.7338px] lg:text-[11.3778px] xl:text-[16px] 2xl:text-[16.9778px] m-0">
                      Watch the 2024 Recap
                    </p>
                  </button>
                  {isOpen && (
                    <div
                      className={`popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[50000] ${
                        isClosing ? "closing" : ""
                      }`}
                      style={{ animationDuration: "0.3s" }}
                    >
                      <style>{styles}</style>
                      <div
                        className={`popup-container fixed inset-0 w-screen h-screen flex items-center justify-center ${
                          isClosing ? "closing" : ""
                        }`}
                        style={{ background: "#F97028" }}
                      >
                        <div
                          className={`video-frame  flex items-center justify-center w-[293.725px] md:w-[679.575px] lg:w-[841.95px] xl:w-[851.9px] 2xl:w-[994.4px] h-[165.225px] md:h-[382.263px] lg:h-[473.6px] xl:h-[479.2px] 2xl:h-[560px] ${
                            isClosing ? "closing" : ""
                          }`}
                          style={{
                            padding: "",
                          }}
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/0njOFCPorQc"
                            title="FlowFest 2024"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              borderRadius: "26px",
                              border: "1.6px solid black",
                              boxShadow: "0 8px 0 rgba(0,0,0,0.1)",
                            }}
                          ></iframe>
                        </div>

                        <button
                          onClick={handleClose}
                          className=" cursor-pointer  absolute top-4 right-4 w-[46.6875px] h-[46.6875px] bg-white rounded-full flex items-center justify-center border-[1.6px] border-black z-10
             shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-none"
                          aria-label="Close"
                        >
                          <X
                            size={20}
                            className="text-black rotate-[-3deg]"
                            strokeWidth={3}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT carousel for desktop */}
                <div className="w-[250px] hidden lg:block">
                  <div
                    className="absolute lg:right-[-350px] xl:right-[-250px] top-0 h-full w-[250px] pointer-events-none"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {renderHalfCircle(firstHalf, "right")}
                    </div>
                  </div>
                </div>

                {/* TOP carousel for mobile/tablet */}
                <div className="h-[250px] lg:hidden">
                  <div
                    className="absolute left-0 top-[-270px] md:top-[-250px] lg:top-[-270px] w-full h-[250px] pointer-events-none"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {renderHalfCircle(secondHalf, "bottom")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[388px] z-[0]">
            <div className=" mt-[-210px] ">
              <ScrollTriggerStrips2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
