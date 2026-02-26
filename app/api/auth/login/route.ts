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

    // Plain text password check for development.
    // In production, use bcrypt: await bcrypt.compare(password, user.PasswordHash)
    const isValidPassword = password === user.PasswordHash

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
