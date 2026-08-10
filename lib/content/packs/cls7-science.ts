// Cambridge Lower Secondary Science — curriculum framework 0893 (from 2020), Stage 7.
//
// Grade mapping: CNS Amanora runs Cambridge Primary as Grades 1–5 and Cambridge
// Lower Secondary as Grades 6–8, so a Grade 6 learner sits Stage 7. The pack is
// registered with grade: 6 (the app matches packs by learner grade) while all
// learner-facing copy says "Stage 7". Grades 6–7 take combined Science; the split
// into Physics / Chemistry / Biology happens in Grade 8.
//
// Every topic below is traced to a Stage 7 learning objective code in the official
// 0893 framework (7TWSm/7TWSp/7TWSc/7TWSa, 7Bs/7Bp/7Be, 7Cm/7Cp/7Cc, 7Pf/7Ps/7Pe,
// 7ESp/7ESc/7ESs, 7SIC). Content that sits at Stage 8 or 9 has been deliberately
// left out — notably light (reflection/refraction/colour is 8Ps), balanced diet and
// food groups (8Bp), joints and antagonistic muscles (8Bs), and chromatography
// (8Cp). Changes of state, separation techniques and the rock cycle are Cambridge
// Primary, not Lower Secondary; only the particle-model recap of state changes is
// kept, and it is labelled as recap.
//
// There is no external exam at Stage 7 — Checkpoint is sat at the end of Stage 9 —
// so this pack is framed as owning the year, not cramming for a paper.
//
// Verified 2026-08-11 against the 0893 curriculum framework (2020) and the
// Cambridge Lower Secondary Science curriculum page. Question stems are original.

import type { ExamPack } from "../exam-pack";

export const CLS7_SCIENCE_PACK: ExamPack = {
  subjectId: "cls-science",
  grade: 6,
  title: "Science — Stage 7 · Cambridge Lower Secondary",
  context: "Framework 0893 · Stage 7 (Grade 6) · combined Science · CNS Amanora",
  highlights: [
    { label: "Framework", value: "0893 (from 2020)" },
    { label: "Stage", value: "Stage 7 = Grade 6" },
    { label: "Strands", value: "TWSc · Bio · Chem · Phys · Earth & Space" },
  ],
  pinnedRule: {
    heading: "Name the three variables before you touch the equipment",
    body: "Every practical: write down what you will CHANGE (independent), what you will MEASURE (dependent), and what you will KEEP THE SAME (control). Do it before setting up, not after. Cambridge asks for this in some form in nearly every enquiry question, and it is the one habit that makes the rest of Stage 7 easier.",
  },
  reference: {
    label: "Cambridge Lower Secondary Science (0893) — curriculum page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/science/",
  },
  plan: [
    { title: "Start with TWSc", hint: "Variables + fair tests carry every other topic" },
    { title: "Walk the 14 topics", hint: "Tag each one: solid / shaky / no idea" },
    { title: "Flip the flashcards", hint: "Particle model, variables, pH colours" },
    { title: "Do the practice questions", hint: "Say the answer out loud before reading it" },
    { title: "Read the common mistakes", hint: "These are the traps, not the content" },
    { title: "Cheat sheet before class test", hint: "Last 10 minutes, nothing new" },
  ],

  topics: [
    {
      id: "twsc", num: 1, title: "Thinking & Working Scientifically",
      blurb: "How to ask, plan, measure and conclude — the strand that runs through every other topic.",
      syllabus: [
        "Hypothesis vs prediction: a hypothesis is a testable idea ('sugar dissolves faster in hot water'); a prediction says what you expect to see. Evidence can support or contradict a hypothesis — it never 'proves' it.",
        "The three variables: independent (the one thing you change), dependent (the thing you measure), control (everything you keep the same). A fair test changes only the independent variable.",
        "Not every investigation is a fair test — classifying, pattern-seeking across a place, modelling and research using secondary sources are all valid enquiry types.",
        "Accuracy = how close a reading is to the true value. Precision = how close repeated readings are to each other. Repeat readings enough times to trust them, then take a mean.",
        "Spot anomalous results (readings that break the pattern) and leave them out of the mean. Record in a table with headings and units; line graph for numbers, bar chart for categories.",
        "Conclusions must be supported by your own results, and you must state their limits. Then evaluate: what went wrong, what you would change, and why. Check hazard symbols before any practical.",
        "Models (particle diagrams, circuit symbols, the flow-of-electrons picture) have strengths AND limitations — be ready to say both. Secondary sources can be biased.",
      ],
    },
    {
      id: "cells", num: 2, title: "Cells, Tissues & Organ Systems",
      blurb: "Every living thing is built from cells — the smallest unit that is alive.",
      syllabus: [
        "All organisms are made of cells. Microorganisms are typically a single cell doing everything on its own.",
        "Cell structures and jobs: cell membrane (controls what goes in and out), cytoplasm (where reactions happen), nucleus (controls the cell, holds genetic information), cell wall (rigid, holds shape), chloroplast (traps light for photosynthesis), mitochondria (release energy by respiration), sap vacuole (stores cell sap, keeps the cell firm).",
        "Plant vs animal cells: both have membrane, cytoplasm, nucleus and mitochondria. Only plant cells have a cell wall, chloroplasts and a large permanent sap vacuole.",
        "Specialised cells fit their job: red blood cells (no nucleus, packed to carry oxygen), neurones (long, carry signals), ciliated cells (tiny hairs that sweep mucus), root hair cells (long finger to absorb water), palisade cells (crammed with chloroplasts, near the leaf surface).",
        "Levels of organisation: cells → tissues (similar cells together) → organs (tissues working as one) → organ systems → organism.",
      ],
    },
    {
      id: "classify", num: 3, title: "Classifying Life & Food Webs",
      blurb: "What counts as living, how species are sorted, and who eats what.",
      syllabus: [
        "The seven characteristics of living organisms — Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition (MRS GREN).",
        "Viruses are argued about: they reproduce, but only inside a host cell, and they do not respire, grow or excrete on their own — so scientists disagree about calling them living.",
        "A species is a group of organisms that can breed together to produce fertile offspring.",
        "A dichotomous key is a chain of either/or questions, each with exactly two choices, that ends at one organism's name. Use one, and build one.",
        "Some microorganisms are decomposers: they break down dead organisms and waste, returning nutrients to the soil.",
        "Food chains and webs show energy passing along; arrows point in the direction the energy travels (eaten → eater). Decomposers belong in the web too.",
      ],
    },
    {
      id: "atoms", num: 4, title: "Atoms, Elements, Compounds & Mixtures",
      blurb: "Everything is built from about a hundred kinds of atom — the rest is how they are put together.",
      syllabus: [
        "All matter is made of atoms. Each different type of atom is a different element.",
        "The Periodic Table lists the known elements in a set order, each with its own symbol (one capital letter, or a capital plus a small one: H, O, Fe, Cu).",
        "The two big groupings of elements are metals and non-metals.",
        "Element = one type of atom only. Compound = two or more elements chemically joined in a fixed ratio, with new properties. Mixture = substances together but not chemically joined, in any ratio.",
        "Alloys (brass, steel, bronze) are mixtures, not compounds — the metals are mixed, not chemically bonded.",
        "Use particle diagrams to show the difference: one kind of circle = element, joined different circles = compound, unjoined different circles = mixture.",
      ],
    },
    {
      id: "particles", num: 5, title: "States of Matter & the Particle Model",
      blurb: "Picture the particles first, then the behaviour makes sense on its own.",
      syllabus: [
        "Describe each state by three things — arrangement, separation, motion. Solid: regular pattern, touching, vibrating about fixed positions. Liquid: irregular, still touching, sliding past each other. Liquid keeps its volume but not its shape.",
        "Gas: far apart, random, moving fast in all directions — no fixed shape and no fixed volume, and it fills its container.",
        "The particle model explains what you already saw at Primary: heating gives particles more energy, so a solid melts and a liquid boils; cooling reverses it. (Recap — the model is what is new at Stage 7.)",
        "A vacuum is a space with no matter in it at all — no particles of any kind. Not 'air with the air taken out and something left'.",
        "State the model's limits too: real particles are not coloured balls, and the diagram does not show the forces between them. Every model has strengths and limitations.",
      ],
    },
    {
      id: "materials", num: 6, title: "Properties of Materials & Gas Tests",
      blurb: "Chemical properties vs physical properties, metals vs non-metals, and three lab tests worth memorising.",
      syllabus: [
        "Every substance has physical properties (melting point, density, hardness, conductivity — measured without changing the substance) and chemical properties (how it reacts, its acidity).",
        "Metals are typically shiny, malleable, ductile, sonorous and good conductors of heat and electricity, with fairly high melting points. Non-metals are typically dull, brittle when solid, and poor conductors.",
        "Famous exceptions: mercury is a liquid metal, and graphite is a non-metal that conducts electricity.",
        "Alloys are mixtures whose properties differ from the metals that went into them — usually harder and often more useful (steel from iron, brass from copper and zinc).",
        "Particle model of hardness: a pure metal has same-sized atoms in neat layers that slide over each other; an alloy's different-sized atoms break up those layers, so it does not slide as easily and is harder.",
        "Gas tests: hydrogen → lighted splint gives a squeaky pop. Oxygen → glowing splint relights. Carbon dioxide → limewater turns milky/cloudy.",
      ],
    },
    {
      id: "acids", num: 7, title: "Acids, Alkalis & the pH Scale",
      blurb: "Acidity is a chemical property, and pH is the number that measures it.",
      syllabus: [
        "The pH scale runs 0–14. Below 7 = acidic, exactly 7 = neutral, above 7 = alkaline. The further from 7, the stronger.",
        "Litmus: blue litmus turns red in an acid; red litmus turns blue in an alkali; neither changes in a neutral solution.",
        "Universal Indicator gives the whole range: red (strong acid) → orange → yellow (weak acid) → green (neutral, pH 7) → blue (weak alkali) → purple (strong alkali).",
        "Everyday examples: lemon juice and vinegar are acids; toothpaste, soap and antacid tablets are alkaline; pure water is neutral.",
        "Neutralisation is a reaction between an acid and an alkali that moves the pH towards 7 — an antacid raising the pH of stomach acid, or lime added to acidic soil.",
        "Acidity is a chemical property, so you cannot see it — you need an indicator or a pH meter.",
      ],
    },
    {
      id: "reactions", num: 8, title: "Chemical Reactions & Precipitates",
      blurb: "How you know a new substance has actually been made.",
      syllabus: [
        "A chemical reaction has happened when reactants are used up and products form with different properties from the starting materials.",
        "Signs to look for: a gas is given off (bubbling), a solid precipitate appears, or the colour changes.",
        "A precipitate forms when two soluble substances in solution react and at least one product is insoluble — so it cannot stay dissolved and drops out as a solid.",
        "Use the particle model to describe a reaction: the particles are rearranged into new combinations, but no particles are created or destroyed.",
        "Neutralisation is a reaction you can follow with a pH number rather than with your eyes.",
      ],
    },
    {
      id: "forces", num: 9, title: "Forces, Gravity & Energy",
      blurb: "Gravity pulls between any two objects, and energy spreads out rather than disappearing.",
      syllabus: [
        "Gravity is a force of attraction between ANY two objects with mass — not just between things and the Earth.",
        "The bigger the masses, the bigger the gravitational force. That is why you are pulled to the Earth and not noticeably to your desk.",
        "Describe the energy changes in an event or process: a torch turned on, a ball dropped, a match lit, a cyclist braking on a Pune flyover.",
        "Energy dissipates: it spreads out into the surroundings (usually as heat and sound) and becomes less useful. It is never destroyed — it just ends up too spread out to use.",
        "In a vacuum there is no air, so there is no air resistance to oppose movement — a feather and a hammer dropped in a vacuum fall together.",
      ],
    },
    {
      id: "sound", num: 10, title: "Sound & Echoes",
      blurb: "Sound is particles passing a vibration along — which is why space is silent.",
      syllabus: [
        "A vibrating object makes the particles next to it vibrate back and forth; those particles push the next ones, and the vibration travels outwards as a sound wave.",
        "The particles themselves do not travel with the sound — they vibrate about their positions and pass the energy on.",
        "Sound cannot travel through a vacuum: no particles means nothing to pass the vibration along. Space is genuinely silent.",
        "Sound travels through solids, liquids and gases — a train on the rails is heard through the metal before it is heard through the air.",
        "An echo is a sound wave reflecting off a hard surface and coming back to you — shout across a Sahyadri valley and the cliff sends it back.",
      ],
    },
    {
      id: "electricity", num: 11, title: "Electricity & Series Circuits",
      blurb: "A simple model: electrons flowing all the way round a complete loop.",
      syllabus: [
        "Model electricity as a flow of electrons around a circuit. The circuit must be complete — a break anywhere stops the flow everywhere.",
        "Electrical conductors let electrons flow (metals, graphite). Insulators inhibit electron flow (plastic, rubber, glass, dry wood).",
        "Current is measured with an ammeter connected IN SERIES, in amperes (A).",
        "In a series circuit, adding more cells increases the current; adding more lamps decreases the current and each lamp is dimmer.",
        "Draw circuits with conventional symbols: cell, battery, switch, lamp, buzzer, ammeter. Straight lines, right angles, no gaps.",
      ],
    },
    {
      id: "planet-earth", num: 12, title: "Planet Earth — Plates, Air & Water",
      blurb: "The ground moves, the air has a recipe, and water goes round in a loop.",
      syllabus: [
        "Plate tectonics: the Earth's solid outer layer — the crust plus the uppermost mantle — is broken into plates that move because of slow flow lower down in the mantle.",
        "Earthquakes, volcanoes and fold mountains happen mostly near plate boundaries. The Himalayas are fold mountains still rising as the Indian plate pushes into Eurasia.",
        "Clean, dry air is about 78% nitrogen, 21% oxygen, and small amounts of carbon dioxide and other gases. That composition can change through pollution and natural emissions.",
        "The water cycle: evaporation from open water → condensation into cloud → precipitation → run-off back to rivers and the sea, plus water soaking down to become groundwater.",
        "The southwest monsoon is the water cycle at full scale — the Arabian Sea evaporates, the air rises over the Western Ghats, condenses, and rains on Pune.",
      ],
    },
    {
      id: "earth-space", num: 13, title: "Earth in Space — Gravity, Tides & Eclipses",
      blurb: "One force — gravity — builds the planets, holds the orbits and pulls the tides.",
      syllabus: [
        "Planets form when dust and gas are pulled together by gravity over a very long time, clumping into bigger and bigger bodies.",
        "Gravity is what holds the planets, moons, asteroids and comets in orbit around the Sun.",
        "Tides on Earth are caused by the gravitational attraction between the Earth, the Moon and the Sun. The Moon's pull matters most; when the Sun pulls the same way the tides are largest.",
        "Solar eclipse: the Moon passes between the Sun and the Earth and its shadow falls on the Earth, blocking the Sun for a narrow strip of the surface.",
        "Lunar eclipse: the Earth passes between the Sun and the Moon, so the Earth's shadow falls on the Moon.",
        "Eclipses do not happen every month because the Moon's orbit is tilted, so it usually passes a little above or below the line-up.",
      ],
    },
    {
      id: "context", num: 14, title: "Science in Context",
      blurb: "Where scientific knowledge comes from, and what it is used for.",
      syllabus: [
        "Scientific knowledge is built up collectively over time — many people checking, repeating and challenging each other's work, not one genius alone.",
        "Peer review means other scientists scrutinise a claim before it is accepted. That is why a single result is not the end of the story.",
        "Science is applied across societies and industries — medicine, farming, construction, and research programmes like ISRO's lunar and solar missions.",
        "Evaluate issues that need scientific understanding (air quality in a city, plastic waste, water supply) by asking what the evidence actually shows.",
        "The uses of science can have global environmental impact, good and bad — the same chemistry that makes fertiliser also pollutes rivers.",
      ],
    },
  ],

  flashcards: [
    { term: "Independent variable", def: "The one thing you deliberately change in an investigation." },
    { term: "Dependent variable", def: "The thing you measure or observe, because it depends on what you changed." },
    { term: "Control variable", def: "Anything you deliberately keep the same so the test stays fair." },
    { term: "Fair test", def: "An investigation where only the independent variable changes and every control variable is kept the same." },
    { term: "Hypothesis", def: "A testable idea that can be supported or contradicted by evidence from an enquiry." },
    { term: "Anomalous result", def: "A reading that clearly does not fit the pattern of the others; leave it out of the mean." },
    { term: "Accuracy vs precision", def: "Accuracy = close to the true value. Precision = repeated readings close to each other." },
    { term: "Model (in science)", def: "A simplified representation of something real — always has both strengths and limitations." },
    { term: "Cell membrane", def: "Thin outer layer of every cell that controls what enters and leaves it." },
    { term: "Nucleus", def: "Controls the cell's activities and stores its genetic information." },
    { term: "Mitochondria", def: "Structures where respiration releases energy; found in plant AND animal cells." },
    { term: "Chloroplast", def: "Plant-cell structure containing chlorophyll, where photosynthesis happens." },
    { term: "Three plant-only structures", def: "Cell wall, chloroplasts, and a large permanent sap vacuole." },
    { term: "Levels of organisation", def: "Cells → tissues → organs → organ systems → organism." },
    { term: "MRS GREN", def: "Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition — the seven characteristics of living organisms." },
    { term: "Species", def: "A group of organisms that can reproduce together to produce fertile offspring." },
    { term: "Dichotomous key", def: "A chain of either/or questions, two choices at each step, that identifies an organism." },
    { term: "Decomposer", def: "An organism (often a microorganism) that breaks down dead material and returns nutrients to the soil." },
    { term: "Element", def: "A substance made of only one type of atom." },
    { term: "Compound", def: "Two or more elements chemically joined in a fixed ratio, with new properties." },
    { term: "Mixture", def: "Substances together but not chemically joined; alloys are mixtures." },
    { term: "Particle model — solid", def: "Particles in a regular pattern, touching, vibrating about fixed positions." },
    { term: "Particle model — liquid", def: "Particles irregular but still touching, sliding past each other; fixed volume, no fixed shape." },
    { term: "Particle model — gas", def: "Particles far apart, random, moving quickly in all directions; fills its container." },
    { term: "Vacuum", def: "A space with no matter in it at all — no particles of any kind." },
    { term: "pH scale", def: "0–14. Below 7 acidic, exactly 7 neutral, above 7 alkaline." },
    { term: "Litmus colours", def: "Blue litmus → red in acid. Red litmus → blue in alkali. No change if neutral." },
    { term: "Universal Indicator colours", def: "Red (strong acid) → orange → yellow → green (neutral, pH 7) → blue → purple (strong alkali)." },
    { term: "Neutralisation", def: "Acid reacting with alkali so the pH moves towards 7." },
    { term: "Precipitate", def: "An insoluble solid formed when two dissolved substances react." },
    { term: "Gas tests", def: "Hydrogen → squeaky pop with a lighted splint. Oxygen → relights a glowing splint. Carbon dioxide → limewater turns milky." },
    { term: "Gravity", def: "A force of attraction between any two objects; the greater the masses, the greater the force." },
    { term: "Energy dissipation", def: "Energy spreading out into the surroundings so it becomes less useful — never destroyed." },
    { term: "Sound wave", def: "Particles vibrating back and forth and passing the vibration on; cannot travel through a vacuum." },
    { term: "Echo", def: "A sound wave reflected off a hard surface and heard again." },
    { term: "Electric current", def: "A flow of electrons around a complete circuit; measured in amperes with an ammeter in series." },
    { term: "Tectonic plates", def: "Sections of the Earth's crust and uppermost mantle that move because of flow lower in the mantle." },
    { term: "Clean dry air", def: "About 78% nitrogen, 21% oxygen, plus small amounts of carbon dioxide and other gases." },
    { term: "Solar eclipse", def: "The Moon comes between the Sun and the Earth; the Moon's shadow falls on the Earth." },
    { term: "Lunar eclipse", def: "The Earth comes between the Sun and the Moon; the Earth's shadow falls on the Moon." },
  ],

  questions: [
    {
      id: "cs7-1", topic: "twsc",
      q: "You want to find out whether the temperature of water affects how fast sugar dissolves. Name the independent variable, the dependent variable, and two control variables.",
      model: "Independent: the temperature of the water (the one thing you change). Dependent: the time taken for the sugar to fully dissolve (the thing you measure). Controls (any two): mass of sugar, volume of water, grain size of the sugar, how hard and how long you stir, the same beaker each time.",
      hint: "Change one, measure one, keep the rest the same.",
    },
    {
      id: "cs7-2", topic: "twsc",
      q: "A classmate tests whether a plant grows taller in sunlight. She puts one plant on a sunny windowsill and one in a dark cupboard, but waters the sunny one every day and the cupboard one twice a week. Explain why her test is not fair, and how to fix it.",
      model: "Two things are changing at once — the light AND the amount of water — so if the plants grow differently she cannot tell which caused it. Water is meant to be a control variable. Fix: give both plants exactly the same amount of water at the same times, and keep pot size, soil, plant type and temperature the same, so light is the only independent variable.",
      hint: "How many things changed between the two plants?",
    },
    {
      id: "cs7-3", topic: "twsc",
      q: "A learner measures the time for a trolley to roll down a ramp five times: 2.1 s, 2.2 s, 2.0 s, 3.8 s, 2.1 s. What should she do with the 3.8 s reading and why?",
      opts: [
        "Include it — all data must be used",
        "Treat it as anomalous, leave it out of the mean, and say so",
        "Delete it quietly and take four readings",
        "Repeat the whole experiment from scratch",
      ],
      a: "Treat it as anomalous, leave it out of the mean, and say so",
      model: "3.8 s clearly breaks the pattern, so it is an anomalous result — probably a slip with the stopwatch. You exclude it from the mean but you still record it and state that you excluded it. Hiding data is not science.",
    },
    {
      id: "cs7-4", topic: "cells",
      q: "Which three structures are found in a plant cell but NOT in an animal cell?",
      opts: [
        "Nucleus, cytoplasm, mitochondria",
        "Cell wall, chloroplasts, large permanent sap vacuole",
        "Cell membrane, nucleus, chloroplasts",
        "Cell wall, mitochondria, cell membrane",
      ],
      a: "Cell wall, chloroplasts, large permanent sap vacuole",
      model: "Both cell types have a membrane, cytoplasm, a nucleus and mitochondria. Only plant cells add a rigid cell wall, chloroplasts for photosynthesis and a big permanent sap vacuole.",
    },
    {
      id: "cs7-5", topic: "cells",
      q: "A root hair cell has a long, thin extension pushing out into the soil. Explain how this shape helps it do its job.",
      model: "Its job is to absorb water and minerals from the soil. The long thin extension gives the cell a much bigger surface area in contact with the soil, so water and minerals can be taken in far faster than through a plain round cell.",
      hint: "Think about surface area, not strength.",
    },
    {
      id: "cs7-6", topic: "classify",
      q: "State what a species is, and give the test that decides whether two organisms belong to the same one.",
      model: "A species is a group of organisms that can reproduce with each other to produce fertile offspring. The test is not how similar they look — it is whether their offspring can themselves go on to breed.",
    },
    {
      id: "cs7-7", topic: "classify",
      q: "Why do scientists disagree about whether viruses are living?",
      opts: [
        "Viruses are too small to study",
        "Viruses reproduce, but only inside a host cell, and do not respire, grow or excrete on their own",
        "Viruses only exist in laboratories",
        "Viruses are made of cells but have no nucleus",
      ],
      a: "Viruses reproduce, but only inside a host cell, and do not respire, grow or excrete on their own",
      model: "Viruses tick one characteristic of living things (reproduction) but only by hijacking a host cell, and they miss most of the others. That is why classifying them is genuinely argued about rather than simply settled.",
    },
    {
      id: "cs7-8", topic: "atoms",
      q: "Brass is made by mixing copper and zinc. Is brass an element, a compound or a mixture? Justify your answer.",
      model: "Brass is a mixture — specifically an alloy. The copper and zinc atoms are mixed together but not chemically joined, and the proportions can be varied. A compound would need the elements chemically bonded in a fixed ratio.",
      hint: "Chemically joined, or just mixed?",
    },
    {
      id: "cs7-9", topic: "atoms",
      q: "A particle diagram shows circles of two different sizes, each small circle joined to a large one, and nothing else present. What does it represent?",
      opts: ["An element", "A compound", "A mixture of two elements", "A mixture of a compound and an element"],
      a: "A compound",
      model: "Two different types of atom, chemically joined together, with nothing unjoined present — that is a compound.",
    },
    {
      id: "cs7-10", topic: "particles",
      q: "Describe the arrangement, separation and motion of the particles in a gas, and use this to explain why a gas has no fixed shape.",
      model: "Arrangement: random, no pattern. Separation: far apart compared with a solid or liquid. Motion: moving quickly in all directions. Because the particles are far apart and free to move anywhere, they spread out until they hit the walls, so the gas takes the shape of whatever container it is in.",
    },
    {
      id: "cs7-11", topic: "particles",
      q: "What is a vacuum?",
      opts: [
        "A space filled only with very cold air",
        "A space containing no matter at all",
        "A space containing only gas particles",
        "A space where gravity does not act",
      ],
      a: "A space containing no matter at all",
      model: "A vacuum has no particles in it of any kind. Gravity still acts in a vacuum — it is matter that is absent, not force.",
    },
    {
      id: "cs7-12", topic: "materials",
      q: "You are given an unlabelled test tube of gas. Describe how you would test whether it is oxygen, and state the result you would expect.",
      model: "Light a wooden splint, blow it out so it is glowing but not burning, and lower it into the test tube. If the gas is oxygen the glowing splint relights. (A squeaky pop with a lighted splint would mean hydrogen; carbon dioxide would turn limewater milky instead.)",
    },
    {
      id: "cs7-13", topic: "materials",
      q: "Use the particle model to explain why steel is harder than pure iron.",
      model: "In pure iron all the atoms are the same size and sit in neat layers that can slide over each other, so the metal deforms fairly easily. Steel contains carbon atoms of a different size, which disrupt the regular layers. The layers can no longer slide past each other easily, so steel is harder.",
      hint: "Think about layers sliding.",
    },
    {
      id: "cs7-14", topic: "acids",
      q: "A solution turns Universal Indicator green. What can you say about it?",
      opts: ["It is a strong acid", "It is a weak acid", "It is neutral, pH 7", "It is a strong alkali"],
      a: "It is neutral, pH 7",
      model: "Green is the middle of the Universal Indicator range — pH 7, neutral. Red/orange is acidic, blue/purple is alkaline.",
    },
    {
      id: "cs7-15", topic: "acids",
      q: "A farmer near Pune finds his soil has a pH of 5. Name the type of substance he should add and explain, in terms of pH, what it does.",
      model: "pH 5 means the soil is acidic, so he adds an alkaline substance such as lime. The alkali neutralises the acid in the soil, raising the pH towards 7 so that it is closer to neutral and better for most crops.",
    },
    {
      id: "cs7-16", topic: "reactions",
      q: "Two clear, colourless solutions are mixed and a white solid appears. Explain what has happened.",
      model: "A chemical reaction has taken place and a precipitate has formed. Both starting substances were soluble, so they stayed dissolved, but the reaction produced a new product that is insoluble in water. Because it cannot stay dissolved, it appears as a solid. A new substance with different properties is evidence of a chemical reaction.",
    },
    {
      id: "cs7-17", topic: "forces",
      q: "A student says 'gravity is the force that pulls things down to the Earth'. Correct and improve this statement.",
      model: "Gravity is a force of attraction between ANY two objects that have mass — not just between an object and the Earth. The size of the force depends on the masses involved. The Earth is enormously more massive than anything on it, so the pull towards the Earth is the only one we notice; two books on a desk also attract each other, far too weakly to detect.",
      hint: "Between any two objects.",
    },
    {
      id: "cs7-18", topic: "forces",
      q: "On the Moon, an astronaut drops a hammer and a feather at the same moment and they land together. Why does this not happen on Earth?",
      opts: [
        "The Moon has no gravity",
        "The Moon has no air, so there is no air resistance to slow the feather",
        "The feather is heavier on the Moon",
        "Gravity is stronger on the Moon",
      ],
      a: "The Moon has no air, so there is no air resistance to slow the feather",
      model: "The Moon's surface is effectively a vacuum, and in a vacuum there is no air to oppose movement. On Earth, air resistance slows the light, wide feather far more than the compact hammer, so the hammer lands first. The Moon does have gravity — that is why they fall at all.",
    },
    {
      id: "cs7-19", topic: "sound",
      q: "Explain, in terms of particles, why an astronaut cannot hear an explosion happening in space.",
      model: "Sound travels when particles vibrate back and forth and pass the vibration on to the particles next to them. Space is a vacuum, so there are no particles to vibrate and nothing to carry the vibration from the explosion to the astronaut. No medium means no sound.",
    },
    {
      id: "cs7-20", topic: "electricity",
      q: "In a series circuit with one cell and one lamp, a second identical lamp is added in series. What happens to the current, and what do you see?",
      opts: [
        "Current increases; both lamps get brighter",
        "Current decreases; both lamps are dimmer than the single lamp was",
        "Current stays the same; both lamps are as bright as before",
        "Current stops; neither lamp lights",
      ],
      a: "Current decreases; both lamps are dimmer than the single lamp was",
      model: "Adding lamps in series reduces the current through the whole circuit, so each lamp is dimmer. Adding more cells does the opposite — it increases the current and the lamps get brighter.",
    },
    {
      id: "cs7-21", topic: "planet-earth",
      q: "Why are the Himalayas still growing taller?",
      model: "They are fold mountains sitting on a plate boundary. The Indian plate is still pushing northwards into the Eurasian plate, and the rock between them is being crumpled and pushed upwards. The plates move because of slow flow lower down in the mantle.",
    },
    {
      id: "cs7-22", topic: "earth-space",
      q: "Describe the difference between a solar eclipse and a lunar eclipse, and explain why we do not get one every month.",
      model: "Solar eclipse: the Moon passes between the Sun and the Earth, so the Moon's shadow falls on the Earth and the Sun is blocked from a narrow strip of the surface. Lunar eclipse: the Earth passes between the Sun and the Moon, so the Earth's shadow falls on the Moon. They are not monthly because the Moon's orbit is tilted relative to the Earth's orbit, so most months the Moon passes slightly above or below the exact line-up.",
      hint: "Whose shadow falls on what?",
    },
  ],

  mistakes: [
    {
      mistake: "Swapping the independent and dependent variables.",
      fix: "Independent = what you CHANGE (it goes on the x-axis). Dependent = what you MEASURE (y-axis). Say the sentence 'I changed ___ and measured ___' out loud before writing anything.",
    },
    {
      mistake: "Saying 'I kept it a fair test' without naming a single control variable.",
      fix: "Marks come from naming them: same volume, same mass, same temperature, same time. Two or three specific controls beat the phrase 'everything else was the same'.",
    },
    {
      mistake: "Confusing mass and weight.",
      fix: "Mass is how much matter is in an object and does not change if you move it. Weight is the gravitational force pulling on that mass, so it changes with where you are. Your mass on the Moon is the same as on Earth; your weight is not.",
    },
    {
      mistake: "Saying 'the plant eats food from the soil'.",
      fix: "Plants make their own food by photosynthesis in their chloroplasts. Soil supplies water and dissolved minerals — building materials, not food. That is why chloroplasts, not roots, are the food-making structure.",
    },
    {
      mistake: "Muddling melting with dissolving.",
      fix: "Melting is one substance turning from solid to liquid because it was heated. Dissolving is a solid spreading through a liquid to form a solution — the solid is still there, and no heating is needed. Sugar in cold water dissolves; it does not melt.",
    },
    {
      mistake: "Calling a mixture a compound — especially air, sea water and alloys.",
      fix: "Compound = chemically joined, fixed ratio, new properties, hard to separate. Mixture = just mixed, any ratio, keeps its parts' properties. Brass, steel and air are all mixtures.",
    },
    {
      mistake: "Saying sound travels through space.",
      fix: "Sound needs particles to pass the vibration along. Space is a vacuum, so it is silent. Light does not need particles, which is why you can see a star but never hear it.",
    },
    {
      mistake: "Writing that energy 'gets used up' or 'disappears'.",
      fix: "Energy dissipates — it spreads out into the surroundings, usually as heat and sound, and becomes too spread out to be useful. Say 'dissipated and became less useful', never 'destroyed'.",
    },
    {
      mistake: "Reading the pH scale backwards — thinking a bigger number means a stronger acid.",
      fix: "Lower number = more acidic. pH 1 is a much stronger acid than pH 5. Above 7 goes the other way: pH 14 is a much stronger alkali than pH 8.",
    },
    {
      mistake: "Reversing the litmus colours.",
      fix: "Memorise one direction only and derive the rest: blue litmus turns RED in acid. (Blue → red = acid. So red → blue = alkali.)",
    },
    {
      mistake: "Mixing up solar and lunar eclipses.",
      fix: "Name it by what gets blocked. SOLAR eclipse = the Sun is blocked, so the Moon must be in front of it. LUNAR eclipse = the Moon is darkened, so the Earth's shadow must be falling on it.",
    },
    {
      mistake: "Drawing a circuit with an ammeter connected across a lamp.",
      fix: "An ammeter goes IN SERIES — in the loop itself, so the same current flows through it. Only a voltmeter connects across a component.",
    },
  ],

  cheat: [
    {
      heading: "Thinking & Working Scientifically — the drill",
      bullets: [
        "Independent = what I change. Dependent = what I measure. Control = what I keep the same.",
        "Fair test = exactly one independent variable. Not every enquiry is a fair test (classifying, pattern-seeking, modelling, research all count).",
        "Repeat readings → spot anomalies → exclude them from the mean → say that you did.",
        "Accuracy = close to the true value. Precision = repeats close to each other.",
        "Table with headings AND units. Line graph for numbers on the x-axis, bar chart for categories.",
        "Conclusion must come from YOUR results, and you must state its limits. Then evaluate and suggest an improvement — with a reason.",
        "Any model: give one strength and one limitation.",
      ],
    },
    {
      heading: "Particle model & matter",
      bullets: [
        "Always answer with three things: arrangement, separation, motion.",
        "Solid = regular, touching, vibrating in place. Liquid = irregular, touching, sliding. Gas = far apart, random, fast.",
        "Element = one type of atom. Compound = elements chemically joined, fixed ratio. Mixture = just mixed (alloys, air).",
        "Vacuum = no matter at all.",
        "Alloy is harder than the pure metal: different-sized atoms break up the sliding layers.",
      ],
    },
    {
      heading: "Acids, alkalis & gas tests",
      bullets: [
        "pH < 7 acid · pH 7 neutral · pH > 7 alkali. Further from 7 = stronger.",
        "Universal Indicator: red → orange → yellow (acid) · green (7) · blue → purple (alkali).",
        "Blue litmus → red in acid. Red litmus → blue in alkali.",
        "Neutralisation moves the pH towards 7.",
        "Hydrogen = squeaky pop (lighted splint) · Oxygen = relights a glowing splint · Carbon dioxide = limewater goes milky.",
        "Chemical reaction happened if: gas given off, precipitate forms, or colour changes.",
      ],
    },
    {
      heading: "Cells & living things",
      bullets: [
        "Both cells: membrane, cytoplasm, nucleus, mitochondria. Plant only: cell wall, chloroplasts, large sap vacuole.",
        "Cells → tissues → organs → organ systems → organism.",
        "MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.",
        "Species = can breed to give FERTILE offspring.",
        "Dichotomous key = exactly two choices at every step.",
        "Food-chain arrows point the way the energy goes — towards the eater.",
      ],
    },
    {
      heading: "Forces, energy, sound, electricity",
      bullets: [
        "Gravity acts between ANY two masses; bigger masses → bigger force.",
        "Energy dissipates and becomes less useful — never destroyed.",
        "No air in a vacuum → no air resistance.",
        "Sound = particles vibrating and passing it on. No particles, no sound.",
        "Echo = sound reflected off a hard surface.",
        "Current = flow of electrons; ammeter IN SERIES, measured in amperes.",
        "More cells → more current. More lamps in series → less current.",
      ],
    },
    {
      heading: "Earth & space",
      bullets: [
        "Plates = crust + uppermost mantle; they move because of flow lower in the mantle.",
        "Earthquakes, volcanoes and fold mountains cluster near plate boundaries (Himalayas = India pushing into Eurasia).",
        "Clean dry air: 78% nitrogen, 21% oxygen, small amounts of CO₂ and other gases.",
        "Water cycle: evaporation → condensation → precipitation → run-off, plus groundwater. The monsoon is this at full scale.",
        "Planets formed from dust and gas pulled together by gravity; gravity holds the orbits.",
        "Tides = gravitational pull of the Moon and Sun on the Earth.",
        "SOLAR eclipse = Sun blocked by the Moon. LUNAR eclipse = Earth's shadow on the Moon.",
      ],
    },
    {
      heading: "How to write the answer",
      bullets: [
        "Read what the command word wants: state (one line), describe (what happens), explain (why it happens — use 'because').",
        "Every measurement gets a unit. Every particle answer gets arrangement + separation + motion.",
        "If the question mentions an investigation, name the variables even when it does not ask directly.",
        "Never write 'it goes faster' — write what goes faster, by how much, and why.",
      ],
    },
  ],
};
