import { z } from "zod";
import type { FontFamilyOption, HeadingTextDecoration } from "@repo/types";

export type AppearanceTab = "appearance-settings" | "theme-customizer";

const fontFamilyEnumValues = [
  "inter",
  "roboto",
  "poppins",
  "open-sans",
  "montserrat",
  "lato",
  "manrope",
  "nunito",
  "space-grotesk",
  "source-sans",
  "vazirmatn",
  "cairo",
  "tajawal",
  "almarai",
  "amiri",
  "readex-pro",
  "ibm-plex-sans-arabic",
  "noto-kufi-arabic",
  "noto-naskh-arabic",
  "yekan",
  "system",
  "serif",
  "mono",
] as const satisfies readonly [FontFamilyOption, ...FontFamilyOption[]];

export const fontFamilyOptions: Array<{
  value: FontFamilyOption;
  label: string;
}> = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "open-sans", label: "Open Sans" },
  { value: "montserrat", label: "Montserrat" },
  { value: "lato", label: "Lato" },
  { value: "manrope", label: "Manrope" },
  { value: "nunito", label: "Nunito" },
  { value: "space-grotesk", label: "Space Grotesk" },
  { value: "source-sans", label: "Source Sans Pro" },
  { value: "vazirmatn", label: "Vazirmatn" },
  { value: "cairo", label: "Cairo" },
  { value: "tajawal", label: "Tajawal" },
  { value: "almarai", label: "Almarai" },
  { value: "amiri", label: "Amiri" },
  { value: "readex-pro", label: "Readex Pro" },
  { value: "ibm-plex-sans-arabic", label: "IBM Plex Sans Arabic" },
  { value: "noto-kufi-arabic", label: "Noto Kufi Arabic" },
  { value: "noto-naskh-arabic", label: "Noto Naskh Arabic" },
  { value: "yekan", label: "Yekan" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
  { value: "system", label: "System Default" },
];

export const headingDecorationOptions: Array<{
  value: HeadingTextDecoration;
  label: string;
}> = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" },
];

export const APPEARANCE_LABELS: Readonly<Record<string, string>> = {
  "settings:appearance.title": "Appearance Settings",
  "settings:appearance.description":
    "Control theme mode, typography, layout density, and dashboard presentation.",
  "settings:appearance.tabs.appearance": "Appearance",
  "settings:appearance.tabs.theme": "Theme Customizer",
  "settings:appearance.themeSection.title": "Theme Mode",
  "settings:appearance.themeSection.description":
    "Choose how the interface should respond to light and dark color schemes.",
  "settings:appearance.themeOptions.light": "Light",
  "settings:appearance.themeOptions.system": "System",
  "settings:appearance.themeOptions.dark": "Dark",
  "settings:appearance.languageFonts.title": "Language Fonts",
  "settings:appearance.languageFonts.description":
    "Assign a preferred font family to each supported language.",
  "settings:appearance.languageFonts.languages.en": "English",
  "settings:appearance.languageFonts.languages.fa": "Persian",
  "settings:appearance.languageFonts.languages.ar": "Arabic",
  "settings:appearance.languageFonts.languages.tr": "Turkish",
  "settings:appearance.languageFonts.descriptions.en":
    "Used for English labels, forms, and content.",
  "settings:appearance.languageFonts.descriptions.fa":
    "Used for Persian labels, forms, and content.",
  "settings:appearance.languageFonts.descriptions.ar":
    "Used for Arabic labels, forms, and content.",
  "settings:appearance.languageFonts.descriptions.tr":
    "Used for Turkish labels, forms, and content.",
  "settings:appearance.languageFonts.fontLabel": "Font family",
  "settings:appearance.fontSection.title": "Typography & Density",
  "settings:appearance.fontSection.description":
    "Tune the default font stack and fine-grained spacing tokens.",
  "settings:appearance.fontSection.defaultFont": "Default font family",
  "settings:appearance.sidebarWidth.label": "Sidebar width",
  "settings:appearance.sidebarWidth.options.compact": "Compact",
  "settings:appearance.sidebarWidth.options.comfortable": "Comfortable",
  "settings:appearance.sidebarWidth.options.spacious": "Spacious",
  "settings:appearance.contentWidth.label": "Content width",
  "settings:appearance.contentWidth.options.fixed": "Fixed",
  "settings:appearance.contentWidth.options.fluid": "Fluid",
  "settings:appearance.contentWidth.options.container": "Container",
  "settings:appearance.placeholders.languageFont": "Select a language font",
  "settings:appearance.placeholders.fontFamily": "Select a font family",
  "settings:appearance.placeholders.sidebarWidth": "Select sidebar width",
  "settings:appearance.placeholders.contentWidth": "Select content width",
  "settings:appearance.actions.saveChanges": "Save Changes",
  "settings:appearance.actions.resetDefaults": "Reset to Defaults",
  "settings:appearance.customizer.title": "Theme Customizer",
  "settings:appearance.customizer.description":
    "Open the advanced theme customizer to fine-tune colors, tokens, and layout.",
  "settings:appearance.customizer.open": "Open Customizer",
  "settings:appearance.customizer.note":
    "Changes apply live while you experiment. Save from this page when you are happy with the result.",
  "common:buttons.cancel": "Cancel",
};

export const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.enum(fontFamilyEnumValues),
  fontFamilyEn: z.enum(fontFamilyEnumValues),
  fontFamilyFa: z.enum(fontFamilyEnumValues),
  fontFamilyAr: z.enum(fontFamilyEnumValues),
  fontFamilyTr: z.enum(fontFamilyEnumValues),
  headingTextDecoration: z.enum([
    "none",
    "underline",
    "overline",
    "line-through",
  ]),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.enum(["fixed", "fluid", "container"]),
});

export type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function areAppearanceValuesEqual(
  a: AppearanceFormValues,
  b: AppearanceFormValues,
): boolean {
  return (
    a.theme === b.theme &&
    a.fontFamily === b.fontFamily &&
    a.fontFamilyEn === b.fontFamilyEn &&
    a.fontFamilyFa === b.fontFamilyFa &&
    a.fontFamilyAr === b.fontFamilyAr &&
    a.fontFamilyTr === b.fontFamilyTr &&
    a.headingTextDecoration === b.headingTextDecoration &&
    a.sidebarWidth === b.sidebarWidth &&
    a.contentWidth === b.contentWidth
  );
}
