importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox loaded successfully");

  workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "images",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://story-api.dicoding.dev",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 jam
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "document" ||
      request.destination === "script" ||
      request.destination === "style",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    })
  );

  self.addEventListener("push", (event) => {
    const data = event.data
      ? event.data.json()
      : { title: "Push Notification", body: "No data" };
    const options = {
      body: data.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    };
    self.registration.showNotification(data.title, options);
  });

  self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });
} else {
  console.error("Workbox failed to load. Please check your network or CDN.");
}
