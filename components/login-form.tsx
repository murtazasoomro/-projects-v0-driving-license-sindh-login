"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        setIsLoading(false)
        return
      }

      // Store user + branch info in sessionStorage
      sessionStorage.setItem("dls_user", data.user.fullName)
      sessionStorage.setItem("dls_user_id", String(data.user.userId))
      sessionStorage.setItem("dls_username", data.user.username)
      sessionStorage.setItem("dls_role", data.user.role)
      sessionStorage.setItem("dls_authenticated", "true")
      // Branch info
      sessionStorage.setItem("dls_branch_id", String(data.branch.branchId))
      sessionStorage.setItem("dls_branch_name", data.branch.branchName)
      sessionStorage.setItem("dls_branch_code", data.branch.branchCode)
      sessionStorage.setItem("dls_branch_address", data.branch.address || "")
      sessionStorage.setItem("dls_branch_phone", data.branch.phone || "")
      sessionStorage.setItem("dls_branch_timings", data.branch.timings || "")

      router.push("/session")
    } catch {
      setError("Cannot connect to server. Check your SQL Server is running.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Username / CNIC
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your CNIC or username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-11 rounded-lg border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 rounded-lg border-border bg-secondary/50 px-4 pr-11 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        <a
          href="#"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </span>
        )}
      </Button>
    </form>
  )
}
