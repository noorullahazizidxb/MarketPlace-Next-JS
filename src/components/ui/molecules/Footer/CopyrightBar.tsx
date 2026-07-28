import { SocialIcons } from "./SocialIcons";
import { COPYRIGHT_BRAND } from "./constants";

export function CopyrightBar() {
  return (
    <div className="mt-6 bg-foreground text-background">
      <div className="container mx-auto mt-2 px-4 py-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="block sm:hidden flex app-text-body">
              All rights reserved.{" "}
              <span className="text-primary whitespace-nowrap">
                {COPYRIGHT_BRAND} @{new Date().getFullYear()}
              </span>
            </p>
            <p className="hidden sm:block sm:app-text-body">
              All rights reserved.{" "}
              <span className="text-primary">
                {COPYRIGHT_BRAND} @{new Date().getFullYear()}
              </span>
            </p>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <SocialIcons size={40} variant="bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
