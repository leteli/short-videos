import type { NextConfig } from "next";
import { CHATS_ROUTE } from "@/constants/clientRoutes";

const nextConfig: NextConfig = {
  compiler: {
    effector: {
      ssr: true,
    },
  } as unknown as NextConfig["compiler"],
  async redirects() {
    return [{
    source: '/',
    destination: CHATS_ROUTE,
    permanent: true,
  }];
  },
};

export default nextConfig;
