const BANK_CONFIG_STORAGE_KEY = "bank_config"

export interface BankConfig {
  id?: number
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
  swiftCode?: string
  banks?: Bank[]
  updated_at?: string
}

export interface Bank extends BankConfig {
  id: string
  name: string
}

const VIETNAMESE_BANKS: Bank[] = [
  {
    id: "vietcombank",
    name: "Ngân hàng Vietcombank",
    bankName: "Ngân hàng Vietcombank",
    accountName: "EcoGood Coffee",
    accountNumber: "1234567890",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "BFTVVNVX",
  },
  {
    id: "techcombank",
    name: "Ngân hàng Techcombank",
    bankName: "Ngân hàng Techcombank",
    accountName: "EcoGood Coffee",
    accountNumber: "9876543210",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "TCOMVNVX",
  },
  {
    id: "bidv",
    name: "Ngân hàng BIDV",
    bankName: "Ngân hàng BIDV",
    accountName: "EcoGood Coffee",
    accountNumber: "1111111111",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "BIDVVNVX",
  },
  {
    id: "agribank",
    name: "Ngân hàng Agribank",
    bankName: "Ngân hàng Agribank",
    accountName: "EcoGood Coffee",
    accountNumber: "2222222222",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "AGBAVNVX",
  },
  {
    id: "vietinbank",
    name: "Ngân hàng VietinBank",
    bankName: "Ngân hàng VietinBank",
    accountName: "EcoGood Coffee",
    accountNumber: "3333333333",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "CTBAVNVX",
  },
]

// Get bank config from localStorage
export function getBankConfigFromStorage(): BankConfig {
  if (typeof window === "undefined") return VIETNAMESE_BANKS[0]

  try {
    const stored = localStorage.getItem(BANK_CONFIG_STORAGE_KEY)
    return stored ? JSON.parse(stored) : VIETNAMESE_BANKS[0]
  } catch {
    return VIETNAMESE_BANKS[0]
  }
}

// Save bank config to localStorage
export function saveBankConfigToStorage(config: BankConfig): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(BANK_CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error("[v0] Failed to save bank config to localStorage:", error)
  }
}

// Get all Vietnamese banks
export function getVietnameseBanks(): Bank[] {
  return VIETNAMESE_BANKS
}
