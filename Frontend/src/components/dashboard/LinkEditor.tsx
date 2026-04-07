"use client";

import { useState, FormEvent, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Link, LinkCreateRequest, LinkUpdateRequest } from "@/types/link";
import { ICON_OPTIONS } from "@/lib/constants";
import { FiLink, FiType, FiTag } from "react-icons/fi";
import styles from "./LinkEditor.module.css";

interface LinkEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LinkCreateRequest | LinkUpdateRequest) => Promise<void>;
  editingLink?: Link | null;
}

export default function LinkEditor({ isOpen, onClose, onSubmit, editingLink }: LinkEditorProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setIcon(editingLink.icon || "");
    } else {
      setTitle("");
      setUrl("");
      setIcon("");
    }
    setError("");
  }, [editingLink, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onSubmit({
        title,
        url,
        icon: icon || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLink ? "Edit Link" : "Add New Link"}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <Input
          label="Title"
          placeholder="My Portfolio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<FiType />}
          required
        />

        <Input
          label="URL"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={<FiLink />}
          required
        />

        <div className={styles.iconField}>
          <label className={styles.iconLabel}>
            <FiTag size={14} />
            Icon (optional)
          </label>
          <div className={styles.iconGrid}>
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.iconOption} ${icon === opt ? styles.iconActive : ""}`}
                onClick={() => setIcon(icon === opt ? "" : opt)}
                title={opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {editingLink ? "Save Changes" : "Add Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
