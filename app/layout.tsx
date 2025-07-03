import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import PerformanceMonitor from "@/components/performance-monitor"
import { preloadCriticalResources } from "@/lib/performance-utils"

// Resolve site URL safely. Fall back to production URL if the env var is
// missing or malformed (must start with http:// or https://).
const rawSiteUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : ""

const SITE_URL = /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : "https://parisboutique-juba.com"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: true,
})

export const metadata: Metadata = {
  title: "Paris Boutique Juba - Premium Perfumes, Cosmetics & Fashion Store in South Sudan",
  description:
    "Discover premium perfumes, cosmetics, skincare, and fashion at Paris Boutique Juba. South Sudan's leading beauty store offering authentic products, kids' toys, and exceptional service since 2019. Shop CeraVe, F&W Paris, and exclusive collections.",
  keywords: [
    "Paris Boutique Juba",
    "fashion store Juba",
    "cosmetics Juba",
    "perfumes South Sudan",
    "beauty products Juba",
    "skincare Juba",
    "CeraVe Juba",
    "F&W Paris products",
    "kids toys Juba",
    "premium cosmetics South Sudan",
    "beauty store Juba",
    "makeup Juba",
    "fragrance store",
    "luxury beauty Juba",
    "authentic cosmetics",
  ].join(", "),
  authors: [{ name: "Paris Boutique Juba", url: "https://parisboutique-juba.com" }],
  creator: "Paris Boutique Juba",
  publisher: "Paris Boutique Juba",
  category: "Beauty & Fashion",
  classification: "Beauty Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Paris Boutique Juba",
    title: "Paris Boutique Juba - Premium Beauty & Fashion Store in South Sudan",
    description:
      "Discover premium perfumes, cosmetics, skincare, and fashion at Paris Boutique Juba. South Sudan's leading beauty store with authentic products and exceptional service.",
    images: [
      {
        url: "/images/paris-boutique-storefront.jpg",
        width: 1200,
        height: 630,
        alt: "Paris Boutique Juba storefront - Premium beauty and fashion store in South Sudan",
        type: "image/jpeg",
      },
      {
        url: "/images/luxury-cosmetics-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury cosmetics and perfumes collection at Paris Boutique Juba",
        type: "image/jpeg",
      },
      {
        url: "/images/kids-gifts-display.jpg",
        width: 1200,
        height: 630,
        alt: "Kids toys and gifts collection at Paris Boutique Juba",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ParisRoutiqueJuba",
    creator: "@ParisRoutiqueJuba",
    title: "Paris Boutique Juba - Premium Beauty & Fashion Store",
    description:
      "South Sudan's leading beauty store offering premium perfumes, cosmetics, skincare, and fashion. Authentic products with exceptional service since 2019.",
    images: [
      {
        url: "/images/paris-boutique-storefront.jpg",
        alt: "Paris Boutique Juba - Premium beauty and fashion store storefront",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "msapplication-TileColor": "#B8860B",
    "theme-color": "#B8860B",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Paris Boutique Juba",
    "mobile-web-app-capable": "yes",
    "application-name": "Paris Boutique Juba",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Preload critical resources
  if (typeof window !== "undefined") {
    preloadCriticalResources()
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/paris-boutique-storefront.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/luxury-cosmetics-hero.jpg" as="image" type="image/jpeg" />

        {/* Structured Data for Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Paris Boutique Juba",
              description:
                "Premium beauty and fashion store in Juba, South Sudan, offering authentic perfumes, cosmetics, skincare, and kids' products.",
              url: SITE_URL,
              logo: `${SITE_URL}/images/paris-boutique-white-logo.png`,
              image: [
                `${SITE_URL}/images/paris-boutique-storefront.jpg`,
                `${SITE_URL}/images/luxury-cosmetics-hero.jpg`,
                `${SITE_URL}/images/kids-gifts-display.jpg`,
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Juba Market Area",
                addressLocality: "Juba",
                addressCountry: "South Sudan",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "4.8594",
                longitude: "31.5713",
              },
              telephone: "+211-XXX-XXXX",
              openingHours: ["Mo-Sa 08:00-20:00", "Su 10:00-18:00"],
              priceRange: "$5-$100",
              paymentAccepted: ["Cash", "Mobile Money"],
              currenciesAccepted: "USD, SSP",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Paris Boutique Product Catalog",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Premium Cosmetics & Skincare",
                      category: "Beauty Products",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Authentic Perfumes & Fragrances",
                      category: "Fragrances",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Kids Toys & Gifts",
                      category: "Children's Products",
                    },
                  },
                ],
              },
              sameAs: [
                "https://facebook.com/parisboutiquejuba",
                "https://instagram.com/parisboutiquejuba",
                "https://twitter.com/parisboutiquejuba",
              ],
            }),
          }}
        />

        {/* Additional Structured Data for Products */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Paris Boutique Featured Products",
              description: "Featured beauty products and cosmetics available at Paris Boutique Juba",
              numberOfItems: 73,
              itemListElement: [
                {
                  "@type": "Product",
                  position: 1,
                  name: "CeraVe Acne Foaming Cream Cleanser",
                  description: "Gentle yet effective acne cleanser with salicylic acid and ceramides",
                  brand: "CeraVe",
                  category: "Skincare",
                  offers: {
                    "@type": "Offer",
                    price: "25.00",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    seller: {
                      "@type": "Store",
                      name: "Paris Boutique Juba",
                    },
                  },
                },
                {
                  "@type": "Product",
                  position: 2,
                  name: "F&W Paris Glow Kit Premium",
                  description: "Luxurious glow kit with premium ingredients for radiant skin",
                  brand: "F&W Paris",
                  category: "Skincare",
                  offers: {
                    "@type": "Offer",
                    price: "35.00",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    seller: {
                      "@type": "Store",
                      name: "Paris Boutique Juba",
                    },
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-inter antialiased">
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  )
}
