// CBSE Class 7 Science — NCERT "Curiosity" (NCF-SE 2023)
// Source: 12 chapters in the 2025 edition. Verified May 2026 via:
//   - learncbse.in/ncert-solutions-for-class-7-science (chapter index)
//   - Flipkart bundle listing for "Curiosity" (2026 reprint)
// Curiosity is an integrated science book: Physics, Chemistry, Biology
// and Earth-sciences threads run together across the 12 chapters.

import type { ExamPack } from "../exam-pack";

export const CBSE7_SCIENCE: ExamPack = {
  subjectId: "cbse-science",
  grade: 7,
  title: "Science — Class 7 CBSE",
  context: "NCERT Curiosity · 12 chapters · NCF-SE 2023",
  highlights: [
    { label: "Textbook", value: "Curiosity (NCERT, 2025 ed.)" },
    { label: "Chapters", value: "12 (integrated PCB + Earth)" },
    { label: "Style",    value: "Inquiry-driven · activities → ideas" },
  ],
  reference: {
    label: "NCERT — Curiosity chapter index",
    url: "https://www.learncbse.in/ncert-solutions-for-class-7-science/",
  },
  pinnedRule: {
    heading: "How Curiosity teaches",
    body: "Each chapter opens with an everyday observation, then asks 'why?'. Always start your answer with what you observed.",
  },
  plan: [
    { title: "Walk the 12-chapter map",       hint: "Tag chapters that feel new" },
    { title: "Vocabulary — 20 cards",         hint: "Acid, base, conductor, etc." },
    { title: "Practice — 20 questions",       hint: "Mix of recall + reasoning" },
    { title: "Common-mistake list",           hint: "Where students slip" },
    { title: "Exam-day cheat sheet",          hint: "Re-read just before paper" },
  ],
  topics: [
    {
      id: "1-evolving-science", num: 1, title: "The Ever-Evolving World of Science",
      blurb: "What science is, how it changes, and why curiosity matters.",
      syllabus: [
        "Science as a way of asking questions about the world.",
        "Observation, hypothesis, experiment, conclusion — the scientific habit.",
        "How scientific ideas change with new evidence.",
        "Famous Indian and world scientists; their methods.",
      ],
    },
    {
      id: "2-acids-bases", num: 2, title: "Exploring Substances: Acidic, Basic and Neutral",
      blurb: "Sour, bitter and neutral — first taste of chemistry.",
      syllabus: [
        "Properties of acids and bases.",
        "Natural indicators: litmus, turmeric, red-cabbage extract.",
        "Neutralisation in everyday life (antacid, stings, soil).",
        "Acidic vs basic substances around the home and kitchen.",
      ],
    },
    {
      id: "3-electricity", num: 3, title: "Electricity: Circuits and their Components",
      blurb: "Cells, bulbs, switches and simple circuits.",
      syllabus: [
        "Symbols for cell, battery, bulb, switch, wire.",
        "Series and parallel circuits — intuitive intro.",
        "Conductors and insulators.",
        "Heating and magnetic effects of current.",
      ],
    },
    {
      id: "4-metals-nonmetals", num: 4, title: "The World of Metals and Non-Metals",
      blurb: "Two big families of elements and their behaviour.",
      syllabus: [
        "Physical properties: lustre, malleability, ductility, conductivity.",
        "Chemical behaviour: with oxygen, water, acids.",
        "Common uses of metals (iron, copper, aluminium) and non-metals (carbon, sulphur, iodine).",
        "Why some metals corrode (rust).",
      ],
    },
    {
      id: "5-changes", num: 5, title: "Changes Around Us: Physical and Chemical",
      blurb: "Telling the two kinds of change apart.",
      syllabus: [
        "Physical change: shape, state — substance stays the same.",
        "Chemical change: new substance, often irreversible.",
        "Signs of chemical change: gas, colour, heat, light.",
        "Rusting, burning, cooking, photosynthesis as examples.",
      ],
    },
    {
      id: "6-adolescence", num: 6, title: "Adolescence: A Stage of Growth and Change",
      blurb: "Body, mind and feelings between childhood and adulthood.",
      syllabus: [
        "Physical changes during puberty.",
        "Role of hormones (intuitive level).",
        "Healthy eating, hygiene, sleep, exercise.",
        "Mental and emotional well-being; talking to a trusted adult.",
      ],
    },
    {
      id: "7-heat-transfer", num: 7, title: "Heat Transfer in Nature",
      blurb: "Conduction, convection and radiation.",
      syllabus: [
        "Difference between heat and temperature.",
        "Conduction (solids), convection (liquids & gases), radiation (no medium).",
        "Real examples: cooking, sea breeze, sunshine.",
        "Insulators and how clothing/houses use them.",
      ],
    },
    {
      id: "8-time-motion", num: 8, title: "Measurement of Time and Motion",
      blurb: "How we measure motion of everyday objects.",
      syllabus: [
        "Units of time and how clocks measure it.",
        "Distance, time and speed — average speed.",
        "Distance–time graphs (intuitive reading).",
        "Uniform vs non-uniform motion.",
      ],
    },
    {
      id: "9-animal-life", num: 9, title: "Life Processes in Animals",
      blurb: "Nutrition, breathing, circulation, excretion in animals.",
      syllabus: [
        "Nutrition in humans — digestion outline.",
        "Respiration: aerobic vs anaerobic.",
        "Circulation: heart, blood, vessels (overview).",
        "Excretion and why it matters.",
      ],
    },
    {
      id: "10-plant-life", num: 10, title: "Life Processes in Plants",
      blurb: "Photosynthesis, transport, reproduction in plants.",
      syllabus: [
        "Photosynthesis — what goes in, what comes out.",
        "Transport of water and food (xylem and phloem, intuitive).",
        "Plant reproduction: flowers, pollination, seed dispersal.",
        "Why plants are the base of the food chain.",
      ],
    },
    {
      id: "11-light", num: 11, title: "Light: Shadows and Reflections",
      blurb: "How light travels and bounces.",
      syllabus: [
        "Sources of light; light travels in straight lines.",
        "Shadows: opaque, translucent, transparent objects.",
        "Reflection from a plane mirror.",
        "Images in a plane mirror — laterally inverted.",
      ],
    },
    {
      id: "12-earth-moon-sun", num: 12, title: "Earth, Moon and the Sun",
      blurb: "Day, night, seasons and the lunar cycle.",
      syllabus: [
        "Rotation (day/night) vs revolution (year).",
        "Phases of the Moon.",
        "Eclipses — solar and lunar (intuitive).",
        "Why we have seasons (Earth's tilt).",
      ],
    },
  ],
  flashcards: [
    { term: "Indicator", def: "A substance that changes colour to tell whether something is acidic or basic." },
    { term: "Neutralisation", def: "Reaction between an acid and a base that cancels their nature." },
    { term: "Conductor", def: "A material that allows electricity (or heat) to pass through easily." },
    { term: "Insulator", def: "A material that does not allow electricity (or heat) to pass through easily." },
    { term: "Series circuit", def: "Components connected one after another in a single loop." },
    { term: "Malleable", def: "Can be hammered into thin sheets (typical of metals)." },
    { term: "Ductile", def: "Can be drawn into thin wires (typical of metals)." },
    { term: "Physical change", def: "Change in form/state where no new substance is formed; usually reversible." },
    { term: "Chemical change", def: "Change in which one or more new substances form; usually irreversible." },
    { term: "Puberty", def: "The stage during adolescence when the body becomes capable of reproduction." },
    { term: "Conduction", def: "Heat transfer through a solid by direct contact." },
    { term: "Convection", def: "Heat transfer in fluids by movement of the heated fluid itself." },
    { term: "Radiation", def: "Heat (or light) transfer through space without a medium." },
    { term: "Speed", def: "Distance covered in unit time. Unit: m/s or km/h." },
    { term: "Photosynthesis", def: "Process by which plants make food using sunlight, CO₂ and water." },
    { term: "Xylem", def: "Plant tissue that carries water from roots to leaves." },
    { term: "Phloem", def: "Plant tissue that carries food from leaves to the rest of the plant." },
    { term: "Opaque", def: "Does not allow any light to pass through." },
    { term: "Lateral inversion", def: "Left–right flip of an image in a plane mirror." },
    { term: "Lunar eclipse", def: "When Earth comes between the Sun and the Moon and casts its shadow on the Moon." },
  ],
  questions: [
    {
      id: "q-1", topic: "Acids, Bases, Neutral",
      q: "Litmus paper turns RED in:",
      opts: ["An acid", "A base", "Pure water", "A salt solution"],
      a: "An acid",
      model: "Blue litmus turns red in acid; red litmus turns blue in base.",
    },
    {
      id: "q-2", topic: "Electricity",
      q: "If one bulb in a SERIES circuit fuses, the other bulbs will:",
      opts: ["All stop glowing", "Glow brighter", "Glow dimmer", "Stay unchanged"],
      a: "All stop glowing",
      model: "Series = single loop. Break anywhere stops the entire current.",
    },
    {
      id: "q-3", topic: "Metals & Non-metals",
      q: "Which property is typical of metals?",
      opts: ["Malleable", "Brittle", "Poor conductor of heat", "Non-lustrous"],
      a: "Malleable",
      model: "Metals are typically lustrous, malleable, ductile, and good conductors.",
    },
    {
      id: "q-4", topic: "Physical vs Chemical",
      q: "Rusting of iron is a:",
      opts: ["Chemical change", "Physical change", "Reversible change", "No change"],
      a: "Chemical change",
      model: "A new substance (iron oxide) is formed and the change is hard to reverse.",
    },
    {
      id: "q-5", topic: "Adolescence",
      q: "Adolescence is best described as the stage when:",
      opts: ["The body grows fast and changes occur", "Teeth first appear", "We learn to walk", "Old age begins"],
      a: "The body grows fast and changes occur",
      model: "Adolescence is the bridge between childhood and adulthood with rapid physical and emotional changes.",
    },
    {
      id: "q-6", topic: "Heat Transfer",
      q: "Heat from the Sun reaches Earth mainly by:",
      opts: ["Radiation", "Conduction", "Convection", "Reflection"],
      a: "Radiation",
      model: "Space has no medium; heat travels as electromagnetic radiation.",
    },
    {
      id: "q-7", topic: "Motion",
      q: "A car covers 60 km in 2 hours. Its average speed is:",
      opts: ["30 km/h", "60 km/h", "120 km/h", "20 km/h"],
      a: "30 km/h",
      model: "Speed = distance ÷ time = 60 ÷ 2 = 30 km/h.",
    },
    {
      id: "q-8", topic: "Animal Life Processes",
      q: "Which of these is NOT a life process?",
      opts: ["Painting", "Respiration", "Digestion", "Excretion"],
      a: "Painting",
      model: "Life processes keep an organism alive — painting is an activity, not a life process.",
    },
    {
      id: "q-9", topic: "Plant Life Processes",
      q: "Photosynthesis happens mainly in:",
      opts: ["Leaves", "Roots", "Stem", "Flowers"],
      a: "Leaves",
      model: "Leaves contain chlorophyll and have stomata for CO₂ exchange.",
    },
    {
      id: "q-10", topic: "Light",
      q: "An image in a plane mirror is:",
      opts: ["Laterally inverted", "Upside down", "Smaller than the object", "Real"],
      a: "Laterally inverted",
      model: "Plane-mirror images are virtual, same size, and laterally inverted (left ↔ right).",
    },
    {
      id: "q-11", topic: "Earth, Moon, Sun",
      q: "Day and night happen because of Earth's:",
      opts: ["Rotation", "Revolution", "Tilt only", "Distance from Sun"],
      a: "Rotation",
      model: "Earth spins on its axis once in ~24 hours, giving day and night.",
    },
    {
      id: "q-12", topic: "Acids, Bases, Neutral",
      q: "Antacid tablets help reduce stomach acidity because they are:",
      opts: ["Basic", "Acidic", "Neutral", "Salty"],
      a: "Basic",
      model: "Antacids contain mild bases that neutralise excess HCl in the stomach.",
    },
    {
      id: "q-13", topic: "Electricity",
      q: "A switch in a circuit works by:",
      opts: ["Completing or breaking the circuit", "Heating the wire", "Storing charge", "Increasing voltage"],
      a: "Completing or breaking the circuit",
      model: "A switch is just an opening/closing device for the current path.",
    },
    {
      id: "q-14", topic: "Metals & Non-metals",
      q: "Which of these is a non-metal?",
      opts: ["Sulphur", "Iron", "Copper", "Aluminium"],
      a: "Sulphur",
      model: "Sulphur is a typical non-metal; the rest are metals.",
    },
    {
      id: "q-15", topic: "Heat",
      q: "Heat transfer in a metal rod placed in a flame is by:",
      opts: ["Conduction", "Convection", "Radiation", "Reflection"],
      a: "Conduction",
      model: "In solids, heat flows particle-to-particle by conduction.",
    },
    {
      id: "q-16", topic: "Motion",
      q: "Uniform motion means:",
      opts: ["Equal distance in equal intervals of time", "Changing direction frequently", "Increasing speed", "Stopping often"],
      a: "Equal distance in equal intervals of time",
      model: "Uniform = constant speed in a straight line.",
    },
    {
      id: "q-17", topic: "Plant Life Processes",
      q: "Water travels up a plant through:",
      opts: ["Xylem", "Phloem", "Bark", "Roots only"],
      a: "Xylem",
      model: "Xylem moves water and minerals from roots to leaves. Phloem moves food.",
    },
    {
      id: "q-18", topic: "Light",
      q: "A shadow forms because:",
      opts: ["Light travels in straight lines and is blocked", "Light bends around the object", "Light is absorbed by air", "Light reflects off the floor"],
      a: "Light travels in straight lines and is blocked",
      model: "Opaque object in the path of light blocks it, creating a shadow.",
    },
    {
      id: "q-19", topic: "Earth, Moon, Sun",
      q: "A solar eclipse happens when:",
      opts: ["The Moon comes between the Sun and Earth", "The Earth comes between the Sun and Moon", "The Sun comes between the Earth and Moon", "Clouds block the Sun"],
      a: "The Moon comes between the Sun and Earth",
      model: "Solar eclipse: Sun – Moon – Earth in a line.",
    },
    {
      id: "q-20", topic: "Adolescence",
      q: "Which habit best supports adolescent well-being?",
      opts: ["Balanced food + 8h sleep + exercise", "Skipping breakfast", "All-night gaming", "Avoiding water"],
      a: "Balanced food + 8h sleep + exercise",
      model: "Body is changing fast — nutrition, sleep, and movement matter most.",
    },
  ],
  mistakes: [
    { mistake: "Saying litmus turns 'pink' in acid.", fix: "Blue litmus turns RED in acid. (Pink ≠ red.)" },
    { mistake: "Confusing series with parallel.", fix: "Series = single loop; one break stops all. Parallel = separate branches; one break leaves others working." },
    { mistake: "Mixing 'malleable' (sheets) with 'ductile' (wires).", fix: "Mall-EABLE → hamMER → sheets. Duct-ILE → wire DUCT." },
    { mistake: "Calling rusting a physical change.", fix: "Rust is iron oxide — a NEW substance. Chemical change." },
    { mistake: "Treating heat and temperature as the same.", fix: "Heat is energy; temperature is how hot something is. A bucket of warm water has MORE heat than a cup of boiling water." },
    { mistake: "Confusing rotation with revolution.", fix: "Rotation = day/night (24h). Revolution = year (365 days)." },
  ],
  cheat: [
    {
      heading: "Acid / Base / Neutral",
      bullets: [
        "Acid: sour, turns blue litmus red.",
        "Base: bitter/slippery, turns red litmus blue.",
        "Neutral: no colour change.",
      ],
    },
    {
      heading: "Properties of metals",
      bullets: ["Lustrous", "Malleable (sheets)", "Ductile (wires)", "Good conductor of heat & electricity"],
    },
    {
      heading: "Physical vs Chemical change",
      bullets: ["Physical: shape/state, reversible.", "Chemical: new substance, usually irreversible."],
    },
    {
      heading: "Heat transfer",
      bullets: ["Conduction → solids.", "Convection → liquids and gases.", "Radiation → no medium needed."],
    },
    {
      heading: "Mirror image rules",
      bullets: ["Same size as object.", "Same distance behind mirror as object is in front.", "Laterally inverted (left ↔ right)."],
    },
    {
      heading: "Earth motions",
      bullets: ["Rotation → day & night.", "Revolution → seasons & year.", "Tilt (23.5°) → reason for seasons."],
    },
  ],
};
