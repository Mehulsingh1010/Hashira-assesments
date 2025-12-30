/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const Navbar = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <nav
    ref={ref}
    className="fixed  top-0 left-0 w-full bg-[#f3ecd2]  text-black text-[17.0667px] lg:text-[11.3778px] xl:text-[16px] 2xl:text-[17.0667px] lg:tracking-[-0.113778px] h-[61px] md:h-[68px] lg:h-[53px] xl:h-[74px] 2xl:h-[78.925px] px-[13px]   md:px-[44px] lg:px-[45px] xl:px-[64px] 2xl:px-[68.2667px]  flex border-b-2 lg:border-b-2 2xl:border-b-2 border-black z-[5000]"
    style={{ transform: "translateY(-100%)" }}
  >
    <div className="max-w-[1749.35px]  flex items-center justify-between w-full  mx-auto">
      <div className="hidden md:hidden lg:flex flex-1">
        <ul className="flex gap-[29.8667px] lg:gap-[19px] xl:gap-[28px] 2xl:gap-[29.1515px] list-none p-0 m-0 cursor-pointer">
  <li
    className="nav-bar__li"
    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
  >
    <div className="nav-link font-medium">About</div>
  </li>

  <li
    className="nav-bar__li"
    onClick={() => document.getElementById("speakers")?.scrollIntoView({ behavior: "smooth" })}
  >
    <div className="nav-link font-medium">Speakers</div>
  </li>

  <li
    className="nav-bar__li"
    onClick={() => document.getElementById("activities")?.scrollIntoView({ behavior: "smooth" })}
  >
    <div className="nav-link font-medium">Activities</div>
  </li>
</ul>

      </div>

      {/* 2. Logo */}
      <div
        className="
          flex justify-center flex-1 md:flex-none
          cursor-pointer select-none 
          mx-auto h-[26.775px] w-[151.788px] md:w-[167px] md:h-[30px] lg:h-[22px] xl:h-[32px] 2xl:h-[34px] lg:w-[129px] xl:w-[183px] 2xl:w-[195px]
          
        "
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
     <div className="relative w-full h-full">
  <img
    src="/logo.png"
    alt="Logo"

    className="object-contain pointer-events-none"
  />
</div>

      </div>

      {/* 3. Buy Tickets Button (Always Visible, aligned right) */}
      <div
        className="
          flex justify-end flex-1 
          cursor-pointer 
          md:ml-auto 
        "
      >
        <button className="cursor-pointer w-[107px] shadow-[0px_3px_0px_0px] shadow-[rgb(0,0,0,0.15)] flex items-center justify-center border-2 lg:border xl:border-2  border-[#121212] rounded-[170.667px] h-[36px] md:h-[41px] lg:h-[31px] xl:h-[44px] 2xl:h-[46.925px] md:w-[119.988px] lg:w-[92px] xl:w-[131px] 2xl:w-[139px]  px-[18px] md:px-[13px] lg:px-[15px] xl:px-[21.3333px] py-[9px]  text-[#121212] text-[13.1282px] md:text-[14.7338px]  lg:text-[11.3778px] xl:text-[16px] 2xl:text-[17.0667px] tracking-[-0.131282px]   font-normal leading-[17.0667px] bg-[#f489a3] whitespace-nowrap md:shadow-[0px_4.26667px_0px_0px_rgba(0,0,0,0.15)] lg:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.15)] xl:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out hover:translate-y-[4.26667px] hover:shadow-none active:translate-y-[4.26667px] active:shadow-none">
          Buy Tickets
        </button>
      </div>
    </div>
  </nav>
));

Navbar.displayName = "Navbar";

export default Navbar;
