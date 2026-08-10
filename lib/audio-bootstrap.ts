"use client";

// Persisted audio settings, read straight from the profile archive.
//
// Why this exists: the audio engine and the speech engine both need the
// learner's saved preferences (SFX on/off, bus volumes, Miss Vidya's volume)
// at the moment they first make a sound — which is long before, and possibly
// instead of, the Settings screen ever mounting. Waiting for settings-view to
// push the values down would leave SFX audible for a learner who muted them
// and the voice at full volume for a learner who turned it down, for the whole
// session until they happen to open Settings.
//
// Reading through `storage.loadProfiles()` rather than re-parsing the raw key
// keeps the key name, the backup fallback and the corrupt-blob guards in one
// place.

import { storage } from "./storage";
import type { GameState } from "./types";

export type AudioSettings = GameState["settings"];

/**
 * The active learner's saved settings, or null when there is nothing readable
 * (SSR, first run, private mode, corrupt archive). Callers must fall back to
 * their own defaults.
 */
export function readPersistedAudioSettings(): AudioSettings | null {
  try {
    const profiles = storage.loadProfiles();
    if (!profiles) return null;
    // Optional chaining is deliberate: a half-written archive can satisfy
    // loadProfiles' structural check and still be missing `state`.
    const settings = profiles.learners[profiles.currentLearnerId]?.state?.settings;
    return settings ?? null;
  } catch {
    return null;
  }
}
