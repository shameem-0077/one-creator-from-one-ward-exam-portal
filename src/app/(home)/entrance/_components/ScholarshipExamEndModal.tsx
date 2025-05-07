"use client";

import React from "react";
import { useCountdown } from "../_components/hooks/useCountdown";
import RequestLoader from "../_components/RequestLoader";
import useUserStore from "@/store/store";

type ScholarshipExamEndModalProps = {
  handleExamCompleted: any;
  completedloading: boolean;
  setEndModal: (value: boolean) => void;
  showEndModal: boolean;
  ViewQuestion: () => void;
  setViewQuestions: (value: any) => void;
  setCurrentQuestion: (value: any) => void;
};

const ScholarshipExamEndModal: React.FC<ScholarshipExamEndModalProps> = ({
  handleExamCompleted,
  completedloading,
  setEndModal,
  showEndModal,
  ViewQuestion,
  setViewQuestions,
  setCurrentQuestion,
}) => {
  const { campusData, loginData, examData } = useUserStore();
    
  const [_, __, minutes] = useCountdown({ targetDate: examData?.end_timestamp || "" });

  return (
    <div className={`fixed inset-0 z-[1000] transition-all duration-300 ${showEndModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"></div>
      
      {/* Modal container with animation */}
      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 
                    w-[550px] max-h-[90vh] max-w-[95vw] p-0 flex flex-col
                    ${showEndModal ? "scale-100" : "scale-95"}`}>
        
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        
        {/* Header with illustration */}
        <div className="bg-gradient-to-b from-amber-50 to-white pt-6 pb-6 px-6 relative">
          {/* Clock illustrations */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-100 rounded-full opacity-40"></div>
          <div className="absolute right-6 top-5 w-16 h-16 rounded-full border-4 border-amber-300 flex items-center justify-center transform rotate-12">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-amber-600 mb-2">Finish Exam?</h2>
          <p className="text-gray-600 pr-16">
            You still have <span className="font-semibold text-amber-600">{minutes} {minutes === 1 ? "minute" : "minutes"}</span> remaining.
          </p>
        </div>
        
        {/* Content area */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-800">Review Your Work</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can review and edit your answers before final submission. Use the "Review" button to check your answers.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="border-t border-gray-100 px-6 py-4 mt-auto flex gap-3">
          {!completedloading ? (
            <button
              onClick={() => {
                setEndModal(false);
                ViewQuestion();
                setCurrentQuestion({});
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>Review Answers</span>
            </button>
          ) : (
            <button 
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-white font-medium rounded-lg cursor-not-allowed"
            >
              <span>Review Answers</span>
            </button>
          )}

          {!completedloading ? (
            <button
              onClick={handleExamCompleted}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>End Exam</span>
            </button>
          ) : (
            <button 
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-medium rounded-lg"
            >
              <RequestLoader />
              <span>Submitting...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipExamEndModal;
