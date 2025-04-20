export type UserMetrics = {
    totalUsers: number;
    totalUsersChange: number | null;
    newUsers: number;
    newUsersChange: number | null;
    sessions: number;
    sessionsChange: number | null;
    pageviewsPerSession: number;
    pageviewsPerSessionChange: number | null;
    avgSessionDuration: number;
    avgSessionDurationChange: number | null;
};

export type VisitorsAndPageViewsItem = {
    date: string; // could be refined to Date if parsed
    visitors: number;
    pageViews: number;
};

export type TopBrowser = {
    browser: string;
    sessions: number;
};

export type TopReferrer = {
    url: string;
    pageViews: number;
};

export type MostVisitedPage = {
    url: string;
    pageTitle: string;
    pageViews: number;
};

export type KeywordData = {
    keyword: string;
    sessions: number;
};

// Performance Summary type
type PerformanceSummary = {
    avgPageLoadTime: number; // Average page load time in seconds
    pageLoadTimeChange: number; // Percentage change in page load time
    avgBounceRate: number; // Average bounce rate percentage
    bounceRateChange: number; // Percentage change in bounce rate
    deviceDistribution: {
        // Device distribution data
        [key: string]: {
            // Key is device name (Desktop, Mobile, Tablet)
            sessions: number; // Number of sessions for this device
            percentage: number; // Percentage of total sessions
        };
    };
    totalSessions: number; // Total number of sessions across all devices
};

// Device Performance type
type DevicePerformance = {
    device: string; // Device type (Desktop, Mobile, Tablet)
    sessions: number; // Number of sessions
    percentage: number; // Percentage of total traffic
    pageLoadTime: number; // Average page load time in seconds
    bounceRate: number; // Bounce rate percentage
    conversionRate: number; // Conversion rate percentage
};

// Core Web Vitals type
type CoreWebVitals = {
    lcp: {
        // Largest Contentful Paint
        value: number; // LCP value in seconds
        status: "good" | "needs-improvement" | "poor"; // Status based on thresholds
        percent: number; // Percentage score (higher is better)
        target: number; // Target threshold for good performance
    };
    fid: {
        // First Input Delay
        value: number; // FID value in milliseconds
        status: "good" | "needs-improvement" | "poor"; // Status based on thresholds
        percent: number; // Percentage score (higher is better)
        target: number; // Target threshold for good performance
    };
    cls: {
        // Cumulative Layout Shift
        value: number; // CLS value (unitless)
        status: "good" | "needs-improvement" | "poor"; // Status based on thresholds
        percent: number; // Percentage score (higher is better)
        target: number; // Target threshold for good performance
    };
};

export type AnalyticsDashboardData = {
    period: string;
    userMetrics: UserMetrics;
    activeUsers: number;
    visitorsAndPageViews: VisitorsAndPageViewsItem[];
    topBrowsers: TopBrowser[];
    topReferrers: TopReferrer[];
    mostVisitedPages: MostVisitedPage[];
};

export type PerformanceData = {
    period: string;
    bounceRate: BounceRateEntry[];
    sessionDuration: SessionDurationEntry[];
    pageLoadTime: PageLoadTimeEntry[];
    deviceCategories: DeviceCategory[];
    devicePerformance: DevicePerformance[];
    coreWebVitals: CoreWebVitals;
    performanceSummary: PerformanceSummary;
};

export type BounceRateEntry = {
    date: string;
    bounceRate: number;
};

export type SessionDurationEntry = {
    date: string;
    duration: number;
};

export type PageLoadTimeEntry = {
    date: string;
    loadTime: number;
};

export type DeviceCategory = {
    name: string;
    sessions: number;
};

export type SearchVisit = {
    date: string;
    organic: number;
    direct: number;
    referral: number;
};

export type Keyword = {
    keyword: string;
    sessions: number;
};

export type LandingPage = {
    url: string;
    entrances: number;
    bounceRate: number;
};

export type SearchEngine = {
    engine: string;
    visits: number;
};

export type ClickThroughRate = {
    date: string;
    ctr: number;
};

type SeoSummary = {
    totalOrganicTraffic: number;
    organicTrafficChange: number;
    avgCtr: number;
    ctrChange: number;
    topSearchEngine: {
        name: string;
        percentage: number;
    };
    topKeyword: {
        keyword: string;
        sessions: number;
    };
};

export type SeoData = {
    period: string;
    searchVisits: SearchVisit[];
    keywords: Keyword[];
    landingPages: LandingPage[];
    searchEngines: SearchEngine[];
    clickThroughRate: ClickThroughRate[];
    seoSummary: SeoSummary;
};
