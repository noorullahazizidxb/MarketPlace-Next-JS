"use client";

import { SupportBar } from "./SupportBar";
import { AccordionSection } from "./AccordionSection";
import { NavLinkList } from "./NavLinkList";
import { ContactInfo } from "./ContactInfo";
import { BrandSection } from "./BrandSection";
import { PaymentLogos } from "./PaymentLogos";
import { CopyrightBar } from "./CopyrightBar";
import { SocialIcons } from "./SocialIcons";
import { QUICK_ACCESS_LINKS, IMPORTANT_LINKS } from "./constants";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center py-6 text-foreground">
      <div className="flex justify-end bg-muted translate-y-6 md:translate-y-12 py-6 md:py-20 z-[2]">
        <div className="md:w-[54px] md:h-[54px] md:ml-[130px]" />
      </div>

      <div className="flex md:flex-col flex-col w-full max-w-screen-xl z-30 mx-auto">
        <SupportBar />

        <div className="container order-2 sm:order-3 md:order-2 mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AccordionSection title="Quick Access" className="min-w-[200px]">
              <NavLinkList links={QUICK_ACCESS_LINKS} />
            </AccordionSection>

            <AccordionSection
              title="Important Links"
              className="min-w-[200px] sm:w-full"
              mobileTitleOffset
            >
              <NavLinkList links={IMPORTANT_LINKS} />
            </AccordionSection>

            <AccordionSection
              title="Contact Us"
              className="min-w-[200px] sm:w-full"
              mobileTitleOffset
            >
              <div className="bg-muted rounded-md p-5">
                <ContactInfo />
              </div>
            </AccordionSection>

            <AccordionSection
              title="Social Media"
              className="block md:hidden min-w-[200px] sm:w-full"
              mobileTitleOffset
            >
              <div className="md:dark:bg-transparent p-2 rounded-md p-5">
                <div className="flex space-x-4 items-center justify-between">
                  <SocialIcons size={30} />
                </div>
              </div>
            </AccordionSection>
          </div>
        </div>

        <div className="container order-1 sm:order-2 md:order-3 w-full md:h-[120px] grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between mb-6 mt-6 mx-auto px-4">
          <BrandSection />
          <PaymentLogos />
        </div>
      </div>

      <CopyrightBar />
    </footer>
  );
}
