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

const PromoCodeForm = () => {
  const [promocode, setPromocode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isZohoLoaded, setIsZohoLoaded] = useState<boolean>(false);

  const router = useRouter();
  const setCampusData = useUserStore((state) => state.setCampusData);
  const setLoginData = useUserStore((state) => state.setLoginData);

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
      const response = await learnConfig.post("/learn/verify-promo-code/", {
        promo_code: promoCode,
      });

      console.log(response.data);

      const { status_code, data } = response.data;
      if (status_code === 6000) {
        const codeType = data?.code_type;
        const promo_code = data?.code;
        if (codeType === "school_code") {
          const campus_data = data?.campus_data;
          const campus_pk = data?.campus;
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
          setLoginData({
            promoCode: promo_code,
          });
          router.push("/login?action=phone");
        } else if (codeType === "promo_code") {
          setCampusData({
            program_slug: data?.program_slug,
          });
          setLoginData({
            promoCode: promo_code,
          });
          router.push("/login?action=school");
        }

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
    console.log("Submitted Data:", promocode);

    if (!promocode) {
      setError("Please enter a promo code");
      return;
    }

    if (promocode.length !== 6) {
      setError("Please enter a 6-character promo code");
      return;
    }

    validatePromocode(promocode);
  };

  const handlePromoChange = (otp: string | null) => {
    console.log("OTP entered:", otp);
    setPromocode(otp || "");
    if (error) setError("");
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
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        <div className="space-y-2">
          <h2 className="font-extrabold text-[22px] leading-7 sm:text-3xl sm:leading-9 text-center px-4">
            Enter the promo code
          </h2>
          <p className="text-center text-sm sm:text-base text-[#475467]">
            Enter your promo code to register the examination.
          </p>
        </div>
        <div className="!pt-0 !pb-4">
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
        </div>
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
      <div className="text-center text-sm sm:text-base mt-4 px-4 sm:px-0">
        <p className="text-[#475467]">
          Don't have a code?
          <span
            onClick={openChat}
            className={`ml-1 font-medium ${
              isZohoLoaded 
                ? "text-[#047853] hover:text-[#036B4A] cursor-pointer" 
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Contact us
          </span>
        </p>
      </div>
    </>
  );
};

export default PromoCodeForm; 