import type { Metadata } from "next";
import { APP_NAME } from "@thomas-supply/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Secure dealer-facing portal for Thomas Supply product pricing, inventory, and order requests."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
