"use client";

import type { PublicProfileResponse } from "@/types/tenant";
import { api } from "@/lib/api";
import {
  FiGlobe,
  FiGithub,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
} from "react-icons/fi";
import styles from "./profile.module.css";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  twitter: <FiTwitter />,
  github: <FiGithub />,
  instagram: <FiInstagram />,
  youtube: <FiYoutube />,
  linkedin: <FiLinkedin />,
};

function recordClick(linkId: string) {
  api.post("/analytics/click", { link_id: linkId }, false).catch(() => {});
}

export default function ProfileView({ profile }: { profile: PublicProfileResponse }) {
  const { tenant, links, theme } = profile;

  const t = theme || {
    primary_color: "#1a1a2e",
    secondary_color: "#16213e",
    bg_color: "#ffffff",
    text_color: "#1a1a2e",
    font_family: "Inter",
    button_style: "rounded",
    bg_pattern: "none",
  };

  const btnRadius =
    t.button_style === "pill" ? "999px" :
    t.button_style === "square" ? "4px" : "12px";

  const btnBg = t.button_style === "outline" ? "transparent" : t.primary_color;
  const btnColor = t.button_style === "outline" ? t.primary_color : "#ffffff";
  const btnBorder = t.button_style === "outline" ? `2px solid ${t.primary_color}` : "none";

  return (
    <div
      className={styles.page}
      style={{
        background: t.bg_color,
        color: t.text_color,
        fontFamily: `'${t.font_family}', sans-serif`,
      } as React.CSSProperties}
    >
      {/* Background patterns */}
      {t.bg_pattern === "dots" && <div className={styles.dotsPattern} style={{ color: t.text_color }} />}
      {t.bg_pattern === "gradient" && (
        <div
          className={styles.gradientPattern}
          style={{
            background: `linear-gradient(135deg, ${t.primary_color}20, ${t.secondary_color}30, transparent)`,
          }}
        />
      )}
      {t.bg_pattern === "waves" && (
        <div className={styles.wavesPattern} style={{ color: t.primary_color }} />
      )}

      <div className={styles.content}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          {tenant.avatar_url ? (
            <img src={tenant.avatar_url} alt={tenant.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback} style={{ background: t.primary_color }}>
              {tenant.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h1 className={styles.name}>{tenant.name}</h1>
        {tenant.bio && <p className={styles.bio}>{tenant.bio}</p>}

        {/* Social Icons */}
        {tenant.social_links && Object.keys(tenant.social_links).length > 0 && (
          <div className={styles.socials}>
            {Object.entries(tenant.social_links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                style={{ color: t.text_color }}
              >
                {SOCIAL_ICONS[key] || <FiGlobe />}
              </a>
            ))}
          </div>
        )}

        {/* Links */}
        <div className={styles.links}>
          {links.map((link, idx) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
              style={{
                background: btnBg,
                color: btnColor,
                border: btnBorder,
                borderRadius: btnRadius,
                animationDelay: `${idx * 60}ms`,
              } as React.CSSProperties}
              onClick={() => recordClick(link.id)}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <a href="/" className={styles.footerLink} style={{ color: t.text_color }}>
            ⚡ Made with LinkHub
          </a>
        </footer>
      </div>
    </div>
  );
}
