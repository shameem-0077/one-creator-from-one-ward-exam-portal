"use client";

import React from "react";
import Lottie from "lottie-react";
import clockTimer from "@/../public/assets/lottie/clock-timer.json";

type ClockTimerProps = {
  height?: number;
  width?: number;
};

const ClockTimer: React.FC<ClockTimerProps> = ({ height = 60, width = 60 }) => {
  return (
    <div className="flex items-center justify-center">
      <Lottie animationData={clockTimer} loop autoplay className={`h-[${height}px] w-[${width}px]`} />
    </div>
  );
};

export default ClockTimer;