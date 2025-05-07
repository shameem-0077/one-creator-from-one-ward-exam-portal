"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PrimarySelect } from "@/components/forms/input/PrimarySelect";
import useUserStore from "@/store/store";
import { scholarshipConfig } from "@/config/axiosConfig";

interface Language {
  id: number;
  langage1: string;
  langage2: string;
}

function ExamRules() {
  const { LanguageData } = useUserStore();

  const setLanguageData = useUserStore((state) => state.setLanguageData);

  useEffect(() => {
    setLanguageData({
      "slug": "english",
      "name": "English"
    });
  }, [])

  const [selectedLanguage, setSelectedLanguage] = useState<any>({
    "slug": "english",
    "name": "English"
  });
  const [languages, setLanguages] = useState<any[]>([]);
  interface ExamRule {
    pk: number;
    description: string;
  }
  console.log("selectedLanguage====", selectedLanguage.slug);
  const [examRules, setExamRules] = useState<ExamRule[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchExamRules = async (lang_slug: string) => {
    setLoading(true);

    try {
      const response = await scholarshipConfig.get(`api/v1/exams/exam-rules/`, {
        params: {
          lang_slug: lang_slug,
        },
      });

      const { status_code, data } = response.data;
      if (status_code === 6000) {
        setExamRules(data);
      } else {
        setExamRules([]);
        setError("Something went wrong");
      }
    } catch (error) {
      setExamRules([]);
      console.error("Error verifying promo code:", error);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    setLoading(true);

    try {
      const response = await scholarshipConfig.get("api/v1/main/languages/");

      console.log(response.data);

      const { status_code, data } = response.data;
      if (status_code === 6000) {
        setLanguages(data);
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      console.error("Error verifying promo code:", error);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    fetchExamRules(selectedLanguage?.slug);
  }, [LanguageData]);

  // Set default language if not already set
  useEffect(() => {
    if (languages.length > 0 && (!selectedLanguage || !selectedLanguage.slug)) {
      // Find English language as default, or use the first language in the list
      const defaultLang = languages.find((lang: any) => lang.slug === "english") || languages[0];
      handleLanguageSelection(defaultLang);
    }
  }, [languages]);

  const handleLanguageSelection = (value: any) => {
    console.log(value, "value===")
    setLanguageData(value);
    setSelectedLanguage(value);
    fetchExamRules(value?.slug);
  };

  const renderExamrules = () =>
    examRules?.map((item) => (
      <div key={item.pk} className="flex items-center space-x-4">
        <Image
          src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/23-01-2023/green-arrow.svg"
          alt="Arrow"
          width={14}
          height={14}
        />
        <p className=" text-sm">{item.description}</p>
      </div>
    ));

  return (
    <div className="m-8 max-[480px]:m-0">
      <div className=" text-[#545454]">
        {/* Language Toggle */}
        <div className="flex justify-between items-center mb-8 max-[480px]:mb-4 max-[480px]:flex-col max-[480px]:gap-2">
          <h2 className="text-2xl font-bold">
            <span className="text-[#0FA76F]">Test</span> Instructions
          </h2>
          <div className="flex justify-center items-center">
            <PrimarySelect
              dropDownValues={languages}
              required={false}
              error={undefined}
              placeholder={"Select language"}
              name={"select_language"}
              value={selectedLanguage}
              className="w-60 pt-0 pb-0"
              onChange={({ name, value }: any) => {
                handleLanguageSelection(value);
              }}
              valueAccessor="slug"
              labelAccessor="name"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8 border border-solid border-[#D4D4D4] rounded-md p-9">
          {loading ? (
            <div
              role="status"
              className="flex items-center space-x-4 justify-center"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            renderExamrules()
          )}
        </div>

        {/* Language Selection */}
        {/* <div className="mb-8 flex items-center justify-between border border-solid border-[#D4D4D4] rounded-md px-9">
          <h3 className=" text-md font-normal p-2">
            Please select your preferred language for the test
          </h3>
          
        </div> */}

        {/* Warning and Start Button */}
        <div className="flex items-center justify-center bg-[#FFEFEF] py-3 max-[480px]:px-3 border border-solid border-[#FFCCCC] rounded-md max-[480px]:mb-2">
          <p className="text-red-600 max-[480px]:text-[14px]">
            Please be sure you take the exam by yourself in a quiet and
            undisturbed space.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExamRules;
