export type Destination = {
  id: string;
  name: string;
  region: "space" | "india" | "world" | "nature";
  emoji: string;
  tagline: string;
  imageUrl?: string;
  wikipediaPath: string; // path on en.wikipedia.org
  facts: string[];       // 4-6 kid-friendly facts
  quiz: { q: string; a: string; opts: string[] }[];
};

export const DESTINATIONS: Destination[] = [
  {
    id: "mars",
    name: "Mars",
    region: "space",
    emoji: "🔴",
    tagline: "The Red Planet · 4th from the Sun",
    wikipediaPath: "/wiki/Mars",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg",
    facts: [
      "Mars is the fourth planet from the Sun and the second-smallest.",
      "It looks red because of iron oxide (rust) on its surface.",
      "Mars has two tiny moons: Phobos and Deimos.",
      "Olympus Mons on Mars is the tallest volcano in our solar system — about 22 km high.",
      "India's Mangalyaan (ISRO) orbited Mars in 2014.",
      "A day on Mars is about 24 hours 37 minutes long.",
    ],
    quiz: [
      { q: "Why does Mars look red?", a: "Iron oxide (rust)", opts: ["Hot lava", "Iron oxide (rust)", "Red plants", "Mars dust storms"] },
      { q: "Which Indian mission reached Mars in 2014?", a: "Mangalyaan", opts: ["Chandrayaan", "Mangalyaan", "Gaganyaan", "Aditya-L1"] },
      { q: "How many moons does Mars have?", a: "2", opts: ["0", "1", "2", "4"] },
    ],
  },
  {
    id: "moon",
    name: "The Moon",
    region: "space",
    emoji: "🌙",
    tagline: "Earth's only natural satellite",
    wikipediaPath: "/wiki/Moon",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/640px-FullMoon2010.jpg",
    facts: [
      "The Moon takes about 27 days to orbit the Earth.",
      "It causes the ocean tides through gravity.",
      "There is no air on the Moon — astronauts wear space suits.",
      "Chandrayaan-3 (ISRO) made a soft landing near the Moon's south pole in 2023.",
      "The Moon's gravity is about 1/6th of Earth's — you'd jump much higher there!",
    ],
    quiz: [
      { q: "How long does the Moon take to orbit Earth?", a: "About 27 days", opts: ["1 day", "About 27 days", "1 year", "100 days"] },
      { q: "Which ISRO mission landed on the Moon in 2023?", a: "Chandrayaan-3", opts: ["Chandrayaan-1", "Mangalyaan", "Chandrayaan-3", "Aditya"] },
    ],
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    region: "india",
    emoji: "🛕",
    tagline: "Ancient rock-cut Buddhist caves, Maharashtra",
    wikipediaPath: "/wiki/Ajanta_Caves",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Ajanta_Padmapani.jpg/640px-Ajanta_Padmapani.jpg",
    facts: [
      "The Ajanta Caves are about 2,200 years old.",
      "They are in Aurangabad district of Maharashtra.",
      "There are 30 caves carved into a horseshoe-shaped cliff.",
      "The caves are famous for paintings telling Jataka stories (life of Buddha).",
      "UNESCO declared them a World Heritage Site in 1983.",
    ],
    quiz: [
      { q: "In which state are the Ajanta Caves?", a: "Maharashtra", opts: ["Karnataka", "Maharashtra", "Madhya Pradesh", "Bihar"] },
      { q: "How many caves are there at Ajanta?", a: "30", opts: ["10", "30", "50", "100"] },
    ],
  },
  {
    id: "shaniwarwada",
    name: "Shaniwar Wada",
    region: "india",
    emoji: "🏯",
    tagline: "Peshwa fort in Pune · 1732",
    wikipediaPath: "/wiki/Shaniwar_Wada",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Shaniwarwada_gate.jpg/640px-Shaniwarwada_gate.jpg",
    facts: [
      "Shaniwar Wada was built in 1732 by Bajirao I.",
      "It was the seat of the Peshwas, who led the Maratha Empire.",
      "It had grand gates with iron spikes to stop war elephants.",
      "Most of the fort was destroyed in a fire in 1828; only walls and gates remain.",
      "It stands right in the heart of Pune today.",
    ],
    quiz: [
      { q: "Who built Shaniwar Wada?", a: "Bajirao I", opts: ["Shivaji Maharaj", "Bajirao I", "Tipu Sultan", "Akbar"] },
      { q: "Which empire was based at Shaniwar Wada?", a: "Maratha", opts: ["Mughal", "Maratha", "Chola", "Vijayanagara"] },
    ],
  },
  {
    id: "everest",
    name: "Mount Everest",
    region: "world",
    emoji: "🏔️",
    tagline: "Highest mountain · 8,849 m",
    wikipediaPath: "/wiki/Mount_Everest",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Everest_kalapatthar.jpg/640px-Everest_kalapatthar.jpg",
    facts: [
      "Mount Everest is the highest mountain on Earth at 8,849 metres.",
      "It sits on the border between Nepal and Tibet (China).",
      "In Nepali it's called Sagarmatha; in Tibetan, Chomolungma.",
      "Edmund Hillary and Tenzing Norgay first reached the summit in 1953.",
      "The mountain keeps growing — about 4 mm per year — as plates push together.",
    ],
    quiz: [
      { q: "How tall is Mount Everest?", a: "8,849 m", opts: ["5,000 m", "8,849 m", "12,000 m", "20,000 m"] },
      { q: "What's Everest called in Nepali?", a: "Sagarmatha", opts: ["Chomolungma", "Sagarmatha", "Kanchenjunga", "Annapurna"] },
    ],
  },
  {
    id: "amazon",
    name: "Amazon Rainforest",
    region: "nature",
    emoji: "🌳",
    tagline: "Lungs of the planet · South America",
    wikipediaPath: "/wiki/Amazon_rainforest",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Amazonie_d%27en_haut.jpg/640px-Amazonie_d%27en_haut.jpg",
    facts: [
      "The Amazon is the largest rainforest on Earth.",
      "It is home to more than 10% of all species on Earth.",
      "The Amazon River runs through it for about 6,400 km.",
      "Some trees here are over 200 years old.",
      "The forest helps make about 6% of the world's oxygen.",
    ],
    quiz: [
      { q: "Which river runs through the Amazon?", a: "Amazon River", opts: ["Nile", "Ganges", "Amazon River", "Mississippi"] },
      { q: "Roughly what % of Earth's species live here?", a: "Over 10%", opts: ["Less than 1%", "About 3%", "Over 10%", "Half of all"] },
    ],
  },
  {
    id: "mariana",
    name: "Mariana Trench",
    region: "nature",
    emoji: "🌊",
    tagline: "Deepest spot in the ocean",
    wikipediaPath: "/wiki/Mariana_Trench",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Marianatrenchmap.png/640px-Marianatrenchmap.png",
    facts: [
      "It's in the western Pacific Ocean.",
      "The deepest point, Challenger Deep, is about 10,994 metres down.",
      "Everest could fit inside it with 2 km still to spare.",
      "It's pitch dark, freezing, and water pressure is over 1000 times the surface.",
      "Even there, scientists have found living creatures — tiny amphipods and microbes.",
    ],
    quiz: [
      { q: "Which ocean is the Mariana Trench in?", a: "Pacific", opts: ["Atlantic", "Pacific", "Indian", "Arctic"] },
      { q: "How deep is the Challenger Deep?", a: "~11 km", opts: ["1 km", "5 km", "~11 km", "20 km"] },
    ],
  },
  {
    id: "isro",
    name: "ISRO HQ",
    region: "india",
    emoji: "🚀",
    tagline: "Indian Space Research Organisation · Bengaluru",
    wikipediaPath: "/wiki/Indian_Space_Research_Organisation",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/240px-Indian_Space_Research_Organisation_Logo.svg.png",
    facts: [
      "ISRO was founded in 1969 by Dr Vikram Sarabhai.",
      "Its headquarters are in Bengaluru, Karnataka.",
      "ISRO's rockets are launched from Sriharikota in Andhra Pradesh.",
      "Famous missions: Aryabhata, Chandrayaan, Mangalyaan, Aditya-L1, Gaganyaan.",
      "In 2017, ISRO launched 104 satellites in a single rocket — a world record.",
    ],
    quiz: [
      { q: "Who founded ISRO?", a: "Vikram Sarabhai", opts: ["A P J Abdul Kalam", "Vikram Sarabhai", "Homi Bhabha", "C V Raman"] },
      { q: "From where does ISRO launch rockets?", a: "Sriharikota", opts: ["Bengaluru", "Sriharikota", "Hyderabad", "Chennai"] },
    ],
  },
];

export const DEST_MAP = Object.fromEntries(DESTINATIONS.map((d) => [d.id, d])) as Record<string, Destination>;
