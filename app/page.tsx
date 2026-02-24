import { LoginHeader } from "@/components/login-header"
import { LoginForm } from "@/components/login-form"
import { Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background p-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/5" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
          <div className="flex flex-col gap-8">
            <LoginHeader />
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured by Sindh Police IT Department</span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center">
            {"Government of Sindh - All Rights Reserved"}
          </p>
        </div>
      </div>
    </main>
  )
}
