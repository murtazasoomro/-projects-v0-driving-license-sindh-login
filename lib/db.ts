import sql from "mssql"

const config: sql.config = {
  server: process.env.MSSQL_HOST || "localhost",
  port: parseInt(process.env.MSSQL_PORT || "1433"),
  database: process.env.MSSQL_DATABASE || "DrivingLicenseSindh",
  user: process.env.MSSQL_USER || "sa",
  password: process.env.MSSQL_PASSWORD || "",
  options: {
    encrypt: false, // Set true if using Azure SQL
    trustServerCertificate: true, // For local dev
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool
  }
  pool = await sql.connect(config)
  return pool
}

export { sql }
