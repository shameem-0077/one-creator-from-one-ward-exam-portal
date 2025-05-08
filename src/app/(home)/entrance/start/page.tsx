"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ExamRules from "../_components/ExamRules";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";

const ScholarshipExamStart: React.FC = () => {
  const { push } = useRouter();
  const { slug } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { campusData, loginData, examData } = useUserStore();
  const setExamData = useUserStore((state) => state.setExamData);

  const handleStarting = async () => {
    setLoading(true);
    setError(false);
    setErrorMsg("");
    
    scholarshipConfig.post("api/v1/exams/exam-center-exam/start/",
      {
        "exam_center_id": examData?.examCenterId
      },
      {
        headers: {
          Authorization: "Bearer " + loginData?.accessToken,
        }
      }
    ).then((res) => {
      const {status_code, data} = res.data
      if (status_code === 6000) {
        setLoading(false);
        setExamData({
          examId: data?.exam_pk,
          status: "in_progress",
          start_timestamp: data?.start_timestamp,
          end_timestamp: data?.end_timestamp,
          time_allotted: data?.time_allotted
        })
        push('/entrance/questions')
      } else {
        push('/entrance/questions')
        setLoading(false);
      }
    }).catch((err) => {
      setLoading(false);
      setError(true);
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    })
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto pt-8 pb-12 px-4">
        {/* Header section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Scholarship Examination</h1>
          <p className="text-gray-600">Please read the instructions carefully before starting the exam</p>
        </div>
        
        {/* Content card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Rules section */}
          <div className="px-6 py-6">
            <ExamRules />
          </div>
          
          {/* Action section */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col items-center">
              {isError && (
                <div className="mb-4 w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm text-center">{errorMsg}</p>
                </div>
              )}
              
              <button 
                onClick={handleStarting}
                disabled={isLoading}
                className="px-8 py-3 bg-[#047853] text-white font-medium rounded-md shadow-sm hover:bg-[#036745] focus:outline-none focus:ring-2 focus:ring-[#047853] focus:ring-opacity-50 disabled:opacity-50 transition-colors w-full max-w-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Starting Exam...</span>
                  </div>
                ) : (
                  <span>Begin Examination</span>
                )}
              </button>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                By starting the exam, you agree to follow all examination rules and guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipExamStart;