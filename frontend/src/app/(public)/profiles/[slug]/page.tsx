import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProfileDetails } from '@/components/profiles/ProfileDetails';
import { fetchProviderBySlug } from '@/lib/api';
import { buildProfileSchema } from '@/lib/seo';

interface ProfilePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = await fetchProviderBySlug(params.slug);
  if (!profile) {
    return {};
  }
  return {
    title: `${profile.displayName} · Linkr`,
    description: profile.headline,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await fetchProviderBySlug(params.slug);
  if (!profile) {
    notFound();
  }

  const schema = buildProfileSchema(profile!);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProfileDetails profile={profile!} />
    </>
  );
}
