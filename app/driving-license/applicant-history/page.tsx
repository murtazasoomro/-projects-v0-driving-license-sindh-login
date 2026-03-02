"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  User,
  FileText,
  History,
  AlertTriangle,
  Gavel,
  ClipboardList,
  GitMerge,
  Trash2,
  FilePlus,
  ExternalLink,
  BookOpen,
  Play,
  Eye,
} from "lucide-react"

// ===== Mock Data =====
const mockApplicant = {
  applicantid: "100234",
  firstname: "Muhammad Ahmed",
  fathername: "Muhammad Ali Khan",
  cnic: "42101-1234567-1",
  licenseno: "KHI-2024-00567",
  mobileno: "0300-1234567",
  genderid: "Male",
  bloodgroupid: "B+",
  dob: "1990-05-15",
  maritalid: "Married",
  birthcountryid: "Pakistan",
  birthcityid: "Karachi",
  languageid: "Urdu",
  qualificationid: "Graduate",
  occupationid: "Private Employee",
  entityid: "ENT-001",
  nationality: "Pakistani",
  visano: "",
  passportno: "",
  isforeigner: false,
  screeningwithouttoken: false,
  remaindays: 45,
  religion: "Islam",
  idmark: "Mole on right cheek",
  email: "ahmed@example.com",
  // Family
  fathercontactno: "0321-9876543",
  fathercnic: "42101-9876543-1",
  mothername: "Fatima Bibi",
  mothercontactno: "0333-1234567",
  mothercnic: "42101-5678901-2",
  spousename: "Ayesha Ahmed",
  spousecontactno: "0312-7654321",
  spousecnic: "42101-4567890-2",
  contactperson: "Hassan Ali",
  relation: "Brother",
  contactno: "0345-1122334",
  // Addresses
  permanentaddr: "House # 123, Block 5, Gulshan-e-Iqbal",
  permcity: "Karachi",
  permtel: "021-34567890",
  currentaddr: "Flat # 4A, Al-Noor Apartments, Nazimabad",
  currcity: "Karachi",
  currtel: "021-36789012",
  mailingaddr: "P.O. Box 12345, Clifton",
  mailcity: "Karachi",
  mailtel: "021-35678901",
  unpaidtickets: 2,
}

const mockLastActivity = [
  {
    formno: "FM-2024-001",
    formdate: "2024-11-15",
    tokenno: "T-1045",
    category: "LTV, M/C",
    status: "Completed",
    actions: "Registration",
    expiry: "2029-11-15",
    reattemptdays: 0,
    failedcategory: "",
    appprocessid: 5001,
    processid: 3,
  },
  {
    formno: "FM-2024-002",
    formdate: "2024-12-20",
    tokenno: "T-2078",
    category: "LTV",
    status: "Pending",
    actions: "Physical Test",
    expiry: "",
    reattemptdays: 7,
    failedcategory: "M/C",
    appprocessid: 5002,
    processid: 5,
  },
]

const mockLicenseHistory = [
  {
    appprocessid: 4001,
    licenseno: "KHI-2020-00321",
    processdate: "2020-03-10",
    licensedate: "2020-04-01",
    expiry: "2025-04-01",
    branch: "Nazimabad",
    licensetype: "Learner",
    apptypeid: "New",
    stxt: "Issued",
    action: "New License",
    pendingstatus: "",
    signauthid: 1,
  },
  {
    appprocessid: 4002,
    licenseno: "KHI-2022-00456",
    processdate: "2022-06-15",
    licensedate: "2022-07-01",
    expiry: "2027-07-01",
    branch: "Nazimabad",
    licensetype: "Permanent",
    apptypeid: "New",
    stxt: "Issued",
    action: "Permanent License",
    pendingstatus: "",
    signauthid: 1,
  },
  {
    appprocessid: 4003,
    licenseno: "KHI-2024-00567",
    processdate: "2024-11-15",
    licensedate: "",
    expiry: "",
    branch: "Nazimabad",
    licensetype: "Permanent",
    apptypeid: "Renewal",
    stxt: "In Process",
    action: "Renewal",
    pendingstatus: "Physical Test Pending",
    signauthid: 0,
  },
]

const mockUnpaidTickets = [
  {
    ticketno: "VT-2024-00891",
    violationdatetime: "2024-08-12 14:30",
    noofviolation: 2,
    challanamount: 5000,
    blackpoints: 3,
    site: "Nazimabad",
    station: "Golimar Chowrangi",
    location: "Main Rd near KFC",
    officer: "ASI Rashid Khan",
  },
  {
    ticketno: "VT-2024-01234",
    violationdatetime: "2024-10-05 09:15",
    noofviolation: 1,
    challanamount: 2500,
    blackpoints: 1,
    site: "Nazimabad",
    station: "Hyderi Market",
    location: "Near Water Pump",
    officer: "ASI Imran Ali",
  },
]

const mockPunishments: {
  punishmentno: string
  startdate: string
  enddate: string
  blackpoints: number
  punishtype: string
  vehicleno: string
  charges: number
  noofdays: number
}[] = []

export default function ApplicantHistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedHistoryRow, setSelectedHistoryRow] = useState<number | null>(null)
  const [selectedLastActivityRow, setSelectedLastActivityRow] = useState<number | null>(null)
  const [searchCnic, setSearchCnic] = useState("")
  const applicant = mockApplicant

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header Bar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-sm font-bold text-foreground">Applicant History</h1>

        {/* Search */}
        <div className="ml-6 flex items-center gap-2">
          <Label className="text-[10px] font-semibold text-muted-foreground">CNIC</Label>
          <Input
            value={searchCnic}
            onChange={(e) => setSearchCnic(e.target.value)}
            placeholder="00000-0000000-0"
            className="h-7 w-40 text-xs"
          />
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Search className="h-3 w-3" />
            Search
          </Button>
        </div>

        {/* Form-level Toolbar Buttons */}
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[10px]">
            <GitMerge className="h-3 w-3" />
            Merge Profile
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[10px] text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" />
            Delete Old Record
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[10px]">
            <FilePlus className="h-3 w-3" />
            New Registration
          </Button>
        </div>
      </div>

      {/* Main Content: Basic Info Panel + Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ===== Basic Info Panel (pnlbasicinfo) - Top ===== */}
        <div className="flex border-b border-border bg-card">
          {/* Left: Photo + Main Info */}
          <div className="flex flex-1 gap-4 p-3">
            {/* Applicant Photo */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-24 w-20 items-center justify-center rounded border border-border bg-muted">
                <User className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <span className="text-[9px] text-muted-foreground">Photo</span>
            </div>

            {/* Info Fields - 3 columns */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-x-6 gap-y-1.5">
                {/* Column 1 */}
                <InfoField label="Applicant ID" value={applicant.applicantid} />
                <InfoField label="Name" value={applicant.firstname} className="col-span-2" />
                <InfoField label="Father / Husband" value={applicant.fathername} className="col-span-2" />
                <InfoField label="Gender" value={applicant.genderid} />
                <InfoField label="CNIC" value={applicant.cnic} />
                <InfoField label="DOB" value={applicant.dob} />
                <InfoField label="Marital Status" value={applicant.maritalid} />
                <InfoField label="Mobile No" value={applicant.mobileno} />
                <InfoField label="License No" value={applicant.licenseno} />
                <InfoField label="Blood Group" value={applicant.bloodgroupid} />
              </div>
              <div className="mt-1.5 grid grid-cols-4 gap-x-4 gap-y-1.5">
                <InfoField label="Birth Country" value={applicant.birthcountryid} />
                <InfoField label="Birth City" value={applicant.birthcityid} />
                <InfoField label="Language" value={applicant.languageid} />
                <InfoField label="Qualification" value={applicant.qualificationid} />
                <InfoField label="Occupation" value={applicant.occupationid} />
                <InfoField label="Entity" value={applicant.entityid} />
                <InfoField label="Nationality" value={applicant.nationality} />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="screeningwithouttoken"
                    checked={applicant.screeningwithouttoken}
                    disabled
                  />
                  <Label htmlFor="screeningwithouttoken" className="text-[10px] text-muted-foreground">
                    Screening w/o Token
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Violation History Panel */}
          <div className="flex w-56 flex-col border-l border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] font-bold text-foreground">Violation History</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Unpaid Tickets</span>
              <span className={`text-3xl font-bold ${applicant.unpaidtickets > 0 ? "text-red-600" : "text-green-600"}`}>
                {applicant.unpaidtickets}
              </span>
            </div>
            <Button
              variant="default"
              size="sm"
              className="mt-2 h-7 w-full gap-1 text-[10px]"
              onClick={() => setActiveTab("unpaidtickets")}
            >
              <Eye className="h-3 w-3" />
              Violation Detail
            </Button>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Label className="text-[9px] text-muted-foreground">Unpaid:</Label>
              <span className="text-[10px] font-bold text-foreground">{applicant.unpaidtickets}</span>
            </div>
            {/* Remain Days */}
            <div className="mt-1 text-center">
              <span className="text-[9px] text-muted-foreground">Remain Days:</span>
              <span className="ml-1 text-sm font-bold text-foreground">{applicant.remaindays}</span>
            </div>
          </div>
        </div>

        {/* ===== Tab Control (pnltabs) ===== */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <TabsList className="h-8 w-full justify-start rounded-none border-b border-border bg-muted/30 px-2">
              <TabsTrigger value="personal" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <User className="h-3 w-3" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="additional" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <FileText className="h-3 w-3" />
                Additional
              </TabsTrigger>
              <TabsTrigger value="lastactivity" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <ClipboardList className="h-3 w-3" />
                Last Application
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <History className="h-3 w-3" />
                History
              </TabsTrigger>
              <TabsTrigger value="unpaidtickets" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <AlertTriangle className="h-3 w-3" />
                Unpaid Tickets
              </TabsTrigger>
              <TabsTrigger value="punishment" className="gap-1 text-[10px] data-[state=active]:bg-card">
                <Gavel className="h-3 w-3" />
                License Punishment
              </TabsTrigger>
            </TabsList>

            {/* === Personal Tab === */}
            <TabsContent value="personal" className="flex-1 overflow-auto p-3">
              {/* Foreigner Section */}
              <div className="mb-3 flex items-center gap-4 rounded border border-border bg-muted/20 px-3 py-2">
                <Checkbox id="isforeigner" checked={applicant.isforeigner} disabled />
                <Label htmlFor="isforeigner" className="text-[10px] font-semibold">Foreigner</Label>
                {applicant.isforeigner && (
                  <div className="ml-4 flex gap-4">
                    <InfoField label="Visa No" value={applicant.visano || "--"} />
                    <InfoField label="Passport No" value={applicant.passportno || "--"} />
                  </div>
                )}
              </div>

              {/* ID Mark, Religion */}
              <div className="mb-3 grid grid-cols-2 gap-4">
                <FormReadField label="Identification Mark" value={applicant.idmark} />
                <FormReadField label="Religion" value={applicant.religion} />
              </div>

              {/* Family Details */}
              <div className="rounded border border-border bg-muted/10 p-3">
                <h3 className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Family Information</h3>
                <div className="space-y-2">
                  {/* Father */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormReadField label="Father / Husband" value={applicant.fathername} />
                    <FormReadField label="Contact No" value={applicant.fathercontactno} />
                    <FormReadField label="CNIC" value={applicant.fathercnic} />
                  </div>
                  {/* Mother */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormReadField label="Mother's Name" value={applicant.mothername} />
                    <FormReadField label="Contact No" value={applicant.mothercontactno} />
                    <FormReadField label="CNIC" value={applicant.mothercnic} />
                  </div>
                  {/* Spouse */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormReadField label="Spouse's Name" value={applicant.spousename} />
                    <FormReadField label="Contact No" value={applicant.spousecontactno} />
                    <FormReadField label="CNIC" value={applicant.spousecnic} />
                  </div>
                  {/* Contact Person */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormReadField label="Contact Person" value={applicant.contactperson} />
                    <FormReadField label="Relation" value={applicant.relation} />
                    <FormReadField label="Contact No" value={applicant.contactno} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* === Additional Tab === */}
            <TabsContent value="additional" className="flex-1 overflow-auto p-3">
              {/* Email */}
              <div className="mb-3">
                <FormReadField label="Email" value={applicant.email} />
              </div>

              {/* Addresses */}
              <div className="rounded border border-border bg-muted/10 p-3">
                <h3 className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Addresses</h3>
                <div className="grid grid-cols-3 gap-6">
                  {/* Permanent */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-foreground">Permanent Address</h4>
                    <FormReadField label="Address" value={applicant.permanentaddr} />
                    <FormReadField label="City" value={applicant.permcity} />
                    <FormReadField label="Telephone" value={applicant.permtel} />
                  </div>
                  {/* Current */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-foreground">Current Address</h4>
                    <FormReadField label="Address" value={applicant.currentaddr} />
                    <FormReadField label="City" value={applicant.currcity} />
                    <FormReadField label="Telephone" value={applicant.currtel} />
                  </div>
                  {/* Mailing */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-foreground">Mailing Address</h4>
                    <FormReadField label="Address" value={applicant.mailingaddr} />
                    <FormReadField label="City" value={applicant.mailcity} />
                    <FormReadField label="Telephone" value={applicant.mailtel} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* === Last Application Tab === */}
            <TabsContent value="lastactivity" className="flex-1 overflow-auto">
              <div className="h-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Form No</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Form Date</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Token No</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Category</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Status</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Actions</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Expiry</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Re-attempt Days</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Failed Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLastActivity.map((row, idx) => (
                        <tr
                          key={idx}
                          onClick={() => setSelectedLastActivityRow(idx)}
                          className={`cursor-pointer border-b border-border transition-colors hover:bg-muted/30 ${
                            selectedLastActivityRow === idx ? "bg-primary/10" : ""
                          }`}
                        >
                          <td className="px-2 py-1.5 font-mono">{row.formno}</td>
                          <td className="px-2 py-1.5">{row.formdate}</td>
                          <td className="px-2 py-1.5 font-mono">{row.tokenno}</td>
                          <td className="px-2 py-1.5">{row.category}</td>
                          <td className="px-2 py-1.5">
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                              row.status === "Completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-2 py-1.5">{row.actions}</td>
                          <td className="px-2 py-1.5">{row.expiry || "--"}</td>
                          <td className="px-2 py-1.5 text-center">{row.reattemptdays}</td>
                          <td className="px-2 py-1.5">
                            {row.failedcategory ? (
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {row.failedcategory}
                              </span>
                            ) : "--"}
                          </td>
                        </tr>
                      ))}
                      {mockLastActivity.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                            No last application records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* === History Tab === */}
            <TabsContent value="history" className="flex-1 overflow-auto">
              {/* Toolbar */}
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-2 py-1">
                <span className="text-[10px] font-bold text-muted-foreground">License</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px]">
                    <ExternalLink className="h-2.5 w-2.5" />
                    Applicant Report
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px]">
                    <BookOpen className="h-2.5 w-2.5" />
                    Book License
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px]">
                    <Play className="h-2.5 w-2.5" />
                    Continue Process
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Application No</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License No</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Application Date</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Issue Date</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Expiry Date</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Branch</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License Type</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">App Type</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Action</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Pending Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLicenseHistory.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedHistoryRow(idx)}
                        className={`cursor-pointer border-b border-border transition-colors hover:bg-muted/30 ${
                          selectedHistoryRow === idx ? "bg-primary/10" : ""
                        }`}
                      >
                        <td className="px-2 py-1.5 font-mono">{row.appprocessid}</td>
                        <td className="px-2 py-1.5 font-mono font-semibold">{row.licenseno}</td>
                        <td className="px-2 py-1.5">{row.processdate}</td>
                        <td className="px-2 py-1.5">{row.licensedate || "--"}</td>
                        <td className="px-2 py-1.5">{row.expiry || "--"}</td>
                        <td className="px-2 py-1.5">{row.branch}</td>
                        <td className="px-2 py-1.5">{row.licensetype}</td>
                        <td className="px-2 py-1.5">{row.apptypeid}</td>
                        <td className="px-2 py-1.5">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                            row.stxt === "Issued"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {row.stxt}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">{row.action}</td>
                        <td className="px-2 py-1.5">
                          {row.pendingstatus ? (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              {row.pendingstatus}
                            </span>
                          ) : "--"}
                        </td>
                      </tr>
                    ))}
                    {mockLicenseHistory.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
                          No license history records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* === Unpaid Tickets Tab === */}
            <TabsContent value="unpaidtickets" className="flex-1 overflow-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Ticket No</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">{"Violation Date & Time"}</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">No Of Violations</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Challan Amount</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Black Points</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Site</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Station</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Location</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Officer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUnpaidTickets.map((row, idx) => (
                      <tr key={idx} className="border-b border-border transition-colors hover:bg-muted/30">
                        <td className="px-2 py-1.5 font-mono font-semibold">{row.ticketno}</td>
                        <td className="px-2 py-1.5">{row.violationdatetime}</td>
                        <td className="px-2 py-1.5 text-center">{row.noofviolation}</td>
                        <td className="px-2 py-1.5 text-right font-mono">{row.challanamount.toLocaleString()}</td>
                        <td className="px-2 py-1.5 text-center">
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            {row.blackpoints}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">{row.site}</td>
                        <td className="px-2 py-1.5">{row.station}</td>
                        <td className="px-2 py-1.5">{row.location}</td>
                        <td className="px-2 py-1.5">{row.officer}</td>
                      </tr>
                    ))}
                    {mockUnpaidTickets.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                          No unpaid violation tickets
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* === License Punishment Tab === */}
            <TabsContent value="punishment" className="flex-1 overflow-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Punishment No</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Start Date</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">End Date</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Black Points</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Punishment Type</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Vehicle No</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Charges</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">No of Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPunishments.map((row, idx) => (
                      <tr key={idx} className="border-b border-border transition-colors hover:bg-muted/30">
                        <td className="px-2 py-1.5 font-mono">{row.punishmentno}</td>
                        <td className="px-2 py-1.5">{row.startdate}</td>
                        <td className="px-2 py-1.5">{row.enddate}</td>
                        <td className="px-2 py-1.5 text-center">{row.blackpoints}</td>
                        <td className="px-2 py-1.5">{row.punishtype}</td>
                        <td className="px-2 py-1.5">{row.vehicleno}</td>
                        <td className="px-2 py-1.5 text-right font-mono">{row.charges.toLocaleString()}</td>
                        <td className="px-2 py-1.5 text-center">{row.noofdays}</td>
                      </tr>
                    ))}
                    {mockPunishments.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                          No punishment records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// ===== Helper Components =====

function InfoField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="min-w-[80px] text-[9px] text-muted-foreground">{label}:</span>
      <span className="text-[10px] font-semibold text-foreground">{value || "--"}</span>
    </div>
  )
}

function FormReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label className="text-[9px] text-muted-foreground">{label}</Label>
      <div className="rounded border border-border bg-muted/30 px-2 py-1">
        <span className="text-[10px] text-foreground">{value || "--"}</span>
      </div>
    </div>
  )
}
