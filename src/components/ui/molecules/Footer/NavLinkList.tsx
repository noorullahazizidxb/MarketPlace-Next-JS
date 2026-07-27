import Link from "next/link";
import { NavLink } from "./types";

type Props = {
  links: readonly NavLink[];
};

export function NavLinkList({ links }: Props) {
  return (
    <ul className="space-y-2 md:dark:bg-transparent p-2 sm:block sm:space-y-1 transition md:gap-[12px]">
      {links.map(({ label, href }) => (
        <li key={href}>
          <Link
            href={href}
            className="text-foreground hover:text-primary transition-colors"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
