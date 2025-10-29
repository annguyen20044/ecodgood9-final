/**
 * EcoGood Admin App
 * Loads admin components for managing products, orders, etc.
 */

;(() => {
  const config = window.ecogoodConfig || {}
  const apiUrl = config.apiUrl || "http://localhost:3000"

  document.addEventListener("DOMContentLoaded", async () => {
    const adminRoot = document.getElementById("ecogood-admin-root")
    if (!adminRoot) return

    try {
      // Fetch admin dashboard from Next.js
      const response = await fetch(`${apiUrl}/api/admin/dashboard`)
      const html = await response.text()
      adminRoot.innerHTML = html
    } catch (error) {
      console.error("Error loading admin dashboard:", error)
      adminRoot.innerHTML = `<div style="padding: 2rem; color: red;">Error loading admin dashboard. Please check your API URL in settings.</div>`
    }
  })
})()
