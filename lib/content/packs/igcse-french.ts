// Cambridge IGCSE French (Foreign Language) 0520 — full-course pack, built
// around the learner's actual coursebook.
//
// Course book: Tricolore 4, 5e édition (Oxford University Press; Mascie-Taylor /
// Honnor / Spencer; ISBN 978-0-19-837475-6), which the publisher states is
// suitable for the latest Cambridge IGCSE syllabus. The nine topics below mirror
// the book's nine unités, so revision here lines up with what is taught in class.
//
// Syllabus verified 2026-08-11 against the two official Cambridge documents:
//   • 0520 syllabus for 2025, 2026 and 2027 — the version a Grade 10 student
//     starting in August 2026 will sit
//     https://www.cambridgeinternational.org/Images/664620-2025-2027-syllabus.pdf
//   • 0520 syllabus for 2028, 2029 and 2030 — Paper 2 and Paper 4 drop to
//     40 marks each; that difference is flagged rather than smoothed over
//     https://www.cambridgeinternational.org/Images/743340-2028-2030-syllabus.pdf
//
// Every French sentence, gap-fill and model answer below is ORIGINAL. Nothing is
// reproduced from Tricolore 4 or from a Cambridge past paper.

import type { ExamPack } from "../exam-pack";

export const IGCSE_FRENCH_PACK: ExamPack = {
  subjectId: "igcse-french",
  grade: 10,
  title: "French — Grammar, Themes & the Four Papers · IGCSE",
  context: "Cambridge IGCSE 0520 · Tricolore 4 (5e éd.) · 9 unités",
  highlights: [
    { label: "Syllabus", value: "0520 (2025–2027)" },
    { label: "Papers", value: "Listening · Reading · Speaking · Writing" },
    { label: "Weighting", value: "25% each · A2 with elements of B1" },
  ],
  pinnedRule: {
    heading: "Agreement is where the marks quietly vanish",
    body: "Three agreements decide your Quality-of-Language mark: (1) verb agrees with its subject; (2) adjective agrees with the noun in gender AND number; (3) past participle agrees after être, and after a preceding direct object with avoir. 'Elle est allé au marché avec ses bon copains' says everything you meant — and still loses marks on every line. Before you hand in Paper 4, re-read it once looking only at endings.",
  },
  reference: {
    label: "Cambridge IGCSE French – Foreign Language 0520 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-french-foreign-language-0520/",
  },
  plan: [
    { title: "Walk the nine unités", hint: "Unité 1 → Unité 9, same order as the book" },
    { title: "Lock the three past tenses", hint: "Passé composé · imparfait · plus-que-parfait" },
    { title: "Drill future vs conditional", hint: "One stem, two sets of endings" },
    { title: "Fix the pronouns and their order", hint: "me/te/se → le/la/les → lui/leur → y → en" },
    { title: "Write one 130-word answer against the clock", hint: "Three time frames + two opinions" },
    { title: "Read the cheat sheet exam morning", hint: "DR & MRS VANDERTRAMP + connectives only" },
  ],

  topics: [
    {
      id: "u1-jeunes-sans-frontieres", num: 1, title: "Unité 1 — Jeunes sans frontières · Young people without borders",
      blurb: "Introducing yourself, describing people, family and celebrations.",
      syllabus: [
        "IGCSE theme: B Personal and social life (self, family, friends), with E The international world (countries, nationalities, festivals).",
        "Asking and answering questions: three registers — intonation (Tu habites où ?), est-ce que (Est-ce que tu habites ici ?), inversion (Où habites-tu ?).",
        "The present tense: regular -er / -ir / -re patterns plus the high-frequency irregulars être, avoir, aller, faire, prendre, venir.",
        "Adjectives: agreement in gender and number; position (most follow the noun, but beau, bon, grand, gros, jeune, joli, mauvais, nouveau, petit, vieux go before).",
        "Reflexive verbs in the present: je me lève, tu te couches, il s'appelle, nous nous entendons bien.",
        "depuis + PRESENT tense for something still going on: J'apprends le français depuis cinq ans = I have been learning French for five years.",
        "Possessive adjectives mon / ma / mes — agree with the THING owned, not the owner; use mon before a feminine word starting with a vowel (mon amie, mon école).",
        "Vocabulary fields: alphabet and numbers; continents, countries and nationalities; colours; physical appearance and personal character; family and relationships; pets; friendship; greetings; French public holidays, fêtes and special occasions; clothes for going out; technology.",
      ],
    },
    {
      id: "u2-ville-campagne", num: 2, title: "Unité 2 — En ville et à la campagne · Town and country",
      blurb: "Describing places, giving directions, travelling, and the first past tense.",
      syllabus: [
        "IGCSE theme: C The world around us (the built environment, urban areas, the natural world), with A Everyday activities (travel and transport).",
        "pouvoir, devoir, vouloir + INFINITIVE: On peut visiter le château. Je dois partir. Elle veut rester.",
        "The pronoun y replaces à / en / dans / sur + a PLACE, and sits before the verb: J'y vais tous les samedis.",
        "Negative expressions: ne … pas, ne … jamais, ne … plus, ne … rien, ne … personne, ne … que. Both halves wrap the verb; in the perfect they wrap the auxiliary (je n'ai rien vu) except personne, which follows the participle (je n'ai vu personne).",
        "After a negative, du / de la / des / un / une all collapse to de: Il n'y a pas de lait. (Exception: ne … que keeps them — je ne bois que de l'eau.)",
        "The perfect tense with avoir: avoir in the present + past participle. Regular participles: -er → -é, -ir → -i, -re → -u.",
        "The perfect tense with être: the 16 DR & MRS VANDERTRAMP verbs of motion and change of state — participle agrees with the subject (elle est partie, ils sont arrivés, elles sont descendues).",
        "Vocabulary fields: the region and the countryside; describing a town; location and directions; public transport, road and rail travel; travel problems; town-versus-country opinions; travel by air.",
      ],
    },
    {
      id: "u3-bon-sejour", num: 3, title: "Unité 3 — Bon séjour! · Have a good stay!",
      blurb: "Future plans, si sentences, staying with a family, and reflexive verbs in the past.",
      syllabus: [
        "IGCSE theme: B Personal and social life (in the home, self and family), with A Everyday activities (time expressions).",
        "Le futur proche (aller + infinitive) for the near or planned future: Je vais prendre le train demain.",
        "Le futur simple: infinitive (drop -e from -re verbs) + -ai, -as, -a, -ons, -ez, -ont. Irregular stems ser-, aur-, ir-, fer-, pourr-, devr-, voudr-, viendr-, verr-, saur-, faudr-.",
        "si clauses, pattern 1: si + PRESENT → FUTURE. Si j'ai le temps, j'irai à la piscine. Never put a future after si itself.",
        "Emphatic (disjunctive) pronouns moi, toi, lui, elle, nous, vous, eux, elles — after prepositions (chez moi, avec eux) and for stress (Moi, je préfère la campagne).",
        "Questions in the perfect tense: inversion goes on the auxiliary — As-tu vu ce film ? Où sont-ils allés ? A-t-il fini ? (t euphonique).",
        "The perfect tense of reflexive verbs: always être, and the reflexive pronoun stays in front — je me suis levé(e), nous nous sommes bien amusés.",
        "Numbers, and formal versus informal language (vous versus tu) when you are a guest.",
        "Vocabulary fields: future plans; meeting people; staying with a host family; things to pack; rooms, furniture and fittings; kitchen utensils; household tasks; language difficulties; a theme-park visit; expressions of time; saying goodbye and thanking.",
      ],
    },
    {
      id: "u4-semaine-typique", num: 4, title: "Unité 4 — Une semaine typique · A typical week",
      blurb: "School life, shopping, technology, and how things used to be.",
      syllabus: [
        "IGCSE theme: D The world of work (education, the classroom, subjects, studying), with C The world around us (shopping, communications and technology).",
        "Obligation and prohibition: il faut / il ne faut pas + infinitive, on doit / on ne doit pas, il est interdit de, il est obligatoire de.",
        "The conditional for suggestions and softened opinions: on pourrait, il faudrait, je voudrais, j'aimerais, ce serait mieux si …",
        "The imperfect tense: take the nous form of the present, drop -ons, add -ais, -ais, -ait, -ions, -iez, -aient. Only être is irregular (ét-): j'étais, il y avait, c'était.",
        "Main uses of the imperfect: what used to happen, description and background, ongoing action interrupted by a perfect-tense event, and after quand for a repeated past habit.",
        "Demonstratives ce, cet, cette, ces ('this / that / these / those'); add -ci and -là to contrast (ce pull-ci, ce pull-là).",
        "quel / quelle / quels / quelles ('which, what') agree with the noun; lequel / laquelle / lesquels / lesquelles stand alone ('which one').",
        "Vocabulary fields: school life, the school day, premises and school years; school subjects and opinions about them; tests and results; the internet and technology; shops and departments; money and prices; presents and souvenirs; buying clothes, sizes, returns and refunds; jewellery, fashion and appearance.",
      ],
    },
    {
      id: "u5-bon-appetit", num: 5, title: "Unité 5 — Bon appétit! · Enjoy your meal!",
      blurb: "Meals, healthy eating, shopping for food, cafés and restaurants.",
      syllabus: [
        "IGCSE theme: A Everyday activities (food and drink — meals, fruit and vegetables, meat, fish, snacks, drinks, cutlery and utensils).",
        "The pronoun en replaces de / du / de la / des + noun, and any quantity: Tu veux du fromage ? — Oui, j'en veux. J'en ai trois.",
        "Direct object pronouns me, te, le, la, nous, vous, les — replace a noun with NO preposition: Je le prends.",
        "Indirect object pronouns me, te, lui, nous, vous, leur — replace à + a PERSON: Je téléphone à ma mère → Je lui téléphone.",
        "Watch the verbs that take à in French but look direct in English: téléphoner à, demander à, dire à, donner à, répondre à, offrir à.",
        "Using past tenses together: perfect for the completed events of the meal, imperfect for the setting and the reactions — Le serveur est arrivé pendant que nous regardions la carte.",
        "venir de + infinitive ('to have just'), aller + infinitive ('to be about to'), être en train de + infinitive ('to be in the middle of').",
        "Vocabulary fields: meals and regional specialities; meat, fish, fruit, vegetables; describing food; a family meal, accepting and refusing politely; healthy eating and vegetarianism; food shops and provisions; snacks and drinks; ordering at the café; booking a table, the menu, paying, and complaints.",
      ],
    },
    {
      id: "u6-ca-minteresse", num: 6, title: "Unité 6 — Ça m'intéresse · That interests me",
      blurb: "Leisure, music, sport, TV, reading and film — plus comparing and the pluperfect.",
      syllabus: [
        "IGCSE theme: B Personal and social life (leisure time, things to do, hobbies, sport).",
        "jouer à + a sport or game (je joue au tennis, aux cartes) versus jouer de + a musical instrument (je joue du piano, de la guitare).",
        "faire de + activity: je fais du vélo, de la natation, de l'équitation, des randonnées.",
        "Common adverbs and their formation: feminine adjective + -ment (lente → lentement); irregulars bien, mal, vite, mieux.",
        "Comparatives: plus / moins / aussi + adjective + que. Irregular: bon → meilleur (adjective), bien → mieux (adverb).",
        "Superlatives: le / la / les plus (or moins) + adjective; 'in' after a superlative is de — la plus grande ville de France. Irregular: le meilleur, le mieux, le pire.",
        "Direct object pronouns to avoid repetition, including with two pronouns: Il me l'a prêté. Je le lui ai rendu.",
        "The pluperfect tense: imperfect of avoir or être + past participle — for what had already happened before another past event. Le film avait déjà commencé quand nous sommes arrivés.",
        "Vocabulary fields: hobbies and free time; music and the radio; sport and sporting events; TV programmes; books and reading; the internet; cinema and films; what's on, making suggestions, accepting and refusing; excuses and apologies.",
      ],
    },
    {
      id: "u7-nouveaux-horizons", num: 7, title: "Unité 7 — Nouveaux horizons · New horizons",
      blurb: "Holidays, hotels, camping, weather — and the conditional for the ideal trip.",
      syllabus: [
        "IGCSE theme: C The world around us (the natural world, climate and weather) and E The international world (countries, nationalities, culture and customs).",
        "Prepositions with places: en + feminine country (en France, en Espagne), au + masculine (au Portugal, au Canada), aux + plural (aux États-Unis), à + town (à Paris).",
        "The future tense across a whole paragraph: L'année prochaine, je partirai en Italie, je logerai chez ma tante et nous visiterons Rome.",
        "The conditional: the FUTURE stem + the IMPERFECT endings (-ais, -ais, -ait, -ions, -iez, -aient). je voudrais, j'aimerais, on pourrait, ce serait.",
        "si clauses, pattern 2: si + IMPERFECT → CONDITIONAL. Si j'avais plus d'argent, je voyagerais au Sénégal.",
        "avoir lieu ('to take place'): Le festival a lieu au mois de juillet.",
        "'Before' and 'after' + verb: avant de + infinitive (avant de partir), après avoir / après être + past participle (après avoir mangé, après être arrivés).",
        "Mixing time frames deliberately — past holiday, usual preference, future plan — which is exactly what the top Paper 4 band rewards.",
        "'False friends' (faux amis): librairie = bookshop, sensible = sensitive, actuellement = currently, éventuellement = possibly, assister à = to attend, rester = to stay, location = hire, la monnaie = change, un car = a coach, large = wide.",
        "Vocabulary fields: types of holiday; at the seaside; countries and continents; hotels and problems; the weather; camping and equipment; the tourist office; staying in a gîte; youth hostelling and activity holidays.",
      ],
    },
    {
      id: "u8-a-votre-sante", num: 8, title: "Unité 8 — À votre santé! · To your health!",
      blurb: "The body, illness and accidents, healthy living, and the present participle.",
      syllabus: [
        "IGCSE theme: A Everyday activities (the human body and health — parts of the body, health and illness).",
        "Reflexive verbs with parts of the body: je me suis cassé le bras, elle s'est fait mal au genou. Use le / la, never mon / ma, with the body part.",
        "No past-participle agreement when the body part follows: Elle s'est lavé les mains (les mains is the direct object and comes AFTER).",
        "The imperative: drop the subject pronoun; -er verbs lose the -s in the tu form (Mange ! Va ! but Vas-y !). Negative imperative wraps it: Ne bouge pas !",
        "Expressions with avoir: avoir mal à, avoir chaud, avoir froid, avoir faim, avoir soif, avoir peur, avoir sommeil, avoir besoin de, avoir envie de, avoir … ans.",
        "Relative pronouns qui (subject — followed by a verb) and que (object — followed by a subject). Le médecin qui m'a soigné / le médicament que j'ai pris.",
        "en + the present participle ('while / by doing'): take the nous form, drop -ons, add -ant. Il s'est blessé en jouant au rugby. Irregular: étant, ayant, sachant.",
        "Vocabulary fields: parts of the body; describing pain and injury; at the chemist's, the doctor's and the dentist's; emergencies, warnings and instructions; teenage worries and feelings; smoking, alcohol and drugs; healthy and unhealthy lifestyles; common abbreviations and acronyms.",
      ],
    },
    {
      id: "u9-projets-davenir", num: 9, title: "Unité 9 — Projets d'avenir · Future plans",
      blurb: "Exams, revision, work experience, careers and job adverts.",
      syllabus: [
        "IGCSE theme: D The world of work (education and training, jobs and careers, the workplace).",
        "Talking about plans across three strengths: je vais + infinitive (definite), j'espère / je compte + infinitive (intention), je voudrais / j'aimerais + infinitive (wish).",
        "pendant (a completed duration — J'ai travaillé pendant deux semaines), depuis (still going on — J'étudie le français depuis cinq ans), pour (an intended future duration — Je pars pour un an).",
        "Verbs followed by an infinitive: some take nothing (vouloir, pouvoir, devoir, espérer, aimer), some take à (commencer à, apprendre à, aider à, réussir à, continuer à), some take de (essayer de, décider de, oublier de, refuser de, arrêter de, avoir besoin de).",
        "Direct object pronouns in the perfect tense: the pronoun goes before the auxiliary and the past participle AGREES with it. Ces lettres ? Je les ai écrites hier.",
        "quand + FUTURE tense where English uses the present: Quand j'aurai mon diplôme, je travaillerai à l'étranger. Same for lorsque, dès que and aussitôt que.",
        "Vocabulary fields: exams and revision techniques; work experience and the workplace; jobs, careers and further education; unemployment; job adverts, qualities and skills; applying and interviews.",
      ],
    },
  ],

  flashcards: [
    { term: "Le présent — regular endings", def: "-er: -e, -es, -e, -ons, -ez, -ent · -ir: -is, -is, -it, -issons, -issez, -issent · -re: -s, -s, –, -ons, -ez, -ent." },
    { term: "depuis + présent", def: "Still going on now, so French uses the PRESENT where English uses 'have been'. J'habite ici depuis trois ans = I have lived here for three years." },
    { term: "Reflexive verbs (present)", def: "Pronoun before the verb: je me lève, tu te couches, il se réveille, nous nous entendons, vous vous amusez, ils s'habillent." },
    { term: "Adjective agreement", def: "Add -e for feminine, -s for plural, -es for both. Endings already in -e don't change (facile). Irregulars: beau/belle, vieux/vieille, blanc/blanche, heureux/heureuse." },
    { term: "Adjective position", def: "Most go AFTER the noun (une voiture rouge). Before the noun: beau, bon, grand, gros, jeune, joli, long, mauvais, nouveau, petit, vieux — une vieille maison blanche." },
    { term: "mon / ma / mes", def: "Agrees with the thing owned, not the owner: son frère = his OR her brother. Use mon (not ma) before a feminine vowel: mon amie, mon école." },
    { term: "pouvoir / devoir / vouloir", def: "Always followed by a bare infinitive: Je peux venir. Tu dois partir. Elle veut rester." },
    { term: "Le pronom y", def: "Replaces à / en / dans / sur + a place or a thing. Goes before the verb: J'y vais. Il y en a trois. Also in s'y intéresser: je m'y intéresse." },
    { term: "Le pronom en", def: "Replaces de / du / de la / des + noun, and any quantity: Tu veux du gâteau ? — Oui, j'en veux. J'en ai acheté deux." },
    { term: "Negatives", def: "ne … pas / jamais / plus / rien / personne / que wrap the verb. In the perfect they wrap the AUXILIARY: je n'ai rien dit — except personne: je n'ai vu personne." },
    { term: "de after a negative", def: "un, une, du, de la, des all become de: Il n'y a pas de pain. Je ne mange jamais de viande. (ne … que is the exception: je ne bois que du thé.)" },
    { term: "Passé composé with avoir", def: "avoir (present) + past participle. -er → -é, -ir → -i, -re → -u. J'ai regardé, tu as fini, il a vendu. No agreement — unless a direct object comes first." },
    { term: "DR & MRS VANDERTRAMP", def: "The 16 être verbs: Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir." },
    { term: "Passé composé with être", def: "Participle agrees with the SUBJECT like an adjective: il est allé, elle est allée, ils sont allés, elles sont allées." },
    { term: "Reflexive verbs in the perfect", def: "Always être, pronoun stays before the auxiliary: je me suis levé(e), nous nous sommes amusés, elles se sont couchées." },
    { term: "No agreement: s'est lavé les mains", def: "A reflexive verb takes no agreement when a direct object FOLLOWS: Elle s'est lavé les mains. Compare: Elle s'est lavée (no following object → agreement)." },
    { term: "Preceding direct object (PDO)", def: "With avoir, the participle agrees with a direct object placed BEFORE it: Les lettres que j'ai écrites. Je les ai vues. Quelle robe as-tu choisie ?" },
    { term: "Futur proche vs futur simple", def: "aller + infinitive = near/arranged (Je vais sortir ce soir). Futur simple = later or less certain (Je sortirai quand j'aurai fini)." },
    { term: "Future stems (irregular)", def: "être → ser-, avoir → aur-, aller → ir-, faire → fer-, pouvoir → pourr-, devoir → devr-, vouloir → voudr-, venir → viendr-, voir → verr-, savoir → saur-, falloir → faudr-." },
    { term: "Future endings", def: "-ai, -as, -a, -ons, -ez, -ont, added to the infinitive (drop the -e of -re verbs): je parlerai, tu finiras, il vendra." },
    { term: "Le conditionnel", def: "Future STEM + imperfect ENDINGS (-ais, -ais, -ait, -ions, -iez, -aient): je voudrais, j'aimerais, on pourrait, ce serait, il faudrait." },
    { term: "si clauses", def: "si + présent → futur (Si j'ai le temps, j'irai). si + imparfait → conditionnel (Si j'avais le temps, j'irais). Never a future or conditional directly after si." },
    { term: "L'imparfait", def: "nous form of the present, drop -ons, add -ais, -ais, -ait, -ions, -iez, -aient. Only irregular: être → ét- (j'étais). il y avait, c'était." },
    { term: "Imparfait vs passé composé", def: "Imparfait = background, description, repeated habit ('used to', 'was …-ing'). Passé composé = one completed event that moves the story on." },
    { term: "Le plus-que-parfait", def: "Imperfect of avoir/être + past participle = 'had done'. J'avais déjà mangé. Elle était partie avant mon arrivée." },
    { term: "Object pronouns", def: "Direct: me, te, le, la, nous, vous, les. Indirect (= à + person): me, te, lui, nous, vous, leur. Je lui téléphone = I phone him/her." },
    { term: "Pronoun order", def: "me / te / se / nous / vous → le / la / les → lui / leur → y → en, all BEFORE the verb. Il me l'a donné. Je le lui ai expliqué. Il y en a." },
    { term: "Emphatic pronouns", def: "moi, toi, lui, elle, nous, vous, eux, elles — after prepositions (chez moi, avec eux, pour elle) and for emphasis (Moi, je préfère la ville)." },
    { term: "Comparatives", def: "plus / moins / aussi + adjective + que: Il est plus grand que moi. Irregular: bon → meilleur (adjective), bien → mieux (adverb)." },
    { term: "Superlatives", def: "le / la / les plus (moins) + adjective; 'in' becomes de: la plus grande ville de France. Irregular: le meilleur, le mieux, le pire." },
    { term: "venir de + infinitif", def: "'To have just': Je viens de finir = I have just finished. In the imperfect: Elle venait de partir = she had just left." },
    { term: "en + participe présent", def: "nous form minus -ons, plus -ant, meaning 'while/by doing': Il s'est blessé en jouant. Irregular: étant, ayant, sachant." },
  ],

  questions: [
    // Unité 1 — questions, adjectives
    {
      id: "if10-1", topic: "u1-jeunes-sans-frontieres",
      q: "You want to ask a classmate 'Where do you live?'. Which version is correct French?",
      opts: ["Où tu habites ?", "Où est-ce que tu habites ?", "Où habites-tu ?", "All three are correct"],
      a: "All three are correct",
      model: "French has three question registers and all three are accepted: rising intonation (Où tu habites ?) in speech, est-ce que (Où est-ce que tu habites ?) as the safe all-purpose form, and inversion (Où habites-tu ?) which reads as the most formal. Use est-ce que in Paper 3 if you are hesitating — it never goes wrong.",
      hint: "Think about register, not about one 'right' answer.",
    },
    {
      id: "if10-2", topic: "u1-jeunes-sans-frontieres",
      q: "Choose the correct sentence for 'It's a beautiful old white house.'",
      opts: [
        "C'est une belle vieille maison blanche.",
        "C'est une beau vieux maison blanc.",
        "C'est une maison belle vieille blanche.",
        "C'est une blanche belle maison vieille.",
      ],
      a: "C'est une belle vieille maison blanche.",
      model: "beau and vieux are on the short 'before the noun' list, so they go first and take feminine forms belle and vieille. blanche is a colour, so it follows the noun and agrees: maison is feminine → blanche, not blanc.",
    },
    {
      id: "if10-3", topic: "u1-jeunes-sans-frontieres",
      q: "Complétez : « J'____ le français ____ cinq ans. » (I have been learning French for five years.)",
      opts: ["ai appris / pendant", "apprends / depuis", "apprenais / depuis", "vais apprendre / pour"],
      a: "apprends / depuis",
      model: "J'apprends le français depuis cinq ans. The action is still going on, so French uses the PRESENT with depuis where English uses 'have been …-ing'. Writing j'ai appris here says you finished five years ago.",
    },

    // Unité 2 — perfect tense, y, negatives
    {
      id: "if10-4", topic: "u2-ville-campagne",
      q: "Complétez : « Samedi dernier, nous ____ (visiter) le vieux port. »",
      opts: ["avons visité", "sommes visités", "avons visiter", "visitions"],
      a: "avons visité",
      model: "visiter is not on the être list, so: avoir in the present + past participle. -er verbs make their participle in -é → nous avons visité. Note the trap in 'avons visiter': the participle is visité, never the infinitive.",
    },
    {
      id: "if10-5", topic: "u2-ville-campagne",
      q: "Complétez : « Ma sœur ____ (partir) à sept heures et elle ____ (rentrer) très tard. »",
      opts: ["a parti / a rentré", "est parti / est rentré", "est partie / est rentrée", "s'est partie / s'est rentrée"],
      a: "est partie / est rentrée",
      model: "partir and rentrer are both DR & MRS VANDERTRAMP verbs, so they take être — and after être the past participle agrees with the subject. Ma sœur is feminine singular → partie, rentrée.",
      hint: "Which auxiliary, and then: who is doing it?",
    },
    {
      id: "if10-6", topic: "u2-ville-campagne",
      q: "« Tu vas souvent au marché ? » — « Oui, j'____ vais tous les samedis. »",
      opts: ["y", "en", "le", "lui"],
      a: "y",
      model: "y replaces à / au / à la / en + a PLACE, and stands in front of the verb: j'y vais. Use en instead when the phrase starts with de (J'en viens = I've just come from there).",
    },
    {
      id: "if10-7", topic: "u2-ville-campagne",
      q: "« Il y a du lait dans le frigo ? » — « Non, il n'y a ____ lait. »",
      opts: ["pas de", "pas du", "pas le", "pas d'un"],
      a: "pas de",
      model: "After a negative, du / de la / des / un / une all collapse to de: il n'y a pas de lait, je n'ai pas de frères, elle ne mange jamais de viande. The one exception is ne … que, which keeps the full article: je ne bois que du lait.",
    },

    // Unité 3 — si clauses, reflexive perfect, translation
    {
      id: "if10-8", topic: "u3-bon-sejour",
      q: "Complétez : « Si j'ai le temps demain, je ____ (aller) à la piscine avec toi. »",
      opts: ["vais", "irai", "irais", "allais"],
      a: "irai",
      model: "Pattern si + PRESENT → FUTURE. aller has the irregular future stem ir-, plus the ending -ai for je → j'irai. Putting a future or conditional straight after si is one of the most heavily penalised errors on the paper.",
    },
    {
      id: "if10-9", topic: "u3-bon-sejour",
      q: "Complétez : « Mes cousines ____ (se lever) tard et elles ____ (s'amuser) toute la journée. »",
      opts: [
        "se sont levées / se sont amusées",
        "se sont levé / se sont amusé",
        "ont se levé / ont s'amusé",
        "sont levées / sont amusées",
      ],
      a: "se sont levées / se sont amusées",
      model: "Reflexive verbs always take être in the perfect, the reflexive pronoun stays in front of the auxiliary, and the participle agrees with the subject. Mes cousines is feminine plural → -ées on both.",
    },
    {
      id: "if10-10", topic: "u3-bon-sejour",
      q: "Traduisez en français : 'Last summer I spent three weeks in Nice at my cousins' house. We went to the beach every day and we had a great time.'",
      model: "L'été dernier, j'ai passé trois semaines à Nice chez mes cousins. Nous sommes allés à la plage tous les jours et nous nous sommes bien amusés. — Three separate auxiliary decisions: passer takes avoir (no agreement); aller is on the être list (→ allés); s'amuser is reflexive so it also takes être (→ amusés). 'at someone's house' is chez, never à la maison de.",
    },

    // Unité 4 — imperfect, imperfect vs perfect, translation
    {
      id: "if10-11", topic: "u4-semaine-typique",
      q: "Complétez : « Quand j'étais petit, j'____ (habiter) à Lyon et je ____ (faire) du judo tous les mercredis. »",
      opts: ["habitais / faisais", "ai habité / ai fait", "habiterai / ferai", "habitais / ai fait"],
      a: "habitais / faisais",
      model: "Both verbs describe a repeated past habit ('used to'), so both are imperfect. faire → nous faisons → stem fais- → je faisais. Watch the spelling: faisais, not fesais.",
    },
    {
      id: "if10-12", topic: "u4-semaine-typique",
      q: "Complétez : « Je ____ (réviser) dans ma chambre quand mon portable ____ (sonner). »",
      opts: ["révisais / a sonné", "ai révisé / sonnait", "révisais / sonnait", "ai révisé / a sonné"],
      a: "révisais / a sonné",
      model: "The classic split: the imperfect sets the scene that was already running (je révisais = I was revising), and the perfect is the single event that cuts into it (le portable a sonné). If you can say 'was …-ing' in English, use the imperfect.",
      hint: "One verb is the background, one is the interruption.",
    },
    {
      id: "if10-13", topic: "u4-semaine-typique",
      q: "Traduisez en anglais : « Avant, je détestais les maths, mais depuis deux ans j'ai un prof génial et maintenant je m'y intéresse beaucoup. »",
      model: "'I used to hate maths, but for two years I have had a brilliant teacher and now I'm really interested in it.' — Two traps in one sentence. je détestais is the imperfect, so 'used to hate', not 'hated'. j'ai … depuis deux ans is a French present with depuis, so English needs 'have had' — 'I have a teacher for two years' is not English. je m'y intéresse: s'intéresser à + y = 'to be interested in it'.",
    },

    // Unité 5 — en, indirect object, venir de
    {
      id: "if10-14", topic: "u5-bon-appetit",
      q: "« Tu veux du fromage ? » — Répondez en utilisant un pronom.",
      opts: ["Oui, j'en veux, merci.", "Oui, je le veux, merci.", "Oui, j'y veux, merci.", "Oui, je veux en, merci."],
      a: "Oui, j'en veux, merci.",
      model: "du fromage begins with du, so the pronoun is en, and it goes before the verb: j'en veux. Use le only for a definite noun (le fromage → je le veux = I want that particular cheese).",
    },
    {
      id: "if10-15", topic: "u5-bon-appetit",
      q: "Remplacez « à mes parents » par un pronom : « Je téléphone à mes parents tous les soirs. »",
      opts: ["Je les téléphone tous les soirs.", "Je leur téléphone tous les soirs.", "J'y téléphone tous les soirs.", "Je lui téléphone tous les soirs."],
      a: "Je leur téléphone tous les soirs.",
      model: "téléphoner takes à before a person, so the pronoun is indirect: lui for one person, leur for several. English 'I phone them' hides the à, which is exactly why téléphoner, dire, demander, répondre, donner and offrir are worth memorising as a group.",
    },
    {
      id: "if10-16", topic: "u5-bon-appetit",
      q: "Traduisez en français : 'I have just finished my homework, so I am going to watch a film with my brother.'",
      model: "Je viens de finir mes devoirs, donc je vais regarder un film avec mon frère. — venir de + infinitive is the French for 'to have just', and it stays in the PRESENT: je viens de finir, never j'ai venu de finir. Then aller + infinitive for the near future.",
    },

    // Unité 6 — comparatives, pluperfect
    {
      id: "if10-17", topic: "u6-ca-minteresse",
      q: "Complétez : « À mon avis, ce film est ____ que l'autre, et l'actrice principale joue ____ . »",
      opts: ["plus bon / plus bien", "meilleur / mieux", "mieux / meilleur", "meilleur / plus bien"],
      a: "meilleur / mieux",
      model: "bon is an adjective and its comparative is meilleur (never plus bon). bien is an adverb and its comparative is mieux (never plus bien). Test: if it describes a NOUN use meilleur; if it describes a VERB use mieux.",
    },
    {
      id: "if10-18", topic: "u6-ca-minteresse",
      q: "Complétez : « Quand nous sommes arrivés au cinéma, le film ____ (déjà commencer). »",
      opts: ["a déjà commencé", "avait déjà commencé", "commençait déjà", "était déjà commencé"],
      a: "avait déjà commencé",
      model: "The film started BEFORE the other past action, so you need the pluperfect: imperfect of avoir + past participle → avait commencé. déjà slots between the auxiliary and the participle, exactly as in the perfect tense.",
    },

    // Unité 7 — conditional, extended writing
    {
      id: "if10-19", topic: "u7-nouveaux-horizons",
      q: "Complétez : « Si j'avais plus d'argent, je ____ (voyager) au Sénégal et je ____ (pouvoir) voir ma famille. »",
      opts: ["voyagerai / pourrai", "voyagerais / pourrais", "voyageais / pouvais", "voyagerais / pourrai"],
      a: "voyagerais / pourrais",
      model: "Pattern si + IMPERFECT → CONDITIONAL. The conditional is the future stem plus imperfect endings: voyager- + -ais → voyagerais; pouvoir has the stem pourr- → pourrais. The single letter separating je voyagerai (future, 'I will travel') from je voyagerais (conditional, 'I would travel') is worth checking twice.",
      hint: "j'avais is imperfect — so what must the other half be?",
    },
    {
      id: "if10-20", topic: "u7-nouveaux-horizons",
      q: "Paper 4, extended task (about 130–140 words). Vous écrivez un blog sur vos vacances. Décrivez des vacances récentes, dites quel type de vacances vous préférez et pourquoi, et expliquez ce que vous ferez ou aimeriez faire à l'avenir.",
      model: "Salut à tous ! Le mois dernier, je suis allé en Bretagne avec ma famille. Nous avons voyagé en train, parce que c'est plus écologique que l'avion, et nous sommes restés dans un petit gîte au bord de la mer. Le premier jour, il pleuvait, alors nous avons visité un musée. Ensuite, le temps est devenu magnifique et j'ai fait de la voile pour la première fois. Ce que j'ai préféré, c'étaient les crêpes ! Normalement, je préfère les vacances actives, car je trouve la plage un peu ennuyeuse. L'année prochaine, si mes parents sont d'accord, je retournerai en France avec mon collège. Un jour, j'aimerais visiter le Canada, parce que j'adore la nature et je voudrais améliorer mon français. Et vous, où irez-vous cet été ? — Why this scores: three clear time frames (perfect + imperfect, present opinion, future + conditional), two justified opinions with parce que / car, connectives ensuite and alors, and a question to the reader. If you are female, add the -e: je suis allée. Count your words; going far over does not earn more.",
    },

    // Unité 8 — present participle
    {
      id: "if10-21", topic: "u8-a-votre-sante",
      q: "Traduisez en français : 'He hurt himself while playing rugby and he had to go to hospital.'",
      model: "Il s'est blessé en jouant au rugby et il a dû aller à l'hôpital. — se blesser is reflexive so it takes être (s'est blessé, no extra -e because il is masculine). 'While playing' is en + present participle: nous jouons → jou- → jouant. And the past participle of devoir keeps its circumflex: dû.",
    },

    // Unité 9 — PDO agreement, directed writing
    {
      id: "if10-22", topic: "u9-projets-davenir",
      q: "Complétez : « Voici les lettres de motivation que j'ai ____ (écrire) hier soir. »",
      opts: ["écrit", "écrite", "écrits", "écrites"],
      a: "écrites",
      model: "The direct object (les lettres, feminine plural) comes BEFORE the verb, pulled forward by que — so the participle agrees with it: écrites. Same rule with a pronoun: Ces lettres ? Je les ai écrites. Move the object back after the verb (J'ai écrit des lettres) and the agreement disappears.",
      hint: "Where is the direct object standing — before or after the participle?",
    },
    {
      id: "if10-23", topic: "u9-projets-davenir",
      q: "Paper 4, directed writing (about 80–90 words). Écrivez un message à un(e) ami(e) français(e) sur votre stage en entreprise : où vous étiez, ce que vous faisiez, ce que vous avez pensé du stage, et vos projets pour l'avenir.",
      model: "Salut Léa ! La semaine dernière, j'ai fait un stage dans une agence de voyages en ville. Je commençais à neuf heures et je finissais à cinq heures. Je répondais au téléphone et j'aidais les clients à choisir leurs vacances. Au début, j'avais un peu peur, mais mes collègues étaient très gentils avec moi. Ce que j'ai trouvé difficile, c'était de rester assis toute la journée ! Quand j'aurai mon diplôme, je voudrais travailler à l'étranger, donc ce stage m'a beaucoup aidé. Et toi, qu'est-ce que tu as fait ? Amitiés, Sam — Note the two verbs that carry the marks here: the imperfect for the daily routine (je commençais, je répondais, j'aidais) against the perfect for the single verdict (j'ai fait, j'ai trouvé), and quand + FUTURE (quand j'aurai) where English would say 'when I have'.",
    },
  ],

  mistakes: [
    {
      mistake: "Using avoir with a DR & MRS VANDERTRAMP verb — « elle a allé au marché ».",
      fix: "Those 16 verbs of movement and change of state take être: elle EST allée. Learn them as one block and check the auxiliary before you check anything else.",
    },
    {
      mistake: "Getting the auxiliary right but forgetting the agreement — « elle est allé », « ils sont parti ».",
      fix: "After être the past participle behaves like an adjective: elle est allée, ils sont partis, elles sont parties. One vowel, one mark, every single time it appears.",
    },
    {
      mistake: "Forgetting participle agreement with a preceding direct object — « les photos que j'ai pris ».",
      fix: "With avoir, if the direct object stands BEFORE the verb (que, or a pronoun le/la/les), the participle agrees: les photos que j'ai prises, je les ai prises. If it comes after, no agreement: j'ai pris des photos.",
    },
    {
      mistake: "Adjective left in the masculine singular, or parked in English word order — « une maison blanc », « une rouge voiture ».",
      fix: "Agree it (blanche), then place it: colours, nationalities and long adjectives go AFTER the noun. Only the short list — beau, bon, grand, gros, jeune, joli, long, mauvais, nouveau, petit, vieux — goes before.",
    },
    {
      mistake: "Using the perfect where the imperfect is needed — « quand j'étais petit, j'ai joué au foot tous les jours ».",
      fix: "'Used to' and 'was …-ing' are imperfect: je jouais au foot tous les jours. Keep the perfect for one completed event that moves the account forward.",
    },
    {
      mistake: "Writing the infinitive instead of the past participle — « j'ai manger », « nous avons aller ».",
      fix: "-er and -é sound identical but only one is a participle. If there is an auxiliary in front, write -é: j'ai mangé. If a preposition or another verb is in front, write -er: je vais manger, avant de manger.",
    },
    {
      mistake: "Mixing tu and vous inside the same answer — « Vous habitez où ? Et ton frère ? »",
      fix: "Decide before you start: tu (and ton/ta/tes, toi) for a friend or a teenager; vous (and votre/vos) for an adult, a stranger, a shopkeeper or more than one person. In a Paper 3 role play with an official, stay on vous throughout.",
    },
    {
      mistake: "Confusing the future and the conditional — « si j'avais le temps, je voyagerai ».",
      fix: "-ai is future ('I will'), -ais is conditional ('I would'). Match the halves: si + présent → futur (si j'ai le temps, je voyagerai) and si + imparfait → conditionnel (si j'avais le temps, je voyagerais).",
    },
    {
      mistake: "Falling for faux amis — translating 'library' as librairie or 'actually' as actuellement.",
      fix: "librairie = bookshop (library = bibliothèque); actuellement = currently (actually = en fait); sensible = sensitive (sensible = raisonnable); éventuellement = possibly (eventually = finalement); assister à = to attend; rester = to stay (to rest = se reposer); location = hire; un car = a coach; large = wide.",
    },
    {
      mistake: "Dropping accents, or adding the wrong one, so the word changes meaning.",
      fix: "a (has) vs à (to); ou (or) vs où (where); sur (on) vs sûr (sure); la (the) vs là (there); du (of the) vs dû (had to). Also keep the cedilla in ça, français, commençait — without it the c is hard.",
    },
    {
      mistake: "Putting object pronouns after the verb, English-style — « je vois le », « je donne lui le livre ».",
      fix: "French pronouns sit BEFORE the verb, in the fixed order me/te/se/nous/vous → le/la/les → lui/leur → y → en. Je le vois. Je le lui donne. In the perfect they go before the auxiliary: je l'ai vu.",
    },
    {
      mistake: "Translating age, hunger and pain with être — « je suis quinze ans », « je suis mal à la tête ».",
      fix: "French uses avoir: j'ai quinze ans, j'ai faim, j'ai froid, j'ai peur, j'ai besoin de, and j'ai mal à la tête / au dos / aux dents.",
    },
  ],

  cheat: [
    {
      heading: "DR & MRS VANDERTRAMP — the 16 être verbs",
      bullets: [
        "Devenir (devenu) · Revenir (revenu) · Monter (monté) · Rester (resté) · Sortir (sorti) · Venir (venu)",
        "Aller (allé) · Naître (né) · Descendre (descendu) · Entrer (entré) · Rentrer (rentré) · Tomber (tombé)",
        "Retourner (retourné) · Arriver (arrivé) · Mourir (mort) · Partir (parti)",
        "Plus every reflexive verb: je me suis levé(e), nous nous sommes amusés.",
        "After être the participle agrees with the subject: il est allé · elle est allée · ils sont allés · elles sont allées.",
        "Trap: monter, descendre, sortir, rentrer and retourner switch to AVOIR when they take a direct object — J'ai monté la valise. Elle a sorti son passeport.",
      ],
    },
    {
      heading: "Le passé composé — build it in three moves",
      bullets: [
        "1. Choose the auxiliary: être for DR & MRS VANDERTRAMP and all reflexives, otherwise avoir.",
        "2. Form the participle: -er → -é, -ir → -i, -re → -u.",
        "3. Decide the agreement: with être, agree with the subject; with avoir, agree only with a direct object that comes first.",
        "Irregular participles worth memorising: avoir → eu, être → été, faire → fait, prendre → pris, mettre → mis, dire → dit, écrire → écrit, lire → lu, voir → vu, boire → bu, pouvoir → pu, vouloir → voulu, devoir → dû, savoir → su, recevoir → reçu, ouvrir → ouvert, offrir → offert, venir → venu, vivre → vécu, connaître → connu.",
        "Negatives wrap the AUXILIARY: je n'ai rien vu, il n'est jamais venu — except personne, which follows the participle: je n'ai vu personne.",
      ],
    },
    {
      heading: "L'imparfait — endings and when to reach for it",
      bullets: [
        "Stem: nous form of the present, minus -ons. nous finissons → finiss-, nous faisons → fais-, nous prenons → pren-. Only être is irregular: ét-.",
        "Endings: -ais, -ais, -ait, -ions, -iez, -aient. (The last three sound the same; the spelling is what is marked.)",
        "Use it for: what used to happen · description and background · weather and feelings in the past · an action already in progress when something else happened.",
        "Signposts: avant, autrefois, quand j'étais petit(e), tous les jours, d'habitude, souvent, chaque semaine.",
        "Keep the extra e in mangeais, commençait — the c and g must stay soft.",
        "Pluperfect = imperfect of avoir/être + participle: j'avais fini, elle était partie. Use it for 'had done', one step further back.",
      ],
    },
    {
      heading: "Le futur et le conditionnel — one stem, two sets of endings",
      bullets: [
        "Stem = the infinitive (drop the -e of -re verbs): parler-, finir-, vendr-.",
        "Future endings: -ai, -as, -a, -ons, -ez, -ont → je parlerai, tu finiras, il vendra.",
        "Conditional endings (the imperfect ones): -ais, -ais, -ait, -ions, -iez, -aient → je parlerais, tu finirais, il vendrait.",
        "Irregular stems, shared by BOTH tenses: être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-, pouvoir → pourr-, vouloir → voudr-, devoir → devr-, savoir → saur-, voir → verr-, envoyer → enverr-, falloir → faudr-, pleuvoir → pleuvr-.",
        "si + présent → futur · si + imparfait → conditionnel. Never a future or conditional immediately after si.",
        "quand, lorsque, dès que, aussitôt que take the FUTURE in French: Quand j'aurai dix-huit ans, je passerai mon permis.",
        "Ready-made conditional openers for Paper 3 and Paper 4: je voudrais, j'aimerais, on pourrait, il faudrait, ce serait génial si …",
      ],
    },
    {
      heading: "Pronouns — which one, and where it goes",
      bullets: [
        "Order, all before the verb: me / te / se / nous / vous → le / la / les → lui / leur → y → en.",
        "Direct (no preposition): le, la, les. Je le vois. Je les ai achetés.",
        "Indirect (à + a person): lui, leur. Je lui parle. Je leur ai écrit.",
        "y = à / en / dans / sur + place or thing. J'y vais. Elle s'y intéresse.",
        "en = de / du / de la / des + noun, or a quantity. J'en ai deux. Il y en a beaucoup.",
        "Emphatic: moi, toi, lui, elle, nous, vous, eux, elles — after prepositions and for stress. Chez moi. Avec eux. Moi, je préfère la ville.",
        "Relative: qui + a verb (l'ami qui habite à Nice) · que + a subject (le film que j'ai vu) · dont for 'whose / of which'.",
        "In the perfect the pronoun goes before the AUXILIARY, and a direct one triggers agreement: je les ai vues.",
      ],
    },
    {
      heading: "Asking questions — three ways plus the question words",
      bullets: [
        "Intonation (spoken): Tu viens ce soir ?",
        "est-ce que (safe everywhere): Est-ce que tu viens ce soir ?",
        "Inversion (most formal): Viens-tu ce soir ? In the perfect it goes on the auxiliary: As-tu vu ce film ? Add -t- for sound: A-t-il fini ?",
        "Question words: qui, que / qu'est-ce que, quoi, où, quand, comment, pourquoi, combien (de), depuis quand, à quelle heure.",
        "quel / quelle / quels / quelles agree with the noun: Quelle est ton adresse ? Quels sports fais-tu ?",
        "lequel / laquelle / lesquels / lesquelles stand alone: Lequel préfères-tu ?",
      ],
    },
    {
      heading: "Connectives, opinions and time markers — the Paper 4 toolkit",
      bullets: [
        "Linking: et, mais, aussi, ou, donc, alors, car, parce que, puisque, pourtant, cependant, par contre, d'abord, ensuite, puis, enfin, en plus, surtout.",
        "Opinions: à mon avis · je pense que · je trouve que · je crois que · selon moi · ce qui me plaît, c'est … · ce que je n'aime pas, c'est …",
        "Reactions: c'était génial / passionnant / inoubliable / décevant / ennuyeux · j'ai adoré · ça m'a beaucoup plu · je m'en souviens encore.",
        "Past time markers: hier, la semaine dernière, l'année dernière, il y a deux ans, autrefois, quand j'étais plus jeune.",
        "Future time markers: demain, la semaine prochaine, dans deux ans, à l'avenir, plus tard, un jour, dès que possible.",
        "Intensifiers that lift a plain sentence: très, vraiment, assez, un peu, trop, tellement, absolument.",
        "Two guaranteed marks: put one si sentence and one opinion + parce que into every extended answer.",
      ],
    },
    {
      heading: "The four papers — what each one actually asks for",
      bullets: [
        "All four papers are worth 25% each, and dictionaries are not allowed. Everything you write in the exam is written in French.",
        "Paper 1 · Listening — approximately 50 minutes (including 6 minutes to transfer answers), 40 marks, 37 multiple-choice and matching questions. Every recording is played twice: use the first play to get the gist and the second to confirm the detail. Watch for distractors — the recording often names all four options.",
        "Paper 2 · Reading — 1 hour, 45 marks in the 2025–2027 syllabus (40 marks from 2028), across six question groups: matching statements to pictures, public signs and notices, multiple choice on a short text, short answers in French on a longer text, matching people to what suits them, and short answers on an article. Answer in French where asked, and lift precisely — a wrong extra word can cancel a right one.",
        "Paper 3 · Speaking — approximately 10 minutes plus 10 minutes' preparation, 40 marks, marked by your teacher and moderated by Cambridge. Structure: an unassessed warm-up, one role play of five tasks (2 marks each), then two topic conversations marked out of 15 for Communication and 15 for Quality of Language. Develop answers — a justified reason scores far above a bare fact.",
        "Paper 4 · Writing — 1 hour, 45 marks in 2025–2027 (40 marks from 2028): Q1 a form-filling task with single words or short phrases (5 marks), Q2 a directed writing task of about 80–90 words (12 marks), Q3 a choice between an email/letter and an article/blog, about 130–140 words (28 marks).",
        "Q3 is worth more than half of Paper 4 — plan two minutes, write for the length asked, and cover EVERY bullet in the task. A brilliant answer that skips a bullet cannot reach the top band.",
        "Last two minutes on every written paper: check verb endings, then adjective endings, then accents. That order finds the most marks per second.",
      ],
    },
  ],
};
