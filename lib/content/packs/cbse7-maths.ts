// CBSE Class 7 Mathematics — NCERT "Ganita Prakash" (NCF-SE 2023)
// Source: 15 chapters across Part I (8) + Part II (7), verified May 2026
//   - NCERT PDFs: ncert.nic.in/textbook/pdf/gegp1ps.pdf (Part I), gegp2ps.pdf (Part II)
//   - Chapter list cross-checked at learncbse.in/ncert-solutions-for-class-7-maths/
// Targets: Bharatiya Vidya Bhavan (Nagpur Kendra, all 4 branches) + any CBSE school using NCF books.

import type { ExamPack } from "../exam-pack";

export const CBSE7_MATHS: ExamPack = {
  subjectId: "cbse-maths",
  grade: 7,
  title: "Mathematics — Class 7 CBSE",
  context: "NCERT Ganita Prakash · Part I + II · 15 chapters · NCF-SE 2023",
  highlights: [
    { label: "Textbook", value: "Ganita Prakash (NCERT, 2025 ed.)" },
    { label: "Parts",    value: "Part I (8) + Part II (7)" },
    { label: "Style",    value: "Activity-based · concept-first" },
  ],
  reference: {
    label: "NCERT — Ganita Prakash Part I (PDF)",
    url: "https://ncert.nic.in/textbook/pdf/gegp1ps.pdf",
  },
  pinnedRule: {
    heading: "NCF approach",
    body: "Ganita Prakash builds intuition before formulas. When solving, write the reasoning step first, the calculation second.",
  },
  plan: [
    { title: "Walk the 15-chapter map",        hint: "Spot weak chapters first" },
    { title: "Core vocabulary — 20 cards",     hint: "Place value, integer, fraction, expression" },
    { title: "Mixed practice — 20 questions",  hint: "Two from each chapter band" },
    { title: "Common-mistake list",            hint: "Sign errors, place-value slips" },
    { title: "Exam-day cheat sheet",           hint: "Re-read 10 min before the paper" },
  ],
  topics: [
    // ── Part I ───────────────────────────────────────────────────
    {
      id: "1-large-numbers", paper: 1, num: 1, title: "Large Numbers Around Us",
      blurb: "Reading, writing and reasoning with big numbers.",
      syllabus: [
        "Indian place-value system (lakhs, crores) vs international (millions, billions).",
        "Reading and writing numbers up to 9-digit and beyond.",
        "Estimation, rounding and order-of-magnitude reasoning.",
        "Comparing very large quantities in real-world contexts.",
      ],
    },
    {
      id: "2-arithmetic-expressions", paper: 1, num: 2, title: "Arithmetic Expressions",
      blurb: "Building and evaluating number expressions.",
      syllabus: [
        "Forming expressions from word problems.",
        "Order of operations (brackets, multiplication/division, addition/subtraction).",
        "Use of brackets to change meaning of an expression.",
        "Equivalent expressions and simplification.",
      ],
    },
    {
      id: "3-peek-beyond-point", paper: 1, num: 3, title: "A Peek Beyond the Point",
      blurb: "Introducing decimals as a natural extension of place value.",
      syllabus: [
        "Tenths, hundredths, thousandths on the number line.",
        "Decimal place value and reading decimals.",
        "Comparing and ordering decimals.",
        "Decimals as fractions with denominators 10, 100, 1000.",
      ],
    },
    {
      id: "4-letter-numbers", paper: 1, num: 4, title: "Expressions using Letter Numbers",
      blurb: "Algebra introduced as 'letters that stand for numbers'.",
      syllabus: [
        "Variables (letter-numbers) and constants.",
        "Forming algebraic expressions from situations.",
        "Coefficients, terms, and like terms.",
        "Substitution: evaluating an expression for a given value.",
      ],
    },
    {
      id: "5-parallel-intersecting", paper: 1, num: 5, title: "Parallel and Intersecting Lines",
      blurb: "Lines, angles, and the relationships between them.",
      syllabus: [
        "Parallel lines and a transversal.",
        "Pairs of angles: vertically opposite, linear pair, corresponding, alternate.",
        "Identifying parallel lines from angle relationships.",
        "Constructing parallel lines with ruler and set-square.",
      ],
    },
    {
      id: "6-number-play", paper: 1, num: 6, title: "Number Play",
      blurb: "Patterns, divisibility, and playful reasoning about numbers.",
      syllabus: [
        "Even/odd, prime/composite revisited.",
        "Divisibility rules — 2, 3, 4, 5, 6, 9, 10, 11.",
        "Factors, multiples, HCF and LCM.",
        "Number puzzles and pattern reasoning.",
      ],
    },
    {
      id: "7-three-intersecting-lines", paper: 1, num: 7, title: "A Tale of Three Intersecting Lines",
      blurb: "Triangles — properties and construction.",
      syllabus: [
        "Triangle as a closed figure with three sides and three angles.",
        "Angle-sum property of a triangle (sum = 180°).",
        "Exterior angle property.",
        "Triangle inequality (sum of any two sides > third side).",
        "Classification by sides (scalene/isosceles/equilateral) and by angles.",
      ],
    },
    {
      id: "8-working-with-fractions", paper: 1, num: 8, title: "Working with Fractions",
      blurb: "Fractions in action — operations and word problems.",
      syllabus: [
        "Proper, improper, mixed fractions; like and unlike.",
        "Equivalent fractions and lowest terms.",
        "Addition and subtraction (LCM of denominators).",
        "Multiplication and division of fractions; reciprocal.",
        "Fraction of a quantity; word problems.",
      ],
    },
    // ── Part II ──────────────────────────────────────────────────
    {
      id: "9-geometric-twins", paper: 2, num: 9, title: "Geometric Twins",
      blurb: "Symmetry, congruence and reflection.",
      syllabus: [
        "Line symmetry and rotational symmetry.",
        "Mirror images and reflection on the coordinate idea.",
        "Congruent figures — when two shapes are 'twins'.",
        "Basic criteria for congruent triangles (intuitive).",
      ],
    },
    {
      id: "10-operations-integers", paper: 2, num: 10, title: "Operations with Integers",
      blurb: "Beyond addition — multiplying and dividing integers.",
      syllabus: [
        "Recap: integers on a number line.",
        "Multiplication of integers — sign rules.",
        "Division of integers — when the answer is an integer.",
        "Properties: closure, commutativity, associativity, distributivity over addition.",
      ],
    },
    {
      id: "11-finding-common-ground", paper: 2, num: 11, title: "Finding Common Ground",
      blurb: "Ratios, proportions and percentages woven together.",
      syllabus: [
        "Ratio as a comparison of like quantities; simplification.",
        "Proportion — equality of two ratios.",
        "Percentage as a ratio with denominator 100.",
        "Converting between fractions, decimals, and percentages.",
        "Word problems: discount, profit & loss, simple interest (intro).",
      ],
    },
    {
      id: "12-another-peek-point", paper: 2, num: 12, title: "Another Peek Beyond the Point",
      blurb: "Operations on decimals.",
      syllabus: [
        "Adding and subtracting decimals (line up the points).",
        "Multiplying decimals by 10, 100, 1000.",
        "Multiplying decimal by decimal.",
        "Dividing a decimal by a whole number and by a decimal.",
        "Word problems with money, length, mass.",
      ],
    },
    {
      id: "13-connecting-dots", paper: 2, num: 13, title: "Connecting the Dots",
      blurb: "Data, graphs and the start of statistics.",
      syllabus: [
        "Organising data; frequency tables.",
        "Bar graphs (single and double).",
        "Mean as the arithmetic average.",
        "Mode and median — intuitive intro.",
        "Reading and interpreting a graph.",
      ],
    },
    {
      id: "14-constructions-tilings", paper: 2, num: 14, title: "Constructions and Tilings",
      blurb: "Geometric constructions with compass and tilings of the plane.",
      syllabus: [
        "Construct a line parallel to a given line through an external point.",
        "Construct triangles given (a) SSS, (b) SAS, (c) ASA data.",
        "Tilings (tessellations) of regular polygons.",
        "Why only triangles, squares, and hexagons tile the plane regularly.",
      ],
    },
    {
      id: "15-finding-unknown", paper: 2, num: 15, title: "Finding the Unknown",
      blurb: "Simple equations — solving for x.",
      syllabus: [
        "Equation vs expression.",
        "Solving by inspection.",
        "Solving by performing the same operation on both sides.",
        "Word problems leading to simple equations.",
      ],
    },
  ],
  flashcards: [
    { term: "Lakh", def: "Indian place-value unit equal to 1,00,000 (one hundred thousand)." },
    { term: "Crore", def: "Indian place-value unit equal to 1,00,00,000 (ten million)." },
    { term: "Expression", def: "A combination of numbers, variables and operations without an equals sign." },
    { term: "Equation", def: "A statement that two expressions are equal — has an = sign and (usually) an unknown." },
    { term: "Variable", def: "A letter that stands for a number whose value can vary." },
    { term: "Coefficient", def: "The number multiplied by the variable in a term, e.g. 5 in 5x." },
    { term: "Like terms", def: "Terms that have the same variables raised to the same powers." },
    { term: "Transversal", def: "A line that cuts two or more other lines, often used with parallel lines." },
    { term: "Vertically opposite angles", def: "The pair of equal angles formed across the point where two lines cross." },
    { term: "Angle-sum property", def: "The three angles of any triangle add up to 180°." },
    { term: "Triangle inequality", def: "Sum of any two sides of a triangle is greater than the third side." },
    { term: "Proper fraction", def: "A fraction whose numerator is smaller than its denominator (value < 1)." },
    { term: "Reciprocal", def: "For a non-zero number a, its reciprocal is 1/a. Product = 1." },
    { term: "Integer", def: "A whole number — positive, negative, or zero." },
    { term: "Distributive property", def: "a × (b + c) = a × b + a × c." },
    { term: "Congruent", def: "Two figures are congruent if they have exactly the same shape and size." },
    { term: "Line symmetry", def: "A figure has line symmetry if a line can be drawn that divides it into two mirror halves." },
    { term: "Ratio", def: "A comparison of two like quantities by division, written a : b." },
    { term: "Proportion", def: "An equality between two ratios, a : b = c : d." },
    { term: "Mean", def: "Arithmetic average — sum of values divided by their count." },
  ],
  questions: [
    {
      id: "q-1", topic: "Large Numbers Around Us",
      q: "Write 'three crore twenty-five lakh seven thousand' in figures.",
      opts: ["3,25,07,000", "3,25,70,000", "32,57,000", "3,25,007"],
      a: "3,25,07,000",
      model: "3 crore = 3,00,00,000; 25 lakh = 25,00,000; 7 thousand = 7,000. Sum = 3,25,07,000.",
    },
    {
      id: "q-2", topic: "Arithmetic Expressions",
      q: "Evaluate: 12 + 4 × (6 − 2)",
      opts: ["28", "64", "16", "20"],
      a: "28",
      model: "Brackets first: 6 − 2 = 4. Then ×: 4 × 4 = 16. Then +: 12 + 16 = 28.",
    },
    {
      id: "q-3", topic: "A Peek Beyond the Point",
      q: "Which is greater: 0.7 or 0.65?",
      opts: ["0.7", "0.65", "They are equal", "Cannot say"],
      a: "0.7",
      model: "0.70 vs 0.65 — compare the same number of decimal places. 70 hundredths > 65 hundredths.",
    },
    {
      id: "q-4", topic: "Expressions using Letter Numbers",
      q: "If x = 3, find the value of 4x − 5.",
      opts: ["7", "12", "17", "−2"],
      a: "7",
      model: "Substitute x = 3: 4(3) − 5 = 12 − 5 = 7.",
    },
    {
      id: "q-5", topic: "Parallel and Intersecting Lines",
      q: "Two lines are cut by a transversal. If a pair of corresponding angles are equal, the two lines are:",
      opts: ["Parallel", "Perpendicular", "Intersecting", "Curved"],
      a: "Parallel",
      model: "Equal corresponding angles ⇒ lines are parallel (the converse of the corresponding-angle property).",
    },
    {
      id: "q-6", topic: "Number Play",
      q: "Which of these numbers is divisible by 9?",
      opts: ["243", "451", "682", "1031"],
      a: "243",
      model: "Rule: digit sum divisible by 9. 2+4+3 = 9 ✓",
    },
    {
      id: "q-7", topic: "A Tale of Three Intersecting Lines",
      q: "In a triangle, two angles measure 55° and 65°. The third angle is:",
      opts: ["60°", "70°", "80°", "120°"],
      a: "60°",
      model: "Sum of angles = 180°. 180 − 55 − 65 = 60°.",
    },
    {
      id: "q-8", topic: "Working with Fractions",
      q: "Simplify: 2/3 + 1/6",
      opts: ["5/6", "3/9", "1/2", "3/6"],
      a: "5/6",
      model: "LCM of 3 and 6 is 6. 2/3 = 4/6. 4/6 + 1/6 = 5/6.",
    },
    {
      id: "q-9", topic: "Geometric Twins",
      q: "Which letter of the English alphabet has both line and rotational symmetry?",
      opts: ["H", "F", "G", "J"],
      a: "H",
      model: "H has a vertical line of symmetry AND rotates onto itself by 180°.",
    },
    {
      id: "q-10", topic: "Operations with Integers",
      q: "Evaluate: (−6) × (−4)",
      opts: ["24", "−24", "10", "−10"],
      a: "24",
      model: "Negative × negative = positive. 6 × 4 = 24.",
    },
    {
      id: "q-11", topic: "Finding Common Ground",
      q: "Express 3/4 as a percentage.",
      opts: ["75%", "34%", "43%", "0.75%"],
      a: "75%",
      model: "3/4 × 100% = 75%.",
    },
    {
      id: "q-12", topic: "Another Peek Beyond the Point",
      q: "Compute: 0.6 × 0.5",
      opts: ["0.3", "0.30", "0.03", "3.0"],
      a: "0.3",
      model: "6 × 5 = 30. Total decimal places in factors = 1+1 = 2. So 0.30 = 0.3.",
    },
    {
      id: "q-13", topic: "Connecting the Dots",
      q: "The mean of 4, 6, 8, 10, 12 is:",
      opts: ["8", "6", "10", "12"],
      a: "8",
      model: "Sum = 40. Count = 5. Mean = 40 ÷ 5 = 8.",
    },
    {
      id: "q-14", topic: "Constructions and Tilings",
      q: "Which regular polygon does NOT tile the plane by itself?",
      opts: ["Regular pentagon", "Equilateral triangle", "Square", "Regular hexagon"],
      a: "Regular pentagon",
      model: "Only regular triangles, squares and hexagons tile (their interior angles divide 360° evenly).",
    },
    {
      id: "q-15", topic: "Finding the Unknown",
      q: "Solve: 3x + 5 = 20",
      opts: ["x = 5", "x = 6", "x = 8", "x = 15"],
      a: "x = 5",
      model: "Subtract 5: 3x = 15. Divide by 3: x = 5.",
    },
    {
      id: "q-16", topic: "Number Play",
      q: "The HCF of 18 and 24 is:",
      opts: ["6", "2", "3", "12"],
      a: "6",
      model: "18 = 2×3×3, 24 = 2×2×2×3. Common = 2×3 = 6.",
    },
    {
      id: "q-17", topic: "Working with Fractions",
      q: "What is 3/5 of 50?",
      opts: ["30", "20", "15", "35"],
      a: "30",
      model: "3/5 × 50 = 150 ÷ 5 = 30.",
    },
    {
      id: "q-18", topic: "Operations with Integers",
      q: "Evaluate: (−15) ÷ 5",
      opts: ["−3", "3", "−5", "5"],
      a: "−3",
      model: "Negative ÷ positive = negative. 15 ÷ 5 = 3 ⇒ −3.",
    },
    {
      id: "q-19", topic: "Expressions using Letter Numbers",
      q: "Which of these are like terms?",
      opts: ["3x and 7x", "3x and 3y", "x² and x", "5 and x"],
      a: "3x and 7x",
      model: "Like terms have the same variables raised to the same powers.",
    },
    {
      id: "q-20", topic: "A Tale of Three Intersecting Lines",
      q: "Can a triangle have sides 4 cm, 5 cm and 10 cm?",
      opts: ["No", "Yes", "Only if right-angled", "Only if isosceles"],
      a: "No",
      model: "Triangle inequality: 4 + 5 = 9, which is NOT > 10. So such a triangle is impossible.",
    },
  ],
  mistakes: [
    { mistake: "Mixing up lakh and million.", fix: "1 lakh = 1,00,000 = 100 thousand; 1 million = 10 lakh." },
    { mistake: "Forgetting BODMAS — doing left-to-right.", fix: "Brackets → Orders → Division/Multiplication → Addition/Subtraction." },
    { mistake: "Negative × negative answered as negative.", fix: "Two negatives multiply to a positive: (−)(−) = +." },
    { mistake: "Adding fractions by adding numerators AND denominators.", fix: "Find LCM of denominators first; only numerators add." },
    { mistake: "Mis-naming corresponding vs alternate angles.", fix: "Corresponding = same side of transversal, same position on each line. Alternate = opposite sides." },
    { mistake: "Skipping the triangle-inequality check.", fix: "Always: longest side < sum of the other two." },
  ],
  cheat: [
    {
      heading: "Place value (Indian)",
      bullets: [
        "ones, tens, hundreds, thousands, ten-thousands, lakh, ten-lakh, crore, ten-crore.",
        "Comma after thousand, then every 2 digits.",
      ],
    },
    {
      heading: "BODMAS order",
      bullets: ["Brackets", "Orders (powers, roots)", "Division & Multiplication (left to right)", "Addition & Subtraction (left to right)"],
    },
    {
      heading: "Integer sign rules",
      bullets: ["(+)(+) = +", "(−)(−) = +", "(+)(−) = −", "(−)(+) = −"],
    },
    {
      heading: "Angles with parallel lines + transversal",
      bullets: [
        "Corresponding angles equal.",
        "Alternate interior angles equal.",
        "Co-interior (same-side) angles sum to 180°.",
      ],
    },
    {
      heading: "Triangle facts",
      bullets: [
        "Sum of angles = 180°.",
        "Exterior angle = sum of two opposite interior angles.",
        "Sum of any two sides > third side.",
      ],
    },
    {
      heading: "Percentage shortcuts",
      bullets: [
        "Fraction → percent: × 100.",
        "Decimal → percent: shift point 2 places right.",
        "50% = 1/2, 25% = 1/4, 20% = 1/5, 10% = 1/10.",
      ],
    },
  ],
};
