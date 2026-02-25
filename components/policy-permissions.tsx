"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface PolicyPermissionsProps {
  data: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

const FIELD_PERMISSIONS = [
  { key: "canchangefirstname", label: "First Name" },
  { key: "canchangelastname", label: "Last Name" },
  { key: "canchangefathername", label: "Father Name" },
  { key: "canchangedateofbirth", label: "Date of Birth" },
  { key: "canchangecnic", label: "CNIC" },
  { key: "canchangeaddress", label: "Address" },
  { key: "canchangebloodgroup", label: "Blood Group" },
  { key: "canchangeidentificationmark", label: "Identification Mark" },
  { key: "canchangecnicexpiry", label: "CNIC Expiry" },
  { key: "canchangecontactno", label: "Contact No" },
]

export function PolicyPermissions({ data, onChange }: PolicyPermissionsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="h-4 w-4 text-primary" />
          Field Change Permissions
        </CardTitle>
        <CardDescription>
          Control which applicant fields can be modified by operators during the license process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FIELD_PERMISSIONS.map((perm) => (
            <div
              key={perm.key}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3"
            >
              <Label htmlFor={perm.key} className="text-sm font-medium cursor-pointer">
                {perm.label}
              </Label>
              <Switch
                id={perm.key}
                checked={!!data[perm.key]}
                onCheckedChange={(v) => onChange(perm.key, v)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
