"use client";

import { forwardRef } from "react";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { TextInputField } from "./TextInputField";
import { cn } from "../../lib/cn";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string, countryIso?: string) => void;
  onPhoneChange: (value: string) => void;
  /** ISO 3166-1 alpha-2 hint for shared dial codes (e.g. US vs CA for +1). */
  preferredCountryIso?: string | null;
  error?: string;
  label?: string;
  id?: string;
  onBlur?: () => void;
  className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      countryCode,
      phoneNumber,
      onCountryChange,
      onPhoneChange,
      preferredCountryIso,
      onBlur,
      error,
      label = "Mobile Number",
      id = "phone-input",
      className,
    },
    ref,
  ) => {
    return (
      <div className={cn("flex w-full flex-wrap items-stretch gap-3 sm:flex-nowrap sm:items-center", className)}>
        <div className="w-[8.5rem] shrink-0 sm:self-center">
          <CountryCodeSelector
            value={countryCode}
            onChange={onCountryChange}
            preferredCountryIso={preferredCountryIso}
          />
        </div>

        <div className="min-w-0 flex-1">
          <TextInputField
            ref={ref}
            onBlur={onBlur}
            id={id}
            type="tel"
            label={label}
            value={phoneNumber}
            onChange={onPhoneChange}
            error={error}
          />
        </div>
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
