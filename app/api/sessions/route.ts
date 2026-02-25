import { NextResponse } from "next/server"
import { getConnection, sql } from "@/lib/db"

// POST - Start a new session
export async function POST(request: Request) {
  try {
    const { userId, branchId } = await request.json()

    if (!userId || !branchId) {
      return NextResponse.json(
        { error: "userId and branchId are required" },
        { status: 400 }
      )
    }

    const pool = await getConnection()

    // Close any existing active sessions for this user
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        UPDATE Sessions SET IsActive = 0, EndTime = GETDATE()
        WHERE UserId = @userId AND IsActive = 1
      `)

    // Create new session
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("branchId", sql.Int, branchId)
      .query(`
        INSERT INTO Sessions (UserId, BranchId, StartTime, IsActive)
        OUTPUT INSERTED.SessionId, INSERTED.StartTime
        VALUES (@userId, @branchId, GETDATE(), 1)
      `)

    const session = result.recordset[0]

    return NextResponse.json({
      success: true,
      session: {
        sessionId: session.SessionId,
        startTime: session.StartTime,
      },
    })
  } catch (error) {
    console.error("Start session error:", error)
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    )
  }
}

// PATCH - Close an active session
export async function PATCH(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      )
    }

    const pool = await getConnection()

    await pool
      .request()
      .input("sessionId", sql.Int, sessionId)
      .query(`
        UPDATE Sessions SET IsActive = 0, EndTime = GETDATE()
        WHERE SessionId = @sessionId
      `)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Close session error:", error)
    return NextResponse.json(
      { error: "Failed to close session" },
      { status: 500 }
    )
  }
}
