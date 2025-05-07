"use client";

import React, { useState, useEffect } from "react";
import Button from "../../general/Button";
import Input from "../input/Input";
import Form from "./Form";
import { useRouter, useSearchParams } from "next/navigation";
import { error } from "console";
import { scholarshipConfig, accountsConfig } from "@/config/axiosConfig";
import useUserStore from "@/store/store";
import { PrimarySelect } from "../input/PrimarySelect";
import { toast } from "react-hot-toast";

interface School {
  id: number;
  name: string;
  pk: number | null;
}

const SchoolForm = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>({
    name: "",
    pk: null,
    id: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const router = useRouter();
  const { campusData, loginData, examData, setCampusData } = useUserStore();

  // Fetch schools list with search
  const fetchSchools = async (searchQuery = "") => {
    setIsLoadingSchools(true);
    try {
      const response = await accountsConfig.get("/api/v1/campuses/list-schools/", {
        params: {
          q: searchQuery
        }
      });
      const { status_code, data } = response.data;
      
      if (status_code === 6000) {
        setSchools(data);
      } else {
        setSchools([]);
        console.error("Failed to fetch schools");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSchoolSubmit = async () => {
    if (!selectedSchool?.name) {
      setError("Please select a school");
      toast.error("Please select a school");
      return;
    }

    setLoading(true);
    try {
      setCampusData({
        pk: selectedSchool.id,
        name: selectedSchool.name
      });
      router.push("/login?action=phone");
    } catch (error) {
      setError("Something went wrong, please try again.");
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div
        className="flex flex-col gap-6 w-full max-w-[360px] px-4 sm:px-0"
      >
        <div className="space-y-2">
          <h2 className="font-extrabold text-2xl sm:text-3xl text-center">
          Select your school
          </h2>
          <p className="text-center text-sm sm:text-base text-[#475467]">
          Choose your school from the list or add a new one
          </p>
        </div>
        <PrimarySelect
          dropDownValues={schools}
          required={false}
          error={!!error}
          errorMessage={error}
          placeholder="Select your school"
          name="school_selection"
          className="!p-0"
          value={selectedSchool}
          onChange={({name, value}: any) => {
            setSelectedSchool(value);
            setError("");
          }}
          inputRef={null}
          disabled={false}
          valueAccessor="name"
          labelAccessor="name"
          isSearchable={true}
          isLoading={isLoadingSchools}
          isAdd={true}
          handleAdd={(value: string) => {
            setSelectedSchool({
              name: value,
              pk: null,
              id: 0
            });
          }}
          onSearch={(searchValue: string) => fetchSchools(searchValue)}
        />
        <Button
          icon="default"
          buttonType="primary"
          type="button"
          size="lg"
          state="default"
          text="Next"
          onClick={handleSchoolSubmit}
          className="w-full"
          loading={loading}
        />
      </div>
    </>
  );
};

export default SchoolForm; 