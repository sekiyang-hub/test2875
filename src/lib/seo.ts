import type { Metadata } from 'next';
import { clinic, siteURL } from '@/config/clinic';
export function metadata(title: string, description: string, path = '/'): Metadata {
  const url = siteURL ? new URL(path, siteURL).toString() : undefined;
  return { title, description, alternates: url ? { canonical: url } : undefined,
    openGraph: { title: `${title} | ${clinic.name}`, description, url, locale: 'ko_KR', type: 'website', siteName: clinic.name },
    robots: { index: clinic.contentVerified && !!siteURL, follow: true } };
}
