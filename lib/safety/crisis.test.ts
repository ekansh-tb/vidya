import { describe, it, expect } from "vitest";
import {
  detectCrisis,
  detectCrisisInMessages,
  supportMessage,
  escalates,
  excerptFor,
  HELPLINES,
} from "./crisis";

describe("detectCrisis — disclosures that must be caught", () => {
  const selfHarm = [
    "i want to kill myself",
    "I want to kill my self",
    "i want to die",
    "i wanna die",
    "i wish i was dead",
    "i wish i were dead",
    "sometimes i just want to end it all",
    "i want to end my life",
    "i don't want to live anymore",
    "i dont want to wake up tomorrow",
    "everyone would be better off dead without me",
    "i feel suicidal",
    "i think about suicide a lot",
    "i have been cutting myself",
    "i keep hurting myself",
  ];
  it.each(selfHarm)("self_harm: %s", (text) => {
    expect(detectCrisis(text)?.category).toBe("self_harm");
  });

  const harm = [
    "my dad hits me when he is angry",
    "papa beats me every day",
    "my uncle touched me there",
    "my teacher slapped me",
    "he grabbed me and i couldn't get away",
    "the boys bully me at school",
    "i am being bullied",
    "i am scared to go home",
    "i'm not safe",
  ];
  it.each(harm)("harm_from_others: %s", (text) => {
    expect(detectCrisis(text)?.category).toBe("harm_from_others");
  });

  const despair = [
    "i hate myself",
    "i hate my life",
    "i am useless",
    "i'm a failure",
    "nobody likes me",
    "no one cares about me",
    "i'm always alone",
    "i can't do anything right",
  ];
  it.each(despair)("despair: %s", (text) => {
    expect(detectCrisis(text)?.category).toBe("despair");
  });

  it("catches Devanagari disclosures", () => {
    expect(detectCrisis("मुझे मरना है")?.category).toBe("self_harm");
    expect(detectCrisis("मैं मरना चाहती हूँ")?.category).toBe("self_harm");
    expect(detectCrisis("मुझे जीना नहीं चाहता")?.category).toBe("self_harm");
    expect(detectCrisis("मला मरायचं आहे")?.category).toBe("self_harm");
    expect(detectCrisis("पापा मुझे मारते हैं")?.category).toBe("harm_from_others");
    expect(detectCrisis("मला बाबा मारतो")?.category).toBe("harm_from_others");
  });

  it("tags the script so the reply comes back in the same language", () => {
    expect(detectCrisis("मुझे मरना है")?.script).toBe("devanagari");
    expect(detectCrisis("i want to die")?.script).toBe("latin");
  });

  it("returns the most serious category when a message contains several", () => {
    const s = detectCrisis("i hate myself and i want to kill myself");
    expect(s?.category).toBe("self_harm");
  });
});

describe("detectCrisis — curriculum that must NOT fire", () => {
  // Verbatim and near-verbatim strings from lib/content/packs. A bare-keyword
  // matcher fires on every one of these, which is exactly why it can't be one:
  // an alert that goes off during History homework is an alert a parent learns
  // to ignore.
  const curriculum = [
    "open dissent was suicidal, precisely because the regime punished it",
    "Nagy was executed in June 1958",
    "About 3,000 Hungarians were killed and around 200,000 fled",
    "the Night of the Long Knives on 30 June 1934 showed that even senior Nazis such as Röhm were not safe",
    "the Scholls were executed in February 1943",
    "Explain why the death rate fell after 1945",
    "Never arrange to meet an online contact face to face",
    "Know how to block and report unwanted users",
    "Describe the events of the Cuban Missile Crisis in October 1962",
    "an American U-2 was shot down over Cuba at the height of the crisis",
    "white blood cells kill bacteria by phagocytosis",
    "the antibiotic kills the bacteria but not the virus",
    "Explain, in terms of energy, why this food chain does not continue",
    "How do I add 1/2 + 1/4?",
    "What is 25% of 80?",
    "Explain BODMAS in 2 lines",
    "मुझे गणित समझ नहीं आ रहा",
    "संज्ञा क्या है?",
    "Write a story where the hero has to give up something important",
    "i am going to die of boredom in this chapter",
    "my dad helps me with maths homework",
    "the poet says the tree gives me shade",
  ];
  it.each(curriculum)("no signal: %s", (text) => {
    expect(detectCrisis(text)).toBeNull();
  });

  it("suppresses a quoted phrase inside a clearly literary question", () => {
    expect(
      detectCrisis(`In the poem, the narrator says "i want to die" — what effect does this have on the reader?`),
    ).toBeNull();
  });

  it("still fires when the message is literary but the disclosure is not quoted", () => {
    // A child doing English homework is exactly as capable of disclosing as any
    // other child. Academic context alone must never buy silence.
    const s = detectCrisis(
      "i have to write an essay about the poem but honestly i want to kill myself",
    );
    expect(s?.category).toBe("self_harm");
  });

  it("ignores empty and non-string input", () => {
    expect(detectCrisis("")).toBeNull();
    expect(detectCrisis("   ")).toBeNull();
    // @ts-expect-error — guarding the runtime path, not the type
    expect(detectCrisis(null)).toBeNull();
  });
});

describe("escalation policy", () => {
  it("escalates self-harm and harm from others", () => {
    expect(escalates("self_harm")).toBe(true);
    expect(escalates("harm_from_others")).toBe(true);
  });

  it("does NOT escalate despair", () => {
    // "i'm useless at fractions" must not summon a parent. The tier exists so
    // that low-confidence kindness stays cheap.
    expect(escalates("despair")).toBe(false);
  });
});

describe("detectCrisisInMessages", () => {
  const msg = (role: string, text: string) => ({ role, parts: [{ type: "text", text }] });

  it("reads the child's latest message", () => {
    const hit = detectCrisisInMessages([
      msg("user", "what is photosynthesis"),
      msg("assistant", "Plants make food from sunlight…"),
      msg("user", "i want to kill myself"),
    ]);
    expect(hit?.signal.category).toBe("self_harm");
    expect(hit?.text).toBe("i want to kill myself");
  });

  it("never reads the assistant's words", () => {
    // Miss Vidya quoting a helpline back must not re-trigger and re-notify.
    const hit = detectCrisisInMessages([
      msg("user", "hello"),
      msg("assistant", "If you ever feel like you want to die, please tell a grown-up."),
    ]);
    expect(hit).toBeNull();
  });

  it("reads a few turns back, not the whole history", () => {
    const old = [
      msg("user", "i want to die"),
      msg("user", "a"),
      msg("user", "b"),
      msg("user", "c"),
      msg("user", "d"),
    ];
    expect(detectCrisisInMessages(old)).toBeNull();
  });

  it("supports the legacy `content` shape as well as `parts`", () => {
    const hit = detectCrisisInMessages([{ role: "user", content: "i feel suicidal" }]);
    expect(hit?.signal.category).toBe("self_harm");
  });
});

describe("supportMessage", () => {
  it("gives real helpline numbers, not placeholders", () => {
    const m = supportMessage({ category: "self_harm", cue: "x", script: "latin" });
    expect(m).toContain(HELPLINES.childline);
    expect(m).toContain(HELPLINES.teleManas);
  });

  it("adds the emergency number only for harm from others", () => {
    const harm = supportMessage({ category: "harm_from_others", cue: "x", script: "latin" });
    const self = supportMessage({ category: "self_harm", cue: "x", script: "latin" });
    expect(harm).toContain(HELPLINES.emergency);
    expect(self).not.toContain(HELPLINES.emergency);
  });

  it("replies in Devanagari when the child wrote in Devanagari", () => {
    const m = supportMessage({ category: "self_harm", cue: "x", script: "devanagari" });
    expect(m).toMatch(/[ऀ-ॿ]/);
    expect(m).toContain(HELPLINES.childline);
  });

  it("never blames the child", () => {
    const harm = supportMessage({ category: "harm_from_others", cue: "x", script: "latin" });
    expect(harm.toLowerCase()).toContain("not your fault");
  });

  it("never tells the child a grown-up has been informed", () => {
    // The parent card is honest with the parent; the child is never told they
    // were reported, because that is what stops a child from ever saying it.
    for (const script of ["latin", "devanagari"] as const) {
      for (const category of ["self_harm", "harm_from_others"] as const) {
        const m = supportMessage({ category, cue: "x", script }).toLowerCase();
        expect(m).not.toMatch(/we (have )?told|your parent has been|we notified|reported to/);
      }
    }
  });
});

describe("excerptFor", () => {
  it("flattens whitespace", () => {
    expect(excerptFor("i want\n\nto  die")).toBe("i want to die");
  });

  it("caps length with an ellipsis", () => {
    expect(excerptFor("a".repeat(500)).length).toBe(400);
    expect(excerptFor("a".repeat(500)).endsWith("…")).toBe(true);
  });
});
