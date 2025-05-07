"use client";

import useUserStore from "@/store/store";
import { useEffect, useState, useCallback, useRef } from "react";

interface CountDownProps {
  targetDate: string;
  onComplete: () => void;
}

const CountDown: React.FC<CountDownProps> = ({ targetDate, onComplete }) => {
  const setExamData = useUserStore((state) => state.setExamData);
  const hasCompletedRef = useRef(false);

  // ✅ Memoizing the function to prevent unnecessary re-renders
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return { minutes: "00", seconds: "00" };

    const minutes = Math.floor((difference / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((difference / 1000) % 60)
      .toString()
      .padStart(2, "0");

    return { minutes, seconds };
  }, [targetDate]); // ✅ targetDate is a dependency

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Check if we've already completed to prevent multiple calls
    if (hasCompletedRef.current) {
      return;
    }

    // Create a function to check and update time
    const checkTime = () => {
      const currentTimeLeft = calculateTimeLeft();
      setTimeLeft(currentTimeLeft);
      
      // Only trigger completion once
      if (currentTimeLeft.minutes === "00" && currentTimeLeft.seconds === "00" && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        // Use setTimeout to delay the state update slightly, preventing potential race conditions
        setTimeout(() => {
          setExamData({ time_allotted: 0 });
          onComplete();
        }, 0);
      }
    };

    // Initial check
    checkTime();

    // Set up interval
    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, setExamData, onComplete]);

  // Check if time is running low (less than 5 minutes)
  const isTimeRunningLow = parseInt(timeLeft.minutes) < 5;

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-4 py-2 rounded-md ${
        isTimeRunningLow 
          ? 'bg-red-50 border border-red-100' 
          : 'bg-[#ecfdf4] border border-[#d1f5e0]'
      }`}>
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${
              isTimeRunningLow ? 'text-red-600' : 'text-[#047853]'
            }`}>
              {timeLeft.minutes}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">min</span>
          </div>
          
          <span className={`mx-1 text-xl ${
            isTimeRunningLow ? 'text-red-300' : 'text-[#047853] opacity-40'
          }`}>:</span>
          
          <div className="flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${
              isTimeRunningLow ? 'text-red-600' : 'text-[#047853]'
            }`}>
              {timeLeft.seconds}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">sec</span>
          </div>
        </div>
      </div>
      
      {isTimeRunningLow && (
        <span className="text-xs font-medium text-red-500 animate-pulse">
          Time running out!
        </span>
      )}
    </div>
  );
};

export default CountDown;
