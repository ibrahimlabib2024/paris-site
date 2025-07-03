import type { Metadata } from "next"
import ProductsPageClient from "@/components/products-page-client"

export const metadata: Metadata = {
  title: "Premium Beauty Products & Cosmetics - Paris Boutique Juba",
  description:
    "Shop authentic perfumes, cosmetics, skincare, and kids' products at Paris Boutique Juba. Featuring CeraVe, F&W Paris, baby clothing sets, collectible dolls, and premium beauty essentials in South Sudan.",
  keywords:
    "cosmetics Juba, perfumes South Sudan, CeraVe products, F&W Paris, kids toys Juba, baby clothing, skincare products, authentic beauty products, makeup Juba, fragrance store",
  openGraph: {
    title: "Premium Beauty Products & Cosmetics - Paris Boutique Juba",
    description:
      "Shop authentic perfumes, cosmetics, skincare, and kids' products at Paris Boutique Juba. Premium beauty essentials in South Sudan.",
    images: [
      {
        url: "/images/luxury-cosmetics-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Premium cosmetics and beauty products collection at Paris Boutique Juba",
      },
    ],
  },
  twitter: {
    title: "Premium Beauty Products - Paris Boutique Juba",
    description: "Shop authentic perfumes, cosmetics, skincare, and kids' products at Paris Boutique Juba.",
    images: ["/images/luxury-cosmetics-hero.jpg"],
  },
}

export default function ProductsPage() {
  return <ProductsPageClient />
}
