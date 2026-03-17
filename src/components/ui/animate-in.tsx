"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlide } from "@/lib/animations";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
  delay?: number;
  variant?: typeof fadeSlide;
}

export const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  className,
  as: Tag = "div",
  once = true,
  delay = 0,
  variant = fadeSlide,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);
  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="initial"
      animate={visible ? "animate" : "initial"}
      className={`${className ?? ""} will-change`}
      transition={{ ...variant.animate?.transition, delay }}
    >
      <Tag>{children}</Tag>
    </motion.div>
  );
};
