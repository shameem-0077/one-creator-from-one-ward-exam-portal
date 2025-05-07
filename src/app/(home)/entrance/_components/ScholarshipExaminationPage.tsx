"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import ScholarshipExamPageTop from "../_components/ScholarshipExamPageTop";
import ScholarshipExamQuestions from "../_components/ScholarshipExamQuestions";
import ScholarshipReviewQuestion from "../_components/ScholarshipReviewQuestion";
import ScholarshipOfflinePage from "../_components/ScholarshipOfflinePage";
// import { scholarshipApi } from "@/lib/ApiConfig";
import ScholarshipExamEndModal from "../_components/ScholarshipExamEndModal";
import ScholarshipTimeExceededModal from "../_components/ScholarshipTimeExceededModal";
import ScholarshipExamPageHeader from "../_components/ScholarshipExamPageHeader";
import DoubleArrowLeftIcon from "@/../public/assets/icons/double-arrow-left.svg"; // Update the path as needed
import DoubleArrowRightIcon from "@/../public/assets/icons/double-arrow-right.svg"; // Update the path as needed
import LoaderGreen from "../_components/LoaderGreen";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import toast from "react-hot-toast";

const ScholarshipExaminationPage = () => {
  const router = useRouter();
  const scholarshipExamLanguage = "";
  const { campusData, loginData, examData, LanguageData } = useUserStore();
  const setExamData = useUserStore((state) => state.setExamData);
  const setLanguageData = useUserStore((state) => state.setLanguageData);

  const [selectedLanguage, setSelectedLanguage] = useState<any>(LanguageData);

  const [completedloading, setCompltedloading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    id?: string;
    question_number?: number;
    status?: string;
  }>({
    status: 'pending',
  });
  const [previousQuestion, setPreviousQuestion] = useState<{
    question_number?: number;
  }>({});
  type Question = {
    id: number;
    order_id: number;
    status: string;
    is_skipped: boolean;
  };

  const [questionNumbers, setQuestionNumbers] = useState<Question[]>([
    {
      id: 1,
      order_id: 1,
      status: "pending",
      is_skipped: false,
    },
  ]);
  const [examEndTime, setExamEndTime] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [remainingTime, setRemainingTime] = useState("");
  const [checkCompleteday, setcheckCompleteday] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [isReload, setReload] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [showEndModal, setEndModal] = useState(false);
  const [showCompletedModal, setCompletedModal] = useState(false);
  const [completed, setComplted] = useState(false);
  const [viewquestions, setViewQuestions] = useState<string | number>("");
  const [viewtotal, setViewtotal] = useState<{ order_id?: number }>({});
  const [updates, setUpdates] = useState("");
  const [isOffline, setOffline] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isPreviousLoading, setPreviousLoading] = useState(false);
  const [isNextQuestionLoading, setNextQuestionLoading] = useState(false);
  const [ongoingQuestion, setOngoingQuestion] = useState("");
  const [isExamCompleted, setExamCompleted] = useState(false);
  const [isSkipLoading, setSkipLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleHistoryPush = (nextPath: string) => {
    useRouter().push(nextPath);
  };

  const handleOnlineEvent = () => {
    setOffline(false);
    reloadWebPage();
  };
  
  const handleOfflineEvent = () => {
    setOffline(true);
  };

  const reloadWebPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  const handleApiError = (error: any, operation: string) => {
    console.error(`API Error during ${operation}:`, error);
    
    if (!navigator.onLine) {
      setOffline(true);
      return;
    }

    if (error?.response?.status === 401) {
      toast.error("Your session has expired. Please login again.");
      router.push('/login');
      return;
    }

    const errorMsg = error?.response?.data?.message?.message || 
                    error?.response?.data?.message || 
                    "Something went wrong. Please try again.";
    
    toast.error(errorMsg);
    setHasError(true);
    setErrorMessage(errorMsg);
  };

  const sendCurrentQuestion = useCallback(() => {
    if (!examData?.examId || !loginData?.accessToken) {
      toast.error("Missing exam information");
      return;
    }

    setQuestionLoading(true);
    console.log("Fetching current question from API");
    
    scholarshipConfig
      .get(`api/v1/exams/campus-exam/current-question/${examData?.examId}/`, {
        headers: {
          Authorization: `Bearer ${loginData?.accessToken}`,
        },
        params: {
          program: campusData?.program_slug,
          campus_pk: campusData?.pk,
          lang_slug: LanguageData?.slug
        },
      })
      .then((res) => {
        const { status_code, data } = res.data;
        if (status_code === 6000) {
          console.log("Current question data:", data?.current_question_data);
          
          // Make sure we set the complete data
          setCurrentQuestion(data?.current_question_data || {});
          setQuestionLoading(false);
          setViewtotal({});
          setExamEndTime(data?.end_timestamp || "");
          setHasError(false);
          
          // Clear any previous selections to ensure fresh question display
          setSelectedAnswer(null);
          setSelectedOption("");
        } else {
          setQuestionLoading(false);
          toast.error("Failed to load current question");
          console.log("Error loading current question");
        }
      })
      .catch((err) => {
        setQuestionLoading(false);
        handleApiError(err, "loading current question");
      });
  }, [examData?.examId, loginData?.accessToken, campusData?.program_slug, campusData?.pk, LanguageData?.slug]);

  const fetchQuestionStatus = useCallback(() => {
    if (!loginData?.accessToken) return;
    
    scholarshipConfig
      .get(`api/v1/exams/campus-exam/questions/status/`, {
        headers: {
          Authorization: `Bearer ${loginData?.accessToken}`,
        },
        params: {
          program: campusData?.program_slug,
          campus_pk: campusData?.pk,
        },
      })
      .then((res) => {
        const { status_code, data } = res.data;
        if (status_code === 6000 && Array.isArray(data) && data.length > 0) {
          setQuestionNumbers(data);
          setTotalQuestions(data.length);
        } else {
          console.log("Error loading question status");
        }
      })
      .catch((err) => {
        handleApiError(err, "loading question status");
      });
  }, [loginData?.accessToken, campusData?.program_slug, campusData?.pk]);

  // Replace the navigateToQuestionNumber function with this simpler approach
  const navigateToNextQuestion = useCallback(() => {
    console.log("Navigating to next question");
    
    // Clear any previous selections and views
    setSelectedAnswer(null);
    setViewQuestions("");
    setPreviousQuestion({});
    
    // Simply force a reload which will get the server's next question
    // This approach lets the backend determine what the next question should be
    setReload(prev => !prev);
    
    // Instead of trying to calculate the next question ourselves, 
    // we rely on the backend API to give us the correct next question
  }, []);
  
  // Update the submitQuestion function to use the simpler approach
  const submitQuestion = (skipped: boolean) => {
    if (!currentQuestion?.id) {
      toast.error("Question ID is missing");
      return;
    }

    if (!skipped && !selectedAnswer) {
      toast.error("Please select an answer before proceeding");
      return;
    }

    console.log(`Submitting answer for question ID: ${currentQuestion.id}`);
    
    const is_skipped = skipped ? "True" : false;
    skipped ? setSkipLoading(true) : setNextLoading(true);

    scholarshipConfig
      .post(
        `api/v1/exams/campus-exam/question/submit-answer/${currentQuestion?.id}/`,
        {
          selected_option: selectedAnswer,
          is_skipped: is_skipped,
          program: campusData?.program_slug,
        },
        {
          headers: {
            Authorization: `Bearer ${loginData?.accessToken}`,
          },
        }
      )
      .then((res) => {
        const { status_code, data, message } = res.data;
        if (status_code === 6000) {
          toast.success(message?.message || "Answer submitted successfully");
          setSelectedOption("");
          setSelectedAnswer(null);
          setNextLoading(false);
          setSkipLoading(false);
          setComplted(!!data);
          setExamCompleted(!!data);
          
          console.log("Submit response:", data);
          
          // If exam is completed, go to the last question
          if (data && data.is_exam_completed) {
            console.log("Exam completed, showing last question");
            if (questionNumbers.length > 0) {
              const lastQuestion = questionNumbers[questionNumbers.length - 1];
              if (lastQuestion) {
                setViewQuestions(lastQuestion.id.toString());
                setOngoingQuestion(lastQuestion.id.toString());
              }
            }
          } else {
            // Simply navigate to next question by relying on the backend
            navigateToNextQuestion();
          }
        } else {
          toast.error(message?.message || "Failed to submit answer");
          setNextLoading(false);
          setSkipLoading(false);
        }
      })
      .catch((err) => {
        setNextLoading(false);
        setSkipLoading(false);
        handleApiError(err, "submitting answer");
      });
  };

  const reSubmitQuestion = () => {
    if (!viewquestions && !examData?.ongoing_question) {
      toast.error("Question ID is missing");
      return;
    }
    
    if (!selectedAnswer) {
      toast.error("Please select an answer before updating");
      return;
    }

    setNextLoading(true);
    const questionId = viewquestions || examData?.ongoing_question;

    scholarshipConfig
      .post(
        `api/v1/exams/campus-exam/edit-answer/${questionId}/`,
        {
          changed_option: selectedAnswer,
          program: campusData?.program_slug,
        },
        {
          headers: {
            Authorization: `Bearer ${loginData?.accessToken}`,
          },
        }
      )
      .then((res) => {
        const { status_code, message } = res.data;
        if (status_code === 6000) {
          toast.success(message?.message || "Answer updated successfully");
          setSubmitted(true);
          setSelectedAnswer(null);
          setNextLoading(false);
          setIsEdited(!isEdited);
        } else {
          toast.error(message?.message || "Failed to update answer");
          setNextLoading(false);
        }
      })
      .catch((err) => {
        setNextLoading(false);
        handleApiError(err, "updating answer");
      });
  };

  const reviewQuestion = useCallback(() => {
    if (!viewquestions && !examData?.ongoing_question) {
      console.log("No question ID to review");
      return;
    }

    const questionId = viewquestions || examData?.ongoing_question;
    
    scholarshipConfig
      .get(
        `api/v1/exams/campus-exam/view/question/${questionId}/`,
        {
          headers: {
            Authorization: `Bearer ${loginData?.accessToken}`,
          },
          params: {
            program: campusData?.program_slug,
            lang_slug: LanguageData?.slug
          },
        }
      )
      .then((res) => {
        const { status_code, data } = res.data;
        if (status_code === 6000) {
          setViewtotal(data || {});
          setCurrentQuestion({
            id: data?.question_pk,
            question_number: data?.question_number,
            status: data?.status || "pending",
          });
          setPreviousQuestion({});
        } else {
          console.log("Error loading question for review");
        }
      })
      .catch((err) => {
        handleApiError(err, "loading question for review");
      });
  }, [viewquestions, examData?.ongoing_question, loginData?.accessToken, campusData?.program_slug, LanguageData?.slug]);

  const renderPreviousQuestion = (next: boolean) => {
    if (next) {
      // Use our navigation function for "next" button
      navigateToNextQuestion();
      return;
    }
    
    // Handle "previous" button
    setPreviousLoading(true);
    
    // Use current question's number for navigation
    const questionNumber = currentQuestion?.question_number;
    
    if (!questionNumber || questionNumber <= 1) {
      toast.error("You are already at the first question");
      setPreviousLoading(false);
      return;
    }

    console.log(`Navigating to previous question from ${questionNumber}`);
    
    scholarshipConfig
      .get(
        `api/v1/exams/campus-exam/view/previous-question/${questionNumber}/`,
        {
          headers: {
            Authorization: `Bearer ${loginData?.accessToken}`,
          },
          params: {
            program: campusData?.program_slug,
            lang_slug: LanguageData?.slug
          },
        }
      )
      .then((res) => {
        const { status_code, data } = res.data;
        if (status_code === 6000) {
          console.log("Previous question data:", data);
          setPreviousQuestion(data || {});
          setViewtotal({});
          setCurrentQuestion({
            id: data?.question_pk,
            question_number: data?.question_number,
            status: data?.status || "pending",
          });
          setSelectedAnswer(null);
          setSelectedOption("");
          setPreviousLoading(false);
        } else {
          setPreviousLoading(false);
          console.log("Error navigating to previous question");
        }
      })
      .catch((err) => {
        setPreviousLoading(false);
        handleApiError(err, "navigating to previous question");
      });
  };

  const endExamination = () => {
    // Prevent duplicate calls if already completing the exam
    if (isLoading) {
      return;
    }
    
    setCompletedModal(false);
    
    // If exam is already timed out, just show the completion modal
    if (examData?.is_time_out) {
      setCompletedModal(true);
      return;
    }

    // Set loading state to indicate API call is in progress
    setIsLoading(true);

    // Use a timeout to prevent UI freeze
    setTimeout(() => {
      scholarshipConfig
        .post(
          `api/v1/exams/campus-exam/end-exam-when-timeout/`,
          {
            program: campusData?.program_slug,
          },
          {
            headers: {
              Authorization: `Bearer ${loginData?.accessToken}`,
            },
            // Add timeout to prevent long-running requests
            timeout: 5000
          }
        )
        .then((res) => {
          const { status_code } = res.data;
          if (status_code === 6000) {
            // Wrap state updates in setTimeout to prevent React batching issues
            setTimeout(() => {
              setExamData({
                is_time_out: true,
              });
              setCompletedModal(true);
              setIsLoading(false);
            }, 0);
          } else {
            console.log("Error ending examination");
            // Fallback: Still show completed modal even if API returned unexpected response
            setTimeout(() => {
              setExamData({
                is_time_out: true,
              });
              setCompletedModal(true);
              setIsLoading(false);
            }, 0);
          }
        })
        .catch((error) => {
          console.error("Error ending examination:", error);
          // Handle API error but still mark exam as completed for the user
          handleApiError(error, "ending exam on timeout");
          
          // Important: Still show the completion modal to the user despite the API error
          setTimeout(() => {
            setExamData({
              is_time_out: true,
            });
            setCompletedModal(true);
            setIsLoading(false);
          }, 0);
        });
    }, 0);
  };

  const handleExamCompleted = () => {
    setCompltedloading(true);
    scholarshipConfig
      .post(
        `api/v1/exams/campus-exam/student/end-exam/`,
        {
          program: campusData?.program_slug,
        },
        {
          headers: {
            Authorization: `Bearer ${loginData?.accessToken}`,
          },
        }
      )
      .then((res) => {
        const { status_code } = res.data;
        if (status_code === 6000) {
          setExamData({
            status: "completed",
          });
          router.push("/entrance/completed");
        } else {
          setCompltedloading(false);
          router.push("/entrance");
          console.log("Error completing examination");
        }
      })
      .catch((err) => {
        setCompltedloading(false);
        handleApiError(err, "completing examination");
        router.push("/entrance");
      });
  };

  const handleLanguageSelection = (value: any) => {
    setLanguageData(value);
    setSelectedLanguage(value);
  };

  useEffect(() => {
    setQuestionLoading(true);
    if (examData?.examId) {
      console.log("Loading current question from API");
      sendCurrentQuestion();
    }
  }, [isReload, examData?.examId, selectedLanguage, sendCurrentQuestion]);

  useEffect(() => {
    fetchQuestionStatus();
  }, [isReload, isEdited, loginData?.accessToken, fetchQuestionStatus]);
  
  useEffect(() => {
    if (viewquestions) {
      reviewQuestion();
    }
  }, [viewquestions, reviewQuestion]);

  useEffect(() => {
    if (currentQuestion?.question_number && questionNumbers?.length > 0) {
      const idx = currentQuestion.question_number - 1;
      if (idx >= 0 && idx < questionNumbers.length) {
        const questionId = questionNumbers[idx]?.id?.toString() || "";
        console.log(`Setting ongoing question to: ${questionId} (index ${idx}, question_number ${currentQuestion.question_number})`);
        setOngoingQuestion(questionId);
      } else {
        console.log(`Invalid index ${idx} for question number ${currentQuestion.question_number}`);
      }
    } else if (previousQuestion?.question_number && questionNumbers?.length > 0) {
      const idx = previousQuestion.question_number - 1;
      if (idx >= 0 && idx < questionNumbers.length) {
        const questionId = questionNumbers[idx]?.id?.toString() || "";
        console.log(`Setting ongoing question from previousQuestion to: ${questionId}`);
        setOngoingQuestion(questionId);
      }
    }
    
    if (currentQuestion.question_number) {
      console.log(`Updating examData with current question number: ${currentQuestion.question_number}`);
      setExamData({
        current_question_number: currentQuestion.question_number,
      });
    }
  }, [
    currentQuestion.question_number,
    previousQuestion.question_number,
    questionNumbers,
    setExamData
  ]);

  useEffect(() => {
    if (examData?.status === "completed" && totalQuestions > 0 && questionNumbers.length > 0) {
      const lastQuestionId = questionNumbers[totalQuestions - 1]?.id?.toString();
      if (lastQuestionId) {
        setViewQuestions(lastQuestionId);
        setOngoingQuestion(lastQuestionId);
      }
    }
  }, [totalQuestions, examData?.status, questionNumbers]);

  useEffect(() => {
    if (examData?.is_time_out) {
      setCompletedModal(true);
    }
  }, [examData?.is_time_out]);

  useEffect(() => {
    if (examData?.time_allotted === 0) endExamination();
  }, [examData?.time_allotted]);

  useEffect(() => {
    setExamData({
      ongoing_question: ongoingQuestion,
      is_exam_completed:
        !examData?.is_exam_completed || examData?.is_exam_completed === null
          ? !!isExamCompleted
          : examData?.is_exam_completed,
    });
  }, [ongoingQuestion, isExamCompleted, setExamData, examData?.is_exam_completed]);

  // Add this function to check if all questions are completed
  const areAllQuestionsCompleted = useCallback(() => {
    // Check if all questions have been answered (status is "completed" or skipped)
    return questionNumbers.length > 0 && 
           questionNumbers.every(q => q.status === "completed" || q.is_skipped);
  }, [questionNumbers]);

  if (hasError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
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
  }

  return (
    <div className="w-full h-screen overflow-auto bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Add decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <ScholarshipOfflinePage
        isOffline={isOffline}
        setOffline={setOffline}
        reloadWebPage={reloadWebPage}
      />
      <ScholarshipExamEndModal
        setEndModal={setEndModal}
        showEndModal={showEndModal}
        ViewQuestion={reviewQuestion}
        setViewQuestions={setViewQuestions}
        completedloading={completedloading}
        setCurrentQuestion={setCurrentQuestion}
        handleExamCompleted={handleExamCompleted}
      />
      <ScholarshipTimeExceededModal
        setCompletedModal={setCompletedModal}
        showCompletedModal={showCompletedModal}
        scholarshipExamType={Array.isArray(slug) ? slug[0] : slug}
      />
      
      <div className="min-h-full w-11/12 max-w-7xl mx-auto pt-16 pb-4 relative z-10 flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-grow flex flex-col">
          {/* Decorative header line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-teal-500 to-green-600 rounded-t-2xl"></div>
          
          <div className="mb-3 flex-shrink-0">
            <ScholarshipExamPageTop
              endExamination={endExamination}
              setCompletedModal={setCompletedModal}
              showCompletedModal={showCompletedModal}
              setEndModal={setEndModal}
              showEndModal={showEndModal}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={handleLanguageSelection}
              examEndTime={examEndTime}
              setRemainingTime={setRemainingTime}
              scholarshipExamType={Array.isArray(slug) ? slug[0] : slug || ""}
            />
          </div>
          
          {/* Main content area with flexible layout */}
          <div className="flex flex-col md:flex-row gap-4 flex-grow">
            {/* Questions Navigator */}
            <div className="md:w-72 shrink-0 flex flex-col">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-green-600 via-teal-600 to-green-700 text-white p-3 flex-shrink-0">
                  <h3 className="font-semibold text-center text-base tracking-wide">Questions</h3>
                </div>
                <div className="p-3 overflow-y-auto flex-grow" style={{ maxHeight: "40vh", overflow: "auto" }}>
                  <ScholarshipReviewQuestion
                    questionNumbers={questionNumbers}
                    viewquestions={viewquestions}
                    setViewQuestions={setViewQuestions}
                    examQuestion={currentQuestion}
                    completed={completed}
                    setComplted={setComplted}
                    viewtotal={viewtotal}
                    totalQuestions={totalQuestions}
                    setSubmitted={setSubmitted}
                    isReload={isReload}
                    setReload={setReload}
                    setPreviousQuestion={setPreviousQuestion}
                    setOngoingQuestion={setOngoingQuestion}
                    lockEditForSkippedAndCompleted={false}
                  />
                </div>
                
                {/* Compact exam progress section */}
                <div className="p-3 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold text-green-800 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600">Progress</span>
                    </h4>
                    <div className="text-xs font-medium bg-green-700 text-white px-1.5 py-0.5 rounded-full">
                      {Math.round((questionNumbers.filter(q => q.status === "completed").length / questionNumbers.length) * 100)}%
                    </div>
                  </div>
                  
                  <div className="w-full bg-green-200 rounded-full h-1.5 overflow-hidden shadow-inner mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${(questionNumbers.filter(q => q.status === "completed").length / questionNumbers.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full border border-green-500 mr-1 flex-shrink-0"></div>
                      <span className="text-green-800">Answered: {questionNumbers.filter(q => q.status === "completed").length}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-300 rounded-full mr-1 flex-shrink-0"></div>
                      <span className="text-green-800">Not Attempted: {questionNumbers.length - questionNumbers.filter(q => q.status === "completed").length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Question content area */}
            <div className="flex-1 flex flex-col mt-4 md:mt-0">
              <div className="bg-white border border-green-200 rounded-xl shadow-sm p-4 flex-grow flex flex-col">
                {!questionLoading ? (
                  <>
                    <div className="overflow-y-auto flex-grow" style={{ minHeight: "40vh", maxHeight: "50vh", overflow: "auto" }}>
                      <ScholarshipExamQuestions
                        setSelectedAnswer={setSelectedAnswer}
                        selectedAnswer={selectedAnswer}
                        examQuestion={currentQuestion}
                        totalQuestions={totalQuestions}
                        selectedLanguage={selectedLanguage}
                        viewtotal={viewtotal}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        previousQuestion={previousQuestion}
                        nextLoading={nextLoading}
                      />
                    </div>
                    
                    <div className="flex flex-col items-center mt-4 gap-3 flex-shrink-0">
                      {/* Navigation buttons in a row */}
                      <div className="flex flex-wrap justify-center gap-4">
                        {currentQuestion?.question_number && currentQuestion?.question_number > 1 && (
                          <button
                            onClick={() => {
                              renderPreviousQuestion(false);
                            }}
                            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-2 rounded-lg shadow-md flex items-center font-medium transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px]"
                            disabled={isPreviousLoading}
                          >
                            <Image
                              src={DoubleArrowLeftIcon}
                              alt="Arrow"
                              className="w-4 mr-2"
                            />
                            {isPreviousLoading ? "Loading..." : "Previous"}
                          </button>
                        )}
                        
                        {/* For pending questions, show Submit button */}
                        {currentQuestion?.status === "pending" && (
                          <button
                            onClick={() => {
                              if (selectedAnswer) submitQuestion(false);
                              else toast.error("Please select an answer before proceeding");
                            }}
                            className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow-md flex items-center font-medium transition-all duration-300 ${
                              selectedAnswer ? "hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] cursor-pointer" : "opacity-70 cursor-not-allowed"
                            }`}
                            disabled={nextLoading || !selectedAnswer}
                          >
                            {nextLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </span>
                            ) : "Submit"}
                            {!nextLoading && (
                              <Image
                                src={DoubleArrowRightIcon}
                                alt="Arrow"
                                className="w-4 ml-2"
                              />
                            )}
                          </button>
                        )}
                        
                        {/* For completed questions, show Update Answer button */}
                        {currentQuestion?.status === "completed" && (
                          <button
                            onClick={() => {
                              selectedAnswer && reSubmitQuestion();
                            }}
                            className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow-md flex items-center font-medium transition-all duration-300 ${
                              selectedAnswer ? "hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] cursor-pointer" : "opacity-70 cursor-not-allowed"
                            }`}
                            disabled={nextLoading || !selectedAnswer}
                          >
                            {nextLoading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </span>
                            ) : "Update Answer"}
                            {!nextLoading && (
                              <Image
                                src={DoubleArrowRightIcon}
                                alt="Arrow"
                                className="w-4 ml-2"
                              />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Single prominent End Exam button */}
                      <button
                        onClick={() => {
                          setEndModal(true);
                        }}
                        className={`${
                          areAllQuestionsCompleted()
                            ? "bg-gradient-to-r from-green-600 via-green-500 to-teal-600 text-white font-bold text-base px-16 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm animate-pulse hover:animate-none hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white border-2 border-red-500 text-red-600 font-medium px-8 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 w-full max-w-xs hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        {areAllQuestionsCompleted() ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            End Exam Now
                          </span>
                        ) : "End Exam"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center py-20 flex-grow">
                    <LoaderGreen />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipExaminationPage;

