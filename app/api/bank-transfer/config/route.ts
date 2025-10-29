import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getVietnameseBanks, type BankConfig } from "@/lib/bank-config-utils"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    let bankConfig: BankConfig | null = null

    try {
      const { data, error } = await supabase
        .from("bank_configs")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
          console.log("[v0] Bank config table not found, using defaults")
        } else if (error.code === "PGRST116") {
          // No rows found - this is expected if table exists but is empty
          console.log("[v0] No bank config found, using defaults")
        } else {
          console.error("[v0] Database error:", error.message)
        }
      } else if (data) {
        bankConfig = {
          bankName: data.bank_name,
          accountName: data.account_name,
          accountNumber: data.account_number,
          branch: data.branch,
          swiftCode: data.swift_code,
          updated_at: data.updated_at,
        }
        console.log("[v0] Bank config loaded from Supabase")
      }
    } catch (dbError: any) {
      console.log("[v0] Bank config fetch error (using defaults):", dbError?.message)
    }

    // If no config from DB, use defaults
    if (!bankConfig) {
      bankConfig = getVietnameseBanks()[0]
    }

    return NextResponse.json({
      success: true,
      banks: getVietnameseBanks(),
      bankConfig,
    })
  } catch (error) {
    console.error("[v0] Bank config endpoint error:", error)
    // Return defaults on error
    return NextResponse.json({
      success: true,
      banks: getVietnameseBanks(),
      bankConfig: getVietnameseBanks()[0],
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bankName, accountName, accountNumber, branch, swiftCode } = body

    // Validate required fields
    if (!bankName || !accountName || !accountNumber || !branch) {
      return NextResponse.json({ error: "Missing required bank information" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const updatedConfig: BankConfig = {
      bankName,
      accountName,
      accountNumber,
      branch,
      swiftCode: swiftCode || "",
      updated_at: new Date().toISOString(),
    }

    let savedConfig = updatedConfig

    try {
      const { data, error } = await supabase
        .from("bank_configs")
        .upsert(
          {
            bank_name: bankName,
            account_name: accountName,
            account_number: accountNumber,
            branch,
            swift_code: swiftCode || "",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        )
        .select()
        .single()

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
          console.log("[v0] Bank config table not found, config saved to response only")
        } else {
          console.error("[v0] Database error:", error.message)
        }
      } else if (data) {
        savedConfig = {
          bankName: data.bank_name,
          accountName: data.account_name,
          accountNumber: data.account_number,
          branch: data.branch,
          swiftCode: data.swift_code,
          updated_at: data.updated_at,
        }
        console.log("[v0] Bank config saved to Supabase")
      }
    } catch (dbError: any) {
      console.log("[v0] Bank config save error (config still valid):", dbError?.message)
    }

    console.log("[v0] Updated bank config:", updatedConfig)

    return NextResponse.json({ success: true, bankConfig: savedConfig })
  } catch (error) {
    console.error("[v0] Bank config update error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update bank configuration" },
      { status: 500 },
    )
  }
}
