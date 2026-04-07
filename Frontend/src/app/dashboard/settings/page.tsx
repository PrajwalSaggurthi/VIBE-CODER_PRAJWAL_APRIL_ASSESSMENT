"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { FiUser, FiEdit3, FiSave } from "react-icons/fi";
import type { TenantUpdateRequest } from "@/types/tenant";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { tenant, refreshTenant } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialGithub, setSocialGithub] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || "");
      setBio(tenant.bio || "");
      setAvatarUrl(tenant.avatar_url || "");
      setSocialTwitter(tenant.social_links?.twitter || "");
      setSocialInstagram(tenant.social_links?.instagram || "");
      setSocialGithub(tenant.social_links?.github || "");
      setSocialYoutube(tenant.social_links?.youtube || "");
    }
  }, [tenant]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    const socialLinks: Record<string, string> = {};
    if (socialTwitter) socialLinks.twitter = socialTwitter;
    if (socialInstagram) socialLinks.instagram = socialInstagram;
    if (socialGithub) socialLinks.github = socialGithub;
    if (socialYoutube) socialLinks.youtube = socialYoutube;

    const data: TenantUpdateRequest = {
      name,
      bio,
      avatar_url: avatarUrl || undefined,
      social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    };

    try {
      await api.put("/tenant", data);
      await refreshTenant();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // handled by API client
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your profile information</p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarSection}>
            <Avatar name={name || "User"} src={avatarUrl || null} size="xl" />
            <div>
              <h3 className={styles.avatarLabel}>Profile Photo</h3>
              <Input
                placeholder="https://example.com/photo.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                hint="Enter a URL for your profile image"
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.fieldGroup}>
            <h3 className={styles.sectionTitle}><FiUser size={16} /> Profile</h3>
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Tell visitors about yourself..."
              />
              <span className={styles.charCount}>{bio.length}/500</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.fieldGroup}>
            <h3 className={styles.sectionTitle}><FiEdit3 size={16} /> Social Links</h3>
            <div className={styles.socialGrid}>
              <Input label="Twitter" placeholder="https://twitter.com/you" value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} />
              <Input label="Instagram" placeholder="https://instagram.com/you" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} />
              <Input label="GitHub" placeholder="https://github.com/you" value={socialGithub} onChange={(e) => setSocialGithub(e.target.value)} />
              <Input label="YouTube" placeholder="https://youtube.com/@you" value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} />
            </div>
          </div>

          <div className={styles.formActions}>
            {success && <span className={styles.successMsg}>✓ Settings saved!</span>}
            <Button type="submit" isLoading={isLoading} icon={<FiSave />}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
