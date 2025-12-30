/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";

interface StackableItem {
  id: number;
  img: string;
  rotation: string;
}

interface StackConfig {
  rotation: number;
  scale: number;
  perspective: number;
}

const defaultConfig: StackConfig = {
  rotation: 0,
  scale: 0.06,
  perspective: 600,
};

function DraggableCard({
  children,
  onSendToBack,
  className,
  isTopCard,
  shuffleDirection,
  isShuffling,
  rotation,
}: any) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragShuffle, setDragShuffle] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);

    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? "right" : "left";
      setDragShuffle(direction);

      setTimeout(() => {
        onSendToBack?.();
        setTimeout(() => setDragShuffle(null), 50);
      }, 300);
    }
  };
  return (
    <motion.div
      className={`${className} ${isDragging ? "cursor-clinch" : "cursor-open"}`}
      style={{ x, rotate: rotation }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={
        dragShuffle
          ? { x: dragShuffle === "right" ? 500 : -500 }
          : isTopCard && isShuffling
          ? { x: shuffleDirection === "right" ? 500 : -500 }
          : { x: 0 }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ShuffleCards() {
  const items: StackableItem[] = [
    {
      id: 1,
      img: "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aadd04f4257c5f7f85fc_event-image-5.avif",
      rotation: "-3deg",
    },
    {
      id: 2,
      img: "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aaddd92bb1ada35b5840_event-image-2.avif",
      rotation: "3deg",
    },
    {
      id: 3,
      img: "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aadd1a93d98874d5b679_event-image-3.avif",
      rotation: "-3deg",
    },

    {
      id: 5,
      img: "https://cdn.prod.website-files.com/682310547ba9eeb97324a89e/6824aaddd793e76751328121_event-image-1.avif",
      rotation: "3deg",
    },
  ];

  const [cards, setCards] = useState([...items]);
  const [shuffleDirection, setShuffleDirection] = useState<"left" | "right">(
    "right"
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const config = defaultConfig;

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((item) => item.id === id);
      const [item] = newCards.splice(index, 1);
      newCards.unshift(item);
      return newCards;
    });
  };

  const handleShuffle = () => {
    if (isShuffling) return;

    setIsShuffling(true);
    const topCard = cards[cards.length - 1];

    const direction = shuffleDirection;

    setTimeout(() => {
      sendToBack(topCard.id);
      setShuffleDirection(direction === "right" ? "left" : "right");
      setIsShuffling(false);
    }, 300);
  };

  return (
    <div className=" flex items-center justify-center z-[10] ">
      <div className=" relative flex justify-center items-center mx-auto text-black">
        <div
          className="2xl:h-[293.062px] h-[305.71px] w-[264.4px] 2xl:w-[426.663px] md:h-[432.788px] lg:h-[348px] xl:h-[470px]  md:w-[368.337px] lg:w-[300px] xl:w-[400px]  "
          style={{ perspective: config.perspective }}
        >
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              className="absolute h-[305.71px] w-[264.4px] 2xl:h-[293.062px] xl:h-[470px] 2xl:w-[426.663px] md:h-[432.788px] lg:w-[300px] lg:h-[342px] 2xl:h-[498.712px] mx-auto  md:w-[368.337px] xl:w-[400px]  2xl:w-[424.438px] cursor-open z-[1]"
              isTopCard={index === cards.length - 1}
              shuffleDirection={shuffleDirection}
              isShuffling={isShuffling}
              rotation={card.rotation}
            >
              <img
                src={card.img}
                alt={`Card ${card.id}`}
           
                className="pointer-events-none shadow-[rgba(0,0,0,0.1)] shadow-[0px_8px_0px_0px] rounded-[40px] border-black border-[1.6px] object-cover"
           
              />
            </DraggableCard>
          ))}
        </div>

        <button
          onClick={handleShuffle}
          className="absolute shadow-[rgba(0,0,0,0.2)] shadow-[0px_3px_0px_0px]  flex gap-[6px] w-[114.463px] top-[280px] md:top-[410px] lg:h-[34.125px] lg:top-[324px] xl:top-[450px] 2xl:top-[470px] h-[45.125px] lg:w-[81.7875px] xl:w-[115.988px] xl:h-[48px] 2xl:h-[51px] 2xl:w-[123px] cursor-pointer rounded-3xl border-black border-[1.6px] left-1/2 -translate-x-1/2 text-black px-[21px] items-center justify-center bg-white  transition-colors font-medium text-sm"
        >
          <div className="2xl:h-[16.975px] 2xl:w-[16.975px] xl:h-[16px]  xl:w-[16px] lg:h-[11.38px] lg:w-[11.38px] h-[13.13px] w-[13.13px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="2xl:h-[16.975px] 2xl:w-[16.975px] xl:h-[16px]  xl:w-[16px] lg:h-[11.38px] lg:w-[11.38px] h-[13.13px] w-[13.13px]"
            >
              <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2.5" />
              <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2.5" />
              <path
                d="M20.5 8.99998C19.6855 6.75968 18.0244 4.92842 15.8739 3.89992C13.7235 2.87143 11.2553 2.72782 9 3.49998C7.7459 3.98238 6.59283 4.69457 5.6 5.59998L1 9.99998M23 14L18.4 18.4C16.6963 20.0855 14.3965 21.0308 12 21.0308C9.60347 21.0308 7.30368 20.0855 5.6 18.4C4.69459 17.4072 3.9824 16.2541 3.5 15"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <span className="text-[14.7692px] lg:text-[11.378px] xl:text-[16px] 2xl:text-[16.9778px]">Shuffle</span>
        </button>
      </div>
    </div>
  );
}
