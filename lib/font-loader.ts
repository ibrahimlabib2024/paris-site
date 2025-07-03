// Font loading utilities
export const loadFont = (fontFamily: string, fontUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve()
      return
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = fontUrl
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load font: ${fontFamily}`))
    document.head.appendChild(link)
  })
}

export const preloadFonts = async (): Promise<void> => {
  const fonts = [
    {
      family: "Inter",
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    },
    {
      family: "Playfair Display",
      url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
    },
  ]

  try {
    await Promise.all(fonts.map((font) => loadFont(font.family, font.url)))
  } catch (error) {
    console.warn("Font loading failed:", error)
  }
}

export default { loadFont, preloadFonts }
