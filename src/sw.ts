/// <reference lib="WebWorker" />

import {manifest, version} from '@parcel/service-worker';

const init = (scope: ServiceWorkerGlobalScope): void => {
  cacheHandler(scope);

  pushHandler(scope);
};

// --- Cache
const CACHE_NAME = `pwa-test-${version}`;

const cacheHandler = (scope: ServiceWorkerGlobalScope): void => {
  const caches = scope.caches;

  // --- cache static resource on install
  scope.addEventListener('install', event => {
    event.waitUntil(
      scope.caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(manifest))
        .catch(console.error)
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
        .catch(console.error)
    );
  });

  // --- on fetch, intercept server requests and respond with cached responses instead of going to network
  scope.addEventListener('fetch', event => {
    if (!manifest.includes(event.request.url)) {
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const resp = await cache.match(event.request);

        if (resp) {
          return resp;
        }

        try {
          const networkResp = await fetch(event.request);

          if (networkResp.ok) {
            await cache.put(event.request, networkResp.clone());
          }

          return networkResp;
        } catch (e) {
          return Response.error();
        }
      })()
    );
  });
};

// --- Push
const pushHandler = (self: ServiceWorkerGlobalScope): void => {
  self.addEventListener('push', event => {
    event.waitUntil(
      sendNotification(self)(event.data?.text() ?? 'no data').catch(
        console.error
      )
    );
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
