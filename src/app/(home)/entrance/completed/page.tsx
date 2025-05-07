'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useUserStore from '@/store/store';

import dynamic from 'next/dynamic';

const LogouteLoader = dynamic(() => import('../_components/LogouteLoader'), { ssr: false });

const ScholarshipExamCompletedPage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const clearCampusData = useUserStore((state) => state.clearCampusData);
  const clearExamData = useUserStore((state) => state.clearExamData);
  const clearLanguageData = useUserStore((state) => state.clearLanguageData);
  const logout = useUserStore((state) => state.logout);

  // Make sure to handle only client-side logic here
  const handleRedirect = () => {
    setLoading(true);
    
    try {
      // Clear all store data
      clearCampusData();
      clearExamData();
      clearLanguageData();
      logout();
      
      // Clear any local storage items related to the exam
      if (typeof window !== 'undefined') {
        try {
          // Clear any exam-related localStorage items
          localStorage.removeItem("one_creator_exam_data");
          
          // Clear Tidio state if it exists
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("tidio_state_")) {
              localStorage.removeItem(key);
            }
          });
        } catch (storageError) {
          console.warn("Could not access localStorage:", storageError);
          // Continue with redirect even if localStorage access fails
        }
        
        // Add a small delay before navigation to ensure stores are cleared
        setTimeout(() => {
          window.location.href = 'https://steyp.com';
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error during redirect:", error);
      setLoading(false);
      // Fallback to regular navigation if window.location fails
      router.push('/');
    }
  };

  // Guard for `window` and `document` access by ensuring this runs only on the client-side
  useEffect(() => {
    // This ensures that no document/window/localStorage code runs during SSR
    if (typeof window === 'undefined') {
      return;
    }
    
    // Add confetti effect when page loads
    const addConfetti = async () => {
      if (typeof window !== 'undefined') {
        try {
          const confettiCanvas = document.createElement('canvas');
          confettiCanvas.id = 'confetti-canvas';
          confettiCanvas.style.position = 'fixed';
          confettiCanvas.style.top = '0';
          confettiCanvas.style.left = '0';
          confettiCanvas.style.width = '100%';
          confettiCanvas.style.height = '100%';
          confettiCanvas.style.pointerEvents = 'none';
          confettiCanvas.style.zIndex = '100';
          document.body.appendChild(confettiCanvas);
          
          // Simulate confetti with CSS animations
          for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.position = 'absolute';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.top = '-20px';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.opacity = '0.8';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiCanvas.appendChild(confetti);
          }
        } catch (err) {
          console.error('Failed to create confetti effect:', err);
        }
      }
    };
    
    addConfetti();
    
    // Add keyframes for confetti animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
      }
      
      .delay-100 {
        animation-delay: 100ms;
      }
      
      .delay-200 {
        animation-delay: 200ms;
      }
      
      .delay-300 {
        animation-delay: 300ms;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up
      const canvas = document.getElementById('confetti-canvas');
      if (canvas) {
        document.body.removeChild(canvas);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-teal-500"></div>
        
        {/* Header celebration graphic */}
        <div className="bg-gradient-to-b from-green-100 to-green-50 pt-8 pb-10 px-8 relative">
          <div className="absolute right-0 top-0 w-32 h-32">
            <svg className="w-full h-full text-green-200 opacity-50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11v4h4v2h-6V9h2zm-2-4v2h-2v2H7V7h4zm8 0v2h-2v2h-2V7h4z"/>
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative w-32 h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <div className="absolute inset-0 bg-green-400 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-green-600 mb-2 fadeInUp">Exam Completed!</h1>
              <p className="text-xl text-gray-600 fadeInUp delay-100">
                Congratulations! You've successfully completed your examination.
              </p>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-8">
          <div className="bg-green-50 rounded-xl p-6 border border-green-100 mb-6 fadeInUp delay-200">
            <h2 className="text-lg font-semibold text-green-700 mb-2">What's Next?</h2>
            <p className="text-gray-600 mb-3">
              Your answers have been submitted and will be evaluated. The results will be announced soon.
            </p>
          </div>
          
          {/* Quote/Message */}
          <div className="text-center mb-8 fadeInUp delay-300">
            <p className="text-gray-500 italic">
              "Your hard work today will determine your success tomorrow. Well done!"
            </p>
          </div>
          
          {/* Action button */}
          <div className="flex justify-center">
            <button
              onClick={handleRedirect}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <LogouteLoader />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Return to Home</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipExamCompletedPage;
