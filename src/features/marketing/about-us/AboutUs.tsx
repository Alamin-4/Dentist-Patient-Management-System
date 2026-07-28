"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useMe } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ShieldCheck,
    Video,
    DollarSign,
    Users,
    FileCheck,
    Activity,
    Award,
    ExternalLink
} from "lucide-react";

export default function AboutUs() {
    const { user } = useMe();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const showJoinButton = !user || user.role !== "DENTIST";

    const handleJoinAsDentistClick = (e: React.MouseEvent) => {
        if (user && user.role !== "DENTIST") {
            e.preventDefault();
            setShowLogoutConfirm(true);
        }
    };

    const handleConfirmLogout = () => {
        document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/register-doctor";
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            } as const,
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            } as const,
        },
    };

    return (
        <div className="bg-[#FAFBFD] min-h-screen text-text">
            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-linear-to-br from-[#113254]/5 via-[#F1F6FB] to-white border-b border-[#E6EEF6]">
                {/* Background Decorative Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-160 h-160 rounded-full bg-[#EBF4FF]/60 blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 rounded-full bg-[#113254]/5 blur-3xl -z-10" />

                <div className="max-w-400 w-11/12 mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4FF] text-[#113254] text-[12px] font-bold tracking-wide uppercase mb-6">
                            <Award className="size-4 shrink-0" />
                            Bridging the Dental Trust Gap
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[36px] md:text-[52px] font-black text-[#113254] leading-[1.1] mb-6 tracking-tight max-w-4xl mx-auto"
                    >
                        Empowering Patients with Verified, Transparent Dental Care
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[16px] md:text-[18px] text-sec-text leading-relaxed max-w-2xl mx-auto mb-10"
                    >
                        RatedDocs is an enterprise-grade dental/patient platform designed to connect international and local patients directly with independently audited, top-tier dental clinics.
                    </motion.p>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="relative -mt-10 z-10">
                <div className="max-w-400 w-11/12 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "3-Phase Verification",
                                desc: "Every clinic passes rigorous license, operational, and materials depth audits.",
                                icon: ShieldCheck,
                            },
                            {
                                title: "100% Doctor-Direct",
                                desc: "Speak with your chosen dental specialist via video consultation before booking.",
                                icon: Video,
                            },
                            {
                                title: "No Hidden Costs",
                                desc: "Receive pre-approved, itemized treatment plans with total price transparency.",
                                icon: DollarSign,
                            },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                                className="bg-white rounded-2xl border border-stroke p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(17,50,84,0.06)] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="size-12 rounded-xl bg-[#EBF4FF] flex items-center justify-center mb-6 text-[#113254]">
                                    <stat.icon className="size-6" />
                                </div>
                                <h3 className="text-[18px] font-bold text-[#113254] mb-2">{stat.title}</h3>
                                <p className="text-[14px] text-sec-text leading-relaxed">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="py-20 ">
                <div className="max-w-400 w-11/12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 space-y-6"
                        >
                            <h2 className="text-[28px] md:text-[36px] font-black text-[#113254] leading-tight">
                                Our Mission: Transforming the Global Dental Experience
                            </h2>
                            <p className="text-[15px] text-[#4B5563] leading-relaxed">
                                Finding the right dentist can be daunting, especially when crossing borders for treatments like implants, veneers, or full mouth reconstruction. Information is often fragmented, prices are opaque, and qualifications are hard to verify.
                            </p>
                            <p className="text-[15px] text-[#4B5563] leading-relaxed">
                                RatedDocs was created to eliminate this uncertainty. We provide patients with a single, verified ecosystem to discover top-rated dental professionals, get real-time price comparisons, and build custom, binding treatment plans with doctors.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/find-dentists"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#113254] px-6 py-3.5 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95 shadow-sm"
                                >
                                    Explore Verified Dentists
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 relative"
                        >
                            <div className="bg-linear-to-tr from-[#113254] to-[#0F3659] rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
                                {/* Decorative overlay pattern */}
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                                <h3 className="text-[22px] font-bold mb-4">Why RatedDocs is Different</h3>
                                <div className="space-y-6">
                                    {[
                                        {
                                            label: "Verified Identity & Licensing",
                                            detail: "We audit official national registers, board certifications, and specialist qualifications for every claiming practitioner.",
                                        },
                                        {
                                            label: "Clinical Rigor & Materials Proof",
                                            detail: "Dentists share operational logs, guarantees, and CE certificates to verify the materials used (Zirconia, Titanium) are premium and safe.",
                                        },
                                        {
                                            label: "Platform Integrity Guarantee",
                                            detail: "Consultations and treatment bookings are managed securely, with escrow features and arrival-code verifications protecting patients.",
                                        },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="size-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-[12px] mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[15px]">{item.label}</p>
                                                <p className="text-[13px] text-white/80 mt-1 leading-relaxed">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── THE RDV VERIFICATION SYSTEM ── */}
            <section className="py-20 md:py-24 bg-white border-y border-[#EEF2F6]">
                <div className="max-w-400 w-11/12 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-[28px] md:text-[36px] font-black text-[#113254]">
                            The RatedDocs Verified Score
                        </h2>
                        <p className="text-[14px] md:text-[15px] text-sec-text mt-3 leading-relaxed">
                            We don&apos;t rely on unverified online reviews. Instead, our proprietary verification system calculates an RDV score (out of 100) based on three independent clinical audits.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                phase: "Phase 1",
                                title: "License Verification",
                                desc: "Rigorous verification of the dentist&apos;s registration authority, registration number, and board-certified dental license credentials.",
                                icon: FileCheck,
                            },
                            {
                                phase: "Phase 2",
                                title: "Operations Verification",
                                desc: "Verification of sterilization protocols, JCI accreditation certificates, walkthrough clinic videos, and binding guarantees.",
                                icon: Activity,
                            },
                            {
                                phase: "Phase 3",
                                title: "Clinic Depth Verification",
                                desc: "Auditing material brands, clinical invoices, continuing education (CE) certificates, and standard protocol documentation.",
                                icon: Award,
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-[#FAFBFD] rounded-2xl border border-stroke p-6 md:p-8 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-6">
                                        <span className="text-[12px] font-bold text-[#113254]/60 uppercase tracking-widest">
                                            {step.phase}
                                        </span>

                                    </div>
                                    <div className="size-12 rounded-xl bg-white border border-[#E6EEF6] flex items-center justify-center mb-6 text-[#113254] shadow-sm">
                                        <step.icon className="size-6" />
                                    </div>
                                    <h3 className="text-[18px] font-bold text-[#113254] mb-3">{step.title}</h3>
                                    <p className="text-[13px] text-sec-text leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CORE VALUES ── */}
            <section className="py-20 ">
                <div className="max-w-400 w-11/12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 space-y-4"
                        >
                            <span className="text-[12px] font-bold text-[#113254] uppercase tracking-wider">
                                What Guides Us
                            </span>
                            <h2 className="text-[28px] md:text-[36px] font-black text-[#113254] leading-tight">
                                Our Core Pillars of Practice
                            </h2>
                            <p className="text-[15px] text-sec-text leading-relaxed">
                                At RatedDocs, we believe healthcare is built on honesty. These core pillars guide how we construct our platform, validate clinics, and support patients globally.
                            </p>
                        </motion.div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Radical Transparency",
                                    desc: "Every procedure is itemized. No hidden clinic add-ons, surprise currency conversions, or mock prices.",
                                    icon: DollarSign
                                },
                                {
                                    title: "Independent Auditing",
                                    desc: "We verify documents, certifications, and licenses independently, maintaining total objectivity.",
                                    icon: ShieldCheck
                                },
                                {
                                    title: "Direct Doctor-Access",
                                    desc: "We prioritize patient safety by making sure you speak with the dentist directly, not a sales representative.",
                                    icon: Users
                                },
                                {
                                    title: "Security & Guarantees",
                                    desc: "Treatment plans, booking details, and payment structures are bound securely on-platform.",
                                    icon: FileCheck
                                }
                            ].map((val, idx) => (
                                <div key={idx} className="bg-white rounded-xl border border-stroke p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                                    <div className="size-10 rounded-lg bg-[#F1F6FB] flex items-center justify-center mb-4 text-[#113254]">
                                        <val.icon className="size-5" />
                                    </div>
                                    <h4 className="font-bold text-[15px] text-[#113254] mb-1">{val.title}</h4>
                                    <p className="text-[12px] text-sec-text leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-24">
                <div className="max-w-400 w-11/12 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-[#113254] bg-linear-to-br from-[#113254] via-[#0F3659] to-[#0A223C] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                        <h2 className="text-[28px] md:text-[42px] font-black leading-tight max-w-2xl mx-auto mb-4">
                            Ready to schedule your verified consultation?
                        </h2>
                        <p className="text-[14px] md:text-[16px] text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
                            Find verified dentists, compare qualifications and RDV scores, and securely book a direct video consultation today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/find-dentists"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-[14px] font-bold text-[#113254] transition-all hover:bg-slate-100 active:scale-95 shadow-md"
                            >
                                Find a Verified Dentist
                            </Link>

                            {showJoinButton && (
                                <Link
                                    href="/register-doctor?role=dentist"
                                    onClick={handleJoinAsDentistClick}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-[14px] font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                                >
                                    Are you a Dentist? Join RatedDocs
                                    <ExternalLink className="size-4" />
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-primary font-bold text-xl">Sign Out Required</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            You are currently signed in as a Patient. To register a new Dentist account, you must sign out of your current account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 border-t border-slate-100 mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowLogoutConfirm(false)}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmLogout}
                            className="bg-primary hover:bg-[#002850] text-white font-bold h-10 text-sm px-6"
                        >
                            Sign Out & Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
