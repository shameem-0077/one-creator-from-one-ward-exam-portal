"use client";

import React, { useState } from "react";
import Button from "../../general/Button";
import Input from "../input/Input";
import Form from "./Form";
import { useRouter, useSearchParams } from "next/navigation";
import { error } from "console";
import { scholarshipConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import { PrimarySelect } from "../input/PrimarySelect";

const ClassForm = () => {
  const [selectedClass, setSelectedClass] = useState<any>({
    class: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { campusData, loginData, examData } = useUserStore();

  const handleClassSubmit = async () => {
    if (selectedClass) {
      try {
        const response = await scholarshipConfig.post("api/v1/accounts/update-user-info/", {
          student_class: selectedClass?.class
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
            router.push("/login?action=division");
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
    } else {
      setError("Please select your class");
    }
  };

  const options = [
    {
      class: 5
    },
    {
      class: 6
    },
    {
      class: 7
    },
    {
      class: 8
    },
    {
      class: 9
    },
    {
      class: 10
    },
    {
      class: 11
    },
    {
      class: 12
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="mb-6">
          <h2 className="font-extrabold text-3xl text-center mb-2">
          Which class are you in?

          </h2>
          <p className="text-center text-[#475467] font-semibold">
          Select your current class
          </p>
        </div>
        <PrimarySelect
          dropDownValues={options}
          required={false}
          error={false}
          placeholder="Select your class"
          name="class_selection"
          className="!pt-0 !pb-4"
          value={selectedClass}
          onChange={({name,value}: any) => {
            setSelectedClass(value)
          }}
          errorMessage={error}
          inputRef={null}
          disabled={false}
          valueAccessor="class"
          labelAccessor="class"
          isSearchable={false}
          isLoading={loading}
          isAdd={false}
          handleAdd={(value: any) => {
            console.log("value", value);
          }}
        />
        <Button
          icon="default"
          buttonType="primary"
          type="button"
          size="lg"
          state="default"
          text="Next"
          onClick={handleClassSubmit}
          className="w-full rounded-full mt-2"
          loading={loading}
        />
      </div>
    </>
  );
};

export default ClassForm;
