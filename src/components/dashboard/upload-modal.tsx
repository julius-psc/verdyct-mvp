"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  IconUpload,
  IconX,
  IconCircleCheckFilled,
  IconAlertHexagon,
  IconArrowRight,
} from "@tabler/icons-react"

import type { ActivityItem } from "./activity-feed"
import type { ShipmentRow } from "./recent-shipments"

type ModalStep = "dropzone" | "file-selected" | "processing" | "results"

const PROCESSING_MESSAGES = [
  "Extracting shipper details...",
  "Identifying goods classification...",
  "Checking CBAM obligations...",
]

type FieldConfidence = "high" | "medium"
type ExtractedField = {
  label: string
  value: string
  confidence: FieldConfidence
  special?: "cbam"
}

const EXTRACTED_FIELDS: ExtractedField[] = [
  { label: "Shipper Name",      value: "Thyssenkrupp AG",                            confidence: "high" },
  { label: "Shipper Address",   value: "ThyssenKrupp Allee 1, 45143 Essen, Germany", confidence: "high" },
  { label: "Consignee Name",    value: "Verdyct Trade Solutions Ltd.",                confidence: "high" },
  { label: "Consignee Address", value: "12 Rue de la Paix, 75002 Paris, France",     confidence: "high" },
  { label: "Description",       value: "Hot-rolled steel coils, uncoated",           confidence: "high" },
  { label: "HS Code",           value: "7228.30",                                    confidence: "medium" },
  { label: "Quantity",          value: "48",                                         confidence: "high" },
  { label: "Unit",              value: "Metric Tonnes",                              confidence: "high" },
  { label: "Declared Value",    value: "187,200.00",                                 confidence: "high" },
  { label: "Currency",          value: "EUR",                                        confidence: "high" },
  { label: "Country of Origin", value: "Germany",                                   confidence: "high" },
  { label: "Incoterms",         value: "DAP",                                        confidence: "medium" },
  { label: "Gross Weight",      value: "48,520 kg",                                  confidence: "high" },
  { label: "CBAM Status",       value: "",                                           confidence: "high", special: "cbam" },
]

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({ field }: { field: ExtractedField }) {
  const labelColor = field.confidence === "medium" ? "rgba(251,191,36,0.7)" : "rgba(255,255,255,0.38)"

  if (field.special === "cbam") {
    return (
      <>
        <span className="self-center" style={{ color: labelColor, fontSize: 11 }}>{field.label}</span>
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ background: "#FF70B515" }}
        >
          <IconAlertHexagon size={13} style={{ color: "#FF70B5", flexShrink: 0 }} />
          <span style={{ color: "#FF70B5", fontSize: 11, fontWeight: 500 }}>
            CBAM Applicable — Steel products detected
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <span className="self-center" style={{ color: labelColor, fontSize: 11 }}>{field.label}</span>
      <input
        defaultValue={field.value}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-white/20"
      />
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function UploadButton({
  onSuccess,
}: {
  onSuccess: (activity: ActivityItem, shipment: ShipmentRow) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<ModalStep>("dropzone")
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("Invoice_Thyssenkrupp-AG_April2026.pdf")
  const [fileSize, setFileSize] = useState("59 KB")
  const [msgIndex, setMsgIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step !== "processing") return
    const interval = setInterval(() => setMsgIndex(i => (i + 1) % PROCESSING_MESSAGES.length), 2000)
    const timeout = setTimeout(() => setStep("results"), 4500)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [step])

  const open = () => { setStep("file-selected"); setMsgIndex(0); setIsOpen(true) }
  const close = () => setIsOpen(false)

  const handleFile = useCallback((file: File) => {
    setFileName(file.name)
    setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`)
    setStep("file-selected")
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSave = () => {
    close()
    onSuccess(
      {
        id: `act-${Date.now()}`,
        type: "uploaded",
        message: "Invoice uploaded and processed",
        detail: "Thyssenkrupp · SHP-008",
        time: "Just now",
      },
      {
        id: "SHP-008",
        document: "Invoice_Thyssenkrupp_March2026.pdf",
        client: "Thyssenkrupp",
        status: "Pending Review",
        date: "Just now",
      }
    )
    toast.success("Shipment saved successfully", {
      description: "HS Code 7228.30 suggested — review recommended",
      icon: <IconCircleCheckFilled size={16} style={{ color: "#34d399" }} />,
    })
  }

  const modalWidth = step === "results" ? 680 : 520

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={open}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium text-white transition-colors"
        style={{ background: "#FF70B5" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#e85faa")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FF70B5")}
      >
        <IconUpload size={13} stroke={2} />
        Upload Document
      </button>

      {/* Overlay — scrollable so modal never clips */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={close}
        >
          <div className="flex min-h-full items-center justify-center p-6">
            <div
              onClick={e => e.stopPropagation()}
              className="relative flex flex-col rounded-xl p-6"
              style={{
                width: modalWidth,
                maxWidth: "calc(100vw - 48px)",
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "width 0.3s ease",
                animation: "modal-in 0.2s ease both",
              }}
            >

              {/* ── Drop zone ── */}
              {step === "dropzone" && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-base font-semibold text-white">Upload Document</h2>

                  <div
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl py-14 transition-colors"
                    style={{
                      border: `2px dashed ${isDragging ? "#FF70B5" : "rgba(255,112,181,0.35)"}`,
                      background: isDragging ? "rgba(255,112,181,0.04)" : "transparent",
                    }}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragEnter={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#FF70B5"
                      e.currentTarget.style.background = "rgba(255,112,181,0.04)"
                    }}
                    onMouseLeave={e => {
                      if (!isDragging) {
                        e.currentTarget.style.borderColor = "rgba(255,112,181,0.35)"
                        e.currentTarget.style.background = "transparent"
                      }
                    }}
                  >
                    <IconUpload size={26} style={{ color: "#FF70B5" }} stroke={1.5} />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">Drop your PDF here</p>
                      <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Supports: Commercial Invoice, Bill of Lading, Packing List, AWB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                  />
                </div>
              )}

              {/* ── File selected ── */}
              {step === "file-selected" && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-base font-semibold text-white">Upload Document</h2>

                  {/* Compact file pill — no icon, left-aligned */}
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                    style={{
                      background: "rgba(255,112,181,0.05)",
                      border: "1px solid rgba(255,112,181,0.2)",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">{fileName}</p>
                      <p className="text-[11px] text-muted-foreground">{fileSize} · PDF</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("dropzone")}
                      className="flex size-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      <IconX size={11} stroke={2} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => { setStep("processing"); setMsgIndex(0) }}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md text-sm font-medium text-white transition-colors"
                      style={{ background: "#FF70B5" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#e85faa")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#FF70B5")}
                    >
                      Submit for Analysis
                      <IconArrowRight size={14} stroke={2} />
                    </button>
                    <p className="text-center text-[11px] text-muted-foreground">
                      Verdyct will extract all fields automatically. You review and confirm.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Processing ── */}
              {step === "processing" && (
                <div className="flex flex-col items-center justify-center gap-5 py-12">
                  <Image
                    src="/images/brand/verdyct-transparent-bg.svg"
                    alt="Verdyct"
                    width={44}
                    height={44}
                    style={{
                      filter: "brightness(0) saturate(100%) invert(61%) sepia(62%) saturate(700%) hue-rotate(296deg) brightness(110%)",
                    }}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Reading your document...</p>
                    <p
                      key={msgIndex}
                      className="mt-1.5 text-xs text-muted-foreground"
                      style={{ animation: "fade-up 0.4s ease both" }}
                    >
                      {PROCESSING_MESSAGES[msgIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Results ── */}
              {step === "results" && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <IconCircleCheckFilled size={17} style={{ color: "#34d399", flexShrink: 0 }} />
                    <div>
                      <h2 className="text-base font-semibold text-white">Review Extracted Data</h2>
                      <p className="text-[11px] text-muted-foreground">
                        14 fields extracted — edit any field before saving
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2.5 sm:grid-cols-[140px_1fr] sm:gap-x-4">
                    {EXTRACTED_FIELDS.map(field => (
                      <React.Fragment key={field.label}>
                        <FieldRow field={field} />
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex h-8 w-full items-center justify-center rounded-md text-xs font-medium text-white transition-colors"
                      style={{ background: "#FF70B5" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#e85faa")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#FF70B5")}
                    >
                      Save Shipment
                    </button>
                    <p className="text-center text-[11px] text-muted-foreground">
                      This shipment will appear in your dashboard immediately.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
