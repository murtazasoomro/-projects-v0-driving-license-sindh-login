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
import { ShieldCheck, MessageSquare, Mail } from "lucide-react"

interface PolicyNadraSmsProps {
  data: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

export function PolicyNadraSms({ data, onChange }: PolicyNadraSmsProps) {
  const nadraIntegrated = !!data.nadraintegrate
  const onValidityPolicy = !!data.onvaliditypolicy

  return (
    <div className="flex flex-col gap-6">
      {/* NADRA Integration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" />
            NADRA Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 md:col-span-2 lg:col-span-3">
              <Label htmlFor="nadraintegrate" className="text-sm font-medium cursor-pointer">
                NADRA Integrate
              </Label>
              <Switch
                id="nadraintegrate"
                checked={nadraIntegrated}
                onCheckedChange={(v) => onChange("nadraintegrate", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label
                htmlFor="onexpirypolicy"
                className={`text-sm font-medium cursor-pointer ${!nadraIntegrated ? "text-muted-foreground" : ""}`}
              >
                On Expiry Policy
              </Label>
              <Switch
                id="onexpirypolicy"
                checked={!!data.onexpirypolicy}
                onCheckedChange={(v) => onChange("onexpirypolicy", v)}
                disabled={!nadraIntegrated}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label
                htmlFor="onvaliditypolicy"
                className={`text-sm font-medium cursor-pointer ${!nadraIntegrated ? "text-muted-foreground" : ""}`}
              >
                On Validity Policy
              </Label>
              <Switch
                id="onvaliditypolicy"
                checked={onValidityPolicy}
                onCheckedChange={(v) => onChange("onvaliditypolicy", v)}
                disabled={!nadraIntegrated}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="nadravalidity"
                className={`text-sm font-medium ${!onValidityPolicy ? "text-muted-foreground" : ""}`}
              >
                NADRA Validity (Days)
              </Label>
              <Input
                id="nadravalidity"
                type="number"
                placeholder="Enter days"
                value={String(data.nadravalidity || "")}
                onChange={(e) => onChange("nadravalidity", e.target.value)}
                disabled={!onValidityPolicy}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-primary" />
            SMS Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="sendsms" className="text-sm font-medium cursor-pointer">
                Send SMS
              </Label>
              <Switch
                id="sendsms"
                checked={!!data.sendsms}
                onCheckedChange={(v) => onChange("sendsms", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="logsms" className="text-sm font-medium cursor-pointer">
                Log SMS
              </Label>
              <Switch
                id="logsms"
                checked={!!data.logsms}
                onCheckedChange={(v) => onChange("logsms", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="requestcondosms" className="text-sm font-medium cursor-pointer">
                Send SMS on Request
              </Label>
              <Switch
                id="requestcondosms"
                checked={!!data.requestcondosms}
                onCheckedChange={(v) => onChange("requestcondosms", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="approvecondosms" className="text-sm font-medium cursor-pointer">
                Send SMS on Approval
              </Label>
              <Switch
                id="approvecondosms"
                checked={!!data.approvecondosms}
                onCheckedChange={(v) => onChange("approvecondosms", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="tcsbookingsms" className="text-sm font-medium cursor-pointer">
                TCS Booking SMS
              </Label>
              <Switch
                id="tcsbookingsms"
                checked={!!data.tcsbookingsms}
                onCheckedChange={(v) => onChange("tcsbookingsms", v)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="bookingsmstempid"
                className={`text-sm font-medium ${!data.tcsbookingsms ? "text-muted-foreground" : ""}`}
              >
                Booking SMS Template
              </Label>
              <Select
                value={String(data.bookingsmstempid || "")}
                onValueChange={(v) => onChange("bookingsmstempid", v)}
                disabled={!data.tcsbookingsms}
              >
                <SelectTrigger id="bookingsmstempid">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SMS Template - Default</SelectItem>
                  <SelectItem value="2">SMS Template - Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMTP / Email Configuration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4 text-primary" />
            SMTP / Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="spname" className="text-sm font-medium">SP Name</Label>
              <Input
                id="spname"
                placeholder="Service Provider Name"
                value={String(data.spname || "")}
                onChange={(e) => onChange("spname", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="spemail" className="text-sm font-medium">SP Email</Label>
              <Input
                id="spemail"
                type="email"
                placeholder="email@example.com"
                value={String(data.spemail || "")}
                onChange={(e) => onChange("spemail", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="spusername" className="text-sm font-medium">SP Username</Label>
              <Input
                id="spusername"
                placeholder="Username"
                value={String(data.spusername || "")}
                onChange={(e) => onChange("spusername", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sppassword" className="text-sm font-medium">SP Password</Label>
              <Input
                id="sppassword"
                type="password"
                placeholder="Password"
                value={String(data.sppassword || "")}
                onChange={(e) => onChange("sppassword", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="spincoming" className="text-sm font-medium">Incoming Server</Label>
              <Input
                id="spincoming"
                placeholder="imap.example.com"
                value={String(data.spincoming || "")}
                onChange={(e) => onChange("spincoming", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="spoutgoing" className="text-sm font-medium">Outgoing Server</Label>
              <Input
                id="spoutgoing"
                placeholder="smtp.example.com"
                value={String(data.spoutgoing || "")}
                onChange={(e) => onChange("spoutgoing", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
