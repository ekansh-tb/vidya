type Voice = Pick<SpeechSynthesisVoice, "name" | "lang" | "voiceURI" | "default">;

/** Prefer the learner's choice, then natural voices in the requested language. */
export function selectSpeechVoice<T extends Voice>(voices: T[], lang: string, preferredURI?: string): T | undefined {
  const locale = lang.toLowerCase().replaceAll("_", "-");
  const language = locale.split("-")[0];
  const candidates = voices.filter((voice) => voice.lang.toLowerCase().replaceAll("_", "-").split("-")[0] === language);
  const preferred = candidates.find((voice) => voice.voiceURI === preferredURI);
  if (preferred) return preferred;
  const score = (voice: T) =>
    (/natural|neural|enhanced|premium/i.test(voice.name) ? 100 : /google/i.test(voice.name) ? 50 : 0)
    + (voice.lang.toLowerCase().replaceAll("_", "-") === locale ? 20 : 0)
    + (voice.default ? 1 : 0);
  return candidates.sort((a, b) => score(b) - score(a))[0];
}
