const MOCK_IMAGE_POOL = [
  "/images/mock/electronics.svg",
  "/images/mock/automotive.svg",
  "/images/mock/real-estate.svg",
  "/images/mock/fashion.svg",
  "/images/mock/services.svg",
  "/images/mock/jobs.svg",
];

function hashSeed(seed: string | number) {
  const input = String(seed);
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickMockImage(seed: string | number) {
  return MOCK_IMAGE_POOL[hashSeed(seed) % MOCK_IMAGE_POOL.length];
}

export function pickMockGallery(seed: string | number, count = 3) {
  return Array.from({ length: count }).map((_, index) => {
    const s = `${seed}-${index + 1}`;
    return {
      url: pickMockImage(s),
      alt: `Mock image ${index + 1}`,
    };
  });
}
