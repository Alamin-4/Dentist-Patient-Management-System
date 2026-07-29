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

import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

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
        <div className="bg-[#FAFBFD] min-h-dvh text-text">
            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20 bg-linear-to-br from-[#113254]/5 via-[#F1F6FB] to-white border-b border-[#E6EEF6] px-4 sm:px-6">
                {/* Background Decorative Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-160 h-160 rounded-full bg-[#EBF4FF]/60 blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 rounded-full bg-[#113254]/5 blur-3xl -z-10" />

                <div className="max-w-400 w-full md:w-11/12 mx-auto text-center relative space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4FF] text-primary text-[12px] font-bold tracking-wide uppercase">
                            <Award className="size-4 shrink-0" />
                            Bridging the Dental Trust Gap
                        </span>
                    </motion.div>

                    <div className="space-y-2 max-w-4xl mx-auto">
                        <CustomSectionHeading value="Empowering Patients with Verified, Transparent Dental Care" center_align />
                        <CustomDesText value="RatedDocs is an enterprise-grade dental platform designed to connect international and local patients directly with independently audited, top-tier dental clinics." center_align />
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="relative -mt-6 sm:-mt-8 z-10 px-4 sm:px-6 md:px-12">
                <div className="max-w-400 w-full md:w-11/12 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                                className="bg-white rounded-xl sm:rounded-2xl border border-stroke p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300"
                            >
                                <div className="size-10 sm:size-12 rounded-xl bg-[#EBF4FF] flex items-center justify-center mb-4 text-primary">
                                    <stat.icon className="size-5 sm:size-6" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-primary mb-1.5">{stat.title}</h3>
                                <p className="text-xs sm:text-sm text-sec-text leading-relaxed">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12">
                <div className="max-w-400 w-full md:w-11/12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 space-y-4"
                        >
                            <CustomSectionHeading value="Our Mission: Transforming Global Dental Care" />
                            <CustomDesText value="Finding the right dentist can be daunting, especially when crossing borders for treatments like implants, veneers, or full mouth reconstruction." />
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                RatedDocs was created to eliminate this uncertainty. We provide patients with a single, verified ecosystem to discover top-rated dental professionals, get real-time price comparisons, and build custom, binding treatment plans with doctors.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/find-dentists"
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-primary/95 active:scale-95 shadow-xs"
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
                            <div className="bg-linear-to-tr from-primary to-[#0F3659] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
                                {/* Decorative overlay pattern */}
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                                <h3 className="text-lg sm:text-xl font-bold mb-4">Why RatedDocs is Different</h3>
                                <div className="space-y-4 sm:space-y-5">
                                    {[
                                        {
                                            label: "Verified Identity & Licensing",
                                            detail: "We audit official national registers, board certifications, and specialist qualifications for every claiming practitioner.",
                                        },
                                        {
                                            label: "Clinical Rigor & Materials Proof",
                                            detail: "Dentists share operational logs, guarantees, and CE certificates to verify the materials used are premium and safe.",
                                        },
                                        {
                                            label: "Platform Integrity Guarantee",
                                            detail: "Consultations and treatment bookings are managed securely, protecting patients.",
                                        },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-3 sm:gap-4">
                                            <div className="size-5 sm:size-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-xs mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-xs sm:text-sm">{item.label}</p>
                                                <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{item.detail}</p>
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
            <section className="py-8 sm:py-12 md:py-16 bg-white border-y border-[#EEF2F6] px-4 sm:px-6 md:px-12">
                <div className="max-w-400 w-full md:w-11/12 mx-auto space-y-8 sm:space-y-10">
                    <div className="text-center max-w-2xl mx-auto space-y-1.5">
                        <CustomSectionHeading value="The RatedDocs Verified Score" center_align />
                        <CustomDesText value="We don't rely on unverified online reviews. Our proprietary verification system calculates an RDV score (out of 100) based on three independent clinical audits." center_align />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
                    >
                        {[
                            {
                                phase: "Phase 1",
                                title: "License Verification",
                                desc: "Rigorous verification of the dentist's registration authority, registration number, and board-certified dental license credentials.",
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
                                className="bg-[#FAFBFD] rounded-xl sm:rounded-2xl border border-stroke p-5 sm:p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-widest">
                                            {step.phase}
                                        </span>
                                    </div>
                                    <div className="size-10 sm:size-12 rounded-xl bg-white border border-[#E6EEF6] flex items-center justify-center mb-4 text-primary shadow-xs">
                                        <step.icon className="size-5 sm:size-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2">{step.title}</h3>
                                    <p className="text-xs sm:text-sm text-sec-text leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CORE VALUES ── */}
            <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12">
                <div className="max-w-400 w-full md:w-11/12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 space-y-2"
                        >
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                                What Guides Us
                            </span>
                            <CustomSectionHeading value="Our Core Pillars of Practice" />
                            <CustomDesText value="At RatedDocs, we believe healthcare is built on honesty. These core pillars guide how we construct our platform, validate clinics, and support patients globally." />
                        </motion.div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                                <div key={idx} className="bg-white rounded-xl border border-stroke p-4 sm:p-5 shadow-xs">
                                    <div className="size-9 rounded-lg bg-[#F1F6FB] flex items-center justify-center mb-3 text-primary">
                                        <val.icon className="size-4.5" />
                                    </div>
                                    <h4 className="font-bold text-sm sm:text-base text-primary mb-1">{val.title}</h4>
                                    <p className="text-xs text-sec-text leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-12">
                <div className="max-w-400 w-full md:w-11/12 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-2xl sm:rounded-3xl bg-primary p-6 sm:p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden space-y-4"
                    >
                        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                        <div className="space-y-2 max-w-2xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                                Ready to schedule your verified consultation?
                            </h2>
                            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                                Find verified dentists, compare qualifications and RDV scores, and securely book a direct video consultation today.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link
                                href="/find-dentists"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-xs sm:text-sm font-bold text-primary transition-all hover:bg-slate-100 active:scale-95 shadow-xs"
                            >
                                Find a Verified Dentist
                            </Link>

                            {showJoinButton && (
                                <Link
                                    href="/register-doctor?role=dentist"
                                    onClick={handleJoinAsDentistClick}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
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
