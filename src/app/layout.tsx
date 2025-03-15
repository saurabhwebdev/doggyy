import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeminiChatbot from "@/components/GeminiChatbot";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageTransition from "@/components/PageTransition";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { OrganizationJsonLd } from "@/components/SEO";
import SupabaseInitializer from "@/components/SupabaseInitializer";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pawpedia.xyz"),
  title: {
    default: "PawPedia - The Ultimate Dog Breed Directory",
    template: "%s | PawPedia"
  },
  description: "Discover the perfect dog breed for you. Explore our comprehensive dog breed directory with detailed information, characteristics, and beautiful photos.",
  keywords: ["dog breeds", "dog directory", "canine", "puppies", "dog care", "dog information", "dog characteristics", "dog temperament"],
  authors: [{ name: "PawPedia Team" }],
  creator: "PawPedia",
  publisher: "PawPedia",
  verification: {
    google: "wRtZZyRPabEglKufGIFct1_wu5RwhrSgQAPk56tVX08",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pawpedia.xyz",
    siteName: "PawPedia",
    title: "PawPedia - The Ultimate Dog Breed Directory",
    description: "Discover the perfect dog breed for you. Explore our comprehensive dog breed directory with detailed information, characteristics, and beautiful photos.",
    images: [
      {
        url: "https://www.pawpedia.xyz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PawPedia - The Ultimate Dog Breed Directory"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PawPedia - The Ultimate Dog Breed Directory",
    description: "Discover the perfect dog breed for you. Explore our comprehensive dog breed directory with detailed information, characteristics, and beautiful photos.",
    images: ["https://www.pawpedia.xyz/twitter-image.jpg"],
    creator: "@pawpedia"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "https://www.pawpedia.xyz"
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <OrganizationJsonLd 
          name="PawPedia"
          url="https://www.pawpedia.xyz"
          logoUrl="https://www.pawpedia.xyz/logo.png"
          sameAs={[
            "https://twitter.com/pawpedia",
            "https://facebook.com/pawpedia",
            "https://instagram.com/pawpedia"
          ]}
        />
        <Suspense fallback={null}>
          <LoadingIndicator />
        </Suspense>
        <Header />
        <main className="flex-grow">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <GeminiChatbot />
        <SupabaseInitializer />
      </body>
    </html>
  );
}
