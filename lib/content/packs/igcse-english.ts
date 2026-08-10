// Cambridge IGCSE First Language English 0500 — full-course skills pack.
// English is a SKILLS subject: this pack teaches the assessment objectives,
// what each question actually rewards, and the sentence moves that earn marks
// — not a glossary of grammar terms.
//
// Verified 2026-08-11 against the two official Cambridge syllabus documents:
//   • 0500 syllabus for 2027, 2028 and 2029
//     https://www.cambridgeinternational.org/Images/718783-2027-2029-syllabus.pdf
//   • 0500 syllabus for 2024, 2025 and 2026 (outgoing — past papers use it)
//     https://www.cambridgeinternational.org/Images/635230-2024-2026-syllabus.pdf
//
// Structure below follows the 2027–2029 syllabus, which is what a Grade 10
// student starting in August 2026 will sit. Where the outgoing 2024–2026
// numbering differs (past papers and mark schemes still use it) the difference
// is flagged explicitly rather than silently smoothed over.
//
// All passages, quotations and prompts are ORIGINAL, written in the style of
// 0500 tasks. No past-paper text is reproduced.

import type { ExamPack } from "../exam-pack";

export const IGCSE_ENGLISH_PACK: ExamPack = {
  subjectId: "igcse-english",
  grade: 10,
  title: "First Language English — Reading & Writing · IGCSE",
  context: "Cambridge IGCSE 0500 · Paper 1 Reading + Paper 2 Directed Writing & Composition",
  highlights: [
    { label: "Syllabus", value: "0500 (2027–2029)" },
    { label: "Papers", value: "P1 Reading 50% · P2 Writing 50%" },
    { label: "Each paper", value: "2 hours · 80 marks" },
  ],
  pinnedRule: {
    heading: "Never name a device and stop",
    body: "Spotting 'this is a metaphor' earns nothing. Every analytical point must run technique → quotation → what the word literally suggests → effect on the reader. R4 is 'demonstrate understanding of how writers achieve effects and influence readers' — the marks live in the second half of that sentence, not the label at the front.",
  },
  reference: {
    label: "Cambridge IGCSE First Language English 0500 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-first-language-english-0500/",
  },
  plan: [
    { title: "Learn the five reading AOs by name", hint: "R1–R5 — every question maps to some of them" },
    { title: "Drill the analytical sentence", hint: "Technique → quotation → connotation → effect" },
    { title: "Practise the summary in 120 words", hint: "Own words, continuous prose, no examples" },
    { title: "Build one plan for each writing task", hint: "Directed · descriptive · narrative" },
    { title: "Time yourself at real word counts", hint: "250–350 directed · 350–450 composition" },
    { title: "Read the cheat sheet exam morning", hint: "Formula + checklists only" },
  ],

  topics: [
    // ---------------- PAPER 1 — READING ----------------
    {
      id: "p1-comprehension", paper: 1, num: 1, title: "Paper 1 Q1 — Comprehension: explicit and implicit meaning",
      blurb: "Twenty marks for reading Text A precisely and inferring what is not said outright.",
      syllabus: [
        "Question 1 is worth 20 marks and is a series of sub-questions on Text A, testing R1–R5. Answers are short — often one or two sentences.",
        "R1 (explicit) questions use 'give', 'identify', 'state'. Lift the exact detail; do not decorate it. One mark, one fact — extra waffle can contradict a correct answer and lose it.",
        "'Using your own words' means the marker checks for SUBSTITUTION. If the text says 'reluctant' and you write 'reluctant', you score zero for that word. Swap it: 'unwilling'.",
        "R2 (implicit) questions use 'explain what this suggests', 'what impression do you get'. You must state the inference AND anchor it to the wording that produced it.",
        "Mark allocation tells you how many separate points to make: a 3-mark answer needs three distinct ideas, not one idea said three ways.",
        "Examiners reward precision over length. A tight two-line answer that hits the point beats a paragraph that circles it.",
      ],
    },
    {
      id: "p1-summary", paper: 1, num: 2, title: "Paper 1 Q2 — The summary task (and the attitudes question)",
      blurb: "Select, compress, and rewrite in your own words — in no more than 120 words.",
      syllabus: [
        "Question 2 is worth 20 marks in total. 2(a) is the selective summary of Text B — 10 reading marks (R1, R2, R5) plus 5 writing marks (W1, W2, W3). 2(b) is a short answer on attitudes and opinions, worth 5 reading marks (R2, R3).",
        "The summary must be CONTINUOUS WRITING of no more than 120 words. No bullet points, no headings, no numbered list — the 5 writing marks depend on connected prose.",
        "Reading marks come from the number of relevant, distinct points you select. Aim for 12–15 points squeezed into the word limit; strong candidates average under 10 words per point.",
        "Every point must be in your own words. Technical terms with no synonym (a place name, 'photosynthesis') may be lifted; ordinary vocabulary may not.",
        "Cut ruthlessly: no introduction, no conclusion, no quotations, no examples, no repetition, no opinion of your own, nothing outside the focus the question names.",
        "2(b) is different in kind — it asks what the writer or a person in the text THINKS or FEELS, so you must infer an attitude and support it from the wording, not just retell what happened.",
      ],
    },
    {
      id: "p1-language", paper: 1, num: 3, title: "Paper 1 Q3 — Short answers and the language task",
      blurb: "The highest-skill question on the paper: how word choice and imagery act on a reader.",
      syllabus: [
        "Question 3 is worth 20 marks on Text C: 10 marks for a set of short-answer sub-questions (R1, R2, R4) and 10 marks for the language task (R1, R2, R4). The language task answer is about 200–250 words.",
        "The task gives you two selections from the text. You must choose your OWN words and phrases from within them and explain how the writer uses language to convey meaning and create effect.",
        "Choose powerful, connotation-rich words — usually verbs, adjectives and images. A weak choice ('the man walked') gives you nothing to say; a strong one ('the man lurched') gives you three sentences.",
        "The analytical move: state the technique, quote briefly, unpack the literal picture the word creates, then say what the reader is made to feel, see or believe — and why the writer wants that.",
        "Higher marks come from EXPLORING images rather than listing them: follow a metaphor through, note what it implies, offer a second reading if the wording supports one.",
        "Group words into a semantic field where you can ('crawled', 'seeped', 'oozed' — a field of slow, unwilling movement). Showing a pattern is worth more than three unlinked observations.",
        "Never write a technique-spotting list. Naming 'alliteration, simile, personification' with no effect explained is the single most common way to cap this answer in the lowest band.",
      ],
    },
    {
      id: "p1-extended", paper: 1, num: 4, title: "Paper 1 Q4 — Extended response to reading",
      blurb: "Write in role, in a set form, using and developing the detail of the text.",
      syllabus: [
        "Question 4 is worth 20 marks on Text C — 10 reading marks (R1, R2, R3, R5) plus 10 writing marks (W1, W2, W3, W4). You write about 250–300 words.",
        "The response is set in one of six text types: letter, report, journal, speech, interview or article. Each has its own conventions — a report needs neutral headings and factual tone; a journal needs private, reflective first person.",
        "Reading marks come from three things the question will name (for example: what you noticed, how you felt, what you would change). Cover ALL of them — an answer that develops one bullet superbly and ignores another loses half the reading marks.",
        "'Develop' means go beyond the text: infer consequences, motives and feelings that the text supports but does not state. Pure retelling caps you in the middle bands.",
        "Every developed idea must still be rooted in the text. Inventing facts the passage contradicts is penalised — the marks are for reading, not imagination.",
        "Voice and register carry the writing marks: sustain the persona from the first line to the last, and match the form's conventions (salutation and sign-off for a letter; audience address for a speech).",
      ],
    },

    // ---------------- PAPER 2 — WRITING ----------------
    {
      id: "p2-directed", paper: 2, num: 5, title: "Paper 2 Section A — Directed writing: audience, purpose, form",
      blurb: "Forty marks for turning source material into a persuasive, argued piece for a named reader.",
      syllabus: [
        "Section A is worth 40 marks. Q1(a) is a structured question worth 5 reading marks (R3, R4). Q1(b) is the directed writing itself — 10 reading marks (R1, R2, R3, R5) plus 25 writing marks (W1–W5). Writing is about 250–350 words, based on text(s) of 550–650 words.",
        "Q1(b) asks for a discursive, argumentative or persuasive speech, letter, article or report. Identify FORM, AUDIENCE and PURPOSE before you write a word — they decide register, structure and pronoun choice.",
        "The 25 writing marks dominate, but the 10 reading marks are only earned by USING, DEVELOPING and EVALUATING the source ideas — not by copying them across. Take an idea from the text, then judge it, extend it, or turn it against itself.",
        "Evaluation is the skill that separates the top band: 'The text claims the scheme is cheap, but cheapness is measured only over the first year — the replacement cost after that is never mentioned.'",
        "Persuasive tools that examiners reward when they are controlled: direct address, rhetorical question, tricolon, anecdote, concession-then-rebuttal ('Of course… but…'), and a deliberate short sentence to land a point.",
        "Structure it: hook → position → two or three developed arguments, each with a source idea plus your development → counter-argument answered → call to action that matches the audience.",
      ],
    },
    {
      id: "p2-descriptive", paper: 2, num: 6, title: "Paper 2 Section B — Descriptive writing",
      blurb: "Forty writing marks for creating a place and an atmosphere — with almost no plot.",
      syllabus: [
        "Section B offers four titles: two descriptive and two narrative. You choose one and write about 350–450 words. All 40 marks are writing marks (W1–W5).",
        "Description is not a story with adjectives added. There should be very little event: the movement comes from where the reader's attention travels, not from what happens next.",
        "Structure by camera work — wide shot → one telling detail → sound/smell → a person or object held in close-up → pull back. A cyclical ending (return to the opening image, changed) reads as deliberate craft under W2.",
        "Use all the senses, but weight them unevenly: sound and smell are less expected than sight and therefore more striking.",
        "Precision beats decoration. 'The gulls screamed over the fish crates' outperforms 'the beautiful majestic birds soared elegantly'. Piling up adjectives is a common W3 weakness, not a strength.",
        "Sustain a single dominant atmosphere and let vocabulary serve it. If the mood is desolation, every image should pull that way — that consistency is what W2 calls 'deliberate effect'.",
      ],
    },
    {
      id: "p2-narrative", paper: 2, num: 7, title: "Paper 2 Section B — Narrative writing",
      blurb: "A short story that is shaped, not just sequenced — in 350–450 words.",
      syllabus: [
        "The narrative titles carry the same 40 writing marks and the same 350–450 word guidance as the descriptive titles. There is no reading component.",
        "The word count is the constraint that decides everything: 350–450 words is ONE moment, not a life story. Two characters at most; one location; a span of minutes or hours.",
        "Shape the piece — opening that drops the reader mid-scene, a complication, a turn, a resolution that resonates. A flat chronological account of a day loses W2 marks even if the sentences are good.",
        "Craft moves that earn marks: start in medias res, withhold information, use a flashback or time shift with control, and end on an image or a line of dialogue rather than an explanation.",
        "Show through detail and behaviour rather than stating emotion. 'She read the message twice and put the phone face down' does more than 'she was upset'.",
        "Dialogue must be sparse and punctuated correctly — new speaker, new line. Long stretches of chat eat the word count and rarely gain credit.",
        "Avoid the endings examiners see hundreds of times: 'it was all a dream', a sudden death with no build-up, or a narrator who explains the moral in the final paragraph.",
      ],
    },

    // ---------------- CROSS-CUTTING CRAFT ----------------
    {
      id: "craft-structure", num: 8, title: "Craft — Structure and paragraphing",
      blurb: "W2: organise and structure facts, ideas and opinions for deliberate effect.",
      syllabus: [
        "Paragraph on a principle: new time, new place, new speaker, new idea. Random paragraph breaks read as accident; visible logic reads as control.",
        "Vary paragraph length on purpose. A one-sentence paragraph after three long ones lands like a drumbeat — but only works if it is rare.",
        "Use discourse markers to signal the shape of an argument: 'Admittedly… However… What follows from this is…'. In directed writing these are how a marker sees your structure at a glance.",
        "Openings that work: a concrete image, a startling fact, a question the piece then answers. Openings that don't: 'In this essay I will…', or restating the title.",
        "Endings that work: a return to the opening image, a shift in scale, a short decisive sentence. Endings that don't: a summary of what you just said.",
        "In reading answers, structure matters too — one point per paragraph, quotation embedded, effect explained. Markers award what they can find.",
      ],
    },
    {
      id: "craft-vocabulary", num: 9, title: "Craft — Vocabulary precision",
      blurb: "W3: a range of vocabulary appropriate to context — range means accuracy, not obscurity.",
      syllabus: [
        "Precision is the mark-earner: choose the word that is exactly right, not the longest word that is roughly right. A misused ambitious word costs more than a plain accurate one.",
        "Verbs carry description. Replace 'walked' with 'trudged', 'strode', 'shuffled', 'picked his way' — the verb does the work adjectives are usually asked to do.",
        "Connotation is the whole game in analysis and in writing. 'Thin', 'slender' and 'skeletal' denote the same body and imply three completely different judgements.",
        "Build usable semantic fields for common exam moods: decay, confinement, abundance, exhaustion, threat. Having six accurate words for one atmosphere beats forty scattered ones.",
        "Register must match audience: a speech to a school council and a formal report to a council committee cannot share the same vocabulary. W4 is assessed on exactly this fit.",
        "Cut intensifiers — 'very', 'really', 'extremely', 'so'. They almost always mean the noun or verb underneath is too weak.",
      ],
    },
    {
      id: "craft-sentences", num: 10, title: "Craft — Sentence variety and control",
      blurb: "W3 again: sentence structures used deliberately, not accidentally.",
      syllabus: [
        "Know the three shapes: simple (one clause), compound (two main clauses joined by and/but/or/so), complex (main clause plus subordinate clause).",
        "A short simple sentence among long ones creates emphasis, shock or finality. Its power comes entirely from the contrast, so it must be surrounded by longer sentences to work.",
        "Front a subordinate clause to delay the main point and build tension: 'Long after the last train had gone, and long after the lights had failed, she was still waiting.'",
        "Vary sentence OPENINGS as well as lengths — starting five consecutive sentences with 'I' or 'The' is the most visible weakness in mid-band writing.",
        "Listing in threes with no conjunction ('asyndeton') speeds a passage up; joining every item with 'and' ('polysyndeton') slows it and makes it feel relentless.",
        "In analysis you can and should comment on sentence structure, not just word choice — a run of short sentences at a moment of panic is a legitimate R4 point.",
      ],
    },
    {
      id: "craft-punctuation", num: 11, title: "Craft — Punctuation for effect and accuracy",
      blurb: "W5 is a whole assessment objective — accuracy is not a bonus, it is marks.",
      syllabus: [
        "Colon: introduces the payoff — a list, an explanation, or the thing that has been built up to. It promises the reader that what follows delivers.",
        "Semicolon: joins two complete, closely related sentences. It signals a link the full stop would break, and its correct use is a reliable top-band accuracy signal.",
        "Dash: an interruption or an afterthought — abrupt, informal, useful in persuasive writing and in a narrator's voice. A pair of dashes works like brackets but keeps emphasis.",
        "Ellipsis: trailing off, hesitation, or something left unsaid. Use it once in a piece, or it becomes a tic.",
        "Comma splice is the most common error at this level: two complete sentences joined by only a comma. Fix with a full stop, a semicolon, or a conjunction.",
        "Apostrophes: possession (the dog's lead / the dogs' leads) and omission (it's = it is). 'Its' as a possessive never takes one.",
        "Speech punctuation: comma or terminal mark inside the closing quotation mark, and a new line for each new speaker.",
      ],
    },
  ],

  flashcards: [
    { term: "Metaphor", def: "Says one thing IS another. Effect to claim: transfers the qualities of the second thing onto the first, so the reader judges it by borrowed associations — always explain which qualities transfer." },
    { term: "Simile", def: "Compares using 'like' or 'as'. Effect: makes an unfamiliar thing concrete and controls exactly how the reader pictures it; the choice of comparison reveals the writer's attitude." },
    { term: "Personification", def: "Gives human qualities to something non-human. Effect: makes an object or place feel alive, willing or threatening — the reader relates to it as a presence rather than a thing." },
    { term: "Pathetic fallacy", def: "Weather or landscape mirrors a mood. Effect: the setting pre-loads the reader's emotion before any event happens, so the atmosphere feels inevitable." },
    { term: "Sensory imagery", def: "Detail that appeals to sight, sound, smell, touch or taste. Effect: places the reader physically in the scene; sound and smell feel more intimate and unexpected than sight." },
    { term: "Semantic field", def: "A cluster of words drawn from the same area of meaning (illness, warfare, machinery). Effect: builds a sustained undertone across a passage — spotting the pattern is worth more than three unlinked words." },
    { term: "Connotation", def: "The associations a word carries beyond its dictionary meaning. This is where analytical marks actually come from: 'skeletal' and 'slender' denote the same thing and imply opposite judgements." },
    { term: "Onomatopoeia", def: "A word that imitates its sound ('clatter', 'hiss'). Effect: the reader hears the scene as they read it, making the moment immediate." },
    { term: "Alliteration", def: "Repeated initial consonant sounds. Never claim it 'makes it flow' — say what the sound does: hard plosives feel abrupt or violent, soft sounds feel gentle or gliding." },
    { term: "Sibilance", def: "Repeated s / sh sounds. Effect: whispering, hissing or seeping — often menace, secrecy, or something slow and unwelcome." },
    { term: "Juxtaposition", def: "Placing two contrasting things side by side. Effect: each sharpens the other, and the gap between them carries the writer's implied judgement." },
    { term: "Oxymoron", def: "Two contradictory words joined ('deafening silence'). Effect: captures a genuinely divided feeling that a single word could not." },
    { term: "Hyperbole", def: "Deliberate exaggeration. Effect: conveys the strength of a feeling rather than a fact, or creates comedy — say which, and why the writer wants it." },
    { term: "Understatement", def: "Deliberately playing something down. Effect: often more powerful than exaggeration — the reader supplies the missing intensity, or detects irony." },
    { term: "Tricolon (rule of three)", def: "Three parallel items or clauses. Effect: rhythm and a sense of completeness that makes an argument sound settled and hard to dispute." },
    { term: "Anaphora", def: "Repeating the same opening words across successive clauses or sentences. Effect: builds momentum and insistence — the reader feels the pressure accumulate." },
    { term: "Rhetorical question", def: "A question posed for effect, not for an answer. Effect: recruits the reader into agreeing with an answer the writer has already decided." },
    { term: "Direct address", def: "Speaking straight to the reader ('you', 'we'). Effect: 'you' makes it personal and accusatory; 'we' builds a shared group the reader is reluctant to leave." },
    { term: "Emotive language", def: "Word choice loaded to provoke feeling ('abandoned', 'betrayed'). Effect: shifts the reader from judging evidence to feeling a response — name the specific emotion targeted." },
    { term: "Dynamic verb", def: "A verb carrying strong physical action ('lurched', 'wrenched', 'seeped'). Effect: does the descriptive work adjectives are usually over-used for; the single highest-value word choice in creative writing." },
    { term: "Minor / short sentence", def: "A very short sentence among longer ones. Effect: emphasis, shock or finality — but only through contrast, so it must be surrounded by longer sentences." },
    { term: "Punctuation for effect", def: "Colon = the payoff is coming. Semicolon = two linked sentences held together. Dash = interruption or afterthought. Ellipsis = trailing off or something unsaid." },
    { term: "Cyclical structure", def: "Ending where the piece began, but changed. Effect: signals deliberate shaping under W2 and gives a short composition a sense of completeness." },
    { term: "Zoom / shifting focus", def: "Moving the reader's attention from wide view to a single detail (or the reverse). Effect: the structural engine of descriptive writing, which has little plot to carry it." },
    { term: "Register", def: "The level of formality and the vocabulary choices that suit a particular audience and purpose. Assessed directly by W4 — a school speech and a council report cannot share a register." },
    { term: "AO1 Reading (R1–R5)", def: "R1 explicit meanings · R2 implicit meanings and attitudes · R3 analyse, evaluate and develop facts, ideas and opinions with support from the text · R4 how writers achieve effects and influence readers · R5 select and use information for specific purposes." },
    { term: "AO2 Writing (W1–W5)", def: "W1 articulate experience and express what is thought, felt and imagined · W2 organise and structure for deliberate effect · W3 range of vocabulary and sentence structures · W4 language appropriate to purpose and to engage the audience · W5 accurate spelling, punctuation and grammar." },
    { term: "Command words", def: "Give / identify / state = lift one exact detail, no explanation. Explain = meaning PLUS why. Suggests / impression = inference anchored to wording. Using your own words = substitute the vocabulary or score zero. Summarise = select, compress, own words, continuous prose." },
  ],

  questions: [
    // --- Comprehension: explicit and implicit ---
    {
      id: "ie10-1", topic: "p1-comprehension",
      q: "Text A (original): 'Ravi had been promised a desk by the window. He was given a stool in the corridor, and told the arrangement was temporary.'\n\nUsing your own words, explain what this tells you about how Ravi was treated. [3]",
      model: "Three separate points, each substituted into my own words:\n\n1. An assurance he had been given was broken — what he actually received was not what he had been offered.\n2. His replacement position was markedly worse: a backless seat in a passageway instead of proper furniture in a room with a view, so he was pushed to the edge of the workplace both physically and in status.\n3. He was fobbed off rather than fixed: calling the situation short-lived postpones a solution instead of providing one, which suggests nobody intended to act soon.\n\nOwn-words check: 'promised' → 'assured', 'temporary' → 'short-lived'. Lifting 'temporary' straight from the text would score nothing for that point.",
      hint: "3 marks = 3 distinct ideas. Count them before you move on.",
    },
    {
      id: "ie10-2", topic: "p1-comprehension",
      q: "Text A ends (original): 'She thanked him for his suggestion, wrote it neatly in the minutes, and never mentioned it again.'\n\nExplain what this suggests about her attitude to his suggestion. [3]",
      model: "She is dismissive, but politely so — she manages the suggestion rather than considering it.\n\nThe three actions are placed in a deliberate order: the courtesy of 'thanked' and 'wrote' is cancelled by 'never mentioned it again', so the reader is led through apparent acceptance to actual burial. 'Neatly' is the key word: the care is purely administrative, and recording something properly is not the same as intending to act on it. The finality of 'never' implies this was a decision, not an oversight.\n\nThe implication is that politeness is being used as a technique of refusal — she avoids the conflict of saying no by performing agreement instead.",
    },
    {
      id: "ie10-3", topic: "p1-comprehension",
      q: "A question asks: 'Using your own words, explain what the writer means by \"the town had grown complacent\".' Which response can score?",
      opts: [
        "The town had grown complacent, which means it was complacent about its situation.",
        "The town had become smug and self-satisfied, assuming its success would continue without any further effort.",
        "The writer uses the word 'complacent' to describe the town, which is effective.",
        "The town was very complacent indeed and this is an important quotation.",
      ],
      a: "The town had become smug and self-satisfied, assuming its success would continue without any further effort.",
      model: "'Using your own words' means the marker looks for SUBSTITUTION. Only the second option replaces 'complacent' with genuine synonyms ('smug', 'self-satisfied') and then unpacks the implication ('assuming its success would continue without further effort'). The others either recycle the word, comment on the writer instead of explaining meaning, or add emphasis without content.",
    },

    // --- Summary ---
    {
      id: "ie10-4", topic: "p1-summary",
      q: "Rewrite these three lifted phrases in your own words, then join them into one summary sentence.\n(a) 'the equipment was in a state of near-permanent disrepair'\n(b) 'volunteers received no formal induction'\n(c) 'funding arrived erratically and often late'",
      model: "(a) The tools were almost always broken.\n(b) New helpers began with no proper training.\n(c) Money came unpredictably and frequently behind schedule.\n\nJoined as continuous prose: 'Tools were almost always broken, new helpers began with no training, and money came unpredictably and late.'\n\nThat is three separate reading points in nineteen words. In a 120-word summary you need roughly 12–15 points, so this compression rate — under ten words per point — is exactly the target. Note there are no quotations, no examples and no comment of my own: none of those earn credit in the summary.",
      hint: "Own words + continuous prose. The 5 writing marks disappear the moment you use bullet points.",
    },
    {
      id: "ie10-5", topic: "p1-summary",
      q: "Which of these belongs in a 0500 summary answer?",
      opts: [
        "A short introduction explaining what the passage is about",
        "A direct quotation from the passage to support a point",
        "A distinct relevant point, compressed and rewritten in your own words",
        "Your own view on whether the writer is being fair",
      ],
      a: "A distinct relevant point, compressed and rewritten in your own words",
      model: "The summary is assessed on selection (R1, R2, R5) and on organised, own-word continuous writing (W1, W2, W3). Introductions, conclusions, quotations, examples, repetition and personal opinion all consume words that could carry a scoring point. Every word must earn its place inside the 120-word ceiling.",
    },
    {
      id: "ie10-6", topic: "p1-summary",
      q: "The 2(b) short-answer question asks: 'Explain what the writer's attitude is towards the new visitor centre, and how you know.' Text B (original) says: 'The centre cost four million and is admired by everyone who has visited it — all six of them.'\n\nWrite a model answer. [3]",
      model: "The writer is scornful of the visitor centre and thinks the money was wasted.\n\nThe sentence is built as a trap: the first half sounds like genuine praise, listing the cost and the admiration, so the reader begins to accept the claim. The dash then delivers 'all six of them', which retrospectively destroys it — 'everyone' turns out to mean almost nobody. That is bathos, and the deflation is the point.\n\nPlacing the huge figure ('four million') next to the tiny one ('six') makes the contrast do the arguing, so the writer never has to state the criticism directly. The reader is made to reach the negative judgement themselves, which makes it harder to dispute.",
      hint: "2(b) tests attitude (R2) and evaluation with support (R3) — not what happened.",
    },

    // --- Language task ---
    {
      id: "ie10-7", topic: "p1-language",
      q: "Text C (original): 'The market woke slowly: shutters coughed open, crates thudded onto wet stone, and the smell of frying onions crawled along the alley.'\n\nExplain how the writer uses language here to convey the atmosphere. Use short quotations. [Model the analytical sentence.]",
      model: "'Shutters coughed open' is personification, and 'coughed' is doing two jobs at once. Literally it gives the metal a human, phlegmy reluctance, so the market is not opened but wakes unwillingly, as if it were an ageing body; at the same time the word carries its own sound — a short, harsh scrape — so the reader hears the alley before they see it.\n\nThe writer extends this with 'crawled'. A smell cannot crawl; the verb grants it slow, deliberate, almost animal movement, implying it seeps into the alley rather than drifting through it. The effect on the reader is claustrophobic: the air feels thick and the smell inescapable.\n\nTaken together, 'woke', 'coughed' and 'crawled' form a semantic field of sluggish, involuntary movement, so the market is presented as something reluctantly stirring rather than briskly opening — an unglamorous, heavy start to the day rather than a picturesque one.",
      hint: "Notice the shape: technique → quotation → literal picture → effect on reader → why the writer wants it.",
    },
    {
      id: "ie10-8", topic: "p1-language",
      q: "Text C (original): 'By four o'clock the queue had folded back on itself twice, a patient grey ribbon that shuffled forward an inch at a time and swallowed anyone who joined it.'\n\nAnalyse the writer's use of imagery. [Model answer.]",
      model: "The metaphor 'a patient grey ribbon' does most of the work. 'Ribbon' makes the queue a single continuous object rather than a group of individuals, so the people in it lose their separateness; 'grey' drains all colour and, by extension, all personality from them. 'Patient' is transferred from the people to the shape itself, which suggests the waiting has gone on so long that endurance has become the queue's defining characteristic.\n\n'Shuffled forward an inch at a time' reinforces this. 'Shuffled' implies dragging feet and no lifted heads — the movement of the exhausted or the defeated — and the precision of 'an inch' makes the progress feel measurable and pitiful.\n\nThe writer then shifts register with 'swallowed anyone who joined it', a second metaphor that turns the queue from an object into a predator. The reader is left with the impression that the crowd is not simply waiting but consuming people, which converts a mundane scene into something quietly threatening.",
    },
    {
      id: "ie10-9", topic: "p1-language",
      q: "A candidate writes: 'The writer uses alliteration in \"bitter black branches\" which makes the description flow and creates a good effect for the reader.' Rewrite it so it can score.",
      model: "'Bitter black branches' uses alliteration, and the repeated plosive 'b' gives each word a hard, clipped opening, so the phrase is spat out rather than spoken smoothly. The sound therefore works against any sense of gentleness in the tree.\n\nThe word choices reinforce it. 'Bitter' is transferred from taste to the tree itself, implying resentment as well as cold; 'black' removes all colour and life. Together they present the branches as hostile rather than merely bare, and the reader is positioned to find the landscape unwelcoming — preparing them for the isolation the narrator goes on to describe.\n\nWhat changed: the original names the device and then claims a vague effect ('flow', 'good effect'). The rewrite says what the SOUND does, what the WORDS imply, and what the READER is made to feel.",
      hint: "'Makes it flow' and 'creates a good effect' are the two phrases that cap the most answers.",
    },
    {
      id: "ie10-10", topic: "p1-language",
      q: "In an analysis question, which word choice from an original sentence gives you the most to write about — and why?\n'The old man walked to the bench, sat down, and looked at the harbour.'\nvs\n'The old man picked his way to the bench, folded himself onto it, and interrogated the harbour.'",
      model: "The second version, because every verb carries connotation the first version lacks.\n\n'Picked his way' implies caution, uneven ground and physical fragility. 'Folded himself' treats the body as something jointed and collapsible, suggesting stiffness and a loss of ease. 'Interrogated' is the strongest: it is borrowed from policing and implies suspicion, persistence and a demand for answers, so the man is not passively admiring the view but searching it — which raises the question of what he is looking for.\n\nThe lesson for the exam: when you select your own quotations for the language task, choose the words that are DOING something. 'Walked' and 'looked' are neutral and leave you nothing to say, so an answer built on them will stall after one sentence.",
    },
    {
      id: "ie10-11", topic: "p1-language",
      q: "Which technique is being used: 'The rain had not let up for three days, and the house sulked under it, windows dark, gutters overflowing'?",
      opts: ["Pathetic fallacy and personification", "Simile and hyperbole", "Onomatopoeia and sibilance", "Anaphora and tricolon"],
      a: "Pathetic fallacy and personification",
      model: "The persistent rain mirroring a low, oppressive mood is pathetic fallacy; 'the house sulked' gives an inanimate building a human emotion, which is personification. In an exam answer you would name both and then explain: 'sulked' implies a resentful, silent withdrawal, so the house seems to have taken the weather personally, and the reader is made to feel the atmosphere inside the house before entering it.",
    },

    // --- Extended response ---
    {
      id: "ie10-12", topic: "p1-extended",
      q: "Q4 asks you to write the journal entry of a shopkeeper on the evening the new bypass opened, covering: what you noticed that day, how you felt, and what you will do next. Write the opening two paragraphs of a top-band response. [Model.]",
      model: "Tuesday. Forty-one customers. I counted them, which tells you everything about the kind of day it was.\n\nThe bypass took the traffic at six this morning and it took the noise with it. I had spent nine years complaining about that noise — the lorries that rattled the jars on the top shelf, the horns at the junction — and this morning the street was so quiet I could hear the fridge. Mrs Dhillon came in at eleven, bought nothing, and stayed twenty minutes anyway. I think she came to check the shop was still open.\n\n[Why this scores:]\n• VOICE — private, clipped, reflective; a journal, not an article. The register is sustained from the first line.\n• READING MARKS — it uses text detail (the bypass opening, the lost passing trade) and DEVELOPS it: the counted customers and the audible fridge are inferences the text supports but does not state.\n• BULLET COVERAGE — paragraph one and two cover 'what you noticed' and begin 'how you felt'; the third paragraph must reach 'what you will do next' or half the reading marks are lost.\n• CRAFT — the short opening sentences and the deliberate irony of having complained about the noise show W2 shaping inside 250–300 words.",
      hint: "Cover every bullet the question names. Brilliance on one bullet does not pay for silence on another.",
    },
    {
      id: "ie10-13", topic: "p1-extended",
      q: "Q4 gives you a choice of form. What actually changes between writing it as a REPORT and writing it as a SPEECH?",
      model: "Almost everything except the content.\n\nREPORT — impersonal third person or a restrained first person; neutral, factual register; clear sections or a logical progression that a busy reader can scan; conclusions stated as recommendations ('The evidence suggests that…'). No rhetorical questions, no jokes, no direct appeals.\n\nSPEECH — direct address to a named audience from the opening line; inclusive pronouns ('we', 'our'); rhetorical questions and tricolons; short sentences for emphasis; a call to action at the end. Signposting is spoken, not visual ('Let me give you one example').\n\nThe reading marks are the same either way — they come from using and developing the text. The WRITING marks (W4 in particular) are earned or lost entirely on whether you sustained the conventions of the form you chose. Choose the form you can sustain for 250–300 words, not the one that sounds most impressive.",
    },

    // --- Directed writing ---
    {
      id: "ie10-14", topic: "p2-directed",
      q: "Two original texts disagree about closing the town's high street to cars. Text 1 (a shopkeepers' association letter) argues trade will collapse without parking. Text 2 (a resident's article) argues the street is unbreathable and unsafe.\n\nWrite a speech to the town council arguing for or against the closure. Show your PLAN, then your opening paragraph. [Model.]",
      model: "PLAN (two minutes, always before writing):\n• FORM: speech · AUDIENCE: town councillors — adults, sceptical, budget-conscious · PURPOSE: persuade them to approve the closure.\n• Position: support closure, but concede the parking problem is real rather than pretending it isn't.\n• Arg 1 — Text 2's safety point, DEVELOPED: near-misses are the measurable harm; a street cannot be an economic asset if people avoid walking down it.\n• Arg 2 — Text 1's trade fear, EVALUATED not ignored: it assumes shoppers arrive by car, an assumption the letter never tests.\n• Arg 3 — my own development: a phased trial converts an irreversible decision into a reversible one, which answers the councillors' actual fear.\n• Counter answered: deliveries — timed access windows.\n• Close: call to action sized to the audience — approve a six-month trial, not a permanent ban.\n\nOPENING PARAGRAPH:\n'Councillors, I want to begin by agreeing with the shopkeepers. They are right that a high street without customers is not a high street at all. Where I part company with them is on how those customers arrive — because the letter you received assumes, without ever testing it, that they come by car. Last month I stood on that pavement and counted. Two in every three walked.'\n\n[Why it scores: it concedes before it argues, which disarms a sceptical audience; it EVALUATES a source claim rather than repeating it (the untested assumption); and the short final sentence lands the point. That evaluation is what earns the 10 reading marks.]",
      hint: "Reading marks in 1(b) come from developing and evaluating source ideas — copying them across earns nothing.",
    },
    {
      id: "ie10-15", topic: "p2-directed",
      q: "A candidate's directed writing paragraph reads: 'Text 2 says the street is unsafe and that there have been many near-misses. This shows the street is dangerous.' Why does this score badly, and how do you fix it?",
      model: "It scores badly because it REPORTS the source instead of using it. 'Text 2 says X, this shows X' adds nothing to the text — the reading marks are for developing and evaluating (R3), and there is no development and no evaluation here.\n\nFixed:\n'The residents' article records repeated near-misses, and the significance of that is easily missed: a near-miss leaves no statistic behind. Nobody files a report when a child is pulled back onto the kerb, which means the official accident figures the council will consult almost certainly understate the risk. We are being asked to judge this street by the only evidence it does not generate.'\n\nWhat changed: the source idea is taken, then DEVELOPED (near-misses go unrecorded) and EVALUATED (so the council's own data is unreliable), and it is aimed at the specific audience. Same source, four times the credit.",
    },

    // --- Descriptive ---
    {
      id: "ie10-16", topic: "p2-descriptive",
      q: "Title: 'Describe a railway platform late at night.' Plan the structure, then write the opening paragraph. [Model.]",
      model: "PLAN — camera movement, not plot:\n1. WIDE: the empty length of the platform, the light beyond it.\n2. SOUND: what silence is made of here — the tannoy, the ticking rails.\n3. ONE DETAIL held close: an abandoned coffee cup; the timetable case with a cracked pane.\n4. A PERSON, described but never explained — no story, just presence.\n5. PULL BACK: return to the opening image, changed (the cyclical ending).\nDominant atmosphere: suspended time. Every image must serve it.\n\nOPENING PARAGRAPH:\n'The platform ran out into the dark and stopped, as if the town had lost interest in it halfway through. Two of the six lamps had failed, so the light came in patches, and between the patches the tarmac gave up entirely. Somewhere past the end of the canopy the rails ticked as they cooled, an unhurried metallic sound, like something counting down with no particular deadline in mind.'\n\n[Craft to notice: 'lost interest' personifies the town and sets the mood of abandonment in the first line; 'gave up entirely' is a deliberate exaggeration that reads as mood, not error; the simile 'counting down with no particular deadline' delivers the suspended-time atmosphere the whole piece will sustain. There is no event — and there should not be.]",
      hint: "Descriptive writing is judged on atmosphere and structure, not on what happens.",
    },
    {
      id: "ie10-17", topic: "p2-descriptive",
      q: "Which sentence is stronger descriptive writing, and why?\nA: 'The beautiful old market was full of wonderful, colourful, amazing things and it was a truly magical sight to behold.'\nB: 'Buckets of marigolds crowded the step, so orange in the grey morning that they looked switched on.'",
      model: "B, and the gap is enormous.\n\nA piles up evaluative adjectives — 'beautiful', 'wonderful', 'colourful', 'amazing', 'magical' — which TELL the reader to be impressed without ever showing them anything. The reader cannot picture a single object. This is the most common W3 weakness at this level: mistaking quantity of adjectives for range of vocabulary.\n\nB gives one precise image. 'Buckets' and 'marigolds' are specific nouns; 'crowded' is a dynamic verb that also implies abundance; the juxtaposition of orange against grey creates the contrast; and 'looked switched on' is an unexpected simile that makes the colour feel artificial in its intensity. It is shorter and does far more.\n\nRule: one exact noun and one working verb beat four adjectives every time.",
    },

    // --- Narrative ---
    {
      id: "ie10-18", topic: "p2-narrative",
      q: "Title: 'Write a story that ends with the words: and the gate was still open.' In 350–450 words, how do you plan it? [Model.]",
      model: "The word count decides everything. 350–450 words is ONE moment — two characters at most, one location, a span of minutes.\n\nPLAN:\n• Work BACKWARDS from the given ending. The gate must matter, so the story is about something that could leave or arrive through it.\n• OPEN IN MEDIAS RES — mid-action, no scene-setting preamble: 'She had checked it twice before dark. She was certain of that, and being certain was the problem.'\n• COMPLICATION (~120 words): the discovery. Show it through behaviour, not stated emotion — she counts the animals a second time; she does not call out.\n• TURN (~120 words): one piece of information that reframes what we thought. Perhaps she realises who left it open.\n• RESOLUTION (~80 words): no explanation, no moral. Land on the given line so it carries a new meaning.\n• Withhold. The reader should understand the situation about thirty words before the narrator admits it.\n\nWHAT TO AVOID: a whole day's events summarised; three named characters you have no words to develop; long dialogue exchanges; and the endings examiners see hundreds of times — 'it was all a dream', or a final paragraph explaining what the story meant.",
      hint: "One moment, not one life. The commonest narrative failure at 0500 is attempting too much plot.",
    },
    {
      id: "ie10-19", topic: "p2-narrative",
      q: "Rewrite this so it shows rather than tells: 'Amira was extremely nervous and very worried about the results. She felt scared and anxious as she waited.'",
      model: "'Amira read the envelope's address line three times. She put it on the table, squared it against the edge, and went to fill the kettle she had already filled.'\n\nWhat changed and why it scores:\n• Every emotion word is gone — 'nervous', 'worried', 'scared', 'anxious' were four labels for one feeling, and repetition of synonyms is not range under W3.\n• The behaviour carries the emotion: re-reading, aligning the envelope, and repeating a pointless task are all displacement activity, and the reader diagnoses the anxiety themselves.\n• 'The kettle she had already filled' is the load-bearing detail — it shows she is not tracking her own actions.\n• The intensifiers 'extremely' and 'very' have disappeared. They almost always signal that the verb or noun underneath is too weak.",
    },

    // --- Craft ---
    {
      id: "ie10-20", topic: "craft-punctuation",
      q: "Correct and improve, then explain the punctuation choices: 'The hall was empty, the chairs were stacked against the wall, nobody had told him the meeting was cancelled.'",
      model: "Corrected and improved:\n'The hall was empty; the chairs were stacked against the wall. Nobody had told him the meeting was cancelled.'\n\nThe original is a comma splice — three complete sentences joined by commas only. This is the most frequent accuracy error at this level and it costs W5 marks directly.\n\nThe choices:\n• SEMICOLON between the first two clauses, because they are closely linked observations of the same scene; a full stop would sever a connection the reader needs.\n• FULL STOP before the third, because it is a shift from what he sees to what he realises, and the break makes the realisation land.\n\nA sharper alternative uses a colon: 'The hall was empty, the chairs stacked against the wall: nobody had told him the meeting was cancelled.' The colon presents the final clause as the explanation the first half was building towards — which is exactly what a colon is for.",
      hint: "Comma splice, apostrophes and speech punctuation are the three W5 errors examiners flag most.",
    },
  ],

  mistakes: [
    { mistake: "Naming the device and stopping — 'the writer uses a simile here'.", fix: "The label is worth nothing on its own. Always continue: what the words literally suggest, then what the reader is made to feel, then why the writer wants that." },
    { mistake: "Feature-spotting lists: 'There is alliteration, personification and a rhetorical question.'", fix: "Three named devices with no effect explained scores lower than ONE image explored properly. Depth beats coverage in the language task, every time." },
    { mistake: "Vague effect claims — 'it makes it flow', 'it creates a vivid image', 'it engages the reader'.", fix: "These are the phrases that cap the most answers. Say WHAT image, WHAT the reader feels, and WHY that matters to the writer's purpose." },
    { mistake: "Retelling the passage instead of analysing it.", fix: "If a sentence of yours could be replaced by 'and then this happened', delete it. Analysis explains HOW the writer makes the reader respond, not what occurs." },
    { mistake: "Copying words from the text when the question says 'in your own words'.", fix: "The marker is checking for substitution. Change the vocabulary — keep only proper nouns and technical terms with no synonym." },
    { mistake: "Ignoring the word count — a 200-word summary, or a 700-word composition.", fix: "The summary is capped at 120 words; directed writing is about 250–350; compositions about 350–450. Over-writing wastes time you need elsewhere and weakens the structure marks; count your words in practice until you know your own handwriting's rate." },
    { mistake: "Writing a story when the title asks you to DESCRIBE.", fix: "Descriptive titles want atmosphere and almost no plot. If your description has a beginning, a crisis and a resolution, you have answered a different question — and you cannot score for narrative craft on a descriptive title." },
    { mistake: "Answering only some of the bullets in the extended response.", fix: "The reading marks are distributed across the bullets the question names. Superb coverage of two out of three still loses a third of them. Tick each bullet off as you write." },
    { mistake: "Repeating source ideas in directed writing instead of developing them.", fix: "'Text 1 says X, which shows X' earns no reading marks. Take the idea, extend it, question its assumptions, or judge its consequences — that is what R3 means by 'analyse, evaluate and develop'." },
    { mistake: "Piling up adjectives to sound descriptive.", fix: "'Beautiful, amazing, magical' tells the reader nothing. One exact noun plus one working verb outperforms four adjectives — precision is what W3 rewards, not decoration." },
    { mistake: "Comma splices — joining complete sentences with a comma.", fix: "Use a full stop, a semicolon, or add a conjunction. W5 is a full assessment objective, not a bonus; accuracy errors cost marks in every writing question on both papers." },
    { mistake: "Spending too long on Paper 1 Q1 and running out of time for Q4.", fix: "Q1, Q2, Q3 and Q4 are worth 20 marks each in the 2027–2029 papers — equal weight. Give each roughly a quarter of your writing time and move on when the clock says so, even mid-sentence." },
  ],

  cheat: [
    {
      heading: "The analytical sentence — memorise this shape",
      bullets: [
        "TECHNIQUE → QUOTATION → LITERAL PICTURE → EFFECT ON READER → WHY THE WRITER WANTS IT.",
        "Template: 'The writer describes X as \"…\", a [technique] which literally suggests …, so the reader is made to [feel/see/imagine] …, reinforcing …'",
        "Useful verbs for the effect clause: suggests, implies, conveys, positions the reader to, forces the reader to, undercuts, reinforces.",
        "Banned phrases — they signal an empty point: 'makes it flow', 'creates a vivid image', 'engages the reader', 'makes you want to read on', 'is very effective'.",
        "Depth beats breadth: one image explored for four sentences outscores four devices named in one.",
        "If the wording supports a second reading, offer it — exploring alternative interpretations is a top-band signal.",
      ],
    },
    {
      heading: "Paper 1 Reading — 2 hours, 80 marks, what each question wants",
      bullets: [
        "Three texts, combined about 1400 words. Spend about 15 minutes reading them. Dictionaries are not allowed.",
        "Q1 Comprehension, 20 marks (Text A) — short answers on explicit and implicit meaning. Mark count = number of separate points.",
        "Q2 Summary task, 20 marks (Text B) — 2(a) selective summary, no more than 120 words, 10 reading + 5 writing marks. 2(b) short answer on attitudes and opinions, 5 marks.",
        "Q3 Short answers + language task, 20 marks (Text C) — 10 marks of short answers, then the language task in about 200–250 words for 10 marks.",
        "Q4 Extended response to reading, 20 marks (Text C) — about 250–300 words as a letter, report, journal, speech, interview or article. 10 reading + 10 writing marks.",
        "Equal marks means equal time. Roughly 25 minutes of writing each after the reading period.",
        "PAST-PAPER WARNING: papers from 2024–2026 use different numbering — Q1 was comprehension AND summary (30 marks), Q2 was short answers plus the language task (25), Q3 was the extended response (25). The SKILLS are identical; only the labels and mark splits moved.",
      ],
    },
    {
      heading: "Summary task — the 120-word checklist",
      bullets: [
        "Underline the focus in the question ('the difficulties the volunteers faced') and select ONLY points that match it.",
        "List your points in the margin first. Aim for 12–15 distinct ideas.",
        "Rewrite each in your own words before you write the paragraph, not while you are writing it.",
        "Continuous prose only — no bullets, no headings, no numbering. The 5 writing marks depend on it.",
        "Cut on sight: introduction, conclusion, quotations, examples, statistics you were not asked for, repetition, your own opinion.",
        "Target under 10 words per point. Join points with commas and 'and' rather than starting a new sentence each time.",
        "Count the words. Over 120 and the tail of your answer stops earning.",
      ],
    },
    {
      heading: "Directed writing — the two-minute plan (about 250–350 words)",
      bullets: [
        "Write FORM / AUDIENCE / PURPOSE at the top of your plan and keep glancing at it.",
        "Take a position in one line. Sitting on the fence loses the persuasive marks.",
        "Three arguments. Each = a source idea + YOUR development or evaluation of it. Copying the source across earns nothing.",
        "Evaluation move: name the assumption the source never tests, or the consequence it never follows through.",
        "Concede one point early ('The shopkeepers are right that…') then rebut — it disarms a sceptical audience.",
        "Toolkit: direct address, rhetorical question, tricolon, one short sentence to land a point, one concrete example.",
        "Close with a call to action sized to the audience's actual power — what can THIS reader decide?",
      ],
    },
    {
      heading: "Composition — plan templates (about 350–450 words)",
      bullets: [
        "Four titles are offered: two descriptive, two narrative. Choose the one you have MATERIAL for, not the one that sounds clever.",
        "DESCRIPTIVE structure = camera work: wide shot → sound and smell → one detail in close-up → a figure, unexplained → pull back to the opening image, changed.",
        "Descriptive rule: almost no plot. Movement comes from where attention travels, not from what happens next. Pick one dominant atmosphere and make every image serve it.",
        "NARRATIVE structure = one moment: open in medias res → complication → turn → resolution that resonates. Two characters maximum, one location, minutes or hours — never a whole day.",
        "Narrative rule: show through behaviour, not stated emotion. 'She read it twice and put the phone face down' beats 'she was upset'.",
        "Endings to avoid: 'it was all a dream', an unearned death, or a final paragraph explaining the moral.",
        "Reserve the last three minutes to reread for comma splices, apostrophes and speech punctuation — that is pure W5 marks.",
      ],
    },
    {
      heading: "Punctuation and sentences for effect",
      bullets: [
        "Colon : the payoff is coming — a list, an explanation, or the thing the sentence has been building towards.",
        "Semicolon ; two complete, closely related sentences held together. Correct use is a reliable top-band signal.",
        "Dash — interruption or afterthought; abrupt and slightly informal. A pair works like brackets but keeps the emphasis.",
        "Ellipsis … trailing off, hesitation, something unsaid. Once per piece, or it becomes a tic.",
        "Short simple sentence: emphasis, shock, finality — powered entirely by contrast, so surround it with longer ones.",
        "Fronted subordinate clause delays the main point and builds tension: 'Long after the last train had gone, she was still waiting.'",
        "Vary your sentence OPENINGS, not just their lengths. Five sentences starting 'The' is the most visible mid-band tell.",
      ],
    },
    {
      heading: "Exam-morning facts and moves",
      bullets: [
        "Paper 1 Reading: 2 hours, 80 marks, 50% of the grade. Paper 2 Directed Writing and Composition: 2 hours, 80 marks, 50%. (Some centres do Component 3 coursework instead of Paper 2.)",
        "Word counts: summary no more than 120 · language task about 200–250 · extended response about 250–300 · directed writing about 250–350 · composition about 350–450.",
        "AO1 Reading is 50% of the qualification and AO2 Writing the other 50% — but within Paper 1 it is 80% reading, and within Paper 2 it is 80% writing.",
        "Reading AOs: R1 explicit · R2 implicit and attitudes · R3 analyse, evaluate and develop with support · R4 how writers achieve effects · R5 select for purpose.",
        "Writing AOs: W1 express · W2 structure for deliberate effect · W3 vocabulary and sentence range · W4 language for purpose and audience · W5 spelling, punctuation, grammar.",
        "Annotate the insert as you read: circle powerful verbs and images for the language task, bracket summary-relevant material for Q2.",
        "Plan every extended answer for two minutes. An unplanned composition loses W2 marks that a plan would have secured for free.",
        "Leave three minutes at the end of each paper to proofread for comma splices, apostrophes and missing speech punctuation.",
      ],
    },
  ],
};
