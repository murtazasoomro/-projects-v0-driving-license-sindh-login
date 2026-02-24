"use client"

import { useState } from "react"
import { CreditCard, BookOpen, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SERVICES = [
  { id: "new-license", label: "New License", description: "First time license issuance" },
  { id: "renewal", label: "Renewal", description: "Renew existing license" },
  { id: "duplicate", label: "Duplicate", description: "Lost or damaged license" },
  { id: "international", label: "International DL", description: "International driving permit" },
  { id: "learner", label: "Learner Permit", description: "Learner driving permit" },
  { id: "endorsement", label: "Endorsement", description: "Add vehicle category" },
]

interface TokenIssuanceFormProps {
  onIssueToken: (docType: "cnic" | "passport", docNumber: string, service: string) => void
  isIssuing: boolean
}

export function TokenIssuanceForm({ onIssueToken, isIssuing }: TokenIssuanceFormProps) {
  const [docType, setDocType] = useState<"cnic" | "passport">("cnic")
  const [docNumber, setDocNumber] = useState("")
  const [selectedService, setSelectedService] = useState("")

  const formatCNIC = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  }

  const handleDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (docType === "cnic") {
      setDocNumber(formatCNIC(e.target.value))
    } else {
      setDocNumber(e.target.value.toUpperCase())
    }
  }

  const isCnicValid = docType === "cnic" && docNumber.replace(/\D/g, "").length === 13
  const isPassportValid = docType === "passport" && docNumber.trim().length >= 6
  const isDocValid = isCnicValid || isPassportValid
  const canSubmit = isDocValid && selectedService && !isIssuing

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onIssueToken(docType, docNumber, selectedService)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Document Type & Number Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-foreground">Token Issuance</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Enter applicant document number and select service to issue a token.
        </p>

        {/* Document Type Toggle */}
        <div className="mb-5">
          <Label className="mb-2 block text-sm font-medium text-foreground">
            Document Type
          </Label>
          <div className="flex rounded-lg border border-border bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => {
                setDocType("cnic")
                setDocNumber("")
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                docType === "cnic"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              CNIC
            </button>
            <button
              type="button"
              onClick={() => {
                setDocType("passport")
                setDocNumber("")
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                docType === "passport"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Passport
            </button>
          </div>
        </div>

        {/* Document Number Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="doc-number" className="text-sm font-medium text-foreground">
            {docType === "cnic" ? "CNIC Number" : "Passport Number"}
          </Label>
          <Input
            id="doc-number"
            type="text"
            placeholder={
              docType === "cnic" ? "XXXXX-XXXXXXX-X" : "Enter passport number"
            }
            value={docNumber}
            onChange={handleDocNumberChange}
            required
            className="h-12 rounded-lg border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary font-mono text-base tracking-wider"
          />
          <p className="text-xs text-muted-foreground">
            {docType === "cnic"
              ? "Enter 13-digit CNIC number (e.g., 42201-1234567-1)"
              : "Enter passport number (e.g., AB1234567)"}
          </p>
        </div>
      </div>

      {/* Service Selection Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-foreground">Select Service</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Choose the type of license service for this token.
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service.id)}
              className={`flex flex-col items-start rounded-lg border px-4 py-3.5 text-left transition-all ${
                selectedService === service.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  selectedService === service.id ? "text-primary" : "text-foreground"
                }`}
              >
                {service.label}
              </span>
              <span className="text-xs text-muted-foreground">{service.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Issue Token Button */}
      <Button
        type="submit"
        disabled={!canSubmit}
        className="h-13 w-full gap-2.5 rounded-xl bg-primary text-primary-foreground text-base font-bold shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-50"
      >
        {isIssuing ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Token...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Issue Token
          </span>
        )}
      </Button>
    </form>
  )
}
