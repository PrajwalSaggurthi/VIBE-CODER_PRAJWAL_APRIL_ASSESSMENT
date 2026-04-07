"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link } from "@/types/link";
import Badge from "@/components/ui/Badge";
import { FiEdit2, FiTrash2, FiMoreVertical, FiExternalLink } from "react-icons/fi";
import styles from "./LinkCard.module.css";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}

export default function LinkCard({ link, onEdit, onDelete, onToggle }: LinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.card} data-dragging={isDragging}>
      <button className={styles.dragHandle} {...attributes} {...listeners} aria-label="Drag to reorder">
        <FiMoreVertical size={18} />
      </button>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{link.title}</h3>
          <Badge variant={link.is_active ? "success" : "default"}>
            {link.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.url}>
          {link.url}
          <FiExternalLink size={12} />
        </a>
      </div>

      <div className={styles.actions}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={link.is_active}
            onChange={() => onToggle(link.id, !link.is_active)}
            className={styles.toggleInput}
          />
          <span className={styles.toggleTrack} />
        </label>
        <button className={styles.actionBtn} onClick={() => onEdit(link)} aria-label="Edit link">
          <FiEdit2 size={15} />
        </button>
        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(link.id)} aria-label="Delete link">
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
}
