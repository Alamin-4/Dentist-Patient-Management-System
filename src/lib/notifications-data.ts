export type NotificationType =
  | "verification"
  | "flag"
  | "payment"
  | "system"
  | "review"
  | "booking";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export type NotificationActor = {
  name: string;
  initials: string;
  avatarColor: string;
};

export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actor?: NotificationActor;
  actionLabel?: string;
};

const notificationsData: Notification[] = [
  // ── Verification ──────────────────────────────────────────────────────────
  {
    id: "n-01",
    type: "verification",
    priority: "high",
    title: "New Verification Submission",
    description: "Dr. Sarah Kim submitted Phase 1 (License Verification) documentation and is awaiting admin review.",
    timestamp: "2026-05-29T08:30:00Z",
    read: false,
    actor: { name: "Dr. Sarah Kim", initials: "SK", avatarColor: "#1D4ED8" },
    actionLabel: "Review",
  },
  {
    id: "n-02",
    type: "verification",
    priority: "medium",
    title: "Phase 2 Approved",
    description: "Dr. Marcus Chen successfully completed Phase 2 — Operations verification and has been promoted to Phase 3.",
    timestamp: "2026-05-29T07:15:00Z",
    read: false,
    actor: { name: "Dr. Marcus Chen", initials: "MC", avatarColor: "#059669" },
    actionLabel: "View Profile",
  },
  {
    id: "n-03",
    type: "verification",
    priority: "high",
    title: "Phase 1 Documents Rejected",
    description: "Dr. Liu Wei's Phase 1 submission was rejected due to an unrecognised licence authority. A reason has been sent to the dentist.",
    timestamp: "2026-05-29T06:45:00Z",
    read: false,
    actor: { name: "Dr. Liu Wei", initials: "LW", avatarColor: "#DC2626" },
    actionLabel: "View",
  },
  {
    id: "n-04",
    type: "verification",
    priority: "medium",
    title: "Phase 3 Awaiting Clinical Review",
    description: "Dr. Amira Haddad's async clinical depth submission is ready for peer review.",
    timestamp: "2026-05-28T17:00:00Z",
    read: true,
    actor: { name: "Dr. Amira Haddad", initials: "AH", avatarColor: "#B45309" },
    actionLabel: "Review",
  },
  {
    id: "n-05",
    type: "verification",
    priority: "low",
    title: "Verification Fully Complete",
    description: "Dr. Priya Nair has passed all 3 verification phases and is now live on the directory.",
    timestamp: "2026-05-28T14:30:00Z",
    read: true,
    actor: { name: "Dr. Priya Nair", initials: "PN", avatarColor: "#7C3AED" },
  },
  {
    id: "n-06",
    type: "verification",
    priority: "high",
    title: "Verification Overdue — 7 Days",
    description: "Dr. James Owusu has not responded to Phase 2 feedback in 7 days. Reminder sent automatically.",
    timestamp: "2026-05-27T09:00:00Z",
    read: true,
    actor: { name: "Dr. James Owusu", initials: "JO", avatarColor: "#0891B2" },
    actionLabel: "View Queue",
  },

  // ── Flags (Anti-Collusion) ─────────────────────────────────────────────
  {
    id: "n-07",
    type: "flag",
    priority: "critical",
    title: "Account Suspended — Flag Threshold Reached",
    description: "Dr. Ahmed Sami has accumulated 3 flags (100% threshold). Account suspended and investigation opened automatically.",
    timestamp: "2026-05-29T06:00:00Z",
    read: false,
    actor: { name: "Dr. Ahmed Sami", initials: "AS", avatarColor: "#DC2626" },
    actionLabel: "Investigate",
  },
  {
    id: "n-08",
    type: "flag",
    priority: "high",
    title: "Second Flag Issued",
    description: "Dr. Carlos Reyes received a second anti-collusion flag (Booking #BK-8821). Variance: +42% above estimate.",
    timestamp: "2026-05-29T05:30:00Z",
    read: false,
    actor: { name: "Dr. Carlos Reyes", initials: "CR", avatarColor: "#EA580C" },
    actionLabel: "View Flags",
  },
  {
    id: "n-09",
    type: "flag",
    priority: "high",
    title: "New Anti-Collusion Flag",
    description: "Booking #BK-9103 triggered a flag for Dr. Mei Lin. Patient reported final price +38% above estimate.",
    timestamp: "2026-05-28T20:00:00Z",
    read: false,
    actor: { name: "Dr. Mei Lin", initials: "ML", avatarColor: "#B45309" },
    actionLabel: "View",
  },
  {
    id: "n-10",
    type: "flag",
    priority: "medium",
    title: "Flag Auto-Expired",
    description: "Flag #2 for Dr. Nadia Patel has expired after 90 days with no further violations. Status reset to Clean.",
    timestamp: "2026-05-28T12:00:00Z",
    read: true,
    actor: { name: "Dr. Nadia Patel", initials: "NP", avatarColor: "#059669" },
  },
  {
    id: "n-11",
    type: "flag",
    priority: "high",
    title: "Investigation Closed — Cleared",
    description: "Investigation for Dr. Ibrahim Al-Amin concluded with no evidence of collusion. Account reactivated.",
    timestamp: "2026-05-27T16:30:00Z",
    read: true,
    actor: { name: "Dr. Ibrahim Al-Amin", initials: "IA", avatarColor: "#1D4ED8" },
  },
  {
    id: "n-12",
    type: "flag",
    priority: "critical",
    title: "Urgent: Flag Expires in 24 Hours",
    description: "Flag #3 for Dr. Ravi Shankar expires tomorrow. A decision on suspension must be made before expiry.",
    timestamp: "2026-05-27T10:00:00Z",
    read: false,
    actor: { name: "Dr. Ravi Shankar", initials: "RS", avatarColor: "#7C3AED" },
    actionLabel: "Take Action",
  },

  // ── Payments ───────────────────────────────────────────────────────────
  {
    id: "n-13",
    type: "payment",
    priority: "low",
    title: "Escrow Released",
    description: "£4,200 released to Dr. Elena Marquez for completed All-on-4 Full Arch treatment (Booking #BK-7741).",
    timestamp: "2026-05-28T16:45:00Z",
    read: true,
    actor: { name: "Dr. Elena Marquez", initials: "EM", avatarColor: "#1D4ED8" },
  },
  {
    id: "n-14",
    type: "payment",
    priority: "medium",
    title: "Escrow Dispute Opened",
    description: "Patient Anna Kowalski has disputed escrow release for Booking #BK-8812. Funds held pending resolution.",
    timestamp: "2026-05-28T11:00:00Z",
    read: false,
    actionLabel: "Review Dispute",
  },
  {
    id: "n-15",
    type: "payment",
    priority: "low",
    title: "Platform Fee Collected",
    description: "10% platform fee of £320 collected from Booking #BK-8900 (Dr. Mehmet Aydin).",
    timestamp: "2026-05-28T09:30:00Z",
    read: true,
  },
  {
    id: "n-16",
    type: "payment",
    priority: "high",
    title: "Refund Requested",
    description: "Patient Tom Nguyen requested a full refund (£2,800) for a cancelled treatment with Dr. Sophie Laroche.",
    timestamp: "2026-05-27T14:15:00Z",
    read: false,
    actionLabel: "Process Refund",
  },
  {
    id: "n-17",
    type: "payment",
    priority: "low",
    title: "Release Code Accepted",
    description: "Patient confirmed treatment completion. Release code accepted for Booking #BK-7652. Escrow pending 48-hour window.",
    timestamp: "2026-05-27T08:00:00Z",
    read: true,
  },

  // ── Reviews ────────────────────────────────────────────────────────────
  {
    id: "n-18",
    type: "review",
    priority: "high",
    title: "Fake Review Detected — High Confidence",
    description: "AI flagged a 5.0-star review for Dr. Priya Shah as high-confidence fake. Booking date does not match treatment timeline.",
    timestamp: "2026-05-28T11:30:00Z",
    read: false,
    actor: { name: "Dr. Priya Shah", initials: "PS", avatarColor: "#7C3AED" },
    actionLabel: "View Review",
  },
  {
    id: "n-19",
    type: "review",
    priority: "medium",
    title: "Review Reported by Dentist",
    description: "Dr. Oliver Grant reported a 1-star review as malicious. Review has been paused pending admin decision.",
    timestamp: "2026-05-27T19:00:00Z",
    read: false,
    actor: { name: "Dr. Oliver Grant", initials: "OG", avatarColor: "#059669" },
    actionLabel: "Adjudicate",
  },
  {
    id: "n-20",
    type: "review",
    priority: "low",
    title: "Review Published",
    description: "A 4.8-star review for Dr. Amira Haddad passed all AI checks and has been published to the directory.",
    timestamp: "2026-05-27T12:00:00Z",
    read: true,
    actor: { name: "Dr. Amira Haddad", initials: "AH", avatarColor: "#B45309" },
  },
  {
    id: "n-21",
    type: "review",
    priority: "high",
    title: "Bulk Suspicious Reviews Detected",
    description: "5 reviews for Dr. Victor Osei were submitted from the same IP range within 2 hours. All paused.",
    timestamp: "2026-05-26T22:00:00Z",
    read: false,
    actor: { name: "Dr. Victor Osei", initials: "VO", avatarColor: "#DC2626" },
    actionLabel: "Review Batch",
  },

  // ── System ─────────────────────────────────────────────────────────────
  {
    id: "n-22",
    type: "system",
    priority: "medium",
    title: "Scheduled Maintenance Reminder",
    description: "Platform maintenance is scheduled for May 30, 02:00–04:00 UTC. An announcement banner is already live.",
    timestamp: "2026-05-28T14:00:00Z",
    read: true,
    actionLabel: "Edit Announcement",
  },
  {
    id: "n-23",
    type: "system",
    priority: "low",
    title: "Weekly Report Ready",
    description: "Your weekly platform summary for 19–25 May 2026 is ready to view. New dentists: 12, bookings: 87, revenue: £41,200.",
    timestamp: "2026-05-26T08:00:00Z",
    read: true,
    actionLabel: "View Report",
  },
  {
    id: "n-24",
    type: "system",
    priority: "critical",
    title: "Database Backup Failed",
    description: "Nightly backup job at 03:00 UTC failed with timeout error. Manual backup recommended immediately.",
    timestamp: "2026-05-25T03:15:00Z",
    read: false,
    actionLabel: "View Logs",
  },

  // ── Bookings ───────────────────────────────────────────────────────────
  {
    id: "n-25",
    type: "booking",
    priority: "low",
    title: "New Consultation Booked",
    description: "Patient James William booked a consultation with Dr. Liu Wei for Dental Implants on June 5, 2026.",
    timestamp: "2026-05-28T09:00:00Z",
    read: true,
    actor: { name: "Dr. Liu Wei", initials: "LW", avatarColor: "#0891B2" },
  },
  {
    id: "n-26",
    type: "booking",
    priority: "medium",
    title: "Consultation Missed",
    description: "Patient did not attend the scheduled consultation with Dr. Marcus Chen (Booking #BK-9211). Auto-rescheduled.",
    timestamp: "2026-05-27T11:00:00Z",
    read: false,
    actor: { name: "Dr. Marcus Chen", initials: "MC", avatarColor: "#059669" },
    actionLabel: "View Booking",
  },
  {
    id: "n-27",
    type: "booking",
    priority: "low",
    title: "Treatment Completed",
    description: "Booking #BK-7800 — Orthodontic treatment with Dr. Priya Nair marked as complete by both parties.",
    timestamp: "2026-05-26T15:00:00Z",
    read: true,
    actor: { name: "Dr. Priya Nair", initials: "PN", avatarColor: "#7C3AED" },
  },
];

export default notificationsData;
