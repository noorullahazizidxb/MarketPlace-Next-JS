"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

// ─── Country data ─────────────────────────────────────────────────────────────
// ISO 3166-1 alpha-2 codes with English names. Covers all UN-recognized countries.
const COUNTRY_LIST: { iso2: string; name: string }[] = [
  { iso2: "AF", name: "Afghanistan" },
  { iso2: "AL", name: "Albania" },
  { iso2: "DZ", name: "Algeria" },
  { iso2: "AD", name: "Andorra" },
  { iso2: "AO", name: "Angola" },
  { iso2: "AG", name: "Antigua and Barbuda" },
  { iso2: "AR", name: "Argentina" },
  { iso2: "AM", name: "Armenia" },
  { iso2: "AU", name: "Australia" },
  { iso2: "AT", name: "Austria" },
  { iso2: "AZ", name: "Azerbaijan" },
  { iso2: "BS", name: "Bahamas" },
  { iso2: "BH", name: "Bahrain" },
  { iso2: "BD", name: "Bangladesh" },
  { iso2: "BB", name: "Barbados" },
  { iso2: "BY", name: "Belarus" },
  { iso2: "BE", name: "Belgium" },
  { iso2: "BZ", name: "Belize" },
  { iso2: "BJ", name: "Benin" },
  { iso2: "BT", name: "Bhutan" },
  { iso2: "BO", name: "Bolivia" },
  { iso2: "BA", name: "Bosnia and Herzegovina" },
  { iso2: "BW", name: "Botswana" },
  { iso2: "BR", name: "Brazil" },
  { iso2: "BN", name: "Brunei" },
  { iso2: "BG", name: "Bulgaria" },
  { iso2: "BF", name: "Burkina Faso" },
  { iso2: "BI", name: "Burundi" },
  { iso2: "CV", name: "Cabo Verde" },
  { iso2: "KH", name: "Cambodia" },
  { iso2: "CM", name: "Cameroon" },
  { iso2: "CA", name: "Canada" },
  { iso2: "CF", name: "Central African Republic" },
  { iso2: "TD", name: "Chad" },
  { iso2: "CL", name: "Chile" },
  { iso2: "CN", name: "China" },
  { iso2: "CO", name: "Colombia" },
  { iso2: "KM", name: "Comoros" },
  { iso2: "CG", name: "Congo" },
  { iso2: "CD", name: "Congo (DRC)" },
  { iso2: "CR", name: "Costa Rica" },
  { iso2: "HR", name: "Croatia" },
  { iso2: "CU", name: "Cuba" },
  { iso2: "CY", name: "Cyprus" },
  { iso2: "CZ", name: "Czech Republic" },
  { iso2: "DK", name: "Denmark" },
  { iso2: "DJ", name: "Djibouti" },
  { iso2: "DM", name: "Dominica" },
  { iso2: "DO", name: "Dominican Republic" },
  { iso2: "EC", name: "Ecuador" },
  { iso2: "EG", name: "Egypt" },
  { iso2: "SV", name: "El Salvador" },
  { iso2: "GQ", name: "Equatorial Guinea" },
  { iso2: "ER", name: "Eritrea" },
  { iso2: "EE", name: "Estonia" },
  { iso2: "SZ", name: "Eswatini" },
  { iso2: "ET", name: "Ethiopia" },
  { iso2: "FJ", name: "Fiji" },
  { iso2: "FI", name: "Finland" },
  { iso2: "FR", name: "France" },
  { iso2: "GA", name: "Gabon" },
  { iso2: "GM", name: "Gambia" },
  { iso2: "GE", name: "Georgia" },
  { iso2: "DE", name: "Germany" },
  { iso2: "GH", name: "Ghana" },
  { iso2: "GR", name: "Greece" },
  { iso2: "GD", name: "Grenada" },
  { iso2: "GT", name: "Guatemala" },
  { iso2: "GN", name: "Guinea" },
  { iso2: "GW", name: "Guinea-Bissau" },
  { iso2: "GY", name: "Guyana" },
  { iso2: "HT", name: "Haiti" },
  { iso2: "HN", name: "Honduras" },
  { iso2: "HU", name: "Hungary" },
  { iso2: "IS", name: "Iceland" },
  { iso2: "IN", name: "India" },
  { iso2: "ID", name: "Indonesia" },
  { iso2: "IR", name: "Iran" },
  { iso2: "IQ", name: "Iraq" },
  { iso2: "IE", name: "Ireland" },
  { iso2: "IL", name: "Israel" },
  { iso2: "IT", name: "Italy" },
  { iso2: "JM", name: "Jamaica" },
  { iso2: "JP", name: "Japan" },
  { iso2: "JO", name: "Jordan" },
  { iso2: "KZ", name: "Kazakhstan" },
  { iso2: "KE", name: "Kenya" },
  { iso2: "KI", name: "Kiribati" },
  { iso2: "KP", name: "Korea (North)" },
  { iso2: "KR", name: "Korea (South)" },
  { iso2: "KW", name: "Kuwait" },
  { iso2: "KG", name: "Kyrgyzstan" },
  { iso2: "LA", name: "Laos" },
  { iso2: "LV", name: "Latvia" },
  { iso2: "LB", name: "Lebanon" },
  { iso2: "LS", name: "Lesotho" },
  { iso2: "LR", name: "Liberia" },
  { iso2: "LY", name: "Libya" },
  { iso2: "LI", name: "Liechtenstein" },
  { iso2: "LT", name: "Lithuania" },
  { iso2: "LU", name: "Luxembourg" },
  { iso2: "MG", name: "Madagascar" },
  { iso2: "MW", name: "Malawi" },
  { iso2: "MY", name: "Malaysia" },
  { iso2: "MV", name: "Maldives" },
  { iso2: "ML", name: "Mali" },
  { iso2: "MT", name: "Malta" },
  { iso2: "MH", name: "Marshall Islands" },
  { iso2: "MR", name: "Mauritania" },
  { iso2: "MU", name: "Mauritius" },
  { iso2: "MX", name: "Mexico" },
  { iso2: "FM", name: "Micronesia" },
  { iso2: "MD", name: "Moldova" },
  { iso2: "MC", name: "Monaco" },
  { iso2: "MN", name: "Mongolia" },
  { iso2: "ME", name: "Montenegro" },
  { iso2: "MA", name: "Morocco" },
  { iso2: "MZ", name: "Mozambique" },
  { iso2: "MM", name: "Myanmar" },
  { iso2: "NA", name: "Namibia" },
  { iso2: "NR", name: "Nauru" },
  { iso2: "NP", name: "Nepal" },
  { iso2: "NL", name: "Netherlands" },
  { iso2: "NZ", name: "New Zealand" },
  { iso2: "NI", name: "Nicaragua" },
  { iso2: "NE", name: "Niger" },
  { iso2: "NG", name: "Nigeria" },
  { iso2: "MK", name: "North Macedonia" },
  { iso2: "NO", name: "Norway" },
  { iso2: "OM", name: "Oman" },
  { iso2: "PK", name: "Pakistan" },
  { iso2: "PW", name: "Palau" },
  { iso2: "PS", name: "Palestine" },
  { iso2: "PA", name: "Panama" },
  { iso2: "PG", name: "Papua New Guinea" },
  { iso2: "PY", name: "Paraguay" },
  { iso2: "PE", name: "Peru" },
  { iso2: "PH", name: "Philippines" },
  { iso2: "PL", name: "Poland" },
  { iso2: "PT", name: "Portugal" },
  { iso2: "QA", name: "Qatar" },
  { iso2: "RO", name: "Romania" },
  { iso2: "RU", name: "Russia" },
  { iso2: "RW", name: "Rwanda" },
  { iso2: "KN", name: "Saint Kitts and Nevis" },
  { iso2: "LC", name: "Saint Lucia" },
  { iso2: "VC", name: "Saint Vincent and the Grenadines" },
  { iso2: "WS", name: "Samoa" },
  { iso2: "SM", name: "San Marino" },
  { iso2: "ST", name: "Sao Tome and Principe" },
  { iso2: "SA", name: "Saudi Arabia" },
  { iso2: "SN", name: "Senegal" },
  { iso2: "RS", name: "Serbia" },
  { iso2: "SC", name: "Seychelles" },
  { iso2: "SL", name: "Sierra Leone" },
  { iso2: "SG", name: "Singapore" },
  { iso2: "SK", name: "Slovakia" },
  { iso2: "SI", name: "Slovenia" },
  { iso2: "SB", name: "Solomon Islands" },
  { iso2: "SO", name: "Somalia" },
  { iso2: "ZA", name: "South Africa" },
  { iso2: "SS", name: "South Sudan" },
  { iso2: "ES", name: "Spain" },
  { iso2: "LK", name: "Sri Lanka" },
  { iso2: "SD", name: "Sudan" },
  { iso2: "SR", name: "Suriname" },
  { iso2: "SE", name: "Sweden" },
  { iso2: "CH", name: "Switzerland" },
  { iso2: "SY", name: "Syria" },
  { iso2: "TW", name: "Taiwan" },
  { iso2: "TJ", name: "Tajikistan" },
  { iso2: "TZ", name: "Tanzania" },
  { iso2: "TH", name: "Thailand" },
  { iso2: "TL", name: "Timor-Leste" },
  { iso2: "TG", name: "Togo" },
  { iso2: "TO", name: "Tonga" },
  { iso2: "TT", name: "Trinidad and Tobago" },
  { iso2: "TN", name: "Tunisia" },
  { iso2: "TR", name: "Turkey" },
  { iso2: "TM", name: "Turkmenistan" },
  { iso2: "TV", name: "Tuvalu" },
  { iso2: "UG", name: "Uganda" },
  { iso2: "UA", name: "Ukraine" },
  { iso2: "AE", name: "United Arab Emirates" },
  { iso2: "GB", name: "United Kingdom" },
  { iso2: "US", name: "United States" },
  { iso2: "UY", name: "Uruguay" },
  { iso2: "UZ", name: "Uzbekistan" },
  { iso2: "VU", name: "Vanuatu" },
  { iso2: "VE", name: "Venezuela" },
  { iso2: "VN", name: "Vietnam" },
  { iso2: "YE", name: "Yemen" },
  { iso2: "ZM", name: "Zambia" },
  { iso2: "ZW", name: "Zimbabwe" },
];

// ─── CountryFlag (display only) ───────────────────────────────────────────────
// Shows a flag + ISO code badge for a given 2-letter country code.
export function CountryFlag({
  code,
  showCode = true,
  className,
}: {
  code: string;
  showCode?: boolean;
  className?: string;
}) {
  if (!code) return null;
  const upper = code.toUpperCase();
  const country = COUNTRY_LIST.find((c) => c.iso2 === upper);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <ReactCountryFlag
        countryCode={upper}
        svg
        className="rounded-[2px] shadow-sm shrink-0"
        style={{ width: "1.25em", height: "1.25em" }}
        aria-label={country?.name ?? upper}
        title={country?.name ?? upper}
      />
      {showCode && (
        <span className="admin-text-caption tabular-nums text-foreground/80">
          {upper}
        </span>
      )}
    </span>
  );
}

// ─── CountrySelectField ───────────────────────────────────────────────────────
// Searchable dropdown that returns an ISO 3166-1 alpha-2 country code string.
export function CountrySelectField({
  value,
  onChange,
  label = "Country",
  placeholder = "Select country…",
  className,
  error,
}: {
  value: string | null | undefined;
  onChange: (code: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string | boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [overlayStyle, setOverlayStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = value ? COUNTRY_LIST.find((c) => c.iso2 === value.toUpperCase()) : null;

  const filtered = search.trim()
    ? COUNTRY_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.iso2.toLowerCase().includes(search.toLowerCase()),
    )
    : COUNTRY_LIST;

  const handleOpen = () => {
    setOpen(true);
    setSearch("");
    // Focus search input after paint
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  const handleSelect = (country: { iso2: string; name: string } | null) => {
    onChange(country?.iso2 ?? null);
    handleClose();
  };

  // Close on outside blur
  useEffect(() => {
    if (!open) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      handleClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open || !rootRef.current) return;

    const updateOverlayPosition = () => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      setOverlayStyle({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    };

    updateOverlayPosition();
    window.addEventListener("resize", updateOverlayPosition);
    window.addEventListener("scroll", updateOverlayPosition, true);

    return () => {
      window.removeEventListener("resize", updateOverlayPosition);
      window.removeEventListener("scroll", updateOverlayPosition, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-1", className)} data-country-select="">
      {label && (
        <label className="admin-text-caption text-muted-foreground">{label}</label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={open ? handleClose : handleOpen}
        className={cn(
          "flex min-h-[var(--ctrl-h-sm)] w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-1 admin-text-body text-left",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "transition-colors hover:border-ring/50",
          error && "border-destructive/60",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected ? (
          <>
            <ReactCountryFlag
              countryCode={selected.iso2}
              svg
              className="rounded-[2px] shadow-sm shrink-0"
              style={{ width: "1.1em", height: "1.1em" }}
              aria-hidden
            />
            <span className="flex-1 truncate admin-text-body">{selected.name}</span>
            <span className="admin-text-caption text-muted-foreground tabular-nums">
              {selected.iso2}
            </span>
          </>
        ) : (
          <span className="flex-1 text-muted-foreground/60 admin-text-body">{placeholder}</span>
        )}

        <span className="flex items-center gap-0.5 ml-auto shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleSelect(null);
              }}
              aria-label="Clear country selection"
            >
              <X className="admin-icon-xs" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "admin-icon-xs text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {/* Error */}
      {typeof error === "string" && error && (
        <p className="admin-ui-admin-text-caption text-destructive">{error}</p>
      )}

      {/* Dropdown */}
      {open &&
        overlayStyle &&
        createPortal(
          <div
            ref={dropdownRef}
            className="z-[1200] flex flex-col rounded-md border border-border bg-popover shadow-xl"
            style={{
              position: "fixed",
              top: overlayStyle.top,
              left: overlayStyle.left,
              width: overlayStyle.width,
            }}
            role="listbox"
            aria-label="Select country"
          >
            <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
              <Search className="admin-icon-xs shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                className="flex-1 bg-transparent admin-text-body outline-none placeholder:text-muted-foreground/60"
                placeholder="Search country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="admin-icon-xs" />
                </button>
              )}
            </div>

            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-4 text-center admin-text-caption text-muted-foreground">
                  No countries match &ldquo;{search}&rdquo;
                </div>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country.iso2}
                    type="button"
                    role="option"
                    aria-selected={value === country.iso2}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 admin-text-body hover:bg-accent transition-colors text-left",
                      value === country.iso2 && "bg-accent/60",
                    )}
                    onClick={() => handleSelect(country)}
                  >
                    <ReactCountryFlag
                      countryCode={country.iso2}
                      svg
                      className="rounded-[2px] shadow-sm shrink-0"
                      style={{ width: "1.2em", height: "1.2em" }}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="admin-text-caption tabular-nums text-muted-foreground/70 w-7 text-right">
                      {country.iso2}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
