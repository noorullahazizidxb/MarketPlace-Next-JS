"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useRouter } from "next/navigation";

export function HomeHero() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <section className="relative overflow-visible mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[radial-gradient(1200px_600px_at_90%_-10%,hsl(var(--primary)/0.15),transparent_60%),_linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/80)]">
      {/* glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-[380px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative overflow-visible px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 items-center gap-8 z-[1]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl z-5 sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            {t("heroHeadline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-3 text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl"
          >
            {t("heroSubheadline")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] items-center relative z-[1100]"
          >
            <SearchBox
              placeholder={t("search")}
              className="w-full relative z-[1100]"
            />
            <div className="flex items-center gap-2">
              <Button variant="primary">{t("browseNow")}</Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/listing/create")}
              >
                {t("listYourProperty")}
              </Button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl border border-white/10 overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop"
            alt="Hero property"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-3">
            <div className="relative h-20 rounded-xl overflow-hidden border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop"
                alt="Gallery 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-20 rounded-xl overflow-hidden border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
                alt="Gallery 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-20 rounded-xl overflow-hidden border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=800&auto=format&fit=crop"
                alt="Gallery 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
