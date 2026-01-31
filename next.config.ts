import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Force cache busting for translations
  generateBuildId: () => {
    return `build-${Date.now()}`;
  },
};

export default withNextIntl(nextConfig);
