"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  name: string;
  value?: string | Date | File | null;
  onChange?: (value: string | Date | File | null) => void;
  required?: boolean;
  error?: string;
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
  onChange?: (value: string | Date | File | null) => void;
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    name: string,
    value: string | Date | File | null
  ) => {
    console.log(name);
    console.log(value);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<FormFieldProps>(child)) {
        const { name, required } = child.props;
        if (required && !formData[name]) {
          newErrors[name] = "This field is required";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<FormFieldProps>(child)) {
          return React.cloneElement(child, {
            value: formData[child.props.name] || "",
            onChange: (value: string | Date | File | null) =>
              handleInputChange(child.props.name, value),
            error: errors[child.props.name],
          });
        }
        return child;
      })}
    </form>
  );
};

export default Form;
