import { NextResponse } from "next/server"
import { DB_CONFIG, UT_TABLES } from "@/lib/db-config"

/**
 * GET /api/users
 * Fetches users from ESSUT_Nazimabad.dbo.utusers
 *
 * When database is connected, replace mock data with:
 *   const pool = await sql.connect(getConnectionConfig("ut"))
 *   const result = await pool.request().query(
 *     `SELECT userid, username, fullname, emailid, cellno, empid,
 *             usertypeid, userstatusid, profileid, roleId, userclientid,
 *             usercatid, utblock
 *      FROM [${DB_CONFIG.UT_DATABASE}].[${DB_CONFIG.SCHEMA}].[${UT_TABLES.USERS}]
 *      ORDER BY userid`
 *   )
 */
export async function GET() {
  // Placeholder: return mock data until SQL Server is connected
  const users = [
    {
      userid: 1,
      username: "admin",
      fullname: "System Administrator",
      emailid: "admin@dlms.gov.pk",
      cellno: "0300-0000000",
      empid: 1001,
      usertypeid: 1,
      userstatusid: 1,
      profileid: 1,
      roleId: 1,
      userclientid: 1,
      usercatid: 1,
      utblock: false,
    },
    {
      userid: 2,
      username: "operator1",
      fullname: "Token Operator",
      emailid: "operator1@dlms.gov.pk",
      cellno: "0321-1234567",
      empid: 1002,
      usertypeid: 2,
      userstatusid: 1,
      profileid: 2,
      roleId: 2,
      userclientid: 1,
      usercatid: 1,
      utblock: false,
    },
    {
      userid: 3,
      username: "examiner1",
      fullname: "Academic Examiner",
      emailid: "examiner1@dlms.gov.pk",
      cellno: "0333-9876543",
      empid: 1003,
      usertypeid: 3,
      userstatusid: 1,
      profileid: 3,
      roleId: 3,
      userclientid: 1,
      usercatid: 1,
      utblock: false,
    },
  ]

  return NextResponse.json({
    database: DB_CONFIG.UT_DATABASE,
    table: `${DB_CONFIG.SCHEMA}.${UT_TABLES.USERS}`,
    connected: false,
    data: users,
  })
}

/**
 * POST /api/users
 * Creates a new user in utusers
 */
export async function POST(request: Request) {
  const body = await request.json()

  // Placeholder: When connected, use:
  //   const pool = await sql.connect(getConnectionConfig("ut"))
  //   await pool.request()
  //     .input("username", sql.NVarChar, body.username)
  //     .input("password", sql.NVarChar, hashedPassword)
  //     .input("fullname", sql.NVarChar, body.fullname)
  //     ...
  //     .query(`INSERT INTO [${DB_CONFIG.UT_DATABASE}].[${DB_CONFIG.SCHEMA}].[${UT_TABLES.USERS}] ...`)

  return NextResponse.json({
    success: true,
    message: "User created (mock - database not connected yet)",
    database: DB_CONFIG.UT_DATABASE,
    data: { ...body, userid: Date.now() },
  })
}
