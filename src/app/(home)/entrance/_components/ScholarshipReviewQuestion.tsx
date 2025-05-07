"use client";

import React, { useEffect, useRef } from "react";

type Question = {
  id: number;
  order_id: number;
  status: string;
  is_skipped: boolean;
};

type ScholarshipReviewQuestionProps = {
  questionNumbers: Question[];
  viewquestions: any;
  setViewQuestions: (value: number | string) => void;
  completed: boolean;
  setComplted: (value: boolean) => void;
  viewtotal: any;
  examQuestion: any;
  totalQuestions: number;
  setSubmitted: (value: boolean) => void;
  isReload: boolean;
  setReload: (value: boolean) => void;
  setPreviousQuestion: (value: any) => void;
  setOngoingQuestion: (value: any) => void;
  lockEditForSkippedAndCompleted?: boolean;
};

const ScholarshipReviewQuestion: React.FC<ScholarshipReviewQuestionProps> = ({
  questionNumbers,
  viewquestions,
  setViewQuestions,
  viewtotal,
  examQuestion,
  totalQuestions,
  setSubmitted,
  isReload,
  setReload,
  setPreviousQuestion,
  setOngoingQuestion,
  lockEditForSkippedAndCompleted = false,
}) => {
  const selectedDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedDivRef.current) {
      selectedDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [questionNumbers]);

  const handleQuestionClick = (question: any) => {
    // If locking is enabled, skip for locked questions (skipped or completed)
    if (lockEditForSkippedAndCompleted && (question.is_skipped || question.status === "completed")) {
      return;
    }
    
    setSubmitted(false);
    if (question.status === "attending") {
      setReload(!isReload);
      setPreviousQuestion({});
      setViewQuestions("");
    }
    if (
      (question.status === "pending" && question.is_skipped) ||
      question.status === "completed"
    ) {
      setViewQuestions(question.id);
      setOngoingQuestion(question.id);
    }
  };

  return (
    <div className="flex flex-col md:flex-col-reverse">
      <p className="text-lg text-gray-500 font-medium md:hidden mt-2">
        Question {viewtotal?.order_id ?? examQuestion?.question_number} of{" "}
        {totalQuestions}
      </p>
      <div className="grid grid-cols-6 gap-2">
        {questionNumbers.map((each) => {
          const isLocked = lockEditForSkippedAndCompleted && (each.is_skipped || each.status === "completed");
          
          return (
            <div
              key={each.id}
              ref={each.status === "attending" ? selectedDivRef : null}
              className={`w-full h-9 flex items-center justify-center text-sm font-medium rounded-md border-2 transition-all
                ${each.status === "completed" ? "border-green-500 text-gray-500" : ""}
                ${each.status === "attending" ? "bg-green-500 text-white" : ""}
                ${each.status === "pending" && !each.is_skipped ? "border-gray-400 text-gray-400 cursor-not-allowed" : ""}
                ${each.status === "pending" && each.is_skipped ? "border-orange-500 text-orange-500" : ""}
                ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
              `}
              onClick={() => handleQuestionClick(each)}
              title={isLocked ? "This question cannot be edited" : ""}
            >
              <span>{each.order_id}</span>
              {isLocked && <span className="ml-1 text-xs">🔒</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScholarshipReviewQuestion;
