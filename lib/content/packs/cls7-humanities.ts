// Cambridge Lower Secondary Humanities — History and Geography, Stage 7.
//
// Grade mapping: CNS Amanora runs Cambridge Primary as Grades 1–5 and Cambridge
// Lower Secondary as Grades 6–8, so a Grade 6 learner sits Stage 7. Both packs are
// registered with grade: 6 (the app matches packs by learner grade) while all
// learner-facing copy says "Stage 7".
//
// Framework code — checked, and NOT what you might expect. There is no standalone
// "Cambridge Lower Secondary History" or "Cambridge Lower Secondary Geography"
// curriculum framework. Cambridge publishes a single Lower Secondary HUMANITIES
// framework, code 0839, organised into three strands: People, Past (history) and
// Places (geography). The IGCSE codes 0470/0460 and the Global Perspectives code
// 0457 belong to other qualifications entirely and are deliberately not cited here.
// Schools such as CNS timetable History and Geography as separate lessons, which is
// why the app keeps them as separate subjects — so each pack names the strand it
// draws on and links the official 0839 Humanities curriculum page.
//
// Content topics vary by school. Cambridge groups the Stage 7–9 learning objectives
// together and lets centres choose their own periods and case studies, so the
// content topics below (early civilisations, empires, trade, the medieval world) are
// REPRESENTATIVE of what Stage 7 classes usually cover, not a prescribed list. The
// skills topics — sources, chronology, cause and consequence, change and continuity,
// significance and interpretations for History; map and enquiry skills for Geography
// — are the parts that are the same everywhere, and they are where the marks live.
//
// WHY THERE IS NO "EXACT" STAGE 7 SYLLABUS TO COPY IN (re-checked 2026-08-12)
// --------------------------------------------------------------------------
// Asked for the exact CNS Grade 6 syllabus, the honest answer is that it is not
// publicly obtainable, and the reasons are structural rather than a gap in the
// search:
//   · 0839's learning objectives are published for Stages 7–9 as ONE group. The
//     framework itself never says "this is Stage 7", so no stage-level topic list
//     exists to be copied.
//   · The framework PDF and its exemplifications sit behind the Cambridge Lower
//     Secondary support site, which is school-login only.
//   · There is no endorsed Stage 7 Humanities learner's book to take a contents
//     page from — Cambridge University Press publishes a Stages 7–9 DIGITAL
//     TEACHER'S RESOURCE for 0839 and nothing student-facing per stage.
//   · CNS Amanora publishes its subject list but not its scheme of work.
// So the school's own scheme of work is the only source that could make the word
// "exact" true. lib/content/school-syllabus.ts is where it goes once we have the
// document; until then this pack is framework-level and says so on screen.
//
// Sub-strand codes below are quoted from the official 0839 teacher guide (2024).
// Code shape: 789 + strand (PP People / PT Past / PC Places) + sub-strand + .NN,
// e.g. 789PTsk.04. Confirmed Past sub-strands: sk (skills), me (migration and
// empires), as (advances/scientific discoveries). Confirmed Places sub-strands:
// ph (population and health), ed (employment). The full sub-strand inventory is
// in the support-site PDF; only codes actually seen in the teacher guide are
// cited here, and no code is guessed.
//
// There is no external exam at Stage 7 — Checkpoint is sat at the end of Stage 9 —
// so both packs are framed as owning the year, not cramming for a paper.
//
// The two History source extracts are ORIGINAL and INVENTED for practice. They are
// labelled as such in the question text so nobody mistakes them for real documents;
// the skill being practised is reading provenance, which works just as well on a
// written-for-practice source. Every named historical fact and place example is real.
//
// Verified 2026-08-11 against the Cambridge Lower Secondary curriculum subject list
// and the Humanities (0839) curriculum page. Question stems are original.

import type { ExamPack } from "../exam-pack";

// =========================
// HISTORY — Stage 7 (Grade 6) · "Past" strand of Humanities 0839
// =========================
export const CLS7_HISTORY_PACK: ExamPack = {
  subjectId: "cls-history",
  grade: 6,
  title: "History — Stage 7 · Cambridge Lower Secondary",
  context: "Humanities framework 0839 · 'Past' strand · Stage 7 (Grade 6) · CNS Amanora",
  highlights: [
    { label: "Framework", value: "0839 Humanities · Past strand" },
    { label: "Stage", value: "Stage 7 = Grade 6" },
    { label: "Marks come from", value: "Evidence, not recall" },
    // Replaced by "School scheme of work, <year>" once one is registered for
    // this learner — see lib/content/school-syllabus.ts.
    { label: "Syllabus", value: "Framework-level · school scheme not loaded" },
  ],
  pinnedRule: {
    heading: "Never assert. Always evidence.",
    body: "In History, 'I think the Romans were good builders' is worth nothing. 'Source B shows an aqueduct still standing after nineteen centuries, which suggests Roman engineers built for the long term' is worth everything. Every claim you make should be followed by the word 'because' and then a piece of evidence — a source, a date, a named example. If you cannot say where you know it from, you do not yet know it.",
  },
  reference: {
    label: "Cambridge Lower Secondary Humanities (0839) — curriculum page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/humanities/",
  },
  plan: [
    { title: "Start with sources", hint: "Provenance first — who made it, when, why" },
    { title: "Fix your timeline", hint: "BCE runs backwards; the 400s BCE = 5th century BCE" },
    { title: "Walk the 9 topics", hint: "Tag each: solid / shaky / no idea" },
    { title: "Flip the flashcards", hint: "Concept words — cause, consequence, interpretation" },
    { title: "Answer the source questions out loud", hint: "Quote, then explain what the quote proves" },
    { title: "Cheat sheet before the class test", hint: "Last 10 minutes, nothing new" },
  ],

  topics: [
    {
      id: "sources", num: 1, title: "Sources & Evidence", skill: true,
      blurb: "History is an argument built from evidence — so you have to know what your evidence is and where it came from.",
      syllabus: [
        "Primary source = made at the time by someone connected to the event (a letter, a coin, a tool, a wall painting, a tax record). Secondary source = made later by someone studying it (a textbook, a documentary, a museum label). The same object can be primary for one question and secondary for another — a 1990 book is secondary about Ashoka but primary about what people believed in 1990.",
        "Provenance means the story of the source: WHO made it, WHEN, WHERE, and WHY. You judge a source by its provenance and its content together, never by content alone.",
        "Reliability asks 'can I trust this to be accurate?' Ask whether the writer was there, whether they had a reason to exaggerate, and who they were writing for.",
        "Bias is not the same as lying, and a biased source is not a useless source. A boastful royal inscription is unreliable about what actually happened but excellent evidence of how a ruler wanted to be seen.",
        "Usefulness (utility) is a different question from reliability. Always answer 'useful for WHAT?' — a source can be useful for one enquiry and useless for another.",
        "Corroboration means checking one source against another. Two independent sources agreeing is much stronger than one source shouting loudly.",
        "Think about what is MISSING. Most surviving sources were made by the powerful and the literate, so the lives of ordinary people, women, enslaved people and children are far harder to evidence. Archaeology helps fill some of that gap.",
      ],
    },
    {
      id: "chronology", num: 2, title: "Chronology & Periods", skill: true,
      blurb: "Getting time right is the cheapest set of marks in History — and the easiest to throw away.",
      syllabus: [
        "BCE (Before Common Era) and CE (Common Era) are the same as BC and AD, just without the religious wording. BCE years count BACKWARDS: 500 BCE is earlier than 200 BCE.",
        "There is no year zero. The year after 1 BCE is 1 CE.",
        "A decade is 10 years, a century is 100, a millennium is 1000. The century number is always one higher than the hundreds digit: 1857 is in the 19th century, and the 5th century BCE means 500–401 BCE.",
        "Work out the gap between dates: from 300 BCE to 200 CE is 500 years (add the two numbers when you cross the BCE/CE line; subtract when both are on the same side).",
        "Historians slice the past into periods (ancient, medieval, early modern) as a convenience. Period labels are made by later historians, do not have sharp edges, and often only fit one part of the world.",
        "Anachronism is putting something in the wrong time — a knight with a telescope, or asking why the Indus cities did not use gunpowder. Watch for it in films and in your own writing.",
      ],
    },
    {
      id: "cause", num: 3, title: "Cause & Consequence", skill: true,
      blurb: "Almost nothing in history has one cause, and almost nothing turns out exactly as intended.",
      syllabus: [
        "Separate long-term causes (conditions building up over years or centuries), short-term causes (things that happen in the run-up) and the trigger (the specific event that starts it).",
        "Causes are not a list — they connect. Say how one cause fed another rather than writing five unlinked sentences.",
        "Rank your causes. A strong answer says which cause mattered most and defends the choice; a weak one just names them all.",
        "Consequences split into short-term and long-term, and into intended and unintended. Rulers rarely get exactly the outcome they planned.",
        "Different groups experience the same event differently — a conquest that enriches a merchant class can devastate a farming one. Say WHO the consequence fell on.",
        "Beware 'X happened, then Y happened, so X caused Y'. Order in time is not the same as cause, and you need evidence for the link.",
      ],
    },
    {
      id: "change", num: 4, title: "Change, Continuity, Similarity & Difference", skill: true,
      blurb: "Two questions historians ask constantly: what actually changed, and how much was different somewhere else?",
      syllabus: [
        "Change and continuity run at the same time. When a new dynasty takes power, the ruler changes but the farming year, the language of the village and the way a house is built often do not.",
        "Describe the RATE of change: gradual, rapid, or a turning point — a single moment after which things could not go back.",
        "Progress is a judgement, not a fact. Change that improved life for one group often worsened it for another, so say for whom it was progress.",
        "Similarity and difference: compare two societies or two periods on the same criteria — how they were governed, how they fed themselves, what they believed, who held power.",
        "Compare across places as well as across time. Mesopotamia, Egypt, the Indus valley and Shang China all built cities near rivers, but their writing, building materials and burials differed sharply.",
        "Avoid 'people in the past were stupid'. They solved the problems they had with the tools and knowledge they had, and their solutions were often ingenious.",
      ],
    },
    {
      id: "significance", num: 5, title: "Significance & Interpretations", skill: true,
      blurb: "Why some events get remembered, and why two historians can read the same evidence and disagree.",
      syllabus: [
        "Historical significance is decided by later people, not by the event itself. Test it with the 5 Rs: was it Remarkable at the time, Remembered afterwards, Resonant for later generations, Resulting in change, and Revealing about its period?",
        "Significance changes over time. A figure ignored for centuries can become central once people start asking a new question.",
        "An interpretation is someone's version of the past — a historian's book, a museum display, a statue, a film, a school textbook.",
        "Interpretations differ for good reasons: new evidence is found, historians ask different questions, they select different evidence, they write for different audiences, and they live in times with different values.",
        "Disagreement between interpretations does not mean one must be a lie. Judge an interpretation by what evidence it rests on and what it leaves out.",
        "Films, games and novels are interpretations too. They are shaped by the need to entertain, which is a purpose worth naming when you evaluate them.",
      ],
    },
    {
      id: "early-civ", num: 6, title: "Early Civilisations & the First Cities",
      blurb: "Your school picks the periods; this one is the usual Stage 7 starting point. Why the first big settled societies grew up along rivers, and how we know.",
      syllabus: [
        "Rivers made large settled populations possible: reliable water, fertile soil renewed by flooding, and a route for transport. Mesopotamia sat between the Tigris and Euphrates, Egypt along the Nile, the Harappan cities along the Indus and its neighbours, and Shang China along the Yellow River.",
        "Farming surpluses let some people stop farming, which produced specialists — priests, scribes, soldiers, potters, metalworkers — and with them social hierarchy and rulers.",
        "Writing appears alongside the first states, largely because someone needed to keep records: cuneiform pressed into clay tablets in Mesopotamia, hieroglyphs in Egypt, and inscriptions on oracle bones in Shang China.",
        "The Harappan (Indus Valley) cities such as Harappa and Mohenjo-daro show grid-planned streets, covered drains, standardised baked bricks and standard weights — strong evidence of planning and organisation.",
        "The Indus script has not been deciphered. That is why we know a great deal about Harappan drains and very little about their rulers or beliefs — a clean example of how the surviving evidence shapes what history can say.",
        "Egyptian hieroglyphs COULD be deciphered, thanks to the Rosetta Stone carrying the same text in more than one script. Compare the two cases to see how much one lucky find can change a subject.",
      ],
    },
    {
      id: "empires", num: 7, title: "Empires, Rulers & Power",
      blurb: "Maps onto 0839 sub-strand 789PTme (migration and empires). How empires grew, how they were held together, and why they came apart.",
      syllabus: [
        "An empire is one state ruling over other peoples and territories, usually acquired by conquest. Expansion needed an army, and holding the ground needed something else entirely.",
        "Tools of control that turn up again and again: roads and messengers, provincial governors, taxation, a common language of administration, standard coinage, garrisons, and the promotion of a ruling ideology.",
        "The Achaemenid Persian empire under Cyrus the Great and his successors ran a network of royal roads and divided its territory among provincial governors called satraps.",
        "The Mauryan empire in South Asia was founded by Chandragupta Maurya in the late 4th century BCE. Its most famous ruler, Ashoka, had edicts carved on rocks and pillars across his territory — inscriptions that are themselves primary sources we can still read.",
        "Rome held its empire with legions, an unusually good road network, aqueducts and Latin as the language of law and administration. The western empire ended in 476 CE, while the eastern (Byzantine) empire continued for roughly another thousand years.",
        "Empires typically weaken through a combination of pressures — succession disputes, the cost of defending long frontiers, overstretched taxation, and outside groups pressing on the borders. Look for several causes, not one.",
        "Rulers controlled their image as well as their territory: coins, inscriptions, statues and monuments were deliberate messages. Read them as propaganda first and as fact second.",
      ],
    },
    {
      id: "life-trade", num: 8, title: "Everyday Life, Trade & Cultural Exchange",
      blurb: "Touches 789PTme (migration and empires) and the People strand's money-and-trade sub-strand. Goods travelled long distances — and ideas travelled with them.",
      syllabus: [
        "The Silk Roads were not one road but a shifting network of overland routes linking China, Central Asia, Persia and the Mediterranean. Most goods changed hands many times; few merchants travelled the whole way.",
        "Indian Ocean trade ran on the monsoon. Sailors used the southwest winds to sail one way and the northeast winds to return, which tied the sailing calendar to the weather system.",
        "Goods moved: silk, spices, cotton textiles, glass, horses, precious stones and metals. Technologies and crops moved with them, and so did diseases.",
        "Ideas travelled the same routes. Buddhism spread from South Asia into Central Asia and China along trade routes, and scholarship moved with merchants and pilgrims.",
        "Everyday life for most people in the ancient and medieval world meant farming, and it left far fewer written traces than palaces did. Archaeology — houses, cooking pots, animal bones, rubbish pits, burials — is often the best evidence we have for ordinary lives.",
        "Societies were hierarchical: rulers and priests at the top, then officials, merchants and artisans, then the farmers who were the great majority, with enslaved people in many societies below that.",
      ],
    },
    {
      id: "medieval", num: 9, title: "The Medieval World",
      blurb: "Period choice is the school's, not Cambridge's. A connected world of kingdoms, faiths, scholars and — eventually — plague.",
      syllabus: [
        "'Medieval' is a label invented much later for roughly 500–1500 CE, and it was coined with European history in mind. It fits other regions awkwardly, which is exactly the kind of thing a good historian points out.",
        "In medieval Europe, land was held in return for service and worked by peasants on manors, with castles and cathedrals as the great building projects and craft guilds controlling trades in towns. Historians argue about how well the tidy label 'feudalism' describes the messy reality.",
        "Baghdad became a major centre of scholarship, where Greek, Persian and Indian works were translated and built upon. Al-Khwarizmi's writing on calculation gave us the words 'algebra' and 'algorithm'.",
        "South Asia in this period held powerful states of its own: the Chola rulers of the south were a maritime power who launched naval expeditions across the Bay of Bengal and built the great temple at Thanjavur, and the later Vijayanagara empire ruled from Hampi, a city described in detail by foreign visitors.",
        "The Black Death reached Europe in the late 1340s, travelling along the same trade routes as goods. It killed a very large proportion of the population — historians' estimates vary widely — and reshaped wages, landholding and religion afterwards.",
        "Cross-cultural contact in this period was normal, not exceptional: pilgrims, ambassadors, scholars and merchants moved between regions and wrote accounts that are now among our most valuable sources.",
      ],
    },
  ],

  flashcards: [
    { term: "Primary source", def: "Evidence made at the time of the event by someone connected to it — a letter, coin, tool, inscription or photograph." },
    { term: "Secondary source", def: "An account made later by someone studying the period — a textbook, documentary or museum label." },
    { term: "Provenance", def: "The story of a source: who made it, when, where and why. Judge a source on provenance AND content." },
    { term: "Reliability", def: "How far a source can be trusted to be accurate. Ask: were they there, and did they have a reason to bend it?" },
    { term: "Bias", def: "A one-sided view. Not the same as lying — and a biased source is still strong evidence of an attitude." },
    { term: "Utility (usefulness)", def: "How helpful a source is for a particular enquiry. Always finish the sentence: useful for WHAT?" },
    { term: "Corroboration", def: "Checking one source against another. Two independent sources agreeing is far stronger than one." },
    { term: "BCE / CE", def: "Before Common Era / Common Era — the same counting as BC/AD. BCE years run backwards, and there is no year zero." },
    { term: "Century rule", def: "The century number is one higher than the hundreds digit: 1857 is in the 19th century; the 5th century BCE is 500–401 BCE." },
    { term: "Anachronism", def: "Something placed in the wrong period — a medieval knight with a telescope." },
    { term: "Long-term cause", def: "A condition building up over years or centuries before the event." },
    { term: "Trigger", def: "The specific short-term event that sets things off — the last cause, not the only one." },
    { term: "Unintended consequence", def: "A result nobody planned. Rulers rarely get exactly the outcome they aimed for." },
    { term: "Continuity", def: "What stayed the same. It runs alongside change — a new ruler does not change the farming year." },
    { term: "Turning point", def: "A moment after which things could not go back to how they were." },
    { term: "Historical significance", def: "Why an event is judged to matter — test it with the 5 Rs: Remarkable, Remembered, Resonant, Resulting in change, Revealing." },
    { term: "Interpretation", def: "Someone's version of the past — a historian's book, a museum display, a statue or a film." },
    { term: "Why interpretations differ", def: "New evidence, different questions, different selection of evidence, different audiences, different times and values." },
    { term: "Empire", def: "One state ruling over other peoples and territories, usually taken by conquest." },
    { term: "Satrap", def: "A provincial governor in the Achaemenid Persian empire." },
    { term: "Ashoka's edicts", def: "Inscriptions carved on rocks and pillars across the Mauryan empire — primary sources we can still read today." },
    { term: "Cuneiform", def: "Wedge-shaped writing pressed into clay tablets in Mesopotamia — among the earliest writing systems." },
    { term: "Harappan cities", def: "Indus valley cities such as Harappa and Mohenjo-daro: grid streets, covered drains, standardised bricks and weights." },
    { term: "Why the Indus is a puzzle", def: "Its script is undeciphered, so we know their drains far better than their rulers or beliefs." },
    { term: "Rosetta Stone", def: "The find that let scholars decipher Egyptian hieroglyphs, because it carried the same text in more than one script." },
    { term: "Silk Roads", def: "A network of overland routes linking China, Central Asia, Persia and the Mediterranean — goods usually changed hands many times." },
    { term: "Monsoon trade", def: "Indian Ocean sailors rode the southwest winds out and the northeast winds home, so the weather set the trading calendar." },
    { term: "Black Death", def: "The plague that reached Europe in the late 1340s along trade routes, killing a very large share of the population." },
  ],

  questions: [
    {
      id: "clsh7-1", topic: "sources",
      q: "A historian studying Roman Britain uses a coin minted in 120 CE and a 2019 university book about Roman Britain. Classify each source and explain your reasoning.",
      model: "The coin is a primary source: it was made at the time being studied, by people connected to Roman rule. The 2019 book is a secondary source: it was written long afterwards by someone studying the period, using primary evidence. Note that the same 2019 book would be a PRIMARY source for a historian studying how people in the 2020s wrote about the Romans — what counts as primary depends on the question being asked.",
      hint: "Primary or secondary depends on the enquiry, not just the object.",
    },
    {
      id: "clsh7-2", topic: "sources",
      q: "Source A (an original extract written for practice, not a real document). 'The granaries of the eastern district stand full, and the people give thanks daily for the wisdom of our lord the king, whose canals have banished hunger from this land forever.' — from an inscription set up by a royal official at the entrance to a new canal, about 1400 BCE.\n\nHow useful is Source A to a historian studying whether the king's canals actually reduced hunger? Explain your answer using both the content and the provenance.",
      model: "Limited for that particular question, but useful for another. Provenance is the problem: it was written by a ROYAL OFFICIAL, set up in PUBLIC, at the entrance to the king's own canal — its purpose is to praise the king, not to report honestly. Words like 'forever' and 'banished hunger' are boastful rather than measured, and an official who wrote anything else risked his position. So it is weak evidence that hunger actually fell. It IS useful evidence of how the king wanted his rule to be seen, and of the fact that canal-building was something a ruler expected to be praised for. To answer the original question a historian would corroborate it with different evidence — grain records, archaeological remains of storage buildings, or accounts written by people outside the court.",
      hint: "Ask who wrote it, where it was displayed, and what they wanted the reader to think.",
    },
    {
      id: "clsh7-3", topic: "sources",
      q: "Source B (an original extract written for practice, not a real document). 'We reached the port after forty days at sea. The harbour was crowded with ships from many lands, and in the market I counted cloth, pepper, glass and horses changing hands in a single morning. The merchants here speak three tongues and trust none of them.' — from the travel journal of a foreign merchant, written about 1250 CE.\n\nGive TWO things a historian can learn from Source B about trade in this port, and ONE reason to be cautious about the source.",
      model: "Two things that can be learned: (1) the port handled long-distance trade in a wide range of goods — cloth, pepper, glass and horses — which suggests it connected several different regions rather than serving only a local market; (2) it was a multilingual, cosmopolitan place where merchants from many lands did business together. Caution (any one, well explained): the writer is a foreigner and an outsider who may misunderstand what he sees; he was only there briefly; a journal records one person's impression on particular days, so the crowded harbour may not be typical; and the remark that merchants 'trust none of them' is an opinion, not a fact. A historian would corroborate the account with other evidence such as port records, coins or archaeological finds of traded goods.",
    },
    {
      id: "clsh7-4", topic: "sources",
      q: "A student writes: 'Source C is biased, so it is useless.' What is wrong with this judgement?",
      opts: [
        "Nothing — biased sources should be ignored",
        "Bias makes a source unreliable about events, but it is still useful evidence of what the writer believed and wanted others to believe",
        "Bias only matters in secondary sources",
        "A source can only be biased if the writer was lying deliberately",
      ],
      a: "Bias makes a source unreliable about events, but it is still useful evidence of what the writer believed and wanted others to believe",
      model: "Bias is a reason to read a source carefully, not a reason to bin it. A one-sided source may be poor evidence of what happened, while being excellent evidence of attitudes, propaganda and what a group wanted the public to think. The examiner wants 'useful FOR WHAT', not 'biased, therefore useless'.",
    },
    {
      id: "clsh7-5", topic: "chronology",
      q: "Put these in order from earliest to latest and state which century each falls in: 1347 CE, 490 BCE, 76 CE, 1526 CE.",
      model: "Earliest to latest: 490 BCE (5th century BCE), 76 CE (1st century CE), 1347 CE (14th century CE), 1526 CE (16th century CE). Remember BCE counts backwards, so 490 BCE comes before all the CE dates, and the century number is always one higher than the hundreds digit.",
      hint: "BCE runs backwards; centuries are one higher than the hundreds digit.",
    },
    {
      id: "clsh7-6", topic: "chronology",
      q: "How many years passed between 250 BCE and 150 CE?",
      opts: ["100 years", "250 years", "400 years", "500 years"],
      a: "400 years",
      model: "Because the dates sit either side of the BCE/CE line, you add them: 250 + 150 = 400 years. (If both dates were CE you would subtract instead.) There is no year zero, but at this scale that does not change the working.",
    },
    {
      id: "clsh7-7", topic: "cause",
      q: "Explain the difference between a long-term cause and a trigger, using an example of your own.",
      model: "A long-term cause is a condition that builds up over years or centuries and makes an event possible — for example, an empire steadily running short of money to pay its frontier armies. A trigger is the specific short-term event that actually sets things off — for example, a disputed succession after a ruler dies suddenly. The trigger is the last cause in the chain, not the most important one: without the long-term pressure, the same trigger would probably have led nowhere.",
    },
    {
      id: "clsh7-8", topic: "cause",
      q: "A student writes: 'The new tax was announced in March. The rebellion started in April. Therefore the tax caused the rebellion.' What is the flaw in this reasoning?",
      opts: [
        "There is no flaw — the dates prove it",
        "One event following another does not prove it caused it; you need evidence linking them, and there may be other causes",
        "The tax cannot be a cause because it was announced too recently",
        "Rebellions never have economic causes",
      ],
      a: "One event following another does not prove it caused it; you need evidence linking them, and there may be other causes",
      model: "Order in time is not the same as cause. The tax may well have been the trigger, but the student has offered no evidence of a link — no rebel demands mentioning the tax, no account from the time. There were probably long-term causes too: a bad harvest, resentment built up over years, weak local government. A strong answer offers evidence for the link and considers other causes.",
    },
    {
      id: "clsh7-9", topic: "change",
      q: "An empire is conquered by a new dynasty. Give one thing likely to CHANGE quickly and one thing likely to show CONTINUITY, and explain each.",
      model: "Likely to change: who rules and who holds the top offices — the new dynasty installs its own governors, puts its own name and image on coins, and may change the language used in official documents. Likely to continue: the daily life of the farming majority — the crops, the farming year, village houses, local languages, religious practice and family life usually carry on much as before, because a change at the top does not change the soil or the seasons. Good History answers describe change and continuity together rather than treating a conquest as a total break.",
      hint: "The top of society changes faster than the bottom.",
    },
    {
      id: "clsh7-10", topic: "change",
      q: "Why is it a mistake to describe a historical change as 'progress' without saying more?",
      model: "Because 'progress' is a judgement about whether something was an improvement, and improvements are rarely improvements for everybody. A change that enriches merchants may push farmers off their land; a technology that speeds up production may destroy the livelihoods of skilled craftworkers. A strong answer names WHO benefited, who lost out, and on what measure it was better — so 'progress for the landowners, but not for the tenants' rather than a flat 'progress'.",
    },
    {
      id: "clsh7-11", topic: "significance",
      q: "Two historians write about the same ruler. One calls him a great unifier; the other calls him a brutal conqueror. Both are respected historians using real evidence. Explain how this is possible.",
      model: "They are producing different interpretations, and interpretations can differ without either being a lie. They may have selected different evidence — one focusing on administrative records and building projects, the other on accounts of campaigns and their casualties. They may be asking different questions ('how was the state held together?' versus 'what did conquest cost the conquered?'). They may be writing at different times or for different audiences, with different values about what counts as greatness. They may also have access to different evidence, if new material has since been found. You judge each interpretation by what evidence it rests on and what it leaves out — and both descriptions may be partly true at once.",
      hint: "Different questions and different selections of the same evidence.",
    },
    {
      id: "clsh7-12", topic: "significance",
      q: "Which of these is the strongest argument that an event was historically significant?",
      opts: [
        "It happened a very long time ago",
        "A lot of people have heard of it",
        "It changed how large numbers of people lived, and its effects can still be traced afterwards",
        "It is in the textbook",
      ],
      a: "It changed how large numbers of people lived, and its effects can still be traced afterwards",
      model: "Significance is about consequences and resonance, not age or fame. The 5 Rs give you the test: Remarkable at the time, Remembered afterwards, Resonant for later generations, Resulting in change, Revealing about its period. 'It's famous' is circular — plenty of significant events were forgotten for centuries and plenty of famous ones changed little.",
    },
    {
      id: "clsh7-13", topic: "early-civ",
      q: "Explain why the earliest large civilisations grew up along rivers. Give at least three reasons.",
      model: "(1) Reliable fresh water for people, animals and crops, all year rather than only in the rainy season. (2) Fertile soil — flooding deposited fresh silt on the land, so fields could be farmed year after year and produced a surplus. (3) Transport — rivers carried goods and people far more easily than roads, which allowed trade and let a ruler govern a wider area. A surplus of food was the key link: once not everyone had to farm, people could specialise as priests, scribes, soldiers and craftworkers, which is how cities and states became possible.",
    },
    {
      id: "clsh7-14", topic: "early-civ",
      q: "We know a great deal about Harappan drainage and city planning, but very little about who ruled the Harappan cities. What is the main reason?",
      opts: [
        "The Harappans did not have rulers",
        "Their script has not been deciphered, so their written records cannot be read",
        "Archaeologists have not excavated the cities",
        "All their records were destroyed by flooding",
      ],
      a: "Their script has not been deciphered, so their written records cannot be read",
      model: "Drains, streets, bricks and weights survive physically, so archaeology tells us about them directly. Rulers, laws and beliefs are usually known from written records — and the Indus script remains undeciphered, so those records cannot be read. Compare Egypt, where the Rosetta Stone allowed hieroglyphs to be deciphered and unlocked a huge body of writing. It is a sharp reminder that what history can say is limited by what evidence survives in a form we can use.",
    },
    {
      id: "clsh7-15", topic: "empires",
      q: "Conquering territory and holding it are different problems. Describe three methods empires used to hold territory once it had been conquered.",
      model: "Any three, explained: (1) Administration — appointing provincial governors answerable to the ruler, such as the satraps of the Achaemenid Persian empire, so orders reached distant regions. (2) Communication — building roads and messenger systems, like the Persian royal roads or the Roman road network, so armies and instructions could move quickly. (3) Taxation and coinage — a standard system that funded the army and tied the provinces into one economy. (4) A common language of administration, such as Latin in the Roman empire. (5) Garrisons of troops stationed in the provinces. (6) Ideology and image — inscriptions, monuments and coins presenting the ruler as legitimate, as with Ashoka's rock and pillar edicts. Armies win land; administration keeps it.",
      hint: "Roads, governors, taxes, language, garrisons, image.",
    },
    {
      id: "clsh7-16", topic: "empires",
      q: "A ruler's coin shows him crowned, in armour, with a victory inscription. How should a historian use this as evidence?",
      model: "Treat it as a primary source with a clear purpose: coins were an official message circulated to everyone who used money, so the image is what the ruler wanted people to believe about him, not a neutral record. It is strong evidence of how he wished to be seen — powerful, legitimate, victorious — and of the fact that military success was something worth advertising. It is weak evidence that he actually won the battle it claims, since no ruler minted coins celebrating his defeats. Corroborate it with independent evidence: accounts by outsiders, archaeological traces of the campaign, or records from the region supposedly conquered.",
    },
    {
      id: "clsh7-17", topic: "life-trade",
      q: "The Silk Roads are often pictured as a single road travelled end to end by merchants carrying silk from China to Rome. Correct this picture.",
      model: "It was not one road but a shifting network of overland routes across Central Asia, and few merchants travelled the whole distance. Goods were bought and sold many times along the way, each trader covering a stretch they knew, so a bolt of silk might change hands a dozen times before reaching the Mediterranean. Silk was not the only cargo either — spices, glass, horses, precious stones and metals all moved — and the name 'Silk Road' was coined by a 19th-century geographer, long after the routes were in use. Ideas, technologies, religions and diseases travelled the same routes as the goods.",
      hint: "A network of relays, not a single journey.",
    },
    {
      id: "clsh7-18", topic: "life-trade",
      q: "Why did Indian Ocean trading voyages follow a strict yearly calendar?",
      opts: [
        "Religious festivals forbade sailing at other times",
        "The monsoon winds reverse direction each year, so ships sailed one way with the southwest winds and returned with the northeast winds",
        "Ports were only open in summer",
        "Ships could not sail at all in winter anywhere in the world",
      ],
      a: "The monsoon winds reverse direction each year, so ships sailed one way with the southwest winds and returned with the northeast winds",
      model: "Sailing ships depended on the wind, and the monsoon system reverses seasonally. Merchants rode the southwest monsoon winds in one direction and waited for the northeast winds to carry them home, which meant a voyage was planned around the weather system and could involve months of waiting in a foreign port. It is a good example of physical geography shaping human history directly.",
    },
    {
      id: "clsh7-19", topic: "life-trade",
      q: "Why is the everyday life of ordinary farmers harder for historians to reconstruct than the lives of rulers?",
      model: "Because most written sources were produced by and about the powerful and the literate — royal inscriptions, tax records, court chronicles, religious texts — and ordinary farmers rarely wrote anything or had anything written about them. Their houses and possessions were also made of less durable materials than palaces and temples, so less survives above ground. Historians get at their lives mainly through archaeology: house foundations, cooking pots, animal bones, seeds, rubbish pits and burials, plus the occasional mention in a tax list or law code. Noticing whose voices are missing from the evidence is itself a historical skill.",
    },
    {
      id: "clsh7-20", topic: "medieval",
      q: "Historians point out that 'medieval' is an awkward label. Give two reasons why.",
      model: "(1) It was invented much later, by people who saw the period as a mere gap — a 'middle age' — between the ancient world and their own. That built a judgement into the name before any evidence was examined. (2) It was coined with European history in mind, so applying it to South Asia, China, West Africa or the Americas forces very different histories into a European timetable, and its start and end dates fit those regions badly. Period labels have blurred edges and are a convenience for historians, not facts about the past.",
      hint: "Who invented the label, and for whose history?",
    },
  ],

  mistakes: [
    {
      mistake: "Retelling the story instead of answering the question.",
      fix: "Narrative earns almost nothing. Re-read the question, decide what it is asking you to judge (why? how far? how useful?), and make your first sentence a direct answer to that. Then support it.",
    },
    {
      mistake: "Describing what a source SAYS and stopping there.",
      fix: "Saying is only step one. Quote briefly, then explain what the quote lets you INFER, then bring in the provenance — who made it, when and why. 'This suggests…' and 'because it was written by…' are the phrases that turn description into evidence.",
    },
    {
      mistake: "Ignoring provenance and judging a source only on its content.",
      fix: "Read the caption before the extract. Who wrote it, when, where and for whom decides how much weight the content deserves. A boastful royal inscription and a private letter are not equally trustworthy about the same event.",
    },
    {
      mistake: "Writing 'this source is biased so it is useless'.",
      fix: "Never a full answer. Say what it is biased TOWARDS, why (its purpose and audience), and what it is still useful for — usually as evidence of attitudes and propaganda rather than of events.",
    },
    {
      mistake: "Muddling BCE dates — thinking 200 BCE comes before 500 BCE.",
      fix: "BCE counts backwards towards zero: 500 BCE is EARLIER than 200 BCE. Sketch a quick timeline in the margin with 0 in the middle before you order anything.",
    },
    {
      mistake: "Getting the century wrong — calling 1857 the 18th century.",
      fix: "The century is one higher than the hundreds digit. 1857 is in the 19th century because the 19th century runs 1801–1900. The same rule backwards: the 5th century BCE is 500–401 BCE.",
    },
    {
      mistake: "Listing causes without linking or ranking them.",
      fix: "Show how causes connect ('the harvest failure mattered because taxes were already high') and then say which mattered most and why. A ranked, connected argument beats a list every time.",
    },
    {
      mistake: "Assuming that because one event followed another, it was caused by it.",
      fix: "Order is not cause. You need evidence of the link — someone at the time saying so, or a chain you can trace. Otherwise say 'this may have contributed' rather than 'this caused'.",
    },
    {
      mistake: "Treating a conquest or a new ruler as a total break with the past.",
      fix: "Always look for continuity alongside change. Farming, language, family life and local religion usually survive a change of dynasty. Saying what stayed the same shows a sharper eye than only listing what changed.",
    },
    {
      mistake: "Judging people in the past by today's standards and calling them stupid or backward.",
      fix: "Explain what they knew, what they had, and what problem they were solving. You can still say a practice caused suffering — but explain the thinking behind it first. That is analysis, not excuse-making.",
    },
    {
      mistake: "Treating a textbook, museum display or film as neutral fact.",
      fix: "They are interpretations. Each one selects evidence, leaves things out and has a purpose and an audience — a film also needs to entertain. Name the purpose when you evaluate it.",
    },
    {
      mistake: "Making a confident claim with no evidence attached.",
      fix: "Follow every claim with 'because' plus something specific — a source, a date, a named example. If you cannot finish the sentence, the claim is not ready to write down.",
    },
  ],

  cheat: [
    {
      heading: "Source evaluation — the framework",
      bullets: [
        "Read the CAPTION first: who made it, when, where, why, for whom. That is provenance.",
        "N-O-P: Nature (what type of source is it?), Origin (who and when?), Purpose (what was it meant to achieve?).",
        "Then content: what does it actually say, and what can you infer beyond what it says?",
        "Reliability = can I trust it to be accurate? Ask: were they there, and did they gain from bending it?",
        "Utility = useful FOR WHAT? Always name the enquiry. Biased ≠ useless.",
        "Corroborate: does another independent source agree? What is missing that you would want?",
        "Write it as: quote briefly → 'this suggests…' → 'and because it was written by…, it is/isn't strong evidence for…'",
      ],
    },
    {
      heading: "Chronology — get these free marks",
      bullets: [
        "BCE counts BACKWARDS. 500 BCE is earlier than 200 BCE. There is no year zero.",
        "Century = hundreds digit + 1. 1857 → 19th century. 5th century BCE → 500–401 BCE.",
        "Crossing the BCE/CE line: ADD the two numbers. Same side of the line: SUBTRACT.",
        "Decade 10 · century 100 · millennium 1000.",
        "Period labels (ancient, medieval, early modern) are made by later historians and have blurred edges.",
        "Anachronism check: could this thing actually exist in this year?",
      ],
    },
    {
      heading: "The five thinking tools",
      bullets: [
        "Cause & consequence — long-term / short-term / trigger; intended / unintended; and WHO it fell on.",
        "Change & continuity — what changed, what stayed the same, how fast, and was it a turning point?",
        "Similarity & difference — compare two societies on the SAME criteria: rule, food, belief, power.",
        "Significance — the 5 Rs: Remarkable, Remembered, Resonant, Resulting in change, Revealing.",
        "Interpretations — differ because of new evidence, different questions, different selection, different audiences and values.",
      ],
    },
    {
      heading: "Content anchors worth remembering",
      bullets: [
        "River civilisations: Mesopotamia (Tigris & Euphrates, cuneiform on clay), Egypt (Nile, hieroglyphs), Harappan (Indus, grid streets and drains), Shang China (Yellow River, oracle bones).",
        "Indus script is undeciphered → we know their drains, not their rulers. Egyptian hieroglyphs were deciphered thanks to the Rosetta Stone.",
        "Holding an empire: governors (Persian satraps), roads, taxes, coinage, a common language (Latin), garrisons, image (Ashoka's edicts).",
        "Rome: legions, roads, aqueducts, Latin. Western empire ends 476 CE; the eastern (Byzantine) empire continues far longer.",
        "Mauryan empire founded by Chandragupta Maurya in the late 4th century BCE; Ashoka's rock and pillar edicts are readable primary sources.",
        "Silk Roads = a network of relays, not one journey. Indian Ocean trade ran on the reversing monsoon winds.",
        "Black Death reached Europe in the late 1340s along trade routes; estimates of the death toll vary widely.",
      ],
    },
    {
      heading: "Command words — what each one wants",
      bullets: [
        "Describe → what it was like. Facts and detail, no judgement needed.",
        "Explain → WHY. Every point needs 'because' and a piece of evidence.",
        "How useful / how reliable → provenance + content + what it is useful FOR + what is missing.",
        "How far do you agree → argue one side, argue the other, then judge and say why.",
        "Compare → use the same criteria for both, and use linking words: 'whereas', 'both', 'unlike'.",
        "Why do interpretations differ → evidence available, question asked, selection made, audience, values of the writer's own time.",
      ],
    },
    {
      heading: "How to write the answer",
      bullets: [
        "First sentence answers the question directly. Do not warm up.",
        "One point per paragraph: claim → evidence → explanation of how the evidence supports the claim.",
        "Name names. 'A ruler' is weak; 'Ashoka' is strong. Specific beats vague every time.",
        "Use the concept words on purpose: cause, consequence, continuity, significance, interpretation, provenance.",
        "For a 'how far' question, finish with a judgement — an answer that never decides anything scores less than one that does.",
      ],
    },
  ],
};

// =========================
// GEOGRAPHY — Stage 7 (Grade 6) · "Places" strand of Humanities 0839
// =========================
export const CLS7_GEOGRAPHY_PACK: ExamPack = {
  subjectId: "cls-geography",
  grade: 6,
  title: "Geography — Stage 7 · Cambridge Lower Secondary",
  context: "Humanities framework 0839 · 'Places' strand · Stage 7 (Grade 6) · CNS Amanora",
  highlights: [
    { label: "Framework", value: "0839 Humanities · Places strand" },
    { label: "Stage", value: "Stage 7 = Grade 6" },
    { label: "Marks come from", value: "Named places + map skills" },
    // Replaced by "School scheme of work, <year>" once one is registered for
    // this learner — see lib/content/school-syllabus.ts.
    { label: "Syllabus", value: "Framework-level · school scheme not loaded" },
  ],
  pinnedRule: {
    heading: "Every answer needs a real, named place",
    body: "Geography is the study of actual places, so 'in some countries it rains a lot' scores nothing while 'Mahabaleshwar, on the crest of the Western Ghats, receives far more monsoon rain than Pune, which lies in the rain shadow to the east' scores well. Build a small stock of named examples — the Sahyadri, the Mula-Mutha, Pune, the Ganges plain, the Sahara — and drop the right one into every answer.",
  },
  reference: {
    label: "Cambridge Lower Secondary Humanities (0839) — curriculum page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/humanities/",
  },
  plan: [
    { title: "Do map skills first", hint: "Grid refs and contours turn up in every paper" },
    { title: "Walk the 8 topics", hint: "Tag each: solid / shaky / no idea" },
    { title: "Flip the flashcards", hint: "Definitions must be exact — density is not distribution" },
    { title: "Practise the grid questions on paper", hint: "Along the corridor, then up the stairs" },
    { title: "Learn five named examples", hint: "Two local, three international — reuse them everywhere" },
    { title: "Cheat sheet before the class test", hint: "Last 10 minutes, nothing new" },
  ],

  topics: [
    {
      id: "skills", num: 1, title: "Geographical Skills — Maps, Grids & Graphs", skill: true,
      blurb: "The toolkit. Every other topic gets tested through these, so learn them first.",
      syllabus: [
        "Atlas skills: lines of latitude run east–west and measure how far north or south of the Equator you are; lines of longitude run north–south from pole to pole and measure east or west of the Prime Meridian. Give latitude first, then longitude. Key lines: Equator (0°), Tropic of Cancer, Tropic of Capricorn, and the Prime Meridian (0°).",
        "Four-figure grid references name a whole square: read the EASTINGS (the numbers along the bottom) first, then the NORTHINGS (up the side). 'Along the corridor, then up the stairs.' The number pair is the bottom-left corner of the square.",
        "Six-figure grid references pinpoint a spot: divide the square into tenths and add the extra digit to each pair — easting, its tenth, northing, its tenth. Square 4278 with a feature 6 tenths across and 3 tenths up gives 426783.",
        "Scale converts map distance to real distance. On a 1:50 000 map, 1 cm on the map is 50 000 cm on the ground = 0.5 km. Use a piece of paper or string for a winding road, then measure it against the scale bar.",
        "Direction: the eight compass points (N, NE, E, SE, S, SW, W, NW) and bearings measured clockwise in degrees from north — north 000°, east 090°, south 180°, west 270°.",
        "Contour lines join points of equal height above sea level. Contours close together = steep slope; far apart = gentle slope; concentric rings with values increasing inwards = a hill; a V pointing UPHILL (upstream) = a valley. The gap between contours is the contour interval.",
        "Reading data: line graph for change over time, bar chart for comparing categories, pie chart for proportions of a whole, and a climate graph combining bars (rainfall, mm) with a line (temperature, °C). Photographs are evidence too — describe foreground, middle ground and background, and say what you cannot see.",
        "Fieldwork enquiry follows a sequence: ask a geographical question → plan the method and where to sample → collect data (measurements, counts, surveys, sketches, photographs) → present it → analyse it → conclude and evaluate what could be improved.",
      ],
    },
    {
      id: "weather", num: 2, title: "Weather & Climate",
      blurb: "Weather is what you get today; climate is what you expect over decades.",
      syllabus: [
        "Weather = the state of the atmosphere at a place at a particular time, changing day to day. Climate = the average pattern of weather at a place over a long period, conventionally about 30 years.",
        "The elements of weather and how each is measured: temperature (thermometer, °C), rainfall (rain gauge, mm), wind speed (anemometer), wind direction (wind vane — winds are named after where they come FROM), air pressure (barometer), humidity (hygrometer), cloud cover (oktas) and sunshine hours. Thermometers are housed in a white, louvred Stevenson screen so readings are taken in shade and out of the rain.",
        "Factors controlling temperature: latitude (the Sun's energy is spread over a wider area near the poles), altitude (temperature falls as you go higher), distance from the sea, ocean currents, prevailing winds and aspect.",
        "Types of rainfall: relief rainfall (air forced to rise over high ground, cools, condenses — the Western Ghats are a textbook case), convectional rainfall (ground heats, air rises, afternoon downpour) and frontal rainfall (warm air rising over cold air).",
        "The Indian monsoon: land heats faster than the sea in summer, creating low pressure over the subcontinent that draws in moist air from the Indian Ocean. The southwest monsoon brings the main rains from around June to September; a reversed northeast flow brings rain to parts of southeastern India later in the year.",
        "Rain shadow: air rising over the windward side of a mountain range drops its moisture there and descends drier on the leeward side. Mahabaleshwar, on the crest of the Sahyadri, is one of the wettest places in Maharashtra, while Pune, just to the east, is much drier.",
        "Read a climate graph properly: rainfall as bars against the right-hand axis in mm, temperature as a line against the left-hand axis in °C. Quote the wettest and driest months, the annual temperature range (highest mean minus lowest mean), and describe the pattern.",
      ],
    },
    {
      id: "rivers", num: 3, title: "Rivers & the Water Cycle",
      blurb: "Water moves in a closed loop, and on the way down it carves the landscape.",
      syllabus: [
        "The water cycle: evaporation and transpiration → condensation into cloud → precipitation → surface run-off and infiltration → groundwater flow → back to the sea. It is a closed system: no water is added or lost overall.",
        "Drainage basin vocabulary: source (where a river starts), tributary (a smaller river joining it), confluence (where two rivers meet), watershed (the high boundary between two basins), channel, and mouth (where it reaches the sea or a lake).",
        "Erosion processes: hydraulic action (the force of the water itself), abrasion (the load scraping the bed and banks), attrition (stones knocking against each other and becoming smaller and rounder) and solution (rock dissolving).",
        "Transport processes: traction (rolling boulders), saltation (bouncing pebbles), suspension (fine material carried in the water, which makes it look brown) and solution (dissolved minerals). Deposition happens when the river slows and no longer has the energy to carry its load.",
        "Down the long profile: the upper course is steep and narrow with a V-shaped valley, waterfalls and rapids; the middle course widens and begins to meander; the lower course is wide, gentle and depositing, with a floodplain, meanders, ox-bow lakes and sometimes a delta or estuary at the mouth.",
        "Flooding is caused by heavy or prolonged rainfall, saturated or impermeable ground, steep slopes, deforestation, and urban surfaces such as concrete and tarmac that stop water soaking in and speed run-off into the channel. Management includes embankments, dams, flood warning systems and giving the river room to flood safely.",
        "Local example: the Mula and the Mutha rise in the Western Ghats and meet at the confluence in Pune to form the Mula-Mutha, which flows east to join the Bhima, a tributary of the Krishna. Khadakwasla Dam on the Mutha is a major part of Pune's water supply.",
      ],
    },
    {
      id: "rocks", num: 4, title: "Rocks, Weathering & Soil",
      blurb: "Three rock families, three ways rock breaks down, and the thin layer of soil that everything depends on.",
      syllabus: [
        "Igneous rock forms when molten magma or lava cools and solidifies — granite (cooled slowly underground, large crystals) and basalt (cooled quickly at the surface, small crystals).",
        "Sedimentary rock forms when sediment is deposited in layers, then compacted and cemented over long periods — sandstone and limestone. It can contain fossils; igneous rock cannot.",
        "Metamorphic rock forms when existing rock is changed by heat and/or pressure without melting — limestone becomes marble, shale becomes slate.",
        "Weathering is the breakdown of rock IN PLACE. Physical (mechanical): freeze–thaw, where water freezes in a crack and expands, and exfoliation, where repeated heating and cooling flakes off the outer layer. Chemical: rainwater that is slightly acidic dissolving rock such as limestone. Biological: plant roots prising cracks apart and burrowing animals.",
        "Erosion is different: it is the wearing away AND REMOVAL of material by a moving agent — a river, the sea, ice or wind. Weathering stays put; erosion carries away.",
        "Soil is a mixture of weathered mineral particles, humus (decayed organic matter), water, air and living organisms. It builds up in horizons, roughly a surface organic layer over a dark topsoil, then a subsoil, then broken parent rock. Soil texture depends on the balance of sand, silt and clay.",
        "Local example: the Deccan plateau around Pune is built from vast basalt lava flows. Weathered basalt produces the dark 'black cotton' soil of the region, which holds moisture well.",
      ],
    },
    {
      id: "landforms", num: 5, title: "Landforms & Physical Processes",
      blurb: "The big shapes of the land, and the processes that build them up and wear them down.",
      syllabus: [
        "The Earth's outer shell is broken into tectonic plates that move slowly. Most earthquakes, volcanoes and fold mountains occur near plate boundaries — the Himalayas are still rising as the Indian plate pushes into the Eurasian plate.",
        "Landforms are made by a balance of construction (tectonic uplift, volcanic eruption, deposition) and destruction (weathering, erosion, mass movement). Nothing in a landscape is finished.",
        "Mountains, plateaus, plains, valleys and escarpments: a plateau is a raised area of relatively flat land, and the Deccan plateau, on which Pune sits, is a large one.",
        "The Western Ghats (Sahyadri) run roughly parallel to India's west coast and form the western edge of the Deccan plateau. Their steep western scarp forces monsoon air upwards, producing heavy relief rainfall on the windward side.",
        "Coastal landforms are produced by wave erosion and deposition: cliffs, wave-cut platforms, caves, arches, stacks, and beaches and spits where material is deposited.",
        "Describing relief properly means talking about height, steepness and shape of the land, using contour evidence — not just saying 'it is hilly'.",
      ],
    },
    {
      id: "population", num: 6, title: "Population & Settlement",
      blurb: "0839 sub-strand 789PCph (population and health). Where people live, why they live there, and why they move.",
      syllabus: [
        "Population distribution is the SPREAD of people across an area. Population density is the NUMBER of people per square kilometre. They are not the same word and are not interchangeable.",
        "Densely populated areas tend to have flat land, fertile soil, reliable water, a moderate climate, resources and good transport — the Ganges plain, eastern China, western Europe. Sparsely populated areas tend to be too dry, too cold, too high or too dense with forest — the Sahara, the Thar desert, high Himalaya, Amazonia, Antarctica.",
        "Migration is the movement of people to live somewhere else. Push factors drive people away (drought, lack of work, conflict, poor services); pull factors attract them (jobs, education, healthcare, safety, family already there).",
        "Rural-to-urban migration plus natural increase drives urbanisation — a growing share of people living in towns and cities. It brings both opportunity and pressure on housing, water, transport and air quality.",
        "Settlement site (the actual land a settlement is built on — flat, dry, defensible, near water) versus situation (its position relative to other places — road, rail and river connections). Site explains why it started there; situation often explains why it grew.",
        "Settlement patterns: nucleated (clustered around a centre), dispersed (scattered farms) and linear (strung along a road or valley). Settlement hierarchy runs from hamlet to village to town to city, with services increasing at each level.",
        "Local example: Pune grew at the confluence of the Mula and Mutha rivers — the site — and expanded enormously because of its situation on major routes and its education and industry, spreading into areas such as Hinjawadi, Hadapsar and Amanora.",
      ],
    },
    {
      id: "economy", num: 7, title: "Economic Activity, Resources & Energy",
      blurb: "0839 sub-strand 789PCed (employment). How people make a living, what they take from the Earth to do it, and what runs out.",
      syllabus: [
        "Employment sectors: primary (taking raw materials from the Earth — farming, fishing, forestry, mining), secondary (manufacturing and processing), tertiary (services — teaching, retail, transport, healthcare, IT services) and quaternary (research, development and high-level information work).",
        "As countries develop, the balance usually shifts from mostly primary work towards secondary and then tertiary and quaternary work. Show this with a bar chart or pie chart of employment structure.",
        "Local examples across the sectors: sugarcane and vegetable farming in rural Maharashtra (primary), vehicle and engineering plants around Pimpri-Chinchwad and Chakan (secondary), and the IT services and offices around Hinjawadi (tertiary, with research and development counting as quaternary).",
        "A resource is anything people find useful. Renewable resources can be replenished within a human lifetime or are effectively unlimited — solar, wind, hydroelectric, biomass, geothermal. Non-renewable resources exist in a fixed amount and are used up — coal, oil, natural gas.",
        "Every energy source has advantages and disadvantages. Coal is cheap and reliable but a heavy polluter; solar produces no emissions in use but only generates by day and needs space; hydroelectric is reliable but dams flood land and displace people; wind is clean but variable and needs suitable sites, such as the ridges of the Sahyadri near Satara.",
        "Growing population and rising consumption both increase demand for water, food, energy and materials, so the question is not just where a resource is, but how fairly and how efficiently it is used.",
      ],
    },
    {
      id: "sustainability", num: 8, title: "Environment, Impact & Sustainability",
      blurb: "People change environments — the question is whether the change can last.",
      syllabus: [
        "Sustainable development means meeting the needs of people today without damaging the ability of future generations to meet their own needs. Test any plan against three things: environment, economy and society.",
        "Human impacts to be able to describe and explain: deforestation, air and water pollution, soil erosion, over-extraction of groundwater, loss of habitat and biodiversity, and the waste that cities generate.",
        "Urban growth has specific environmental costs — sealed surfaces increase run-off and flood risk, vehicles and construction worsen air quality, and demand for water rises faster than supply.",
        "Water is the clearest sustainability issue in western Maharashtra: supply depends on a single monsoon season stored in reservoirs such as Khadakwasla, so a weak monsoon means restrictions. Rainwater harvesting, repairing leaks, drip irrigation and treating and reusing wastewater all reduce the pressure.",
        "Management strategies to name: protected areas and national parks (the Western Ghats are recognised internationally for their biodiversity), reforestation, waste segregation and recycling, public transport, and shifting to renewable energy.",
        "Evaluate rather than cheerlead. Every strategy has costs and losers as well as benefits — ask who pays, who benefits, and whether it would still work in twenty years.",
      ],
    },
  ],

  flashcards: [
    { term: "Latitude vs longitude", def: "Latitude lines run east–west and measure distance north or south of the Equator. Longitude lines run north–south and measure east or west of the Prime Meridian. Quote latitude first." },
    { term: "Four-figure grid reference", def: "Names a whole square. Eastings (along the bottom) first, then northings (up the side) — 'along the corridor, up the stairs'." },
    { term: "Six-figure grid reference", def: "Pinpoints a spot. Split the square into tenths and add a digit to each pair: easting + tenth, northing + tenth." },
    { term: "Scale 1:50 000", def: "1 cm on the map = 50 000 cm on the ground = 0.5 km. So 4 cm = 2 km." },
    { term: "Contour lines", def: "Lines joining points of equal height above sea level. Close together = steep; far apart = gentle." },
    { term: "Contour V rule", def: "A V in the contours pointing UPHILL (upstream) means a river valley. Concentric rings increasing inwards mean a hill." },
    { term: "Bearing", def: "Direction measured clockwise in degrees from north: N 000°, E 090°, S 180°, W 270°." },
    { term: "Weather vs climate", def: "Weather = the atmosphere at a place right now. Climate = the average pattern over a long period, conventionally about 30 years." },
    { term: "Stevenson screen", def: "A white, louvred box that holds thermometers in the shade with air flowing through, so temperature readings are fair." },
    { term: "Wind direction rule", def: "Winds are named after the direction they come FROM. A westerly blows from the west." },
    { term: "Relief rainfall", def: "Air forced to rise over high ground cools, condenses and rains — heavy on the windward side of the Western Ghats." },
    { term: "Rain shadow", def: "The drier leeward side of a mountain range, where descending air has already lost its moisture. Pune sits in the Sahyadri's rain shadow." },
    { term: "Southwest monsoon", def: "Land heating faster than the sea creates low pressure over the subcontinent, drawing moist ocean air in; main rains roughly June–September." },
    { term: "Annual temperature range", def: "Highest mean monthly temperature minus lowest mean monthly temperature on a climate graph." },
    { term: "Confluence", def: "The point where two rivers meet — the Mula and the Mutha meet in Pune." },
    { term: "Watershed", def: "The high boundary of land separating one drainage basin from the next." },
    { term: "River erosion processes", def: "Hydraulic action, abrasion, attrition, solution." },
    { term: "River transport processes", def: "Traction, saltation, suspension, solution." },
    { term: "Meander & ox-bow lake", def: "A bend in the lower course; when the neck is cut through, the abandoned loop is left as an ox-bow lake." },
    { term: "Weathering vs erosion", def: "Weathering breaks rock down IN PLACE. Erosion wears away AND removes material using a moving agent." },
    { term: "Three rock types", def: "Igneous (cooled magma or lava), sedimentary (compacted layers, may hold fossils), metamorphic (changed by heat and pressure)." },
    { term: "Deccan basalt", def: "The igneous rock underlying Pune, formed from vast lava flows; it weathers to the region's dark 'black cotton' soil." },
    { term: "Distribution vs density", def: "Distribution = how people are SPREAD across an area. Density = how MANY per square kilometre." },
    { term: "Push and pull factors", def: "Push drives people away (drought, no work, conflict); pull attracts them (jobs, schools, healthcare, safety)." },
    { term: "Site vs situation", def: "Site = the land a settlement is actually built on. Situation = its position relative to other places and routes." },
    { term: "Employment sectors", def: "Primary (raw materials), secondary (manufacturing), tertiary (services), quaternary (research and information)." },
    { term: "Renewable vs non-renewable", def: "Renewable is replenished or effectively unlimited (solar, wind, hydro). Non-renewable exists in a fixed amount (coal, oil, gas)." },
    { term: "Sustainable development", def: "Meeting the needs of people today without damaging future generations' ability to meet their own." },
  ],

  questions: [
    {
      id: "clsg7-1", topic: "skills",
      q: "On a map, a temple symbol lies inside the square whose western (left-hand) edge is the easting line numbered 42 and whose southern (bottom) edge is the northing line numbered 78. Give the four-figure grid reference of that square, and explain the order you used.",
      model: "4278. You read the EASTINGS first — the numbers along the bottom of the map, going across — which gives 42. Then you read the NORTHINGS, up the side, which gives 78. Put them together with no gap: 4278. The rule to memorise is 'along the corridor, then up the stairs', and the number pair always names the BOTTOM-LEFT corner of the square, so the whole square 4278 lies above and to the right of that intersection.",
      hint: "Along the corridor, then up the stairs.",
    },
    {
      id: "clsg7-2", topic: "skills",
      q: "Inside square 4278, the temple stands 6 tenths of the way across the square from its western edge and 3 tenths of the way up from its southern edge. Give the six-figure grid reference, showing your working.",
      model: "426783. Working: take the easting pair 42 and add the tenths across, which is 6 → 426. Then take the northing pair 78 and add the tenths up, which is 3 → 783. Write the three easting digits first, then the three northing digits: 426783. The order is exactly the same as for four figures — eastings then northings — you are simply splitting each square into ten by ten to pinpoint a spot rather than naming a whole square. A common slip is writing 783426 by giving the northings first; always start along the bottom.",
      hint: "Add the tenth to each pair: easting + tenth, then northing + tenth.",
    },
    {
      id: "clsg7-3", topic: "skills",
      q: "On a 1:50 000 map, a straight road between two villages measures 7.4 cm. How long is the road on the ground?",
      opts: ["0.37 km", "3.7 km", "37 km", "370 km"],
      a: "3.7 km",
      model: "On a 1:50 000 map, 1 cm represents 50 000 cm on the ground. 50 000 cm = 500 m = 0.5 km, so 1 cm = 0.5 km. Therefore 7.4 cm × 0.5 = 3.7 km. For a winding road you would lay a piece of string or the edge of a strip of paper along the bends first, then straighten it against the scale bar.",
    },
    {
      id: "clsg7-4", topic: "skills",
      q: "On one part of a map the contour lines are packed tightly together; on another they are widely spaced. A third area shows contours forming a V that points towards the higher ground. Describe the landscape in each case.",
      model: "Tightly packed contours = a steep slope, because the land rises a lot over a short horizontal distance. Widely spaced contours = a gentle slope, because the same height gain is spread over a long distance. A V of contours pointing towards the higher ground (upstream) = a river valley — the contours bend up-valley as they cross the channel, so the point of the V shows you which way is uphill and therefore which way the river flows (it flows out through the open end of the V). Concentric rings with values increasing inwards would be a hill or summit.",
      hint: "Close = steep. The V points upstream.",
    },
    {
      id: "clsg7-5", topic: "skills",
      q: "Describe the fieldwork enquiry sequence you would follow to investigate whether traffic is heavier outside your school in the morning or the afternoon.",
      model: "(1) Ask a clear geographical question and make a prediction — 'traffic is heavier in the morning than in the afternoon'. (2) Plan the method: a tally count of vehicles passing a fixed point, in fixed time slots, at the same place each time. (3) Collect the data, repeating the count on several days so one unusual day does not distort the result, and recording the time, weather and location. (4) Present it, most sensibly as a bar chart comparing morning and afternoon counts. (5) Analyse it — describe the pattern and quote your own figures. (6) Conclude by answering the original question, then evaluate: what could have gone wrong, whether the sample was big enough, and what you would change next time.",
    },
    {
      id: "clsg7-6", topic: "weather",
      q: "Explain the difference between weather and climate, and give one example of each.",
      model: "Weather is the state of the atmosphere at a particular place at a particular time, and it changes from day to day and hour to hour — for example, 'it was 31 °C and cloudy in Pune yesterday afternoon'. Climate is the average pattern of weather at a place over a long period, conventionally around 30 years — for example, 'Pune has a hot, dry season before the monsoon and its heaviest rain between June and September'. One is a snapshot; the other is the long-run pattern you would plan around.",
    },
    {
      id: "clsg7-7", topic: "weather",
      q: "Why is a thermometer kept inside a white, louvred Stevenson screen rather than left in the open?",
      opts: [
        "To keep it warm so it reads higher",
        "To measure air temperature fairly — in shade, sheltered from rain, with air still flowing through, and painted white to reflect sunlight",
        "So that rain can be measured at the same time",
        "To protect it from wind, which would make the reading too low",
      ],
      a: "To measure air temperature fairly — in shade, sheltered from rain, with air still flowing through, and painted white to reflect sunlight",
      model: "In direct sun a thermometer measures the heating of the thermometer itself, not the air, and rain would cool it artificially. The screen is white to reflect sunlight, louvred so air circulates freely, and standard in height and siting so readings from different places can be compared fairly.",
    },
    {
      id: "clsg7-8", topic: "weather",
      q: "Mahabaleshwar, on the crest of the Western Ghats, is far wetter than Pune, which lies about eighty kilometres to the east. Explain why, using the correct geographical terms.",
      model: "This is relief rainfall and a rain shadow. Moist air from the Arabian Sea is carried inland by the southwest monsoon. When it reaches the steep western scarp of the Western Ghats it is forced to rise; as it rises it cools, the water vapour condenses into cloud, and it falls as very heavy rain on the windward side, where Mahabaleshwar sits. By the time the air has crossed the crest it has lost most of its moisture, and as it descends the eastern side it warms again, so condensation stops. Pune lies on that leeward side, in the rain shadow, and is therefore much drier.",
      hint: "Windward side rises and rains; leeward side descends and dries.",
    },
    {
      id: "clsg7-9", topic: "weather",
      q: "Explain, in terms of pressure, why the southwest monsoon brings rain to India in summer.",
      model: "In summer the land of the subcontinent heats up much faster than the surrounding ocean, because land has a lower heat capacity. The hot air over the land rises, creating an area of low pressure. Air always moves from high pressure to low pressure, so moist air is drawn in from the higher-pressure region over the Indian Ocean. That air has travelled over warm sea and carries a great deal of water vapour; when it rises over the land and over relief such as the Western Ghats, it cools, condenses and produces the heavy monsoon rainfall of roughly June to September.",
    },
    {
      id: "clsg7-10", topic: "rivers",
      q: "Name the four processes by which a river erodes its channel and briefly describe each.",
      model: "Hydraulic action — the sheer force of moving water pushing into cracks in the bed and banks and loosening material. Abrasion — the load the river is carrying being dragged along and scraping the bed and banks like sandpaper. Attrition — stones and pebbles knocking into each other as they are transported, so they gradually become smaller, smoother and rounder. Solution (corrosion) — soluble rock such as limestone being chemically dissolved by the water. Attrition wears the LOAD down; abrasion wears the CHANNEL down, which is the pair most often confused.",
      hint: "Attrition wears the load; abrasion wears the channel.",
    },
    {
      id: "clsg7-11", topic: "rivers",
      q: "Compare the upper course and the lower course of a river. Refer to gradient, valley shape, and the main process at work.",
      model: "Upper course: steep gradient, a narrow channel and a V-shaped valley with a rocky bed, often with waterfalls and rapids. Vertical erosion dominates — the river cuts downwards, and the water often looks clear because the load is large and dragged along the bed. Lower course: a gentle gradient, a much wider and deeper channel, and a broad flat floodplain. Deposition dominates, along with lateral (sideways) erosion that produces large meanders and ox-bow lakes, and the water usually looks brown because it carries a heavy suspended load of fine material. The mouth may form a delta or an estuary.",
    },
    {
      id: "clsg7-12", topic: "rivers",
      q: "A city replaces fields with roads, car parks and rooftops. Explain why this increases flood risk downstream.",
      model: "Fields have permeable soil and vegetation, so rain infiltrates into the ground and is taken up by plants; the water reaches the river slowly and over a long period. Concrete, tarmac and roofs are impermeable, so almost none of the rain soaks in. Instead it becomes surface run-off, which drains rapidly into gutters and storm drains and is delivered to the river channel far faster and in greater volume. The river level therefore rises much more quickly after a storm and is more likely to exceed the capacity of its channel and overflow onto the floodplain — which, in a growing city, is often exactly where people have built.",
      hint: "Infiltration is replaced by fast surface run-off.",
    },
    {
      id: "clsg7-13", topic: "rocks",
      q: "Explain the difference between weathering and erosion, and give one example of each.",
      opts: [
        "They are two words for the same process",
        "Weathering breaks rock down in place; erosion wears away and removes material using a moving agent such as a river, waves, ice or wind",
        "Weathering only happens to sedimentary rock; erosion only happens to igneous rock",
        "Weathering is caused by people; erosion is natural",
      ],
      a: "Weathering breaks rock down in place; erosion wears away and removes material using a moving agent such as a river, waves, ice or wind",
      model: "Weathering happens in situ — the broken material stays where it was, as in freeze–thaw prising fragments off a rock face, or slightly acidic rainwater dissolving limestone. Erosion requires a moving agent that both wears material away and carries it off, as when a river abrades its bed and transports the sediment downstream. The one-word test: does the material get taken away? If yes, that is erosion.",
    },
    {
      id: "clsg7-14", topic: "rocks",
      q: "Describe how freeze–thaw weathering breaks up a rock face, step by step.",
      model: "(1) Water from rain or melting snow collects in a crack or joint in the rock. (2) Temperature falls below 0 °C and the water freezes; as it turns to ice it expands by about a tenth of its volume, pushing outwards on the sides of the crack. (3) The pressure widens the crack slightly. (4) Temperature rises, the ice melts, and more water seeps further into the enlarged crack. (5) The cycle repeats many times, and eventually a fragment of rock breaks away and falls, often collecting as scree at the foot of the slope. It needs temperatures that cross freezing repeatedly, so it is most effective in mountains and cold climates rather than in the plains around Pune.",
    },
    {
      id: "clsg7-15", topic: "rocks",
      q: "A rock sample is in visible layers and contains a fossil shell. Which rock type is it, and how do you know?",
      model: "Sedimentary. Two clues, both decisive. First, visible layers (strata) form as sediment is deposited over long periods and then compacted and cemented. Second, fossils can only survive in rock that formed at relatively low temperatures — igneous rock forms from molten magma or lava, which would destroy any remains, and metamorphic rock has been altered by intense heat and pressure, which usually destroys or distorts them. Sandstone and limestone are common examples.",
      hint: "Layers plus a fossil is a one-way answer.",
    },
    {
      id: "clsg7-16", topic: "population",
      q: "Explain the difference between population distribution and population density, and give an example of a sparsely populated area with a reason.",
      model: "Population distribution describes how people are SPREAD across an area — where the clusters and the empty spaces are, usually shown on a dot map. Population density is the NUMBER of people per square kilometre, a single figure calculated by dividing population by area and usually shown as a choropleth map. Distribution is a pattern; density is a measurement. Example of a sparse area: the Sahara, because extreme aridity means there is too little water for farming or settlement outside oases. Other valid examples with reasons: the high Himalaya (too high, too cold, steep and hard to farm) or Amazonia (dense forest, poor soils once cleared, difficult access).",
      hint: "Distribution is a pattern; density is a number.",
    },
    {
      id: "clsg7-17", topic: "population",
      q: "A young adult moves from a village in rural Maharashtra to Pune. Give two push factors and two pull factors that could explain the move.",
      model: "Push factors (from the village): limited paid work beyond agriculture; unreliable income if the monsoon fails; few opportunities for further education; and limited healthcare or other services. Pull factors (towards Pune): a wide range of jobs in manufacturing, services and IT; colleges and universities; better hospitals and services; and family or community members already living in the city who can provide somewhere to stay. Push factors drive people away from where they are; pull factors attract them towards somewhere else, and most real migration decisions involve both at once.",
    },
    {
      id: "clsg7-18", topic: "economy",
      q: "Classify each of these into an employment sector: a sugarcane farmer, a worker assembling vehicles at Chakan, a software developer in Hinjawadi, a scientist researching new battery materials.",
      model: "Sugarcane farmer — primary, because they take a raw material directly from the Earth. Vehicle assembly worker at Chakan — secondary, because they manufacture a finished product from processed materials. Software developer in Hinjawadi — tertiary, because they provide a service to other people and businesses. Battery researcher — quaternary, because the work is research and development creating new knowledge. As a country develops, the proportion of workers usually shifts away from primary towards secondary and then tertiary and quaternary work.",
    },
    {
      id: "clsg7-19", topic: "economy",
      q: "Which of these is a renewable resource?",
      opts: ["Coal", "Natural gas", "Wind", "Crude oil"],
      a: "Wind",
      model: "Wind is renewable: it is continually generated by the atmosphere and using it today does not reduce the amount available tomorrow. Coal, natural gas and crude oil are all fossil fuels — they exist in a fixed amount formed over millions of years, so once burned they are gone on any human timescale. Be careful with the word 'clean': renewable and non-polluting are not the same thing, and every source, including wind, has drawbacks such as variable output and the need for suitable sites.",
    },
    {
      id: "clsg7-20", topic: "sustainability",
      q: "Pune's water supply depends heavily on reservoirs such as Khadakwasla, filled by a single monsoon season. Suggest two ways the city could use water more sustainably, and evaluate one of them.",
      model: "Two options from: rainwater harvesting on rooftops and in housing societies; repairing leaks in the distribution network so treated water is not lost before it reaches taps; treating and reusing wastewater for gardens, construction and industry; drip irrigation on farms in the catchment instead of flood irrigation; and metering with tariffs that discourage waste. Evaluation, for example of rainwater harvesting: it captures water at the point where it falls, reduces demand on the reservoirs, and also cuts surface run-off and local flooding. Against that, it requires upfront installation cost and maintenance, tanks only fill during the monsoon so it cannot cover the whole dry season alone, and it works best when many buildings adopt it rather than a few — so it is a genuine part of the answer but not the whole answer. A good evaluation always names both the benefit and the limit.",
      hint: "Name the benefit AND the limit — that is what evaluate means.",
    },
  ],

  mistakes: [
    {
      mistake: "Reading a grid reference upside down — giving the northings before the eastings.",
      fix: "Always eastings first: 'along the corridor, then up the stairs'. Write the two numbers along the bottom before you even look up the side. 4278, never 7842.",
    },
    {
      mistake: "Turning a four-figure reference into six figures by adding zeros.",
      fix: "The extra digits are TENTHS of the way across and up the square, estimated by eye. Square 4278 with a feature six tenths across and three tenths up is 426783 — not 427800.",
    },
    {
      mistake: "Forgetting to convert map scale into real units.",
      fix: "On a 1:50 000 map, 1 cm = 50 000 cm = 0.5 km. Write that conversion at the top of your working before you multiply, and always give the unit in the answer.",
    },
    {
      mistake: "Reading contours as if the numbers were just labels, and describing a slope as 'hilly'.",
      fix: "Contours close together = steep, far apart = gentle. Describe relief with height, steepness and shape, and quote actual contour values: 'the land rises from 600 m to 900 m within one kilometre, so the slope is steep'.",
    },
    {
      mistake: "Using 'weather' and 'climate' interchangeably.",
      fix: "Weather is now or today. Climate is the long-run average, conventionally about 30 years. 'It rained heavily last Tuesday' is weather; 'the rain comes mainly between June and September' is climate.",
    },
    {
      mistake: "Naming a wind after the direction it is blowing towards.",
      fix: "Winds are named after where they come FROM. A westerly wind blows from the west towards the east. The wind vane points into the wind.",
    },
    {
      mistake: "Confusing weathering with erosion.",
      fix: "Weathering breaks rock down where it stands. Erosion wears away AND removes material with a moving agent — river, waves, ice or wind. Ask 'was it carried off?' If yes, it is erosion.",
    },
    {
      mistake: "Mixing up abrasion and attrition in rivers.",
      fix: "Abrasion wears down the CHANNEL, because the load scrapes the bed and banks. Attrition wears down the LOAD itself, because the stones knock into each other and get rounder. Attrition — think 'the stones attack each other'.",
    },
    {
      mistake: "Using 'population density' when you mean 'population distribution'.",
      fix: "Density is a NUMBER per square kilometre. Distribution is the PATTERN of where people are spread. A question asking you to describe distribution wants 'clustered along the coast and sparse in the interior', not a figure.",
    },
    {
      mistake: "Writing vague answers with no named place — 'in some places it is very dry'.",
      fix: "Name it. The Sahara, the Thar desert, the Ganges plain, the Sahyadri, Khadakwasla, Hinjawadi. One specific named example is worth more than three general sentences.",
    },
    {
      mistake: "Assuming renewable automatically means harmless.",
      fix: "Renewable describes the supply, not the impact. Large hydroelectric dams flood land and displace people; wind farms need suitable sites and produce variable output. Always give one advantage and one disadvantage.",
    },
    {
      mistake: "Answering 'evaluate' or 'assess' by listing only the good points.",
      fix: "Evaluate means weigh both sides and then judge. Give the benefit, give the drawback or the limit, say who gains and who loses, and finish with a clear conclusion.",
    },
  ],

  cheat: [
    {
      heading: "Grid references — the drill",
      bullets: [
        "EASTINGS first (along the bottom), then NORTHINGS (up the side). 'Along the corridor, then up the stairs.'",
        "Four figures name a whole SQUARE, and the numbers are its bottom-left corner: 4278.",
        "Six figures pinpoint a SPOT. Split the square into tenths by eye.",
        "Worked example: square 4278, feature 6 tenths across and 3 tenths up → easting 42|6, northing 78|3 → 426783.",
        "Write the three easting digits first, then the three northing digits. Never interleave them.",
        "Sanity check: the first two digits of a six-figure reference must match the easting of the square you are in.",
      ],
    },
    {
      heading: "Contours, scale & direction",
      bullets: [
        "Contours join points of EQUAL HEIGHT. Contour interval = the height gap between them.",
        "Close together = steep. Far apart = gentle. Concentric rings increasing inwards = a hill.",
        "A V of contours points UPSTREAM (uphill). The river flows out through the open end.",
        "1:50 000 → 1 cm = 0.5 km. 1:25 000 → 1 cm = 0.25 km. Convert BEFORE you multiply.",
        "Winding route: lay string or a paper edge along it, then straighten against the scale bar.",
        "Compass: N, NE, E, SE, S, SW, W, NW. Bearings clockwise from north: N 000°, E 090°, S 180°, W 270°.",
        "Describing relief = height + steepness + shape, with contour values quoted.",
      ],
    },
    {
      heading: "Weather & climate",
      bullets: [
        "Weather = now. Climate = the long-run average, about 30 years.",
        "Instruments: thermometer °C · rain gauge mm · anemometer wind speed · wind vane direction · barometer pressure · hygrometer humidity. Stevenson screen keeps thermometers shaded and ventilated.",
        "Winds are named after where they come FROM.",
        "Temperature factors: latitude, altitude, distance from the sea, ocean currents, prevailing winds, aspect.",
        "Rainfall types: relief (forced up over hills), convectional (ground heats, air rises), frontal (warm air over cold).",
        "Monsoon: land heats faster than sea → low pressure over land → moist ocean air drawn in → rises, cools, rains (roughly June–September).",
        "Rain shadow: wet windward side (Mahabaleshwar), dry leeward side (Pune).",
        "Climate graph: bars = rainfall in mm; line = temperature in °C. Quote wettest month, driest month, annual temperature range.",
      ],
    },
    {
      heading: "Rivers, rocks & soil",
      bullets: [
        "Water cycle: evaporation + transpiration → condensation → precipitation → run-off and infiltration → back to the sea. Closed system.",
        "Basin words: source · tributary · confluence · watershed · mouth. Mula + Mutha meet in Pune.",
        "Erosion: hydraulic action, abrasion, attrition, solution. Transport: traction, saltation, suspension, solution.",
        "Upper course = steep, V-shaped valley, vertical erosion. Lower course = gentle, wide, floodplain, meanders, deposition.",
        "Flood risk rises with impermeable urban surfaces, because infiltration is replaced by fast surface run-off.",
        "Rocks: igneous (cooled magma/lava — granite, basalt) · sedimentary (layers, may hold fossils — sandstone, limestone) · metamorphic (heat and pressure — marble, slate).",
        "Weathering = in place (freeze–thaw, exfoliation, chemical, biological). Erosion = worn away AND removed.",
        "Soil = weathered mineral particles + humus + water + air + organisms, arranged in horizons.",
      ],
    },
    {
      heading: "People, work & resources",
      bullets: [
        "Distribution = the PATTERN of spread. Density = the NUMBER per km².",
        "Dense: flat, fertile, watered, connected (Ganges plain, eastern China). Sparse: too dry, cold, high or forested (Sahara, high Himalaya, Amazonia).",
        "Migration: push drives you out, pull draws you in. Most moves involve both.",
        "Site = the land it is built on. Situation = its position relative to routes and other places.",
        "Patterns: nucleated · dispersed · linear. Hierarchy: hamlet → village → town → city.",
        "Sectors: primary (raw materials) · secondary (manufacturing) · tertiary (services) · quaternary (research).",
        "Renewable: solar, wind, hydro, biomass, geothermal. Non-renewable: coal, oil, natural gas.",
      ],
    },
    {
      heading: "Sustainability & the enquiry cycle",
      bullets: [
        "Sustainable development = meeting today's needs without damaging future generations' ability to meet theirs.",
        "Test any plan on three legs: environment, economy, society. Ask who pays and who benefits.",
        "Impacts to name: deforestation, air and water pollution, soil erosion, groundwater over-extraction, habitat loss, waste.",
        "Water in western Maharashtra: one monsoon, stored in reservoirs such as Khadakwasla → rainwater harvesting, leak repair, drip irrigation, wastewater reuse.",
        "Enquiry cycle: question → plan and sample → collect → present → analyse → conclude → evaluate.",
        "Presenting data: line graph for change over time, bar chart to compare categories, pie chart for proportions.",
      ],
    },
    {
      heading: "How to write the answer",
      bullets: [
        "Name a real place in every answer. Vague costs marks; specific earns them.",
        "Describe → what the pattern IS, quoting figures from the map or graph. Explain → WHY, using 'because'.",
        "Evaluate / assess → advantage, disadvantage, who gains, who loses, then a clear judgement.",
        "Use the process words on purpose: infiltration, run-off, condensation, erosion, deposition, weathering.",
        "Every measurement gets a unit: mm for rainfall, °C for temperature, km for distance, people per km² for density.",
      ],
    },
  ],
};

export const CLS7_HUMANITIES_PACKS: ExamPack[] = [CLS7_HISTORY_PACK, CLS7_GEOGRAPHY_PACK];
