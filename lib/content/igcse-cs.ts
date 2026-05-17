// Cambridge IGCSE Computer Science 0478 — exam prep content
// Verified against the official 2026–2028 syllabus (v5, Dec 2025).
// Sources: cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf

export type IgcseCsTopicId =
  | "1-data-rep" | "2-data-tx" | "3-hardware" | "4-software" | "5-internet" | "6-emerging"
  | "7-algorithms" | "8-programming" | "9-databases" | "10-logic";

export type IgcseCsTopic = {
  id: IgcseCsTopicId;
  paper: 1 | 2;
  num: number;
  title: string;
  blurb: string;
  syllabus: string[];
};

export const IGCSE_CS_TOPICS: IgcseCsTopic[] = [
  {
    id: "1-data-rep",
    paper: 1,
    num: 1,
    title: "Data representation",
    blurb: "Binary, denary, hex, characters, sound, images, units, compression.",
    syllabus: [
      "Denary ↔ binary ↔ hex (max 16-bit). Why hex is used.",
      "Add two 8-bit binary integers. Overflow = result > 255 in 8-bit.",
      "Logical binary shifts (left = ×2 per place, right = ÷2).",
      "Two's complement (8-bit) to represent negatives.",
      "ASCII vs Unicode (more characters → more bits).",
      "Sound: sample rate (Hz) + sample resolution (bits) → quality + file size.",
      "Images: resolution + colour depth (bpp) → quality + file size.",
      "Units: bit, nibble, byte, KiB, MiB, GiB, TiB, PiB, EiB (×1024, NOT ×1000).",
      "Image file size = W × H × bit-depth ÷ 8.",
      "Sound file size = sample rate × resolution × time ÷ 8.",
      "Lossy vs lossless compression. RLE = lossless example.",
    ],
  },
  {
    id: "2-data-tx",
    paper: 1,
    num: 2,
    title: "Data transmission",
    blurb: "Packets, serial/parallel, USB, error checking, encryption.",
    syllabus: [
      "Packet = Header (dest, packet#, originator) + Payload + Trailer.",
      "Packet switching basics.",
      "Serial vs parallel; simplex / half-duplex / full-duplex.",
      "USB benefits + drawbacks.",
      "Error checks: parity (odd/even, parity byte, parity block), checksum, echo check.",
      "Check digit (ISBN, barcodes); ARQ (positive/negative ack + timeout).",
      "Encryption purpose: plaintext → ciphertext.",
      "Symmetric (one shared key) vs asymmetric (public + private).",
    ],
  },
  {
    id: "3-hardware",
    paper: 1,
    num: 3,
    title: "Hardware",
    blurb: "CPU + Von Neumann, I/O, sensors, memory, storage, network.",
    syllabus: [
      "CPU role. Von Neumann: ALU, CU. Registers: PC, MAR, MDR, CIR, ACC.",
      "Buses: address, data, control.",
      "FDE (Fetch-Decode-Execute) cycle.",
      "Performance: core count, cache size, clock speed. Embedded systems.",
      "Input devices: barcode scanner, digital camera, keyboard, mic, mouse, QR, touchscreen (resistive/capacitive/IR), 2D/3D scanners.",
      "Output: actuator, DLP/LCD projector, inkjet, laser, LED, speaker, 3D printer.",
      "Sensors: acoustic, accel, flow, gas, humidity, IR, level, light, magnetic, moisture, pH, pressure, proximity, temperature.",
      "Primary: RAM (volatile, read+write) vs ROM (non-volatile, read-only, holds bootloader).",
      "Secondary: magnetic (HDD), optical (CD/DVD/Blu-ray), solid-state (SSD, SD, USB — NAND/NOR).",
      "Virtual memory (pages between RAM ↔ secondary). Cloud storage pros/cons.",
      "NIC + MAC (48-bit hex; manufacturer + serial). IP (static/dynamic; IPv4 32-bit / IPv6 128-bit). Router role.",
    ],
  },
  {
    id: "4-software",
    paper: 1,
    num: 4,
    title: "Software",
    blurb: "System vs application, OS roles, interrupts, translators, IDE.",
    syllabus: [
      "System vs application software.",
      "OS roles: file mgmt, interrupt handling, interface, peripheral/driver mgmt, memory, multitasking, platform, security, user accounts.",
      "Firmware / bootloader.",
      "Interrupts: how generated; ISR; software (div-by-zero, two processes one memory) vs hardware (keypress, mouse).",
      "High-level vs low-level (pros/cons). Assembly + mnemonics + assembler.",
      "Compiler (whole program, executable, full error report at end) vs interpreter (line-by-line, stops at first error).",
      "IDE features: code editor, run-time, translators, error diagnostics, auto-completion, auto-correction, prettyprint.",
    ],
  },
  {
    id: "5-internet",
    paper: 1,
    num: 5,
    title: "The internet & its uses",
    blurb: "Internet vs WWW, URLs, HTTP, DNS, cookies, blockchain, cyber security.",
    syllabus: [
      "Internet = infrastructure; WWW = pages on top.",
      "URL = protocol + domain + filename. HTTP vs HTTPS (HTTPS uses SSL).",
      "Browser purpose + functions (render HTML, history, bookmarks, tabs, cookies, address bar).",
      "Page retrieval: browser → IP → DNS → web server → HTML returned.",
      "Cookies: session (expire on close) vs persistent.",
      "Digital currency exists only electronically. Blockchain = time-stamped tamper-proof ledger.",
      "Threats: brute force, data interception, DDoS, hacking, malware (virus/worm/Trojan/spyware/adware/ransomware), pharming, phishing, social engineering.",
      "Solutions: access levels, anti-malware, authentication (password/biometric/2FA), auto updates, checking spelling/URL/tone, firewalls, privacy settings, proxy, SSL.",
    ],
  },
  {
    id: "6-emerging",
    paper: 1,
    num: 6,
    title: "Automated & emerging technologies",
    blurb: "Automation, robotics, AI.",
    syllabus: [
      "Automated systems = sensors + microprocessor + actuators. Applications across industries.",
      "Robotics: mechanical + electrical + programmable. Uses + pros/cons.",
      "AI: data + rules; reason; learn/adapt.",
      "Expert systems: knowledge base + rule base + inference engine + user interface.",
      "Machine learning: program adapts its own processes/data.",
    ],
  },
  {
    id: "7-algorithms",
    paper: 2,
    num: 7,
    title: "Algorithm design & problem-solving",
    blurb: "PDLC, decomposition, flowcharts, validation, test data, trace tables.",
    syllabus: [
      "Program development lifecycle: analysis → design → coding → testing.",
      "Decomposition (inputs/processes/outputs/storage), structure diagrams, flowcharts, pseudocode.",
      "Standard methods: linear search, bubble sort, totalling, counting, finding max/min/average.",
      "Validation: range, length, type, presence, format, check digit.",
      "Verification: visual check, double entry.",
      "Test data: normal, abnormal, extreme (largest/smallest accepted), boundary (a PAIR — accepted + rejected).",
      "Trace tables: record variables, outputs, prompts step by step.",
      "Error spotting & correction. Use programmatic notation (`x > y`), not English.",
    ],
  },
  {
    id: "8-programming",
    paper: 2,
    num: 8,
    title: "Programming (pseudocode)",
    blurb: "Variables, control flow, arrays, files, procedures.",
    syllabus: [
      "Variables + constants. Types: INTEGER, REAL, CHAR, STRING, BOOLEAN.",
      "Sequence, selection (IF / CASE), iteration (FOR / WHILE / REPEAT).",
      "Totalling, counting, string handling: LENGTH, SUBSTRING, UCASE, LCASE.",
      "Operators: + - * / ^ MOD DIV; = < <= > >= <>; AND OR NOT.",
      "Procedures + functions (up to 3 parameters). Local vs global scope.",
      "Library routines: MOD, DIV, ROUND, RANDOM.",
      "1D + 2D arrays. Iterate & nest.",
      "File handling: OPENFILE … FOR READ/WRITE, READFILE, WRITEFILE, CLOSEFILE.",
      "Maintainable code: meaningful names, comments, sub-routines.",
    ],
  },
  {
    id: "9-databases",
    paper: 2,
    num: 9,
    title: "Databases (single-table)",
    blurb: "Fields, records, primary key, SQL queries.",
    syllabus: [
      "Fields + records. Data types: text/alphanumeric, char, Boolean, integer, real, date/time.",
      "Primary key = unique identifier.",
      "SQL keywords allowed: SELECT, FROM, WHERE, ORDER BY ASCENDING/DESCENDING, SUM, COUNT, AND, OR.",
      "Strings in double quotes. Use full keyword DESCENDING, not DESC.",
      "AVG is NOT in current 0478 SQL list — only SUM and COUNT.",
    ],
  },
  {
    id: "10-logic",
    paper: 2,
    num: 10,
    title: "Boolean logic",
    blurb: "Gates, truth tables, logic circuits.",
    syllabus: [
      "Gates: NOT (1 input), AND, OR, NAND, NOR, XOR (EOR).",
      "Build circuit from problem statement / logic expression / truth table — without simplification.",
      "Complete a truth table from any of the three sources.",
      "Max 3 inputs and 1 output per circuit.",
    ],
  },
];

// ===========================================
// Practice questions — covering Topics 1–10
// ===========================================
export type IgcseCsQuestion = {
  id: string;
  topic: IgcseCsTopicId;
  q: string;
  // For short-answer: store the model answer as `model`.
  model: string;
  // Optional MCQ shape — if `opts` provided, treat as MCQ with `a` being the correct.
  opts?: string[];
  a?: string;
  // Quick examiner hint
  hint?: string;
};

export const IGCSE_CS_QUESTIONS: IgcseCsQuestion[] = [
  // Topic 1
  {
    id: "q1-1", topic: "1-data-rep",
    q: "Convert denary 173 to 8-bit binary.",
    opts: ["10101101", "10110011", "11010101", "10011101"],
    a: "10101101",
    model: "128 + 32 + 8 + 4 + 1 = 173 → 10101101.",
    hint: "Use 128-64-32-16-8-4-2-1.",
  },
  {
    id: "q1-2", topic: "1-data-rep",
    q: "Convert binary 11010110 to hex.",
    opts: ["D6", "C6", "E5", "B7"],
    a: "D6",
    model: "Split into nibbles: 1101 = D, 0110 = 6 → D6.",
  },
  {
    id: "q1-3", topic: "1-data-rep",
    q: "Convert hex 2F to denary.",
    opts: ["31", "47", "63", "207"],
    a: "47",
    model: "(2×16) + 15 = 47.",
  },
  {
    id: "q1-4", topic: "1-data-rep",
    q: "Perform a 2-place logical LEFT shift on 00010110. State the new value and its effect.",
    model: "01011000. The value was 22 and is now 88 — multiplied by 4 (2² for a 2-place left shift).",
  },
  {
    id: "q1-5", topic: "1-data-rep",
    q: "Add the 8-bit binaries 10110011 + 01011010. Will an overflow occur?",
    model: "Sum = 100001101 (9 bits). Yes — overflow occurs because the result needs more than 8 bits.",
  },
  {
    id: "q1-6", topic: "1-data-rep",
    q: "1 KiB equals how many bytes?",
    opts: ["1000", "1024", "1048", "10000"],
    a: "1024",
    model: "Storage units use powers of 1024, not 1000. Note the 'bi' in the unit name.",
  },
  // Topic 2
  {
    id: "q2-1", topic: "2-data-tx",
    q: "Name the three components of a packet.",
    model: "Header, payload, trailer.",
  },
  {
    id: "q2-2", topic: "2-data-tx",
    q: "Describe symmetric encryption in one sentence.",
    model: "The same secret key is used to encrypt the plaintext and decrypt the ciphertext, so the key must be shared securely.",
  },
  // Topic 3
  {
    id: "q3-1", topic: "3-hardware",
    q: "State two differences between RAM and ROM.",
    model: "RAM is volatile (contents lost when power off) but ROM is non-volatile (contents retained). RAM can be written and read; ROM is read-only in normal use.",
  },
  {
    id: "q3-2", topic: "3-hardware",
    q: "State the purpose of MAR and MDR in the FDE cycle.",
    model: "MAR (Memory Address Register) holds the address of the memory location to be read from or written to. MDR (Memory Data Register) holds the data or instruction being transferred to or from that location.",
  },
  {
    id: "q3-3", topic: "3-hardware",
    q: "Which type of address is assigned at manufacture and is unique to a network interface card?",
    opts: ["IP address", "MAC address", "URL", "DNS record"],
    a: "MAC address",
    model: "MAC is 48-bit hex, assigned at manufacture: first half = manufacturer code, second half = serial.",
  },
  // Topic 4
  {
    id: "q4-1", topic: "4-software",
    q: "Give two differences between a compiler and an interpreter.",
    model: "Compiler translates the whole program at once and produces an executable; interpreter translates line by line and does not produce one. Compiler reports errors at the end; interpreter stops at the first error encountered.",
  },
  {
    id: "q4-2", topic: "4-software",
    q: "Describe two functions of an operating system.",
    model: "Manages files and folders on backing storage. Manages memory allocation between running programs. (Also accept: handling interrupts, providing a user interface, multitasking, security, peripheral/driver management.)",
  },
  // Topic 5
  {
    id: "q5-1", topic: "5-internet",
    q: "Define DNS in one sentence.",
    model: "Domain Name Server — translates a human-readable domain name (like www.example.com) into the IP address of the server hosting it.",
  },
  {
    id: "q5-2", topic: "5-internet",
    q: "What is pharming?",
    opts: [
      "Tricking the user with fake messages",
      "Flooding a server with requests from many machines",
      "Malicious code that redirects a user from a real URL to a fake site",
      "Repeatedly trying passwords until one works",
    ],
    a: "Malicious code that redirects a user from a real URL to a fake site",
    model: "Pharming silently redirects users — they think they typed the right URL but reach a fake site.",
  },
  // Topic 6
  {
    id: "q6-1", topic: "6-emerging",
    q: "Name the four components of an expert system.",
    model: "Knowledge base, rule base, inference engine, user interface.",
  },
  // Topic 7
  {
    id: "q7-1", topic: "7-algorithms",
    q: "Distinguish validation from verification.",
    model: "Validation is an automated check that data is reasonable (range, length, type, presence, format, check digit). Verification checks that data has been entered or transferred correctly (visual check or double entry).",
  },
  {
    id: "q7-2", topic: "7-algorithms",
    q: "An age must be between 11 and 18 inclusive. Give one normal, one boundary and one abnormal test datum.",
    model: "Normal: 15. Boundary: 11 (smallest accepted) AND 10 (largest rejected) — Cambridge wants a PAIR. Abnormal: -1 or 25.",
  },
  // Topic 8 — Pseudocode
  {
    id: "q8-1", topic: "8-programming",
    q: "Trace this pseudocode with input 4. What is the final OUTPUT?\n\nINPUT N\nT ← 0\nFOR i ← 1 TO N\n    T ← T + i\nNEXT i\nOUTPUT T",
    opts: ["6", "8", "10", "16"],
    a: "10",
    model: "i=1→T=1; i=2→T=3; i=3→T=6; i=4→T=10. Outputs 10.",
  },
  {
    id: "q8-2", topic: "8-programming",
    q: "Write pseudocode to input 10 numbers and OUTPUT their average.",
    model: `Total ← 0
FOR i ← 1 TO 10
    INPUT N
    Total ← Total + N
NEXT i
OUTPUT Total / 10`,
    hint: "Always initialise Total to 0 before the loop.",
  },
  {
    id: "q8-3", topic: "8-programming",
    q: "Write pseudocode to find the maximum value in array Score[1:20] (assume INTEGER values).",
    model: `Max ← Score[1]
FOR i ← 2 TO 20
    IF Score[i] > Max
      THEN
        Max ← Score[i]
    ENDIF
NEXT i
OUTPUT "Maximum = ", Max`,
  },
  // Topic 9 — SQL
  {
    id: "q9-1", topic: "9-databases",
    q: "Table STUDENT has fields Name, Year, Grade. Write SQL to list Name and Grade of students in Year 10, ordered by Grade descending.",
    model: 'SELECT Name, Grade\nFROM STUDENT\nWHERE Year = 10\nORDER BY Grade DESCENDING;',
    hint: "Use full keyword DESCENDING (not DESC). Strings in double quotes.",
  },
  {
    id: "q9-2", topic: "9-databases",
    q: "Write SQL to count how many players in table PLAYER have Sport = \"Tennis\".",
    model: 'SELECT COUNT(*)\nFROM PLAYER\nWHERE Sport = "Tennis";',
  },
  // Topic 10
  {
    id: "q10-1", topic: "10-logic",
    q: "Complete the truth table for X = (A AND B) OR NOT C. How many rows have X = 1?",
    opts: ["3", "4", "5", "6"],
    a: "5",
    model: "Rows where X=1: A=0,B=0,C=0 / A=0,B=1,C=0 / A=1,B=0,C=0 / A=1,B=1,C=0 / A=1,B=1,C=1 → 5 rows.",
  },
];

// ===========================================
// 25 must-know flashcards
// ===========================================
export type IgcseCsFlashcard = { term: string; def: string };

export const IGCSE_CS_FLASHCARDS: IgcseCsFlashcard[] = [
  { term: "RAM",              def: "Volatile primary storage holding currently running programs/data; contents lost when power is off." },
  { term: "ROM",              def: "Non-volatile primary memory storing the bootloader/firmware; read-only in normal use." },
  { term: "Cache",            def: "Small, fast memory near the CPU storing frequently used instructions/data to speed up access." },
  { term: "Virtual memory",   def: "Area of secondary storage used as if it were RAM; pages swap between RAM and disk." },
  { term: "Compiler",         def: "Translates the whole source code into an executable in one go; produces an error report at the end." },
  { term: "Interpreter",      def: "Translates and executes source code one line at a time; stops at the first error." },
  { term: "Assembler",        def: "Translates assembly language (mnemonics) into machine code." },
  { term: "Validation",       def: "Automated check that data is reasonable: range, length, type, presence, format, check digit." },
  { term: "Verification",     def: "Check that data has been entered or transferred correctly: visual check, double entry." },
  { term: "Primary key",      def: "A field that uniquely identifies each record in a database table." },
  { term: "MAC address",      def: "48-bit hardware address assigned at manufacture, written in hex (manufacturer code + serial code)." },
  { term: "IP address",       def: "Logical address assigned by a network; static or dynamic; IPv4 (32-bit) or IPv6 (128-bit)." },
  { term: "HTTP / HTTPS",     def: "Protocols for transferring web pages; HTTPS adds SSL/TLS encryption." },
  { term: "DNS",              def: "Domain Name Server — translates a domain name into an IP address." },
  { term: "Cookie",           def: "Small text file stored by a browser; session cookies expire on close, persistent cookies remain." },
  { term: "Blockchain",       def: "A time-stamped, tamper-proof digital ledger of transactions; used to track digital currencies." },
  { term: "Phishing",         def: "Fake emails or messages tricking users into giving away personal data." },
  { term: "Pharming",         def: "Malicious code redirects a user from a real URL to a fake website without their knowledge." },
  { term: "DDoS",             def: "Distributed Denial of Service — many computers flood a server with requests so real users cannot access it." },
  { term: "Symmetric encryption", def: "Same key encrypts and decrypts; the key must be shared safely." },
  { term: "Asymmetric encryption", def: "Public key encrypts, matching private key decrypts." },
  { term: "Overflow",         def: "Error when a calculated value exceeds the range that can be stored (e.g. > 255 in 8-bit)." },
  { term: "Embedded system",  def: "Hardware + software dedicated to one function inside a larger device (washing machine, car ECU)." },
  { term: "Expert system",    def: "AI software with a knowledge base, rule base, inference engine and user interface." },
  { term: "Interrupt",        def: "Signal to the CPU pausing the current process so the OS can handle an event via an ISR." },
];

// ===========================================
// Common exam mistakes
// ===========================================
export const IGCSE_CS_MISTAKES: { mistake: string; fix: string }[] = [
  { mistake: "Writing answers in Python or Java where pseudocode is required.", fix: "Default to pseudocode everywhere EXCEPT the final 15-mark scenario question, which allows Python/VB/Java." },
  { mistake: "Using English in pseudocode (\"x is bigger than y\").", fix: "Use programmatic notation: x > y." },
  { mistake: "Giving one value for boundary test data.", fix: "Boundary is always a PAIR: largest accepted AND smallest rejected (or vice versa)." },
  { mistake: "Forgetting to initialise Total / Counter / Max before a loop.", fix: "Always set the variable before the FOR/WHILE loop starts." },
  { mistake: "Storage calculations using ×1000.", fix: "Use ×1024 — KiB, MiB, GiB are powers of 2 (note the 'bi' in the unit name)." },
  { mistake: "Confusing validation with verification.", fix: "Validation = reasonable (automated). Verification = correctly entered (visual/double-entry)." },
  { mistake: "Generic OS answers like \"manages the computer\".", fix: "Name specific functions: memory mgmt, file mgmt, interrupt handling, multitasking, security, peripheral mgmt, user accounts, user interface." },
  { mistake: "Confusing internet with WWW, HTTP with HTML, MAC with IP.", fix: "Memorise the precise definitions in the flashcards section." },
  { mistake: "Simplifying logic circuits when the question forbids it.", fix: "Build directly from the statement/expression/truth table unless asked to simplify." },
  { mistake: "Using SQL keywords DESC / ASC, or quoting integers.", fix: "Use full keywords DESCENDING / ASCENDING. Quote strings only, never integers." },
];

// ===========================================
// One-page cheat sheet (read morning of exam)
// ===========================================
export const IGCSE_CS_CHEAT: { heading: string; bullets: string[] }[] = [
  {
    heading: "Format",
    bullets: [
      "Two papers, 1h45 each, 75 marks each. No calculators.",
      "Paper 1 = Topics 1–6 (theory). Paper 2 = Topics 7–10 (algorithms + 15-mark scenario).",
      "Pseudocode only — Python/VB/Java only in the final scenario question.",
    ],
  },
  {
    heading: "Binary & Hex",
    bullets: [
      "Place values: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1.",
      "8-bit max = 255. Overflow above that.",
      "Hex digits: 0-9, A=10, B=11, C=12, D=13, E=14, F=15.",
      "Left shift by n = ×2ⁿ. Right shift by n = ÷2ⁿ.",
    ],
  },
  {
    heading: "Storage",
    bullets: [
      "8 bits = 1 byte; 1024 bytes = 1 KiB; 1024 KiB = 1 MiB.",
      "Image size = W × H × bit-depth ÷ 8.",
      "Sound size = sample rate × resolution × time ÷ 8.",
    ],
  },
  {
    heading: "Von Neumann",
    bullets: [
      "ALU + CU; registers PC, MAR, MDR, CIR, ACC.",
      "Buses: address, data, control.",
      "FDE = Fetch → Decode → Execute.",
    ],
  },
  {
    heading: "Software lists",
    bullets: [
      "OS roles: memory · files · peripherals · interrupts · multitasking · security · UI · user accounts.",
      "Compiler vs interpreter: whole/exec/end-report vs line-by-line/stops-on-error.",
    ],
  },
  {
    heading: "Validation list",
    bullets: [
      "Range · Length · Type · Presence · Format · Check digit.",
      "Verification = Visual check + Double entry.",
      "Test data = Normal · Abnormal · Extreme · Boundary (a PAIR).",
    ],
  },
  {
    heading: "Cyber security (memorise the 8)",
    bullets: [
      "Brute force · Data interception · DDoS · Hacking · Malware · Pharming · Phishing · Social engineering.",
      "Solutions: access levels · anti-malware · authentication · auto-updates · check URL/spelling · firewalls · privacy settings · proxies · SSL.",
    ],
  },
  {
    heading: "Pseudocode style",
    bullets: [
      "Keywords UPPERCASE. Assignment with ←.",
      "Identifiers in PascalCase, no underscores.",
      "Indent 2 spaces inside IF/CASE, 4 spaces inside loops.",
      "Iteration: FOR…NEXT (count), WHILE…ENDWHILE (pre-condition), REPEAT…UNTIL (post-condition; runs at least once).",
    ],
  },
  {
    heading: "Built-ins",
    bullets: [
      "LENGTH(s), SUBSTRING(s, start, len), UCASE(s), LCASE(s).",
      "MOD, DIV, ROUND, RANDOM().",
      "File: OPENFILE x FOR READ|WRITE → READFILE x, v / WRITEFILE x, v → CLOSEFILE x.",
    ],
  },
  {
    heading: "SQL & Logic",
    bullets: [
      "SQL keywords: SELECT, FROM, WHERE, ORDER BY ASCENDING/DESCENDING, SUM, COUNT, AND, OR.",
      "Strings in double quotes. Integers unquoted. Don't use AVG (not in spec).",
      "Logic gates: NOT (1-input), AND, OR, NAND, NOR, XOR. Max 3 inputs, 1 output. Don't simplify unless asked.",
    ],
  },
  {
    heading: "Command words",
    bullets: [
      "Define = precise meaning.",
      "Describe = points + features.",
      "Explain = reasons + evidence.",
      "State = clear short answer.",
      "Suggest = apply knowledge.",
    ],
  },
];
