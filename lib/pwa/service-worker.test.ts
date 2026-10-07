import { readFileSync } from "node:fs";
import { MessageChannel } from "node:worker_threads";
import vm from "node:vm";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ORIGIN = "https://vidyagyan.study";
const workerSource = readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8");

function cacheKey(value: string | Request): string {
  const raw = typeof value === "string" ? value : value.url;
  return new URL(raw, ORIGIN).href;
}

class MemoryCache {
  entries = new Map<string, Response>();

  async match(value: string | Request) {
    return this.entries.get(cacheKey(value))?.clone();
  }

  async put(value: string | Request, response: Response) {
    if (response.status === 206) throw new TypeError("Cache Storage cannot store partial responses");
    this.entries.set(cacheKey(value), response.clone());
  }

  async delete(value: string | Request) {
    return this.entries.delete(cacheKey(value));
  }

  async keys() {
    return [...this.entries.keys()].map((url) => new Request(url));
  }

  async addAll() {
    throw new Error("addAll is not used by these policy tests");
  }
}

class MemoryCaches {
  stores = new Map<string, MemoryCache>();

  async open(name: string) {
    if (!this.stores.has(name)) this.stores.set(name, new MemoryCache());
    return this.stores.get(name)!;
  }

  async keys() {
    return [...this.stores.keys()];
  }

  async delete(name: string) {
    return this.stores.delete(name);
  }
}

type FakeClient = {
  id: string;
  url: string;
  postMessage: ReturnType<typeof vi.fn>;
  navigate: ReturnType<typeof vi.fn>;
};

function client(id: string, acknowledge = true): FakeClient {
  return {
    id,
    url: `${ORIGIN}/`,
    navigate: vi.fn(async () => undefined),
    postMessage: vi.fn((message: { type: string; updateId: string }, ports?: MessagePort[]) => {
      if (!acknowledge || !ports?.[0]) return;
      ports[0].postMessage({ type: "VIDYA_UPDATE_READY", updateId: message.updateId });
      ports[0].close();
    }),
  };
}

function workerHarness(windowClients: FakeClient[] = [], fetchResource = vi.fn(), compatibilityRelease = false) {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  const caches = new MemoryCaches();
  const claim = vi.fn(async () => undefined);
  const skipWaiting = vi.fn(async () => undefined);
  const showNotification = vi.fn(async () => undefined);
  const openWindow = vi.fn(async () => undefined);
  const self = {
    location: { origin: ORIGIN },
    registration: { showNotification },
    clients: {
      claim,
      matchAll: vi.fn(async () => windowClients),
      openWindow,
    },
    skipWaiting,
    addEventListener: (type: string, listener: (event: Record<string, unknown>) => void) => {
      listeners.set(type, listener);
    },
    __VIDYA_SW_TEST__: undefined as unknown,
  };

  const source = compatibilityRelease ? workerSource.replace(/const CACHE_VERSION = "[^"]+";/, 'const CACHE_VERSION = "2026-10-07-sync-1";') : workerSource;
  vm.runInNewContext(source, {
    self,
    caches,
    fetch: fetchResource,
    Request: class extends Request {
      constructor(input: string | Request, init?: RequestInit) {
        super(typeof input === "string" ? new URL(input, ORIGIN).href : input, init);
      }
    },
    Response,
    URL,
    MessageChannel,
    setTimeout,
    clearTimeout,
    Set,
    Promise,
    JSON,
    Error,
  });

  return {
    listeners,
    caches,
    clients: windowClients,
    claim,
    skipWaiting,
    showNotification,
    openWindow,
    policy: self.__VIDYA_SW_TEST__ as {
      STATIC_CACHE: string;
      LEARNING_CACHE: string;
      UPDATE_CACHE: string;
      UPDATE_MARKER_URL: string;
      UPDATE_MESSAGES: Record<string, string>;
      strategyForRequest: (request: { method: string; mode: string; url: string; headers: Headers }) => string;
      trimCache: (cache: MemoryCache, limit: number, protectedPaths?: Set<string>) => Promise<void>;
      navigationWithFallback: (network: Promise<Response>, root: boolean) => Promise<Response>;
      nextStaticDependencies: (html: string) => string[];
      readUpdateMarker: () => Promise<{ updateId: string; forceNavigateClientIds: string[] } | null>;
    },
  };
}

describe("private family push boundary", () => {
  it("ignores payload names, messages and URLs on the lock screen", async () => {
    const worker = workerHarness();
    let delivery: Promise<void> | undefined;
    const payload = vi.fn(() => ({ name: "Private child", body: "Private reflection", url: "https://evil.example" }));
    worker.listeners.get("push")!({ data: { json: payload }, waitUntil: (value: Promise<void>) => { delivery = value; } });
    await delivery;
    expect(payload).not.toHaveBeenCalled();
    expect(worker.showNotification).toHaveBeenCalledWith("A little time together", expect.objectContaining({ tag: "vidya-family-invitation" }));
    expect(JSON.stringify(worker.showNotification.mock.calls)).not.toContain("Private");
  });

  it("opens only the same-origin parent route, ignoring notification data", async () => {
    const worker = workerHarness([client("child")]);
    let delivery: Promise<void> | undefined;
    const close = vi.fn();
    worker.listeners.get("notificationclick")!({ notification: { close, data: { url: "https://evil.example" } }, waitUntil: (value: Promise<void>) => { delivery = value; } });
    await delivery;
    expect(close).toHaveBeenCalledOnce();
    expect(worker.openWindow).toHaveBeenCalledWith(`${ORIGIN}/parent`);
    expect(worker.clients[0].navigate).not.toHaveBeenCalled();
  });
});

describe("required account compatibility update", () => {
  beforeEach(() => {
    vi.spyOn(MemoryCache.prototype, "addAll").mockResolvedValue(undefined);
  });

  it("preserves the account compatibility release activation after complete public precache", async () => {
    const fetchResource = vi.fn(async (request: Request) => {
      expect(request.credentials).toBe("omit");
      const response = new Response(request.url.endsWith("/") ? '<script src="/_next/static/current.js"></script>' : "current JS");
      Object.defineProperty(response, "type", { value: "basic" });
      return response;
    });
    const { listeners, caches, policy, skipWaiting } = workerHarness([], fetchResource, true);
    let work: Promise<void> | undefined;
    listeners.get("install")!({ waitUntil: (promise: Promise<void>) => { work = promise; } });
    await work;
    expect(fetchResource).toHaveBeenCalledTimes(2);
    expect(await (await caches.open(policy.STATIC_CACHE)).match("/")).toBeDefined();
    expect(skipWaiting).toHaveBeenCalledOnce();
    expect((await policy.readUpdateMarker())?.updateId).toBe("required-2026-10-07-sync-1");
  });

  it("installs a visual update without interrupting an in-progress activity", async () => {
    const fetchResource = vi.fn(async () => {
      const response = new Response("<html>Public shell</html>");
      Object.defineProperty(response, "type", { value: "basic" });
      return response;
    });
    const { listeners, policy, skipWaiting } = workerHarness([], fetchResource);
    let work: Promise<void> | undefined;
    listeners.get("install")!({ waitUntil: (promise: Promise<void>) => { work = promise; } });
    await work;
    expect(skipWaiting).not.toHaveBeenCalled();
    expect(await policy.readUpdateMarker()).toBeNull();
  });

  it("keeps the old client when authentication or missing assets prevent a complete shell", async () => {
    const { listeners, skipWaiting, policy } = workerHarness([], vi.fn(async () => new Response("Private", { status: 302 })));
    let work: Promise<void> | undefined;
    listeners.get("install")!({ waitUntil: (promise: Promise<void>) => { work = promise; } });
    await work;
    expect(skipWaiting).not.toHaveBeenCalled();
    expect(await policy.readUpdateMarker()).toBeNull();
  });
});

describe("service worker route privacy", () => {
  it("never intercepts parent, authentication, API, mutation, or cross-origin requests", () => {
    const { policy } = workerHarness();
    const strategy = (url: string, mode = "navigate", method = "GET") => policy.strategyForRequest({ url, mode, method, headers: new Headers() });

    expect(strategy(`${ORIGIN}/parent`)).toBe("bypass");
    expect(strategy(`${ORIGIN}/parent/reports`)).toBe("bypass");
    expect(strategy(`${ORIGIN}/sign-in`)).toBe("bypass");
    expect(strategy(`${ORIGIN}/sign-up/factor-one`)).toBe("bypass");
    expect(strategy(`${ORIGIN}/api/learner/state`, "cors")).toBe("bypass");
    expect(strategy(`${ORIGIN}/books/story.json`, "cors", "POST")).toBe("bypass");
    expect(strategy("https://accounts.example.com/session", "cors")).toBe("bypass");
  });

  it("allows only the public shell, static assets, and public learning resources", () => {
    const { policy } = workerHarness();
    const strategy = (path: string, mode: string) => policy.strategyForRequest({ url: `${ORIGIN}${path}`, mode, method: "GET", headers: new Headers() });

    expect(strategy("/", "navigate")).toBe("root-navigation");
    expect(strategy("/?learner=secret", "navigate")).toBe("navigation");
    expect(strategy("/about", "navigate")).toBe("navigation");
    expect(strategy("/_next/static/chunks/app.js", "cors")).toBe("static");
    expect(strategy("/books/story.json", "cors")).toBe("learning");
    expect(strategy("/field-trips/mars.webp", "no-cors")).toBe("learning");
  });
});

describe("offline root shell", () => {
  it("serves the cached root only for a failed root navigation", async () => {
    const { policy, caches } = workerHarness();
    const cache = await caches.open(policy.STATIC_CACHE);
    await cache.put("/", new Response("root shell"));
    await cache.put("/offline.html", new Response("generic offline"));

    const root = await policy.navigationWithFallback(Promise.reject(new Error("offline")), true);
    const other = await policy.navigationWithFallback(Promise.reject(new Error("offline")), false);

    expect(await root.text()).toBe("root shell");
    expect(await other.text()).toBe("generic offline");
  });

  it("extracts only same-origin Next static dependencies", () => {
    const { policy } = workerHarness();
    const html = [
      '<script src="/_next/static/chunks/app.js"></script>',
      '<link href="/_next/static/css/app.css" rel="stylesheet">',
      '<script src="https://tracker.example.com/track.js"></script>',
      '<a href="/parent">Parent</a>',
    ].join("");

    expect(policy.nextStaticDependencies(html)).toEqual([
      "/_next/static/chunks/app.js",
      "/_next/static/css/app.css",
    ]);
  });
});

describe("cache bounds", () => {
  it("removes oldest runtime entries while keeping required shell assets", async () => {
    const { policy } = workerHarness();
    const cache = new MemoryCache();
    await cache.put("/offline.html", new Response("offline"));
    await cache.put("/_next/static/old-a.js", new Response("a"));
    await cache.put("/_next/static/old-b.js", new Response("b"));
    await cache.put("/_next/static/current.js", new Response("current"));

    await policy.trimCache(cache, 2, new Set(["/offline.html"]));

    expect(await cache.match("/offline.html")).toBeDefined();
    expect(await cache.match("/_next/static/old-a.js")).toBeUndefined();
    expect(await cache.match("/_next/static/old-b.js")).toBeUndefined();
    expect(await cache.match("/_next/static/current.js")).toBeDefined();
  });
});

describe("cross-tab update protocol", () => {
  beforeEach(() => vi.useRealTimers());

  it("prepares every open tab, records acknowledgements, and then activates", async () => {
    const first = client("first");
    const second = client("second");
    const { listeners, policy, skipWaiting } = workerHarness([first, second]);
    const updateId = "update_20260816";
    let work: Promise<void> | undefined;

    listeners.get("message")?.({
      data: { type: policy.UPDATE_MESSAGES.activate, updateId },
      waitUntil: (promise: Promise<void>) => { work = promise; },
    });
    await work;

    expect(first.postMessage.mock.calls[0][0]).toEqual({
      type: policy.UPDATE_MESSAGES.prepare,
      updateId,
    });
    expect(first.postMessage.mock.calls[0][1]).toHaveLength(1);
    expect(second.postMessage).toHaveBeenCalledTimes(1);
    expect(skipWaiting).toHaveBeenCalledTimes(1);
    await expect(policy.readUpdateMarker()).resolves.toEqual({ updateId, forceNavigateClientIds: [] });
  });

  it("does not navigate or reload clients on first activation", async () => {
    const first = client("first");
    const { listeners, claim } = workerHarness([first]);
    let work: Promise<void> | undefined;

    listeners.get("activate")?.({
      waitUntil: (promise: Promise<void>) => { work = promise; },
    });
    await work;

    expect(claim).toHaveBeenCalledTimes(1);
    expect(first.navigate).not.toHaveBeenCalled();
  });

  it("force-navigates only a tab that could not acknowledge the accepted update", async () => {
    const responsive = client("responsive");
    const sleeping = client("sleeping", false);
    const { listeners, caches, policy } = workerHarness([responsive, sleeping]);
    const updateCache = await caches.open(policy.UPDATE_CACHE);
    await updateCache.put(policy.UPDATE_MARKER_URL, new Response(JSON.stringify({
      updateId: "update_force_1",
      forceNavigateClientIds: ["sleeping"],
    })));
    let work: Promise<void> | undefined;

    listeners.get("activate")?.({
      waitUntil: (promise: Promise<void>) => { work = promise; },
    });
    await work;

    expect(responsive.navigate).not.toHaveBeenCalled();
    expect(sleeping.navigate).toHaveBeenCalledWith(`${ORIGIN}/`);
  });
});


describe("public resource delivery", () => {
  it("leaves browser video byte-range requests on the network path", () => {
    const { policy, listeners } = workerHarness();
    const request = new Request(`${ORIGIN}/learning/vidya-welcome.webm`, { headers: { Range: "bytes=0-1023" } });
    expect(policy.strategyForRequest(request)).toBe("bypass");
    const respondWith = vi.fn();
    listeners.get("fetch")!({ request, respondWith });
    expect(respondWith).not.toHaveBeenCalled();
  });

  it("returns a successful partial response without trying to cache it", async () => {
    const response = new Response("video bytes", { status: 206, headers: { "content-range": "bytes 0-10/20" } });
    Object.defineProperty(response, "type", { value: "basic" });
    const fetchResource = vi.fn(async () => response);
    const { listeners, caches } = workerHarness([], fetchResource);
    const put = vi.spyOn(MemoryCache.prototype, "put");
    let delivery: Promise<Response> | undefined;
    listeners.get("fetch")!({ request: new Request(`${ORIGIN}/learning/vidya-welcome.webm`), respondWith: (value: Promise<Response>) => { delivery = value; } });
    expect((await delivery)?.status).toBe(206);
    expect(await (await delivery)!.text()).toBe("video bytes");
    expect(put).not.toHaveBeenCalled();
    expect([...caches.stores.values()].every(cache => cache.entries.size === 0)).toBe(true);
    put.mockRestore();
  });

  it.each(["/learning/vidya-welcome.svg", "/_next/static/app.js"])("keeps %s usable when cache writes fail", async (path) => {
    const response = new Response("available online");
    Object.defineProperty(response, "type", { value: "basic" });
    const { listeners } = workerHarness([], vi.fn(async () => response));
    const put = vi.spyOn(MemoryCache.prototype, "put").mockRejectedValue(new Error("Storage quota exceeded"));
    let delivery: Promise<Response> | undefined;
    listeners.get("fetch")!({ request: new Request(`${ORIGIN}${path}`), respondWith: (value: Promise<Response>) => { delivery = value; } });
    expect(await (await delivery)!.text()).toBe("available online");
    put.mockRestore();
  });
});


it("retains the previous offline copy when a learning cache replacement fails", async () => {
  const response = new Response("new online copy");
  Object.defineProperty(response, "type", { value: "basic" });
  const { listeners, caches, policy } = workerHarness([], vi.fn(async () => response));
  const cache = await caches.open(policy.LEARNING_CACHE);
  const request = new Request(`${ORIGIN}/books/story.json`);
  await cache.put(request, new Response("previous offline copy"));
  const put = vi.spyOn(MemoryCache.prototype, "put").mockRejectedValue(new Error("Storage quota exceeded"));
  let delivery: Promise<Response> | undefined;
  listeners.get("fetch")!({ request, respondWith: (value: Promise<Response>) => { delivery = value; } });
  expect(await (await delivery)!.text()).toBe("new online copy");
  expect(await (await cache.match(request))!.text()).toBe("previous offline copy");
  put.mockRestore();
});
