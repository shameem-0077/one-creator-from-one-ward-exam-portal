"use client";

import Image from "next/image";
import useUserStore from "@/store/store";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const { campusData } = useUserStore();
  const param = usePathname();

  // pathname condition
  if (param === "/entrance") {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left logo */}
          <div className="flex items-center">
            <Image
              src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/23-11-2021/steyp-logo.svg"
              alt="Steyp"
              width={100}
              height={30}
              className="h-8 w-auto"
            />
          </div>
          
          {/* Right logo */}
          <div>
            <Image
              src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/18-03-2025/Initiative.svg"
              alt="Talrop Initiative"
              width={100}
              height={30}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
