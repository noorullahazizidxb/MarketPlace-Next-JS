"use client";

import "./devminds-products.css";

import type { CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { DEVMINDS_PRODUCTS, LOGO_HEIGHT, footerDesktopColumns, productLogoSrc, type DevmindsProduct, type ProductSlug } from "@/lib/devminds-products";

interface DevmindsProductsProps {
  /** The product this app is; highlighted as "You are here". */
  current: ProductSlug;
}

type GridStyle = CSSProperties & { "--dmp-cols": number };

function ProductIcon({ product }: { product: DevmindsProduct }) {
  return (
    <span className="dmp-icon" aria-hidden="true">
      {(["icon-light", "icon-dark"] as const).map((variant) => (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG logos need no optimisation
        <img
          key={variant}
          className={`dmp-img ${variant === "icon-light" ? "dmp-light" : "dmp-dark"}`}
          src={productLogoSrc(product.slug, variant)}
          alt=""
          width={product.logoWidths[variant]}
          height={LOGO_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      ))}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg className="dmp-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardBody({ product, isCurrent }: { product: DevmindsProduct; isCurrent: boolean }) {
  return (
    <>
      <ProductIcon product={product} />
      <span className="dmp-text">
        <span className="dmp-name">{product.name}</span>
        <span className="dmp-desc">{product.descriptor}</span>
        {isCurrent && <span className="dmp-badge">You are here</span>}
      </span>
      {!isCurrent && <ArrowIcon />}
    </>
  );
}

/** "More from DevMinds" footer section: every DevMinds product in two even rows. */
export function DevmindsProducts({ current }: DevmindsProductsProps) {
  const gridStyle: GridStyle = { "--dmp-cols": footerDesktopColumns(DEVMINDS_PRODUCTS.length) };
  return (
    <MotionConfig reducedMotion="user">
      <nav className="dmp" aria-labelledby="dmp-title">
        <h2 id="dmp-title" className="dmp-title">More from DevMinds</h2>
        <ul className="dmp-grid" style={gridStyle}>
          {DEVMINDS_PRODUCTS.map((product, index) => {
            const isCurrent = product.slug === current;
            return (
              <motion.li
                key={product.slug}
                className="dmp-item"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
              >
                {isCurrent ? (
                  <div className="dmp-card dmp-card--current" aria-current="page">
                    <CardBody product={product} isCurrent />
                  </div>
                ) : (
                  <a className="dmp-card" href={product.url} target="_blank" rel="noopener" aria-label={`${product.name}: ${product.descriptor} (opens in new tab)`}>
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
