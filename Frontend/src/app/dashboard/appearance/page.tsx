"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FiCheck, FiSave } from "react-icons/fi";
import type { ThemeConfig, ThemePreset, ThemeUpdateRequest } from "@/types/theme";
import styles from "./appearance.module.css";

const FONT_OPTIONS = ["Inter", "Outfit", "Space Grotesk", "DM Sans", "Poppins", "Playfair Display"];
const BUTTON_STYLES = ["rounded", "pill", "square", "outline"];
const BG_PATTERNS = ["none", "dots", "waves", "gradient"];

export default function AppearancePage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p] = await Promise.all([
          api.get<ThemeConfig>("/theme"),
          api.get<ThemePreset[]>("/theme/presets"),
        ]);
        setTheme(t);
        setPresets(p);
      } catch {
        // handled by api client
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (field: keyof ThemeConfig, value: string) => {
    if (!theme) return;
    setTheme({ ...theme, [field]: value });
  };

  const applyPreset = (preset: ThemePreset) => {
    if (!theme) return;
    setTheme({
      ...theme,
      preset_name: preset.name,
      primary_color: preset.primary_color,
      secondary_color: preset.secondary_color,
      bg_color: preset.bg_color,
      text_color: preset.text_color,
      font_family: preset.font_family,
      button_style: preset.button_style as ThemeConfig["button_style"],
      bg_pattern: preset.bg_pattern as ThemeConfig["bg_pattern"],
    });
  };

  const handleSave = async () => {
    if (!theme) return;
    setIsSaving(true);
    setSuccess(false);
    try {
      const data: ThemeUpdateRequest = {
        preset_name: theme.preset_name,
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        bg_color: theme.bg_color,
        text_color: theme.text_color,
        font_family: theme.font_family,
        button_style: theme.button_style,
        bg_pattern: theme.bg_pattern,
      };
      const updated = await api.put<ThemeConfig>("/theme", data);
      setTheme(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // handled
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !theme) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Appearance</h1>
        <div className={styles.loading}>Loading theme...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Appearance</h1>
          <p className={styles.subtitle}>Customize your public profile theme</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} icon={success ? <FiCheck /> : <FiSave />}>
          {success ? "Saved!" : "Save Theme"}
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Controls */}
        <div className={styles.controls}>
          {/* Presets */}
          <Card padding="md">
            <h3 className={styles.sectionTitle}>Theme Presets</h3>
            <div className={styles.presetGrid}>
              {presets.map((p) => (
                <button
                  key={p.name}
                  className={`${styles.presetCard} ${theme.preset_name === p.name ? styles.presetActive : ""}`}
                  onClick={() => applyPreset(p)}
                >
                  <div className={styles.presetPreview} style={{ background: p.bg_color }}>
                    <div className={styles.presetDot} style={{ background: p.primary_color }} />
                    <div className={styles.presetDot} style={{ background: p.secondary_color }} />
                  </div>
                  <span className={styles.presetLabel}>{p.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Colors */}
          <Card padding="md">
            <h3 className={styles.sectionTitle}>Colors</h3>
            <div className={styles.colorGrid}>
              {(["primary_color", "secondary_color", "bg_color", "text_color"] as const).map((key) => (
                <label key={key} className={styles.colorField}>
                  <span className={styles.colorLabel}>{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <div className={styles.colorInputWrap}>
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className={styles.colorInput}
                    />
                    <span className={styles.colorValue}>{theme[key]}</span>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Typography & Style */}
          <Card padding="md">
            <h3 className={styles.sectionTitle}>Typography & Style</h3>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Font Family</label>
              <div className={styles.optionRow}>
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f}
                    className={`${styles.optionChip} ${theme.font_family === f ? styles.optionActive : ""}`}
                    onClick={() => updateField("font_family", f)}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Button Style</label>
              <div className={styles.optionRow}>
                {BUTTON_STYLES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.optionChip} ${theme.button_style === s ? styles.optionActive : ""}`}
                    onClick={() => updateField("button_style", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Background Pattern</label>
              <div className={styles.optionRow}>
                {BG_PATTERNS.map((p) => (
                  <button
                    key={p}
                    className={`${styles.optionChip} ${theme.bg_pattern === p ? styles.optionActive : ""}`}
                    onClick={() => updateField("bg_pattern", p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewSticky}>
            <h3 className={styles.sectionTitle}>Live Preview</h3>
            <div
              className={styles.preview}
              style={{
                background: theme.bg_color,
                color: theme.text_color,
                fontFamily: theme.font_family,
              }}
            >
              {theme.bg_pattern === "dots" && <div className={styles.previewDots} />}
              {theme.bg_pattern === "gradient" && (
                <div
                  className={styles.previewGradient}
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary_color}22, ${theme.secondary_color}33)`,
                  }}
                />
              )}
              <div className={styles.previewContent}>
                <div className={styles.previewAvatar} style={{ background: theme.primary_color }}>JD</div>
                <h4 className={styles.previewName}>John Doe</h4>
                <p className={styles.previewBio}>Full-stack developer & creator</p>
                {["My Portfolio", "GitHub", "Twitter"].map((label) => {
                  const btnStyles: React.CSSProperties = {
                    background: theme.button_style === "outline" ? "transparent" : theme.primary_color,
                    color: theme.button_style === "outline" ? theme.primary_color : "#fff",
                    border: theme.button_style === "outline" ? `2px solid ${theme.primary_color}` : "none",
                    borderRadius:
                      theme.button_style === "pill" ? "999px" :
                      theme.button_style === "square" ? "4px" : "12px",
                  };
                  return (
                    <div key={label} className={styles.previewBtn} style={btnStyles}>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
