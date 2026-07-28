"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  FileText,
  Eye,
  Edit2,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Highlighter,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichDocumentEditorProps {
  categoryName?: string;
  title: string;
  onTitleChange?: (title: string) => void;
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

export function RichDocumentEditor({
  categoryName = "POLICIES & DOCUMENTS",
  title,
  onTitleChange,
  content,
  onChange,
  onSave,
  isSaving = false,
  readOnly = false,
  placeholder = "Start writing your document content here...",
}: RichDocumentEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const formattedHtml = formatContentToHtml(content);

    if (editorRef.current.innerHTML !== formattedHtml && !isUpdatingRef.current) {
      editorRef.current.innerHTML = formattedHtml || `<p><br></p>`;
    }
  }, [content, activeTab]);

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (readOnly || activeTab === "preview") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    // Force browsers to output inline CSS styles (<span style="color: ...">)
    // instead of legacy presentational tags (<font color="...">) which CSS overrides
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch (e) {
      // fallback
    }
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleBlockFormat = (format: string) => {
    if (format === "p") {
      execCmd("formatBlock", "<p>");
    } else if (format === "h1") {
      execCmd("formatBlock", "<h1>");
    } else if (format === "h2") {
      execCmd("formatBlock", "<h2>");
    } else if (format === "h3") {
      execCmd("formatBlock", "<h3>");
    } else if (format === "blockquote") {
      execCmd("formatBlock", "<blockquote>");
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      execCmd("createLink", url);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    execCmd("foreColor", e.target.value);
  };

  const handleHighlightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || activeTab === "preview") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch (e) { }

    if (!document.execCommand("hiliteColor", false, e.target.value)) {
      document.execCommand("backColor", false, e.target.value);
    }
    handleInput();
  };

  const stats = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = text ? text.split(" ").filter(Boolean).length : 0;
    const charCount = text.length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return { wordCount, charCount, readTime };
  }, [content]);

  const outline = useMemo(() => {
    const headings: { text: string; level: number }[] = [];
    if (!content) return headings;

    const parser = typeof window !== "undefined" ? new DOMParser() : null;
    if (parser) {
      const doc = parser.parseFromString(content, "text/html");
      const elements = doc.querySelectorAll("h1, h2, h3");
      elements.forEach((el) => {
        const level = parseInt(el.tagName.replace("H", ""), 10);
        headings.push({
          text: el.textContent || "",
          level: isNaN(level) ? 2 : level,
        });
      });
    }

    if (headings.length === 0) {
      const lines = content.split("\n");
      lines.forEach((line) => {
        const match = line.match(/^(#{1,3})\s+(.*)$/);
        if (match) {
          headings.push({
            level: match[1].length,
            text: match[2].trim(),
          });
        }
      });
    }

    return headings;
  }, [content]);

  return (
    <div className="flex flex-col gap-5 w-full text-slate-800">
      <div className="border border-slate-200 bg-white rounded-sm p-4 flex flex-wrap md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>EDITOR</span>
            <span>&rsaquo;</span>
            <span className="text-[#10436B]">{categoryName}</span>
          </div>
          {onTitleChange ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled Document..."
              className="w-full text-xl md:text-2xl font-black text-text outline-none border-b border-transparent focus:border-[#10436B] bg-transparent transition-all"
            />
          ) : (
            <h2 className="text-xl md:text-2xl font-black text-text truncate">
              {title || "Untitled Document"}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex flex-wrap shrink-0 items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                activeTab === "edit"
                  ? "bg-white text-text border border-slate-200"
                  : "text-slate-500 hover:text-text"
              )}
            >
              <Edit2 className="h-3.5 w-3.5" />
              Document Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                activeTab === "preview"
                  ? "bg-white text-text border border-slate-200"
                  : "text-slate-500 hover:text-text"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </button>
          </div>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-[#10436B] hover:bg-[#0d3656] text-white px-5 py-2 text-xs font-bold transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="w-full xl:w-60 shrink-0 rounded-sm border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <List className="h-4 w-4 text-[#10436B]" />
              Document Outline
            </h4>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
              {outline.length} sections
            </span>
          </div>

          {outline.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              No headings found. Add Heading 1 or Heading 2 to generate outline structure automatically.
            </p>
          ) : (
            <ul className="space-y-2 max-h-75 overflow-y-auto pr-1">
              {outline.map((item, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "text-xs font-medium text-slate-600 border-l-2 transition-colors pl-2.5 py-0.5 hover:text-[#10436B] cursor-pointer",
                    item.level === 1 && "font-bold text-text border-[#10436B]",
                    item.level === 2 && "border-slate-300 pl-3",
                    item.level === 3 && "border-slate-200 text-slate-400 pl-4 text-[11px]"
                  )}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
            <div className="flex justify-between items-center">
              <span>Word Count:</span>
              <span className="font-bold text-text">{stats.wordCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Characters:</span>
              <span className="font-bold text-text">{stats.charCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Est. Read Time:</span>
              <span className="font-bold text-[#10436B]">{stats.readTime} min</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full border border-slate-200 rounded-sm flex justify-center min-h-75">
          <div className="w-full max-w-full bg-white flex rounded-sm flex-col overflow-hidden">

            {activeTab === "edit" && !readOnly && (
              <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1 md:gap-2">

                <select
                  onChange={(e) => handleBlockFormat(e.target.value)}
                  defaultValue="p"
                  className="h-8 rounded border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#10436B]"
                  title="Text Style"
                >
                  <option value="p">Normal text</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="blockquote">Blockquote</option>
                </select>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => execCmd("bold")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors font-bold"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("italic")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("underline")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("strikeThrough")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Text & Highlight Color */}
                <label className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors cursor-pointer relative" title="Text Color">
                  <Palette className="h-4 w-4" />
                  <input
                    type="color"
                    onChange={handleColorChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <label className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors cursor-pointer relative" title="Highlight Color">
                  <Highlighter className="h-4 w-4" />
                  <input
                    type="color"
                    onChange={handleHighlightChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Text Alignment Controls */}
                <button
                  type="button"
                  onClick={() => execCmd("justifyLeft")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyCenter")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyRight")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyFull")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Justify"
                >
                  <AlignJustify className="h-4 w-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Lists & Quotes */}
                <button
                  type="button"
                  onClick={() => execCmd("insertUnorderedList")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("insertOrderedList")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Insert Hyperlink"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Undo / Redo & Clear */}
                <button
                  type="button"
                  onClick={() => execCmd("undo")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Undo"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("redo")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Redo"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("removeFormat")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  title="Clear Formatting"
                >
                  <RemoveFormatting className="h-4 w-4" />
                </button>

              </div>
            )}

            {/* Paper Document Content Area */}
            <div className="flex-1 p-6 md:p-12 flex flex-col overflow-y-auto">
              {activeTab === "edit" ? (
                <div
                  ref={editorRef}
                  contentEditable={!readOnly}
                  onInput={handleInput}
                  className="rich-editor-content flex-1 w-full outline-none text-[15px] font-normal leading-relaxed text-slate-800 focus:ring-0 min-h-105"
                  style={{ whiteSpace: "pre-wrap" }}
                />
              ) : (
                <div
                  className="rich-editor-content prose prose-slate max-w-none text-slate-800 text-[15px] leading-relaxed min-h-105"
                  dangerouslySetInnerHTML={{ __html: formatContentToHtml(content) }}
                />
              )}
            </div>

            {/* Paper Sheet Footer Info */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#10436B]" />
                {title || "Document Paper Sheet"}
              </span>
              <div className="flex items-center gap-4">
                <span>{stats.wordCount} Words</span>
                <span>&bull;</span>
                <span>{stats.charCount} Characters</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        .rich-editor-content font[color] {
          color: attr(color, color);
        }
        .rich-editor-content h1 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #1a1a2e;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        .rich-editor-content h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.25rem;
        }
        .rich-editor-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #10436b;
          margin-top: 0.85rem;
          margin-bottom: 0.35rem;
        }
        .rich-editor-content p {
          margin-bottom: 0.75rem;
          line-height: 1.7;
          color: #334155;
        }
        .rich-editor-content blockquote {
          border-left: 4px solid #e3a32a;
          background-color: #fefce8;
          padding: 0.6rem 1rem;
          margin: 0.75rem 0;
          font-style: italic;
          border-radius: 0 0.375rem 0.375rem 0;
          color: #475569;
        }
        .rich-editor-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-editor-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-editor-content a {
          color: #10436b;
          text-decoration: underline;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function formatContentToHtml(raw: string): string {
  if (!raw) return "<p><br></p>";

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return raw;
  }

  const lines = raw.split("\n");
  const htmlLines = lines.map((line) => {
    if (line.startsWith("# ")) {
      return `<h1>${line.replace("# ", "")}</h1>`;
    }
    if (line.startsWith("## ")) {
      return `<h2>${line.replace("## ", "")}</h2>`;
    }
    if (line.startsWith("### ")) {
      return `<h3>${line.replace("### ", "")}</h3>`;
    }
    if (line.startsWith("> ")) {
      return `<blockquote>${line.replace("> ", "")}</blockquote>`;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return `<li>${line.substring(2)}</li>`;
    }
    if (line.trim() === "") {
      return `<p><br></p>`;
    }
    return `<p>${line}</p>`;
  });

  return htmlLines.join("");
}
