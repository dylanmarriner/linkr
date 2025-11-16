import {
  type AdminOverview,
  type CategorySummary,
  type CitySummary,
  type DashboardSummary,
  type KycRequest,
  type PaymentRecord,
  type ProviderProfile,
  type SafetyAlert,
  type SubscriptionPlan,
} from './types';

export const mockCities: CitySummary[] = [
  {
    slug: 'auckland',
    name: 'Auckland',
    region: 'Tāmaki Makaurau',
    tagline: 'Skyline experiences by night.',
    spotlight: '72 premium companions active this week',
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    activeProfiles: 72,
    averageRating: 4.94,
  },
  {
    slug: 'wellington',
    name: 'Wellington',
    region: 'Te Whanganui-a-Tara',
    tagline: 'Curated introductions for the capital.',
    spotlight: 'VIP dinner companions & art patrons',
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    activeProfiles: 41,
    averageRating: 4.88,
  },
  {
    slug: 'queenstown',
    name: 'Queenstown',
    region: 'Otago',
    tagline: 'Destination rendezvous amid alpine views.',
    spotlight: 'Seasonal ski-weekend escapes',
    heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    activeProfiles: 18,
    averageRating: 4.97,
  },
];

export const mockCategories: CategorySummary[] = [
  {
    slug: 'companionship',
    label: 'Companionship',
    description: 'Museum previews, private dining, long-form engagements.',
  },
  {
    slug: 'fetish-friendly',
    label: 'Fetish-Friendly',
    description: 'Inclusive, negotiated experiences with trauma-informed providers.',
  },
  {
    slug: 'domme',
    label: 'Domme',
    description: 'Elite FemDom, etiquette coaching, and curated submissive mentorship.',
  },
];

export const mockProviders: ProviderProfile[] = [
  {
    id: 'prov_001',
    slug: 'amira-noir',
    displayName: 'Amira Noir',
    headline: 'Museum curator by day, velvet confidante by night.',
    citySlug: 'auckland',
    categories: ['companionship', 'fetish-friendly'],
    languages: ['English', 'Te Reo Māori', 'French'],
    rateFrom: 900,
    rateTo: 2500,
    isVerified: true,
    heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    gallery: [
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    ],
    bio: 'Specialising in art district walk-throughs, black-tie premieres, and out-of-town patrons seeking effortless chemistry.',
    safetyNotes: 'Encrypted check-ins every 45 minutes with Linkr Safety HQ.',
    responseTime: 'under 1 hour',
    availability: [
      { day: 'Thursday', from: '18:00', to: '01:00' },
      { day: 'Friday', from: '18:00', to: '02:00' },
      { day: 'Saturday', from: '16:00', to: '02:00' },
    ],
  },
  {
    id: 'prov_002',
    slug: 'phoenix-reign',
    displayName: 'Phoenix Reign',
    headline: 'Femme-led rituals and bespoke surrender coaching.',
    citySlug: 'wellington',
    categories: ['domme'],
    languages: ['English', 'German'],
    rateFrom: 1200,
    rateTo: 3200,
    isVerified: true,
    heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    gallery: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ],
    bio: 'Discreet mentorships for founders and parliament aides; studio sessions with custom wardrobe notes.',
    safetyNotes: 'Dual panic triggers + encrypted client list with Linkr Safety.',
    responseTime: 'same day',
    availability: [
      { day: 'Wednesday', from: '13:00', to: '23:00' },
      { day: 'Friday', from: '10:00', to: '23:00' },
    ],
  },
];

export const mockPlans: SubscriptionPlan[] = [
  {
    code: 'weekly-rose',
    name: 'Rose Weekly',
    cadence: 'weekly',
    price: 149,
    features: [
      'City landing placement',
      '5 media slots',
      'Encrypted inquiries',
    ],
  },
  {
    code: 'weekly-gold',
    name: 'Gold Weekly',
    cadence: 'weekly',
    price: 249,
    features: ['Homepage spotlight', '10 media slots', 'Safety analytics'],
  },
  {
    code: 'monthly-black',
    name: 'Black Label Monthly',
    cadence: 'monthly',
    price: 799,
    features: ['Feature films', 'Concierge intros', 'Dedicated CRM'],
  },
];

export const mockDashboard: DashboardSummary = {
  headline: 'You are visible in 3 premium slots across Auckland + Wellington.',
  cta: 'Boost Queenstown availability',
  metrics: [
    { label: 'Profile Views', value: '1,482', trend: 12 },
    { label: 'Saved to Black Book', value: '83', trend: 5 },
    { label: 'Safety Check-ins', value: '24', trend: 0 },
  ],
  upcomingBookings: [
    { client: 'Elias – VC Fund', date: 'Fri 7:30pm', service: 'Gallery preview' },
    { client: 'Ananya – Arts Patron', date: 'Sat 6:00pm', service: 'Wine pairing' },
  ],
  tasks: [
    { label: 'Upload vetting letter', status: 'todo' },
    { label: 'Confirm SegPay payout', status: 'done' },
  ],
};

export const mockPayments: PaymentRecord[] = [
  {
    id: 'txn_12098',
    provider: 'Amira Noir',
    plan: 'Gold Weekly',
    status: 'paid',
    amount: 249,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'txn_13033',
    provider: 'Phoenix Reign',
    plan: 'Black Label Monthly',
    status: 'pending',
    amount: 799,
    createdAt: new Date().toISOString(),
  },
];

export const mockKyc: KycRequest[] = [
  {
    id: 'kyc_884',
    provider: 'Sloane Jade',
    status: 'submitted',
    referenceId: 'JUMIO-7783',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'kyc_901',
    provider: 'Phoenix Reign',
    status: 'approved',
    referenceId: 'JUMIO-7784',
    submittedAt: new Date().toISOString(),
  },
];

export const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: 'alert_01',
    level: 'info',
    message: 'Check-in completed for Amira Noir at 22:15.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert_02',
    level: 'warning',
    message: 'Phoenix Reign missed a 30m check-in. Concierge notified.',
    createdAt: new Date().toISOString(),
  },
];

export const mockAdmin: AdminOverview = {
  stats: [
    { label: 'Active Providers', value: '312', trend: 7 },
    { label: 'Verified Clients', value: '1,204' },
    { label: 'Monthly Volume', value: '$182k', trend: 4 },
  ],
  latestUsers: [
    { id: 'user_09', email: 'phoenix@linkr.co.nz', role: 'provider', createdAt: new Date().toISOString() },
    { id: 'user_10', email: 'client@post.vip', role: 'client', createdAt: new Date().toISOString() },
  ],
  payments: mockPayments,
  kycQueue: mockKyc,
  safetyAlerts: mockSafetyAlerts,
};
