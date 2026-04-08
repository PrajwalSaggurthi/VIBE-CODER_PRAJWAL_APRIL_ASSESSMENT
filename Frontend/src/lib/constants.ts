/* Constants shared across the app. */

// Ensure API_URL always starts with / or http to prevent relative path resolution issues
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
export const API_URL = rawApiUrl.startsWith("http") || rawApiUrl.startsWith("/")
  ? rawApiUrl
  : `/${rawApiUrl}`;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "linkhub_access_token",
  REFRESH_TOKEN: "linkhub_refresh_token",
} as const;

export const ICON_OPTIONS = [
  "globe",
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "twitch",
  "discord",
  "dribbble",
  "facebook",
  "tiktok",
  "spotify",
  "calendar",
  "mail",
  "phone",
  "file",
  "pencil",
  "shopping-bag",
  "heart",
  "gift",
  "palette",
  "star",
  "link",
  "music",
  "camera",
  "code",
  "book",
  "coffee",
] as const;
