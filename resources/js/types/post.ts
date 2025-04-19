import { Category, SetDataFunction, Tag } from "@novus/types/index";
import { MediaSelection } from "@novus/types/media";

export type PostStatus = "draft" | "published" | "scheduled" | "archived";

interface PostBase {
    id: number | null;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: PostStatus;
    published_at: string | null;
    categories: string[];
    tags: string[];
}

export interface SeoMeta {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    canonical_url?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    og_type?: OpenGraphType | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    twitter_card?: TwitterCardType;
    robots_noindex?: boolean;
    robots_nofollow?: boolean;
    structured_data?: string | null;
}

export interface Author {
    name: string;
    avatar: string | null;
    initials: string;
}

export interface PostType extends PostBase {
    featured: boolean;
    author: Author;
    seo_meta: SeoMeta;
    views: number;
    created_at: string;
    updated_at: string;
}

export interface PostFormData extends PostBase {
    is_featured: boolean;
    featured_image: MediaSelection | File | number | null;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    canonical_url?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    og_type?: OpenGraphType;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    twitter_card?: TwitterCardType;
    robots_noindex?: boolean;
    robots_nofollow?: boolean;
    structured_data?: string;
}

// PostListItem for list views
export type PostListItem = Omit<PostType, "content"> & {
    author: {
        name: string;
        avatar: string;
        initials: string;
    };
};

export interface PostEditorProps {
    data: PostFormData;
    setData: SetDataFunction<PostFormData>;
    errors: Partial<Record<keyof PostFormData, string>>;
    content: string;
    onContentChange: (content: string) => void;
}

export interface PostExcerptProps {
    excerpt: string;
    onChange: (excerpt: string) => void;
    error?: string;
}

interface BaseFormProps {
    data: PostFormData;
    setData: SetDataFunction<PostFormData>;
    errors: Partial<Record<keyof PostFormData, string>>;
}

export interface PostSeoProps extends BaseFormProps {
    showPreview?: boolean;
}

export interface PostSettingsProps extends BaseFormProps {
    postStatus: string;
}
export interface TabProps extends BaseFormProps {}

export interface FeaturedImageProps {
    featuredImage: MediaSelection | File | null;
    onChange: (value: MediaSelection | File | null) => void;
    error?: string;
}

export type OpenGraphType =
    | "article"
    | "website"
    | "book"
    | "profile"
    | "video.movie"
    | "music";

export type TwitterCardType =
    | "summary_large_image"
    | "summary"
    | "app"
    | "player";

export interface PreviewProps {
    data: PostFormData;
}

export interface PostDatePickerProps {
    date: string | null;
    onChange: (date: string) => void;
    error?: string;
}
