"use client";

import { useMemo } from "react";
import { List, Calendar, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchableDropdown from "@/components/ui/SearchableDropdown";

interface PolicyLayoutProps {
  title: string;
  content: string;
  lastUpdated?: string;
}

export function PolicyLayout({ title, content, lastUpdated = "July 23, 2026" }: PolicyLayoutProps) {
  // Parse document outline headings from both HTML & Markdown
  const outline = useMemo(() => {
    const headings: { text: string; id: string; level: number }[] = [];
    if (!content) return headings;

    // First try parsing HTML elements
    if (/<[a-z][\s\S]*>/i.test(content)) {
      const parser = typeof window !== "undefined" ? new DOMParser() : null;
      if (parser) {
        const doc = parser.parseFromString(content, "text/html");
        const elements = doc.querySelectorAll("h1, h2, h3");
        elements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (text) {
            const level = parseInt(el.tagName.replace("H", ""), 10);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            headings.push({ level: isNaN(level) ? 2 : level, text, id });
          }
        });
      }
    }

    if (headings.length === 0) {
      // Fallback markdown parsing
      const lines = content.split("\n");
      lines.forEach((line) => {
        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
          const text = match[2].trim();
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          headings.push({
            level: match[1].length,
            text,
            id,
          });
        }
      });
    }

    return headings;
  }, [content]);

  const dropdownOptions = useMemo(() => {
    return outline.map((item) => ({
      value: item.id,
      label: (item.level === 3 ? "  • " : "") + item.text,
    }));
  }, [outline]);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-400 w-11/12 mx-auto">
        <div className="flex flex-col xl:flex-row gap-12 items-start">
          {/* Mobile Section Selector */}
          {outline.length > 0 && (
            <div className="w-full xl:hidden mb-4 bg-white border border-[#CEE0F4] rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 items-center gap-2">
                <List className="h-4 w-4 text-[#10436B]" />
                Jump to Section
              </label>
              <SearchableDropdown
                value=""
                onChange={(val) => handleScrollTo(val)}
                options={dropdownOptions}
                placeholder="Select a section..."
                allowClear={false}
                triggerClassName="bg-slate-50 font-bold border-[#CEE0F4] h-11 text-slate-800 focus:ring-[#10436B]/10 focus:border-[#10436B]"
              />
            </div>
          )}

          {/* Left: Outline Navigator (Desktop) */}
          <div className="hidden xl:block w-full xl:w-64 shrink-0 rounded-2xl border border-[#CEE0F4] bg-white p-6 sticky top-28 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <List className="h-4 w-4 text-[#10436B]" />
              Table of Contents
            </h4>

            {outline.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No outline headers found.</p>
            ) : (
              <ul className="space-y-2.5">
                {outline.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleScrollTo(item.id)}
                    className={cn(
                      "text-xs font-medium text-slate-500 hover:text-[#10436B] transition-colors cursor-pointer border-l-2 pl-2 hover:border-[#10436B]/60",
                      item.level === 2 ? "font-semibold border-slate-200" : "pl-4 border-transparent text-[11px]"
                    )}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: Policy Document Paper Container */}
          <div className="flex-1 w-full bg-white border border-[#CEE0F4] rounded-3xl p-6 md:p-12 space-y-8">
            {/* Header branding */}
            <div className="border-b border-slate-100 pb-6 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F9FD] text-[#10436B] text-xs font-bold rounded-full border border-[#CEE0F4]/60">
                <Shield className="h-3.5 w-3.5" />
                Legal Agreements
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight">
                {title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
            </div>

            {/* Document Render Canvas */}
            {isHtml ? (
              <div
                className="policy-rendered-content prose prose-slate max-w-none text-[#1A1A2E] text-[15px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose prose-slate max-w-none text-[#1A1A2E] text-[15px] leading-relaxed">
                {content.split("\n").map((line, idx) => {
                  if (line.startsWith("# ")) return null;
                  if (line.startsWith("## ")) {
                    const text = line.replace("## ", "");
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h2
                        key={idx}
                        id={id}
                        className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4 border-b pb-1.5 border-slate-100 scroll-mt-28"
                      >
                        {text}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    const text = line.replace("### ", "");
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h3
                        key={idx}
                        id={id}
                        className="text-lg font-bold text-[#10436B] mt-6 mb-3 scroll-mt-28"
                      >
                        {text}
                      </h3>
                    );
                  }
                  if (line.startsWith("> ")) {
                    return (
                      <blockquote
                        key={idx}
                        className="border-l-4 border-[#E3A32A] bg-amber-50/40 px-5 py-3 my-4 rounded-r-xl text-slate-600 italic"
                      >
                        {line.replace("> ", "")}
                      </blockquote>
                    );
                  }
                  if (line.trim() === "") return <div key={idx} className="h-3" />;
                  return (
                    <p key={idx} className="mb-4 text-slate-600">
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .policy-rendered-content h1 {
          font-size: 1.85rem;
          font-weight: 900;
          color: #1a1a2e;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .policy-rendered-content h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.35rem;
        }
        .policy-rendered-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #10436b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .policy-rendered-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #475569;
        }
        .policy-rendered-content blockquote {
          border-left: 4px solid #e3a32a;
          background-color: #fefce8;
          padding: 0.75rem 1.25rem;
          margin: 1rem 0;
          font-style: italic;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #475569;
        }
        .policy-rendered-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-rendered-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
