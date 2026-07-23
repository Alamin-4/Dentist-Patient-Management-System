"use client";

import { useState, useEffect } from "react";
import { Mail, RefreshCw, Eye, CheckCircle, Trash2, MailOpen, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTable, Column } from "../../shared/custom-table";
import toast from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const INITIAL_MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    name: "Dr. Sarah Connor",
    email: "sarah.connor@gmail.com",
    subject: "Escrow surprise guarantee verification question",
    message: "Hello RatedDocs admin, I would like to clarify if the surprise guarantee covers patient cancellation within 24 hours of booking, or is it only restricted to treatment discrepancies?",
    isRead: false,
    createdAt: "2026-07-22T08:45:00Z",
  },
  {
    id: "msg-2",
    name: "John Miller",
    email: "john.miller@yahoo.com",
    subject: "Problem uploading license document",
    message: "During step 2 (license upload), my verification form times out when uploading a 4.5MB PDF file. Can you assist?",
    isRead: true,
    createdAt: "2026-07-20T14:20:00Z",
  },
  {
    id: "msg-3",
    name: "Clara Bow",
    email: "clara.b@dentalcare.net",
    subject: "Partnership opportunity",
    message: "We run a network of 12 verified dental clinics in Boston and would love to bulk claim our profiles under your clinic depth platform features. Let's schedule a call.",
    isRead: false,
    createdAt: "2026-07-19T10:10:00Z",
  },
];

export function ContactMessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cms_contact_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(INITIAL_MOCK_MESSAGES);
      }
    } else {
      setMessages(INITIAL_MOCK_MESSAGES);
      localStorage.setItem("cms_contact_messages", JSON.stringify(INITIAL_MOCK_MESSAGES));
    }
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const saved = localStorage.getItem("cms_contact_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
    setLoading(false);
    toast.success("Inbox refreshed.");
  };

  const handleToggleRead = (id: string) => {
    const updated = messages.map((m) => {
      if (m.id === id) {
        const isRead = !m.isRead;
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead });
        }
        return { ...m, isRead };
      }
      return m;
    });
    setMessages(updated);
    localStorage.setItem("cms_contact_messages", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem("cms_contact_messages", JSON.stringify(updated));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
    toast.success("Message deleted.");
  };

  const columns: Column<Message>[] = [
    {
      key: "status",
      header: "Status",
      className: "w-20 text-center",
      render: (row) => (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
            row.isRead
              ? "bg-slate-100 text-slate-600 border border-slate-200"
              : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
          )}
        >
          {row.isRead ? "Read" : "New"}
        </span>
      ),
    },
    {
      key: "sender",
      header: "Sender",
      className: "w-48 font-semibold text-[#1A1A2E]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="truncate text-xs font-bold text-[#1A1A2E]">{row.name}</span>
          <span className="text-[11px] text-slate-400 font-medium truncate">{row.email}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      className: "max-w-xs",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#1A1A2E] truncate">{row.subject}</span>
          <span className="text-xs text-slate-400 line-clamp-1">{row.message}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Received Date",
      className: "w-40 text-slate-500 font-medium text-xs",
      render: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 relative min-h-[400px]">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E]">Contact Inquiries Inbox</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            View and respond to customer support inquiries submitted from the website.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh Inbox"
        >
          <RefreshCw className={cn("h-4 w-4 text-slate-500", loading && "animate-spin")} />
        </button>
      </div>

      {/* CustomTable */}
      <CustomTable
        columns={columns}
        data={messages}
        onRowClick={(row) => {
          if (!row.isRead) {
            handleToggleRead(row.id);
          }
          setSelectedMessage(row);
        }}
        emptyMessage="No inquiries in your inbox."
      />

      {/* Message Reader Drawer */}
      {selectedMessage && (
        <div className="absolute inset-0 bg-white border border-slate-300 rounded-xl p-6 flex flex-col z-30 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-[#10436B]" />
              Inquiry Detail Reader
            </h3>
            <button
              onClick={() => setSelectedMessage(null)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5">
            {/* Sender Meta Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Sender Name</p>
                <p className="text-xs font-bold text-[#1A1A2E]">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Received Date</p>
                <p className="text-xs font-medium text-slate-600">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                <p className="text-xs font-semibold text-[#10436B]">
                  {selectedMessage.email}
                </p>
              </div>
            </div>

            {/* Content Card */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Subject</p>
              <h4 className="text-sm font-bold text-[#1A1A2E] leading-snug">
                {selectedMessage.subject}
              </h4>
              
              <div className="h-[1px] bg-slate-200 my-3" />
              
              <p className="text-[10px] uppercase font-bold text-slate-400">Message Body</p>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 border border-slate-200 rounded-xl whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
            <button
              onClick={() => handleDelete(selectedMessage.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Inquiry
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleRead(selectedMessage.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {selectedMessage.isRead ? (
                  <>
                    <Mail className="h-4 w-4" />
                    Mark Unread
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4" />
                    Mark Read
                  </>
                )}
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#10436B] hover:bg-[#0d3656] px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Reply via Email
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
