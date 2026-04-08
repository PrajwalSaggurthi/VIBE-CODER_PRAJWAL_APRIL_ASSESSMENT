import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PublicProfileResponse } from "@/types/tenant";
import ProfileView from "./ProfileView";

function getApiUrl() {
  // Server-side needs absolute URL. VERCEL_URL is auto-set by Vercel.
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/v1`;
  return "http://localhost:8000/api/v1";
}

async function getProfile(slug: string): Promise<PublicProfileResponse | null> {
  try {
    const res = await fetch(`${getApiUrl()}/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: "Profile Not Found" };

  return {
    title: `${profile.tenant.name} | LinkHub`,
    description: profile.tenant.bio || `Check out ${profile.tenant.name}'s links`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  return <ProfileView profile={profile} />;
}
