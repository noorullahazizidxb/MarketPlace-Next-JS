import { SocialIcons } from "./SocialIcons";
import { Logo } from "../../atoms/logo";

export function BrandSection() {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="flex flex-col sm:flex-col md:flex-row md:max-w-[738px] items-center justify-center md:justify-start space-x-3">
        <Logo size={48} className="block md:hidden" alt="Newlink Travel Logo" />
        <h1 className="block md:hidden text-primary app-text-heading-sm md:app-text-heading app-text-heading">
          Newlink Travel & Tours Afghanistan
        </h1>

        <h1 className="hidden md:block text-primary app-text-heading-sm md:app-text-heading app-text-heading">
          Newlink Travel & Tours
        </h1>

        <div className="block md:hidden min-w-[200px] sm:w-full">
          <div className="rounded-md pt-3">
            <div className="flex space-x-4 mb-2 items-center justify-between">
              <SocialIcons size={30} />
            </div>
          </div>
        </div>
      </div>

      <p className="hidden sm:block w-full mt-3 text-left app-text-body text-muted-foreground">
        Newlink Travel is a trusted travel agency offering flights, hotels, and
        tourism services across Afghanistan and beyond. With years of experience
        and 24 hours dedicated customer support, we help travelers book with
        confidence and ease.
      </p>
    </div>
  );
}
