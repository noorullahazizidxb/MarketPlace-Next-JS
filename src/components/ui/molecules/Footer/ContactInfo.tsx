import { CONTACT_INFO } from "./constants";

export function ContactInfo() {
  return (
    <ul className="space-y-[16px] text-md text-foreground">
      {CONTACT_INFO.map(({ label, value }, index) => (
        <li
          key={label}
          className={
            index < CONTACT_INFO.length - 1
              ? "border-l-2 border-primary pl-2"
              : "border-primary"
          }
        >
          {label}: {value}
        </li>
      ))}
    </ul>
  );
}
