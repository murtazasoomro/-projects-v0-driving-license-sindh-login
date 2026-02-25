import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

// GET - Get all active branches
export async function GET() {
  try {
    const pool = await getConnection()

    const result = await pool
      .request()
      .query(`
        SELECT BranchId, BranchName, BranchCode, Address, Phone, Timings
        FROM Branches
        WHERE IsActive = 1
        ORDER BY BranchName
      `)

    return NextResponse.json({ branches: result.recordset })
  } catch (error) {
    console.error("Get branches error:", error)
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    )
  }
}
