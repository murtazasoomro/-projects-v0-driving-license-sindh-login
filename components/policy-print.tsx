"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, FileText } from "lucide-react"

interface PolicyPrintProps {
  data: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

export function PolicyPrint({ data, onChange }: PolicyPrintProps) {
  const printAfterSave = !!data.printrptaftersave
  const leAttach = !!data.leattach

  return (
    <div className="flex flex-col gap-6">
      {/* Print Options */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Printer className="h-4 w-4 text-primary" />
            Print Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="printrptaftersave" className="text-sm font-medium cursor-pointer">
                Print Report After Save
              </Label>
              <Switch
                id="printrptaftersave"
                checked={printAfterSave}
                onCheckedChange={(v) => onChange("printrptaftersave", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label
                htmlFor="printchallan"
                className={`text-sm font-medium cursor-pointer ${!printAfterSave ? "text-muted-foreground" : ""}`}
              >
                Print Challan
              </Label>
              <Switch
                id="printchallan"
                checked={!!data.printchallan}
                onCheckedChange={(v) => onChange("printchallan", v)}
                disabled={!printAfterSave}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label
                htmlFor="printprocesssteps"
                className={`text-sm font-medium cursor-pointer ${!printAfterSave ? "text-muted-foreground" : ""}`}
              >
                Print Process Steps (Learner)
              </Label>
              <Switch
                id="printprocesssteps"
                checked={!!data.printprocesssteps}
                onCheckedChange={(v) => onChange("printprocesssteps", v)}
                disabled={!printAfterSave}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="printprocessstepsperminent" className="text-sm font-medium cursor-pointer">
                Print Process Steps (Permanent)
              </Label>
              <Switch
                id="printprocessstepsperminent"
                checked={!!data.printprocessstepsperminent}
                onCheckedChange={(v) => onChange("printprocessstepsperminent", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="printprocessstepsidp" className="text-sm font-medium cursor-pointer">
                Print Process Steps (IDP)
              </Label>
              <Switch
                id="printprocessstepsidp"
                checked={!!data.printprocessstepsidp}
                onCheckedChange={(v) => onChange("printprocessstepsidp", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="canprintduplicatechallanslip" className="text-sm font-medium cursor-pointer">
                Print Duplicate Challan Slip
              </Label>
              <Switch
                id="canprintduplicatechallanslip"
                checked={!!data.canprintduplicatechallanslip}
                onCheckedChange={(v) => onChange("canprintduplicatechallanslip", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="canprintduplicatepaymentslip" className="text-sm font-medium cursor-pointer">
                Print Duplicate Payment Slip
              </Label>
              <Switch
                id="canprintduplicatepaymentslip"
                checked={!!data.canprintduplicatepaymentslip}
                onCheckedChange={(v) => onChange("canprintduplicatepaymentslip", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="gpobookintigrated" className="text-sm font-medium cursor-pointer">
                GPO Book Integrated
              </Label>
              <Switch
                id="gpobookintigrated"
                checked={!!data.gpobookintigrated}
                onCheckedChange={(v) => onChange("gpobookintigrated", v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report & Tray Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Reports & Tray Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="learnerreportid" className="text-sm font-medium">
                Learner Report
              </Label>
              <Select
                value={String(data.learnerreportid || "")}
                onValueChange={(v) => onChange("learnerreportid", v)}
              >
                <SelectTrigger id="learnerreportid">
                  <SelectValue placeholder="Select Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Learner Report - Standard</SelectItem>
                  <SelectItem value="2">Learner Report - Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="permanentreportid"
                className={`text-sm font-medium ${leAttach ? "text-muted-foreground" : ""}`}
              >
                Permanent Report
              </Label>
              <Select
                value={String(data.permanentreportid || "")}
                onValueChange={(v) => onChange("permanentreportid", v)}
                disabled={leAttach}
              >
                <SelectTrigger id="permanentreportid">
                  <SelectValue placeholder="Select Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Permanent Report - Standard</SelectItem>
                  <SelectItem value="2">Permanent Report - Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="verificationreportid" className="text-sm font-medium">
                Verification Code Report
              </Label>
              <Select
                value={String(data.verificationreportid || "")}
                onValueChange={(v) => onChange("verificationreportid", v)}
              >
                <SelectTrigger id="verificationreportid">
                  <SelectValue placeholder="Select Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Verification Report - A</SelectItem>
                  <SelectItem value="2">Verification Report - B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="licensetray" className="text-sm font-medium">
                License Tray
              </Label>
              <Input
                id="licensetray"
                placeholder="Enter license tray"
                value={String(data.licensetray || "")}
                onChange={(e) => onChange("licensetray", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profiletray" className="text-sm font-medium">
                Profile Tray
              </Label>
              <Input
                id="profiletray"
                placeholder="Enter profile tray"
                value={String(data.profiletray || "")}
                onChange={(e) => onChange("profiletray", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Laser / Printer Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Printer className="h-4 w-4 text-primary" />
            Laser Engraver & Printer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 md:col-span-2 lg:col-span-3">
              <Label htmlFor="leattach" className="text-sm font-medium cursor-pointer">
                LE Report Attach (Card Print Mode)
              </Label>
              <Switch
                id="leattach"
                checked={leAttach}
                onCheckedChange={(v) => onChange("leattach", v)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="cardtempid"
                className={`text-sm font-medium ${!leAttach ? "text-muted-foreground" : ""}`}
              >
                Card Template
              </Label>
              <Select
                value={String(data.cardtempid || "")}
                onValueChange={(v) => onChange("cardtempid", v)}
                disabled={!leAttach}
              >
                <SelectTrigger id="cardtempid">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Standard Card Template</SelectItem>
                  <SelectItem value="2">Premium Card Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="laserip"
                className={`text-sm font-medium ${!leAttach ? "text-muted-foreground" : ""}`}
              >
                Laser IP
              </Label>
              <Input
                id="laserip"
                placeholder="e.g. 192.168.1.100"
                value={String(data.laserip || "")}
                onChange={(e) => onChange("laserip", e.target.value)}
                disabled={!leAttach}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="leprinterip"
                className={`text-sm font-medium ${!leAttach ? "text-muted-foreground" : ""}`}
              >
                Printer IP
              </Label>
              <Input
                id="leprinterip"
                placeholder="e.g. 192.168.1.101"
                value={String(data.leprinterip || "")}
                onChange={(e) => onChange("leprinterip", e.target.value)}
                disabled={!leAttach}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="leprintername"
                className={`text-sm font-medium ${!leAttach ? "text-muted-foreground" : ""}`}
              >
                Printer Name
              </Label>
              <Select
                value={String(data.leprintername || "")}
                onValueChange={(v) => onChange("leprintername", v)}
                disabled={!leAttach}
              >
                <SelectTrigger id="leprintername">
                  <SelectValue placeholder="Select Printer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="printer1">Laser Printer - 01</SelectItem>
                  <SelectItem value="printer2">Laser Printer - 02</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
