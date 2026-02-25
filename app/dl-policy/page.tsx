"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PolicyHeader } from "@/components/policy-header"
import { PolicyGeneral } from "@/components/policy-general"
import { PolicyPrint } from "@/components/policy-print"
import { PolicyNadraSms } from "@/components/policy-nadra-sms"
import { PolicyPermissions } from "@/components/policy-permissions"
import { Save, RotateCcw, Settings, Printer, ShieldCheck, Lock } from "lucide-react"

export default function DLPolicyPage() {
  const router = useRouter()
  const [username, setUsername] = useState("Admin")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState<Record<string, unknown>>({
    entityid: "",
    siteid: "",
    processvalidtydays: "",
    skiptokentime: "",
    tokengenbaseoncnic: "",
    muliprocessallow: false,
    notshowtokens: false,
    notshowtokensonled: false,
    showviolationonreg: false,
    intigratewithviolationsys: false,
    commercialcondonation: false,
    printrptaftersave: false,
    printchallan: false,
    printprocesssteps: false,
    printprocessstepsperminent: false,
    printprocessstepsidp: false,
    canprintduplicatechallanslip: false,
    canprintduplicatepaymentslip: false,
    gpobookintigrated: false,
    learnerreportid: "",
    permanentreportid: "",
    verificationreportid: "",
    licensetray: "",
    profiletray: "",
    leattach: false,
    cardtempid: "",
    laserip: "",
    leprinterip: "",
    leprintername: "",
    nadraintegrate: false,
    onexpirypolicy: false,
    onvaliditypolicy: false,
    nadravalidity: "",
    sendsms: false,
    logsms: false,
    requestcondosms: false,
    approvecondosms: false,
    tcsbookingsms: false,
    bookingsmstempid: "",
    spname: "",
    spemail: "",
    spusername: "",
    sppassword: "",
    spincoming: "",
    spoutgoing: "",
    canchangefirstname: false,
    canchangelastname: false,
    canchangefathername: false,
    canchangedateofbirth: false,
    canchangecnic: false,
    canchangeaddress: false,
    canchangebloodgroup: false,
    canchangeidentificationmark: false,
    canchangecnicexpiry: false,
    canchangecontactno: false,
  })

  useEffect(() => {
    const authenticated = sessionStorage.getItem("dls_authenticated")
    if (!authenticated) {
      router.push("/")
      return
    }
    const user = sessionStorage.getItem("dls_user")
    if (user) setUsername(user)
  }, [router])

  const handleChange = useCallback((key: string, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value }

      // Conditional logic matching original C# behavior
      if (key === "printrptaftersave" && !value) {
        updated.printchallan = false
        updated.printprocesssteps = false
      }
      if (key === "nadraintegrate" && !value) {
        updated.onexpirypolicy = false
        updated.onvaliditypolicy = false
        updated.nadravalidity = ""
      }
      if (key === "onvaliditypolicy" && !value) {
        updated.nadravalidity = ""
      }
      if (key === "leattach" && value) {
        updated.permanentreportid = ""
      }
      if (key === "leattach" && !value) {
        updated.cardtempid = ""
        updated.laserip = ""
        updated.leprinterip = ""
        updated.leprintername = ""
      }
      if (key === "tcsbookingsms" && !value) {
        updated.bookingsmstempid = ""
      }

      return updated
    })
  }, [])

  const handleSave = useCallback(() => {
    setIsSaving(true)
    setSaveSuccess(false)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }, [])

  const handleReset = useCallback(() => {
    setFormData((prev) => {
      const reset: Record<string, unknown> = {}
      for (const key in prev) {
        reset[key] = typeof prev[key] === "boolean" ? false : ""
      }
      return reset
    })
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.push("/")
  }, [router])

  const handleBack = useCallback(() => {
    router.push("/token-issuance")
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PolicyHeader username={username} onLogout={handleLogout} onBack={handleBack} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6">
        {/* Page Title */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">DL Policy Configuration</h1>
            <p className="text-sm text-muted-foreground">
              Manage driving license process settings, print options, integrations, and permissions.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : saveSuccess ? "Saved" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Success Banner */}
        {saveSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Policy settings saved successfully.
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="general" className="flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm">
              <Settings className="h-3.5 w-3.5" />
              General
            </TabsTrigger>
            <TabsTrigger value="print" className="gap-1.5 text-xs sm:text-sm">
              <Printer className="h-3.5 w-3.5" />
              Print & Reports
            </TabsTrigger>
            <TabsTrigger value="nadra-sms" className="gap-1.5 text-xs sm:text-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              NADRA & SMS
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-1.5 text-xs sm:text-sm">
              <Lock className="h-3.5 w-3.5" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <PolicyGeneral data={formData} onChange={handleChange} />
          </TabsContent>

          <TabsContent value="print">
            <PolicyPrint data={formData} onChange={handleChange} />
          </TabsContent>

          <TabsContent value="nadra-sms">
            <PolicyNadraSms data={formData} onChange={handleChange} />
          </TabsContent>

          <TabsContent value="permissions">
            <PolicyPermissions data={formData} onChange={handleChange} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-3">
        <p className="text-center text-xs text-muted-foreground">
          Driving License Sindh (DLS) - Policy Configuration - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
