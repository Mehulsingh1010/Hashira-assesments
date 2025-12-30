
import React, { useState, useRef, useEffect } from "react";

const PlusIcon = ({ rotation }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    className={`w-[13.13px] h-[13.13px] lg:w-[11.38px] lg:h-[11.38px] xl:h-[16px] xl:w-[16px] stroke-black transition-transform duration-200 ease-out ${rotation}`}
    fill="none"
  >
    <path
      d="M1.05469 9.40723H16.0547"
      strokeWidth="0.12em"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M8.55176 1.90723L8.55176 16.9072"
      strokeWidth="0.12em"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

function AccordionItem({ question, isOpen, onClick, children }) {
  const [buttonHeight, setButtonHeight] = useState(96);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const measureHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      }
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [children, isOpen]);

  const totalOpenHeight = contentHeight + 10;

  let plusRotation = "rotate-0";
  if (isOpen) {
    plusRotation = "rotate-45";
    if (isButtonHovered) {
      plusRotation = "rotate-[135deg]";
    }
  } else if (isHovered) {
    plusRotation = "rotate-90";
  }

  useEffect(() => {
    function updateButtonHeight() {
      const width = window.innerWidth;
      if (width >= 1536) setButtonHeight(96.2); // 2xl
      else if (width >= 1280) setButtonHeight(88); // xl
      else if (width >= 1024) setButtonHeight(62); // lg
      else if (width >= 768) setButtonHeight(82); // md
      else setButtonHeight(71);
    }

    updateButtonHeight(); // initial
    window.addEventListener("resize", updateButtonHeight);
    return () => window.removeEventListener("resize", updateButtonHeight);
  }, []);

  const containerHeight = isOpen
    ? buttonHeight + totalOpenHeight
    : buttonHeight;

  return (
    <div
      className="transition-[height] overflow-hidden duration-300 ease-out"
      style={{
        height: `${containerHeight}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative" style={{ height: `${totalOpenHeight}px` }}>
        <div
          className="overflow-hidden transition-[height] duration-300 ease-out h-[20px] md:h-[26px] lg:h-[20px] xl:h-[26px] 2xl:h-[30px]  "
          style={{
            height: isOpen ? `${totalOpenHeight}px` : "",
          }}
        >
          <svg
            width="100%"
            viewBox="0 0 602 1220"
            preserveAspectRatio="none"
            fill="#F3A20F"
            stroke="black"
          >
            <path
              d="M601 1199C601 1205.63 595.627 1211 589 1211H13C6.37257 1211 1 1205.63 1 1199V7.00001C1 3.68631 3.68629 1 7 1H116C118.761 1 121 3.23858 121 6V6C121 8.76142 123.239 11 126 11H595C598.314 11 601 13.6863 601 17V1199Z"
              fill="var(--color-mango)"
              stroke="var(--color-dark)"
              strokeWidth="0.125em"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div
          ref={contentRef}
          className="
            absolute
            left-1/2 -translate-x-1/2
            bottom-[-30]
            bg-[#fffefb]
            border-[1.6px] border-black
            rounded-[17.0667px]
            w-[256px]
            md:w-[520px]
            lg:w-[301.171px]
            xl:w-[564.92px]
            2xl:w-[600px]
            px-[17.0667px]
            pt-[17.0667px]
            pb-[51.2px]
            text-[#121212]
            text-[17.0667px]
            leading-[22.1867px]
            font-[500]
            shadow-[6.4px_6.4px_0px_0px_rgba(0,0,0,0.15)]
            origin-bottom
            pointer-events-auto
            transition-all duration-300 ease-out
          "
          style={{
            transform: isOpen
              ? isButtonHovered
                ? "translateY(8px) rotate(-1deg)"
                : "rotate(-1deg)"
              : isHovered
              ? "translateY(-19px) rotate(0deg)"
              : "rotate(-1deg)",
          }}
        >
          {children}
        </div>

        <div
          className="
          mt-[-5px]
            relative h-[56px] md:h-[62px] lg:h-[47.1px] xl:h-[67.2px] 2xl:h-[71.45px]
            w-full md:w-full lg:w-[433.775px] xl:w-[610px] 2xl:w-[650px]
            bg-[#F3A20F] border-[1.6px] border-black rounded-lg
            pl-5 md:pl-[22px] lg:pl-[17px] xl:pl-[25px] 2xl:pl-[25px]
            pr-[14px] md:pr-[15px] lg:pr-4 xl:pr-4 2xl:pr-4
            py-4
            text-[13.1282px] md:text-base lg:text-[11.3778px] xl:text-[16px] 2xl:text-[16.9778px]
            flex items-center justify-between
            cursor-pointer overflow-visible
            z-20
          "
          onClick={onClick}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <span className="text-left">{question}</span>

          <div className="pr-[7px] md:pr-2 lg:pr-[9px] xl:pr-[9px] 2xl:pr-[9px] flex items-center justify-center">
            <PlusIcon rotation={plusRotation} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQsvg() {
  const [openIndex, setOpenIndex] = useState(null);

  const accordionData = [
    {
      question: "Can I have a discount?",
      content: (
        <div className="w-full">
          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            This is a <span className="font-bold">non-profit</span> event, and
            our goal is to make FlowFest as
            <span className="font-bold"> affordable</span> as we possibly can
            whilst delivering a<span className="font-bold"> quality</span> day
            that you'll never forget. Due to last year's feedback we are
            investing more in <span className="font-bold">comfort</span> and
            <span className="font-bold"> quality</span> this year.
          </p>

          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] pt-[10px] pb-[10px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            To keep ticket prices as <span className="font-bold">low</span> as
            we can for
            <span className="font-bold"> everyone</span>, we are
            <span className="font-bold"> unable</span> to offer discounts and
            appreciate your
            <span className="font-bold"> support</span> for this community
            event.
          </p>

          <button className="cursor-pointer  flex items-center justify-center border-2 border-[#121212] rounded-[170.667px] w-[120px] md:w-[130px] lg:w-[92.32px] xl:w-[138.5px] 2xl:w-[138.5px] h-[42px] md:h-[44px] lg:h-[31.2875px] xl:h-[46.925px] 2xl:h-[46.925px] px-[18px] md:px-[20px] lg:px-[21.3333px] xl:px-[21.3333px] 2xl:px-[21.3333px] py-[1.70667px] text-[#12112] text-[15px] md:text-[16px] lg:text-[11.37px] xl:text-[17.0667px] 2xl:text-[17.0667px] font-normal leading-[17.0667px] bg-[#f489a3] whitespace-nowrap shadow-[0px_4.26667px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out hover:translate-y-[4.26667px] hover:shadow-none active:translate-y-[4.26667px] active:shadow-none">
            Buy Tickets
          </button>
        </div>
      ),
    },
    {
      question: "How do I get there?",
      content: (
        <div className="w-full">
          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            FlowFest is hosted in{" "}
            <span className="font-bold">Media City Gardens</span> (you'll find
            it by searching the Blue Peter Garden on Google Maps), which is an
            <span className="font-bold"> outdoor</span> venue. It's directly in
            front of Media City
            <span className="font-bold"> tram</span> stop, which is a great way
            to get to the venue if you're travelling from the city centre or
            other parts of Manchester. There is also a
            <span className="font-bold"> multi-story car park</span> just round
            the corner for those driving.
          </p>
        </div>
      ),
    },
    {
      question: "Is there food included?",
      content: (
        <div className="w-full">
          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            Yes, a banging <span className="font-bold">lunch</span> courtesy of
            Kargo on the Docks is <span className="font-bold">included</span> in
            your ticket, as well as <span className="font-bold">drinks</span>{" "}
            tokens.
          </p>
        </div>
      ),
    },
    {
      question: "What should I bring?",
      content: (
        <div className="w-full">
          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            Good vibes and <span className="font-bold">layers</span>. This is an
            all day <span className="font-bold">outdoor</span> event in
            <span className="font-bold"> Manchester</span>, so check the weather
            closer to the time and{" "}
            <span className="font-bold">dress accordingly</span>. Also, we've
            taken your feedback onboard and there are no hands on workshops, so
            <span className="font-bold"> no need</span> to bring a{" "}
            <span className="font-bold">laptop</span>.
          </p>
        </div>
      ),
    },
    {
      question: "Will there be an afterparty?",
      content: (
        <div className="w-full">
          <p className="text-[11.5px] lg:text-[9.95px] md:text-[14px] xl:text-[14.8556px] 2xl:text-[14.8556px] leading-[17.2308px] md:leading-[21px] lg:leading-[14.9333px] xl:leading-[22.2833px] 2xl:leading-[22.2833px] font-quicksand break-words">
            As it was last year, there isn't an{" "}
            <span className="font-bold">official</span> or planned afterparty,
            but FlowFest folks know the party{" "}
            <span className="font-bold">never stops</span>. We usually have the
            venue until 6 or 7pm, and last year we headed to Kargo Food Market
            to get some <span className="font-bold">dinner</span> and headed
            into town for <span className="font-bold">karaoke</span>. After
            party <span className="font-bold">planners</span> welcome, FlowFest
            is on a Friday after all so it would be rude not to get a bit{" "}
            <span className="font-bold">lairy</span>.
          </p>
        </div>
      ),
    },
  ];

 return (
    <div className="mt-[50px] 2xl:px-[68px] md:mt-[9px] lg:mt-[10px] xl:mt-[10px] 2xl:mt-[10px] text-black text-center">
      <div className="  md:pb-7 lg:pb-8 xl:pb-[64px] 2xl:pb-[67px] flex flex-col items-center w-full md:px-0 lg:px-0 xl:px-[450px] 2xl:px-[450px]">
        <div className="h-auto md:h-auto lg:h-[46.2222px] xl:h-[137px] 2xl:h-[137px] font-heading-bold text-black text-[41.0256px] md:text-[59.8561px] lg:text-[46.2222px] xl:text-[65px] 2xl:text-[68.9722px] leading-[36px] md:leading-[52px] lg:leading-[58px] xl:leading-[62.075px] 2xl:leading-[62.075px] text-center md:text-center lg:text-nowrap xl:text-nowrap 2xl:text-nowrap w-full">
          Frequently Asked
          <div className="text-center mx-auto rotate-[2deg] border-2 shadow-[rgb(0,0,0,0.15)] shadow-[0px_6px_0px_0px_#000] text-white bg-[#F97028] w-[189.65px] md:w-[260px] lg:w-[190.675px] xl:w-[272.24px] 2xl:w-[288.66px] max-w-full border-black rounded-sm text-[41.0256px] md:text-[54px] lg:text-[41.6px] xl:text-[58.5px] 2xl:text-[62.075px] leading-[36px] md:leading-[50px] lg:leading-[37.44px] xl:leading-[55.8675px] 2xl:leading-[55.8675px] pt-[8.20513px] md:pt-[3.36691px] lg:pt-[2.6px] xl:pt-[9.31125px] 2xl:pt-[9.31125px] pb-[2.5px] md:pb-[2.8px] lg:pb-[2.08px] xl:pb-[3.10375px] 2xl:pb-[3.10375px] px-[12px] md:px-[14px] lg:px-[10.4px] xl:px-[14.625px] 2xl:px-[15.5188px] mt-2 md:mt-2 lg:mt-0 xl:mt-0 2xl:mt-0">
            Questions
          </div>
        </div>
      </div>

      <div
        className="
  mt-[52px] xl:mt-[10px]
  w-full mx-auto
  flex flex-col lg:flex-row
  gap-6 md:gap-7 lg:gap-0
  text-left
  lg:items-start
  justify-center
"
      >
        <div className="px-3 md:px-0 lg:px-[46px] xl:px-0 2xl:pl-[3px] w-full md:w-full lg:w-[434px] xl:w-auto 2xl:w-auto md:px-[103px] lg:max-w-none xl:max-w-none 2xl:max-w-none ml-0 md:ml-0 lg:ml-0 xl:ml-0 2xl:ml-0 mt-0 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 order-1 md:order-1 lg:order-2 xl:order-2 2xl:order-2 pb-[58px] lg:pb-0 mb-[-76px] md:mb-[-130px] lg:mb-0 relative bg-[#f3ecd2] z-[50] lg:border-b-0 border-b-2 lg:rounded-0 rounded-[52px] md:rounded-[110.504px]">
          {accordionData.map((item, index) => (
            <div
              key={index}
              className="
    relative
    mb-[13px] md:mb-[14px] lg:mb-[12px] xl:mb-[16px] 2xl:mb-[16.0667px]
    xl:ml-[64px]
    rounded-t-lg lg:rounded-t-md
    overflow-hidden
    before:absolute before:inset-x-0 before:top-0
    before:h-1/2
    before:bg-[#efeeec]
    before:content-['']
  "
            >
              <AccordionItem
                question={item.question}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {item.content}
              </AccordionItem>
            </div>
          ))}
        </div>

        <div className="order-2 lg:order-1 w-full max-w-full md:w-full lg:w-[325.5px] xl:w-[456.8px] 2xl:w-[490.663px] lg:max-w-none h-[356px] md:h-[856px] lg:h-[362.925px] xl:h-[512.525px] 2xl:h-[546.713px] lg:rounded-[29.8667px] 2xl:rounded-[44.8px] lg:border-[1px] xl:border-[1.6px] overflow-hidden relative lg:sticky lg:top-0">
          <img
            src="/faq.avif"
            alt="faq img"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 490px"
          />
        </div>
      </div>
    </div>
  );
}
