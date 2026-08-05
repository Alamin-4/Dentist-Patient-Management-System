"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldOff, Mail, CheckCircle2, X } from "lucide-react";
import { api } from "@/core/api/axios.instance";

export default function AccountSuspendedBanner() {
  const searchParams = useSearchParams();
  const isSuspendedParam = searchParams.get("account_suspended") === "true";

  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isSuspendedParam) {
      setIsVisible(true);
    }
  }, [isSuspendedParam]);

  if (!isVisible) return null;

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setErrorMessage("Please fill in both your email and appeal explanation.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post("/contact/appeal-suspension", {
        email,
        message,
      });

      if (res.data?.success) {
        setSubmittedTicket(res.data?.data?.ticketId || "SUP-ACCEPTED");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to submit appeal. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-linear-to-r from-red-600 to-amber-600 text-white px-4 py-3 shadow-md border-b border-red-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 shrink-0">
              <ShieldOff className="h-4 w-4 text-white" />
            </div>
            <span>
              <strong>Account Suspended:</strong> Your account status is currently suspended. Access to dashboard and listings is restricted.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-red-700 shadow-sm hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" /> Appeal Suspension
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer text-white/80 hover:text-white"
              title="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Appeal Suspension Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSubmittedTicket(null);
              }}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {submittedTicket ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Appeal Submitted</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your appeal has been received under ticket ID <strong className="text-gray-900">{submittedTicket}</strong>. We have dispatched a confirmation email to <strong className="text-gray-900">{email}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmittedTicket(null);
                    }}
                    className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitAppeal} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ShieldOff className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Appeal Account Suspension</h3>
                    <p className="text-xs text-gray-500">
                      Submit an explanation to our administration team for review.
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@example.com"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Explanation / Reason for Appeal *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain why your account suspension should be reviewed or lifted..."
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Submitting..." : "Submit Appeal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
