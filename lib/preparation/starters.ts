import type {LearningPlacement} from '../learning/placement';
import type {PreparationQuestion} from './contracts';
export const STARTER_REVIEW={revision:1,language:'en',rights:'Original Vidya questions and explanations; no copied school papers.',checks:['factual','developmental','language','accessibility','rights'],reviewer:'AI-assisted internal editorial pass',limitations:'Small English Maths exploration collections. No independent teacher or child usability review. Grade labels guide challenge level, not curriculum alignment, age, reading ability or assessment readiness.'} as const;
type Entry=[topic:string,prompt:string,guide:string,hint:string];
/** Original framework-neutral starters, deliberately separate from board question banks. */
const entries:Record<number,Entry[]>={
 1:[
  ['Counting','There are 4 red blocks and 2 blue blocks. How many blocks altogether?','6 blocks. Count four, then count on two more: 5, 6.','You can draw or use real blocks.'],
  ['Taking away','Seven birds sit on a fence. Two fly away. How many stay?','5 birds. Start with 7 and take away 2.','Cross out two of seven marks.'],
  ['Comparing','Which is more: 8 shells or 5 shells? How do you know?','8 shells is more. You can match five pairs and see three shells left in the group of eight.','Match one from each group.'],
  ['Shapes','A flat shape has three straight sides. What could it be?','A triangle. Triangles have three straight sides and three corners.','Draw its sides with three sticks.'],
  ['Patterns','What comes next: red, blue, red, blue, red, ...?','Blue. The repeating unit is red, blue.','Say the two-colour pattern aloud.'],
  ['Making ten','You have 6 counters. How many more make 10?','4 more. Six and four make ten.','Draw ten spaces and fill six.'],
 ],
 2:[
  ['Place value','How many tens and ones are in 47?','4 tens and 7 ones. 47 = 40 + 7.','Group counters into tens.'],
  ['Addition','A shelf has 28 books. Add 15 books. How many now?','43 books. 28 + 10 = 38; 38 + 5 = 43.','Split 15 into 10 and 5.'],
  ['Subtraction','There are 52 beads. You use 18. How many remain?','34 beads. 52 − 10 = 42, then 42 − 8 = 34.','Take away ten first.'],
  ['Equal groups','There are 4 bags with 3 apples in each. How many apples?','12 apples. 3 + 3 + 3 + 3 = 12.','Draw four groups of three.'],
  ['Halves','Share 12 grapes equally between two plates. How many on each?','6 grapes on each plate. Half of 12 is 6.','Alternate placing one grape on each plate.'],
  ['Time','The clock shows 3 o’clock. What time is it one hour later?','4 o’clock. One hour moves the hour hand to the next number.','Count forward one hour.'],
 ],
 3:[
  ['Multiplication','A garden has 6 rows of 4 plants. How many plants?','24 plants. 6 × 4 = 24.','Think of an array with six rows.'],
  ['Division','Share 35 cards equally among 5 players. How many each?','7 cards each, because 5 × 7 = 35.','Which multiple of five is 35?'],
  ['Fractions','A strip has 8 equal parts. Three are shaded. What fraction is shaded?','3/8. The denominator counts all equal parts; the numerator counts shaded parts.','How many equal parts in the whole?'],
  ['Measurement','A ribbon is 2 m long. How many centimetres is that?','200 cm. Each metre is 100 cm, so 2 × 100 = 200.','One metre is 100 centimetres.'],
  ['Perimeter','A rectangle is 5 cm long and 3 cm wide. Find the distance around it.','16 cm. Add all sides: 5 + 3 + 5 + 3.','Perimeter follows the outside edge.'],
  ['Money','A notebook costs ₹18. You pay ₹50. How much change?','₹32. 50 − 18 = 32.','Count from 18 up to 50.'],
 ],
 4:[
  ['Fractions','Add 2/7 and 3/7. Explain why the denominator stays the same.','5/7. You are counting five parts of the same size, sevenths.','Add the counts, not the size of the parts.'],
  ['Decimals','What is 3.4 + 1.25?','4.65. Write 3.40 + 1.25 and align place values.','Use a zero so both numbers show hundredths.'],
  ['Area','A rectangle is 8 cm by 5 cm. Find its area.','40 cm². Area = length × width = 8 × 5.','How many unit squares cover it?'],
  ['Symmetry','How many lines of symmetry does a non-square rectangle have?','2: one through the centre horizontally, one vertically. Its diagonals are not symmetry lines.','Imagine folding matching halves.'],
  ['Angles','How many right angles make one full turn?','4 right angles. Each is 90°, and a full turn is 360°.','Think of turning through the four corners of a square.'],
  ['Reasoning','Three boxes each hold 24 pencils. Give 19 pencils away. How many remain?','53 pencils. First 3 × 24 = 72, then 72 − 19 = 53.','Find the total before subtracting.'],
 ],
 5:[
  ['Fractions','Calculate 1/2 + 1/3.','5/6. Rewrite the fractions as 3/6 and 2/6, then add.','Find a common denominator.'],
  ['Decimals','Calculate 2.5 × 4.','10. Four groups of 2.5 make 10.','Double 2.5, then double again.'],
  ['Volume','A cuboid is 4 cm by 3 cm by 2 cm. What is its volume?','24 cm³. Multiply length, width and height: 4 × 3 × 2.','Count layers of unit cubes.'],
  ['Percentages','What is 25% of 80?','20. 25% is one quarter, and 80 ÷ 4 = 20.','Turn the percentage into a familiar fraction.'],
  ['Ratio','A drink uses 2 cups of juice for every 3 cups of water. How much water for 6 cups of juice?','9 cups. Multiply both amounts by 3.','How many times larger is 6 than 2?'],
  ['Order of operations','Calculate 6 + 4 × 3. Explain the order.','18. Multiply first: 4 × 3 = 12, then add 6.','Multiplication comes before addition here.'],
 ],
 6:[
  ['Integers','The temperature is −3 °C and rises by 8 °C. What is it now?','5 °C. −3 + 8 = 5.','Move eight steps right on a number line.'],
  ['Ratio','Divide 35 counters in the ratio 2:5.','10 and 25 counters. There are 7 equal shares, each worth 5.','Add the ratio parts first.'],
  ['Algebra','Solve x + 7 = 19.','x = 12. Subtract 7 from both sides; 12 + 7 = 19 checks it.','Undo adding seven.'],
  ['Angles','Two angles of a triangle are 48° and 67°. Find the third.','65°. Angles in a triangle total 180°; 180 − 48 − 67 = 65.','Subtract the known angles from 180°.'],
  ['Probability','A bag has 3 red and 5 blue beads. What is the probability of a red bead on one random draw?','3/8. There are 3 favourable outcomes among 8 equally likely beads.','Count all the beads, not only the blue ones.'],
  ['Units','Convert 2.75 km to metres.','2750 m. One kilometre is 1000 metres, so multiply by 1000.','Metres are smaller units, so the count increases.'],
 ],
 7:[
  ['Equations','Solve 3x + 4 = 25.','x = 7. Subtract 4 to get 3x = 21, then divide by 3.','Undo addition before multiplication.'],
  ['Directed numbers','Calculate (−6) × (−4).','24. The product of two negative numbers is positive.','Decide the sign, then multiply the magnitudes.'],
  ['Percentage change','A price rises from ₹200 to ₹230. Find the percentage increase.','15%. The increase is ₹30; 30 ÷ 200 × 100 = 15%.','Use the original price as the denominator.'],
  ['Circles','Find the area of a circle of radius 7 cm. Use π = 22/7.','154 cm². Area = πr² = (22/7) × 49.','Use the radius, not the diameter.'],
  ['Averages','Find the mean of 4, 7, 9 and 12.','8. Their sum is 32; 32 ÷ 4 = 8.','Add all values and divide by their count.'],
  ['Probability','A fair six-sided die is rolled. What is the probability of a number greater than 4?','1/3. The favourable outcomes are 5 and 6, so 2/6 = 1/3.','List the outcomes that fit.'],
 ],
 8:[
  ['Linear equations','Solve 5x − 8 = 2x + 13.','x = 7. Subtract 2x and add 8 to get 3x = 21.','Collect x terms on one side.'],
  ['Indices','Simplify 2³ × 2⁴.','2⁷ = 128. When multiplying powers of the same base, add the exponents.','Keep the base and add exponents.'],
  ['Factorisation','Factorise 6x + 9.','3(2x + 3). Both terms share a factor of 3.','Find the highest common numerical factor.'],
  ['Right triangles','A right triangle has perpendicular sides 6 cm and 8 cm. Find the hypotenuse.','10 cm. c² = 6² + 8² = 100, so c = 10.','The hypotenuse is opposite the right angle.'],
  ['Independent events','Flip a fair coin twice. What is the probability of two heads?','1/4. Independent probabilities multiply: 1/2 × 1/2.','List HH, HT, TH and TT.'],
  ['Scale','A map scale is 1:50 000. What actual distance does 3 cm represent? Give kilometres.','1.5 km. 3 × 50 000 = 150 000 cm = 1500 m = 1.5 km.','First find the actual distance in centimetres.'],
 ],
 9:[
  ['Simultaneous equations','Solve x + y = 11 and x − y = 3.','x = 7, y = 4. Add the equations: 2x = 14, then substitute.','Adding eliminates y.'],
  ['Quadratics','Factorise x² + 5x + 6.','(x + 2)(x + 3). Two and three multiply to six and add to five.','Look for a factor pair of six.'],
  ['Coordinate geometry','Find the gradient of the line through (1, 2) and (5, 10).','2. Gradient = (10 − 2)/(5 − 1) = 8/4.','Change in y divided by change in x.'],
  ['Trigonometry','A right triangle has opposite side 3 and hypotenuse 5 relative to angle θ. Find sin θ.','3/5 = 0.6. Sine is opposite divided by hypotenuse.','Choose the ratio using the named sides.'],
  ['Surds','Simplify √72.','6√2. Since 72 = 36 × 2, √72 = √36 × √2.','Find a square factor of 72.'],
  ['Statistics','Find the median of 9, 2, 7, 5, 12.','7. Put the values in order: 2, 5, 7, 9, 12; choose the middle one.','Order the data first.'],
 ],
 10:[
  ['Quadratic equations','Solve x² − 5x + 6 = 0.','x = 2 or x = 3. Factorise to (x − 2)(x − 3) = 0.','A product is zero when at least one factor is zero.'],
  ['Similarity','Two similar triangles have corresponding side lengths 4 cm and 10 cm. The smaller area is 12 cm². Find the larger area.','75 cm². The length scale factor is 2.5; area scales by 2.5², so 12 × 6.25 = 75.','Square the length scale factor.'],
  ['Compound growth','₹1000 grows by 10% each year for two years. Find the final amount.','₹1210. 1000 × 1.1² = 1210.','Apply the second increase to the new amount.'],
  ['Circle geometry','An angle at the centre of a circle is 116°. Find the angle at the circumference subtended by the same arc.','58°. The angle at the centre is twice the angle at the circumference standing on the same arc.','Use the same arc in the stated condition.'],
  ['Probability without replacement','A bag contains 3 red and 2 blue beads. Draw two without replacement. Find the probability both are red.','3/10. Multiply 3/5 by 2/4. There is one fewer red bead and one fewer total bead after the first red.','The second probability changes.'],
  ['Completing the square','Write x² + 6x + 5 in completed-square form.','(x + 3)² − 4. Expanding gives x² + 6x + 9 − 4.','Half the coefficient of x, then adjust the constant.'],
 ],
 11:[
  ['Differentiation','Differentiate y = 3x⁴ − 2x.','dy/dx = 12x³ − 2. Apply the power rule term by term.','Multiply by the exponent, then reduce it by one.'],
  ['Logarithms','Solve log₂ x = 5.','x = 32, since 2⁵ = 32.','Rewrite the logarithm in exponential form.'],
  ['Arithmetic sequences','Find the 10th term of 4, 7, 10, ... .','31. aₙ = 4 + (n − 1) × 3, so a₁₀ = 4 + 27.','There are nine steps from the first to the tenth term.'],
  ['Geometric sequences','Find the sum of the first four terms of 3, 6, 12, ... .','45. Add 3 + 6 + 12 + 24.','The common ratio is two.'],
  ['Binomial expansion','Expand (1 + x)³.','1 + 3x + 3x² + x³. You can multiply (1 + x)(1 + x)(1 + x) to check.','The coefficients are 1, 3, 3, 1.'],
  ['Conditional probability','A group has 6 students wearing glasses, of whom 4 play chess. Given that a student wears glasses, what is the probability they play chess?','2/3. The condition restricts the group to 6 students; 4 of those play chess.','Use the conditional group as the denominator.'],
 ],
 12:[
  ['Integration','Find an antiderivative of 6x².','2x³ + C. Differentiating 2x³ gives 6x².','Raise the exponent by one, then divide by the new exponent.'],
  ['Chain rule','Differentiate y = (2x + 1)³.','dy/dx = 6(2x + 1)². Differentiate the outer power and multiply by the inner derivative 2.','Remember the derivative of the inside expression.'],
  ['Trigonometric identities','If sin θ = 3/5 and θ is acute, find cos θ.','4/5. cos²θ = 1 − 9/25 = 16/25; take the positive root for an acute angle.','Use sin²θ + cos²θ = 1.'],
  ['Vectors','Find the dot product of (2, −1, 3) and (4, 2, 0).','6. Multiply corresponding components and add: 8 − 2 + 0.','The result is a scalar.'],
  ['Binomial probability','A fair coin is flipped three times. Find the probability of exactly two heads.','3/8. The successful equally likely sequences are HHT, HTH and THH among eight sequences.','Count arrangements as well as the probability of one arrangement.'],
  ['Exponentials','Solve e^(2x) = e⁶ for real x.','x = 3. The exponential function is one-to-one, so 2x = 6.','Equate the exponents.'],
 ],
 13:[
  ['Complex numbers','Find the two complex roots of z² = −9.','z = 3i or z = −3i, where i² = −1.','Both signs are needed.'],
  ['Definite integrals','Evaluate the integral of 2x from x = 1 to x = 4.','15. An antiderivative is x²; evaluate 4² − 1².','Subtract the lower-limit value from the upper-limit value.'],
  ['Distribution functions','A continuous random variable has F(2) = 0.3 and F(5) = 0.8. Find P(2 < X ≤ 5).','0.5. Subtract the cumulative probabilities: F(5) − F(2).','A cumulative probability includes everything up to its argument.'],
  ['Proof','Show that the sum of two odd integers is even.','Write them as 2m + 1 and 2n + 1 for integers m and n. Their sum is 2(m + n + 1), a multiple of 2.','Represent arbitrary odd integers rather than only examples.'],
  ['Vector projection','Find the scalar component of vector (3, 4) in the direction of unit vector (1, 0).','3. Take their dot product: 3 × 1 + 4 × 0.','A scalar component is a signed length along a unit direction.'],
  ['Differential equations','Solve dy/dx = 2x with y(0) = 5.','y = x² + 5. Integrate to get y = x² + C, then use the initial condition.','Determine the integration constant from the given point.'],
 ],
};
export function starterFor(placement:LearningPlacement):{id:string;title:string;questions:PreparationQuestion[]}|undefined{
 if(placement.kind!=='school'||!entries[placement.grade])return undefined;
 return {id:`vidya-maths-exploration-${placement.grade}-v1`,title:`Maths exploration · Grade ${placement.grade}`,questions:entries[placement.grade].map(([topic,prompt,guide,hint],i)=>({id:`maths-${placement.grade}-${i+1}`,topic,prompt,guide,hint,marks:2}))};
}
