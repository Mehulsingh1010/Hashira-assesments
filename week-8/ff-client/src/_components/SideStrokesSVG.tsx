/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { sidePaths } from '../constants/stripeConstants';

const SideStrokesSVG = ({ sideClass, isLeft, calculateStyles, isPreloader = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 321 626"
    fill="none"
    className={`
      absolute
      ${sideClass}
      2xl:w-[342.4px] xl:w-[321px] lg:w-[228.262px] 
      ${isLeft
        ? "   lg:ml-[19px] 2xl:ml-[-10px] lg:top-[17.3em] xl:top-[20.9em] 2xl:top-[22.3em] xl:ml-[-5px]    xl:scale-[-1] 2xl:scale-[-1] lg:scale-[-1]"
        : "   xl:m-0 lg:top-0 xl:top-[0rem] 2xl:top-0 lg:mr-[19.7px] xl:mr-0 2xl:mr-[-5px]   2xl:scale-[1]"
      }
    `}
  >
    {sidePaths.map((path, index) => {
      const baseLength = index < 4 ? [809.204, 730.653, 652.102, 573.551][index] : 0;
      const styles = calculateStyles(baseLength, index, isLeft);

      return (
        <React.Fragment key={index}>
          <path d={path.d} stroke="#121212" strokeWidth="52" style={styles} />
          <path d={path.d} stroke={path.color} strokeWidth="48" style={styles} />
        </React.Fragment>
      );
    })}
  </svg>
);

export default SideStrokesSVG;
