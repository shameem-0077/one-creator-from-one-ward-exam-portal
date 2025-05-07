'use client';

import Lottie from 'lottie-react';
import loader from '@/../public/assets/lottie/loader_red.json';

type LogouteLoaderProps = {
  height?: number;
  width?: number;
};

const LogouteLoader: React.FC<LogouteLoaderProps> = ({ height = 35, width = 35 }) => {
  return <Lottie animationData={loader} style={{ height, width }} />;
};

export default LogouteLoader;
