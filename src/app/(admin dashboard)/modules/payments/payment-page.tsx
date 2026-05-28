"use client";

import { useState, useMemo } from "react";
import {
  Search, Download, X, ChevronDown, ChevronRight,
  Shield, DollarSign, Clock, CheckCircle, Circle,
} from "lucide-react";
import paymentsData from "@/lib/payments-data";
import { cn } from "@/lib/utils";

type Transaction = (typeof paymentsData.transactions)[number];
type StatusFilter = "All" | "In Escrow" | "Released" | "Refunded" | "Refund Pending";

/* ─── helpers ───────────────────────────────────────────────────────────── */
function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm")}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  "In Escrow":      { dot: "bg-amber-400",  text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  Released:         { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  "Refunded (100%)": { dot: "bg-red-400",    text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
  "Refunded (90%)": { dot: "bg-red-400",    text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
  "Refund Pending": { dot: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", s.bg, s.border, s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

/* ─── Payment Drawer ─────────────────────────────────────────────────────── */
function PaymentDrawer({ txn, onClose }: { txn: Transaction | null; onClose: () => void }) {
  const open = !!txn;

  if (typeof window !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (!txn) return null;

  const s = STATUS_STYLES[txn.status] ?? STATUS_STYLES["In Escrow"];

  const detailRows = [
    { label: "Booking ID", value: <span className="font-semibold text-blue-600">{txn.booking_id}</span> },
    { label: "Patient", value: <span className="flex items-center gap-2"><Avatar initials={txn.patient_initials} color={txn.patient_avatar_color} size="sm" />{txn.patient_name}</span> },
    { label: "Dentist", value: <span className="flex items-center gap-2"><Avatar initials={txn.dentist_initials} color={txn.dentist_avatar_color} size="sm" />{txn.dentist_name}</span> },
    { label: "Procedure", value: txn.procedure },
    { label: "Amount", value: <span className="font-semibold">${txn.amount.toLocaleString()}</span> },
    { label: "Status", value: <StatusBadge status={txn.status} /> },
    { label: "Payment date", value: txn.payment_date },
    { label: "Stripe ref", value: <span className="font-mono text-xs text-gray-500">{txn.stripe_ref}</span> },
  ];

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/30 transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-120 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-[#1A1A2E]">{txn.txn_ref}</p>
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.bg, s.border, s.text)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                {txn.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">Booking {txn.booking_id}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Transaction details */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Transaction Details</p>
            <div className="divide-y divide-gray-50 rounded-xl border border-gray-100 bg-white">
              {detailRows.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1A2E]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Timeline */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Escrow Timeline</p>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <ol className="space-y-4">
                {txn.escrow_timeline.map((step, i) => {
                  const isCurrent = "current" in step && step.current === true;
                  const isDone = step.completed && !isCurrent;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : isCurrent ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                          </div>
                        ) : (
                          <Circle className="h-5 w-5 text-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", isDone || isCurrent ? "text-[#1A1A2E]" : "text-gray-300")}>
                          {step.step}
                        </p>
                        {step.date && <p className="text-xs text-gray-400">{step.date}</p>}
                        {step.description && !step.date && (
                          <p className={cn("text-xs", isCurrent ? "text-gray-500" : "text-gray-300")}>{step.description}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-3">
          <p className="text-center text-xs text-gray-400">Read-only view — all escrow actions are handled automatically.</p>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function PaymentPage() {
  const meta = paymentsData.meta;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const statusOptions: StatusFilter[] = ["All", "In Escrow", "Released", "Refunded", "Refund Pending"];

  const filtered = useMemo(() => {
    let list = paymentsData.transactions as Transaction[];
    if (statusFilter !== "All") {
      list = list.filter((t) => {
        if (statusFilter === "Refunded") return t.status.startsWith("Refunded");
        return t.status === statusFilter;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.booking_id.toLowerCase().includes(q) ||
        t.patient_name.toLowerCase().includes(q) ||
        t.dentist_name.toLowerCase().includes(q) ||
        t.procedure.toLowerCase().includes(q)
      );
    }
    return list;
  }, [statusFilter, search]);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Payments &amp; Escrow</h1>
            <p className="mt-0.5 text-sm text-gray-500">Monitor booking escrow, track releases, and manage referral payouts.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: <Shield className="h-6 w-6 text-amber-500" />, iconBg: "bg-amber-50", label: "Total Escrow Held", value: `$${meta.total_escrow_held.toLocaleString()}`, sub: "All active bookings" },
            { icon: <DollarSign className="h-6 w-6 text-emerald-500" />, iconBg: "bg-emerald-50", label: "Released This Month", value: `$${meta.released_this_month.toLocaleString()}`, sub: "Paid out to dentists", valueColor: "text-emerald-600" },
            { icon: <Clock className="h-6 w-6 text-red-500" />, iconBg: "bg-red-50", label: "Pending Refunds", value: `$${meta.pending_refunds.toLocaleString()}`, sub: "Awaiting processing", valueColor: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", s.iconBg)}>{s.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={cn("mt-1 text-3xl font-bold tracking-tight", s.valueColor ?? "text-[#1A1A2E]")}>{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Filters */}
          <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by booking ID or name..." className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]" />
            </div>
            {/* Status dropdown */}
            <div className="relative">
              <button onClick={() => setStatusOpen((v) => !v)} className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Status: {statusFilter} <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {statusOpen && (
                <div className="absolute left-0 top-10 z-20 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {statusOptions.map((opt) => (
                    <button key={opt} onClick={() => { setStatusFilter(opt); setStatusOpen(false); }} className={cn("w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50", statusFilter === opt ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              📅 Date range <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/40">
                  {["BOOKING ID", "PATIENT", "DENTIST", "AMOUNT", "STATUS", "DATE", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-sm text-gray-400">No transactions found</td></tr>
                ) : filtered.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedTxn(t)} className="cursor-pointer transition-colors hover:bg-gray-50/80">
                    <td className="px-4 py-3.5 text-sm font-semibold text-blue-600">{t.booking_id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={t.patient_initials} color={t.patient_avatar_color} size="sm" />
                        <span className="text-sm font-medium text-[#1A1A2E]">{t.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={t.dentist_initials} color={t.dentist_avatar_color} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A2E]">{t.dentist_name}</p>
                          <p className="text-xs text-gray-400">{t.dentist_specialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1A1A2E]">${t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{t.date}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1 hover:text-[#1A1A2E]">View detail <ChevronRight className="h-3.5 w-3.5" /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-400">Showing {filtered.length} of {paymentsData.transactions.length} transactions</p>
          </div>
        </div>
      </div>

      {statusOpen && <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />}
      <PaymentDrawer txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </>
  );
}
