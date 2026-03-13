import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { query } from "@/lib/db/mssql"

interface DbUser {
  userid: number
  username: string
  fullname: string | null
  emailid: string | null
  utblock: boolean
  roleId: number | null
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // Hash password with MD5 (matching the database)
    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex")

    // Query user from database - table is 'utusers' with MD5 hashed password
    const users = await query<DbUser>(
      `SELECT userid, username, fullname, emailid, utblock, roleId
       FROM utusers 
       WHERE username = @username AND password = @hashedPassword AND ISNULL(utblock, 0) = 0`,
      { username, hashedPassword }
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const user = users[0]

    if (user.utblock) {
      return NextResponse.json(
        { error: "User account is blocked" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          userid: user.userid,
          loginid: user.username,
          fullname: user.fullname || user.username,
          email: user.emailid,
          roleid: user.roleId,
          busunitid: 1, // Default business unit
          busunitname: "Sindh Police - DL Branch",
        },
      },
    })
  } catch (error) {
    console.error("[API] Login error:", error)
    return NextResponse.json(
      { error: "Database connection failed. Please check server configuration." },
      { status: 500 }
    )
  }
}
