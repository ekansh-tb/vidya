import type { LearnerProfile } from "./types";
import { placementFor } from "./learning/placement";

// Existing 0..7 recordings are C4 D4 E4 F4 G4 A4 B4 C5.
// Additional pitches use 100 + MIDI, avoiding the legacy index space.
const LEGACY_MIDI = [60, 62, 64, 65, 67, 69, 71, 72];
const NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const SHORTCUTS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";", "'", "]"];
export function validPitch(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && ((id >= 0 && id <= 7) || (id >= 148 && id <= 184));
}
export function pitchMidi(id: number) { return id < 8 ? LEGACY_MIDI[id] : id - 100; }
export function encodePitch(midi: number) { const legacy = LEGACY_MIDI.indexOf(midi); return legacy < 0 ? 100 + midi : legacy; }
export function pitchLabel(id: number) { const midi = pitchMidi(id); return validPitch(id) ? `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}` : "Unavailable note"; }
export function pitchFrequency(id: number) { return validPitch(id) ? 440 * 2 ** ((pitchMidi(id) - 69) / 12) : undefined; }
export function pianoKeys(octave: number, octaves = 1, simple = false) {
  const base = (Math.max(3, Math.min(5, Math.round(octave))) + 1) * 12;
  const count = simple ? 8 : octaves === 2 ? 24 : 13;
  return Array.from({ length: count }, (_, i) => base + i).filter(midi => midi <= 84).map((midi, i) => ({
    id: encodePitch(midi), midi, label: pitchLabel(encodePitch(midi)),
    sharp: [1, 3, 6, 8, 10].includes(midi % 12), shortcut: SHORTCUTS[i],
  })).filter(key => !simple || !key.sharp);
}

const IDEAS = {
  nursery: ["Try two sounds", "Play one key. Pause. Try another with your grown-up.", "दो ध्वनियाँ सुनो", "एक कुंजी बजाओ। रुको। अपने बड़े के साथ दूसरी बजाओ।"],
  lkg: ["Echo a sound", "Take turns playing two notes and copying each other.", "ध्वनि दोहराओ", "बारी-बारी दो स्वर बजाओ और एक-दूसरे को दोहराओ।"],
  ukg: ["Make a sound pattern", "Try low, high, low, high. What comes next?", "ध्वनि का क्रम बनाओ", "नीचा, ऊँचा, नीचा, ऊँचा बजाओ। आगे क्या आएगा?"],
  1: ["A three-note story", "Choose three notes for a beginning, a middle and an ending.", "तीन स्वरों की कहानी", "शुरुआत, बीच और अंत के लिए तीन स्वर चुनो।"],
  2: ["A musical question", "Play a short phrase. Make a different phrase that answers it.", "संगीत का सवाल", "एक छोटी धुन बजाओ। जवाब में दूसरी धुन बनाओ।"],
  3: ["Find a repeating beat", "Build four steps. Repeat them, then change one sound.", "दोहराती ताल खोजो", "चार चरण बनाओ। उन्हें दोहराओ, फिर एक ध्वनि बदलो।"],
  4: ["Melody and rhythm", "Record a melody, then add a quiet percussion layer.", "धुन और ताल", "एक धुन रिकॉर्ड करो, फिर ताल की एक धीमी परत जोड़ो।"],
  5: ["Change the mood", "Play the same notes on two instruments. Describe what changes.", "अंदाज़ बदलो", "दो वाद्यों पर वही स्वर बजाओ। क्या बदला?"],
  6: ["Leave some space", "Use rests in a rhythm. Compare it with a sound on every step.", "बीच में विराम दो", "ताल में कुछ विराम रखो। फिर हर चरण में ध्वनि से तुलना करो।"],
  7: ["Two interlocking parts", "Build two layers that take turns filling the spaces.", "दो जुड़ते हिस्से", "दो परतें बनाओ जो बारी-बारी खाली जगह भरें।"],
  8: ["Explore an octave", "Play C4, then C5. Compare their pitch and try a phrase in each range.", "सप्तक खोजो", "C4 और फिर C5 बजाओ। दोनों की ऊँचाई सुनो और दोनों में धुन बनाओ।"],
  9: ["Theme and variation", "Save a short theme. Edit a copy with a different rhythm or instrument.", "धुन का नया रूप", "छोटी धुन सहेजो। उसकी प्रति की ताल या वाद्य बदलो।"],
  10: ["Arrange a miniature", "Give melody and rhythm different roles, then adjust the tempo.", "छोटी रचना सजाओ", "धुन और ताल को अलग भूमिकाएँ दो, फिर गति बदलो।"],
  11: ["Make a contrast", "Compare a sparse arrangement with a layered one using the same theme.", "अंतर रचो", "एक धुन की कम स्वरों वाली और कई परतों वाली रचनाओं की तुलना करो।"],
  12: ["Compose with intention", "Choose a mood, make a short piece and explain one musical decision.", "सोचकर रचना बनाओ", "एक भाव चुनो, छोटी रचना बनाओ और अपना एक संगीत निर्णय समझाओ।"],
  13: ["Develop your own brief", "Set a constraint for a short composition. Listen, revise and save a new version.", "अपनी चुनौती चुनो", "छोटी रचना के लिए एक नियम तय करो। सुनो, सुधारो और नया रूप सहेजो।"],
} as const;

export function musicIdea(learner?: LearnerProfile) {
  const placement = learner && placementFor(learner);
  if (!placement) return undefined;
  const key = placement.kind === "early-years" ? placement.level : placement.grade as keyof typeof IDEAS;
  const idea = IDEAS[key];
  if (!idea) return undefined;
  const hi = learner?.learningLanguage === "hi";
  return { title: idea[hi ? 2 : 0], instruction: idea[hi ? 3 : 1] };
}
