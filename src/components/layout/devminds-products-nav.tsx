const DEVMINDS_PRODUCTS = [
  { href: "https://devminds.net", label: "DevMinds — software studio" },
  { href: "https://jobs.devminds.net", label: "DevMinds Jobs — jobs platform and education hub" },
  { href: "https://notes.devminds.net", label: "DevMinds Notes — note taking app" },
  { href: "https://budget-manager.devminds.net", label: "DevMinds Budget App — budget manager" },
  { href: "https://ourworks.devminds.net", label: "DevMinds Works — our projects and work" },
  { href: "https://noorullah-azizi.devminds.net", label: "Noorullah Azizi — founder portfolio" },
] as const;

export function DevmindsProductsNav() {
  return (
    <nav aria-label="DevMinds products" className="border-t border-border/60 px-4 py-4">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {DEVMINDS_PRODUCTS.map((p) => (
          <li key={p.href}>
            <a href={p.href} className="hover:text-foreground">
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
