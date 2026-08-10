// Cambridge IGCSE Business Studies 0450 — full syllabus (all six sections).
//
// Verified 2026-08-11 against the Cambridge IGCSE Business Studies 0450 subject
// page (https://www.cambridgeinternational.org/programmes-and-qualifications/
// cambridge-igcse-business-studies-0450/), which is live and carries both the
// 2023–2025 and the 2026 syllabus documents. Note for later maintainers: that
// page states Cambridge renames the qualification to "Business" and moves it to
// code 0264 from 2027 — this pack targets 0450 as sat in 2026/27.
//
// Every ratio and formula below is written in the form 0450 examines and was
// checked one by one (gross profit margin, profit margin, ROCE, current ratio,
// acid test, working capital, break-even, contribution, margin of safety,
// productivity, market share). All four numerical questions are worked end to
// end with the arithmetic checked.
//
// Paper structure is described by SKILL, not by mark counts: Paper 1 is short
// answer and data response, Paper 2 is a case study, and both papers assess the
// whole of sections 1–6. Where a mark tariff would have been a guess it has been
// left out deliberately — see the last bullet of `cheat`.
//
// Case businesses (Solavia, Brightwood, Tamarind Toys, NovaKnit, Harbourline,
// PedalPoint, Rukmini Textiles, Kestrel Cabs, Bela's Bakes, Cloudline) are all
// invented for this pack. No past-paper case or wording is reproduced.

import type { ExamPack } from "../exam-pack";

export const IGCSE_BUSINESS_PACK: ExamPack = {
  subjectId: "igcse-business",
  grade: 10,
  title: "Business Studies — Full Syllabus · IGCSE",
  context: "Cambridge IGCSE 0450 · sections 1–6 · Paper 1 short answer + Paper 2 case study",
  highlights: [
    { label: "Syllabus", value: "0450 · sections 1 – 6" },
    { label: "Where marks live", value: "Application + evaluation" },
    { label: "Must be exact", value: "The eight formulae" },
  ],
  pinnedRule: {
    heading: "Name the business, use the case",
    body: "In 0450 almost nobody loses marks for not knowing the theory — they lose them for writing the theory in general. A point that could be pasted into any answer scores the knowledge mark and stops. Every developed point must name the business, use a fact or figure from the case (the product, the market, the profit margin, the number of employees), and say what that means for THIS firm. On any question with Analyse, Justify, Recommend, Evaluate or 'do you think', finish with a judgement that says which factor matters most here and why — no judgement, no top band.",
  },
  reference: {
    label: "Cambridge IGCSE Business Studies 0450 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-business-studies-0450/",
  },
  plan: [
    { title: "Walk the six sections", hint: "Activity → people → marketing → operations → finance → external" },
    { title: "Write the eight formulae from memory", hint: "Blank page, no notes — repeat until clean" },
    { title: "Do one break-even and one cash flow cold", hint: "Full working, units on every line" },
    { title: "Drill the command words", hint: "Identify vs Explain vs Analyse vs Recommend" },
    { title: "Practise the evaluation paragraph", hint: "Point → explain → apply → counter → judge" },
    { title: "Read the cheat sheet the morning of the exam", hint: "Formulae and command words only" },
  ],

  topics: [
    {
      id: "1-business-activity", num: 1, title: "1. Understanding business activity",
      blurb: "Why businesses exist, how they are classified, owned and grown — and who has a stake in them.",
      syllabus: [
        "Needs are essentials for survival (food, shelter, clothing, water); wants are unlimited desires. Because resources are scarce, every choice has an opportunity cost — the next best alternative given up. Added value = selling price − cost of bought-in materials and components; raise it by branding, better design, convenience or service, not just by cutting cost.",
        "The four factors of production: land (all natural resources), labour (the workforce), capital (machinery, buildings, money used to produce), enterprise (the entrepreneur who takes the risk and combines the other three).",
        "Classification by sector: primary (extraction and growing), secondary (manufacturing and construction), tertiary (services). Industrialisation is a shift of output and employment towards the secondary sector; de-industrialisation is a shift away from it towards services. Private sector (owned by individuals, usually profit-motivated) vs public sector (state-owned, providing essential services) in a mixed economy.",
        "Enterprise and entrepreneurs: risk-taking, initiative, determination, self-confidence, innovation. Contents and purpose of a business plan (idea, aims, market research, marketing mix, operations, finance needed, cash flow forecast) — mainly to persuade a lender or investor and to reduce risk. Government supports start-ups because they create jobs, increase output and may grow into large employers. Business size measured by number of employees, value of output, value of sales or capital employed — no single measure is reliable on its own.",
        "Business growth: internal/organic (open more outlets, sell more, new products) vs external (merger = agreed joining, takeover/acquisition = one buys another). Integration types: horizontal (same industry, same stage), vertical forward (towards the customer, e.g. a manufacturer buying a retailer), vertical backward (towards the supplier), conglomerate (unrelated industries — diversification). Businesses stay small by choice or because of limited capital, a small niche market, or the owner's wish to keep control.",
        "Types of business organisation and business objectives: sole trader and partnership (unlimited liability — the owner's personal assets are at risk), private limited company Ltd and public limited company plc (limited liability, separate legal identity; plc shares are traded publicly, which risks loss of control), franchise, joint venture, social enterprise, public corporation. Objectives: survival, profit, growth, market share, customer satisfaction, social and environmental aims — and how these change as the business develops. Stakeholders: owners/shareholders, workers, managers, customers, suppliers, lenders, government, the local community — their objectives conflict, and the business must decide whose to prioritise.",
      ],
    },
    {
      id: "2-people", num: 2, title: "2. People in business",
      blurb: "Motivating, organising, recruiting, training and communicating with the workforce.",
      syllabus: [
        "Why people work and why motivation matters: motivated workers give higher productivity, better quality, lower absenteeism and lower labour turnover — which cuts recruitment and training costs.",
        "Motivation theory. Taylor (scientific management): money is the main motivator, so use time-and-motion study to find the best method and pay piece rate. Maslow: a five-level hierarchy — physiological, safety/security, social (belonging), esteem, self-actualisation — where a level only motivates once the level below is met. Herzberg (two-factor): hygiene factors (pay, working conditions, supervision, company policy, job security) only prevent dissatisfaction; motivators (achievement, recognition, the work itself, responsibility, advancement) are what actually create satisfaction — hence job enrichment.",
        "Methods of motivation. Financial: wages (time rate or piece rate), salary, commission, bonus, profit sharing, fringe benefits. Non-financial: job rotation, job enlargement, job enrichment, autonomy, teamworking, training, opportunities for promotion, praise.",
        "Organisation and management: organisation charts, hierarchy, chain of command, span of control, levels of hierarchy; tall vs flat structures and delayering. Delegation (passing authority down while responsibility stays with the manager) and why managers resist it. Functions of management (planning, organising, coordinating, commanding, controlling). Leadership styles — autocratic, democratic, laissez-faire — and when each suits. Trade unions and their role.",
        "Recruitment, selection and training: job analysis → job description (the duties) → person specification (the qualities needed) → advertise → shortlist from application forms/CVs → interview and testing. Internal recruitment (cheaper, faster, known candidate, but no fresh ideas and leaves another vacancy) vs external. Part-time vs full-time contracts. Induction, on-the-job and off-the-job training and the costs and benefits of each. Reducing the workforce: dismissal (for a reason) vs redundancy (the job no longer exists). Legal controls on employment — contracts, unfair dismissal, discrimination, health and safety, minimum wage.",
        "Communication: the model of sender → message → medium → receiver → feedback. One-way vs two-way, formal vs informal, internal vs external. Choosing the medium (face-to-face, meeting, telephone, email, notice board, video call, written report) by speed, cost, need for a record and need for feedback. Barriers — language and jargon, too long a chain of command, poor medium choice, physical distance, noise, distrust of the sender, information overload — and how to remove them.",
      ],
    },
    {
      id: "3-marketing", num: 3, title: "3. Marketing",
      blurb: "Finding out what customers want, and building the mix that sells it to them profitably.",
      syllabus: [
        "The role of marketing: identify customer needs, satisfy them profitably, maintain and build market share, build customer loyalty and brand image. Mass marketing vs niche marketing. Market share = (business's sales ÷ total market sales) × 100. Why markets change — incomes, tastes, technology, competition, ageing populations.",
        "Market research: primary/field research (questionnaire, interview, focus group, observation, test marketing) is up to date and specific but slow and expensive; secondary/desk research (government statistics, trade journals, internet, internal sales records, competitors' reports) is cheap and quick but may be out of date or gathered for another purpose. Quantitative data (numbers, how many) vs qualitative (opinions, why). Sampling, sample size and bias; presenting and interpreting results from tables, bar charts, pie charts and line graphs.",
        "Market segmentation by age, gender, income, region, lifestyle or interest: allows a targeted mix, less wasted promotion and a higher price from a well-matched product — but risks a market too small to be profitable.",
        "The marketing mix — Product: goods and services, brand, packaging, unique selling point, product development and the costs and risks of it. Price: cost-plus, competitive, penetration (low price to enter and gain share), skimming (high price for a new/innovative product), promotional and psychological pricing; price elasticity as the idea that a fall in price raises quantity demanded more for some products than others.",
        "The marketing mix — Place: channels of distribution (producer → consumer direct; producer → retailer → consumer; producer → wholesaler → retailer → consumer) and why each suits different products. Promotion: aims (inform, persuade, remind) and methods — advertising above the line (television, radio, press, billboards, online), sales promotion below the line (discounts, BOGOF, free gifts, loyalty cards, point-of-sale display), sponsorship, public relations, social media; the promotion budget as a constraint.",
        "Product life cycle — development, introduction, growth, maturity, saturation, decline — with the cash flow and marketing implications at each stage, and extension strategies (new packaging, new market, new features, price cut, more promotion). Marketing strategy: a coherent mix chosen for a target market and objective. Legal controls on marketing (misleading claims, false descriptions, unsafe products). E-commerce and internet marketing: wider (global) reach, lower fixed costs, 24-hour trading and customer data — against delivery costs, returns, price transparency, cyber-security and the loss of face-to-face service. Opportunities and problems of entering new foreign markets.",
      ],
    },
    {
      id: "4-operations", num: 4, title: "4. Operations management",
      blurb: "Turning inputs into outputs: production methods, productivity, costs, quality and location.",
      syllabus: [
        "Production methods. Job: one-off, made to a customer's exact order — flexible and high value added, but slow, labour-intensive and expensive per unit. Batch: groups of identical items made together — some variety and lower unit cost, but time and cost lost in changeovers and work-in-progress builds up. Flow: continuous mass production of identical items — very low unit cost through economies of scale and automation, but huge capital cost, inflexible, and a breakdown stops everything.",
        "Productivity = total output ÷ number of workers (or ÷ hours worked) over the same period. Raising productivity lowers the labour cost per unit even if wages are unchanged. Methods: training, better motivation, more/better capital equipment, improved layout, automation. Distinguish productivity (output per worker) from production (total output) — the exam rewards the distinction.",
        "Costs, scale and break-even: fixed costs do not change with output; variable costs do; total cost = fixed + variable; revenue = price × quantity; profit = revenue − total cost. Contribution per unit = selling price − variable cost per unit. Break-even output = fixed costs ÷ contribution per unit. Margin of safety = actual output − break-even output. Interpret and draw a break-even chart, and use it to test a price change, a cost change or a new fixed cost. Limitations: it assumes everything made is sold and that price and unit variable cost stay constant.",
        "Economies of scale — purchasing (bulk buying), marketing, financial (cheaper borrowing), managerial (specialists), technical (larger, more efficient machinery) — reduce the average cost per unit as the business grows. Diseconomies of scale — poor communication, weaker coordination, falling morale in a large impersonal firm — raise it again beyond a point.",
        "Achieving quality: quality control (inspecting finished output and rejecting faults — catches defects late, after the cost has been incurred) vs quality assurance (agreed standards checked at every stage, each worker responsible for their own output — prevents faults but needs training and buy-in). Total quality management and continuous improvement. Why quality matters: reputation, repeat custom, ability to charge more, fewer returns and less waste.",
        "Location decisions for a factory (near raw materials or near the market, land cost, availability and cost of labour, transport links, power and water, government grants and legal restrictions), for a retailer (footfall, parking, rent, nearness to competitors, local incomes) and for a service. Reasons for relocating, including moving production abroad for lower labour costs or to be inside a trade barrier — and the risks of doing so. Inventory (stock) control and the just-in-time principle.",
      ],
    },
    {
      id: "5-finance", num: 5, title: "5. Financial information and decisions",
      blurb: "Where the money comes from, where it goes, and what the accounts and ratios reveal.",
      syllabus: [
        "The need for finance: start-up capital, expansion into new products or markets, replacing worn-out equipment, and day-to-day working capital. Short-term finance covers a temporary cash shortage; long-term finance buys assets that last for years — match the length of the finance to the length of the need.",
        "Internal sources: retained profit (no interest, no loss of control, but not available to a new business and cannot be paid out to owners), sale of unwanted non-current assets, owner's savings, cutting inventory. External sources: bank overdraft (flexible, short term, high interest, repayable on demand), bank loan (fixed repayments, interest, often needs collateral), trade credit, hire purchase and leasing, share issue for a Ltd or plc (no repayment, but ownership is diluted), debentures, government grants, micro-finance and crowd-funding. Which source is best depends on the amount, the purpose, the legal form of the business and the existing level of borrowing.",
        "Cash flow: cash inflows and outflows, net cash flow = inflows − outflows, closing balance = opening balance + net cash flow, and the opening balance of each month is the closing balance of the last. Complete and interpret a cash flow forecast, identify the month of the shortage, and state the size of the overdraft needed. Causes of cash flow problems (overtrading, allowing customers too long to pay, holding too much inventory, buying non-current assets with cash, seasonal sales) and the fixes (arrange an overdraft, delay payments to suppliers, chase receivables, lease rather than buy, cut or delay spending). Profit is not cash — a profitable business can still run out of cash.",
        "Working capital = current assets − current liabilities: the finance available for day-to-day running. Too little and the business cannot pay suppliers or wages; too much tied up in inventory and receivables is idle money.",
        "Income statement: revenue − cost of sales = gross profit; gross profit − expenses (overheads) = profit. Statement of financial position: non-current assets and current assets (inventory, trade receivables, cash) set against current liabilities (trade payables, overdraft) and non-current liabilities (long-term loans), with the remainder being the owners' equity/capital. Capital employed = equity + non-current liabilities.",
        "Analysis of accounts. Profitability: gross profit margin = (gross profit ÷ revenue) × 100; profit margin = (profit ÷ revenue) × 100; return on capital employed = (profit ÷ capital employed) × 100. Liquidity: current ratio = current assets ÷ current liabilities; acid test ratio = (current assets − inventory) ÷ current liabilities. Interpret each result — compare with last year or with a competitor, say whether it has improved or worsened, and say what the business should do about it. Users of accounts (owners, managers, lenders, suppliers, workers, government) and why each wants them.",
      ],
    },
    {
      id: "6-external", num: 6, title: "6. External influences on business activity",
      blurb: "Government, the economy, ethics, the environment and the wider world — everything the business cannot control.",
      syllabus: [
        "Government economic objectives: economic growth, low unemployment, low inflation (a sustained rise in the general price level) and a healthy balance of payments. The business cycle — growth, boom, recession, slump, recovery — and what each stage does to demand, employment and business confidence.",
        "Government policy and its effect on business. Fiscal: changes in taxes (income tax cuts raise consumer spending; higher profits tax cuts retained profit) and in government spending. Monetary: a rise in interest rates raises the cost of existing and new borrowing, discourages investment in new equipment, and cuts consumer demand for goods bought on credit — hitting car, housing and other big-ticket sellers hardest and highly-borrowed firms hardest. Supply-side measures such as training and infrastructure.",
        "Exchange rates: an appreciation makes exports dearer to foreign buyers and imports cheaper in the home currency; a depreciation makes exports cheaper and imports dearer. Work out the winners and losers for the specific business — does it export, does it import raw materials, or both?",
        "Legal controls: consumer protection (safe products, honest description, accurate weights), employment law (contracts, minimum wage, discrimination, unfair dismissal), health and safety, and environmental regulation. Compliance raises costs but avoids fines, closure and damage to reputation.",
        "Ethics and the environment: the conflict between short-run profit and doing the right thing (child labour, working conditions in the supply chain, honest advertising, bribery). External costs/externalities such as pollution, congestion and noise fall on society rather than the firm. Sustainability, recycling, waste reduction and the pressure from consumers and pressure groups — an ethical stance can raise costs but also differentiate the brand and win customers.",
        "Globalisation and international business: why it has grown, the opportunities (larger market, cheaper inputs, economies of scale) and the threats (foreign competition at home, exchange rate risk, ethical scrutiny). Multinational companies and their benefits and drawbacks for the host country. Free trade vs protection: tariffs (a tax on imports) and quotas (a physical limit on imports), and why a government imposes them.",
      ],
    },
  ],

  flashcards: [
    { term: "Opportunity cost", def: "The next best alternative given up when a choice is made. Because resources are scarce, every decision has one — name the specific alternative the business gave up, not just 'money'." },
    { term: "Added value", def: "Selling price − cost of the bought-in materials and components. Raise it by branding, design, convenience or service — not only by cutting costs." },
    { term: "Factors of production", def: "Land (natural resources), labour (workforce), capital (machinery, buildings, finance used to produce), enterprise (the risk-taking entrepreneur who combines the other three)." },
    { term: "The three sectors", def: "Primary = extraction/growing (mining, farming, fishing). Secondary = manufacturing and construction. Tertiary = services (retail, banking, transport, tourism)." },
    { term: "Limited vs unlimited liability", def: "Limited (Ltd, plc): shareholders can lose only what they invested; the company is a separate legal person. Unlimited (sole trader, partnership): personal assets can be taken to pay business debts." },
    { term: "Ltd vs plc", def: "Ltd: shares sold privately, usually to family and friends; owners keep control; accounts less public. Plc: shares sold to the public on a stock exchange; can raise far more capital but risks takeover and loss of control." },
    { term: "Stakeholder", def: "Any individual or group with an interest in the business — owners, workers, managers, customers, suppliers, lenders, government, the local community. Their objectives conflict; the exam wants you to say whose the business should prioritise and why." },
    { term: "Types of integration", def: "Horizontal = same industry, same stage. Vertical forward = towards the customer. Vertical backward = towards the supplier. Conglomerate = unrelated industry (diversification to spread risk)." },
    { term: "Taylor", def: "Scientific management: money is the main motivator. Use time-and-motion study to find the one best method, then pay piece rate so output determines pay." },
    { term: "Maslow", def: "Hierarchy of needs — physiological, safety/security, social (belonging), esteem, self-actualisation. A level only motivates once the one below it is satisfied." },
    { term: "Herzberg", def: "Two-factor theory. Hygiene factors (pay, conditions, supervision, company policy, job security) only PREVENT dissatisfaction. Motivators (achievement, recognition, the work itself, responsibility, advancement) create satisfaction — hence job enrichment." },
    { term: "Span of control vs chain of command", def: "Span of control = how many subordinates report directly to one manager. Chain of command = the route an instruction travels from top to bottom. A flat structure has a wide span and a short chain; a tall one the reverse." },
    { term: "Delegation", def: "Passing authority for a task down to a subordinate. Responsibility stays with the manager — which is why managers who do not trust their staff refuse to delegate and end up overloaded." },
    { term: "Leadership styles", def: "Autocratic: leader decides, orders given — fast, good in a crisis, demotivating. Democratic: workers consulted — better ideas and motivation, slower. Laissez-faire: broad goals, workers left to it — suits skilled creative staff, risks drift." },
    { term: "Types of training", def: "Induction: introduces a new worker to the job and firm. On-the-job: learning while working, cheap, but the trainer's bad habits pass on. Off-the-job: away from the workplace, wider skills, expensive, and the trained worker may leave." },
    { term: "Internal vs external recruitment", def: "Internal: cheaper, quicker, the candidate is known and it motivates staff — but brings no new ideas and leaves a second vacancy. External: fresh ideas and a wider pool — but costlier, slower and riskier." },
    { term: "Primary vs secondary research", def: "Primary/field = collected first-hand for this purpose (questionnaire, interview, focus group, observation, test market) — current and specific, but slow and costly. Secondary/desk = already exists (government data, trade journals, internet, internal records) — cheap and fast, but may be out of date or not quite fit the question." },
    { term: "Market segmentation", def: "Splitting a market into groups with similar characteristics (age, gender, income, region, lifestyle) so a targeted mix can be built. Sharper targeting and less wasted promotion, but the segment may be too small to be profitable." },
    { term: "Penetration vs skimming pricing", def: "Penetration: deliberately low price to enter a market and win share fast, raised later. Skimming: high launch price for an innovative product to recover development costs from early adopters, lowered as rivals arrive." },
    { term: "Product life cycle", def: "Development → introduction → growth → maturity → saturation → decline. Cash flow is negative in development and introduction and strongest in maturity. Extension strategies: new packaging, new market, new features, price cut, extra promotion." },
    { term: "Job, batch and flow production", def: "Job: one-off to order — flexible, high value added, high unit cost. Batch: groups of identical items — some variety, changeover time lost. Flow: continuous, identical, automated — lowest unit cost, huge capital cost, inflexible." },
    { term: "Productivity formula", def: "Productivity = total output ÷ number of workers (over the same period). It is output PER WORKER — not the same as production, which is total output. Raising it cuts labour cost per unit." },
    { term: "Lean production", def: "Cutting waste of all kinds. Kaizen = continuous small improvements suggested by workers. Just-in-time = inventory arrives as needed, so storage costs fall — but a late delivery halts production." },
    { term: "Quality control vs quality assurance", def: "Control: inspect the finished output and reject faults — catches defects only after the cost has been incurred. Assurance: agreed standards checked at every stage with each worker responsible for their own output — prevents faults, but needs training and commitment." },
    { term: "Economies of scale", def: "Purchasing (bulk buying), marketing, financial (cheaper borrowing), managerial (specialists), technical (larger, more efficient machinery). They lower the average cost PER UNIT as output grows. Diseconomies (poor communication, coordination, morale) raise it again." },
    { term: "Break-even formulae", def: "Contribution per unit = selling price − variable cost per unit. Break-even output = fixed costs ÷ contribution per unit. Margin of safety = actual output − break-even output. Profit = (contribution per unit × units sold) − fixed costs." },
    { term: "Market share formula", def: "Market share = (business's sales ÷ total market sales) × 100. Sales can rise while share falls, if the whole market grew faster — say which one the data shows." },
    { term: "Cash flow forecast lines", def: "Net cash flow = total inflows − total outflows. Closing balance = opening balance + net cash flow. This month's closing balance is next month's opening balance. A negative closing balance is the size of the overdraft needed." },
    { term: "Working capital", def: "Working capital = current assets − current liabilities. It is the money available for day-to-day running (paying suppliers and wages). Too little causes cash crisis; too much sits idle in inventory and receivables." },
    { term: "Profitability ratios", def: "Gross profit margin = (gross profit ÷ revenue) × 100. Profit margin = (profit ÷ revenue) × 100. ROCE = (profit ÷ capital employed) × 100, where capital employed = equity + non-current liabilities. All three are percentages — always show the × 100." },
    { term: "Liquidity ratios", def: "Current ratio = current assets ÷ current liabilities, quoted as a ratio to 1 (about 1.5–2 : 1 is comfortable). Acid test = (current assets − inventory) ÷ current liabilities; below 1 : 1 means the firm could not pay short-term debts without selling inventory." },
    { term: "Exchange rate effect", def: "Appreciation (stronger currency): exports become DEARER abroad, imports become CHEAPER at home. Depreciation: exports cheaper, imports dearer. Decide the effect on THIS firm — does it export, import materials, or both?" },
    { term: "Interest rate rise", def: "Existing variable-rate and new borrowing cost more, so investment in new equipment is postponed; consumers with loans and mortgages have less to spend and borrow less, so demand falls — hardest for expensive goods bought on credit and for heavily-borrowed firms." },
    { term: "Tariff vs quota", def: "Tariff = a tax on imports, raising their price. Quota = a physical limit on the quantity that may be imported. Both protect domestic producers and both risk retaliation and higher prices for consumers." },
  ],

  questions: [
    // ── Section 1 · Understanding business activity ──────────────────────────
    {
      id: "bs10-1", topic: "1-business-activity",
      q: "Bela's Bakes has $12 000 of spare cash. The owner uses it to buy a second oven rather than to refit the shop front. What is the opportunity cost of her decision?",
      opts: [
        "The $12 000 she has spent",
        "The refit of the shop front that she gave up",
        "The extra revenue the second oven will earn",
        "The interest she would have earned by leaving the money in the bank",
      ],
      a: "The refit of the shop front that she gave up",
      model: "Opportunity cost is the NEXT BEST ALTERNATIVE given up, not the money itself and not the benefit of the option chosen. She considered two uses for the $12 000 and picked the oven, so the cost of that choice is the shop refit she can no longer afford.\nExam habit: whenever a question uses the phrase 'opportunity cost', your answer must name a specific thing forgone. Writing '$12 000' scores nothing.",
    },
    {
      id: "bs10-2", topic: "1-business-activity",
      q: "Rohan runs Kestrel Cabs as a sole trader with four drivers. He is considering converting the business into a private limited company. Explain two advantages to Rohan of this change, and one disadvantage.",
      model: "Advantage 1 — limited liability. As a sole trader Rohan has unlimited liability, so if a Kestrel Cabs vehicle caused a large claim that the business could not pay, his personal savings and home could be taken to settle it. As a private limited company the business becomes a separate legal person and he could lose only the amount he has invested. For a taxi firm, where accident claims are a real and recurring risk, this protection matters more than it would for a low-risk business.\n\nAdvantage 2 — easier to raise finance. A private limited company can sell shares to family, friends and private investors, and banks generally see an incorporated business with published accounts as lower risk. Rohan wants to add vehicles, and buying cabs needs a large lump sum that retained profit from four drivers will take years to provide.\n\nDisadvantage — more legal and administrative work. He must register the company, file accounts each year and publish more financial information than a sole trader ever does. That means accountancy fees and paperwork out of the profit of a small five-vehicle business, and rivals could read his accounts.\n\nJudgement: for Kestrel Cabs the liability protection is the decisive factor, because one uninsured claim could cost Rohan his personal assets, whereas the extra administration is a predictable annual cost he can budget for.",
    },
    {
      id: "bs10-3", topic: "1-business-activity",
      q: "Rukmini Textiles employs 340 people in a small town and has announced it will install automated looms that will cut 60 jobs but reduce costs by 15%. Analyse how this decision affects two different stakeholder groups.",
      model: "Workers. Sixty of the 340 employees lose their jobs, so those workers lose their income and, in a small town with few other employers, may struggle to find work. The remaining workers face uncertainty and may fear the next round of automation, which lowers morale and can push up labour turnover — the opposite of what Rukmini Textiles needs while it is learning to run new machinery. Some, though, gain: operating automated looms is a higher-skilled role and may bring training and better pay.\n\nShareholders/owners. A 15% cost reduction raises the profit margin on every metre of cloth sold, and automated looms usually give more consistent quality, which protects the firm's reputation with clothing manufacturers. Against that, the looms need a large capital outlay, so profits and dividends may fall in the short run and the business may have to borrow.\n\nJudgement: the two groups conflict directly, and the interest that should carry most weight here is the shareholders' — but only because the alternative is worse for the workers too. If Rukmini Textiles keeps a 15% cost disadvantage against automated rivals, it risks losing contracts and eventually all 340 jobs, not 60. The decision is easier to defend if the firm retrains and redeploys as many of the 60 as it can, since that also protects morale among those who stay.",
    },
    {
      id: "bs10-4", topic: "1-business-activity",
      q: "Harbourline Coffee owns 14 cafés. It could grow by opening five more cafés itself, or by taking over Tidewater Tea, a rival chain of eight tea shops. Recommend which method of growth Harbourline should choose. Justify your answer.",
      model: "Case for opening five cafés (internal/organic growth). Harbourline keeps full control, can put its own brand, layout and staff training into each new site, and can spread the cost over time by opening one café at a time. Growth is slower, but the culture that made the first 14 work is preserved and there is no risk of paying too much for someone else's business.\n\nCase for the takeover (external growth, horizontal integration). Buying Tidewater Tea adds eight outlets at once, in locations that already have customers and trained staff, so revenue rises immediately instead of over three years. It removes a competitor, raises Harbourline's market share and could bring purchasing economies of scale on beans, milk and packaging across 22 sites. Against that, takeovers are expensive, the two cultures may clash, tea shops are not the same business as coffee shops, and some Tidewater customers may leave if the brand is changed.\n\nRecommendation. Harbourline should take over Tidewater Tea, provided the price is reasonable and a survey confirms the eight sites do not sit next to existing Harbourline cafés. The decisive factor is speed in a market where good high-street sites are scarce — building five cafés from scratch cannot secure locations that a rival is already occupying, and horizontal integration removes a competitor at the same time. If, however, Harbourline is already heavily borrowed, organic growth is the safer choice, because a takeover funded by more debt would leave it exposed if trade slows.",
    },

    // ── Section 2 · People in business ───────────────────────────────────────
    {
      id: "bs10-5", topic: "2-people",
      q: "Cloudline is a software firm whose 30 programmers are already well paid but whose labour turnover has risen to 25% a year. The owner proposes another pay rise. Using motivation theory, explain whether a pay rise is likely to solve the problem.",
      model: "Herzberg's two-factor theory suggests it will not. Pay is a hygiene factor: if it is poor, workers are dissatisfied, but once it is adequate, more of it does not create satisfaction. Cloudline's programmers are described as already well paid, so the firm is spending money on a factor that has stopped motivating, and turnover is likely to stay high because the real cause lies elsewhere.\n\nWhat Herzberg says would work are the motivators — achievement, recognition, responsibility, the work itself and advancement. For programmers, that means giving each of the 30 ownership of a whole feature rather than fragments of one, recognising work publicly, and creating a route to senior developer or team lead. Maslow points the same way: the physiological and safety needs of a well-paid professional are already met, so it is the esteem and self-actualisation levels that still motivate.\n\nTaylor would disagree — he argued money is the main motivator and would tie pay to measured output. But that fits repetitive manual work, not software, where output is hard to measure in units and quality matters more than quantity.\n\nJudgement: a pay rise is unlikely to cut turnover at Cloudline and will permanently raise the wage bill. The higher-value action is job enrichment plus a visible promotion path, because 25% turnover in a skilled team costs the firm recruitment fees, lost project knowledge and months of new-starter training — costs a pay rise does not touch.",
    },
    {
      id: "bs10-6", topic: "2-people",
      q: "PedalPoint, a chain of six bicycle shops, needs a new store manager for its busiest branch. Recommend whether it should recruit internally or externally.",
      model: "Internal recruitment. PedalPoint already employs assistant managers across six shops who know the products, the till system and the customers. Promoting one is cheaper (no advertising or agency fees), faster (the person starts immediately), and lower risk because the firm has already seen them work. It also motivates every other assistant manager by showing that promotion is real. The drawbacks are that no fresh thinking enters the business, and promoting someone simply creates an assistant manager vacancy that still has to be filled.\n\nExternal recruitment. Advertising outside brings a wider pool and could attract someone who has managed a larger store or a rival chain and can bring new ideas on layout, stock and service. But it costs more, takes longer, and the candidate is an unknown quantity who will need weeks of induction before they know PedalPoint's stock and systems.\n\nRecommendation: recruit internally. The decisive factor is that this is PedalPoint's BUSIEST branch — it cannot afford a manager who needs weeks to learn the products and the customers, and a proven internal candidate is productive from day one. The knock-on assistant manager vacancy is a much easier and lower-risk position to fill externally.",
    },
    {
      id: "bs10-7", topic: "2-people",
      q: "A factory manager reduces the number of levels of hierarchy from six to four, keeping the same number of workers. Which is the most likely consequence?",
      opts: [
        "The chain of command lengthens and spans of control narrow",
        "The chain of command shortens and spans of control widen",
        "Both the chain of command and the spans of control shorten",
        "Delegation becomes unnecessary",
      ],
      a: "The chain of command shortens and spans of control widen",
      model: "Removing levels is delayering. With the same workforce spread over fewer levels, each remaining manager must supervise more subordinates, so spans of control widen; and a message now passes through fewer people from top to bottom, so the chain of command shortens.\nDevelopment worth adding in a written answer: communication becomes faster and more accurate, and salary costs fall — but each manager is stretched, so they must delegate MORE, not less, and workers get less individual supervision.",
    },
    {
      id: "bs10-8", topic: "2-people",
      q: "Solavia assembles solar lamps. It is considering a four-week off-the-job training programme for its 40 assembly workers, which would cost $36 000 and take them off the line for one week each. Do you think Solavia should go ahead? Justify your answer.",
      model: "For. Trained assembly workers make fewer mistakes, so Solavia's reject rate and material waste fall and quality rises — important because a faulty solar lamp sold to a customer damages the brand and generates returns. Productivity per worker should also rise, which lowers the labour cost per lamp. Training is a motivator in Herzberg's terms (achievement and advancement), so it may reduce labour turnover as well.\n\nAgainst. $36 000 is a large sum for a firm of this size and there is no guarantee of a return. Output is lost while each worker is away, so Solavia may miss orders during the training period. Worst of all, off-the-job training gives workers transferable, certificated skills — a competitor could hire them at a slightly higher wage and Solavia would have paid to train its rival's workforce.\n\nJudgement: Solavia should go ahead, but stagger it so that only a few workers are off the line at a time, protecting output. The decisive factor is that assembly quality is where solar lamp reputation is won or lost, and one week per worker is a one-off cost against a permanent improvement. The poaching risk is real but manageable — it is best addressed by pairing the training with a promotion path, not by leaving the workforce untrained.",
    },

    // ── Section 3 · Marketing ────────────────────────────────────────────────
    {
      id: "bs10-9", topic: "3-marketing",
      q: "Bela's Bakes wants to know whether to open a second shop in a nearby town. The owner has a budget of $1 500 for research. Recommend the type of market research she should use.",
      model: "Secondary research first. Government population and income statistics for the town, plus a simple count of existing bakeries, would cost almost nothing and tell her the size of the market and the level of competition. The weakness is that this data was collected for other purposes and may be a year or two old, so it will not tell her whether people in that town would buy HER products.\n\nPrimary research second. A questionnaire given to shoppers in the town centre, or a small focus group, would tell her directly whether they would switch to Bela's Bakes, what they would pay, and which products they want. This is exactly on point and current, but it costs money, takes time, and with a $1 500 budget the sample will be small — so the results could be unrepresentative and must be read cautiously.\n\nRecommendation: use both, in that order — cheap secondary research to decide whether the town is worth pursuing at all, then spend most of the $1 500 on a street questionnaire only if it is. The decisive factor is her small budget: doing primary research first risks spending the whole $1 500 discovering something free government data would have told her. Whatever the results, she should also weigh the qualitative comments, because for a bakery the reason people prefer one shop over another matters more than the raw percentage who say yes.",
    },
    {
      id: "bs10-10", topic: "3-marketing",
      q: "Cloudline is launching an accounting app for small businesses in a market where three established rivals already sell similar products. Analyse whether penetration pricing or skimming would be the better strategy.",
      model: "Penetration pricing means launching at a deliberately low price to win customers quickly and raising it later. In Cloudline's market this fits well: with three established rivals, small businesses have no reason to switch to an unknown name unless the price is clearly better, and software has very low cost per extra user, so a low price still contributes. It also builds an installed base fast, and accounting software has high switching costs once a firm's records are in it — customers won cheaply tend to stay. The risks are that it signals low quality, that profit per user is thin at first, and that raising the price later may push customers back to rivals.\n\nSkimming means a high launch price aimed at customers who will pay for something new, then lowering it. That works when the product is genuinely innovative and has no close substitute — which is not Cloudline's position. With three similar products already available, a high price simply makes the app the expensive unknown option.\n\nJudgement: penetration pricing is the better strategy for Cloudline. The decisive factor is that its product is NOT differentiated — skimming depends on having something rivals do not, and Cloudline does not. The one condition is that Cloudline must have enough finance to survive thin margins during the introduction stage, because the cash flow in that phase will be negative.",
    },
    {
      id: "bs10-11", topic: "3-marketing",
      q: "NovaKnit's best-selling fleece jacket has had flat sales for three years and sales have now started to fall. Identify the stage of the product life cycle it has reached and explain two extension strategies NovaKnit could use.",
      model: "Stage: the jacket has passed maturity and saturation and has entered DECLINE — flat sales for three years is the saturation plateau, and a fall in sales is the start of decline.\n\nExtension strategy 1 — new market. NovaKnit could sell the fleece into a market it has not reached, for example exporting to a colder country, or selling to corporate customers as branded workwear. The design already works and the development cost is sunk, so extra sales in a new market add revenue without new product cost. It does mean marketing and possibly distribution spending abroad, and exchange rate movements would affect the margin.\n\nExtension strategy 2 — restyle and re-promote. A new colour range, a redesigned zip and pockets, and updated packaging can make an unchanged product feel new, supported by a burst of social media promotion. This is cheap compared with developing a fresh product, but if customers see it as the same old jacket in a new colour the sales lift will be brief.\n\nJudgement: extension buys NovaKnit time but does not solve the underlying problem — a product in decline eventually stops selling however it is repackaged. The strategies are worth doing because they generate cash, and that cash is best used to fund the development of the jacket's replacement.",
    },
    {
      id: "bs10-12", topic: "3-marketing",
      q: "PedalPoint currently sells bicycles only through its six shops. It is considering adding an e-commerce website. Do you think it should? Justify your answer.",
      model: "For. A website removes the geographic limit on PedalPoint's market — it could sell nationally instead of to the six towns it has shops in, and it trades 24 hours a day without paying staff to be present. Fixed costs per sale are far lower than a shop, and the site generates customer data on what people browse and buy, which PedalPoint can use to plan its stock and promotions.\n\nAgainst. Bicycles are bulky and expensive to deliver, and they need assembly and sizing — which is precisely what customers value the shops for. Returns of a wrongly-sized bicycle are costly to ship both ways. Online, PedalPoint's prices sit next to every rival's on a comparison site, so it competes on price rather than service. There is also the set-up and security cost of the site itself, and the risk of taking sales from its own shops rather than winning new ones.\n\nRecommendation: yes, but as a click-and-collect and accessories channel rather than a full national bicycle delivery service. The decisive factor is the nature of the product — helmets, lights, tyres and clothing ship cheaply and need no fitting, so they suit e-commerce, while the bicycles themselves are where PedalPoint's shops add value that a website cannot copy. Selling complete bicycles online would attack its own strongest advantage.",
    },

    // ── Section 4 · Operations management ────────────────────────────────────
    {
      id: "bs10-13", topic: "4-operations",
      q: "Brightwood Furniture currently makes every table individually to a customer's order (job production). Demand has grown and it is considering moving to batch production of six standard designs. Analyse the effects of this change.",
      model: "Benefits. Making six standard designs in batches means the same cutting and assembly setup produces many identical tables, so unit costs fall sharply — Brightwood buys timber and fittings in bulk (purchasing economies of scale), workers repeat a task and get faster, and machinery is set up once for many units rather than once per table. Output rises, so Brightwood can meet the higher demand without turning orders away, and lead times shorten because standard designs can be made ahead of the order.\n\nDrawbacks. Brightwood loses the made-to-order selling point that customers may currently pay a premium for, so added value per table falls and it moves into competition with mass-market furniture retailers. Batch production also creates changeover time between designs, during which nothing is produced, and part-finished tables build up as work-in-progress, tying up cash. Workers who take pride in crafting a unique table may find repetitive batch work demotivating.\n\nJudgement: the change makes sense if the growth in demand is coming from customers who want a good table at a fair price rather than a bespoke one — which the rise in demand suggests. The safest route is a hybrid: run the six standard designs in batches to serve the volume market, and keep a small job-production line for bespoke commissions, so Brightwood keeps its premium niche and its reputation while capturing the cost savings.",
    },
    {
      id: "bs10-14", topic: "4-operations",
      q: "NovaKnit's 12 machinists produced 2 880 garments last week. After training and a new machine layout, 14 machinists produced 3 780 garments in a week. (a) Calculate labour productivity before and after. (b) Calculate the percentage change in productivity. (c) Explain why the rise in total output alone does not prove the changes worked.",
      model: "(a) Productivity = total output ÷ number of workers.\nBefore: 2 880 ÷ 12 = 240 garments per worker per week.\nAfter: 3 780 ÷ 14 = 270 garments per worker per week.\n\n(b) Change in productivity = 270 − 240 = 30 garments per worker.\nPercentage change = (30 ÷ 240) × 100 = 12.5% increase.\n\n(c) Total output rose from 2 880 to 3 780, but NovaKnit also employed two extra machinists — so part of the rise is simply more people working, not each person working better. Production is total output; productivity is output PER WORKER, and only productivity tells you whether the training and the new layout achieved anything. The productivity figure confirms they did: each machinist now makes 30 more garments a week, so the labour cost per garment falls even though the total wage bill has risen. If productivity had stayed at 240, 14 workers would have made 3 360 garments — the extra 420 garments are the real gain from the changes.",
    },
    {
      id: "bs10-15", topic: "4-operations",
      q: "Solavia sells solar lamps for $18 each. Variable costs are $11 per lamp and fixed costs are $42 000 per month. (a) Calculate the contribution per lamp and the break-even output. (b) Solavia currently sells 9 000 lamps a month — calculate the margin of safety and the monthly profit. (c) A new rented warehouse would add $7 000 to monthly fixed costs. Calculate the new break-even output and advise Solavia.",
      model: "(a) Contribution per unit = selling price − variable cost per unit = $18 − $11 = $7 per lamp.\nBreak-even output = fixed costs ÷ contribution per unit = $42 000 ÷ $7 = 6 000 lamps per month.\n\n(b) Margin of safety = actual output − break-even output = 9 000 − 6 000 = 3 000 lamps.\nProfit = (contribution per unit × units sold) − fixed costs\n= ($7 × 9 000) − $42 000\n= $63 000 − $42 000\n= $21 000 per month.\n(Check the long way: revenue = 9 000 × $18 = $162 000; total cost = $42 000 + (9 000 × $11) = $42 000 + $99 000 = $141 000; profit = $162 000 − $141 000 = $21 000. Same answer.)\n\n(c) New fixed costs = $42 000 + $7 000 = $49 000.\nNew break-even output = $49 000 ÷ $7 = 7 000 lamps per month.\nAdvice: break-even rises by 1 000 lamps and the margin of safety falls from 3 000 to 2 000 lamps, so Solavia can absorb a smaller drop in sales before it makes a loss, and monthly profit at 9 000 lamps falls to $21 000 − $7 000 = $14 000. The warehouse is only worth renting if it lets Solavia sell at least 1 000 extra lamps a month, or if it cuts variable costs (for example by allowing bulk buying of components), because either would restore the contribution the extra fixed cost has consumed.\nNote the limitation: break-even analysis assumes every lamp made is sold and that the $18 price and $11 unit variable cost stay constant — neither is guaranteed.",
    },
    {
      id: "bs10-16", topic: "4-operations",
      q: "Rukmini Textiles must choose between a factory site next to its cotton suppliers and a site on the edge of the city where its main customers are. Explain the factors it should weigh, and recommend a site.",
      model: "Case for the site near the suppliers. Cotton is bulky and loses weight in processing, so transporting raw cotton is more expensive per unit of finished cloth than transporting the cloth itself. A rural site is likely to have cheaper land and rent, and labour costs may be lower. Delivery of raw material becomes quick and reliable, which supports just-in-time working.\n\nCase for the city-edge site. Rukmini is close to its customers, so finished cloth reaches clothing manufacturers quickly and delivery costs on the outbound side fall. A city location has better transport links, a larger pool of skilled labour and easier access to power and services — and being near customers makes it easier to respond to design changes and urgent orders.\n\nOther factors either way: government grants may be offered in the rural area to create jobs; planning and environmental restrictions may be tighter in the city; and wages, rent and rates will almost certainly be higher near the city.\n\nRecommendation: the supplier site, because raw cotton is the bulkier and costlier item to move and land is cheaper — the two largest cost differences both point the same way. This flips, though, if Rukmini's customers demand short lead times on frequently changing designs, because then speed of response to the customer is worth more than the transport saving. Rukmini should decide by comparing the actual transport cost per year each way, not by general argument.",
    },

    // ── Section 5 · Financial information and decisions ──────────────────────
    {
      id: "bs10-17", topic: "5-finance",
      q: "Brightwood Furniture's cash flow forecast for the next quarter shows an opening bank balance of $8 000 in January. Receipts are $30 000 (Jan), $26 000 (Feb) and $41 000 (Mar). Payments are $34 000 (Jan), $35 000 (Feb) and $33 000 (Mar). (a) Calculate the net cash flow and the closing balance for each month. (b) Identify the problem the forecast reveals. (c) Recommend two actions Brightwood could take.",
      model: "(a) Net cash flow = receipts − payments. Closing balance = opening balance + net cash flow, and each closing balance becomes the next month's opening balance.\n\nJanuary: net cash flow = $30 000 − $34 000 = −$4 000.\nClosing balance = $8 000 + (−$4 000) = $4 000.\n\nFebruary: net cash flow = $26 000 − $35 000 = −$9 000.\nClosing balance = $4 000 + (−$9 000) = −$5 000.\n\nMarch: net cash flow = $41 000 − $33 000 = +$8 000.\nClosing balance = −$5 000 + $8 000 = $3 000.\n\n(b) The forecast shows a negative closing balance of $5 000 at the end of February — Brightwood runs out of cash and cannot pay suppliers or wages that month without an overdraft of at least $5 000. Note that the quarter as a whole is close to breaking even on cash ($8 000 in, $3 000 out); the problem is TIMING, not overall trading, which is exactly what a forecast is for.\n\n(c) Two actions:\n1. Arrange an overdraft facility with the bank before February. It is flexible, interest is charged only on the amount actually used, and $5 000 is a small facility for a business with $30 000+ of monthly receipts. Arranging it in advance is far cheaper than being caught short.\n2. Move cash from February into January or March. Brightwood could chase customers who owe money to pay sooner, negotiate longer trade credit from its timber supplier, or delay the February purchase of any non-urgent equipment (or lease it instead of buying it, spreading the cost).\n\nJudgement: the overdraft is the immediate fix, but delaying payments and chasing receivables is the better long-term answer because it costs no interest — Brightwood should do both, arranging the overdraft as insurance while it improves the timing.",
    },
    {
      id: "bs10-18", topic: "5-finance",
      q: "Tamarind Toys reports revenue $600 000, cost of sales $390 000 and expenses $126 000. Its statement of financial position shows inventory $60 000, trade receivables $30 000, cash $10 000, current liabilities $50 000, non-current liabilities $100 000 and equity $500 000. Calculate the gross profit margin, profit margin, ROCE, current ratio, acid test ratio and working capital, and comment on the liquidity position.",
      model: "First build the profit figures.\nGross profit = revenue − cost of sales = $600 000 − $390 000 = $210 000.\nProfit = gross profit − expenses = $210 000 − $126 000 = $84 000.\n\nProfitability ratios:\nGross profit margin = (gross profit ÷ revenue) × 100 = (210 000 ÷ 600 000) × 100 = 35%.\nProfit margin = (profit ÷ revenue) × 100 = (84 000 ÷ 600 000) × 100 = 14%.\nCapital employed = equity + non-current liabilities = $500 000 + $100 000 = $600 000.\nROCE = (profit ÷ capital employed) × 100 = (84 000 ÷ 600 000) × 100 = 14%.\n\nLiquidity:\nCurrent assets = inventory + trade receivables + cash = $60 000 + $30 000 + $10 000 = $100 000.\nCurrent ratio = current assets ÷ current liabilities = 100 000 ÷ 50 000 = 2 : 1.\nAcid test = (current assets − inventory) ÷ current liabilities = (100 000 − 60 000) ÷ 50 000 = 40 000 ÷ 50 000 = 0.8 : 1.\nWorking capital = current assets − current liabilities = $100 000 − $50 000 = $50 000.\n\nComment on liquidity — this is where the marks are. The current ratio of 2 : 1 looks comfortable and suggests Tamarind Toys has twice the short-term assets it needs to cover its short-term debts. But the acid test of 0.8 : 1 tells a different story: strip out inventory and the firm has only $0.80 of quickly available assets for every $1 it owes in the short term. The gap between the two ratios exists because $60 000 of the $100 000 current assets — 60% — is tied up in unsold toys. If sales slowed, Tamarind Toys could not pay its suppliers without selling inventory, possibly at a discount.\n\nWhat it should do: reduce inventory levels (order in smaller, more frequent batches), chase the $30 000 of trade receivables to convert them into cash, and avoid taking on more short-term liabilities until the acid test is nearer 1 : 1. Caution before judging too hard: a toy manufacturer holding stock ahead of a seasonal sales peak would show exactly this pattern, so the figures should be compared with the same month last year and with a competitor before concluding there is a problem.",
    },
    {
      id: "bs10-19", topic: "5-finance",
      q: "Bela's Bakes, a sole trader, needs $40 000 to buy a delivery van and a further $6 000 to cover a temporary shortage of cash next month. Recommend a source of finance for each need.",
      model: "For the $40 000 van — a bank loan (or hire purchase/leasing). A van is a non-current asset that will be used for several years, so the finance should be long term to match. A bank loan spreads the cost over fixed monthly repayments that Bela can budget for, and the van itself can act as collateral, which makes the bank more willing to lend. Interest is a cost, and as a sole trader Bela has unlimited liability, so failure to repay puts her personal assets at risk. Leasing is the alternative: no large outlay and maintenance is often included, but she never owns the van and pays more in total over time.\n\nFor the $6 000 temporary shortage — a bank overdraft. The need is short term and will reverse next month, so an overdraft is the right tool: it is flexible, quickly arranged, and interest is charged only on the amount actually overdrawn and only for the days it is used. A loan would leave her paying interest on money she no longer needs. The drawbacks are a high interest rate and the fact that a bank can demand repayment of an overdraft at short notice.\n\nJudgement: the governing principle is matching the term of the finance to the term of the need — long-term asset, long-term finance; short-term cash gap, short-term finance. Using an overdraft to buy the van would be the classic error, because the bank could recall it while the van is still being paid off. Bela should also consider how much of her own savings or retained profit she can put in first, since internal finance costs no interest at all — but she must not use so much that she is left with no cushion for the very shortage she is trying to cover.",
    },
    {
      id: "bs10-20", topic: "5-finance",
      q: "A business has current assets of $90 000, of which inventory is $50 000, and current liabilities of $40 000. What is its acid test ratio?",
      opts: ["2.25 : 1", "1 : 1", "0.8 : 1", "1.25 : 1"],
      a: "1 : 1",
      model: "Acid test = (current assets − inventory) ÷ current liabilities = ($90 000 − $50 000) ÷ $40 000 = $40 000 ÷ $40 000 = 1 : 1.\nThe distractor 2.25 : 1 is the CURRENT ratio ($90 000 ÷ $40 000) — the error of forgetting to remove inventory. The acid test removes inventory because it is the current asset that is hardest to turn into cash quickly, especially if it is unsold or out of season.\nInterpreting 1 : 1: the business has exactly $1 of readily available assets for every $1 of short-term debt. It can just cover its short-term obligations without selling inventory, so liquidity is adequate but has no margin for error.",
    },

    // ── Section 6 · External influences ──────────────────────────────────────
    {
      id: "bs10-21", topic: "6-external",
      q: "The central bank raises interest rates sharply. Analyse the likely effects on Brightwood Furniture, which has a $250 000 variable-rate loan and sells dining tables costing $900 to $2 500.",
      model: "Effect on Brightwood's costs. The loan is variable rate, so the interest charge on $250 000 rises immediately. That is a straight increase in expenses, which reduces profit and profit margin without any change in sales. It also makes any planned borrowing — for new machinery or a second workshop — more expensive, so Brightwood is likely to postpone investment.\n\nEffect on Brightwood's demand. Dining tables at $900 to $2 500 are expensive, non-essential durable goods, and many customers buy them on credit or after a house move funded by a mortgage. Higher interest rates leave households with larger mortgage and loan repayments and less disposable income, and make buying on credit dearer — so demand for exactly this kind of purchase falls, and it falls further than demand for everyday items would.\n\nJudgement: Brightwood is hit twice, on costs and on revenue, which makes it unusually exposed. Of the two, the fall in demand is the more serious, because the interest on $250 000 is a knowable, budgetable increase while a drop in orders for high-value tables could be large and open-ended. Its most useful responses are to try to convert the loan to a fixed rate, to protect cash flow, and possibly to widen its range towards lower-priced tables that customers can still afford — but the severity depends on how long rates stay high and on how much of its order book is already confirmed.",
    },
    {
      id: "bs10-22", topic: "6-external",
      q: "Solavia assembles solar lamps using imported electronic components and sells 60% of its output to customers abroad. Its home currency depreciates by 10%. Explain the effects on Solavia.",
      model: "Effect on exports — favourable. A depreciation means Solavia's currency buys less foreign currency, so foreign buyers now need less of their own money to pay the same home-currency price. Its solar lamps become cheaper abroad, which should raise the quantity demanded and increase export sales. With 60% of output exported, this affects the majority of Solavia's business, and it also lets Solavia choose to keep its foreign price the same and earn a larger margin instead.\n\nEffect on imported components — unfavourable. Solavia buys electronic components from abroad, and a depreciation makes imports dearer in the home currency. Its variable cost per lamp rises, which cuts contribution per lamp and therefore squeezes profit and raises the break-even output.\n\nJudgement: the net effect depends on how much of each lamp's cost is imported components. If components are a small share of the total cost, the export gain on 60% of output outweighs the cost increase and Solavia benefits overall. If the lamps are mostly imported electronics with little value added locally, the higher input cost could cancel the export advantage entirely. Solavia should calculate the change in contribution per lamp before deciding whether to cut its foreign price to chase volume or hold price and take the extra margin.",
    },
    {
      id: "bs10-23", topic: "6-external",
      q: "NovaKnit could cut its costs by 20% by moving production to a supplier abroad known for very low wages and long shifts. Do you think it should? Justify your answer.",
      model: "For. A 20% cost reduction is substantial and would let NovaKnit either raise its profit margin or cut prices to compete with rivals who have already moved production abroad. If it does not move and its competitors have, NovaKnit may be priced out of the market and lose sales, which threatens the jobs of everyone it employs. Shareholders and lenders judge the business on profit, and cheaper garments benefit customers.\n\nAgainst. Very low wages and long shifts raise a clear ethical problem: NovaKnit would be profiting from conditions it would not accept for its own workers. If this became public — and supply chains are increasingly scrutinised by journalists, pressure groups and customers on social media — the damage to the brand could cost far more than 20% of production costs, because clothing buyers are exactly the customers who react to such stories. NovaKnit would also lose direct control over quality and lead times, face longer and less reliable delivery, and carry exchange rate risk on payments to the foreign supplier. Existing NovaKnit workers would lose their jobs, harming morale and the firm's standing in its local community.\n\nRecommendation: NovaKnit should not move to this supplier, but it should not rule out overseas production altogether. The decisive factor is that the saving is one it can only keep while nobody looks closely — a cost advantage built on conditions that would embarrass the company if published is not a durable advantage. The better route is to source abroad from a supplier that meets an audited standard on wages and hours, accepting a smaller saving than 20% in exchange for a supply chain NovaKnit can defend publicly. If no such supplier can be found at a workable price, it should stay at home and compete on quality and design rather than on cost.",
    },
  ],

  mistakes: [
    { mistake: "Listing points but never applying them to the business in the case.", fix: "Every developed point must name the firm and use something from the case — the product, the market, a figure, the number of employees. Ask 'could I paste this sentence into any other answer?' If yes, it has not earned the application mark." },
    { mistake: "Ignoring the command word — writing a paragraph of explanation when the question says Identify or State.", fix: "Identify/State/Give want a short answer and nothing more; Explain wants the reason and its consequence; Analyse wants a chain of cause and effect; Justify/Recommend/Evaluate want a supported decision. Underline the command word before you write a word." },
    { mistake: "Finishing an evaluation question with 'there are advantages and disadvantages' or 'it depends'.", fix: "'It depends' is only worth marks if you say what it depends ON. Name the deciding factor, state which way you come down, and give the reason: 'Solavia should go ahead, because assembly quality is where its reputation is won.'" },
    { mistake: "Quoting a ratio or formula, calculating it, and stopping.", fix: "The calculation is one mark; the interpretation is the rest. Say whether the figure is good or bad, compare it with last year or a competitor, and say what the business should do about it." },
    { mistake: "Confusing profit with cash — 'the business is profitable so it cannot have a cash flow problem'.", fix: "A profitable business runs out of cash all the time: customers pay late, inventory ties money up, and assets are bought with cash today for profit next year. Cash flow forecasts exist precisely because profit and cash are different." },
    { mistake: "Confusing productivity with production, or market share with sales.", fix: "Productivity = output PER WORKER; production = total output. Market share = the firm's sales as a % of the whole market; sales can rise while share falls if the market grew faster. Read which one the question asked for." },
    { mistake: "Writing that a business should 'just lower its price' or 'advertise more' as the answer to everything.", fix: "Both cost money and both have a downside — lower price cuts contribution per unit and may signal low quality; more promotion may not be affordable. Show you have weighed the cost against the likely gain for this particular firm." },
    { mistake: "Treating limited liability as meaning 'the business has limited debts'.", fix: "Limited liability limits what the OWNERS can lose to the amount they invested. The company's own debts are not limited at all — that is exactly why the protection matters." },
    { mistake: "Answering a 'which source of finance' question without matching the term of the finance to the term of the need.", fix: "Long-term asset (van, machine, building) → long-term finance (loan, share issue, leasing). Short-term cash gap → overdraft or trade credit. Say WHY the term matches — that reasoning is where the marks are." },
    { mistake: "Giving both sides of an evaluation but at wildly different lengths, then judging in favour of the longer one.", fix: "Examiners reward balance and then a reasoned judgement. Give each side a real developed point, then decide — and let the case evidence, not the word count, drive the decision." },
    { mistake: "Forgetting units, signs and the × 100 in calculations.", fix: "Margins and ROCE are percentages — show the × 100. Current and acid test ratios are quoted as ' : 1'. Negative cash flows keep their minus sign. Money answers carry a $ sign. A right number in the wrong form still loses marks." },
    { mistake: "Repeating the stem back as an answer ('it should train workers because training is good for the business').", fix: "Push every point one step further: training → fewer mistakes → less waste and fewer returns → lower cost per unit → higher profit margin. Each arrow is a mark; stopping at the first one is not." },
  ],

  cheat: [
    {
      heading: "The formula sheet — learn these exactly",
      bullets: [
        "Gross profit = revenue − cost of sales.   Profit = gross profit − expenses (overheads).",
        "Gross profit margin = (gross profit ÷ revenue) × 100.   Profit margin = (profit ÷ revenue) × 100.",
        "Capital employed = equity + non-current liabilities.   ROCE = (profit ÷ capital employed) × 100.",
        "Current ratio = current assets ÷ current liabilities (quote as ' : 1').",
        "Acid test = (current assets − inventory) ÷ current liabilities.   Working capital = current assets − current liabilities.",
        "Contribution per unit = selling price − variable cost per unit.   Break-even output = fixed costs ÷ contribution per unit.   Margin of safety = actual output − break-even output.",
        "Total cost = fixed + variable.   Revenue = price × quantity.   Profit = (contribution × units sold) − fixed costs.",
        "Productivity = total output ÷ number of workers.   Market share = (business's sales ÷ total market sales) × 100.",
        "Cash flow: net cash flow = inflows − outflows; closing balance = opening balance + net cash flow; this month's closing = next month's opening.",
      ],
    },
    {
      heading: "Command words — what each one is actually asking for",
      bullets: [
        "Define / State / Give / Identify — a short, precise answer. No explanation needed, no marks for adding one.",
        "Outline / Describe — set out the main points or features. Still no judgement.",
        "Explain — give the reason AND its consequence for the business. One 'because' and one 'so that' per point.",
        "Calculate — work it out from the figures given. Show the formula, the substitution and the answer with its unit or % sign.",
        "Analyse — build a chain: point → why → what it leads to → what that means for this business. Depth beats breadth.",
        "Justify / Recommend — choose one option, support it with case evidence, and say why it beats the alternative.",
        "Evaluate / 'Do you think…' — both sides, then a reasoned judgement naming the deciding factor. No judgement = capped marks.",
        "Consider — review and respond to the information given, not to information you wish you had been given.",
      ],
    },
    {
      heading: "The evaluation paragraph — the template that scores",
      bullets: [
        "1. POINT — state one benefit or drawback in a single clear sentence.",
        "2. EXPLAIN — the business chain: why does that matter? Costs, revenue, quality, motivation, cash, reputation.",
        "3. APPLY — name the business and use a fact or figure from the case. This is the mark most candidates miss.",
        "4. COUNTER — give the other side properly, with its own explanation and application. Two lines, not two words.",
        "5. JUDGE — 'The decisive factor here is …, because …' Then state which option you choose.",
        "Useful 'it depends' hooks, but always say what it depends on: the size of the business, how much finance it has, how much competition it faces, whether the change is short or long term, and the state of the economy.",
      ],
    },
    {
      heading: "Section 1 quick recall — ownership, sectors, stakeholders",
      bullets: [
        "Unlimited liability: sole trader, partnership — personal assets at risk. Limited liability: Ltd, plc — lose only what you invested.",
        "Ltd = shares sold privately, control kept. Plc = shares sold publicly, more capital but takeover risk.",
        "Sectors: primary (extract/grow) → secondary (manufacture/build) → tertiary (services). Public sector = state-owned; private sector = privately owned.",
        "Growth: internal/organic vs external (merger = agreed; takeover = bought). Horizontal · vertical forward · vertical backward · conglomerate.",
        "Stakeholders: owners, workers, managers, customers, suppliers, lenders, government, community. Exam wants the CONFLICT and whose interest should win.",
        "Opportunity cost = the specific alternative given up. Added value = selling price − bought-in materials.",
      ],
    },
    {
      heading: "Motivation — one line each, then apply",
      bullets: [
        "Taylor: money motivates; time-and-motion study; piece rate. Fits repetitive measurable work, not creative work.",
        "Maslow: physiological → safety → social → esteem → self-actualisation. A level only motivates once the one below is met.",
        "Herzberg: hygiene factors (pay, conditions, supervision, policy, security) only stop dissatisfaction; motivators (achievement, recognition, the work itself, responsibility, advancement) create it.",
        "Financial methods: wage (time or piece rate), salary, commission, bonus, profit sharing, fringe benefits.",
        "Non-financial: job rotation, job enlargement, job enrichment, teamworking, autonomy, training, promotion, praise.",
        "Motivated workers → higher productivity, better quality, less absenteeism, lower labour turnover → lower recruitment and training costs.",
      ],
    },
    {
      heading: "Marketing — the mix, the cycle, the research",
      bullets: [
        "4Ps: Product (brand, packaging, USP) · Price · Place (channel) · Promotion (above the line = advertising; below the line = discounts, BOGOF, loyalty cards, point-of-sale).",
        "Pricing: cost-plus · competitive · penetration (low to enter, raise later) · skimming (high for something new, lower later) · promotional · psychological.",
        "PLC: development → introduction → growth → maturity → saturation → decline. Cash flow is worst in development/introduction, best in maturity.",
        "Extension strategies: new packaging, new market, new features, price cut, extra promotion.",
        "Primary = new, specific, costly, slow. Secondary = existing, cheap, fast, may be out of date. Quantitative = how many; qualitative = why.",
        "E-commerce: wider reach, lower fixed costs, 24-hour trading, customer data — against delivery and returns costs, price transparency, security, no face-to-face service.",
      ],
    },
    {
      heading: "Operations — methods, scale, quality, location",
      bullets: [
        "Job = one-off, flexible, high unit cost. Batch = groups, changeover time lost. Flow = continuous, lowest unit cost, inflexible, huge capital cost.",
        "Economies of scale: purchasing · marketing · financial · managerial · technical — they cut average cost PER UNIT. Diseconomies: communication, coordination, morale.",
        "Lean production: kaizen (continuous small improvements) · just-in-time (stock arrives as needed — low storage cost, but a late delivery stops the line) · cell production.",
        "Quality control = inspect the finished goods (finds faults after the cost is spent). Quality assurance = standards checked at every stage (prevents faults, needs training).",
        "Factory location: near materials vs near market, land cost, labour cost and availability, transport, power, government grants, legal limits. Retail location: footfall, parking, rent, competitors, local incomes.",
        "Break-even limits: assumes everything made is sold, and that price and unit variable cost do not change. Say so when you use it.",
      ],
    },
    {
      heading: "Finance — choosing a source, reading the accounts",
      bullets: [
        "Match the TERM: long-term asset → loan, leasing, hire purchase, share issue. Short-term cash gap → overdraft, trade credit.",
        "Internal (no interest, no loss of control): retained profit, sale of unwanted assets, owner's savings. External: overdraft, loan, trade credit, HP, leasing, shares, debentures, grants, micro-finance, crowd-funding.",
        "Sole trader / partnership CANNOT sell shares. Only a plc can sell shares to the general public.",
        "Income statement order: revenue → cost of sales → gross profit → expenses → profit.",
        "Statement of financial position: non-current + current assets, against current liabilities, non-current liabilities and equity.",
        "Cash flow fixes: arrange an overdraft, chase receivables, negotiate longer trade credit, lease instead of buy, cut or delay spending, reduce inventory.",
        "Current ratio healthy but acid test weak = too much money tied up in inventory. Say that in words, not just in numbers.",
      ],
    },
    {
      heading: "External influences — the fast reasoning chains",
      bullets: [
        "Interest rate UP → borrowing dearer → investment postponed → consumers with loans have less to spend → demand falls, worst for expensive credit-bought goods and for heavily-borrowed firms.",
        "Currency APPRECIATES → exports dearer abroad, imports cheaper at home. DEPRECIATES → exports cheaper, imports dearer. Always ask: does this firm export, import, or both?",
        "Government objectives: economic growth · low unemployment · low inflation · balance of payments. Fiscal policy = tax and spending; monetary policy = interest rates.",
        "Recession → falling incomes and demand, more business failures. Boom → high demand, but rising costs and possible shortages of labour.",
        "Ethics/environment: external costs (pollution, congestion, waste) fall on society. Doing the right thing raises costs but protects reputation and can differentiate the brand.",
        "Globalisation: bigger market and cheaper inputs vs foreign competition, exchange rate risk and ethical scrutiny. Tariff = tax on imports; quota = limit on quantity of imports.",
      ],
    },
    {
      heading: "Exam-day moves",
      bullets: [
        "Read the case study twice before answering anything, and underline every number, product name and fact — those are your application marks lying on the page.",
        "Underline the command word in each question and let it decide how long the answer is.",
        "In calculations, write the formula, then the substitution, then the answer with its unit — method marks survive an arithmetic slip.",
        "Never leave a calculated figure uninterpreted. One sentence saying what it means for the business is worth as much as the sum.",
        "On evaluation questions, budget the last two lines for the judgement before you start writing — running out of time before the judgement is the most expensive mistake in 0450.",
        "Both papers assess the whole syllabus, sections 1–6: Paper 1 through short answer and data response, Paper 2 through a case study. Revise all six sections — there is nowhere to hide a gap.",
        "Deliberately not asserted in this pack: exact mark tariffs, question counts and timings per paper. Check the front cover of your own past papers and your teacher's mark schemes for those, and match the length of your answers to the marks actually printed on the paper.",
      ],
    },
  ],
};
