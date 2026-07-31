// components/footer/SocialIcons.tsx
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { SOCIAL_URL } from "./constants";
import { SocialVariant } from "./types";

const SOCIAL_ICONS_CONFIG = [
  {
    key: "facebook",
    Icon: FaFacebook,
    defaultClass: "text-info",
    barClass: "text-info dark:text-background",
  },
  {
    key: "telegram",
    Icon: FaTelegram,
    defaultClass: "text-info",
    barClass: "text-info dark:text-background",
  },
  {
    key: "whatsapp",
    Icon: FaWhatsapp,
    defaultClass: "text-success",
    barClass: "text-success dark:text-background",
  },
  {
    key: "instagram",
    Icon: FaInstagram,
    defaultClass: "text-primary",
    barClass: "text-primary dark:text-background",
  },
] as const;

type Props = {
  size: number;
  variant?: SocialVariant;
};

export function SocialIcons({ size, variant = "default" }: Props) {
  return (
    <>
      {SOCIAL_ICONS_CONFIG.map(({ key, Icon, defaultClass, barClass }) => (
        <Link
          key={key}
          href={SOCIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            size={size}
            className={`${variant === "bar" ? barClass : defaultClass} p-1 rounded-sm`}
          />
        </Link>
      ))}
    </>
  );
}
