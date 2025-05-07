"use client";

declare global {
  interface Window {
    zohoSalesIQ: any;
    $zoho: any;
  }
}

import React, { useEffect, useState } from "react";
import Button from "../../general/Button";
import Form from "./Form";
import { useRouter } from "next/navigation";
import Input from "../input/Input";
import { learnConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import { toast } from 'react-hot-toast';

const SchoolCodeForm = () => {
  const [promocode, setPromocode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isZohoLoaded, setIsZohoLoaded] = useState<boolean>(false);

  const router = useRouter();
  const setCampusData = useUserStore((state) => state.setCampusData);

  // Check if Zoho SalesIQ is available
  useEffect(() => {
    const checkZoho = setInterval(() => {
      if (typeof window !== "undefined" && window.zohoSalesIQ) {
        setIsZohoLoaded(true);
        clearInterval(checkZoho);
      }
    }, 500);

    return () => clearInterval(checkZoho);
  }, []);

  const validatePromocode = async (promoCode: string) => {
    console.log("Entered validation");

    setLoading(true);

    try {
      const response = await learnConfig.post("/learn/verify-school-code/", {
        promo_code: promoCode,
      });

      console.log(response.data);

      const { status_code, data } = response.data;
      if (status_code === 6000) {
        const campus_data = data?.campus_data;
        const campus_pk = data?.campus;
        const promo_code = data?.code;
        const campusNameStrip = campus_data?.name.split(",", 2);
        const name = campusNameStrip[0];
        const campusPlace = campusNameStrip[1];
        setCampusData({
          pk: campus_pk,
          name: campus_data?.name,
          logo: campus_data?.logo,
          bg_image: campus_data?.photo,
          campus_type: campus_data?.campus_type,
          program_slug: data?.program_slug,
          campus_place: campusPlace ?? "Campus",
        });

        router.push("/login?action=phone");
      } else {
        setError("Promo code not found");
      }
    } catch (error) {
      console.error("Error verifying promo code:", error);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoSubmit = (data: Record<string, any>) => {
    console.log("Submitted Data:", data.otp);

    const promocodeFromData = data?.otp || "";

    if (promocodeFromData.length === 6) {
      validatePromocode(promocodeFromData);
    } else {
      setError("Promo code should be 6 characters long.");
    }
  };

  const handlePromoChange = (otp: string | null) => {
    console.log("OTP entered:", otp);
    setPromocode(otp || "");
  };

  // Function to open Zoho SalesIQ chat
  const openChat = () => {
    if (window.$zoho && window.$zoho.salesiq) {
      (window as any).$zoho.salesiq.floatwindow.open();
      
    } else {
      toast.error('Chat is still loading. Please wait.');
    }
  };
  
  return (
    <>
      <Form
        onSubmit={handlePromoSubmit}
        className="flex flex-col gap-8 w-[360px]"
      >
        <div className="flex flex-col gap-3">
          <h2 className="font-extrabold text-3xl text-center">
            Enter the school code
          </h2>
          <p className="text-center text-[#475467] font-semibold">
            Enter your school's promo code to attend the examination.
          </p>
        </div>
        <Input
          otpLength={6}
          onChange={handlePromoChange}
          className="border-gray-300"
          name="otp"
          type="otp"
          inputMode="text"
          otpType="promocode"
          value={promocode}
          errorMessage={error}
        />
        <Button
          icon="default"
          buttonType="primary"
          type="submit"
          size="lg"
          state="default"
          text="Continue"
          className="w-full rounded-full"
          loading={loading}
        />
      </Form>
      <div>
        <p>
          Don't have a code?
          <span
            onClick={openChat}
            className={`ml-1 cursor-pointer ${
              isZohoLoaded ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Contact us
          </span>
        </p>
      </div>
    </>
  );
};

export default SchoolCodeForm; 