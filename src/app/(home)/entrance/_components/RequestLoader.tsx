"use client";

import React from "react";
import Lottie from "lottie-react";
import loader from "@/../public/assets/lottie/loader.json";

type RequestLoaderProps = {
  height?: number;
  width?: number;
};

const RequestLoader: React.FC<RequestLoaderProps> = ({ height = 35, width = 35 }) => {
  return (
    <div className="flex items-center justify-center">
      <Lottie animationData={loader} loop autoplay className={`h-[${height}px] w-[${width}px]`} />
    </div>
  );
};

export default RequestLoader;
