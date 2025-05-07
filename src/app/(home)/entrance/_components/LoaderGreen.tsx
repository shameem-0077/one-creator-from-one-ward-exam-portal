"use client";

import React from "react";
import Lottie from "lottie-react";
import loader from "@/../public/assets/lottie/green2_loader.json";

type LoaderGreenProps = {
  height?: number | string;
  width?: number | string;
};

const LoaderGreen: React.FC<LoaderGreenProps> = ({ height = "60vh", width = 120 }) => {
  return (
    <div className="flex items-center justify-center">
      <Lottie animationData={loader} loop autoplay className={`h-[${height}] w-[${width}]`} />
    </div>
  );
};

export default LoaderGreen;
