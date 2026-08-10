// Cambridge IGCSE Geography 0460 — full syllabus, ten topics plus skills and enquiry.
//
// Verified 2026-08-11 against the official Cambridge syllabus PDF for first
// examination in 2027 ("Cambridge IGCSE Geography 0460 syllabus for 2027, 2028
// and 2029", © Cambridge University Press & Assessment, September 2024,
// https://www.cambridgeinternational.org/Images/718150-2027-2029-syllabus.pdf),
// reached from the 0460 subject page.
//
// IMPORTANT — this pack follows the 2027–2029 syllabus, NOT the older
// three-theme 0460 (Population and settlement / The natural environment /
// Economic development). A learner in Grade 10 during 2026–27 sits the exam in
// 2027, so the revised syllabus is the one that counts. Cambridge's own
// "Changes to this syllabus" page states, verbatim:
//   • "The content has been divided into physical and human geography topics."
//   • "A new topic on climate change has been added."
//   • "The settlement, water, and weather topics have been removed."
//   • "The terms MEDCs and LEDCs have been replaced with HICs, MICs and LICs."
//   • "Case studies have been replaced by detailed specific examples."
//   • "There will no longer be a specific skills paper. Geographical skills will
//     be tested across all components."
// So settlement hierarchy, urban land-use models, the weather-instrument work
// (Stevenson screen, rain gauge…) and the hot desert ecosystem are NOT on this
// syllabus; the Antarctic and tropical rainforest are the two named ecosystems.
// The final cheat section lists the removed topics in case the classroom
// textbook is still the old edition.
//
// Assessment structure, quoted from the syllabus (all candidates take three
// components): Paper 1 Physical Geography, 1 h 45 min, 75 marks, 36% — topics
// 1–5; Paper 2 Human Geography, 1 h 45 min, 75 marks, 36% — topics 6–10; and
// EITHER Component 3 Coursework (60 marks, 28%, one centre-based fieldwork
// assignment of 1800–2200 words) OR Paper 4 Geographical Investigations
// (1 h 30 min, 60 marks, 28%, two compulsory questions). AO weightings for the
// qualification: AO1 knowledge 32%, AO2 skills and analysis 48%, AO3 evaluation
// and decision-making 20%. Papers 1 and 2 each have a compulsory Section A
// question worth 25 marks and two chosen from three in Section B, 25 marks each.
//
// Question stems are original, written in the style of the 0460 specimen
// material — no past-paper or specimen wording is reproduced.
//
// Detailed specific examples: Cambridge deliberately names none ("Named
// detailed specific examples are not included in this syllabus"), so every
// place below is one this pack chose. Each is real and checkable, and the
// detail is kept qualitative wherever a figure could not be confirmed —
// nothing here is an invented statistic. Where a number does appear (Antarctic
// Treaty 1959, Madrid Protocol 1991, Nepal 2015 Mw 7.8, Paris Agreement 2015,
// China's one-child policy 1979–2015, the SDG target year 2030) it is a
// well-established public fact.

import type { ExamPack } from "../exam-pack";

export const IGCSE_GEOGRAPHY_PACK: ExamPack = {
  subjectId: "igcse-geography",
  grade: 10,
  title: "Geography — Full Syllabus · IGCSE",
  context: "Cambridge IGCSE 0460 · 2027–2029 syllabus · Papers 1, 2 & 4",
  highlights: [
    { label: "Syllabus", value: "0460 (from 2027)" },
    { label: "Topics", value: "1 – 10 + skills + enquiry" },
    { label: "Heaviest marks", value: "AO2 skills & analysis — 48%" },
  ],
  pinnedRule: {
    heading: "Name the place, then spend its detail",
    body: "Almost half of every extended answer is thrown away on general answers. If the question says 'refer to a detailed specific example', you must name a real place and then use facts only that place can supply. Not 'a river in Asia flooded and people were affected' but 'the 2018 Kerala floods: an exceptionally heavy south-west monsoon fell on catchments whose reservoirs were already full, so dams across the Periyar and Pamba basins had to release water at the same time; landslides came down off the Western Ghats, Kochi airport closed, and fishing boats were used to evacuate people from Chengannur and Kuttanad.' Build a one-page index of your own named examples — one per topic — and rehearse three specifics for each.",
  },
  reference: {
    label: "Cambridge IGCSE Geography 0460 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-geography-0460/",
  },
  plan: [
    { title: "Walk the ten topics", hint: "1 rivers → 10 resources, 10 min each" },
    { title: "Draw four landform sequences from memory", hint: "Waterfall · oxbow · stack · spit" },
    { title: "Fill in your named-example index", hint: "One place per topic, three facts each" },
    { title: "Do six-figure grid references cold", hint: "Along the corridor, then up the stairs" },
    { title: "Rehearse the enquiry route out loud", hint: "Hypothesis → data → present → analyse → evaluate" },
    { title: "Read the command-word table last", hint: "Describe ≠ explain ≠ evaluate" },
  ],

  topics: [
    {
      id: "1-rivers", paper: 1, num: 1, title: "1. Changing river environments",
      blurb: "Drainage basins, river processes, landforms, flooding and pollution.",
      syllabus: [
        "Characteristics of rivers and drainage basins: long profile, width, depth, velocity, discharge, wetted perimeter, channel, watershed, tributary, confluence, source, mouth; the Bradshaw model of downstream change.",
        "The drainage basin within the water cycle, and the processes that operate in it: precipitation, interception, infiltration, percolation, overland flow, channel flow, throughflow, groundwater flow, transpiration, evaporation, evapotranspiration.",
        "Processes within the river — erosion (hydraulic action, abrasion, attrition, solution), transportation (traction, suspension, saltation, solution) and deposition.",
        "Characteristics and formation of landforms: waterfalls, rapids, gorges, V-shaped valleys, interlocking spurs, potholes, meanders, oxbow lakes, levées, floodplains, deltas.",
        "Opportunities and hazards of living near a river; human and natural causes of flooding and of river pollution; the impacts of each; evaluation of the strategies and techniques used to manage both, including sustainable ones.",
        "Two detailed specific examples are required — one named river flood (causes, impacts, management) and one named polluted river (causes, impacts, management).",
      ],
    },
    {
      id: "2-coasts", paper: 1, num: 2, title: "2. Changing coastal environments",
      blurb: "Waves, erosional and depositional landforms, storms, reefs and defences.",
      syllabus: [
        "Coastal processes: erosion by hydraulic action, corrosion, corrasion and attrition; transportation; deposition; longshore drift. Constructive and destructive waves; wave refraction.",
        "Characteristics and formation of landforms: headlands and bays, cliffs, wave-cut platforms, caves, arches, stacks, stumps, beaches, spits, bars, sand dunes.",
        "Discordant and concordant coastlines — how alternating or parallel bands of hard and soft rock produce each.",
        "Opportunities and hazards of living on the coast; evaluation of hard and soft engineering used against erosion and flooding, including sustainable approaches.",
        "The distribution and impacts of tropical storms (cyclones, hurricanes, typhoons) and the management of their impacts through preparation, planning, protection and prediction.",
        "The global distribution and importance of coral reefs and mangroves, the threats to them and the strategies used to protect them. Two detailed specific examples are required — one coastal area (erosion plus storm protection) and one coral reef.",
      ],
    },
    {
      id: "3-ecosystems", paper: 1, num: 3, title: "3. Changing ecosystems",
      blurb: "The Antarctic and tropical rainforest — climate, adaptation, threats, management.",
      syllabus: [
        "Antarctica: location; the climate — high pressure, high latitude, low angle of the sun, very low temperatures, low precipitation (a polar desert); the features of the ecosystem.",
        "Interrelationships between abiotic and biotic factors in Antarctica, and how flora and fauna adapt to survive (blubber, counter-current circulation, huddling, antifreeze proteins in fish, the krill-based food web).",
        "Threats to Antarctica — resource exploitation, climate change, fishing, tourism — their impacts, and evaluation of management including international agreements and environmental impact surveys. No detailed specific example is required here, because the content already is one place.",
        "Tropical rainforest: global distribution; the equatorial climate — overhead sun, low pressure, convectional rainfall, high and constant temperature, low latitude; the structure of the ecosystem (emergents, canopy, under-canopy, shrub layer, forest floor).",
        "Interrelationships between abiotic and biotic factors in the rainforest and adaptations: buttress roots, drip-tip leaves, lianas, epiphytes, rapid nutrient cycling in a thin soil.",
        "Threats to rainforests — deforestation, logging, road and railway building, cattle ranching, HEP, farming, settlement — their impacts, and evaluation of management. One detailed specific example of a named rainforest country or area is required.",
      ],
    },
    {
      id: "4-tectonics", paper: 1, num: 4, title: "4. Tectonic hazards",
      blurb: "Plate boundaries, earthquakes, volcanoes, impacts and responses.",
      syllabus: [
        "The layers of the Earth — inner core, outer core, mantle, crust, lithosphere; the names and locations of the main plates and how they move.",
        "Types of plate boundary — divergent/constructive, convergent/destructive, convergent/collision, conservative/transform — and the pattern of earthquakes and volcanoes each produces.",
        "The processes at each boundary that cause earthquakes and eruptions; earthquake characteristics: focus, epicentre, seismic waves.",
        "Volcano types (strato-volcano or composite cone, shield, cinder cone), classification as active, dormant or extinct, and features: crater, vent, magma, magma chamber, secondary cone.",
        "Volcanic hazards — lava flows, ash falls, lahars, pyroclastic flows, tephra, toxic gases — and why speed, size, frequency and spread matter. Why people live in areas at risk; the impacts of both hazards; measurement by the moment magnitude scale, Richter scale, Mercalli scale and the volcanic explosivity index (VEI).",
        "Primary and secondary responses; evaluation of monitoring, prediction, protection, planning and technology. Two detailed specific examples are required — one named earthquake and one named volcanic eruption.",
      ],
    },
    {
      id: "5-climate-change", paper: 1, num: 5, title: "5. Climate change",
      blurb: "New topic from 2027 — evidence, causes, impacts, mitigation and adaptation.",
      syllabus: [
        "Evidence of climate change: global temperature records, ice cores, sea-ice positions, historic writing and paintings.",
        "Natural causes: orbital changes (Milankovitch cycles), sunspot activity, volcanic activity.",
        "The human influence on the atmosphere causing the enhanced greenhouse effect — fossil fuel use, deforestation, agriculture.",
        "Present and predicted impacts at a range of scales: rising sea levels, changing global temperature, changed weather patterns, effects on food production.",
        "Responses: the strategies (including national and international agreements) and techniques used to manage the impacts.",
        "Evaluation of MITIGATION (reducing the cause — renewables, carbon capture, afforestation, international agreements) against ADAPTATION (living with the effect — sea walls, drought-tolerant crops, early warning). One detailed specific example of a named country or region is required.",
      ],
    },
    {
      id: "6-populations", paper: 2, num: 6, title: "6. Changing populations",
      blurb: "Growth and decline, population structure and pyramids, international migration.",
      syllabus: [
        "Patterns and trends in global population growth; reasons a country's population grows or declines — fertility rate, birth rate, death rate, natural increase, migration.",
        "Evaluation of the impact of pro-natalist and anti-natalist policies on birth rates.",
        "The demographic transition model: its five stages, and its strengths and limitations (based on the European experience, no migration, no timescale, does not fit every country).",
        "Factors influencing population structure — natural increase and net migration; reading and drawing population pyramids; the causes and impacts of youthful and ageing structures, and an evaluation of those impacts.",
        "Types of migrant — economic migrant, asylum seeker, refugee; push and pull factors; impacts on the migrant, the country of origin and the destination country; evaluation of how international migration is managed.",
        "Two detailed specific examples are required — one named country (reasons for growth or decline plus the impact of a population policy) and one named international migration (origin AND destination country).",
      ],
    },
    {
      id: "7-towns-cities", paper: 2, num: 7, title: "7. Changing towns and cities",
      blurb: "Urban growth, its opportunities and challenges, and how it is managed.",
      syllabus: [
        "Reasons for variations in global urban growth rates; the causes of rapid urban growth in LICs — rural-to-urban migration driven by social, economic, environmental and political factors, plus natural increase.",
        "Opportunities of urban living: culture, housing, services, leisure, consumption, economic development.",
        "Challenges of rapid urban growth: inequality, service provision, housing, employment, transport, waste management, unplanned (informal) settlements.",
        "The impact of urban sprawl on the rural–urban fringe and surrounding areas.",
        "Evaluation of the strategies and techniques used to manage urban growth, including sustainable ones — site-and-service schemes, self-help upgrading, mass transit, brownfield redevelopment, green belts.",
        "One detailed specific example of a named urban area is required, covering causes of growth, the challenges AND opportunities it brought, and how the growth is managed.",
      ],
    },
    {
      id: "8-development", paper: 2, num: 8, title: "8. Development",
      blurb: "Indicators, the development gap, and sustainable development.",
      syllabus: [
        "Social and economic indicators: GNP, GDP, GNI, literacy rate, life expectancy, HDI, infant mortality rate, calorie intake, doctors per person.",
        "Using indicators to compare countries, and evaluating how useful they are — averages hide inequality, data may be out of date or incomplete, single economic measures ignore quality of life. HDI is composite, which is why it is often preferred.",
        "Factors affecting quality of life and standard of living, and the difference between the two.",
        "Reasons for differences in development and for the development gap — social, economic and environmental factors; the current global pattern of LICs, MICs and HICs (0460 no longer uses MEDC/LEDC).",
        "Definitions of sustainable development, and the social, economic and environmental strategies used to pursue it.",
        "Evaluation of strategies to reduce uneven development — trade, international aid (bilateral, multilateral, short-term relief, long-term), debt relief. One detailed specific example of a named LIC or MIC is required.",
      ],
    },
    {
      id: "9-economies", paper: 2, num: 9, title: "9. Changing economies",
      blurb: "Employment structure, industrial location, globalisation, TNCs and tourism.",
      syllabus: [
        "Classification of industry as primary, secondary, tertiary and quaternary; how employment structure changes as a country develops (LIC → MIC → HIC).",
        "Factors influencing industrial location and distribution: land, labour, raw materials, energy, transport, markets, political policies, technology, communications, containerisation.",
        "What globalisation means, its key features, and its impacts on trade, transport, culture, communications and technology.",
        "The role and global organisation of transnational corporations, and an evaluation of their impacts on host countries — jobs, skills and investment against profit repatriation, low wages, weak regulation and vulnerability to closure.",
        "The factors behind the growth of tourism; the Butler model of the tourist area life cycle (exploration, involvement, development, consolidation, stagnation, then rejuvenation or decline) and its strengths and limitations.",
        "The benefits and problems tourism causes at a range of scales, and evaluation of sustainable management. Two detailed specific examples are required — one country or area for globalisation plus a named TNC, and one for tourism.",
      ],
    },
    {
      id: "10-resources", paper: 2, num: 10, title: "10. Resource provision",
      blurb: "Farming systems, food supply and insecurity, energy types and energy security.",
      syllabus: [
        "Farming types — subsistence, commercial, arable, pastoral, mixed — and the newer growing systems named in the syllabus: aeroponics, aquaponics, hydroponics. Farming as a system of inputs → processes → outputs.",
        "Global patterns of calorie intake and why they vary; reasons for changing global food production and consumption; the reasons for and impacts of the globalisation of food supply.",
        "Human and natural factors that reduce food supply; the problems food insecurity causes in countries at different levels of development; the role of food aid, evaluated.",
        "Strategies and techniques used to increase food supply, and evaluation of the management of desertification and soil erosion, including sustainable approaches.",
        "Energy types — renewable (biomass, geothermal, HEP, solar, tidal, wave, wind), non-renewable (coal, gas, oil, nuclear), and fuelwood, which can be either; the advantages and disadvantages of each.",
        "Reasons for rising global energy production and consumption; patterns of energy surplus and deficit and why energy security matters; why the energy mix differs between and within countries. Two detailed specific examples are required — one for food supply and one named country's energy mix.",
      ],
    },
    {
      id: "11-skills", num: 11, title: "11. Geographical skills",
      blurb: "Maps, grid references, cross-sections, graphs and images — now tested in every paper.",
      syllabus: [
        "Cartographic skills: direction, scale, symbols and keys; coordinates, latitude and longitude, four- and six-figure grid references; directions on the 16-point compass and bearings from grid north; measuring and estimating distance and area.",
        "Relief: contour lines, spot heights and gradient; calculating differences in height; interpreting cross-sections and transects. Map scales used include 1 : 25 000 and 1 : 50 000.",
        "Map types you may be handed: atlas, base, choropleth, desire line, distribution, flow line, isoline, route, sphere of influence, sketch, thematic and topographical maps.",
        "Graphs and diagrams to construct and interpret: bar (horizontal, vertical, divided), climate graphs, cross-sections, dispersion, doughnut, flow diagrams, histograms, kite, line, pictograms, pie, population pyramids, proportional symbols, radial, rose charts, scatter graphs with a best-fit line, systems diagrams, triangular graphs, Venn diagrams and flood hydrographs.",
        "GIS and image skills: interpreting ground-level, oblique-aerial, vertical-aerial and satellite images, cartoons and diagrams; reading written sources for bias; suggesting improvements to a technique; recognising both the benefits AND the limitations of GIS.",
        "Mathematical skills: mean, mode, median, range, percentages, ratio and proportion, significant figures; completing and interpreting tables; describing relationships between data sets; interpolating and extrapolating; identifying weaknesses in a statistical presentation. Calculators are allowed in all papers, and you must bring pencil, eraser, ruler, protractor, calculator and a sheet of plain paper for measuring.",
      ],
    },
    {
      id: "12-fieldwork", num: 12, title: "12. Fieldwork & enquiry (Paper 4 / Component 3)",
      blurb: "The route to geographical enquiry — the third component, worth 28%.",
      syllabus: [
        "The seven-stage route to geographical enquiry: (1) identify the issue and design the hypothesis, (2) define objectives — what data, collected how, (3) collect data, (4) select and collate it, (5) present and record results, (6) analyse and interpret, (7) conclude, evaluate and suggest further work.",
        "A hypothesis is a testable statement, not a question — for example 'the CBD has better waste collection than the suburbs'. It must be provable or disprovable by the data you can actually collect, and your conclusion must accept or reject it explicitly.",
        "Collection methods tested: questionnaires (layout, question format and wording, number of questions; sampling method, pilot survey, survey location), observation (land-use recording, field sketches, annotated photographs), counts (pedestrian and traffic, with time, date, location and recorder on the sheet), and measurement.",
        "Sampling: random, systematic and stratified — know one advantage and one disadvantage of each, and why sample size and repeat readings affect reliability.",
        "Equipment and techniques you may be asked to describe: ranging poles, flow meters, stopwatch, quadrats, noise meters, tape measure, clinometer; environmental quality and bi-polar surveys, interviews, transects, land-use surveys, delimiting a CBD or sphere of influence, roundness indices. River work: channel width, depth, velocity, bedload size and shape. Coastal work: beach profile, pebble size and shape, movement of beach material.",
        "Presentation and evaluation: choose the technique that fits the data (scatter graph with best-fit line for a relationship, kite diagram for a transect, rose chart for direction, choropleth for area data), then evaluate honestly — limitations of method, of sample size, of the day chosen, of the equipment, and what you would do differently. Paper 4 is 1 h 30 min, 60 marks, two compulsory questions; Component 3 coursework is one assignment of 1800–2200 words.",
      ],
    },
  ],

  flashcards: [
    { term: "Weathering vs erosion", def: "Weathering is the breakdown of rock IN PLACE, with no movement (freeze–thaw, chemical, biological). Erosion wears rock away AND transports it (hydraulic action, abrasion, attrition, solution). If nothing moves, it is not erosion." },
    { term: "River erosion — four processes", def: "Hydraulic action: the sheer force of water forces air into cracks. Abrasion (corrasion): the load scrapes the bed and banks. Attrition: load particles hit each other and get smaller and rounder. Solution (corrosion): the water dissolves soluble rock." },
    { term: "River transport — four processes", def: "Traction (large rocks rolled along the bed), saltation (pebbles bounced), suspension (fine silt and clay carried in the flow), solution (dissolved minerals). Deposition happens when velocity drops." },
    { term: "Drainage basin store and flow terms", def: "Precipitation, interception, infiltration, percolation, overland flow, throughflow, groundwater flow, channel flow, evaporation, transpiration, evapotranspiration. The watershed is the boundary between two basins." },
    { term: "Bradshaw model", def: "Downstream from source to mouth: discharge, channel width, channel depth, velocity and load quantity all INCREASE; load particle size, channel bed roughness and gradient DECREASE." },
    { term: "Waterfall formation sequence", def: "Hard rock over soft rock → soft rock eroded faster by hydraulic action and abrasion → overhang of hard rock left unsupported → plunge pool deepened by abrasion and swirling water → overhang collapses → waterfall retreats upstream → a steep-sided gorge is left behind." },
    { term: "Oxbow lake formation sequence", def: "Fastest flow on the outer bend erodes a river cliff; deposition on the inner bend builds a slip-off slope → the meander neck narrows → in a flood the river cuts straight through the neck → deposition seals both ends of the old loop → an oxbow lake is left, which later silts up." },
    { term: "Levée and floodplain", def: "In flood the river spills its banks, velocity drops sharply at the edge, so the coarsest material is dropped first right beside the channel, building natural levées; the finer silt spreads across the valley floor as alluvium, building the floodplain." },
    { term: "Flood hydrograph vocabulary", def: "Peak rainfall, peak discharge, lag time (the gap between them), rising limb, falling limb, base flow. Short lag time and high peak = flashy = impermeable rock, steep slopes, urban surfaces, deforestation, saturated soil." },
    { term: "Constructive vs destructive waves", def: "Constructive: low, long wavelength, low frequency, strong swash and weak backwash → material moved up the beach, deposition. Destructive: tall, short wavelength, high frequency, weak swash and strong backwash → material dragged back, erosion." },
    { term: "Longshore drift", def: "Waves approach at an angle to the coast, so swash carries material up the beach at that angle; backwash returns it straight down under gravity. Repeated, this zig-zag moves sediment along the coast — which is why a groyne traps a wider beach on its updrift side." },
    { term: "Cave → arch → stack → stump", def: "Waves attack a crack in a headland by hydraulic action and abrasion → the crack widens into a cave → caves on both sides meet, or a cave is cut right through, forming an arch → the arch roof, unsupported and weathered, collapses → an isolated stack is left → the stack is undercut and collapses to a stump, covered at high tide." },
    { term: "Spit formation sequence", def: "Longshore drift carries sediment along the coast → at a bend or a river mouth the coastline changes direction → sediment is deposited in the sheltered, slower water and builds outward → the end is curved (recurved) by a second wind or wave direction → a salt marsh develops in the sheltered water behind it." },
    { term: "Headlands and bays", def: "A discordant coastline has alternating bands of hard and soft rock at right angles to the sea. Soft rock erodes faster, forming bays with beaches; resistant rock is left projecting as headlands, which then take the wave energy through refraction." },
    { term: "Hard vs soft engineering", def: "Hard: sea walls, groynes, rock armour (rip-rap), gabions, revetments — effective but expensive, ugly and may shift the problem downdrift. Soft: beach nourishment, dune regeneration, managed retreat, mangrove replanting — cheaper and more sustainable but needs maintenance and gives up land." },
    { term: "Plate boundary types", def: "Divergent/constructive: plates move apart, magma rises — mid-ocean ridges, shallow quakes. Convergent/destructive: oceanic plate subducted under continental — deep quakes, explosive strato-volcanoes. Convergent/collision: two continental plates buckle upward — fold mountains and big quakes, no volcanoes. Conservative/transform: plates slide past, no volcanoes, powerful quakes." },
    { term: "Focus vs epicentre", def: "The focus (hypocentre) is the point INSIDE the crust where the rock ruptures and energy is released. The epicentre is the point on the SURFACE directly above it. Shallow focus = more surface damage." },
    { term: "Measuring tectonic events", def: "Moment magnitude scale (Mw) and the older Richter scale measure energy released — logarithmic. The Mercalli scale measures observed intensity of shaking and damage. The Volcanic Explosivity Index (VEI) measures the size of an eruption." },
    { term: "Equatorial climate", def: "Sun overhead or near-overhead all year, low pressure, hot and constant temperature with a very small annual range, high rainfall all year from convectional uplift, typically as an afternoon downpour. High humidity." },
    { term: "Rainforest adaptations", def: "Emergents and canopy compete for light; buttress roots support tall trees in thin soil; drip-tip leaves shed heavy rain; lianas climb rather than build trunks; epiphytes live on branches for light; nutrients cycle rapidly through the litter because rain leaches the soil." },
    { term: "Antarctic climate and adaptations", def: "Permanent high pressure, extreme cold, very low precipitation — a polar desert. Adaptations: blubber and dense feathers, small surface-area-to-volume ratio, huddling, counter-current heat exchange, antifreeze proteins in fish, and a short food chain based on krill." },
    { term: "Mitigation vs adaptation", def: "Mitigation reduces the CAUSE of climate change — renewables, energy efficiency, afforestation, carbon capture, international agreements. Adaptation reduces the EFFECT — sea walls, drought-tolerant crops, early-warning systems, changing planting dates. Good answers evaluate both." },
    { term: "Enhanced greenhouse effect", def: "The natural greenhouse effect keeps Earth warm. Burning fossil fuels, deforestation and agriculture raise greenhouse-gas concentrations, so more outgoing long-wave radiation is trapped and the lower atmosphere warms — the ENHANCED greenhouse effect." },
    { term: "Birth rate, death rate, natural increase", def: "Birth rate = live births per 1000 people per year. Death rate = deaths per 1000 per year. Natural increase = birth rate − death rate (nothing to do with migration). Fertility rate = average number of children per woman." },
    { term: "Demographic transition model — five stages", def: "1 High fluctuating: high BR, high DR, low growth. 2 Early expanding: DR falls (better food, water, medicine), BR stays high, rapid growth. 3 Late expanding: BR falls (contraception, female education, urbanisation), growth slows. 4 Low fluctuating: both low, stable. 5 Declining: BR below DR, population falls." },
    { term: "Reading a population pyramid", def: "Wide base = high birth rate. Narrow base + wide top = ageing. Concave sides = high death rate at all ages. A bite out of one side of the working-age bars = out-migration (or war). Always quote actual bar widths as evidence." },
    { term: "Youthful vs ageing structure", def: "Youthful: high dependency of under-15s, pressure on schools, health care and food, but a future workforce. Ageing: high dependency of over-65s, pension and health-care costs, shrinking workforce and tax base, but experience and 'grey' spending power." },
    { term: "Push and pull factors", def: "Push (origin): unemployment, low wages, drought, conflict, poor services, persecution. Pull (destination): jobs, higher wages, safety, education, health care, family already there. An economic migrant chooses; a refugee is forced and is protected in law; an asylum seeker has applied and is awaiting a decision." },
    { term: "LIC / MIC / HIC", def: "The 2027 syllabus uses low-, middle- and high-income countries and has dropped MEDC/LEDC. The categories are income-based, so a country can sit in different groups depending on whether income or a composite index like HDI is used — say so when you evaluate indicators." },
    { term: "Human Development Index", def: "A composite of life expectancy, education (mean and expected years of schooling) and gross national income per person, scored between 0 and 1. More useful than GNI alone because it captures health and education too — but it is still a national average that hides internal inequality." },
    { term: "Butler model", def: "Tourist area life cycle: exploration → involvement → development → consolidation → stagnation → then either rejuvenation (reinvestment, new attractions) or decline. Limitation: not every resort follows it, and the timescale varies enormously." },
    { term: "Farming as a system", def: "Inputs (physical: rainfall, temperature, relief, soil; human: labour, capital, seed, fertiliser, machinery) → processes (ploughing, sowing, irrigating, weeding, harvesting) → outputs (crops, livestock, profit, and waste). Write it as a systems diagram if asked." },
    { term: "Energy security and the energy mix", def: "Energy security = reliable, affordable access to enough energy. A country in energy deficit imports; a surplus country exports. The mix depends on physical resources, level of development, cost, technology and government policy." },
    { term: "Sampling methods", def: "Random: every point has an equal chance — unbiased but may miss areas. Systematic: every nth point or a fixed interval — even coverage but can hit a repeating pattern. Stratified: sampling in proportion to sub-groups — representative but needs prior knowledge of the population." },
  ],

  questions: [
    // ---- Topic 1: rivers ----
    {
      id: "gg10-1", topic: "1-rivers",
      q: "Explain the formation of a waterfall and the gorge that develops below it. You may draw labelled diagrams. [6]",
      model: "A waterfall forms where a band of harder, more resistant rock lies over softer, less resistant rock in the river bed.\n1. The softer rock downstream is eroded more quickly by hydraulic action and abrasion, so the river bed is lowered there while the hard band is not.\n2. This leaves a step, and the water falls over it. The falling water and the load it carries swirl at the base and erode a deep plunge pool by abrasion and hydraulic action.\n3. Undercutting by the swirling water removes the soft rock behind the fall, leaving an overhang of hard rock that is unsupported.\n4. Weathering weakens the overhang until it collapses under its own weight; the fallen blocks are used as further abrasive load in the plunge pool.\n5. The process repeats, so the waterfall RETREATS UPSTREAM.\n6. The retreat leaves a steep-sided, narrow gorge downstream, marking the path the waterfall has taken.\n\nMark-scheme discipline: the marks are for the sequence and the named processes, not for the list of features. Every stage should say what does the eroding.",
    },
    {
      id: "gg10-2", topic: "1-rivers",
      q: "Two flood hydrographs are drawn for the same storm over two nearby drainage basins. Basin A has a lag time of about 4 hours and a high, sharp peak discharge. Basin B has a lag time of about 14 hours and a low, broad peak. Suggest reasons for the difference. [4]",
      model: "Basin A is 'flashy' — water reaches the channel quickly, so any of:\n• steeper slopes, so overland flow is faster;\n• impermeable rock or already-saturated soil, so little infiltration;\n• sparse vegetation or deforestation, so little interception and less transpiration;\n• urban surfaces — tarmac, concrete and roofs are impermeable, and drains and gutters deliver water to the river directly;\n• a small, circular basin with a dense drainage network, so all tributaries deliver at once.\n\nBasin B has the opposite: gentler slopes, permeable rock allowing infiltration and slow throughflow and groundwater flow, dense vegetation intercepting rainfall, and a rural land use.\n\nWrite it as a comparison — 'in Basin A … whereas in Basin B …' — because the question asks about the DIFFERENCE, and pair each reason with its effect on lag time.",
    },
    {
      id: "gg10-3", topic: "1-rivers",
      q: "Using a detailed specific example, describe the causes and impacts of a river flood and evaluate the strategies used to manage it. [7]",
      model: "Example: the Kerala floods of August 2018, India.\nCauses — natural: an exceptionally heavy south-west monsoon delivered far above-normal rainfall over a short period onto the steep, already-saturated catchments of the Western Ghats, where short, steep rivers such as the Periyar and Pamba respond very quickly.\nCauses — human: reservoirs across the state were close to capacity before the heaviest rain, so many dams had to release water at the same time, adding to the peak downstream; quarrying, construction and the loss of forest and paddy land in the Ghats and in low-lying Kuttanad reduced infiltration and storage.\nImpacts — social: large-scale displacement into relief camps, drowning deaths, and landslides in the hill districts; economic: damage to homes, roads and bridges, closure of Kochi airport, and losses to the rubber, spice and tourism sectors; environmental: silt and debris deposition and contaminated wells.\nManagement, evaluated: emergency evacuation — fishing communities famously took their boats inland to rescue people — plus early warning and relief camps saved lives, which is adaptation rather than prevention. Longer term, coordinated reservoir operating rules and rainfall-triggered release schedules address the specific human trigger and are cheap, but depend on accurate forecasting. Land-use control in the Ghats and restoring wetland storage in Kuttanad is the most sustainable option because it treats the cause, but it is slow and politically difficult where livelihoods depend on quarrying and construction.\n\nEvaluation must reach a judgement — say WHICH strategy you rate highest and why, not just list them.",
    },
    // ---- Topic 2: coasts ----
    {
      id: "gg10-4", topic: "2-coasts",
      q: "Explain the formation of a spit. [6]",
      model: "1. Waves approach the coast at an angle, so swash carries sediment obliquely up the beach and backwash returns it straight down the slope under gravity. Repeated, this zig-zag movement — longshore drift — transports sediment along the coast in one dominant direction.\n2. Where the coastline changes direction abruptly, at a bay or a river mouth, the drift continues out into the open water.\n3. Here the water is deeper and calmer, so the waves lose energy and can no longer carry the load; deposition occurs.\n4. Sediment builds up on the sea bed and eventually above the waterline, extending out from the coast as a long ridge of sand and shingle.\n5. A change in the prevailing wind or a second wave direction curves the far end landwards, forming a recurved (hooked) end.\n6. The water behind the spit is sheltered, so silt is deposited there and a salt marsh or mudflat develops; the spit cannot grow across a river mouth entirely because the river's flow keeps a channel open.\n\nThe sequence and the named process (longshore drift, deposition) carry the marks.",
    },
    {
      id: "gg10-5", topic: "2-coasts",
      q: "A coastal management scheme installs a line of timber groynes along a beach. What is the intended effect, and what is the most common criticism of it?",
      opts: [
        "It absorbs wave energy; the criticism is that it needs constant repainting",
        "It traps sediment moved by longshore drift and widens the beach; the criticism is that beaches further along the coast are starved of sediment",
        "It raises the height of the cliff; the criticism is that it blocks access to the beach",
        "It replaces sand lost by erosion; the criticism is that the sand does not match the original",
      ],
      a: "It traps sediment moved by longshore drift and widens the beach; the criticism is that beaches further along the coast are starved of sediment",
      model: "Groynes are wooden or rock barriers built at right angles to the shore. They interrupt longshore drift, so sediment piles up on the updrift side and the beach there gets wider and higher — a wider beach absorbs wave energy and protects the land behind it.\nThe standard criticism is that the sediment trapped there never arrives downdrift. Beaches further along the coast are starved, narrow, and their cliffs are then attacked more strongly — the problem has been moved, not solved. Groynes are also ugly to some visitors and need maintenance.\n(The last option describes beach nourishment, which is a soft-engineering method.)",
    },
    {
      id: "gg10-6", topic: "2-coasts",
      q: "Using a detailed specific example, evaluate the strategies used to reduce the impacts of tropical storms on a coastal area. [7]",
      model: "Example: the Odisha coast, India, and the response to Cyclone Fani in May 2019.\nPrediction: the India Meteorological Department tracked the system in the Bay of Bengal and issued warnings several days ahead. Accurate track forecasting is what makes everything else possible, but forecasts of intensity are less reliable than forecasts of track.\nPreparation and planning: warnings were pushed out by SMS, television, radio, sirens and public address, and the state ran a mass evacuation of coastal districts into purpose-built concrete cyclone shelters on raised ground before landfall. This is widely regarded as the single most effective measure — Odisha's death toll from Fani was far lower than from the far more deadly super-cyclone that struck the same coast in 1999, and the change is attributed to the shelter network and the evacuation drill rather than to any change in the storms.\nProtection: embankments and sea walls at vulnerable points, plus replanting of mangroves along the Mahanadi delta and Bhitarkanika, which absorb wave energy and reduce storm surge reach — the cheapest and most sustainable option because the mangroves also support fisheries and store carbon.\nEvaluation: evacuation and shelters save lives but do not protect property — the economic damage to housing, power lines and crops was still very large, and power supply took weeks to restore in places. So the strategies are strong on the social impact and weak on the economic one; combining mangrove restoration with stronger building codes and buried power lines would address what evacuation cannot.\n\nNote: quote no casualty or cost figure you cannot verify — the comparison of 1999 with 2019 makes the point without one.",
    },
    // ---- Topic 3: ecosystems ----
    {
      id: "gg10-7", topic: "3-ecosystems",
      q: "Explain how the equatorial climate produces the layered structure of a tropical rainforest. [5]",
      model: "The equatorial climate has the sun overhead or nearly overhead all year, so temperatures are high and vary little; low pressure and intense surface heating drive convectional uplift, giving heavy rainfall throughout the year.\nContinuous heat and moisture mean there is no dry or cold season to stop growth, so plants grow all year and competition is entirely for LIGHT, not water or warmth.\nThat competition sorts the vegetation into layers: a few very tall emergents break through above the rest to reach full sunlight; below them the continuous canopy of interlocking crowns intercepts most of the light and most of the rainfall; the under-canopy holds younger trees waiting for a gap; the shrub layer is sparse because so little light reaches it; and the forest floor is dark, with little ground vegetation.\nThe heavy rain also leaches nutrients from the soil, so nutrients are held mainly in the biomass and cycle rapidly through the leaf litter, which decomposes fast in the heat and humidity. This is why soil fertility collapses within a few years once the trees are cleared.",
    },
    // ---- Topic 4: tectonics ----
    {
      id: "gg10-8", topic: "4-tectonics",
      q: "A world map plots every earthquake of magnitude 6 and above recorded over 30 years as a dot. Describe the pattern the dots make. [4]",
      model: "Describe — do not explain. Give the general pattern, then the anomaly, and use named locations and directions as evidence.\n• The dots are not scattered evenly; they form narrow, continuous linear belts, with very large areas in between almost entirely blank.\n• The densest and widest belt rings the Pacific Ocean, running up the west coast of South and North America, across Alaska and down through Japan, the Philippines and Indonesia to New Zealand.\n• A second belt runs west to east from the Mediterranean through Turkey and Iran into the Himalayas and on into south-east Asia.\n• A narrower, more scattered line runs down the middle of the Atlantic Ocean.\n• Large areas have almost no dots — central Australia, most of Africa, northern Asia, northern Canada and Antarctica.\n• Some dots occur away from the belts, for example in central Asia, so the pattern is strong but not absolute.\n\nIf the question then says 'explain', that is where plate boundaries come in — the belts follow the edges of the tectonic plates, and the Pacific ring is a subduction zone.",
    },
    {
      id: "gg10-9", topic: "4-tectonics",
      q: "At which type of plate boundary would you expect powerful earthquakes and fold mountains but NO volcanoes?",
      opts: [
        "Divergent / constructive",
        "Convergent / destructive (oceanic under continental)",
        "Convergent / collision (continental against continental)",
        "Conservative / transform",
      ],
      a: "Convergent / collision (continental against continental)",
      model: "At a collision boundary two plates of continental crust meet. Continental crust is too thick and too low in density to be subducted, so instead the sediments between the plates are compressed and buckled upwards into fold mountains, and the friction as the plates lock and jolt produces powerful earthquakes. There is no subduction, so no magma is generated and there are no volcanoes.\nThis is the Himalayas — the Indian plate driving into the Eurasian plate — and it is why northern India, Nepal and Bhutan are earthquake country with no volcanoes.\nContrast: a conservative boundary also has quakes and no volcanoes, but no mountain building — the plates slide past each other.",
    },
    {
      id: "gg10-10", topic: "4-tectonics",
      q: "Using a detailed specific example, describe the causes and impacts of an earthquake and evaluate the responses to it. [7]",
      model: "Example: the Gorkha earthquake, Nepal, 25 April 2015, moment magnitude 7.8.\nCause: Nepal lies on the convergent/collision boundary where the Indian plate is driving northwards into the Eurasian plate. Stress built up as the plates locked; when the rock finally ruptured along a shallow thrust fault north-west of Kathmandu, the stored energy was released as seismic waves. The focus was shallow, which is why surface shaking was so severe, and a major aftershock followed on 12 May.\nPrimary impacts: collapse of housing, especially unreinforced brick and stone buildings in Kathmandu and hill villages; destruction of temples and other UNESCO-listed heritage in the Kathmandu Valley; many deaths and injuries.\nSecondary impacts: landslides blocked mountain roads and dammed valleys, cutting off villages and hampering rescue; an avalanche struck Everest base camp; loss of tourism and trekking income in the following season; homelessness through the monsoon that followed.\nResponses — primary (immediate): search and rescue, often by hand and by neighbours before any organised team arrived; field hospitals; international aid teams and helicopters, though the single international airport at Kathmandu and the blocked roads became the bottleneck.\nResponses — secondary (long-term): temporary shelter before the monsoon, rebuilding with earthquake-resistant techniques, and revision of building codes.\nEvaluation: the constraint was not willingness but ACCESS and prior preparedness. Aid arrived, but a mountainous LIC with one international airport, few helicopters and dispersed hill settlements cannot distribute it quickly. That is why the highest-value long-term response is aseismic construction and training local builders — protection and planning work when prediction is impossible, since earthquakes cannot be predicted, only prepared for.",
    },
    // ---- Topic 5: climate change ----
    {
      id: "gg10-11", topic: "5-climate-change",
      q: "'Adaptation is a better response to climate change than mitigation.' Using a detailed specific example, how far do you agree? [7]",
      model: "Example: Bangladesh.\nWhy it is exposed: most of the country is low-lying delta built by the Ganges, Brahmaputra and Meghna, with a dense coastal population, so rising sea level, stronger storm surges from Bay of Bengal cyclones, and saltwater intrusion into farmland and drinking water all hit at once; changed monsoon timing affects rice production.\nAdaptation there: the Cyclone Preparedness Programme's volunteer warning network and raised concrete cyclone shelters; embankments and raised homesteads; salt-tolerant rice varieties and floating gardens; mangrove planting in the Sundarbans as a natural surge barrier; the long-term Bangladesh Delta Plan.\nCase FOR adaptation: Bangladesh contributes a very small share of global emissions, so no mitigation it undertakes alone would measurably change its own risk. Adaptation acts on a timescale that matters to people alive now, and the same shelters and embankments protect against events that would happen anyway.\nCase AGAINST — for mitigation: adaptation has a ceiling. Embankments can be overtopped, and no sea wall answers a metre of sea-level rise; adaptation is a running cost forever, and it is paid by the countries least responsible. Only mitigation — the Paris Agreement of 2015, the shift to renewables, halting deforestation — addresses the cause, and it must be done by the largest emitters.\nJudgement: for Bangladesh specifically, adaptation is the rational priority because it is the only lever the country controls; globally the statement is false, because adaptation without mitigation only postpones the problem. Say which scale you are answering at — that distinction is what earns the AO3 marks.",
    },
    // ---- Topic 6: populations ----
    {
      id: "gg10-12", topic: "6-populations",
      q: "A population pyramid has a very wide base, sides that narrow steeply and evenly with each age band, and a very small apex above 65. Describe what the pyramid shows about this country's population and suggest the likely consequences. [6]",
      model: "Description (quote the shape as evidence):\n• The very wide base shows a high birth rate and a high fertility rate, so there are many children under 15.\n• The steep, even narrowing shows a high death rate operating at every age, so relatively few people survive into middle age; life expectancy is low.\n• The very small apex shows a small elderly population — few people reach 65.\n• Overall the country is youthful and is at an early stage of the demographic transition model, probably stage 2.\n\nConsequences:\n• A high youth dependency ratio — a small working population supports many children, so savings and tax revenue are low.\n• Pressure on schools, teachers, health care, housing, water and food supply now.\n• High future population growth built in, because a large cohort of girls will soon reach childbearing age — this is population momentum, and growth continues even if fertility falls today.\n• Positively, a large future workforce if education and jobs can be provided — a demographic dividend.\n\nBe careful: 'describe' wants the shape; 'suggest' wants the consequences. Answer both parts separately.",
    },
    {
      id: "gg10-13", topic: "6-populations",
      q: "Which is an ANTI-natalist policy?",
      opts: [
        "Paying a cash bonus for a third child",
        "Extending paid parental leave and subsidising childcare",
        "Restricting most families to one child and rewarding those who comply",
        "Recruiting workers from abroad to fill labour shortages",
      ],
      a: "Restricting most families to one child and rewarding those who comply",
      model: "Anti-natalist means designed to REDUCE the birth rate. China's one-child policy, introduced in 1979 and ended in 2015 (replaced by a two-child and then, in 2021, a three-child policy), is the standard example: family-size limits backed by incentives and penalties, alongside contraception and later-marriage campaigns. India's national family planning programme, launched in 1952, was the first such national programme anywhere.\nThe other options are pro-natalist (raising the birth rate) or a migration policy, which changes population size without changing the birth rate.\nWhen you evaluate the one-child policy, take both sides: it coincided with a steep fall in fertility, but so did rising incomes, urbanisation and female education, and it left an ageing structure and a skewed sex ratio.",
    },
    {
      id: "gg10-14", topic: "6-populations",
      q: "Using a named international migration, explain the push and pull factors and the impacts on the country of origin. [6]",
      model: "Example: labour migration from Kerala, India, to the Gulf states — chiefly the United Arab Emirates, Saudi Arabia, Oman and Qatar.\nPush factors from Kerala: limited industrial employment for a highly literate workforce, so educated young people face unemployment or underemployment at home; low local wages relative to what is available abroad.\nPull factors to the Gulf: the oil economies' long construction and services boom created large demand for labour at wages far above Kerala levels; recruitment networks and existing family and community contacts lower the risk of going; short flights and established remittance channels make it easy; no language barrier for the many jobs conducted in English.\nImpacts on Kerala (origin) — positive: remittances are a major part of the state economy, funding housing, education and consumption; returning migrants bring skills and savings that start small businesses.\nImpacts on Kerala — negative: loss of working-age adults, especially men, leaving households run by women and elderly relatives; a 'brain drain' of qualified nurses and technicians; local dependence on remittance income that stops abruptly when Gulf economies slow, when oil prices fall, or when destination countries push to employ their own nationals; social costs of long family separation.\nIf the question also asks about the destination, add: cheap labour that built the infrastructure, but concerns over migrant workers' conditions and the fact that these are temporary contracts with no route to citizenship.",
    },
    // ---- Topic 7: towns and cities ----
    {
      id: "gg10-15", topic: "7-towns-cities",
      q: "Explain why cities in low-income countries are growing rapidly, and describe two problems this causes. [6]",
      model: "Rapid urban growth in LICs has two components — rural-to-urban migration and natural increase.\nMigration push factors: mechanisation and land fragmentation reduce farm work; low and unreliable farm incomes; drought, flooding or soil exhaustion; few rural services — poor schools, clinics, electricity; sometimes conflict.\nMigration pull factors: perceived and real availability of jobs in factories and services; higher wages; better schools, hospitals and electricity; the 'bright lights' image spread by television and by relatives already there.\nNatural increase: migrants are mostly young adults of childbearing age, so the urban birth rate stays high while urban death rates fall with better health care — the city grows from within as well.\n\nProblems (two, developed):\n• Housing — construction cannot keep pace, so unplanned informal settlements grow on marginal land: steep slopes, floodplains, land beside railways and drains. Housing is self-built from scrap, insecure in tenure and vulnerable to fire, flood and eviction.\n• Services and health — piped water, sewerage and waste collection do not reach these areas, so residents buy water from vendors at higher unit cost, sanitation is shared or absent and refuse accumulates, spreading water-borne disease.\n• (Others: congestion and air pollution, insufficient formal jobs so many work in the informal sector without contracts or protection, and rising inequality within the same city.)",
    },
    {
      id: "gg10-16", topic: "7-towns-cities",
      q: "Using a named urban area, evaluate the strategies used to manage the challenges of rapid urban growth. [7]",
      model: "Example: Mumbai, India.\nCauses of growth: it is India's financial and commercial capital, with the port, the film industry, banking and services drawing migrants from across Maharashtra, Uttar Pradesh and Bihar, plus natural increase in a young population. Growth on a constrained peninsula pushed development onto reclaimed land and outward into Navi Mumbai.\nChallenges: a large share of the population lives in informal settlements, of which Dharavi is the best known — high density, shared sanitation, limited piped water, and homes that double as workshops for recycling, pottery and leather. Add monsoon flooding worsened by built-over creeks and the loss of mangroves, extreme crowding on the suburban rail network, and air pollution.\nStrategies, evaluated:\n• Slum rehabilitation through the Slum Rehabilitation Authority — developers rehouse residents in high-rise blocks in exchange for rights to build commercially on part of the site. It delivers legal tenure, water and sanitation, but the flats often break up the ground-floor workshops that Dharavi's economy runs on, and vertical living raises maintenance costs residents cannot meet.\n• The long-running Dharavi redevelopment proposals — ambitious in scale, repeatedly delayed, and contested over who counts as eligible for rehousing.\n• In-situ upgrading and site-and-service schemes — cheaper, keep the community and its livelihoods intact, and let people improve homes incrementally; but they do not increase the housing stock.\n• Transport — the Mumbai Metro and the sea link ease movement and open up new areas, though they mainly serve the formal economy.\n• Planning — Navi Mumbai as a planned counter-magnet across the harbour was intended to divert growth from the island city, with mixed success.\nJudgement: upgrading in place has the better record on livelihoods and cost, while high-rise redevelopment delivers services faster but breaks the informal economy. The most sustainable option combines secure tenure with in-situ upgrading and transport investment.",
    },
    // ---- Topic 8: development ----
    {
      id: "gg10-17", topic: "8-development",
      q: "A scatter graph plots GNI per person (horizontal axis) against life expectancy (vertical axis) for 40 countries. The points rise steeply at low GNI values and then flatten out at high GNI values, and three countries with mid-range GNI sit well below the rest. Describe the relationship shown and explain why the two indicators are linked. [6]",
      model: "Describe:\n• There is a positive relationship — as GNI per person rises, life expectancy generally rises.\n• The relationship is not linear. It is strongest at low GNI, where a small rise in income is matched by a large rise in life expectancy; above the middle of the range the line flattens, so extra income adds little further life expectancy.\n• The correlation is strong but not perfect, and three mid-income countries are clear anomalies with life expectancy well below what their GNI would predict.\n\nExplain the link: higher national income means more government revenue for clean water, sanitation, vaccination and hospitals, and more household income for a better diet and for treatment. That cuts infant mortality and deaths from infectious and water-borne disease — which is exactly why the gains are largest at the poorest end, where those basics are still missing. Once they are in place, further income buys expensive treatment for conditions that extend life only a little, so the curve flattens.\n\nExplain the anomalies: national income says nothing about DISTRIBUTION or about how it is spent. A country with high income concentrated in a small elite, or with income from a resource that funds little public health provision, or one affected by conflict or an epidemic, will fall below the line. The reverse also occurs — a state that invests heavily in primary health care and female education achieves high life expectancy on modest income.\n\nThis anomaly point is the standard follow-on mark: it is the argument for using a composite index such as HDI rather than income alone.",
    },
    // ---- Topic 9: changing economies ----
    {
      id: "gg10-18", topic: "9-economies",
      q: "Explain how the employment structure of a country typically changes as it develops, and give one factor that influences where a manufacturing industry locates. [5]",
      model: "Employment structure change:\n• In a low-income country, the great majority of workers are in the PRIMARY sector — farming, fishing, forestry, mining — much of it subsistence, with low productivity and low pay.\n• As industrialisation begins, workers move into the SECONDARY sector: mechanisation reduces the labour needed on the land, and factories offer higher wages, so the primary share falls sharply and the secondary share rises. This is the middle-income stage.\n• In a high-income country the TERTIARY sector dominates — retail, transport, finance, education, health, tourism — because rising incomes create demand for services, and manufacturing has often relocated to countries with lower labour costs. Secondary employment falls even where output does not, because of automation.\n• The QUATERNARY sector — research, information technology, biotechnology, consultancy — grows last and stays small in employment terms but high in value.\n\nLocation factor (any one, explained): access to raw materials for bulk-reducing industries; a supply of labour with the right cost or skill; energy supply; transport links and containerised ports for exporting; proximity to the market for bulky or perishable goods; government policy such as a special economic zone offering tax incentives; and increasingly telecommunications, which allow services to locate far from their customers.",
    },
    {
      id: "gg10-19", topic: "9-economies",
      q: "Using a named area, evaluate the benefits and problems that tourism has brought, and how it is being managed sustainably. [7]",
      model: "Example: Goa, India, with a contrast to Bhutan for management.\nWhy tourism grew: a long sandy coastline and a warm dry season; international airport access and charter flights; relatively low prices; heritage and festivals; and government promotion.\nBenefits — economic: employment in hotels, restaurants, transport and guiding, including for people with little formal education; income for small businesses; foreign exchange; infrastructure — airports, roads, water and power — that residents also use; social: preservation of crafts and heritage that visitors pay to see.\nProblems — environmental: pressure on water supply in the dry season when hotels and pools compete with residents; sewage and solid waste beyond the capacity of local treatment; damage to dunes and coastal ecosystems from construction; environmental: beach litter and noise; economic: strong seasonality, so work is insecure and much of the profit from packages and international hotel chains leaves the area (leakage); rising land and house prices; social: friction over behaviour and dress, and displacement of fishing communities from beachfront land.\nManagement, evaluated: waste and sewage regulation, limits on beachfront construction and shack licensing, and off-season promotion to spread demand — all reduce the worst pressures but depend on enforcement, which is the weak point.\nContrast for evaluation: Bhutan's 'high value, low volume' policy charges every visitor a Sustainable Development Fee and channels tourists through licensed operators. It caps the environmental load and funds services directly, and it is the more sustainable model — but it deliberately reduces visitor numbers, so it also reduces the employment that made tourism attractive in the first place. That trade-off is the judgement the question wants.\nThe Butler model is worth citing: a resort that reaches stagnation must either rejuvenate through reinvestment or decline, and sustainable management is what postpones stagnation.",
    },
    // ---- Topic 10: resource provision ----
    {
      id: "gg10-20", topic: "10-resources",
      q: "Explain two strategies used to increase food supply, and state one problem each can cause. [6]",
      model: "Strategy 1 — high-yielding varieties with irrigation and fertiliser (the Green Revolution package). In Punjab and Haryana, India, HYV wheat and rice combined with canal and tubewell irrigation, chemical fertiliser and pesticide, and mechanisation raised yields per hectare sharply and turned India from a food importer into a surplus producer.\nProblem: it is input-hungry. Tubewell irrigation has drawn the water table down in Punjab; heavy fertiliser use leads to nutrient run-off and eutrophication of watercourses; salinisation follows over-irrigation in poorly drained land; and the package favours farmers who can afford the inputs, which widens rural inequality. Monoculture also narrows genetic diversity.\n\nStrategy 2 — controlled-environment growing: hydroponics (roots in nutrient solution), aeroponics (roots misted in air) and aquaponics (fish waste fertilises the plants and the plants clean the water). These are all named in the 0460 syllabus. They use far less water and land per unit of output, allow year-round production close to cities, and avoid soil-borne pests.\nProblem: high capital and energy cost, especially for lighting and pumping, so they are viable mainly in high-income settings and for high-value crops; a power failure can destroy a crop; and they do not produce staple cereals at scale.\n\n(Other strategies you could use: irrigation schemes and dams, land reform, appropriate low-technology aid such as drip irrigation and improved seed, terracing and contour ploughing against soil erosion, and shelter belts against desertification.)",
    },
    // ---- Topic 11: skills ----
    {
      id: "gg10-21", topic: "11-skills",
      q: "On a 1 : 50 000 map extract, a church with a tower is 3.6 cm in a straight line from a road junction. What is the ground distance between them?",
      opts: ["0.72 km", "1.8 km", "3.6 km", "18 km"],
      a: "1.8 km",
      model: "At 1 : 50 000, 1 cm on the map represents 50 000 cm on the ground. 50 000 cm = 500 m = 0.5 km, so 2 cm represents 1 km.\nDistance = 3.6 × 0.5 = 1.8 km.\nAt 1 : 25 000 the same 3.6 cm would be 0.9 km, because 4 cm represents 1 km there.\nExam technique: use the plain paper you are required to bring — lay its edge along the line, mark both ends, then hold it against the printed linear scale rather than converting arithmetically. For a winding road or river, mark the paper in short straight sections, pivoting at each bend.",
    },
    {
      id: "gg10-22", topic: "11-skills",
      q: "Describe how you would give a six-figure grid reference for a feature on a topographical map, and how you would calculate the gradient between two points on it. [5]",
      model: "Six-figure grid reference:\n1. Find the EASTING first — the vertical grid line to the LEFT of the feature — and read its two-figure number. 'Along the corridor, then up the stairs.'\n2. Estimate how many tenths of the way across the square the feature lies, from that line towards the next easting to the right. That tenth is the third figure.\n3. Now the NORTHING — the horizontal grid line BELOW the feature — read its two-figure number.\n4. Estimate the tenths from that line upwards to the next northing. That is the sixth figure.\n5. Write all six together with no gap and no comma: eastings first, always. A four-figure reference identifies a whole 1 km square; the six-figure version identifies a 100 m square within it.\n\nGradient:\n1. Read the height of each point from contour lines or spot heights and find the DIFFERENCE in height in metres.\n2. Measure the horizontal distance between the two points and convert it to metres using the map scale.\n3. Gradient = difference in height ÷ horizontal distance, then express it as 1 in n by dividing the horizontal distance by the height difference.\nExample: a rise of 50 m over 2000 m is 50 ÷ 2000 = 0.025, or a gradient of 1 in 40.\nRemember that contours close together mean a steep slope, contours far apart a gentle one, and that a cross-section drawn with an exaggerated vertical scale makes slopes look steeper than they are.",
    },
    // ---- Topic 12: fieldwork and enquiry ----
    {
      id: "gg10-23", topic: "12-fieldwork",
      q: "A class investigates the hypothesis 'pedestrian numbers decrease with distance from the centre of the town'. Describe how they should collect the data, and state two limitations of their method. [6]",
      model: "Collection method:\n• Choose survey sites along a transect running out from the town centre, at regular intervals — a systematic sample — and record the grid reference of each site so it can be repeated.\n• At each site, count pedestrians passing a fixed point for a fixed period, for example five minutes, using a tally on a prepared recording sheet with the time, date, location, weather and recorder's name on it.\n• Count in both directions and state the rule used, so every counter counts the same way.\n• Do all the sites at the same time of day, or rotate teams so that each site is counted in each time slot, to remove the effect of time.\n• Repeat the count at each site and take a mean to improve reliability, and carry out a risk assessment before going out — count from the pavement, away from traffic, and work in pairs.\n\nLimitations (any two, explained):\n• Time of day, day of the week and weather affect footfall — a wet Tuesday morning and a dry Saturday afternoon give completely different results, so a single count is a snapshot, not a pattern.\n• Human error in counting when flows are heavy, and inconsistency between different counters.\n• The sites chosen may not be typical — one may be outside a station or a school and give an anomalous reading unrelated to distance from the centre.\n• A five-minute count is a small sample of the day; a small sample size reduces reliability.\n\nImprovements go straight after the limitations: count for longer, repeat on several days, use the same counters throughout, and add more sites along the transect.",
    },
    {
      id: "gg10-24", topic: "12-fieldwork",
      q: "Which presentation technique is most appropriate for showing whether river velocity increases as channel width increases, measured at ten sites?",
      opts: [
        "A divided bar graph",
        "A choropleth map",
        "A scatter graph with a line of best fit",
        "A pie chart",
      ],
      a: "A scatter graph with a line of best fit",
      model: "The hypothesis is about a RELATIONSHIP between two continuous variables measured at the same sites, and a scatter graph is the only listed technique that shows one. Plot the independent variable (channel width) on the horizontal axis and the dependent variable (velocity) on the vertical axis, add a line of best fit, and describe the relationship as positive, negative or none, plus its strength, naming any anomalous points.\nWhy the others fail: a divided bar shows the composition of a total; a choropleth shows a value by area and needs area data; a pie chart shows proportions of one whole. None of them can show a relationship between two variables.\nBe ready to justify a choice like this in words — Paper 4 asks you to select a technique AND say why it is suitable, and to suggest what could be improved about it.",
    },
  ],

  mistakes: [
    { mistake: "Describing when the command word is 'explain' — listing what a graph or map shows instead of saying why.", fix: "Describe = what it looks like (pattern, trend, anomaly, with figures quoted). Explain = why, with named processes and the word 'because'. Underline the command word before you write a single line." },
    { mistake: "Answering a 'detailed specific example' question with no named place, or naming one and then giving only general points.", fix: "Name the country AND the specific place, then use at least three facts only that place can supply. A named place with generic content scores the same as no name at all." },
    { mistake: "Listing the features of a landform instead of explaining the sequence of processes that made it.", fix: "Formation questions are marked on the ORDER. Number your stages, and give the process doing the work at each one — hydraulic action, abrasion, attrition, longshore drift, deposition, collapse." },
    { mistake: "Using 'erosion' and 'weathering' as if they were the same thing.", fix: "Weathering breaks rock down in place, with no transport — freeze–thaw, chemical, biological. Erosion wears away AND removes. A cliff is weathered and eroded; an overhang above a waterfall is weakened by weathering and then collapses." },
    { mistake: "Ignoring the mark allocation and writing four lines for a seven-mark question, or a page for a two-mark one.", fix: "The sub-marks are printed on the paper. Treat them as an instruction: roughly one developed point per mark, and for a seven-mark answer plan named example, points, and a judgement before you start." },
    { mistake: "Writing 'the population increased because of migration' when asked about natural increase.", fix: "Natural increase = birth rate minus death rate ONLY. Migration changes population size but not natural increase. Keep the two mechanisms in separate sentences." },
    { mistake: "Describing a pattern on a map with no direction, no place names and no anomaly.", fix: "Use compass directions, name places or regions visible in the resource, quote values from the key, and then add 'however' plus the exception. General pattern → evidence → anomaly is the mark scheme's shape." },
    { mistake: "Treating 'evaluate' as 'describe the strategies'.", fix: "Evaluate needs a judgement: for each strategy give a strength and a weakness, then say which works best and in what circumstances. End with an explicit conclusion — an answer with no judgement cannot reach the top level." },
    { mistake: "Saying a river slows down downstream because the gradient is gentler.", fix: "The Bradshaw model has velocity INCREASING downstream. The channel is smoother, deeper and more efficient, so friction is proportionally lower even though the slope is gentler." },
    { mistake: "Confusing mitigation with adaptation in climate change answers.", fix: "Mitigation attacks the cause (renewables, afforestation, international agreements). Adaptation lives with the effect (sea walls, salt-tolerant crops, early warning). Label each one as you use it." },
    { mistake: "In fieldwork answers, giving results but never evaluating the method.", fix: "Every enquiry answer needs the limitation and the improvement: time of day, weather, sample size, counter error, one-off measurement. Then say specifically what you would change — 'repeat on three days' beats 'be more accurate'." },
    { mistake: "Using MEDC and LEDC, or writing about the settlement hierarchy, urban land-use models or weather instruments.", fix: "The 2027 syllabus uses LIC, MIC and HIC, and has removed the settlement, water and weather topics. Check the topic list before revising from an older textbook — those pages are no longer examinable." },
  ],

  cheat: [
    {
      heading: "Map and grid-reference technique",
      bullets: [
        "Six-figure reference: eastings first, then northings — 'along the corridor, then up the stairs'. Take the line to the LEFT and the line BELOW, then add tenths across and up. No comma, no gap.",
        "Four figures = a 1 km square. Six figures = a 100 m square inside it.",
        "Scale: 1 : 50 000 → 2 cm = 1 km. 1 : 25 000 → 4 cm = 1 km. Bring plain paper and use its edge against the printed linear scale rather than doing arithmetic.",
        "Winding features: mark the paper in short straight sections, pivoting at each bend, then read the total against the scale.",
        "Direction: give it on the 16-point compass, or as a three-figure bearing measured clockwise from GRID north with a protractor.",
        "Relief: contours close together = steep; far apart = gentle. Concentric rings = a hill; a V pointing upslope = a valley (the V points to the source). Gradient = height difference ÷ horizontal distance, written as 1 in n.",
        "Cross-section: lay the paper edge along the line, tick every contour crossing and write its height, transfer to graph paper with the horizontal scale of the map, plot each height, join with a smooth curve — then note that the vertical exaggeration makes it look steeper than reality.",
      ],
    },
    {
      heading: "Landform formation sequences — learn the ORDER",
      bullets: [
        "Waterfall → gorge: hard over soft rock → soft eroded faster → step forms → plunge pool deepened by abrasion → overhang unsupported → collapses → retreats upstream → gorge left behind.",
        "Meander → oxbow: fast flow erodes the outer bend (river cliff), slow flow deposits on the inner bend (slip-off slope) → neck narrows → flood cuts through the neck → deposition seals both ends → oxbow lake → silts up.",
        "Levée and floodplain: river overtops its banks → velocity falls sharply at the edge → coarsest load dropped first beside the channel, building levées → fine silt spread across the valley floor as alluvium.",
        "Delta: river meets standing water → velocity drops to nothing → sediment deposited faster than the sea removes it → the channel splits into distributaries → the delta builds seaward.",
        "Cave → arch → stack → stump: crack in a headland widened by hydraulic action and abrasion → cave → arch → roof collapses → stack → undercut → stump.",
        "Spit: longshore drift along the coast → coastline changes direction → deposition in the sheltered, deeper water → ridge builds outward → end recurved by a second wave direction → salt marsh behind.",
        "Headlands and bays: discordant coast, alternating hard and soft rock at right angles to the sea → soft rock retreats faster, forming bays → hard rock left projecting as headlands → wave refraction then concentrates energy on the headlands.",
      ],
    },
    {
      heading: "Command words — Cambridge's own definitions",
      bullets: [
        "Describe — state the points of a topic / give characteristics and main features. NO reasons.",
        "Explain — set out purposes or reasons, make relationships clear, say why and/or how, with evidence.",
        "Compare — identify similarities and/or differences. Use 'whereas' in every sentence.",
        "Suggest — apply knowledge to a situation where several answers are valid; put forward considerations.",
        "Evaluate — judge the quality, importance, amount or value of something. Assess — make an informed judgement. Both need a conclusion.",
        "Justify — support a case with evidence or argument. Predict — say what may happen from the information given.",
        "Identify / State / Give — one-word or one-line answers; do not write a paragraph.",
        "Locate — indicate the position of a place or feature IN the resource. Plot — mark points. Sketch — a simple freehand drawing with proportions kept. Estimate — judge a distance or area. Calculate — work it out from the figures given.",
        "'How far do you agree…?' and 'To what extent…?' both mean: argue both sides, then commit to a verdict.",
      ],
    },
    {
      heading: "Case-study index — one named example per topic",
      bullets: [
        "Rivers, flooding: Kerala floods, India, August 2018 — extreme monsoon on saturated Western Ghats catchments plus simultaneous dam releases; boat evacuations; reservoir rules and land-use control as the fixes.",
        "Rivers, pollution: the Ganges — untreated sewage from riverside cities, industrial effluent including the Kanpur tanneries, and agricultural run-off; managed through the Namami Gange programme's sewage treatment and effluent controls, launched by the Government of India in 2014.",
        "Coasts, erosion: the Holderness coast, England — soft boulder clay cliffs, one of Europe's fastest-retreating coastlines; groynes and rock armour at Mappleton protect the village but starve the beaches downdrift; Spurn Head is the spit built from the eroded material.",
        "Coasts, storms: Odisha, India — Cyclone Fani, 2019; IMD tracking, mass evacuation into concrete cyclone shelters, embankments and mangrove replanting in the Mahanadi delta; a far smaller death toll than the 1999 super-cyclone on the same coast.",
        "Coasts, coral: the Great Barrier Reef, Australia — bleaching from warmer sea temperatures, crown-of-thorns starfish, run-off from farmland; zoning and no-take areas under the Great Barrier Reef Marine Park Authority.",
        "Ecosystems: Antarctica — the Antarctic Treaty (1959), the Madrid Protocol (1991) banning mineral activity, CCAMLR for fisheries, IAATO for tourism; India's Maitri and Bharati stations. Rainforest — the Brazilian Amazon: cattle ranching, soya, logging, roads and HEP; protected areas, indigenous territories and satellite monitoring by INPE.",
        "Tectonics: Nepal (Gorkha) earthquake, 25 April 2015, Mw 7.8 — Indian plate colliding with the Eurasian plate, shallow focus, landslides blocking mountain roads, one international airport as the aid bottleneck. Volcano — Merapi, Indonesia (destructive boundary, pyroclastic flows and lahars, exclusion zones and evacuation); India's only active volcano is Barren Island in the Andaman Sea.",
        "Climate change: Bangladesh — delta exposure, cyclone surge, salinisation; Cyclone Preparedness Programme, raised shelters, salt-tolerant rice, Sundarbans mangroves, the Bangladesh Delta Plan; set against global mitigation under the Paris Agreement (2015).",
        "Populations: China's one-child policy, 1979–2015, then two-child and from 2021 three-child — anti-natalist. Migration — Kerala to the Gulf states: remittances, brain drain, family separation, dependence on Gulf demand.",
        "Cities: Mumbai, India — Dharavi, the Slum Rehabilitation Authority, in-situ upgrading, the Metro, Navi Mumbai as a planned counter-magnet. Sustainable contrast: Curitiba, Brazil, and its bus rapid transit.",
        "Development: Bangladesh as an MIC example — ready-made garments, remittances, microfinance and NGO health and education work; measured against the UN Sustainable Development Goals adopted in 2015 for 2030.",
        "Economies: Bengaluru's IT and services cluster for globalisation; Goa for tourism's benefits and problems, with Bhutan's 'high value, low volume' Sustainable Development Fee as the sustainable contrast.",
        "Resources: Punjab, India — the Green Revolution's yields against a falling water table and salinisation; the Sahel for desertification and food insecurity; India's energy mix — coal-dominated with solar the fastest-growing source, and the International Solar Alliance headquartered in Gurugram.",
      ],
    },
    {
      heading: "The route to geographical enquiry — seven stages",
      bullets: [
        "1. Identify the issue and write the HYPOTHESIS — a testable statement, not a question ('the CBD has better waste collection than the suburbs').",
        "2. Define objectives: what data are relevant, and how will they be collected? Do a risk assessment now.",
        "3. Collect data — primary (questionnaires, counts, measurement, observation, field sketches, annotated photographs) and secondary (census, published maps, internet, newspapers).",
        "4. Select and collate: choose what actually tests the hypothesis; discard what does not.",
        "5. Present: pick the technique that fits the data — scatter graph with best-fit line for a relationship, kite diagram for a transect, rose chart for direction, choropleth for area values, dispersion graph for spread, flow line for movement.",
        "6. Analyse and interpret: describe the pattern, quote figures, name anomalies, and link back to geographical theory.",
        "7. Conclude and evaluate: accept or reject the hypothesis EXPLICITLY, then give limitations (sample size, time of day, weather, equipment, counter error) and specific improvements and further work.",
        "Sampling: random (unbiased, may miss areas) · systematic (even coverage, can hit a repeating pattern) · stratified (representative, needs prior knowledge).",
        "Equipment named in the syllabus: ranging poles, flow meter, stopwatch, quadrat, noise meter, tape measure, clinometer.",
      ],
    },
    {
      heading: "Reading graphs and data resources",
      bullets: [
        "Population pyramid: wide base = high birth rate; narrow base and wide top = ageing; concave sides = high death rate at all ages; a bite out of one side of the working ages = out-migration.",
        "Flood hydrograph: lag time is the gap between peak rainfall and peak discharge. Short lag + high peak = impermeable, steep, urban, deforested or saturated.",
        "Climate graph: bars are rainfall (mm, right axis), the line is temperature (°C, left axis). Quote the annual range, the total rainfall and the wettest and driest months.",
        "Scatter graph: state direction (positive/negative/none), strength (how close to the best-fit line), and always identify the anomalies by name.",
        "Choropleth: darker shading = higher value. Describe by region and direction, and note that class boundaries can hide variation inside a shaded area.",
        "Triangular graph: three axes summing to 100% — used for employment structure and soil texture. Read each axis in the direction its labels point.",
        "Units used in every 0460 resource: metres and kilometres for height and distance, degrees Celsius for temperature, millimetres for rainfall.",
        "GIS: benefits are layering of data, updating, querying and visualisation; limitations are cost, training, data quality and the fact that it can look authoritative while resting on poor data.",
      ],
    },
    {
      heading: "Paper structure and where the marks are",
      bullets: [
        "Paper 1 Physical Geography — 1 h 45 min, 75 marks, 36% of the qualification, topics 1–5.",
        "Paper 2 Human Geography — 1 h 45 min, 75 marks, 36%, topics 6–10. Same format as Paper 1 from 2027.",
        "Both papers: Section A is ONE compulsory structured question worth 25 marks; Section B is TWO questions chosen from three, 25 marks each. Read all three Section B options before choosing.",
        "Third component: either Component 3 Coursework (one assignment of 1800–2200 words, 60 marks, 28%) or Paper 4 Geographical Investigations (1 h 30 min, 60 marks, 28%, two compulsory questions).",
        "Assessment objectives across the qualification: AO1 knowledge and understanding 32%, AO2 skills and analysis 48%, AO3 evaluation and decision-making 20%. Skills are the largest single slice — practise resources, not just notes.",
        "There is no separate skills paper from 2027; skills are tested inside every component.",
        "Take into the exam: pencil, eraser, ruler, protractor, calculator, and a sheet of plain paper for measuring distances and building cross-sections.",
      ],
    },
    {
      heading: "Definitions examiners want word-for-word",
      bullets: [
        "Birth rate — live births per 1000 people per year. Death rate — deaths per 1000 per year. Natural increase — birth rate minus death rate. Fertility rate — average number of children per woman.",
        "Population density — people per square kilometre. Distribution — how population is spread across an area.",
        "Migration — a permanent or semi-permanent change of residence. Economic migrant chooses; refugee is forced and legally protected; asylum seeker has applied and awaits a decision.",
        "Urbanisation — an increasing PROPORTION of a country's population living in towns and cities (not simply more people).",
        "Sustainable development — meeting the needs of the present without compromising the ability of future generations to meet their own needs.",
        "Standard of living — the material goods and services a person has. Quality of life — the overall wellbeing, including health, safety, environment and freedom.",
        "Globalisation — the growing interconnection of countries through trade, investment, transport, communications and culture. A TNC operates in more than one country.",
        "Energy security — reliable and affordable access to sufficient energy. Energy mix — the combination of sources a country uses.",
        "Discharge — the volume of water passing a point per second (cumecs). Lag time — the gap between peak rainfall and peak discharge. Watershed — the boundary of a drainage basin.",
      ],
    },
    {
      heading: "Answer templates for the long questions",
      bullets: [
        "'Explain the formation of…' → numbered sequence, one process named per stage, ending with the finished landform. Add a labelled diagram; the labels can earn marks the prose missed.",
        "'Describe the pattern shown…' → general pattern first, then evidence with figures and place names from the resource, then 'however' plus the anomaly. No reasons.",
        "'Using a detailed specific example…' → name the place in the first line, then causes, then impacts split into social / economic / environmental, then management, then a judgement.",
        "'Evaluate the strategies…' → for each strategy, one strength and one weakness, then compare on cost, timescale and sustainability, then commit: which is best, for whom, and why.",
        "'To what extent do you agree?' → both sides with evidence, then a verdict that says at what SCALE and in what circumstances you agree.",
        "Impacts must be split three ways when asked — social (people), economic (money and jobs), environmental (land, water, wildlife) — and at a range of scales, local to global.",
        "Always finish an evaluation with the word 'therefore' or 'overall'. An answer with no judgement is capped below the top level.",
      ],
    },
    {
      heading: "What changed in 2027 — and what this pack left out",
      bullets: [
        "Content is now split into physical (Paper 1) and human (Paper 2) topics, and climate change is a NEW topic.",
        "Removed from the syllabus: the settlement topic (settlement hierarchy, urban land-use models), the water topic, and the weather topic (Stevenson screen, rain gauge, instrument work). Hot deserts are gone too — the two named ecosystems are now Antarctica and the tropical rainforest.",
        "Terminology: MEDC and LEDC have been replaced by LIC, MIC and HIC. 'Case studies' are now called 'detailed specific examples'.",
        "The separate geographical skills paper has gone; skills are examined across every component instead, so the skills work in this pack matters in all three papers.",
        "Cambridge names NO case studies in the syllabus — teachers choose. Every place in this pack is one we chose; if your teacher has taught a different example for a topic, use theirs, because you will know more detail about it.",
        "Deliberately omitted: casualty counts, damage costs, percentages and other statistics for the named examples. They are the easiest thing to misremember and the easiest for an examiner to mark wrong. Qualitative detail — the process, the place, the response — scores the same and is safer. If you want figures, take them from your own textbook or the official report and check them.",
        "If your school is still teaching from a pre-2027 textbook, check the topic list above before revising a chapter; several chapters in older editions are no longer examinable.",
      ],
    },
  ],
};
