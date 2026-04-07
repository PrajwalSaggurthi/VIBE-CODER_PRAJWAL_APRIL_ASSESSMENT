/* Theme-related types. */

export interface ThemeConfig {
  id?: string;
  tenant_id?: string;
  preset_name: string;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  text_color: string;
  font_family: string;
  button_style: "rounded" | "pill" | "square" | "outline";
  bg_pattern: "none" | "dots" | "waves" | "gradient";
  bg_image_url?: string | null;
  custom_css?: Record<string, string> | null;
  updated_at?: string;
}

export interface ThemeUpdateRequest {
  preset_name?: string;
  primary_color?: string;
  secondary_color?: string;
  bg_color?: string;
  text_color?: string;
  font_family?: string;
  button_style?: string;
  bg_pattern?: string;
  bg_image_url?: string;
  custom_css?: Record<string, string>;
}

export interface ThemePreset {
  name: string;
  label: string;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  text_color: string;
  font_family: string;
  button_style: string;
  bg_pattern: string;
}
