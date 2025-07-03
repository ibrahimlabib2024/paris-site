// Utility functions for admin panel

export interface Product {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  image: string
  alt: string
  rating: number
  reviews: number
  inStock: boolean
  isPopular: boolean
  isNew: boolean
  categoryId: string
  features: string[]
  benefits: string[]
  category: string
  dateAdded: string
}

export interface OrderInquiry {
  id: number
  productName: string
  price: string
  timestamp: string
  message: string
  userAgent?: string
}

// Function to log WhatsApp inquiries
export const logWhatsAppInquiry = (productName: string, price: string) => {
  const inquiry: OrderInquiry = {
    id: Date.now(),
    productName,
    price,
    timestamp: new Date().toISOString(),
    message: `Hi! I'm interested in purchasing the ${productName} (${price}). Could you please provide more details about availability, delivery options, and any current promotions?`,
    userAgent: navigator.userAgent,
  }

  // Get existing inquiries from localStorage
  const existingInquiries = JSON.parse(localStorage.getItem("admin-inquiries") || "[]")

  // Add new inquiry
  const updatedInquiries = [inquiry, ...existingInquiries]

  // Save back to localStorage
  localStorage.setItem("admin-inquiries", JSON.stringify(updatedInquiries))

  return inquiry
}

// Function to get products from localStorage
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("admin-products") || "[]")
}

// Function to save products to localStorage
export const saveProducts = (products: Product[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin-products", JSON.stringify(products))
}

// Function to get inquiries from localStorage
export const getInquiries = (): OrderInquiry[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("admin-inquiries") || "[]")
}

// Function to save inquiries to localStorage
export const saveInquiries = (inquiries: OrderInquiry[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin-inquiries", JSON.stringify(inquiries))
}

// Function to format currency
export const formatCurrency = (amount: string) => {
  return amount.startsWith("SSP") ? amount : `SSP ${amount}`
}

// Function to validate product data
export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = []

  if (!product.title?.trim()) {
    errors.push("Title is required")
  }

  if (!product.price?.trim()) {
    errors.push("Price is required")
  }

  if (!product.description?.trim()) {
    errors.push("Description is required")
  }

  if (!product.image?.trim()) {
    errors.push("Image is required")
  }

  return errors
}

// Function to generate product slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Function to calculate discount percentage
export const calculateDiscount = (originalPrice: string, currentPrice: string): number => {
  const original = Number.parseFloat(originalPrice.replace(/[^0-9.]/g, ""))
  const current = Number.parseFloat(currentPrice.replace(/[^0-9.]/g, ""))

  if (original && current && original > current) {
    return Math.round(((original - current) / original) * 100)
  }

  return 0
}
