import { NextResponse } from "next/server"
import { DB_CONFIG, UT_TABLES } from "@/lib/db-config"

/**
 * GET /api/users/rights?userid=1
 * Fetches screen rights for a user from ESSUT_Nazimabad.dbo.utuserrights
 *
 * When connected:
 *   SELECT ur.userrightid, ur.userid, ur.screenrightid,
 *          s.screencode, s.screenstxt, m.modulestxt
 *   FROM [ESSUT_Nazimabad].[dbo].[utuserrights] ur
 *   LEFT JOIN [ESSUT_Nazimabad].[dbo].[utscreenrights] sr ON ur.screenrightid = sr.screenrightid
 *   LEFT JOIN [ESSUT_Nazimabad].[dbo].[utscreen] s ON sr.screenid = s.screenid
 *   LEFT JOIN [ESSUT_Nazimabad].[dbo].[utmodule] m ON s.moduleid = m.moduleid
 *   WHERE ur.userid = @userid
 */
export async function GET() {
  const rights = [
    { userrightid: 1, screencode: "DL001", screenstxt: "Token Issuance", modulestxt: "Driving License", canview: true, canadd: true, canedit: true, candelete: false },
    { userrightid: 2, screencode: "DL002", screenstxt: "Registration", modulestxt: "Driving License", canview: true, canadd: true, canedit: true, candelete: false },
    { userrightid: 3, screencode: "DL003", screenstxt: "Academic Test", modulestxt: "Driving License", canview: true, canadd: true, canedit: false, candelete: false },
    { userrightid: 4, screencode: "DL004", screenstxt: "Physical Test", modulestxt: "Driving License", canview: true, canadd: true, canedit: false, candelete: false },
    { userrightid: 5, screencode: "DL005", screenstxt: "Medical Test", modulestxt: "Driving License", canview: true, canadd: false, canedit: false, candelete: false },
    { userrightid: 6, screencode: "DL006", screenstxt: "Book License", modulestxt: "Driving License", canview: true, canadd: true, canedit: true, candelete: true },
    { userrightid: 7, screencode: "UT001", screenstxt: "User Management", modulestxt: "Utility", canview: true, canadd: true, canedit: true, candelete: true },
  ]

  return NextResponse.json({
    database: DB_CONFIG.UT_DATABASE,
    table: `${DB_CONFIG.SCHEMA}.${UT_TABLES.USER_RIGHTS}`,
    connected: false,
    data: rights,
  })
}

/**
 * POST /api/users/rights
 * Assign / revoke rights
 */
export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    message: "Rights updated (mock - database not connected yet)",
    database: DB_CONFIG.UT_DATABASE,
    data: body,
  })
}
