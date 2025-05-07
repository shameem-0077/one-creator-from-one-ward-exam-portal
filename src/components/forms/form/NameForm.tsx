"use client";

import React, { useState } from "react";
import Button from "../../general/Button";
import Input from "../input/Input";
import Form from "./Form";
import { useRouter, useSearchParams } from "next/navigation";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";

const NameForm = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { campusData, loginData, examData } = useUserStore();

  const handleNameSubmit = async (data: Record<string, any>) => {
    setLoading(true)
      console.log("Submitted Data:", data);
  
      const name = data?.name || "";
  
      if (name.trim()) {
        try {
          const response = await scholarshipConfig.post("api/v1/accounts/update-user-info/", {
            name: name.trim()
          },
          {
            headers: {
              Authorization: "Bearer " + loginData?.accessToken,
            }
          }
        );
    
          console.log(response.data);
    
          const { status_code, data } = response.data;
          if (status_code === 6000) {
            if (data?.is_completed) {
              router.push("/entrance");
            } else {
              router.push("/login?action=class");
            }
          } else {
            setError("Something went wrong");
          }
        } catch (error) {
          console.error("Error verifying promo code:", error);
          setError("Something went wrong, please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

  return (
    <>
      <Form
        onSubmit={handleNameSubmit}
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        <div className="space-y-2">
          <h2 className="font-extrabold text-[22px] leading-7 sm:text-3xl sm:leading-9 text-center px-4">
            Hello! What should we call you?
          </h2>
          <p className="text-center text-sm sm:text-base text-[#475467]">
            Please enter your full name
          </p>
        </div>
        <Input
          type="text"
          value={name}
          onChange={(value) => setName(value as string)}
          placeholder="Enter your name"
          name="name"
          required
        />
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
    </>
  );
};

export default NameForm;
