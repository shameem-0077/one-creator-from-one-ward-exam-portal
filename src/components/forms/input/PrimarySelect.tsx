import React, { useEffect, useRef, useState, RefObject } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const PrimarySelect = ({
  dropDownValues = [],
  required = true,
  label = "",
  error = false,
  className = "",
  placeholder = "",
  name = "",
  value = {},
  setData = () => {},
  onChange = () => {},
  errorMessage = "",
  fetchMoreData = () => {},
  onSearch = () => {},
  inputRef = null,
  disabled = false,
  valueAccessor = "id",
  labelAccessor = "name",
  renderOption,
  isSearchable,
  isLoading = false,
  isMoreLoading = false,
  isAdd = false,
  handleAdd = () => {},
  pagination = {},
}: {
  dropDownValues: any;
  required: any;
  label?: string;
  error: any;
  className?: string;
  placeholder: string;
  name: string;
  value: any;
  setData?: (data: any) => void;
  onChange?: any;
  errorMessage?: string;
  fetchMoreData?: any;
  onSearch?: any;
  inputRef?: any;
  disabled?: boolean;
  valueAccessor?: string;
  labelAccessor?: string;
  renderOption?: any;
  isSearchable?: boolean;
  isLoading?: boolean;
  isMoreLoading?: boolean;
  isAdd?: boolean;
  pagination?: any;
  handleAdd?: any;
}) => {
  const { has_next, current_page } = pagination;

  const [isDropDown, setDropDown] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const handleOptionClick = (option: any) => {
    console.log("option selected", option);
    if (onChange) {
      console.log("inside==onchange===");
      onChange({
        name: name,
        value: option,
      });
    }
    if (setData) {
      setData((prevData: any) => ({
        ...prevData,
        [name]: option,
      }));
    }
    setDropDown(false);
  };

  const handleClickOutside = (event: any) => {
    if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
      setDropDown(false);
    }
  };
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
  };

  // =================================== code for inifinite scrolling ===================================
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && has_next) {
          if (fetchMoreData) {
            fetchMoreData(current_page + 1);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [has_next, isMoreLoading, current_page, isDropDown]);

  const handleAddOption = (e: any) => {
    e.stopPropagation();
    if (searchValue) {
      if (handleAdd) {
        handleAdd(searchValue);
      }
      if (setData) {
        setData((prevData: any) => ({
          ...prevData,
          [name]: [
            ...prevData[name],
            {
              [labelAccessor]: searchValue,
            },
          ],
        }));
      }
      setSearchValue("");
      setDropDown(false);
    }
  };

  return (
    <>
      <div className={cn("pt-[26px] pb-[21px]", className)} ref={selectRef}>
        <div className="relative">
          <button
            className={cn(
              "flex items-center w-full relative rounded-[8px] border-[1px] border-solid px-[12px] py-[8px] transition-all h-[42px] focus:border-[#6EE7B3]",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
              isDropDown
                ? "border-[#6EE7B3]"
                : (error &&
                    required &&
                    !extractValueUsingString(value, valueAccessor)) ||
                  (error && errorMessage)
                ? "border-[#FDA29B] pr-[12px]"
                : "border-[#CDD5DF]"
            )}
            style={
              isDropDown
                ? {
                    boxShadow:
                      "0px 0px 0px 4px #E5F7F0, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  }
                : {}
            }
            onClick={() => {
              if (!disabled) setDropDown(!isDropDown);
            }}
            ref={inputRef}
          >
            {" "}
            <label
              className="font-medium	text-[#364152] text-[14px] absolute top-[-27px] left-0"
              htmlFor={label}
            >
              {formatUserName(label)}
              {required ? <span className="text-[#D92D20]">*</span> : ""}
            </label>
            <div
              className={cn(
                "w-[calc(100%-20px)] overflow-x-hidden whitespace-nowrap flex justify-start text-ellipsis text-[#697586] text-[12px]",
                extractValueUsingString(value, labelAccessor)
                  ? "text-[#121926] font-semibold text-[14px]"
                  : ""
              )}
            >
              {extractValueUsingString(value, labelAccessor)
                ? extractValueUsingString(value, labelAccessor)
                : placeholder
                ? placeholder
                : ""}
            </div>
            <span
              className={
                "flex items-center justify-center rounded-[50%] w-[15px] h-[15px] min-w-[15px] min-h-[15px] transition-all ml-auto"
              }
            >
              <Image
                width={100}
                height={100}
                src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/components/icons/general/chevron-down.svg"
                alt="icon"
                className={"w-full h-full transition-all "}
                style={{
                  transform: isDropDown ? "rotate(-180deg)" : "",
                }}
              />
            </span>
            {((error &&
              required &&
              !extractValueUsingString(value, valueAccessor)) ||
              (error && errorMessage)) && (
              <span className="flex items-center justify-center min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px] ml-[8px]">
                <Image
                  width={100}
                  height={100}
                  src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/26-07-2023/alert-circle.svg"
                  alt="Error"
                />
              </span>
            )}
            {error && errorMessage ? (
              <p className="text-[12px] text-[#F04438] absolute bottom-[-22px] left-0">
                {errorMessage}
              </p>
            ) : error &&
              required &&
              !extractValueUsingString(value, valueAccessor) ? (
              <p className="text-[12px] text-[#F04438] absolute bottom-[-22px] left-0">
                Select valid {label?.toLowerCase()}
              </p>
            ) : null}
          </button>
          {isDropDown && (
            <div className="z-10 absolute cursor-auto transition-all top-[45px] left-0 rounded-[8px] border-[#E3E8EF] border-[1px] border-solid shadow-md w-full bg-[#fff] pt-0 overflow-hidden">
              {isSearchable && (
                <div className="sticky top-0 bg-[#fff] z-10">
                  <div
                    style={{
                      zIndex: 1,
                    }}
                    className="bg-[#fff] py-[2px] border-[#CDD5DF] border-b-[1px] border-solid"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-center  px-[14px] py-[4px]">
                      <div className="cursor-pointer min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px] mr-[8px]">
                        <Image
                          width={100}
                          height={100}
                          src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/components/icons/general/search-lg.svg"
                          alt="icon"
                          className="w-full block"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="border-none outline-none flex-grow text-[16px] pt-[2px] text-[#364152]"
                        value={searchValue}
                        onChange={handleSearchInputChange}
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "overflow-y-scroll",
                  isSearchable ? "max-h-[calc(200px-36px)]" : "max-h-[200px]"
                )}
              >
                {isLoading ? (
                  <div className="text-[#999] p-2 h-[125px] flex justify-center items-center">
                    <span
                      className="w-[4px] h-[4px] rounded-full block"
                      style={{
                        color: "#059664",
                        boxShadow: `
                                                calc(1 * 12px) calc(0 * 12px) 0 0,
                                                calc(0.707 * 12px) calc(0.707 * 12px) 0 1px,
                                                calc(0 * 12px) calc(1 * 12px) 0 1.25px,
                                                calc(-0.707 * 12px) calc(0.707 * 12px) 0 1.5px,
                                                calc(-1 * 12px) calc(0 * 12px) 0 1.75px,
                                                calc(-0.707 * 12px) calc(-0.707 * 12px) 0 2px,
                                                calc(0 * 12px) calc(-1 * 12px) 0 2.75px `,
                        animation: "l27 1s infinite steps(8)",
                      }}
                    />
                  </div>
                ) : dropDownValues?.length > 0 ? (
                  <div key={dropDownValues?.length}>
                    <button
                      onClick={() => handleOptionClick(null)}
                      className={cn(
                        "flex mb-[4px] rounded-[6px] cursor-pointer w-full text-[16px] items-center py-[8px] px-[10px] text-[#121926] hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] overflow-x-hidden "
                      )}
                    >
                      {/* <span
                        className={
                          "w-[14px] h-[14px] min-w-[14px] min-h-[14px] border-[1px] border-solid border-[#CDD5DF] rounded-full mr-[8px]"
                        }
                      /> */}
                      {/* <span
                        className={
                          "text-[#121926] font-semibold text-[14px] overflow-hidden whitespace-nowrap text-ellipsis top-[50%] left-[50%]"
                        }
                      >
                        None of this
                      </span> */}
                    </button>
                    {dropDownValues?.map((option: any, index: number) => {
                      return (
                        <div
                          key={`${extractValueUsingString(option, valueAccessor)}_${index}`}
                          ref={
                            has_next &&
                            !isMoreLoading &&
                            !isLoading &&
                            index === dropDownValues?.length - 1
                              ? observerRef
                              : null
                          }
                        >
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <button
                              onClick={(event: any) => {
                                event?.stopPropagation();
                                if (!option?.is_disabled) {
                                  handleOptionClick(option);
                                }
                              }}
                              className={cn(
                                "flex mb-[4px] rounded-[6px] w-full text-[16px] items-center py-[8px] px-[10px] text-[#121926] hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] overflow-x-hidden ",
                                extractValueUsingString(value, valueAccessor) ===
                                  extractValueUsingString(option, valueAccessor)
                                  ? "bg-[#F8FAFC]"
                                  : "bg-[#fff]",
                                option?.is_disabled
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              )}
                            >
                              {option?.is_disabled ? (
                                <span
                                  className={
                                    "w-[16px] h-[16px] min-w-[16px] min-h-[16px] mr-[8px] cursor-not-allowed"
                                  }
                                >
                                  <Image
                                    width={100}
                                    height={100}
                                    src={
                                      "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/components/icons/general/lock-01.svg"
                                    }
                                    alt="Close"
                                    className={"w-full block"}
                                  />
                                </span>
                              ) : (
                                <span
                                  className={cn(
                                    "w-[14px] h-[14px] min-w-[14px] min-h-[14px] border-[1px] border-solid border-[#CDD5DF] rounded-full mr-[8px]",
                                    extractValueUsingString(
                                      value,
                                      valueAccessor
                                    ) ===
                                      extractValueUsingString(
                                        option,
                                        valueAccessor
                                      ) && "bg-[#079664] border-none p-[4.5px]"
                                  )}
                                >
                                  {extractValueUsingString(
                                    value,
                                    valueAccessor
                                  ) ===
                                    extractValueUsingString(
                                      option,
                                      valueAccessor
                                    ) && (
                                    <hr className="w-full h-full bg-[#fff] block rounded-[50%]" />
                                  )}
                                </span>
                              )}

                              <span
                                className={
                                  "text-[#121926] font-semibold text-[14px] break-words text-left flex-1"
                                }
                              >
                                {extractValueUsingString(
                                  option,
                                  labelAccessor
                                ) ?? "--"}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {isMoreLoading && (
                      <p className="text-center font-semibold text-[12px] text-[#059664] cursor-auto pb-[8px]">
                        Loading...
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {isAdd && searchValue && (
                      <button
                        className={cn(
                          "flex w-full text-[14px] items-center font-medium py-[8px] px-[10px] text-[#999] overflow-x-hidden hover:bg-[#F8FAFC] focus:bg-[#F8FAFC]"
                        )}
                        onClick={handleAddOption}
                      >
                        <span className="flex items-center font-semibold text-[#047853] mr-[4px]">
                          <Image
                            src={
                              "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/components/icons/green/plus.svg"
                            }
                            width={100}
                            height={100}
                            className="block !w-[16px] h-[16px]"
                            alt="Info"
                          />
                          Add
                        </span>{" "}
                        <span className="text-[#121926] font-semibold mr-[4px]">
                          {searchValue}
                        </span>
                        <span className="text-[#999] font-medium text-[12px]">
                          {label?.toLowerCase()}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function extractValueUsingString(obj: any, path: string) {
  const keys = path.split(".");
  let result = obj;
  for (let key of keys) {
    if (result && Object.hasOwnProperty.call(result, key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const formatUserName = (str: string) => {
  if (!str) return "";
  const words = str.split(" ");
  const firstWord =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const restWords = words.slice(1).join(" ").toLowerCase();

  return firstWord + " " + restWords;
};
