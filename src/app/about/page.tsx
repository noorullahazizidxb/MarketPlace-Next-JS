import { AboutContent } from "./about-content";

const MARKETPLACE_NAME = "Your Marketplace Name";

export const metadata = {
  title: `About | ${MARKETPLACE_NAME}`,
};

export default function AboutPage() {
  return <AboutContent marketplaceName={MARKETPLACE_NAME} />;
}
