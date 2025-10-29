/**
 * EcoGood React App Loader for WordPress
 * This file loads the compiled React app from the Next.js backend
 */

;(() => {
  const config = window.ecogoodConfig || {}
  const apiUrl = config.apiUrl || "http://localhost:3000"

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Load React libraries
      await loadScript("https://unpkg.com/react@19/umd/react.production.min.js")
      await loadScript("https://unpkg.com/react-dom@19/umd/react-dom.production.min.js")

      const renderComponent = async (componentName, rootId) => {
        const root = document.getElementById(rootId)
        if (!root) return

        try {
          const response = await fetch(`${apiUrl}/api/components/${componentName}`)
          const html = await response.text()
          root.innerHTML = html
        } catch (error) {
          console.error(`Error loading component ${componentName}:`, error)
        }
      }

      renderComponent("products", "ecogood-products-root")
      renderComponent("cart", "ecogood-cart-root")
      renderComponent("hero", "ecogood-hero-root")
      renderComponent("featured", "ecogood-featured-root")
    } catch (error) {
      console.error("Error initializing EcoGood app:", error)
    }
  })
})()
