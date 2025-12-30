import {
  sideBaseLengths,
  STAGGER_DELAY_PER_STRIP,
  TOTAL_ANIMATION_DURATION,
  verticalStripBaseLengths,
  verticalStripTriggerOffset,
  VERTICAL_STRIP_COUNT,
} from '../constants/stripeConstants';

export const calculatePreloaderStyles = (
  baseLength,
  index,
  isLeft,
  animationProgress
) => {
  const startDelayRatio =
    (index * STAGGER_DELAY_PER_STRIP) / TOTAL_ANIMATION_DURATION;

  const stripProgress = Math.min(
    1,
    Math.max(
      0,
      (animationProgress - startDelayRatio * animationProgress) /
        (1 - startDelayRatio)
    )
  );

  const easedProgress = Math.pow(stripProgress, 3);
  const currentLength = easedProgress * baseLength;
  const gap = baseLength - currentLength;
  const dashArray = `${currentLength.toFixed(3)}px, ${gap.toFixed(3)}px`;
  const offset = isLeft ? -(baseLength - currentLength) : 0;

  return {
    strokeDasharray: dashArray,
    strokeDashoffset: `${offset.toFixed(3)}`,
  };
};

export const calculateSidePathStyles = (baseLength, index, isLeft, scrollPercent) => {
  const scrollMultiplier = 9.3;
  const amplifiedScroll = scrollPercent * scrollMultiplier;

  const totalAnimationDistance = sideBaseLengths[0] + 137 * 3;
  const totalScroll = amplifiedScroll * totalAnimationDistance;
  const startPoint = index * 137;
  const stripScroll = Math.max(0, totalScroll - startPoint);

  const currentLength = Math.max(0, baseLength - stripScroll);
  const gap = baseLength - currentLength;
  const dashArray = `${currentLength.toFixed(3)}px, ${gap.toFixed(3)}px`;
  const offset = isLeft ? -(baseLength - currentLength) : 0;

  return {
    strokeDasharray: dashArray,
    strokeDashoffset: `${offset.toFixed(3)}`,
  };
};

export const calculateVerticalStripStyles = (baseLength, index, scrollPercent) => {
  const verticalScrollMultiplier = 1.9;
  const amplifiedScroll = scrollPercent * verticalScrollMultiplier;

  const totalAnimationDistance = verticalStripBaseLengths[0] + verticalStripTriggerOffset * (VERTICAL_STRIP_COUNT - 1);
  const totalScroll = amplifiedScroll * totalAnimationDistance;
  const startPoint = index * verticalStripTriggerOffset;
  const stripScroll = Math.max(0, totalScroll - startPoint);

  const currentLength = Math.min(baseLength, stripScroll);
  const gap = baseLength - currentLength;
  const dashArray = `${currentLength.toFixed(3)}px, ${gap.toFixed(3)}px`;

  return {
    strokeDasharray: dashArray,
    strokeDashoffset: "0",
  };
};
