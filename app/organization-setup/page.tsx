"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { SetupPageHeader } from "@/components/setup-page-header"
import { SettingsTileGrid, type SettingsTile } from "@/components/settings-tile-grid"

const ORG_TILES: SettingsTile[] = [
  { id: "business-area", label: "Business Area" },
  { id: "business-unit", label: "Business Unit" },
  { id: "department", label: "Department" },
  { id: "site", label: "Site" },
  { id: "warehouse", label: "Warehouse" },
  { id: "business-type", label: "Business Type" },
  { id: "legal-entity", label: "Legal Entity" },
  { id: "cost-center", label: "Cost Center" },
]

export default function OrganizationSetupPage() {
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
        title="Organization Setup"
        username={username}
        onLogout={handleLogout}
        onBack={handleBack}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Organization Setup</h1>
            <p className="text-sm text-muted-foreground">
              Configure organizational units, departments, and business structure
            </p>
          </div>
        </div>

        <SettingsTileGrid tiles={ORG_TILES} />
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Driving License Sindh - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
