import {
  organizationJsonLd,
  personJsonLd,
  websiteJsonLd,
} from "@/lib/site-config";

type SeoJsonLdProps = {
  readonly extra?: Record<string, unknown> | Record<string, unknown>[];
};

export function SeoJsonLd({ extra }: SeoJsonLdProps) {
  const graphs = [
    organizationJsonLd(),
    personJsonLd(),
    websiteJsonLd(),
    ...(extra ? (Array.isArray(extra) ? extra : [extra]) : []),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          graphs.length === 1 ? graphs[0] : { "@context": "https://schema.org", "@graph": graphs },
        ),
      }}
    />
  );
}
