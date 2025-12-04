import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string | null | undefined;
  placeholder?: string | null | undefined;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  name,
  type = "text",
  value,
  placeholder,
  maxLength,
  onChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium block mb-2">
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder ?? ""}
      />
    </div>
  );
};
