export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
