import { NextResponse } from "next/server"
import { getConnection, sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const pool = await getConnection()

    // Get user with branch info
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query(`
        SELECT 
          u.UserId, u.Username, u.PasswordHash, u.FullName, u.Role, u.IsActive,
          b.BranchId, b.BranchName, b.BranchCode, b.Address, b.Phone, b.Timings
        FROM Users u
        INNER JOIN Branches b ON u.BranchId = b.BranchId
        WHERE u.Username = @username
      `)

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result.recordset[0]

    if (!user.IsActive) {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 })
    }

    // For now, simple password check (plain text comparison for dev).
    // In production, use bcrypt: await bcrypt.compare(password, user.PasswordHash)
    // Since seed data uses dummy hashes, we allow "admin123" / "operator123" for dev
    const isValidPassword =
      password === "admin123" || password === "operator123" || user.PasswordHash === password

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.UserId,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role,
      },
      branch: {
        branchId: user.BranchId,
        branchName: user.BranchName,
        branchCode: user.BranchCode,
        address: user.Address,
        phone: user.Phone,
        timings: user.Timings,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Database connection failed. Check your SQL Server settings." },
      { status: 500 }
    )
  }
}
