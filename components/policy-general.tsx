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
import { Building2, Settings } from "lucide-react"

interface PolicyGeneralProps {
  data: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

export function PolicyGeneral({ data, onChange }: PolicyGeneralProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Entity & Site */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Entity & Site
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="entityid" className="text-sm font-medium">Entity</Label>
              <Select
                value={String(data.entityid || "")}
                onValueChange={(v) => onChange("entityid", v)}
              >
                <SelectTrigger id="entityid">
                  <SelectValue placeholder="Select Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sindh Police - Karachi</SelectItem>
                  <SelectItem value="2">Sindh Police - Hyderabad</SelectItem>
                  <SelectItem value="3">Sindh Police - Sukkur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="siteid" className="text-sm font-medium">Site</Label>
              <Select
                value={String(data.siteid || "")}
                onValueChange={(v) => onChange("siteid", v)}
              >
                <SelectTrigger id="siteid">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Head Office</SelectItem>
                  <SelectItem value="2">Branch Office - I</SelectItem>
                  <SelectItem value="3">Branch Office - II</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" />
            Process Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="processvalidtydays" className="text-sm font-medium">
                Process Validity Days
              </Label>
              <Input
                id="processvalidtydays"
                type="number"
                placeholder="Enter days"
                value={String(data.processvalidtydays || "")}
                onChange={(e) => onChange("processvalidtydays", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skiptokentime" className="text-sm font-medium">
                Skip Token Time (min)
              </Label>
              <Input
                id="skiptokentime"
                type="number"
                placeholder="Enter minutes"
                value={String(data.skiptokentime || "")}
                onChange={(e) => onChange("skiptokentime", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tokengenbaseoncnic" className="text-sm font-medium">
                Token Gen Based on CNIC
              </Label>
              <Input
                id="tokengenbaseoncnic"
                type="number"
                placeholder="Enter value"
                value={String(data.tokengenbaseoncnic || "")}
                onChange={(e) => onChange("tokengenbaseoncnic", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="muliprocessallow" className="text-sm font-medium cursor-pointer">
                Multi Process Allow
              </Label>
              <Switch
                id="muliprocessallow"
                checked={!!data.muliprocessallow}
                onCheckedChange={(v) => onChange("muliprocessallow", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="notshowtokens" className="text-sm font-medium cursor-pointer">
                Not Show Tokens
              </Label>
              <Switch
                id="notshowtokens"
                checked={!!data.notshowtokens}
                onCheckedChange={(v) => onChange("notshowtokens", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="notshowtokensonled" className="text-sm font-medium cursor-pointer">
                Not Show Tokens on LED
              </Label>
              <Switch
                id="notshowtokensonled"
                checked={!!data.notshowtokensonled}
                onCheckedChange={(v) => onChange("notshowtokensonled", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="showviolationonreg" className="text-sm font-medium cursor-pointer">
                Show Violation History
              </Label>
              <Switch
                id="showviolationonreg"
                checked={!!data.showviolationonreg}
                onCheckedChange={(v) => onChange("showviolationonreg", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="intigratewithviolationsys" className="text-sm font-medium cursor-pointer">
                Integrate with Violation Sys
              </Label>
              <Switch
                id="intigratewithviolationsys"
                checked={!!data.intigratewithviolationsys}
                onCheckedChange={(v) => onChange("intigratewithviolationsys", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Label htmlFor="commercialcondonation" className="text-sm font-medium cursor-pointer">
                Commercial Condonation
              </Label>
              <Switch
                id="commercialcondonation"
                checked={!!data.commercialcondonation}
                onCheckedChange={(v) => onChange("commercialcondonation", v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
