
import type { Metadata } from "next";
import { Inter, Merriweather, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CbK EBR",
  description: "Chicken Barrons",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} ${bebasNeue.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <Toaster position="top-center" />

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Header />
          <main className="p-4">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
          <BottomNav />
        </div>

        {/* Desktop Message */}
        <div className="hidden lg:flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <p className="text-gray-700 font-medium font-serif">
              Please open this app on a phone or tablet.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

