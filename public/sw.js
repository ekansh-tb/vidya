/* Vidya public offline shell.
 *
 * Privacy boundary: only the credential-free root shell, its same-origin Next
 * build assets, app icons, and explicitly public learning resources may enter
 * Cache Storage. Parent, authentication, API, and personalized navigation
 * responses always stay on the network path.
 */

const CACHE_PREFIX = "vidya-public";
const CACHE_VERSION = "2026-08-16-2";
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const LEARNING_CACHE = `${CACHE_PREFIX}-learning-${CACHE_VERSION}`;
const UPDATE_CACHE = `${CACHE_PREFIX}-update-${CACHE_VERSION}`;
const UPDATE_MARKER_URL = "/__vidya_internal_update_marker__";
const ROOT_SHELL_URL = "/";
const STATIC_CACHE_MAX_ENTRIES = 120;
const LEARNING_CACHE_MAX_ENTRIES = 60;
const UPDATE_ACK_TIMEOUT_MS = 1_200;

const REQUIRED_PRECACHE = [
  "/offline.html",
  "/icons/vidya-app.svg",
  "/icons/vidya-maskable.svg",
  "/icons/vidya-192.png",
  "/icons/vidya-512.png",
  "/icons/apple-touch-icon.png",
];

const PROTECTED_STATIC_PATHS = new Set([ROOT_SHELL_URL, ...REQUIRED_PRECACHE]);

const PRIVATE_ROUTE_PREFIXES = [
  "/api",
  "/parent",
  "/sign-in",
  "/sign-up",
];

const PUBLIC_LEARNING_PREFIXES = ["/books/", "/field-trips/"];

const UPDATE_MESSAGES = Object.freeze({
  activate: "VIDYA_ACTIVATE_UPDATE",
  prepare: "VIDYA_UPDATE_PREPARE",
  ready: "VIDYA_UPDATE_READY",
  failed: "VIDYA_UPDATE_FAILED",
});

function hasPathPrefix(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isPrivateRoute(pathname) {
  return PRIVATE_ROUTE_PREFIXES.some((prefix) => hasPathPrefix(pathname, prefix));
}

function isNextStaticAsset(pathname) {
  return pathname.startsWith("/_next/static/");
}

function isStaticAsset(pathname) {
  return isNextStaticAsset(pathname) || pathname.startsWith("/icons/");
}

function isPublicLearningAsset(pathname) {
  return PUBLIC_LEARNING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isExactRootUrl(url) {
  return url.pathname === ROOT_SHELL_URL && url.search === "";
}

function strategyForRequest(request) {
  if (request.method !== "GET") return "bypass";

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivateRoute(url.pathname)) return "bypass";
  if (request.mode === "navigate") return isExactRootUrl(url) ? "root-navigation" : "navigation";
  if (isStaticAsset(url.pathname)) return "static";
  if (isPublicLearningAsset(url.pathname)) return "learning";
  return "bypass";
}

function canStore(response) {
  if (!response || !response.ok || response.type !== "basic") return false;

  const cacheControl = response.headers.get("cache-control") ?? "";
  const hasPrivateDirective = /(?:^|,)\s*(?:private|no-store)(?:\s*=|\s|,|$)/i.test(cacheControl);
  const vary = response.headers.get("vary") ?? "";
  const variesByIdentity = /(?:^|,)\s*(?:cookie|authorization)(?:\s|,|$)/i.test(vary);
  return !hasPrivateDirective && !variesByIdentity;
}

function requestPath(request) {
  return new URL(request.url).pathname;
}

async function trimCache(cache, maxEntries, protectedPaths = new Set()) {
  const keys = await cache.keys();
  let excess = keys.length - maxEntries;
  if (excess <= 0) return;

  for (const key of keys) {
    if (excess <= 0) break;
    if (protectedPaths.has(requestPath(key))) continue;
    if (await cache.delete(key)) excess -= 1;
  }
}

async function putBounded(cacheName, request, response, maxEntries, protectedPaths = new Set()) {
  const cache = await caches.open(cacheName);
  await cache.delete(request);
  await cache.put(request, response);
  await trimCache(cache, maxEntries, protectedPaths);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (canStore(response)) {
    await putBounded(STATIC_CACHE, request, response.clone(), STATIC_CACHE_MAX_ENTRIES, PROTECTED_STATIC_PATHS);
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(LEARNING_CACHE);

  try {
    const response = await fetch(request);
    if (canStore(response)) {
      await putBounded(LEARNING_CACHE, request, response.clone(), LEARNING_CACHE_MAX_ENTRIES);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

function nextStaticDependencies(html) {
  const dependencies = new Set();
  const attributePattern = /(?:src|href)=["']([^"']+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    try {
      const url = new URL(match[1], self.location.origin);
      if (url.origin === self.location.origin && isNextStaticAsset(url.pathname)) {
        dependencies.add(`${url.pathname}${url.search}`);
      }
    } catch {
      // Ignore malformed markup references instead of broadening the cache.
    }
  }

  return [...dependencies];
}

async function fetchPublicResource(path) {
  const request = new Request(path, {
    credentials: "omit",
    cache: "reload",
  });
  const response = await fetch(request);
  if (!canStore(response)) throw new Error(`Public shell resource was not cacheable: ${path}`);
  return { request, response };
}

async function refreshRootShell() {
  const rootResource = await fetchPublicResource(ROOT_SHELL_URL);
  const html = await rootResource.response.clone().text();
  const dependencyPaths = nextStaticDependencies(html);
  const dependencies = await Promise.all(dependencyPaths.map(fetchPublicResource));
  const cache = await caches.open(STATIC_CACHE);

  // Store the shell last. If any dependency failed above, the previous complete
  // shell remains usable and the current online navigation is unaffected.
  for (const dependency of dependencies) {
    await cache.delete(dependency.request);
    await cache.put(dependency.request, dependency.response);
  }
  await cache.delete(rootResource.request);
  await cache.put(rootResource.request, rootResource.response);
  await trimCache(cache, STATIC_CACHE_MAX_ENTRIES, PROTECTED_STATIC_PATHS);
}

async function navigationWithFallback(networkResponse, isRoot) {
  try {
    return await networkResponse;
  } catch {
    const cache = await caches.open(STATIC_CACHE);
    if (isRoot) {
      const shell = await cache.match(ROOT_SHELL_URL);
      if (shell) return shell;
    }

    const offlinePage = await cache.match("/offline.html");
    if (offlinePage) return offlinePage;

    return new Response("Vidya is offline. Check your connection and try again.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}

function cacheVersionFromName(cacheName) {
  const match = cacheName.match(/^vidya-public-(?:static|learning|update)-(.+)$/);
  return match?.[1] ?? null;
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const previousVersion = [...new Set(cacheNames.map(cacheVersionFromName).filter(Boolean))]
    .filter((version) => version !== CACHE_VERSION)
    .sort()
    .reverse()[0];
  const keptVersions = new Set([CACHE_VERSION, previousVersion].filter(Boolean));

  await Promise.all(
    cacheNames
      .filter((cacheName) => {
        const version = cacheVersionFromName(cacheName);
        return version && !keptVersions.has(version);
      })
      .map((cacheName) => caches.delete(cacheName)),
  );
}

function validUpdateId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,128}$/.test(value);
}

async function notifyClientBeforeUpdate(client, updateId) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      channel.port1.close();
      resolve(false);
    }, UPDATE_ACK_TIMEOUT_MS);

    channel.port1.onmessage = (event) => {
      if (event.data?.type !== UPDATE_MESSAGES.ready || event.data?.updateId !== updateId) return;
      clearTimeout(timeout);
      channel.port1.close();
      resolve(true);
    };

    client.postMessage(
      { type: UPDATE_MESSAGES.prepare, updateId },
      [channel.port2],
    );
  });
}

async function broadcastUpdateFailure(updateId) {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach((client) => client.postMessage({ type: UPDATE_MESSAGES.failed, updateId }));
}

async function requestUpdateActivation(updateId) {
  const windowClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const acknowledgements = await Promise.all(
    windowClients.map((client) => notifyClientBeforeUpdate(client, updateId)),
  );
  const forceNavigateClientIds = windowClients
    .filter((_, index) => !acknowledgements[index])
    .map((client) => client.id);

  const marker = new Response(JSON.stringify({ updateId, forceNavigateClientIds }), {
    headers: { "content-type": "application/json" },
  });
  const updateCache = await caches.open(UPDATE_CACHE);
  await updateCache.put(UPDATE_MARKER_URL, marker);
  await self.skipWaiting();
}

async function readUpdateMarker() {
  const updateCache = await caches.open(UPDATE_CACHE);
  const marker = await updateCache.match(UPDATE_MARKER_URL);
  if (!marker) return null;

  try {
    const value = await marker.json();
    if (!validUpdateId(value?.updateId) || !Array.isArray(value?.forceNavigateClientIds)) return null;
    return {
      updateId: value.updateId,
      forceNavigateClientIds: value.forceNavigateClientIds.filter((id) => typeof id === "string"),
    };
  } catch {
    return null;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // These assets are the guaranteed fallback. A partial required precache is
    // not accepted as an installed worker.
    await cache.addAll(REQUIRED_PRECACHE);
    await trimCache(cache, STATIC_CACHE_MAX_ENTRIES, PROTECTED_STATIC_PATHS);

    // The richer app shell is optional. Online use and the guaranteed offline
    // page remain available when this credential-free refresh cannot complete.
    try {
      await refreshRootShell();
    } catch {
      // Keep installation successful after the required fallback is complete.
    }
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const updateMarker = await readUpdateMarker();
    await cleanupOldCaches();
    await self.clients.claim();

    if (!updateMarker) return;

    const updateCache = await caches.open(UPDATE_CACHE);
    await updateCache.delete(UPDATE_MARKER_URL);
    const forceNavigate = new Set(updateMarker.forceNavigateClientIds);
    if (!forceNavigate.size) return;

    const windowClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.allSettled(
      windowClients
        .filter((client) => forceNavigate.has(client.id))
        .map((client) => client.navigate(client.url)),
    );
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== UPDATE_MESSAGES.activate || !validUpdateId(event.data?.updateId)) return;

  event.waitUntil(
    requestUpdateActivation(event.data.updateId).catch(async () => {
      await broadcastUpdateFailure(event.data.updateId);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const strategy = strategyForRequest(request);
  if (strategy === "bypass") return;

  if (strategy === "root-navigation" || strategy === "navigation") {
    const networkResponse = fetch(request);
    event.respondWith(navigationWithFallback(networkResponse, strategy === "root-navigation"));

    if (strategy === "root-navigation") {
      event.waitUntil(
        networkResponse
          .then((response) => response.ok ? refreshRootShell() : undefined)
          .catch(() => undefined),
      );
    }
    return;
  }

  if (strategy === "static") {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (strategy === "learning") {
    event.respondWith(networkFirst(request));
  }
});

// The worker has no module boundary. Exposing pure policy helpers here lets the
// Node test harness exercise the exact code that ships instead of a copy.
self.__VIDYA_SW_TEST__ = Object.freeze({
  CACHE_VERSION,
  STATIC_CACHE,
  LEARNING_CACHE,
  UPDATE_CACHE,
  UPDATE_MARKER_URL,
  STATIC_CACHE_MAX_ENTRIES,
  LEARNING_CACHE_MAX_ENTRIES,
  UPDATE_MESSAGES,
  strategyForRequest,
  trimCache,
  navigationWithFallback,
  nextStaticDependencies,
  requestUpdateActivation,
  readUpdateMarker,
  cacheVersionFromName,
});
