export interface VietQRParams {
  bankId: string // Bank ID (VD: MB, VCB, TCB)
  accountNumber: string
  accountName: string
  amount?: number // Số tiền (đơn vị: VND)
  addInfo?: string // Nội dung chuyển khoản
  template?: string // Template: compact, compact2, qr_only, print (default: compact)
}

/**
 * Tạo VietQR Quick Link URL
 * Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
 */
export function generateVietQRCode(params: VietQRParams): string {
  try {
    const { bankId, accountNumber, accountName, amount, addInfo, template = "compact" } = params

    // Xóa khoảng trắng và chuyển accountName thành uppercase, không dấu
    const cleanAccountName = accountName
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/\s+/g, " ") // Chuẩn hóa khoảng trắng
      .trim()

    // Xóa khoảng trắng từ addInfo nếu có
    const cleanAddInfo = addInfo
      ? addInfo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
          .replace(/\s+/g, " ")
          .trim()
      : ""

    // Tạo URL
    let qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png`
    
    const queryParams: string[] = []
    if (amount) {
      queryParams.push(`amount=${amount}`)
    }
    if (cleanAddInfo) {
      queryParams.push(`addInfo=${encodeURIComponent(cleanAddInfo)}`)
    }
    if (cleanAccountName) {
      queryParams.push(`accountName=${encodeURIComponent(cleanAccountName)}`)
    }

    if (queryParams.length > 0) {
      qrUrl += `?${queryParams.join("&")}`
    }

    return qrUrl
  } catch (error) {
    console.error("[v0] VietQR generation error:", error)
    return ""
  }
}

/**
 * Legacy function - giữ lại để tương thích ngược
 * @deprecated Sử dụng generateVietQRCode thay thế
 */
export async function generateQRCode(data: string): Promise<string> {
  try {
    // Fallback to QR Server API nếu cần
    const encodedData = encodeURIComponent(data)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
    return qrUrl
  } catch (error) {
    console.error("[v0] QR code generation error:", error)
    return ""
  }
}
