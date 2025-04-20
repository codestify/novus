export interface MediaItem {
    id: number;
    name: string;
    path: string;
    mime_type: string;
    type: number;
    disk: string;
    collection_name: string;
    size: number;
    custom_properties: Record<string, any>;
    alt_text: string | null;
    title: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    url: string;
    thumbnail_url: string;
    width?: number;
    height?: number;
    model_id?: number;
    model_type?: string;
}

export interface MediaSelection extends Partial<MediaItem> {
    fromLibrary: boolean;
    [key: string]: any;
}

export interface MediaCollection {
    name: string;
    count: number;
}

export interface PaginationData {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface MediaLibraryProps {
    media: PaginationData & {
        data: MediaItem[];
    };
    collections: MediaCollection[];
    filters?: {
        search?: string;
        collection?: string;
        mime_type?: string;
        sort_by?: string;
        per_page?: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
}
