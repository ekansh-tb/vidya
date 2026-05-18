// CBSE Class 7 Social Science — NCERT "Exploring Society: India and Beyond" (NCF-SE 2023)
// Source: NEW merged book replacing old "Our Pasts II", "Social and Political Life II",
// and "Our Environment". Verified May 2026 via:
//   - learncbse.in/ncert-solutions-for-class-7-social-sciences/  (Part 1 + Part 2 index)
//   - learninsta.com/ncert-solutions-for-class-7-social-science/  (theme-wise structure)
//   - competishun.com/ncert-book/exploring-society-india-and-beyond-part-2/  (Part 2 cross-check)
//   - NCERT PDF: ncert.nic.in/textbook/pdf/gees2ps.pdf  (Part 2 official)
// The book is organised by 5 Themes (A–E): Land/People, Past, Heritage,
// Governance, Economy. Part 1 has 12 chapters; Part 2 has 8 chapters.

import type { ExamPack } from "../exam-pack";

export const CBSE7_SST: ExamPack = {
  subjectId: "cbse-socialscience",
  grade: 7,
  title: "Social Science — Class 7 CBSE",
  context: "NCERT Exploring Society: India and Beyond · Part 1 (12) + Part 2 (8) · NCF-SE 2023",
  highlights: [
    { label: "Textbook", value: "Exploring Society — Part 1 + Part 2 (NCERT, 2025)" },
    { label: "Parts",    value: "12 + 8 = 20 chapters across 5 Themes" },
    { label: "Style",    value: "Integrated History · Geography · Civics · Economics" },
  ],
  reference: {
    label: "NCERT — Exploring Society Part 2 (PDF)",
    url: "https://ncert.nic.in/textbook/pdf/gees2ps.pdf",
  },
  pinnedRule: {
    heading: "How this book is organised",
    body: "Don't read it as 'History + Geography + Civics' in three blocks. Read theme by theme — A (Land), B (Past), C (Heritage), D (Governance), E (Economy). Part 2 continues the same five themes.",
  },
  plan: [
    { title: "Walk the 5-Theme map",        hint: "Same 5 themes run through Part 1 and Part 2" },
    { title: "Vocabulary — 20 cards",       hint: "Constitution, climate, empire, market" },
    { title: "Practice — 20 questions",     hint: "Mix across all 5 themes" },
    { title: "Common-mistake list",         hint: "Dates, terms, civics" },
    { title: "Exam-day cheat sheet",        hint: "Theme summaries" },
  ],
  topics: [
    // ── PART 1 ───────────────────────────────────────────────────
    // Theme A — Land and People
    {
      id: "p1-1-geog-diversity", paper: 1, num: 1, title: "Geographical Diversity of India",
      blurb: "Part 1 · Theme A — landforms, regions, and how diverse India's geography is.",
      syllabus: [
        "Major landform regions: Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains, Islands, Thar Desert.",
        "Rivers (Indus, Ganga, Brahmaputra, Godavari, Krishna).",
        "Why diversity of land shapes culture and livelihood.",
        "India's location, size, and neighbours (brief).",
      ],
    },
    {
      id: "p1-2-weather", paper: 1, num: 2, title: "Understanding the Weather",
      blurb: "Part 1 · Theme A — what weather is and how we measure it.",
      syllabus: [
        "Weather vs climate — the time-scale difference.",
        "Elements: temperature, humidity, pressure, wind, rainfall.",
        "Instruments: thermometer, barometer, rain gauge, anemometer.",
        "Reading a weather report.",
      ],
    },
    {
      id: "p1-3-climates", paper: 1, num: 3, title: "Climates of India",
      blurb: "Part 1 · Theme A — India's monsoon and regional climates.",
      syllabus: [
        "The monsoon cycle: south-west and north-east monsoons.",
        "Seasons: winter, summer, monsoon, post-monsoon.",
        "Factors: latitude, altitude, distance from sea, relief.",
        "Why parts of India differ — wettest (Mawsynram) to driest (Thar).",
      ],
    },
    // Theme B — Tapestry of the Past
    {
      id: "p1-4-cities-states", paper: 1, num: 4, title: "New Beginnings: Cities and States",
      blurb: "Part 1 · Theme B — the second urbanisation; rise of mahajanapadas.",
      syllabus: [
        "Second urbanisation (after Harappan) on the Ganga plains.",
        "Sixteen mahajanapadas — major early states.",
        "Magadha's rise to power.",
        "Coinage, trade and city life in early historic India.",
      ],
    },
    {
      id: "p1-5-empires", paper: 1, num: 5, title: "The Rise of Empires",
      blurb: "Part 1 · Theme B — from kingdom to empire (Maurya age).",
      syllabus: [
        "What an empire is, vs a kingdom.",
        "The Mauryan empire — Chandragupta, Bindusara, Ashoka.",
        "Ashoka's edicts and his message of dhamma.",
        "Administration, trade, and the spread of Buddhism.",
      ],
    },
    {
      id: "p1-6-reorganisation", paper: 1, num: 6, title: "The Age of Reorganisation",
      blurb: "Part 1 · Theme B — post-Mauryan India; new kingdoms.",
      syllabus: [
        "Decline of the Mauryan empire and what came next.",
        "Shungas, Satavahanas, Indo-Greeks, Kushanas (Kanishka).",
        "Sangam-age south: Cholas, Cheras, Pandyas (early).",
        "Long-distance trade — Silk Road, Roman trade.",
      ],
    },
    {
      id: "p1-7-gupta-era", paper: 1, num: 7, title: "The Gupta Era: An Age of Tireless Creativity",
      blurb: "Part 1 · Theme B — Guptas and India's 'classical' age.",
      syllabus: [
        "Chandragupta I, Samudragupta, Chandragupta II (Vikramaditya).",
        "Achievements in maths (Aryabhata, decimal, zero), astronomy, medicine.",
        "Literature: Kalidasa.",
        "Art and architecture: Ajanta paintings, temple architecture begins.",
      ],
    },
    // Theme C — Heritage and Knowledge
    {
      id: "p1-8-land-sacred", paper: 1, num: 8, title: "How the Land Becomes Sacred",
      blurb: "Part 1 · Theme C — sacred geography of India.",
      syllabus: [
        "Why rivers, mountains and groves are seen as sacred.",
        "Char Dham, Jyotirlingas, Shakti Peethas — networks of pilgrimage.",
        "Sacred sites of multiple traditions (Hindu, Buddhist, Jain, Sikh, Sufi).",
        "Pilgrimage as a unifier across regions.",
      ],
    },
    // Theme D — Governance and Democracy
    {
      id: "p1-9-rulers-ruled", paper: 1, num: 9, title: "From the Rulers to the Ruled: Types of Governments",
      blurb: "Part 1 · Theme D — kinds of government across history.",
      syllabus: [
        "Monarchy, oligarchy, democracy — basic distinctions.",
        "Ancient examples: republics (gana-sanghas) in mahajanapada age.",
        "How power passes — heredity vs election.",
        "Why democracies value rule of law.",
      ],
    },
    {
      id: "p1-10-constitution", paper: 1, num: 10, title: "The Constitution of India — An Introduction",
      blurb: "Part 1 · Theme D — first look at our Constitution.",
      syllabus: [
        "Drafting: Constituent Assembly, Dr B.R. Ambedkar as chair of drafting committee.",
        "Adopted: 26 November 1949. Came into force: 26 January 1950.",
        "Preamble — sovereign, socialist, secular, democratic, republic.",
        "Fundamental Rights and Duties (intuitive intro).",
      ],
    },
    // Theme E — Economic Life
    {
      id: "p1-11-barter-money", paper: 1, num: 11, title: "From Barter to Money",
      blurb: "Part 1 · Theme E — how exchange evolved.",
      syllabus: [
        "Barter system and its problems (double coincidence of wants).",
        "Early money: cowries, metal coins.",
        "Paper money and modern currency (Reserve Bank).",
        "Digital money — cards, UPI (brief).",
      ],
    },
    {
      id: "p1-12-markets", paper: 1, num: 12, title: "Understanding Markets",
      blurb: "Part 1 · Theme E — where buyers meet sellers.",
      syllabus: [
        "Types: weekly haat, retail shop, wholesale, online marketplace.",
        "Producers, middlemen, retailers, consumers.",
        "Price formation — supply and demand (intuitive).",
        "Consumer awareness and fair practices.",
      ],
    },
    // ── PART 2 ───────────────────────────────────────────────────
    // Theme A — Land and People
    {
      id: "p2-1-indian-farming", paper: 2, num: 1, title: "The Story of Indian Farming",
      blurb: "Part 2 · Theme A — agriculture: India's largest livelihood.",
      syllabus: [
        "Types of farming: subsistence, commercial, plantation.",
        "Major crops by season: kharif (rice, maize), rabi (wheat, mustard), zaid.",
        "Green Revolution — gains and concerns.",
        "Farmers' challenges today.",
      ],
    },
    {
      id: "p2-2-neighbours", paper: 2, num: 2, title: "India and Her Neighbours",
      blurb: "Part 2 · Theme A — India's location among South Asian nations.",
      syllabus: [
        "Land neighbours: Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar, Afghanistan (via PoK).",
        "Maritime neighbours: Sri Lanka, Maldives.",
        "Shared geography, rivers, culture.",
        "SAARC (overview).",
      ],
    },
    // Theme B — Tapestry of the Past
    {
      id: "p2-3-empires-6-10", paper: 2, num: 3, title: "Empires and Kingdoms: 6th to 10th Centuries",
      blurb: "Part 2 · Theme B — early medieval India.",
      syllabus: [
        "Harshavardhana of Kannauj.",
        "Pallavas, Chalukyas, Rashtrakutas — south and Deccan kingdoms.",
        "Tripartite struggle for Kannauj (Palas, Pratiharas, Rashtrakutas).",
        "Cholas of the south (intro) — temples and bronze art.",
      ],
    },
    {
      id: "p2-4-turning-tides", paper: 2, num: 4, title: "Turning Tides: 11th and 12th Centuries",
      blurb: "Part 2 · Theme B — the eve of the Delhi Sultanate.",
      syllabus: [
        "Mahmud of Ghazni's raids.",
        "Muhammad of Ghor — battles of Tarain (1191, 1192).",
        "Prithviraj Chauhan.",
        "Chola overseas reach (Rajaraja, Rajendra).",
      ],
    },
    // Theme C — Heritage and Knowledge
    {
      id: "p2-5-home-to-many", paper: 2, num: 5, title: "India, a Home to Many",
      blurb: "Part 2 · Theme C — religious and cultural plurality.",
      syllabus: [
        "Major faith traditions present in India.",
        "Pluralism — many faiths sharing a land.",
        "Bhakti and Sufi traditions as bridges.",
        "Festivals across communities.",
      ],
    },
    // Theme D — Governance and Democracy
    {
      id: "p2-6-state-government", paper: 2, num: 6, title: "The State, the Government, and You",
      blurb: "Part 2 · Theme D — how government touches daily life.",
      syllabus: [
        "Levels: Union, State, Local (Panchayati Raj, Municipalities).",
        "Three organs: legislature, executive, judiciary.",
        "Citizens' rights and duties.",
        "How a citizen interacts with government services.",
      ],
    },
    // Theme E — Economy
    {
      id: "p2-7-infrastructure", paper: 2, num: 7, title: "Infrastructure: Engine of India's Development",
      blurb: "Part 2 · Theme E — roads, rails, power, internet.",
      syllabus: [
        "Transport: roadways, railways, airways, waterways.",
        "Energy: coal, hydro, solar, wind, nuclear.",
        "Communications: telecom and internet.",
        "How good infrastructure drives growth.",
      ],
    },
    {
      id: "p2-8-banks-finance", paper: 2, num: 8, title: "Banks and the Magic of Finance",
      blurb: "Part 2 · Theme E — what banks do and why they matter.",
      syllabus: [
        "Functions of a bank: deposits, loans, payments.",
        "RBI — the central bank.",
        "Savings, interest, and the idea of credit.",
        "Digital banking and UPI today.",
      ],
    },
  ],
  flashcards: [
    { term: "Weather", def: "Short-term state of the atmosphere at a place (today's rain, today's heat)." },
    { term: "Climate", def: "Long-term average weather of a region — typically over 30+ years." },
    { term: "Monsoon", def: "Seasonal wind reversal that brings most of India's rain (June–Sept SW monsoon)." },
    { term: "Mahajanapada", def: "One of the 16 major early states of north India around the 6th century BCE." },
    { term: "Empire", def: "A large state ruled over many regions/peoples, usually with one central authority." },
    { term: "Ashoka", def: "Mauryan emperor (3rd century BCE) who spread dhamma; known for rock and pillar edicts." },
    { term: "Aryabhata", def: "Gupta-era mathematician–astronomer; gave the value of π and worked on zero/decimal." },
    { term: "Constitution", def: "The supreme rulebook of a country; defines rights, duties and government." },
    { term: "Preamble", def: "The opening statement of a Constitution; sets out its core values." },
    { term: "Sovereign", def: "Independent — no foreign power can rule us." },
    { term: "Secular", def: "The state treats all religions equally." },
    { term: "Republic", def: "Head of state is elected, not a hereditary monarch." },
    { term: "Barter", def: "Direct exchange of goods/services without using money." },
    { term: "Market", def: "Any place — physical or online — where buyers and sellers exchange goods and services." },
    { term: "Kharif crop", def: "Sown with the south-west monsoon (June–July); harvested Oct–Nov. Rice, maize, cotton." },
    { term: "Rabi crop", def: "Sown after monsoon (Oct–Nov); harvested in spring. Wheat, mustard, gram." },
    { term: "Federalism", def: "Power is shared between the Union (centre) and States." },
    { term: "Panchayat", def: "Village-level local government — part of Panchayati Raj." },
    { term: "RBI", def: "Reserve Bank of India — India's central bank; issues currency and regulates other banks." },
    { term: "UPI", def: "Unified Payments Interface — Indian system for instant phone-to-phone digital payments." },
  ],
  questions: [
    {
      id: "q-1", topic: "Geography",
      q: "Which of these is NOT a major landform region of India?",
      opts: ["The Sahara Desert", "The Himalayas", "The Northern Plains", "The Peninsular Plateau"],
      a: "The Sahara Desert",
      model: "The Sahara is in Africa. India's major landforms include Himalayas, Plains, Plateau, Coastal Plains, Islands, and the Thar Desert.",
    },
    {
      id: "q-2", topic: "Weather vs Climate",
      q: "Which statement is correct?",
      opts: ["Weather is short-term; climate is long-term", "Weather is long-term; climate is short-term", "They mean exactly the same thing", "Neither changes"],
      a: "Weather is short-term; climate is long-term",
      model: "Weather changes day to day; climate is the long-term pattern (decades).",
    },
    {
      id: "q-3", topic: "Climate of India",
      q: "Most of India receives its rainfall from the:",
      opts: ["South-West Monsoon", "North-East Monsoon", "Western Disturbance", "Trade winds"],
      a: "South-West Monsoon",
      model: "The SW monsoon (June to September) delivers the bulk of India's annual rainfall.",
    },
    {
      id: "q-4", topic: "Cities and States",
      q: "How many mahajanapadas are described in early Indian texts?",
      opts: ["16", "8", "12", "20"],
      a: "16",
      model: "Buddhist and Jain texts describe 16 mahajanapadas around the 6th century BCE.",
    },
    {
      id: "q-5", topic: "Empires",
      q: "Ashoka belonged to which dynasty?",
      opts: ["Maurya", "Gupta", "Chola", "Mughal"],
      a: "Maurya",
      model: "Ashoka (3rd century BCE) was the grandson of Chandragupta Maurya.",
    },
    {
      id: "q-6", topic: "Empires",
      q: "Ashoka's edicts are mostly written on:",
      opts: ["Rocks and pillars", "Palm leaves", "Copper plates", "Cave walls"],
      a: "Rocks and pillars",
      model: "Ashoka had his messages inscribed on rocks and stone pillars across his empire.",
    },
    {
      id: "q-7", topic: "Gupta era",
      q: "Aryabhata is famous for his contributions to:",
      opts: ["Mathematics and astronomy", "Painting", "Music", "Theatre"],
      a: "Mathematics and astronomy",
      model: "Aryabhata (5th century CE, Gupta age) gave a value of π and worked on planetary motion.",
    },
    {
      id: "q-8", topic: "Gupta era",
      q: "Kalidasa is associated with:",
      opts: ["Sanskrit literature", "Mathematics", "Architecture", "Trade"],
      a: "Sanskrit literature",
      model: "Kalidasa — Gupta-age Sanskrit poet and playwright (Abhijnanashakuntalam, Meghaduta).",
    },
    {
      id: "q-9", topic: "Constitution",
      q: "The Constitution of India came into force on:",
      opts: ["26 January 1950", "15 August 1947", "26 November 1949", "2 October 1950"],
      a: "26 January 1950",
      model: "Adopted 26 Nov 1949; came into force 26 Jan 1950 — celebrated as Republic Day.",
    },
    {
      id: "q-10", topic: "Constitution",
      q: "Who chaired the Drafting Committee of the Constitution?",
      opts: ["Dr B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel", "Rajendra Prasad"],
      a: "Dr B.R. Ambedkar",
      model: "Dr B.R. Ambedkar chaired the Drafting Committee of the Constituent Assembly.",
    },
    {
      id: "q-11", topic: "Constitution",
      q: "'Republic' in the Preamble means:",
      opts: ["The head of state is elected", "We are independent", "All citizens are equal", "We have a Parliament"],
      a: "The head of state is elected",
      model: "Republic = no hereditary monarch; the President is elected.",
    },
    {
      id: "q-12", topic: "Government types",
      q: "A government where citizens elect their representatives is called:",
      opts: ["Democracy", "Monarchy", "Oligarchy", "Dictatorship"],
      a: "Democracy",
      model: "Democracy: rule by the people, usually through elected representatives.",
    },
    {
      id: "q-13", topic: "Barter to Money",
      q: "The main problem with barter is:",
      opts: ["Double coincidence of wants is rare", "Goods spoil", "Coins are heavy", "There are no markets"],
      a: "Double coincidence of wants is rare",
      model: "Barter needs both parties to want exactly what the other offers — hard to match.",
    },
    {
      id: "q-14", topic: "Markets",
      q: "A weekly market that sets up on the same day every week in a village is called a:",
      opts: ["Haat", "Mall", "Wholesale market", "Stock market"],
      a: "Haat",
      model: "Haat = weekly rural market — a long Indian tradition.",
    },
    {
      id: "q-15", topic: "Indian farming",
      q: "Wheat is a typical crop of which season?",
      opts: ["Rabi", "Kharif", "Zaid", "Monsoon"],
      a: "Rabi",
      model: "Rabi crops are sown after the monsoon (Oct–Nov) and harvested in spring. Wheat is the headline crop.",
    },
    {
      id: "q-16", topic: "Indian farming",
      q: "Kharif crops are sown around:",
      opts: ["June–July (with SW monsoon)", "Oct–Nov", "Feb–March", "August–September"],
      a: "June–July (with SW monsoon)",
      model: "Kharif = monsoon crop. Rice, maize, cotton are typical kharif crops.",
    },
    {
      id: "q-17", topic: "Neighbours",
      q: "Which of these is NOT a land neighbour of India?",
      opts: ["Sri Lanka", "Nepal", "Bhutan", "Bangladesh"],
      a: "Sri Lanka",
      model: "Sri Lanka is a maritime (sea) neighbour. Nepal, Bhutan, Bangladesh share land borders.",
    },
    {
      id: "q-18", topic: "Turning Tides",
      q: "The Second Battle of Tarain (1192 CE) was fought between:",
      opts: ["Muhammad Ghori and Prithviraj Chauhan", "Mahmud of Ghazni and Anandpala", "Babur and Ibrahim Lodi", "Akbar and Hemu"],
      a: "Muhammad Ghori and Prithviraj Chauhan",
      model: "Second Tarain (1192) — Muhammad Ghori defeated Prithviraj Chauhan, opening north India to Ghorid rule.",
    },
    {
      id: "q-19", topic: "State, Government, You",
      q: "The three organs of government are:",
      opts: ["Legislature, Executive, Judiciary", "Centre, State, Local", "Parliament, Cabinet, President", "Police, Court, Army"],
      a: "Legislature, Executive, Judiciary",
      model: "Legislature makes laws; Executive runs the government; Judiciary interprets laws.",
    },
    {
      id: "q-20", topic: "Banks and Finance",
      q: "India's central bank is the:",
      opts: ["Reserve Bank of India (RBI)", "State Bank of India", "NABARD", "ICICI"],
      a: "Reserve Bank of India (RBI)",
      model: "RBI issues currency, regulates commercial banks, and manages monetary policy.",
    },
  ],
  mistakes: [
    { mistake: "Treating weather and climate as the same.", fix: "Weather = today/this week. Climate = long-term average (decades)." },
    { mistake: "Calling all of India 'one climate'.", fix: "India has multiple climates — alpine (Himalayas), arid (Thar), tropical-wet (Mawsynram) and more." },
    { mistake: "Mixing up 26 Nov 1949 and 26 Jan 1950.", fix: "Adopted 26 Nov 1949; in force 26 Jan 1950 (Republic Day)." },
    { mistake: "Calling Ashoka a Gupta emperor.", fix: "Ashoka was MAURYAN (3rd c. BCE). Guptas came ~600 years later (4th–6th c. CE)." },
    { mistake: "Saying barter is 'impossible'.", fix: "Barter works for matched wants. Problem is 'double coincidence' is rare at scale." },
    { mistake: "Confusing Republic with Democracy.", fix: "Republic = elected (not hereditary) head of state. Democracy = rule by the people. India is both." },
    { mistake: "Listing Sri Lanka as a land neighbour.", fix: "Sri Lanka and Maldives are MARITIME neighbours, across the sea." },
  ],
  cheat: [
    {
      heading: "The 5 Themes of Exploring Society",
      bullets: [
        "A — India and the World: Land and the People",
        "B — Tapestry of the Past (history)",
        "C — Our Cultural Heritage and Knowledge Traditions",
        "D — Governance and Democracy",
        "E — Economic Life Around Us",
      ],
    },
    {
      heading: "Constitution — five must-knows",
      bullets: [
        "Drafted by the Constituent Assembly; Drafting Committee chaired by Dr B.R. Ambedkar.",
        "Adopted: 26 November 1949.",
        "In force: 26 January 1950.",
        "Preamble: Sovereign, Socialist, Secular, Democratic, Republic.",
        "Three organs: Legislature, Executive, Judiciary.",
      ],
    },
    {
      heading: "Indian history dynasties (Class 7 scope)",
      bullets: [
        "Mauryas — Chandragupta, Bindusara, Ashoka (3rd c. BCE).",
        "Post-Mauryan — Shungas, Satavahanas, Kushanas.",
        "Guptas — 4th–6th c. CE; classical age (Aryabhata, Kalidasa).",
        "Harsha — 7th century, Kannauj.",
        "South — Cholas, Cheras, Pandyas; later Cholas (10th–13th c.).",
        "Tarain II — 1192, Muhammad Ghori defeats Prithviraj Chauhan.",
      ],
    },
    {
      heading: "Climate and seasons",
      bullets: [
        "SW monsoon: June–Sept (most of India's rain).",
        "NE monsoon: Oct–Dec (Tamil Nadu coast).",
        "Seasons: winter, summer, monsoon, post-monsoon (retreating).",
        "Driest: Thar Desert. Wettest: Mawsynram / Cherrapunji.",
      ],
    },
    {
      heading: "Farming seasons",
      bullets: [
        "Kharif (sown Jun–Jul, harvested Oct–Nov): rice, maize, cotton.",
        "Rabi (sown Oct–Nov, harvested Mar–Apr): wheat, mustard, gram.",
        "Zaid (Mar–Jun, short summer crop): watermelon, cucumber.",
      ],
    },
    {
      heading: "Economy — three quick facts",
      bullets: [
        "Barter → metal coins → paper money → digital payments (UPI).",
        "RBI issues currency and regulates banks.",
        "Markets range from village haat to online marketplaces.",
      ],
    },
  ],
};
