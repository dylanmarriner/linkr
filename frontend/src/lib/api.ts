import 'server-only';

import {
  mockAdmin,
  mockCategories,
  mockCities,
  mockDashboard,
  mockKyc,
  mockPayments,
  mockPlans,
  mockProviders,
  mockSafetyAlerts,
} from './mock-data';
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return (await response.json()) as T;
}

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn('Falling back to mock data for Linkr frontend:', error);
    return fallback;
  }
}

export async function fetchCities(): Promise<CitySummary[]> {
  return withFallback(() => apiFetch<CitySummary[]>('/public/cities'), mockCities);
}

export async function fetchCategories(): Promise<CategorySummary[]> {
  return withFallback(() => apiFetch<CategorySummary[]>('/public/categories'), mockCategories);
}

export async function fetchFeaturedProviders(): Promise<ProviderProfile[]> {
  return withFallback(() => apiFetch('/public/providers/featured'), mockProviders);
}

export async function fetchProviderBySlug(slug: string): Promise<ProviderProfile | undefined> {
  const fallback = mockProviders.find((profile) => profile.slug === slug);
  return withFallback(() => apiFetch<ProviderProfile>(`/public/providers/${slug}`), fallback);
}

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  return withFallback(() => apiFetch('/subscriptions/plans'), mockPlans);
}

export async function fetchDashboard(): Promise<DashboardSummary> {
  return withFallback(() => apiFetch('/provider/dashboard'), mockDashboard);
}

export async function fetchPayments(): Promise<PaymentRecord[]> {
  return withFallback(() => apiFetch('/admin/payments'), mockPayments);
}

export async function fetchKycQueue(): Promise<KycRequest[]> {
  return withFallback(() => apiFetch('/admin/kyc'), mockKyc);
}

export async function fetchSafetyAlerts(): Promise<SafetyAlert[]> {
  return withFallback(() => apiFetch<SafetyAlert[]>('/safety/alerts'), mockSafetyAlerts);
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  return withFallback(() => apiFetch('/admin/overview'), mockAdmin);
}
