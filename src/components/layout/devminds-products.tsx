"use client";

import "./devminds-products.css";

import { MotionConfig, motion } from "framer-motion";
import { DEVMINDS_PRODUCTS, LOGO_HEIGHT, hasWideLogo, productLogoSrc, type DevmindsProduct, type LogoVariant, type ProductSlug } from "@/lib/devminds-products";

interface DevmindsProductsProps {
  /** The product this app is; highlighted as "You are here". */
  current: ProductSlug;
}

function Logo({ product, variant, className }: { product: DevmindsProduct; variant: LogoVariant; className: string }) {
  const decorative = variant.startsWith("icon");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG logos need no optimisation
    <img
      className={`dmp-img ${className}`}
      src={productLogoSrc(product.slug, variant)}
      alt={decorative ? "" : product.name}
      width={product.logoWidths[variant]}
      height={LOGO_HEIGHT}
      loading="lazy"
      decoding="async"
    />
  );
}

function CardBody({ product, isCurrent }: { product: DevmindsProduct; isCurrent: boolean }) {
  return (
    <>
      <span className="dmp-logo">
        <Logo product={product} variant="light" className="dmp-light" />
        <Logo product={product} variant="dark" className="dmp-dark" />
      </span>
      <span className="dmp-compact">
        <Logo product={product} variant="icon-light" className="dmp-light" />
        <Logo product={product} variant="icon-dark" className="dmp-dark" />
        <span className="dmp-name">{product.name}</span>
      </span>
      <span className="dmp-desc">{product.descriptor}</span>
      {isCurrent && <span className="dmp-badge">You are here</span>}
    </>
  );
}

/** "Our products" footer section listing every DevMinds product. */
export function DevmindsProducts({ current }: DevmindsProductsProps) {
  return (
    <MotionConfig reducedMotion="user">
      <nav className="dmp" aria-labelledby="dmp-title">
        <h2 id="dmp-title" className="dmp-title">Our products</h2>
        <ul className="dmp-grid">
          {DEVMINDS_PRODUCTS.map((product, index) => {
            const isCurrent = product.slug === current;
            const label = `${product.name}: ${product.descriptor}`;
            return (
              <motion.li
                key={product.slug}
                className={hasWideLogo(product) ? "dmp-item dmp-item--wide" : "dmp-item"}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
              >
                {isCurrent ? (
                  <div className="dmp-card" aria-current="page">
                    <CardBody product={product} isCurrent />
                  </div>
                ) : (
                  <a className="dmp-card" href={product.url} target="_blank" rel="noopener" aria-label={`${label} (opens in new tab)`}>
                    <CardBody product={product} isCurrent={false} />
                  </a>
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
