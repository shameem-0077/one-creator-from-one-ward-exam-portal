"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Modal from "../../modals/Modal";
import Eye from "../../../../public/assets/icons/eye.svg";
import closeEye from "../../../../public/assets/icons/eye-off.svg";
import Image from "next/image";
import OtpInput from "./OtpInput";

type InputType =
  | "text"
  | "password"
  | "search"
  | "country"
  | "date"
  | "multi-select"
  | "file-upload"
  | "copy-link"
  | "otp";

interface Country {
  pk: number;
  name: string;
  country_code?: string;
  web_code?: string;
  flag?: string;
  phone_code?: string;
  phone_number_length?: number;
}

const defaultCountry: Country = {
  pk: 1,
  name: "India",
  web_code: "IN",
  country_code: "IND",
  flag: "https://ddl0zi5h2jlue.cloudfront.net/media/countries/flags/India.png",
  phone_code: "+91",
  phone_number_length: 10,
};

interface InputProps {
  type: InputType;
  otpType?: "otp" | "promocode";
  placeholder?: string;
  value: string | Date | string[] | File | null;
  onChange: (value: string | null) => void;
  onCountryChange?: (value: string | null) => void;
  className?: string;
  options?: string[];
  otpLength?: number;
  onSearch?: (query: string) => void;
  name?: string;
  required?: boolean;
  errorMessage?: string;
  inputMode?: "numeric" | "text";
}

const Input: React.FC<InputProps> = ({
  type,
  otpType,
  placeholder,
  value,
  onChange,
  onCountryChange,
  className,
  otpLength = 6,
  name,
  required,
  inputMode,
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    defaultCountry
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://accounts.steyp.com/api/v1/users/settings/countries/"
        );
        const data = await response.json();
        if (data.StatusCode === 6000) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    if (type === "country") {
      fetchCountries();
    }
  }, [type]);

  useEffect(() => {
    if (type === "otp") {
      const firstInput = document.getElementById("otp-input-0");
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(e.target.value);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (onCountryChange) {
      onCountryChange(`${country.web_code}`);
      
      // Clear phone number input when country changes
      if (type === "country") {
        onChange("");
      }
    } else {
      onChange(`${country.phone_code}`);
    }
    closeModal();
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNumber = e.target.value;

    if (selectedCountry) {
      const phoneLength = selectedCountry.phone_number_length || 10;
      phoneNumber = phoneNumber.slice(0, phoneLength);

      onChange(`${phoneNumber}`);
      if (onCountryChange) {
        onCountryChange(`${selectedCountry.web_code}`);
      }
    } else {
      onChange(phoneNumber);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderInput = () => {
    switch (type) {
      case "password":
        return (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={value as string}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              name={name}
              required={required}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <Image src={closeEye} alt="close eye" width={20} height={20} />
              ) : (
                <Image src={Eye} alt="eye" width={20} height={20} />
              )}
            </button>
          </div>
        );

      case "country":
        return (
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openModal}
                className="flex items-center px-4 py-2 border rounded-lg"
              >
                {selectedCountry ? (
                  <>
                    <div className="flex gap-1 justify-center items-center">
                      <div className="rounded-full overflow-hidden w-5 h-5">
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="mr-2 text-[#121926] font-bold">
                        {selectedCountry.phone_code}
                      </span>
                    </div>
                  </>
                ) : (
                  <span>Select Country</span>
                )}
              </button>

              <div className="w-full border-[1px] border-[#E3E8EF] rounded-md focus-within:ring-2 focus-within:ring-[#047853]">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={placeholder}
                  value={
                    value
                      ?.toString()
                      .replace(`${selectedCountry?.phone_code} `, "") || ""
                  }
                  onChange={handlePhoneNumberChange}
                  className={`w-full p-2 rounded-lg focus:outline-none hide-number-spinners ${className}`}
                  name={name}
                  required={required}
                />
              </div>
            </div>

            {/* Country Selector Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  Select your Country
                </h2>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#047853] focus:outline-none"
                  />
                  {/* <img
                    src={icons.search}
                    alt="Search"
                    className="absolute left-3 top-3 w-5 h-5"
                  /> */}
                </div>
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {countries
                    .filter((country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (a.pk === selectedCountry?.pk) return -1;
                      if (b.pk === selectedCountry?.pk) return 1;
                      return 0;
                    })
                    .map((country) => (
                      <div
                        key={country.pk}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          className="mr-2 w-10"
                        />

                        <span>{country.name}</span>
                        {country.pk === selectedCountry?.pk && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500 ml-2 border-[1px] border-[green] rounded-full"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}

                        <span className="ml-auto">{country.phone_code}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Modal>
          </div>
        );

      case "otp":
        return (
          <OtpInput
            length={otpLength}
            onChange={onChange}
            className={className}
            name={name}
            type={otpType}
            inputMode={inputMode}
            value={value as string}
          />
        );

      default:
        return (
          <input
            type="text"
            placeholder={placeholder}
            value={value as string}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            name={name}
            required={required}
          />
        );
    }
  };

  return (
    <div className="relative">
      {renderInput()}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
