/** Original revision material. Unit scope supplied by parent, not a school paper. */
export const SCIENCE_COURSE_ID = 'cambridge-science-7-term1-v1';
export const SCIENCE_SOURCE = 'https://assets.cambridge.org/97811087/42788/excerpt/9781108742788_excerpt.pdf';
export type RevisionUnit = 'cells' | 'materials' | 'forces';
export type RevisionLesson = { id: string; unit: RevisionUnit; title: string; points: string[]; check: string; answer: string; visual?: 'cells' | 'particles' | 'weight' };
export type RevisionQuestion = { id: string; unit: RevisionUnit; question: string; options?: string[]; correct?: string; hint: string; points: string[]; marks: number };
export const SCIENCE_UNITS: {id: RevisionUnit; title: string; number: number}[] = [
  {id:'cells',title:'Cells',number:1},
  {id:'materials',title:'Materials and their structure',number:2},
  {id:'forces',title:'Forces and energy',number:3},
];
export const SCIENCE_LESSONS: RevisionLesson[] = [
  {id:'plant-cells',unit:'cells',title:'A plant cell: name it, then give its job',visual:'cells',points:[
    'A cell is the basic unit of living organisms. A typical leaf cell has a nucleus, cytoplasm and a cell membrane, plus a cell wall, chloroplasts and a large permanent vacuole.',
    'The nucleus contains genetic information and controls cell activities. The cytoplasm is where many chemical reactions occur. The membrane controls what enters and leaves.',
    'The cell wall supports the cell. Chloroplasts contain chlorophyll, which absorbs light for photosynthesis. The vacuole contains cell sap and helps keep the cell firm.',
    'Not all plant cells contain chloroplasts. Root hair cells usually have none because they are underground.'
  ],check:'Which structure controls entry and exit: the wall or the membrane?',answer:'The cell membrane. The cell wall gives support and shape.'},
  {id:'animal-cells',unit:'cells',title:'Compare plant and animal cells',points:[
    'A typical animal cell has a membrane, cytoplasm and nucleus. It has no cellulose cell wall and no chloroplasts.',
    'Both plant and animal cells have mitochondria, where aerobic respiration releases energy for cell activities.',
    'In a comparison, name a similarity and a difference. Avoid saying that every plant cell is rectangular or every animal cell is round.',
    'For a biological drawing, use clear single outlines and straight label lines that reach the structure. Follow the drawing instructions given in the question.'
  ],check:'Give two structures shared by a typical plant and animal cell.',answer:'Any two of cell membrane, cytoplasm, nucleus or mitochondria.'},
  {id:'specialised-cells',unit:'cells',title:'Link a cell’s structure to its function',points:[
    'A root hair cell has a long extension. This increases its surface area for absorbing water and mineral ions from soil.',
    'A palisade cell in a leaf contains many chloroplasts to absorb light for photosynthesis.',
    'A mammalian red blood cell contains haemoglobin to carry oxygen. Its lack of a nucleus leaves more space for haemoglobin.',
    'A nerve cell has a long extension that carries impulses over a distance. Ciliated cells have tiny moving hairs that help move mucus.',
    'Use the answer pattern: feature → what it changes → how this helps the job.'
  ],check:'Why is “it has a long root hair” only half an explanation?',answer:'You must link the extension to its larger surface area and increased absorption.'},
  {id:'organisation',unit:'cells',title:'Build an organism from cells',points:[
    'Cells working together form tissues. Different tissues working together form an organ. Organs working together form an organ system.',
    'The order is cell → tissue → organ → organ system → organism.',
    'Example: a muscle cell is part of muscle tissue; muscle tissue is one tissue in the heart; the heart is an organ in the circulatory system.',
    'A leaf is a plant organ containing different tissues. An organ is not made of just one type of cell.'
  ],check:'Is the stomach a tissue, organ or organ system? Explain.',answer:'An organ, because different tissues work together to carry out its functions.'},
  {id:'states',unit:'materials',title:'Explain solids, liquids and gases with particles',visual:'particles',points:[
    'In a solid, particles are close together and vibrate about fixed positions. A solid keeps its shape and volume.',
    'In a liquid, particles are close together but can move past each other. It keeps its volume but takes the shape of its container.',
    'In a gas, particles are far apart and move in all directions. A gas spreads to fill its container and can be compressed.',
    'Explain behaviour using arrangement, spacing and movement. The particles in a solid are not motionless.'
  ],check:'Why can a gas be compressed much more easily than a liquid?',answer:'There is much more empty space between gas particles, so they can be pushed closer together.'},
  {id:'state-changes',unit:'materials',title:'Name each change of state',points:[
    'Melting: solid to liquid. Freezing: liquid to solid. Evaporation or boiling: liquid to gas. Condensation: gas to liquid.',
    'Evaporation happens at the surface of a liquid and can occur below its boiling point. Boiling happens throughout the liquid at its boiling point for the given pressure.',
    'Pure water freezes at about 0 °C and boils at about 100 °C at normal atmospheric pressure.',
    'A change of state is a physical change. The substance remains the same: ice, liquid water and water vapour are all water.'
  ],check:'Droplets appear outside a cold glass. Which change produced them?',answer:'Condensation: water vapour in the surrounding air cools and becomes liquid water.'},
  {id:'explain-changes',unit:'materials',title:'Heating changes particle movement, not particle size',points:[
    'When a substance warms, its particles generally gain kinetic energy and move or vibrate more rapidly.',
    'During melting, energy helps particles overcome attractions that hold them in fixed positions. During boiling, particles separate much farther.',
    'Particles themselves do not get larger or turn into a different substance in a physical change.',
    'During a pure substance’s change of state at constant pressure, supplied energy changes the arrangement rather than raising the temperature. A heating graph can show a flat section.'
  ],check:'Does boiling water make its molecules bigger?',answer:'No. The water molecules become much farther apart in the gas; the molecules do not expand.'},
  {id:'water-cycle',unit:'materials',title:'Follow water, including the invisible part',points:[
    'Energy from the Sun helps liquid water evaporate. Plants also release water vapour through transpiration.',
    'Water vapour cools and condenses into small droplets or ice crystals that form clouds. Water vapour itself is invisible.',
    'Water returns as precipitation such as rain or snow. It can flow over land, collect in rivers or soak into the ground.',
    'Water is recycled. The processes move water between places and states; they do not make new water each time.'
  ],check:'Why is “clouds are made of invisible water vapour” inaccurate?',answer:'Clouds are visible because they contain tiny liquid droplets or ice crystals. Water vapour is invisible.'},
  {id:'atoms-elements',unit:'materials',title:'Atoms, elements and symbols',points:[
    'An element contains only one type of atom. The Periodic Table organises elements and gives each a chemical symbol.',
    'The first letter of an element symbol is capital; a second letter is lower-case. Carbon is C, oxygen O, hydrogen H and sodium Na.',
    'A molecule can contain atoms of the same element, such as O₂, or different elements, such as H₂O.',
    'A model uses circles to represent atoms. Real atoms are not coloured solid balls and the picture may not be drawn to scale.'
  ],check:'Why is O₂ an element even though its molecules have two atoms?',answer:'Both atoms are oxygen. There is only one type of atom.'},
  {id:'formulae',unit:'materials',title:'Read a chemical formula',points:[
    'A compound contains atoms of two or more different elements chemically joined in a fixed ratio.',
    'In H₂O, each molecule contains two hydrogen atoms and one oxygen atom. In CO₂, there is one carbon atom and two oxygen atoms.',
    'A small number after a symbol tells you how many atoms of that element are represented. No small number means one.',
    'The properties of a compound can differ from the properties of the elements that form it.'
  ],check:'How many atoms, and which types, are represented by one CO₂ molecule?',answer:'Three atoms in total: one carbon and two oxygen.'},
  {id:'mixtures',unit:'materials',title:'Tell an element, compound and mixture apart',points:[
    'A mixture contains two or more substances together without those substances being chemically joined to one another. Its composition can vary.',
    'A compound has chemically joined elements in a fixed ratio. Separating a compound into its elements requires a chemical change.',
    'Mixtures can often be separated by physical methods. A mixture can include elements, compounds or both.',
    'In particle diagrams, inspect all particles: identical joined pairs of different atom types represent a pure compound; more than one substance represents a mixture.'
  ],check:'A jar contains only identical H₂O molecules. Is it a mixture because it has two elements?',answer:'No. It is a pure compound: the hydrogen and oxygen atoms are chemically joined in a fixed ratio.'},
  {id:'mass-weight',unit:'forces',title:'Mass and weight are different measurements',visual:'weight',points:[
    'Gravity is an attractive force between objects with mass. Greater masses produce stronger attraction when the distance stays the same.',
    'Mass is measured in kilograms (kg). Weight is the gravitational force on an object, measured in newtons (N).',
    'Weight = mass × gravitational field strength, or W = mg. Use the value of g supplied in the question, in N/kg.',
    'The same object has the same mass on Earth and the Moon, but less weight on the Moon because its gravitational field is weaker.'
  ],check:'A 3 kg object is in a field of 10 N/kg. What is its weight?',answer:'W = 3 × 10 = 30 N. Write the force unit N, not kg.'},
  {id:'solar-formation',unit:'forces',title:'Gravity helped build the Solar System',points:[
    'The Solar System formed from a large cloud of gas and dust. Gravity drew material together.',
    'Most material gathered near the centre and formed the Sun. Material in the surrounding rotating disc gathered into smaller bodies, including planets.',
    'The planets orbit the Sun. Moons orbit planets. Gravity helps hold these bodies in their orbits.',
    'A scientific model explains observations but has limits. A classroom Solar System model usually cannot show both sizes and distances accurately.'
  ],check:'What force pulled together material as the Solar System formed?',answer:'Gravitational attraction.'},
  {id:'orbits',unit:'forces',title:'An orbit is movement with a continual change of direction',points:[
    'A planet has forward motion while the Sun’s gravitational pull continuously changes its direction. Together these produce an orbit.',
    'Gravity acts across space without objects touching. Space does not mean that gravity disappears.',
    'Rotation means spinning on an axis. Revolution means travelling around another body.',
    'Earth’s rotation causes day and night. One orbit of Earth around the Sun takes about one year.'
  ],check:'Why does an orbiting planet not simply travel away in a straight line?',answer:'The Sun’s gravity continually pulls it inward and changes the direction of its motion.'},
  {id:'tides',unit:'forces',title:'Tides are linked to gravitational pull',points:[
    'The Moon’s gravitational pull is stronger on the near side of Earth than on the far side. Differences in pull contribute to two tidal bulges.',
    'As Earth rotates relative to the Moon, many coasts experience roughly two high tides and two low tides in a lunar day, about 24 hours 50 minutes. Local patterns vary.',
    'The Sun also affects tides. The positions of the Sun, Earth and Moon influence the size of the tidal range.',
    'Tides are not caused by ordinary wind-driven waves. A model of tidal bulges simplifies real oceans and coastlines.'
  ],check:'What is the main astronomical cause of Earth’s tides?',answer:'Differences in the Moon’s gravitational pull across Earth. The Sun contributes too.'},
  {id:'energy',unit:'forces',title:'Describe energy stores and transfers',points:[
    'Energy is measured in joules (J). Moving objects have kinetic energy; raised objects have gravitational potential energy.',
    'A stretched spring or elastic band stores elastic potential energy. Fuels, food and batteries store energy chemically.',
    'Energy can transfer by heating, mechanically, electrically or by radiation such as light. Use the terminology your teacher expects.',
    'Energy is conserved: it cannot be created or destroyed, although it can be transferred and become less useful.'
  ],check:'Which energy store increases when you lift a book onto a shelf?',answer:'The gravitational potential energy store of the book and Earth increases.'},
  {id:'energy-changes',unit:'forces',title:'Trace the start and finish of an energy change',points:[
    'As a ball falls, gravitational potential energy decreases and kinetic energy increases. Air resistance also transfers some energy to the surroundings.',
    'A battery-powered torch transfers energy electrically from a chemical store. Energy leaves as light and by heating the surroundings.',
    'Braking transfers energy from a moving bicycle to the brakes, tyres and surroundings, increasing their thermal energy.',
    'In an answer, describe the starting store, the useful change and other transfers. Do not say energy is simply used up.'
  ],check:'Why do brakes warm up when a bicycle slows down?',answer:'Friction transfers energy from the bicycle’s kinetic store to thermal stores in the brakes and surroundings.'},
  {id:'dissipation',unit:'forces',title:'Where does the less useful energy go?',points:[
    'Dissipation means energy spreads into the surroundings and becomes less available for a useful task.',
    'A bouncing ball eventually stops bouncing. Its energy has transferred to the ball, ground and air, mainly as thermal energy and sound.',
    'If a device receives 100 J and provides 30 J in the useful output described, the remaining 70 J must be accounted for in other transfers or stores.',
    'For enquiry questions, identify the changed variable, measured variable and controlled variables. Repeat readings, note units and use results to support conclusions.'
  ],check:'Is energy destroyed when a bouncing ball stops?',answer:'No. Energy is conserved, but it has spread into the surroundings and is less useful for bouncing.'},
];

const q = (id:string,unit:RevisionUnit,question:string,points:string[],hint:string,options?:string[],correct?:string):RevisionQuestion => ({id,unit,question,points,hint,options,correct,marks:points.length});
export const SCIENCE_QUESTIONS: RevisionQuestion[] = [
 q('c1','cells','Which structure controls what enters and leaves a cell?',['The cell membrane controls movement into and out of the cell.'],'Think about a boundary that controls entry.',['Cell wall','Cell membrane','Nucleus','Chloroplast'],'Cell membrane'),
 q('c2','cells','Give two structures present in a typical leaf cell but absent from a typical animal cell.',['Cell wall.','Chloroplasts. A large permanent sap vacuole is another acceptable plant-cell feature.'],'Think about support and absorbing light.'),
 q('c3','cells','A root hair cell has a long extension. Explain how this helps its function.',['The extension gives a large surface area.','This helps absorption of water and mineral ions from soil.'],'Link the shape to absorption.'),
 q('c4','cells','Which order shows increasing levels of organisation?',['Cell → tissue → organ → organ system → organism.'],'Start with the smallest living unit.',['Cell → organ → tissue → organism','Cell → tissue → organ → organ system → organism','Organ → cell → organism → tissue'],'Cell → tissue → organ → organ system → organism'),
 q('c5','cells','Why do palisade cells contain many chloroplasts?',['Chloroplasts contain chlorophyll that absorbs light.','The absorbed light provides energy for photosynthesis.'],'Name the process that uses light.'),
 q('c6','cells','A learner says every plant cell has chloroplasts. Correct the statement using an example.',['Not every plant cell has chloroplasts.','Root hair cells usually lack them because they are underground and not exposed to light.'],'Think about plant roots.'),
 q('c7','cells','Which structure contains genetic information and controls cell activities?',['The nucleus.'],'The answer is an internal cell structure.',['Cytoplasm','Cell wall','Nucleus','Vacuole'],'Nucleus'),
 q('c8','cells','Explain why the heart is an organ rather than a tissue.',['It contains different tissues.','These tissues work together to carry out the heart’s functions, including pumping blood.'],'Contrast one tissue with several tissues working together.'),
 q('c9','cells','Name two features shared by typical plant and animal cells.',['Any one of: membrane, cytoplasm, nucleus, mitochondria.','A second different structure from that list.'],'Do not choose a cell wall or chloroplast.'),
 q('c10','cells','What is the main role of mitochondria in cells?',['They release energy through aerobic respiration.'],'Plants need this process too.',['Absorbing light','Making a cell wall','Releasing energy by respiration','Storing cell sap'],'Releasing energy by respiration'),
 q('c11','cells','Explain one adaptation of a mammalian red blood cell for carrying oxygen.',['It has no nucleus, leaving more space for haemoglobin.','Haemoglobin carries oxygen. Alternatively, credit a correctly linked biconcave shape and short diffusion distance/large surface area.'],'Give a feature and explain how it helps.'),
 q('c12','cells','A diagram shows a cell wall, membrane, nucleus and a large vacuole. Identify the cell type and justify it.',['It is a plant cell.','A cell wall or large permanent vacuole supports the identification.'],'Use a visible feature as evidence.'),
 q('m1','materials','Why is a gas easier to compress than a liquid?',['Gas particles are much farther apart.','They can be pushed closer together because there is more empty space between them.'],'Compare spaces, not particle size.'),
 q('m2','materials','Which description fits particles in a solid?',['They vibrate about fixed positions.'],'Particles still have motion.',['They are motionless','They vibrate about fixed positions','They are very far apart','They move freely throughout the container'],'They vibrate about fixed positions'),
 q('m3','materials','Give two differences between evaporation and boiling.',['Evaporation happens at the surface; boiling happens throughout a liquid.','Evaporation can occur below the boiling point; boiling occurs at the boiling point for the given pressure.'],'Compare where and when.'),
 q('m4','materials','A cold mirror becomes misty after a warm shower. Name and explain the change.',['Condensation.','Water vapour loses energy at the cooler mirror and changes from gas to liquid droplets.'],'The droplets come from water in the air.'),
 q('m5','materials','Explain how clouds form in the water cycle.',['Water vapour cools.','It condenses into tiny liquid droplets, or forms ice crystals, which make a cloud.'],'Water vapour itself is invisible.'),
 q('m6','materials','How many oxygen atoms are represented in one CO₂ molecule?',['Two oxygen atoms.'],'Look at the small number after O.',['One','Two','Three','Four'],'Two'),
 q('m7','materials','Why is O₂ an element but CO₂ a compound?',['O₂ contains only one type of atom: oxygen.','CO₂ contains atoms of different elements, carbon and oxygen, chemically joined.'],'Count atom types, not just total atoms.'),
 q('m8','materials','A diagram shows only identical groups, each with two H atoms joined to one O atom. Is it an element, compound or mixture? Explain.',['A compound.','Different types of atoms are chemically joined in a fixed ratio; there is only one substance shown.'],'Different elements can form one pure substance.'),
 q('m9','materials','Which statement about a mixture is correct?',['Its substances are not chemically joined to one another and its proportions can vary.'],'Compare a mixture with a compound.',['Its elements must have a fixed ratio','It contains only one type of atom','Its substances are not chemically joined and proportions can vary','It can only be separated chemically'],'Its substances are not chemically joined and proportions can vary'),
 q('m10','materials','A pupil says particles become larger when water boils. Correct this explanation.',['The particles themselves do not become larger.','They become much farther apart when the water is a gas.'],'Distinguish a particle from the space around it.'),
 q('m11','materials','A heating graph has a flat section while a pure solid melts. Explain why the temperature stays constant.',['Energy is being supplied for the change of state.','It overcomes attractions holding particles in fixed positions rather than increasing the temperature.'],'What is the supplied energy doing during melting?'),
 q('m12','materials','Which symbol is correctly written for sodium?',['Na: the first letter is capital and the second is lower-case.'],'Element symbols are case-sensitive.',['NA','na','nA','Na'],'Na'),
 q('f1','forces','Calculate the weight of a 4 kg object where g = 10 N/kg. Show your working.',['W = m × g = 4 × 10.','Weight = 40 N.'],'Use W = mg and include the unit.'),
 q('f2','forces','An astronaut takes the same rock from Earth to the Moon. What happens to its mass and weight?',['Its mass stays the same.','Its weight decreases because the Moon has a weaker gravitational field.'],'Mass is not a force.'),
 q('f3','forces','What force helped draw gas and dust together when the Solar System formed?',['Gravity.'],'It is attractive and acts between masses.',['Friction','Gravity','Air resistance','Magnetism'],'Gravity'),
 q('f4','forces','Explain how the Sun’s gravity affects a planet in orbit.',['Gravity pulls the planet towards the Sun.','This continually changes the direction of its motion, keeping it in an orbit rather than travelling straight away.'],'An orbiting body is moving, not stationary.'),
 q('f5','forces','What is the main cause of tides, and what other astronomical body contributes?',['Differences in the Moon’s gravitational pull across Earth contribute to tides.','The Sun also contributes through its gravitational pull.'],'Do not confuse tides with wind-driven waves.'),
 q('f6','forces','Which unit measures energy?',['The joule (J).'],'Newtons measure force.',['Kilogram','Newton','Joule','Metre'],'Joule'),
 q('f7','forces','Describe the main energy change as a ball falls, before it hits the ground.',['Its gravitational potential energy decreases.','Its kinetic energy increases. Some energy can also transfer to the surroundings through air resistance.'],'Compare height and speed.'),
 q('f8','forces','A torch receives 120 J of energy and transfers 35 J as useful light. How much is transferred in other ways? Show your working.',['120 − 35 = 85.','85 J is transferred in other ways, mainly by heating.'],'Account for all the input energy.'),
 q('f9','forces','Why does a bouncing ball eventually stop even though energy is conserved?',['Energy transfers from the ball to the ground and air, for example through heating and sound.','Energy becomes spread out and less available for bouncing; it is not destroyed.'],'Explain dissipation.'),
 q('f10','forces','Which example increases elastic potential energy?',['Stretching an elastic band.'],'Look for a change of shape that can spring back.',['Cooling water','Stretching an elastic band','Switching off a lamp','Letting a ball fall'],'Stretching an elastic band'),
 q('f11','forces','Explain why Earth has day and night.',['Earth rotates on its axis.','The side facing the Sun has daylight; the side facing away has night.'],'Do not confuse rotation with the year-long orbit.'),
 q('f12','forces','You test how release height affects a ball’s first bounce height. State the independent variable and one control variable.',['Independent variable: the release height.','Keep the same ball or the same surface. Measure first bounce height as the dependent variable.'],'Change one thing and keep other relevant factors the same.'),
];
// A fixed, reproducible 30-mark rehearsal. No claim about the school paper’s format.
export const SCIENCE_MOCK_IDS = ['c2','c3','c5','c8','c12','m1','m3','m5','m7','m10','f1','f2','f4','f8','f9'];
