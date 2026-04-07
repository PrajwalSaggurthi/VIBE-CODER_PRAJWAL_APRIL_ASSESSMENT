"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLinks } from "@/hooks/useLinks";
import { useAnalytics } from "@/hooks/useAnalytics";
import LinkCard from "@/components/dashboard/LinkCard";
import LinkEditor from "@/components/dashboard/LinkEditor";
import StatsCard from "@/components/dashboard/StatsCard";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { FiPlus, FiMousePointer, FiTrendingUp, FiLink as FiLinkIcon } from "react-icons/fi";
import { formatNumber } from "@/lib/utils";
import type { Link, LinkCreateRequest, LinkUpdateRequest } from "@/types/link";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { links, isLoading, createLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { overview } = useAnalytics();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex);

      const order = reordered.map((l, i) => ({ id: l.id, position: i }));
      await reorderLinks({ order });
    },
    [links, reorderLinks]
  );

  const handleCreate = async (data: LinkCreateRequest | LinkUpdateRequest) => {
    await createLink(data as LinkCreateRequest);
  };

  const handleUpdate = async (data: LinkCreateRequest | LinkUpdateRequest) => {
    if (!editingLink) return;
    await updateLink(editingLink.id, data as LinkUpdateRequest);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this link? This action cannot be undone.")) {
      await deleteLink(id);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    await updateLink(id, { is_active: active });
  };

  const openNew = () => {
    setEditingLink(null);
    setEditorOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Links</h1>
          <p className={styles.subtitle}>Manage and reorder your links</p>
        </div>
        <Button onClick={openNew} icon={<FiPlus />}>
          Add Link
        </Button>
      </div>

      {/* Stats cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          icon={<FiMousePointer />}
          label="Total Clicks"
          value={overview ? formatNumber(overview.total_clicks) : "—"}
        />
        <StatsCard
          icon={<FiTrendingUp />}
          label="Clicks Today"
          value={overview ? formatNumber(overview.clicks_today) : "—"}
        />
        <StatsCard
          icon={<FiLinkIcon />}
          label="Active Links"
          value={links.filter((l) => l.is_active).length}
        />
      </div>

      {/* Links list */}
      <div className={styles.linksSection}>
        {isLoading ? (
          <div className={styles.skeletonList}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="72px" borderRadius="var(--radius-xl)" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <EmptyState
            icon={<FiLinkIcon size={48} />}
            title="No links yet"
            description="Add your first link to get started. Your visitors will see them on your public profile page."
            action={
              <Button onClick={openNew} icon={<FiPlus />}>
                Add Your First Link
              </Button>
            }
          />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className={styles.linksList}>
                {links.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Link editor modal */}
      <LinkEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingLink(null);
        }}
        onSubmit={editingLink ? handleUpdate : handleCreate}
        editingLink={editingLink}
      />
    </div>
  );
}
