export interface Subscriber {
    id: number;
    email: string;
    name: string | null;
    status: "active" | "inactive" | "unsubscribed";
    preferences: Record<string, any> | null;
    subscribed_at: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SubscriberFormData {
    email: string;
    name: string;
    status: "active" | "inactive" | "unsubscribed";
    preferences: Record<string, any> | null;
}
