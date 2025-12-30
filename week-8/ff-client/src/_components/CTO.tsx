import React from "react";

function CTO() {
  return (
    <div className=" 2xl:mt-[118px]  mb-[78px] md:mb-[117.8px] lg:mb-[113px] xl:mb-[160px] 2xl:mb-0  rounded-[54.1539px] md:rounded-[103.137px] lg:rounded-0 mt-[-50px] md:mt-[-110px] lg:mt-[112px] bg-[#f3ecd2] relative z-[50] pt-[13px] md:pt-[44.2px] px-[13px] md:px-[44.2px] lg:px-[45px] xl:px-[64px] 2xl:px-[67px] ">
      {/* Content layer with SVG inside */}
      <div className=" h-[605.175px] md:h-[660.55px] lg:h-[440.962px] xl:h-[621.1px] 2xl:h-[659px] rounded-[39.3846px] md:rounded-[66.3022px] 2xl:rounded-[4.5em] border-[1.6px] border-black bg-[#F489A3] relative overflow-hidden shadow-[0px_10px_0px_0px_#000] shadow-[rgb(0,0,0,0.15)]">
        {/* Left SVG - bottom left */}
       <img
          src="/svg/left.svg"
          alt="Background decoration"
          
          width={0}
          height={0}
          className="absolute z-0 h-full w-auto object-contain right-[-60px] bottom-[-158.8px] -translate-x-[40.6763px] translate-y-[59.5166px] scale-[1.4] md:left-[-70px] md:bottom-[-188px] md:translate-y-0 md:scale-100 lg:bottom-[-95px] lg:left-[-15px] xl:left-[-110px] xl:bottom-[-105.9px] xl:scale-[1.1] 2xl:top-[120px] 2xl:left-[-92px]"
        />

        {/* Right SVG - top right corner, flipped and mirrored */}
        <img
          src="/svg/left.svg"
          alt="Background decoration"
          
          width={0}
          height={0}
          className="absolute z-0 h-full w-auto object-contain right-0 top-[-220px] scale-x-[-1.4] scale-y-[-1.4] md:right-[-110px] md:top-[-190px] md:scale-x-[-1] md:scale-y-[-1] lg:top-[-95px] lg:right-[-90px] xl:top-[-132px] 2xl:right-[-107px] 2xl:top-[-136px] 2xl:scale-x-[-1] 2xl:scale-y-[-1]"
        />

        <div className="px-[13px] md:px-[44.2px] lg:px-[250px] xl:px-[352px] 2xl:px-[373px] pt-[132px] md:pt-[178px] lg:pt-[125px] xl:pt-[176px] 2xl:pt-[186px] relative z-10">
          <div className="mx-auto h-[191.938px] md:h-[162px] lg:h-[124.8px] xl:h-[176px] 2xl:h-[186px] w-[264.3px] md:w-[588px] lg:w-[432.375px] xl:w-[608px] 2xl:w-[645px] font-heading-bold text-[42.6667px] md:text-[59.85px] lg:text-[46.2222px] xl:text-[65px] 2xl:text-[68.9742px] md:pb-0 2xl:pb-[42px] leading-[38.4px] md:leading-[53.8705px] lg:leading-[41.6px] xl:leading-[58.5px] 2xl:leading-[62.075px] text-center">
            Get Your Ticket for the Community-Led Event of the Year
          </div>

          <div className="text-[13.1282px] md:text-[14.7338px] lg:text-[11.3778px]  xl:text-[16px] 2xl:text-[17.0667px] text-center leading-[17.0667px] md:leading-[19.154px] lg:leading-[14.7911px] 2xl:leading-[22.0711px] pt-[19px] md:pt-[22px] lg:pt-[28px] xl:pt-[40px] 2xl:pt-[42px] font-quicksand">
            As web designers and developers, this is the kind of event we
            desperately wanted, so we created it. No stuffy conference rooms, no
            dull corporate halls, just a lovely community sharing knowledge with
            a pint and a burger in hand.
          </div>

          <div className="pt-[19px] md:pt-[22px] lg:pt-[28px] xl:pt-[40px] 2xl:pt-[42px] items-center justify-center flex">
            <button
              className="
                cursor-pointer
                flex items-center justify-center
                border-2 border-[#121212]
                rounded-[170.667px]
                w-[129.312px] lg:w-[91.7875px] lg:h-[31.2875px] xl:w-[130.075px] xl:h-[44px] xl:text-[16px] 2xl:w-[138.5px] h-[45.125px] 2xl:h-[46.925px]
                px-[21.3333px] py-[1.70667px]
                text-[#121212] text-[14.76px] md:text-[14.7338px] lg:text-[11.3778px] 2xl:text-[17.0667px] font-normal leading-[17.0667px]
                bg-[white]
                whitespace-nowrap
                shadow-[0px_4.26667px_0px_0px_rgba(0,0,0,0.15)]
                transition-all duration-200 ease-out
                hover:translate-y-[4.26667px] hover:shadow-none
                active:translate-y-[4.26667px] active:shadow-none
              "
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTO;
