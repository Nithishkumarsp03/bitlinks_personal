import React from "react";

const ChangingProgressProvider = ({ value, children }) => {
  return children(70);
};

export default ChangingProgressProvider;
