
export interface StatCard {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  comparison: string;
  iconColor: string;
  iconBg: string;
  icon: "stethoscope" | "users" | "calendar" | "dollar";
}

export interface ChartPoint {
  date: string;
  bookings: number;
  revenue: number;
}

export interface QueueDoctor {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  specialty: string;
  timeAgo: string;
  phases: string[];
}

export interface TopDentist {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  specialty: string;
  location: string;
  bookings: number;
}

export interface ActivityItem {
  id: string;
  type: "verified" | "signup" | "flagged" | "payout" | "failed";
  title: string;
  description: string;
  timeAgo: string;
}
