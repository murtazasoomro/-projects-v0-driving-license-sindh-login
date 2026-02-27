"use client"

import { FileText } from "lucide-react"

export interface SettingsTile {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

interface SettingsTileGridProps {
  tiles: SettingsTile[]
}

export function SettingsTileGrid({ tiles }: SettingsTileGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={tile.onClick}
          className="group flex items-center gap-3 rounded-md border-l-4 border-l-[#2a8f7a] bg-[#2d3748] px-4 py-5 text-left transition-all hover:bg-[#374151] hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <FileText className="h-6 w-6 text-[#e2e8f0]" />
          </div>
          <span className="text-sm font-semibold leading-tight text-[#e2e8f0] group-hover:text-[#f7fafc]">
            {tile.label}
          </span>
        </button>
      ))}
    </div>
  )
}
