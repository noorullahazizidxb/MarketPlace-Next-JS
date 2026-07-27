export const SOCIAL_URL = "https://www.facebook.com/newlinktravel";

export const COPYRIGHT_BRAND = "Newlink Travel And Tours";

export const SUPPORT_PHONE = "+905346488480";
export const SUPPORT_PHONE_HREF = `tel:${SUPPORT_PHONE}`;
export const SUPPORT_WHATSAPP_DESKTOP = "https://wa.me/+905346488480";
export const SUPPORT_WHATSAPP_MOBILE =
  "whatsapp://send?phone=905346488480&text=Hello, I need help with my booking";

export const CONTACT_INFO = [
  { label: "Address", value: "House#24, Street#13, Wazir Akbar Khan Main Road, Beside of AIB Bank, Kabul, Afghanistan" },
  { label: "Phone", value: SUPPORT_PHONE },  { label: "Email", value: "support@newlinkaf.com" },
  {
    label: "Hours",
    value: "Saturday to Wednesday: 8 AM – 6 PM · Thursday: 8 AM – 4 PM",
  },
] as const;

export const QUICK_ACCESS_LINKS = [
  { label: "Organization List", href: "/organization/lists" },
  { label: "All Products", href: "/products" },
  { label: "Terms & Conditions", href: "/rules" },
  // { label: "Api Documentation", href: "/api-docs" },
] as const;

export const IMPORTANT_LINKS = [
  { label: "Track Orders", href: "en/contract-reports" },
  { label: "FAQ", href: "/faq" },
  { label: "Become an Agent", href: "/become-agent" },
  { label: "About Us", href: "en/about-us" },
] as const;
