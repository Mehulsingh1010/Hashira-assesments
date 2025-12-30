/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

function Team() {
  const cursor1Ref = useRef(null);
  const container1Ref = useRef(null);
  const cursor2Ref = useRef(null);
  const container2Ref = useRef(null);
  const cursor3Ref = useRef(null);
  const container3Ref = useRef(null);
  const cursor4Ref = useRef(null);
  const container4Ref = useRef(null);
  const cursor5Ref = useRef(null);
  const container5Ref = useRef(null);

  useEffect(() => {
    const setupCursor = (cursorEl, containerEl) => {
      if (!cursorEl || !containerEl) return;

      // Set initial position at bottom center of image
      const centerX = containerEl.offsetWidth / 2 - 94;
      const bottomY = containerEl.offsetHeight - 62;
      gsap.set(cursorEl, { x: centerX, y: bottomY });

      const moveCursor = (e) => {
        const rect = containerEl.getBoundingClientRect();
        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 20;
        gsap.to(cursorEl, {
          x,
          y,
          duration: 0.25,
          ease: "power3.out",
        });
      };

      const leaveCursor = () => {
        const rect = containerEl.getBoundingClientRect();
        const centerX = containerEl.offsetWidth / 2 - 94;
        const bottomY = containerEl.offsetHeight - 62;
        gsap.to(cursorEl, {
          x: centerX,
          y: bottomY,
          duration: 0.45,
          ease: "power4.out",
        });
      };

      containerEl.addEventListener("mousemove", moveCursor);
      containerEl.addEventListener("mouseleave", leaveCursor);

      return () => {
        containerEl.removeEventListener("mousemove", moveCursor);
        containerEl.removeEventListener("mouseleave", leaveCursor);
      };
    };

    const cleanup1 = setupCursor(cursor1Ref.current, container1Ref.current);
    const cleanup2 = setupCursor(cursor2Ref.current, container2Ref.current);
    const cleanup3 = setupCursor(cursor3Ref.current, container3Ref.current);
    const cleanup4 = setupCursor(cursor4Ref.current, container4Ref.current);
    const cleanup5 = setupCursor(cursor5Ref.current, container5Ref.current);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
      cleanup4?.();
      cleanup5?.();
    };
  }, []);

  return (
    <>
      <div   id="speakers" className="border-b-[2px] border-t-[3.5px] border-black px-[13.12px] overflow-hidden md:px-[42.2px] lg:px-[45.51px] xl:px-[64px] 2xl:px-[68px] mt-[-34px] rounded-bl-[60px] rounded-br-[60px] text-black mb-[-60px] relative bg-[#F3ECD2] ">
        <div className=" w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1400px] md:gap-x-[55.2518px] lg:gap-x-[42.6667px] xl:gap-x-[60px] 2xl:gap-x-[64px] h-full">
          
          {/* Item 1 - Text Section */}
          <div className="order-1  md:order-1 lg:order-1 border-l-[3px] border-r-[3px] border-[#D2CCB6] max-w-[420px] pt-[78px] md:pt-[209px] lg:pt-[184px] xl:pt-[262px] 2xl:pt-[230px] pb-[50.76px] md:pb-[189.8px]">
            <div className="px-4 flex  flex-col items-center text-center md:px-[29.46px] md:items-start md:text-left lg:px-[22.75px] xl:pl-[30px] 2xl:pl-[33px] md:pr-[122px]">
              <h2 className="cursor-write mb-[-14px] md:mb-[-16px]   2xl:mb-[-23px] xk:mb-[-25px] text-[45.9487px] md:text-[59.8561px] lg:text-[46.2222px] xl:text-[65px] 2xl:text-[68.9722px] font-heading-bold text-nowrap">
                Our 2025
              </h2>
              <div>
              <div className="lg:w-[170.11px] xl:w-[256.663px] relative inline-flex items-center justify-center">
                <h2 className="leading-none z-20 px-[10.9128px] pt-[6.54769px] md:px-[14.2158px] md:pt-[8.5295px] text-[43.6513px] md:text-[56.8633px] lg:text-[43.9111px] lg:px-[10.9778px] lg:pt-[6.58667px] xl:text-[61.75px] 2xl:text-[65.8667px] 2xl:px-[16.4667px] shadow-[0px_6px_0px_0px] shadow-[rgba(0,0,0,0.2)] font-heading-bold text-white bg-[#F3A20F] border-[1.6] border-black rounded-sm rotate-[-1deg] text-center">
                  Speaker 
                </h2>
              </div>

              <div>
                <h2 className="pt-[6.58667px] px-[10.9128px] md:px-[14.2158px] inline-block ml-2 rotate-[2deg] text-[43.6513px] md:text-[56.8633px] lg:text-[43.9111px] xl:text-[61.75px] 2xl:text-[65.8667px] leading-none font-heading-bold text-white bg-[#F97028] border-[1.6] border-black rounded-sm lg:px-[10.9778px] xl:px-[16px]">
                  Lineup
                </h2>
              </div></div>
              
              <div className="w-[254.363px]  mb-[19px] text-[13.1282px] leading-[17.0667px] w-[267.5px] leading-[17.0667px] lg:h-[68.25px] text-[13.1282px] text-center md:text-left md:w-[235.738px]  md:text-[14.7338px] md:leading-[19.154px] mt-[19.6923px] md:mt-[31px] cursor-write md:leading-[19.154px] lg:leading-[14.7911px] xl:leading-[20.8px] 2xl:leading-[22.0711px] md:text-[14.7338px] lg:text-[11.37778px] xl:text-[16px] 2xl:text-[16.9778px] md:w-[235.738px] lg:w-[182.038px] xl:w-[256px] 2xl:w-[271.638px] mt-[34.1333px]">
                <p className="font-quicksand">
                  Yep, we got <span className="font-bold">Vladdy Daddy</span>{" "}
                  for the keynote. Plus some absolute
                  <span className="font-bold"> legends</span> that will also be
                  sharing the stage. (More speaker
                  <span className="font-bold"> announcenemts</span> to come!)
                </p>
              </div>

             
                <button className="md:mt-2 lg:mt-[14px] xl:mt-[42px] 2xl:mt-[54.1333px] cursor-pointer flex items-center justify-center border-2 border-[#121212] rounded-[170.667px] w-[129.312px] md:w-[119.988px] lg:w-[91.7875px] xl:w-[138.5px] xl:h-[46.925px] lg:px-[14.2222px] h-[45.125px] md:h-[40.5125px] lg:h-[31.2875px] xl:px-[21.3333px] xl:py-[1.70667px] text-[#121212] text-[14.7692px] md:text-[14.7338px] lg:text-[11.3778px] xl:text-[17.0667px] font-normal xl:leading-[17.0667px] bg-[#f489a3] whitespace-nowrap shadow-[0px_4.26667px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out hover:translate-y-[4.26667px] hover:shadow-none active:translate-y-[4.26667px] active:shadow-none">
                  Buy Tickets
                </button>
             
            </div>
          </div>

          {/* Item 2 - Casie Evans */}  
          <div className="order-4 md:order-4 lg:order-4 border-l-[3px] border-r-[3px] border-[#D2CCB6] max-w-[420px]  md:mt-[-100px] lg:mt-[-82px] xl:mt-[-104px] lg:mt-0 pb-[50.76px] md:pb-[117.8px]">
            <div className="xl:text-[16px] xl:px-[10px] xl:w-[113.5px] 2xl:h-[47px] xl:h-[44px] 2xl:w-[120.7px]  lg:h-[31.29px] h-[36.1px] w-[93.6px] px-[13.128px] text-[13.1282px] mb-[-18.0513px] 2xl:text-[17.0667px] 2xl:mb-[-23px] bg-white border-[1.6px] z-10 mx-auto rounded-lg  flex items-center justify-center relative">
              Animation
            </div>
            <div className="cursor-blind relative">
              <div
                ref={cursor1Ref}
                className="absolute z-50 pointer-events-none flex items-center gap-[8px]"
                style={{ transform: "translate(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M1.37207 3.99438C0.893838 2.31674 2.63215 0.917659 4.16699 1.65161L19.2695 8.8772L19.415 8.95337C20.8186 9.76057 20.7125 11.8395 19.2295 12.4954L19.0762 12.5559L12.8652 14.7561H12.8643L9.59863 20.4348C8.74532 21.9184 6.5585 21.7032 5.98145 20.1409L5.93066 19.9856L1.37207 3.99438Z"
                    fill="#F17100"
                    stroke="#121212"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="px-[16px] py-[6px] ml-[-15px] mb-[-40px] border-[1.6px] border-black text-[16.9778px] rounded-full bg-[#F17100] text-white text-[14px] font-semibold leading-none whitespace-nowrap shadow-md">
                  Casie Evans
                </div>
              </div>
              <div
                ref={container1Ref}
                className="relative lg:h-[317.625px] xl:h-[443.337px] 2xl:h-[470.66px] border-[1.6px] shadow-[rgba(0,0,0,0.2)] shadow-[6px_8px_0px_0px_#CFC9B3] mx-auto cursor-blind"
              >
                <div className="absolute -top-[8px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -top-[8px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>

                <div className=" w-[285.8px] h-[326.862px] md:w-[306.138px] lg:w-[274.513px] xl:w-[389.087px] 2xl:w-[416.1px] max-w-[416.1px] md:h-[350.75px] lg:h-[317.625px] xl:h-[439.937px] 2xl:h-[467.5px]">
                  <img
                    src="/t3.avif"
                    alt="Casie Evans"
                    className="object-cover h-gull "
                  />
                </div>
              </div>
              <div className="w-[254.363px]  text-[13.1282px] leading-[17.0667px] md:w-[267.925px] md:h-[141.712px] md:text-[15.65px] md:leading-[19.154px] lg:w-[248.375px] xl:w-[349.29px] 2xl:w-[370.638px] flex justify-center items-center mx-auto lg:text-[11.3778px] xl:text-[17px] 2xl:text-[18.0389px] lg:leading-[14.7911px] xl:leading-[22.1px] 2xl:leading-[22.0711px] lg:h-[92.875px] xl:h-[139.375px] bg-white border-l-[1.6px] border-b-[1.6px] border-r-[1.6px] py-[16.4103px] mt-[-1.64103px] px-[13.1282px] lg:py-[21.2222px] lg:px-[16.9778px] text-center">
                <p className="font-quicksand">
                  Our GSAP <span className="font-bold">fairy codemother</span>{" "}
                  is here to sprinkle some
                  <span className="font-bold"> tween</span>
                  magic,<span className="font-bold"> animation</span> goodness
                  & Webflow's deepest darkest{" "}
                  <span className="font-bold">secrets</span> now she's on the
                  inside.
                </p>
              </div>
            </div>
          </div>

          {/* Item 3 - Vlad Magdalin */}
          <div className="order-2 md:order-2 lg:order-2 border-l-[3px] border-r-[3px] border-[#D2CCB6] max-w-[420px]  md:pt-[130px] lg:pt-[113px] xl:pt-[162px] pb-[50.76px] ">
            <div className="xl:h-[44px] lg:h-[31.29px] h-[36.1px] w-[82.23px] px-[13.128px] text-[13.1282px] md:h-[40.5125px] 2xl:h-[46.6875px] md:w-[91.86px]  xl:w-[99.525px] 2xl:w-[105.4px] mb-[-18.0513px] 2xl:mb-[-23px] bg-white border-[1.6px] z-10 mx-auto rounded-lg md:text-[14.7338px] lg:text-[11.38px] lg:w-[70.09px] xl:text-[16px] 2xl:text-[16.9778px] flex items-center justify-center relative">
              Keynote
            </div>
            <div className="cursor-blind relative">
              <div
                ref={cursor2Ref}
                className="absolute z-50 pointer-events-none flex items-center gap-[8px]"
                style={{ transform: "translate(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M1.37207 3.99438C0.893838 2.31674 2.63215 0.917659 4.16699 1.65161L19.2695 8.8772L19.415 8.95337C20.8186 9.76057 20.7125 11.8395 19.2295 12.4954L19.0762 12.5559L12.8652 14.7561H12.8643L9.59863 20.4348C8.74532 21.9184 6.5585 21.7032 5.98145 20.1409L5.93066 19.9856L1.37207 3.99438Z"
                    fill="#F17100"
                    stroke="#121212"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="text-[13.1282px] lg:text-[14.9778px] px-[9.84616px] lg:px-[16px] h-[29.5375px] lg:h-[36px] ml-[-25px] mb-[-40px] py-[6px] border-[1.6px] border-black  rounded-full bg-[#F17100] text-white  font-semibold leading-none whitespace-nowrap shadow-md">
                  Vlad Magdalin
                </div>
              </div>
              <div
                ref={container2Ref}
                className="relative lg:h-[317.625px] xl:h-[443.337px] 2xl:h-[470.66px] border-[1.6px] shadow-[rgba(0,0,0,0.2)] shadow-[6px_8px_0px_0px_#CFC9B3] mx-auto cursor-blind"
              >
                <div className="absolute -top-[8px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -top-[8px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="w-[285.8px] h-[326.862px] md:w-[306.138px] lg:w-[274.513px] xl:w-[389.087px] 2xl:w-[416.1px] max-w-[416.1px] md:h-[350.75px] lg:h-[317.625px] xl:h-[439.937px] 2xl:h-[467.5px]">
                  <img
                    src="/t1.avif"
                    alt="Vlad Magdalin"
                    className="object-cover h-gull "
                  />
                </div>
              </div>
              <div className="w-[254.363px]  text-[13.1282px] leading-[17.0667px] md:w-[267.925px] md:h-[141.712px] md:text-[15.65px] md:leading-[19.154px] lg:w-[248.375px] xl:w-[349.29px] 2xl:w-[370.638px] flex justify-center items-center mx-auto lg:text-[11.3778px] xl:text-[17px] 2xl:text-[18.0389px] lg:leading-[14.7911px] xl:leading-[22.1px] 2xl:leading-[22.0711px] lg:h-[92.875px] xl:h-[139.375px] bg-white border-l-[1.6px] border-b-[1.6px] border-r-[1.6px] py-[16.4103px] mt-[-1.64103px] px-[13.1282px] lg:py-[21.2222px] lg:px-[16.9778px] text-center">
                <p className="font-quicksand">
                  Our founding <span className="font-bold"> Webflow</span>{" "}
                  father.  Our <br /> <span className="font-bold">dad joke</span>{" "}
                  aficionado. He puts the mad into Magdalin and will be kicking
                  off FlowFest '25 as our
                  <span className="font-bold"> keynote</span> speaker!
                </p>
              </div>
            </div>
          </div>

          {/* Item 4 - Stephanie Bruce */}
          <div className="order-5 md:order-5 lg:order-5 border-l-[3px] border-r-[3px] border-[#D2CCB6] max-w-[420px]   md:mt-[-62px] lg:mt-[-189px] xl:mt-[-217px] lg:mt-0  pb-[50.76px] md:pb-[117.8px]">
            <div className="2xl:h-[47px] xl:h-[44px] xl:w-[87.45px] lg:h-[31.29px] h-[36.1px] 2xl:w-[93px] w-[72.33px] px-[13.128px] text-[13.1282px] mb-[-18.0513px] 2xl:mb-[-23px] bg-white border-[1.6px] z-10 mx-auto rounded-lg 2xl:text-[17.0667px] xl:text-[16.9778px] flex items-center justify-center relative">
              Design
            </div>
            <div className="cursor-blind relative">
              <div
                ref={cursor3Ref}
                className="absolute z-50 pointer-events-none flex items-center gap-[8px]"
                style={{ transform: "translate(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M1.37207 3.99438C0.893838 2.31674 2.63215 0.917659 4.16699 1.65161L19.2695 8.8772L19.415 8.95337C20.8186 9.76057 20.7125 11.8395 19.2295 12.4954L19.0762 12.5559L12.8652 14.7561H12.8643L9.59863 20.4348C8.74532 21.9184 6.5585 21.7032 5.98145 20.1409L5.93066 19.9856L1.37207 3.99438Z"
                    fill="#F17100"
                    stroke="#121212"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="text-[13.1282px] lg:text-[16.9778px] px-[9.84616px] lg:px-[16px] h-[29.5375px] lg:h-[36px] ml-[10px] mb-[-40px] py-[6px] absolute border-[1.6px] border-black  rounded-full bg-[#F17100] text-white font-semibold leading-none whitespace-nowrap shadow-md">
                  Stephanie Bruce
                </div>
              </div>
              <div
                ref={container3Ref}
                className="relative lg:h-[317.625px] xl:h-[443.337px] 2xl:h-[470.66px] border-[1.6px] shadow-[rgba(0,0,0,0.2)] shadow-[6px_8px_0px_0px_#CFC9B3] mx-auto cursor-blind"
              >
                <div className="absolute -top-[8px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -top-[8px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="w-[285.8px] h-[326.862px] md:w-[306.138px] lg:w-[274.513px] xl:w-[389.087px] 2xl:w-[416.1px] max-w-[416.1px] md:h-[350.75px] lg:h-[317.625px] xl:h-[439.937px] 2xl:h-[467.5px]">
                  <img
                    src="/t4.avif"
                    alt="Stephanie Bruce"
                
                    className="object-cover  "
                  />
                </div>
              </div>
              <div className="w-[254.363px]  text-[13.1282px] leading-[17.0667px] md:w-[267.925px] md:h-[141.712px] md:text-[15.65px] md:leading-[19.154px] lg:w-[248.375px] xl:w-[349.29px] 2xl:w-[370.638px] flex justify-center items-center mx-auto lg:text-[11.3778px] xl:text-[17px] 2xl:text-[18.0389px] lg:leading-[14.7911px] xl:leading-[22.1px] 2xl:leading-[22.0711px] lg:h-[92.875px] xl:h-[139.375px] bg-white border-l-[1.6px] border-b-[1.6px] border-r-[1.6px] py-[16.4103px] mt-[-1.64103px] px-[13.1282px] lg:py-[21.2222px] lg:px-[16.9778px] text-center">
                <p className="font-quicksand">
                  Devs want to<span className="font-bold"> work</span> with
                  her, designers want to <span className="font-bold">be</span>{" "}
                  her. Steph has hit the ground running with her{" "}
                  <span className="font-bold">stunning </span> <br /> web work
                  and will be sharing her expert{" "}
                  <span className="font-bold"> freelancer</span> growth{" "}
                  <span className="font-bold">tips.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Item 5 - Ilja van Eck */}
          <div className="order-3 md:order-3 lg:order-3 border-l-[3px] border-r-[3px] border-[#D2CCB6] max-w-[420px]  lg:pt-[229px] xl:pt-[322px] pb-[50.76px] md:pb-[117.8px]">
            <div className="xl:h-[44px] lg:h-[31.29px] h-[36.1px] w-[114.58px] px-[13.128px] text-[13.1282px] md:w-[128.15px] md:h-[40.51px] 2xl:h-[46.6875px] xl:w-[138.95px] 2xl:w-[147px] mb-[-18.0513px] 2xl:mb-[-23px] bg-white border-[1.6px] z-10 mx-auto rounded-lg md:text-[14.7338px] xl:text-[16px] 2xl:text-[16.9778px] flex items-center justify-center relative">
              Development
            </div>
            <div className="cursor-blind relative">
              <div
                ref={cursor4Ref}
                className="absolute z-50 pointer-events-none flex items-center gap-[8px]"
                style={{ transform: "translate(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M1.37207 3.99438C0.893838 2.31674 2.63215 0.917659 4.16699 1.65161L19.2695 8.8772L19.415 8.95337C20.8186 9.76057 20.7125 11.8395 19.2295 12.4954L19.0762 12.5559L12.8652 14.7561H12.8643L9.59863 20.4348C8.74532 21.9184 6.5585 21.7032 5.98145 20.1409L5.93066 19.9856L1.37207 3.99438Z"
                    fill="#F17100"
                    stroke="#121212"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="px-[16px] py-[6px] ml-[-15px] mb-[-40px] border-[1.6px] border-black text-[16.9778px] rounded-full bg-[#F17100] text-white text-[14px] font-semibold leading-none whitespace-nowrap shadow-md">
                  Ilja van Eck
                </div>
              </div>
              <div
                ref={container4Ref}
                className="relative lg:h-[317.625px] xl:h-[443.337px] 2xl:h-[470.66px] border-[1.6px] shadow-[rgba(0,0,0,0.2)] shadow-[6px_8px_0px_0px_#CFC9B3] mx-auto cursor-blind"
              >
                <div className="absolute -top-[8px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -top-[8px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="w-[285.8px] h-[326.862px] md:w-[306.138px] lg:w-[274.513px] xl:w-[389.087px] 2xl:w-[416.1px] max-w-[416.1px] md:h-[350.75px] lg:h-[317.625px] xl:h-[439.937px] 2xl:h-[467.5px]">
                  <img
                    src="/t2.avif"
                    alt="Ilja van Eck"
                    className="object-cover h-gull "
                  />
                </div>
              </div>
              <div className="w-[254.363px]  text-[13.1282px] leading-[17.0667px] md:w-[267.925px] md:h-[141.712px] md:text-[15.65px] md:leading-[19.154px] lg:w-[248.375px] xl:w-[349.29px] 2xl:w-[370.638px] flex justify-center items-center mx-auto lg:text-[11.3778px] xl:text-[17px] 2xl:text-[18.0389px] lg:leading-[14.7911px] xl:leading-[22.1px] 2xl:leading-[22.0711px] lg:h-[92.875px] xl:h-[139.375px] bg-white border-l-[1.6px] border-b-[1.6px] border-r-[1.6px] py-[16.4103px] mt-[-1.64103px] px-[13.1282px] lg:py-[21.2222px] lg:px-[16.9778px] text-center">
                <p className="font-quicksand">
                  Oh <span className="font-bold">'Eck</span>, we've only gone
                  and secured the web{" "}
                  <span className="font-bold">wizard</span> himself.
                  Co-founder <br /> of{" "}
                  <span className="font-bold">Osmo </span>& Webflow superstar,{" "}
                  <br /> we can't wait to learn from
                  <span className="font-bold"> Ilja!</span>
                </p>
              </div>
            </div>
          </div>

          {/* Item 6 - Ross Plaskow */}
          <div className=" order-6 md:order-6 lg:order-6 border-l-[3px] border-r-[3px] border-[#D2CCB6]  md:mt-[-167px] lg:mt-[-73px] xl:mt-[-57px] 2xl:mt-0 max-w-[420px]  pb-[78.76px] md:pb-[117.8px]">
            <div className="xl:h-[44px]  2xl:h-[47px] xl:text-[16px] xl:w-[113.5px] 2xl:w-[120.7px] lg:h-[31.29px] h-[36.1px] w-[93.6px] px-[13.128px] text-[13.1282px] mb-[-18.0513px] 2xl:mb-[-23px] bg-white border-[1.6px] z-10 mx-auto rounded-lg 2xl:text-[16.9778px] flex items-center justify-center relative">
              Animation
            </div>
            <div className="cursor-blind relative">
              <div
                ref={cursor5Ref}
                className="absolute z-50 pointer-events-none flex items-center gap-[8px]"
                style={{ transform: "translate(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M1.37207 3.99438C0.893838 2.31674 2.63215 0.917659 4.16699 1.65161L19.2695 8.8772L19.415 8.95337C20.8186 9.76057 20.7125 11.8395 19.2295 12.4954L19.0762 12.5559L12.8652 14.7561H12.8643L9.59863 20.4348C8.74532 21.9184 6.5585 21.7032 5.98145 20.1409L5.93066 19.9856L1.37207 3.99438Z"
                    fill="#F17100"
                    stroke="#121212"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="px-[16px] py-[6px] ml-[-15px] mb-[-40px] border-[1.6px] border-black text-[16.9778px] rounded-full bg-[#F17100] text-white text-[14px] font-semibold leading-none whitespace-nowrap shadow-md">
                  Ross Plaskow
                </div>
              </div>
              <div
                ref={container5Ref}
                className="relative lg:h-[317.625px] xl:h-[443.337px] 2xl:h-[470.66px] border-[1.6px] shadow-[rgba(0,0,0,0.2)] shadow-[6px_8px_0px_0px_#CFC9B3] mx-auto cursor-blind"
              >
                <div className="absolute -top-[8px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -top-[8px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-[14.7625px] h-[14.7625px] md:w-[16.575px] md:h-[16.575px] lg:w-[12.8px] lg:h-[12.8px] xl:h-[18px] xl:w-[18px] 2xl:w-[20px] 2xl:h-[20px] bg-white border-[1.6px] border-black z-20"></div>
                <div className=" w-[285.8px] h-[326.862px] md:w-[306.138px] lg:w-[274.513px] xl:w-[389.087px] 2xl:w-[416.1px] max-w-[416.1px] md:h-[350.75px] lg:h-[317.625px] xl:h-[439.937px] 2xl:h-[467.5px]">
                  <img
                    src="/t5.avif"
                    alt="Ross Plaskow"
                    className="object-cover h-gull "
                  />
                </div>
              </div>
              <div className="w-[254.363px]  text-[13.1282px] leading-[17.0667px] md:w-[267.925px] md:h-[141.712px] md:text-[15.65px] md:leading-[19.154px] lg:w-[248.375px] xl:w-[349.29px] 2xl:w-[370.638px] flex justify-center items-center mx-auto lg:text-[11.3778px] xl:text-[17px] 2xl:text-[18.0389px] lg:leading-[14.7911px] xl:leading-[22.1px] 2xl:leading-[22.0711px] lg:h-[92.875px] xl:h-[139.375px] bg-white border-l-[1.6px] border-b-[1.6px] border-r-[1.6px] py-[16.4103px] mt-[-1.64103px] px-[13.1282px] lg:py-[21.2222px] lg:px-[16.9778px] text-center">
                <p className="font-quicksand">
                  We've all wanted to{" "}
                  <span className="font-bold">animate</span> something cool
                  with <span className="font-bold">Rive</span>, and <br />
                  Ross is here to <span className="font-bold">show</span> us
                  how with <br />
                  his ridiculously<span className="font-bold"> fun</span> and
                  <span className="font-bold"> slick</span> style.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Team;