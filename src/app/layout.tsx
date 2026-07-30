import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trek The Himalayas | Premium Nepal Expeditions",
  description:
    "Experience the Himalayas with unparalleled expertise and premium comfort. Elite high-altitude trekking since 2010.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}