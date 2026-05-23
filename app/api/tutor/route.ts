import { streamText, convertToModelMessages, type UIMessage } from "ai";

export const maxDuration = 30;
export const runtime = "nodejs";

const SUBJECT_BLURBS: Record<string, string> = {
  // Cambridge Primary Stage 5 (Grade 5)
  maths:
    "Cambridge Primary Mathematics Stage 5: place value, decimals, fractions, percentages (introduced this year), ratio, BODMAS, angles with a protractor, area & perimeter, 2D/3D shapes, line graphs, data interpretation.",
  science:
    "Cambridge Primary Science Stage 5: forces (gravity, friction, upthrust, air & water resistance, force diagrams), magnets, Earth-Sun-Moon and seasons, plant pollination & seed dispersal, animal adaptations, materials, reversible/irreversible changes, scientific enquiry (fair tests, variables).",
  english:
    "Cambridge Primary English Stage 5: fiction (adventure, mystery, fantasy), non-fiction (reports, persuasive writing, biography, travel brochures), poetry (similes, metaphors, personification), drama, grammar (clauses, conjunctions, modal verbs, active/passive, direct/indirect speech), punctuation, spelling, vocabulary.",
  hindi:
    "बालभारती सुलभभारती कक्षा ५ (मराठा बोर्ड) — दो खंडों में लगभग ३८ पाठ। संज्ञा, सर्वनाम, क्रिया, विशेषण, लिंग, वचन, विलोम, पर्यायवाची, मुहावरे, संख्या, छोटे निबंध। बच्ची के स्तर पर सरल हिंदी में समझाएँ।",
  marathi:
    "बालभारती मराठी इयत्ता ५ — २८ पाठ. नाम, सर्वनाम, क्रियापद, विशेषण, लिंग, वचन, समानार्थी, विरुद्धार्थी, म्हणी, वाक्प्रचार, छोटी रचना. विद्यार्थ्यांच्या वयानुरूप सोप्या मराठीत समजवा.",
  gk:
    "Maharashtra Balbharati Std 5 EVS + Cambridge Global Perspectives Stage 5: solar system, motions of Earth, family & community, public facilities, maps of India, food, transport, water, environment, internal organs, infectious diseases, community hygiene.",

  // Cambridge IGCSE (Grade 10)
  "igcse-cs":
    "Cambridge IGCSE Computer Science 0478 (v5, 2026–2028). Topics: 1 Data representation (binary, hex, two's complement, ASCII/Unicode, sound/image file sizes, RLE compression); 2 Data transmission (packets, serial/parallel, USB, parity/checksum/ARQ, encryption sym vs asym); 3 Hardware (CPU + Von Neumann ALU/CU/PC/MAR/MDR/CIR/ACC, FDE cycle, sensors, RAM vs ROM, SSD/HDD, virtual memory, MAC vs IP); 4 Software (system vs app, OS roles, interrupts, compiler vs interpreter, IDE features); 5 Internet (URL, HTTP/HTTPS, DNS, cookies, blockchain, cyber threats and solutions); 6 Emerging tech (automation, robotics, AI, expert systems, machine learning); 7 Algorithms (PDLC, decomposition, flowcharts, validation/verification, test data including boundary as a PAIR, trace tables); 8 Programming in Cambridge pseudocode (INTEGER/REAL/CHAR/STRING/BOOLEAN, sequence/selection/iteration, 1D & 2D arrays, file handling, procedures up to 3 params); 9 Single-table databases (primary key, SQL: SELECT, FROM, WHERE, ORDER BY ASCENDING/DESCENDING, SUM, COUNT, AND, OR); 10 Boolean logic (NOT, AND, OR, NAND, NOR, XOR; truth tables; logic circuits up to 3 inputs without simplification). CRITICAL: all Paper 2 code must be in Cambridge pseudocode (UPPERCASE keywords, PascalCase identifiers, ← assignment). Python/Java only allowed in the final 15-mark scenario question.",
  "igcse-maths":
    "Cambridge IGCSE Mathematics 0580 (Core & Extended): numbers (HCF/LCM, surds, indices, standard form, percentages, ratio), algebra (linear, quadratic, simultaneous, inequalities, indices, factorising), geometry (Pythagoras, trigonometry SOH-CAH-TOA, sine/cosine rules, circle theorems, transformations, vectors), mensuration (perimeter/area/volume of standard shapes), statistics (mean/median/mode, histograms, cumulative frequency, scatter, probability), functions (inverse, composite), differentiation (Extended only).",
  "igcse-physics":
    "Cambridge IGCSE Physics 0625: motion (speed, velocity, acceleration, v-t and d-t graphs), forces (Newton's laws, weight, friction, Hooke's law), pressure, energy (kinetic, potential, conservation, efficiency), thermal physics (kinetic theory, expansion, transfer), waves (transverse/longitudinal, reflection, refraction, EM spectrum, sound), light (lenses, mirrors), electricity (current, voltage, resistance V=IR, series/parallel, household electricity, electromagnetism), atomic physics (radioactivity, half-life, fission/fusion), space.",
  "igcse-chemistry":
    "Cambridge IGCSE Chemistry 0620: states of matter (kinetic particle theory, diffusion), atoms/elements/compounds, periodic table trends, bonding (ionic, covalent, metallic), stoichiometry & mole calculations, electrochemistry (electrolysis), energetics (exothermic/endothermic, bond energy), rates of reaction (concentration, temperature, surface area, catalysts), equilibria, acids/bases/salts, organic chemistry (alkanes, alkenes, alcohols, carboxylic acids, polymers), metals reactivity, air/water, separation techniques.",
  "igcse-biology":
    "Cambridge IGCSE Biology 0610: characteristics of living organisms, cells (plant vs animal, organelles, specialised cells, stem cells), enzymes, transport (diffusion, osmosis, active transport), plant nutrition (photosynthesis, leaf structure), human nutrition (diet, digestion), gas exchange & respiration, transport in humans (heart, blood vessels, blood), excretion, coordination (nervous system, hormones), homeostasis, reproduction (plant & human), inheritance & genetics (DNA, Mendel, monohybrid crosses), variation & selection, organisms & environment (food chains, carbon & nitrogen cycles), biotechnology.",
  "igcse-english":
    "Cambridge IGCSE First Language English 0500: reading (extended response, summary skills, comprehension), directed writing (article, letter, speech, report — purpose/audience/tone), composition (descriptive & narrative writing), language analysis (writer's craft, structure, tone, imagery, syntax), grammar & punctuation precision, vocabulary range, planning & paragraph structure.",
  "igcse-ict":
    "Cambridge IGCSE ICT 0417: hardware & software, networks & internet, ICT in society, document production, spreadsheets (formulas, IF, VLOOKUP, charts), databases (queries, reports), web authoring (HTML & CSS basics), presentations, data analysis, file management.",
  "igcse-business":
    "Cambridge IGCSE Business Studies 0450: understanding business activity, people in business (motivation, organisation, recruitment), marketing (4Ps, market research, segmentation), operations management (production methods, quality, location), financial information & decisions (cash flow, budgeting, profit & loss, balance sheet), external influences (economic environment, technology, ethics, globalisation).",
  "igcse-economics":
    "Cambridge IGCSE Economics 0455: basic economic problem, allocation of resources (markets, demand, supply, equilibrium, elasticities), microeconomic decisions (firms, costs, profit), government & macroeconomy (inflation, unemployment, growth, fiscal/monetary policy), international trade (exchange rates, balance of payments, exports/imports).",
  "igcse-geography":
    "Cambridge IGCSE Geography 0460: population & settlement (growth, structure, migration, urbanisation), the natural environment (plate tectonics, weathering, rivers, coasts, weather & climate, ecosystems), economic development (agriculture, industry, tourism, energy, environment, globalisation), geographical skills & case studies.",
  "igcse-history":
    "Cambridge IGCSE History 0470: Core 19th/20th century international relations (1919–c.2000) — Treaty of Versailles, League of Nations, causes of WW2, Cold War origins, China & Vietnam, Gulf wars; one Depth Study (e.g., Germany 1918–45, USA 1919–41, Russia 1905–41, South Africa).",
  "igcse-art":
    "Cambridge IGCSE Art & Design 0400: observational drawing, portfolio development, composition, colour theory, mark-making, art history references, mixed media, sculpture basics, critical reflection.",
  "igcse-french":
    "Cambridge IGCSE French (Foreign Language) 0520: listening, reading, speaking, writing across Everyday Activities, Personal & Social Life, World Around Us, World of Work, International World. Grammar: tenses (present, past — passé composé/imparfait, future, conditional), pronouns, agreement.",
  "igcse-spanish":
    "Cambridge IGCSE Spanish (Foreign Language) 0530: listening, reading, speaking, writing across Everyday Activities, Personal & Social Life, World Around Us, World of Work, International World. Grammar: ser vs estar, preterite vs imperfect, subjunctive intro.",
  "igcse-hindi":
    "Cambridge IGCSE Hindi as a Second Language 0549: सुनना, पढ़ना, लिखना, बोलना। व्याकरण (काल, संधि, समास, मुहावरे), निबंध, पत्र लेखन, अनुच्छेद, संवाद।",
  "igcse-marathi":
    "Maharashtra Balbharati Std 10 Aksharbharati Marathi (राज्य अनिवार्य). मराठी व्याकरण, गद्य-पद्य, निबंध, पत्र, संवाद, समासविग्रह.",
  "igcse-globalperspectives":
    "Cambridge IGCSE Global Perspectives 0457 (7th-subject route only): research, analysis, evaluation, reflection, collaboration, communication. Six global topics.",

  // ICSE Class 7 (CISCE) — Wisdom World School Hadapsar, Pune
  "icse-maths":
    "ICSE Class 7 Mathematics (Selina Concise, 22 chapters): integers, rational numbers, fractions, decimals, exponents, ratio & proportion, unitary method, percent, profit/loss & discount, simple interest, fundamentals of algebra, simple linear equations, set concepts, lines & angles, triangles, Pythagoras theorem, symmetry, recognition of solids, congruency (SSS/SAS/ASA/RHS), mensuration, data handling, probability.",
  "icse-physics":
    "ICSE Class 7 Physics (Selina, 7 chapters): physical quantities & measurement (SI units, density, speed), motion (types, distance vs displacement), energy (KE, PE, conservation), light (reflection laws, plane-mirror image properties, lateral inversion, refraction intro), heat (temperature, thermometer types, K = °C + 273, conduction/convection/radiation), sound (vibrations, pitch & loudness, audible range 20 Hz–20 kHz, echo), electricity & magnetism (conductors/insulators, like-pole repel, electromagnet with soft iron core).",
  "icse-chemistry":
    "ICSE Class 7 Chemistry (Selina, 7 chapters): matter & its composition (kinetic particle theory), physical vs chemical changes, elements/compounds/mixtures (separation: filtration, evaporation, distillation, magnetic, sublimation), atoms/molecules/radicals (atomicity, valency, ions), language of chemistry (symbols, formulae, balancing equations), metals vs non-metals (mercury is liquid metal, graphite is non-metal that conducts), air & atmosphere (N₂ 78% O₂ 21%, layers — troposphere/stratosphere/mesosphere/thermosphere/exosphere). NOTE: acids/bases/salts come in Class 8 — do NOT teach them as Class 7.",
  "icse-biology":
    "ICSE Class 7 Biology (Selina, 7 chapters, 3 units): plant & animal tissues (xylem upward water, phloem food, epithelial/connective/muscular/nervous), classification of plants (cryptogams: thallophyta/bryophyta/pteridophyta — phanerogams: gymnosperm/angiosperm — mono- vs di-cot), classification of animals (porifera through chordata; cold vs warm-blooded), photosynthesis & respiration (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ in chloroplasts; aerobic vs anaerobic), excretion in humans (kidneys, lungs, skin, liver — nephron is functional unit), nervous system (CNS/PNS, cerebrum/cerebellum/medulla, neuron, reflex action via spinal cord), allergy (allergens, antihistamines). NOTE: transportation & reproduction-in-plants are Class 6/8, not Class 7.",
  "icse-history-civics":
    "ICSE Class 7 History & Civics (6 history themes + UN): medieval Europe & Christianity (Crusades 1096–1291, feudal system), rise & spread of Islam (Prophet Muhammad 570–632 CE, Hijra 622 CE, four caliphs), Delhi Sultanate (Slave/Khilji/Tughlaq/Sayyid/Lodi 1206–1526, key rulers Qutb-ud-din Aibak, Razia, Alauddin Khilji, Muhammad-bin-Tughlaq), Vijayanagara (Harihara-Bukka 1336, Krishnadeva Raya, Hampi) & Bahmani (Talikota 1565), Mughal Empire (Babur 1526 1st Panipat, Akbar Mansabdari/Din-i-Ilahi/Navratnas, Shah Jahan Taj Mahal, Aurangzeb reimposed jizya), Bhakti (Kabir, Guru Nanak, Mirabai, Tulsidas, Tukaram) & Sufi (Chishti — Moinuddin Ajmer, Nizamuddin Delhi). Civics: UN founded 24 Oct 1945, HQ New York, 6 organs, Security Council 5 permanent members with veto, UNESCO Paris, UNICEF NY, WHO Geneva, FAO Rome. NOTE: Marathas come in Class 8, NOT Class 7.",
  "icse-geography":
    "ICSE Class 7 Geography (7 themes): representation of features (topo maps, colour codes), atmosphere (composition N₂ 78% O₂ 21%, layers troposphere/stratosphere/mesosphere/thermosphere/exosphere, ozone in stratosphere, greenhouse effect), weather vs climate (instruments thermometer/barometer/hygrometer/anemometer/wind-vane/rain-gauge; rainfall types convectional/orographic/cyclonic), weathering & soil (mechanical/chemical/biological; soil profile O-A-B-C-R), industries (iron-steel Jamshedpur, cotton Mumbai, IT Bengaluru), energy (renewable vs non-renewable, India coalfields Jharia/Bokaro/Raniganj, Bhakra-Nangal, solar Bhadla), continents (Europe — Alps/Volga, Africa — Sahara/Nile/Kilimanjaro, Australia — Great Barrier Reef, Antarctica — Antarctic Treaty 1959).",
  "icse-computer":
    "ICSE Class 7 Computer Studies (7 chapters): hardware (CPU = ALU + CU; RAM volatile, ROM non-volatile; input/output devices; motherboard), number systems (decimal/binary/octal/hex — conversions; hex digits A=10 to F=15), computer virus (types virus/worm/Trojan/spyware/ransomware/adware; prevention antivirus, firewall, updates), ethics & safety (passwords, netiquette, IT Act 2000), spreadsheets (cells, formulas with =, SUM/AVERAGE/MAX/MIN/IF, charts), database & DBMS (fields, records, primary key, MS Access/MySQL), HTML (tags <html><head><body><h1-6><p><br><hr><ul/ol/li><img src alt><a href><table><form><marquee>).",
  "icse-english-lang":
    "ICSE Class 7 English Language: grammar (tenses, parts of speech, active/passive voice, direct/indirect speech, punctuation, phrases & clauses, sentence types, figurative language — simile/metaphor/personification/alliteration/onomatopoeia/pun), composition (formal & informal letters, applications, messages, invitations, notices, paragraph/essay, narrative & descriptive writing, story writing), reading (unseen comprehension).",
  "icse-english-lit":
    "ICSE Class 7 English Literature: commonly prescribed prose — 'The Canterville Ghost' (Wilde, abridged), 'The Three Questions' (Tolstoy), 'The Blue Umbrella' (Ruskin Bond), 'Marie Curie: A Radiant Life'; poetry — 'Palm Trees' (Tagore), 'Television' (Roald Dahl). Anthology choice varies by school.",
  "icse-hindi":
    "ICSE कक्षा 7 हिंदी: गद्य (पाठ), पद्य (कविताएँ), व्याकरण — संज्ञा/सर्वनाम/विशेषण/क्रिया/काल, संधि, समास, अलंकार, मुहावरे, लोकोक्तियाँ; रचना — पत्र-लेखन, निबंध, अनुच्छेद, कहानी-लेखन; अपठित गद्यांश। कक्षा 7 के स्तर पर सरल और स्पष्ट उत्तर दीजिए।",
  "icse-marathi":
    "बालभारती सुलभभारती इयत्ता 7 मराठी (राज्य अनिवार्य — Maharashtra Compulsory Marathi Act 2020). प्रार्थना, श्यामचे बंधुप्रेम, गोपाळचे शौर्य, दादास पत्र इ. पाठ. व्याकरण (नाम, सर्वनाम, क्रियापद, विशेषण, लिंग, वचन, समानार्थी, विरुद्धार्थी, म्हणी, वाक्प्रचार), पत्र-लेखन, निबंध-लेखन.",
  "icse-sanskrit":
    "ICSE कक्षा 7 संस्कृत (तृतीयभाषा): शब्दरूप, धातुरूप, अव्यय, संधि (प्राथमिक), सरल अनुच्छेद, छोटे श्लोक, अनुवाद (हिंदी ↔ संस्कृत). कक्षा-स्तर के अनुसार सरल उदाहरण.",
};

type Board = "cambridge-primary" | "cambridge-igcse" | "icse" | "cbse";

const INTEREST_HINT: Record<string, string> = {
  drawing:  "sketching, doodles, comics, art",
  sports:   "cricket, football, athletics, scoreboards",
  music:    "songs, instruments, beats, sargam",
  animals:  "pets, jungle, birds, marine life",
  coding:   "logic puzzles, computers, robots",
  stories:  "characters, plots, adventures, books",
  dance:    "rhythm, choreography, beats per minute",
  cooking:  "recipes, ingredients, kitchens",
  space:    "planets, stars, rockets, the moon",
  movies:   "scenes, cameras, plot twists",
};

const TONE_HINT: Record<string, string> = {
  gentle:   "PREFERRED TONE: gentle and patient. Lots of encouragement. Praise the effort before fixing the error. Never sound rushed.",
  friendly: "PREFERRED TONE: warm and playful, slightly less formal. The default voice for Miss Vidya.",
  direct:   "PREFERRED TONE: tight and to-the-point. Skip pleasantries. Give the answer first, then a one-line check. No emoji.",
};

function systemPrompt(opts: { subject?: string; topic?: string; name?: string; grade?: number; board?: Board; school?: string; interests?: string[]; careNote?: string; aiTone?: "gentle" | "friendly" | "direct" }) {
  const { subject, topic, name, grade, board, school, interests, careNote, aiTone } = opts;
  const subjBlurb = subject ? SUBJECT_BLURBS[subject] : null;
  const learner = name?.split(" ")[0] || "the student";
  const schoolLabel = school || (board === "cambridge-igcse" ? "Chatrabhuj Narsee School, Pune"
    : board === "icse" ? "Wisdom World School, Hadapsar, Pune"
    : "Chatrabhuj Narsee School, Pune");
  // Map the kid's interest tags into a one-line "draw examples from" hint so
  // Miss Vidya's metaphors land for THIS kid rather than the average kid.
  const interestLine = (interests && interests.length > 0)
    ? `Personal anchors for ${learner}: they love ${interests.map((i) => INTEREST_HINT[i] ?? i).join(" · ")}. When you need an analogy or a worked example, prefer to draw it from one of these worlds.`
    : "";
  // Kid-selected tone preference — comes first because parent careNote can override.
  const toneLine = (aiTone && TONE_HINT[aiTone]) ? TONE_HINT[aiTone] : "";
  // Parent-authored care guidance — parent teaches AI to care. Treated as
  // authoritative tone/care context, not as facts to repeat back to the kid.
  // Comes AFTER the kid's tone so it can refine without erasing the kid's voice.
  const careLine = (careNote && careNote.trim().length > 0)
    ? `Care guidance from ${learner}'s parent (read but do NOT quote): ${careNote.trim()}`
    : "";
  const isIgcse = board === "cambridge-igcse" || (grade ?? 0) >= 9;
  const isIcseTeen = board === "icse" && (grade ?? 0) >= 6 && (grade ?? 0) <= 8;
  const icseClass = (grade ?? 0);
  // Scope guards for ICSE — keep tutor from over-teaching content from a later grade.
  const scopeGuard = board === "icse"
    ? icseClass === 6
      ? "CRITICAL SCOPE: Class 6 ICSE. Do NOT teach: medieval India (Cl 7+), Asia/Africa geography (Cl 7+), atomic structure/valency/balancing equations (Cl 7+), transportation in plants/animals (Cl 8), reproduction in plants (Cl 8), acids/bases/salts (Cl 8). Class 6 covers ancient India only (up to Gupta), North & South America, intro-level chemistry symbols only."
      : icseClass === 7
      ? "CRITICAL SCOPE: Class 7 ICSE. Do NOT teach: Marathas (Cl 8), acids/bases/salts (Cl 8), reproduction in plants (Cl 8). Cl 7 covers Medieval India (Delhi Sultanate, Vijayanagara, Mughals, Bhakti/Sufi), Selina Physics 7 chapters (forces, energy, light, heat, sound, electricity), Chemistry 7 (intro to atomicity/valency/balancing), Biology 7 (tissues, classification, photosynthesis, excretion, nervous system, allergy)."
      : ""
    : "";

  if (isIcseTeen) {
    return `You are Miss Vidya, an AI tutor for ${learner}, a Class ${grade ?? 7} student at ${schoolLabel}, taking ICSE (CISCE board).

Style:
- Speak to an early-teen (11–13). Friendly, clear, slightly mature. Avoid baby talk.
- Use Indian classroom examples (rotis, rangoli, monsoon, Hadapsar, Pune landmarks, cricket, ISRO, Sahyadri).
- For Maths: show working step-by-step; name the formula; substitute; final answer with units.
- For Sciences (Selina): use the exact textbook vocabulary; give a labelled-diagram-style mental model when helpful.
- For History & Civics: name dates and key rulers precisely.
- For Geography: cite specific places (Jamshedpur, Jharia, Bhakra-Nangal) rather than vague generics.
- For English Literature: refer to the prescribed text by name when possible.
- If they ask in Hindi/Marathi/Sanskrit (Devanagari), reply in the same script at Class-7 level.
- Aim under 160 words unless they ask for more. Use bullet points sparingly.
- End most answers with a one-line follow-up question to keep them thinking.

${subjBlurb ? `Current classroom: ${subject}.\nSyllabus anchor: ${subjBlurb}` : ""}
${scopeGuard ? "\n" + scopeGuard : ""}
${topic ? `Current topic: ${topic}.` : ""}
${interestLine}
${toneLine}
${careLine}
`;
  }

  if (isIgcse) {
    return `You are Miss Vidya, an AI tutor for ${learner}, a Grade ${grade ?? 10} student at ${schoolLabel}, taking Cambridge IGCSE (Upper Secondary).

Style:
- Speak to a 15-year-old IGCSE student. Be precise, clear, and exam-focused.
- For Computer Science: ALL code must be in Cambridge pseudocode (UPPERCASE keywords, PascalCase identifiers, ← for assignment). Python/Java are only valid in the 15-mark Paper 2 scenario question.
- For sciences: use exam-style precision — formulae, units, definitions matched to the spec.
- For maths: show full working, name the rule, then the substitution and the answer with units.
- Show command-word awareness (Define vs Describe vs Explain vs State vs Suggest) when answering exam-style questions.
- Aim for under 180 words unless they ask for detail. Use bullet points when helpful.
- Encourage but don't patronise. End with a one-line check question only when it helps memory.
- If they ask in Hindi/Marathi (Devanagari script), reply in the same script at IGCSE level.

${subjBlurb ? `Current classroom: ${subject}.\nSyllabus anchor: ${subjBlurb}` : ""}
${topic ? `Current topic: ${topic}.` : ""}
${interestLine}
${toneLine}
${careLine}
`;
  }

  return `You are Miss Vidya, an encouraging AI tutor for a 10-year-old Grade ${grade ?? 5} student (${learner}) at Chatrabhuj Narsee School, Pune (Cambridge Primary Stage 5 board, with Maharashtra-mandated Marathi & Hindi).

Style:
- Speak to a 10-year-old. Short sentences. One idea at a time. Warm, never condescending.
- Use everyday Indian examples (rotis, rangoli, monsoon, Pune landmarks, cricket, ISRO) when illustrating.
- Encourage curiosity: end most answers with one playful follow-up question.
- If they ask in Hindi or Marathi (Devanagari script), reply in the same language using simple Std 5-level vocabulary.
- For maths, show working step-by-step. For science, link the idea to something they can see or try.
- Never give long lectures. Aim for under 120 words per reply unless they ask for more.
- If a question is off-topic (violence, adult content, anything unsafe), gently redirect to learning.

${subjBlurb ? `Current classroom: ${subject}.\nSyllabus context: ${subjBlurb}` : ""}
${topic ? `Current topic: ${topic}.` : ""}
${interestLine}
${toneLine}
${careLine}
`;
}

export async function POST(req: Request) {
  let payload: { messages: UIMessage[]; subject?: string; topic?: string; name?: string; grade?: number; board?: Board; school?: string; interests?: string[]; careNote?: string; aiTone?: "gentle" | "friendly" | "direct" };
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { messages, subject, topic, name, grade, board, school, interests, careNote, aiTone } = payload;

  if (
    !process.env.AI_GATEWAY_API_KEY &&
    !process.env.VERCEL_OIDC_TOKEN &&
    !process.env.ANTHROPIC_API_KEY
  ) {
    return new Response(
      "data: " +
        JSON.stringify({
          type: "text",
          text: "Miss Vidya isn't connected yet. The AI Gateway needs setting up in Vercel — ask a grown-up.",
        }) +
        "\n\n",
      { headers: { "content-type": "text/event-stream" } },
    );
  }

  try {
    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: "anthropic/claude-haiku-4.5",
      system: systemPrompt({ subject, topic, name, grade, board, school, interests, careNote, aiTone }),
      messages: modelMessages,
      maxOutputTokens: 900,
      temperature: 0.6,
    });
    return result.toUIMessageStreamResponse();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "tutor unavailable";
    return Response.json({ error: msg }, { status: 500 });
  }
}
