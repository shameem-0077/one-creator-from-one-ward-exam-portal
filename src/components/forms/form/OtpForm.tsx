"use client";
import React, { useState, useEffect, useCallback } from "react";
import Form from "./Form";
import OtpInput from "../input/OtpInput";
import Button from "../../general/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../input/Input";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
// import { cookies } from "next/headers";
import Cookies from "js-cookie"; // ✅ Import js-cookie
import toast from "react-hot-toast";

// Define interface for WebOTP API
interface OTPCredential extends Credential {
  code: string;
}

const OtpForm = () => {
  const RESEND_OTP_TIME = 30;
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { campusData, loginData, examData } = useUserStore();
  const setLoginData = useUserStore((state) => state.setLoginData);
  const setExamData = useUserStore((state) => state.setExamData);
  const [isResendVisible, setIsResendVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    // Start listening for OTP via WebOTP API
    if (typeof window !== "undefined" && 'OTPCredential' in window) {
      const abortController = new AbortController();

      // Cast credential as any to access the WebOTP API
      // This is because TypeScript doesn't have built-in types for the WebOTP API yet
      (navigator.credentials.get({
        // @ts-ignore - OTP credential type is not in standard TS types
        otp: { transport: ['sms'] },
        signal: abortController.signal
      }) as Promise<OTPCredential | null>)
        .then(credential => {
          if (credential && credential.code) {
            // Set OTP and immediately submit if it's a valid 6-digit code
            const code = credential.code;
            setOtp(code);
            // setTimeout(() => handleOtpSubmit(code), 100);
            // if (code.length === 6 && /^\d+$/.test(code)) {
            //   // Short delay to ensure state is updated
            // }
          }
        })
        .catch(err => {
          // Abort controller error can be ignored (it's expected when component unmounts)
          if (err.name !== 'AbortError') {
            console.error('WebOTP Error:', err);
          }
        });

      return () => {
        // Clean up by aborting the OTP listener when the component unmounts
        abortController.abort();
      };
    }
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (typeof window !== "undefined") {
        const otpExpireTime = localStorage.getItem("otpExpireTime");
        if (!otpExpireTime) return 0;
        
        const expireTimeMs = parseInt(otpExpireTime, 10);
        const currentTimeMs = new Date().getTime();
        const timeRemainingSeconds = Math.max(0, Math.floor((expireTimeMs - currentTimeMs) / 1000));
        
        return timeRemainingSeconds;

      } else {
        return 0;
      }
      
    };
    
    // Always set a new timer when the component mounts
    // This ensures the timer is running from the beginning
    if (typeof window !== "undefined" && loginData?.phoneNumber) {
      const expireTimeMs = new Date().getTime() + (RESEND_OTP_TIME * 1000);
      localStorage.setItem("otpExpireTime", expireTimeMs.toString());
      setTimer(RESEND_OTP_TIME);
      setIsResendVisible(false);
    }
    
    // Set up the interval to update the timer
    const interval = setInterval(() => {
      const remainingTime = calculateTimeRemaining();
      setTimer(remainingTime);
      
      if (remainingTime === 0) {
        setIsResendVisible(true);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [loginData?.phoneNumber]);

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);
    if (otp.length === 6) {
      try {
        const response = await scholarshipConfig.post(
          "api/v1/accounts/verify-phone/",
          {
            country: loginData?.webCode,
            phone: loginData?.phoneNumber,
            otp: otp,
          }
        );

        console.log(response.data);

        const { status_code, data, message } = response.data;
        if (status_code === 6000) {
          setExamData({
            admissionCode: data?.admission_code,
          });

          setLoginData({
            accessToken: data?.login_response?.access,
            refreshToken: data?.login_response?.refresh,
          });
          Cookies.set("access_token", data?.login_response?.access);
          if (data?.is_completed) {
            router.push("/entrance");
          } else {
            router.push("/login?action=name");
          }
        } else {
          setError(message?.message);
        }
      } catch (error) {
        console.error("Error verifying promo code:", error);
        setError("Something went wrong, please try again.");
      } finally {
        setLoading(false);
      }
      // router.push("/login?action=class");
    }
  };

  // Function to read from clipboard - can be called from multiple places
  const readFromClipboard = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    
    try {
      const clipboardText = await navigator.clipboard.readText();
      // Extract digits only
      const digits = clipboardText.replace(/\D/g, '');
      
      // If we have exactly 6 digits, use them as OTP
      setOtp(digits);
      // setTimeout(() => handleOtpSubmit(digits), 100);
      // if (digits.length === 6 && /^\d{6}$/.test(digits)) {
      //   // Optionally auto-submit
      // }
    } catch (err) {
      // Ignore errors - clipboard API may not be available
      console.log('Could not access clipboard');
    }
  }, [setOtp]);

  // Try to read from clipboard on component mount
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     // Try after a short delay to ensure component is fully mounted
  //     const timer = setTimeout(() => {
  //       readFromClipboard();
  //     }, 500);
      
  //     return () => clearTimeout(timer);
  //   }
  // }, [readFromClipboard]);

  const handleResendOtpSubmit = async () => {
    // Set expiration time (current time + RESEND_OTP_TIME seconds)
    const expireTimeMs = new Date().getTime() + (RESEND_OTP_TIME * 1000);
    localStorage.setItem("otpExpireTime", expireTimeMs.toString());
    
    setTimer(RESEND_OTP_TIME);
    setIsResendVisible(false);
    setLoading(true);
    try {
      const response = await scholarshipConfig.post("api/v1/accounts/resend-otp/", {
        country: loginData?.webCode,
        phone: loginData?.phoneNumber,
      });

      console.log(response.data);

      const { status_code, data, message } = response.data;
      if (status_code === 6000) {
        toast.success(message?.message);
      } else {
        toast.error(message?.message);
        // setError("Something went wrong");
      }
    } catch (error) {
      toast.error(String(error));
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoSubmit = (data: Record<string, any>) => {
    console.log("Submitted Data:", data);
    
    // Use the otp state directly instead of trying to get it from form data
    if (otp.length === 6) {
      console.log("entered api");
      handleOtpSubmit(otp);
    } else {
      setError("OTP code should be 6 characters long.");
    }
  };

  const handleOtpChange = (otp: string | null) => {
    if (otp) {
      setOtp(otp);
      console.log("OTP entered:", otp);
    }
  };

  // Handle direct paste for mobile
  const handleDirectPaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      // Extract digits only
      const digits = clipboardText.replace(/\D/g, '');
      
      // If we have exactly 6 digits, use them as OTP
      if (digits.length === 6) {
        setOtp(digits);
        // Optionally auto-submit
        // handleOtpSubmit(digits);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <>
      <Form
        onSubmit={handlePromoSubmit}
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        {/* Updated hidden input for WebOTP API */}
        <input
          type="text"
          name="otp"
          id="otp-input"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          onFocus={() => {
            // Try to read from clipboard when the hidden input is focused
            // This can happen via autofill UI on mobile
            readFromClipboard();
          }}
          onChange={(e) => {
            const otpValue = e.target.value;
            setOtp(otpValue);
            // setTimeout(() => handleOtpSubmit(otpValue), 100);
            // if (e.target.value.length === 6) {
            //   // Auto-submit when filled from suggestion
            //   if (/^\d{6}$/.test(otpValue)) {
            //   }
            // }
          }}
          style={{ 
            position: 'absolute', 
            opacity: 0,
            pointerEvents: 'none',
            height: 1,
            width: 1,
            zIndex: -1
          }}
        />
        
        <div className="space-y-2">
          <h2 className="font-extrabold text-2xl sm:text-3xl text-center">
            Enter the OTP we sent
          </h2>
          <div className="text-center text-sm sm:text-base text-[#475467]">
            <p>To your cell phone number {loginData?.phoneNumber}</p>
            <button
              onClick={() => router.back()}
              className="text-[#047853] font-medium hover:text-[#036B4A] mt-1"
            >
              Entered the wrong number? Edit number
            </button>
          </div>
        </div>

        {/* Mobile-friendly single OTP input field */}
        {/* <div className=" mb-2">
          <input 
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl"
            value={otp}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, '');
              setOtp(value);
            }}
          />
        </div> */}

        {/* Hide the individual OTP inputs on mobile */}
        <div className="">
          <Input
            otpLength={6}
            onChange={(value) => setOtp(value as string)}
            className="border-gray-300"
            name="otp"
            type="otp"
            otpType="otp"
            inputMode="numeric"
            value={otp}
            errorMessage={error}
          />
        </div>
        <Button
          icon="default"
          buttonType="primary"
          type="submit"
          size="lg"
          state="default"
          text="Next"
          className="w-full rounded-full mt-2"
          loading={loading}
        />
      </Form>
      <div className="text-center text-sm sm:text-base mt-4 px-4 sm:px-0">
        {isResendVisible ? (
          <div className="flex items-center justify-center gap-1">
            <span className="text-[#475467]">Didn&apos;t receive the code?</span>
            <Button
              icon="default"
              buttonType="link-color"
              type="button"
              text="Resend OTP"
              onClick={handleResendOtpSubmit}
              className="!p-0 !h-auto font-medium"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <span className="text-[#475467]">You can request a new code in</span>
            <span className="text-[#047853] font-semibold">
              {timer} seconds
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default OtpForm;
