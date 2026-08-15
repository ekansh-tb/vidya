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

function workerHarness(windowClients: FakeClient[] = []) {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  const caches = new MemoryCaches();
  const claim = vi.fn(async () => undefined);
  const skipWaiting = vi.fn(async () => undefined);
  const self = {
    location: { origin: ORIGIN },
    clients: {
      claim,
      matchAll: vi.fn(async () => windowClients),
    },
    skipWaiting,
    addEventListener: (type: string, listener: (event: Record<string, unknown>) => void) => {
      listeners.set(type, listener);
    },
    __VIDYA_SW_TEST__: undefined as unknown,
  };

  vm.runInNewContext(workerSource, {
    self,
    caches,
    fetch: vi.fn(),
    Request,
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
    policy: self.__VIDYA_SW_TEST__ as {
      STATIC_CACHE: string;
      UPDATE_CACHE: string;
      UPDATE_MARKER_URL: string;
      UPDATE_MESSAGES: Record<string, string>;
      strategyForRequest: (request: { method: string; mode: string; url: string }) => string;
      trimCache: (cache: MemoryCache, limit: number, protectedPaths?: Set<string>) => Promise<void>;
      navigationWithFallback: (network: Promise<Response>, root: boolean) => Promise<Response>;
      nextStaticDependencies: (html: string) => string[];
      readUpdateMarker: () => Promise<{ updateId: string; forceNavigateClientIds: string[] } | null>;
    },
  };
}

describe("service worker route privacy", () => {
  it("never intercepts parent, authentication, API, mutation, or cross-origin requests", () => {
    const { policy } = workerHarness();
    const strategy = (url: string, mode = "navigate", method = "GET") => policy.strategyForRequest({ url, mode, method });

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
    const strategy = (path: string, mode: string) => policy.strategyForRequest({ url: `${ORIGIN}${path}`, mode, method: "GET" });

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
