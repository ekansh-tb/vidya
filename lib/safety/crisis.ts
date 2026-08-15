// Crisis detection for text a child types into Vidya.
//
// WHY THIS EXISTS
// ---------------
// Before this file, the entire safety posture for a 10-year-old confiding in an
// AI teacher was one line of system prompt: "If a question is off-topic or
// unsafe, redirect gently to learning." A child typing "i want to kill myself"
// into Miss Vidya got a cheerful pivot back to fractions — or, once
// ENFORCE_TUTOR_RUNG shipped, a 403 saying the room wasn't open for them.
// That is the single worst thing this product could do.
//
// WHAT THIS IS
//   A deterministic, offline, first-person-intent matcher. It runs before any
//   model call, so a disclosure is answered even when the tutor is switched
//   off, unlinked, rate-limited, or has no API credentials.
//
// WHAT THIS IS NOT — read before trusting it
//   It is NOT a safety system and it is NOT a classifier. It is a floor. A
//   regex list will miss a child who says it sideways ("i don't want to wake up
//   tomorrow"), miss every language it has no patterns for, and occasionally
//   fire on homework. Every one of those failure modes is acceptable ONLY
//   because the alternative it replaces is nothing at all. Treat the pattern
//   list as something to keep extending, and never as coverage.
//
// DESIGN RULES
//   1. First-person intent, not keywords. "Hitler committed suicide" and
//      "open dissent was suicidal" are IGCSE History (see
//      lib/content/packs/igcse-history.ts) and must never fire. A bare-keyword
//      matcher on this curriculum would cry wolf several times a lesson, and a
//      safety alert that cries wolf gets ignored by the parent it is for.
//   2. Two tiers with different consequences, because false positives are not
//      free. `self_harm` / `harm_from_others` interrupt and notify a parent.
//      `despair` does neither — it only softens the tutor's reply. That way
//      "i'm useless at fractions" gets kindness without dragging an adult in.
//   3. Bias toward the child on the high tier. If we are unsure whether a
//      disclosure is real, we answer as if it is. A wrongly-comforted child is
//      a smaller harm than an ignored one.

export type CrisisCategory = "self_harm" | "harm_from_others" | "despair";

export type CrisisSignal = {
  category: CrisisCategory;
  /** Which pattern fired. Recorded so the list can be tuned against reality. */
  cue: string;
  /** Devanagari input gets a Devanagari reply — see supportMessage. */
  script: "latin" | "devanagari";
};

/** Only these two reach a parent. `despair` deliberately does not. */
export const ESCALATING: readonly CrisisCategory[] = ["self_harm", "harm_from_others"];

export function escalates(category: CrisisCategory): boolean {
  return ESCALATING.includes(category);
}

type Pattern = { cue: string; category: CrisisCategory; re: RegExp };

// ---------------------------------------------------------------- patterns

/** "i am" / "i'm" / "im" — children type all three, often in one sentence. */
const I_AM = String.raw`(?:i'?m|i\s+am)`;

/**
 * English. Every entry is anchored on a first-person subject or on "me" as the
 * object, which is what separates a disclosure from a comprehension question.
 */
const EN: Pattern[] = [
  // ---- self-harm: explicit intent -------------------------------------
  { cue: "kill-myself", category: "self_harm", re: /\bkill(ing)?\s+my\s?self\b/ },
  { cue: "want-to-die", category: "self_harm", re: /\bi\s+(want|wanna|wish)\b[^.?!]{0,14}\b(to\s+)?(die|be\s+dead)\b/ },
  { cue: "wish-i-were-dead", category: "self_harm", re: /\bi\s+wish\s+i\s+(was|were)\s+(dead|never\s+born)\b/ },
  { cue: "end-my-life", category: "self_harm", re: /\bend\s+(my\s+life|it\s+all)\b/ },
  { cue: "dont-want-to-live", category: "self_harm", re: /\bi\s+(don'?t|do\s+not|dont)\s+want\s+to\s+(live|be\s+alive|exist|wake\s+up)\b/ },
  { cue: "better-off-dead", category: "self_harm", re: /\b(better\s+off\s+dead|no\s+(point|reason)\s+in\s+living)\b/ },
  // "suicidal" must be tied to a first person to clear the History syllabus.
  { cue: "first-person-suicide", category: "self_harm", re: /\b(i|i'?m|im|i\s+am|me)\b[^.?!]{0,30}\bsuicid(e|al)\b/ },
  { cue: "thinking-about-suicide", category: "self_harm", re: /\bthinking\s+(about|of)\s+suicide\b/ },
  { cue: "self-injury", category: "self_harm", re: /\b(cut|cutting|cuts|hurt|hurting|harm|harming|burn|burning)\s+my\s?self\b/ },

  // ---- harm from others ------------------------------------------------
  // A named person plus a violent or sexual verb acting on "me".
  {
    cue: "someone-hurts-me",
    category: "harm_from_others",
    re: /\b(someone|somebody|he|she|they|dad|papa|pappa|father|mum|mom|mummy|mother|uncle|aunty|aunt|bhaiya|didi|teacher|sir|ma'?am|coach|cousin|brother|sister|stepdad|stepfather|driver|neighbour|neighbor)\b[^.?!]{0,24}\b(hits?|hitting|beats?|beating|slaps?|slapped|punch(es|ed)?|kicks?|kicked|hurts?|hurting|touch(es|ed|ing)?|grabs?|grabbed)\s+me\b/,
  },
  // Unqualified, because for a child this needs no corroborating subject.
  { cue: "touched-me", category: "harm_from_others", re: /\b(touched|touching)\s+me\b[^.?!]{0,30}\b(there|private|badly|wrong|secret)\b|\bbad\s+touch\b/ },
  { cue: "bullied", category: "harm_from_others", re: new RegExp(String.raw`\b(bully|bullies|bullying|bullied)\s+me\b|\b${I_AM}\s+(being\s+)?bullied\b`) },
  { cue: "scared-to-go-home", category: "harm_from_others", re: /\b(scared|afraid|frightened|terrified)\s+to\s+go\s+home\b/ },
  { cue: "not-safe", category: "harm_from_others", re: new RegExp(String.raw`\b${I_AM}\s+not\s+safe\b`) },

  // ---- despair: softens the reply, tells nobody ------------------------
  { cue: "hate-myself", category: "despair", re: /\bi\s+hate\s+(my\s?self|my\s+life|me)\b/ },
  { cue: "worthless", category: "despair", re: new RegExp(String.raw`\b${I_AM}\s+(a\s+)?(worthless|useless|hopeless|failure|not\s+good\s+enough)\b`) },
  { cue: "nobody-cares", category: "despair", re: /\b(nobody|no\s+one|noone)\s+(loves|likes|cares\s+about|wants)\s+me\b/ },
  { cue: "always-alone", category: "despair", re: new RegExp(String.raw`\b${I_AM}\s+always\s+(alone|lonely)\b`) },
  { cue: "cant-do-anything", category: "despair", re: /\bi\s+can'?t\s+do\s+anything\s+right\b/ },
  { cue: "give-up", category: "despair", re: /\bi\s+want\s+to\s+give\s+up\s+on\s+everything\b/ },
];

/**
 * Hindi / Marathi (Devanagari). Deliberately a SHORT, confident set rather than
 * a broad sloppy one — a mistranslated pattern either never fires or fires on
 * innocent text, and both are worse than an honest gap. This wants a native
 * speaker to extend it; the tests are the place to add cases.
 */
const DEVA: Pattern[] = [
  { cue: "hi-want-to-die", category: "self_harm", re: /मरना\s*चाह(ता|ती)/ },
  { cue: "hi-i-should-die", category: "self_harm", re: /म(ु|ू)झे\s*मरना\s*ह(ै|ो)/ },
  { cue: "hi-suicide", category: "self_harm", re: /आत्महत्या/ },
  { cue: "hi-dont-want-to-live", category: "self_harm", re: /जीना\s*नहीं\s*चाह(ता|ती)/ },
  { cue: "mr-want-to-die", category: "self_harm", re: /मरायच(ं|े)\s*आहे/ },
  // Hindi and Marathi put the subject between the object and the verb freely
  // ("मुझे पापा मारते हैं" / "मला बाबा मारतो"), so allow a short gap.
  { cue: "hi-hits-me", category: "harm_from_others", re: /म(ु|ू)झे[^।.?!]{0,20}(मारता|मारते|मारती|मारतात)/ },
  { cue: "mr-hits-me", category: "harm_from_others", re: /मला[^।.?!]{0,20}मार(तो|ते|तात)/ },
  { cue: "hi-nobody-loves-me", category: "despair", re: /कोई\s*(भी\s*)?प्यार\s*नहीं\s*करता/ },
];

/**
 * Markers that a message is about a text, a source or an exam answer rather
 * than about the child. Used narrowly — see shouldSuppress.
 */
const ACADEMIC =
  /\b(poem|poet|novel|chapter|character|narrator|author|writer|essay|paragraph|comprehension|extract|passage|stanza|act\s+\d|scene\s+\d|mark\s+scheme|marks?\]|romeo|juliet|hamlet|macbeth|ophelia|shakespeare|hitler|goebbels|caesar|question\s+\d)\b/;

/** Spans covered by quotation marks — "…", '…', “…”, ‘…’. */
function quotedSpans(text: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  const pairs: Array<[string, string]> = [
    ['"', '"'],
    ["“", "”"],
    ["‘", "’"],
    ["'", "'"],
  ];
  for (const [open, close] of pairs) {
    let from = 0;
    for (;;) {
      const start = text.indexOf(open, from);
      if (start === -1) break;
      const end = text.indexOf(close, start + 1);
      if (end === -1) break;
      spans.push([start, end]);
      from = end + 1;
    }
  }
  return spans;
}

/**
 * The ONLY suppression rule: the phrase sits inside quotation marks AND the
 * message carries academic markers. Both conditions, because either alone is
 * far too eager — a child absolutely may write 'i want to die' with an
 * apostrophe elsewhere in the sentence, and a child absolutely may disclose
 * while doing English homework.
 */
function shouldSuppress(text: string, index: number): boolean {
  if (!ACADEMIC.test(text)) return false;
  return quotedSpans(text).some(([a, b]) => index > a && index < b);
}

/** Lowercase, collapse whitespace. Apostrophes and Devanagari are preserved. */
function normalise(text: string): string {
  return text.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
}

const DEVANAGARI = /[ऀ-ॿ]/;

/**
 * Scans one message. Returns the highest-consequence match, or null.
 *
 * Order matters: self_harm outranks harm_from_others outranks despair, so a
 * message containing both gets the response the more serious one needs.
 */
export function detectCrisis(raw: string): CrisisSignal | null {
  if (!raw || typeof raw !== "string") return null;
  const text = normalise(raw);
  if (text.length === 0) return null;

  const script: CrisisSignal["script"] = DEVANAGARI.test(raw) ? "devanagari" : "latin";
  const candidates = [...DEVA, ...EN];

  const rank: Record<CrisisCategory, number> = { self_harm: 0, harm_from_others: 1, despair: 2 };
  let best: CrisisSignal | null = null;

  for (const p of candidates) {
    const m = p.re.exec(text);
    if (!m) continue;
    if (shouldSuppress(text, m.index)) continue;
    if (best && rank[p.category] >= rank[best.category]) continue;
    best = { category: p.category, cue: p.cue, script };
    if (p.category === "self_harm") break; // nothing outranks this
  }

  return best;
}

/**
 * Scans a conversation, newest message first, and returns the first hit.
 *
 * Only the child's OWN most recent turns are read — never the assistant's, and
 * never so far back that yesterday's homework about Macbeth resurfaces as an
 * alert. Three turns is enough to catch "i need help" → "with what?" → the
 * disclosure.
 */
export function detectCrisisInMessages(
  messages: Array<{ role: string; content?: string; parts?: Array<{ type?: string; text?: string }> }>,
  lookback = 3,
): { signal: CrisisSignal; text: string } | null {
  const userTexts: string[] = [];
  for (let i = messages.length - 1; i >= 0 && userTexts.length < lookback; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const parts = (m.parts ?? [])
      .filter((p) => typeof p.text === "string")
      .map((p) => p.text as string);
    const joined = [typeof m.content === "string" ? m.content : "", ...parts]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (joined) userTexts.push(joined);
  }

  for (const text of userTexts) {
    const signal = detectCrisis(text);
    if (signal) return { signal, text };
  }
  return null;
}

// ---------------------------------------------------------------- responses

/** Real, free, 24×7 Indian helplines. Verified numbers — do not paraphrase. */
export const HELPLINES = {
  childline: "1098",
  teleManas: "14416",
  emergency: "112",
} as const;

const EN_SELF_HARM = `I'm really glad you told me. What you're feeling matters, and you don't have to carry it on your own.

Please tell a grown-up you trust today — a parent, an older brother or sister, a teacher, anyone who feels safe. If it's hard to say out loud, you can show them this message instead.

You can also talk to someone right now. It's free, any time of day:
• **Childline — call ${HELPLINES.childline}** (for children, in many languages)
• **Tele-MANAS — call ${HELPLINES.teleManas}** (someone kind to talk to)

I'll be right here when you want to come back to schoolwork. But for this, a real person who cares about you is much better than me.`;

const EN_HARM_FROM_OTHERS = `Thank you for telling me. What you've described is not okay, and it is not your fault.

Please tell a grown-up you trust — if you can, someone outside the situation: a teacher, your school counsellor, or a relative you feel safe with. You are allowed to tell.

You can also call for help yourself, free, any time:
• **Childline — call ${HELPLINES.childline}** (for children, in many languages)
• **Tele-MANAS — call ${HELPLINES.teleManas}**
• If you are in danger right now, **call ${HELPLINES.emergency}**

You did the right thing by saying something.`;

const HI_SELF_HARM = `तुमने मुझे बताया, यह बहुत अच्छा किया। तुम जो महसूस कर रहे हो वह मायने रखता है, और तुम्हें इसे अकेले नहीं सहना है।

आज किसी बड़े पर भरोसा करके बात करो — माता-पिता, बड़े भाई-बहन, या कोई शिक्षक। अगर कहना मुश्किल लगे, तो उन्हें यह संदेश दिखा दो।

तुम अभी, किसी भी समय, मुफ़्त में बात कर सकते हो:
• **चाइल्डलाइन — ${HELPLINES.childline}** पर कॉल करो
• **टेली-मानस — ${HELPLINES.teleManas}** पर कॉल करो

पढ़ाई के लिए मैं यहीं हूँ, जब तुम तैयार हो। लेकिन इस बात के लिए, तुमसे प्यार करने वाला कोई असली इंसान मुझसे बहुत बेहतर है।`;

const HI_HARM_FROM_OTHERS = `मुझे बताने के लिए धन्यवाद। जो तुमने बताया वह ठीक नहीं है, और इसमें तुम्हारी कोई गलती नहीं है।

किसी बड़े को बताओ जिस पर तुम भरोसा करते हो — अगर हो सके तो कोई ऐसा जो इस सब से बाहर हो: शिक्षक, स्कूल काउंसलर, या कोई रिश्तेदार जिसके साथ तुम सुरक्षित महसूस करते हो। बताना तुम्हारा हक़ है।

तुम खुद भी मदद के लिए कॉल कर सकते हो, मुफ़्त, किसी भी समय:
• **चाइल्डलाइन — ${HELPLINES.childline}**
• **टेली-मानस — ${HELPLINES.teleManas}**
• अगर तुम इस समय ख़तरे में हो, तो **${HELPLINES.emergency}** पर कॉल करो

कुछ कहकर तुमने बिलकुल सही किया।`;

/**
 * The words a child actually reads. Static and deterministic on purpose: this
 * is the one reply in Vidya that must never be improvised by a model, must
 * never vary, and must work with no network and no API key.
 */
export function supportMessage(signal: CrisisSignal): string {
  const hindi = signal.script === "devanagari";
  if (signal.category === "harm_from_others") {
    return hindi ? HI_HARM_FROM_OTHERS : EN_HARM_FROM_OTHERS;
  }
  return hindi ? HI_SELF_HARM : EN_SELF_HARM;
}

/**
 * Extra system-prompt guidance for the `despair` tier, which does NOT interrupt
 * and does NOT notify. Miss Vidya still answers the question — she just leads
 * with the person rather than the topic.
 */
export const DESPAIR_PROMPT_HINT = `IMPORTANT: this learner just said something self-critical or low. Before anything academic, acknowledge the feeling in one warm sentence and separate their worth from their marks. Then answer the question normally, a little more gently and in smaller steps. Do NOT diagnose, do NOT mention counselling or helplines, do NOT make it a big moment, and do NOT say a grown-up has been told — nobody has been told. If they say anything about hurting themselves, stop teaching and tell them to talk to a trusted adult.`;

/** Capped, single-line excerpt for the parent's card and the audit row. */
export function excerptFor(text: string, max = 400): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1)}…`;
}
