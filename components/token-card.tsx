"use client"

import Image from "next/image"
import { Printer, RotateCcw } from "lucide-react"
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
  const docLabel = token.docType === "cnic" ? "CNIC" : "Passport"
  const isFastTrack = token.tokenTypeNumber === 2

  const prefixLabel =
    token.servicePrefix === "L"
      ? "Learner"
      : token.servicePrefix === "P"
        ? "Permanent"
        : "International"

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Thermal receipt card - 80mm width */}
      <div
        id="thermal-token"
        className="thermal-receipt mx-auto w-[302px] bg-card text-card-foreground border border-border shadow-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-1 px-4 pt-4 pb-2">
          <div className="relative h-12 w-12">
            <Image
              src="/images/sindh-police-logo.png"
              alt="Sindh Police Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-foreground">
            Driving License Sindh
          </p>
          <p className="text-[9px] text-muted-foreground">{token.branchName}</p>
        </div>

        {/* Dashed line */}
        <div className="mx-3 border-t border-dashed border-foreground/30" />

        {/* Token Type Badge */}
        <div className="flex justify-center px-4 pt-2 pb-1">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isFastTrack
                ? "bg-accent/15 text-accent"
                : "bg-primary/10 text-primary"
            }`}
          >
            {"Type "}{token.tokenTypeNumber}{" - "}{isFastTrack ? "Fast Track / Senior" : "Normal"}
          </span>
        </div>

        {/* Token Number - large and centered */}
        <div className="flex flex-col items-center px-4 pt-1 pb-1">
          <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
            Token No.
          </p>
          <p
            className={`text-4xl font-black tracking-tight font-mono leading-tight ${
              isFastTrack ? "text-accent" : "text-primary"
            }`}
          >
            {token.tokenNumber}
          </p>
        </div>

        {/* License type */}
        <div className="flex justify-center px-4 pb-2">
          <span className="rounded bg-secondary px-3 py-0.5 text-[10px] font-bold text-secondary-foreground">
            {token.servicePrefix}{" - "}{prefixLabel}
          </span>
        </div>

        {/* Dashed line */}
        <div className="mx-3 border-t border-dashed border-foreground/30" />

        {/* Details rows - compact */}
        <div className="flex flex-col gap-0 px-4 py-2">
          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] text-muted-foreground">{docLabel}</span>
            <span className="text-[11px] font-semibold font-mono text-foreground">{token.docNumber}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] text-muted-foreground">License Type</span>
            <span className="text-[11px] font-semibold text-foreground">{token.serviceType}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] text-muted-foreground">Counter</span>
            <span className="text-[11px] font-semibold text-foreground">{token.counter}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] text-muted-foreground">Time</span>
            <span className="text-[11px] font-semibold font-mono text-foreground">{token.issuedAt}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] text-muted-foreground">Date</span>
            <span className="text-[11px] font-semibold text-foreground">{token.date}</span>
          </div>
        </div>

        {/* Dashed line */}
        <div className="mx-3 border-t border-dashed border-foreground/30" />

        {/* Footer message */}
        <div className="flex flex-col items-center gap-0.5 px-4 pt-2 pb-4">
          <p className="text-[9px] text-muted-foreground text-center">
            Please wait for your token number to be called.
          </p>
          <p className="text-[8px] text-muted-foreground/60 text-center">
            Sindh Police - Proud to Serve
          </p>
        </div>
      </div>

      {/* Action buttons - outside the receipt, hidden on print */}
      <div className="flex w-[302px] gap-3 print:hidden">
        <Button
          onClick={onPrint}
          className={`h-10 flex-1 gap-2 rounded-lg text-sm font-semibold ${
            isFastTrack
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={onNewToken}
          variant="outline"
          className="h-10 flex-1 gap-2 rounded-lg text-sm font-semibold"
        >
          <RotateCcw className="h-4 w-4" />
          New Token
        </Button>
      </div>
    </div>
  )
}
