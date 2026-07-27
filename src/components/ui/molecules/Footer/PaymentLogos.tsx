import { MasterCardIcon, NLIcon, VisaIcon } from "./PaymentIcon";

export function PaymentLogos() {
  return (
    <div className="hidden sm:flex container md:justify-end items-center gap-6 md:gap-14 w-full max-w-screen-xl mx-auto">
      <MasterCardIcon className="shrink-0" />
      <NLIcon className="shrink-0" />
      <VisaIcon className="shrink-0" />
    </div>
  );
}
