import React, { useState } from "react";
import { IconButtonProps } from "../../types";

export const Button: React.FC<IconButtonProps> = ({
  icon,
  buttonText,
  backgroundColor,
  tooltipText,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const buttonStyle = backgroundColor
    ? `inline-flex items-center justify-center border border-transparent text-base font-medium rounded-md text-white hover:text-white bg-${backgroundColor}-500 hover:bg-${backgroundColor}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${backgroundColor}-500`
    : "inline-flex items-center justify-center border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  return (
    <button
      {...rest}
      className={`${buttonStyle} ${
        icon ? (buttonText ? "px-4 py-2" : "p-1") : "px-4 py-2"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={showTooltip && tooltipText ? tooltipText : undefined}
    >
      {icon && <span>{icon}</span>}
      {buttonText}
    </button>
  );
};
