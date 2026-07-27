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
    defaultClass: "text-blue-500",
    barClass: "text-blue-400 dark:text-background",
  },
  {
    key: "telegram",
    Icon: FaTelegram,
    defaultClass: "text-sky-500",
    barClass: "text-sky-400 dark:text-background",
  },
  {
    key: "whatsapp",
    Icon: FaWhatsapp,
    defaultClass: "text-green-600",
    barClass: "text-green-400 dark:text-background",
  },
  {
    key: "instagram",
    Icon: FaInstagram,
    defaultClass: "text-pink-600",
    barClass: "text-pink-400 dark:text-background",
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
