"use client"

import Image from "next/image"
import { Printer, RotateCcw, Clock, Hash, CreditCard, BookOpen, FileText, User, Zap, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TokenData {
  tokenNumber: string
  docType: "cnic" | "passport"
  docNumber: string
  serviceType: string
  servicePrefix: string
  tokenType: string
  tokenTypeNumber: number
  branchName: string
  counter: string
  issuedAt: string
  date: string
}

interface TokenCardProps {
  token: TokenData
  onPrint: () => void
  onNewToken: () => void
}

export function TokenCard({ token, onPrint, onNewToken }: TokenCardProps) {
  const DocIcon = token.docType === "cnic" ? CreditCard : BookOpen
  const docLabel = token.docType === "cnic" ? "CNIC" : "Passport"
  const isFastTrack = token.tokenTypeNumber === 2

  const prefixLabel =
    token.servicePrefix === "L"
      ? "L - Learner"
      : token.servicePrefix === "P"
        ? "P - Permanent"
        : "I - International"

  return (
    <div
      className={`rounded-xl border-2 bg-card overflow-hidden shadow-lg print:shadow-none ${
        isFastTrack ? "border-accent/30" : "border-primary/20"
      }`}
    >
      {/* Header with Logo and Branch */}
      <div className={`flex flex-col items-center gap-3 px-6 pt-6 pb-4 ${isFastTrack ? "bg-accent/5" : "bg-primary/5"}`}>
        <div className="relative h-16 w-16">
          <Image
            src="/images/sindh-police-logo.png"
            alt="Sindh Police Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <h2 className="text-base font-bold text-foreground">Driving License Sindh</h2>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span>{token.branchName}</span>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="border-t-2 border-dashed border-border" />

      {/* Token Type Badge */}
      <div className="flex justify-center px-6 pt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
            isFastTrack
              ? "bg-accent/10 text-accent"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isFastTrack ? <Zap className="h-4 w-4" /> : <User className="h-4 w-4" />}
          {"Type "}{token.tokenTypeNumber}{" - "}{isFastTrack ? "Fast Track (Senior Citizen)" : "Normal"}
        </span>
      </div>

      {/* Token Number */}
      <div className="flex flex-col items-center gap-2 px-6 pt-4 pb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Token Number</p>
        <p
          className={`text-5xl font-black tracking-tight font-mono ${
            isFastTrack ? "text-accent" : "text-primary"
          }`}
        >
          {token.tokenNumber}
        </p>
        <span
          className={`mt-1 inline-block rounded-md px-3 py-1 text-xs font-bold tracking-wide ${
            isFastTrack
              ? "bg-accent/10 text-accent"
              : "bg-primary/10 text-primary"
          }`}
        >
          {prefixLabel}
        </span>
      </div>

      {/* Dashed Separator */}
      <div className="mx-6 border-t border-dashed border-border" />

      {/* Token Details */}
      <div className="flex flex-col gap-2.5 px-6 py-4">
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <DocIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{docLabel}</span>
          </div>
          <span className="text-sm font-semibold text-foreground font-mono">{token.docNumber}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">License Type</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.serviceType}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Counter</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.counter}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Issued At</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.issuedAt}</span>
        </div>
      </div>

      {/* Date */}
      <p className="px-6 pb-4 text-center text-xs text-muted-foreground">{token.date}</p>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row print:hidden">
        <Button
          onClick={onPrint}
          className={`h-11 flex-1 gap-2 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg ${
            isFastTrack
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Printer className="h-4 w-4" />
          Print Token
        </Button>
        <Button
          onClick={onNewToken}
          variant="outline"
          className="h-11 flex-1 gap-2 rounded-lg font-semibold transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          New Token
        </Button>
      </div>
    </div>
  )
}
