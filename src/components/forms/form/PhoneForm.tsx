"use client";

import React, { useState, useEffect } from "react";
import Button from "../../general/Button";
import Input from "../input/Input";
import Form from "./Form";
import { useRouter, useSearchParams } from "next/navigation";
import { learnConfig, scholarshipConfig  } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import toast from "react-hot-toast";

const PhoneForm = () => {
  const { campusData, loginData, examData } = useUserStore();

  const [phoneNumber, setPhoneNumber] = useState<string>(loginData?.phoneNumber || "");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>(loginData?.webCode || "");
  
  const setLoginData = useUserStore((state) => state.setLoginData);

  const handlePhoneSubmit = async (data: Record<string, any>) => {
    setLoading(true)

    const phoneNumber = data?.phone || "";

    try {
      const response = await scholarshipConfig.post("api/v1/accounts/enter-phone/", {
        country: selectedCountry,
        phone: phoneNumber,
        school_name: campusData?.name,
        campus_pk: campusData?.pk,
        program: campusData?.program_slug,
        promo_code: loginData?.promoCode,
      });

      console.log(response.data);

      const { status_code, data, message } = response.data;
      if (status_code === 6000) {
        setLoginData({
          phoneNumber: phoneNumber,
          webCode: selectedCountry,
        })
        router.push("/login?action=otp");
      } else {
        toast.error(message?.message)
        setError("Something went wrong");
      }
    } catch (error) {
      console.error("Error verifying promo code:", error);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={handlePhoneSubmit}
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        <div className="space-y-2">
          <h2 className="font-extrabold text-2xl sm:text-3xl text-center">
            Enter your phone number
          </h2>
          <p className="text-center text-sm sm:text-base text-[#475467]">
            We will send you a code to confirm it.
          </p>
        </div>
        <Input
          type="country"
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value as string)}
          onCountryChange={(value) => {
            setSelectedCountry(value as string);
          }}
          placeholder="Phone number"
          name="phone"
          required 
        />
        <Button
          icon="default"
          buttonType="primary"
          type="submit"
          size="lg"
          state="default"
          text="Continue"
          className="w-full rounded-full mt-2"
          loading={loading}
        />
      </Form>
    </>
  );
};

export default PhoneForm;
