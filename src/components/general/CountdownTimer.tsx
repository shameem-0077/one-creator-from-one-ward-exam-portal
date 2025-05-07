import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "./Button";
import useUserStore from "@/store/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface CountdownTimerProps {
  targetDate: string | Date;
  examStatus: boolean;
  showButton: any;
  isExamWrittem: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  examStatus,
  showButton,
  isExamWrittem
}) => {
  const router = useRouter();
  const { campusData } = useUserStore();

  interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
  }

  const calculateTimeLeft = (): TimeLeft => {
    if (!targetDate) return { hours: 0, minutes: 0, seconds: 0 };

    const now = moment();
    const target = moment(targetDate);

    if (!target.isValid() || target.diff(now) <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const duration = moment.duration(target.diff(now));

    return {
      hours: Math.floor(duration.asHours()), // Convert days into total hours
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Update immediately to avoid NaN
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center space-y-6 sm:space-y-8 w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <Image
          src={
            campusData?.logo
              ? campusData?.logo
              : "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/20-11-2023/logo.svg"
          }
          alt="School LOGO"
          width={50}
          height={50}
          className="w-[40px] sm:w-[50px] h-auto"
        />

        <h1 className="text-base sm:text-lg md:text-xl font-bold text-center break-words max-w-full px-2">
          {campusData?.name?.toUpperCase()}
        </h1>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center px-2">
        {examStatus === false ? "Start your exam" : "Exam is Completed"}
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        {["Hours", "Minutes", "Seconds"].map((label, index) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 sm:p-4 min-w-[80px] sm:min-w-[100px]">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {index === 0
                  ? timeLeft.hours.toString().padStart(2, "0")
                  : index === 1
                  ? timeLeft.minutes.toString().padStart(2, "0")
                  : timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm font-semibold">
                {label}
              </span>
            </div>
            {index < 2 && (
              <span className="text-2xl sm:text-3xl md:text-4xl text-green-500 font-bold mx-1 sm:mx-2">:</span>
            )}
          </div>
        ))}
      </div>
      {examStatus === false && (
        <p className="text-gray-600 text-xs sm:text-sm text-center px-4">
          You can click the button below to start your exam
        </p>
      )}
      <div className="w-full sm:w-auto">
        {examStatus === true || isExamWrittem ? (
          <Button
            buttonType="primary"
            text={examStatus && !isExamWrittem ? "Exam completed" : "Exam already attended"}
            icon="default"
            state="disabled"
            loading={false}
            type="button"
            className="w-full sm:min-w-[200px]"
          />
        ) : showButton ? (
          <Button
            buttonType="primary"
            text="Start Exam"
            icon="default"
            loading={false}
            type="button"
            onClick={() => router.push("/entrance/start")}
            className="w-full sm:min-w-[200px]"
          />
        ) : (
          <Button
            buttonType="primary"
            text="Start Exam"
            icon="default"
            loading={false}
            type="button"
            state="disabled"
            className="w-full sm:min-w-[200px]"
          />
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
