// CBSE Class 7 English — NCERT "Poorvi" (NCF-SE 2023)
// Source: 15 chapters across 5 Units in the 2025 edition. Verified May 2026 via:
//   - learncbse.in/ncert-solutions-for-class-7-english/  (Unit + chapter index)
//   - studyrankers.com 2025-07 Class 7 Poorvi solutions
//   - schooltopper.in PDF listing 2025-26
// Poorvi is the NCF-SE 2023 successor to "Honeycomb"; mixes prose and poetry
// across five thematic Units.

import type { ExamPack } from "../exam-pack";

export const CBSE7_ENGLISH: ExamPack = {
  subjectId: "cbse-english",
  grade: 7,
  title: "English — Class 7 CBSE",
  context: "NCERT Poorvi · 15 chapters · 5 Units · NCF-SE 2023",
  highlights: [
    { label: "Textbook", value: "Poorvi (NCERT, 2025 ed.)" },
    { label: "Units",    value: "5 (Learning · Humour · Dreams · Travel · Bravehearts)" },
    { label: "Style",    value: "Mixed prose + poetry per Unit" },
  ],
  reference: {
    label: "NCERT — Poorvi chapter index (LearnCBSE)",
    url: "https://www.learncbse.in/ncert-solutions-for-class-7-english/",
  },
  pinnedRule: {
    heading: "Reading habit",
    body: "For every prose/poem, jot down: (1) who is speaking, (2) what changes by the end, (3) one line that stayed with you. Most exam questions branch off these three.",
  },
  plan: [
    { title: "Walk the 5-Unit map",        hint: "Tag chapters you have not read yet" },
    { title: "Vocabulary — 20 cards",      hint: "Theme words + literary terms" },
    { title: "Practice — 18 questions",    hint: "Recall + comprehension mix" },
    { title: "Common-mistake list",        hint: "Where students slip in language" },
    { title: "Exam-day cheat sheet",       hint: "Grammar + reading checklist" },
  ],
  topics: [
    // ── Unit 1 — Learning Together ───────────────────────────────
    {
      id: "u1-1-river-spoke", num: 1, title: "The Day the River Spoke",
      blurb: "Unit 1 opener — a river finds a voice, and we listen.",
      syllabus: [
        "Unit theme: Learning Together — what nature, books and people teach us.",
        "Personification of the river as the central device.",
        "Environmental awareness and our duty toward water bodies.",
        "Tone: reflective; first-person narration of an unusual encounter.",
      ],
    },
    {
      id: "u1-2-try-again", num: 2, title: "Try Again",
      blurb: "Short motivational poem on perseverance.",
      syllabus: [
        "Genre: poem. Central message: never give up after one failure.",
        "Refrain 'try, try again' as a structural anchor.",
        "Simple rhyme scheme; suitable for recitation.",
        "Connect to the Unit-1 idea of learning through repeated effort.",
      ],
    },
    {
      id: "u1-3-three-days", num: 3, title: "Three Days to See",
      blurb: "Excerpts from Helen Keller's essay/autobiography.",
      syllabus: [
        "Author: Helen Keller — deaf-blind American writer and activist.",
        "Imagined three days of sight: what she would choose to see and why.",
        "Theme: gratitude, attentiveness, value of senses we take for granted.",
        "Tone: warm, contemplative, urging the reader to truly look.",
      ],
    },
    // ── Unit 2 — Wit and Humour ──────────────────────────────────
    {
      id: "u2-4-dr-dolittle", num: 4, title: "Animals, Birds and Dr. Dolittle",
      blurb: "Adaptation built around Hugh Lofting's Dr. Dolittle.",
      syllabus: [
        "Dr. Dolittle — a fictional doctor who can speak to animals.",
        "Source author: Hugh Lofting (English children's writer).",
        "Theme: communication, empathy and the bond between humans and animals.",
        "Style: humorous, light-hearted, dialogue-driven.",
      ],
    },
    {
      id: "u2-5-funny-man", num: 5, title: "A Funny Man",
      blurb: "Unit 2 humour piece — gentle comic portrait.",
      syllabus: [
        "Genre: short prose / character sketch.",
        "Unit theme: wit and humour as a way of looking at everyday life.",
        "Observation of small absurdities; tone is affectionate not mocking.",
        "Use of exaggeration to create humour.",
      ],
    },
    {
      id: "u2-6-say-right", num: 6, title: "Say the Right Thing",
      blurb: "Why words — and the right choice of words — matter.",
      syllabus: [
        "Theme: the power of the right word at the right time.",
        "Politeness, register and tact in everyday speech.",
        "Humour arising from saying the wrong thing.",
        "Connects to Unit-2 wit-and-humour thread.",
      ],
    },
    // ── Unit 3 — Dreams and Discoveries ──────────────────────────
    {
      id: "u3-7-brothers-invention", num: 7, title: "My Brother's Great Invention",
      blurb: "A sibling's creative experiment — discovery in everyday life.",
      syllabus: [
        "Narrator: a young sibling watching an older brother build something.",
        "Theme: curiosity, creativity and learning by doing.",
        "Tone: affectionate, playful; family bond at the centre.",
        "Links to the Unit-3 theme of dreams and small discoveries.",
      ],
    },
    {
      id: "u3-8-paper-boats", num: 8, title: "Paper Boats",
      blurb: "Classic poem by Rabindranath Tagore.",
      syllabus: [
        "Poet: Rabindranath Tagore (1861–1941) — Nobel laureate, India.",
        "Imagery: a child sending paper boats downstream, hoping someone far away will find them.",
        "Themes: childhood imagination, hope, connection across distance.",
        "Form: free-verse / prose poem in English (translated by the poet himself).",
      ],
    },
    {
      id: "u3-9-nsew", num: 9, title: "North, South, East, West",
      blurb: "Directions, journeys, and seeing the world around us.",
      syllabus: [
        "Theme: the four cardinal directions as a way to map experience.",
        "How travel and direction broaden one's sense of the world.",
        "Vocabulary of geography woven into a literary piece.",
        "Connects Unit-3 (discoveries) to Unit-4 (travel).",
      ],
    },
    // ── Unit 4 — Travel and Adventure ────────────────────────────
    {
      id: "u4-10-tunnel", num: 10, title: "The Tunnel",
      blurb: "Adventure piece set around a tunnel.",
      syllabus: [
        "Genre: short story / adventure narrative.",
        "Setting plays a major role — the tunnel is itself a character.",
        "Theme: courage, the unknown, what we discover when we cross into the dark.",
        "Tone: suspenseful but resolved warmly.",
      ],
    },
    {
      id: "u4-11-travel", num: 11, title: "Travel",
      blurb: "Poem on the joy and longing of travel.",
      syllabus: [
        "Genre: poem on the Unit-4 theme of travel and adventure.",
        "Imagery of trains, roads, far places.",
        "Theme: wanderlust; the imagination's role in travel.",
        "Recitable rhythm — pay attention to rhyme and line breaks.",
      ],
    },
    {
      id: "u4-12-summit", num: 12, title: "Conquering the Summit",
      blurb: "Mountaineering — the climb as metaphor for effort.",
      syllabus: [
        "Real-world adventure context: mountaineering / scaling a peak.",
        "Theme: perseverance, teamwork, respect for nature.",
        "Indian mountaineering heritage (Bachendri Pal, Arunima Sinha, etc.) as connector.",
        "Reading skill: extracting fact from a first-person adventure account.",
      ],
    },
    // ── Unit 5 — Bravehearts ─────────────────────────────────────
    {
      id: "u5-13-homage", num: 13, title: "A Homage to Our Brave Soldiers",
      blurb: "Unit-5 opener — gratitude to the armed forces.",
      syllabus: [
        "Theme: courage, sacrifice and service.",
        "Reverent tone; reading as collective thanks.",
        "Vocabulary of duty, valour, sacrifice.",
        "Connects to letter-writing tasks (a letter to a soldier).",
      ],
    },
    {
      id: "u5-14-dear-soldiers", num: 14, title: "My Dear Soldiers",
      blurb: "A direct address — speaking to the soldier.",
      syllabus: [
        "Form: address / open letter style.",
        "Use of second person ('you') for intimacy.",
        "Theme: gratitude expressed as personal speech.",
        "Pair with chapter 13 for an essay on the armed forces.",
      ],
    },
    {
      id: "u5-15-rani-abbakka", num: 15, title: "Rani Abbakka",
      blurb: "Queen Abbakka Chowta of Ullal — historical braveheart.",
      syllabus: [
        "Historical figure: Rani Abbakka of Ullal, Karnataka (16th century).",
        "Known for resisting Portuguese colonial expansion on the Tulu coast.",
        "Theme: courage, leadership, the role of women in Indian history.",
        "Genre: narrative non-fiction / historical piece.",
      ],
    },
  ],
  flashcards: [
    { term: "Personification", def: "Giving human qualities (speech, feeling) to non-human things, e.g. 'The river spoke'." },
    { term: "Refrain", def: "A line or phrase repeated regularly in a poem (e.g. 'try, try again')." },
    { term: "Rhyme scheme", def: "The pattern of end-rhymes in a poem, marked with letters like ABAB or AABB." },
    { term: "Stanza", def: "A group of lines in a poem, separated from other stanzas by a blank line." },
    { term: "Free verse", def: "Poetry without a fixed rhyme scheme or metre, e.g. Tagore's 'Paper Boats'." },
    { term: "Imagery", def: "Words that create pictures in the reader's mind by appealing to the senses." },
    { term: "Theme", def: "The central idea or message of a text (e.g. perseverance, courage)." },
    { term: "Narrator", def: "The voice telling the story — may be the author, a character, or a neutral observer." },
    { term: "First person", def: "Narration using 'I' / 'we' — the narrator is inside the story." },
    { term: "Third person", def: "Narration using 'he', 'she', 'they' — the narrator stands outside." },
    { term: "Autobiography", def: "A person's life story written by that person (e.g. Helen Keller's 'Three Days to See')." },
    { term: "Character sketch", def: "A short written portrait of a person — appearance, habits, qualities." },
    { term: "Tone", def: "The attitude of the writer toward the subject (reflective, humorous, reverent, etc.)." },
    { term: "Simile", def: "Comparison using 'like' or 'as', e.g. 'as brave as a lion'." },
    { term: "Metaphor", def: "Comparison without 'like'/'as', e.g. 'the summit was a test'." },
    { term: "Alliteration", def: "Repetition of the same starting consonant sound, e.g. 'paper boats'." },
    { term: "Synonym", def: "A word with the same or nearly the same meaning as another (brave / courageous)." },
    { term: "Antonym", def: "A word with the opposite meaning (brave / cowardly)." },
    { term: "Homophone", def: "Words that sound alike but mean different things (sea / see, write / right)." },
    { term: "Comprehension", def: "Reading a passage and answering questions to show you have understood it." },
  ],
  questions: [
    {
      id: "q-1", topic: "Poorvi structure",
      q: "How many Units does the Class 7 Poorvi textbook contain?",
      opts: ["5", "4", "10", "15"],
      a: "5",
      model: "Poorvi has 5 Units (Learning Together · Wit and Humour · Dreams and Discoveries · Travel and Adventure · Bravehearts) with 15 chapters in all.",
    },
    {
      id: "q-2", topic: "Three Days to See",
      q: "Who wrote 'Three Days to See'?",
      opts: ["Helen Keller", "Rabindranath Tagore", "Hugh Lofting", "Ruskin Bond"],
      a: "Helen Keller",
      model: "Helen Keller — deaf-blind American author and activist — wrote this essay imagining three days with sight.",
    },
    {
      id: "q-3", topic: "Paper Boats",
      q: "'Paper Boats' was written by:",
      opts: ["Rabindranath Tagore", "Sarojini Naidu", "Robert Frost", "William Wordsworth"],
      a: "Rabindranath Tagore",
      model: "Tagore wrote 'Paper Boats' — a poem about a child floating paper boats with the hope they will reach someone far away.",
    },
    {
      id: "q-4", topic: "Try Again",
      q: "The central message of the poem 'Try Again' is:",
      opts: ["Perseverance after failure", "Travelling the world", "Loving animals", "Respect for soldiers"],
      a: "Perseverance after failure",
      model: "The refrain 'try, try again' carries the poem's message — keep going after you fail.",
    },
    {
      id: "q-5", topic: "Dr. Dolittle",
      q: "Dr. Dolittle is famous in stories because he can:",
      opts: ["Talk to animals", "Fly", "Read minds", "Become invisible"],
      a: "Talk to animals",
      model: "Created by Hugh Lofting, Dr. Dolittle can speak with animals — the source of the chapter's humour and warmth.",
    },
    {
      id: "q-6", topic: "Rani Abbakka",
      q: "Rani Abbakka was a queen of:",
      opts: ["Ullal (Karnataka)", "Jhansi (UP)", "Mewar (Rajasthan)", "Travancore (Kerala)"],
      a: "Ullal (Karnataka)",
      model: "Rani Abbakka Chowta ruled Ullal on the Tulu coast and is remembered for resisting Portuguese expansion in the 16th century.",
    },
    {
      id: "q-7", topic: "Literary terms",
      q: "Calling the river 'speaking' in 'The Day the River Spoke' is an example of:",
      opts: ["Personification", "Alliteration", "Metaphor", "Simile"],
      a: "Personification",
      model: "Personification gives a non-human thing (a river) a human ability (speech).",
    },
    {
      id: "q-8", topic: "Literary terms",
      q: "'As brave as a lion' is a:",
      opts: ["Simile", "Metaphor", "Personification", "Refrain"],
      a: "Simile",
      model: "A simile uses 'like' or 'as' to compare. ('Brave like a lion' would also be a simile.)",
    },
    {
      id: "q-9", topic: "Literary terms",
      q: "Which figure of speech is 'The summit was a test'?",
      opts: ["Metaphor", "Simile", "Personification", "Alliteration"],
      a: "Metaphor",
      model: "A metaphor compares two things directly without 'like' or 'as'.",
    },
    {
      id: "q-10", topic: "Literary terms",
      q: "'Paper boats' starts both words with the same consonant sound — this is:",
      opts: ["Alliteration", "Rhyme", "Refrain", "Stanza"],
      a: "Alliteration",
      model: "Alliteration is repetition of the same starting consonant sound in nearby words.",
    },
    {
      id: "q-11", topic: "Narration",
      q: "A story told using 'I' and 'we' is in:",
      opts: ["First person", "Second person", "Third person", "No person"],
      a: "First person",
      model: "First-person narration places the narrator inside the story.",
    },
    {
      id: "q-12", topic: "Grammar",
      q: "Choose the correct article: '___ honest man is rare.'",
      opts: ["An", "A", "The", "No article"],
      a: "An",
      model: "'Honest' begins with a silent 'h' — vowel SOUND — so we use 'an'.",
    },
    {
      id: "q-13", topic: "Grammar",
      q: "Identify the verb: 'The soldier crossed the bridge.'",
      opts: ["crossed", "soldier", "bridge", "the"],
      a: "crossed",
      model: "A verb shows action. 'Crossed' is the action the soldier did.",
    },
    {
      id: "q-14", topic: "Grammar",
      q: "Plural of 'child' is:",
      opts: ["children", "childs", "childes", "childies"],
      a: "children",
      model: "'Child' is an irregular noun. Plural: children (not childs).",
    },
    {
      id: "q-15", topic: "Vocabulary",
      q: "An antonym of 'brave' is:",
      opts: ["cowardly", "courageous", "fearless", "bold"],
      a: "cowardly",
      model: "Antonyms are opposites. Brave ↔ cowardly. The other three are synonyms of brave.",
    },
    {
      id: "q-16", topic: "Vocabulary",
      q: "Which pair are homophones?",
      opts: ["see / sea", "big / large", "happy / sad", "run / ran"],
      a: "see / sea",
      model: "Homophones sound the same but have different meanings/spellings: see (look) / sea (ocean).",
    },
    {
      id: "q-17", topic: "Genre",
      q: "An author's life story written by the author themselves is called:",
      opts: ["Autobiography", "Biography", "Diary", "Novel"],
      a: "Autobiography",
      model: "Auto- = self. A biography about oneself is an autobiography (e.g. Helen Keller's writings).",
    },
    {
      id: "q-18", topic: "Travel",
      q: "Which chapter is grouped under Unit 4 'Travel and Adventure'?",
      opts: ["Conquering the Summit", "Rani Abbakka", "Try Again", "Paper Boats"],
      a: "Conquering the Summit",
      model: "Unit 4 chapters: 'The Tunnel', 'Travel', and 'Conquering the Summit'.",
    },
  ],
  mistakes: [
    { mistake: "Treating every poem as having a fixed rhyme scheme.", fix: "Some poems (like Tagore's 'Paper Boats') are free verse — no fixed rhyme. Read the rhythm first." },
    { mistake: "Confusing simile with metaphor.", fix: "Simile uses 'like' or 'as'. Metaphor compares directly without those words." },
    { mistake: "Writing 'a honest', 'a hour'.", fix: "Article depends on SOUND. Honest, hour begin with a vowel sound → 'an'." },
    { mistake: "Spelling 'childs', 'foots', 'mouses'.", fix: "Irregular plurals: child → children, foot → feet, mouse → mice." },
    { mistake: "Saying the narrator and the author are always the same person.", fix: "In fiction, the narrator is a chosen voice. The author is the real writer." },
    { mistake: "Confusing 'principle' and 'principal' / 'their' and 'there'.", fix: "Read the sentence aloud and check meaning. Principal = head of a school; principle = rule. Their = belonging; there = place." },
  ],
  cheat: [
    {
      heading: "Reading any prose chapter",
      bullets: [
        "Who is speaking?",
        "What changes for them by the end?",
        "One line worth quoting in your answer.",
      ],
    },
    {
      heading: "Reading any poem",
      bullets: [
        "Read it aloud once for the rhythm.",
        "Name the speaker and the listener.",
        "Note the rhyme scheme (ABAB / AABB / free verse).",
        "Pick one image — what senses does it touch?",
      ],
    },
    {
      heading: "Literary devices — quick spot",
      bullets: [
        "Simile: 'like' / 'as'.",
        "Metaphor: direct comparison, no 'like'.",
        "Personification: non-human thing acting human.",
        "Alliteration: same starting consonant repeating.",
        "Refrain: a line repeating across stanzas.",
      ],
    },
    {
      heading: "Articles in one breath",
      bullets: [
        "a = consonant SOUND (a book, a useful tool).",
        "an = vowel SOUND (an apple, an honest man, an hour).",
        "the = specific or already-known.",
      ],
    },
    {
      heading: "Three figures from Poorvi to remember",
      bullets: [
        "Helen Keller — 'Three Days to See' (American author, deaf-blind).",
        "Rabindranath Tagore — 'Paper Boats' (Indian poet, Nobel 1913).",
        "Rani Abbakka — 16th-century queen of Ullal, Karnataka.",
      ],
    },
  ],
};
