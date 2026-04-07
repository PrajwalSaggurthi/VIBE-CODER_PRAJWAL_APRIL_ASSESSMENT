"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Link, LinkCreateRequest, LinkUpdateRequest, LinkReorderRequest } from "@/types/link";

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.get<Link[]>("/links");
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const createLink = async (data: LinkCreateRequest): Promise<Link> => {
    const link = await api.post<Link>("/links", data);
    setLinks((prev) => [...prev, link]);
    return link;
  };

  const updateLink = async (id: string, data: LinkUpdateRequest): Promise<Link> => {
    const link = await api.put<Link>(`/links/${id}`, data);
    setLinks((prev) => prev.map((l) => (l.id === id ? link : l)));
    return link;
  };

  const deleteLink = async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const reorderLinks = async (order: LinkReorderRequest): Promise<void> => {
    const reordered = await api.put<Link[]>("/links/reorder", order);
    setLinks(reordered);
  };

  return {
    links,
    isLoading,
    error,
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
}
