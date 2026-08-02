"use client";

import type { CSSProperties } from "react";
import { Search, Sparkles } from "lucide-react";
import { Badge, Button } from "@repo/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atoms/shadcn/card";
import { Input } from "@/components/ui/atoms/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atoms/shadcn/table";
import { ListingCard, type Listing } from "@/components/ui/listing-card";
import type { AppearanceDensityTab } from "./appearance-preview-registry";

type Props = {
  category: AppearanceDensityTab;
  previewVariant: string;
  previewStyle: CSSProperties;
  maxWidth: string;
};

const PREVIEW_LISTING: Listing = {
  id: "theme-preview",
  title: "MacBook Pro for creative teams",
  description: "Excellent condition, verified seller, and same-day delivery.",
  price: "1,850",
  currency: "USD",
  listingType: "SALE",
  contactVisibility: "HIDE_SELLER",
  location: "Kabul, Afghanistan",
  category: { name: "Electronics" },
  averageRating: 4.8,
  reviewCount: 32,
  images: [],
};

function ControlsSpecimen() {
  return (
    <Card className="theme-specimen-card">
      <CardHeader>
        <CardTitle>Marketplace controls</CardTitle>
        <CardDescription>Production primitives used by listing and contact flows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-[var(--space-gap)]">
        <div className="relative">
          <Search className="app-icon-sm pointer-events-none absolute start-[var(--ctrl-px)] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="ps-[calc(var(--ctrl-px)+var(--icon-sm)+0.5rem)]" placeholder="Search products and services" />
        </div>
        <div className="flex flex-wrap gap-[var(--space-gap)]">
          <Button type="button">Search</Button>
          <Button type="button" variant="outline">Filters</Button>
          <Badge variant="secondary">128 results</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function TableSpecimen() {
  return (
    <Card className="theme-specimen-card">
      <CardHeader>
        <CardTitle>Listing moderation</CardTitle>
        <CardDescription>Real table, badge, and card primitives from the admin experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>MacBook Pro</TableCell>
              <TableCell>DevMinds Store</TableCell>
              <TableCell><Badge variant="success">Approved</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Design services</TableCell>
              <TableCell>Creative Hub</TableCell>
              <TableCell><Badge variant="warning">Pending</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategorySpecimen({ category }: { category: AppearanceDensityTab }) {
  if (category === "table" || category === "sidebar") return <TableSpecimen />;
  if (category === "controls" || category === "icons" || category === "mobile") {
    return <ControlsSpecimen />;
  }
  return (
    <div className="mx-auto w-full max-w-sm">
      <ListingCard listing={PREVIEW_LISTING} />
    </div>
  );
}

export function AppearanceCategoryLivePreviewPanel({
  category,
  previewStyle,
  maxWidth,
}: Props) {
  return (
    <section className="appearance-category-preview" style={previewStyle}>
      <div className="appearance-preview-toolbar">
        <div>
          <p className="app-text-label">Category live preview</p>
          <p className="app-text-caption text-muted-foreground">
            Real components already used by the Marketplace application.
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          <Sparkles className="app-icon-xs" />
          {category}
        </Badge>
      </div>
      <div className="appearance-category-canvas" style={{ maxWidth }}>
        <CategorySpecimen category={category} />
      </div>
    </section>
  );
}
