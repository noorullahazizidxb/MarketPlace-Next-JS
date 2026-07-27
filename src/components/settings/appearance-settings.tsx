"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "@repo/hooks/motion";
import toast from "react-hot-toast";
import {
  Globe2,
  Languages,
  Layout,
  LayoutDashboard,
  Palette,
  PanelLeft,
  Rows3,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import { useSidebarConfig, useTheme } from "@repo/hooks";
import type {
  ContentWidthOption,
  FontFamilyOption,
  HeadingTextDecoration,
  SidebarWidthOption,
  ThemeMode,
} from "@repo/types";
import { defaultSidebarSettings, defaultThemeSettings } from "@repo/constants";
import { ThemeCustomizer } from "@repo/ui";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atoms/shadcn/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/atoms/shadcn/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/shadcn/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/atoms/shadcn/tabs";
import { Separator } from "@/components/ui/atoms/shadcn/separator";
import { useLanguage } from "@/components/providers/language-provider";
import { AppearanceDensityStudio } from "@/components/settings/appearance-density-studio";

// ── Types ─────────────────────────────────────────────────────────────────────

type AppearanceTab =
  | "appearance-settings"
  | "theme-customizer"
  | "landing-page-settings"
  | "footer-settings";

// ── Font option data ───────────────────────────────────────────────────────────

const fontFamilyEnumValues = [
  "inter", "roboto", "poppins", "open-sans", "montserrat", "lato", "manrope", "nunito",
  "space-grotesk", "source-sans", "vazirmatn", "cairo", "tajawal", "almarai", "amiri",
  "readex-pro", "ibm-plex-sans-arabic", "noto-kufi-arabic", "noto-naskh-arabic", "yekan",
  "system", "serif", "mono",
] as const satisfies readonly [FontFamilyOption, ...FontFamilyOption[]];

const fontFamilyOptions: Array<{ value: FontFamilyOption; label: string }> = [
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

const headingDecorationOptions: Array<{ value: HeadingTextDecoration; label: string }> = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" },
];

const APPEARANCE_LABELS: Record<string, string> = {
  "settings:appearance.title": "Appearance Settings",
  "settings:appearance.description":
    "Control theme mode, typography, layout density, and dashboard presentation.",
  "settings:appearance.tabs.appearance": "Appearance",
  "settings:appearance.tabs.theme": "Theme Customizer",
  "settings:appearance.tabs.landingPage": "Landing Page",
  "settings:appearance.tabs.footer": "Footer",
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
  "settings:appearance.sections.landingPage.title": "Landing Page Settings",
  "settings:appearance.sections.landingPage.description":
    "Landing page appearance controls will be adapted for the standalone app next.",
  "settings:appearance.sections.footer.title": "Footer Settings",
  "settings:appearance.sections.footer.description":
    "Footer appearance controls will be adapted for the standalone app next.",
  "common:buttons.cancel": "Cancel",
};

// ── Form schema ───────────────────────────────────────────────────────────────

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.enum(fontFamilyEnumValues),
  fontFamilyEn: z.enum(fontFamilyEnumValues),
  fontFamilyFa: z.enum(fontFamilyEnumValues),
  fontFamilyAr: z.enum(fontFamilyEnumValues),
  fontFamilyTr: z.enum(fontFamilyEnumValues),
  headingTextDecoration: z.enum(["none", "underline", "overline", "line-through"]),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.enum(["fixed", "fluid", "container"]),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const areAppearanceValuesEqual = (
  a: AppearanceFormValues,
  b: AppearanceFormValues,
) =>
  a.theme === b.theme &&
  a.fontFamily === b.fontFamily &&
  a.fontFamilyEn === b.fontFamilyEn &&
  a.fontFamilyFa === b.fontFamilyFa &&
  a.fontFamilyAr === b.fontFamilyAr &&
  a.fontFamilyTr === b.fontFamilyTr &&
  a.headingTextDecoration === b.headingTextDecoration &&
  a.sidebarWidth === b.sidebarWidth &&
  a.contentWidth === b.contentWidth;


// ── Sub-components ─────────────────────────────────────────────────────────────

function ThemePreviewCard({
  value,
  title,
  previewClassName,
}: {
  value: ThemeMode;
  title: string;
  previewClassName: string;
}) {
  return (
    <FormItem>
      <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
        <FormControl>
          <RadioGroupItem value={value} className="sr-only" />
        </FormControl>
        <div className="rounded-md border-2 border-muted p-4 transition-colors hover:border-accent">
          <div className="space-y-2">
            <div className={`h-20 w-20 rounded-md border p-3 ${previewClassName}`}>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-foreground/25" />
                <div className="h-2 w-1/2 rounded bg-foreground/35" />
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground/35" />
                  <div className="h-2 flex-1 rounded bg-foreground/25" />
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground/45" />
                  <div className="h-2 flex-1 rounded bg-foreground/35" />
                </div>
              </div>
            </div>
            <span className="admin-text-body">{title}</span>
          </div>
        </div>
      </FormLabel>
    </FormItem>
  );
}

function ComingSoonPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6">
      <div className="space-y-2">
        <p className="admin-text-heading-sm">{title}</p>
        <p className="admin-text-body text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 rounded-xl border bg-background/70 p-4">
        <p className="admin-text-label">Coming soon</p>
        <p className="admin-text-body text-muted-foreground">
          This tab has been kept so the migrated settings IA stays stable while the standalone
          landing and footer controls are adapted.
        </p>
      </div>
    </div>
  );
}

function AppearanceSelectField({
  control,
  name,
  label,
  icon,
  placeholder,
  options,
}: {
  control: ReturnType<typeof useForm<AppearanceFormValues>>["control"];
  name:
  | "fontFamily"
  | "fontFamilyEn"
  | "fontFamilyFa"
  | "fontFamilyAr"
  | "fontFamilyTr"
  | "headingTextDecoration"
  | "sidebarWidth"
  | "contentWidth";
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1.5">
            {icon}
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AppearanceSettings() {
  const { t: translate } = useLanguage();
  const {
    themeSettings,
    updateThemeSettings,
    saveThemeSettings,
    resetThemeSettingsToSaved,
    hasUnsavedChanges: hasUnsavedThemeChanges,
    isReady,
  } = useTheme();
  const {
    config: sidebarConfig,
    updateConfig,
    saveConfig,
    resetConfigToSaved,
    hasUnsavedChanges: hasUnsavedSidebarChanges,
  } = useSidebarConfig();
  const savedAppearanceValuesRef = React.useRef<AppearanceFormValues | null>(null);
  const lastPreviewValuesRef = React.useRef<AppearanceFormValues | null>(null);
  const [activeTab, setActiveTab] = React.useState<AppearanceTab>("appearance-settings");
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  const canCustomiseTheme = true;
  const t = React.useCallback(
    (key: string, fallback?: string) => {
      const translated = translate(key);
      if (translated && translated !== key) {
        return translated;
      }

      return APPEARANCE_LABELS[key] ?? fallback ?? key;
    },
    [translate],
  );

  const resolveFormValues = React.useCallback(
    (): AppearanceFormValues => ({
      theme: (themeSettings.mode as ThemeMode) || "system",
      fontFamily: (themeSettings.fontFamily as FontFamilyOption) ?? "inter",
      fontFamilyEn:
        themeSettings.fontFamilyByLocale?.en ??
        (themeSettings.fontFamily as FontFamilyOption) ??
        "inter",
      fontFamilyFa:
        themeSettings.fontFamilyByLocale?.fa ??
        defaultThemeSettings.fontFamilyByLocale?.fa ??
        "yekan",
      fontFamilyAr:
        themeSettings.fontFamilyByLocale?.ar ??
        defaultThemeSettings.fontFamilyByLocale?.ar ??
        "cairo",
      fontFamilyTr:
        themeSettings.fontFamilyByLocale?.tr ??
        defaultThemeSettings.fontFamilyByLocale?.tr ??
        "inter",
      headingTextDecoration:
        (themeSettings.headingTextDecoration as HeadingTextDecoration) ??
        defaultThemeSettings.headingTextDecoration ??
        "none",
      sidebarWidth:
        (sidebarConfig.width as SidebarWidthOption) ?? "comfortable",
      contentWidth:
        (themeSettings.contentWidth as ContentWidthOption) ?? "fluid",
    }),
    [sidebarConfig.width, themeSettings],
  );

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: resolveFormValues(),
  });

  const resetFormToSavedValues = React.useCallback(() => {
    const values = savedAppearanceValuesRef.current ?? resolveFormValues();
    lastPreviewValuesRef.current = values;
    form.reset(values);
  }, [form, resolveFormValues]);

  const resetAllThemeToDefaults = React.useCallback(() => {
    updateThemeSettings(defaultThemeSettings, { persist: false });
    updateConfig(defaultSidebarSettings, { persist: false });

    const defaultFormValues: AppearanceFormValues = {
      theme: defaultThemeSettings.mode,
      fontFamily: defaultThemeSettings.fontFamily,
      fontFamilyEn: defaultThemeSettings.fontFamilyByLocale?.en ?? "inter",
      fontFamilyFa: defaultThemeSettings.fontFamilyByLocale?.fa ?? "yekan",
      fontFamilyAr: defaultThemeSettings.fontFamilyByLocale?.ar ?? "cairo",
      fontFamilyTr: defaultThemeSettings.fontFamilyByLocale?.tr ?? "inter",
      headingTextDecoration: defaultThemeSettings.headingTextDecoration ?? "none",
      sidebarWidth: defaultSidebarSettings.width,
      contentWidth: defaultThemeSettings.contentWidth,
    };

    lastPreviewValuesRef.current = defaultFormValues;
    form.reset(defaultFormValues);
  }, [form, updateConfig, updateThemeSettings]);

  React.useEffect(() => {
    if (!isReady) return;
    if (savedAppearanceValuesRef.current) return;
    const values = resolveFormValues();
    savedAppearanceValuesRef.current = values;
    lastPreviewValuesRef.current = values;
    form.reset(values);
  }, [form, isReady, resolveFormValues]);

  React.useEffect(() => {
    if (activeTab !== "theme-customizer" && themeCustomizerOpen) {
      setThemeCustomizerOpen(false);
    }
    if (activeTab === "theme-customizer" && !canCustomiseTheme) {
      setActiveTab("appearance-settings");
    }
  }, [activeTab, themeCustomizerOpen, canCustomiseTheme]);

  const applyAppearanceChanges = React.useCallback(
    (values: AppearanceFormValues, persist = false) => {
      updateThemeSettings({
        mode: values.theme,
        fontFamily: values.fontFamily,
        fontFamilyByLocale: {
          en: values.fontFamilyEn,
          fa: values.fontFamilyFa,
          ar: values.fontFamilyAr,
          tr: values.fontFamilyTr,
        },
        headingTextDecoration: values.headingTextDecoration,
        contentWidth: values.contentWidth,
      }, { persist });
      updateConfig({ width: values.sidebarWidth }, { persist });
    },
    [updateConfig, updateThemeSettings],
  );

  React.useEffect(() => {
    if (!isReady) return;

    const subscription = form.watch((values) => {
      if (!values) return;
      const nextValues = values as AppearanceFormValues;
      if (
        !nextValues.theme ||
        !nextValues.fontFamily ||
        !nextValues.fontFamilyEn ||
        !nextValues.fontFamilyFa ||
        !nextValues.fontFamilyAr ||
        !nextValues.fontFamilyTr ||
        !nextValues.headingTextDecoration ||
        !nextValues.sidebarWidth ||
        !nextValues.contentWidth
      ) {
        return;
      }
      if (
        lastPreviewValuesRef.current &&
        areAppearanceValuesEqual(lastPreviewValuesRef.current, nextValues)
      ) {
        return;
      }
      lastPreviewValuesRef.current = nextValues;
      applyAppearanceChanges(nextValues);
    });

    return () => subscription.unsubscribe();
  }, [applyAppearanceChanges, form, isReady]);

  const onSubmit = async (data: AppearanceFormValues) => {
    const nextThemeSettings = {
      ...themeSettings,
      mode: data.theme,
      fontFamily: data.fontFamily,
      fontFamilyByLocale: {
        en: data.fontFamilyEn,
        fa: data.fontFamilyFa,
        ar: data.fontFamilyAr,
        tr: data.fontFamilyTr,
      },
      headingTextDecoration: data.headingTextDecoration,
      contentWidth: data.contentWidth,
    };
    const nextSidebarConfig = {
      ...sidebarConfig,
      width: data.sidebarWidth,
    };

    applyAppearanceChanges(data);
    const [themeSaved, sidebarSaved] = await Promise.all([
      saveThemeSettings(nextThemeSettings),
      saveConfig(nextSidebarConfig),
    ]);

    if (!themeSaved || !sidebarSaved) {
      toast.error("Failed to save appearance changes.");
      return;
    }

    savedAppearanceValuesRef.current = data;
    lastPreviewValuesRef.current = data;
    form.reset(data);
    toast.success("Appearance changes saved.");
  };

  const resetToSavedSnapshot = React.useCallback(() => {
    resetThemeSettingsToSaved();
    resetConfigToSaved();
    resetFormToSavedValues();
  }, [
    resetConfigToSaved,
    resetFormToSavedValues,
    resetThemeSettingsToSaved,
  ]);

  const hasUnsavedChanges =
    form.formState.isDirty ||
    hasUnsavedThemeChanges ||
    hasUnsavedSidebarChanges;

  const sidebarWidthOptions = [
    { value: "compact", label: t("settings:appearance.sidebarWidth.options.compact") },
    { value: "comfortable", label: t("settings:appearance.sidebarWidth.options.comfortable") },
    { value: "spacious", label: t("settings:appearance.sidebarWidth.options.spacious") },
  ];

  const contentWidthOptions = [
    { value: "fixed", label: t("settings:appearance.contentWidth.options.fixed") },
    { value: "fluid", label: t("settings:appearance.contentWidth.options.fluid") },
    { value: "container", label: t("settings:appearance.contentWidth.options.container") },
  ];

  const languageFontFields = [
    {
      key: "fontFamilyEn" as const,
      label: t("settings:appearance.languageFonts.languages.en"),
      description: t("settings:appearance.languageFonts.descriptions.en"),
    },
    {
      key: "fontFamilyFa" as const,
      label: t("settings:appearance.languageFonts.languages.fa"),
      description: t("settings:appearance.languageFonts.descriptions.fa"),
    },
    {
      key: "fontFamilyAr" as const,
      label: t("settings:appearance.languageFonts.languages.ar"),
      description: t("settings:appearance.languageFonts.descriptions.ar"),
    },
    {
      key: "fontFamilyTr" as const,
      label: t("settings:appearance.languageFonts.languages.tr"),
      description: t("settings:appearance.languageFonts.descriptions.tr"),
    },
  ];

  return (
    <div className="admin-shell-page flex min-w-0 flex-col gap-(--space-section)" data-admin-page="settings-appearance">
      <div>
        <h1 className="admin-text-heading">{t("settings:appearance.title")}</h1>
        <p className="text-muted-foreground">{t("settings:appearance.description")}</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AppearanceTab)}
        className="space-y-4"
      >
        <TabsList
          className={`grid w-full rounded-lg bg-muted/60 p-1 ${canCustomiseTheme ? "grid-cols-4" : "grid-cols-3"}`}
        >
          <TabsTrigger value="appearance-settings" className="cursor-pointer gap-2 data-[state=active]:bg-background">
            <SlidersHorizontal className="admin-icon-sm" />
            <span className="hidden sm:inline">{t("settings:appearance.tabs.appearance")}</span>
          </TabsTrigger>
          {canCustomiseTheme && (
            <TabsTrigger value="theme-customizer" className="cursor-pointer gap-2 data-[state=active]:bg-background">
              <Palette className="admin-icon-sm" />
              <span className="hidden sm:inline">{t("settings:appearance.tabs.theme")}</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="landing-page-settings" className="cursor-pointer gap-2 data-[state=active]:bg-background">
            <Layout className="admin-icon-sm" />
            <span className="hidden sm:inline">{t("settings:appearance.tabs.landingPage")}</span>
          </TabsTrigger>
          <TabsTrigger value="footer-settings" className="cursor-pointer gap-2 data-[state=active]:bg-background">
            <Rows3 className="admin-icon-sm" />
            <span className="hidden sm:inline">{t("settings:appearance.tabs.footer")}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait" initial={false}>
        {activeTab === "appearance-settings" ? (
          <motion.div
            key="appearance-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="p-4 md:p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* ── 1. Theme Mode + Language Fonts (side by side on lg+) ── */}
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* Theme mode cards */}
                    <div className="min-w-0 flex-1 space-y-4">
                      <div>
                        <h3 className="mb-1 admin-text-label">
                          {t("settings:appearance.themeSection.title")}
                        </h3>
                        <p className="admin-text-body text-muted-foreground">
                          {t("settings:appearance.themeSection.description")}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-wrap gap-4"
                              >
                                <ThemePreviewCard
                                  value="light"
                                  title={t("settings:appearance.themeOptions.light")}
                                  previewClassName="bg-background"
                                />
                                <ThemePreviewCard
                                  value="system"
                                  title={t("settings:appearance.themeOptions.system")}
                                  previewClassName="bg-linear-to-b from-background via-muted/40 to-muted"
                                />
                                <ThemePreviewCard
                                  value="dark"
                                  title={t("settings:appearance.themeOptions.dark")}
                                  previewClassName="border-foreground/30 bg-foreground/90"
                                />
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Per-language fonts panel (moved here from right column) */}
                    <div className="w-full space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4 lg:w-80 xl:w-96">
                      <div>
                        <h3 className="flex items-center gap-2 admin-text-heading-sm">
                          <Languages className="admin-icon-sm text-muted-foreground" />
                          {t("settings:appearance.languageFonts.title")}
                        </h3>
                        <p className="mt-0.5 admin-text-body text-muted-foreground">
                          {t("settings:appearance.languageFonts.description")}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {languageFontFields.map((fieldConfig) => (
                          <div
                            key={fieldConfig.key}
                            className="rounded-xl border border-border/60 bg-background/70 p-3"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <Globe2 className="admin-icon-xs text-muted-foreground" />
                              <div>
                                <p className="admin-text-caption">{fieldConfig.label}</p>
                                <p className="admin-text-micro text-muted-foreground">{fieldConfig.description}</p>
                              </div>
                            </div>
                            <AppearanceSelectField
                              control={form.control}
                              name={fieldConfig.key}
                              label={t("settings:appearance.languageFonts.fontLabel")}
                              icon={<Globe2 className="admin-icon-xs text-muted-foreground" />}
                              placeholder={t("settings:appearance.placeholders.languageFont")}
                              options={fontFamilyOptions}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ── 2. Typography & Design Tokens (full-width expanded) ── */}
                  <div className="space-y-6 rounded-2xl border border-border/70 bg-muted/20 p-4 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="admin-text-heading-sm">
                          {t("settings:appearance.fontSection.title")}
                        </h3>
                        <p className="admin-text-body text-muted-foreground">
                          {t("settings:appearance.fontSection.description")}
                        </p>
                      </div>

                      {/* Default font family stays here */}
                      <div className="grid w-full gap-3 sm:w-72">
                        <AppearanceSelectField
                          control={form.control}
                          name="fontFamily"
                          label={t("settings:appearance.fontSection.defaultFont")}
                          icon={<Type className="admin-icon-xs text-muted-foreground" />}
                          placeholder={t("settings:appearance.placeholders.fontFamily")}
                          options={fontFamilyOptions}
                        />

                        <AppearanceSelectField
                          control={form.control}
                          name="headingTextDecoration"
                          label="Heading Text Decoration"
                          icon={<Type className="admin-icon-xs text-muted-foreground" />}
                          placeholder="Choose heading decoration"
                          options={headingDecorationOptions}
                        />
                      </div>
                    </div>

                    {/* Canonical design token studio (default + viewport overrides) */}
                    <AppearanceDensityStudio />
                  </div>

                  {/* ── 3. Layout options ── */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <AppearanceSelectField
                      control={form.control}
                      name="sidebarWidth"
                      label={t("settings:appearance.sidebarWidth.label")}
                      icon={<PanelLeft className="admin-icon-xs text-muted-foreground" />}
                      placeholder={t("settings:appearance.placeholders.sidebarWidth")}
                      options={sidebarWidthOptions}
                    />
                    <AppearanceSelectField
                      control={form.control}
                      name="contentWidth"
                      label={t("settings:appearance.contentWidth.label")}
                      icon={<LayoutDashboard className="admin-icon-xs text-muted-foreground" />}
                      placeholder={t("settings:appearance.placeholders.contentWidth")}
                      options={contentWidthOptions}
                    />
                  </div>

                  {/* ── 4. Actions ── */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={form.formState.isSubmitting || !isReady || !hasUnsavedChanges}
                    >
                      {t("settings:appearance.actions.saveChanges")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={resetAllThemeToDefaults}
                      disabled={form.formState.isSubmitting || !isReady}
                    >
                      {t("settings:appearance.actions.resetDefaults")}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="cursor-pointer"
                      onClick={resetToSavedSnapshot}
                      disabled={form.formState.isSubmitting || !hasUnsavedChanges}
                    >
                      {t("common:buttons.cancel")}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        ) : activeTab === "theme-customizer" && canCustomiseTheme ? (
          <motion.div
            key="theme-customizer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex flex-col gap-6 p-4 md:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="admin-text-heading-sm">
                    {t("settings:appearance.customizer.title")}
                  </h3>
                  <p className="admin-text-body text-muted-foreground">
                    {t("settings:appearance.customizer.description")}
                  </p>
                </div>
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setThemeCustomizerOpen(true)}
                >
                  <Palette className="mr-2 admin-icon-sm" />
                  {t("settings:appearance.customizer.open")}
                </Button>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 admin-text-body text-muted-foreground">
                {t("settings:appearance.customizer.note")}
              </div>
            </div>
            <ThemeCustomizer open={themeCustomizerOpen} onOpenChange={setThemeCustomizerOpen} />
          </motion.div>
        ) : activeTab === "landing-page-settings" ? (
          <motion.div
            key="landing-page-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm md:p-6"
          >
            <div className="mb-6">
              <h3 className="admin-text-heading-sm">
                {t("settings:appearance.sections.landingPage.title")}
              </h3>
              <p className="admin-text-body text-muted-foreground">
                {t("settings:appearance.sections.landingPage.description")}
              </p>
            </div>
            <ComingSoonPanel
              title={t("settings:appearance.sections.landingPage.title")}
              description={t("settings:appearance.sections.landingPage.description")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="footer-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm md:p-6"
          >
            <div className="mb-6">
              <h3 className="admin-text-heading-sm">
                {t("settings:appearance.sections.footer.title")}
              </h3>
              <p className="admin-text-body text-muted-foreground">
                {t("settings:appearance.sections.footer.description")}
              </p>
            </div>
            <ComingSoonPanel
              title={t("settings:appearance.sections.footer.title")}
              description={t("settings:appearance.sections.footer.description")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
