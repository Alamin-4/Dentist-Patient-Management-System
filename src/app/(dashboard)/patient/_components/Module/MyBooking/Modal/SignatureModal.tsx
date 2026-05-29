"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signature: string) => void;
}

const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
}: SignatureModalProps) => {
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas context
  useEffect(() => {
    if (activeTab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
      }
    }
  }, [activeTab, isOpen]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.beginPath();
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleConfirm = () => {
    if (activeTab === "draw" && canvasRef.current) {
      onConfirm(canvasRef.current.toDataURL());
    } else {
      onConfirm(typedName);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#1A1A2E]">E-Signature</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="size-6 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex bg-[#F8FAFC] p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("draw")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "draw"
                  ? "bg-white shadow-sm text-[#1A1A2E]"
                  : "text-slate-400",
              )}
            >
              Draw
            </button>
            <button
              onClick={() => setActiveTab("type")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "type"
                  ? "bg-white shadow-sm text-[#1A1A2E]"
                  : "text-slate-400",
              )}
            >
              Type
            </button>
          </div>

          {/* Canvas/Input Area */}
          <div className="relative border border-slate-200 rounded-xl overflow-hidden min-h-50 bg-white group">
            {activeTab === "draw" ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-50 cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute top-3 right-3 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <RotateCcw className="size-5" />
                </button>
              </>
            ) : (
              <div className="p-8 flex items-center justify-center h-50">
                <input
                  type="text"
                  placeholder="Type your name here..."
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full text-4xl text-center font-serif italic border-none focus:ring-0 placeholder:text-slate-200 text-[#1A1A2E]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-[#1A1A2E] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#0F3659] text-white rounded-xl font-bold hover:bg-[#0A2640] transition-colors"
          >
            Confirm Sign
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignatureModal;
