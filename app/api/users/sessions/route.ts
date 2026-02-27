import { NextResponse } from "next/server"
import { DB_CONFIG, UT_TABLES } from "@/lib/db-config"

/**
 * GET /api/users/sessions
 * Fetches active sessions from ESSUT_Nazimabad.dbo.utsessionhdr
 *
 * When connected:
 *   SELECT s.sessionid, s.userid, u.username, u.fullname,
 *          s.token, s.logintime, s.logouttime, s.expired,
 *          s.ipaddress, s.machinename
 *   FROM [ESSUT_Nazimabad].[dbo].[utsessionhdr] s
 *   LEFT JOIN [ESSUT_Nazimabad].[dbo].[utusers] u ON s.userid = u.userid
 *   ORDER BY s.logintime DESC
 */
export async function GET() {
  const sessions = [
    {
      sessionid: 1001,
      userid: 1,
      username: "admin",
      fullname: "System Administrator",
      logintime: "2026-02-27 08:00:00",
      logouttime: null,
      expired: false,
      ipaddress: "192.168.1.10",
      machinename: "ADMIN-PC",
    },
    {
      sessionid: 1002,
      userid: 2,
      username: "operator1",
      fullname: "Token Operator",
      logintime: "2026-02-27 08:15:00",
      logouttime: null,
      expired: false,
      ipaddress: "192.168.1.20",
      machinename: "TOKEN-PC-01",
    },
  ]

  return NextResponse.json({
    database: DB_CONFIG.UT_DATABASE,
    table: `${DB_CONFIG.SCHEMA}.${UT_TABLES.SESSION_HDR}`,
    connected: false,
    data: sessions,
  })
}
