import type { NextConfig } from "next";
import { CHATS_ROUTE } from "@/constants/clientRoutes";

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [["@effector/swc-plugin", {}]],
  },
  async redirects() {
    return [{
    source: '/',
    destination: CHATS_ROUTE,
    permanent: true,
  }];
  },
};

export default nextConfig;
