import {
  Armchair,
  Baby,
  Bed,
  Bike,
  BookOpen,
  Box,
  BriefcaseBusiness,
  Building2,
  Car,
  CarFront,
  Headphones,
  Home,
  House,
  Laptop,
  PersonStanding,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Tv,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Shared lucide icon mapping for marketplace categories (by slug or name). */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "apartments-for-rent": Home,
  "houses-for-sale": House,
  "real-estate": Building2,
  audio: Headphones,
  smartphones: Smartphone,
  laptops: Laptop,
  electronics: Laptop,
  televisions: Tv,
  bicycles: Bike,
  suvs: CarFront,
  vehicles: Car,
  "bedroom-furniture": Bed,
  "office-furniture": Armchair,
  "home-living": Sofa,
  "beauty-personal-care": Sparkles,
  books: BookOpen,
  "mens-clothing": Shirt,
  fashion: Shirt,
  "womens-clothing": PersonStanding,
  "kids-fashion": Baby,
};

export function categoryIcon(slug: string) {
  const value = slug.toLowerCase();
  const exact = CATEGORY_ICONS[value];
  if (exact) return exact;
  if (/audio|headphone|speaker/.test(value)) return Headphones;
  if (/smartphone|mobile|\bphone\b/.test(value)) return Smartphone;
  if (/television|\btv\b/.test(value)) return Tv;
  if (/laptop|electronic|computer|tech/.test(value)) return Laptop;
  if (/bicycle|\bbike\b/.test(value)) return Bike;
  if (/\bsuv\b/.test(value)) return CarFront;
  if (/car|auto|motor|vehicle/.test(value)) return Car;
  if (/bedroom|\bbed\b/.test(value)) return Bed;
  if (/office|armchair/.test(value)) return Armchair;
  if (/beauty|cosmetic|personal-care/.test(value)) return Sparkles;
  if (/book/.test(value)) return BookOpen;
  if (/kid|baby|child/.test(value)) return Baby;
  if (/women/.test(value)) return PersonStanding;
  if (/fashion|cloth|apparel|shoe|\bmen\b/.test(value)) return Shirt;
  if (/apartment|\brent\b/.test(value)) return Home;
  if (/house/.test(value)) return House;
  if (/real-estate|estate|property/.test(value)) return Building2;
  if (/furniture|sofa|living/.test(value)) return Sofa;
  if (/home|land/.test(value)) return Home;
  if (/job|career|employment/.test(value)) return BriefcaseBusiness;
  if (/service|repair|maintenance/.test(value)) return Wrench;
  return Box;
}

