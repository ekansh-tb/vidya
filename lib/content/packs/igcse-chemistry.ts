// Cambridge IGCSE Chemistry 0620 — full Extended syllabus (all 12 topics).
//
// Verified 2026-08-11 against the Cambridge IGCSE Chemistry 0620 subject page
// (https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-chemistry-0620/),
// including the "Notes for use in qualitative analysis" tables (tests for aqueous
// cations, aqueous anions, gases, and flame colours) that appear at the back of
// every 0620 question paper.
//
// Question stems are original, in the style of past Paper 2/4 (Extended) — no
// past-paper wording is reproduced. Every observation colour, formula and
// balanced equation below was checked individually; anything doubtful was
// omitted rather than guessed (see the note at the bottom of `cheat`).
//
// Relative atomic masses used throughout: H 1, C 12, N 14, O 16, Na 23, Mg 24,
// S 32, Cl 35.5, K 39, Ca 40, Fe 56, Cu 64, Zn 65. Molar gas volume 24 dm³/mol
// at r.t.p.

import type { ExamPack } from "../exam-pack";

export const IGCSE_CHEMISTRY_PACK: ExamPack = {
  subjectId: "igcse-chemistry",
  grade: 10,
  title: "Chemistry — Full Syllabus · IGCSE",
  context: "Cambridge IGCSE 0620 · Extended · 12 topics · Papers 2 & 4",
  highlights: [
    { label: "Syllabus", value: "0620 (Extended)" },
    { label: "Topics", value: "1 – 12 · complete" },
    { label: "Heaviest marks", value: "Stoichiometry · Qualitative analysis" },
  ],
  pinnedRule: {
    heading: "Balance it, then state it",
    body: "A symbol equation earns nothing until the formulae are right AND the atoms balance on both sides. Never change a formula to balance — only add big numbers in front. Then add state symbols (s), (l), (g), (aq) whenever the question shows them or asks for them. Same discipline in calculations: formula → substitute → answer with unit, 3 significant figures unless told otherwise.",
  },
  reference: {
    label: "Cambridge IGCSE Chemistry 0620 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-chemistry-0620/",
  },
  plan: [
    { title: "Walk the twelve topics", hint: "1 states → 12 analysis, 10 min each" },
    { title: "Drill the mole triangle three ways", hint: "n = m/M, n = c×V, n = V/24" },
    { title: "Recite every ion test out loud", hint: "NaOH vs NH₃ — the colour AND the 'in excess'" },
    { title: "Write the six gas tests from memory", hint: "H₂, O₂, CO₂, NH₃, Cl₂, SO₂" },
    { title: "Balance ten equations cold", hint: "Combustion, neutralisation, displacement" },
    { title: "Read the cheat sheet morning of the exam", hint: "Last 10 minutes only" },
  ],

  topics: [
    {
      id: "1-states", num: 1, title: "1. States of matter",
      blurb: "Kinetic particle model, changes of state, diffusion.",
      syllabus: [
        "Solid / liquid / gas: particle separation, arrangement and motion; explain shape, volume and compressibility from the model.",
        "Changes of state and their names: melting, boiling, evaporation, condensation, freezing (solidification), sublimation.",
        "Effect of temperature and pressure on gas volume, explained by particle speed and frequency of collisions with the container walls.",
        "Diffusion = net movement of particles from high to low concentration, down a concentration gradient, caused by random particle motion.",
        "Rate of diffusion depends on relative molecular mass: lighter molecules diffuse faster at the same temperature.",
        "Classic demonstration: cotton wool soaked in concentrated ammonia at one end of a tube and concentrated hydrochloric acid at the other — the white ring of NH₄Cl forms nearer the HCl end because NH₃ (Mr 17) diffuses faster than HCl (Mr 36.5).",
      ],
    },
    {
      id: "2-atoms", num: 2, title: "2. Atoms, elements and compounds",
      blurb: "Structure, bonding and the properties they explain.",
      syllabus: [
        "Proton number Z, nucleon number A, isotopes (same Z, different number of neutrons → identical chemical properties); electronic configuration to 2,8,8.",
        "Ionic bonding: electrostatic attraction between oppositely charged ions formed by electron transfer; dot-and-cross diagrams for NaCl, MgCl₂, CaO.",
        "Giant ionic lattice (NaCl): high melting point, conducts when molten or aqueous but not solid, because ions are only free to move when the lattice breaks.",
        "Covalent bonding: shared pairs of electrons; dot-and-cross for H₂, Cl₂, H₂O, CH₄, NH₃, CO₂, N₂, HCl, CH₃OH.",
        "Simple molecular substances: low melting/boiling points because the weak intermolecular forces (not the strong covalent bonds) are overcome; poor conductors.",
        "Giant covalent: diamond (each C bonded to 4 others, tetrahedral, very hard, non-conductor) vs graphite (each C bonded to 3 in hexagonal layers, weak forces between layers → slippery, one delocalised electron per atom → conducts). Metallic bonding: lattice of positive ions in a sea of delocalised electrons → conduction and malleability.",
      ],
    },
    {
      id: "3-stoichiometry", num: 3, title: "3. Stoichiometry",
      blurb: "Formulae, equations and every mole calculation on the paper.",
      syllabus: [
        "Write and balance symbol equations, including ionic equations; add state symbols (s), (l), (g), (aq).",
        "Relative atomic mass Ar and relative formula mass Mr; percentage composition by mass.",
        "The mole: n = mass ÷ Mr. Avogadro constant = 6.02 × 10²³ particles per mole.",
        "Concentration: n = c × V with V in dm³ (cm³ ÷ 1000); convert mol/dm³ ↔ g/dm³ by multiplying/dividing by Mr.",
        "Gases: n = volume ÷ 24 at room temperature and pressure (24 dm³ = 24 000 cm³ per mole); equal volumes of gases contain equal numbers of molecules.",
        "Empirical and molecular formulae from % composition or combustion data; limiting reactant; percentage yield = (actual ÷ theoretical) × 100; percentage purity.",
      ],
    },
    {
      id: "4-electrochemistry", num: 4, title: "4. Electrochemistry",
      blurb: "Electrolysis, electrode half-equations, cells.",
      syllabus: [
        "Electrolyte = molten or aqueous ionic compound broken down by electricity; cations → cathode (negative), anions → anode (positive).",
        "Cathode = reduction (gain of electrons); anode = oxidation (loss of electrons). Molten lead(II) bromide: Pb²⁺ + 2e⁻ → Pb and 2Br⁻ → Br₂ + 2e⁻.",
        "Concentrated aqueous sodium chloride: hydrogen at the cathode, chlorine at the anode, sodium hydroxide left in solution.",
        "Dilute sulfuric acid: hydrogen at the cathode, oxygen at the anode, in a 2 : 1 volume ratio.",
        "Selective discharge: at the cathode the less reactive species wins (a metal below hydrogen is deposited, otherwise H₂ is released); at the anode a concentrated halide gives the halogen, otherwise OH⁻ is discharged to give O₂.",
        "Electroplating and copper refining with copper electrodes (anode dissolves: Cu → Cu²⁺ + 2e⁻; cathode plates: Cu²⁺ + 2e⁻ → Cu); hydrogen–oxygen fuel cell produces electricity with water as the only product.",
      ],
    },
    {
      id: "5-energetics", num: 5, title: "5. Chemical energetics",
      blurb: "Exothermic vs endothermic, ΔH, bond energies.",
      syllabus: [
        "Exothermic: energy released to the surroundings, temperature rises, ΔH is negative (combustion, neutralisation, most displacement reactions).",
        "Endothermic: energy taken in, temperature falls, ΔH is positive (thermal decomposition, photosynthesis, dissolving ammonium salts).",
        "Reaction pathway diagrams: label reactants, products, ΔH and the activation energy Ea; a catalyst lowers Ea only — it does not change ΔH.",
        "Bond breaking is endothermic; bond making is exothermic.",
        "ΔH = Σ(bond energies of bonds broken) − Σ(bond energies of bonds made). A negative result confirms an exothermic reaction.",
        "Worked shape: for CH₄ + 2O₂ → CO₂ + 2H₂O, broken = 4(C–H) + 2(O=O), made = 2(C=O) + 4(O–H).",
      ],
    },
    {
      id: "6-reactions", num: 6, title: "6. Chemical reactions",
      blurb: "Rates, collision theory, reversible reactions and redox.",
      syllabus: [
        "Rate of reaction measured by loss of mass, volume of gas collected, or time for a precipitate to obscure a cross; interpret the gradient of a rate graph.",
        "Collision theory: reaction needs collisions with energy ≥ activation energy. Higher concentration/pressure → more frequent collisions; smaller particle size → larger surface area → more frequent collisions.",
        "Higher temperature increases the rate for two reasons: particles move faster (more frequent collisions) AND a greater proportion of collisions exceed the activation energy — the second is the dominant effect.",
        "Catalyst provides an alternative pathway of lower activation energy and is chemically unchanged at the end. Photochemical reactions include photosynthesis and the reaction of silver halides in photography.",
        "Reversible reactions and dynamic equilibrium in a closed system: forward and reverse rates equal, concentrations constant. Hydrated ↔ anhydrous copper(II) sulfate is the standard example.",
        "Le Chatelier applied to the Haber process (N₂ + 3H₂ ⇌ 2NH₃, ~450 °C, ~200 atm, iron catalyst) and the Contact process (2SO₂ + O₂ ⇌ 2SO₃, ~450 °C, ~2 atm, vanadium(V) oxide catalyst). Redox: oxidation is loss of electrons / increase in oxidation number; identify oxidising and reducing agents.",
      ],
    },
    {
      id: "7-acids-bases", num: 7, title: "7. Acids, bases and salts",
      blurb: "pH, neutralisation, oxide classes and salt preparation.",
      syllabus: [
        "Acids give H⁺ in aqueous solution, turn litmus red, pH < 7; bases accept H⁺, alkalis are soluble bases giving OH⁻, pH > 7. Universal indicator colours across the pH scale; methyl orange (red in acid, yellow in alkali) and thymolphthalein (colourless in acid, blue in alkali).",
        "Strong acid = fully dissociated into ions (HCl, HNO₃, H₂SO₄); weak acid = only partly dissociated (ethanoic acid, carbonic acid). Same for strong and weak alkalis.",
        "Reactions of acids: with metals → salt + hydrogen; with bases/metal oxides → salt + water; with carbonates → salt + water + carbon dioxide; with ammonia → ammonium salt.",
        "Oxide classes: acidic (SO₂, CO₂), basic (CaO, CuO), amphoteric (Al₂O₃, ZnO — react with both acids and alkalis), neutral.",
        "Solubility rules: all Na⁺, K⁺, NH₄⁺ and all nitrates are soluble; chlorides soluble except silver and lead(II); sulfates soluble except barium and lead(II) (calcium sulfate slightly soluble); carbonates insoluble except Na, K, ammonium; hydroxides insoluble except Na, K, ammonium (calcium hydroxide slightly soluble).",
        "Three preparation routes: titration for soluble sodium/potassium/ammonium salts; excess insoluble reactant (metal, metal oxide or carbonate) then filter and crystallise; precipitation of an insoluble salt by mixing two solutions, then filter, wash and dry.",
      ],
    },
    {
      id: "8-periodic-table", num: 8, title: "8. The Periodic Table",
      blurb: "Group trends, transition elements, noble gases.",
      syllabus: [
        "Arrangement by increasing proton number; group number = number of outer-shell electrons; period number = number of occupied shells.",
        "Group I alkali metals: soft, low density, reactivity increases down the group; 2Na + 2H₂O → 2NaOH + H₂, with the metal floating, fizzing and melting into a ball.",
        "Group VII halogens: diatomic; chlorine is a pale yellow-green gas, bromine a red-brown liquid, iodine a grey-black solid; reactivity decreases down the group.",
        "Halogen displacement: a more reactive halogen displaces a less reactive halide from solution, e.g. Cl₂ + 2KBr → 2KCl + Br₂ (solution turns orange).",
        "Transition elements: variable oxidation states, coloured compounds, useful as catalysts, high density and high melting point.",
        "Group VIII noble gases: full outer shell (helium 2, others 8) → unreactive and monatomic.",
      ],
    },
    {
      id: "9-metals", num: 9, title: "9. Metals",
      blurb: "Reactivity series, extraction, rusting and alloys.",
      syllabus: [
        "General properties of metals vs non-metals; alloys (brass = copper + zinc, stainless steel = iron + chromium + nickel) are harder because different-sized atoms disrupt the layers so they cannot slide.",
        "Reactivity series: K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au — deduced from reactions with water, steam, dilute acid, and from displacement reactions.",
        "Extraction method follows reactivity: metals above carbon are extracted by electrolysis (aluminium from bauxite dissolved in molten cryolite); metals below carbon are reduced by carbon.",
        "Blast furnace: C + O₂ → CO₂; CO₂ + C → 2CO; Fe₂O₃ + 3CO → 2Fe + 3CO₂; limestone decomposes, CaCO₃ → CaO + CO₂, and CaO + SiO₂ → CaSiO₃ removes sand as slag.",
        "Rusting needs both oxygen and water; the product is hydrated iron(III) oxide. Barrier methods (paint, grease, plastic) and galvanising with zinc.",
        "Sacrificial protection: a more reactive metal (zinc or magnesium) is oxidised in preference to the iron, so the iron is protected even if the coating is scratched.",
      ],
    },
    {
      id: "10-environment", num: 10, title: "10. Chemistry of the environment",
      blurb: "Water, air, pollutants and fertilisers.",
      syllabus: [
        "Test for water: anhydrous copper(II) sulfate turns white → blue; anhydrous cobalt(II) chloride turns blue → pink. Test for pure water: boiling point exactly 100 °C and melting point exactly 0 °C at standard pressure.",
        "Water treatment: sedimentation and filtration to remove solids, then chlorination to kill microorganisms.",
        "Composition of clean dry air: approximately 78% nitrogen, 21% oxygen, and the remainder mostly argon with about 0.04% carbon dioxide.",
        "Air pollutants and sources: carbon monoxide from incomplete combustion (toxic — binds to haemoglobin); sulfur dioxide from sulfur-containing fuels (acid rain); oxides of nitrogen formed when N₂ and O₂ react in hot engines; particulates.",
        "Catalytic converters reduce emissions, e.g. 2CO + 2NO → 2CO₂ + N₂.",
        "Greenhouse gases carbon dioxide and methane cause enhanced global warming; NPK fertilisers supply nitrogen, phosphorus and potassium; photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (light energy, chlorophyll).",
      ],
    },
    {
      id: "11-organic", num: 11, title: "11. Organic chemistry",
      blurb: "Homologous series, fuels, alcohols, acids and polymers.",
      syllabus: [
        "Homologous series: same general formula, successive members differ by CH₂, similar chemical properties, gradual change in physical properties. Naming and structural formulae for the first four members of each series.",
        "Alkanes CₙH₂ₙ₊₂ — saturated, substitution with chlorine in the presence of ultraviolet light. Alkenes CₙH₂ₙ — unsaturated, addition reactions.",
        "Test for unsaturation: aqueous bromine is decolourised from orange to colourless by an alkene; an alkane leaves it orange.",
        "Fractional distillation of petroleum gives refinery gas, gasoline, naphtha, kerosene, diesel oil, fuel oil and bitumen; cracking large alkanes at high temperature over a catalyst gives smaller alkanes plus alkenes, e.g. C₁₀H₂₂ → C₈H₁₈ + C₂H₄.",
        "Ethanol by fermentation (glucose + yeast, 25–35 °C, no air: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂) or by catalytic addition of steam to ethene (~300 °C, ~60 atm, phosphoric acid catalyst). Carboxylic acids from oxidation of alcohols; ethanoic acid CH₃COOH.",
        "Esterification: alcohol + carboxylic acid ⇌ ester + water with a concentrated sulfuric acid catalyst (ethanol + ethanoic acid → ethyl ethanoate). Addition polymerisation of alkenes (poly(ethene)); condensation polymerisation forming polyesters and polyamides with a small molecule lost each link.",
      ],
    },
    {
      id: "12-analysis", num: 12, title: "12. Experimental techniques and chemical analysis",
      blurb: "Separations, chromatography and the whole qualitative analysis table.",
      syllabus: [
        "Apparatus and measurement: burette and pipette for volume, measuring cylinder, gas syringe, thermometer, balance, stopwatch. Criteria of purity from sharp melting and boiling points.",
        "Separations: filtration, crystallisation, simple distillation, fractional distillation (choose by the property being exploited — solubility, boiling point difference).",
        "Paper chromatography with a locating agent for colourless spots; Rf = distance moved by the substance ÷ distance moved by the solvent front (always < 1, no units).",
        "Tests for gases: hydrogen pops with a lighted splint; oxygen relights a glowing splint; carbon dioxide turns limewater milky; ammonia turns damp red litmus blue; chlorine bleaches damp litmus paper; sulfur dioxide turns acidified aqueous potassium manganate(VII) from purple to colourless.",
        "Tests for cations with aqueous sodium hydroxide and with aqueous ammonia, noting the colour of the precipitate and whether it dissolves in excess; flame tests for Li⁺, Na⁺, K⁺, Ca²⁺, Ba²⁺ and Cu²⁺.",
        "Tests for anions: carbonate with dilute acid; halides with dilute nitric acid then aqueous silver nitrate; sulfate with dilute nitric acid then aqueous barium nitrate; nitrate with aqueous sodium hydroxide and aluminium foil, warmed; sulfite with acidified aqueous potassium manganate(VII).",
      ],
    },
  ],

  flashcards: [
    { term: "Mole (n)", def: "Amount of substance containing 6.02 × 10²³ particles. n = mass ÷ Mr; n = concentration × volume(dm³); n = gas volume ÷ 24 at r.t.p." },
    { term: "Molar gas volume", def: "One mole of ANY gas occupies 24 dm³ (24 000 cm³) at room temperature and pressure." },
    { term: "Percentage yield", def: "(actual mass obtained ÷ theoretical mass from the equation) × 100." },
    { term: "Empirical formula", def: "Simplest whole-number ratio of atoms. Divide % (or mass) by Ar, then divide all by the smallest." },
    { term: "Redox", def: "Oxidation is loss of electrons (or an increase in oxidation number); reduction is gain — OIL RIG. The oxidising agent is the species that is itself reduced; the reducing agent is the one that is itself oxidised." },
    { term: "Cathode vs anode", def: "Cathode is negative: cations arrive and GAIN electrons (reduction). Anode is positive: anions arrive and LOSE electrons (oxidation)." },
    { term: "Electrolysis of concentrated NaCl(aq)", def: "Hydrogen at the cathode, chlorine at the anode, sodium hydroxide left in the solution." },
    { term: "Exothermic vs endothermic", def: "Exothermic releases energy, temperature rises, ΔH negative. Endothermic absorbs energy, temperature falls, ΔH positive." },
    { term: "Bond energy rule", def: "Breaking bonds absorbs energy; making bonds releases it. ΔH = bonds broken − bonds made." },
    { term: "Catalyst", def: "Speeds up a reaction by providing a pathway with lower activation energy; chemically unchanged at the end; does NOT change ΔH or the yield at equilibrium." },
    { term: "Dynamic equilibrium", def: "In a closed system, forward and reverse reactions continue at equal rates, so concentrations stay constant." },
    { term: "Haber and Contact processes", def: "Haber: N₂ + 3H₂ ⇌ 2NH₃, ~450 °C, ~200 atm, iron catalyst, forward reaction exothermic. Contact: 2SO₂ + O₂ ⇌ 2SO₃, ~450 °C, ~2 atm, vanadium(V) oxide catalyst." },
    { term: "Strong vs weak acid", def: "Strong = completely dissociated into ions in water (HCl). Weak = only partly dissociated (ethanoic acid). Nothing to do with concentration." },
    { term: "Amphoteric oxide", def: "Reacts with both acids and alkalis to form salts — aluminium oxide and zinc oxide." },
    { term: "Reactivity series", def: "K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au. Above carbon → extract by electrolysis; below carbon → reduce with carbon." },
    { term: "Rusting", def: "Iron + oxygen + water → hydrated iron(III) oxide. BOTH oxygen and water are needed." },
    { term: "Sacrificial protection", def: "A more reactive metal (zinc, magnesium) in contact with iron is oxidised instead of the iron." },
    { term: "Test for an alkene", def: "Shake with aqueous bromine: orange → colourless. An alkane leaves it orange." },
    { term: "Rf value", def: "Distance moved by the spot ÷ distance moved by the solvent front. No units, always less than 1." },
    { term: "Gas test — hydrogen / oxygen", def: "Hydrogen: lighted splint gives a squeaky pop. Oxygen: relights a glowing splint." },
    { term: "Gas test — CO₂ / NH₃", def: "Carbon dioxide turns limewater milky. Ammonia turns damp RED litmus BLUE." },
    { term: "Gas test — Cl₂ / SO₂", def: "Chlorine bleaches damp litmus paper. Sulfur dioxide turns acidified aqueous potassium manganate(VII) from purple to colourless." },
    { term: "Cation test — copper(II)", def: "With NaOH: light blue precipitate, insoluble in excess. With aqueous ammonia: light blue precipitate that DISSOLVES in excess to a dark blue solution." },
    { term: "Cation test — iron(II) vs iron(III)", def: "Fe²⁺ gives a green precipitate; Fe³⁺ gives a red-brown precipitate. Neither dissolves in excess NaOH or excess ammonia." },
    { term: "Cation test — zinc vs aluminium", def: "Both give a white precipitate with NaOH that dissolves in excess. Separate them with ammonia: the zinc precipitate dissolves in excess, the aluminium one does not." },
    { term: "Cation test — calcium / chromium(III)", def: "Ca²⁺: white precipitate with NaOH, insoluble in excess; with aqueous ammonia there is no precipitate, or at most a very slight white one. Cr³⁺: green precipitate with NaOH that dissolves in excess; green precipitate with ammonia that does not." },
    { term: "Cation test — ammonium", def: "Warm with aqueous sodium hydroxide: ammonia gas is given off, turning damp red litmus blue. (There is no ammonia test for NH₄⁺.)" },
    { term: "Anion test — halides", def: "Acidify with dilute nitric acid, then add aqueous silver nitrate. Chloride → white ppt, bromide → cream ppt, iodide → yellow ppt." },
    { term: "Anion test — sulfate / carbonate / nitrate", def: "Sulfate: dilute nitric acid then aqueous barium nitrate → white ppt. Carbonate: add dilute acid → effervescence, CO₂ turns limewater milky. Nitrate: add NaOH(aq) and aluminium foil, warm → ammonia given off." },
    { term: "Flame colours", def: "Li⁺ red, Na⁺ yellow, K⁺ lilac, Ca²⁺ orange-red, Ba²⁺ light green, Cu²⁺ blue-green." },
  ],

  questions: [
    // 1 — states of matter
    {
      id: "ic10-1", topic: "1-states",
      q: "Cotton wool soaked in concentrated ammonia is put in one end of a long glass tube and cotton wool soaked in concentrated hydrochloric acid in the other. A white ring of ammonium chloride forms. Where does it form, and why?",
      opts: [
        "Exactly in the middle, because both gases travel at the same speed",
        "Nearer the hydrochloric acid end, because ammonia has the lower relative molecular mass and diffuses faster",
        "Nearer the ammonia end, because ammonia is an alkaline gas",
        "At the hydrochloric acid end, because HCl is denser and stays still",
      ],
      a: "Nearer the hydrochloric acid end, because ammonia has the lower relative molecular mass and diffuses faster",
      model: "Mr(NH₃) = 17, Mr(HCl) = 36.5. At the same temperature the lighter molecules move faster on average, so NH₃ travels further before the two gases meet. The ring therefore forms nearer the HCl end. Equation: NH₃(g) + HCl(g) → NH₄Cl(s).",
    },
    // 2 — atoms and bonding
    {
      id: "ic10-2", topic: "2-atoms",
      q: "An atom is represented as ³⁷₁₇Cl. How many protons, neutrons and electrons does the neutral atom contain?",
      opts: ["17 p, 37 n, 17 e", "17 p, 20 n, 17 e", "20 p, 17 n, 20 e", "37 p, 17 n, 37 e"],
      a: "17 p, 20 n, 17 e",
      model: "Proton number = 17, so 17 protons and (neutral atom) 17 electrons. Neutrons = nucleon number − proton number = 37 − 17 = 20. ³⁵Cl and ³⁷Cl are isotopes: same electronic configuration 2,8,7, so identical chemical properties.",
    },
    {
      id: "ic10-3", topic: "2-atoms",
      q: "Diamond and graphite are both giant covalent forms of carbon, yet graphite conducts electricity and is used as a lubricant while diamond does neither. Explain both differences in terms of structure and bonding. [4]",
      model: "In diamond every carbon atom forms four single covalent bonds in a rigid tetrahedral network, so all outer electrons are localised in bonds — there are no free charge carriers, and there are no weak points, making it extremely hard.\nIn graphite each carbon atom bonds to only three others, forming flat layers of hexagons. The fourth outer electron per atom is delocalised between the layers, and these mobile electrons carry charge, so graphite conducts.\nThe layers are held to one another only by weak intermolecular forces, so they slide over each other easily — that is why graphite is slippery and used as a lubricant.\nMark-scheme trap: say 'weak forces BETWEEN LAYERS', never 'weak covalent bonds' — the covalent bonds within a layer are strong.",
    },
    // 3 — stoichiometry (calculations)
    {
      id: "ic10-4", topic: "3-stoichiometry",
      q: "Calcium carbonate decomposes on strong heating: CaCO₃(s) → CaO(s) + CO₂(g). A student heats 25.0 g of pure calcium carbonate until there is no further change. (a) Calculate the mass of calcium oxide formed. (b) Calculate the volume of carbon dioxide released at r.t.p. (c) The student actually collects 11.9 g of calcium oxide. Calculate the percentage yield. [6]",
      model: "(a) Mr(CaCO₃) = 40 + 12 + (3 × 16) = 100.\nn(CaCO₃) = 25.0 ÷ 100 = 0.250 mol.\nThe equation is 1 : 1, so n(CaO) = 0.250 mol.\nMr(CaO) = 40 + 16 = 56, so mass = 0.250 × 56 = 14.0 g.\n\n(b) n(CO₂) = 0.250 mol (also 1 : 1).\nVolume = 0.250 × 24 = 6.00 dm³ at r.t.p. (= 6000 cm³).\n\n(c) Percentage yield = (actual ÷ theoretical) × 100 = (11.9 ÷ 14.0) × 100 = 85.0%.",
    },
    {
      id: "ic10-5", topic: "3-stoichiometry",
      q: "25.0 cm³ of 0.200 mol/dm³ aqueous sodium hydroxide is exactly neutralised by 18.0 cm³ of dilute sulfuric acid. (a) Write the balanced equation with state symbols. (b) Calculate the concentration of the sulfuric acid in mol/dm³. (c) Convert that answer to g/dm³. [6]",
      model: "(a) 2NaOH(aq) + H₂SO₄(aq) → Na₂SO₄(aq) + 2H₂O(l)\n\n(b) n(NaOH) = c × V = 0.200 × (25.0 ÷ 1000) = 5.00 × 10⁻³ mol.\nRatio NaOH : H₂SO₄ = 2 : 1, so n(H₂SO₄) = 5.00 × 10⁻³ ÷ 2 = 2.50 × 10⁻³ mol.\nc(H₂SO₄) = n ÷ V = 2.50 × 10⁻³ ÷ (18.0 ÷ 1000) = 0.139 mol/dm³ (3 s.f.).\n\n(c) Mr(H₂SO₄) = 2 + 32 + 64 = 98.\nConcentration = 0.139 × 98 = 13.6 g/dm³ (3 s.f.).\n\nThe 2 : 1 ratio is where most marks are lost — sulfuric acid is diprotic.",
    },
    {
      id: "ic10-6", topic: "3-stoichiometry",
      q: "0.240 g of magnesium ribbon is added to 50.0 cm³ of 1.00 mol/dm³ hydrochloric acid. (a) Write the balanced equation. (b) Show that the acid is in excess. (c) Calculate the volume of hydrogen produced at r.t.p., in cm³. [6]",
      model: "(a) Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)\n\n(b) n(Mg) = 0.240 ÷ 24 = 0.0100 mol.\nn(HCl) = 1.00 × (50.0 ÷ 1000) = 0.0500 mol.\nThe equation needs 2 mol HCl per mol Mg, i.e. 0.0200 mol HCl. Only 0.0200 mol is required but 0.0500 mol is present, so HCl is in excess and magnesium is the limiting reactant.\n\n(c) n(H₂) = n(Mg) = 0.0100 mol (1 : 1).\nVolume = 0.0100 × 24 = 0.240 dm³ = 240 cm³ at r.t.p.",
    },
    {
      id: "ic10-7", topic: "3-stoichiometry",
      q: "A compound contains 54.5% carbon, 9.1% hydrogen and 36.4% oxygen by mass. Its relative molecular mass is 88. Determine its empirical formula and its molecular formula. [4]",
      model: "Work in 100 g, so the percentages become masses.\nC: 54.5 ÷ 12 = 4.54 mol\nH: 9.1 ÷ 1 = 9.10 mol\nO: 36.4 ÷ 16 = 2.28 mol\n\nDivide all by the smallest (2.28):\nC: 4.54 ÷ 2.28 = 2.0\nH: 9.10 ÷ 2.28 = 4.0\nO: 2.28 ÷ 2.28 = 1.0\nEmpirical formula = C₂H₄O.\n\nMr of C₂H₄O = 24 + 4 + 16 = 44.\n88 ÷ 44 = 2, so the molecular formula is C₄H₈O₂.",
    },
    {
      id: "ic10-8", topic: "3-stoichiometry",
      q: "Which sample contains the greatest number of molecules? (Ar: H 1, C 12, N 14, O 16)",
      opts: ["4.0 g of CH₄", "4.0 g of O₂", "4.0 g of CO₂", "4.0 g of N₂"],
      a: "4.0 g of CH₄",
      model: "Equal masses → the smallest Mr gives the most moles, and moles are proportional to number of molecules.\nMr: CH₄ = 16, O₂ = 32, CO₂ = 44, N₂ = 28.\nn(CH₄) = 4.0 ÷ 16 = 0.25 mol, the largest of the four. Number of molecules = 0.25 × 6.02 × 10²³ = 1.5 × 10²³.",
    },
    // 4 — electrochemistry
    {
      id: "ic10-9", topic: "4-electrochemistry",
      q: "Concentrated aqueous sodium chloride is electrolysed using inert carbon electrodes. What is formed at each electrode, and what remains in the solution?",
      opts: [
        "Sodium at the cathode, chlorine at the anode, water remains",
        "Hydrogen at the cathode, oxygen at the anode, sodium chloride remains",
        "Hydrogen at the cathode, chlorine at the anode, sodium hydroxide remains",
        "Chlorine at the cathode, hydrogen at the anode, sodium hydroxide remains",
      ],
      a: "Hydrogen at the cathode, chlorine at the anode, sodium hydroxide remains",
      model: "At the cathode, Na⁺ and H⁺ are both attracted. Sodium is far more reactive than hydrogen, so hydrogen is discharged: 2H⁺ + 2e⁻ → H₂.\nAt the anode, Cl⁻ and OH⁻ are both attracted. Because the chloride solution is CONCENTRATED, chlorine is discharged: 2Cl⁻ → Cl₂ + 2e⁻.\nNa⁺ and OH⁻ are left behind, so the solution becomes sodium hydroxide.",
    },
    {
      id: "ic10-10", topic: "4-electrochemistry",
      q: "An iron spoon is to be electroplated with copper using aqueous copper(II) sulfate. (a) State which electrode the spoon must be. (b) Write the half-equation at each electrode when a pure copper anode is used. (c) Explain why the mass of the anode falls by the same amount as the mass of the cathode rises. [5]",
      model: "(a) The spoon must be the cathode (negative electrode), because the positive Cu²⁺ ions are attracted there and are deposited as copper metal.\n\n(b) Cathode (reduction): Cu²⁺ + 2e⁻ → Cu\nAnode (oxidation): Cu → Cu²⁺ + 2e⁻\n\n(c) Every copper atom that leaves the anode releases exactly two electrons and enters the solution as Cu²⁺; the same charge passes round the circuit and deposits one copper atom at the cathode. Because the same number of moles of copper dissolves and plates, the anode loses the mass the cathode gains, and the concentration of the copper(II) sulfate stays constant.",
    },
    // 5 — energetics
    {
      id: "ic10-11", topic: "5-energetics",
      q: "Use the bond energies below to calculate the enthalpy change for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g). Bond energies in kJ/mol: C–H 412, O=O 496, C=O 743, O–H 463. State whether the reaction is exothermic or endothermic. [4]",
      model: "Bonds broken (endothermic, +):\n4 × C–H = 4 × 412 = 1648\n2 × O=O = 2 × 496 = 992\nTotal in = 2640 kJ/mol\n\nBonds made (exothermic, −):\n2 × C=O = 2 × 743 = 1486\n4 × O–H = 4 × 463 = 1852\nTotal out = 3338 kJ/mol\n\nΔH = bonds broken − bonds made = 2640 − 3338 = −698 kJ/mol.\nThe value is negative, so the reaction is exothermic — more energy is released forming bonds than is absorbed breaking them.",
    },
    {
      id: "ic10-12", topic: "5-energetics",
      q: "A reaction pathway diagram shows the products at a higher energy level than the reactants. Which statement about this reaction is correct?",
      opts: [
        "It is exothermic and ΔH is negative",
        "It is endothermic and ΔH is positive",
        "It is exothermic and the temperature of the surroundings rises",
        "It cannot occur without a catalyst",
      ],
      a: "It is endothermic and ΔH is positive",
      model: "Products higher than reactants means the system has gained energy from the surroundings, so the reaction is endothermic and ΔH is positive. The surrounding temperature FALLS. A catalyst would lower the activation energy hump but leave both energy levels — and therefore ΔH — unchanged.",
    },
    // 6 — chemical reactions
    {
      id: "ic10-13", topic: "6-reactions",
      q: "Excess marble chips are added to dilute hydrochloric acid and the volume of gas is recorded against time. Explain, in terms of collision theory, why (a) the same experiment repeated at a higher temperature is faster, and (b) using powdered marble instead of large chips is faster. (c) State what happens to the FINAL volume of gas in each case and why. [6]",
      model: "(a) At a higher temperature the particles have greater average kinetic energy. They therefore collide more frequently, and — more importantly — a greater proportion of collisions have energy equal to or greater than the activation energy. Both effects increase the number of successful collisions per second, so the rate rises.\n\n(b) Powder has a much larger total surface area for the same mass, so more acid particles are in contact with the solid at any moment. Collisions between the acid and the solid surface are therefore more frequent and the rate rises.\n\n(c) The final volume is unchanged in both cases. The acid is the limiting reactant and its amount has not changed, so the same number of moles of CO₂ is produced — the graph reaches the same plateau, just sooner.\nEquation: CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g).",
    },
    {
      id: "ic10-14", topic: "6-reactions",
      q: "In the Haber process, N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the forward reaction is exothermic. Which change increases the equilibrium yield of ammonia?",
      opts: [
        "Increasing the temperature",
        "Increasing the pressure",
        "Adding more iron catalyst",
        "Removing the iron catalyst",
      ],
      a: "Increasing the pressure",
      model: "There are 4 moles of gas on the left and 2 on the right. Increasing the pressure shifts the position of equilibrium towards the side with fewer gas molecules — the right — so the yield of ammonia rises.\nIncreasing the temperature favours the endothermic (reverse) direction and LOWERS the yield; the 450 °C used industrially is a compromise for an acceptable rate.\nA catalyst changes only how fast equilibrium is reached, never the yield.",
    },
    // 7 — acids, bases and salts
    {
      id: "ic10-15", topic: "7-acids-bases",
      q: "Describe how you would prepare a pure, dry sample of copper(II) sulfate crystals starting from copper(II) oxide and dilute sulfuric acid. Give the equation and explain why an excess of copper(II) oxide is used. [6]",
      model: "Equation: CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)\n\nMethod:\n1. Warm the dilute sulfuric acid gently in a beaker.\n2. Add copper(II) oxide a little at a time, stirring, until no more dissolves and some black solid remains — this excess guarantees that ALL the acid has reacted, so no acid contaminates the product.\n3. Filter to remove the unreacted copper(II) oxide; the blue filtrate is copper(II) sulfate solution.\n4. Heat the filtrate in an evaporating basin to concentrate it — stop when crystals just begin to form at the edge (the crystallisation point). Do not evaporate to dryness, or the crystals lose their water of crystallisation and turn to white powder.\n5. Leave to cool and crystallise slowly, then filter off the blue crystals and dry them between filter papers (or in a warm oven).",
    },
    {
      id: "ic10-16", topic: "7-acids-bases",
      q: "Which oxide reacts with both dilute hydrochloric acid and aqueous sodium hydroxide to form a salt?",
      opts: ["Calcium oxide", "Zinc oxide", "Sulfur dioxide", "Copper(II) oxide"],
      a: "Zinc oxide",
      model: "Zinc oxide is amphoteric — it behaves as a base towards acids and as an acid towards alkalis. Aluminium oxide is the other amphoteric oxide named in 0620. Calcium oxide and copper(II) oxide are basic (acids only); sulfur dioxide is acidic (alkalis only).",
    },
    // 8 — Periodic Table
    {
      id: "ic10-17", topic: "8-periodic-table",
      q: "Chlorine gas is bubbled through colourless aqueous potassium bromide. (a) State the observation and write the balanced equation. (b) Predict what happens if bromine water is instead added to aqueous potassium chloride, and explain why. (c) Explain the trend in reactivity down Group VII. [5]",
      model: "(a) The solution turns orange (bromine is displaced).\nCl₂(aq) + 2KBr(aq) → 2KCl(aq) + Br₂(aq)\nIonic equation: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂. Chlorine is reduced (it gains electrons) and bromide is oxidised.\n\n(b) No reaction — no colour change beyond the orange of the added bromine. Bromine is less reactive than chlorine, so it cannot displace chloride ions from their solution.\n\n(c) Reactivity DECREASES down Group VII. Going down the group each atom has more electron shells, so the outer shell is further from the nucleus and is better shielded by the inner electrons. The attraction for an incoming electron is weaker, so the atom gains an electron less readily and the element is less reactive.",
    },
    // 9 — metals
    {
      id: "ic10-18", topic: "9-metals",
      q: "Iron is extracted from haematite (Fe₂O₃) in the blast furnace. (a) Write equations for the three reactions that produce the reducing agent and reduce the ore. (b) Explain the purpose of the limestone with two equations. (c) State why aluminium cannot be extracted by this method. [7]",
      model: "(a) Coke burns in the hot air blast:\nC(s) + O₂(g) → CO₂(g)   (strongly exothermic — provides the heat)\nCarbon dioxide is reduced by more hot coke to make the reducing agent:\nCO₂(g) + C(s) → 2CO(g)\nCarbon monoxide reduces the ore:\nFe₂O₃(s) + 3CO(g) → 2Fe(l) + 3CO₂(g)\n\n(b) Limestone removes the sandy impurity (silicon dioxide). It first decomposes in the heat:\nCaCO₃(s) → CaO(s) + CO₂(g)\nThe calcium oxide, a base, then reacts with the acidic silicon dioxide:\nCaO(s) + SiO₂(s) → CaSiO₃(l)\nThe molten calcium silicate is slag; it floats on the denser molten iron and is tapped off separately.\n\n(c) Aluminium is ABOVE carbon in the reactivity series, so carbon cannot reduce its oxide. Aluminium must be extracted by electrolysis of aluminium oxide dissolved in molten cryolite (which lowers the melting point and saves energy).",
    },
    {
      id: "ic10-19", topic: "9-metals",
      q: "A steel pipe is protected from rusting by bolting blocks of magnesium to it. Which statement explains this method?",
      opts: [
        "The magnesium forms a physical barrier that keeps out oxygen and water",
        "Magnesium is more reactive, so it is oxidised in preference to the iron",
        "Magnesium is less reactive, so it takes electrons from the iron",
        "The magnesium reacts with water to produce a protective layer of hydrogen",
      ],
      a: "Magnesium is more reactive, so it is oxidised in preference to the iron",
      model: "This is sacrificial protection. Magnesium loses electrons more readily than iron, so the magnesium corrodes and the iron does not. The key advantage over painting or greasing is that protection continues even if the surface is scratched, because it does not rely on a barrier. Rusting itself requires BOTH oxygen and water, giving hydrated iron(III) oxide.",
    },
    // 10 — environment
    {
      id: "ic10-20", topic: "10-environment",
      q: "Which pair correctly matches an atmospheric pollutant to its main source and effect?",
      opts: [
        "Carbon monoxide — complete combustion of hydrocarbons — acid rain",
        "Sulfur dioxide — combustion of fuels containing sulfur — acid rain",
        "Nitrogen — reaction of oxygen with water in engines — global warming",
        "Carbon dioxide — incomplete combustion — toxic, binds to haemoglobin",
      ],
      a: "Sulfur dioxide — combustion of fuels containing sulfur — acid rain",
      model: "Sulfur dioxide comes from burning fossil fuels that contain sulfur compounds and dissolves in rain to make it acidic, damaging trees, aquatic life and limestone buildings.\nThe distractors: carbon monoxide comes from INCOMPLETE combustion and is toxic because it binds to haemoglobin; oxides of nitrogen (not nitrogen itself) form when N₂ and O₂ react at the high temperature inside an engine; carbon dioxide is a greenhouse gas, not a toxin. A catalytic converter deals with two of these at once: 2CO + 2NO → 2CO₂ + N₂.",
    },
    // 11 — organic
    {
      id: "ic10-21", topic: "11-organic",
      q: "Decane, C₁₀H₂₂, is cracked to give octane and one other product. (a) Write the balanced equation. (b) State the conditions used. (c) Describe a chemical test that distinguishes the two organic products, giving the result for each. (d) Give two reasons why cracking is carried out industrially. [6]",
      model: "(a) C₁₀H₂₂ → C₈H₁₈ + C₂H₄\nCheck the atoms: 8 + 2 = 10 carbon, 18 + 4 = 22 hydrogen. Balanced.\n\n(b) A high temperature (about 600–700 °C) with a catalyst such as silica or alumina.\n\n(c) Shake each with aqueous bromine. Ethene, C₂H₄, is unsaturated: the bromine changes from orange to colourless. Octane, C₈H₁₈, is a saturated alkane: the bromine stays orange.\n\n(d) Any two of: it converts long-chain fractions in low demand into shorter, more useful fuels such as petrol; it produces alkenes such as ethene that are needed as feedstock for polymers and for making ethanol; it also produces hydrogen.",
    },
    // 12 — experimental techniques and analysis
    {
      id: "ic10-22", topic: "12-analysis",
      q: "Solution X is colourless. Adding a few drops of aqueous sodium hydroxide gives a white precipitate that dissolves in excess to give a colourless solution. Adding aqueous ammonia to a fresh portion also gives a white precipitate that dissolves in excess. A third portion, acidified with dilute nitric acid and treated with aqueous barium nitrate, gives a white precipitate. Identify X and justify every step. [6]",
      model: "The cation is zinc, Zn²⁺.\nA white precipitate with sodium hydroxide that dissolves in excess narrows it to zinc or aluminium (both hydroxides are amphoteric).\nThe aqueous ammonia test separates them: the zinc precipitate DISSOLVES in excess ammonia to give a colourless solution, whereas the aluminium precipitate stays put. So the cation is Zn²⁺, not Al³⁺.\n\nThe anion is sulfate, SO₄²⁻. Acidifying with dilute nitric acid first removes any carbonate (which would give a white barium carbonate precipitate and a false positive); the white precipitate with barium nitrate is then barium sulfate.\n\nSolution X is zinc sulfate, ZnSO₄(aq).\nIonic equation for the final test: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).",
    },
  ],

  mistakes: [
    { mistake: "Balancing an equation by changing a subscript inside a formula (writing H₂O₂ to balance oxygen).", fix: "Formulae are fixed by the chemistry. Only the big numbers in FRONT may change. Get every formula right first, then balance." },
    { mistake: "Using a 1 : 1 ratio in titration calculations regardless of the equation.", fix: "Write the balanced equation before touching the calculator. H₂SO₄ needs 2 NaOH; Ca(OH)₂ needs 2 HCl. The ratio line is worth a mark on its own." },
    { mistake: "Forgetting to convert cm³ to dm³ in n = c × V, so answers come out 1000× wrong.", fix: "Divide every cm³ volume by 1000 the moment you write it down. For gases the other conversion is ÷ 24 (dm³) or ÷ 24 000 (cm³)." },
    { mistake: "Saying a precipitate 'goes away' in excess without naming the reagent it went away in.", fix: "Zinc and aluminium BOTH give a white precipitate soluble in excess NaOH. Only the ammonia result separates them — always report the NaOH result and the ammonia result." },
    { mistake: "Confusing the copper(II) observations: writing 'blue precipitate soluble in excess NaOH'.", fix: "Cu²⁺ with NaOH: light blue precipitate, INSOLUBLE in excess. With ammonia: light blue precipitate that dissolves in excess to a DARK BLUE solution." },
    { mistake: "Skipping the acidification step in the halide and sulfate tests.", fix: "Add dilute nitric acid first. It removes carbonate and sulfite ions that would otherwise give their own white precipitate with silver nitrate or barium nitrate — a false positive." },
    { mistake: "Answering 'a catalyst increases the yield of ammonia in the Haber process'.", fix: "A catalyst changes only the RATE and the time taken to reach equilibrium. It never shifts the position of equilibrium and never changes ΔH." },
    { mistake: "Getting ΔH the wrong way round in bond-energy sums.", fix: "ΔH = bonds BROKEN − bonds MADE. Breaking is endothermic (+), making is exothermic (−). If combustion comes out positive, you have subtracted the wrong way." },
    { mistake: "Writing 'graphite has weak covalent bonds between the layers'.", fix: "The covalent bonds are strong everywhere. It is the intermolecular (van der Waals) forces BETWEEN layers that are weak, letting layers slide." },
    { mistake: "Saying rusting needs 'air' only, or 'oxygen only'.", fix: "Rusting needs oxygen AND water. Name both, and name the product: hydrated iron(III) oxide." },
    { mistake: "Confusing 'concentrated' with 'strong' when describing acids.", fix: "Strong/weak = how fully the acid dissociates into ions. Concentrated/dilute = how much acid there is per dm³. A dilute strong acid and a concentrated weak acid are both possible." },
    { mistake: "Evaporating salt solutions to dryness during a crystallisation.", fix: "Heat only until crystals start to appear at the edge, then cool slowly. Boiling dry drives off the water of crystallisation and ruins the crystals." },
  ],

  cheat: [
    {
      heading: "Cation tests — say the colour AND what happens in excess",
      bullets: [
        "Al³⁺: NaOH → white ppt, DISSOLVES in excess. NH₃ → white ppt, stays.",
        "Zn²⁺: NaOH → white ppt, DISSOLVES in excess. NH₃ → white ppt, DISSOLVES in excess. (This is what separates Zn from Al.)",
        "Ca²⁺: NaOH → white ppt, stays in excess. NH₃ → no ppt (at most a very slight white one).",
        "Cu²⁺: NaOH → light blue ppt, stays. NH₃ → light blue ppt, DISSOLVES to a dark blue solution.",
        "Fe²⁺: green ppt with both, stays in excess. Fe³⁺: red-brown ppt with both, stays in excess.",
        "Cr³⁺: NaOH → green ppt, DISSOLVES in excess. NH₃ → green ppt, stays.",
        "NH₄⁺: warm with NaOH → ammonia gas, damp red litmus turns blue. (No ammonia test exists for it.)",
      ],
    },
    {
      heading: "Anion tests + flame colours",
      bullets: [
        "Carbonate: add dilute acid → effervescence; the gas turns limewater milky.",
        "Chloride / bromide / iodide: dilute nitric acid, then silver nitrate → WHITE / CREAM / YELLOW ppt.",
        "Sulfate: dilute nitric acid, then barium nitrate → white ppt.",
        "Sulfite: acidified aqueous potassium manganate(VII) turns from purple to colourless.",
        "Nitrate: add NaOH(aq) + aluminium foil and warm → ammonia given off (damp red litmus → blue).",
        "Flames: Li⁺ red · Na⁺ yellow · K⁺ lilac · Ca²⁺ orange-red · Ba²⁺ light green · Cu²⁺ blue-green.",
      ],
    },
    {
      heading: "Gas tests + test for water (six lines, learn them verbatim)",
      bullets: [
        "Hydrogen — lighted splint gives a squeaky pop.",
        "Oxygen — relights a glowing splint.",
        "Carbon dioxide — turns limewater milky.",
        "Ammonia — turns damp RED litmus BLUE.",
        "Chlorine — bleaches damp litmus paper.",
        "Sulfur dioxide — turns acidified aqueous potassium manganate(VII) purple → colourless.",
        "Water present: anhydrous copper(II) sulfate white → blue; anhydrous cobalt(II) chloride blue → pink. Water PURE: boils at exactly 100 °C, melts at exactly 0 °C.",
      ],
    },
    {
      heading: "Reactivity series and what it decides",
      bullets: [
        "K · Na · Ca · Mg · Al · (C) · Zn · Fe · (H) · Cu · Ag · Au.",
        "Above carbon → extract by ELECTROLYSIS (aluminium from bauxite in molten cryolite).",
        "Below carbon → reduce with carbon/carbon monoxide (iron in the blast furnace).",
        "Below hydrogen (Cu, Ag, Au) → no reaction with dilute acids, no hydrogen given off.",
        "More reactive metal displaces a less reactive one from its compound — and is the sacrificial metal in corrosion protection.",
        "In electrolysis of solutions, the LESS reactive species is discharged at the cathode.",
      ],
    },
    {
      heading: "Formulae, ions and the three mole routes",
      bullets: [
        "n = mass ÷ Mr   ·   n = concentration(mol/dm³) × volume(dm³)   ·   n = gas volume(dm³) ÷ 24 at r.t.p.",
        "cm³ → dm³: divide by 1000. mol/dm³ → g/dm³: multiply by Mr.",
        "Percentage yield = (actual ÷ theoretical) × 100. Rf = distance moved by spot ÷ distance moved by solvent.",
        "Common ions: NO₃⁻ · OH⁻ · CO₃²⁻ · SO₄²⁻ · HCO₃⁻ · NH₄⁺ · Zn²⁺ · Ag⁺ · Pb²⁺ · Al³⁺.",
        "Soluble: all Na/K/ammonium salts, all nitrates. Insoluble: AgCl, PbCl₂, BaSO₄, PbSO₄, most carbonates, most hydroxides.",
        "Empirical formula recipe: %÷Ar → divide by the smallest → multiply up to whole numbers.",
      ],
    },
    {
      heading: "Industrial conditions and organic must-knows",
      bullets: [
        "Haber: N₂ + 3H₂ ⇌ 2NH₃ · ~450 °C · ~200 atm · iron catalyst · forward reaction exothermic.",
        "Contact: 2SO₂ + O₂ ⇌ 2SO₃ · ~450 °C · ~2 atm · vanadium(V) oxide catalyst.",
        "Ethanol two ways: fermentation (glucose + yeast, 25–35 °C, no air) or steam + ethene (~300 °C, ~60 atm, phosphoric acid).",
        "General formulae: alkane CₙH₂ₙ₊₂ · alkene CₙH₂ₙ · alcohol CₙH₂ₙ₊₁OH · carboxylic acid CₙH₂ₙ₊₁COOH.",
        "Alkene test: aqueous bromine orange → colourless. Alkane leaves it orange.",
        "Alcohol + carboxylic acid → ester + water, concentrated sulfuric acid catalyst (ethanol + ethanoic acid → ethyl ethanoate).",
        "Addition polymerisation joins alkene monomers with no other product; condensation polymerisation loses a small molecule (usually water) at each link.",
      ],
    },
    {
      heading: "Exam-day moves",
      bullets: [
        "Balance every equation and check atom counts on both sides before moving on.",
        "Put a unit on every numerical answer: g, dm³, cm³, mol, mol/dm³, g/dm³, kJ/mol, °C.",
        "Round to 3 significant figures at the END only — carry full precision through the working.",
        "For 'describe the observation' questions, give a colour, a state and a change ('white precipitate forms, dissolves in excess to a colourless solution').",
        "Show the mole line even if the arithmetic defeats you — the ratio and the substitution carry method marks.",
        "Deliberately omitted from this pack: any observation, catalyst or condition we could not verify against the 0620 syllabus documents. If a detail is not here, check your own syllabus copy before quoting it.",
      ],
    },
  ],
};
