/**
 * Mock implementation for ziggy-js
 * Used in testing environments where the real Ziggy package might not be available
 */

export default function route(name: string, params: any = {}, absolute: boolean = true): string {
  // Mock implementation that returns a predictable value for tests
  return `/mock-route/${name}/${JSON.stringify(params)}`;
}

export const Ziggy = {
  // Mock configuration
  url: "http://localhost",
  port: null,
  defaults: {},
  routes: {
    // Add any routes needed for tests
    "novus.posts.index": { uri: "novus/posts", methods: ["GET"] },
    "novus.posts.create": { uri: "novus/posts/create", methods: ["GET"] },
    "novus.posts.store": { uri: "novus/posts", methods: ["POST"] },
    "novus.posts.update": { uri: "novus/posts/{post}", methods: ["PATCH"] },
  },
};