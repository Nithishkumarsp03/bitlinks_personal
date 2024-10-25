import React from "react";

// Helper functions and constants

const cssValue = (value) => {
  if (typeof value === "number") return `${value}px`;
  return value;
};

const parseLengthAndUnit = (size) => {
  let value, unit;
  if (typeof size === "number") {
    value = size;
    unit = "px";
  } else {
    const valueAndUnitMatch = size.match(/^(\d+)(\D+)$/);
    value = valueAndUnitMatch[1];
    unit = valueAndUnitMatch[2];
  }
  return { value: parseInt(value, 10), unit };
};

const createAnimation = (name, animation, animationType) => {
  const styleSheet = document.styleSheets[0];
  const keyframes = `@keyframes ${name} { ${animation} }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  return name;
};

// Create the moon animation
const moon = createAnimation("MoonLoader", "100% {transform: rotate(360deg)}", "moon");

// Main MoonLoader component
function MoonLoader({
  loading = true,
  color = "#000000",
  speedMultiplier = 1,
  cssOverride = {},
  size = 60,
  ...additionalprops
}) {
  const { value, unit } = parseLengthAndUnit(size);
  const moonSize = Math.round(value / 7);

  const wrapper = {
    display: "inherit",
    position: "relative",
    width: `${value + moonSize * 2}${unit}`,
    height: `${value + moonSize * 2}${unit}`,
    animation: `${moon} ${0.6 / speedMultiplier}s 0s infinite linear`,
    animationFillMode: "forwards",
    ...cssOverride,
  };

  const ballStyle = (size) => ({
    width: cssValue(size),
    height: cssValue(size),
    borderRadius: "100%",
  });

  const ball = {
    ...ballStyle(moonSize),
    backgroundColor: `${color}`,
    opacity: "0.8",
    position: "absolute",
    top: `${value / 2 - moonSize / 2}${unit}`,
    animation: `${moon} ${0.6 / speedMultiplier}s 0s infinite linear`,
    animationFillMode: "forwards",
  };

  const circle = {
    ...ballStyle(value),
    border: `${moonSize}px solid ${color}`,
    opacity: "0.1",
    boxSizing: "content-box",
    position: "absolute",
  };

  if (!loading) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={ball} />
      <span style={circle} />
    </span>
  );
}

export default MoonLoader;
