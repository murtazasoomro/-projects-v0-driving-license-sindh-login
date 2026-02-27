"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Database } from "lucide-react"
import { SetupPageHeader } from "@/components/setup-page-header"
import { SettingsTileGrid, type SettingsTile } from "@/components/settings-tile-grid"

const MASTER_TILES: SettingsTile[] = [
  { id: "media-type", label: "Media Type" },
  { id: "religion", label: "Religion" },
  { id: "qualification-type", label: "Qualification Type" },
  { id: "qualification", label: "Qualification" },
  { id: "relation-type", label: "Relation Type" },
  { id: "reason", label: "Reason" },
  { id: "blood-group", label: "Blood Group" },
  { id: "gender", label: "Gender" },
  { id: "marital-status", label: "Marital Status" },
  { id: "city", label: "City" },
]

export default function MasterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")

    if (auth !== "true") {
      router.replace("/")
      return
    }

    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.replace("/")
  }

  const handleBack = () => {
    router.push("/session")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader
        title="Master Data"
        username={username}
        onLogout={handleLogout}
        onBack={handleBack}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Master Data</h1>
            <p className="text-sm text-muted-foreground">
              Manage core reference data used across the system
            </p>
          </div>
        </div>

        <SettingsTileGrid tiles={MASTER_TILES} />
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Driving License Sindh - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
