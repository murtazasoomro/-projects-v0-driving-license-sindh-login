"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  PhoneForwarded,
  SkipForward,
  PhoneCall,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  History,
  ClipboardList,
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { SetupPageHeader } from "@/components/setup-page-header"

// ===== Types =====
interface LicenseCategory {
  line: number
  category: string
  checked: boolean
  isfailed: boolean
}

interface Token {
  tokenid: number
  tokenno: string
  appprocessid: number
  applicantName: string
  cnic: string
  licensetype: string
  processName: string
  status: "Pending" | "Serving" | "Skip" | "Completed"
}

interface Question {
  id: number
  question: string
  options: { id: number; text: string; correct: boolean }[]
  userResponse: number | null
}

// ===== Sample Data =====
const SAMPLE_CATEGORIES: LicenseCategory[] = [
  { line: 1, category: "M CYCLE", checked: true, isfailed: false },
  { line: 2, category: "M CAR", checked: true, isfailed: false },
  { line: 3, category: "LTV", checked: true, isfailed: false },
  { line: 4, category: "HTV", checked: false, isfailed: false },
  { line: 5, category: "M.CAB", checked: false, isfailed: false },
  { line: 6, category: "MCR", checked: false, isfailed: false },
  { line: 7, category: "IC CAR", checked: false, isfailed: false },
  { line: 8, category: "IC M.Cycle", checked: false, isfailed: false },
  { line: 9, category: "Invalid Carriage. (HI)", checked: false, isfailed: false },
  { line: 10, category: "DELIVERY VAN", checked: false, isfailed: false },
  { line: 11, category: "TRACTOR", checked: false, isfailed: false },
  { line: 12, category: "ROAD ROLLER", checked: false, isfailed: false },
  { line: 13, category: "PSV", checked: false, isfailed: false },
]

const SAMPLE_TOKENS: Token[] = [
  { tokenid: 1001, tokenno: "P-0001", appprocessid: 300, applicantName: "Muhammad Ali", cnic: "42101-1234567-1", licensetype: "Permanent", processName: "New Permanent", status: "Pending" },
  { tokenid: 1002, tokenno: "P-0002", appprocessid: 301, applicantName: "Ahmed Khan", cnic: "42201-7654321-3", licensetype: "Permanent", processName: "Permanent Renew", status: "Pending" },
  { tokenid: 1003, tokenno: "L-0003", appprocessid: 302, applicantName: "Sara Bibi", cnic: "42301-1112233-2", licensetype: "Learner", processName: "New Learner", status: "Pending" },
  { tokenid: 1004, tokenno: "PF-0004", appprocessid: 303, applicantName: "Zubair Shah", cnic: "42401-9998877-5", licensetype: "Permanent", processName: "Permanent + Duplicate", status: "Pending" },
]

const SAMPLE_SKIP_TOKENS: Token[] = [
  { tokenid: 2001, tokenno: "P-0010", appprocessid: 310, applicantName: "Farhan Syed", cnic: "42501-5556677-9", licensetype: "Permanent", processName: "Permanent Endorsement", status: "Skip" },
  { tokenid: 2002, tokenno: "L-0011", appprocessid: 311, applicantName: "Fatima Noor", cnic: "42601-8889900-4", licensetype: "Learner", processName: "Endorsement Learner", status: "Skip" },
]

const QUESTIONNAIRES = [
  { id: 1, name: "Physical Test - Driving", points: 30, viewMode: "wizard" as const },
  { id: 2, name: "Physical Test - Road Signs", points: 20, viewMode: "grid" as const },
  { id: 3, name: "Physical Test - Practical", points: 30, viewMode: "wizard" as const },
]

const SAMPLE_QUESTIONS: Question[] = [
  { id: 1, question: "Can the applicant maintain balance on a two-wheeler?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 2, question: "Can the applicant perform a 3-point turn?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 3, question: "Proper mirror and signal usage before lane change?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 4, question: "Correct parallel parking technique?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 5, question: "Smooth start on an incline (hill start)?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 6, question: "Proper observation at junctions?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 7, question: "Emergency braking test passed?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 8, question: "Correct use of gear shifting?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 9, question: "Maintained safe following distance?", options: [{ id: 1, text: "Yes", correct: true }, { id: 2, text: "No", correct: false }], userResponse: null },
  { id: 10, question: "Overall driving behavior and confidence?", options: [{ id: 1, text: "Satisfactory", correct: true }, { id: 2, text: "Unsatisfactory", correct: false }], userResponse: null },
]

const LANGUAGES = [
  { id: 1, name: "Urdu" },
  { id: 2, name: "English" },
  { id: 3, name: "Sindhi" },
]

export default function PhysicalTestPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form fields
  const [transNo, setTransNo] = useState("")
  const [entityId, setEntityId] = useState("001")
  const [busUnitId, setBusUnitId] = useState("01")
  const [siteId, setSiteId] = useState("01")
  const [transDate] = useState(
    new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
  )
  const [tokenId, setTokenId] = useState("")
  const [questionnaireId, setQuestionnaireId] = useState("")
  const [languageId, setLanguageId] = useState("")
  const [marks, setMarks] = useState("")
  const [statusTypeId, setStatusTypeId] = useState("")
  const [remarks, setRemarks] = useState("")
  const [appProcessId, setAppProcessId] = useState("")
  const [applicantName, setApplicantName] = useState("")
  const [applicantCnic, setApplicantCnic] = useState("")
  const [processName, setProcessName] = useState("")

  // Token state
  const [servingToken, setServingToken] = useState<string | null>(null)
  const [tokenIndex, setTokenIndex] = useState(0)
  const [tokenLocked, setTokenLocked] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showSkipList, setShowSkipList] = useState(false)
  const [showServingList, setShowServingList] = useState(false)

  // Result panel
  const [showResult, setShowResult] = useState(false)
  const [totalQues, setTotalQues] = useState(0)
  const [rightQues, setRightQues] = useState(0)
  const [wrongQues, setWrongQues] = useState(0)
  const [percentage, setPercentage] = useState(0)

  // Questionnaire mode & questions
  const [quesViewMode, setQuesViewMode] = useState<"wizard" | "grid">("wizard")
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS)
  const [wizardStep, setWizardStep] = useState(0)
  const [showAppraisalWizard, setShowAppraisalWizard] = useState(false)
  const [showAppraisalGrid, setShowAppraisalGrid] = useState(false)
  const [showTestHistory, setShowTestHistory] = useState(false)

  // Tab & category
  const [activeSubTab, setActiveSubTab] = useState<"appraisal" | "category">("appraisal")
  const [categories, setCategories] = useState<LicenseCategory[]>(SAMPLE_CATEGORIES)

  // Records
  const [recordIndex, setRecordIndex] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.replace("/")
  }
  const handleBack = () => router.push("/driving-license")

  // ========== Token Operations ==========
  const handleNextToken = useCallback(() => {
    if (SAMPLE_TOKENS.length === 0) return
    const idx = tokenIndex % SAMPLE_TOKENS.length
    const tk = SAMPLE_TOKENS[idx]
    setTokenId(String(tk.tokenid))
    setAppProcessId(String(tk.appprocessid))
    setServingToken(tk.tokenno)
    setApplicantName(tk.applicantName)
    setApplicantCnic(tk.cnic)
    setProcessName(tk.processName)
    setTokenIndex(idx + 1)
    setStartTime(new Date())
    setTokenLocked(true)
    setShowResult(false)
    setShowAppraisalWizard(false)
    setShowAppraisalGrid(false)
    setShowTestHistory(false)
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setQuestions(SAMPLE_QUESTIONS.map((q) => ({ ...q, userResponse: null })))
    setCategories(SAMPLE_CATEGORIES.map((c) => ({ ...c, isfailed: false })))
    // Auto-set questionnaire from process config
    setQuestionnaireId("1")
    setQuesViewMode("wizard")
    setShowSkipList(false)
    setShowServingList(false)
  }, [tokenIndex])

  const handleCallToken = useCallback(() => {
    setShowSkipList(true)
    setShowServingList(false)
  }, [])

  const selectSkipToken = useCallback((tk: Token) => {
    setTokenId(String(tk.tokenid))
    setAppProcessId(String(tk.appprocessid))
    setServingToken(tk.tokenno)
    setApplicantName(tk.applicantName)
    setApplicantCnic(tk.cnic)
    setProcessName(tk.processName)
    setStartTime(new Date())
    setTokenLocked(true)
    setShowResult(false)
    setShowAppraisalWizard(false)
    setShowAppraisalGrid(false)
    setShowTestHistory(false)
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setQuestions(SAMPLE_QUESTIONS.map((q) => ({ ...q, userResponse: null })))
    setCategories(SAMPLE_CATEGORIES.map((c) => ({ ...c, isfailed: false })))
    setQuestionnaireId("1")
    setQuesViewMode("wizard")
    setShowSkipList(false)
  }, [])

  const handleSkipToken = useCallback(() => {
    // Mark current token as Skip status
    setServingToken(null)
    setTokenId("")
    setAppProcessId("")
    setApplicantName("")
    setApplicantCnic("")
    setProcessName("")
    setShowResult(false)
    setQuestionnaireId("")
    setLanguageId("")
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setCategories(SAMPLE_CATEGORIES.map((c) => ({ ...c, isfailed: false })))
    setTokenLocked(false)
    setStartTime(null)
    setShowAppraisalWizard(false)
    setShowAppraisalGrid(false)
    setShowTestHistory(false)
    setShowSkipList(false)
    setShowServingList(false)
  }, [])

  const handleServingToken = useCallback(() => {
    setShowServingList(true)
    setShowSkipList(false)
  }, [])

  // ========== Questionnaire Changed ==========
  const handleQuestionnaireChange = useCallback((val: string) => {
    setQuestionnaireId(val)
    if (val) {
      const ques = QUESTIONNAIRES.find((q) => q.id === Number(val))
      if (ques) {
        setQuesViewMode(ques.viewMode)
        if (ques.viewMode === "wizard") {
          setShowAppraisalWizard(true)
          setShowAppraisalGrid(false)
        } else {
          setShowAppraisalWizard(false)
          setShowAppraisalGrid(true)
        }
        setShowTestHistory(false)
      }
    } else {
      setShowAppraisalWizard(false)
      setShowAppraisalGrid(false)
    }
  }, [])

  // ========== Submit Appraisal & Calculate Result ==========
  const calculateResult = useCallback(() => {
    const answered = questions.filter((q) => q.userResponse !== null)
    const total = questions.length
    const right = answered.filter((q) => {
      const selected = q.options.find((o) => o.id === q.userResponse)
      return selected?.correct
    }).length
    const wrong = total - right
    const ques = QUESTIONNAIRES.find((q) => q.id === Number(questionnaireId))
    const totalPoints = ques?.points || total
    const pct = totalPoints > 0 ? parseFloat(((right / totalPoints) * 100).toFixed(1)) : 0

    setTotalQues(total)
    setRightQues(right)
    setWrongQues(wrong)
    setPercentage(pct)
    setMarks(String(right))

    const passed = pct >= 50
    setStatusTypeId(passed ? "Passed" : "Failed")

    // If failed on Physical Test, mark categories as failed
    if (!passed) {
      setCategories((prev) => prev.map((c) => (c.checked ? { ...c, isfailed: true } : c)))
    } else {
      setCategories((prev) => prev.map((c) => ({ ...c, isfailed: false })))
    }

    setShowResult(true)
    setShowAppraisalWizard(false)
    setShowAppraisalGrid(false)
    setShowTestHistory(true)
  }, [questions, questionnaireId])

  // ========== Toolbar handlers ==========
  const handleNew = () => {
    setTransNo("")
    setTokenId("")
    setAppProcessId("")
    setApplicantName("")
    setApplicantCnic("")
    setProcessName("")
    setQuestionnaireId("")
    setLanguageId("")
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setShowResult(false)
    setServingToken(null)
    setTokenLocked(false)
    setStartTime(null)
    setShowAppraisalWizard(false)
    setShowAppraisalGrid(false)
    setShowTestHistory(false)
    setCategories(SAMPLE_CATEGORIES.map((c) => ({ ...c, isfailed: false })))
    setQuestions(SAMPLE_QUESTIONS.map((q) => ({ ...q, userResponse: null })))
    setWizardStep(0)
  }

  const handleSave = () => {
    if (!tokenId) return alert("Please call a token first")
    if (!questionnaireId) return alert("Questionnaire is required")
    if (!languageId) return alert("Language is required")
    if (!statusTypeId) return alert("Please complete the test first")
    setTotalRecords((p) => p + 1)
    setRecordIndex(totalRecords)
  }

  const handleSaveAndNew = () => {
    handleSave()
    setTimeout(() => {
      handleNew()
      setTokenLocked(false)
    }, 200)
  }

  const handleDelete = () => {
    if (!tokenId) return
    handleNew()
    if (totalRecords > 0) setTotalRecords((p) => p - 1)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader title="Physical Test" username={username} onLogout={handleLogout} onBack={handleBack} />

      {/* ---- Token Call Bar ---- */}
      <div className="border-b border-border bg-card px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleNextToken} disabled={tokenLocked} className="gap-1.5">
            <PhoneForwarded className="h-4 w-4" />
            Next Token
          </Button>
          <Button size="sm" variant="outline" onClick={handleCallToken} disabled={tokenLocked} className="gap-1.5">
            <PhoneCall className="h-4 w-4" />
            Call Token
          </Button>
          <Button size="sm" variant="outline" onClick={handleSkipToken} disabled={!tokenLocked} className="gap-1.5">
            <SkipForward className="h-4 w-4" />
            Skip Token
          </Button>
          <Button size="sm" variant="outline" onClick={handleServingToken} className="gap-1.5">
            <Users className="h-4 w-4" />
            Serving Token
          </Button>

          {servingToken && (
            <div className="ml-auto flex items-center gap-3 rounded-md bg-primary/10 px-3 py-1.5">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Clock className="h-4 w-4" />
                Serving: {servingToken}
              </div>
              {applicantName && (
                <span className="text-xs text-muted-foreground">
                  {applicantName} | {applicantCnic}
                </span>
              )}
              {processName && (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  {processName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Skip Token List Popup */}
        {showSkipList && (
          <div className="mt-2 rounded-lg border border-border bg-card p-3 shadow-md">
            <p className="mb-2 text-xs font-bold text-foreground">Select Skip Token to Call:</p>
            {SAMPLE_SKIP_TOKENS.length === 0 ? (
              <p className="text-xs text-muted-foreground">No skip tokens available</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SKIP_TOKENS.map((tk) => (
                  <button
                    key={tk.tokenid}
                    onClick={() => selectSkipToken(tk)}
                    className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-left text-xs transition hover:border-primary hover:bg-primary/5"
                  >
                    <span className="font-bold text-primary">{tk.tokenno}</span>
                    <span className="ml-2 text-muted-foreground">{tk.applicantName}</span>
                  </button>
                ))}
              </div>
            )}
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setShowSkipList(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Serving Token List */}
        {showServingList && (
          <div className="mt-2 rounded-lg border border-border bg-card p-3 shadow-md">
            <p className="mb-2 text-xs font-bold text-foreground">Currently Serving Tokens:</p>
            {servingToken ? (
              <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                <span className="font-bold text-primary">{servingToken}</span>
                <span className="ml-2 text-muted-foreground">{applicantName} - {processName}</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No token currently being served</p>
            )}
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setShowServingList(false)}>
              Close
            </Button>
          </div>
        )}
      </div>

      {/* ---- Toolbar ---- */}
      <MasterDetailToolbar
        title="Physical Test"
        recordIndex={recordIndex}
        totalRecords={totalRecords}
        onNew={handleNew}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onDelete={handleDelete}
        showDelete
        onFirst={() => setRecordIndex(0)}
        onPrev={() => setRecordIndex((p) => Math.max(0, p - 1))}
        onNext={() => setRecordIndex((p) => Math.min(totalRecords - 1, p + 1))}
        onLast={() => setRecordIndex(Math.max(0, totalRecords - 1))}
        onRefresh={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {/* ===== Header Fields ===== */}
        <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Physical Test Information
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <FieldRow label="Trans No">
              <Input value={transNo} readOnly className="h-8 bg-muted/40 text-xs" placeholder="Auto Generated" />
            </FieldRow>
            <FieldRow label="Entity">
              <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Business Unit">
              <Input value={busUnitId} onChange={(e) => setBusUnitId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Site">
              <Input value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>

            <FieldRow label="Trans Date">
              <Input value={transDate} readOnly className="h-8 bg-muted/40 text-xs" />
            </FieldRow>
            <FieldRow label="Token ID">
              <Input value={tokenId} readOnly className="h-8 bg-muted/40 text-xs font-semibold" />
            </FieldRow>
            <FieldRow label="App Process ID">
              <Input value={appProcessId} readOnly className="h-8 bg-muted/40 text-xs" />
            </FieldRow>
            <FieldRow label="Applicant">
              <Input value={applicantName} readOnly className="h-8 bg-muted/40 text-xs" />
            </FieldRow>

            <FieldRow label="Questionnaire">
              <select
                value={questionnaireId}
                onChange={(e) => handleQuestionnaireChange(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">-- Select --</option>
                {QUESTIONNAIRES.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.points} pts) [{q.viewMode}]
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Language">
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">-- Select --</option>
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Marks">
              <Input value={marks} readOnly className="h-8 bg-muted/40 text-xs font-semibold" />
            </FieldRow>
            <FieldRow label="Status">
              <div className="flex h-8 items-center">
                {statusTypeId === "Passed" && (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Passed</span>
                )}
                {statusTypeId === "Failed" && (
                  <span className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</span>
                )}
                {!statusTypeId && <span className="text-xs text-muted-foreground">Pending</span>}
              </div>
            </FieldRow>

            <FieldRow label="Remarks" className="sm:col-span-2 lg:col-span-4">
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="h-8 text-xs" placeholder="Enter remarks..." />
            </FieldRow>
          </div>

          {/* Toolbar buttons: Appraisal Question / Grid / Test History */}
          {tokenId && questionnaireId && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {quesViewMode === "wizard" && (
                <Button
                  size="sm"
                  variant={showAppraisalWizard ? "default" : "outline"}
                  onClick={() => { setShowAppraisalWizard(true); setShowAppraisalGrid(false); setShowTestHistory(false) }}
                  className="gap-1.5"
                >
                  <ClipboardList className="h-4 w-4" />
                  Appraisal Question (Wizard)
                </Button>
              )}
              {quesViewMode === "grid" && (
                <Button
                  size="sm"
                  variant={showAppraisalGrid ? "default" : "outline"}
                  onClick={() => { setShowAppraisalGrid(true); setShowAppraisalWizard(false); setShowTestHistory(false) }}
                  className="gap-1.5"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Appraisal Question (Grid)
                </Button>
              )}
              {showResult && (
                <Button
                  size="sm"
                  variant={showTestHistory ? "default" : "outline"}
                  onClick={() => { setShowTestHistory(true); setShowAppraisalWizard(false); setShowAppraisalGrid(false) }}
                  className="gap-1.5"
                >
                  <History className="h-4 w-4" />
                  Test History
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ===== Result Panel ===== */}
        {showResult && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Test Result
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <ResultStat label="Total Questions" value={totalQues} />
              <ResultStat label="Right" value={rightQues} className="text-green-600 dark:text-green-400" />
              <ResultStat label="Wrong" value={wrongQues} className="text-red-600 dark:text-red-400" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-medium text-muted-foreground">Percentage</span>
                <span className={`text-lg font-bold ${statusTypeId === "Passed" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {percentage}%
                </span>
              </div>
              <div className="ml-auto">
                {statusTypeId === "Passed" ? (
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    PASSED
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    FAILED
                  </div>
                )}
              </div>
            </div>
            {startTime && (
              <p className="mt-2 text-[10px] text-muted-foreground">
                Test started at {startTime.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {/* ===== Appraisal Wizard ===== */}
        {showAppraisalWizard && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Appraisal Questions - Wizard Mode ({wizardStep + 1} / {questions.length})
            </div>
            <div className="mb-4">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Q{wizardStep + 1}: {questions[wizardStep].question}
              </p>
              <div className="flex flex-wrap gap-3">
                {questions[wizardStep].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setQuestions((prev) =>
                        prev.map((q, i) => (i === wizardStep ? { ...q, userResponse: opt.id } : q))
                      )
                    }}
                    className={`rounded-lg border px-6 py-3 text-sm font-medium transition-all ${
                      questions[wizardStep].userResponse === opt.id
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary"
                        : "border-border bg-secondary/30 text-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={wizardStep === 0}
                onClick={() => setWizardStep((p) => p - 1)}
              >
                Previous
              </Button>
              {wizardStep < questions.length - 1 ? (
                <Button
                  size="sm"
                  disabled={questions[wizardStep].userResponse === null}
                  onClick={() => setWizardStep((p) => p + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={questions[wizardStep].userResponse === null}
                  onClick={calculateResult}
                >
                  Submit & Calculate
                </Button>
              )}
              <span className="ml-auto text-[10px] text-muted-foreground">
                Answered: {questions.filter((q) => q.userResponse !== null).length} / {questions.length}
              </span>
            </div>
          </div>
        )}

        {/* ===== Appraisal Grid ===== */}
        {showAppraisalGrid && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Appraisal Questions - Grid Mode
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="w-10 px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Question</th>
                    {questions[0]?.options.map((opt) => (
                      <th key={opt.id} className="w-28 px-3 py-2 text-center font-semibold">{opt.text}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="border-b border-border last:border-none hover:bg-muted/20">
                      <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                      <td className="px-3 py-2">{q.question}</td>
                      {q.options.map((opt) => (
                        <td key={opt.id} className="px-3 py-2 text-center">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={q.userResponse === opt.id}
                            onChange={() =>
                              setQuestions((prev) =>
                                prev.map((qq) => (qq.id === q.id ? { ...qq, userResponse: opt.id } : qq))
                              )
                            }
                            className="h-4 w-4 accent-primary"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <Button size="sm" onClick={calculateResult}>
                Submit & Calculate
              </Button>
              <span className="ml-auto text-[10px] text-muted-foreground">
                Answered: {questions.filter((q) => q.userResponse !== null).length} / {questions.length}
              </span>
            </div>
          </div>
        )}

        {/* ===== Test History ===== */}
        {showTestHistory && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Test History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Question</th>
                    <th className="px-3 py-2 text-center font-semibold">Response</th>
                    <th className="px-3 py-2 text-center font-semibold">Correct</th>
                    <th className="px-3 py-2 text-center font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => {
                    const selected = q.options.find((o) => o.id === q.userResponse)
                    const correct = selected?.correct
                    return (
                      <tr key={q.id} className="border-b border-border last:border-none hover:bg-muted/20">
                        <td className="px-3 py-1.5 text-muted-foreground">{idx + 1}</td>
                        <td className="px-3 py-1.5">{q.question}</td>
                        <td className="px-3 py-1.5 text-center font-medium">{selected?.text || "-"}</td>
                        <td className="px-3 py-1.5 text-center">{q.options.find((o) => o.correct)?.text}</td>
                        <td className="px-3 py-1.5 text-center">
                          {selected ? (
                            correct ? (
                              <CheckCircle2 className="mx-auto h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="mx-auto h-4 w-4 text-red-600" />
                            )
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== Sub-Tabs: Appraisal Summary / License Category ===== */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveSubTab("appraisal")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeSubTab === "appraisal"
                  ? "border-b-2 border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Appraisal Questions (F6)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("category")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeSubTab === "category"
                  ? "border-b-2 border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              License Category (F7)
            </button>
          </div>

          <div className="p-4">
            {activeSubTab === "appraisal" && (
              <div>
                {!tokenId ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    Call a token and select questionnaire to start the physical test.
                  </p>
                ) : !questionnaireId ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    Please select a questionnaire above.
                  </p>
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    Use the <strong>Appraisal Question</strong> button above to start the test in{" "}
                    <strong>{quesViewMode}</strong> mode.
                  </div>
                )}
              </div>
            )}

            {activeSubTab === "category" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="w-10 px-3 py-2 text-center">
                        <Checkbox disabled />
                      </th>
                      <th className="w-16 px-3 py-2 font-semibold">Line</th>
                      <th className="px-3 py-2 font-semibold">License Category</th>
                      <th className="w-20 px-3 py-2 text-center font-semibold">Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr
                        key={cat.line}
                        className={`border-b border-border last:border-none hover:bg-muted/20 ${
                          cat.isfailed ? "bg-red-50 dark:bg-red-950/10" : ""
                        }`}
                      >
                        <td className="px-3 py-1.5 text-center">
                          <Checkbox
                            checked={cat.checked}
                            onCheckedChange={(v) =>
                              setCategories((prev) =>
                                prev.map((c) => (c.line === cat.line ? { ...c, checked: !!v } : c))
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-1.5 text-muted-foreground">{cat.line}</td>
                        <td className="px-3 py-1.5">{cat.category}</td>
                        <td className="px-3 py-1.5 text-center">
                          {cat.isfailed && <XCircle className="mx-auto h-4 w-4 text-red-500" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">Driving License Sindh - Physical Test Module</p>
      </footer>
    </div>
  )
}

/* ---------- Helpers ---------- */
function FieldRow({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Label className="text-[11px] font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function ResultStat({ label, value, className = "" }: { label: string; value: number; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <span className={`text-lg font-bold ${className}`}>{value}</span>
    </div>
  )
}
