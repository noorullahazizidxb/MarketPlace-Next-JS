"use client";

import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  showDesktopTitle?: boolean;
  mobileTitleOffset?: boolean;
  contentClassName?: string;
};

export function AccordionSection({
  title,
  children,
  className = "",
  showDesktopTitle = true,
  mobileTitleOffset = false,
  contentClassName = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <h2
        className={`md:hidden sm:block flex items-center justify-between py-3 rounded-md px-2 admin-text-body admin-text-heading mb-4 cursor-pointer sm:mb-2 transition-all duration-500 ease-in-out ${
          mobileTitleOffset ? "-mt-5" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </h2>

      {showDesktopTitle && (
        <h2 className="hidden sm:block admin-text-body admin-text-heading mb-4 border-l-2 border-primary md:px-2 sm:mb-2">
          {title}
        </h2>
      )}

      <div
        className={`${isOpen ? "block" : "hidden"} sm:block ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
