"use client";

import { useComponentVariants } from "@/hooks/use-component-variants";
import { Navbar } from "./navbar";
import { NavbarGlass, NavbarMinimal, NavbarFullwidth } from "./navbar-variants";

export function NavbarSelector({ className = "" }: { className?: string }) {
  const { variants } = useComponentVariants();

  switch (variants.navbar) {
    case "glass":
      return <NavbarGlass className={className} />;
    case "minimal":
      return <NavbarMinimal className={className} />;
    case "fullwidth":
      return <NavbarFullwidth className={className} />;
    default:
      return <Navbar className={className} />;
  }
}
