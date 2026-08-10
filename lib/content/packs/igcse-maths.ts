// Cambridge IGCSE International Mathematics 0607 — Extended.
//
// *** A GRAPHIC DISPLAY CALCULATOR (GDC) IS REQUIRED FOR THIS SYLLABUS. ***
// The GDC is written into the 0607 subject content itself, not just permitted
// alongside it: the syllabus names E1.13, E2.5.5, E2.5.8, E2.6.3, E3.2, E10.5
// and E10.7.4 as objectives assessed on the calculator papers only. Candidates
// must be able to sketch a graph, produce a table of values, plot points, find
// zeros and local maxima/minima, find the intersection of two graphs, find
// mean/median/quartiles, and (Extended only) find the linear regression
// equation. Calculators with symbolic algebraic logic are NOT permitted, other
// built-in applications gain no credit, and external programs are not allowed.
//
// Verified 11 Aug 2026 line-by-line against the official Cambridge IGCSE
// International Mathematics 0607 syllabus for 2025, 2026 and 2027
// (https://www.cambridgeinternational.org/Images/662472-2025-2027-syllabus.pdf),
// Extended subject content E1.1–E10.8, the assessment overview, the GDC
// requirements list on p13, and the Extended List of formulas printed on
// page 2 of Papers 2 and 4.
// Aligned with the endorsed coursebook: "Cambridge IGCSE International
// Mathematics Coursebook" (Blythe, Low, Manning, Morrison, Taniparti, Teo;
// Cambridge University Press, ISBN 978-1-00-937767-6), endorsed for 0607 for
// examination from 2025.
//
// NOTE: a separate 0607 syllabus exists for examinations in 2028–2030. This
// pack targets the 2025–2027 syllabus. Re-verify before a 2028+ cohort uses it.
//
// Deliberately EXCLUDED. Each was checked against the 0607 Extended content
// E1.1–E10.8 and is absent from it, so teaching it would waste the student's
// time. Do not add these without re-reading the syllabus:
//   differentiation; limits of accuracy / upper and lower bounds; histograms
//   and frequency density; conditional probability; vector geometry (position
//   vectors, collinearity proofs); simultaneous equations where one equation is
//   non-linear; completing the square; recurring-decimal ↔ fraction conversion;
//   distance–time / speed–time (kinematics) graphs; ruler-and-compass
//   constructions, nets and scale drawings.
// Also excluded, per the syllabus's own list of 2025–2027 changes, which
// REMOVED them from 0607 Extended:
//   absolute value (old E1.6, and as an E3.1 function type); the rules/laws of
//   logarithms (only the inverse relationship survives, E3.7); stretch
//   transformations (E8.1); proper-subset notation (E1.2).
//
// Question stems are original, in the style of past Paper 2/4/6 (Extended).

import type { ExamPack } from "../exam-pack";

export const IGCSE_MATHS_PACK: ExamPack = {
  subjectId: "igcse-maths",
  grade: 10,
  title: "Mathematics (International) — Extended · IGCSE",
  context: "Cambridge IGCSE 0607 · Extended · GDC required · CNS Amanora, Pune",
  highlights: [
    { label: "Syllabus", value: "0607 (Extended)" },
    { label: "Calculator", value: "Graphic display calculator" },
    { label: "Papers", value: "2 · 4 · 6 (Investigation & Modelling)" },
  ],
  pinnedRule: {
    heading: "Show the method — even when the GDC hands you the answer",
    body: "On the calculator papers, write down what you entered and what you read off (the equation you solved, the intersection point, the regression equation) BEFORE the final value. Non-exact answers to 3 s.f., angles to 1 d.p., and never round part-way — carry the full value into later parts. On the non-calculator paper you get none of that help, so exact values, surds and index laws must be automatic.",
  },
  reference: {
    label: "Cambridge IGCSE International Mathematics 0607 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/",
  },
  plan: [
    { title: "Master the GDC first", hint: "Zeros, intersect, min/max, 1-Var Stats, regression" },
    { title: "Walk the ten topics", hint: "Tag the ones you'd skip in a test" },
    { title: "Functions is the big one", hint: "Logs, vertex form, asymptotes, f(x + k)" },
    { title: "Sets, Venn and probability together", hint: "Same diagrams, two topics" },
    { title: "Run one full investigation", hint: "Table → conjecture → rule → justify" },
    { title: "Read the cheat sheet exam morning", hint: "Last 10 minutes only" },
  ],

  topics: [
    {
      id: "1-number", num: 1, title: "1 · Number",
      blurb: "Primes, sets and Venn diagrams, indices, surds, percentages, rates.",
      syllabus: [
        "Types of number: natural, integer, prime, square, cube, TRIANGLE, rational vs irrational, reciprocal, common factors and multiples. Express a number as a product of primes; get HCF and LCM from the prime factorisations.",
        "Sets and Venn diagrams for two or three sets (E1.2): n(A) number of elements, ∈ 'is an element of', ∉ 'is not an element of', A′ complement, ∅ the empty set, U the universal set, A ⊆ B subset, A ⊄ B not a subset, A ∪ B union, A ∩ B intersection. Set-builder form uses a vertical bar: A = {x | x is a natural number}, C = {x | a ⩽ x ⩽ b}.",
        "Indices (positive, zero, negative and fractional): a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a, a^(m/n) = (ⁿ√a)^m, plus all the rules of indices. Standard form A × 10ⁿ with 1 ⩽ A < 10.",
        "Surds: simplify expressions (√20 = 2√5, √200 − √32 = 6√2) and rationalise the denominator, using the conjugate when the denominator is a ± √b.",
        "Percentages: percentage of a quantity, one quantity as a percentage of another, percentage increase and decrease, simple and compound interest, repeated percentage change, and reverse percentages (divide by the multiplier). Exponential growth and decay — depreciation, population change. Knowledge of e is not required.",
        "Ratio, proportion and rates: simplify ratios, divide a quantity in a given ratio, best value, map scales, average speed, flow rate, fuel consumption, currency conversion, 24-hour clock, timetables and time zones.",
      ],
    },
    {
      id: "2-algebra", num: 2, title: "2 · Algebra",
      blurb: "Expanding, factorising, equations, inequalities, sequences, proportion.",
      syllabus: [
        "Manipulation: collect like terms; expand products, including more than two brackets, e.g. (x − 2)(x + 3)(2x + 1); factorise fully — common factors, grouping (ax + bx + kay + kby), difference of two squares (a²x² − b²y²), a² + 2ab + b², ax² + bx + c and ax³ + bx² + cx.",
        "Algebraic fractions: add, subtract, multiply and divide, including linear algebraic denominators; factorise and simplify rational expressions, e.g. (x² − 2x)/(x² − 5x + 6) = x/(x − 3).",
        "Equations: linear equations; fractional equations with numerical and linear algebraic denominators; simultaneous LINEAR equations in two unknowns; quadratic equations by factorisation, by using the GDC, and by the quadratic formula (which is given); change the subject of a formula when the subject appears twice or under a power or root.",
        "Use the GDC to solve equations, including unfamiliar ones you cannot rearrange by hand (e.g. 2x − 1 = 1/x³) — graph both sides and find the intersection, or graph the difference and find the zeros. The GDC may also be used to solve inequalities.",
        "Inequalities: solve and show on a number line (open circle for < >, closed circle for ⩽ ⩾); represent linear inequalities in two variables graphically (broken line for strict, solid for inclusive, SHADE the unwanted region unless told otherwise); list the inequalities that define a given region.",
        "Sequences: continue a sequence, use the term-to-term rule, and find the nth term of linear, quadratic, cubic and exponential sequences and simple combinations — including the difference method. Subscript notation Tₙ may be used. Proportion: express direct and inverse proportion algebraically (linear, square, square root and cube), using the ∝ symbol, and identify the best variation model for a given set of data.",
      ],
    },
    {
      id: "3-functions", num: 3, title: "3 · Functions",
      blurb: "0607's flagship topic — graph shapes, GDC sketching, inverses, logs.",
      syllabus: [
        "Recognise function types from the shape of their graph, including any symmetry: linear f(x) = ax + b; quadratic ax² + bx + c; cubic ax³ + bx² + cx + d; reciprocal a/x; exponential aˣ (for 0 < a < 1 and for a > 1); trigonometric a sin(bx), a cos(bx) and tan x — including writing down the amplitude and the period. Determine one or two of a, b, c or d from a given graph, and read values from a graph.",
        "Use the GDC to sketch the graph of a function (including unfamiliar ones), produce a table of values, plot points, find zeros, find local maxima and minima, find the intersection of two graphs, and find the vertex of a quadratic.",
        "Functions: understand domain and range and use function notation f(x). Find inverse functions f⁻¹(x) by writing y = f(x), swapping x and y, and rearranging. Form composite functions gf(x) = g(f(x)) — f acts first. You are NOT expected to find the domain and range of a composite function. May include mapping diagrams.",
        "Find a quadratic function from given information: from the vertex and one other point, or from the x-intercepts and one other point, or from the vertex/x-intercepts alone when a = 1. Vertex form: y = a(x − h)² + k has vertex (h, k).",
        "Asymptotes: understand the concept and identify simple examples parallel to the axes on a graph, e.g. y = tan x has asymptotes at 90°, 270°. Algebraic derivation of asymptotes is not required.",
        "Transforming graphs: describe and identify the transformation from y = f(x) to y = f(x) + k (translation k UP) or to y = f(x + k) (translation k to the LEFT), for integer k. Stretches are not in this syllabus.",
        "The logarithmic function: the logarithm is the INVERSE of the exponential; y = aˣ is equivalent to x = log_a y; solve aˣ = b as x = log b ÷ log a. All logs are base 10 unless stated. Used for compound-interest and growth/decay problems. The laws of logarithms are NOT required.",
      ],
    },
    {
      id: "4-coordinate", num: 4, title: "4 · Coordinate geometry",
      blurb: "Gradient, length, midpoint, equations of lines, parallel and perpendicular.",
      syllabus: [
        "Cartesian coordinates in two dimensions.",
        "Gradient of a straight line, including calculating it from the coordinates of two points: m = (y₂ − y₁)/(x₂ − x₁).",
        "Length of a line segment = √((x₂ − x₁)² + (y₂ − y₁)²) and the midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2). Neither formula is on the formula sheet.",
        "Obtain and interpret the equation of a straight-line graph in any form — y = mx + c, ax + by = c, x = k — from a graph, from a gradient and a point, or from two points. Answers must be fully simplified.",
        "Parallel lines have equal gradients. Perpendicular lines satisfy m₁ × m₂ = −1, so take the negative reciprocal — needed for the perpendicular bisector, which also passes through the midpoint.",
      ],
    },
    {
      id: "5-geometry", num: 5, title: "5 · Geometry",
      blurb: "Angle rules, polygons, the seven circle theorems, similarity, bearings.",
      syllabus: [
        "Vocabulary: point, vertex, line, plane, parallel, perpendicular, perpendicular bisector, bearing, acute/obtuse/reflex, interior and exterior angles, similar, congruent, scale factor; triangles, special quadrilaterals and polygons; solids including tetrahedron, hemisphere and frustum; circle terms — chord, tangent, major and minor arc, sector, segment.",
        "Angle measurement in degrees: measure and draw lines and angles with a ruler and protractor, and use three-figure bearings measured clockwise from north (000°–360°), e.g. the bearing of A from B given the bearing of B from A.",
        "Angles: at a point 360°, on a straight line 180°, vertically opposite equal, triangle 180°, quadrilateral 360°; across parallel lines corresponding and alternate angles are equal and co-interior angles sum to 180°. Regular and irregular polygons: exterior angles sum to 360°, interior + exterior = 180°, interior angle sum = (n − 2) × 180°. Three-letter angle notation (angle ABC) and correct geometrical terminology are required when giving reasons.",
        "Circle theorems I: angle in a semicircle = 90°; angle between tangent and radius = 90°; angle at the centre = twice the angle at the circumference on the same arc; angles in the same segment are equal; opposite angles of a cyclic quadrilateral sum to 180°; alternate segment theorem.",
        "Circle theorems II (symmetry properties): equal chords are equidistant from the centre; the perpendicular bisector of a chord passes through the centre; tangents from an external point are equal in length.",
        "Similarity: calculate lengths in similar shapes; use the relationships between lengths, areas and volumes of similar shapes and solids (lengths k, areas k², volumes k³); show that two triangles are similar using geometric reasons. Symmetry: line and rotational symmetry in 2D, and planes and axes of symmetry of prisms, cylinders, pyramids and cones.",
      ],
    },
    {
      id: "6-mensuration", num: 6, title: "6 · Mensuration",
      blurb: "Perimeter, area, arcs and sectors, surface area and volume, frustums.",
      syllabus: [
        "Metric units of mass, length, area, volume and capacity, and conversions — including between units of area (cm² ↔ m²) and between volume and capacity (m³ ↔ litres).",
        "Perimeter and area of a rectangle, triangle (½bh), parallelogram (bh) and trapezium (½(a + b)h). Except for the triangle, these formulas are NOT given.",
        "Circles: C = 2πr and A = πr² (both given). Arc length and sector area as fractions of the circumference and area — arc = (θ/360) × 2πr, sector = (θ/360) × πr² — for both minor and major sectors. These fractions are NOT given.",
        "Surface area and volume of a cuboid, prism (any uniform cross-section), cylinder, sphere, pyramid and cone. Given on the formula sheet: curved SA of a cylinder and cone, SA of a sphere, and the volumes of a prism, pyramid, cylinder, cone and sphere.",
        "Compound shapes and parts of shapes; compound solids and parts of solids, including finding the surface area and volume of a frustum. Answers may be asked for in terms of π.",
      ],
    },
    {
      id: "7-trigonometry", num: 7, title: "7 · Trigonometry",
      blurb: "Pythagoras, SOH-CAH-TOA, exact values, sine/cosine rules, 3D.",
      syllabus: [
        "Pythagoras' theorem, including finding the length of a chord, the distance of a chord from the centre of a circle, and the distance between two points on a grid.",
        "Sine, cosine and tangent ratios for acute angles in right-angled triangles; solve 2D problems combining Pythagoras and trigonometry, including with bearings; the perpendicular distance from a point to a line is the shortest distance; angles of elevation and depression. Answers in degrees to 1 decimal place.",
        "Exact trigonometric values (essential on the non-calculator paper): sin x and cos x for x = 0°, 30°, 45°, 60°, 90°, and tan x for x = 0°, 30°, 45°, 60°. So sin 30° = cos 60° = ½; sin 60° = cos 30° = √3/2; sin 45° = cos 45° = 1/√2; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.",
        "Recognise, sketch and interpret y = sin x, y = cos x and y = tan x for 0° ⩽ x ⩽ 360°, and solve trigonometric equations in sin x, cos x or tan x over that range — give EVERY solution in range, using the symmetry of the curve.",
        "Sine rule a/sin A = b/sin B = c/sin C and cosine rule a² = b² + c² − 2bc cos A for any triangle, including obtuse angles and the ambiguous case; area of a triangle = ½ab sin C. All three are given on the formula sheet.",
        "Pythagoras and trigonometry in three dimensions, including calculating the angle between a line and a plane.",
      ],
    },
    {
      id: "8-transformations", num: 8, title: "8 · Transformations and vectors",
      blurb: "Reflect, rotate, translate, enlarge; column vectors and magnitude.",
      syllabus: [
        "Reflection of a shape in a straight line — describe it by naming the transformation AND giving the equation of the mirror line (x = k, y = k, y = x, y = −x).",
        "Rotation of a shape about a centre through multiples of 90° — describe with angle, direction and centre. Translation of a shape by a column vector (x above y): x is right/left, y is up/down.",
        "Enlargement of a shape from a centre by a scale factor, which may be positive, fractional or negative. A negative scale factor puts the image on the opposite side of the centre and inverts it; lengths scale by |k| and areas by k². Questions may involve combinations of transformations, and may ask for the REVERSE of a transformation. Stretches are not in this syllabus.",
        "Vectors in two dimensions: describe a translation using a column vector, AB or a; add and subtract vectors; multiply a vector by a scalar.",
        "Magnitude of a vector: for a = (x, y) written as a column vector, |a| = √(x² + y²). Modulus signs denote magnitude, e.g. |a| and |AB|. This formula is not given.",
      ],
    },
    {
      id: "9-probability", num: 9, title: "9 · Probability",
      blurb: "Probability scale, relative and expected frequency, combined events.",
      syllabus: [
        "Probability scale from 0 to 1, and probability notation: P(A) is the probability of A, P(A′) is the probability of not A. P(A′) = 1 − P(A). Give answers as a fraction, decimal or percentage — never as a ratio.",
        "Calculate the probability of a single event, including reading the information off a table, a graph or a Venn diagram.",
        "Relative frequency as an estimate of probability (e.g. from spinner experiments), and expected frequency = probability × number of trials. Understand what fair, biased and random mean.",
        "Combined events using sample space diagrams, Venn diagrams and tree diagrams. On tree diagrams, probabilities go beside the branches and outcomes at the ends; branches from any one point sum to 1. The notation P(A ∩ B) and P(A ∪ B) may be used with Venn diagrams.",
        "Mutually exclusive events: P(A or B) = P(A) + P(B). Independent events: P(A and B) = P(A) × P(B). Combined events may be with OR without replacement — without replacement the totals drop by one for the second pick.",
      ],
    },
    {
      id: "10-statistics", num: 10, title: "10 · Statistics",
      blurb: "Averages (by hand and by GDC), charts, scatter, regression, cumulative frequency.",
      syllabus: [
        "Classify and tabulate statistical data (tally tables, two-way tables); read, interpret and draw inferences from tables and diagrams; compare data sets using averages and measures of spread; appreciate the restrictions on drawing conclusions. Distinguish discrete from continuous data.",
        "Mean, median, mode, quartiles, range and interquartile range for individual data, and know which is used for what. Estimate the mean for grouped discrete or grouped continuous data using Σ(f × midpoint) ÷ Σf, and identify the modal class.",
        "Use the GDC to calculate the mean, median and quartiles for discrete data, and the mean for grouped data (enter midpoints as the data list and frequencies as the frequency list).",
        "Draw and interpret bar charts (including stacked and dual), pie charts (angle = frequency ÷ total × 360°), pictograms, ordered stem-and-leaf diagrams with a key, and simple frequency distributions.",
        "Scatter diagrams: plot points as small crosses; describe positive, negative or zero correlation; draw a single ruled line of best fit BY EYE that passes through the mean point and extends across the full data set. Use the GDC to find and use the equation of linear regression.",
        "Cumulative frequency tables and diagrams: plot at the UPPER class boundary and join with a smooth curve; estimate and interpret the median, percentiles, quartiles and interquartile range from the curve.",
      ],
    },
    {
      id: "11-investigation", num: 11, title: "11 · Paper 6 · Investigation and Modelling",
      blurb: "The 0607-only paper: open-ended problems, generalising, justifying, modelling.",
      syllabus: [
        "Paper 6 is a compulsory Extended component with one investigation section and one modelling section. It draws on the Extended subject content but tests PROCESS: candidates are assessed on their ability to investigate, model and solve more open-ended problems. Clear communication and full reasoning are especially important and the mark schemes reflect this. A GDC is required, and any formulas you need are given in the questions.",
        "The investigation method: work systematically through the simple cases first; record every result in a clear, labelled table; look for the pattern in the results (differences, ratios); state a conjecture in words; convert it to a rule in n; TEST the rule against a case you have not used; then answer the actual question with it.",
        "Generalising: use the difference method on your table — a constant first difference means a linear rule, a constant second difference means quadratic, a constant third difference means cubic, and a constant ratio means exponential. Define your variables ('let n be the pattern number and S the number of squares') before writing the rule.",
        "Justifying: explaining WHY the rule works earns marks that a correct rule alone does not. Argue from the structure of the problem — e.g. 'each new pattern adds a column of n squares, so the total is 1 + 2 + … + n' — rather than from the fact that the numbers happen to fit.",
        "Modelling: choose the mathematics that fits the situation, define variables and state your assumptions, fit the model (often with GDC regression or by solving for unknown constants), use it to predict, then EVALUATE it — say where it fits well, where it breaks down, and why extrapolating far beyond the data is unsafe.",
        "Communication: show the working that led to each answer, keep a running commentary of what you tried, and never leave a bare answer. Problem-solving is assessed throughout — select the mathematics and the tools, apply them, then interpret and communicate the result.",
      ],
    },
  ],

  flashcards: [
    { term: "GDC — zeros", def: "The zeros (roots) of f(x) are where the graph crosses the x-axis. Graph the function, then use the zero/root finder. To solve f(x) = g(x), graph y = f(x) − g(x) and find its zeros." },
    { term: "GDC — intersection", def: "Graph both functions and use the intersect tool. This solves any equation you cannot rearrange by hand, including unfamiliar ones. Write down the coordinates you read off." },
    { term: "GDC — max, min and vertex", def: "Use the local maximum / local minimum tools to find turning points, and the vertex tool for a quadratic. Always set a window that actually contains the feature." },
    { term: "GDC — statistics", def: "Enter data in a list and use 1-Var Stats for mean, median and quartiles. For grouped data, enter the class MIDPOINTS as the data list and the frequencies as the frequency list." },
    { term: "GDC — linear regression", def: "Enter x and y in two lists and run linear regression to get y = ax + b for the line of best fit. The regression line always passes through the mean point (x̄, ȳ)." },
    { term: "Set notation (0607)", def: "n(A) number of elements; ∈ is an element of; ∉ is not; A′ complement (everything in U not in A); ∅ empty set; U universal set; A ⊆ B subset; A ∪ B union (in either); A ∩ B intersection (in both). Set-builder uses a bar: {x | 1 ⩽ x ⩽ 9}." },
    { term: "Surds", def: "√a × √b = √(ab), and simplify by pulling out square factors: √20 = √4 × √5 = 2√5. Rationalise 1/(a + √b) by multiplying top and bottom by the conjugate (a − √b)." },
    { term: "Exponential growth and decay", def: "Value = start × (multiplier)ⁿ. Growth of p% → multiplier 1 + p/100; decay of p% → 1 − p/100. Knowledge of e is not required in 0607." },
    { term: "Logarithm", def: "The logarithm is the INVERSE of the exponential: y = aˣ is the same statement as x = log_a y. Base 10 unless stated otherwise. The laws of logarithms are not required in 0607." },
    { term: "Solving aˣ = b", def: "x = log b ÷ log a. Use it whenever the unknown is in the exponent — e.g. finding how many years a depreciating value takes to halve." },
    { term: "Function notation", def: "f(x) is the output for input x. The DOMAIN is the set of allowed inputs; the RANGE is the set of outputs produced." },
    { term: "Composite function gf(x)", def: "gf(x) = g(f(x)) — apply f FIRST, then feed the result into g. Read it right to left. You are not asked for the domain and range of a composite." },
    { term: "Inverse function f⁻¹(x)", def: "Write y = f(x), swap x and y, then rearrange to make y the subject. It undoes f. It is NOT 1/f(x)." },
    { term: "Vertex form of a quadratic", def: "y = a(x − h)² + k has vertex (h, k). Given the vertex and one other point, substitute the point to find a, then expand if the question asks for ax² + bx + c." },
    { term: "Asymptote", def: "A line the graph approaches but never reaches. y = a/x has asymptotes x = 0 and y = 0; y = tan x has asymptotes at 90° and 270°. Only simple ones parallel to the axes are needed." },
    { term: "Translating a graph", def: "y = f(x) + k moves the graph k UP (down if k is negative). y = f(x + k) moves it k to the LEFT (right if k is negative) — inside the bracket does the opposite of what it looks like." },
    { term: "Amplitude and period", def: "For f(x) = a sin(bx) or a cos(bx): the amplitude is |a| (half the height from min to max) and the period is 360° ÷ b (one complete cycle)." },
    { term: "Difference method", def: "Constant 1st difference → linear nth term. Constant 2nd difference → quadratic (2nd difference = 2a). Constant 3rd difference → cubic. Constant RATIO instead → exponential." },
    { term: "Proportion", def: "y ∝ xⁿ → y = kxⁿ; y ∝ 1/xⁿ → y = k/xⁿ. Substitute the given pair to find k FIRST, then answer. You may also be asked which variation model best fits given data." },
    { term: "Gradient, midpoint, length", def: "m = (y₂ − y₁)/(x₂ − x₁); midpoint = ((x₁+x₂)/2, (y₁+y₂)/2); length = √((x₂−x₁)² + (y₂−y₁)²). None of these are on the formula sheet." },
    { term: "Perpendicular gradients", def: "m₁ × m₂ = −1. Flip the fraction and change the sign: gradient ⅔ → perpendicular gradient −3/2." },
    { term: "Circle theorems", def: "Angle in a semicircle = 90°; tangent ⊥ radius; angle at centre = 2 × angle at circumference; angles in the same segment are equal; opposite angles of a cyclic quadrilateral sum to 180°; alternate segment theorem." },
    { term: "Similar shapes and solids", def: "If lengths are in the ratio k, areas are in the ratio k² and volumes in the ratio k³. Find k from a matching pair of LENGTHS first." },
    { term: "Arc and sector", def: "Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². Neither is on the formula sheet, though C = 2πr and A = πr² are." },
    { term: "Exact trig values", def: "sin30 = cos60 = ½; sin60 = cos30 = √3/2; sin45 = cos45 = 1/√2; tan30 = 1/√3; tan45 = 1; tan60 = √3. Needed on the paper where no calculator is allowed." },
    { term: "Mutually exclusive vs independent", def: "Mutually exclusive (cannot both happen): P(A or B) = P(A) + P(B). Independent (one does not affect the other): P(A and B) = P(A) × P(B)." },
    { term: "Line of best fit", def: "A single ruled line drawn by eye that passes through the mean point (x̄, ȳ) and extends across the full data set, with points roughly evenly split either side." },
    { term: "Conjecture → rule → justify", def: "The Paper 6 sequence: tabulate results, spot the pattern, state a conjecture, write it as a rule in n, TEST it on a new case, then explain WHY it works from the structure of the problem." },
  ],

  questions: [
    // 1 — Number (including sets)
    { id: "im10-1", topic: "1-number", q: "Simplify √75 + √48, giving your answer in the form a√b where b is as small as possible.",
      opts: ["9√3", "√123", "20√3", "3√41"], a: "9√3",
      model: "√75 = √(25 × 3) = 5√3. √48 = √(16 × 3) = 4√3. 5√3 + 4√3 = 9√3. (No calculator is allowed on Paper 2, so surd manipulation has to be automatic.)" },
    { id: "im10-2", topic: "1-number", q: "U = {x | x is an integer and 1 ⩽ x ⩽ 12}, A = {multiples of 3}, B = {even numbers}. Find (a) A ∩ B, (b) n(A ∪ B), (c) (A ∪ B)′.",
      model: "List them first: A = {3, 6, 9, 12}, B = {2, 4, 6, 8, 10, 12}. (a) A ∩ B = elements in BOTH = {6, 12}. (b) A ∪ B = elements in EITHER = {2, 3, 4, 6, 8, 9, 10, 12}, so n(A ∪ B) = 8. (c) (A ∪ B)′ is everything in U not in A ∪ B = {1, 5, 7, 11}. Check: 8 + 4 = 12 = n(U) ✓.",
      hint: "∩ is 'and'; ∪ is 'or'; the dash means everything else in U." },
    // 2 — Algebra
    { id: "im10-3", topic: "2-algebra", q: "Solve 2x² − 7x − 3 = 0, giving your answers correct to 2 decimal places.",
      model: "It does not factorise, so use the formula (given on the paper): a = 2, b = −7, c = −3. b² − 4ac = 49 − 4(2)(−3) = 49 + 24 = 73. x = (7 ± √73)/4 = (7 ± 8.5440…)/4. x = 3.89 or x = −0.39. On the calculator paper you can instead graph y = 2x² − 7x − 3 and read off the two zeros — write down both values you read.",
      hint: "−b when b is negative gives +7." },
    { id: "im10-4", topic: "2-algebra", q: "Write 3/(x − 2) − 2/(x + 1) as a single fraction in its simplest form.",
      model: "Common denominator (x − 2)(x + 1). = [3(x + 1) − 2(x − 2)] / [(x − 2)(x + 1)] = (3x + 3 − 2x + 4) / [(x − 2)(x + 1)] = (x + 7) / [(x − 2)(x + 1)]. Watch the sign: −2 × −2 = +4." },
    { id: "im10-5", topic: "2-algebra", q: "Find the nth term of the sequence 3, 8, 15, 24, 35, …",
      opts: ["n² + 2n", "n² + n + 1", "2n² + 1", "n² + 3n − 1"], a: "n² + 2n",
      model: "Difference method. First differences: 5, 7, 9, 11. Second differences: 2, 2, 2 — constant, so the sequence is quadratic with 2a = 2, giving a = 1. Subtract n² (1, 4, 9, 16, 25) from the terms: 2, 4, 6, 8, 10 = 2n. So the nth term is n² + 2n." },
    // 3 — Functions
    { id: "im10-6", topic: "3-functions", q: "f(x) = 3x − 5 and g(x) = x² + 1. Find (a) fg(2), (b) gf(x) in its simplest form, (c) f⁻¹(x).",
      model: "(a) fg(2) = f(g(2)). g(2) = 2² + 1 = 5, then f(5) = 3(5) − 5 = 10. (b) gf(x) = g(3x − 5) = (3x − 5)² + 1 = 9x² − 30x + 25 + 1 = 9x² − 30x + 26. (c) y = 3x − 5 → swap: x = 3y − 5 → 3y = x + 5 → f⁻¹(x) = (x + 5)/3.",
      hint: "In gf, f acts first — read right to left." },
    { id: "im10-7", topic: "3-functions", q: "A machine is bought for $18 000. Its value falls by 12% each year. Find the number of complete years before its value first drops below $9 000.",
      model: "Value after n years = 18000 × 0.88ⁿ. Need 18000 × 0.88ⁿ < 9000, so 0.88ⁿ < 0.5. Take logs: n > log 0.5 ÷ log 0.88 = (−0.30103) ÷ (−0.055517) = 5.42. n must be a whole number of years, so n = 6. Check: 18000 × 0.88⁵ = $9499 (still above); 18000 × 0.88⁶ = $8359 (below) ✓. GDC alternative: graph y = 18000 × 0.88ˣ and y = 9000 and find the intersection at x = 5.42, or scan a table of values.",
      hint: "Unknown in the exponent → logs, or a GDC intersection." },
    { id: "im10-8", topic: "3-functions", q: "A quadratic curve has vertex (3, −4) and passes through (5, 4). Find its equation in the form y = ax² + bx + c.",
      model: "Start from vertex form: y = a(x − 3)² − 4. Substitute (5, 4): 4 = a(5 − 3)² − 4 → 4 = 4a − 4 → 4a = 8 → a = 2. So y = 2(x − 3)² − 4 = 2(x² − 6x + 9) − 4 = 2x² − 12x + 18 − 4 = 2x² − 12x + 14. Check on the GDC: the vertex of y = 2x² − 12x + 14 is (3, −4) ✓.",
      hint: "y = a(x − h)² + k with vertex (h, k)." },
    { id: "im10-9", topic: "3-functions", q: "The graph of y = f(x) is mapped onto the graph of y = f(x + 2). Which transformation is this?",
      opts: ["Translation 2 units to the left", "Translation 2 units to the right", "Translation 2 units up", "Translation 2 units down"], a: "Translation 2 units to the left",
      model: "A change INSIDE the bracket moves the graph horizontally and does the opposite of what it looks like: y = f(x + 2) shifts LEFT by 2, i.e. by the vector (−2, 0). A change outside the bracket, y = f(x) + 2, would shift it UP by 2." },
    // 4 — Coordinate geometry
    { id: "im10-10", topic: "4-coordinate", q: "A is (−1, 4) and B is (5, 8). Find (a) the midpoint of AB, (b) the length of AB in exact form, (c) the equation of the perpendicular bisector of AB.",
      model: "(a) Midpoint = ((−1 + 5)/2, (4 + 8)/2) = (2, 6). (b) Length = √((5 − (−1))² + (8 − 4)²) = √(6² + 4²) = √52 = 2√13 (≈ 7.21). (c) Gradient AB = (8 − 4)/(5 − (−1)) = 4/6 = 2/3, so the perpendicular gradient is −3/2. Through the midpoint (2, 6): y − 6 = −3/2(x − 2) → y = −3/2 x + 9, i.e. 3x + 2y = 18.",
      hint: "A perpendicular bisector goes through the midpoint." },
    { id: "im10-11", topic: "4-coordinate", q: "Which line is perpendicular to 3x + 2y = 12?",
      opts: ["y = ⅔x − 1", "y = −3/2 x + 4", "y = 3/2 x", "y = −⅔x + 5"], a: "y = ⅔x − 1",
      model: "Rearrange: 2y = −3x + 12 → y = −3/2 x + 6, so m₁ = −3/2. Perpendicular gradient m₂ = −1 ÷ (−3/2) = 2/3. Only y = ⅔x − 1 has gradient ⅔." },
    // 5 — Geometry
    { id: "im10-12", topic: "5-geometry", q: "P, Q, R and S lie on a circle. PR is a diameter and angle QPR = 28°. Find (a) angle PQR, (b) angle QRP, (c) angle PSR. Give a reason for each answer.",
      model: "(a) Angle PQR = 90° — the angle in a semicircle is 90°. (b) Angles in triangle PQR sum to 180°, so angle QRP = 180 − 90 − 28 = 62°. (c) Angle PSR = 90°, again the angle in a semicircle (PR is a diameter for S too). Equivalently PQRS is a cyclic quadrilateral, so angle PQR + angle PSR = 180° → 180 − 90 = 90°. The reason is worth as much as the number here.",
      hint: "'Diameter' in the question means angle in a semicircle." },
    { id: "im10-13", topic: "5-geometry", q: "Two solid cones are mathematically similar. Their heights are 6 cm and 9 cm. The smaller cone has volume 40π cm³. Find the volume of the larger cone, correct to 3 significant figures.",
      model: "Length scale factor k = 9/6 = 1.5. Volume scale factor = k³ = 1.5³ = 3.375. Volume = 40π × 3.375 = 135π = 424.115… = 424 cm³ (3 s.f.). Multiplying by 1.5 rather than 1.5³ is the classic error.",
      hint: "Lengths k, areas k², volumes k³." },
    // 6 — Mensuration
    { id: "im10-14", topic: "6-mensuration", q: "A solid is a cylinder of radius 5 cm and height 12 cm with a hemisphere of the same radius fixed to the top. Calculate the total volume, correct to 3 significant figures.",
      model: "Cylinder: V = πr²h = π × 5² × 12 = 300π cm³. Hemisphere = half a sphere = ½ × 4/3 πr³ = ⅔ × π × 125 = 250π/3 cm³. Total = 300π + 250π/3 = 1150π/3 = 383.33π = 1204.27… = 1200 cm³ (3 s.f.). Both volume formulas are on the formula sheet — the halving is not.",
      hint: "A hemisphere is half of 4/3 πr³." },
    // 7 — Trigonometry
    { id: "im10-15", topic: "7-trigonometry", q: "In triangle ABC, AB = 7 cm, AC = 9 cm and angle BAC = 112°. Calculate (a) BC, (b) the area of the triangle. Give answers to 3 significant figures.",
      model: "(a) Two sides and the angle between them → cosine rule (given): BC² = 7² + 9² − 2(7)(9)cos 112° = 49 + 81 − 126 × (−0.37460…) = 130 + 47.200 = 177.200. BC = 13.311… = 13.3 cm. (b) Area = ½ab sin C = ½ × 7 × 9 × sin 112° = 31.5 × 0.92718 = 29.206… = 29.2 cm². Note cos 112° is negative, so the −2bc cos A term ADDS.",
      hint: "Two sides + the angle between them → cosine rule." },
    { id: "im10-16", topic: "7-trigonometry", q: "Solve 2 sin x + 1 = 0 for 0° ⩽ x ⩽ 360°.",
      model: "2 sin x = −1 → sin x = −½. The exact value sin 30° = ½ gives a reference angle of 30°. Sine is negative in the third and fourth quadrants, so x = 180 + 30 = 210° and x = 360 − 30 = 330°. Both are required — sketching y = sin x with the line y = −0.5 shows two crossings in range.",
      hint: "Sketch the sine curve and count the crossings in range." },
    // 8 — Transformations and vectors
    { id: "im10-17", topic: "8-transformations", q: "The point P has coordinates (3, −1). P is enlarged with centre (1, 2) and scale factor −2. Find the coordinates of the image P′.",
      model: "Vector from the centre to P = (3 − 1, −1 − 2) = (2, −3). Multiply by the scale factor −2: (2 × −2, −3 × −2) = (−4, 6). P′ = centre + this vector = (1 + (−4), 2 + 6) = (−3, 8). The negative scale factor sends the image to the opposite side of the centre.",
      hint: "Work with the vector FROM the centre, then scale it." },
    // 9 — Probability
    { id: "im10-18", topic: "9-probability", q: "A bag contains 5 red counters and 3 blue counters. Two counters are taken at random without replacement. Find the probability that the two counters are different colours.",
      model: "8 counters at first, 7 after one is removed. P(red then blue) = 5/8 × 3/7 = 15/56. P(blue then red) = 3/8 × 5/7 = 15/56. Different colours = 15/56 + 15/56 = 30/56 = 15/28. Multiply ALONG a branch, add ACROSS the paths.",
      hint: "Two different paths give 'different colours'." },
    { id: "im10-19", topic: "9-probability", q: "A and B are independent events with P(A) = 0.4 and P(B) = 0.25. Find P(A and B).",
      opts: ["0.1", "0.65", "0.15", "0.9"], a: "0.1",
      model: "For independent events P(A and B) = P(A) × P(B) = 0.4 × 0.25 = 0.1. (0.65 would be P(A) + P(B), which is the rule for MUTUALLY EXCLUSIVE events and gives P(A or B) — a different question.)" },
    // 10 — Statistics
    { id: "im10-20", topic: "10-statistics", q: "The times t minutes taken by 40 students to finish a task are: 0 < t ⩽ 10 → 6 students; 10 < t ⩽ 20 → 14; 20 < t ⩽ 30 → 12; 30 < t ⩽ 40 → 8. Calculate an estimate of the mean time.",
      model: "Midpoints: 5, 15, 25, 35. Σ(f × midpoint) = 6(5) + 14(15) + 12(25) + 8(35) = 30 + 210 + 300 + 280 = 820. Σf = 40. Estimated mean = 820 ÷ 40 = 20.5 minutes. On the GDC: enter 5, 15, 25, 35 as the data list and 6, 14, 12, 8 as the frequency list, then run 1-Var Stats. Divide by the total frequency (40), not the number of classes (4).",
      hint: "Midpoint = (lower + upper) ÷ 2." },
    { id: "im10-21", topic: "10-statistics", q: "Six students recorded hours revised (x) and test score (y): (1, 32), (2, 41), (3, 45), (4, 55), (5, 59), (6, 68). Use your GDC to find the equation of the regression line, and use it to estimate the score of a student who revised for 4.5 hours.",
      model: "Enter x into List 1 and y into List 2, then run linear regression: y = 6.97x + 25.6 (3 s.f.). At x = 4.5: y = 6.9714 × 4.5 + 25.6 = 31.37 + 25.6 = 56.97 ≈ 57.0. Sanity check — the line must pass through the mean point (x̄, ȳ) = (3.5, 50): 6.9714 × 3.5 + 25.6 = 24.4 + 25.6 = 50 ✓. Use the unrounded gradient from the GDC in the substitution, and quote the equation you read off.",
      hint: "The regression line always passes through the mean point." },
    // 11 — Investigation and Modelling (Paper 6)
    { id: "im10-22", topic: "11-investigation", q: "A staircase pattern is built from unit squares. Pattern 1 uses 1 square, Pattern 2 uses 3, Pattern 3 uses 6. (a) How many squares are in Patterns 4 and 5? (b) Find a rule for the number of squares S in Pattern n. (c) Justify your rule. (d) Which pattern uses 210 squares?",
      model: "(a) Each new pattern adds one more column than the last: Pattern 4 = 6 + 4 = 10, Pattern 5 = 10 + 5 = 15. (b) Tabulate n = 1..5 against S = 1, 3, 6, 10, 15. First differences 2, 3, 4, 5; second differences 2, 2, 2 — constant, so S is quadratic with 2a = 2 → a = ½. Fitting gives S = ½n² + ½n = n(n + 1)/2. Test on n = 5: 5(6)/2 = 15 ✓. (c) Justification: Pattern n is Pattern (n − 1) with a column of n squares added, so S = 1 + 2 + 3 + … + n. Pairing the first and last terms gives n/2 pairs each summing to (n + 1), hence S = n(n + 1)/2 — this explains WHY, rather than just fitting the numbers. (d) n(n + 1)/2 = 210 → n(n + 1) = 420 → n² + n − 420 = 0 → (n + 21)(n − 20) = 0 → n = 20 (reject n = −21, as n must be a positive whole number). Pattern 20.",
      hint: "Table → differences → rule → test it → justify from the structure." },
  ],

  mistakes: [
    { mistake: "Writing only the number the GDC produced, with no supporting working.", fix: "State what you did and what you read off — 'graphed y = 18000 × 0.88ˣ and y = 9000, intersection at x = 5.42' — then give the answer. Paper 6 in particular marks communication and reasoning, not just the value." },
    { mistake: "Trusting a GDC sketch in the default window.", fix: "A zero, intersection or turning point off-screen simply will not be found. Set a sensible window (or zoom out) and check the shape matches what the function should look like before you read anything off." },
    { mistake: "Relying on the GDC for skills that are examined without one.", fix: "One of the three Extended papers does not allow a calculator at all. Exact trig values, surds, index laws and factorising must be automatic by hand." },
    { mistake: "Confusing f(x + k) with f(x) + k.", fix: "Inside the bracket moves the graph HORIZONTALLY and in the opposite direction: f(x + 2) goes 2 left. Outside the bracket moves it VERTICALLY the way it reads: f(x) + 2 goes 2 up." },
    { mistake: "Doing gf(x) in the wrong order.", fix: "gf(x) = g(f(x)) — f acts first. Work right to left. Substitute the whole of f(x) into g wherever x appears, then simplify." },
    { mistake: "Writing the inverse function as 1/f(x).", fix: "f⁻¹ is the function that undoes f, not a reciprocal. Set y = f(x), swap x and y, then rearrange for y." },
    { mistake: "Rounding part-way through a multi-step question.", fix: "Keep the full value on the GDC (use ANS or a memory key) and round only the final answer. Non-exact answers to 3 s.f., angles to 1 d.p., unless the question says otherwise." },
    { mistake: "Scaling volumes of similar solids by the length ratio k instead of k³.", fix: "Lengths × k, areas × k², volumes × k³. Get k from one matching pair of LENGTHS first, then cube it for volume and square it for surface area." },
    { mistake: "Giving only one solution to a trigonometric equation in 0° ⩽ x ⩽ 360°.", fix: "The calculator returns one angle. Sketch the curve, draw the horizontal line, and count the crossings: for sin the partner is 180° − x, for cos it is 360° − x, for tan it is x + 180°." },
    { mistake: "Mixing up ∪ and ∩, or shading the wrong region of a Venn diagram.", fix: "∪ is 'union — in either', ∩ is 'intersection — in both'. A′ is everything in the universal set U that is NOT in A. Shade lightly in pencil first and check one sample element from each region." },
    { mistake: "Using P(A) + P(B) for events that are not mutually exclusive.", fix: "Addition is for mutually exclusive events; multiplication, P(A) × P(B), is for independent events. Check which the question states before choosing." },
    { mistake: "On the investigation paper, giving the rule with no table, no test and no justification.", fix: "Show the systematic cases in a labelled table, state the conjecture, TEST the rule on a case you did not use to build it, and explain why it works from the structure of the problem. The explanation carries marks the bare rule does not." },
  ],

  cheat: [
    {
      heading: "GDC playbook — your biggest advantage in 0607",
      bullets: [
        "SOLVE ANY EQUATION: graph the left side and the right side, then use INTERSECT. Works for unfamiliar equations you cannot rearrange, e.g. 2x − 1 = 1/x³.",
        "ZEROS: graph y = f(x) − g(x) and find the roots. Same answers, one graph.",
        "QUADRATICS: read both zeros, or use the vertex/minimum tool for the turning point.",
        "TURNING POINTS: local maximum and local minimum tools — set a window that contains them first.",
        "TABLE OF VALUES: use it to scan for sign changes and to answer 'how many complete years…' questions.",
        "STATISTICS: 1-Var Stats gives mean, median and quartiles. For grouped data, midpoints in the data list, frequencies in the frequency list.",
        "REGRESSION: two lists → linear regression → y = ax + b. Quote the equation, then substitute with the unrounded coefficients.",
        "NOT ALLOWED: calculators with symbolic algebraic logic. Other built-in apps and any external programs earn no credit.",
      ],
    },
    {
      heading: "Exam mechanics — formulas, accuracy, papers",
      bullets: [
        "GIVEN on the written papers: area of a triangle ½bh; A = πr²; C = 2πr; curved SA of cylinder 2πrh and cone πrl; SA of sphere 4πr²; volume of prism Al, pyramid ⅓Ah, cylinder πr²h, cone ⅓πr²h, sphere 4/3πr³; the quadratic formula; the sine rule; the cosine rule; area = ½ab sin C.",
        "NOT given — learn them: area of a parallelogram (bh) and trapezium (½(a+b)h); arc length and sector area; Pythagoras; gradient, midpoint and length; |a| = √(x²+y²); compound interest; all the circle theorems.",
        "On the investigation and modelling paper, any formula you need is given in the question itself.",
        "Accuracy: 3 s.f. for non-exact answers, 1 d.p. for angles in degrees, unless told otherwise. Money to 2 d.p.",
        "Never round mid-question — reuse the unrounded value in later parts.",
        "Use π from the calculator (or 3.142); if asked for an answer 'in terms of π', leave π in.",
        "You take three components: one without a calculator, one with the GDC, and one investigation and modelling paper with the GDC. Practise all three styles — they reward different things.",
      ],
    },
    {
      heading: "Functions — 0607's heavyweight topic",
      bullets: [
        "Know the shapes on sight: linear, quadratic, cubic, reciprocal a/x, exponential aˣ (rising for a > 1, falling for 0 < a < 1), and a sin(bx) / a cos(bx) / tan x.",
        "For a sin(bx): amplitude = |a|, period = 360° ÷ b.",
        "Vertex form y = a(x − h)² + k has vertex (h, k). Given vertex + a point, substitute to find a.",
        "f(x) + k → k up. f(x + k) → k LEFT. Inside the bracket does the opposite of what it looks like.",
        "Asymptotes: a/x has x = 0 and y = 0; tan x has 90°, 270°. Identify them from the graph — no algebra needed.",
        "gf(x) = g(f(x)), f first. Inverse: y = f(x) → swap x and y → rearrange.",
        "Logs: y = aˣ ⇔ x = log_a y. Solve aˣ = b with x = log b ÷ log a. Log LAWS are not required in 0607.",
      ],
    },
    {
      heading: "Sets and Venn diagrams",
      bullets: [
        "U = universal set (everything under discussion). A′ = complement = everything in U outside A.",
        "A ∪ B = union = in A OR B (or both). A ∩ B = intersection = in A AND B.",
        "n(A) = how many elements are in A. ∈ = is an element of; ∉ = is not.",
        "A ⊆ B = every element of A is also in B. Proper-subset notation is not required.",
        "∅ = the empty set — a region with nothing in it, not the number 0.",
        "Set-builder uses a vertical bar in 0607: A = {x | 1 ⩽ x ⩽ 9}, read 'all x such that…'.",
        "Extended Venn diagrams go up to THREE sets. Fill the centre overlap first and work outwards, so nothing gets double-counted.",
        "Shading questions: shade lightly, then test one element from each region against the expression.",
      ],
    },
    {
      heading: "Shape, trigonometry and number quick rules",
      bullets: [
        "Similar figures: lengths ×k, areas ×k², volumes ×k³. Get k from lengths first.",
        "Arc = (θ/360)×2πr; sector = (θ/360)×πr². Perimeter of a sector = arc + 2r.",
        "Regular polygon: exterior = 360/n; interior = 180 − exterior; interior sum = (n − 2)×180°.",
        "Bearings: three digits, clockwise from north, e.g. 025°. Back bearing = ±180°.",
        "Right angle? → Pythagoras + SOH-CAH-TOA. Two sides + the angle between → cosine rule. A side opposite a known angle → sine rule. Area of any triangle = ½ab sin C.",
        "Exact values: sin30 = ½, cos30 = √3/2, sin45 = cos45 = 1/√2, tan45 = 1, tan60 = √3.",
        "Percentage multiplier: +p% → ×(1 + p/100); −p% → ×(1 − p/100); n periods → ×multiplier^n. Reverse percentage: DIVIDE by the multiplier.",
        "Standard form must have 1 ⩽ A < 10 — fix 16 × 10³ to 1.6 × 10⁴.",
        "Describe a transformation fully and as ONE transformation: reflection (mirror line equation), rotation (angle + direction + centre), translation (column vector), enlargement (scale factor + centre).",
      ],
    },
    {
      heading: "Probability and statistics",
      bullets: [
        "P(A′) = 1 − P(A). Answers as a fraction, decimal or percentage — never a ratio.",
        "Mutually exclusive → P(A or B) = P(A) + P(B). Independent → P(A and B) = P(A) × P(B).",
        "Tree diagrams: multiply along a branch, add across the paths. Branches from a point sum to 1. Without replacement, both the total and the matching count drop by 1.",
        "Expected frequency = probability × number of trials.",
        "Estimated mean of grouped data = Σ(f × midpoint) ÷ Σf. Modal class = the class with the highest frequency.",
        "IQR = Q₃ − Q₁. Cumulative frequency: plot at UPPER class boundaries, smooth curve, median at n/2, quartiles at n/4 and 3n/4.",
        "Line of best fit: one ruled line, through the mean point (x̄, ȳ), across the whole data set.",
        "GDC regression gives the equation exactly — but say what the gradient MEANS in context if asked, and do not extrapolate far beyond the data.",
      ],
    },
    {
      heading: "Paper 6 — Investigation and Modelling method",
      bullets: [
        "INVESTIGATE: do the simple cases first, in order, and record every result in a clear labelled table. Do not skip ahead to guess the rule.",
        "SPOT: run the difference method down the table. Constant 1st difference → linear; constant 2nd → quadratic; constant 3rd → cubic; constant ratio → exponential.",
        "CONJECTURE: say it in words first ('each pattern adds a column of n squares'), then define your variables and write the rule in n.",
        "TEST: check the rule against a case you did NOT use to build it. Say explicitly that it works.",
        "JUSTIFY: explain WHY from the structure of the problem, not from the fact that the numbers fit. This is where the marks are that a correct rule alone does not earn.",
        "MODEL: define variables, state your assumptions, fit the model (GDC regression, or solve for the constants), predict, then EVALUATE — where does it fit, where does it break, why is extrapolation unsafe?",
        "COMMUNICATE: full sentences for conclusions, working shown for every value, and never a bare answer. Marks here are for reasoning and clarity as much as for arithmetic.",
        "If you get stuck, go back one case and write down what you notice — partial, clearly-communicated progress scores.",
      ],
    },
  ],
};
