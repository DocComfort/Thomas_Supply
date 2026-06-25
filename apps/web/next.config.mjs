/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  transpilePackages: [
    "@thomas-supply/db",
    "@thomas-supply/odoo",
    "@thomas-supply/shared"
  ]
};

export default nextConfig;
