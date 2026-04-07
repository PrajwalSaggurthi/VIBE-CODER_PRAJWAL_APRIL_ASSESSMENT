/* Misc utility functions. */

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Returns either black (#1a1a2e) or white (#ffffff) depending on the contrast ratio
 * of the provided hex color background.
 */
export function getContrastColor(hexColor: string): string {
  // Remove hash if present
  const hex = hexColor.replace(/^#/, '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance (YIQ formula)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return yiq >= 128 ? '#1a1a2e' : '#ffffff';
}
