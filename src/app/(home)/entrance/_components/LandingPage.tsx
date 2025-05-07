"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowRight from "@/../public/assets/images/entrance/arrow-right.svg";
import CountdownTimer from "@/components/general/CountdownTimer";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import CalendarIcon from "@/../public/assets/icons/calendar.svg";

interface SpotlightProps {
  campus_data?: {
    name?: string;
    campus_type?: string;
  };
}

const LandingPage: React.FC<SpotlightProps> = () => {
  // Simplified state management (you'll need to replace with actual Redux setup)

  const [examDate, setExamDate] = useState("");
  const [examStatus, setExamStatus] = useState(false);
  const [examEndTime, setExamEndTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isExamWritten, setIsExamWritten] = useState(false);
  const [triggerRefetchExamData, setTriggerRefetchExamData] = useState(false)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [isExamScheduled, setIsExamScheduled] = useState(true);

  const { campusData, loginData, examData } = useUserStore();

  const removeTimestampWithoutSeconds = (date: string) => {
    return date.substring(0, 16);
  };

  const fetchExamDate = async () => {
    setIsLoading(true);
    setShowButton(false);
    scholarshipConfig
      .get("api/v1/exams/exam-center-exam/get-examination-date/", {
        headers: {
          Authorization: "Bearer " + loginData?.accessToken,
        },
        params: {
          exam_center_id: examData?.examCenterId,
        },
      })
      .then((res) => {
        const { status_code, data } = res.data;
        if (status_code === 6000) {
          setIsExamScheduled(true);
          let isodate = data?.exam_data?.exam_date;
          let currentisodate = data?.current_date;
          let endisodate = data?.exam_data?.exam_end_date;
          let exam_status = data?.exam_data?.is_completed;
          setIsExamWritten(data?.exam_data?.is_exam_written)
          let exam_date = removeTimestampWithoutSeconds(isodate);
          let current_exam_date = removeTimestampWithoutSeconds(currentisodate);
          let exam_end_date = removeTimestampWithoutSeconds(endisodate);

          setShowButton(
            exam_date <= current_exam_date && current_exam_date <= exam_end_date
          );
          setCurrentTime(current_exam_date);
          setExamEndTime(exam_end_date);
          setExamDate(exam_date);
          setExamStatus(exam_status);
          setIsLoading(false);
        } else if (status_code === 6001) {
          setIsExamScheduled(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log("error accoured");
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.error("Extra API Error:", err);
      });
  };

  const [isLoginDataAvailable, setIsLoginDataAvailable] = useState(false);

  useEffect(() => {
    if (loginData && loginData.accessToken) {
      setIsLoginDataAvailable(true); // Set the state once loginData is available
    }
  }, [loginData]);

  useEffect(() => {
    if (isLoginDataAvailable) {
      fetchExamDate(); // Call your function to fetch the exam data
    }
  }, [isLoginDataAvailable, triggerRefetchExamData]); // Runs after isLoginDataAvailable is set to true

  // Add function to handle Google Calendar event creation
  const handleAddToCalendar = () => {
    if (!examDate || !examEndTime || calendarAdded) return;

    const eventTitle = `Tech at School Exam - ${campusData?.name || 'Your Exam'}`;
    const eventDescription = `Your scheduled exam at Tech at School. Don't forget to be prepared and on time!`;
    const startTime = new Date(examDate).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(examEndTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&dates=${startTime}/${endTime}&sprop=website:${encodeURIComponent('https://techatschool.steyp.com')}`;

    window.open(calendarUrl, '_blank');
    setCalendarAdded(true);
    setToastMessage('📅 Add this exam to your Google Calendar to get reminded!');
    setShowToast(true);
  };

  // Effect to show calendar toast when exam date is available
  useEffect(() => {
    if (!showButton && examDate && !examStatus && !isExamWritten && !calendarAdded) {
      setToastMessage('📅 Add this exam to your Google Calendar to get reminded!');
      setShowToast(true);
    }
  }, [examDate, examStatus, isExamWritten, calendarAdded]);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-full flex justify-center px-4"
        >
          <div 
            onClick={handleAddToCalendar}
            className="w-[90%] sm:w-[500px] bg-[--color-tertiary-bg] border border-[--color-tertiary-border] shadow-lg rounded-lg px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-[--color-tertiary-focused-bg] transition-colors duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl flex-shrink-0"></span>
              <p className="text-sm sm:text-base text-[--color-tertiary-text] line-clamp-2">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowToast(false);
              }}
              className="text-[--color-tertiary-text] opacity-60 hover:opacity-100 flex-shrink-0 p-1 ml-2"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <section className="min-h-screen w-full p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-8 h-full">
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <Link href="/" className="transform hover:scale-105 transition-transform">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/23-11-2021/steyp-logo.svg"
                  width={110}
                  height={34}
                  alt="steyp logo"
                  className="w-[90px] sm:w-[110px] h-auto"
                />
              </Link>
              <Link href="/" className="transform hover:scale-105 transition-transform">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/18-03-2025/Initiative.svg"
                  width={150}
                  height={48}
                  alt="talrop logo"
                  className="w-[120px] sm:w-[150px] h-auto"
                />
              </Link>
            </div>
            <div className="flex justify-center items-center mt-8 lg:mt-0" style={{ minHeight: "calc(100vh - 180px)" }}>
              <div className="w-full max-w-xl">
                {isExamScheduled ? (
                  <CountdownTimer 
                    targetDate={examDate} 
                    examStatus={examStatus} 
                    showButton={showButton} 
                    isExamWrittem={isExamWritten} 
                  />
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Exam Not Scheduled Yet
                    </h2>
                    <p className="text-gray-600">
                      The exam has not been scheduled for your school yet. Please reach out to your school administration for more information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:max-w-[540px] hidden lg:block">
            <div className="w-full h-full relative aspect-[3/4]">
              <Image
                src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/06-02-2025/tech-at-school.jpg"
                className="w-full h-full object-cover rounded-lg"
                alt="blog"
                width={540}
                height={716}
                loading="lazy"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
