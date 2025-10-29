export function generateSKU(productName: string, productId?: number): string {
  // Format: ECO-{CATEGORY}-{TIMESTAMP}
  // Example: ECO-BAG-1761489807

  const timestamp = Math.floor(Date.now() / 1000)
    .toString()
    .slice(-6)
  const namePrefix = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3)

  return `ECO-${namePrefix}-${timestamp}`
}

export function isValidSKU(sku: string): boolean {
  // SKU format: ECO-XXX-XXXXXX
  return /^ECO-[A-Z0-9]{3}-\d{6}$/.test(sku)
}
