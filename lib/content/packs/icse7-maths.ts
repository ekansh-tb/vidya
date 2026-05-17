// ICSE Class 7 Mathematics — Selina Concise (R.K. Bansal), 22 chapters
// Verified May 2026 against icsesolutions, shaalaa, knowledgeboat.

import type { ExamPack } from "../exam-pack";

export const ICSE7_MATHS: ExamPack = {
  subjectId: "icse-maths",
  title: "Mathematics — Class 7 ICSE",
  context: "Selina Concise · 22 chapters · Wisdom World School Hadapsar",
  highlights: [
    { label: "Textbook", value: "Selina Concise Mathematics 7" },
    { label: "Author",   value: "R.K. Bansal" },
    { label: "Chapters", value: "22" },
  ],
  reference: { label: "Selina chapter solutions (Shaalaa)", url: "https://www.shaalaa.com/textbook-solutions/selina-solutions-concise-mathematics-english-class-7-icse_163" },
  plan: [
    { title: "Read the 22-chapter checklist", hint: "Tag where you feel weak" },
    { title: "20 must-know definitions", hint: "Flip the flashcards" },
    { title: "Practice — 18 questions", hint: "Mix of all chapters" },
    { title: "Common-mistake list", hint: "Where marks slip" },
    { title: "Exam-day cheat sheet", hint: "Re-read just before the test" },
  ],
  topics: [
    {
      id: "1-integers", num: 1, title: "Integers",
      blurb: "Positive + negative whole numbers — add, subtract, multiply, divide.",
      syllabus: [
        "Number line; opposites; absolute value.",
        "Addition & subtraction of integers (same/different signs).",
        "Multiplication & division — rules for signs.",
        "Properties: closure, commutative, associative, distributive.",
        "Word problems involving temperature, sea-level, profit/loss.",
      ],
    },
    {
      id: "2-rational", num: 2, title: "Rational Numbers",
      blurb: "Numbers of the form p/q where q ≠ 0.",
      syllabus: [
        "What is a rational number; positive vs negative.",
        "Standard form; equivalent rational numbers; lowest terms.",
        "Comparison and ordering; representation on number line.",
        "Operations: add, subtract, multiply, divide rationals.",
        "Properties — closure, commutative, associative.",
      ],
    },
    {
      id: "3-fractions", num: 3, title: "Fractions (incl. problems)",
      blurb: "Proper, improper, mixed, like/unlike, equivalent.",
      syllabus: [
        "Types of fractions; conversion between forms.",
        "LCM-method for addition/subtraction of unlike fractions.",
        "Multiplication & division of fractions; reciprocal.",
        "Fraction of a quantity; word problems.",
      ],
    },
    {
      id: "4-decimal", num: 4, title: "Decimal Fractions",
      blurb: "Decimals, place value, operations, conversion.",
      syllabus: [
        "Place values; like/unlike decimals.",
        "Add, subtract, multiply, divide decimals.",
        "Conversion: decimals ↔ fractions ↔ percentages.",
        "Word problems with money, weight, length.",
      ],
    },
    {
      id: "5-exponents", num: 5, title: "Exponents (Powers)",
      blurb: "Repeated multiplication, laws of exponents.",
      syllabus: [
        "Base & exponent; aᵐ × aⁿ = aᵐ⁺ⁿ.",
        "aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.",
        "a⁰ = 1; negative exponents (concept).",
        "Standard form (scientific notation).",
      ],
    },
    {
      id: "6-ratio", num: 6, title: "Ratio & Proportion",
      blurb: "Comparison of two quantities of same kind.",
      syllabus: [
        "Ratio: definition, simplest form, equivalent ratios.",
        "Proportion: a:b :: c:d — extremes & means; cross-product.",
        "Continued proportion; mean proportional.",
        "Ratio in word problems.",
      ],
    },
    {
      id: "7-unitary", num: 7, title: "Unitary Method",
      blurb: "Find value of one, then many.",
      syllabus: [
        "Direct variation: as one increases, the other increases.",
        "Indirect (inverse) variation.",
        "Time-and-work / speed-distance word problems.",
      ],
    },
    {
      id: "8-percent", num: 8, title: "Percent & Percentage",
      blurb: "Per-100. Convert and apply.",
      syllabus: [
        "Percent ↔ fraction ↔ decimal.",
        "% of a quantity; expressing one quantity as % of another.",
        "Increase / decrease %.",
      ],
    },
    {
      id: "9-profit-loss", num: 9, title: "Profit, Loss & Discount",
      blurb: "CP, SP, gain%, loss%, MP, discount%.",
      syllabus: [
        "CP, SP; profit/loss = SP − CP; profit%/loss% on CP.",
        "Marked price, discount, discount%, sale price.",
        "Successive discounts (basic).",
      ],
    },
    {
      id: "10-si", num: 10, title: "Simple Interest",
      blurb: "Interest = P × R × T / 100.",
      syllabus: [
        "Principal, rate, time, amount.",
        "SI = (P × R × T) ÷ 100; A = P + SI.",
        "Finding any one when others are given.",
      ],
    },
    {
      id: "11-algebra-basics", num: 11, title: "Fundamental Concepts (Algebra)",
      blurb: "Terms, coefficients, like/unlike, polynomials.",
      syllabus: [
        "Variable, constant, expression, equation.",
        "Like vs unlike terms; coefficient.",
        "Monomial, binomial, trinomial.",
        "Addition & subtraction of expressions.",
      ],
    },
    {
      id: "12-linear-eq", num: 12, title: "Simple Linear Equations",
      blurb: "Solve one-variable equations.",
      syllabus: [
        "Equation balance; transposition.",
        "Solve x + a = b; ax = b; ax + b = c.",
        "Form an equation from a word problem and solve.",
      ],
    },
    {
      id: "13-sets", num: 13, title: "Set Concepts",
      blurb: "Collection of well-defined objects.",
      syllabus: [
        "Notation { }; roster vs set-builder.",
        "Equal, equivalent, empty, singleton, finite/infinite.",
        "Subset, proper subset, universal set.",
        "Union ∪, intersection ∩, difference, complement (intro).",
      ],
    },
    {
      id: "14-lines-angles", num: 14, title: "Lines & Angles",
      blurb: "Pairs of angles, parallel-line theorems.",
      syllabus: [
        "Complementary, supplementary, adjacent, vertically opposite.",
        "Linear pair; transversal across parallel lines.",
        "Corresponding, alternate, co-interior angles.",
      ],
    },
    {
      id: "15-triangles", num: 15, title: "Triangles",
      blurb: "Properties and classification.",
      syllabus: [
        "By sides (scalene, isosceles, equilateral); by angles (acute, right, obtuse).",
        "Angle-sum = 180°; exterior angle = sum of two opposite interior.",
        "Triangle inequality.",
      ],
    },
    {
      id: "16-pythagoras", num: 16, title: "Pythagoras Theorem",
      blurb: "Right-angled triangles only.",
      syllabus: [
        "Statement: hyp² = base² + perp².",
        "Find the missing side.",
        "Common Pythagorean triples: 3-4-5, 5-12-13, 8-15-17.",
      ],
    },
    {
      id: "17-symmetry", num: 17, title: "Symmetry",
      blurb: "Line and rotational symmetry.",
      syllabus: [
        "Line symmetry; lines of symmetry in regular shapes.",
        "Rotational symmetry; order & angle.",
      ],
    },
    {
      id: "18-solids", num: 18, title: "Recognition of Solids",
      blurb: "3D shapes: faces, edges, vertices.",
      syllabus: [
        "Cube, cuboid, cylinder, cone, sphere, prism, pyramid.",
        "Faces (F), Edges (E), Vertices (V); Euler-style counts.",
        "Nets of cubes & cuboids.",
      ],
    },
    {
      id: "19-congruency", num: 19, title: "Congruency (Triangles)",
      blurb: "Same shape and same size.",
      syllabus: [
        "SSS, SAS, ASA, RHS conditions.",
        "Correspondence of vertices.",
        "Proving two triangles congruent.",
      ],
    },
    {
      id: "20-mensuration", num: 20, title: "Mensuration (Perimeter & Area)",
      blurb: "Squares, rectangles, triangles, circles.",
      syllabus: [
        "Perimeter / area of square, rectangle, triangle.",
        "Circumference = 2πr; area of circle = πr².",
        "Area of compound figures.",
      ],
    },
    {
      id: "21-data", num: 21, title: "Data Handling",
      blurb: "Mean, median, mode + bar charts.",
      syllabus: [
        "Mean = sum ÷ number of observations.",
        "Median = middle value of ordered data.",
        "Mode = most frequent value.",
        "Bar graphs, double bar graphs.",
      ],
    },
    {
      id: "22-prob", num: 22, title: "Probability (Intro)",
      blurb: "Likelihood of an event.",
      syllabus: [
        "Experiment, outcome, event, sample space.",
        "P(event) = favourable ÷ total outcomes.",
        "Probability ranges from 0 to 1.",
      ],
    },
  ],

  flashcards: [
    { term: "Integer", def: "A number with no fractional part: …, -3, -2, -1, 0, 1, 2, 3, …" },
    { term: "Rational number", def: "A number that can be written as p/q where p and q are integers and q ≠ 0." },
    { term: "LCM", def: "Lowest Common Multiple — smallest positive multiple shared by two or more numbers." },
    { term: "HCF / GCD", def: "Highest Common Factor — largest number that divides each of the given numbers exactly." },
    { term: "Standard form", def: "A number written as A × 10ⁿ where 1 ≤ A < 10 and n is an integer." },
    { term: "Ratio", def: "Comparison of two quantities of the same kind, in the form a : b." },
    { term: "Proportion", def: "An equality of two ratios; a : b = c : d, with a×d = b×c." },
    { term: "Percent", def: "Out of one hundred; 25% means 25 out of 100, or 0.25." },
    { term: "CP / SP", def: "Cost Price = what an item is bought for; Selling Price = what it is sold for." },
    { term: "Simple Interest", def: "SI = (P × R × T) ÷ 100, where P=principal, R=rate %, T=time in years." },
    { term: "Like terms", def: "Algebraic terms with the same variable raised to the same power (e.g. 3x and -5x)." },
    { term: "Polynomial", def: "An algebraic expression with one or more terms — monomial (1), binomial (2), trinomial (3)." },
    { term: "Linear equation", def: "An equation in which the highest power of the variable is 1; e.g. 2x + 3 = 7." },
    { term: "Set", def: "A well-defined collection of distinct objects, denoted in { }." },
    { term: "Empty set", def: "A set with no elements, written ∅ or { }." },
    { term: "Complementary angles", def: "Two angles whose sum is 90°." },
    { term: "Supplementary angles", def: "Two angles whose sum is 180°." },
    { term: "Pythagoras Theorem", def: "In a right triangle, hypotenuse² = base² + perpendicular²." },
    { term: "Congruent triangles", def: "Triangles that are the same shape and the same size — same sides, same angles." },
    { term: "Probability", def: "P(event) = number of favourable outcomes ÷ total number of outcomes." },
  ],

  questions: [
    { id: "im-1", topic: "1-integers", q: "(−7) + (+12) = ?", opts: ["−5", "+5", "+19", "−19"], a: "+5", model: "Different signs — subtract: 12 − 7 = 5. Larger number is positive, so answer is +5.", hint: "Different signs → subtract, take sign of bigger." },
    { id: "im-2", topic: "1-integers", q: "(−4) × (−6) = ?", opts: ["−24", "+24", "+10", "−10"], a: "+24", model: "Negative × negative = positive. 4 × 6 = 24 → +24.", hint: "Negative × negative = positive." },
    { id: "im-3", topic: "3-fractions", q: "1/2 + 2/3 = ?", opts: ["3/5", "7/6", "5/6", "1"], a: "7/6", model: "LCD = 6 → 3/6 + 4/6 = 7/6." },
    { id: "im-4", topic: "5-exponents", q: "2³ × 2⁴ = ?", opts: ["2⁷", "2¹²", "4⁷", "8"], a: "2⁷", model: "aᵐ × aⁿ = aᵐ⁺ⁿ → 2^(3+4) = 2⁷ = 128." },
    { id: "im-5", topic: "6-ratio", q: "The ratio 12 : 18 in simplest form?", opts: ["6 : 9", "2 : 3", "3 : 2", "4 : 6"], a: "2 : 3", model: "Divide both by HCF(12,18)=6 → 2:3." },
    { id: "im-6", topic: "8-percent", q: "25% of 320 = ?", opts: ["60", "80", "70", "100"], a: "80", model: "25% = 1/4. 320 ÷ 4 = 80." },
    { id: "im-7", topic: "9-profit-loss", q: "CP = ₹400, SP = ₹460. Find profit%.", opts: ["10%", "12%", "15%", "20%"], a: "15%", model: "Profit = 60. Profit% = (60/400)×100 = 15%." },
    { id: "im-8", topic: "10-si", q: "P = ₹2,000, R = 5% p.a., T = 3 years. SI = ?", opts: ["₹250", "₹300", "₹350", "₹500"], a: "₹300", model: "SI = (2000 × 5 × 3)/100 = ₹300." },
    { id: "im-9", topic: "12-linear-eq", q: "Solve: 3x + 5 = 20.", opts: ["x = 3", "x = 4", "x = 5", "x = 7"], a: "x = 5", model: "3x = 20 − 5 = 15 → x = 5." },
    { id: "im-10", topic: "14-lines-angles", q: "Two angles add up to 90°. They are called?", opts: ["Supplementary", "Complementary", "Vertically opposite", "Co-interior"], a: "Complementary", model: "Complementary = sum 90°; Supplementary = sum 180°." },
    { id: "im-11", topic: "15-triangles", q: "Sum of interior angles of any triangle?", opts: ["90°", "180°", "270°", "360°"], a: "180°", model: "Angle-sum property of triangles is always 180°." },
    { id: "im-12", topic: "16-pythagoras", q: "Right triangle with legs 6 and 8. Hypotenuse?", opts: ["10", "12", "14", "√50"], a: "10", model: "hyp² = 6² + 8² = 36 + 64 = 100 → hyp = 10." },
    { id: "im-13", topic: "17-symmetry", q: "Lines of symmetry in a square?", opts: ["2", "3", "4", "8"], a: "4", model: "2 diagonals + 2 perpendicular bisectors = 4." },
    { id: "im-14", topic: "18-solids", q: "Number of edges in a cube?", opts: ["6", "8", "12", "24"], a: "12", model: "Cube has 6 faces, 8 vertices, 12 edges." },
    { id: "im-15", topic: "19-congruency", q: "Which is NOT a congruence rule?", opts: ["SSS", "SAS", "ASA", "AAA"], a: "AAA", model: "AAA only gives similarity, not congruence (size can differ)." },
    { id: "im-16", topic: "20-mensuration", q: "Circumference of a circle with r = 7 cm? (π = 22/7)", opts: ["22 cm", "44 cm", "49 cm", "154 cm"], a: "44 cm", model: "C = 2πr = 2 × (22/7) × 7 = 44 cm." },
    { id: "im-17", topic: "21-data", q: "Find the median of 5, 7, 9, 11, 13.", opts: ["7", "9", "11", "10"], a: "9", model: "Sorted middle value = 9 (5 numbers → 3rd is median)." },
    { id: "im-18", topic: "22-prob", q: "Probability of getting a head when a fair coin is tossed once?", opts: ["0", "1/4", "1/2", "1"], a: "1/2", model: "Favourable = 1 (head), total = 2 (head, tail). P = 1/2." },
  ],

  mistakes: [
    { mistake: "Forgetting the sign when subtracting integers.", fix: "Re-write a − b as a + (−b) and apply same-sign / different-sign rule." },
    { mistake: "Adding fractions with unlike denominators by adding numerators only.", fix: "Take LCM of denominators first; convert each fraction; then add numerators." },
    { mistake: "Confusing complementary and supplementary angles.", fix: "C for Corner = 90° (Complementary). S for Straight = 180° (Supplementary)." },
    { mistake: "Using AAA as a congruence rule.", fix: "AAA only proves similarity. Use SSS, SAS, ASA, or RHS for congruence." },
    { mistake: "Forgetting units in mensuration answers.", fix: "Perimeter has length units (cm, m). Area has square units (cm², m²)." },
    { mistake: "In simple interest, using time in months instead of years.", fix: "T must be in years. Convert months/days first: 6 months = 0.5 year." },
    { mistake: "Setting up a percent without the original quantity.", fix: "% of WHAT? Always identify the base (CP for profit%, original for change%)." },
  ],

  cheat: [
    {
      heading: "Formulas to know cold",
      bullets: [
        "SI = P × R × T ÷ 100",
        "Profit% = (Profit/CP) × 100; Loss% = (Loss/CP) × 100",
        "Circumference = 2πr; Area of circle = πr²",
        "Area: rectangle = L×W; triangle = ½ × base × height; square = side²",
        "Pythagoras: hyp² = base² + perp²",
        "Mean = sum ÷ count; Probability = favourable ÷ total",
      ],
    },
    {
      heading: "Sign rules (integers + rationals)",
      bullets: [
        "Add: same sign → add and keep sign; different signs → subtract and take sign of larger.",
        "Multiply/divide: same sign → +; different signs → −.",
        "0 × any number = 0; 0 / any non-zero = 0.",
      ],
    },
    {
      heading: "Geometry quick-check",
      bullets: [
        "Triangle angle sum = 180°. Exterior angle = sum of opposite two interior.",
        "Vertically opposite angles are equal.",
        "Parallel lines + transversal: corresponding & alternate angles equal; co-interior add to 180°.",
        "Congruence: SSS, SAS, ASA, RHS. Similarity (different size, same shape): AA, SAS-similarity, SSS-similarity.",
      ],
    },
    {
      heading: "Algebra & equations",
      bullets: [
        "Like terms can be combined; unlike terms cannot.",
        "Move a term across = → flip its sign (transposition).",
        "Same operation on both sides keeps the equation balanced.",
      ],
    },
    {
      heading: "Exam strategy",
      bullets: [
        "Read each question twice.",
        "Show every step — partial marks save grades.",
        "Always write units (cm, kg, ₹, °).",
        "Re-check signs and decimal point at the end.",
      ],
    },
  ],
};
