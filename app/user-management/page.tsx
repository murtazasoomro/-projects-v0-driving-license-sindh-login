"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Users,
  Shield,
  Monitor,
  Key,
  Settings,
  Building2,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
  UserPlus,
  Trash2,
  Copy,
  Lock,
  Unlock,
} from "lucide-react"

/* ───────────── lookup helper ───────────── */
function LookupField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  readOnly = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="min-w-[120px] text-right text-xs font-semibold text-foreground">
        {label}
      </label>
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-7 pr-7 text-xs"
          readOnly={readOnly}
        />
        {!readOnly && (
          <Search className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

/* ───────────── section header ───────────── */
function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 text-xs font-bold text-foreground">
      <Icon className="h-3.5 w-3.5" />
      {title}
    </div>
  )
}

/* ───────────── Tab Types ───────────── */
type TabId = "users" | "profiles" | "screen-rights" | "sessions" | "apps" | "sites" | "modules"

const TABS: { id: TabId; label: string; icon: React.ElementType; shortcut?: string }[] = [
  { id: "users", label: "Users", icon: Users, shortcut: "F6" },
  { id: "profiles", label: "Profiles / Roles", icon: Shield, shortcut: "F7" },
  { id: "screen-rights", label: "Screen Rights", icon: Key, shortcut: "F8" },
  { id: "sessions", label: "Sessions", icon: Monitor, shortcut: "F9" },
  { id: "apps", label: "Applications", icon: Settings },
  { id: "sites", label: "Sites", icon: Building2 },
  { id: "modules", label: "Modules", icon: Globe },
]

/* ═══════════════ USERS TAB ═══════════════ */
function UsersTab() {
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    userid: "",
    username: "",
    password: "",
    fullname: "",
    emailid: "",
    cellno: "",
    empid: "",
    profileid: "",
    profileName: "",
    roleId: "",
    roleName: "",
    usertypeid: "",
    userstatusid: "",
    userclientid: "",
    clientName: "",
    usercatid: "",
    utblock: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setUser((p) => ({ ...p, [field]: value }))
  }

  return (
    <div className="space-y-3 p-3">
      {/* User Basic Info */}
      <SectionHeader title="User Information" icon={Users} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        <LookupField label="User ID :" value={user.userid} onChange={(v) => handleChange("userid", v)} readOnly />
        <LookupField label="Username :" value={user.username} onChange={(v) => handleChange("username", v)} placeholder="Enter username" />
        <div className="flex items-center gap-2">
          <label className="min-w-[120px] text-right text-xs font-semibold text-foreground">
            Password :
          </label>
          <div className="relative flex-1">
            <Input
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="h-7 pr-8 text-xs"
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          </div>
        </div>
        <LookupField label="Full Name :" value={user.fullname} onChange={(v) => handleChange("fullname", v)} placeholder="Enter full name" />
        <LookupField label="Email :" value={user.emailid} onChange={(v) => handleChange("emailid", v)} placeholder="Enter email" />
        <LookupField label="Cell No :" value={user.cellno} onChange={(v) => handleChange("cellno", v)} placeholder="03XX-XXXXXXX" />
        <LookupField label="Employee ID :" value={user.empid} onChange={(v) => handleChange("empid", v)} placeholder="" />
        <LookupField label="Profile :" value={user.profileName} onChange={(v) => handleChange("profileName", v)} placeholder="Select profile" />
        <LookupField label="Role :" value={user.roleName} onChange={(v) => handleChange("roleName", v)} placeholder="Select role" />
        <LookupField label="User Type :" value={user.usertypeid} onChange={(v) => handleChange("usertypeid", v)} placeholder="" />
        <LookupField label="Status :" value={user.userstatusid} onChange={(v) => handleChange("userstatusid", v)} placeholder="" />
        <LookupField label="Client :" value={user.clientName} onChange={(v) => handleChange("clientName", v)} placeholder="Select client" />
        <LookupField label="Category :" value={user.usercatid} onChange={(v) => handleChange("usercatid", v)} placeholder="" />
      </div>

      <div className="flex items-center gap-3 px-3">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <input
            type="checkbox"
            checked={user.utblock}
            onChange={(e) => handleChange("utblock", e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border"
          />
          Blocked
        </label>
      </div>

      {/* User Applications (utuserapp) */}
      <SectionHeader title="Assigned Applications" icon={Settings} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Line</th>
              <th className="px-2 py-1.5 text-left font-semibold">App ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">App Name</th>
              <th className="px-2 py-1.5 text-left font-semibold">App Type</th>
              <th className="w-8 px-2 py-1.5 text-center font-semibold">
                <Trash2 className="mx-auto h-3 w-3" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5 text-muted-foreground">1</td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-28 text-xs" /></td>
              <td className="px-2 py-1.5 text-center">
                <button className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* User Entities (utuserent) */}
      <SectionHeader title="Assigned Entities" icon={Building2} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Line</th>
              <th className="px-2 py-1.5 text-left font-semibold">Entity ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Entity Name</th>
              <th className="px-2 py-1.5 text-center font-semibold">Default</th>
              <th className="w-8 px-2 py-1.5 text-center font-semibold">
                <Trash2 className="mx-auto h-3 w-3" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5 text-muted-foreground">1</td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5 text-center">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
              </td>
              <td className="px-2 py-1.5 text-center">
                <button className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* User Clients (utuserclient) */}
      <SectionHeader title="Assigned Clients" icon={Globe} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Line</th>
              <th className="px-2 py-1.5 text-left font-semibold">Client ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Client Name</th>
              <th className="px-2 py-1.5 text-center font-semibold">Default</th>
              <th className="w-8 px-2 py-1.5 text-center font-semibold">
                <Trash2 className="mx-auto h-3 w-3" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5 text-muted-foreground">1</td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5 text-center">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
              </td>
              <td className="px-2 py-1.5 text-center">
                <button className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════ PROFILES TAB ═══════════════ */
function ProfilesTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="Profile Header (utprofilehdr)" icon={Shield} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        <LookupField label="Profile ID :" value="" onChange={() => {}} readOnly />
        <LookupField label="Profile Type :" value="" onChange={() => {}} placeholder="Select type" />
        <LookupField label="Short Text :" value="" onChange={() => {}} placeholder="Profile name" />
        <LookupField label="Long Text :" value="" onChange={() => {}} placeholder="Description" />
      </div>

      <SectionHeader title="Profile Roles (utprofileroles)" icon={Key} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Line</th>
              <th className="px-2 py-1.5 text-left font-semibold">Profile Dtl ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Role ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Role Name</th>
              <th className="w-8 px-2 py-1.5 text-center font-semibold">
                <Trash2 className="mx-auto h-3 w-3" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5 text-muted-foreground">1</td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" readOnly /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5 text-center">
                <button className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title="Profile Types (utprofiletype)" icon={Settings} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
        <LookupField label="Type ID :" value="" onChange={() => {}} readOnly />
        <LookupField label="Short Text :" value="" onChange={() => {}} placeholder="" />
        <LookupField label="Long Text :" value="" onChange={() => {}} placeholder="" />
      </div>
    </div>
  )
}

/* ═══════════════ SCREEN RIGHTS TAB ═══════════════ */
function ScreenRightsTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="User Rights Assignment (utuserrights)" icon={Key} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        <LookupField label="User :" value="" onChange={() => {}} placeholder="Select user" />
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-8 px-2 py-1.5 text-center font-semibold">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
              </th>
              <th className="px-2 py-1.5 text-left font-semibold">Right ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Screen Right ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Screen Name</th>
              <th className="px-2 py-1.5 text-left font-semibold">Object</th>
              <th className="px-2 py-1.5 text-left font-semibold">Action</th>
              <th className="px-2 py-1.5 text-center font-semibold">Granted</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, rightId: "101", screenName: "Registration", object: "btnSave", action: "Save" },
              { id: 2, rightId: "102", screenName: "Registration", object: "btnDelete", action: "Delete" },
              { id: 3, rightId: "103", screenName: "Academic Test", object: "btnSave", action: "Save" },
              { id: 4, rightId: "104", screenName: "Token Issuance", object: "btnPrint", action: "Print" },
              { id: 5, rightId: "105", screenName: "Book License", object: "btnApprove", action: "Approve" },
            ].map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
                </td>
                <td className="px-2 py-1.5 text-muted-foreground">{row.id}</td>
                <td className="px-2 py-1.5">{row.rightId}</td>
                <td className="px-2 py-1.5">{row.screenName}</td>
                <td className="px-2 py-1.5">{row.object}</td>
                <td className="px-2 py-1.5">{row.action}</td>
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-border" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Copy className="h-3 w-3" />
          Copy Rights From User
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <UserPlus className="h-3 w-3" />
          Assign All
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive">
          <Trash2 className="h-3 w-3" />
          Revoke All
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════ SESSIONS TAB ═══════════════ */
function SessionsTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="Active Sessions (utsessionhdr)" icon={Monitor} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Session ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">User ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Username</th>
              <th className="px-2 py-1.5 text-left font-semibold">Login Time</th>
              <th className="px-2 py-1.5 text-left font-semibold">IP Address</th>
              <th className="px-2 py-1.5 text-left font-semibold">System</th>
              <th className="px-2 py-1.5 text-center font-semibold">Expired</th>
              <th className="px-2 py-1.5 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { sid: 1001, uid: 1, user: "admin", time: "2/27/2026 7:00 AM", ip: "192.168.1.10", sys: "DESKTOP-A1", expired: false },
              { sid: 1002, uid: 2, user: "operator1", time: "2/27/2026 6:45 AM", ip: "192.168.1.20", sys: "DESKTOP-B2", expired: false },
              { sid: 1003, uid: 3, user: "clerk1", time: "2/26/2026 5:30 PM", ip: "192.168.1.15", sys: "DESKTOP-C3", expired: true },
            ].map((s) => (
              <tr key={s.sid} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-2 py-1.5">{s.sid}</td>
                <td className="px-2 py-1.5">{s.uid}</td>
                <td className="px-2 py-1.5 font-medium">{s.user}</td>
                <td className="px-2 py-1.5">{s.time}</td>
                <td className="px-2 py-1.5">{s.ip}</td>
                <td className="px-2 py-1.5">{s.sys}</td>
                <td className="px-2 py-1.5 text-center">
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${s.expired ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>
                    {s.expired ? "Expired" : "Active"}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-center">
                  {!s.expired && (
                    <Button variant="ghost" size="sm" className="h-5 gap-1 px-1.5 text-[10px] text-destructive">
                      <Lock className="h-2.5 w-2.5" />
                      Expire
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader title="Session Activity Log (utsessiondtl)" icon={Key} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Activity ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Session ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Activity</th>
              <th className="px-2 py-1.5 text-left font-semibold">Timestamp</th>
              <th className="px-2 py-1.5 text-left font-semibold">User</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 text-muted-foreground">
              <td className="px-2 py-4 text-center" colSpan={5}>
                Select a session to view activity log
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════ APPS TAB ═══════════════ */
function AppsTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="Application Setup (utapp)" icon={Settings} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        <LookupField label="App ID :" value="" onChange={() => {}} readOnly />
        <LookupField label="App Code :" value="" onChange={() => {}} placeholder="Enter code" />
        <LookupField label="App Name :" value="" onChange={() => {}} placeholder="Enter name" />
        <LookupField label="App Type :" value="" onChange={() => {}} placeholder="Select type" />
        <LookupField label="Library :" value="" onChange={() => {}} placeholder="" />
        <LookupField label="DB ID :" value="" onChange={() => {}} placeholder="" />
        <LookupField label="Path :" value="" onChange={() => {}} placeholder="" className="md:col-span-2 lg:col-span-3" />
      </div>

      <SectionHeader title="App Entity Detail (utappentitydtl)" icon={Building2} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Line</th>
              <th className="px-2 py-1.5 text-left font-semibold">Entity ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Entity Name</th>
              <th className="px-2 py-1.5 text-center font-semibold">Default</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5 text-muted-foreground">1</td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5 text-center"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title="App Sub Detail (utappsub)" icon={Settings} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Sub ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Line Index</th>
              <th className="px-2 py-1.5 text-left font-semibold">Child App ID</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" readOnly /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════ SITES TAB ═══════════════ */
function SitesTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="Site Setup (utsite)" icon={MapPin} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
        <LookupField label="Site ID :" value="" onChange={() => {}} readOnly />
        <LookupField label="Site Code :" value="" onChange={() => {}} placeholder="Enter code" />
        <LookupField label="Site Name :" value="" onChange={() => {}} placeholder="Enter name" />
        <LookupField label="Description :" value="" onChange={() => {}} placeholder="Enter description" />
      </div>

      <SectionHeader title="Server Setup (utserver)" icon={Monitor} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Server ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Server Name</th>
              <th className="px-2 py-1.5 text-left font-semibold">Start Count</th>
              <th className="px-2 py-1.5 text-left font-semibold">End Count</th>
              <th className="px-2 py-1.5 text-left font-semibold">Model Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" readOnly /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-24 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-24 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-24 text-xs" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════ MODULES TAB ═══════════════ */
function ModulesTab() {
  return (
    <div className="space-y-3 p-3">
      <SectionHeader title="Module Setup (utmodule)" icon={Globe} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
        <LookupField label="Module ID :" value="" onChange={() => {}} readOnly />
        <LookupField label="Module Code :" value="" onChange={() => {}} placeholder="Enter code" />
        <LookupField label="Short Text :" value="" onChange={() => {}} placeholder="Module name" />
        <LookupField label="Long Text :" value="" onChange={() => {}} placeholder="Description" />
      </div>

      <SectionHeader title="Clients (utclient)" icon={Building2} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">Client ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Client Code</th>
              <th className="px-2 py-1.5 text-left font-semibold">Client Name (Short)</th>
              <th className="px-2 py-1.5 text-left font-semibold">Client Name (Long)</th>
              <th className="px-2 py-1.5 text-center font-semibold">Blocked</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" readOnly /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5 text-center"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader title="LOV (List of Values)" icon={Settings} />
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left font-semibold">LOV ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Code</th>
              <th className="px-2 py-1.5 text-left font-semibold">Short Text</th>
              <th className="px-2 py-1.5 text-left font-semibold">Long Text</th>
              <th className="px-2 py-1.5 text-left font-semibold">Parent LOV</th>
              <th className="px-2 py-1.5 text-left font-semibold">Value Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" readOnly /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-20 text-xs" /></td>
              <td className="px-2 py-1.5"><Input className="h-6 w-16 text-xs" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function UserManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>("users")
  const [recordIndex, setRecordIndex] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const handleLogout = useCallback(() => router.push("/"), [router])
  const handleBack = useCallback(() => router.push("/driving-license"), [router])

  const noop = () => {}

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader
        title="User Management"
        username="admin"
        onLogout={handleLogout}
        onBack={handleBack}
      />

      <MasterDetailToolbar
        title="User Management"
        recordIndex={recordIndex}
        totalRecords={totalRecords}
        onNew={noop}
        onSave={noop}
        onSaveAndNew={noop}
        onFirst={() => setRecordIndex(0)}
        onPrev={() => setRecordIndex(Math.max(0, recordIndex - 1))}
        onNext={() => setRecordIndex(Math.min(totalRecords - 1, recordIndex + 1))}
        onLast={() => setRecordIndex(Math.max(0, totalRecords - 1))}
        onRefresh={noop}
        onDelete={noop}
        showDelete
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="flex flex-wrap gap-0">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.shortcut && (
                  <span className="ml-1 rounded bg-muted px-1 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    {tab.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "profiles" && <ProfilesTab />}
        {activeTab === "screen-rights" && <ScreenRightsTab />}
        {activeTab === "sessions" && <SessionsTab />}
        {activeTab === "apps" && <AppsTab />}
        {activeTab === "sites" && <SitesTab />}
        {activeTab === "modules" && <ModulesTab />}
      </div>
    </div>
  )
}
