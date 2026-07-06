"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Upload,
  Sparkles,
  Smile,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  FileImage,
  ChevronRight,
  Sliders,
  X
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ─── Section data ──────────────────────────────────────────────────────────────

const FEATURES = [
  "Biometric Facial Mapping",
  "AI-Augmented Bone Density Prediction",
  "Direct specialist matching based on results",
];

// ─── Facial triangulation mesh (viewBox 0 0 100 100) ──────────────────────────
const L_POLYS = [
  "10,28 20,18 30,22",
  "20,18 30,22 36,12",
  "10,28 16,42 20,18",
  "20,18 28,38 30,22 16,42",
  "30,22 40,30 28,38",
  "40,30 46,44 36,52 28,38",
  "16,42 22,56 28,38",
  "28,38 30,60 36,52 22,56",
  "36,52 44,60 46,44 30,60",
  "22,56 17,64 24,70 30,60",
  "30,60 24,70 32,74 44,60 42,70",
  "24,70 20,78 28,82 32,74",
  "17,64 20,78 24,70",
];

const R_POLYS = [
  "90,28 80,18 70,22",
  "80,18 70,22 64,12",
  "90,28 84,42 80,18",
  "80,18 72,38 70,22 84,42",
  "70,22 60,30 72,38",
  "60,30 54,44 64,52 72,38",
  "84,42 78,56 72,38",
  "72,38 70,60 64,52 78,56",
  "64,52 56,60 54,44 70,60",
  "78,56 83,64 76,70 70,60",
  "70,60 76,70 68,74 56,60 58,70",
  "76,70 80,78 72,82 68,74",
  "83,64 80,78 76,70",
];

const L_DOTS: [number, number][] = [
  [10, 28], [20, 18], [30, 22], [36, 12], [16, 42], [28, 38], [40, 30],
  [46, 44], [22, 56], [36, 52], [30, 60], [44, 60], [17, 64], [24, 70],
  [32, 74], [28, 82], [20, 78],
];

const R_DOTS: [number, number][] = [
  [90, 28], [80, 18], [70, 22], [64, 12], [84, 42], [72, 38], [60, 30],
  [54, 44], [78, 56], [64, 52], [70, 60], [56, 60], [83, 64], [76, 70],
  [68, 74], [72, 82], [80, 78],
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AiSmilePreview() {
  const router = useRouter();

  // UI states
  const [imgVisible, setImgVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "scanning" | "results">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Scanning states
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Detecting facial landmarks...");

  // Slider states
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Triggered when step becomes "scanning"
  useEffect(() => {
    if (step !== "scanning") return;

    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep("results");
          }, 800);
          return 100;
        }

        // Change scanning messages dynamically
        if (next < 25) {
          setScanMessage("Detecting facial structure & landmarks...");
        } else if (next < 50) {
          setScanMessage("Analyzing bite and symmetry vectors...");
        } else if (next < 75) {
          setScanMessage("Generating virtual tooth overlays...");
        } else {
          setScanMessage("Finalizing whitening and straightening contours...");
        }

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [step]);

  // Handle Dragging Before/After Slider
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setStep("scanning");
    }
  };

  const handleUseSample = () => {
    setUploadedImage("/images/ai-smile-preview.png");
    setStep("scanning");
  };

  const resetFlow = () => {
    setUploadedImage(null);
    setStep("upload");
    setScanProgress(0);
    setSliderPosition(50);
  };

  const handleRedirectToDentists = () => {
    setIsModalOpen(false);
    resetFlow();
    // Redirect with procedure query parameters prefilled
    router.push("/find-dentists?procedure=Teeth Whitening,Clear Aligners,Veneers");
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl w-11/12 space-y-14">
        {/* ── Top: 2-column content row ── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading + description + button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="space-y-7"
          >
            <h2 className="font-heading text-[2.5rem] font-black leading-[1.08] tracking-tight text-[#0A0A1A] lg:text-[2.75rem]">
              Visualize your ideal smile <br className="hidden sm:block" />
              instantly.
            </h2>

            <p className="max-w-110 text-[15px] leading-relaxed text-slate-500">
              Our proprietary Neural-Dental engine analyzes your facial
              structure to simulate perfect symmetry. Upload a single photo and
              receive a full 3D simulation of your recommended procedures within
              seconds.
            </p>

            {/* Trigger Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center overflow-hidden rounded-lg bg-[#0E3E65] pl-6 pr-2 py-2 transition-all hover:bg-[#002850] active:scale-[0.98] text-white gap-3 shadow-md"
            >
              <span className="text-sm font-semibold">
                Try AI Smile Preview
              </span>
              <ArrowUpRight
                className="size-8 p-1.5 rounded-md bg-[#FFD86B] text-[#0E3E65]"
                strokeWidth={2.5}
              />
            </button>
          </motion.div>

          {/* Right: feature list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="size-5 shrink-0 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                </div>
                <span className="text-[15px] font-semibold text-slate-700">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom: AI visualization card ── */}
        <motion.div
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden rounded-xl cursor-pointer group shadow-lg"
          style={{
            aspectRatio: "2 / 1",
            background:
              "linear-gradient(180deg, #0f1b2d 0%, #071018 50%, #0a1622 100%)",
          }}
        >
          {/* Background image */}
          {imgVisible && (
            <Image
              src="/images/ai-smile-preview.png"
              fill
              alt="AI Smile Preview — facial mapping visualization"
              className="object-cover opacity-70 group-hover:scale-[1.02] transition-transform duration-700"
              onError={() => setImgVisible(false)}
              priority
            />
          )}

          {/* Color gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-cyan-500/10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-fuchsia-500/10" />

          {/* SVG Landmark Triangulation */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {L_POLYS.map((pts, i) => (
              <polygon
                key={`lp${i}`}
                points={pts}
                fill="none"
                stroke="rgb(34 211 238)"
                strokeWidth="0.22"
                strokeOpacity="0.5"
              />
            ))}
            {L_DOTS.map(([cx, cy], i) => (
              <circle
                key={`ld${i}`}
                cx={cx}
                cy={cy}
                r="0.55"
                fill="rgb(34 211 238)"
                fillOpacity="0.8"
              />
            ))}
            {R_POLYS.map((pts, i) => (
              <polygon
                key={`rp${i}`}
                points={pts}
                fill="none"
                stroke="rgb(240 114 255)"
                strokeWidth="0.22"
                strokeOpacity="0.5"
              />
            ))}
            {R_DOTS.map(([cx, cy], i) => (
              <circle
                key={`rd${i}`}
                cx={cx}
                cy={cy}
                r="0.55"
                fill="rgb(240 114 255)"
                fillOpacity="0.8"
              />
            ))}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="rgb(34 211 238)"
              strokeWidth="0.28"
              strokeOpacity="0.8"
            />
          </svg>

          {/* Center split glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_6px_rgb(34_211_238/0.4)]" />

          {/* Hover overlay CTA */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-[#FFD86B] text-[#0E3E65] font-bold text-sm px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Sparkles className="size-4" /> Try Live Smile Preview
            </span>
          </div>

          {/* Animated scan line */}
          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-400/55 to-transparent"
            style={{ top: "20%" }}
            animate={{ top: ["20%", "76%", "20%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* ─── Fully Functional Dialog Modal ────────────────────────────────────── */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetFlow();
        }}
      >
        <DialogContent className="sm:max-w-4xl w-11/12 p-0 overflow-hidden bg-white text-[#0A111F] border  rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] min-h-[500px]">

            {/* Left Column: Interactive Display & Viewport */}
            <div className="p-6 flex flex-col justify-center items-center border-r relative">
              <AnimatePresence mode="wait">

                {/* Step 1: Upload Dropzone */}
                {step === "upload" && (
                  <motion.div
                    key="upload-zone"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full flex flex-col items-center justify-center space-y-6 text-center py-10"
                  >
                    <div className="h-16 w-16 rounded-full bg-[#FFD86B]/10 border border-[#FFD86B]/30 flex items-center justify-center text-[#FFD86B]">
                      <Smile className="size-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Upload portrait photo</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Use a front-facing selfie with a clear smile. Your photo stays secure and is analyzed locally.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      {/* File input button */}
                      <label className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0A111F] text-white border border-slate-700 hover:border-slate-600 cursor-pointer text-sm font-semibold transition-all">
                        <Upload className="size-4" />
                        Upload custom photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>

                      <div className="flex items-center justify-center gap-2">
                        <span className="h-px bg-slate-800 flex-1" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or</span>
                        <span className="h-px bg-slate-800 flex-1" />
                      </div>

                      {/* Sample photo button */}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleUseSample}
                        className="bg-[#0E3E65] hover:bg-[#0E3E65] text-white border border-sky-900/50 h-12 text-sm font-semibold"
                      >
                        <FileImage className="size-4 mr-2" />
                        Try with Sample Photo
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "scanning" && (
                  <motion.div
                    key="scanning-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center min-h-[350px] relative"
                  >
                    {/* Image under analysis */}
                    <div className="relative aspect-3/4 w-64 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl">
                      {uploadedImage && (
                        <Image
                          src={uploadedImage}
                          fill
                          alt="Analyzing portrait"
                          className="object-cover opacity-60"
                        />
                      )}

                      {/* Biometric mesh simulation */}
                      <svg
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {L_POLYS.map((pts, i) => (
                          <polygon key={`lp${i}`} points={pts} fill="none" stroke="rgb(34 211 238)" strokeWidth="0.3" strokeOpacity="0.7" />
                        ))}
                        {L_DOTS.map(([cx, cy], i) => (
                          <circle key={`ld${i}`} cx={cx} cy={cy} r="0.8" fill="rgb(34 211 238)" />
                        ))}
                        {R_POLYS.map((pts, i) => (
                          <polygon key={`rp${i}`} points={pts} fill="none" stroke="rgb(240 114 255)" strokeWidth="0.3" strokeOpacity="0.7" />
                        ))}
                        {R_DOTS.map(([cx, cy], i) => (
                          <circle key={`rd${i}`} cx={cx} cy={cy} r="0.8" fill="rgb(240 114 255)" />
                        ))}
                      </svg>

                      {/* Moving laser scan line */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_4px_rgb(34_211_238/0.6)]"
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Interactive Before/After Slider */}
                {step === "results" && (
                  <motion.div
                    key="results-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center justify-center space-y-4"
                  >
                    <div
                      ref={sliderContainerRef}
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleTouchMove}
                      onMouseDown={() => setIsDragging(true)}
                      onMouseUp={() => setIsDragging(false)}
                      onMouseLeave={() => setIsDragging(false)}
                      className="relative aspect-3/4 w-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl cursor-ew-resize select-none"
                    >
                      {/* AFTER Image (Background - Clean & Brightened) */}
                      {uploadedImage && (
                        <div className="absolute inset-0 w-full h-full">
                          <Image
                            src={uploadedImage}
                            fill
                            alt="After result"
                            className="object-cover filter saturate-105 brightness-110 contrast-102"
                          />
                          {/* Dental alignment/whitening glow overlay */}
                          <div className="absolute inset-0 bg-sky-400/5 mix-blend-overlay pointer-events-none" />
                        </div>
                      )}

                      {/* BEFORE Image (Foreground clipped by width slider) */}
                      {uploadedImage && (
                        <div
                          className="absolute inset-0 h-full overflow-hidden pointer-events-none"
                          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                          <Image
                            src={uploadedImage}
                            fill
                            alt="Before result"
                            className="object-cover filter grayscale-20 contrast-95 brightness-95"
                          />
                        </div>
                      )}

                      {/* Drag handle line */}
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-[#FFD86B] cursor-ew-resize"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#FFD86B] border-4 border-slate-950 flex items-center justify-center shadow-lg">
                          <Sliders className="size-3 text-slate-950" />
                        </div>
                      </div>

                      {/* Labels */}
                      <span className="absolute bottom-3 left-3 bg-slate-950/70 border border-slate-800/80 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
                        Before
                      </span>
                      <span className="absolute bottom-3 right-3 bg-[#FFD86B]/90 border border-[#FFD86B]/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-950">
                        After
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Sliders className="size-3 text-[#FFD86B]" /> Drag the slider handle to compare smiles
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Right Column: Information, Logs, and Actions */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <DialogHeader className="space-y-1">
                  <div className="flex items-center gap-2 text-[#FFD86B] font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="size-4" /> AI Dental Engine
                  </div>
                  <DialogTitle className="text-white font-extrabold text-2xl tracking-tight mt-1">
                    {step === "upload" && "Virtual Smile Design"}
                    {step === "scanning" && "Analyzing Face"}
                    {step === "results" && "AI Analysis Complete"}
                  </DialogTitle>
                  <DialogDescription className="text-[#0A111F] text-sm">
                    {step === "upload" && "Get a virtual consultation simulation of recommended dental treatments based on your facial structure."}
                    {step === "scanning" && "Our neural network is mapping 468 landmark points of your face and teeth contours."}
                    {step === "results" && "Based on your facial mapping results, our engine detected opportunities for smile alignment and whitening."}
                  </DialogDescription>
                </DialogHeader>

                {/* Step specific panel */}
                <div className="mt-8">
                  {step === "upload" && (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-slate-900 border border-slate-800/50 p-4 space-y-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">How it works</div>
                        <ol className="text-xs text-white space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                          <li>Securely upload a photo or try our sample profile.</li>
                          <li>Neural engines map facial geometry and tooth margins.</li>
                          <li>Adjust alignment vector calculations dynamically.</li>
                          <li>Compare results and view match metrics with top doctors.</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {step === "scanning" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">{scanMessage}</span>
                          <span className="font-bold text-[#FFD86B]">{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-linear-to-r from-cyan-400 via-sky-500 to-[#FFD86B] h-full"
                            style={{ width: `${scanProgress}%` }}
                            transition={{ ease: "easeInOut" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-xs text-slate-400">
                          <div className={`size-2 rounded-full ${scanProgress >= 25 ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`} />
                          <span className={scanProgress >= 25 ? 'text-slate-300' : 'text-slate-500'}>Facial Landmark Coordinates mapped</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-400">
                          <div className={`size-2 rounded-full ${scanProgress >= 50 ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`} />
                          <span className={scanProgress >= 50 ? 'text-slate-300' : 'text-slate-500'}>Occlusal plane alignment computed</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-400">
                          <div className={`size-2 rounded-full ${scanProgress >= 75 ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`} />
                          <span className={scanProgress >= 75 ? 'text-slate-300' : 'text-slate-500'}>Tooth contour mask generated</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === "results" && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Treatment Plan</div>
                      <div className="space-y-2">
                        {/* Procedure 1 */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800/80 p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                              <div className="text-xs font-bold text-white">Laser Teeth Whitening</div>
                              <div className="text-[10px] text-slate-400">Restores enamel shade by up to 8 grades</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">98% Match</span>
                        </div>

                        {/* Procedure 2 */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800/80 p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                              <div className="text-xs font-bold text-white">Clear Orthodontic Aligners</div>
                              <div className="text-[10px] text-slate-400">Straightens occlusal bite alignment</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">94% Match</span>
                        </div>

                        {/* Procedure 3 */}
                        <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800/80 p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                              <div className="text-xs font-bold text-white">Cosmetic Porcelain Veneers</div>
                              <div className="text-[10px] text-slate-400">Perfects tooth margins & spacing</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">89% Match</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-850 shrink-0">
                {step === "results" && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetFlow}
                    className="text-slate-400 hover:text-white hover:bg-slate-900 h-11 text-xs font-bold gap-2"
                  >
                    <RefreshCw className="size-3.5" /> Re-scan
                  </Button>
                )}

                {step === "results" ? (
                  <Button
                    type="button"
                    onClick={handleRedirectToDentists}
                    className="bg-[#FFD86B] hover:bg-[#ffe395] text-slate-950 font-bold h-11 px-5 rounded-lg text-xs gap-1.5 shadow-lg shadow-yellow-500/10"
                  >
                    Find Dentists for these Procedures
                    <ArrowRight className="size-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="text-white bg-[#0A111F] hover:bg-[#05070d] hover:text-white cursor-pointer h-11 px-5 rounded-lg text-xs font-bold"
                  >
                    Close Preview
                  </Button>
                )}
              </div>

            </div>

          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
}
