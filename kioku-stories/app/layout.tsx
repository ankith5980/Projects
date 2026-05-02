import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cart from "@/components/Cart";
import CustomCursor from "@/components/CustomCursor";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kioku Stories | Crafted Memories & Hampers",
  description: "Bespoke romantic hampers, birthday gifts, and memory diaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAF9F6] text-[#2C2C2C] antialiased`}>
        <SplashScreen />
        <CustomCursor />
        <SmoothScroll>{children as any}
          <Cart />
        </SmoothScroll>
      </body>
    </html>
  );
}