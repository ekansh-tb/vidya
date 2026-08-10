// Cambridge IGCSE Biology 0610 — full Extended syllabus (topics 1–21).
//
// Verified on 2026-08-11 against the official Cambridge syllabus PDF
// "Cambridge IGCSE Biology 0610 syllabus for 2026, 2027 and 2028" (version 2,
// published December 2025), downloaded from the 0610 subject page:
// https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-biology-0610/
// Topic numbering, subtopic scope, the command-word table and every definition
// quoted below are taken from that document. Where Cambridge specifies exact
// wording (diffusion, osmosis, active transport, the equations, the genetics
// vocabulary, the ecology terms), that wording is reproduced verbatim so the
// flashcards train the phrasing mark schemes actually credit.
//
// Question stems are original, written in the style of past Paper 4 (Extended).

import type { ExamPack } from "../exam-pack";

export const IGCSE_BIOLOGY_PACK: ExamPack = {
  subjectId: "igcse-biology",
  grade: 10,
  title: "Biology — IGCSE 0610",
  context: "Cambridge IGCSE 0610 · Extended · Topics 1–21 · CNS Pune",
  highlights: [
    { label: "Syllabus", value: "0610 (Extended) · 2026–28" },
    { label: "Theory", value: "Paper 2 (MCQ) + Paper 4 (Theory)" },
    { label: "Practical", value: "Paper 5 or Paper 6" },
  ],
  pinnedRule: {
    heading: "Answer the command word, in biological language",
    body: "Describe = give the features/points. Explain = say why or how, with reasons. State = one clear line, no essay. Suggest = apply what you know to a new context. Then police your wording: never say a plant 'wants' light, a cell 'tries' to survive, or bacteria 'decide' to become resistant — examiners strike out anthropomorphic answers. Enzymes are denatured, not killed. Respiration happens in cells; breathing is ventilation. Water moves by osmosis from higher to lower water potential, never simply 'high to low concentration'.",
  },
  reference: {
    label: "Cambridge IGCSE Biology 0610 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-biology-0610/",
  },
  plan: [
    { title: "Recite the definitions Cambridge marks word-for-word", hint: "Diffusion, osmosis, active transport first" },
    { title: "Write out the four equations from memory", hint: "Photosynthesis + respiration, word AND symbol" },
    { title: "Drill the five food tests", hint: "Reagent → method → colour change both ways" },
    { title: "Practise one monohybrid cross on paper", hint: "Key, parents, gametes, Punnett square, ratio" },
    { title: "Walk topics 14 & 19–21 — the ones students skip", hint: "Coordination, ecology, biotech" },
    { title: "Read the cheat sheet the morning of the paper", hint: "Last 10 minutes only" },
  ],

  topics: [
    {
      id: "1-characteristics", num: 1, title: "1. Characteristics and classification of living organisms",
      blurb: "The seven characteristics, species, binomial naming, five kingdoms.",
      syllabus: [
        "Seven characteristics: movement, respiration, sensitivity, growth, reproduction, excretion, nutrition — each has an exact syllabus definition you must be able to write.",
        "Species = a group of organisms that can reproduce to produce fertile offspring.",
        "Binomial system: an internationally agreed system in which the scientific name has two parts showing genus and species.",
        "Construct and use dichotomous keys from identifiable features.",
        "Five kingdoms: animal, plant, fungus, prokaryote, protoctist. Vertebrate groups: mammals, birds, reptiles, amphibians, fish. Arthropod groups: myriapods, insects, arachnids, crustaceans.",
        "Plant groups limited to ferns and flowering plants (dicotyledons and monocotyledons).",
        "Viruses: a protein coat and genetic material — that is all that is required.",
        "Classification aims to reflect evolutionary relationships; DNA base sequences are used to classify. More closely related organisms (more recent common ancestor) have more similar base sequences.",
      ],
    },
    {
      id: "2-organisation", num: 2, title: "2. Organisation of the organism",
      blurb: "Plant, animal and bacterial cells; specialised cells; magnification.",
      syllabus: [
        "Plant vs animal cell, limited to: cell wall, cell membrane, nucleus, cytoplasm, chloroplasts, ribosomes, mitochondria, vacuoles.",
        "Bacterial cell, limited to: cell wall, cell membrane, cytoplasm, ribosomes, circular DNA, plasmids.",
        "Functions of each structure; new cells are produced by division of existing cells.",
        "Specialised cells: ciliated cells (move mucus in trachea and bronchi), root hair cells (absorption), palisade mesophyll (photosynthesis), neurones (conduct electrical impulses), red blood cells (transport oxygen), sperm and egg cells (reproduction).",
        "Levels of organisation: cell → tissue → organ → organ system → organism.",
        "magnification = image size ÷ actual size. Rearrange for either unknown.",
        "Convert between millimetres (mm) and micrometres (μm): 1 mm = 1000 μm.",
      ],
    },
    {
      id: "3-movement-in-out", num: 3, title: "3. Movement into and out of cells",
      blurb: "Diffusion, osmosis and active transport — the three definitions examiners hunt for.",
      syllabus: [
        "Diffusion = the net movement of particles from a region of their higher concentration to a region of their lower concentration (down a concentration gradient), as a result of their random movement.",
        "Energy for diffusion comes from the kinetic energy of random movement of molecules and ions — no energy from respiration is used.",
        "Factors affecting diffusion: surface area, temperature, concentration gradient, distance.",
        "Osmosis = the net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane.",
        "Effects on plant cells: turgid, turgor pressure, plasmolysis, flaccid. Plants are supported by the pressure of water inside cells pressing outwards on the cell wall.",
        "Active transport = the movement of particles through a cell membrane from a region of lower concentration to a region of higher concentration (against a concentration gradient), using energy from respiration.",
        "Protein carriers move molecules or ions across the membrane during active transport; ion uptake by root hairs is the standard example.",
      ],
    },
    {
      id: "4-biological-molecules", num: 4, title: "4. Biological molecules",
      blurb: "Elements, building blocks, the five food tests, DNA structure.",
      syllabus: [
        "Elements: carbohydrates and fats/oils contain C, H, O; proteins contain C, H, O, N (and S in some).",
        "Large from small: starch, glycogen and cellulose from glucose; proteins from amino acids; fats and oils from fatty acids and glycerol.",
        "Iodine solution test for starch; Benedict's solution test for reducing sugars; biuret test for proteins; ethanol emulsion test for fats and oils; DCPIP test for vitamin C.",
        "DNA: two strands coiled together to form a double helix; each strand contains bases; bonds between pairs of bases hold the strands together.",
        "Base pairing is always A with T and C with G (full names of the bases are not required).",
      ],
    },
    {
      id: "5-enzymes", num: 5, title: "5. Enzymes",
      blurb: "Biological catalysts, active site, temperature and pH.",
      syllabus: [
        "Catalyst = a substance that increases the rate of a chemical reaction and is not changed by the reaction.",
        "Enzymes = proteins that are involved in all metabolic reactions, where they function as biological catalysts. They give reaction rates fast enough to sustain life.",
        "Enzyme action: active site, substrate, enzyme–substrate complex, product. The active site shape is complementary to the substrate.",
        "Specificity comes from the complementary shape and fit of the active site with the substrate — one enzyme, one substrate.",
        "Temperature: rising temperature raises kinetic energy → more frequent effective collisions → faster rate, up to the optimum. Above it the active site changes shape and the enzyme is denatured, so substrate no longer fits.",
        "pH: away from the optimum, the shape of the active site changes and the enzyme denatures — substrate no longer fits.",
      ],
    },
    {
      id: "6-plant-nutrition", num: 6, title: "6. Plant nutrition",
      blurb: "Photosynthesis, limiting factors, leaf structure.",
      syllabus: [
        "Photosynthesis = the process by which plants synthesise carbohydrates from raw materials using energy from light.",
        "Word equation: carbon dioxide + water → glucose + oxygen, in the presence of light and chlorophyll. Symbol equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
        "Chlorophyll is a green pigment in chloroplasts that transfers energy from light into energy in chemicals.",
        "Uses of carbohydrate made: starch (energy store), cellulose (cell walls), glucose (respiration), sucrose (transport in phloem), nectar (attracts insects for pollination).",
        "Nitrate ions are needed for making amino acids; magnesium ions for making chlorophyll.",
        "Limiting factors: light intensity, carbon dioxide concentration and temperature — identify and explain which one is limiting from a graph.",
        "Leaf adaptations: large surface area and thin; cuticle, upper and lower epidermis, palisade mesophyll, spongy mesophyll, air spaces, guard cells and stomata, vascular bundles (xylem and phloem).",
      ],
    },
    {
      id: "7-human-nutrition", num: 7, title: "7. Human nutrition",
      blurb: "Balanced diet, gut organs, physical and chemical digestion, absorption.",
      syllabus: [
        "Balanced diet and dietary sources/importance of: carbohydrates, fats and oils, proteins, vitamins C and D, calcium and iron ions, fibre (roughage), water. Scurvy = lack of vitamin C; rickets = lack of vitamin D (or calcium).",
        "Alimentary canal: mouth, oesophagus, stomach, small intestine (duodenum and ileum), large intestine (colon, rectum, anus). Associated organs: salivary glands, pancreas, liver, gall bladder.",
        "Five processes: ingestion, digestion, absorption, assimilation, egestion — know the one-line definition of each.",
        "Physical digestion = breakdown of food into smaller pieces without chemical change, increasing surface area for enzymes. Teeth: incisors, canines, premolars, molars; enamel, dentine, pulp, nerves, blood vessels, cement.",
        "Chemical digestion = breakdown of large insoluble molecules into small soluble molecules. Amylase → starch to maltose; maltase → maltose to glucose on the membranes of the epithelium lining the small intestine.",
        "Proteases: pepsin works in the acidic stomach, trypsin in the alkaline small intestine. Lipase → fats and oils to fatty acids and glycerol.",
        "Hydrochloric acid in gastric juice kills harmful microorganisms and gives the optimum acidic pH. Bile emulsifies fats (increasing surface area) and is alkaline, neutralising acidic chyme entering the duodenum.",
        "Absorption in the small intestine: villi and microvilli increase internal surface area; capillaries take up glucose and amino acids, lacteals take up fatty acids and glycerol. Most water is absorbed in the small intestine, some in the colon.",
      ],
    },
    {
      id: "8-transport-plants", num: 8, title: "8. Transport in plants",
      blurb: "Xylem, phloem, water uptake, transpiration, translocation.",
      syllabus: [
        "Xylem transports water and mineral ions and provides support; phloem transports sucrose and amino acids.",
        "Xylem structure → function: thick walls with lignin, no cell contents, cells joined end to end with no cross walls forming a long continuous tube.",
        "Water pathway: root hair cells → root cortex cells → xylem → mesophyll cells. Root hairs give a large surface area for uptake of water and mineral ions.",
        "Transpiration = the loss of water vapour from leaves. Water evaporates from mesophyll cell surfaces into air spaces, then diffuses out through the stomata.",
        "Transpiration pull: evaporation draws up a column of water molecules in the xylem, held together by forces of attraction between water molecules.",
        "Rate of transpiration rises with higher temperature and higher wind speed, and falls with higher humidity. Wilting occurs when water loss exceeds uptake, cells lose turgor and become flaccid.",
        "Translocation = the movement of sucrose and amino acids in phloem from sources to sinks. Sources release them; sinks use or store them; a part (e.g. a storage organ) can be either at different times of year.",
      ],
    },
    {
      id: "9-transport-animals", num: 9, title: "9. Transport in animals",
      blurb: "Double circulation, the heart, blood vessels, blood components.",
      syllabus: [
        "Circulatory system = blood vessels with a pump and valves to ensure one-way flow. Fish have a single circulation; mammals a double circulation, which keeps blood pressure high so blood flows faster to the tissues.",
        "Heart structures: muscular wall, septum, left and right ventricles, left and right atria, atrioventricular and semilunar valves, coronary arteries. The left ventricle wall is thicker because it pumps blood to the whole body at higher pressure.",
        "Septum keeps oxygenated and deoxygenated blood separate. Atria contract to push blood into ventricles; ventricles contract and valves prevent backflow.",
        "Coronary heart disease: blockage of the coronary arteries. Risk factors: diet, lack of exercise, stress, smoking, genetic predisposition, age and sex.",
        "Vessels: arteries have thick muscular/elastic walls and narrow lumen (high pressure); veins have thin walls, wide lumen and valves (low pressure); capillaries are one cell thick with permeable walls for exchange.",
        "Named vessels: vena cava, aorta, pulmonary artery and vein, renal artery and vein, hepatic artery, hepatic vein, hepatic portal vein.",
        "Blood: red blood cells (haemoglobin, transport oxygen), white blood cells (lymphocytes make antibodies, phagocytes engulf pathogens by phagocytosis), platelets (clotting), plasma (transports blood cells, ions, nutrients, urea, hormones, carbon dioxide).",
        "Clotting converts fibrinogen to fibrin to form a mesh, preventing blood loss and the entry of pathogens.",
      ],
    },
    {
      id: "10-diseases-immunity", num: 10, title: "10. Diseases and immunity",
      blurb: "Pathogens, body defences, antibodies, vaccination, cholera.",
      syllabus: [
        "Pathogen = a disease-causing organism. Transmissible disease = a disease in which the pathogen can be passed from one host to another — directly (blood, body fluids) or indirectly (contaminated surfaces, food, animals, air).",
        "Body defences: skin, hairs in the nose, mucus, stomach acid, white blood cells. Spread is controlled by clean water supply, hygienic food preparation, good personal hygiene, waste disposal and sewage treatment.",
        "Each pathogen has its own antigens with specific shapes. Antibodies are proteins that bind to antigens, leading to direct destruction of pathogens or marking them for destruction by phagocytes. Specific antibodies have complementary shapes that fit specific antigens.",
        "Active immunity = defence against a pathogen by antibody production in the body — gained after infection or by vaccination.",
        "Vaccination: weakened pathogens or their antigens are put into the body → antigens stimulate lymphocytes to produce antibodies → memory cells are produced giving long-term immunity.",
        "Passive immunity = a short-term defence against a pathogen by antibodies acquired from another individual, including across the placenta and in breast milk. No memory cells are produced.",
        "Cholera: caused by a bacterium transmitted in contaminated water. Its toxin causes secretion of chloride ions into the small intestine → osmotic movement of water into the gut → diarrhoea, dehydration and loss of ions from the blood.",
      ],
    },
    {
      id: "11-gas-exchange", num: 11, title: "11. Gas exchange in humans",
      blurb: "Breathing system, ventilation mechanism, inspired vs expired air.",
      syllabus: [
        "Features of a gas exchange surface: large surface area, thin surface, good blood supply, good ventilation with air.",
        "Parts: lungs, diaphragm, ribs, internal and external intercostal muscles, larynx, trachea, bronchi, bronchioles, alveoli and associated capillaries. Cartilage keeps the trachea open.",
        "Inspiration: external intercostal muscles contract and diaphragm contracts/flattens → thorax volume increases → pressure falls below atmospheric → air moves in. Expiration is the reverse.",
        "Inspired vs expired air: expired air has less oxygen, more carbon dioxide and more water vapour. Limewater turns milky faster with expired air.",
        "During exercise, increased carbon dioxide concentration in the blood is detected by the brain, leading to an increased rate and greater depth of breathing.",
        "Goblet cells secrete mucus that traps pathogens and particles; ciliated cells sweep the mucus away from the lungs.",
      ],
    },
    {
      id: "12-respiration", num: 12, title: "12. Respiration",
      blurb: "Uses of energy, aerobic and anaerobic respiration, oxygen debt.",
      syllabus: [
        "Uses of energy: muscle contraction, protein synthesis, cell division, active transport, growth, passage of nerve impulses, maintenance of a constant body temperature.",
        "Aerobic respiration = the chemical reactions in cells that use oxygen to break down nutrient molecules to release energy. Word: glucose + oxygen → carbon dioxide + water. Symbol: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O.",
        "Anaerobic respiration = the chemical reactions in cells that break down nutrient molecules to release energy without using oxygen. It releases much less energy per glucose molecule than aerobic respiration.",
        "In yeast: glucose → alcohol + carbon dioxide, i.e. C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. In muscles during vigorous exercise: glucose → lactic acid.",
        "Lactic acid builds up in muscles and blood during vigorous exercise, causing an oxygen debt.",
        "Removing the oxygen debt: heart rate stays fast to carry lactic acid from muscles to the liver; breathing stays deeper and faster to supply oxygen; lactic acid is respired aerobically in the liver.",
      ],
    },
    {
      id: "13-excretion", num: 13, title: "13. Excretion in humans",
      blurb: "Kidneys, nephron, urea formation in the liver.",
      syllabus: [
        "Carbon dioxide is excreted through the lungs; the kidneys excrete urea and excess water and ions.",
        "Identify kidneys, ureters, bladder and urethra; within the kidney, the cortex and medulla.",
        "Nephron: the glomerulus filters water, glucose, urea and ions from the blood.",
        "The nephron reabsorbs all of the glucose, some of the ions and most of the water back into the blood; urine formed contains urea, excess water and excess ions.",
        "The liver assimilates amino acids by converting them to proteins; excess amino acids are deaminated.",
        "Deamination = the removal of the nitrogen-containing part of amino acids to form urea. Excretion matters because urea is toxic.",
      ],
    },
    {
      id: "14-coordination", num: 14, title: "14. Coordination and response",
      blurb: "Nervous system, eye, hormones, homeostasis, tropisms.",
      syllabus: [
        "CNS = brain and spinal cord; PNS = nerves outside them. Reflex arc: receptor → sensory neurone → relay neurone → motor neurone → effector. A reflex action automatically and rapidly coordinates stimuli with responses of effectors (muscles and glands).",
        "Synapse = a junction between two neurones. An impulse triggers release of neurotransmitter from vesicles into the synaptic gap; it diffuses across and binds to receptor proteins on the next neurone, stimulating an impulse there. Synapses ensure impulses travel in one direction only.",
        "Eye: cornea refracts light, iris controls how much light enters the pupil, lens focuses light on the retina, retina contains light receptors, optic nerve carries impulses to the brain. Pupil reflex uses antagonistic circular and radial muscles.",
        "Accommodation: for near objects the ciliary muscles contract, suspensory ligaments slacken, the lens becomes fatter and refracts light more. Rods give greater sensitivity for night vision; three kinds of cones give colour vision; cones are concentrated at the fovea.",
        "Hormone = a chemical substance, produced by a gland and carried by the blood, which alters the activity of one or more specific target organs. Adrenal glands → adrenaline; pancreas → insulin (and glucagon); testes → testosterone; ovaries → oestrogen.",
        "Nervous vs hormonal control: nervous is fast and short-lasting; hormonal is slower and longer-lasting.",
        "Homeostasis = the maintenance of a constant internal environment, controlled by negative feedback about a set point. Insulin decreases blood glucose concentration; glucagon raises it; the liver stores and releases glycogen. Type 1 diabetes is treated with insulin (plus diet and exercise management).",
        "Temperature control: insulation, sweating, shivering, the role of the brain, and vasodilation/vasoconstriction of arterioles supplying skin surface capillaries.",
        "Gravitropism and phototropism: auxin is made in the shoot tip, diffuses down, is unequally distributed in response to light and gravity, and stimulates cell elongation.",
      ],
    },
    {
      id: "15-drugs", num: 15, title: "15. Drugs",
      blurb: "Definition of a drug, antibiotics and antibiotic resistance.",
      syllabus: [
        "Drug = any substance taken into the body that modifies or affects chemical reactions in the body.",
        "Antibiotics are used for the treatment of bacterial infections.",
        "Antibiotics kill bacteria but do not affect viruses — viruses have no metabolism or cell structures for antibiotics to target.",
        "Some bacteria are resistant to antibiotics, which reduces the effectiveness of antibiotics.",
        "Using antibiotics only when essential limits the development of resistant bacteria such as MRSA, because fewer resistant bacteria are selected for.",
      ],
    },
    {
      id: "16-reproduction", num: 16, title: "16. Reproduction",
      blurb: "Asexual and sexual reproduction, flowers, human reproduction, hormones, STIs.",
      syllabus: [
        "Asexual reproduction = a process resulting in the production of genetically identical offspring from one parent. Sexual reproduction = a process involving the fusion of the nuclei of two gametes to form a zygote and the production of offspring that are genetically different from each other. Fertilisation = the fusion of the nuclei of gametes.",
        "Gamete nuclei are haploid; a zygote nucleus is diploid. Know the advantages/disadvantages of each type of reproduction, both in the wild and for crop production.",
        "Insect-pollinated flower parts: sepals, petals, stamens (filament, anther), carpels (style, stigma, ovary, ovules). Compare insect- and wind-pollinated flowers, including pollen grains.",
        "Pollination = the transfer of pollen grains from an anther to a stigma. Self-pollination is within the same flower or another flower on the same plant; cross-pollination is to a flower on a different plant of the same species. Fertilisation occurs when a pollen nucleus fuses with a nucleus in an ovule, after the pollen tube grows into the ovule.",
        "Germination requires water, oxygen and a suitable temperature.",
        "Human systems: testes, scrotum, sperm ducts, prostate gland, urethra, penis; ovaries, oviducts, uterus, cervix, vagina. Sperm adaptations: flagellum, mitochondria, enzymes in the acrosome. Egg adaptations: energy stores and a jelly coat that changes at fertilisation.",
        "Placenta and umbilical cord exchange dissolved nutrients, gases and excretory products between the blood of the mother and the blood of the fetus; some pathogens and toxins can cross the placenta.",
        "Menstrual cycle controlled by FSH, LH, oestrogen and progesterone; know the sites of production in the cycle and in pregnancy. Testosterone and oestrogen control secondary sexual characteristics at puberty.",
        "STI = an infection that is transmitted through sexual contact. HIV is a pathogen causing an STI, and HIV infection may lead to AIDS.",
      ],
    },
    {
      id: "17-inheritance", num: 17, title: "17. Inheritance",
      blurb: "Genes and proteins, mitosis, meiosis, monohybrid crosses, codominance, sex linkage.",
      syllabus: [
        "Gene = a length of DNA that codes for a protein. Allele = an alternative form of a gene. Sex is inherited via X and Y chromosomes (XX female, XY male).",
        "The sequence of bases in a gene determines the sequence of amino acids in a protein; different amino acid sequences give different protein shapes. DNA controls cell function by controlling production of proteins including enzymes, membrane carriers and receptors.",
        "Protein synthesis: the gene stays in the nucleus; mRNA is a copy of a gene, made in the nucleus and moving to the cytoplasm; mRNA passes through ribosomes, which assemble amino acids into protein. Most body cells contain the same genes but only express the ones they need.",
        "Haploid nucleus = a nucleus containing a single set of chromosomes. Diploid nucleus = a nucleus containing two sets. Human diploid cells have 23 pairs.",
        "Mitosis = nuclear division giving rise to genetically identical cells; used in growth, repair, replacement of cells and asexual reproduction. Chromosomes are exactly replicated before mitosis. Stem cells are unspecialised cells that divide by mitosis to produce cells that can become specialised.",
        "Meiosis = a reduction division in which the chromosome number is halved from diploid to haploid, resulting in genetically different cells; it produces gametes.",
        "Genotype = the genetic make-up of an organism in terms of the alleles present. Phenotype = the observable features. Homozygous = two identical alleles of a gene (pure-breeding); heterozygous = two different alleles (not pure-breeding).",
        "Dominant allele = expressed if it is present in the genotype. Recessive allele = only expressed when there is no dominant allele of that gene present.",
        "Use Punnett squares and genetic diagrams for monohybrid crosses (1 : 1 and 3 : 1 ratios), interpret pedigree diagrams, and use a test cross to identify an unknown genotype.",
        "Codominance = a situation in which both alleles in heterozygous organisms contribute to the phenotype — ABO blood groups, phenotypes A, B, AB and O from alleles Iᴬ, Iᴮ and Iᴼ.",
        "Sex-linked characteristic = a feature in which the gene responsible is located on a sex chromosome, making it more common in one sex than the other; red-green colour blindness is the required example.",
      ],
    },
    {
      id: "18-variation-selection", num: 18, title: "18. Variation and selection",
      blurb: "Continuous and discontinuous variation, mutation, adaptation, natural and artificial selection.",
      syllabus: [
        "Variation = differences between individuals of the same species. Continuous variation gives a range of phenotypes between two extremes (body length, body mass); discontinuous variation gives a limited number of phenotypes with no intermediates (ABO blood groups, seed shape and seed colour in peas).",
        "Discontinuous variation is usually caused by genes only; continuous variation is caused by both genes and the environment.",
        "Mutation = genetic change; it is the way new alleles are formed. Gene mutation = a random change in the base sequence of DNA. Ionising radiation and some chemicals increase the rate of mutation.",
        "Sources of genetic variation in populations: mutation, meiosis, random mating and random fertilisation.",
        "Adaptive feature = an inherited feature that helps an organism to survive and reproduce in its environment. Explain the adaptive features of hydrophytes and xerophytes.",
        "Natural selection: genetic variation within populations → production of many offspring → struggle for survival including competition for resources → individuals better adapted have a greater chance of reproduction → they pass on their alleles to the next generation. Antibiotic-resistant strains of bacteria are the standard example.",
        "Adaptation (as a process) = the process, resulting from natural selection, by which populations become more suited to their environment over many generations.",
        "Selective breeding: humans select individuals with desirable features, cross them, then select offspring showing those features, repeated over many generations. Be ready to contrast natural and artificial selection.",
      ],
    },
    {
      id: "19-organisms-environment", num: 19, title: "19. Organisms and their environment",
      blurb: "Energy flow, food chains and webs, pyramids, nutrient cycles, populations.",
      syllabus: [
        "The Sun is the principal source of energy input to biological systems; energy flows through organisms and is eventually transferred to the environment.",
        "Food chain = shows the transfer of energy from one organism to the next, beginning with a producer. Food web = a network of interconnected food chains.",
        "Producer = an organism that makes its own organic nutrients, usually using energy from sunlight, through photosynthesis. Consumer = an organism that gets its energy by feeding on other organisms. Decomposer = an organism that gets its energy from dead or waste organic material.",
        "Trophic level = the position of an organism in a food chain, food web or ecological pyramid: producers, primary, secondary, tertiary and quaternary consumers.",
        "Draw and interpret pyramids of numbers, biomass and energy. Energy transfer between trophic levels is inefficient (losses in respiration, movement, heat, excretion, uneaten parts), so food chains usually have fewer than five trophic levels and eating crop plants is more energy efficient than eating livestock fed on crops.",
        "Carbon cycle: photosynthesis, respiration, feeding, decomposition, formation of fossil fuels, combustion.",
        "Nitrogen cycle: decomposition of plant and animal protein to ammonium ions, nitrification, nitrogen fixation by lightning and bacteria, absorption of nitrate ions by plants, production of amino acids and proteins, feeding and digestion, deamination, denitrification.",
        "Population = a group of organisms of one species, living in the same area, at the same time. Community = all of the populations of different species in an ecosystem. Ecosystem = a unit containing the community of organisms and their environment, interacting together.",
        "Sigmoid population growth curve: lag, exponential (log), stationary and death phases — explain each with reference to limiting factors such as food supply, competition, predation and disease.",
      ],
    },
    {
      id: "20-human-influences", num: 20, title: "20. Human influences on ecosystems",
      blurb: "Food supply, habitat destruction, pollution, eutrophication, conservation.",
      syllabus: [
        "Increasing food production: agricultural machinery, chemical fertilisers, insecticides, herbicides and selective breeding. Know the advantages and disadvantages of large-scale monocultures and of intensive livestock production.",
        "Biodiversity = the number of different species that live in an area. Habitat destruction is caused by increased area for housing and crop/livestock production, extraction of natural resources, and freshwater and marine pollution.",
        "Deforestation causes reduced biodiversity, extinction, loss of soil, flooding and increased carbon dioxide in the atmosphere.",
        "Eutrophication: increased availability of nitrate and other ions → increased growth of producers → increased decomposition after producers die → increased aerobic respiration by decomposers → reduction in dissolved oxygen → death of organisms requiring dissolved oxygen.",
        "Non-biodegradable plastics damage aquatic and terrestrial ecosystems; methane and carbon dioxide cause the enhanced greenhouse effect and climate change.",
        "Sustainable resource = one which is produced as rapidly as it is removed from the environment so that it does not run out. Forests: education, protected areas, quotas, replanting. Fish stocks: education, closed seasons, protected areas, controlled net types and mesh size, quotas, monitoring.",
        "Species become endangered or extinct through climate change, habitat destruction, hunting, overharvesting, pollution and introduced species. Conservation uses monitoring and protection, education, captive breeding programmes (including AI and IVF) and seed banks.",
        "A small population loses genetic variation, which increases the risk to the species.",
      ],
    },
    {
      id: "21-biotech-gm", num: 21, title: "21. Biotechnology and genetic modification",
      blurb: "Yeast, enzymes in industry, fermenters, recombinant plasmids.",
      syllabus: [
        "Bacteria are useful in biotechnology because of their rapid reproduction rate and ability to make complex molecules, few ethical concerns over their manipulation and growth, and the presence of plasmids.",
        "Anaerobic respiration in yeast produces ethanol for biofuels, and the carbon dioxide that makes bread rise.",
        "Pectinase increases fruit juice yield and clarity; biological washing powders contain enzymes (proteases and lipases) that remove stains at lower temperatures; lactase produces lactose-free milk.",
        "Fermenters produce insulin, penicillin and mycoprotein on a large scale. Conditions controlled: temperature, pH, oxygen, nutrient supply and removal of waste products.",
        "Genetic modification = changing the genetic material of an organism by removing, changing or inserting individual genes.",
        "Making a human protein in bacteria: restriction enzymes cut out the human gene forming sticky ends → the same restriction enzymes cut the bacterial plasmid forming complementary sticky ends → DNA ligase joins them into a recombinant plasmid → the plasmid is inserted into bacteria → the bacteria multiply → the human gene is expressed to make the protein.",
        "Other examples: inserting genes into crop plants for herbicide resistance, insect-pest resistance, or improved nutritional quality. Be ready to discuss advantages and disadvantages of GM crops such as soya, maize and rice.",
      ],
    },
  ],

  flashcards: [
    { term: "Diffusion", def: "The net movement of particles from a region of their higher concentration to a region of their lower concentration (down a concentration gradient), as a result of their random movement." },
    { term: "Osmosis", def: "The net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane." },
    { term: "Active transport", def: "The movement of particles through a cell membrane from a region of lower concentration to a region of higher concentration (against a concentration gradient), using energy from respiration." },
    { term: "Photosynthesis — word equation", def: "carbon dioxide + water → glucose + oxygen, in the presence of light and chlorophyll." },
    { term: "Photosynthesis — symbol equation", def: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (light and chlorophyll required)." },
    { term: "Aerobic respiration — word equation", def: "glucose + oxygen → carbon dioxide + water." },
    { term: "Aerobic respiration — symbol equation", def: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O." },
    { term: "Anaerobic respiration in yeast", def: "glucose → alcohol + carbon dioxide. Symbol: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂." },
    { term: "Anaerobic respiration in muscle", def: "glucose → lactic acid. Releases much less energy per glucose molecule than aerobic respiration." },
    { term: "Food test — starch", def: "Iodine solution. Orange-brown → blue-black if starch is present." },
    { term: "Food test — reducing sugars", def: "Benedict's solution, heated in a water bath. Blue → green/yellow/orange, brick-red if a lot is present." },
    { term: "Food test — protein", def: "Biuret test. Blue → purple (violet) if protein is present." },
    { term: "Food test — fats and oils", def: "Ethanol emulsion test: dissolve in ethanol, then add water. A cloudy white emulsion forms if fat or oil is present." },
    { term: "Food test — vitamin C", def: "DCPIP solution. Blue DCPIP is decolourised (goes colourless) by vitamin C." },
    { term: "Excretion", def: "The removal of the waste products of metabolism and substances in excess of requirements. (Egestion — removing undigested food as faeces — is NOT excretion.)" },
    { term: "Enzyme", def: "A protein that is involved in metabolic reactions, where it functions as a biological catalyst — increasing reaction rate without being changed itself." },
    { term: "Denaturation", def: "A change in the shape of an enzyme's active site (by high temperature or wrong pH) so that the substrate no longer fits. The enzyme is denatured, NOT killed." },
    { term: "Transpiration", def: "The loss of water vapour from leaves. Water evaporates from mesophyll cells into air spaces and diffuses out through the stomata." },
    { term: "Translocation", def: "The movement of sucrose and amino acids in phloem from sources to sinks." },
    { term: "Pathogen", def: "A disease-causing organism. A transmissible disease is one in which the pathogen can be passed from one host to another." },
    { term: "Active immunity", def: "Defence against a pathogen by antibody production in the body, gained after infection or by vaccination. Memory cells give long-term immunity." },
    { term: "Passive immunity", def: "Short-term defence against a pathogen by antibodies acquired from another individual (across the placenta, in breast milk). No memory cells are produced." },
    { term: "Homeostasis", def: "The maintenance of a constant internal environment, controlled by negative feedback about a set point." },
    { term: "Gene / allele", def: "A gene is a length of DNA that codes for a protein. An allele is an alternative form of a gene." },
    { term: "Genotype / phenotype", def: "Genotype = the genetic make-up of an organism in terms of the alleles present. Phenotype = the observable features of an organism." },
    { term: "Homozygous / heterozygous", def: "Homozygous = two identical alleles of a particular gene (pure-breeding). Heterozygous = two different alleles (not pure-breeding)." },
    { term: "Dominant / recessive allele", def: "A dominant allele is expressed if it is present in the genotype. A recessive allele is only expressed when there is no dominant allele of that gene present." },
    { term: "Mitosis / meiosis", def: "Mitosis = nuclear division giving rise to genetically identical cells. Meiosis = reduction division halving the chromosome number from diploid to haploid, giving genetically different cells (gametes)." },
    { term: "Adaptive feature", def: "An inherited feature that helps an organism to survive and reproduce in its environment." },
    { term: "Ecosystem / community / population", def: "Population = organisms of one species in the same area at the same time. Community = all populations of different species in an ecosystem. Ecosystem = the community and its environment, interacting together." },
  ],

  questions: [
    // Topic 1–3
    { id: "ib10-1", topic: "1-characteristics", q: "Which statement is the correct definition of excretion?",
      opts: [
        "The removal of undigested food from the body as faeces",
        "The removal of the waste products of metabolism and substances in excess of requirements",
        "The breakdown of large insoluble molecules into small soluble ones",
        "The taking in of materials for energy, growth and development",
      ],
      a: "The removal of the waste products of metabolism and substances in excess of requirements",
      model: "Excretion is the removal of the waste products of metabolism and substances in excess of requirements. The first option is egestion — undigested food never entered the cells, so it is not a metabolic waste product. The fourth option is nutrition." },

    { id: "ib10-2", topic: "2-organisation", q: "A student views a root hair cell under a microscope. The image of the cell is 78 mm long and the actual cell is 600 μm long. Calculate the magnification.",
      model: "Convert to the same units first: 78 mm = 78 000 μm (×1000).\nmagnification = image size ÷ actual size = 78 000 ÷ 600 = ×130.\n(Equally: 600 μm = 0.6 mm, so 78 ÷ 0.6 = ×130.)\nMagnification has no unit — write it as ×130, not 130 mm." },

    { id: "ib10-3", topic: "3-movement-in-out", q: "Cylinders of potato of equal mass were left for two hours in sucrose solutions of different concentrations. Cylinders in the most dilute solution gained mass; those in the most concentrated solution lost mass. Explain these results.",
      model: "In the dilute solution the water potential outside the cells is higher than inside. Water therefore moves in by osmosis, down the water potential gradient, through the partially permeable cell membrane. The cells become turgid, so the cylinders gain mass.\n\nIn the concentrated solution the water potential outside is lower than inside the cells. Water moves out by osmosis, the cells lose turgor and become flaccid (and may plasmolyse, with the cell membrane pulling away from the cell wall), so the cylinders lose mass.\n\nMark-scheme wording: say 'water potential', not just 'concentration', and always name the partially permeable membrane." },

    // Topic 4–5
    { id: "ib10-4", topic: "4-biological-molecules", q: "A food sample is ground with water and divided into three tubes. Tube A turns blue-black with iodine solution. Tube B stays blue after heating with Benedict's solution. Tube C turns purple with biuret reagent. What does the sample contain?",
      opts: [
        "Starch and protein, but no reducing sugar",
        "Reducing sugar and protein, but no starch",
        "Starch and reducing sugar, but no protein",
        "Protein only",
      ],
      a: "Starch and protein, but no reducing sugar",
      model: "Iodine orange-brown → blue-black means starch is present. Benedict's staying blue after heating means no reducing sugar. Biuret blue → purple means protein is present. Note that Benedict's must be heated in a water bath — an unheated negative result proves nothing." },

    { id: "ib10-5", topic: "5-enzymes", q: "The rate of an enzyme-catalysed reaction rises as temperature increases from 10 °C to 40 °C, then falls sharply to zero at 60 °C. Explain the shape of this curve.",
      model: "From 10 °C to 40 °C: increasing temperature gives enzyme and substrate molecules more kinetic energy, so they move faster and collide more often. This increases the frequency of effective collisions between substrate and active site, so more enzyme–substrate complexes form per second and the rate rises. 40 °C is the optimum temperature.\n\nAbove the optimum: the increased vibration breaks the bonds holding the enzyme's three-dimensional shape. The shape of the active site changes so that it is no longer complementary to the substrate — the enzyme is denatured. Fewer enzyme–substrate complexes form, so the rate falls, reaching zero at 60 °C when all the enzyme molecules are denatured.\n\nNever write 'the enzyme is killed'. Denaturation of the active site is the marking point." },

    // Topic 6
    { id: "ib10-6", topic: "6-plant-nutrition", q: "A graph shows the rate of photosynthesis in a plant increasing with light intensity and then levelling off at a constant value. At the plateau, which factor is definitely NOT limiting the rate?",
      opts: ["Temperature", "Light intensity", "Carbon dioxide concentration", "Chlorophyll concentration"], a: "Light intensity",
      model: "On the plateau, further increases in light intensity produce no increase in rate, so light intensity is no longer the limiting factor. Something else — temperature or carbon dioxide concentration — must now be limiting. A limiting factor is the factor in shortest supply that directly restricts the rate." },

    // Topic 7
    { id: "ib10-7", topic: "7-human-nutrition", q: "Which sequence correctly describes the digestion of starch in a human?",
      opts: [
        "Starch → glucose by amylase in the stomach",
        "Starch → maltose by amylase; maltose → glucose by maltase on the membranes of the small intestine epithelium",
        "Starch → amino acids by protease in the duodenum",
        "Starch → fatty acids and glycerol by lipase in the ileum",
      ],
      a: "Starch → maltose by amylase; maltose → glucose by maltase on the membranes of the small intestine epithelium",
      model: "Amylase (from the salivary glands and pancreas) breaks starch down to maltose. Maltase then breaks maltose to glucose on the membranes of the epithelium lining the small intestine. Amylase does not act in the stomach — the acidic pH denatures it." },

    // Topic 8
    { id: "ib10-8", topic: "8-transport-plants", q: "Explain how water moves from the roots to the leaves of a tall tree.",
      model: "Water evaporates from the surfaces of the mesophyll cells into the air spaces of the leaf and then diffuses out through the stomata as water vapour — transpiration.\n\nThis loss lowers the water potential of the mesophyll cells, so they draw water from neighbouring cells and ultimately from the xylem. The resulting transpiration pull draws up a continuous column of water molecules in the xylem vessels. The column does not break because water molecules are held together by forces of attraction between them.\n\nThe xylem vessels are well suited to this: they have thick walls containing lignin (so they do not collapse under tension), no cell contents, and no cross walls, forming a long continuous tube. Water then enters the root from the soil through the root hair cells by osmosis." },

    // Topic 9–11
    { id: "ib10-9", topic: "9-transport-animals", q: "State two advantages of the double circulation of a mammal over the single circulation of a fish.",
      model: "1. Blood passes through the heart twice per circuit, so it is re-pressurised before being sent to the body. Blood therefore travels to the body organs at higher pressure and flows faster, delivering oxygen and nutrients and removing carbon dioxide more rapidly. This supports a higher metabolic rate.\n\n2. Blood can be sent to the lungs at lower pressure (protecting the delicate capillaries around the alveoli) while still reaching the rest of the body at high pressure.\n\nAlso creditable: the septum keeps oxygenated and deoxygenated blood completely separate, so blood delivered to the tissues is fully oxygenated." },

    { id: "ib10-10", topic: "10-diseases-immunity", q: "Describe how vaccination gives a person long-term immunity to a named disease.",
      model: "Weakened pathogens, or their antigens, are put into the body.\n\nThe antigens have specific shapes. They stimulate an immune response by lymphocytes, which produce antibodies with complementary shapes that fit those specific antigens. The antibodies bind to the antigens, leading to destruction of the pathogens or marking them for destruction by phagocytes.\n\nMemory cells are also produced. If the same pathogen enters the body later, the memory cells recognise its antigens and produce the specific antibody much more quickly and in larger quantities, destroying the pathogen before symptoms develop. This is active immunity, because the antibodies are produced in the person's own body.\n\nIf enough of the population is vaccinated, there are too few susceptible hosts for the pathogen to spread, so unvaccinated people are also protected." },

    { id: "ib10-11", topic: "11-gas-exchange", q: "Which row correctly compares inspired and expired air?",
      opts: [
        "Expired air contains more oxygen, less carbon dioxide and less water vapour",
        "Expired air contains less oxygen, more carbon dioxide and more water vapour",
        "Expired air contains less oxygen, less carbon dioxide and more water vapour",
        "Expired air contains the same oxygen, more carbon dioxide and less water vapour",
      ],
      a: "Expired air contains less oxygen, more carbon dioxide and more water vapour",
      model: "Oxygen diffuses from the alveoli into the blood for respiration, so expired air has less oxygen (about 16% vs 21%). Carbon dioxide produced by respiration diffuses from the blood into the alveoli, so expired air has more (about 4% vs 0.04%). Expired air is also saturated with water vapour evaporated from the moist alveolar surfaces. Limewater turns milky faster with expired air." },

    // Topic 12–13
    { id: "ib10-12", topic: "12-respiration", q: "A sprinter's breathing rate and heart rate remain high for several minutes after finishing a 400 m race. Explain why.",
      model: "During the race the muscles could not receive oxygen fast enough, so they respired anaerobically: glucose → lactic acid. Lactic acid built up in the muscles and blood, creating an oxygen debt — the volume of oxygen needed to break the lactic acid down.\n\nAfter the race:\n• The heart rate stays fast to transport the lactic acid in the blood from the muscles to the liver.\n• Breathing stays deeper and faster to supply the extra oxygen needed.\n• The lactic acid is respired aerobically in the liver, which removes it and repays the oxygen debt.\n\nOnce the lactic acid has been removed, heart rate and breathing rate return to normal." },

    { id: "ib10-13", topic: "13-excretion", q: "Glucose is present in the fluid inside the glomerular capsule of a healthy person, but absent from their urine. Explain why.",
      model: "In the glomerulus, blood is filtered under high pressure. Small molecules — water, glucose, urea and ions — pass out of the blood into the capsule, so glucose is present in the filtrate. (Large molecules such as proteins and blood cells are too big to be filtered.)\n\nAs the filtrate flows along the nephron, all of the glucose is reabsorbed back into the blood in the surrounding capillaries, along with some of the ions and most of the water. Because reabsorption of glucose is complete in a healthy person, no glucose remains by the time urine is formed. The urine therefore contains urea, excess water and excess ions only.\n\n(Glucose appears in the urine of an untreated Type 1 diabetic because the blood glucose concentration is so high that not all of it can be reabsorbed.)" },

    // Topic 14–15
    { id: "ib10-14", topic: "14-coordination", q: "Describe how an electrical impulse is transmitted from one neurone to the next at a synapse.",
      model: "The impulse arrives at the end of the first neurone and stimulates the release of neurotransmitter molecules from vesicles into the synaptic gap.\n\nThe neurotransmitter molecules diffuse across the gap.\n\nThey bind with receptor proteins on the membrane of the next neurone. The receptor proteins have a complementary shape to the neurotransmitter.\n\nThis stimulates a new impulse in the next neurone.\n\nBecause the vesicles of neurotransmitter are only on one side and the receptor proteins only on the other, synapses ensure that impulses travel in one direction only." },

    { id: "ib10-15", topic: "15-drugs", q: "A doctor refuses to prescribe an antibiotic to a patient with a common cold. Suggest two reasons for this decision.",
      model: "1. A cold is caused by a virus. Antibiotics kill bacteria but do not affect viruses, so the antibiotic would have no effect on the patient's illness.\n\n2. Unnecessary use of antibiotics increases the selection pressure on bacteria in and on the patient. Any bacteria carrying an allele for resistance (produced by random mutation) survive and reproduce, passing on that allele, while non-resistant bacteria are killed. Over time the proportion of resistant bacteria increases, producing strains such as MRSA that are much harder to treat. Using antibiotics only when essential limits the development of resistant bacteria." },

    // Topic 16
    { id: "ib10-16", topic: "16-reproduction", q: "A grower increases a strawberry crop by pegging down runners from one high-yielding plant, so that every new plant is produced from that single parent. Which statement is a disadvantage of producing the crop in this way?",
      opts: [
        "The offspring plants will not have the high-yielding feature of the parent",
        "The offspring plants show no genetic variation, so one new disease or pest could destroy the whole crop",
        "The offspring plants cannot photosynthesise until they are separated from the parent",
        "The offspring plants need insect pollinators before they will grow",
      ],
      a: "The offspring plants show no genetic variation, so one new disease or pest could destroy the whole crop",
      model: "Propagation by runners is asexual reproduction: a process resulting in the production of genetically identical offspring from one parent. Because the offspring are genetically identical, they all have the same susceptibility, so a single new pathogen or pest to which the parent is not resistant could wipe out the entire crop. There is also no variation for the grower (or natural selection) to work with if conditions change.\n\nThe advantages, for contrast: the desirable high-yielding features are reliably passed on, reproduction is fast, only one parent is needed, and no pollinator is required." },

    // Topic 17 — the worked monohybrid cross
    { id: "ib10-17", topic: "17-inheritance", q: "In a species of garden pea, the allele for purple flowers is dominant to the allele for white flowers. A pure-breeding purple-flowered plant is crossed with a white-flowered plant. All the offspring (F1) have purple flowers. Two F1 plants are then crossed together. Use a genetic diagram to predict the genotypes, phenotypes and phenotypic ratio of the F2 generation, and explain why all the F1 plants were purple.",
      model: "Key:  R = allele for purple flowers (dominant)\n      r = allele for white flowers (recessive)\n\nSTEP 1 — the first cross (parents → F1)\nPure-breeding purple is homozygous dominant, RR. White is only expressed when no dominant allele is present, so white must be homozygous recessive, rr.\n\n  Parental phenotypes:   purple      ×      white\n  Parental genotypes:      RR        ×       rr\n  Gametes:               all (R)     ×     all (r)\n\n  Every offspring receives R from one parent and r from the other, so all F1 are Rr.\n  Rr is heterozygous, and R is dominant — a dominant allele is expressed if it is present in the genotype. That is why every F1 plant has purple flowers even though it carries the white allele.\n\nSTEP 2 — the second cross (F1 × F1)\n  Parental phenotypes:  purple       ×      purple\n  Parental genotypes:     Rr         ×        Rr\n  Gametes:              (R) or (r)   ×    (R) or (r)\n\nPunnett square:\n\n              gametes from parent 2\n                   R           r\n            +-----------+-----------+\n         R  |    RR     |    Rr     |\n            |  purple   |  purple   |\n gametes    +-----------+-----------+\n from       |    Rr     |    rr     |\n parent 1 r |  purple   |   white   |\n            +-----------+-----------+\n\nF2 genotypes:   1 RR : 2 Rr : 1 rr\nF2 phenotypes:  3 purple-flowered : 1 white-flowered\nPhenotypic ratio = 3 : 1\n\nMarking points examiners look for: define your symbols (use the same letter in upper and lower case, never two different letters); label parental genotypes AND gametes; circle or bracket the gametes; give the ratio in the order asked. State that the ratio is a probability — actual numbers in a real cross vary because fertilisation is random." },

    { id: "ib10-18", topic: "17-inheritance", q: "Red-green colour blindness is caused by a recessive allele carried on the X chromosome. A woman with normal vision whose father was colour blind has children with a man who has normal vision. What is the probability that a son will be colour blind?",
      opts: ["0", "1 in 4", "1 in 2", "All sons"], a: "1 in 2",
      model: "Key: Xᴮ = normal vision allele, Xᵇ = colour blindness allele (both on the X chromosome; the Y carries neither).\n\nThe woman's father was colour blind (XᵇY), so he passed his only X — carrying Xᵇ — to his daughter. She has normal vision, so her other X must be Xᴮ. She is a carrier: XᴮXᵇ. The father has normal vision: XᴮY.\n\nCross XᴮXᵇ × XᴮY → offspring XᴮXᴮ, XᴮXᵇ, XᴮY, XᵇY.\n\nSo of the sons, XᴮY has normal vision and XᵇY is colour blind — a probability of 1 in 2 (50%) for any given son. (Across all children the probability is 1 in 4.) This is why sex-linked characteristics are more common in males: a male has only one X, so a single recessive allele is expressed, with no second X to mask it." },

    // Topic 18–21
    { id: "ib10-19", topic: "18-variation-selection", q: "Which is an example of discontinuous variation in humans?",
      opts: ["Body mass", "Height", "ABO blood group", "Skin colour"], a: "ABO blood group",
      model: "Discontinuous variation gives a limited number of phenotypes with no intermediates and is usually caused by genes only — ABO blood groups are A, B, AB or O with nothing in between. Body mass, height and skin colour show continuous variation: a range of phenotypes between two extremes, caused by both genes and the environment." },

    { id: "ib10-20", topic: "19-organisms-environment", q: "A food chain in a lake is: microscopic algae → water fleas → small fish → heron. Explain, in terms of energy, why this food chain does not continue to a fifth trophic level.",
      model: "Only a small proportion of the energy at one trophic level is transferred to the next — typically around 10%.\n\nEnergy is lost between levels because:\n• much of the organism at one level is not eaten (roots, bones, feathers) or is not digested and is egested in faeces;\n• a large amount of the energy taken in is released by respiration and eventually transferred to the environment as heat;\n• energy is used for movement, and lost in excretory products such as urea.\n\nSo the energy available falls sharply at each step. By the fourth trophic level (the heron) so little energy remains that it could not support a population of predators large enough to find, catch and feed on herons — the energy intake would not cover the energy they spent hunting. This is why food chains usually have fewer than five trophic levels.\n\nThe same argument explains why it is more energy efficient for humans to eat crop plants directly than to eat livestock fed on those crops — eating at a lower trophic level avoids one round of energy loss." },

    { id: "ib10-21", topic: "20-human-influences", q: "Fertiliser washed from a field into a lake is followed, weeks later, by large numbers of dead fish. Explain how the fertiliser caused the deaths.",
      model: "This is eutrophication:\n\n1. The fertiliser increases the availability of nitrate and other ions in the water.\n2. This causes increased growth of producers — algae and water plants — often forming a surface bloom that blocks light from plants below, which then die.\n3. When the producers die, there is increased decomposition by decomposers (bacteria and fungi), whose populations rise rapidly.\n4. The decomposers carry out increased aerobic respiration, which uses oxygen.\n5. This causes a reduction in the concentration of dissolved oxygen in the water.\n6. Organisms that require dissolved oxygen, such as fish, cannot respire aerobically and die.\n\nWrite it as a numbered chain — examiners award marks for the sequence, and skipping the decomposer respiration step loses the key mark." },

    { id: "ib10-22", topic: "21-biotech-gm", q: "Outline how bacteria can be genetically modified to produce human insulin.",
      model: "1. Restriction enzymes are used to cut out (isolate) the DNA making up the human insulin gene. The cut leaves short single-stranded sections called sticky ends.\n2. A bacterial plasmid is cut with the same restriction enzymes, so it has complementary sticky ends.\n3. The human gene is inserted into the plasmid and DNA ligase joins the sticky ends together, forming a recombinant plasmid.\n4. The recombinant plasmids are inserted into bacteria.\n5. The bacteria multiply rapidly, so the number of bacteria containing the recombinant plasmid increases.\n6. The bacteria express the human gene, making human insulin, which is extracted and purified.\n\nThe bacteria are grown in a fermenter in which temperature, pH, oxygen, nutrient supply and waste products are controlled to maximise yield." },
  ],

  mistakes: [
    { mistake: "Defining osmosis as 'water moving from high concentration to low concentration'.", fix: "Use the syllabus wording: the net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane. 'Higher water potential' and 'partially permeable' are both marking points." },
    { mistake: "Writing that an enzyme is 'killed' at high temperature.", fix: "Enzymes are molecules, not organisms. Say the enzyme is denatured: the shape of the active site changes, so the substrate no longer fits and no enzyme–substrate complexes form." },
    { mistake: "Anthropomorphising — 'the plant wants more light', 'bacteria decide to become resistant', 'the cell tries to get water in'.", fix: "Rewrite with a mechanism. Not 'bacteria become resistant because they need to survive' but: a random mutation produces a resistant allele; bacteria with it survive the antibiotic, reproduce and pass the allele on." },
    { mistake: "Using 'respiration' to mean breathing.", fix: "Respiration is the chemical reactions in cells that break down nutrient molecules to release energy. Breathing is ventilation — moving air in and out of the lungs. Gas exchange is diffusion at the alveoli. Three different words, three different meanings." },
    { mistake: "Confusing excretion with egestion.", fix: "Excretion = removal of waste products of metabolism and substances in excess of requirements (urea, carbon dioxide). Egestion = removal of undigested food as faeces — that material never entered the cells, so it is not excretion." },
    { mistake: "Reporting a food test without the colour change or the method.", fix: "State reagent, method and the colour change from-and-to. Benedict's must be heated in a water bath: blue → green/yellow/orange/brick-red. Biuret: blue → purple. Iodine: orange-brown → blue-black. 'It goes red' scores nothing." },
    { mistake: "In genetic diagrams, inventing symbols like T and w, or omitting the gametes.", fix: "Use one letter in two cases (T and t). Always show: key for the alleles → parental phenotypes → parental genotypes → gametes → Punnett square → offspring genotypes → phenotypes → ratio. Missing gamete lines lose marks even when the final ratio is right." },
    { mistake: "Saying 'organisms adapt to their environment' when explaining natural selection.", fix: "Individuals do not adapt during their lives. There is genetic variation in the population; individuals that are better adapted have a greater chance of survival and reproduction, and pass their alleles to the next generation, so the proportion of those alleles increases over generations." },
    { mistake: "Stating that arteries always carry oxygenated blood and veins deoxygenated blood.", fix: "Define by direction, not oxygenation: arteries carry blood away from the heart, veins towards it. The pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood." },
    { mistake: "Answering an 'Explain' question with a list of descriptive facts.", fix: "Explain means give the reason or mechanism — say why or how. If your sentence has no 'because', 'so that' or 'this causes', you have probably only described. Similarly, 'State' wants one clean line, not a paragraph." },
    { mistake: "Giving an unbalanced or condition-free photosynthesis equation.", fix: "Word: carbon dioxide + water → glucose + oxygen, in the presence of light and chlorophyll. Symbol: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Check the balancing — the 6s are marking points." },
    { mistake: "Claiming antibiotics can be used to treat colds, flu or HIV.", fix: "Antibiotics kill bacteria but do not affect viruses. Prescribing them for a viral infection is useless and increases selection for resistant bacteria." },
  ],

  cheat: [
    {
      heading: "The equations — write these out before you read question 1",
      bullets: [
        "Photosynthesis (word): carbon dioxide + water → glucose + oxygen, in the presence of light and chlorophyll.",
        "Photosynthesis (symbol): 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
        "Aerobic respiration (word): glucose + oxygen → carbon dioxide + water.",
        "Aerobic respiration (symbol): C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O.",
        "Anaerobic respiration in yeast: glucose → alcohol + carbon dioxide · C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂.",
        "Anaerobic respiration in muscle: glucose → lactic acid. Much less energy released per glucose molecule.",
      ],
    },
    {
      heading: "The five food tests — reagent, method, colour change",
      bullets: [
        "Starch: add iodine solution. Orange-brown → blue-black.",
        "Reducing sugar: add Benedict's solution, heat in a water bath. Blue → green/yellow/orange → brick-red (more sugar = further along).",
        "Protein: add biuret reagent. Blue → purple (violet).",
        "Fats and oils: dissolve sample in ethanol, then pour into water. A cloudy white emulsion forms.",
        "Vitamin C: add the sample drop by drop to blue DCPIP. The DCPIP is decolourised.",
        "Always state a negative result too: 'stays blue' / 'remains orange-brown' / 'no emulsion'.",
      ],
    },
    {
      heading: "The three transport definitions — word for word",
      bullets: [
        "Diffusion: net movement of particles from a region of their higher concentration to a region of their lower concentration (down a concentration gradient), as a result of their random movement. Energy comes from the kinetic energy of the particles.",
        "Osmosis: net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane.",
        "Active transport: movement of particles through a cell membrane from a region of lower concentration to a region of higher concentration (against a concentration gradient), using energy from respiration. Protein carriers do the moving.",
        "Plant cells: turgid (full, pressing on the cell wall) → flaccid (limp) → plasmolysed (membrane pulled away from the wall).",
      ],
    },
    {
      heading: "Genetics — the exact layout that scores full marks",
      bullets: [
        "Line 1 — key: 'Let T = allele for tall (dominant), t = allele for dwarf (recessive)'. One letter, two cases.",
        "Line 2 — parental phenotypes. Line 3 — parental genotypes. Line 4 — gametes, each circled or bracketed.",
        "Line 5 — Punnett square with the two gametes of one parent along the top and the two of the other down the side.",
        "Line 6 — offspring genotypes, then phenotypes, then the ratio. Heterozygous × heterozygous → 3 : 1. Heterozygous × homozygous recessive (a test cross) → 1 : 1.",
        "Vocabulary: genotype = alleles present; phenotype = observable features; homozygous = two identical alleles (pure-breeding); heterozygous = two different alleles; dominant = expressed if present; recessive = only expressed when no dominant allele is present.",
        "Sex linkage: write the alleles as superscripts on the X (XᴮXᵇ, XᵇY). The Y carries no allele — that is why males show the condition more often.",
        "Codominance (ABO blood groups): alleles Iᴬ, Iᴮ, Iᴼ. Iᴬ and Iᴮ are codominant, both contributing to the phenotype (group AB); Iᴼ is recessive to both.",
      ],
    },
    {
      heading: "Definitions Cambridge marks word-for-word",
      bullets: [
        "Movement · respiration · sensitivity · growth · reproduction · excretion · nutrition — the seven characteristics, each with the syllabus phrasing.",
        "Species: a group of organisms that can reproduce to produce fertile offspring.",
        "Enzyme: a protein that functions as a biological catalyst in metabolic reactions. Catalyst: increases the rate of a reaction and is not changed by the reaction.",
        "Homeostasis: the maintenance of a constant internal environment. Hormone: a chemical substance, produced by a gland and carried by the blood, which alters the activity of one or more specific target organs.",
        "Gene: a length of DNA that codes for a protein. Allele: an alternative form of a gene. Adaptive feature: an inherited feature that helps an organism to survive and reproduce in its environment.",
        "Population → community → ecosystem. Producer, consumer, decomposer, trophic level. Biodiversity: the number of different species that live in an area.",
      ],
    },
    {
      heading: "Command words — what each one is asking for",
      bullets: [
        "State / Give — express in clear terms, one line, no explanation needed.",
        "Describe — state the points of a topic; give characteristics and main features. What happens, in order.",
        "Explain — say why and/or how, making relationships clear and supporting with evidence. Look for 'because', 'so that', 'this causes'.",
        "Compare — identify similarities and/or differences. Write comparative sentences ('X has thicker walls than Y'), never two separate lists.",
        "Suggest — apply your knowledge to an unfamiliar situation; several valid answers may exist, so commit to one and justify it.",
        "Calculate / Determine — show the working, then the answer with the correct unit. Outline — main points only. Identify — name or select.",
      ],
    },
    {
      heading: "Paper 4 — structured practice (read the working line by line)",
      bullets: [
        "Q1 · Exercise and respiration: An athlete's blood lactic acid concentration rises during a 400 m sprint and stays high for 8 minutes afterwards. (a) Name the process producing the lactic acid — anaerobic respiration in the muscles. (b) Write its word equation — glucose → lactic acid. (c) Explain why it occurred — oxygen could not be delivered to the muscles fast enough to meet the demand for energy, so glucose was broken down without oxygen. (d) Explain why breathing stays deep and fast afterwards — to supply the oxygen needed to repay the oxygen debt by aerobically respiring the lactic acid, which the blood carries from the muscles to the liver.",
        "Q2 · Osmosis investigation: Potato cylinders of equal mass are left for 2 hours in sucrose solutions from 0.0 to 1.0 mol/dm³, then reweighed and the percentage change in mass calculated. (a) Why is percentage change used rather than change in grams? Because the cylinders are not exactly identical in starting mass, so percentages allow a fair comparison. (b) Explain the mass gain at 0.0 mol/dm³ — the external solution has a higher water potential than the cell contents, so water enters by osmosis and cells become turgid. (c) Explain the mass loss at 1.0 mol/dm³ — the external solution has a lower water potential, so water leaves by osmosis and cells become flaccid or plasmolysed. (d) What does the concentration at which there is no change in mass tell you? At that point the water potential of the solution equals the water potential of the potato cells, so there is no net movement of water.",
        "Q3 · Genetics: In cattle, the allele for a black coat (B) is dominant to the allele for a red coat (b). A black bull is mated with several red cows. Of 40 calves, 19 are black and 21 are red. (a) Deduce the bull's genotype — Bb, heterozygous. (b) Justify it — the red cows are bb, so each calf receives b from its mother; a red calf must be bb, so the bull supplied a b allele, and since the bull is black he must also carry B. (c) Give the expected ratio — Bb × bb gives 1 black : 1 red, matching 19 : 21. (d) Name this type of cross and state its purpose — a test cross, used to identify whether an individual showing the dominant phenotype is homozygous or heterozygous.",
      ],
    },
  ],
};
