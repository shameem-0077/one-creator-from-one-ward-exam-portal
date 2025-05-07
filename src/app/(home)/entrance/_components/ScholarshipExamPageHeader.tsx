"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUserStore from "@/store/store";

type ScholarshipExamPageHeaderProps = {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  isExamPage?: boolean;
};

const ScholarshipExamPageHeader: React.FC<ScholarshipExamPageHeaderProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  isExamPage,
}) => {
  const { campusData, loginData, examData } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setLoading] = useState(false);
  interface CampusData {
    logo?: string;
    name?: string;
  }

  const logoSrc =
    campusData?.logo ||
    "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/20-11-2023/logo.svg";
  const campusName = campusData?.name || "--";

  function clearTidioStateLocalStorage() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("tidio_state_")) {
        localStorage.removeItem(key);
      }
    });
  }

  return (
    <div className="h-[90px] flex items-center md:h-[85px] sm:h-[80px]">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <h1 className="flex items-center max-h-[50px] md:max-h-[40px] sm:max-h-[36px] xs:max-h-[32px]">
          <a href="/entrance" className="flex items-center">
            <div className="w-[70px] h-[80px] mr-2">
              <img src={logoSrc} alt="Logo" className="w-full" />
            </div>
            <span className="text-lg font-bold uppercase md:text-base sm:text-sm">
              {campusName}
            </span>
          </a>
        </h1>
        {pathname === "/scholarship/exam/completed/" ||
        pathname === "/scholarship/exam/expired/" ? (
          <button
            onClick={() => {
              router.push("/scholarship/");
              setLoading(true);
              localStorage.removeItem("one_creator_exam_data");
              clearTidioStateLocalStorage();
            }}
            className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-md w-[180px] h-[49px] md:w-[137px] md:h-[36px] sm:w-[17px] sm:h-[30px] sm:border-none"
          >
            <img
              src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/23-01-2023/Logout.svg"
              alt="Logout"
              className="w-6 h-6"
            />
            <span className="text-lg md:text-sm sm:hidden">Logout</span>
          </button>
        ) : null}
        {isExamPage && (
          <div className="flex items-center">
            <span
              className={`text-gray-500 font-semibold text-lg ${
                selectedLanguage === "malayalam" ? "text-green-500" : ""
              }`}
            >
              മ
            </span>
            <button
              onClick={() =>
                setSelectedLanguage(
                  selectedLanguage === "malayalam" ? "english" : "malayalam"
                )
              }
              className="mx-3 w-9 h-5 bg-green-500 rounded-full relative"
            >
              <span
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${
                  selectedLanguage === "english" ? "left-[15px]" : "left-[5px]"
                }`}
              ></span>
            </button>
            <span
              className={`text-gray-500 font-semibold text-lg ${
                selectedLanguage === "english" ? "text-green-500" : ""
              }`}
            >
              Eng
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipExamPageHeader;

// function useSelector(arg0: (state: any) => any) {
//     throw new Error("Function not implemented.");
// }
