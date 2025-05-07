"use client";

import React, { useState } from "react";
import Button from "../../general/Button";
import Input from "../input/Input";
import Form from "./Form";
import { useRouter, useSearchParams } from "next/navigation";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";

const DivisionForm = () => {
  const [division, setDivision] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const router = useRouter();

  const { campusData, loginData, examData } = useUserStore();

  const handleDivisionSubmit = async () => {
    if (division.trim()) {
      try {
        const response = await scholarshipConfig.post("api/v1/accounts/update-user-info/", {
          student_division: division
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
          router.push("/entrance");
          // if (data?.is_completed) {
          // } else {
          //   setError("Something went wrong");
          // }
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
        onSubmit={() => handleDivisionSubmit()}
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        <div className="space-y-2">
          <h2 className="font-extrabold text-[22px] leading-7 sm:text-3xl sm:leading-9 text-center px-4">
            Which division are you in?
          </h2>
          <p className="text-center text-sm sm:text-base text-[#475467]">
            Enter your class division
          </p>
        </div>
        <div className="!pt-0 !pb-4">
          <Input
            type="text"
            value={division}
            onChange={(value) => setDivision(value as string)}
            placeholder="Enter your division"
            name="Division"
            required
          />
        </div>
        <Button
          icon="default"
          buttonType="primary"
          type="submit"
          size="lg"
          state="default"
          text="Submit"
          className="w-full rounded-full mt-2"
          loading={loading}
        />
      </Form>
    </>
  );
};

export default DivisionForm;
