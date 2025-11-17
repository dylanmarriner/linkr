export type CitySummary = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  spotlight: string;
  heroImage: string;
  activeProfiles: number;
  averageRating: number;
};

export type CategorySummary = {
  slug: string;
  label: string;
  description: string;
};

export type ProviderProfile = {
  id: string;
  slug: string;
  displayName: string;
  headline: string;
  citySlug: string;
  categories: string[];
  languages: string[];
  rateFrom: number;
  rateTo: number;
  isVerified: boolean;
  heroImage: string;
  gallery: string[];
  bio: string;
  safetyNotes: string;
  responseTime: string;
  availability: Array<{
    day: string;
    from: string;
    to: string;
  }>;
};

export type SubscriptionPlan = {
  code: string;
  name: string;
  cadence: 'weekly' | 'monthly';
  price: number;
  features: string[];
};

export type DashboardSummary = {
  headline: string;
  cta: string;
  metrics: Array<{ label: string; value: string; trend: number }>;
  upcomingBookings: Array<{ client: string; date: string; service: string }>;
  tasks: Array<{ label: string; status: 'todo' | 'done' }>;
};

export type PaymentRecord = {
  id: string;
  provider: string;
  plan: string;
  status: 'paid' | 'pending' | 'failed';
  amount: number;
  createdAt: string;
};

export type KycRequest = {
  id: string;
  provider: string;
  status: 'submitted' | 'approved' | 'rejected';
  referenceId: string;
  submittedAt: string;
};

export type SafetyAlert = {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
};

export type AdminOverview = {
  stats: Array<{ label: string; value: string; trend?: number }>;
  latestUsers: Array<{ id: string; email: string; role: string; createdAt: string }>;
  payments: PaymentRecord[];
  kycQueue: KycRequest[];
  safetyAlerts: SafetyAlert[];
};
