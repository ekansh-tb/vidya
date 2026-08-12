// Move Break — guided physical activities.
//
// WHY THIS EXISTS
// ---------------
// The Wellness room could only ever ask a child to sit still and breathe. That
// is the right tool for winding down and the wrong one for a kid who has been
// at a screen for forty minutes and needs to move. PE is now a modelled subject
// (`cls-pe`) and CNS timetables it weekly, so the app should be able to say
// "go and do this for four minutes" and mean it.
//
// SAFETY IS PART OF THE CONTENT, NOT A DISCLAIMER
// -----------------------------------------------
// These are read by children, unsupervised, in a bedroom. Everything here is
// therefore floor-level, low-momentum and landable from standing. Deliberately
// NOT included, and please keep it that way:
//   · anything inverted onto the head or neck (headstand, backbend kickover)
//   · anything airborne or rotating (handspring, flip, aerial, dive roll)
//   · anything needing equipment a home does not have (beam, bars, vault)
//   · anything measured by how far a child can push into pain
// Every activity carries a `safety` line that the UI shows BEFORE the timer can
// start — it is a required field, not an optional one, so a new activity cannot
// be added without someone writing it.
//
// The gymnastics entries are the ones to be most careful with. They stop at the
// foundation skills a beginner class actually teaches first, and the tuck-roll
// cue ("chin to chest, round your back") is the one that keeps weight off the
// neck. A child who wants more than this should be in a coached gym, and the
// copy says so rather than pretending an app can supervise.

export type MoveKind = "gymnastics" | "cardio" | "strength" | "flexibility" | "balance" | "dance";

export type MoveStep = {
  label: string;
  /** Seconds this step runs. Keep steps short — a 10-year-old reads the clock. */
  secs: number;
  /** The one thing to get right. Shown large while the step runs. */
  cue: string;
};

export type Activity = {
  id: string;
  name: string;
  emoji: string;
  kind: MoveKind;
  tagline: string;
  /** What the child needs to have. "Nothing" is a valid and common answer. */
  needs: string;
  /** Shown before the timer starts. Required — see the note at the top. */
  safety: string;
  steps: MoveStep[];
  /** Theme-independent accent for the card. */
  accent: string;
};

export const ACTIVITIES: Activity[] = [
  {
    id: "gym-basics",
    name: "Gymnastics — Shapes",
    emoji: "🤸",
    kind: "gymnastics",
    tagline: "The five shapes every gymnast learns first",
    needs: "A soft surface — a rug, a mat, or grass",
    safety:
      "Floor only, and clear a space bigger than you are. Every shape here is done from sitting or lying down, so there is nothing to fall from. If something pinches or hurts, come out of it — stretching should feel long, never sharp.",
    accent: "#F472B6",
    steps: [
      { label: "Tuck", secs: 25, cue: "Sit, hug your knees, make yourself as small as a ball" },
      { label: "Straddle", secs: 30, cue: "Sit tall, legs wide in a V, toes pointed, back straight" },
      { label: "Pike", secs: 30, cue: "Legs together and straight out, reach for your toes" },
      { label: "Dish", secs: 25, cue: "Lie on your back, lift shoulders and legs, press your lower back down" },
      { label: "Arch", secs: 25, cue: "Roll onto your front, lift chest and legs, look at the floor" },
      { label: "Shake it out", secs: 20, cue: "Wiggle everything loose — you earned it" },
    ],
  },
  {
    id: "gym-roll",
    name: "Gymnastics — Forward Roll",
    emoji: "🤾",
    kind: "gymnastics",
    tagline: "Build it one piece at a time, the way a coach would",
    needs: "A mat or a folded thick blanket, and an adult nearby the first time",
    safety:
      "This is the one skill here that needs a soft mat and someone in the room. Your chin stays tucked to your chest the whole way over and your weight goes on your SHOULDERS, never on your head or neck. If you cannot get your chin down, stay on the rocking step — that is real progress, not a failure.",
    accent: "#FB923C",
    steps: [
      { label: "Rock and roll", secs: 30, cue: "Hug your knees on your back and rock — feel your round back" },
      { label: "Chin tuck", secs: 20, cue: "Squeeze a pretend orange between your chin and your chest" },
      { label: "Squat and place", secs: 30, cue: "Squat, hands flat on the mat, shoulder-width apart" },
      { label: "Tip and tuck", secs: 40, cue: "Push with your feet, chin down, roll along your shoulders" },
      { label: "Stand up tall", secs: 30, cue: "Come up without your hands — finish with arms up, like a gymnast" },
      { label: "Rest", secs: 20, cue: "Sit down and breathe. Dizzy is normal — wait until it passes" },
    ],
  },
  {
    id: "gym-balance",
    name: "Gymnastics — Balance",
    emoji: "🩰",
    kind: "balance",
    tagline: "A beam without a beam. Harder than it looks.",
    needs: "A line on the floor — a tile edge, a rug edge, or tape",
    safety:
      "Stay on the floor. A real beam is 1.25m up and this is a line on the ground, which is exactly the point — every gymnast learns the shape down here first. Bare feet grip better than socks.",
    accent: "#38BDF8",
    steps: [
      { label: "Walk the line", secs: 30, cue: "Heel to toe, arms out like a T, eyes on the end of the line" },
      { label: "Releve walk", secs: 30, cue: "Same walk, now up on your toes. Slow beats fast" },
      { label: "Passé hold", secs: 25, cue: "One foot to the inside of your other knee. Hold. Wobbling is training" },
      { label: "Other side", secs: 25, cue: "Swap legs — your weaker side is the one worth the reps" },
      { label: "Arabesque", secs: 30, cue: "Lift one leg behind you, chest up, arms wide" },
      { label: "Eyes closed", secs: 20, cue: "Two feet, eyes shut. Notice how much harder that is" },
    ],
  },
  {
    id: "wake-up",
    name: "Wake-Up Blast",
    emoji: "⚡",
    kind: "cardio",
    tagline: "Two and a half minutes to un-fry your brain",
    needs: "Nothing but space to jump",
    safety:
      "Land softly with bent knees — quiet feet mean good landings. Stop if you feel dizzy, and get a drink of water afterwards.",
    accent: "#FBBF24",
    steps: [
      { label: "March it out", secs: 20, cue: "Knees up, arms swinging — start easy" },
      { label: "Star jumps", secs: 30, cue: "Big shapes. Arms and legs all the way out" },
      { label: "Fast feet", secs: 20, cue: "Tiny quick steps on the spot, like the floor is hot" },
      { label: "Squat jumps", secs: 25, cue: "Sit back like there is a chair, then spring up" },
      { label: "Sprint on the spot", secs: 20, cue: "Everything you have got. Twenty seconds only" },
      { label: "Walk it down", secs: 30, cue: "Slow walk, long breaths — bring your heart rate back down" },
    ],
  },
  {
    id: "desk-undo",
    name: "Undo the Desk",
    emoji: "🪑",
    kind: "flexibility",
    tagline: "For the shoulders and neck that studying wrecks",
    needs: "Nothing",
    safety:
      "Slow and gentle. Never bounce a stretch, and never roll your head backwards — small half-circles at the front only.",
    accent: "#34D399",
    steps: [
      { label: "Shoulder rolls", secs: 25, cue: "Big slow circles backwards. Hear them crackle" },
      { label: "Neck half-circles", secs: 25, cue: "Ear to shoulder, chin across the front, other ear. Never backwards" },
      { label: "Reach up", secs: 25, cue: "Both arms overhead, stretch one side then the other" },
      { label: "Open the chest", secs: 30, cue: "Hands behind your back, squeeze shoulder blades together" },
      { label: "Forward fold", secs: 30, cue: "Soft knees, let your head hang heavy" },
      { label: "Roll up slowly", secs: 25, cue: "Stack one bone at a time, head comes up last" },
    ],
  },
  {
    id: "core-quest",
    name: "Core Quest",
    emoji: "🛡️",
    kind: "strength",
    tagline: "The muscles that hold every other skill up",
    needs: "A rug or mat",
    safety:
      "Quality over count. A shaky ten-second plank with a flat back beats a sagging minute — if your hips drop, that is the rep finished.",
    accent: "#A78BFA",
    steps: [
      { label: "Plank", secs: 25, cue: "Straight line from head to heels. Squeeze your tummy" },
      { label: "Rest", secs: 15, cue: "Down on your knees. Shake your arms out" },
      { label: "Dish hold", secs: 25, cue: "On your back, shoulders and legs lifted, lower back pressed down" },
      { label: "Superman", secs: 25, cue: "On your front, lift arms and legs, look down not up" },
      { label: "Side plank", secs: 20, cue: "One elbow down, hips high. Swap halfway" },
      { label: "Curl up small", secs: 20, cue: "Hug your knees. Feel your middle working" },
    ],
  },
  {
    id: "freestyle",
    name: "Freestyle Floor",
    emoji: "🕺",
    kind: "dance",
    tagline: "No steps. No rules. Nobody watching.",
    needs: "Music, if you want it",
    safety:
      "Look around first and move anything you could crash into. That is the whole safety brief.",
    accent: "#E879F9",
    steps: [
      { label: "Find the beat", secs: 25, cue: "Just nod and step. Anything counts" },
      { label: "Add your arms", secs: 30, cue: "Big shapes. Take up room" },
      { label: "Travel", secs: 30, cue: "Do not stay on one spot — move across the floor" },
      { label: "Freeze frames", secs: 30, cue: "Move, then hold a shape. Move, then hold" },
      { label: "Go all out", secs: 25, cue: "Last one. Ridiculous is the goal" },
      { label: "Cool down", secs: 25, cue: "Slow it right down. Long breaths" },
    ],
  },
];

export const ACTIVITY_MAP: Record<string, Activity> = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
);

/** Total seconds of a guided activity — used for the "4 min" label on the card. */
export function activitySeconds(a: Activity): number {
  return a.steps.reduce((n, s) => n + s.secs, 0);
}

export function activityMinutesLabel(a: Activity): string {
  const mins = activitySeconds(a) / 60;
  return mins < 1 ? `${activitySeconds(a)} sec` : `${mins.toFixed(mins % 1 === 0 ? 0 : 1)} min`;
}

export const MOVE_KIND_LABEL: Record<MoveKind, string> = {
  gymnastics: "Gymnastics",
  cardio: "Cardio",
  strength: "Strength",
  flexibility: "Stretch",
  balance: "Balance",
  dance: "Dance",
};
