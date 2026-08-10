// Cambridge Lower Secondary Global Perspectives (1129) and ICT, Stage 7.
//
// Grade mapping: CNS Amanora runs Cambridge Primary as Grades 1–5 and Cambridge
// Lower Secondary as Grades 6–8, so a Grade 6 learner sits Stage 7. Both packs
// are registered with grade: 6 (the app matches packs by learner grade) while
// all learner-facing copy says "Stage 7".
//
// Codes verified 2026-08-11 against the Cambridge Lower Secondary curriculum
// subject list: Global Perspectives 1129, Computing 0860, Digital Literacy 0082,
// Science 0893, Mathematics 0862, English 0861. The school timetables its course
// as "ICT", which sits across Cambridge's Computing (0860) and Digital Literacy
// (0082) frameworks, so the ICT pack draws on both and says so.
//
// Global Perspectives is a SKILLS course, not a content course. Cambridge assesses
// six skills — research, analysis, evaluation, reflection, collaboration,
// communication — and the global topics are only the material you practise them
// on. The topics below are therefore built around the skills, and the questions
// ask the learner to perform a reasoning move rather than recall a fact. The
// official topic list (23 areas) is sampled here for age-appropriate ones only.
//
// Deliberately left out: IGCSE Global Perspectives (0457) machinery — team
// project reports, individual research word counts, the Personal Element — none
// of which exists at Stage 7. For ICT: binary and hexadecimal number systems,
// logic gates, HTML/CSS authoring and network hardware detail, all of which sit
// later. Stage 7 programming here is written as language-neutral pseudocode and
// flowcharts, since schools run Stage 7 in Scratch, Python or both.
//
// There is no external exam at Stage 7 — Checkpoint is sat at the end of Stage 9
// — so both packs are framed as owning the year, not cramming for a paper.
// Question stems are original.

import type { ExamPack } from "../exam-pack";

// =========================
// GLOBAL PERSPECTIVES — framework 1129, Stage 7
// =========================
export const CLS7_GLOBAL_PERSPECTIVES_PACK: ExamPack = {
  subjectId: "cls-globalperspectives",
  grade: 6,
  title: "Global Perspectives — Stage 7 · Cambridge Lower Secondary",
  context: "Framework 1129 · Stage 7 (Grade 6) · a skills course, not a facts course · CNS Amanora",
  highlights: [
    { label: "Framework", value: "1129" },
    { label: "Stage", value: "Stage 7 = Grade 6" },
    { label: "Six skills", value: "Research · Analysis · Evaluation · Reflection · Collaboration · Communication" },
  ],
  pinnedRule: {
    heading: "Never a claim without evidence. Never a topic with only one perspective.",
    body: "Two habits carry this whole subject. (1) Every time you write or say something that could be argued with, immediately add where it came from — 'according to ___'. (2) Every time you describe what people think about an issue, give at least two different perspectives, and say who holds them. Almost every mark you can lose at Stage 7 is lost by breaking one of those two rules.",
  },
  reference: {
    label: "Cambridge Lower Secondary Global Perspectives (1129) — curriculum page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/cambridge-lower-secondary-global-perspectives/",
  },
  plan: [
    { title: "Learn the six skills by name", hint: "Everything else in this subject hangs off them" },
    { title: "Walk the 8 topics", hint: "Tag each skill: solid / shaky / not yet" },
    { title: "Run the source-credibility drill", hint: "Who · when · why · evidence · cross-check" },
    { title: "Practise the three perspectives", hint: "Take any topic, force out personal / national / global" },
    { title: "Write one paragraph with evidence", hint: "Claim → evidence → source → so what" },
    { title: "Reflect honestly, not politely", hint: "What changed in your thinking, and why" },
  ],

  topics: [
    {
      id: "how-gp-works", num: 1, title: "How Global Perspectives Actually Works",
      blurb: "Why this subject has no textbook to memorise — and what is being marked instead.",
      syllabus: [
        "This is a skills course. You are not assessed on how much you know about water or climate — you are assessed on six skills: research, analysis, evaluation, reflection, collaboration and communication. The global topics are the practice material.",
        "The year is built from Challenges rather than chapters. In a Challenge you pick an issue, research it, look at it from several perspectives, work with other people, produce something, and then reflect on how it went.",
        "Most questions here have no single right answer — but they absolutely have better and worse answers. A better answer is the one supported by stronger evidence and by more than one perspective.",
        "You are allowed to have an opinion. You are not allowed to stop there. The mark is for what you do with the opinion: support it, test it against the other side, and be willing to change it.",
        "Where this leads: at the end of Stage 9 there is a Cambridge Lower Secondary Checkpoint Global Perspectives assessment, marked by teachers and moderated by Cambridge, reported as Bronze, Silver or Gold. Nothing external happens at Stage 7 — Stage 7 is where you build the habits that get graded later.",
      ],
    },
    {
      id: "research", num: 2, title: "Research — Asking, Finding, Recording",
      blurb: "A good answer starts with a good question, and good research is mostly good note-keeping.",
      syllabus: [
        "A researchable question is narrow, specific and answerable with evidence. 'Is pollution bad?' fails all three. 'How has traffic changed air quality in Pune since 2015?' passes all three.",
        "Narrow a question with the four handles: WHERE (which place), WHEN (which years), WHO (which group of people), WHAT EXACTLY (which measurable thing).",
        "Sources come in kinds. A primary source is first-hand — a survey you ran, an interview, a photograph, an official set of figures. A secondary source describes or comments on someone else's work — a news article, a textbook, an encyclopedia page.",
        "Take notes in your own words as you go, never by copying. For each note write the three things you will need later: what it says, who said it, and when.",
        "Cite where information came from: author or organisation, title, website or publication, and the date. Copying someone's words or ideas without saying where they came from is plagiarism, even if you did not mean to.",
        "Keep track of what you still do not know. A research log with a 'still missing' column is worth more than a pile of tabs.",
      ],
    },
    {
      id: "analysis", num: 3, title: "Analysis — Perspectives, Fact vs Opinion, Cause & Consequence",
      blurb: "Taking an issue apart: who sees it how, what is checkable, and what leads to what.",
      syllabus: [
        "Three levels of perspective, and you should be able to produce all three on any topic: personal (me, my family, my school), local or national (my city, my country), global (people in other countries, or the world as a whole).",
        "A perspective is not the same as an opinion. A perspective is a point of view held for reasons that come from someone's situation — a farmer, a city commuter and a factory owner see water differently because their lives depend on it differently.",
        "Fact vs opinion: a fact can be checked against evidence and could in principle be shown false. An opinion states what someone thinks or values. 'India has more people than Japan' is a fact. 'India should invest more in trains' is an opinion — a reasonable one, but still an opinion.",
        "Watch for the disguised opinion: statements with words like best, worst, should, unfair, too much, everyone knows are opinions wearing a fact's clothes.",
        "Causes and consequences: a cause is what led to the situation, a consequence is what follows from it. Most real issues have several of each, and one consequence is often the cause of the next thing.",
        "Look for similarities and differences between perspectives, not just a list of them. 'Both groups want cleaner water, but they disagree about who should pay' is analysis. Two separate paragraphs describing each group is not.",
      ],
    },
    {
      id: "evaluation", num: 4, title: "Evaluation — Is This Source Any Good?",
      blurb: "Judging evidence instead of collecting it: credibility, bias, and weighing both sides.",
      syllabus: [
        "Five questions for any source: WHO wrote it (a named person or organisation, with relevant expertise?), WHEN (is it still current?), WHY (to inform, to sell, to persuade, to entertain?), WHAT EVIDENCE does it give (numbers, studies, named sources — or nothing?), and does anyone else independent say the same thing?",
        "Bias means a source leans one way — usually because of who is paying for it, who wrote it, or what they want you to do next. Biased does not automatically mean false; it means you should check it against a source with different interests.",
        "Web-address endings are a weak clue, not proof. A .org or .gov address is often more accountable, but anyone can write anything on any domain, and a good .com source beats a bad .org one.",
        "Treat a statistic as unfinished until you know its source, its sample and its date. '9 out of 10 people agree' means nothing until you know who asked, how many people, and which people.",
        "Weighing evidence means putting the strongest points on both sides next to each other and saying which side is better supported and why. 'Both sides have good points' with nothing after it is not evaluation.",
        "Evaluate your own work too: which of your sources was weakest, and what would you have needed to be more confident?",
      ],
    },
    {
      id: "reflection", num: 5, title: "Reflection — Thinking About Your Own Thinking",
      blurb: "The skill people fake most — and the one that is easiest to do properly once you know the shape.",
      syllabus: [
        "Reflection is about YOU, not about the topic. It answers: what did I think before, what do I think now, and what caused the change?",
        "The three-part shape: BEFORE (what I assumed at the start) → WHAT HAPPENED (the source, conversation or result that shifted me) → NOW (what I think, and how confident I am).",
        "Reflect on the work as well as the ideas: which part was hardest, what I would do differently next time, and what I now know about how I work.",
        "Personal reflection means noticing your own starting point — where your first opinion came from, and whether you had only ever heard one side.",
        "Changing your mind is evidence of good thinking, not weakness. So is not changing your mind for a stated reason. What is weak is finishing exactly where you started without ever having tested it.",
        "'I enjoyed this project and learnt a lot' is not reflection. It has no before, no cause and no now.",
      ],
    },
    {
      id: "collaboration", num: 6, title: "Collaboration — Working as a Team on Purpose",
      blurb: "A group is not a team until roles, deadlines and disagreements are handled deliberately.",
      syllabus: [
        "Start every team task by agreeing three things out loud: who is doing what, by when, and how you will check on each other. Written down, in one place everyone can see.",
        "Contributing fairly is not the same as doing an equal number of slides. It means everyone takes on work that matters to the outcome, matched to what they are good at and what they need to practise.",
        "Active listening: let the person finish, say back what you understood in your own words, then respond. Most team arguments are actually two people answering questions the other did not ask.",
        "Disagree with the idea, never with the person. 'I don't think that source is strong enough, because it has no date' works. 'That's a stupid point' ends the conversation.",
        "Resolving disagreement: find what you both actually agree on first, identify the exact point where you split, then decide it with evidence or with a fair rule (vote, compromise, or test both and compare).",
        "Team reflection is part of the skill: what did the team do well, what slowed it down, and what would you set up differently next time?",
      ],
    },
    {
      id: "communication", num: 7, title: "Communication — Making the Argument Land",
      blurb: "Structuring what you found so an audience can follow it and believe it.",
      syllabus: [
        "The paragraph shape that never fails: CLAIM (what you say) → EVIDENCE (the fact or figure) → SOURCE (where it came from) → SO WHAT (why it matters to your question).",
        "Structure a whole argument as: introduction (the question and why it matters) → the perspectives and evidence → the strongest counter-argument, answered → conclusion that comes from the evidence, not from your first instinct.",
        "A counter-argument is the best case against you, stated fairly, then answered. Including one makes your argument stronger, not weaker — leaving it out makes you look like you never checked.",
        "Match the audience: Grade 3 learners, your class, and a panel of teachers need different words, different examples and different amounts of detail. Same evidence, different delivery.",
        "Presenting: slides carry key words and images, your voice carries the sentences. Nobody can read your slide and listen to you at the same time.",
        "Always be ready to say where each figure came from. If you cannot, cut the figure.",
      ],
    },
    {
      id: "topics", num: 8, title: "The Global Topics You Practise On",
      blurb: "The issues Stage 7 uses as raw material — worth having one example ready for each.",
      syllabus: [
        "Water, food and agriculture — clean water and sanitation, who has access, water for farming vs water for cities. A topic where personal, national and global perspectives are easy to separate.",
        "Climate change, energy and resources — causes and consequences, and what individuals can change versus what only governments can change.",
        "Transport, travel and tourism — how people move, what that does to air quality and cities, and who benefits from visitors. The everyday, local face of the climate topic.",
        "Education for all — who misses out on school and why, and what the different reasons (cost, distance, work, gender, disability) imply about the different solutions.",
        "Health and wellbeing, and sport and recreation — clean water, food, sleep, mental wellbeing and access to healthcare; who gets to play, what sport costs, and what communities get from it.",
        "The digital world, and change in culture and communities — access to devices and the internet, what changes when a community comes online, and how languages, crafts and traditions are kept alive while a place modernises.",
      ],
    },
  ],

  flashcards: [
    { term: "The six skills", def: "Research, analysis, evaluation, reflection, collaboration, communication — what Global Perspectives actually assesses." },
    { term: "Perspective", def: "A point of view held for reasons that come from someone's situation — not just a random opinion." },
    { term: "Three levels of perspective", def: "Personal (me and my family) · local/national (my city or country) · global (other countries, or the world)." },
    { term: "Fact", def: "A statement that can be checked against evidence and could be shown to be false." },
    { term: "Opinion", def: "A statement of what someone thinks or values. Words like best, should, unfair and too much usually signal one." },
    { term: "Researchable question", def: "Narrow, specific and answerable with evidence — pinned down by where, when, who and what exactly." },
    { term: "Primary source", def: "First-hand evidence: your own survey, an interview, a photograph, an official set of figures." },
    { term: "Secondary source", def: "Someone else describing or commenting on first-hand evidence: a news article, a textbook, an encyclopedia entry." },
    { term: "Citation", def: "Saying where information came from — who, what, where and when. Required even when you reword it." },
    { term: "Plagiarism", def: "Using someone's words or ideas without saying where they came from, deliberately or accidentally." },
    { term: "Credibility", def: "How much a source can be trusted — judged on who, when, why, what evidence, and whether others agree." },
    { term: "Bias", def: "A source leaning one way because of who wrote it or who paid for it. Biased ≠ false, but it does need cross-checking." },
    { term: "Cross-checking", def: "Finding the same claim in an independent source with different interests. The single fastest credibility test." },
    { term: "Evidence", def: "The checkable thing that supports a claim — a figure, a study, a document, an observation." },
    { term: "Claim", def: "A statement you are asking someone to accept. It needs evidence attached or it is just an assertion." },
    { term: "Counter-argument", def: "The strongest case against your position, stated fairly and then answered." },
    { term: "Cause", def: "What led to a situation. Most real issues have several causes, not one." },
    { term: "Consequence", def: "What follows from a situation. One consequence often becomes the cause of the next thing." },
    { term: "Analysis", def: "Taking an issue apart — perspectives, fact vs opinion, causes and consequences, similarities and differences." },
    { term: "Evaluation", def: "Judging how good the evidence and sources are, and weighing both sides to say which is better supported." },
    { term: "Reflection", def: "What I thought before, what changed it, what I think now — and what I would do differently." },
    { term: "Active listening", def: "Let them finish, say back what you understood in your own words, then respond." },
    { term: "Compromise", def: "A decision both sides can accept, reached by finding the shared aim first and the exact disagreement second." },
    { term: "Claim–Evidence–Source–So what", def: "The four-move paragraph that turns an opinion into an argument." },
    { term: "Challenge", def: "How the Global Perspectives year is organised — an issue you research, discuss, produce something about, and reflect on." },
    { term: "Checkpoint Global Perspectives", def: "The Stage 9 assessment, teacher-marked and Cambridge-moderated, reported as Bronze, Silver or Gold. Nothing external at Stage 7." },
  ],

  questions: [
    {
      id: "gp7-1", topic: "research",
      q: "A classmate has chosen the research question: 'Is plastic bad?' Explain two reasons this question will not work, then rewrite it as a researchable question.",
      model: "Two problems: (1) It is far too broad — 'plastic' covers everything from syringes to carrier bags, so no piece of evidence could ever answer it. (2) 'Bad' is a value word, not something you can measure, so different people would answer it differently with the same facts. Rewritten, using where/when/who/what exactly: 'How has the ban on single-use plastic bags changed the amount of plastic waste collected in Pune since it was introduced?' That names a place, a time, and a measurable thing.",
      hint: "Which words in the question could not be measured?",
    },
    {
      id: "gp7-2", topic: "research",
      q: "Which of these is a PRIMARY source for a project on how much water your school uses?",
      opts: [
        "A news article about water shortages in Indian cities",
        "Meter readings you record from the school's water supply each morning for a week",
        "A textbook chapter on the water cycle",
        "A blog post summarising a government water report",
      ],
      a: "Meter readings you record from the school's water supply each morning for a week",
      model: "Primary means first-hand — evidence you or the original observer collected directly. Your own meter readings are primary. The article, the textbook and the blog post are all secondary: they describe or comment on someone else's information.",
    },
    {
      id: "gp7-3", topic: "analysis",
      q: "Sort these three statements into fact or opinion, and say how you decided:\n(a) More than half the students in our class walk to school.\n(b) Walking to school is better than coming by bus.\n(c) The school gate is 400 metres from the main road.",
      model: "(a) Fact — you can check it by counting, and the count could prove it wrong. (b) Opinion — 'better' is a value judgement; two people with identical facts could disagree, because 'better' might mean healthier, cheaper, faster or safer. (c) Fact — measurable. The test is not whether a statement sounds sensible, it is whether evidence could show it to be false.",
      hint: "Which one uses a word that cannot be measured?",
    },
    {
      id: "gp7-4", topic: "analysis",
      q: "Your city is considering closing one busy road to cars on Sundays so people can walk and cycle on it. Give a personal, a national and a global perspective on this idea.",
      model: "Personal: I could cycle safely with my family for one day a week — but a shopkeeper on that road might see it differently, because customers who drive cannot reach the shop. National: cities across India face rising vehicle numbers and poor urban air quality, so a national perspective asks whether car-free days are a real solution or a symbolic one, and whether public transport can absorb the difference. Global: many cities worldwide have tried car-free streets, so there is evidence to compare, and it links to the global issue of transport emissions and climate change. Note that the three levels are not three opinions — they are the same issue seen from three distances.",
      hint: "Me · my city and country · the world.",
    },
    {
      id: "gp7-5", topic: "analysis",
      q: "Read these two viewpoints on building a new dam.\nA — A farmer downstream: 'The dam will hold back the water I need in March and April. Last year my well ran low, and this will make it worse.'\nB — A city resident: 'The dam is a good idea. Everyone knows we need more water and the government would not build it if it were not right.'\nWhat is the key difference between them, and which is better supported?",
      model: "The difference is not that they disagree about the dam — it is HOW each one argues. A gives a specific, checkable reason tied to first-hand experience (water needed in specific months, a well that ran low last year), so it can be tested against rainfall and groundwater records. B gives no evidence at all: 'everyone knows' and 'the government would not build it if it were not right' are appeals to popularity and authority, not reasons. So A is better supported — which does NOT mean A is right. B might still turn out to be correct, but as written it gives you nothing to check.",
      hint: "Ask what each person could be checked on.",
    },
    {
      id: "gp7-6", topic: "evaluation",
      q: "You find a page claiming a new sports drink improves exam results. What is the single most useful thing to check first?",
      opts: [
        "Whether the page looks professional and modern",
        "Whether it appears near the top of the search results",
        "Who published it and whether they profit if you believe it",
        "Whether it has a lot of shares and comments",
      ],
      a: "Who published it and whether they profit if you believe it",
      model: "Purpose and ownership come first. If the page belongs to the drink company, it wants to sell, not to inform — the claim needs independent confirmation before you use it. Good design, high search ranking and popularity all measure how well a page was made or promoted, not whether it is true. The top result can even be a paid advert.",
    },
    {
      id: "gp7-7", topic: "evaluation",
      q: "A poster in the corridor says: '9 out of 10 students want a longer lunch break.' List three questions you would ask before using this in a project.",
      model: "(1) Who was asked, and how many? Nine out of ten could mean nine of ten students, or 900 of 1000 — completely different weight. (2) Who ran the survey and what did they want the answer to be? A survey run by the group campaigning for a longer break has an interest in the result. (3) What exactly was the question? 'Would you like a longer lunch break?' invites a yes from almost anyone; 'Would you accept a longer lunch break if school ended 20 minutes later?' would get a different answer. You could add: when was it done, and can I see the raw numbers?",
      hint: "Sample, source, and the exact wording asked.",
    },
    {
      id: "gp7-8", topic: "evaluation",
      q: "Two sources disagree about how many households in a district have piped water: a report published last month by the district water department, and a personal blog post from six years ago quoting 'a friend who works in the office'. Which do you trust more, and what would you still do?",
      model: "The department report is more credible: it is recent, published by a named organisation that is accountable for the figure, and it is close to the original data. The blog is old, anonymous in its sourcing ('a friend'), and second-hand. But 'more credible' is not 'proven' — the department also has an interest in its own figures looking good, so I would still cross-check against an independent source such as a news report or national survey covering the same district, and I would state the date of any figure I use.",
      hint: "Recency, accountability, and distance from the original data.",
    },
    {
      id: "gp7-9", topic: "evaluation",
      q: "Which statement shows genuine evaluation rather than description?",
      opts: [
        "Some people support the plan and some people are against it.",
        "The council says the plan will help, and residents say it will not.",
        "The council's claim is backed by three years of published figures, while the residents' case rests on one interview, so the council's case is currently better supported.",
        "The plan is a very important issue that affects many people.",
      ],
      a: "The council's claim is backed by three years of published figures, while the residents' case rests on one interview, so the council's case is currently better supported.",
      model: "Evaluation weighs the evidence and reaches a judgement, with the reason attached. The first two options only describe that a disagreement exists; the last says the topic matters, which is neither. Note the word 'currently' — a good judgement stays open to better evidence.",
    },
    {
      id: "gp7-10", topic: "reflection",
      q: "Rewrite this reflection so it would actually earn credit: 'I really enjoyed the water project. I learnt a lot and my group worked well. I would like to do it again.'",
      model: "Something like: 'Before the project I assumed water shortages were mainly caused by people wasting water at home. Reading the district supply figures changed that — most of the water in our area goes to agriculture, so household saving matters far less than I thought. I now think the bigger question is how farms irrigate, though I am not confident because I only found one source with figures. Next time I would look for the raw data earlier instead of starting with news articles, because I wasted two sessions on opinion pieces.' It has a BEFORE, a specific CAUSE of the change, a NOW with honest confidence, and one concrete change to how I work.",
      hint: "Before → what changed it → now → what I'd do differently.",
    },
    {
      id: "gp7-11", topic: "reflection",
      q: "A learner says: 'I finished the project believing exactly what I believed at the start.' Is this automatically a problem?",
      opts: [
        "Yes — you must always change your mind to show you have reflected",
        "No — but only if they can say what challenged their view and why the evidence did not shift them",
        "Yes — keeping your original view means you did not research properly",
        "No — your first opinion is usually the right one",
      ],
      a: "No — but only if they can say what challenged their view and why the evidence did not shift them",
      model: "Reflection is not a rule that you must change your mind. Holding a view is fine when you have genuinely tested it: 'I read the strongest argument against me, here it is, and here is why the evidence still points the other way.' What earns nothing is finishing where you started without ever having looked at the other side.",
    },
    {
      id: "gp7-12", topic: "collaboration",
      q: "Your team of four has one week to produce a presentation. One member has done nothing by day four and stops replying in the group chat. Describe how you would handle it.",
      model: "First, separate the person from the problem and check the facts — message them directly and privately rather than complaining in the group, since there may be a reason (illness, no device at home). Second, protect the deadline: with the rest of the team, agree who covers the missing part now, so the outcome is not held hostage. Third, keep the record — the agreed roles and deadlines written at the start are what let you show what happened without it becoming an argument. Fourth, tell the teacher if it is still unresolved, describing what the team did to fix it. What not to do: silently do their work and say nothing, or attack them in front of everyone.",
      hint: "Check privately, protect the deadline, keep the record.",
    },
    {
      id: "gp7-13", topic: "collaboration",
      q: "Two people in your group want to research completely different aspects of the same topic and neither will give way. What is the most useful FIRST move?",
      opts: [
        "Take a vote immediately and move on",
        "Ask the teacher to decide for you",
        "Find what both aspects have in common and what the shared aim actually is",
        "Let both do their own thing and combine it at the end",
      ],
      a: "Find what both aspects have in common and what the shared aim actually is",
      model: "Most team disagreements shrink once the shared aim is named out loud, because people usually differ on route rather than destination. Once you know the aim, you can often use both angles as two perspectives on the same question — which is exactly what this subject rewards. Voting first decides a disagreement you have not understood yet; combining unrelated work at the end produces two half-projects stapled together.",
    },
    {
      id: "gp7-14", topic: "communication",
      q: "Turn this into a proper argument paragraph: 'I think our school should install water refill stations.'",
      model: "Claim: our school should install water refill stations. Evidence: over one week I counted the plastic bottles in the two bins outside the canteen and recorded an average of 34 a day. Source: my own count, 12–16 August, recorded in my research log. So what: at that rate the school throws away well over a thousand bottles a term, which refill stations would largely remove — and a counter-argument is the installation cost, which I would answer by comparing it with what the school currently spends on bottled water. Notice that the claim did not change; what changed is that it is now checkable, and the strongest objection is dealt with rather than avoided.",
      hint: "Claim → evidence → source → so what.",
    },
    {
      id: "gp7-15", topic: "communication",
      q: "You must present the same findings twice: once to Grade 3 learners and once to a panel of teachers. What should change, and what must not?",
      model: "What must not change: the evidence, the sources and the conclusion. Changing your findings to suit an audience is not communication, it is dishonesty. What should change: vocabulary (plain words, no jargon for Grade 3), the examples (something in their own school day rather than a district statistic), the amount of detail (one clear message for Grade 3, full method and limitations for teachers), and the format (pictures and a story for the younger group, data and sources for the panel).",
    },
    {
      id: "gp7-16", topic: "communication",
      q: "Why does including a counter-argument make your case stronger rather than weaker?",
      opts: [
        "It fills space so the presentation is long enough",
        "It shows you tested your view against the best case on the other side, so your conclusion is more trustworthy",
        "It lets you avoid taking a position",
        "It proves the other side is wrong before they can speak",
      ],
      a: "It shows you tested your view against the best case on the other side, so your conclusion is more trustworthy",
      model: "A conclusion is only worth as much as the testing behind it. If you never state the strongest objection, your audience cannot tell whether you answered it or never noticed it. State it fairly — a weak version of the other side that you knock down easily fools nobody.",
    },
    {
      id: "gp7-17", topic: "topics",
      q: "For the global issue 'education for all', name three different reasons a child might not be in school, and explain why each reason needs a different solution.",
      model: "Cost — if fees, uniforms or books are the barrier, the solution is financial: free schooling, subsidies or supplies. Distance and safety — if the nearest school is far or the journey is unsafe, money does not help; you need a closer school, transport, or a safe route. Work at home — if a child is needed for family income or to care for siblings, the family loses something real by sending them, so the solution has to replace that (meal programmes, flexible timetables, support for the family). The general point: 'education for all' is not one problem with one fix, and identifying the specific cause is what makes a proposed solution serious rather than vague.",
      hint: "Match each cause to what would actually remove it.",
    },
    {
      id: "gp7-18", topic: "topics",
      q: "A learner writes: 'Everyone should just use less water.' Identify two weaknesses in this as a response to a water shortage.",
      model: "(1) No evidence and no perspective — it does not say who uses the water now. If most of a region's water goes to agriculture or industry, changes in household use will barely move the total, so the recommendation may target the wrong users. (2) It ignores that people are differently placed: a household already carrying water from a tanker cannot 'use less', while a household with a garden and a car can. A stronger version names who should reduce use, by how much, and what would make that possible.",
      hint: "Who actually uses the water, and who can afford to use less?",
    },
    {
      id: "gp7-19", topic: "analysis",
      q: "A town's new metro line opens. Identify one cause and two consequences, and then show how one of those consequences becomes a cause in turn.",
      model: "Cause: growing traffic congestion and rising travel times made a mass transit line worth building. Consequences: (1) fewer people drive into the centre, so journey times and roadside air pollution fall; (2) shops and homes near the stations become more sought after. Consequence becoming a cause: property near stations becoming more desirable causes rents to rise, which can push lower-income families further out — a new problem produced by the solution. Chains like this are what separates analysis from a list.",
      hint: "Follow the chain one link further than feels necessary.",
    },
    {
      id: "gp7-20", topic: "research",
      q: "You reworded a paragraph from a website into your own words and used it in your project without saying where it came from. Is that plagiarism?",
      opts: [
        "No — changing the words makes it yours",
        "No — plagiarism only applies to copying word for word",
        "Yes — the idea and information are still someone else's, so the source must be named",
        "Only if the website says so",
      ],
      a: "Yes — the idea and information are still someone else's, so the source must be named",
      model: "Rewording changes the wording, not the ownership of the idea or the information. Citing costs you one line and actually strengthens your work, because a named source is evidence while an unsourced claim is just an assertion. Record the source at the moment you take the note — reconstructing it afterwards is where people get caught out.",
    },
  ],

  mistakes: [
    {
      mistake: "Giving an opinion with no evidence behind it.",
      fix: "Every arguable sentence needs 'because…' and 'according to…'. If you cannot attach a source to a claim, either find one or write it as what you think rather than as what is true.",
    },
    {
      mistake: "Describing only one perspective, usually your own.",
      fix: "Force out three before you write: personal, local/national, global. If you cannot find a real second perspective, ask who loses something under your preferred answer — that person has one.",
    },
    {
      mistake: "Listing perspectives side by side and calling it analysis.",
      fix: "Analysis compares. Write at least one sentence starting 'Both… but…' or 'Where they differ is…'. Two paragraphs that never mention each other are description.",
    },
    {
      mistake: "Treating the first search result as the best answer.",
      fix: "Ranking measures popularity and optimisation, not truth, and the top slots are sometimes paid adverts. Open three sources with different interests and see whether they agree.",
    },
    {
      mistake: "Trusting a source because it looks professional or has a .org address.",
      fix: "Design is a budget, not a fact-check, and anyone can register any domain. Run the five checks instead: who, when, why, what evidence, who else says so.",
    },
    {
      mistake: "Quoting a statistic with no source, sample or date.",
      fix: "A number without those three is decoration. Write '(source, year)' after every figure, or cut the figure. '9 out of 10' is meaningless until you know 9 out of 10 of whom.",
    },
    {
      mistake: "Confusing 'this is biased' with 'this is false'.",
      fix: "A biased source can still be accurate — a campaign group may have the best figures on its own issue. Bias tells you to cross-check and to state the source's interest, not to bin it.",
    },
    {
      mistake: "Writing 'I enjoyed it and learnt a lot' as a reflection.",
      fix: "Reflection needs a before, a cause and a now. 'I used to think X. Reading Y changed that. Now I think Z, and I'm still unsure about W.'",
    },
    {
      mistake: "Reflecting on the topic instead of on yourself.",
      fix: "If the paragraph could have been written by someone who was not in the project, it is not reflection. Use 'I', name what you assumed, and name what you would do differently.",
    },
    {
      mistake: "Splitting group work by slide count and calling it collaboration.",
      fix: "Collaboration is agreed roles, agreed deadlines and checking in on each other. Write the roles down in session one; that single document settles almost every argument later.",
    },
    {
      mistake: "Attacking the person instead of the idea when the team disagrees.",
      fix: "Aim at the evidence: 'that source has no date' rather than 'you're wrong'. Find the shared aim first, then the exact point of disagreement, then decide it with evidence.",
    },
    {
      mistake: "Ending with a conclusion you had already decided before researching.",
      fix: "Your conclusion must follow from what you actually found. If none of your evidence changed anything, say honestly what challenged your view and why it did not move you.",
    },
  ],

  cheat: [
    {
      heading: "The six skills, in one line each",
      bullets: [
        "Research — ask a narrow question, find sources, take notes in your own words, record where each one came from.",
        "Analysis — perspectives, fact vs opinion, causes and consequences, similarities and differences.",
        "Evaluation — how good is this source, who is biased, which side is better supported.",
        "Reflection — what I thought before, what changed it, what I think now, what I'd do differently.",
        "Collaboration — agreed roles, real listening, disagree with ideas not people, contribute fairly.",
        "Communication — structure the argument, support every claim, answer the counter-argument, fit the audience.",
      ],
    },
    {
      heading: "Source-credibility checklist (run this every time)",
      bullets: [
        "WHO wrote it? A named person or organisation — and do they have relevant expertise?",
        "WHEN was it written or last updated? Is it still current for this question?",
        "WHY does it exist? To inform, to sell, to persuade, to entertain? Who benefits if I believe it?",
        "WHAT EVIDENCE does it give? Figures, studies, named sources — or nothing at all?",
        "WHO ELSE says so? Cross-check with an independent source that has different interests.",
        "For any statistic: what was the sample, who asked, exactly what was the question, and when?",
        "Remember: .org and .gov are weak clues, not proof. Good design proves budget, not truth. The top search result may be an advert.",
      ],
    },
    {
      heading: "The three perspectives prompt",
      bullets: [
        "PERSONAL — how does this affect me, my family, my school? What did I assume before I started?",
        "LOCAL / NATIONAL — how does this look to my city or my country? Who here gains, who loses, who decides?",
        "GLOBAL — how does this look elsewhere in the world, or to the world as a whole? Has another country tried it?",
        "Stuck on a second perspective? Ask: who loses something under my preferred answer? That person has one.",
        "Then compare, don't just list: 'Both want X, but they disagree about Y.'",
      ],
    },
    {
      heading: "Fact or opinion — the quick test",
      bullets: [
        "Could evidence show this statement to be FALSE? If yes, it's a fact-claim. If no, it's an opinion.",
        "Opinion-signal words: best, worst, should, must, unfair, too much, everyone knows, obviously.",
        "'India has more people than Japan' = fact. 'India should build more trains' = opinion.",
        "Facts still need sources. A wrong fact is still a fact-claim — checkable, and in this case checkably wrong.",
      ],
    },
    {
      heading: "Writing the paragraph",
      bullets: [
        "CLAIM → EVIDENCE → SOURCE → SO WHAT. Four moves, every time.",
        "Whole argument: introduction → perspectives and evidence → strongest counter-argument, answered → conclusion drawn from the evidence.",
        "State the counter-argument at full strength. A weak version you knock over convinces nobody.",
        "Slides carry key words; your voice carries the sentences.",
        "Every figure gets its source. No source, cut the figure.",
      ],
    },
    {
      heading: "Reflection sentence starters",
      bullets: [
        "'Before this Challenge I assumed…'",
        "'What changed my thinking was… because…'",
        "'I now think… although I'm still unsure about…'",
        "'The hardest part was… and next time I would… because…'",
        "'I noticed that my first opinion came from…'",
      ],
    },
    {
      heading: "Team set-up (first ten minutes, always)",
      bullets: [
        "Write down: who does what, by when, and when we check in. One shared document.",
        "Agree how decisions get made before you need to make a hard one.",
        "Listen: let them finish → say it back in your own words → then respond.",
        "Disagree with the idea, never the person.",
        "At the end, reflect as a team: what worked, what slowed us down, what we'd set up differently.",
      ],
    },
  ],
};

// =========================
// ICT / DIGITAL LITERACY — Computing 0860 + Digital Literacy 0082, Stage 7
// =========================
export const CLS7_ICT_PACK: ExamPack = {
  subjectId: "cls-ict",
  grade: 6,
  title: "ICT — Stage 7 · Cambridge Lower Secondary",
  context: "Computing 0860 + Digital Literacy 0082 · Stage 7 (Grade 6) · CNS Amanora",
  highlights: [
    { label: "Frameworks", value: "Computing 0860 · Digital Literacy 0082" },
    { label: "Stage", value: "Stage 7 = Grade 6" },
    { label: "Covers", value: "Algorithms · programming · data · networks · e-safety" },
  ],
  pinnedRule: {
    heading: "Never guess what code does — trace it in a table",
    body: "Whenever you are asked what an algorithm outputs, draw a table with one column per variable and one row per pass through the loop. Fill it in line by line, exactly as the computer would, without skipping ahead. Nearly every wrong answer in Stage 7 programming comes from reading the code, deciding what it 'obviously' does, and being off by one. The table takes ninety seconds and it is never wrong.",
  },
  reference: {
    label: "Cambridge Lower Secondary curriculum — Computing (0860) & Digital Literacy (0082)",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/",
  },
  plan: [
    { title: "Trace two algorithms on paper", hint: "Trace table first — it warms up everything else" },
    { title: "Walk the 8 topics", hint: "Tag each one: solid / shaky / no idea" },
    { title: "Flip the flashcards", hint: "Spreadsheet functions, field vs record, loop types" },
    { title: "Do the practice questions", hint: "Write the trace table before you look at the answer" },
    { title: "Read the common mistakes", hint: "Off-by-one and 'the internet = Google' live here" },
    { title: "Run the e-safety checklist", hint: "Passwords, footprint, scams — the part that follows you home" },
  ],

  topics: [
    {
      id: "comp-thinking", num: 1, title: "Computational Thinking & Algorithms",
      blurb: "Four ways of breaking a problem down, and two ways of writing the solution out.",
      syllabus: [
        "Decomposition — splitting a big problem into smaller sub-problems you can solve one at a time. 'Build a quiz app' becomes: store questions, show one question, read the answer, check it, keep the score, show the result.",
        "Pattern recognition — spotting that sub-problems repeat, so one solution can be reused. Checking answer 2 works the same way as checking answer 1, so you write it once and repeat it.",
        "Abstraction — leaving out the detail that does not matter for the problem. A metro map ignores real distances and streets because a passenger only needs the order of stations and where to change.",
        "An algorithm is a precise, ordered set of steps that always finishes and always gives the same result for the same input. Sequence matters: the same steps in a different order are a different algorithm.",
        "Flowcharts use fixed shapes: oval terminator (start/stop), parallelogram (input/output), rectangle (process), diamond (decision, with labelled yes/no branches), arrows for flow.",
        "Pseudocode writes the same logic as structured English — INPUT, OUTPUT, IF…THEN…ELSE, WHILE, FOR — without the fussy punctuation of a real language. Flowcharts are easier to see; pseudocode is easier to turn into code.",
      ],
    },
    {
      id: "programming", num: 2, title: "Variables, Input/Output, Sequence & Selection",
      blurb: "The three basic building blocks — do this, then this; and sometimes, only if.",
      syllabus: [
        "A variable is a named storage space holding a value that can change while the program runs. Name it for what it holds: score, not x.",
        "Data types matter from Stage 7: whole numbers (integer), decimals (real/float), text (string), and true/false (Boolean). '7' typed as text is not the same as the number 7, which is why joining it to another number gives '77' rather than 14.",
        "Assignment puts a value into a variable: score ← 0, then later score ← score + 1. Read it right-to-left: work out the right-hand side, then store it.",
        "INPUT reads a value from the user into a variable; OUTPUT displays a value. Always prompt before you input, so the user knows what to type.",
        "Sequence means the computer runs the lines in order, top to bottom, and the order changes the result — swapping two lines can break everything.",
        "Selection chooses between paths with IF…THEN…ELSE. Comparison operators: = (equal to), <> (not equal), <, >, <= (less than or equal), >= (greater than or equal). Watch the boundary: >= 50 includes 50, > 50 does not.",
      ],
    },
    {
      id: "loops-debug", num: 3, title: "Loops, Testing & Debugging",
      blurb: "Repetition, and the discipline of finding out what your program actually does.",
      syllabus: [
        "A count-controlled loop repeats a known number of times: FOR count ← 1 TO 5 … NEXT count runs the body 5 times. FOR count ← 0 TO 5 runs it 6 times — count the values, do not assume.",
        "A condition-controlled loop repeats while something stays true: WHILE total < 100 … ENDWHILE. It checks the condition BEFORE each pass, so if the condition is false at the start, the body never runs at all.",
        "Every WHILE loop must contain something that can eventually make the condition false. If nothing inside changes the variable being tested, the program hangs in an infinite loop.",
        "Trace tables: one column per variable plus one for output, one row per pass. Fill them in line by line, in order, without skipping — this is how you find the bug rather than guess at it.",
        "Three kinds of error: syntax (the code breaks the language's rules and will not run), logic (it runs perfectly but gives the wrong answer), and runtime (it crashes partway, for example dividing by zero). A logic error is the dangerous one, because nothing warns you.",
        "A test plan is written before you test: for each test give the input, the reason for it, and the expected output. Include normal values, boundary values (exactly at the limit) and invalid values (text where a number is expected).",
      ],
    },
    {
      id: "spreadsheets", num: 4, title: "Spreadsheets — Cells, Formulae & Charts",
      blurb: "Making the software do the arithmetic, so it stays right when the data changes.",
      syllabus: [
        "A spreadsheet is a grid of cells, each addressed by column letter and row number (B4). A range uses a colon: B2:B11 means every cell from B2 down to B11.",
        "Every formula starts with = and is calculated by the software. Type =B2+B3 rather than the answer, so the total updates itself when the data changes — that is the entire point of a spreadsheet.",
        "The core functions: =SUM(B2:B11) adds a range, =AVERAGE(B2:B11) gives the mean, =MAX(…) and =MIN(…) give the largest and smallest, =COUNT(…) counts how many cells hold numbers.",
        "Order of operations still applies, and brackets still win: =A1+A2*2 is not the same as =(A1+A2)*2.",
        "Relative vs absolute references: copying =B2*C1 down a column changes both row numbers automatically (relative). Writing =B2*$C$1 locks C1 with dollar signs (absolute), so it stays pointing at the same cell however far you copy.",
        "Charts: bar or column chart to compare separate categories, line graph for change over time, pie chart for parts of one whole (and only when the parts add up to that whole). Every chart needs a title and labelled axes with units.",
      ],
    },
    {
      id: "databases", num: 5, title: "Databases — Fields, Records, Sorting & Searching",
      blurb: "Structured data you can search in a fraction of a second, if it was structured properly.",
      syllabus: [
        "A field is one item of information collected about everything in the database (Surname, DateOfBirth, HouseColour). A record is the complete set of fields about one thing — one student, one book, one product. A table or file is all the records together.",
        "In the usual grid view, fields are the columns and records are the rows. Confusing the two is the single most common database mistake.",
        "Each field has a data type — text, number, date, Boolean (yes/no) — and choosing it correctly is what lets the database sort, calculate and validate. A date stored as text will sort alphabetically, which is why 12 January can end up before 3 February.",
        "A key field holds a value that is different for every record (an admission number), so one record can always be identified exactly. Names are a bad key — two people share one.",
        "Sorting arranges records by a chosen field, ascending (A–Z, smallest first, oldest first) or descending. Sorting changes the order shown; it does not remove anything.",
        "Searching (querying) uses criteria to show only matching records — Grade = 6, or Score >= 40, or two criteria together with AND (both must be true) and OR (either will do). Searching hides the non-matches; it does not delete them.",
      ],
    },
    {
      id: "networks", num: 6, title: "Networks, the Internet & Searching Well",
      blurb: "What is actually connected to what — and how to find something true inside it.",
      syllabus: [
        "A network is two or more devices connected so they can share data and resources. A LAN covers one site, like your school; a WAN spans large distances by linking networks together.",
        "The internet is the worldwide network of networks — the physical and logical infrastructure. The World Wide Web is one of the services running on it: the pages and sites you visit. Email, video calls and app updates also use the internet without being 'the web'.",
        "A browser is a program that requests a page from a web server using its address (URL) and renders the HTML it receives so you can read it. The browser is not the internet, and neither is a search engine.",
        "A search engine is a company's index of pages it has crawled. When you search, you are searching that index, not the whole internet — which is why two search engines give different results.",
        "Search better: use distinctive keywords rather than a full sentence, put an exact phrase in \"quotation marks\", exclude a word with a minus sign, and restrict to one site with site: — for example site:nasa.gov.",
        "Judge a site before you use it: who published it, when it was last updated, why it exists (to inform, to sell, to persuade), whether it shows evidence, and whether an independent source agrees. Sponsored results sit at the top precisely because someone paid — high ranking is not a quality mark.",
      ],
    },
    {
      id: "creating", num: 7, title: "Creating Digital Content",
      blurb: "Documents, presentations and images — made so someone else can actually use them.",
      syllabus: [
        "Use styles and headings in a document rather than manually making text big and bold. Styles give you an automatic contents page, consistent formatting, and a document a screen reader can navigate.",
        "Presentation rule of thumb: key words on the slide, sentences in your mouth. Readable font size, strong contrast between text and background, and one idea per slide.",
        "Images come in two families: bitmap/raster images (photographs, made of pixels — they blur when enlarged too far) and vector images (shapes described mathematically — they stay sharp at any size, which is why logos are vectors).",
        "File size matters when you share: compress or resize a photograph before emailing it, and choose the format for the job — JPEG for photographs, PNG when you need sharp edges or transparency, MP3/MP4 for audio and video.",
        "Save with meaningful file names and sensible folders, and know where the file actually lives: on this device, on the school network, or in the cloud (stored on someone else's computers and reachable from anywhere with an account and a connection).",
        "Storage on any device is limited, and cloud storage needs a connection — so 'it's saved' is only true once you can say where.",
      ],
    },
    {
      id: "esafety", num: 8, title: "E-Safety & Digital Citizenship",
      blurb: "The part of this subject that follows you out of the classroom.",
      syllabus: [
        "A strong password is long, unpredictable and used for one account only — three or four unrelated words are both stronger and easier to remember than one word with symbols jammed in. Never reuse a password across accounts, because one leaked site then opens all of them. Two-factor authentication adds a second check, so a stolen password alone is not enough.",
        "Personal information is anything that helps someone find or impersonate you: full name plus school, home address, phone number, birthday, live location, a photo in uniform, or a picture with your street or house number visible. Think before you post, and check what your account shares by default. What you leave behind is your digital footprint — posts, comments, likes, photos other people tag you in, search history — and it is permanent and copyable, because deleting your copy does not delete anyone else's screenshot.",
        "Cyberbullying is bullying carried out through digital devices. If it happens to you or someone you know: do not retaliate, keep the evidence (screenshots with dates), block and report through the platform's tools, and tell an adult you trust. Staying silent is what lets it continue.",
        "Recognising scams and phishing: messages that create urgency ('act now, your account will be closed'), that offer something free or impossible, that come from a slightly wrong address or a shortened link, or that ask for a password, an OTP or payment details. No legitimate organisation asks for your password or an OTP. When unsure, do not click — go to the site yourself, by typing the address.",
        "Copyright and respect for other people's work: most images, music, videos and text online belong to someone. Use material licensed for reuse (Creative Commons or public domain), credit the creator, and never present someone else's work as your own. The same rule applies to AI-generated material — say when you used it.",
        "Wellbeing: screens late at night disrupt sleep, notifications fragment your attention, and comparing yourself to edited posts distorts what normal looks like. Set your own limits, take real breaks, and treat people online the way you would face to face — the person on the other end is real.",
      ],
    },
  ],

  flashcards: [
    { term: "Decomposition", def: "Breaking a large problem into smaller sub-problems that can be solved one at a time." },
    { term: "Pattern recognition", def: "Spotting that sub-problems repeat, so one solution can be reused instead of rewritten." },
    { term: "Abstraction", def: "Leaving out detail that does not matter for the problem — like a metro map ignoring real distances." },
    { term: "Algorithm", def: "A precise, ordered set of steps that finishes and gives the same result for the same input." },
    { term: "Flowchart shapes", def: "Oval = start/stop · parallelogram = input/output · rectangle = process · diamond = decision · arrows = flow." },
    { term: "Variable", def: "A named storage space holding a value that can change while the program runs. Assignment reads right-to-left: score ← score + 1." },
    { term: "Data types", def: "Integer (whole number), real (decimal), string (text), Boolean (true/false). '7' as text is not the number 7." },
    { term: "The three constructs", def: "Sequence (lines run in order) · selection (IF…THEN…ELSE, using = <> < > <= >=) · iteration (FOR a set number of times, WHILE a condition stays true). >= 50 includes 50; > 50 does not." },
    { term: "FOR loop count", def: "FOR i ← 1 TO 5 runs 5 times. FOR i ← 0 TO 5 runs 6 times. Count the values, don't assume." },
    { term: "WHILE loop", def: "Checks its condition BEFORE each pass, so it can run zero times — and loops forever if nothing inside changes the tested variable." },
    { term: "Trace table", def: "One column per variable plus output, one row per pass — filled in line by line to see what the code really does." },
    { term: "Three kinds of error", def: "Syntax = won't run at all · logic = runs but gives the wrong answer · runtime = crashes partway, e.g. dividing by zero." },
    { term: "Cell, range & formula", def: "Cell = column letter + row number (B4). Range uses a colon: B2:B11. Every formula starts with = so it recalculates itself." },
    { term: "SUM vs AVERAGE", def: "=SUM(B2:B11) adds the range; =AVERAGE(B2:B11) gives its mean. MAX and MIN give largest and smallest." },
    { term: "Absolute reference", def: "$C$1 stays pointing at C1 however far you copy the formula; C1 alone shifts as you copy." },
    { term: "Chart choice", def: "Bar/column = compare categories · line = change over time · pie = parts of one whole. Always title + labelled axes." },
    { term: "Field vs record", def: "A field is one item of information collected about everyone (a column). A record is everything about one entry (a row)." },
    { term: "Key field", def: "A field whose value is unique to each record, so a record can be identified exactly (an admission number, not a name)." },
    { term: "Sort, search, AND/OR", def: "Sorting reorders records; searching shows only matches — neither deletes anything. AND narrows (both true), OR widens (either)." },
    { term: "Internet vs World Wide Web", def: "The internet is the global network of networks; the web is one service running on it — the pages you visit. A LAN covers one site, a WAN spans large distances." },
    { term: "Browser vs search engine", def: "A browser fetches a page from a web server by its URL and renders it. A search engine is one company's index of part of the web — which is why engines disagree." },
    { term: "Bitmap vs vector", def: "Bitmap = pixels (photos), blurs when enlarged. Vector = maths-described shapes (logos), stays sharp at any size." },
    { term: "Strong password", def: "Long, unpredictable, and used for one account only — three or four unrelated words beat one word with symbols added. Add two-factor authentication so a stolen password alone is not enough." },
    { term: "Digital footprint", def: "Everything you leave behind online — posts, comments, tags, history. Assume it is permanent and copyable." },
    { term: "Phishing", def: "A message pretending to be someone trustworthy to get your password, OTP or payment details. Urgency and a wrong-looking link are the giveaways." },
    { term: "Copyright", def: "Other people's images, music and text belong to them — use material licensed for reuse, credit the creator, and say when you used AI." },
  ],

  questions: [
    {
      id: "ict7-1", topic: "comp-thinking",
      q: "You are asked to write a program that marks a five-question quiz. Use decomposition to break this into sub-problems, then say where pattern recognition helps.",
      model: "Decomposition: (1) store the questions and correct answers; (2) display one question; (3) read the user's answer; (4) compare it with the correct answer; (5) add 1 to the score if it matches; (6) move to the next question; (7) display the final score at the end. Pattern recognition: steps 2–6 are identical for every question — only the question and answer change. So instead of writing them five times, you write them once and repeat them with a loop. That is exactly what a loop is for.",
      hint: "Which steps look the same for question 1 and question 5?",
    },
    {
      id: "ict7-2", topic: "comp-thinking",
      q: "A metro route map shows stations as evenly spaced dots on straight coloured lines, ignoring the real distances and the actual streets above. Which computational thinking technique does this best illustrate?",
      opts: ["Decomposition", "Pattern recognition", "Abstraction", "Iteration"],
      a: "Abstraction",
      model: "Abstraction is removing detail that does not matter for the task. A passenger needs the order of stations, the interchanges and the line colours; real distances and street layouts would only clutter that. The map is deliberately geographically wrong because being wrong in that way makes it more useful.",
    },
    {
      id: "ict7-3", topic: "loops-debug",
      q: "Trace this algorithm and state exactly what it outputs.\n\ntotal ← 0\nFOR count ← 1 TO 5\n    total ← total + count\nNEXT count\nOUTPUT total",
      model: "Build the trace table, one row per pass:\n\ncount | total after the pass\n  1   |  0 + 1 = 1\n  2   |  1 + 2 = 3\n  3   |  3 + 3 = 6\n  4   |  6 + 4 = 10\n  5   | 10 + 5 = 15\n\nAfter the loop finishes, OUTPUT total displays 15.\n\nTwo things to notice. The OUTPUT is outside the loop, so it happens once at the end, not five times — if it were indented inside, the program would print 1, 3, 6, 10, 15. And the loop body runs 5 times, because count takes the 5 values 1, 2, 3, 4, 5.",
      hint: "One row per pass. Don't skip ahead.",
    },
    {
      id: "ict7-4", topic: "loops-debug",
      q: "Trace this loop and list every value it outputs, in order.\n\nn ← 10\nWHILE n > 0\n    OUTPUT n\n    n ← n - 3\nENDWHILE",
      model: "The condition is checked BEFORE each pass:\n\nn = 10 → 10 > 0 is true → output 10 → n becomes 7\nn = 7  → 7 > 0 is true  → output 7  → n becomes 4\nn = 4  → 4 > 0 is true  → output 4  → n becomes 1\nn = 1  → 1 > 0 is true  → output 1  → n becomes -2\nn = -2 → -2 > 0 is false → the loop stops\n\nOutput: 10, 7, 4, 1. The loop runs 4 times. The value -2 is never output, because the condition is tested before the body runs, not after. Also note the loop terminates only because n changes inside it — remove the line n ← n - 3 and this becomes an infinite loop.",
      hint: "Check the condition before each pass, not after.",
    },
    {
      id: "ict7-5", topic: "loops-debug",
      q: "How many times does the body of this loop run?\n\nFOR i ← 0 TO 4\n    OUTPUT \"hello\"\nNEXT i",
      opts: ["3 times", "4 times", "5 times", "It runs forever"],
      a: "5 times",
      model: "i takes the values 0, 1, 2, 3, 4 — that is five values, so the body runs five times. The classic off-by-one error is reading 'TO 4' and answering 4. Count the values, do not read the last number. A loop from 1 TO 4 would run four times.",
    },
    {
      id: "ict7-6", topic: "loops-debug",
      q: "A program is supposed to add up ten numbers, but it always reports a total that is far too large. It runs without any error message. What kind of error is this, and how would you find it?",
      model: "It is a logic error: the code obeys the language's rules perfectly, so it runs, but the instructions do not do what was intended. Nothing warns you — that is what makes logic errors dangerous. To find it: build a trace table with a small, easy case (three numbers you can add in your head) and step through line by line comparing the actual values with what you expected. Likely culprits here are total not being reset to 0 at the start, or the addition sitting in the wrong place so a value gets counted twice.",
      hint: "It runs. That already rules out one of the three error types.",
    },
    {
      id: "ict7-7", topic: "programming",
      q: "A program contains:\n\nINPUT mark\nIF mark >= 50 THEN\n    OUTPUT \"Pass\"\nELSE\n    OUTPUT \"Try again\"\nENDIF\n\nWhat is output when the user enters exactly 50, and why does this matter?",
      model: "It outputs 'Pass'. The operator >= means 'greater than or equal to', so 50 satisfies the condition. This matters because the boundary value is exactly where selection bugs hide: if the pass mark is meant to be 50, then > 50 would wrongly fail every student who scored precisely 50. That is why a good test plan always includes the boundary value itself, plus one either side — here 49, 50 and 51.",
      hint: "What does the 'or equal to' part do?",
    },
    {
      id: "ict7-8", topic: "programming",
      q: "A learner writes a program to add two numbers, but entering 7 and 4 produces 74 instead of 11. What is the most likely cause?",
      opts: [
        "The variables have not been given names",
        "The inputs are being stored as text (strings), so they are joined instead of added",
        "The computer is short of memory",
        "The plus operator does not work on variables",
      ],
      a: "The inputs are being stored as text (strings), so they are joined instead of added",
      model: "Input from a user usually arrives as text. Adding two strings joins them end to end — '7' + '4' gives '74' — while adding two numbers gives 11. The fix is to convert each input to an integer before doing arithmetic with it. This is why data types are taught from Stage 7: '7' and 7 look identical on screen and behave completely differently.",
    },
    {
      id: "ict7-10", topic: "spreadsheets",
      q: "Cells B2 to B11 hold the marks of ten students. Write the formula for the total, the formula for the mean, and the formula for the highest mark. Then explain why =B2+B3+B4+B5+B6+B7+B8+B9+B10+B11 is a worse way to get the total.",
      model: "Total: =SUM(B2:B11). Mean: =AVERAGE(B2:B11). Highest: =MAX(B2:B11). The long version is worse for three reasons: it is far easier to mistype or to miss a cell, it is much harder for anyone to read and check, and it breaks silently if you insert a new student row inside the range — SUM over a range adapts, a chain of individual references does not. Note that =SUM(B2:B11)/10 also gives the mean, but AVERAGE is better because it does not stop being right when the number of students changes.",
      hint: "What happens to each version when an eleventh student is added?",
    },
    {
      id: "ict7-11", topic: "spreadsheets",
      q: "Cell C1 holds a conversion rate. In D2 you write =B2*C1 and copy it down to D3, D4 and D5 — but all the results below D2 come out wrong. What is the cause, and what is the fix?",
      opts: [
        "The formula is missing an = sign",
        "C1 is a relative reference, so copying down shifts it to C2, C3, C4 — cells that are empty",
        "The cells are formatted as text",
        "SUM should have been used instead",
      ],
      a: "C1 is a relative reference, so copying down shifts it to C2, C3, C4 — cells that are empty",
      model: "Copying a formula down a column shifts every relative reference down with it, so =B2*C1 becomes =B3*C2, then =B4*C3, and so on. B2 shifting to B3 is what you want; C1 shifting to C2 is not, because the rate lives only in C1. The fix is to make it absolute with dollar signs: =B2*$C$1. Then copying down gives =B3*$C$1, =B4*$C$1 — the row moves, the rate stays put.",
    },
    {
      id: "ict7-13", topic: "databases",
      q: "In a school database, explain the difference between a field and a record, and give one example of each.",
      model: "A field is one item of information collected about every entry — for example DateOfBirth, or Class. A record is the complete set of fields about one particular thing — for example everything stored about the student Anaya Kulkarni: her admission number, name, class, date of birth and house. In the usual grid view, fields are the columns and records are the rows. Memory hook: a field runs down the whole table, a record runs across one entry.",
      hint: "Columns or rows?",
    },
    {
      id: "ict7-14", topic: "databases",
      q: "Which field would make the best key field in a database of students?",
      opts: [
        "Surname",
        "Class",
        "Admission number",
        "Date of birth",
      ],
      a: "Admission number",
      model: "A key field must be unique to each record, so it can identify exactly one. Two students easily share a surname, a class holds many students, and two students in a year group can share a birthday. An admission number is issued once and never repeated, so it identifies one record with no ambiguity.",
    },
    {
      id: "ict7-15", topic: "databases",
      q: "A librarian searches the catalogue with the criteria: Subject = \"Science\" AND YearPublished > 2020. Then she changes AND to OR. Explain what happens to the number of results and why.",
      model: "The number of results grows, usually by a lot. With AND, a book must satisfy BOTH criteria — it must be a science book AND published after 2020 — so every extra criterion narrows the results. With OR, a book qualifies if EITHER is true, so the results now include every science book of any age plus every book of any subject published after 2020. Rule of thumb: AND narrows, OR widens. And in both cases the other books are only hidden, not deleted — searching never removes records.",
      hint: "Does each record have to satisfy both conditions, or just one?",
    },
    {
      id: "ict7-16", topic: "networks",
      q: "A classmate says: 'The internet is basically Google.' Correct this properly.",
      model: "Three different things are being run together. The internet is the worldwide network of networks — the actual connected infrastructure that carries data. The World Wide Web is one service running on the internet: the pages and sites you visit. Google is a search engine, a single company's index of web pages it has crawled, reached through a browser. So when you search you are not searching the internet — you are searching Google's index of part of the web. That is exactly why two search engines return different results for the same words, and why plenty of internet traffic (video calls, email, app updates, online games) never involves a search engine at all.",
      hint: "Three separate things: the network, the web, and one company's index.",
    },
    {
      id: "ict7-17", topic: "networks",
      q: "You need pages about Mars missions from NASA's own site, and you want the exact phrase 'sample return'. Write the search you would type and explain each part.",
      model: "site:nasa.gov mars \"sample return\"\n\nsite:nasa.gov restricts results to pages on that domain, so you get the organisation's own material rather than other people's summaries of it. mars is a distinctive keyword. \"sample return\" in quotation marks demands that exact phrase in that order, rather than any page containing both words separately. If unrelated results still appear, you can exclude a word with a minus sign, for example -game. General principle: search with a few distinctive keywords rather than a full sentence, because the extra words in a sentence carry almost no filtering power.",
    },
    {
      id: "ict7-18", topic: "networks",
      q: "You search for a school project and the first result looks perfect. What is the best next step?",
      opts: [
        "Use it — search engines rank the most accurate pages first",
        "Check who published it and when, then confirm the key facts in an independent source",
        "Use it if the site looks professionally designed",
        "Use it if the address ends in .org",
      ],
      a: "Check who published it and when, then confirm the key facts in an independent source",
      model: "Ranking reflects popularity, links and how well a page is optimised — not accuracy — and the top slots are sometimes paid adverts marked 'sponsored'. Professional design shows a budget, and any domain ending can be registered by anyone. So run the real checks: who published it, when it was last updated, why it exists, what evidence it gives, and whether an independent source agrees.",
    },
    {
      id: "ict7-19", topic: "esafety",
      q: "A message arrives: 'URGENT — your school account will be deleted in 24 hours. Click this link and confirm your password and OTP now.' List four signs this is a scam and state exactly what you should do.",
      model: "Four signs: (1) manufactured urgency — a deadline designed to stop you thinking; (2) it asks for your password, which no legitimate organisation ever does; (3) it asks for an OTP, whose entire purpose is that it is shared with nobody; (4) it pushes you to a link rather than to the normal way you log in — and the address will usually be slightly wrong or shortened to hide it. Add: unexpected, and often oddly worded. What to do: do not click and do not reply. If you want to check, open the service yourself by typing the address you normally use, or ask a teacher or parent. Report the message and delete it. If you have already entered anything, change that password immediately from a different device and tell an adult straight away — quickly and without embarrassment, because speed is what limits the damage.",
      hint: "What is it asking for, and how hard is it pushing?",
    },
    {
      id: "ict7-20", topic: "esafety",
      q: "Which of these is the strongest password practice?",
      opts: [
        "A short password with symbols, like P@ss1!, used on every account so you never forget it",
        "Your pet's name and your year of birth, changed slightly for each site",
        "A long passphrase of several unrelated words, different for every account, with two-factor authentication on",
        "Any password, as long as you never write it down anywhere",
      ],
      a: "A long passphrase of several unrelated words, different for every account, with two-factor authentication on",
      model: "Length and unpredictability beat clever symbol substitutions — P@ss1! is short and follows a pattern attackers try first. Pet names and birth years are guessable by anyone who has seen your profile. Reuse is the real danger: one leaked website then unlocks every account that shares that password, which is why 'different for every account' matters more than any single password's cleverness. Two-factor authentication means a stolen password on its own is still not enough.",
    },
    {
      id: "ict7-21", topic: "esafety",
      q: "A friend is being sent cruel messages in a group chat. Give the four things they should do, and explain why not retaliating matters.",
      model: "(1) Do not reply or retaliate. (2) Keep the evidence — screenshots showing the messages, the names and the dates. (3) Block the accounts and report the messages using the platform's own reporting tools. (4) Tell an adult they trust: a parent, a class teacher or a school counsellor. Not retaliating matters for two reasons: it denies the bully the reaction they want, and it keeps the record clean, so nobody can claim it was an argument in which your friend was equally at fault. Staying silent is the one thing that reliably lets it continue.",
    },
    {
      id: "ict7-22", topic: "creating",
      q: "You need a school logo that will appear both on a small badge and on a large banner. Should it be a bitmap or a vector image, and why?",
      opts: [
        "Bitmap, because photographs are higher quality",
        "Vector, because the shapes are described mathematically and stay sharp at any size",
        "Bitmap, because vector files are always larger",
        "Either — enlarging an image never affects quality",
      ],
      a: "Vector, because the shapes are described mathematically and stay sharp at any size",
      model: "A bitmap stores a fixed grid of pixels, so enlarging it stretches those pixels and the edges go blocky or blurred. A vector stores the shapes as mathematical descriptions — lines, curves and fills — so it is redrawn cleanly at whatever size you need. That is why logos, icons and diagrams are made as vectors, while photographs, which have no simple shapes to describe, are bitmaps.",
    },
  ],

  mistakes: [
    {
      mistake: "Off-by-one: reading FOR i ← 0 TO 4 as four repetitions.",
      fix: "Count the values, never the last number. 0, 1, 2, 3, 4 is five values, so five repetitions. Write the values out in the margin before you answer.",
    },
    {
      mistake: "Guessing what a loop outputs instead of tracing it.",
      fix: "Draw the trace table: one column per variable plus one for output, one row per pass. Ninety seconds, and it is never wrong. Guessing is where the marks go.",
    },
    {
      mistake: "Getting boundaries wrong with > and >=, or putting OUTPUT inside a loop when it belongs after it.",
      fix: ">= 50 includes 50; > 50 does not — test every condition with the boundary value plus one either side (49, 50, 51). And check the indentation: inside the loop prints on every pass, after the loop prints once at the end.",
    },
    {
      mistake: "Adding two inputs and getting 74 instead of 11.",
      fix: "Input usually arrives as text, and adding text joins it. Convert to a number before doing arithmetic. '7' and 7 look identical on screen and behave completely differently.",
    },
    {
      mistake: "Typing the answer into a spreadsheet cell instead of a formula.",
      fix: "Every calculation starts with = and refers to cells: =SUM(B2:B11), not 476. A typed number is frozen and goes quietly wrong the moment the data changes.",
    },
    {
      mistake: "Copying a formula down and forgetting the reference that should have stayed put.",
      fix: "Lock it with dollar signs. =B2*$C$1 keeps pointing at C1 as you copy; =B2*C1 slides down to C2, C3 and empty cells.",
    },
    {
      mistake: "Swapping the words field and record.",
      fix: "A field is one item of information collected about everyone (a column). A record is everything about one entry (a row). Field goes down, record goes across. A date stored as text is the related trap — it sorts alphabetically, so 12 January lands before 3 February.",
    },
    {
      mistake: "Confusing a search engine with the internet — 'I looked on the internet' meaning 'I typed it into Google'.",
      fix: "The internet is the network of networks. The web is a service on it. A search engine is one company's index of part of the web. Different engines give different results because they are different indexes.",
    },
    {
      mistake: "Trusting the first search result, or trusting a site because it looks slick or ends in .org.",
      fix: "Ranking measures popularity and optimisation, and the top slots can be paid adverts. Check who, when, why, what evidence, and who else says so.",
    },
    {
      mistake: "Reusing one password across accounts because it is 'a strong one'.",
      fix: "One leaked site then opens all of them, however strong the password was. Different passphrase for every account, plus two-factor authentication where it is offered.",
    },
    {
      mistake: "Assuming a deleted post is gone.",
      fix: "Deleting your copy does not delete anyone else's screenshot, or the platform's records. Treat everything you post as permanent and copyable — decide before you post, not after.",
    },
    {
      mistake: "Pulling images off a search results page straight into your project.",
      fix: "Most of them belong to someone. Filter for material licensed for reuse, credit the creator, and say when you have used AI-generated material.",
    },
  ],

  cheat: [
    {
      heading: "Computational thinking & algorithms",
      bullets: [
        "Decomposition = break it into sub-problems. Pattern recognition = spot what repeats. Abstraction = drop the detail that doesn't matter.",
        "Algorithm = precise, ordered steps that always finish and always give the same result for the same input.",
        "Flowchart: oval = start/stop · parallelogram = input/output · rectangle = process · diamond = decision (label the yes/no branches) · arrows = flow.",
        "Pseudocode: INPUT, OUTPUT, IF…THEN…ELSE…ENDIF, WHILE…ENDWHILE, FOR…NEXT.",
        "Flowchart is easier to see; pseudocode is easier to turn into code. Both describe the same logic.",
      ],
    },
    {
      heading: "Programming — the three constructs",
      bullets: [
        "SEQUENCE — lines run top to bottom, and the order changes the result.",
        "SELECTION — IF condition THEN … ELSE … ENDIF. Operators: = · <> · < · > · <= · >=.",
        "ITERATION — FOR (known number of times) · WHILE (as long as a condition stays true, checked before each pass).",
        "Variable = named store. Assignment reads right-to-left: total ← total + count.",
        "Data types: integer · real · string · Boolean. '7' as text ≠ 7 as a number — convert input before arithmetic.",
        "Boundary check: >= 50 includes 50; > 50 does not.",
      ],
    },
    {
      heading: "Trace table & debugging drill",
      bullets: [
        "One column per variable, one for output. One row per pass. Fill it in line by line — no skipping.",
        "FOR i ← 1 TO 5 → 5 passes. FOR i ← 0 TO 5 → 6 passes. Count the values.",
        "WHILE checks BEFORE the body, so it can run zero times.",
        "Errors: SYNTAX = won't run · LOGIC = runs, wrong answer · RUNTIME = crashes partway (e.g. divide by zero).",
        "Test plan: input · reason · expected output. Include normal, boundary and invalid values.",
      ],
    },
    {
      heading: "Spreadsheet function reference",
      bullets: [
        "Every formula starts with = · cell = B4 · range = B2:B11 (colon).",
        "=SUM(B2:B11) — adds the range.",
        "=AVERAGE(B2:B11) — the mean of the range.",
        "=MAX(B2:B11) / =MIN(B2:B11) — largest / smallest value.",
        "=COUNT(B2:B11) — how many cells in the range hold numbers.",
        "Relative =B2*C1 shifts when copied · absolute =B2*$C$1 stays locked on C1.",
        "Brackets before × and ÷: =(A1+A2)*2 is not =A1+A2*2.",
        "Charts: bar/column = compare categories · line = change over time · pie = parts of one whole. Always title + labelled axes with units.",
      ],
    },
    {
      heading: "Databases in six lines",
      bullets: [
        "FIELD = one item of information about everyone (a column). RECORD = everything about one entry (a row).",
        "Data types matter: a date stored as text sorts alphabetically and comes out in the wrong order.",
        "KEY FIELD = unique to each record (admission number, not a name).",
        "SORT = reorder by a field, ascending or descending. It changes the order, not the contents.",
        "SEARCH / QUERY = show only records matching criteria. It hides, it does not delete.",
        "AND narrows (both must be true) · OR widens (either will do).",
      ],
    },
    {
      heading: "Networks & searching",
      bullets: [
        "LAN = one site · WAN = large distances linking networks.",
        "INTERNET = the global network of networks. WEB = one service on it (the pages). BROWSER = the program that fetches and renders a page. SEARCH ENGINE = one company's index of part of the web.",
        "Search: distinctive keywords, not sentences · \"exact phrase\" in quotes · -word to exclude · site:domain to restrict.",
        "Top result ≠ best result. Sponsored results are adverts.",
        "Judge a page: who · when · why · what evidence · who else says so.",
      ],
    },
    {
      heading: "E-safety checklist — run it before you close the laptop",
      bullets: [
        "PASSWORDS — long passphrase of unrelated words, a different one per account, two-factor authentication on, never shared with anyone.",
        "PERSONAL INFO — no full name plus school, address, phone, birthday, live location or identifiable uniform/street in anything public. Check what your account shares by default.",
        "FOOTPRINT — assume everything is permanent and copyable. Deleting your copy does not delete a screenshot. Decide before you post.",
        "SCAMS — urgency, something free or impossible, a slightly wrong address or shortened link, or a request for a password, OTP or payment. Don't click; go to the site by typing the address yourself.",
        "CYBERBULLYING — don't retaliate · screenshot the evidence with dates · block and report · tell a trusted adult.",
        "COPYRIGHT — other people's images, music and text belong to them. Use material licensed for reuse, credit the creator, and say when you used AI.",
        "WELLBEING — screens late at night wreck sleep, notifications fragment attention, edited posts are not real life. Set your own limits and take real breaks.",
        "IF SOMETHING GOES WRONG — tell an adult immediately, not eventually. Speed is what limits the damage, and you will not be in trouble for reporting it.",
      ],
    },
  ],
};

export const CLS7_GP_ICT_PACKS: ExamPack[] = [CLS7_GLOBAL_PERSPECTIVES_PACK, CLS7_ICT_PACK];
