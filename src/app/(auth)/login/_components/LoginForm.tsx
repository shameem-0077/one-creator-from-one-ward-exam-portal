"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import PromoCodeForm from "@/components/forms/form/PromoCodeForm";
import PhoneForm from "@/components/forms/form/PhoneForm";
import OtpForm from "@/components/forms/form/OtpForm";
import NameForm from "@/components/forms/form/NameForm";
import DivisionForm from "@/components/forms/form/DivisionForm";
import ClassForm from "@/components/forms/form/ClassForm";
import Image from "next/image";
import useUserStore from "@/store/store";
import SchoolCodeForm from "@/components/forms/form/SchoolCodeForm";
import SchoolForm from "@/components/forms/form/SchoolForm";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "promocode";
  const { campusData, loginData, examData } = useUserStore();
  const clearCampusData = useUserStore((state) => state.clearCampusData);
  const clearExamData = useUserStore((state) => state.clearExamData);
  const logout = useUserStore((state) => state.logout);
  const clearLanguageData = useUserStore((state) => state.clearLanguageData);

  // Clear all stores when action is promocode
  React.useEffect(() => {
    if (action === "promocode") {
      clearCampusData();
      clearExamData();
      logout();
      clearLanguageData();
    }
  }, [action, clearCampusData, clearExamData, logout, clearLanguageData]);

  const renderForm = () => {
    switch (action) {
      case "phone":
        return <PhoneForm />;

      case "otp":
        return <OtpForm />;

      case "name":
        return <NameForm />;

      case "class":
        return <ClassForm />;

      case "division":
        return <DivisionForm />;

      case "promocode":
        return <PromoCodeForm />;
      
      case "schoolcode":
        return <SchoolCodeForm />;
      
      case "school":
        return <SchoolForm />;

      default:
        return <p>Invalid action</p>;
    }
  };

  console.log(campusData?.logo, "campusData?.logo====")

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {action !== 'promocode' && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-[70px] h-[70px]">
              <Image 
                src={campusData?.logo || "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/20-11-2023/logo.svg"} 
                alt="School logo" 
                width={70} 
                height={70} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="font-semibold text-lg text-[#364152] text-center sm:text-left">{campusData?.name}</h1>
              {campusData?.campus_place && (
                <p className="text-[#475467] text-sm">{campusData.campus_place}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {renderForm()}
    </div>
  );
};

export default LoginForm;
