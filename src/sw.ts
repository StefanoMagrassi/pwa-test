/// <reference lib="WebWorker" />

const VERSION = '1.0.0';

const init = (scope: ServiceWorkerGlobalScope): void => {
  cacheHandler(scope);

  pushHandler(scope);
};

// --- Cache
const RESOURCES = ['/', '/index.html', '/icon.png', '/index.js'];
const CACHE_NAME = `pwa-test-${VERSION}`;

const cacheHandler = (scope: ServiceWorkerGlobalScope): void => {
  const caches = scope.caches;
  const fromCaches = fromCache(caches);

  // --- cache static resource on install
  scope.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(RESOURCES))
    );
  });

  // --- remove old caches on activate
  scope.addEventListener('activate', event => {
    event.waitUntil(
      caches
        .keys()
        .then(names =>
          Promise.all(
            names.map(name =>
              name === CACHE_NAME ? Promise.resolve() : caches.delete(name)
            )
          )
        )
        .then(() => scope.clients.claim())
    );
  });

  // --- on fetch, intercept server requests and respond with cached responses instead of going to network
  scope.addEventListener('fetch', event => {
    event.respondWith(
      event.request.mode === 'navigate'
        ? fromCaches('/')
        : caches
            .open(CACHE_NAME)
            .then(cache => fromCache(cache)(event.request.url))
    );
  });
};

const fromCache =
  (cache: CacheStorage | Cache) =>
  (request: RequestInfo | URL): Promise<Response> =>
    cache
      .match(request)
      // Return the cached response if it's available or a 404 if resource isn't in the cache
      .then(resp => resp ?? new Response(null, {status: 404}));

// --- Push
const pushHandler = (self: ServiceWorkerGlobalScope): void => {
  self.addEventListener('push', event => {
    event.waitUntil(sendNotification(self)(event.data?.text() ?? 'no data'));
  });
};

const sendNotification =
  (self: ServiceWorkerGlobalScope) =>
  async (body: string): Promise<void> => {
    const notify = showNotification(self);

    switch (Notification.permission) {
      case 'granted':
        return notify(body);

      case 'default': {
        const permission = await Notification.requestPermission();

        return permission === 'granted' ? notify(body) : undefined;
      }

      case 'denied':
        return;
    }
  };

const showNotification =
  (self: ServiceWorkerGlobalScope) =>
  async (body: string): Promise<void> =>
    self.registration.showNotification('PWA Test', {
      body: body,
      icon: 'icon.png'
    });

// Work-around for Service Worker global scope in TS
// ref. https://github.com/microsoft/TypeScript/issues/14877#issuecomment-1704437556
init(self as unknown as ServiceWorkerGlobalScope);