import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const title = "Contest Tracker";
const description =
  "Track competitive programming contests and their solutions";
export const metadata: Metadata = {
  title: title,
  description: description,
  metadataBase: new URL(domain),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: title,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: title,
    description: description,
    url: domain,
    type: "website",
    siteName: title,
    images: [
      {
        url: domain + "/opengraph-image.png",
        width: 100,
        height: 100,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: title,
      template: title,
    },
    images: [
      {
        url: domain + "/opengraph-image.png",
        alt: title,
        width: 100,
        height: 100,
      },
    ],
    description: description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <ClerkProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} `}>
          <Toaster richColors />
          <ThemeProvider
            attribute={"class"}
            defaultTheme='system'
            enableSystem={true}
          >
            {children}
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
