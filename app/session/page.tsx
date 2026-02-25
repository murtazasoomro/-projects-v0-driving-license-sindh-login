"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { SessionHeader } from "@/components/session-header"
import { BranchInfoCard } from "@/components/branch-info-card"
import { SessionControls } from "@/components/session-controls"

export default function SessionPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState("00:00:00")
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Branch info from login
  const [branchName, setBranchName] = useState("")
  const [branchCode, setBranchCode] = useState("")
  const [branchAddress, setBranchAddress] = useState("")
  const [branchPhone, setBranchPhone] = useState("")
  const [branchTimings, setBranchTimings] = useState("")

  // Check authentication and load branch info
  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    setBranchName(sessionStorage.getItem("dls_branch_name") || "DLS Branch Office")
    setBranchCode(sessionStorage.getItem("dls_branch_code") || "---")
    setBranchAddress(sessionStorage.getItem("dls_branch_address") || "---")
    setBranchPhone(sessionStorage.getItem("dls_branch_phone") || "---")
    setBranchTimings(sessionStorage.getItem("dls_branch_timings") || "---")
    setIsAuthenticated(true)
  }, [router])

  // Duration timer
  useEffect(() => {
    if (!isSessionActive || !startTimestamp) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")
      const seconds = String(elapsed % 60).padStart(2, "0")
      setSessionDuration(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSessionActive, startTimestamp])

  const handleStartSession = useCallback(async () => {
    const userId = sessionStorage.getItem("dls_user_id")
    const branchId = sessionStorage.getItem("dls_branch_id")

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId || "0"),
          branchId: parseInt(branchId || "0"),
        }),
      })

      const data = await res.json()

      if (data.success) {
        const now = new Date()
        const timeStr = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        setSessionStartTime(timeStr)
        setStartTimestamp(Date.now())
        setIsSessionActive(true)
        setSessionDuration("00:00:00")

        // Store session info
        sessionStorage.setItem("dls_session_active", "true")
        sessionStorage.setItem("dls_session_id", String(data.session.sessionId))
        sessionStorage.setItem("dls_session_start", timeStr)
        sessionStorage.setItem("dls_session_start_ts", String(Date.now()))

        router.push("/token-issuance")
      }
    } catch {
      // Fallback: still navigate even if API fails (for offline dev)
      const now = new Date()
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      sessionStorage.setItem("dls_session_active", "true")
      sessionStorage.setItem("dls_session_id", "0")
      sessionStorage.setItem("dls_session_start", timeStr)
      sessionStorage.setItem("dls_session_start_ts", String(Date.now()))
      router.push("/token-issuance")
    }
  }, [router])

  const handleCloseSession = useCallback(async () => {
    const sessionId = sessionStorage.getItem("dls_session_id")
    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: parseInt(sessionId || "0") }),
      })
    } catch {
      // Ignore API failure
    }
    setIsSessionActive(false)
    setStartTimestamp(null)
    sessionStorage.removeItem("dls_session_active")
    sessionStorage.removeItem("dls_session_id")
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.replace("/")
  }, [router])

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionHeader username={username} onLogout={handleLogout} />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* Welcome message */}
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              {"Welcome back, "}{username}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your branch session below. Start a session to begin processing applications.
            </p>
          </div>

          {/* Branch info from DB */}
          <BranchInfoCard
            branchName={branchName}
            branchCode={branchCode}
            address={branchAddress}
            phone={branchPhone}
            timings={branchTimings}
          />

          {/* Session controls */}
          <SessionControls
            isSessionActive={isSessionActive}
            sessionStartTime={sessionStartTime}
            sessionDuration={sessionDuration}
            todayDate={todayDate}
            onStartSession={handleStartSession}
            onCloseSession={handleCloseSession}
          />
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
