import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

/**
 * Interface for AI action parameters
 */
export interface AIActionParams {
    /** The type of action to perform */
    action: string;
    /** Content to process */
    content: string;
    /** Optional tone specification */
    tone?: string;
    /** Optional keywords for SEO optimization */
    keywords?: string;
    /** Optional maximum length in characters */
    maxLength?: number;
    /** Optional additional parameters */
    [key: string]: any;
}

/**
 * Possible response types from the AI service
 */
export type AIServiceResponse =
    | string
    | {
          success: boolean;
          result?: string;
          message?: string;
          error?: string;
      };

/**
 * Error class for AI Service specific errors
 */
export class AIServiceError extends Error {
    public readonly statusCode?: number;
    public readonly responseData?: any;

    constructor(message: string, statusCode?: number, responseData?: any) {
        super(message);
        this.name = "AIServiceError";
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}

/**
 * Service for interacting with AI-powered content operations
 */
export default class AIService {
    private static readonly DEFAULT_TIMEOUT = 60000; // 60 seconds
    private static readonly API_BASE_PATH = "/novus/ai"; // Updated to match Laravel route structure

    /**
     * Get the CSRF token from the document
     * @returns CSRF token or empty string if not found
     */
    private static getCsrfToken(): string {
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || ""
        );
    }

    /**
     * Build the request configuration with proper headers and settings
     * @param timeout Optional custom timeout in milliseconds
     * @returns AxiosRequestConfig object
     */
    private static getRequestConfig(timeout?: number): AxiosRequestConfig {
        return {
            timeout: timeout || this.DEFAULT_TIMEOUT,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Cache-Control": "no-cache, no-store",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": this.getCsrfToken(),
            },
            withCredentials: true,
        };
    }

    /**
     * Extract result string from various response formats
     * @param data The response data to parse
     * @returns Extracted result string
     * @throws AIServiceError if result cannot be extracted
     */
    private static extractResultFromResponse(data: AIServiceResponse): string {
        // Case 1: Standard response format with success flag
        if (typeof data === "object" && data && data.success && data.result) {
            return data.result;
        }

        // Case 2: Result field without success flag
        if (
            typeof data === "object" &&
            data &&
            typeof data.result === "string" &&
            data.result.length > 0
        ) {
            return data.result;
        }

        // Case 3: Direct string response
        if (typeof data === "string" && data.length > 0) {
            return data;
        }

        // Case 4: Error message in response
        if (typeof data === "object" && data && (data.message || data.error)) {
            throw new AIServiceError(
                data.message || data.error || "Unknown error",
                undefined,
                data,
            );
        }

        // Default: Unable to extract result
        throw new AIServiceError(
            "Failed to process AI action: unexpected response format",
            undefined,
            data,
        );
    }

    /**
     * Handle errors from the API or network
     * @param error The caught error object
     * @throws AIServiceError with appropriate message and details
     */
    private static handleError(error: unknown): never {
        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            // Network errors (no response)
            if (!axiosError.response) {
                throw new AIServiceError(
                    `Network error: ${axiosError.message}`,
                    undefined,
                    { message: axiosError.message },
                );
            }

            // Server responded with error status
            const statusCode = axiosError.response.status;
            const responseData = axiosError.response.data as Record<
                string,
                any
            >;
            const errorMessage =
                responseData?.error ||
                responseData?.message ||
                `Server error (${statusCode})`;

            throw new AIServiceError(
                `API error: ${errorMessage}`,
                statusCode,
                responseData,
            );
        }

        // Handle regular errors
        if (error instanceof Error) {
            throw new AIServiceError(error.message);
        }

        // Fallback for unknown errors
        throw new AIServiceError("Unknown error occurred");
    }

    /**
     * Process an AI action with detailed logging and error handling
     *
     * @param params AIActionParams object containing the action and content
     * @param timeout Optional custom timeout in milliseconds
     * @returns Promise with the AI response as a string
     * @throws AIServiceError if the request fails or returns invalid data
     */
    static async processAction(
        params: AIActionParams,
        timeout?: number,
    ): Promise<string> {
        try {
            console.log(`[AIService] Processing action: ${params.action}`);

            // Add a timestamp to prevent caching
            const requestParams = {
                ...params,
                _ts: new Date().getTime(),
            };

            // Build the API URL
            const url = `${this.API_BASE_PATH}/action`;
            console.log(`[AIService] Request URL: ${url}`);

            // Execute the request
            const response: AxiosResponse = await axios.post(
                url,
                requestParams,
                this.getRequestConfig(timeout),
            );

            console.log(`[AIService] Response status: ${response.status}`);

            // Extract and return the result
            const result = this.extractResultFromResponse(response.data);
            console.log(`[AIService] Successfully processed ${params.action}`);
            return result;
        } catch (error) {
            console.error("[AIService] Error processing action:", error);
            return this.handleError(error);
        }
    }

    /**
     * Check if the AI service is available
     *
     * @returns Promise resolving to true if service is available, false otherwise
     */
    static async isAvailable(): Promise<boolean> {
        try {
            const response = await axios.get(
                `${this.API_BASE_PATH}/status`,
                this.getRequestConfig(5000), // Use shorter timeout for status check
            );
            return (
                response.status === 200 &&
                (typeof response.data === "object"
                    ? response.data.available === true
                    : true)
            );
        } catch (error) {
            console.warn(
                "[AIService] Service availability check failed:",
                error,
            );
            return false;
        }
    }

    /**
     * Improve the writing quality
     *
     * @param content Text content to improve
     * @returns Promise with improved content
     */
    static async improve(content: string): Promise<string> {
        return this.processAction({
            action: "improve",
            content,
        });
    }

    /**
     * Shorten the content
     *
     * @param content Text content to shorten
     * @param maxLength Optional maximum length in characters
     * @returns Promise with shortened content
     */
    static async shorten(content: string, maxLength?: number): Promise<string> {
        return this.processAction({
            action: "shorten",
            content,
            maxLength,
        });
    }

    /**
     * Expand the content
     *
     * @param content Text content to expand
     * @returns Promise with expanded content
     */
    static async expand(content: string): Promise<string> {
        return this.processAction({
            action: "expand",
            content,
        });
    }

    /**
     * Adjust the tone of the content
     *
     * @param content Text content to adjust
     * @param tone Target tone (e.g., professional, casual, friendly)
     * @returns Promise with tone-adjusted content
     */
    static async adjustTone(content: string, tone: string): Promise<string> {
        return this.processAction({
            action: "adjust-tone",
            content,
            tone,
        });
    }
}
