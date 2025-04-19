import { PostListItem, PostType } from "@novus/types/post";
import {
    AnalyticsDashboardData,
    PerformanceData,
    SeoData,
} from "@novus/types/analytics";
import { Subscriber } from "@novus/types/subscriber";

export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

export interface SetDataFunction<T> {
    (data: T): void;
    (updater: (previousData: T) => T): void;
    <K extends keyof T>(key: K, value: T[K]): void;
}

export interface Author {
    id: string;
    name: string;
    slug: string;
    bio: Nullable<string>;
    email: string;
    website: Nullable<string>;
    avatar: Nullable<string>;
    social_links: Nullable<Record<string, string>>;
}

export type Tag = {
    id: number;
    name: string;
    slug: string;
};

export type InertiaSharedProps<T = {}> = T & {
    auth: {
        user: Author;
        isLoggedIn: boolean;
    };
    app_url: string;
    errorBags: any;
    errors: any;
    blog_post: Nullable<PostType>;
    posts: PostListResponse;
    periodOptions: {
        label: string;
        value: string;
    }[];
    analyticsData: AnalyticsDashboardData;
    category: Category;
    parent_categories: ParentCategory[];
    seoData: SeoData;
    all_categories: Category[];
    all_tags: Tag[];
    performanceData: PerformanceData;
};

export interface Links {
    first: string;
    last: string;
    prev: Nullable<string>;
    next: Nullable<string>;
}

// Interface for each link inside the "meta.links" array
export interface MetaLink {
    url: Nullable<string>;
    label: string;
    active: boolean;
}

// Interface for the "meta" section
export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

type PaginatedResponse<T> = {
    data: T[];
    links: Links;
    meta: Meta;
};

export type PostListResponse = PaginatedResponse<PostListItem>;
export type SubscribersResponse = PaginatedResponse<Subscriber>;

type ParentCategory = {
    id: number;
    name: string;
};

type SeoMetaData = {
    id: number;
    meta_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    meta_keywords: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    og_type: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    twitter_image: string | null;
    twitter_card: string | null;
    robots_noindex: boolean | number;
    robots_nofollow: boolean | number;
    structured_data: string | null;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    seo_meta?: SeoMetaData;
    parent_category?: ParentCategory;
};
