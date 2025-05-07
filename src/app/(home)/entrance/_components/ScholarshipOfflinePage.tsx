import React from "react";
import ClockTimer from "../_components/ClockTimer";

type ScholarshipOfflinePageProps = {
  isOffline: boolean;
  reloadWebPage: () => void;
  isExam?: boolean;
  setOffline: any;
};

const ScholarshipOfflinePage: React.FC<ScholarshipOfflinePageProps> = ({ isOffline, reloadWebPage, isExam, setOffline }) => {
  return (
    <div className={`fixed inset-0 z-[1001] transition-all ${isOffline ? "block" : "hidden"}`}>
      <div className="backdrop-blur-md w-full h-full"></div>
      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden transition-all w-[550px] h-[550px] p-[130px_0px_60px_0px] ${isOffline ? "scale-100" : "scale-0"} md:w-[440px] sm:w-[340px] sm:h-[450px] sm:p-[40px_0px_30px_0px] xs:w-[305px] xs:h-[400px]`}>
        <div className="relative mb-12">
          <div className="w-[15%] mx-auto">
            <img
              src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/26-01-2023/no-wifi.svg"
              alt="No Wifi"
              className="w-full"
            />
          </div>
          <div className="absolute top-[58%] left-[44.5%]">
            <ClockTimer />
          </div>
        </div>
        <div className="w-[75%] mx-auto text-center">
          <h3 className="text-gray-700 text-2xl font-medium mb-5">
            No network! {isExam !== false && "Timer is running!"}
          </h3>
          <p className="text-gray-500 text-lg mb-10">
            No Internet connection found. Check your connection and try again
          </p>
          <button
            onClick={reloadWebPage}
            className="text-white text-lg bg-gradient-to-r from-green-500 to-teal-500 rounded-md w-1/3 mx-auto py-4 cursor-pointer xs:w-[200px]"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipOfflinePage;