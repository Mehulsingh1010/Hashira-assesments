import type React from "react"
/**
 * Micro-animations for form interactions
 */

export const animations = {
  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
}

export const getAnimationStyle = (animationName: string, duration = 300, easing = "ease-in-out"): string => {
  return `animation: ${animationName} ${duration}ms ${easing};`
}

export const getAnimationStyles = (
  animationName: string,
  duration = 300,
  easing = "ease-in-out",
): React.CSSProperties => {
  return {
    animation: `${animationName} ${duration}ms ${easing}`,
  }
}
