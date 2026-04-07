/* Tenant-related types. */

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUpdateRequest {
  name?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
}

export interface PublicTenantInfo {
  slug: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string> | null;
}

export interface PublicProfileResponse {
  tenant: PublicTenantInfo;
  links: import("./link").Link[];
  theme: import("./theme").ThemeConfig | null;
}
