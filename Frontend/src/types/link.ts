/* Link-related types. */

export interface Link {
  id: string;
  tenant_id: string;
  title: string;
  url: string;
  icon: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkCreateRequest {
  title: string;
  url: string;
  icon?: string;
}

export interface LinkUpdateRequest {
  title?: string;
  url?: string;
  icon?: string;
  is_active?: boolean;
}

export interface LinkOrderItem {
  id: string;
  position: number;
}

export interface LinkReorderRequest {
  order: LinkOrderItem[];
}
