// Cambridge Lower Secondary English 0861 — Stage 7 skills pack.
//
// GRADE MAPPING: CNS Amanora runs Cambridge Primary as Grades 1–5 and Cambridge
// Lower Secondary as Grades 6–8, so a Grade 6 learner studies STAGE 7. This pack
// carries `grade: 6` because the app matches packs by the learner's grade, while
// every piece of on-screen copy says "Stage 7". The school timetables it as
// "English Language & Literature", so both sides are covered here.
//
// Verified 2026-08-11 against the official Cambridge curriculum framework:
//   • Cambridge Lower Secondary English 0861 Curriculum Framework (from 2020)
//     Stage 7 learning objectives, pp. 14–17 — codes 7Rv / 7Rg / 7Rs / 7Ri /
//     7Ra / 7Ww / 7Wv / 7Wg / 7Ws / 7Wc / 7Wp / 7SLm / 7SLs / 7SLg / 7SLp / 7SLr.
//   • Subject page: cambridgeinternational.org → Lower Secondary → English (0861)
//
// English at 0861 is a SKILLS subject with THREE strands — Reading, Writing, and
// Speaking and Listening. There is no separate "Literature" strand: literature
// lives inside Reading (7Ri.01 fiction genres, poems and playscripts; 7Ri.09
// theme; 7Ri.12 distinctive voice). This pack therefore teaches literature as a
// way of reading, not as a set of texts to memorise.
//
// There is NO external exam at Stage 7. Lower Secondary Checkpoint is sat at the
// end of Stage 9 (Grade 8 here), so this year is about building the moves, not
// surviving a paper.
//
// STAGE DISCIPLINE — deliberately held back to Stage 8/9 and NOT taught here:
//   • Comparing texts from different cultures and times for shared themes (8Rv.03).
//     Stage 7 comparison goes only as far as two texts on the SAME subject with
//     different purposes and viewpoints (7Ri.11, 7Ri.05).
//   • Offering several possible interpretations of one technique (8Rv.04), and
//     oxymoron, which the framework uses only as a Stage 8 example.
//   • Manipulating sentence types for effect across a whole text (8Wg.02) —
//     Stage 7 asks for accurate use in a variety of types (7Wg.03).
//   • Sonnet form. Listed under "Texts across Grades 7 to 9" but not anchored to
//     Stage 7, so it is left for the teacher rather than asserted here.
//
// All extracts, poems and prompts below are ORIGINAL, written for this pack. No
// copyrighted text is reproduced.

import type { ExamPack } from "../exam-pack";

export const CLS7_ENGLISH_PACK: ExamPack = {
  subjectId: "cls-english",
  grade: 6,
  title: "English Language & Literature — Stage 7",
  context: "Cambridge Lower Secondary English 0861 · Stage 7 (Grade 6 at CNS Amanora)",
  highlights: [
    { label: "Framework", value: "0861 · from 2020" },
    { label: "Strands", value: "Reading · Writing · Speaking & Listening" },
    { label: "Checkpoint", value: "Stage 9 — not this year" },
  ],
  pinnedRule: {
    heading: "Never name a device and stop",
    body: "Writing 'this is a metaphor' earns you nothing on its own. The Stage 7 objective (7Rv.02) is to comment on a writer's choice of language 'demonstrating an understanding of the impact on the reader' — so the marks live in the second half of your sentence. Name it, quote it, say what it makes you picture, then say what it makes the reader FEEL. If your sentence stops at the label, it isn't finished.",
  },
  reference: {
    label: "Cambridge Lower Secondary English (0861) — official subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/english/",
  },
  plan: [
    { title: "Learn the analytical sentence by heart", hint: "Technique → quotation → picture → effect" },
    { title: "Practise inference on three short lines", hint: "What it says vs what it tells you" },
    { title: "Plan one piece in every writing form", hint: "Two minutes each — plan only, don't write" },
    { title: "Drill the four sentence types", hint: "Simple · compound · complex · compound-complex" },
    { title: "Fix punctuation you actually get wrong", hint: "Comma splices · its/it's · speech layout" },
    { title: "Read the cheat sheet before you write", hint: "Formulas and checklists only" },
  ],

  topics: [
    // ---------------- READING ----------------
    {
      id: "read-inference", num: 1, title: "Reading — what it says and what it means",
      blurb: "Literal meaning is what is printed. Inference is what the printing lets you work out.",
      syllabus: [
        "Explicit (literal) meaning is stated on the page. Questions that ask you to 'identify', 'name' or 'give' want you to find it and copy it accurately — nothing more (7Ri.03).",
        "Implicit meaning has to be worked out from clues. Questions that ask 'what does this suggest', 'what impression do you get' or 'how do you know' want an inference (7Ri.04).",
        "An inference is only worth writing if you can point to the words that produced it. Say the idea, then say which word gave it to you: 'He is nervous — we know because he 'checked the lock twice'.'",
        "Deduce unfamiliar words from context instead of guessing or skipping: read the sentence around it, look for a word family you know ('reluctant' next to 'reluctantly'), and check whether the sentence is positive or negative overall (7Rv.01).",
        "Match the size of your answer to the question. A one-mark question wants one fact; a three-mark question wants three separate ideas, not one idea said three ways.",
        "Annotate as you read — underline anything that answers the question, circle powerful words, put a question mark where something is hinted but not said (7Ri.07).",
      ],
    },
    {
      id: "read-evidence", num: 2, title: "Reading — using evidence properly",
      blurb: "A quotation is not proof by itself. It is proof once you have explained it.",
      syllabus: [
        "Every response and every opinion about a text needs a textual reference behind it (7Ri.08). 'I think the narrator is lonely' is a guess until you attach the words that show it.",
        "Quote SHORT. One or two words is usually enough — the exact word doing the work. Copying a whole sentence hides your point inside someone else's writing.",
        "Embed the quotation inside your own sentence so it reads smoothly: the writer calls the sky 'bruised' — not: The quote is 'the sky was bruised'.",
        "Use single quotation marks around the words you lift, and copy them EXACTLY, including the spelling.",
        "Then explain. The explanation is where the marks are: what does that word make you picture, and what does it make the reader feel?",
        "One point per paragraph. Point → evidence → explanation → (if you can) a second, smaller detail that supports the same point.",
      ],
    },
    {
      id: "read-summary", num: 3, title: "Reading — collating and summarising",
      blurb: "Pulling the relevant ideas out of a text and compressing them into your own words.",
      syllabus: [
        "Summarising means collecting ideas and information from a text and stating them briefly (7Ri.06). It is a reading skill, not a shortening exercise.",
        "First underline the FOCUS in the question ('the problems the village faced'). Only points matching that focus count — everything else, however interesting, is wasted.",
        "List the points in the margin before you write. Then check for repeats: two sentences that say the same thing are one point, not two.",
        "Rewrite each point in your own words. Swap the vocabulary: 'abandoned' → 'left empty'; 'exhausted' → 'worn out'. Proper nouns and words with no synonym may be kept.",
        "Write it as continuous prose — joined-up sentences, no bullet points, no headings — unless the task specifically asks for notes.",
        "Leave out: an introduction, a conclusion, quotations, examples, and your own opinion. None of them are summary.",
      ],
    },
    {
      id: "read-purpose", num: 4, title: "Reading — purpose, viewpoint and bias",
      blurb: "Every text was written by somebody who wanted something. Work out what.",
      syllabus: [
        "Identify the main ideas, the viewpoint and the purpose of a text (7Ri.11). Common purposes: to inform, explain, describe, persuade, argue, advise, review, entertain, narrate.",
        "Purpose shows in the choices: statistics and neutral verbs suggest 'inform'; 'you', rhetorical questions and emotive words suggest 'persuade'; step-by-step order and connectives like 'because' and 'as a result' suggest 'explain'.",
        "Viewpoint is what the writer THINKS about the subject. Look for loaded adjectives, what is praised, what is quietly left out, and how people are named ('protesters' vs 'troublemakers').",
        "Bias is when a text presents one side as if it were the whole picture (7Ri.05). Spot it by asking: whose voice is missing? Are the numbers given for both sides? Are the two sides described in equally fair language?",
        "Comparing two texts at Stage 7 means putting two pieces about the SAME subject side by side and saying how their purposes and viewpoints differ — and which words show it.",
        "Texts also carry their time and place: a piece written a hundred years ago, or in a different country, may assume things a reader today would not (7Ra.05).",
      ],
    },
    {
      id: "read-structure", num: 5, title: "Reading — how texts are built",
      blurb: "Structure is the order the writer chose, and the order is a choice you can comment on.",
      syllabus: [
        "Comment on the key features of text structure in fiction, non-fiction and poems (7Rs.01) — not just what the text says, but the shape it arrives in.",
        "Fiction structure: an opening that sets place or drops you mid-action, a build-up, a complication, a turning point, a resolution. Notice flashbacks, cliffhangers at chapter ends, and where the writer withholds information.",
        "Non-fiction structure: headline, introduction, subheadings, paragraphs one idea at a time, quotations from people, a closing line that repeats the main message. Look at what is put FIRST — that is what the writer most wants you to notice.",
        "Poetic form: stanzas, line length, rhyme scheme (label it ABAB, AABB), rhythm, repeated lines, and enjambment where a sentence runs over the line break to pull you onward.",
        "Comment on how content is organised and linked, including paragraphing (7Rs.02): why does the writer break HERE? Usually a new time, place, speaker or idea.",
        "Connectives and sentence openings are structural signals (7Rs.03). 'However' warns you of a turn; 'Meanwhile' switches place; 'Finally' tells you the argument is landing. A one-line paragraph after four long ones is a deliberate thump.",
      ],
    },

    // ---------------- LITERATURE (inside the Reading strand) ----------------
    {
      id: "lit-elements", num: 6, title: "Literature — character, setting, theme and voice",
      blurb: "Prose, poetry and drama share four questions. These are them.",
      syllabus: [
        "CHARACTER is built from four sources: what they say, what they do, what others say about them, and what the narrator tells you directly. The first two are the strongest evidence — actions are harder to fake than descriptions.",
        "SETTING is never just scenery. Ask what mood the place creates and whether it works with the character (a warm kitchen for a safe scene) or against them (a bright festival while someone grieves).",
        "THEME is the idea the text keeps returning to — courage, belonging, loss, fairness. It is not the plot. 'A boy loses his dog' is the plot; 'growing up means losing things you cannot replace' is the theme (7Ri.09).",
        "NARRATIVE VOICE: first person ('I') is close and limited — you only know what the narrator knows, and they may be wrong. Third person is wider; an all-knowing narrator can enter any character's head. Choosing one is a decision worth commenting on.",
        "A distinctive voice is made of vocabulary, sentence length and attitude (7Ri.12). A narrator who uses short, blunt sentences and no adjectives sounds very different from one who circles a thought for half a page.",
        "DRAMA has its own furniture: acts and scenes, dialogue, stage directions in brackets or italics, and asides spoken to the audience. Stage directions are the playwright talking to the actors — read them, they carry meaning.",
      ],
    },
    {
      id: "lit-figurative", num: 7, title: "Literature — figurative language and its effect",
      blurb: "The highest-value skill of the year: not spotting the device, but explaining what it does.",
      syllabus: [
        "Stage 7 asks you to describe how techniques create effects in a specific context AND to use accurate terminology (7Rv.03) — the framework's own examples are assonance and sibilance, so precise names matter.",
        "SIMILE compares with 'like' or 'as'. The thing chosen for comparison reveals the attitude: 'as still as a photograph' and 'as still as a corpse' describe the same stillness and feel nothing alike.",
        "METAPHOR says one thing IS another, so the qualities of the second thing transfer onto the first. Always say WHICH qualities transfer — that sentence is the analysis.",
        "PERSONIFICATION gives human qualities to something non-human, which makes a place or object feel alive, willing, or threatening. 'The wind pushed at the door' makes the weather look deliberate.",
        "SOUND techniques: alliteration (repeated first consonants), sibilance (repeated s / sh, which whispers or hisses), assonance (repeated vowel sounds, which slows a line down), onomatopoeia (a word that is its own sound — 'clatter', 'thud').",
        "IMAGERY is description that reaches the five senses. Sight is expected; sound and smell are less expected and therefore land harder.",
        "The move that scores: technique → short quotation → what it makes you picture or hear → what the reader is made to feel → why the writer wants that. Never stop before the last two.",
      ],
    },

    // ---------------- WRITING ----------------
    {
      id: "write-forms", num: 8, title: "Writing — the five forms and how to plan them",
      blurb: "Before the first word: form, purpose, audience. Then two minutes of planning.",
      syllabus: [
        "Use a range of planning methods to generate, organise and shape ideas (7Wc.02) — a spider diagram, a five-box story map, a for/against table, or a numbered list of paragraphs. Any of them beat starting cold.",
        "NARRATIVE tells a story. One moment, not a whole life: two characters, one place, a span of minutes. Shape it — opening, complication, turn, ending that resonates. Show feelings through behaviour, don't announce them.",
        "DESCRIPTIVE creates a place and a mood with almost no plot. Move the reader's attention like a camera: wide view → one close detail → a sound or smell → a person, unexplained → pull back. Choose ONE atmosphere and make every image serve it.",
        "PERSUASIVE argues for something to a named reader. Take a position in the first line, give three reasons, admit one point on the other side and answer it, and end with what you want the reader to DO.",
        "EXPLANATORY makes something clear: logical order, cause-and-effect connectives ('because', 'which means', 'as a result'), no opinion, and a definition for anything technical.",
        "TRANSACTIONAL is real-world writing — a formal letter or email, a report, a set of instructions, a review, a leaflet. Each has fixed conventions: use them, because using them IS the task (7Wc.03).",
        "Content must suit the audience (7Wc.04). A note to a friend, a speech to your class, and an email to the school office cannot share a register — this is the single easiest mark to lose or win.",
      ],
    },
    {
      id: "write-paragraphs", num: 9, title: "Writing — paragraphs, openings and endings",
      blurb: "A paragraph is one idea, developed. That is the whole rule.",
      syllabus: [
        "Shape the overall structure and sequence so it matches the purpose (7Ws.01). Decide the order of your paragraphs in the plan, not while writing.",
        "The three-part paragraph: TOPIC SENTENCE (the idea in one line) → DEVELOPMENT (evidence, example, detail, explanation) → LINK (a sentence that closes it or hands over to the next idea).",
        "Start a new paragraph when there is a new time, a new place, a new speaker, or a new idea. In dialogue, a new speaker ALWAYS means a new line — no exceptions.",
        "Use connectives and sentence openings that show the connection you actually mean (7Ws.03): comparison ('similarly', 'in contrast'), sequence ('meanwhile', 'later'), qualifying ('although', 'admittedly'), consequence ('as a result').",
        "Openings that work: a concrete image, a line of dialogue, a surprising fact, a question the piece then answers. Openings that don't: 'In this essay I will…' or repeating the title back.",
        "Endings that work: return to the opening image with something changed; a short decisive sentence; one clear thing you want the reader to do. Endings that don't: a summary of everything you just said, or 'and then I woke up'.",
        "Vary paragraph length deliberately. One short paragraph after three long ones lands hard — but only if it is rare.",
      ],
    },
    {
      id: "write-vocab", num: 10, title: "Writing — word choice and sentence variety",
      blurb: "Use language precisely to clarify and extend meaning (7Wv.01). Precise, not fancy.",
      syllabus: [
        "The right word beats the long word. A misused ambitious word costs more than a plain accurate one, so if you are not sure of a word's exact meaning, don't spend it here.",
        "Let VERBS do the work. 'Walked' tells you nothing; 'trudged', 'strode', 'shuffled' and 'picked his way' each carry a mood with them. Strong verbs remove the need for piles of adverbs.",
        "Cut 'very', 'really', 'so' and 'extremely'. They almost always mean the word underneath is too weak — 'very cold' should have been 'freezing'.",
        "Three adjectives in a row is usually weaker than one exact noun. 'A big beautiful amazing tree' shows nothing; 'a banyan with roots like dropped ropes' shows everything.",
        "Create an effect on purpose using linguistic and literary techniques in your OWN writing (7Wv.02) — a simile, a sound pattern, a repeated line. Aim for a few used well, not a checklist sprinkled through.",
        "Vary sentence length. A short sentence among long ones creates emphasis or shock, and only works because of the contrast around it.",
        "Vary sentence OPENINGS too. Five sentences in a row beginning 'I' or 'The' is the most visible weakness in otherwise good writing — start one with a connective, one with a verb ending in -ing, one with a subordinate clause.",
      ],
    },
    {
      id: "write-edit", num: 11, title: "Writing — notes, layout and editing your own work",
      blurb: "The last five minutes are worth more than the first five. Spend them.",
      syllabus: [
        "Take notes in the way that fits the purpose (7Wp.02): bullet lists for facts, a mind map for ideas, a two-column table for both sides of an argument. Then write FROM the notes, not from memory.",
        "Use layout and presentation that suit the text type (7Wp.03) — headings and subheadings in a report, an address block and sign-off in a formal letter, numbered steps in instructions, stanza breaks in a poem.",
        "Evaluate and edit your own and others' writing for accuracy AND effectiveness (7Wp.04). Those are two different passes, and doing them together means doing neither.",
        "Effectiveness pass — read it as a stranger would: does each paragraph have one clear idea? Is the opening doing work? Is there a sentence you can delete without losing anything? (Usually yes.)",
        "Accuracy pass — hunt specifically for your own repeat offenders: comma splices, its/it's, missing full stops inside speech marks, a paragraph that never got its break.",
        "When giving feedback to someone else, name one thing that works and say WHY it works, then one specific change — 'add a paragraph break before she speaks' is useful; 'make it better' is not.",
      ],
    },

    // ---------------- GRAMMAR AND PUNCTUATION ----------------
    {
      id: "gram-clauses", num: 12, title: "Grammar — word classes, phrases, clauses, sentences",
      blurb: "The four sentence types are Stage 7's backbone. Learn to name them and to build them.",
      syllabus: [
        "WORD CLASSES: noun (thing), verb (action or state), adjective (describes a noun), adverb (describes a verb), pronoun (stands in for a noun), preposition (position or relation — under, before), conjunction (joins), determiner (the, a, my, three).",
        "A PHRASE is a group of words with no subject-and-verb pair: 'under the neem tree', 'the rusted gate'. A CLAUSE has its own subject and verb: 'the gate creaked'.",
        "MAIN clause can stand alone as a sentence. SUBORDINATE clause cannot — it starts with a word like because, although, when, if, while, who, which, and leans on the main clause.",
        "SIMPLE = one main clause ('The bus was late.'). COMPOUND = two main clauses joined by and / but / or / so ('The bus was late, so we walked.'). COMPLEX = a main clause plus a subordinate clause ('Because the bus was late, we walked.').",
        "COMPOUND-COMPLEX = two main clauses AND a subordinate clause ('Because the bus was late, we walked, but we still missed assembly.'). Stage 7 expects you to use and name all four accurately (7Wg.03, 7Rg.02).",
        "Expand your sentences on purpose to add detail (7Wg.04): add an adjective phrase, a subordinate clause, or an -ing opener. 'The dog barked' → 'Hearing the gate, the old dog barked until someone answered.'",
        "In reading, comment on WHY a writer chose a type: a run of short simple sentences at a frightening moment speeds the reader up; a long complex sentence can pile up detail until it feels overwhelming (7Rg.03).",
      ],
    },
    {
      id: "gram-standard", num: 13, title: "Grammar — tense, agreement, register and reported speech",
      blurb: "Use the conventions of standard English consistently (7Wg.05). Then break them only on purpose.",
      syllabus: [
        "TENSE CONSISTENCY: pick past or present for a piece and stay there. Sliding from 'she walked' to 'she walks' mid-paragraph is the most common accuracy slip in narrative writing.",
        "The tenses you need: simple (she writes / wrote / will write), continuous (she is / was writing), perfect (she has / had written). Use the perfect to show one past event happened BEFORE another: 'The train had left before we reached the platform.'",
        "SUBJECT–VERB AGREEMENT: singular subject, singular verb. Watch the traps — 'The box of pencils IS on the desk' (the subject is 'box', not 'pencils'); 'Everyone HAS a partner' ('everyone' is singular).",
        "DIRECT SPEECH quotes the exact words inside speech marks: 'I'm not going,' said Neha. REPORTED SPEECH tells you what was said without quoting: Neha said that she was not going.",
        "Turning direct into reported: the tense usually shifts back (am → was, will → would, can → could), the pronouns change to match the person reporting, and time and place words move (today → that day, here → there).",
        "Direct speech is dramatic and immediate; reported speech is faster and lets you skip past unimportant conversation. Choosing between them is a craft decision in a story, not just a grammar exercise.",
        "REGISTER: formal writing avoids contractions and slang and uses full sentences; informal writing may use both. Match the register to the context, purpose and audience (7Wg.06) — and notice when a writer deliberately uses non-standard English to make a character sound real (7Rg.04).",
      ],
    },
    {
      id: "gram-punctuation", num: 14, title: "Punctuation — commas, colons, semicolons and speech",
      blurb: "Stage 7 adds the grown-up marks: colon, semicolon, dash, hyphen, ellipsis (7Wg.01).",
      syllabus: [
        "COMMA jobs: separating items in a list; after a fronted phrase or subordinate clause ('After the rain stopped, we went out'); around extra information ('My cousin, who lives in Nagpur, called'); before and / but joining two main clauses.",
        "COMMA SPLICE — the single most common error at this level. Two complete sentences joined by only a comma ('It was late, we went home') is wrong. Fix it with a full stop, a semicolon, or a joining word ('It was late, so we went home').",
        "COLON : introduces what has been promised — a list, an explanation, or the payoff. 'She had one rule: never lend a book twice.' What follows a colon should deliver what came before it.",
        "SEMICOLON ; joins two complete, closely related sentences without a joining word. 'The rain stopped; nobody moved.' Using one correctly is a genuine mark of control.",
        "DASH — is an interruption or an afterthought, and feels more abrupt and informal than a comma. A pair of dashes works like brackets but keeps the emphasis on what's inside.",
        "ELLIPSIS … shows trailing off, hesitation, or something left unsaid — the framework's own example is using one for a cliffhanger (7Rg.01). Once per piece; more than that becomes a tic.",
        "HYPHEN - joins words into one idea, especially compound adjectives before a noun: a 'well-known singer', a 'two-hour wait'. Stage 7 names this explicitly (7Wg.01).",
        "APOSTROPHE: omission (do not → don't) and possession (the boy's bag = one boy; the boys' bags = several). ITS is possessive and takes NO apostrophe; IT'S only ever means 'it is'.",
        "SPEECH: punctuation goes INSIDE the speech marks, and every new speaker starts a new line — 'Where were you?' she asked. / 'Nowhere,' he said.",
      ],
    },

    // ---------------- SPEAKING AND LISTENING ----------------
    {
      id: "sl-talk", num: 15, title: "Speaking and listening — presenting and discussing",
      blurb: "A full strand of the framework, not a warm-up. It is assessed on how you adapt.",
      syllabus: [
        "Adapt your speech — length, pace and tone — to the situation, and notice the effect it has (7SLm.01). Slowing down before an important point does more than saying 'this is important'.",
        "Shape talk for clarity: signpost it out loud ('I've got three reasons — the first is…'), because a listener cannot scroll back the way a reader can re-read (7SLm.02).",
        "Planning a presentation: one clear message, three points, one concrete example each, and a closing line worth remembering. Choose your media deliberately — slides, an object, a short clip — and only if they add something (7SLp.04).",
        "Delivery: look up, pause instead of saying 'um', and let gesture and expression support the meaning rather than fidget alongside it (7SLm.04).",
        "LISTENING is active work: listen, analyse what you heard, and give a reasoned response (7SLs.01). Note the point you want to answer while it is still being made, and answer that point rather than the one you had prepared.",
        "In discussion, build on others: name the point of agreement or disagreement clearly (7SLg.02), then add to it — 'I agree with Aarav about the cost, but I'd add that…' is worth more than a new unrelated idea.",
        "Take turns generously and keep the discussion moving towards its purpose (7SLg.04, 7SLg.03): invite the quiet person in, summarise where the group has got to, and don't win the argument by talking over it.",
        "Persuasive speech (7SLp.05) uses direct address, a rule of three, one short sentence to land the point, and a clear ask at the end.",
      ],
    },
  ],

  flashcards: [
    { term: "Simile", def: "A comparison using 'like' or 'as'. Effect to claim: it makes an unfamiliar thing easy to picture AND reveals the writer's attitude — always say what the chosen comparison implies, because 'as still as a photograph' and 'as still as a corpse' feel nothing alike." },
    { term: "Metaphor", def: "Saying one thing IS another. Effect: the qualities of the second thing transfer onto the first, so the reader judges it by borrowed associations. Your analysis is naming WHICH qualities transfer." },
    { term: "Personification", def: "Giving human qualities to something non-human. Effect: the object or place feels alive, deliberate or threatening, so the reader reacts to it as a presence rather than a thing." },
    { term: "Pathetic fallacy", def: "Weather or landscape that mirrors a mood. Effect: the setting loads the reader's emotion before anything happens, so what follows feels expected — a storm before an argument, sunshine before a reunion." },
    { term: "Imagery", def: "Description that reaches the five senses. Effect: it puts the reader physically in the scene. Sound and smell are less expected than sight, so they land harder." },
    { term: "Alliteration", def: "The same consonant sound repeated at the start of nearby words. Never say 'it makes it flow'. Say what the SOUND does: hard b / t / k sounds feel abrupt or harsh; soft l / m / w sounds feel gentle." },
    { term: "Sibilance", def: "Repeated s and sh sounds. Effect: hissing, whispering or something seeping slowly — often used for menace, secrecy, or water. Named in the Stage 7 framework as terminology you should use accurately." },
    { term: "Assonance", def: "The same vowel sound repeated in nearby words ('a slow road home'). Effect: long vowels stretch a line out and slow the reader down; short vowels make it clipped and quick." },
    { term: "Onomatopoeia", def: "A word that imitates the sound it names — 'clatter', 'hiss', 'thud'. Effect: the reader hears the scene as they read it, which makes the moment immediate." },
    { term: "Repetition", def: "Deliberately using the same word or phrase again. Effect: it builds insistence and makes the idea feel unavoidable — say which idea is being drilled in, and whether it feels like emphasis or like obsession." },
    { term: "Rhetorical question", def: "A question asked for effect, not for an answer. Effect: it pulls the reader into agreeing with an answer the writer has already chosen for them." },
    { term: "Emotive language", def: "Words loaded to make you feel something — 'abandoned', 'betrayed', 'trapped'. Effect: it moves the reader from weighing evidence to having a reaction. Name the exact emotion being targeted." },
    { term: "Hyperbole", def: "Deliberate exaggeration ('I've asked a thousand times'). Effect: it conveys the strength of a feeling rather than a fact, or creates humour — say which one, and why the writer wants it." },
    { term: "Symbol", def: "An object that stands for an idea bigger than itself — a locked gate for exclusion, a candle for hope. Effect: it lets the writer carry a theme without stating it." },
    { term: "Theme", def: "The idea a text keeps returning to (belonging, fairness, growing up). NOT the plot: 'a boy loses his dog' is plot; 'some things cannot be replaced' is theme." },
    { term: "Tone", def: "The writer's attitude to the subject — serious, playful, bitter, admiring. You find it in word choice, especially the adjectives and the verbs." },
    { term: "Mood", def: "The feeling created in the reader — tense, peaceful, uneasy. Tone belongs to the writer; mood belongs to you. Confusing the two is the classic Stage 7 slip." },
    { term: "Narrative voice", def: "Who is telling the story. First person ('I') is close but limited and may be unreliable; third person is wider and can enter other characters' heads. The choice is always worth a comment." },
    { term: "Simple sentence", def: "One main clause — one subject, one verb, a complete idea. 'The bus was late.' Effect when used among longer ones: emphasis, shock or finality." },
    { term: "Compound sentence", def: "Two main clauses joined by and, but, or, so, yet. 'The bus was late, so we walked.' Both halves could stand alone as sentences." },
    { term: "Complex sentence", def: "A main clause plus a subordinate clause introduced by because, although, when, if, who, which. 'Because the bus was late, we walked.' Effect: lets you build up detail and hold the main point back." },
    { term: "Compound-complex sentence", def: "Two main clauses AND at least one subordinate clause. 'Because the bus was late, we walked, but we still missed assembly.' Stage 7 expects you to use all four types accurately." },
    { term: "Phrase vs clause", def: "A phrase has no subject-and-verb pair ('under the neem tree'). A clause has its own subject and verb ('the gate creaked'). Every sentence needs at least one clause." },
    { term: "Connective", def: "A word or phrase that shows how ideas relate — however (turn), meanwhile (time), as a result (consequence), although (qualifying), similarly (comparison). Choose the one that matches the connection you actually mean." },
    { term: "Topic sentence", def: "The opening sentence of a paragraph that states its one idea. Everything after it develops that idea. If you cannot write one, the paragraph is holding two ideas and needs splitting." },
    { term: "Register", def: "How formal your language is, chosen to fit the context, purpose and audience. Formal: no contractions, no slang, full sentences. Informal: contractions, everyday words, shorter sentences." },
    { term: "Semicolon", def: "Joins two complete, closely related sentences without a joining word: 'The rain stopped; nobody moved.' If either side cannot stand alone as a sentence, a semicolon is the wrong mark." },
    { term: "Apostrophe", def: "Two jobs only: omission (don't) and possession (the boy's bag / the boys' bags). ITS is possessive and takes no apostrophe; IT'S always means 'it is'." },
  ],

  questions: [
    // --- Reading: inference ---
    {
      id: "cls7e-1", topic: "read-inference",
      q: "Original extract: 'Priya put the letter in her bag without opening it, and asked twice what was for dinner.'\n\nWhat does this suggest about how Priya feels about the letter? Explain how you know. [2]",
      model: "Priya is anxious about what the letter says and is putting off finding out.\n\nWe know because of two clues, not one. First, she puts it away 'without opening it' — a person who expected good news would open it straight away, so choosing not to look suggests she is afraid of what is inside. Second, she asks 'twice' about dinner: repeating an ordinary question shows her mind is elsewhere and that she is filling the silence rather than dealing with the letter.\n\nNotice what makes this an inference answer rather than a literal one: the text never uses the words 'anxious' or 'afraid'. I have worked the feeling out from her behaviour and then pointed at the exact words that produced it.",
      hint: "'What does this suggest' = inference. State the feeling, then quote the words that gave it to you.",
    },
    {
      id: "cls7e-2", topic: "read-inference",
      q: "A question asks: 'What does the phrase ‘the house had gone quiet in a way that felt arranged’ suggest?' Which answer scores?",
      opts: [
        "It suggests the house was quiet, because the writer says the house had gone quiet.",
        "It suggests the silence was not natural — someone had made it happen deliberately, so the narrator senses she is being kept out of something.",
        "The writer uses a good description here which creates a vivid image for the reader.",
        "It suggests the house was very, very quiet indeed and this is an important quotation.",
      ],
      a: "It suggests the silence was not natural — someone had made it happen deliberately, so the narrator senses she is being kept out of something.",
      model: "Only the second option does the work of an inference. The load-bearing word is 'arranged': silence normally just happens, so calling it arranged implies a person organised it, which in turn implies there is something the narrator is not being told.\n\nThe first option recycles the quotation instead of explaining it. The third comments on the writing being 'good' without saying what it means. The fourth adds emphasis but no content. All three are ways of writing a sentence that looks like an answer and contains nothing.",
    },
    {
      id: "cls7e-3", topic: "read-inference",
      q: "Original extract: 'The shop had been reluctant to close, hanging on for two years after the others gave up.'\n\nYou do not know the word 'reluctant'. Work out its meaning from the context, and say how you did it. [2]",
      model: "'Reluctant' means unwilling — not wanting to do something.\n\nHow I worked it out, using context rather than guessing:\n1. The rest of the sentence explains it: the shop was 'hanging on for two years after the others gave up'. Staying open long after everyone else means it did not want to close.\n2. The sentence is about resistance, so the word must carry a sense of holding back rather than eagerness.\n3. Word family check: I know 'reluctantly' from 'she agreed reluctantly' — which is said about someone who agrees without wanting to.\n\nThat three-step check — read around it, find what the sentence is doing, look for a relative of the word you already know — is the Stage 7 strategy (7Rv.01). It beats skipping the word or inventing a meaning that contradicts the sentence.",
    },

    // --- Reading: evidence ---
    {
      id: "cls7e-4", topic: "read-evidence",
      q: "A student writes: 'The narrator is lonely. This is shown in the text.' Rewrite it so it can score.",
      model: "'The narrator is lonely. The writer shows this when she describes laying out 'two cups, out of habit' — the second cup is for someone who is no longer there, and the phrase 'out of habit' tells us this has been going on long enough to become automatic. The reader is left with the sense that the loss is not fresh but permanent, which is sadder than a dramatic scene of grief would be.'\n\nWhat changed:\n• The vague claim 'this is shown in the text' has been replaced by an actual quotation — and a SHORT one, just the words doing the work.\n• The quotation is embedded inside my own sentence so it reads smoothly, with single quotation marks around the lifted words.\n• The explanation now does two jobs: what the detail literally means (the cup is for someone absent) and what the reader is made to feel (permanence rather than shock).\n\nThe rule: a quotation is not proof by itself. It becomes proof in the sentence after it.",
      hint: "Point → short quotation → what it means → what the reader feels.",
    },

    // --- Reading: summary ---
    {
      id: "cls7e-5", topic: "read-summary",
      q: "Rewrite each of these lifted phrases in your own words, then join them into ONE summary sentence.\n(a) 'the roof had been leaking since the monsoon'\n(b) 'there were no working lights in the back rooms'\n(c) 'the nearest bus stop was a forty-minute walk away'",
      model: "In my own words:\n(a) Water had been coming in through the roof since the rains.\n(b) The rear rooms had no lighting that worked.\n(c) Public transport was a long walk from the building.\n\nJoined as one continuous sentence:\n'Water had been coming in since the rains, the rear rooms had no working lights, and public transport was a long walk away.'\n\nThat is three separate points in twenty-two words. Check what is NOT there: no introduction, no quotation, no example, no opinion of my own, and no repeat of the original vocabulary. 'Leaking' became 'water coming in'; 'forty-minute walk' became 'a long walk'.\n\nThat compression rate — under eight words per point — is what makes a summary score. If you find yourself writing 'The text tells us that…', delete it: those five words could have carried half a point.",
      hint: "Own words + continuous prose. Every word you spend on framing is a point you didn't fit in.",
    },

    // --- Reading: purpose, viewpoint, bias ---
    {
      id: "cls7e-6", topic: "read-purpose",
      q: "Original extract from a local newsletter: 'The council generously spent twelve lakh on a decorative fountain, while the library roof waited another year.'\n\nWhat is the writer's viewpoint, and how do you know? [3]",
      model: "The writer disapproves of the council's spending and thinks the money went to the wrong thing.\n\nThree pieces of evidence:\n1. 'Generously' is being used sarcastically. Spending money on decoration while a roof leaks is not generosity, so the reader is meant to hear the gap between the word and the situation — this is the writer's opinion smuggled inside an apparently positive adjective.\n2. 'Decorative' quietly does the arguing. It labels the fountain as ornamental rather than useful, which makes the twelve lakh sound wasted before any argument has been made.\n3. The two halves are placed side by side on purpose. Putting the fountain next to the library roof invites the reader to compare them, and 'waited another year' implies this has happened before.\n\nNotice that the writer never says 'the council was wrong'. The judgement is built entirely out of word choice and arrangement, which is exactly what makes it worth analysing rather than just repeating.",
      hint: "Viewpoint questions are answered from loaded words and from what has been placed next to what.",
    },
    {
      id: "cls7e-7", topic: "read-purpose",
      q: "Two original texts describe the same new footbridge. Text A: 'The bridge opened on Tuesday. It is 40 metres long, cost 18 lakh, and replaces a crossing where 14 accidents were recorded since 2019.' Text B: 'At last — no more sprinting across four lanes with a schoolbag on your back. The bridge is here, and it is about time.'\n\nHow do the two texts differ in purpose? [3]",
      model: "Text A's purpose is to INFORM. Every sentence carries a verifiable fact — the day, the length, the cost, the number of accidents — and the verbs are neutral ('opened', 'replaces'). There is no 'you', no exclamation, and no adjective expressing an opinion. The reader is given the material to judge for themselves.\n\nText B's purpose is to PERSUADE, or at least to express a strong personal viewpoint. 'At last' and 'it is about time' are opinions, not facts. 'Sprinting across four lanes with a schoolbag on your back' puts the reader physically into the danger, and the dash after 'At last' gives the sentence a spoken, relieved rhythm.\n\nThe test that separates them: you could check every claim in Text A against a record. You could not check 'it is about time' against anything — it is a feeling. That is the difference between informing and persuading, and it is visible in the word choices, not just the overall tone.",
    },

    // --- Reading: structure ---
    {
      id: "cls7e-8", topic: "read-structure",
      q: "A chapter ends: 'She turned the key, pushed the door with her shoulder, and stopped.'\n\nComment on the writer's structural choice here. [2]",
      model: "The writer ends the chapter on a cliffhanger, and the structure of the sentence is what creates it.\n\nThe sentence is a list of three actions, and the first two are ordinary and detailed — turning a key, pushing with a shoulder. That build-up makes the reader expect a third action of the same kind. Instead the sentence delivers 'and stopped', which is shorter than the other two and tells us nothing about WHY.\n\nThe effect is that the reader is handed a reaction without its cause. We know she has seen something; we are refused the sight of it. Placing this at the very end of a chapter means the reader must carry that unanswered question across the chapter break, which is precisely why writers put cliffhangers there rather than in the middle of a page.",
      hint: "Structure questions ask about ORDER and PLACEMENT — where the writer put it, and what they withheld.",
    },

    // --- Literature: elements ---
    {
      id: "cls7e-9", topic: "lit-elements",
      q: "Original extract: 'Mr Salvi read the notice, folded it into quarters, and put it in his pocket. ‘We'll manage,’ he said, to nobody in particular.'\n\nWhat do we learn about Mr Salvi's character? [3]",
      model: "Mr Salvi is a private, controlled man who deals with bad news by containing it rather than sharing it.\n\nThe evidence sits in his actions before it sits in his words. He 'folded it into quarters' — folding something small and putting it away is the behaviour of someone tidying a problem out of sight, and 'quarters' suggests a deliberate, careful person rather than a panicking one. The writer shows us his character through what he does with his hands, which is far more convincing than being told he was calm.\n\nHis speech confirms it. 'We'll manage' is only two words, and it is reassurance offered before anyone has asked for it. The detail 'to nobody in particular' is the sharpest clue: he says it aloud with no listener, which suggests he is steadying himself rather than comforting anyone else. The reader is left suspecting that things are worse than he is admitting.",
      hint: "Character comes from what they DO first, what they SAY second. Actions are harder to fake.",
    },

    // --- Literature: figurative language ---
    {
      id: "cls7e-10", topic: "lit-figurative",
      q: "Original extract: 'The old bus coughed twice, thought about it, and gave up at the top of the hill.'\n\nExplain how the writer uses language here. Use the analytical sentence pattern. [3]",
      model: "The writer personifies the bus, and every verb in the sentence contributes to it. 'Coughed' is the first: literally it gives the engine a human, chesty splutter, so the reader hears an old, unhealthy sound rather than a mechanical one, and the bus starts to feel like an ageing body rather than a vehicle.\n\n'Thought about it' extends the personification further, because thinking requires a mind. Giving the bus a pause for consideration makes its breakdown look like a decision rather than a fault — as though it has weighed up the hill and declined. This is quietly funny, and the humour is the point: the reader is invited to be fond of the bus rather than frustrated by it.\n\n'Gave up' completes the pattern. Machines break; only living things give up. Taken together, 'coughed', 'thought' and 'gave up' build one consistent picture of an exhausted old creature, so the reader ends up sympathising with the bus instead of complaining about the delay.\n\n[Notice the shape of each paragraph: technique → short quotation → what it literally makes you picture → what the reader is made to feel. Nothing stops at the label.]",
      hint: "Three quotations, three effects, one consistent picture. That last part — showing the pattern — is what lifts it.",
    },
    {
      id: "cls7e-11", topic: "lit-figurative",
      q: "A student writes: 'The writer uses sibilance in ‘slow silver water slid past the boats’ which makes it flow nicely and creates a good effect.' Rewrite it so it scores.",
      model: "'The repeated s sounds in 'slow silver water slid' are sibilance, and the effect is physical: an s must be breathed out rather than struck, so the line has to be read softly and slowly. The sound of the sentence therefore imitates the movement it describes — the water seems to slip past rather than rush.\n\nThe word choices work with the sound. 'Slid' suggests effortless, almost secretive movement, and 'silver' drains the water of colour and makes it look cold and metallic rather than inviting. Together they leave the reader with a scene that is calm but slightly lifeless, which prepares us for the emptiness of the harbour described next.'\n\nWHAT CHANGED — and why it matters:\n• 'Makes it flow nicely' and 'creates a good effect' were deleted. They are the two phrases that cap the most answers at this level, because neither says anything a marker can credit.\n• The rewrite explains what the SOUND physically does to the reading voice, then what the WORDS suggest, then what the READER is left feeling.\n• It also links the effect to the wider text ('prepares us for the emptiness'), which shows you are reading the passage, not just the phrase.",
      hint: "Banned: 'makes it flow', 'creates a good effect', 'makes the reader want to read on'.",
    },
    {
      id: "cls7e-12", topic: "lit-figurative",
      q: "Original stanza:\n\n  The old tree keeps the wind's addresses,\n  folds them into its rings,\n  and says nothing all winter\n  to anyone who asks.\n\nWhat is the effect of the personification in this stanza? [3]",
      model: "The tree is personified as someone keeping a secret, and the poem builds that idea across all four lines rather than in a single image.\n\n'Keeps the wind's addresses' is the opening move. Addresses are private information belonging to other people, so the tree is presented as a keeper of things it was trusted with. This immediately makes the tree feel responsible and discreet rather than simply old.\n\n'Folds them into its rings' turns a fact of nature into an act of care. A tree's rings genuinely record its years, so the metaphor works on two levels at once: literally the tree stores its own history, and figuratively it is filing away what it has been told. 'Folds' is the precise word — it is what you do to a letter you intend to keep.\n\nThe final two lines deliver the effect. 'Says nothing all winter / to anyone who asks' makes the silence deliberate: the tree is not merely quiet, it is refusing. The line break before 'to anyone who asks' leaves 'says nothing' hanging for a moment, which makes the refusal land harder. The reader is left seeing the tree as patient and loyal, and the poem's theme — that some things are kept rather than told — is carried entirely by the personification.",
      hint: "In poetry, comment on the line breaks as well as the words. Where a line ends is a choice.",
    },

    // --- Writing ---
    {
      id: "cls7e-13", topic: "write-forms",
      q: "Task: 'Write a description of a railway platform early in the morning.' Show your PLAN and your opening paragraph. [Model.]",
      model: "PLAN — two minutes, and note that a description moves the CAMERA, not the plot:\n1. WIDE: the length of the empty platform, light coming in at the far end.\n2. SOUND: what the quiet is actually made of — the tannoy clearing its throat, a trolley somewhere.\n3. SMELL: tea from the stall, wet concrete.\n4. ONE DETAIL, held close: the timetable board with one line still showing yesterday.\n5. A PERSON, described but never explained — no story about them.\n6. PULL BACK to the opening image, changed by the first train.\nATMOSPHERE (choose one and serve it): waiting. Everything should feel paused.\n\nOPENING PARAGRAPH:\n'The platform stretched out and then stopped, as if the town had run out of interest halfway along. Two of the six lights had failed, so the morning arrived in patches, and between the patches the concrete gave up entirely. Somewhere past the end of the roof a trolley rolled a few feet and thought better of it.'\n\n[Why this works: 'run out of interest' and 'thought better of it' personify the town and the trolley, which sets the mood of abandonment in the first two sentences. There is no event and there should not be — a description is judged on atmosphere and on the order your attention travels, not on what happens.]",
      hint: "If your description has a beginning, a crisis and a resolution, you have written a story instead.",
    },
    {
      id: "cls7e-14", topic: "write-forms",
      q: "You are asked to write a persuasive letter to your head teacher arguing for a longer lunch break. Sketch the plan. [Model.]",
      model: "FORM: formal letter. AUDIENCE: head teacher — an adult with real power, who will be sceptical and will be thinking about timetables. PURPOSE: persuade her to make one specific change.\n\nPLAN:\n• Opening: state the ask in the first two lines. 'I am writing to ask that lunch be extended from 30 to 45 minutes.' No suspense — she is busy.\n• Reason 1 — practical: the queue takes eleven minutes, so a 30-minute break is really a 19-minute one. Use a number; numbers are hard to argue with.\n• Reason 2 — evidence-based: afternoon lessons start badly when people are rushed. Give a concrete example rather than a claim.\n• Reason 3 — her interest, not mine: fewer people late to period five means less disruption for teachers. Always give the reader a reason that serves THEM.\n• Concession then rebuttal: 'I understand this would shorten the teaching day by fifteen minutes. That is why I am proposing we take five minutes from each of the three breaks instead.' Admitting the problem and solving it is far stronger than pretending it isn't there.\n• Close: one clear, small ask. 'Could we trial it for one term?' A trial is easier to say yes to than a permanent change.\n• Sign-off: 'Yours sincerely' if you name her; 'Yours faithfully' if you wrote 'Dear Sir/Madam'.\n\nREGISTER CHECK: no contractions, no slang, no exclamation marks, no 'you should'. Formal does not mean cold — it means controlled.",
      hint: "The strongest persuasive move at this level is conceding one point and answering it.",
    },
    {
      id: "cls7e-15", topic: "write-paragraphs",
      q: "Rewrite this so it works as a paragraph: 'The market was busy. My uncle sold mangoes. It was very hot. There were lots of people. I bought a kite. The bus home was late.'",
      model: "'The market was at its worst by eleven, when the heat came off the tarpaulins and everyone arrived at once. My uncle's mango crates were stacked three high at the corner stall, and he had already lost his voice from shouting prices over the crowd. I stood in the narrow gap behind him, out of the sun, and watched a woman argue him down by two rupees a kilo — which he enjoyed far more than he let on.'\n\nWHAT WAS WRONG WITH THE ORIGINAL:\n• Six short sentences, six unconnected ideas, no topic sentence. It is a list, not a paragraph.\n• Two of the ideas (the kite, the late bus) belong to different moments and should be different paragraphs — or cut.\n• 'Very hot', 'lots of people' and 'busy' are vague. They tell the reader a category instead of showing them anything.\n\nWHAT THE REWRITE DOES:\n• TOPIC SENTENCE: 'The market was at its worst by eleven' announces the one idea the paragraph will develop.\n• DEVELOPMENT: heat, crowd and uncle are now the same idea seen from three angles, joined by detail — 'crates stacked three high', 'lost his voice', 'two rupees a kilo'.\n• Sentence variety: one medium, one compound, one longer complex sentence with a dash for the afterthought.\n• The vague words are gone. Exact detail replaced them, which is always the trade.",
      hint: "One paragraph = one idea, developed. If you can't write a topic sentence for it, it's two paragraphs.",
    },
    {
      id: "cls7e-16", topic: "write-vocab",
      q: "Rewrite so it SHOWS rather than tells: 'Arjun was very nervous and really worried about the result. He felt scared and anxious while he waited.'",
      model: "'Arjun read the noticeboard from the wrong end, twice. Then he went to fill a water bottle he had already filled, and stood beside the tap without turning it on.'\n\nWHAT CHANGED:\n• All four emotion words are gone. 'Nervous', 'worried', 'scared' and 'anxious' were four labels for one feeling — repeating synonyms is not range, it is padding.\n• 'Very' and 'really' are gone. They almost always mean the word underneath was too weak to stand alone.\n• The behaviour now carries the feeling. Reading from the wrong end, repeating a pointless task, and stopping halfway through it are all things people genuinely do when they cannot concentrate — so the reader diagnoses the anxiety themselves, which is far more convincing than being told.\n• 'A water bottle he had already filled' is the load-bearing detail: it shows he isn't tracking his own actions.\n\nTHE RULE: don't name the emotion. Give the reader the evidence and let them name it.",
      hint: "Delete every emotion word, then rebuild the sentence out of actions.",
    },

    // --- Grammar and punctuation ---
    {
      id: "cls7e-17", topic: "gram-clauses",
      q: "Name the sentence type: 'Although the power had gone, the shop stayed open, and the owner lit two candles.'",
      opts: ["Simple", "Compound", "Complex", "Compound-complex"],
      a: "Compound-complex",
      model: "Count the clauses and check which can stand alone:\n• 'Although the power had gone' — has a subject and verb, but 'although' makes it SUBORDINATE. It cannot stand alone.\n• 'the shop stayed open' — a MAIN clause; it works as a sentence by itself.\n• 'and the owner lit two candles' — a second MAIN clause, joined by 'and'.\n\nTwo main clauses plus a subordinate clause = compound-complex. (Two main clauses alone would be compound; one main plus one subordinate would be complex.)\n\nStage 7 expects you to use and name all four types accurately (7Wg.03). The quick test that never fails: cover everything else and ask 'could this piece be a sentence on its own?' If yes, it's a main clause. Count the main clauses first, then look for a subordinating word — because, although, when, if, while, who, which.",
    },
    {
      id: "cls7e-18", topic: "gram-punctuation",
      q: "Correct this and explain each choice: 'The hall was empty, the chairs were stacked against the wall, nobody had told him the meeting was cancelled.'",
      model: "CORRECTED:\n'The hall was empty; the chairs were stacked against the wall. Nobody had told him the meeting was cancelled.'\n\nWHAT WAS WRONG: the original is a COMMA SPLICE — three complete sentences joined by nothing but commas. This is the most common punctuation error at Stage 7, and it is easy to spot once you know the test: cover the comma and ask whether both sides could stand alone as sentences. If both could, a comma is too weak.\n\nTHE CHOICES:\n• SEMICOLON between the first two, because they are two closely linked observations of the same scene. A full stop would work but would sever a connection the reader needs.\n• FULL STOP before the third, because the sentence shifts from what he SEES to what he REALISES. The break makes the realisation land.\n\nAN EVEN BETTER VERSION uses a colon:\n'The hall was empty, the chairs stacked against the wall: nobody had told him the meeting was cancelled.'\nThe colon presents the last clause as the explanation the first half was building towards — which is exactly the colon's job.",
      hint: "Comma splice test: could both halves be sentences on their own? Then you need a full stop, semicolon, or joining word.",
    },
    {
      id: "cls7e-19", topic: "gram-standard",
      q: "Punctuate and lay out this dialogue correctly, then say what the layout rule is.\n\nwhere have you been she asked nowhere he said and put his bag down",
      model: "CORRECT LAYOUT:\n\n'Where have you been?' she asked.\n\n'Nowhere,' he said, and put his bag down.\n\nTHE RULES, one at a time:\n• NEW SPEAKER, NEW LINE. This is not decoration — it is how the reader knows who is talking without being told. Running two speakers together in one paragraph is the fastest way to confuse a reader.\n• Punctuation goes INSIDE the closing speech mark: 'Where have you been?' not 'Where have you been'?\n• When the speech is a question or exclamation, keep the ? or ! and still use a lower-case 'she' after it — 'she asked' is part of the same sentence.\n• When the speech is a statement followed by 'he said', end the speech with a COMMA, not a full stop: 'Nowhere,' he said.\n• The speech tag ('she asked', 'he said') is not a new sentence, so it does not take a capital letter.\n\nOne extra craft note: 'and put his bag down' after 'he said' is doing real work. Attaching an action to a line of dialogue shows the character's attitude without a single adverb — far better than 'he said casually'.",
      hint: "Forgetting the paragraph break for a new speaker is the most common dialogue error at this level.",
    },

    // --- Speaking and listening ---
    {
      id: "cls7e-20", topic: "sl-talk",
      q: "In a group discussion, someone says: 'We should ban phones in school completely.' Give a response that builds on the point rather than just disagreeing. [Model.]",
      model: "'I agree with the part of that I think matters most — phones during lessons genuinely break concentration, and Ravi is right that it isn't fair on the people trying to work. Where I'd go further is that a total ban solves that problem and creates a different one, because a few of us use them to message home about pickup. So could we separate the two? Phones off and in bags during lessons, allowed at the gate after the last bell. That keeps Ravi's point and answers mine.'\n\nWHY THIS SCORES (7SLg.02, 7SLg.03):\n• It names the point of agreement FIRST and credits the person by name. That is not politeness for its own sake — it proves you listened, which is the assessed skill.\n• It identifies precisely where the disagreement lies, rather than rejecting the whole idea. 'Where I'd go further' is a much stronger opening than 'but'.\n• It DEVELOPS the discussion by offering a workable middle position, so the group moves forward instead of splitting in two.\n• It ends by handing the idea back to the group ('could we…?') rather than closing the topic down.\n\nThe move to avoid: waiting for a gap and then saying the thing you had already decided to say. That is talking, not discussing.",
      hint: "Agree with something specific, disagree with something specific, then add something new.",
    },
  ],

  mistakes: [
    { mistake: "Naming the device and stopping — 'the writer uses a simile here'.", fix: "The label is worth nothing alone. Always keep going: what it makes you picture, then what the reader is made to feel, then why the writer wanted that. If your sentence ends at the name, it is half a sentence." },
    { mistake: "Empty effect phrases — 'it makes it flow', 'it creates a good effect', 'it makes the reader want to read on'.", fix: "These are the three phrases that cap the most answers. Replace each with something specific: WHAT does the reader picture, WHAT do they feel, and WHY does that matter to the writer's purpose?" },
    { mistake: "Retelling the story instead of answering the question.", fix: "If a sentence of yours could be swapped for 'and then this happened', delete it. Analysis explains HOW the writer makes the reader respond — it never just reports what occurs." },
    { mistake: "Answering an inference question with a literal fact.", fix: "'What does this suggest?' is not asking what happened. State the idea you worked out, then point at the exact words that made you work it out." },
    { mistake: "Quoting a whole sentence, or dropping a quotation in on its own line.", fix: "Quote one or two words — the ones doing the work — and embed them inside your own sentence: the writer calls the sky 'bruised'. Then explain them. A quotation is proof only once you've unpacked it." },
    { mistake: "Comma splices — joining two complete sentences with just a comma.", fix: "'It was late, we went home' is wrong. Test it: could both halves be sentences alone? If yes, use a full stop, a semicolon, or add a joining word ('so we went home')." },
    { mistake: "Forgetting the paragraph break when a new person speaks.", fix: "New speaker, new line — every time. Without it the reader loses track of who is talking, and punctuation inside the speech marks is usually the next thing to go wrong too." },
    { mistake: "Writing a whole piece as one enormous paragraph.", fix: "Break for a new time, a new place, a new speaker, or a new idea. Then check each paragraph has one idea you could write a topic sentence for — if it has two, split it." },
    { mistake: "Describing when the task says narrate, or telling a story when it says describe.", fix: "Description = atmosphere and almost no plot; the movement comes from where the reader's attention travels. Narrative = one shaped moment with a complication and a turn. Reread the task word before you plan." },
    { mistake: "Sliding between past and present tense in a story.", fix: "Choose past or present in the plan and stay there. Read your last paragraph back looking only at the verbs — mixed tense is invisible while you write and obvious afterwards." },
    { mistake: "Piling up 'very', 'really' and three adjectives in a row to sound descriptive.", fix: "'Very cold' should have been 'freezing'. One exact noun plus one working verb beats four adjectives every time — precision is the skill, not decoration." },
    { mistake: "Copying phrases straight from the passage when the question asks for your own words.", fix: "Swap the vocabulary: 'reluctant' → 'unwilling', 'abandoned' → 'left empty'. Keep only proper nouns and words that genuinely have no synonym." },
  ],

  cheat: [
    {
      heading: "The analytical sentence — learn this shape",
      bullets: [
        "TECHNIQUE → SHORT QUOTATION → WHAT IT MAKES YOU PICTURE → WHAT THE READER FEELS → WHY THE WRITER WANTS IT.",
        "Stem: 'The writer describes X as '…', a [technique] which makes me picture …, so the reader feels …'",
        "Stem: 'The word '…' suggests …, which makes the [place/person] seem …'",
        "Stem: 'By putting '…' next to '…', the writer invites the reader to compare them, and the effect is …'",
        "Useful effect verbs: suggests, implies, hints, makes the reader feel, forces us to notice, invites us to, prepares us for.",
        "BANNED — they mean nothing: 'makes it flow', 'creates a good effect', 'is very effective', 'makes the reader want to read on', 'creates a vivid image' (unless you then say WHICH image).",
        "Depth beats quantity: one image explained in three sentences scores higher than four devices listed in one.",
      ],
    },
    {
      heading: "Planning templates — two minutes each, always before writing",
      bullets: [
        "ALL FORMS FIRST: write FORM / PURPOSE / AUDIENCE at the top and glance at it while you write.",
        "NARRATIVE — one moment, not a life. Two characters, one place, minutes not days. Opening (start mid-action) → complication → turn → ending that resonates. Show feelings through behaviour.",
        "DESCRIPTIVE — camera moves, plot doesn't. Wide view → sound and smell → one detail close up → a person, unexplained → pull back to the opening image, changed. Pick ONE atmosphere; every image serves it.",
        "PERSUASIVE — position in line one → three reasons (one of them serving the READER's interest) → concede one objection and answer it → a small, specific ask at the end.",
        "EXPLANATORY — define anything technical → logical order → cause-and-effect connectives ('because', 'which means', 'as a result') → no opinion → a short summary of the process.",
        "TRANSACTIONAL — get the conventions right first, because they ARE the task: formal letter (address, Dear…, subject, paragraphs, Yours sincerely/faithfully); report (title, subheadings, facts, recommendation); instructions (numbered steps, imperative verbs).",
        "Then check the audience once more. A note to a friend, a class speech and an email to the school office cannot share a register.",
      ],
    },
    {
      heading: "Paragraph and structure toolkit",
      bullets: [
        "PARAGRAPH SHAPE: topic sentence (the one idea) → development (evidence, example, detail) → link (close it, or hand over to the next idea).",
        "NEW PARAGRAPH when: new time · new place · new speaker · new idea. In dialogue, new speaker ALWAYS means new line.",
        "OPENINGS that work: a concrete image · a line of dialogue · a surprising number · a question the piece answers. Never 'In this essay I will…'.",
        "ENDINGS that work: return to the opening image, changed · a short decisive sentence · one clear thing you want the reader to do. Never 'and then I woke up'.",
        "CONNECTIVES by job — turn: however, although, on the other hand · time: meanwhile, later, by then · consequence: as a result, which meant · comparison: similarly, in the same way · adding: furthermore, what's more.",
        "VARY sentence openings, not just lengths. Start one with a connective, one with an -ing phrase ('Hearing the gate, …'), one with a subordinate clause ('Because it was late, …').",
        "One short paragraph after three long ones lands like a thump — but only if it's rare.",
      ],
    },
    {
      heading: "Sentence types — name them, then build them",
      bullets: [
        "SIMPLE — one main clause. 'The bus was late.' Among longer sentences it creates emphasis, shock or finality.",
        "COMPOUND — two main clauses joined by and / but / or / so / yet. 'The bus was late, so we walked.' Both halves could be sentences alone.",
        "COMPLEX — one main clause + a subordinate clause (because, although, when, if, while, who, which). 'Because the bus was late, we walked.'",
        "COMPOUND-COMPLEX — two main clauses + a subordinate clause. 'Because the bus was late, we walked, but we still missed assembly.'",
        "THE TEST: cover everything else and ask 'could this part be a sentence on its own?' Yes = main clause. Count the main clauses first, then look for a subordinating word.",
        "PHRASE = no subject-and-verb pair ('under the neem tree'). CLAUSE = has its own subject and verb ('the gate creaked').",
        "EXPAND for detail: add an -ing opener, a subordinate clause, or an adjective phrase. 'The dog barked' → 'Hearing the gate, the old dog barked until someone answered.'",
      ],
    },
    {
      heading: "Punctuation rules that actually cost marks",
      bullets: [
        "COMMA SPLICE: two complete sentences joined by a comma is always wrong. Fix with a full stop, a semicolon, or a joining word.",
        "COLON : introduces the payoff — a list, an explanation, or the thing you've been building to. 'She had one rule: never lend a book twice.'",
        "SEMICOLON ; joins two complete, closely related sentences with no joining word. 'The rain stopped; nobody moved.' If either side can't stand alone, it's the wrong mark.",
        "DASH — interruption or afterthought; more abrupt than a comma. A pair works like brackets but keeps the emphasis inside.",
        "ELLIPSIS … trailing off, hesitation, or a cliffhanger. Once per piece, or it becomes a habit.",
        "HYPHEN - joins words into one idea, especially compound adjectives before a noun: a 'well-known singer', a 'two-hour wait'.",
        "APOSTROPHE: don't (omission) · the boy's bag, one boy · the boys' bags, several boys. ITS = belonging to it, NO apostrophe. IT'S = it is, always.",
        "SPEECH: 'Where were you?' she asked. / 'Nowhere,' he said. Punctuation inside the marks; comma (not full stop) before 'he said'; new speaker, new line.",
      ],
    },
    {
      heading: "Proofreading checklist — five minutes, in this order",
      bullets: [
        "1. EFFECTIVENESS FIRST, accuracy second. Doing both at once means doing neither.",
        "2. Does every paragraph have ONE idea? Could you write a topic sentence for each? If not, split it.",
        "3. Is there a sentence you could delete and lose nothing? Delete it. There usually is.",
        "4. Circle every 'very', 'really', 'so', 'nice', 'good', 'big'. Replace each with one exact word.",
        "5. Read only the verbs of your last paragraph — is the tense consistent all the way through?",
        "6. Hunt comma splices: any comma with a complete sentence on both sides.",
        "7. Check its / it's, their / there / they're, and every apostrophe you used for a plural (you shouldn't have).",
        "8. Dialogue check: new speaker on a new line, punctuation inside the speech marks.",
        "9. Read the last sentence aloud in your head. Is it the line you want the reader to leave with?",
      ],
    },
    {
      heading: "Stage 7 in one glance",
      bullets: [
        "Three strands: READING · WRITING · SPEAKING AND LISTENING. There is no separate literature strand — literature is how you read.",
        "No exam this year. Lower Secondary Checkpoint is sat at the end of Stage 9, so Stage 7 is for building the moves that will carry you there.",
        "Reading sub-strands: vocabulary and language · grammar and punctuation · structure of texts · interpretation of texts · appreciation and reflection.",
        "Writing sub-strands: spelling · vocabulary and language · grammar and punctuation · structure of texts · creation of texts · presentation and reflection.",
        "Speaking and Listening sub-strands: making yourself understood · showing understanding · group work and discussion · performance · reflection and evaluation.",
        "The single highest-value habit: never write the name of a technique without the sentence that explains its effect.",
        "The single most common accuracy fix: hunt your comma splices and your its/it's before you hand anything in.",
      ],
    },
  ],
};
