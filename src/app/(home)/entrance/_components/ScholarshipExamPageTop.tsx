"use client";

import { useState } from "react";
// import { useSelector } from "react-redux";
import CountDown from "./CountDown";
import useUserStore from "@/store/store";
import { PrimarySelect } from "@/components/forms/input/PrimarySelect";

interface ScholarshipExamPageTopProps {
  endExamination: () => void;
  setCompletedModal: any;
  showCompletedModal: any;
  setEndModal: any;
  showEndModal: any;
  examEndTime: any;
  setRemainingTime: any;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  scholarshipExamType: string;
}

const ScholarshipExamPageTop: React.FC<ScholarshipExamPageTopProps> = ({
  endExamination,
  setCompletedModal,
  showCompletedModal,
  setEndModal,
  showEndModal,
  examEndTime,
  setRemainingTime,
  selectedLanguage,
  setSelectedLanguage,
  scholarshipExamType,
}) => {

  const { campusData, loginData, examData } = useUserStore();

  const langOptions = [
    {
      name: "English",
      slug: "english"
    },
    {
      name: "Malayalam",
      slug: "malayalam"
    },
    {
      name: "Tamil",
      slug: "tamil"
    },
  ]
  

  return (
    <div className="border border-gray-300 rounded-lg p-5 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">
          Scholarship Examination
        </h3>

        {/* Language Switcher */}
        <div className="flex items-center mt-2 hidden md:flex">
          <PrimarySelect
            dropDownValues={langOptions}
            required={false}
            error={undefined}
            placeholder={"Select language"}
            name={"select_language"}
            value={selectedLanguage} 
            className="w-60 pt-0 pb-0"
            onChange={({name,value}: any) => {
              setSelectedLanguage(value)
            }}
            valueAccessor="slug"
            labelAccessor="name"
          />
        </div>
      </div>

      {/* Countdown Timer */}
      <div>
        {examData?.status !== "completed" && (
            <div className="flex items-center space-x-2">
              <CountDown targetDate={examData?.end_timestamp || ''} onComplete={endExamination} />
            </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipExamPageTop;
