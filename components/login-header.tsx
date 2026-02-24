import Image from "next/image"

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg">
        <Image
          src="/images/logo-dls.png"
          alt="Driving License Sindh - Sindh Police Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance text-center">
          Driving License Sindh
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Official DLS Portal - Sindh Police
        </p>
      </div>
    </div>
  )
}
