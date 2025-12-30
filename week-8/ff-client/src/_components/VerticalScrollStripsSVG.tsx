import React from 'react';
import { verticalStrips, verticalStripBaseLengths } from '../constants/stripeConstants';

const VerticalScrollStripsSVG = ({ calculateStyles }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 452 600"
    fill="none"
    preserveAspectRatio="none"
    style={{ height: '600px' }}
  >
    {verticalStrips.map((strip, index) => {
      const baseLength = verticalStripBaseLengths[index];
      const styles = calculateStyles(baseLength, index);

      return (
        <React.Fragment key={`vertical-black-${index}`}>
          <path
            d={`M${strip.x} 0V600`}
            stroke="black"
            strokeWidth="52"
            style={styles}
          />
        </React.Fragment>
      );
    })}

    {verticalStrips.map((strip, index) => {
      const baseLength = verticalStripBaseLengths[index];
      const styles = calculateStyles(baseLength, index);

      return (
        <React.Fragment key={`vertical-color-${index}`}>
          <path
            d={`M${strip.x} 0V600`}
            stroke={strip.colorFill}
            strokeWidth="48"
            style={styles}
          />
        </React.Fragment>
      );
    })}
  </svg>
);

export default VerticalScrollStripsSVG;