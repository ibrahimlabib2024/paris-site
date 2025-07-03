"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Facebook } from "lucide-react"

export default function Footer() {
  const [logoClickCount, setLogoClickCount] = useState(0)
  const [adminProducts, setAdminProducts] = useState([])

  // Load products from localStorage
  const loadAdminProducts = () => {
    if (typeof window !== "undefined") {
      try {
        const savedProducts = localStorage.getItem("admin-products")
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts)
          setAdminProducts(parsedProducts)
        } else {
          setAdminProducts([])
        }
      } catch (error) {
        console.error("Error loading admin products:", error)
        setAdminProducts([])
      }
    }
  }

  // Load admin products on component mount
  useEffect(() => {
    loadAdminProducts()
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "admin-products") {
        loadAdminProducts()
      }
    }

    const handleProductsUpdated = () => {
      loadAdminProducts()
    }

    const handleWindowFocus = () => {
      loadAdminProducts()
    }

    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", handleStorageChange)

    // Listen for custom events (same-tab)
    window.addEventListener("productsUpdated", handleProductsUpdated)

    // Listen for window focus (when switching back to tab)
    window.addEventListener("focus", handleWindowFocus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("productsUpdated", handleProductsUpdated)
      window.removeEventListener("focus", handleWindowFocus)
    }
  }, [])

  // Check if category has products
  const getCategoryInfo = (categoryId: string) => {
    const categoryProducts = adminProducts.filter((product) => product.categoryId === categoryId)
    return {
      count: categoryProducts.length,
      hasProducts: categoryProducts.length > 0,
    }
  }

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1
    setLogoClickCount(newCount)

    if (newCount >= 5) {
      // Redirect to admin login after 5 clicks
      window.location.href = "/admin/login"
      return
    }

    // Reset counter after 3 seconds of inactivity
    setTimeout(() => {
      setLogoClickCount(0)
    }, 3000)
  }

  const perfumesInfo = getCategoryInfo("perfumes")
  const makeupInfo = getCategoryInfo("makeup")
  const bathBodyInfo = getCategoryInfo("bath-body")

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleLogoClick}
              title={logoClickCount > 0 ? `${5 - logoClickCount} more clicks for admin...` : ""}
            >
              <div className="relative w-10 h-10">
                <Image src="/images/eiffel-tower-icon.png" alt="Paris Boutique Logo" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent uppercase">
                  Paris Boutique
                </h3>
                <p className="text-xs text-gray-400 uppercase">Premium Beauty & Cosmetics</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier destination for luxury perfumes and cosmetics in South Sudan. We bring you the finest beauty
              products from around the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://web.facebook.com/profile.php?id=61550634274725"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@parisboutique1?_t=8p2Kn2UILUT&_r=1&fbclid=IwY2xjawLDb7NleHRuA2FlbQIxMABicmlkETFQRTRGemZCSkZlcWdveEN0AR6a9u0SwDyXxbedtqnboD05joP6k61vjaoIZccDTN09-sOXDtWbI4h2lC-4MQ_aem_UM7HPUD1ISIZeQs0Y7dcnw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Skincare
                </Link>
              </li>
              <li>
                {perfumesInfo.hasProducts ? (
                  <Link
                    href="/products?category=perfumes"
                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span>Perfumes</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      {perfumesInfo.count}
                    </span>
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm">Perfumes (Coming Soon)</span>
                )}
              </li>
              <li>
                {makeupInfo.hasProducts ? (
                  <Link
                    href="/products?category=makeup"
                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span>Makeup</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">{makeupInfo.count}</span>
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm">Makeup (Coming Soon)</span>
                )}
              </li>
              <li>
                {bathBodyInfo.hasProducts ? (
                  <Link
                    href="/products?category=bath-body"
                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span>Bath & Body</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      {bathBodyInfo.count}
                    </span>
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm">Bath & Body (Coming Soon)</span>
                )}
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Juba, South Sudan</p>
                  <p className="text-gray-400 text-xs">Central Business District</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <a href="tel:+211985575533" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  +211 985 575 533
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <a
                  href="mailto:Kamaladam12@gmail.com"
                  className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                >
                  Kamaladam12@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p className="text-gray-400 text-xs">Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2024 Paris Boutique. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
