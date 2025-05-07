"use client";

import { useEffect, useState } from "react";

type UseCountdownProps = {
  targetDate?: string | undefined;
  currentTimeProp?: string;
};

const useCountdown = ({ targetDate, currentTimeProp }: UseCountdownProps) => {
  const targetDateMs = Date.parse(targetDate || "");
  const [countDown, setCountDown] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTime() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://developers-notifications.talrop.com/api/v1/main/send/current-time/`
        );
        const data = await response.json();
        setCurrentTime(Date.parse(`${data.data.current_time}+05:30`));
      } catch (error) {
        console.error("Error fetching time:", error);
      }
      setIsLoading(false);
    }

    if (!currentTimeProp) {
      fetchTime();
    } else {
      setCurrentTime(Date.parse(currentTimeProp));
    }
  }, [currentTimeProp]);

  useEffect(() => {
    if (targetDateMs && currentTime) setCountDown(targetDateMs - currentTime);
  }, [currentTime, targetDateMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown((prevCountDown) => (prevCountDown ? prevCountDown - 1000 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return getReturnValues(countDown, isLoading);
};

const getReturnValues = (countDown: number | null, isLoading: boolean) => {
  if (countDown === null) return [0, 0, 0, 0, isLoading, false];
  
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const isDanger = seconds < 11 && hours < 1 && minutes < 1;

  return [days, hours, minutes, seconds, isLoading, isDanger];
};

export { useCountdown };
