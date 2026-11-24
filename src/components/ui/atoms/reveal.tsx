"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { reveal, revealGroup, revealViewport } from "@/lib/motion";

type RevealProps = Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport">;

/** Fades + lifts its content in once when scrolled into view. Use for below-the-fold blocks. */
export function Reveal(props: RevealProps) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      {...props}
    />
  );
}

/** Staggers direct <RevealItem /> children as the group scrolls into view. */
export function RevealGroup(props: RevealProps) {
  return (
    <motion.div
      variants={revealGroup}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      {...props}
    />
  );
}

/** Child of <RevealGroup />; inherits the group's animation state. */
export function RevealItem(props: Omit<HTMLMotionProps<"div">, "variants">) {
  return <motion.div variants={reveal} {...props} />;
}
