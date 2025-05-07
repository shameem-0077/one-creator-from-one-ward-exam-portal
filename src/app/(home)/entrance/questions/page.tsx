"use client"
import React, { Suspense } from 'react'
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

// Use dynamic import with loading fallback
const ScholarshipExaminationPageComponent = dynamic(
  () => import("../_components/ScholarshipExaminationPage"), 
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading examination...</p>
        </div>
      </div>
    )
  }
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Examination page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback component for errors
const ExamErrorFallback = () => {
  const router = useRouter();
  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg text-center max-w-md">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">We're having trouble loading the examination. Please try again.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
          >
            Refresh
          </button>
          <button 
            onClick={() => router.push('/entrance')} 
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

function ExaminationPage() {
  return (
    <ErrorBoundary fallback={<ExamErrorFallback />}>
      <Suspense 
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <ScholarshipExaminationPageComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ExaminationPage;