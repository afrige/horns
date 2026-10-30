import type { NextConfig } from "next";

const config: NextConfig = {
  // Public profile URLs: /@username -> /u/username
  async rewrites() {
    return [{ source: "/@:username", destination: "/u/:username" }];
  },
};
export default config;
