import React, { useState, useEffect, useRef } from "react";

interface OtpInputProps {
  length: number;
  onChange: (otp: string) => void;
  className?: string;
  name?: string;
  type?: "otp" | "promocode";
  inputMode?: "numeric" | "text";
  value?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  onChange,
  className,
  type,
  inputMode,
  value = "",
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const previousValueRef = useRef<string>("");

  // Handle external value changes (like from autofill)
  useEffect(() => {
    // Only update when the value changes and is different from what we've already processed
    if (value && value !== previousValueRef.current && value.length <= length) {
      previousValueRef.current = value;
      
      // Split the string into an array of characters
      const otpArray = value.split("").slice(0, length);
      
      // Fill the rest with empty strings
      const newOtpArray = [...otpArray, ...Array(length - otpArray.length).fill("")];
      
      setOtp(newOtpArray);
      
      // If a complete OTP is filled, focus on the last input for better UX
      if (value.length === length && inputRefs.current[length - 1]) {
        inputRefs.current[length - 1].focus();
        // Optionally blur to hide the keyboard on mobile
        setTimeout(() => {
          inputRefs.current[length - 1]?.blur();
        }, 100);
      }
    }
  }, [value, length]);

  // Update when value changes externally (e.g. from auto-complete)
  useEffect(() => {
    // Add event listener for paste on container
    const containerElement = document.getElementById('otp-container');
    if (containerElement) {
      containerElement.addEventListener('paste', handleContainerPaste);
    }
    
    return () => {
      if (containerElement) {
        containerElement.removeEventListener('paste', handleContainerPaste);
      }
    };
  }, []);

  const handleChange = (index: number, value: string) => {
    if (type === "otp") {
      if (!/^\d*$/.test(value)) return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    const joinedOtp = newOtp.join("");
    previousValueRef.current = joinedOtp;
    onChange(joinedOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Enhanced container paste handler
  const handleContainerPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData?.getData("text").slice(0, length) || '';
    processPastedData(pasteData);
  };

  // Better paste handler for inputs that works across devices
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    processPastedData(pasteData);
  };

  // Common function to process pasted data
  const processPastedData = (pasteData: string) => {
    // For OTP, only accept digits
    if (type === "otp" && !/^\d+$/.test(pasteData)) return;
    
    const newOtp = [...otp];
    const chars = pasteData.split("");
    
    // Fill in the OTP fields
    chars.forEach((char, i) => {
      if (i < length) {
        newOtp[i] = char;
      }
    });
    
    // Update the state
    setOtp(newOtp);
    const otpValue = newOtp.join("");
    previousValueRef.current = otpValue;
    onChange(otpValue);
    
    // Focus on the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else if (chars.length < length) {
      inputRefs.current[chars.length]?.focus();
    } else {
      // If all filled, focus on the last field
      inputRefs.current[length - 1]?.focus();
    }
  };

  // Check when external value is updated through props
  useEffect(() => {
    if (value && value.length === length) {
      // If complete OTP received, trigger a full update
      processPastedData(value);
      
      // On mobile, blur the input to hide keyboard after complete OTP
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setTimeout(() => {
          inputRefs.current.forEach(input => input?.blur());
        }, 100);
      }
    }
  }, [value]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div id="otp-container" className="flex gap-2 w-full max-w-[500px] mx-auto">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="border border-[#697586] rounded-full p-[1.5px] flex-1"
        >
          <input
            type="text"
            inputMode={inputMode}
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            className={`w-full text-center border rounded-full p-3 
            focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold
            text-xl${className}`}
          />
        </div>
      ))}
    </div>
  );
};

export default OtpInput;
