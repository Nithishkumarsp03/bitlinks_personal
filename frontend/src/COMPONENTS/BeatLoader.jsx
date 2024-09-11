import React from "react";

// Helper function to convert size/margin values to CSS format
function cssValue(value) {
  return typeof value === "number" ? `${value}px` : value;
}

// Helper function to create CSS animations dynamically
function createAnimation(name, animation, keyframesName) {
  const styleSheet = document.styleSheets[0];
  const keyframes = `@keyframes ${keyframesName} { ${animation} }`;

  if (styleSheet) {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }

  return keyframesName;
}

// Animation for the BeatLoader
const beat = createAnimation(
  "BeatLoader",
  "50% {transform: scale(0.75); opacity: 0.2} 100% {transform: scale(1); opacity: 1}",
  "beat"
);

export default function BeatLoader({
  loading = true,
  color = "#000000",
  speedMultiplier = 1,
  cssOverride = {},
  size = 15,
  margin = 2,
  ...additionalprops
}) {
  // Wrapper styles for the loader container
  const wrapper = {
    display: "inherit",
    ...cssOverride,
  };

  // Styles for each individual dot of the loader
  const style = (i) => {
    return {
      display: "inline-block",
      backgroundColor: color,
      width: cssValue(size),
      height: cssValue(size),
      margin: cssValue(margin),
      borderRadius: "100%",
      animation: `${beat} ${0.7 / speedMultiplier}s ${
        i % 2 ? "0s" : `${0.35 / speedMultiplier}s`
      } infinite linear`,
      animationFillMode: "both",
    };
  };

  // If not loading, return null (no loader displayed)
  if (!loading) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={style(1)} />
      <span style={style(2)} />
      <span style={style(3)} />
    </span>
  );
}
