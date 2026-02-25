"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { TokenHeader } from "@/components/token-header"
import { TokenIssuanceForm } from "@/components/token-issuance-form"
import { TokenCard } from "@/components/token-card"
import type { TokenData } from "@/components/token-card"
import { TokenStats } from "@/components/token-stats"

const SERVICE_LABELS: Record<string, string> = {
  learner: "Learner",
  permanent: "Permanent",
  international: "International",
}

const SERVICE_PREFIX: Record<string, string> = {
  learner: "L",
  permanent: "P",
  international: "I",
}

export default function TokenIssuancePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Token state
  const [isIssuing, setIsIssuing] = useState(false)
  const [issuedToken, setIssuedToken] = useState<TokenData | null>(null)
  const [tokenCounter, setTokenCounter] = useState(0)
  const [branchName, setBranchName] = useState("")

  // Session info
  const [sessionId, setSessionId] = useState(0)
  const [branchId, setBranchId] = useState(0)
  const [userId, setUserId] = useState(0)

  // Session timer
  const [sessionStart, setSessionStart] = useState("")
  const [sessionDuration, setSessionDuration] = useState("00:00:00")
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)

  // Auth & session check
  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    const sessionActive = sessionStorage.getItem("dls_session_active")
    const sessionStartTime = sessionStorage.getItem("dls_session_start")
    const sessionStartTs = sessionStorage.getItem("dls_session_start_ts")
    const branch = sessionStorage.getItem("dls_branch_name")
    const sessId = sessionStorage.getItem("dls_session_id")
    const brId = sessionStorage.getItem("dls_branch_id")
    const usId = sessionStorage.getItem("dls_user_id")

    if (auth !== "true" || sessionActive !== "true") {
      router.replace("/")
      return
    }

    setUsername(user || "Officer")
    setSessionStart(sessionStartTime || "--:--:--")
    setStartTimestamp(sessionStartTs ? Number(sessionStartTs) : Date.now())
    setBranchName(branch || "DLS Branch Office")
    setSessionId(parseInt(sessId || "0"))
    setBranchId(parseInt(brId || "0"))
    setUserId(parseInt(usId || "0"))
    setIsAuthenticated(true)
  }, [router])

  // Duration timer
  useEffect(() => {
    if (!startTimestamp) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")
      const seconds = String(elapsed % 60).padStart(2, "0")
      setSessionDuration(`${hours}:${minutes}:${seconds}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTimestamp])

  const handleIssueToken = useCallback(
    async (
      docType: "cnic" | "passport",
      docNumber: string,
      serviceId: string,
      tokenType: string,
      tokenTypeNumber: number
    ) => {
      setIsIssuing(true)

      try {
        const res = await fetch("/api/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            docType,
            docNumber,
            serviceType: serviceId,
            tokenType,
            tokenTypeNumber,
            sessionId,
            branchId,
            userId,
          }),
        })

        const data = await res.json()

        if (data.success) {
          setTokenCounter((prev) => prev + 1)
          setIssuedToken(data.token as TokenData)
        } else {
          // Fallback: generate token locally if API fails
          generateLocalToken(docType, docNumber, serviceId, tokenType, tokenTypeNumber)
        }
      } catch {
        // Fallback: generate token locally if API fails
        generateLocalToken(docType, docNumber, serviceId, tokenType, tokenTypeNumber)
      }

      setIsIssuing(false)
    },
    [sessionId, branchId, userId]
  )

  const generateLocalToken = useCallback(
    (
      docType: "cnic" | "passport",
      docNumber: string,
      serviceId: string,
      tokenType: string,
      tokenTypeNumber: number
    ) => {
      const newCount = tokenCounter + 1
      setTokenCounter(newCount)
      const servicePrefix = SERVICE_PREFIX[serviceId] || "T"
      const typeIndicator = tokenTypeNumber === 2 ? "F" : ""
      const now = new Date()
      const token: TokenData = {
        tokenNumber: `${servicePrefix}${typeIndicator}-${String(newCount).padStart(4, "0")}`,
        docType,
        docNumber,
        serviceType: SERVICE_LABELS[serviceId] || serviceId,
        servicePrefix,
        tokenType,
        tokenTypeNumber,
        branchName,
        counter: tokenTypeNumber === 2 ? "Counter 01 (Priority)" : "Counter 03",
        issuedAt: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }
      setIssuedToken(token)
    },
    [tokenCounter, branchName]
  )

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleNewToken = useCallback(() => {
    setIssuedToken(null)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.replace("/")
  }, [router])

  const handleBack = useCallback(() => {
    router.push("/session")
  }, [router])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TokenHeader username={username} onLogout={handleLogout} onBack={handleBack} />

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          {/* Session Stats Bar */}
          <TokenStats
            tokensIssued={tokenCounter}
            sessionStart={sessionStart}
            sessionDuration={sessionDuration}
          />

          {/* Main Content */}
          {issuedToken ? (
            <div className="mx-auto w-full max-w-md">
              <TokenCard
                token={issuedToken}
                onPrint={handlePrint}
                onNewToken={handleNewToken}
              />
            </div>
          ) : (
            <TokenIssuanceForm onIssueToken={handleIssueToken} isIssuing={isIssuing} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured by Sindh Police IT Department</span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center">
            {"Government of Sindh - All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  )
}
