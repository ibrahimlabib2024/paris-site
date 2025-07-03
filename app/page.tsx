import { Suspense } from "react"
import Navigation from "../navigation"
import HeroSection from "../hero-section"
import { LazyProductShowcase, LazyAboutSection, LazyTestimonialsSection } from "@/components/lazy-component"
import PromotionalBanner from "../promotional-banner"
import ContactSection from "../contact-section"
import Footer from "../footer"
import FloatingWhatsAppButton from "../floating-whatsapp-button"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="bg-white">
        {/* Critical above-the-fold content - load immediately */}
        <HeroSection />

        {/* Below-the-fold content - lazy load */}
        <div className="bg-white">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
            <LazyProductShowcase />
          </Suspense>

          <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
            <LazyAboutSection />
          </Suspense>

          <PromotionalBanner />

          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
            <LazyTestimonialsSection />
          </Suspense>

          <ContactSection />
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  )
}
