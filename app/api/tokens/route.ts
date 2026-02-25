import { NextResponse } from "next/server"
import { getConnection, sql } from "@/lib/db"

const SERVICE_PREFIX: Record<string, string> = {
  learner: "L",
  permanent: "P",
  international: "I",
}

const SERVICE_LABELS: Record<string, string> = {
  learner: "Learner",
  permanent: "Permanent",
  international: "International",
}

// POST - Issue a new token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { docType, docNumber, serviceType, tokenType, tokenTypeNumber, sessionId, branchId, userId } = body

    if (!docType || !docNumber || !serviceType || !tokenType || !sessionId || !branchId || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const pool = await getConnection()

    // Get today's token count for this branch + service to generate the token number
    const countResult = await pool
      .request()
      .input("branchId", sql.Int, branchId)
      .input("serviceType", sql.NVarChar, serviceType)
      .query(`
        SELECT COUNT(*) as tokenCount FROM Tokens 
        WHERE BranchId = @branchId 
          AND ServiceType = @serviceType
          AND CAST(IssuedAt AS DATE) = CAST(GETDATE() AS DATE)
      `)

    const tokenCount = countResult.recordset[0].tokenCount + 1
    const prefix = SERVICE_PREFIX[serviceType] || "T"
    const typeIndicator = tokenTypeNumber === 2 ? "F" : ""
    const tokenNumber = `${prefix}${typeIndicator}-${String(tokenCount).padStart(4, "0")}`
    const counter = tokenTypeNumber === 2 ? "Counter 01 (Priority)" : "Counter 03"

    // Insert token
    const result = await pool
      .request()
      .input("tokenNumber", sql.NVarChar, tokenNumber)
      .input("docType", sql.NVarChar, docType)
      .input("docNumber", sql.NVarChar, docNumber)
      .input("serviceType", sql.NVarChar, serviceType)
      .input("servicePrefix", sql.NVarChar, prefix)
      .input("tokenType", sql.NVarChar, tokenType)
      .input("tokenTypeNumber", sql.Int, tokenTypeNumber)
      .input("counter", sql.NVarChar, counter)
      .input("sessionId", sql.Int, sessionId)
      .input("branchId", sql.Int, branchId)
      .input("userId", sql.Int, userId)
      .query(`
        INSERT INTO Tokens (TokenNumber, DocType, DocNumber, ServiceType, ServicePrefix, TokenType, TokenTypeNumber, Counter, SessionId, BranchId, IssuedBy)
        OUTPUT INSERTED.TokenId, INSERTED.TokenNumber, INSERTED.IssuedAt
        VALUES (@tokenNumber, @docType, @docNumber, @serviceType, @servicePrefix, @tokenType, @tokenTypeNumber, @counter, @sessionId, @branchId, @userId)
      `)

    const token = result.recordset[0]

    // Get branch name
    const branchResult = await pool
      .request()
      .input("branchId", sql.Int, branchId)
      .query(`SELECT BranchName FROM Branches WHERE BranchId = @branchId`)

    const branchName = branchResult.recordset[0]?.BranchName || "DLS Branch"

    return NextResponse.json({
      success: true,
      token: {
        tokenId: token.TokenId,
        tokenNumber: token.TokenNumber,
        docType,
        docNumber,
        serviceType: SERVICE_LABELS[serviceType] || serviceType,
        servicePrefix: prefix,
        tokenType,
        tokenTypeNumber,
        branchName,
        counter,
        issuedAt: new Date(token.IssuedAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        date: new Date(token.IssuedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    })
  } catch (error) {
    console.error("Issue token error:", error)
    return NextResponse.json(
      { error: "Failed to issue token" },
      { status: 500 }
    )
  }
}

// GET - Get today's token count for a session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      )
    }

    const pool = await getConnection()

    const result = await pool
      .request()
      .input("sessionId", sql.Int, parseInt(sessionId))
      .query(`
        SELECT COUNT(*) as tokenCount FROM Tokens 
        WHERE SessionId = @sessionId
      `)

    return NextResponse.json({
      count: result.recordset[0].tokenCount,
    })
  } catch (error) {
    console.error("Get tokens error:", error)
    return NextResponse.json(
      { error: "Failed to get token count" },
      { status: 500 }
    )
  }
}
