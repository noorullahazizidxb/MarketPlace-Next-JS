import Link from "next/link";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
  SUPPORT_WHATSAPP_DESKTOP,
  SUPPORT_WHATSAPP_MOBILE,
} from "./constants";

interface WhatsAppButtonProps {
  href: string;
  className?: string;
}

function WhatsAppButton({ href, className }: WhatsAppButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`items-center justify-center gap-2 rounded-md bg-primary-foreground px-2 py-1 text-primary md:rounded-[7px] md:px-3 md:py-2 ${className ?? ""}`}
    >
      <span className="whitespace-nowrap text-xs font-medium text-foreground md:text-base">
        Online Support
      </span>
      <FaWhatsapp
        className="size-4 shrink-0 text-green-600 md:size-7"
        aria-hidden
      />
    </Link>
  );
}

export function SupportBar() {
  return (
    <div className="container relative z-10 order-1 mb-3 flex min-h-[45px] w-full items-center rounded-md bg-primary px-3 md:max-w-[1240px] md:min-h-[97px] md:max-h-[97px] md:px-4">
      <div className="flex min-w-0 w-full flex-wrap items-center justify-between gap-2 md:gap-4">
        <div className="flex min-w-0 items-center text-start">
          <p className="whitespace-nowrap text-xs text-primary-foreground sm:text-sm md:hidden">
            Need assistance?
          </p>
          <p className="hidden whitespace-nowrap text-sm text-primary-foreground md:block md:text-base">
            Need help with your bookings?
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:gap-2.5">
          <WhatsAppButton
            href={SUPPORT_WHATSAPP_DESKTOP}
            className="hidden md:flex"
          />
          <WhatsAppButton
            href={SUPPORT_WHATSAPP_MOBILE}
            className="flex md:hidden"
          />

          <div className="flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-primary-foreground md:rounded-[7px]">
            <Link
              href={SUPPORT_PHONE_HREF}
              className="whitespace-nowrap text-xs text-primary-foreground md:text-sm"
            >
              {SUPPORT_PHONE}
            </Link>
            <Phone
              className="app-icon-sm shrink-0 text-primary-foreground"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
