"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from '@/store/store';

type ScholarshipTimeExceededModalProps = {
  setCompletedModal: (value: boolean) => void;
  showCompletedModal: boolean;
  scholarshipExamType?: string;
};

const ScholarshipTimeExceededModal: React.FC<ScholarshipTimeExceededModalProps> = ({
  setCompletedModal,
  showCompletedModal,
  scholarshipExamType,
}) => {
  const router = useRouter();
  const clearCampusData = useUserStore((state) => state.clearCampusData);
  const clearExamData = useUserStore((state) => state.clearExamData);
  const clearLanguageData = useUserStore((state) => state.clearLanguageData);
  const logout = useUserStore((state) => state.logout);
  const [isLoading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    
    try {
      // Clear all store data
      clearCampusData();
      clearExamData();
      clearLanguageData();
      logout();
      
      // Clear any local storage items related to the exam
      if (typeof window !== 'undefined') {
        // Clear any exam-related localStorage items
        localStorage.removeItem("one_creator_exam_data");
        
        // Clear Tidio state if it exists
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("tidio_state_")) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Add a small delay before navigation to ensure stores are cleared
      setTimeout(() => {
        router.push('/');
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error during logout:", error);
      setLoading(false);
      router.push('/');
    }
  };

  // Guard for `window` and `document` access by ensuring this runs only on the client-side
  useEffect(() => {
    // This ensures that no document/window/localStorage code runs during SSR
    if (typeof window === 'undefined') {
      return;
    }
  }, []);

  return (
    <div className={`fixed inset-0 z-[1000] transition-all duration-300 ${showCompletedModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"></div>
      
      {/* Modal container with animation */}
      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 
                    w-[550px] max-h-[90vh] max-w-[95vw] p-0 flex flex-col
                    ${showCompletedModal ? "scale-100" : "scale-95"}`}>
        
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>
        
        {/* Header with illustration - Fixed height to ensure visibility */}
        <div className="bg-gradient-to-b from-red-50 to-white pt-6 pb-6 px-6 relative">
          {/* Clock illustrations */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-100 rounded-full opacity-40"></div>
          <div className="absolute right-6 top-5 w-16 h-16 rounded-full border-4 border-red-300 flex items-center justify-center transform rotate-12">
            <div className="w-1 h-6 bg-red-400 origin-bottom transform rotate-45 absolute"></div>
            <div className="w-1 h-4 bg-red-500 origin-bottom transform rotate-[125deg] absolute"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full absolute"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-red-600 mb-2">Time's Up!</h2>
          <p className="text-gray-600 pr-16">Your examination time has ended. Your answers have been automatically submitted.</p>
        </div>
        
        {/* Content area - Add scrolling if needed */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Next Steps</h3>
                <p className="text-sm text-gray-600 mt-1">Your exam has been submitted and will be evaluated. The results will be announced soon.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons - Fixed position */}
        <div className="border-t border-gray-100 px-6 py-4 mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            )}
            <span>{isLoading ? "Logging out..." : "Return to Home"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipTimeExceededModal;
