// Cambridge Lower Secondary Mathematics — Stage 7.
// Curriculum framework 0862 (from 2020). Strands: Number; Algebra; Geometry and
// Measure; Statistics and Probability — plus Thinking and Working Mathematically,
// which runs through all four.
//
// GRADE ↔ STAGE: CNS Amanora maps Cambridge Primary to Grades 1–5 and Cambridge
// Lower Secondary to Grades 6–8, so this learner is in GRADE 6 but studies
// STAGE 7. The pack is registered with grade: 6 (the app matches on the
// learner's grade) while every line of copy says Stage 7. They are not the same
// number and must not be swapped.
//
// Textbook: Cambridge Lower Secondary Mathematics Learner's Book 7, Second
// edition — Lynn Byrd, Greg Byrd & Chris Pearce (Cambridge University Press),
// ISBN 978-1-108-77143-6, endorsed for 0862. Topics 1–16 below follow that
// book's 16 units in order; topic 17 is TWM, which the book threads through
// every unit rather than isolating.
//
// Verified 11 Aug 2026 objective-by-objective against the official 0862
// Curriculum Framework (2020), Stage 7 section: 7Ni.01–06, 7Np.01–02,
// 7Nf.01–11, 7Ae.01–07, 7As.01–07, 7Gg.01–14, 7Gp.01–06, 7Ss.01–05, 7Sp.01–05,
// and TWM.01–08.
//
// Deliberately EXCLUDED — these belong to Stage 8 or 9, not Stage 7:
// index laws aᵐ × aⁿ (8Ni.05); rounding to significant figures (8Np.02);
// percentage increase/decrease and absolute change (8Nf.05); ratios in
// different units and three-part ratios (8Nf.10, 8Nf.11); factorising and the
// distributive law with a single term (8Ae.03); changing the subject of a
// formula (8Ae.05); equations with the unknown on both sides; nth term rules of
// the form an + b; lines of the form y = mx + c; multiplying two negative
// numbers (7Ni.03 goes only as far as ONE negative integer — both negative is
// 8Ni.02); Pythagoras' theorem; circumference and area of a circle. Also
// excluded: TIME — the first-edition Checkpoint book had a Time unit, but the
// 0862 Stage 7 framework carries no time objectives at all.
//
// Stage 7 has no external exam — Checkpoint is sat at the end of Stage 9 — so
// this pack is written for mastering the year, not cramming for a paper.
// All question stems are original.

import type { ExamPack } from "../exam-pack";

export const CLS7_MATHS_PACK: ExamPack = {
  subjectId: "cls-maths",
  grade: 6,
  title: "Mathematics — Stage 7",
  context: "Cambridge Lower Secondary 0862 · Stage 7 (Grade 6) · CNS Amanora",
  highlights: [
    { label: "Framework", value: "0862 · from 2020" },
    { label: "Textbook", value: "Learner's Book 7 · 2nd ed." },
    { label: "Units", value: "16 + TWM" },
  ],
  pinnedRule: {
    heading: "Estimate first. Then calculate. Then check they agree.",
    body: "Six Stage 7 objectives literally begin with the word 'Estimate' — Cambridge means it. Before you work out 0.36 × 7, say 'about 0.4 × 7, so about 2.8'. Then do it properly: 2.52. Close enough — keep it. If your estimate said 2.8 and your answer says 25.2, you have found a slipped decimal point before it cost you anything. This one habit catches more errors at Stage 7 than any other, and it takes four seconds.",
  },
  reference: {
    label: "Cambridge Lower Secondary Mathematics (0862) — official curriculum page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/curriculum/mathematics/",
  },
  plan: [
    { title: "Walk the 16 units", hint: "Star the three you'd dread being tested on" },
    { title: "Learn the eight TWM moves", hint: "They're marked as much as the maths" },
    { title: "26 must-know facts", hint: "Flip the flashcards until they're instant" },
    { title: "Practice — 22 questions", hint: "Write every line, not just the answer" },
    { title: "Read the slip-ups list", hint: "Most lost marks live here" },
    { title: "Keep the cheat sheet nearby", hint: "One glance before any test" },
  ],

  topics: [
    {
      id: "1-integers", num: 1, title: "Integers",
      blurb: "Whole numbers including negatives — plus factors, multiples and roots.",
      syllabus: [
        "Estimate, add and subtract integers, including negative ones, and spot the pattern in what happens (7Ni.01).",
        "Order of operations: brackets first, then indices, then × and ÷, then + and − (7Ni.02).",
        "Estimate, multiply and divide integers where ONE of them is negative — e.g. −6 × 4 and −48 ÷ 6 (7Ni.03).",
        "Lowest common multiple and highest common factor for numbers under 100 (7Ni.04).",
        "Tests of divisibility (by 2, 3, 4, 5, 6, 8, 9, 10) to find factors of numbers above 100 (7Ni.05).",
        "Squares ↔ square roots, cubes ↔ cube roots, and why they undo each other (7Ni.06).",
      ],
    },
    {
      id: "2-expressions", num: 2, title: "Expressions, Formulae & Equations",
      blurb: "Letters standing in for numbers — build them, tidy them, solve them.",
      syllabus: [
        "Letters can represent an unknown, a variable or a constant (7Ae.01), and the ordinary rules of arithmetic still apply to them (7Ae.02).",
        "Collect like terms and expand a bracket with a number outside — 4(n + 3) = 4n + 12 (7Ae.03).",
        "Turn a sentence into an expression and back again, linear with whole-number coefficients (7Ae.04).",
        "Turn a sentence into a formula (one operation) and use it — e.g. wheels w on b bicycles: w = 2b (7Ae.05).",
        "Turn a sentence into an equation and solve it — integer coefficients, unknown on ONE side only (7Ae.06).",
        "A letter can stand for an open interval, e.g. x > 5 means every number bigger than 5 (7Ae.07).",
      ],
    },
    {
      id: "3-place-value", num: 3, title: "Place Value & Rounding",
      blurb: "Sliding digits along the place-value columns, and cutting numbers to size.",
      syllabus: [
        "Multiply and divide whole numbers and decimals by any positive power of 10 — 10, 100, 1000, 10⁴… (7Np.01).",
        "Every digit moves the same number of places; the decimal point is the fixed marker, not the thing that moves.",
        "Round a number to a given number of decimal places (7Np.02).",
        "Look at ONE digit — the first one you are throwing away — to decide up or down. 5 or more rounds up.",
        "Use rounding to estimate an answer before doing the real calculation.",
      ],
    },
    {
      id: "4-decimals", num: 4, title: "Decimals",
      blurb: "Ordering and calculating with decimals, positive and negative.",
      syllabus: [
        "Compare and order decimals and fractions by size using =, ≠, > and < (7Nf.06).",
        "Estimate, add and subtract positive AND negative decimals, even with different numbers of decimal places (7Nf.07).",
        "Line up the decimal points, and fill short numbers with zeros so every column has a digit.",
        "Estimate, multiply and divide decimals by whole numbers (7Nf.08).",
        "Use common factors, the laws of arithmetic and order of operations to make a decimal calculation easier before you start (7Nf.04).",
      ],
    },
    {
      id: "5-angles", num: 5, title: "Angles & Constructions",
      blurb: "Angle facts you can reason with, and lines you can draw accurately.",
      syllabus: [
        "Angles around a point add to 360°, and use that to find a missing angle (7Gg.12).",
        "Derive the fact that the angles in a quadrilateral add to 360°, and use it (7Gg.11).",
        "Angle properties on parallel lines with a transversal, on perpendicular lines and on intersecting lines (7Gg.13).",
        "Vertically opposite angles are equal; corresponding and alternate angles are equal; co-interior angles add to 180°.",
        "Draw parallel lines, perpendicular lines and quadrilaterals accurately with ruler, protractor and set square (7Gg.14).",
        "Always give the REASON with the answer — 'angles at a point = 360°', not just the number.",
      ],
    },
    {
      id: "6-collecting-data", num: 6, title: "Collecting Data",
      blurb: "Planning an investigation before you collect a single number.",
      syllabus: [
        "Choose and trial data-collection and sampling methods for a set of related statistical questions (7Ss.01).",
        "Decide what kind of data you need: categorical (colours, names), discrete (counts) or continuous (measurements).",
        "Understand how sample size affects what you can conclude — 10 people is a hint, 200 is evidence (7Ss.02).",
        "Spot a biased sample: asking only your friends does not tell you about the whole school.",
        "Design a data-collection sheet or questionnaire with clear, non-overlapping options.",
      ],
    },
    {
      id: "7-fractions", num: 7, title: "Fractions",
      blurb: "Adding mixed numbers, multiplying and dividing proper fractions.",
      syllabus: [
        "Estimate and add mixed numbers; write the answer as a mixed number in its simplest form (7Nf.02).",
        "Estimate, multiply and divide proper fractions (7Nf.03).",
        "To divide, multiply by the reciprocal — flip the SECOND fraction, then multiply.",
        "Use equivalent fractions and a common denominator to compare and order fractions (7Nf.06).",
        "Cancel common factors before multiplying — smaller numbers, fewer mistakes (7Nf.04).",
      ],
    },
    {
      id: "8-shapes-symmetry", num: 8, title: "Shapes & Symmetry",
      blurb: "Naming shapes by their properties — in 2D and 3D.",
      syllabus: [
        "Identify, describe and sketch regular polygons using sides, angles and symmetry (7Gg.01).",
        "Congruent 2D shapes: same shape AND same size, so corresponding sides and angles are equal (7Gg.02).",
        "The parts of a circle: centre, radius, diameter, circumference, chord, tangent (7Gg.03).",
        "Identify the combination of properties that pins down a specific 3D shape (7Gg.06).",
        "Draw and recognise the front, side and top views of a 3D shape (7Gg.08).",
        "Reflective symmetry (lines of symmetry) and order of rotational symmetry of 2D shapes and patterns (7Gg.10).",
      ],
    },
    {
      id: "9-sequences", num: 9, title: "Sequences & Functions",
      blurb: "Patterns with a rule — and machines that turn inputs into outputs.",
      syllabus: [
        "Term-to-term rules; generate sequences from number patterns and from spatial (dot/matchstick) patterns (7As.01).",
        "Describe an nth term rule algebraically — only the forms n + a, n − a and a × n at this stage (7As.02).",
        "A function is a relationship where each input has exactly ONE output (7As.03).",
        "Generate outputs from a given function, and work backwards to an input using inverse operations.",
        "Position-to-term (nth term) beats term-to-term when you want the 100th term without listing 99 others.",
      ],
    },
    {
      id: "10-percentages", num: 10, title: "Percentages",
      blurb: "Per hundred — and the fraction/decimal/percentage triangle.",
      syllabus: [
        "Fractions, terminating decimals and percentages can all name the same value (7Nf.01).",
        "Convert between all three: fraction → decimal by dividing, decimal → percentage by ×100.",
        "Find percentages of shapes and of whole numbers (7Nf.05).",
        "Percentages less than 1% (e.g. 0.5%) and greater than 100% (e.g. 150%) are real and used often.",
        "Build awkward percentages from easy ones: 10%, then 1%, then halve or add.",
      ],
    },
    {
      id: "11-graphs", num: 11, title: "Graphs",
      blurb: "Functions drawn as lines — and reading a story off a graph.",
      syllabus: [
        "Represent a situation in words or as a linear function in two variables — y = x + c or y = mx (7As.04).",
        "Build a table of values, plot the coordinate pairs and join them into a straight line (7As.05).",
        "Recognise straight-line graphs parallel to the x-axis (y = a) or the y-axis (x = a) (7As.06).",
        "Read and interpret graphs showing rates of change, and explain WHY the graph has that shape (7As.07).",
        "Steeper line = faster change; flat line = nothing changing.",
      ],
    },
    {
      id: "12-ratio", num: 12, title: "Ratio & Proportion",
      blurb: "Comparing quantities, and scaling them up or down fairly.",
      syllabus: [
        "Use the unitary method (find one, then find many) for ratio and direct proportion problems (7Nf.09).",
        "Simplify and compare ratios using equivalence — same units only at this stage (7Nf.10).",
        "Divide an amount into a given ratio with two parts (7Nf.11).",
        "Count the total number of parts first: 4 : 5 means 9 parts, not 4 or 5.",
        "A ratio compares part to part; a fraction compares part to whole. 4 : 5 is 4/9 of the total.",
      ],
    },
    {
      id: "13-probability", num: 13, title: "Probability",
      blurb: "How likely something is — as a number between 0 and 1.",
      syllabus: [
        "Use probability language to describe, compare, order and interpret how likely outcomes are (7Sp.01).",
        "Probabilities run from 0 (impossible) to 1 (certain), and can be written as fractions, decimals or percentages (7Sp.02).",
        "List all the mutually exclusive outcomes of a single event, and say whether they are equally likely (7Sp.03).",
        "Theoretical probability of equally likely outcomes = favourable ÷ total (7Sp.04).",
        "Design and run chance experiments with small and large numbers of trials; use the frequencies to find experimental probabilities (7Sp.05).",
        "The probabilities of all the mutually exclusive outcomes add up to 1.",
      ],
    },
    {
      id: "14-position", num: 14, title: "Position & Transformation",
      blurb: "Where a shape is, and what happens when you move it.",
      syllabus: [
        "Use scale to interpret maps and plans (7Gp.01).",
        "Find the distance between two coordinates that share an x or a y value, without a grid (7Gp.02).",
        "Translation: match corresponding points between object and image, without a grid (7Gp.03).",
        "Reflect a 2D shape in the x-axis or y-axis; the image is congruent to the object (7Gp.04).",
        "Rotate a shape 90° or 180° about a centre of rotation; the image is congruent to the object (7Gp.05).",
        "Enlarge with a positive whole-number scale factor; the image is mathematically SIMILAR, not congruent (7Gp.06).",
      ],
    },
    {
      id: "15-area-volume", num: 15, title: "Shapes, Area & Volume",
      blurb: "Measuring flat space and solid space — with the right units.",
      syllabus: [
        "Convert between metric units of area: mm², cm², m² and hectares (7Gg.04).",
        "Derive and use area of a triangle = ½ × base × perpendicular height (7Gg.05).",
        "Find the area of compound shapes made from rectangles and triangles — split, calculate, add.",
        "Derive and use volume of a cube or cuboid = length × width × height, in mm³, cm³ and m³ (7Gg.07).",
        "Find the volume of compound shapes made from cuboids.",
        "Use area knowledge and the properties of cubes and cuboids to find surface area (7Gg.09).",
      ],
    },
    {
      id: "16-interpreting", num: 16, title: "Interpreting Results",
      blurb: "Turning collected data into a chart, an average and a conclusion.",
      syllabus: [
        "Record, organise and represent data, choosing and JUSTIFYING the representation: Venn and Carroll diagrams, tally charts, frequency and two-way tables, dual and compound bar charts, waffle diagrams, pie charts, frequency diagrams, line graphs, scatter graphs, infographics (7Ss.03).",
        "Use mode, median, mean and range to summarise a large data set (7Ss.04).",
        "Explain which average suits the context — the mean is dragged around by extreme values, the median is not.",
        "Interpret data and identify patterns within and between data sets to answer the original question (7Ss.05).",
        "Discuss conclusions honestly, including where the variation came from, and check them against your prediction.",
      ],
    },
    {
      id: "17-twm", num: 17, title: "Thinking & Working Mathematically",
      blurb: "The eight moves that make this a Cambridge course and not just a maths course.",
      syllabus: [
        "Specialising (TWM.01) — try a specific example and check whether it fits the criteria. Generalising (TWM.02) — spot the underlying pattern across many examples.",
        "Conjecturing (TWM.03) — form a mathematical question or idea worth testing. Convincing (TWM.04) — present evidence that justifies or challenges it.",
        "Characterising (TWM.05) — identify and describe the mathematical properties of an object. Classifying (TWM.06) — sort objects into groups by those properties.",
        "Critiquing (TWM.07) — compare two methods or answers and weigh their advantages and disadvantages. Improving (TWM.08) — refine an idea into a better one.",
        "These are never taught as a separate lesson — they are how you are expected to work in all sixteen units.",
        "One counter-example destroys a conjecture; a hundred supporting examples still do not prove one.",
      ],
    },
  ],

  flashcards: [
    { term: "Integer", def: "A whole number, positive, negative or zero: …, −3, −2, −1, 0, 1, 2, 3, …" },
    { term: "Order of operations", def: "Brackets → Indices → Division & Multiplication (left to right) → Addition & Subtraction (left to right)." },
    { term: "HCF", def: "Highest Common Factor — the biggest number that divides exactly into all the given numbers." },
    { term: "LCM", def: "Lowest Common Multiple — the smallest number that all the given numbers divide into exactly." },
    { term: "Test of divisibility (3 and 9)", def: "A number divides by 3 if its digits add to a multiple of 3; by 9 if its digits add to a multiple of 9." },
    { term: "Square root / cube root", def: "√49 = 7 because 7 × 7 = 49. ∛125 = 5 because 5 × 5 × 5 = 125. Roots undo powers." },
    { term: "Rounding to 2 d.p.", def: "Keep two digits after the point. Look at the THIRD digit only: 5 or more rounds up, less than 5 rounds down." },
    { term: "Multiplying by a power of 10", def: "×10 moves every digit one place LEFT, ×1000 three places left. Dividing moves them right. The point never moves — the digits do." },
    { term: "Terminating decimal", def: "A decimal that stops, like 0.375. It can always be written as an exact fraction." },
    { term: "Mixed number", def: "A whole number plus a proper fraction, like 4 7/20. Give fraction answers in simplest form." },
    { term: "Reciprocal", def: "The fraction turned upside down: the reciprocal of 2/5 is 5/2. Dividing by a fraction = multiplying by its reciprocal." },
    { term: "Percentage", def: "Out of 100. 37.5% = 37.5/100 = 0.375 = 3/8. Percentages can be under 1% or over 100%." },
    { term: "Ratio", def: "A part-to-part comparison of quantities in the same units, written a : b." },
    { term: "Unitary method", def: "Find the value of ONE item, then multiply up. 6 books cost ₹174 → 1 book ₹29 → 10 books ₹290." },
    { term: "Direct proportion", def: "When one quantity doubles, so does the other. Their ratio stays constant." },
    { term: "Like terms", def: "Terms with exactly the same letter part — 3n and 7n are like terms, 3n and 3n² are not. Only like terms can be collected." },
    { term: "Expression vs equation", def: "An expression (3n + 5) has no equals sign — you SIMPLIFY it. An equation (3n + 5 = 20) has one — you SOLVE it." },
    { term: "Distributive law", def: "The number outside the bracket multiplies EVERY term inside: 4(n + 3) = 4n + 12." },
    { term: "Term-to-term rule", def: "How to get from one term to the next: 4, 7, 10, 13 has the rule 'add 3'." },
    { term: "nth term rule", def: "A formula for any term from its position. At Stage 7 it takes the form n + a, n − a or a × n — e.g. 6, 12, 18 → 6n." },
    { term: "Function", def: "A relationship where every input gives exactly one output. Run it backwards with inverse operations to find an input." },
    { term: "Congruent vs similar", def: "Congruent = same shape AND same size (reflections, rotations, translations). Similar = same shape, different size (enlargements)." },
    { term: "Order of rotational symmetry", def: "How many times a shape looks identical during one full 360° turn. A regular hexagon has order 6." },
    { term: "Area of a triangle", def: "½ × base × perpendicular height. The height must be at right angles to the base, not a slanted side." },
    { term: "Hectare", def: "A unit of land area. 1 ha = 10 000 m². Also: 1 m² = 10 000 cm², 1 cm² = 100 mm²." },
    { term: "Mean, median, mode, range", def: "Mean = total ÷ how many. Median = middle of the ORDERED list. Mode = most common. Range = largest − smallest (a spread, not an average)." },
    { term: "Discrete vs continuous data", def: "Discrete is counted in whole steps (goals scored). Continuous is measured and can take any value in a range (height, time)." },
    { term: "Mutually exclusive outcomes", def: "Outcomes that cannot happen at the same time. For one event, all their probabilities add up to 1." },
  ],

  questions: [
    {
      id: "cm-1", topic: "1-integers",
      q: "At 6 p.m. the temperature at a hill station is 4 °C. By midnight it has fallen by 11 °C. What is the temperature at midnight?",
      opts: ["−7 °C", "7 °C", "−15 °C", "15 °C"],
      a: "−7 °C",
      model: "Start at 4 and count 11 downwards. Getting to 0 uses up 4 of those steps; the remaining 7 go below zero. 4 − 11 = −7 °C.",
      hint: "Below zero the numbers get bigger as they get colder — but more negative.",
    },
    {
      id: "cm-2", topic: "1-integers",
      q: "Work out 5 + 3 × 2².",
      opts: ["17", "32", "41", "256"],
      a: "17",
      model: "Indices first: 2² = 4. Then multiply: 3 × 4 = 12. Then add: 5 + 12 = 17. (32 comes from adding before multiplying; 41 from squaring 3 × 2; 256 from working straight left to right.)",
      hint: "Brackets → Indices → × ÷ → + −.",
    },
    {
      id: "cm-3", topic: "1-integers",
      q: "(a) Find the HCF of 36 and 84. (b) Find the LCM of 12 and 18. (c) Work out √169 + ∛64.",
      model: "(a) 36 = 2 × 2 × 3 × 3 and 84 = 2 × 2 × 3 × 7. The factors they share are 2 × 2 × 3 = 12, so HCF = 12.\n(b) 12 = 2 × 2 × 3 and 18 = 2 × 3 × 3. Take the most of each prime: 2 × 2 × 3 × 3 = 36, so LCM = 36. (Check: 36 ÷ 12 = 3 ✓, 36 ÷ 18 = 2 ✓.)\n(c) 13 × 13 = 169 so √169 = 13. 4 × 4 × 4 = 64 so ∛64 = 4. 13 + 4 = 17.",
      hint: "Highest Common Factor is small and divides IN; Lowest Common Multiple is big and they divide INTO it.",
    },
    {
      id: "cm-4", topic: "2-expressions",
      q: "Simplify 4(n + 3) + 2n − 5.",
      opts: ["6n + 7", "6n + 17", "4n + 10", "6n − 7"],
      a: "6n + 7",
      model: "Expand the bracket first — the 4 multiplies BOTH terms inside: 4(n + 3) = 4n + 12.\nNow 4n + 12 + 2n − 5.\nCollect like terms: 4n + 2n = 6n, and 12 − 5 = 7.\nAnswer: 6n + 7. (6n + 17 comes from adding the 5 instead of subtracting it; 4n + 10 from forgetting to multiply the 3 by 4.)",
    },
    {
      id: "cm-5", topic: "2-expressions",
      q: "Solve 5x − 7 = 33.",
      model: "Undo the operations in reverse order, doing the same thing to both sides.\n5x − 7 = 33\nAdd 7 to both sides:  5x = 40\nDivide both sides by 5:  x = 8\nCheck by substituting back: 5 × 8 − 7 = 40 − 7 = 33 ✓",
      hint: "Whatever you do to one side of the equals sign, do to the other.",
    },
    {
      id: "cm-6", topic: "3-place-value",
      q: "(a) Work out 4.6 ÷ 1000. (b) Round 4.348 to 1 decimal place and to 2 decimal places.",
      model: "(a) Dividing by 1000 = 10³ moves every digit three places to the right: 4.6 → 0.46 → 0.046 → 0.0046. So 4.6 ÷ 1000 = 0.0046.\n(b) To 1 d.p.: keep one digit after the point (4.3…) and look at the NEXT digit, which is 4. 4 is less than 5, so round down → 4.3.\nTo 2 d.p.: keep two digits (4.34…) and look at the next digit, 8. That is 5 or more, so round up → 4.35.\nNote you must go back to the ORIGINAL number each time. Rounding 4.348 → 4.35 → 4.4 is wrong.",
      hint: "One look, one decision. Never round a number that has already been rounded.",
    },
    {
      id: "cm-7", topic: "4-decimals",
      q: "(a) The temperature in a freezer is −2.4 °C. It rises by 7.15 °C. What is the new temperature? (b) Work out 0.36 × 7 and 9.6 ÷ 8.",
      model: "(a) −2.4 + 7.15. The rise is bigger than the starting depth, so the answer ends up positive: 7.15 − 2.40 = 4.75. New temperature = 4.75 °C.\n(b) Estimate first: 0.4 × 7 ≈ 2.8. Now 36 × 7 = 252, and there are 2 decimal places in the question, so 0.36 × 7 = 2.52 ✓ (close to the estimate).\n9.6 ÷ 8: estimate ≈ 1.2. 96 ÷ 8 = 12, so 9.6 ÷ 8 = 1.2 ✓",
      hint: "Write 7.15 − 2.40 with the decimal points lined up and a zero filling the gap.",
    },
    {
      id: "cm-8", topic: "5-angles",
      q: "(a) Three angles meet at a point and measure 145°, 87° and x. Find x. (b) A quadrilateral has three angles of 78°, 95° and 112°. Find the fourth angle.",
      model: "(a) Angles at a point add to 360°.\n145 + 87 = 232\nx = 360 − 232 = 128°\n(b) Angles in a quadrilateral add to 360° (you can see why: split it into two triangles, 180° + 180°).\n78 + 95 + 112 = 285\nFourth angle = 360 − 285 = 75°\nWrite the reason next to each answer — the reason is worth as much as the number.",
    },
    {
      id: "cm-9", topic: "6-collecting-data",
      q: "Which of these would give CONTINUOUS data?",
      opts: [
        "The height of each learner, measured in centimetres",
        "The number of goals scored in each match",
        "The favourite colour of each learner",
        "The shoe size of each learner",
      ],
      a: "The height of each learner, measured in centimetres",
      model: "Continuous data is MEASURED and can take any value in a range — a height could be 148.3 cm or 148.37 cm. Goals scored and shoe sizes go up in fixed steps, so they are discrete. Favourite colour is categorical — it isn't a number at all.",
      hint: "Ask: could the answer sit halfway between two of the others?",
    },
    {
      id: "cm-10", topic: "7-fractions",
      q: "Work out 2 3/5 + 1 3/4, giving your answer as a mixed number in its simplest form.",
      model: "Estimate first: about 2.6 + 1.75 ≈ 4.4.\nAdd the whole numbers: 2 + 1 = 3.\nAdd the fractions using a common denominator of 20:\n3/5 = 12/20 and 3/4 = 15/20\n12/20 + 15/20 = 27/20 = 1 7/20\nSo the total is 3 + 1 7/20 = 4 7/20.\n4 7/20 = 4.35 — close to the estimate ✓",
      hint: "27/20 is top-heavy — pull the whole number out of it.",
    },
    {
      id: "cm-11", topic: "7-fractions",
      q: "Work out 3/4 ÷ 2/5.",
      opts: ["1 7/8", "3/10", "8/15", "1 1/8"],
      a: "1 7/8",
      model: "Dividing by a fraction is the same as multiplying by its reciprocal — flip the SECOND fraction only.\n3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8\nSense check: 2/5 is less than 1, so dividing by it makes the answer bigger than 3/4 ✓ (3/10 comes from multiplying instead of dividing; 8/15 from flipping the wrong fraction.)",
      hint: "Flipping the wrong one is the classic slip. It's always the divisor.",
    },
    {
      id: "cm-12", topic: "8-shapes-symmetry",
      q: "A regular hexagon has how many lines of symmetry, and what is its order of rotational symmetry?",
      opts: ["6 lines, order 6", "3 lines, order 6", "6 lines, order 1", "12 lines, order 6"],
      a: "6 lines, order 6",
      model: "A regular polygon with n sides always has n lines of symmetry and rotational symmetry of order n. For a hexagon, n = 6.\nThe 6 lines are: 3 through opposite vertices and 3 through the midpoints of opposite sides.\nTurning it through 60° six times brings it back to the start, so the order is 6.",
      hint: "For any regular polygon, both numbers equal the number of sides.",
    },
    {
      id: "cm-13", topic: "9-sequences",
      q: "(a) A sequence starts 6, 12, 18, 24, … Write the term-to-term rule and the nth term rule, then find the 20th term. (b) For the function y = 3x, find y when x = −2, and find x when y = 27.",
      model: "(a) Term-to-term rule: add 6 each time.\nEvery term is 6 times its position (6 × 1 = 6, 6 × 2 = 12, 6 × 3 = 18), so the nth term rule is 6n.\n20th term = 6 × 20 = 120.\n(b) When x = −2: y = 3 × (−2) = −6 (one negative, so the answer is negative).\nWhen y = 27: undo the ×3 with ÷3, so x = 27 ÷ 3 = 9.\nCheck: 3 × 9 = 27 ✓",
      hint: "The nth term lets you jump straight to term 20 without writing out terms 5 to 19.",
    },
    {
      id: "cm-14", topic: "10-percentages",
      q: "Work out 0.5% of 400.",
      opts: ["2", "20", "200", "0.5"],
      a: "2",
      model: "Build it from something easy. 1% of 400 = 400 ÷ 100 = 4.\n0.5% is half of 1%, so 0.5% of 400 = 4 ÷ 2 = 2.\nSense check: 0.5% is a tiny slice, so the answer should be far smaller than 400 ✓ (20 is the answer to 5%, a common misread.)",
      hint: "Find 1% first, then scale.",
    },
    {
      id: "cm-15", topic: "10-percentages",
      q: "Write 3/8 as a decimal and as a percentage.",
      model: "Fraction → decimal: divide the top by the bottom.\n3 ÷ 8 = 0.375\nDecimal → percentage: multiply by 100.\n0.375 × 100 = 37.5%\nSo 3/8 = 0.375 = 37.5%. All three are names for the same value.\nSense check: 3/8 is a bit less than 1/2, and 37.5% is a bit less than 50% ✓",
      hint: "The fraction bar means 'divide'.",
    },
    {
      id: "cm-16", topic: "11-graphs",
      q: "Which of these lines is parallel to the x-axis?",
      opts: ["y = 4", "x = 4", "y = x", "y = 4x"],
      a: "y = 4",
      model: "y = 4 says: whatever x is, y is always 4. Every point sits at the same height, so the line is horizontal — parallel to the x-axis.\nx = 4 is the opposite: every point has x = 4, giving a vertical line parallel to the y-axis.\ny = x and y = 4x are slanted lines through the origin.",
      hint: "'y = a number' pins the height. Pinned height means flat.",
    },
    {
      id: "cm-17", topic: "12-ratio",
      q: "(a) Share ₹450 between two clubs in the ratio 4 : 5. (b) Six identical notebooks cost ₹174. What do ten cost?",
      model: "(a) Total parts = 4 + 5 = 9.\nOne part = 450 ÷ 9 = ₹50.\nFirst club: 4 × 50 = ₹200. Second club: 5 × 50 = ₹250.\nCheck: 200 + 250 = ₹450 ✓\n(b) Unitary method — find one first.\nOne notebook = 174 ÷ 6 = ₹29.\nTen notebooks = 29 × 10 = ₹290.\nCheck: 10 is a bit less than double 6, and 290 is a bit less than double 174 ✓",
      hint: "Add the parts of the ratio before you divide anything.",
    },
    {
      id: "cm-18", topic: "13-probability",
      q: "A fair spinner has 8 equal sections: 3 red, 4 blue and 1 green. What is the probability that it does NOT land on blue?",
      opts: ["1/2", "3/8", "1/8", "5/8"],
      a: "1/2",
      model: "Not blue means red OR green: 3 + 1 = 4 sections out of 8.\nP(not blue) = 4/8 = 1/2 = 0.5 = 50%.\nOr use the fact that mutually exclusive probabilities sum to 1: P(blue) = 4/8 = 1/2, so P(not blue) = 1 − 1/2 = 1/2 ✓ (3/8 forgets the green section.)",
      hint: "'Not blue' still includes every other colour on the spinner.",
    },
    {
      id: "cm-19", topic: "14-position",
      q: "Point A is at (−3, 5) and point B is at (6, 5). Find the distance AB, without drawing a grid.",
      model: "Both points have y = 5, so the line AB is horizontal and the distance is just the gap between the x-coordinates.\nDistance = 6 − (−3) = 6 + 3 = 9 units.\nSubtracting a negative is the same as adding — that's where this question is usually lost. Picture the number line: from −3 up to 0 is 3, then 0 up to 6 is 6, and 3 + 6 = 9 ✓",
      hint: "Same y means flat; count along the x-axis, through zero.",
    },
    {
      id: "cm-20", topic: "15-area-volume",
      q: "(a) A shape is made of a rectangle 10 cm by 6 cm with a triangle on top; the triangle has base 10 cm and perpendicular height 4 cm. Find the total area. (b) Find the volume and surface area of a cuboid 8 cm × 5 cm × 3 cm.",
      model: "(a) Split it into the two shapes you know.\nRectangle: 10 × 6 = 60 cm²\nTriangle: ½ × base × height = ½ × 10 × 4 = 20 cm²\nTotal area = 60 + 20 = 80 cm²\n(b) Volume = length × width × height = 8 × 5 × 3 = 120 cm³\nSurface area — three pairs of matching faces:\n(8 × 5) + (8 × 3) + (5 × 3) = 40 + 24 + 15 = 79\nSurface area = 2 × 79 = 158 cm²\nUnits matter: area is cm², volume is cm³.",
      hint: "Compound shape? Split it, work out each piece, then add.",
    },
    {
      id: "cm-21", topic: "16-interpreting",
      q: "Five houses on a street have these numbers of books: 3, 7, 7, 8, 45. Find the mean, median, mode and range. Which average best describes a typical house, and why?",
      model: "Order them first: 3, 7, 7, 8, 45.\nMean = (3 + 7 + 7 + 8 + 45) ÷ 5 = 70 ÷ 5 = 14\nMedian = the middle value of the ordered list = 7\nMode = the most common value = 7\nRange = 45 − 3 = 42\nThe median (or mode) describes a typical house better. The mean of 14 is larger than four of the five values — the single house with 45 books is an extreme value that drags the mean upwards. The mean is only fair when no value is way out on its own.",
      hint: "Order the list before you look for the middle. And notice which value looks out of place.",
    },
    {
      id: "cm-22", topic: "17-twm",
      q: "Maya says: 'When you multiply a whole number by 5, the answer always ends in 5.' Test her conjecture and, if it is wrong, improve it.",
      model: "SPECIALISE — try examples. 3 × 5 = 15 ✓ ends in 5. 7 × 5 = 35 ✓. Now 2 × 5 = 10 ✗ — ends in 0.\nThat single counter-example is enough: the conjecture is false. One example that breaks a rule beats any number of examples that fit it.\nIMPROVE it: 'When you multiply a whole number by 5, the answer ends in 0 or 5.'\nCONVINCE — say why: multiplying by 5 gives a multiple of 5, and every multiple of 5 ends in 0 or 5. More precisely, an odd number × 5 ends in 5 and an even number × 5 ends in 0, because an even number is 2 × something and 2 × 5 = 10.\nThat final sentence is the part worth most marks — it explains, rather than just listing more examples.",
      hint: "Hunt for the example that breaks it, not the ones that agree.",
    },
  ],

  mistakes: [
    { mistake: "Losing the sign when subtracting, e.g. writing 4 − 11 = 7.", fix: "Draw a quick number line and walk it. Starting at 4 and going down 11 lands you 7 BELOW zero: −7. If the number you take away is bigger, the answer is negative." },
    { mistake: "Treating 3 × 2² as (3 × 2)² = 36.", fix: "The index attaches to the 2 alone. Indices come before multiplication: 2² = 4 first, then 3 × 4 = 12." },
    { mistake: "Working left to right and getting 5 + 3 × 2 = 16.", fix: "Multiplication outranks addition wherever it appears: 3 × 2 = 6 first, then 5 + 6 = 11." },
    { mistake: "'Solving' an expression — turning simplify 4n + 12 into 4n + 12 = 0 and finding n.", fix: "No equals sign means no solution to find. An expression gets tidied; only an equation gets solved. Check for the = before you start." },
    { mistake: "Adding mixed numbers by adding the tops and the bottoms: 2 3/5 + 1 3/4 = 3 6/9.", fix: "Denominators must match before you add. Convert to twentieths: 12/20 + 15/20 = 27/20, then rebuild the mixed number." },
    { mistake: "Flipping the first fraction when dividing: 3/4 ÷ 2/5 = 4/3 × 2/5.", fix: "Only the divisor flips — the fraction AFTER the ÷ sign. Keep, change, flip: 3/4 × 5/2." },
    { mistake: "Rounding twice: 4.348 → 4.35 → 4.4 for 1 decimal place.", fix: "Always round the original number. For 1 d.p., look only at the second decimal digit (4), which rounds down: 4.3." },
    { mistake: "'Multiplying by 100 just adds two zeros', so 4.6 × 100 = 4.600.", fix: "Adding zeros only works for whole numbers. Move every digit two places left instead: 4.6 → 46 → 460." },
    { mistake: "Reading the ratio 4 : 5 as '4/5 of the money'.", fix: "A ratio compares part to part. Add the parts first: 4 + 5 = 9, so the first share is 4/9 of the total, not 4/5." },
    { mistake: "Mixing up perimeter and area — or giving an area in cm.", fix: "Perimeter is the distance around the edge (cm, m). Area is the space inside (cm², m²). Volume fills a solid (cm³, m³). Write the unit as you write the number." },
    { mistake: "Finding the median without sorting the data first.", fix: "Median means middle of the ORDERED list. Rewrite the numbers smallest to largest, then count in from both ends." },
    { mistake: "Calling three matching examples a proof.", fix: "Examples support a conjecture; they never prove it (TWM.04 Convincing). Either explain WHY it must always work, or find one counter-example that kills it." },
  ],

  cheat: [
    {
      heading: "Number — the order and the signs",
      bullets: [
        "Order of operations: Brackets → Indices → × and ÷ (left to right) → + and − (left to right).",
        "Adding a negative moves left; subtracting a negative moves right: 6 − (−3) = 6 + 3 = 9.",
        "Multiply or divide with ONE negative → the answer is negative: −6 × 4 = −24, −48 ÷ 6 = −8.",
        "Divisibility: by 2 if it ends even; by 3 if the digits add to a multiple of 3; by 4 if the last two digits divide by 4; by 5 if it ends 0 or 5; by 9 if the digits add to a multiple of 9; by 10 if it ends 0.",
        "√ and ² undo each other; ∛ and ³ undo each other. Know 1–15 squared and 1–5 cubed by heart.",
        "×10ⁿ moves every digit n places left; ÷10ⁿ moves them n places right. The point stays put.",
      ],
    },
    {
      heading: "Fractions ⇄ decimals ⇄ percentages",
      bullets: [
        "Fraction → decimal: divide top by bottom. Decimal → percentage: × 100. Percentage → decimal: ÷ 100.",
        "Worth memorising: 1/2 = 0.5 = 50% · 1/4 = 0.25 = 25% · 3/4 = 0.75 = 75% · 1/5 = 0.2 = 20% · 1/8 = 0.125 = 12.5% · 3/8 = 0.375 = 37.5% · 1/3 ≈ 0.333.",
        "Adding or subtracting fractions: common denominator first. Multiplying: straight across, cancel first if you can.",
        "Dividing fractions: keep, change, flip — flip the second one only.",
        "Percentages: find 10% by dividing by 10, 1% by dividing by 100, then build (0.5% = half of 1%; 150% = 100% + half).",
        "Ratio a : b → total parts a + b. One part = amount ÷ total parts.",
        "Unitary method: find the value of ONE, then multiply up.",
      ],
    },
    {
      heading: "Algebra — four words that do all the work",
      bullets: [
        "TERM: 5n. EXPRESSION: 5n + 3 (no =, so simplify). FORMULA: A = lw (a rule connecting quantities). EQUATION: 5n + 3 = 18 (has =, so solve).",
        "Collect like terms only — 4n + 2n = 6n, but 4n + 2n² stays as it is.",
        "Distributive law: the number outside multiplies EVERYTHING inside. 4(n + 3) = 4n + 12.",
        "Solving: undo operations in reverse, doing the same to both sides. Then substitute your answer back to check.",
        "Sequences: term-to-term tells you the step; nth term (n + a, n − a or a × n) jumps straight to any position.",
        "Functions: each input → exactly one output. To go backwards, apply the inverse operation.",
        "Graphs: y = a number is horizontal (parallel to the x-axis); x = a number is vertical (parallel to the y-axis).",
      ],
    },
    {
      heading: "Angles, shapes and symmetry",
      bullets: [
        "Angles at a point = 360°. Angles on a straight line = 180°. Angles in a triangle = 180°. Angles in a quadrilateral = 360°.",
        "Vertically opposite angles are equal.",
        "Parallel lines cut by a transversal: corresponding angles equal (F-shape), alternate angles equal (Z-shape), co-interior angles add to 180° (C-shape).",
        "Regular polygon with n sides: n lines of symmetry and rotational symmetry of order n.",
        "Circle parts: centre, radius, diameter (= 2 × radius), circumference, chord, tangent.",
        "Congruent = same shape and same size (reflect, rotate, translate). Similar = same shape, scaled (enlarge).",
        "Always write the angle FACT beside the answer — the reasoning is the mark.",
      ],
    },
    {
      heading: "Measure — formulas and units",
      bullets: [
        "Area of a rectangle = length × width. Area of a triangle = ½ × base × perpendicular height.",
        "Compound shape: split into rectangles and triangles, work out each, add.",
        "Volume of a cuboid = length × width × height.",
        "Surface area of a cuboid = 2(lw + lh + wh) — three pairs of matching faces.",
        "Area units: 1 cm² = 100 mm² · 1 m² = 10 000 cm² · 1 hectare = 10 000 m².",
        "Length in cm, area in cm², volume in cm³. If the unit has no little number, it isn't an area.",
      ],
    },
    {
      heading: "Data and chance",
      bullets: [
        "Mean = total ÷ how many. Median = middle of the ordered list. Mode = most common. Range = largest − smallest (spread, not average).",
        "An extreme value drags the mean but leaves the median alone — say so when asked which average fits.",
        "Categorical (names) · discrete (counted whole steps) · continuous (measured, any value).",
        "Bigger sample = more trustworthy conclusion. A sample of your friends is biased.",
        "Probability sits between 0 and 1, written as a fraction, decimal or percentage.",
        "Theoretical P(event) = favourable outcomes ÷ total equally likely outcomes.",
        "Experimental P(event) = times it happened ÷ number of trials. More trials → closer to the theoretical value.",
        "Mutually exclusive outcomes of one event add to 1, so P(not A) = 1 − P(A).",
      ],
    },
    {
      heading: "Thinking and Working Mathematically — the eight moves",
      bullets: [
        "SPECIALISING — try a specific example and test it against the criteria. Start here when you're stuck.",
        "GENERALISING — many examples fit, so describe the underlying rule.",
        "CONJECTURING — form the question or idea worth testing: 'I think it always…'.",
        "CONVINCING — give evidence and reasons, not just more examples. This is where the marks live.",
        "CHARACTERISING — describe the mathematical properties of a shape or number.",
        "CLASSIFYING — sort things into groups using those properties.",
        "CRITIQUING — compare two methods or answers; name an advantage and a disadvantage of each.",
        "IMPROVING — refine the idea into a sharper, more accurate version.",
        "The pairs work together: specialise → generalise, conjecture → convince, characterise → classify, critique → improve.",
      ],
    },
  ],
};
