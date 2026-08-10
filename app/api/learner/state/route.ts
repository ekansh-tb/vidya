import { z } from "zod";
import { requireLearner } from "@/lib/auth/session";
import { dbConfigured } from "@/lib/db/client";
import { getLearnerState, pushLearnerState } from "@/lib/db/queries";
import { isSameOrigin, clientKey, rateLimit, rateHeaders } from "@/lib/api/guard";
import type { GameState } from "@/lib/types";

export const runtime = "nodejs";

const RATE = { limit: 120, windowMs: 10 * 60 * 1000 };

/** ~1MB ceiling. A GameState is a few KB; anything near this is abuse. */
const MAX_STATE_BYTES = 1_000_000;

const pushSchema = z.object({
  // The GameState shape is client-owned and changes constantly, so we validate
  // that it is an object and bound its size rather than mirroring every field
  // here — a strict mirror would break the app on every gameplay tweak.
  state: z.record(z.string(), z.unknown()),
  expectedRevision: z.number().int().min(0),
  deviceLabel: z.string().trim().max(60).optional(),
});

/** Pull this learner's server copy. Identity comes from the session. */
export async function GET(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const me = await requireLearner();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const envelope = await getLearnerState(me.learner.id);
  if (!envelope) return Response.json({ state: null, revision: 0 });
  return Response.json(envelope);
}

/**
 * Push local state up, with optimistic concurrency.
 *
 * A stale `expectedRevision` is refused and the server's copy returned, so two
 * devices cannot silently overwrite each other — that is how a kid loses an
 * evening's work. The client merges and retries.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!dbConfigured()) return Response.json({ error: "Storage unavailable" }, { status: 503 });

  const verdict = rateLimit(`state:${clientKey(req)}`, RATE);
  if (!verdict.ok) {
    return Response.json({ error: "Too many requests" }, {
      status: 429, headers: rateHeaders(verdict, RATE.limit),
    });
  }

  const me = await requireLearner();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let rawText: string;
  try { rawText = await req.text(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
  if (rawText.length > MAX_STATE_BYTES) {
    return Response.json({ error: "State too large" }, { status: 413 });
  }

  let raw: unknown;
  try { raw = JSON.parse(rawText); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const parsed = pushSchema.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const result = await pushLearnerState({
      learnerId: me.learner.id,
      state: parsed.data.state as unknown as GameState,
      expectedRevision: parsed.data.expectedRevision,
      deviceLabel: parsed.data.deviceLabel ?? null,
    });
    if (!result.ok) {
      return Response.json(
        { conflict: true, serverRevision: result.serverRevision, serverState: result.serverState },
        { status: 409 },
      );
    }
    return Response.json({ ok: true, revision: result.revision });
  } catch (e) {
    console.error("[api/learner/state] push failed:", e);
    return Response.json({ error: "Could not save right now" }, { status: 500 });
  }
}
