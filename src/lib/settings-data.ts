export type RdvPhaseWeight = {
  id: string;
  phase: number;
  label: string;
  meta: string;
  weight: number;
};

export type PlatformFeeData = {
  rate: number;
};

export type AnnouncementAudience = "all" | "patients" | "dentists";
export type AnnouncementStatus = "live" | "dismissed";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  status: AnnouncementStatus;
  publishedAt: string;
};

export type SettingsData = {
  rdvWeights: RdvPhaseWeight[];
  platformFee: PlatformFeeData;
  announcements: Announcement[];
};

const settingsData: SettingsData = {
  rdvWeights: [
    {
      id: "phase-1",
      phase: 1,
      label: "Phase 1 — License Verification",
      meta: "~5 min · RDV +30%",
      weight: 30,
    },
    {
      id: "phase-2",
      phase: 2,
      label: "Phase 2 — Operations",
      meta: "~20–30 min · RDV +40%",
      weight: 40,
    },
    {
      id: "phase-3",
      phase: 3,
      label: "Phase 3 — Clinical depth",
      meta: "Async · RDV +30%",
      weight: 30,
    },
  ],
  platformFee: {
    rate: 10,
  },
  announcements: [
    {
      id: "ann-1",
      title: "Scheduled maintenance — May 10",
      message:
        "RatedDocs will be unavailable for approximately 2 hours on Saturday May 10 between 02:00–04:00 UTC for routine maintenance.",
      audience: "all",
      status: "live",
      publishedAt: "2026-05-06",
    },
    {
      id: "ann-2",
      title: "New: Release code system now live",
      message:
        "We have launched the new release code flow for escrow payments. Patients will now receive a unique code upon accepting the final treatment plan.",
      audience: "dentists",
      status: "dismissed",
      publishedAt: "2026-04-30",
    },
  ],
};

export default settingsData;
