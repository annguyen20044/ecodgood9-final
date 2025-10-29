export async function generateQRCode(data: string): Promise<string> {
  try {
    // Use QR Server API to generate QR code
    const encodedData = encodeURIComponent(data)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
    return qrUrl
  } catch (error) {
    console.error("[v0] QR code generation error:", error)
    return ""
  }
}
