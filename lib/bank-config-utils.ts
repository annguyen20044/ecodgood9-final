const BANK_CONFIG_STORAGE_KEY = "bank_config"

export interface BankConfig {
  id?: number
  bankName: string
  bankId?: string // Bank ID cho VietQR (VD: MB, VC, TC)
  acqId?: string // BIN code 6 số (VD: 970422)
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

// Mapping bank name to VietQR Bank ID
const BANK_ID_MAP: Record<string, { bankId: string; acqId: string }> = {
  "Ngân hàng MBBank": { bankId: "MB", acqId: "970422" },
  "Ngân hàng Vietcombank": { bankId: "VCB", acqId: "970436" },
  "Ngân hàng Techcombank": { bankId: "TCB", acqId: "970407" },
  "Ngân hàng BIDV": { bankId: "BIDV", acqId: "970418" },
  "Ngân hàng Agribank": { bankId: "VBA", acqId: "970405" },
  "Ngân hàng VietinBank": { bankId: "CTG", acqId: "970415" },
  "Ngân hàng VPBank": { bankId: "VPB", acqId: "970432" },
  "Ngân hàng ACB": { bankId: "ACB", acqId: "970416" },
  "Ngân hàng TPBank": { bankId: "TPB", acqId: "970423" },
  "Ngân hàng HDBank": { bankId: "HDB", acqId: "970437" },
  "Ngân hàng SHB": { bankId: "SHB", acqId: "970443" },
}

const VIETNAMESE_BANKS: Bank[] = [
  {
    id: "mbbank",
    name: "Ngân hàng MBBank",
    bankName: "Ngân hàng MBBank",
    bankId: "MB",
    acqId: "970422",
    accountName: "EcoGood",
    accountNumber: "1088656788888",
    branch: "Chi nhánh TP.HCM",
    swiftCode: "MSCBVNVX",
  },
  {
    id: "vietcombank",
    name: "Ngân hàng Vietcombank",
    bankName: "Ngân hàng Vietcombank",
    bankId: "VCB",
    acqId: "970436",
    accountName: "EcoGood Coffee",
    accountNumber: "1234567890",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "BFTVVNVX",
  },
  {
    id: "techcombank",
    name: "Ngân hàng Techcombank",
    bankName: "Ngân hàng Techcombank",
    bankId: "TCB",
    acqId: "970407",
    accountName: "EcoGood Coffee",
    accountNumber: "9876543210",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "TCOMVNVX",
  },
  {
    id: "bidv",
    name: "Ngân hàng BIDV",
    bankName: "Ngân hàng BIDV",
    bankId: "BIDV",
    acqId: "970418",
    accountName: "EcoGood Coffee",
    accountNumber: "1111111111",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "BIDVVNVX",
  },
  {
    id: "agribank",
    name: "Ngân hàng Agribank",
    bankName: "Ngân hàng Agribank",
    bankId: "VBA",
    acqId: "970405",
    accountName: "EcoGood Coffee",
    accountNumber: "2222222222",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "AGBAVNVX",
  },
  {
    id: "vietinbank",
    name: "Ngân hàng VietinBank",
    bankName: "Ngân hàng VietinBank",
    bankId: "CTG",
    acqId: "970415",
    accountName: "EcoGood Coffee",
    accountNumber: "3333333333",
    branch: "Chi nhánh Hà Nội",
    swiftCode: "CTBAVNVX",
  },
]

// Get VietQR Bank ID from bank name
export function getVietQRBankId(bankName: string): { bankId: string; acqId: string } | null {
  return BANK_ID_MAP[bankName] || null
}

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
