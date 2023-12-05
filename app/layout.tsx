import "./globals.css";
import "@radix-ui/themes/styles.css";
import "react-virtualized/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Weel - Link Management tool",
    template: "%s - Weel",
  },
  description:
    "Weel serves as a link management tool designed for marketing teams, enabling them to generate, distribute, and monitor short links.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
