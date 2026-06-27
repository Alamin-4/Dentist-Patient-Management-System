import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/providers/StateProvider";
import TanstackProvider from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#152238",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RatedDocs",
  description:
    "Discover top-rated dentists with transparent pricing on RatedDocs. Compare verified dental professionals, read reviews, and book confidently for your oral health needs.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RatedDocs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <StateProvider>
          <TanstackProvider>{children}


            <Toaster position="top-right" />
          </TanstackProvider>
        </StateProvider>
      </body>
    </html>
  );
}
