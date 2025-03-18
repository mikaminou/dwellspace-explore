
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (value: string) => void;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
}

export function NumberInput({
  value,
  onChange,
  formatOptions = {},
  locale = "en-US",
  ...props
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format the number for display
  useEffect(() => {
    if (value === "" || value === undefined) {
      setDisplayValue("");
      return;
    }

    try {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(numValue)) {
        setDisplayValue("");
        return;
      }

      const formatter = new Intl.NumberFormat(locale, formatOptions);
      setDisplayValue(formatter.format(numValue));
    } catch (error) {
      setDisplayValue(value.toString());
    }
  }, [value, formatOptions, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove all non-numeric characters except decimal points
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    
    // Handle the case of multiple decimal points
    const parts = numericValue.split(".");
    const sanitizedValue = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
    
    onChange(sanitizedValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onFocus) props.onFocus(e);
    // Switch to raw numeric value on focus
    if (value !== undefined && value !== "") {
      const rawValue = typeof value === "string" ? value : value.toString();
      setDisplayValue(rawValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onBlur) props.onBlur(e);
    // Reformat when input loses focus
    if (value !== undefined && value !== "") {
      try {
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        if (!isNaN(numValue)) {
          const formatter = new Intl.NumberFormat(locale, formatOptions);
          setDisplayValue(formatter.format(numValue));
        }
      } catch (error) {
        // Fallback to raw value if formatting fails
        setDisplayValue(value.toString());
      }
    }
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
