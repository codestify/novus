/**
 * Mock implementation for ziggy-js
 * Used in testing and CI build environments when the real Ziggy package is not available
 */

// Named export for the route function (for imports like `import { route } from "ziggy-js"`)
export function route(name: string, params: any = {}, absolute: boolean = true): string {
  // Basic implementation that returns a mock route URL
  if (params && typeof params === 'object') {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    return paramString ? `/mock/${name}?${paramString}` : `/mock/${name}`;
  }
  return `/mock/${name}`;
}

// Default export (for imports like `import route from "ziggy-js"`)
export default route;

// Export Ziggy configuration
export const Ziggy = {
  // Mock routes configuration
  url: "http://localhost",
  port: null,
  defaults: {},
  routes: {
    "novus.posts.index": { uri: "novus/posts", methods: ["GET"] },
    "novus.posts.create": { uri: "novus/posts/create", methods: ["GET"] },
    "novus.posts.store": { uri: "novus/posts", methods: ["POST"] },
    "novus.posts.update": { uri: "novus/posts/{post}", methods: ["PATCH"] },
    "novus.posts.destroy": { uri: "novus/posts/{post}", methods: ["DELETE"] },
    "novus.media.index": { uri: "novus/media", methods: ["GET"] },
    "novus.subscribers.index": { uri: "novus/subscribers", methods: ["GET"] },
    "novus.auth.logout": { uri: "novus/auth/logout", methods: ["POST"] },
    "novus.performance.index": { uri: "novus/performance", methods: ["GET"] },
  },
};