"use client";

import React, { useEffect } from "react";

type ScholarshipExamQuestionsProps = {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  setSelectedAnswer: (value: string | null) => void;
  selectedAnswer: string | null;
  examQuestion: any;
  totalQuestions: number;
  selectedLanguage: string;
  viewtotal: any;
  nextLoading: boolean;
  previousQuestion: any;
};

const ScholarshipExamQuestions: React.FC<ScholarshipExamQuestionsProps> = ({
  selectedOption,
  setSelectedOption,
  setSelectedAnswer,
  examQuestion,
  totalQuestions,
  selectedLanguage,
  viewtotal,
  nextLoading,
  previousQuestion,
}) => {
  useEffect(() => {
    setSelectedOption("");
    if (viewtotal.selected_option) {
      setSelectedOption(viewtotal.selected_option);
      setSelectedAnswer(viewtotal.selected_option);
    } else if (previousQuestion.selected_option) {
      setSelectedOption(previousQuestion.selected_option);
      setSelectedAnswer(previousQuestion.selected_option);
    } else {
      setSelectedAnswer(null);
    }
  }, [viewtotal, previousQuestion]);

  const getQuestionText = () => {
    return selectedLanguage === "english"
      ? examQuestion?.english_question || viewtotal?.english_question || previousQuestion?.english_question
      : examQuestion?.question || viewtotal?.question || previousQuestion?.question;
  };

  const getOptionText = (option: string) => {
    return selectedLanguage === "english"
      ? viewtotal?.[option] || previousQuestion?.[option] || examQuestion?.[option]
      : viewtotal?.[option] || previousQuestion?.[option] || examQuestion?.[option];
  };

  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-gray-700 mb-4">
        Question {viewtotal?.order_id || previousQuestion?.order_id || examQuestion.question_number} of {totalQuestions}
      </p>
      <p className="text-lg font-medium text-gray-900 mb-4">{getQuestionText()}</p>
      {["option1", "option2", "option3", "option4"].map((option, index) => (
        <div
          key={option}
          className={`flex items-center p-3 border rounded-md cursor-pointer mb-3 transition-all ${selectedOption === option ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}
          onClick={() => {
            if (!nextLoading) {
              setSelectedOption(option);
              setSelectedAnswer(option);
            }
          }}
        >
          <span className={`flex items-center justify-center w-8 h-8 border rounded-md mr-3 font-bold ${selectedOption === option ? "border-white text-white" : "border-gray-500 text-gray-700"}`}>
            {String.fromCharCode(65 + index)}
          </span>
          <p className="text-sm md:text-base">{getOptionText(option)}</p>
        </div>
      ))}
    </div>
  );
};

export default ScholarshipExamQuestions;
