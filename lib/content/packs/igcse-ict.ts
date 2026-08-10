// Cambridge IGCSE Information and Communication Technology 0417 — full
// syllabus, all 21 sections, theory AND both practical papers.
//
// Verified 2026-08-11 against the official Cambridge syllabus PDF for exams in
// 2026, 2027 and 2028 (version 3, published December 2025):
// https://www.cambridgeinternational.org/Images/697139-2026-2028-syllabus.pdf
//
// Verified directly from that document and reproduced here as fact:
//   • Assessment overview (p.9 / pp.37–38). Paper 1 Theory — written, 1 h 30 min,
//     80 marks, 40%, questions set on sections 1–21, all compulsory. Paper 2
//     Document Production, Databases and Presentations — practical, 2 h 15 min,
//     70 marks, 30%, sections 17/18/19 plus the skills of sections 11–16.
//     Paper 3 Spreadsheets and Website Authoring — practical, 2 h 15 min,
//     70 marks, 30%, sections 20/21 plus the skills of sections 11–16.
//     The two practical papers therefore carry 60% of the qualification.
//   • The 21 content-section titles and their order (p.8), used verbatim below.
//   • "Note that no marks are awarded for brand names of software packages or
//     hardware in candidate responses." (p.11) — this drives `pinnedRule`.
//   • The spreadsheet function list of section 20.1: sum, average, maximum,
//     minimum, integer, rounding, counting, LOOKUP, VLOOKUP, HLOOKUP, XLOOKUP,
//     IF, plus nested functions, named ranges and external data sources.
//   • Candidates must not have access to the internet or email in Papers 2 and 3,
//     and must enter their name, centre number and candidate number
//     ELECTRONICALLY on each piece of evidence before printing (pp.37–38).
//
// Deliberately NOT asserted: grade boundaries, per-task mark tallies, and the
// exact function forms COUNTIF / SUMIF. The syllabus names "counting" functions
// generically rather than listing COUNTIF and SUMIF by name, so where those
// appear below they are flagged as the conditional forms the practical papers
// have habitually required, not as syllabus-quoted names.
//
// Question stems are original, written in the style of Paper 1 and of the
// Paper 2 / Paper 3 task instructions — no past-paper wording is reproduced.

import type { ExamPack } from "../exam-pack";

export const IGCSE_ICT_PACK: ExamPack = {
  subjectId: "igcse-ict",
  grade: 10,
  title: "ICT — Full Syllabus · IGCSE",
  context: "Cambridge IGCSE 0417 · 21 sections · Paper 1 theory + Papers 2 & 3 practical",
  highlights: [
    { label: "Syllabus", value: "0417 (2026–2028)" },
    { label: "Sections", value: "1 – 21 · complete" },
    { label: "Practical weight", value: "Papers 2 + 3 = 60% of the grade" },
  ],
  pinnedRule: {
    heading: "Name the thing — and put your name on it",
    body: "Paper 1: the syllabus states plainly that NO marks are awarded for brand names of software or hardware. Never write a product name — write the technical term (spreadsheet software, laser printer, magnetic hard disk drive, optical mark reader). Then answer inside the scenario you were given: a generic 'it is faster' earns nothing when the question is about a hospital's patient records. If the question asks for a feature or characteristic, describe what the thing IS or DOES — not what the user gains from it. Papers 2 & 3: enter your name, centre number and candidate number ELECTRONICALLY (in a header, footer or on the slide — never handwritten) on every document, report, slide and web page before you print. Evidence that cannot be identified as yours cannot be credited.",
  },
  reference: {
    label: "Cambridge IGCSE ICT 0417 — subject page",
    url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-information-and-communication-technology-0417/",
  },
  plan: [
    { title: "Split your revision the way the marks split", hint: "40% theory, 60% practical — most people revise the reverse" },
    { title: "Walk sections 1–10 for the theory paper", hint: "Devices, networks, applications, life cycle, safety" },
    { title: "Type every spreadsheet function from memory", hint: "IF, VLOOKUP, HLOOKUP, XLOOKUP, ROUND, INT, counting" },
    { title: "Build one web page from a blank file", hint: "head, table, hyperlinks, external stylesheet — no wizard" },
    { title: "Drill the pairs that get swapped", hint: "Validation/verification · hub/switch · feature/benefit" },
    { title: "Rehearse the evidence routine", hint: "Name + centre + candidate number electronically, every printout" },
  ],

  topics: [
    // ===== PAPER 1 — THEORY (sections 1–10) =====
    {
      id: "t1-systems", num: 1, title: "1. Types and components of computer systems",
      blurb: "Paper 1 · hardware, software, memory, operating systems, emerging tech.",
      syllabus: [
        "Hardware = the physical components. Internal components: CPU/processor, motherboard, RAM, ROM, graphics card, sound card, network interface card (NIC), camera, internal and external storage.",
        "Software = programs. Applications software solves the USER's task (word processing, spreadsheet, database management, control, measurement, apps, video/graphics/audio editing, CAD); system software runs the COMPUTER (compilers, linkers, device drivers, operating systems, utilities).",
        "RAM vs ROM: RAM is volatile, read and write, holds data and programs currently in use; ROM is non-volatile, read only, holds the start-up instructions. Backing storage vs internal memory: much larger, permanent, slower to access.",
        "Analogue vs digital data, and why conversion is needed both ways — analogue to digital so a computer can process it, digital to analogue so it can control a physical device.",
        "Operating system interfaces: command line interface (CLI), graphical user interface (GUI), dialogue-based and gesture-based — with the advantages and disadvantages of each.",
        "Types of computer: desktop vs mobile (laptop, smartphone, tablet, phablet), compared on portability and expandability. Emerging technologies: the impact of artificial intelligence and of extended reality (virtual and augmented) on everyday life.",
      ],
    },
    {
      id: "t2-io-devices", num: 2, title: "2. Input and output devices",
      blurb: "Paper 1 · pick the right device for the scenario and justify it.",
      syllabus: [
        "Input devices and their uses, advantages and disadvantages: keyboard, numeric keypad, pointing devices, remote control, joystick/driving wheel, touch screen (as input), scanner, camera, microphone, sensors, light pen.",
        "Direct data entry devices: magnetic stripe reader, chip and PIN reader, RFID reader, optical mark recognition (OMR), optical character recognition (OCR), bar code reader, QR scanner.",
        "Match the reader to the job: OMR for multiple-choice answer sheets and school registers; OCR for automated number plate recognition; RFID for stock, passports and contactless payment; chip and PIN at the till.",
        "Output devices: monitor, touch screen (as output), multimedia projector, laser printer, inkjet printer, dot matrix printer, plotter, 3D printer, speaker, actuator.",
        "Printer choice by workload: laser for high-volume fast office printing, inkjet for small runs of high-quality colour, dot matrix for multi-part continuous stationery in a dusty environment, plotter for large accurate line drawings such as plans.",
        "An actuator is the output device that converts an electrical signal into physical movement (a motor, valve or buzzer) — the device named at the end of a control system.",
      ],
    },
    {
      id: "t3-storage", num: 3, title: "3. Storage devices and media",
      blurb: "Paper 1 · magnetic, optical and solid-state — device vs medium.",
      syllabus: [
        "The three technologies with their characteristics, uses, advantages and disadvantages: magnetic, optical and solid-state.",
        "Magnetic: fixed and portable magnetic hard drives, magnetic tape drives. The media are magnetic hard disks and magnetic tape.",
        "Optical: CD, DVD and Blu-ray — the drive is the device, the disc is the medium. Blu-ray holds the most; the R / RW distinction decides whether it can be rewritten.",
        "Solid-state: fixed and portable solid-state drives (SSD), pen drives and flash drives; media include memory cards (SD, xD, CFast). No moving parts, so fast, silent, low power and shock-resistant.",
        "Keep device and medium apart in your answer — the question wording tells you which is wanted. A tape DRIVE reads a tape; a tape is the MEDIUM.",
        "Serial vs direct access matters in scenarios: magnetic tape is read serially, so it suits whole-file backup and batch processing, not finding one record fast.",
      ],
    },
    {
      id: "t4-networks", num: 4, title: "4. Networks and the effects of using them",
      blurb: "Paper 1 · hardware roles, network types, security and conferencing.",
      syllabus: [
        "Router: connects networks and devices to the internet, stores computer addresses, and routes data packets to their destination.",
        "Common network devices and their distinct roles: network interface card (NIC) connects a device to the network; hub broadcasts incoming data to EVERY connected device; switch sends data only to the intended recipient using its address; bridge joins two networks or segments together.",
        "Wi-Fi vs Bluetooth: both connect a device without cables, but Bluetooth is short-range, lower bandwidth and pairs a small number of devices directly, while Wi-Fi has longer range, higher bandwidth and connects many devices through a wireless access point.",
        "Network types: LAN (one site, small geographical area), WLAN (a LAN using wireless access points instead of cabling), WAN (large geographical area, uses third-party/public communication links). Network environments: internet (public, global), intranet (private, internal to one organisation), extranet (an intranet extended to specified external users).",
        "Cloud computing: how data is stored, managed and shared; advantages and disadvantages of cloud storage compared with local storage.",
        "Network security: privacy and confidentiality of transferred data; strong vs weak passwords and avoiding interception with up-to-date anti-spyware and regular password changes; other authentication — zero login, biometrics, magnetic stripes, smart cards, physical tokens, electronic tokens; anti-malware and anti-virus software that quarantines or removes viruses and scans downloads and transfer media. Electronic conferencing: video-, audio- and web-conferencing, and the hardware, software and connection each needs.",
      ],
    },
    {
      id: "t5-effects", num: 5, title: "5. The effects of using IT",
      blurb: "Paper 1 · microprocessor-controlled devices and health.",
      syllabus: [
        "Positive and negative effects of microprocessor-controlled devices in the HOME: more leisure time and freedom from routine tasks, set against less physical fitness, reduced social interaction and worries about the security of the data these devices collect.",
        "Positive and negative effects in TRANSPORT: autonomous vehicles, transport safety and, again, the security of the data being gathered.",
        "Health issues caused by prolonged use of IT equipment: repetitive strain injury (RSI), back problems, eye problems and headaches.",
        "Each health issue needs a CAUSE and a PREVENTION, and the two must match: RSI from repeated clicking and typing → wrist rest, ergonomic keyboard, regular breaks; back problems from poor posture → adjustable chair with back support, footrest, correct screen height.",
        "Eye problems and headaches come from staring at a screen for long periods and from glare → anti-glare screen or blinds, regular breaks away from the screen, correct lighting, eye tests.",
        "Answer these in the scenario given (office worker, gamer, warehouse picker) — a generic list of four ailments rarely scores the applied marks.",
      ],
    },
    {
      id: "t6-applications", num: 6, title: "6. ICT applications",
      blurb: "Paper 1 · the biggest section — one application, one context, every time.",
      syllabus: [
        "Communication media (newsletters, posters, websites, multimedia presentations, audio, video, media streaming, ePublications) and mobile communication (SMS, phone calls, VoIP, video calls, internet access).",
        "Modelling applications: personal finance, bridge and building design, flood water management, traffic management, weather forecasting — plus why a model is used instead of a real trial (safer, cheaper, faster, lets you change variables freely). Computer-controlled systems: robotics in manufacture, production line control, autonomous vehicles.",
        "School management systems (registration, attendance, recording performance, computer aided learning), online booking systems (travel, concerts, cinemas, sporting events) and how double-booking is prevented by flagging the seat the moment it is selected.",
        "Banking: ATMs (withdrawals, deposits, balance, mini statements, bill paying, transfers), electronic funds transfer (EFT), credit and debit card transactions, cheques, internet banking. Retail: POS terminals updating and reordering stock automatically, and EFTPOS with chip and PIN, contactless and NFC payment, including the exchange between the shop's computer and the bank's computer.",
        "Medicine (patient and pharmacy records; 3D printing of prosthetics, tissue engineering, artificial blood vessels, customised medicines) and expert systems — components: user interface, inference engine, knowledge base, rules base, explanation system; used for mineral prospecting, car engine fault diagnosis, medical diagnosis, chess, financial planning, route scheduling, plant and animal identification.",
        "Recognition systems (OMR, OCR/ANPR, RFID, NFC, biometrics — face, iris, retina, finger, thumb, hand, voice) and satellite systems (GPS, satellite navigation, GIS, satellite television and satellite phone).",
      ],
    },
    {
      id: "t7-life-cycle", num: 7, title: "7. The systems life cycle",
      blurb: "Paper 1 · analysis → design → testing → implementation → documentation → evaluation.",
      syllabus: [
        "Analysis: the four research methods — observation, interviews, questionnaires, examination of existing documents — each with advantages and disadvantages. Identify the inputs, outputs and processing of the current system, its problems, and the user and information requirements of the new one.",
        "Design: file/data structures (field name, field length, data type, coding of data such as M for male, F for female); input formats including data capture forms; output formats including screen layouts and report layouts.",
        "Validation routines to be designed in: range check, character check, length check, type check, format check, presence check, check digit.",
        "Development and testing: a test plan of test data, expected outcome, actual outcome and remedial action. Test with NORMAL data (accepted), ABNORMAL data (rejected) and EXTREME data (the values at the very limits of the accepted range — accepted). Live data is used once the system is otherwise working.",
        "Implementation — the four methods, each with its trade-off: direct changeover (cheapest and fastest, but no fallback if it fails), parallel running (old and new run together so there is a fallback, but costly and duplicated work), pilot running (one branch or department at a time), phased implementation (one module at a time).",
        "Documentation: technical documentation for the maintenance programmer (purpose and limitations of the system, program listing and language, flowcharts/algorithms, hardware and software requirements, file structures, list of variables, input/output formats, sample runs, validation routines) vs user documentation for the end user (how to load/run/install, save, print, add and delete records, error messages and handling, troubleshooting, FAQs, glossary). Evaluation: compare the solution with the original requirements, judge efficiency, ease of use and appropriateness, identify limitations and improvements.",
      ],
    },
    {
      id: "t8-safety-security", num: 8, title: "8. Safety and security",
      blurb: "Paper 1 · physical safety, eSafety, data protection and threats.",
      syllabus: [
        "Physical safety hazards, each with a cause and a prevention: electrocution (drinks spilt near equipment, touching live cables) → keep drinks away, check insulation, use an RCD; fire (overloaded sockets, equipment overheating) → do not overload sockets, ensure ventilation, fit a CO2 extinguisher; tripping (trailing cables) → cable ducts, wireless devices; heavy equipment falling → use strong, purpose-built desks.",
        "Data protection: the principles of a typical data protection act and why such legislation is needed. Personal data (name, address, date of birth, a photograph in school uniform, medical history) must be kept confidential and protected from inappropriate disclosure.",
        "eSafety on the internet: use only trusted sites recommended by teachers, and search engines restricted to age-appropriate content. Email: do not open or reply to email from an unknown person, and do not send personally identifiable data or images by email.",
        "eSafety on social media: know how to block and report unwanted users, never meet an online contact face to face, do not distribute inappropriate images, do not use inappropriate language, respect the confidentiality of other people's personal data. Online gaming: never use your real name, never give out personal or financial data.",
        "Threats to data: hacking; phishing (a fake email or link tricking you into giving details); pharming (malicious code redirecting you to a fake website even when the address is typed correctly); smishing (by SMS); vishing (by voice call or voicemail); viruses and malware; card fraud by shoulder surfing, card cloning and key logging.",
        "Protection of data: biometrics, digital certificates, secure socket layer (SSL) encrypting the link between server and client, encryption of data on hard discs, in email, in the cloud and on HTTPS sites, firewalls, two-factor authentication, and user id with password.",
      ],
    },
    {
      id: "t9-audience", num: 9, title: "9. Audience",
      blurb: "Paper 1 (and the reason every practical task exists) · audience and copyright.",
      syllabus: [
        "Audience appreciation: show a clear sense of audience and purpose in everything produced — the vocabulary, reading level, font size, colour scheme, amount of text and choice of images all follow from who will read it.",
        "Plan ICT solutions that are responsive to and respectful of the needs of an audience (young children, the elderly, users with visual impairments, an international audience).",
        "Analyse the needs of the audience BEFORE creating a solution, and be able to justify each design decision by naming the audience need it serves.",
        "Copyright: why copyright legislation is needed, and the principles of copyright as they apply to computer software — software piracy is copying, distributing or using software without a licence.",
        "Methods software producers use to prevent copyright being broken: product/licence keys, activation over the internet, holograms on packaging, encrypted or signed installation files, licence agreements, and requiring the original medium to be present.",
        "In the practical papers this section is invisible but marked — house style, consistent fonts and appropriate images are audience decisions being assessed.",
      ],
    },
    {
      id: "t10-communication", num: 10, title: "10. Communication",
      blurb: "Paper 1 · email conventions and using the internet effectively.",
      syllabus: [
        "Email: acceptable language, employer guidelines, security, netiquette, email groups, attachments, forward, carbon copy (cc — every recipient can see the address) and blind carbon copy (bcc — recipients cannot see who else received it, so it protects addresses and privacy).",
        "Spam: what it is, its effects (wasted time, wasted storage and bandwidth, a carrier for malware) and how to reduce it — spam filters, never replying, not posting your address publicly.",
        "The internet vs an intranet vs an extranet vs the World Wide Web, and the roles of blogs, forums, wikis and social networking.",
        "Internet functionality: the Internet Service Provider (ISP), the structure of a web address, the URL, hyperlinks and the web browser.",
        "Searching well: a search engine gives speed and huge coverage but returns too much, so relevance and reliability must be judged. Evaluate what you find for how up to date, reliable, biased and valid it is.",
        "Internet protocols: HTTP, HTTPS (the secure variant), FTP for file transfer and SSL. Risks of internet use, and restricting access through parental control, educational filtering and ISP control.",
      ],
    },

    // ===== PAPERS 2 & 3 — SKILLS DEMONSTRATED IN BOTH PRACTICAL PAPERS (sections 11–16) =====
    {
      id: "p11-file-management", num: 11, title: "11. File management",
      blurb: "Papers 2 & 3 · the marks you lose before you start the real task.",
      syllabus: [
        "Locate stored files, open and import files of different types, and save into a planned hierarchical folder structure using sensible file names.",
        "Save and print in the variety of formats the tasks demand: a document, screenshots, database reports, data tables, graphs and charts, a web page in BROWSER view and the same web page in HTML view.",
        "Save and export in application formats (.docx, .doc, .xlsx, .xls, .sdb, .sdc, .accdb, .odb, .rtf, .pptx, .ppt) and in generic formats (.csv, .txt, .rtf, .pdf, .css, .htm, .jpg, .png).",
        "Know why generic file formats exist: they can be opened by different software on different systems, so the recipient does not need your exact package.",
        "Compress files with .zip or .rar to reduce size for storage or transmission, and be able to say why that matters (faster transfer, less storage, attachment size limits).",
        "Characteristics and uses of css, csv, gif, htm, jpg, pdf, png, rtf, txt, zip and rar — including that a .csv is plain text with comma-separated values, which is why databases and spreadsheets import it.",
      ],
    },
    {
      id: "p12-images", num: 12, title: "12. Images",
      blurb: "Papers 2 & 3 · place with precision, resize without distorting.",
      syllabus: [
        "Place an image with precision — aligned to the margin, column or cell the instruction names, not simply dropped near it.",
        "Resize as specified, either maintaining the aspect ratio (so the image is not stretched) or deliberately adjusting it when told to fill a stated width and height.",
        "Crop an image to remove unwanted content; rotate it; reflect (flip) it horizontally or vertically.",
        "Adjust brightness and adjust contrast as separate operations.",
        "Group and ungroup images, and move an object to the front or to the back to control layering.",
        "Reduce an image's file size by reducing its resolution or its colour depth — the standard theory answer when a page loads too slowly.",
      ],
    },
    {
      id: "p13-layout", num: 13, title: "13. Layout",
      blurb: "Papers 2 & 3 · tables, headers and footers across every application.",
      syllabus: [
        "Enter and modify text and numbers with total accuracy, and edit using highlight, delete, move, cut, copy, paste and drag and drop.",
        "Place objects from a variety of sources into a document: text, image, screenshot, shapes, table, graph or chart, spreadsheet extract, database extract.",
        "Wrap text around a table, chart or image — above, below, square or tight, as specified.",
        "Tables: create with a stated number of rows and columns; insert and delete rows and columns; merge cells; set horizontal alignment (left, right, centre, fully justified) and vertical alignment (top, middle, bottom); show or hide gridlines; wrap text within a cell; shade cells; adjust row height and column width.",
        "Headers and footers: create or edit them and align contents consistently to the left margin, right margin or centred within the margins.",
        "Place automated objects in headers and footers — file information (filename and path), page numbering, total number of pages, date and time. Automated means the field updates itself; typing today's date by hand does not earn the mark.",
      ],
    },
    {
      id: "p14-styles", num: 14, title: "14. Styles",
      blurb: "Papers 2 & 3 · create it once, apply it everywhere, consistently.",
      syllabus: [
        "Create, modify, update and apply styles so that presentation is consistent across the whole document — the mark is for consistency, not for the individual formatting.",
        "Font settings within a style: font face, type (serif or sans-serif), point size and colour.",
        "Text alignment (left, right, centre, fully justified) and text enhancement (bold, underline, italic).",
        "Spacing: paragraph spacing before and after, and line spacing, set within the style rather than by pressing Enter repeatedly.",
        "Bullets: shape, alignment, line spacing and indent.",
        "Corporate house style: a defined set of fonts, colours, logo placement and layout that every document from an organisation must follow, so the organisation is instantly recognisable and looks professional.",
      ],
    },
    {
      id: "p15-proofing", num: 15, title: "15. Proofing",
      blurb: "Papers 2 & 3 · validation, verification and the errors a spell check misses.",
      syllabus: [
        "Use spell check and grammar check, but know their limit: automated suggestions do not always give the correct response, and a correctly spelt wrong word (form for from) passes untouched.",
        "Validation = an automatic check by the computer that entered data is SENSIBLE and of the right form. Types: range check, character check, length check, type check, format check, presence check (and check digit, listed in the design section 7.2).",
        "Verification = a check that data has been entered EXACTLY as it was on the source. The two methods are visual checking (compare on screen against the source document) and double data entry (enter twice and let the computer compare).",
        "Both are needed: validation cannot tell whether data is true, only whether it is plausible; verification cannot tell whether a faithfully copied value was sensible in the first place.",
        "Visual verification in the exam sense: identify and correct transposed numbers, incorrect spelling, inconsistent character spacing and inconsistent case.",
        "Proofreading: correct inconsistent line spacing, remove blank pages or slides, remove widows and orphans (a single line of a paragraph stranded at the bottom or top of a page), fix inconsistently applied styles, and make sure tables and lists are not split across columns, pages or slides.",
      ],
    },
    {
      id: "p16-graphs-charts", num: 16, title: "16. Graphs and charts",
      blurb: "Papers 2 & 3 · every label the instruction names, and no others.",
      syllabus: [
        "Select the data: contiguous ranges, non-contiguous ranges (hold the modifier key to add a second block) and specified data ranges. Selecting the wrong range is the commonest chart error.",
        "Select the chart type that fits the data: pie for parts of one whole, bar/column for comparing categories, line for change over time.",
        "Label fully and exactly as asked: chart title, legend, sector labels, sector values, percentages, category axis title, value axis title, category axis labels, value axis labels, data value labels.",
        "Add a second data series and, where the two series use different scales, add a second axis.",
        "Format numerical values to a specified number of decimal places or to display currency symbols; adjust the maximum, minimum and incremental values of an axis scale.",
        "Enhance the appearance: extract (explode) a pie chart sector to highlight it, change the colour scheme or fill patterns. If the instruction does not ask for a legend, delete it — an unwanted legend can cost the mark.",
      ],
    },

    // ===== PAPER 2 — DOCUMENT PRODUCTION, DATABASES AND PRESENTATIONS (sections 17–19) =====
    {
      id: "p17-document-production", num: 17, title: "17. Document production",
      blurb: "Paper 2 · page layout, columns, tabulation, breaks.",
      syllabus: [
        "Page layout: page size, page orientation, page margins, number of columns, column width, spacing between columns, and setting or removing page, section and column breaks.",
        "Line spacing set precisely — single, 1.5 times, double, multiple, and spacing before and after paragraphs.",
        "Tabulation: left, right, centred and decimal tabs; indented paragraphs; hanging paragraphs. A decimal tab lines a column of prices up on the decimal point — spaces will not do it.",
        "Text enhancement including bold, underline, italic, superscript, subscript and changes in case; bulleted and numbered lists.",
        "Find and replace, including matching case and whole words only — the safe way to change a term throughout a long document.",
        "Navigation with bookmarks and hyperlinks (add and delete). Understand the purpose of page, section and column breaks, and the purpose of a gutter margin — extra space on the binding edge so text is not lost when the document is bound.",
      ],
    },
    {
      id: "p18-databases", num: 18, title: "18. Databases",
      blurb: "Paper 2 · structure, data types, queries, reports.",
      syllabus: [
        "Create the structure: import data from .csv or .txt using specified field names; set data types — text, numeric (integer, decimal, currency), date/time, Boolean/logical; set numeric sub-types including percentage and number of decimal places; set the display format of a Boolean field (yes/no, true/false, checkbox) and of date/time data.",
        "Create and edit primary keys and foreign keys and create relationships between tables. A primary key uniquely identifies each record; a foreign key is a field in one table that holds the primary key value of another table, and it is what makes a relational database relational.",
        "Flat file vs relational database: a flat file is a single table, simple to set up but repeats data and risks inconsistency; a relational database splits data across linked tables, avoiding duplication and making updates consistent.",
        "Create a data entry form with the specified fields, appropriate font styles and sizes, spacing between fields, character spacing, use of white space, radio buttons, check boxes and drop-down menus — and know what makes a form well designed (clear labels, logical order, enough room, restricted choices where possible).",
        "Manipulate data: calculated fields and calculated controls using arithmetic operations and the numeric functions sum, average, maximum, minimum and count, performed at run time; sort on a single criterion or on multiple criteria, ascending or descending; select subsets with a query using AND, OR, NOT, LIKE, >, <, =, >=, <=, <> and wildcards.",
        "Present data: produce reports showing ALL required data and labels in full (never truncated); use report header, report footer, page header and page footer correctly; set report titles; produce tabular or columnar layouts; right-align numeric data and align on the decimal point; control decimal places, currency symbols and percentages.",
      ],
    },
    {
      id: "p19-presentations", num: 19, title: "19. Presentations",
      blurb: "Paper 2 · master slide first, then everything is consistent.",
      syllabus: [
        "Create a presentation from a supplied text file, so the headings and bullet levels come through as slide structure rather than being retyped.",
        "Use a MASTER SLIDE: insert and edit objects consistently on it — images, text, shapes, logos, slide headers and footers, placeholder position, automated slide numbering — and format master objects (headings, subheadings, bullets, background colour). Anything the task says must appear on every slide belongs on the master.",
        "Edit the presentation: apply a slide layout, insert a new slide, move or delete a slide, and hide slides that must not display during the show.",
        "Insert and edit objects on individual slides: text (headings, subheadings, bulleted lists), images (still, video clips, animated), charts, tables, audio clips, symbols, lines, arrows, call-out boxes and shapes; add presenter notes; add alternative text or a screentip to an object.",
        "Insert and edit hyperlinks — to a slide within the presentation, to an external file or to an email address — and insert action buttons configured to navigate to a specified slide or file.",
        "Apply CONSISTENT transitions between slides and CONSISTENT animation effects to text, images and other objects. Output for the required purpose: a looped on-screen carousel or a presenter-controlled show; print as full page slides, presenter notes or handouts with the stated number of slides per page.",
      ],
    },

    // ===== PAPER 3 — SPREADSHEETS AND WEBSITE AUTHORING (sections 20–21) =====
    {
      id: "p20-spreadsheets", num: 20, title: "20. Spreadsheets",
      blurb: "Paper 3 · the model, the functions, and $ in the right places.",
      syllabus: [
        "Build and edit the model: insert and delete cells, rows and columns; merge cells; create formulae using CELL REFERENCES rather than typed values; use the arithmetic operators add, subtract, multiply, divide and indices, with brackets to force the order of operations.",
        "Replicate formulae using absolute and relative cell references where appropriate. A relative reference (B4) shifts as the formula is copied; an absolute reference ($B$4) stays fixed; mixed references ($B4, B$4) lock only the column or only the row. Named cells and named ranges behave absolutely and make a formula readable.",
        "Functions named by the syllabus: sum, average, maximum, minimum, integer, rounding, counting, LOOKUP, VLOOKUP, HLOOKUP, XLOOKUP and IF — plus nested functions and functions that draw on external data sources.",
        "Know the difference between a formula (an expression you write, starting with =) and a function (a ready-made named operation the software provides), because that distinction is examined in words as well as in practice.",
        "Manipulate data: sort on a single or multiple criteria, ascending or descending; select subsets using AND, OR, NOT, >, <, =, >=, <=, <> and wildcards.",
        "Present data: display formulae or values as the task demands; adjust row height, column width and cell size so nothing is cut off (no ##### and no truncated labels); wrap text within cells; hide and display rows and columns; format numbers to set decimal places, currency symbols and percentages; apply conditional formatting; set orientation and control the printout with a specified number of pages, print area, and gridlines and row/column headings shown or hidden.",
      ],
    },
    {
      id: "p21-website-authoring", num: 21, title: "21. Website authoring",
      blurb: "Paper 3 · three layers, hand-edited HTML, external CSS.",
      syllabus: [
        "The three web development layers: the CONTENT layer holds the content and structure of the page (HTML); the PRESENTATION layer formats and displays the elements (CSS); the BEHAVIOUR layer is for a scripting language controlling the elements. No scripting is required of you — but the definition is.",
        "Head section: a page title that displays in the browser; external stylesheets attached in the correct hierarchy using a RELATIVE file path; metatags defining the charset and using name attributes (description, keywords, author, viewport) with their content attributes; a default target window.",
        "Body section: insert a table with table header, table rows and table data; use attributes to make cells span more than one row or column and to set table and cell sizes in pixels or as percentages; apply styles to tables. Tables are used to structure and position the elements of a page.",
        "Insert objects — text, images, sound clips, video (with display controls, without controls, autoplay) — adjusting size and aspect ratio and applying alternate text. Use the div tag to apply styles and classes; apply the pre-defined tags h1, h2, h3, p and li; apply classes to elements; style ordered and unordered lists.",
        "Create a bookmark using an id attribute, and create hyperlinks from text and from images to: a bookmark on the same page, another locally stored page, a website by URL, an email address, and to open in a specified location (same window, new window, or a named window). Relative file paths must be used for locally saved pages and objects, because an absolute path points at one folder on one machine and breaks the moment the site is moved to a server.",
        "Stylesheets: create generic external styles and inline style attributes for background properties (colour, images), font properties, and table/table row/table header/table data properties (size, background colour, horizontal and vertical alignment, spacing, padding, borders — collapsed, colour, thickness, visible or invisible). Create classes; create external styles tagged to h1, h2, h3, p, li; specify font family, size, colour, alignment, bold and italic; attach comments to a stylesheet; save in cascading stylesheet format. Know the hierarchy — an inline style attribute overrides an attached stylesheet, and where several stylesheets are attached the last one attached takes precedence — and the difference between a style (applied to every element of that type) and a class (applied only where you name it).",
      ],
    },
  ],

  flashcards: [
    // --- spreadsheet syntax (Paper 3's biggest earner) ---
    { term: "Relative vs absolute cell reference", def: "B4 is relative — it shifts when the formula is replicated. $B$4 is absolute — the dollar signs lock the column and the row so it never moves. $B4 locks the column only; B$4 locks the row only. Lock any cell the whole column of formulae must keep pointing at. A named cell or named range (VATrate, PriceList) behaves absolutely too, and reads better on a formulae printout." },
    { term: "IF function", def: "=IF(condition, value_if_true, value_if_false). Example: =IF(C4>=50,\"Pass\",\"Fail\"). Text results must be inside quotation marks; a cell reference must not be. Nest a second IF in the false slot for three or more bands: =IF(C4>=70,\"A\",IF(C4>=50,\"B\",\"C\")) — test the highest band first and let each condition catch what falls through." },
    { term: "VLOOKUP", def: "=VLOOKUP(lookup_value, table_array, column_index_number, FALSE). Searches the FIRST column of the table for the value, then returns the entry from the numbered column. Column 1 is the lookup column itself. FALSE (or 0) forces an exact match. The table_array must be absolute or a named range." },
    { term: "HLOOKUP vs VLOOKUP", def: "Identical logic, different direction. VLOOKUP searches down the first COLUMN and you give a column index. HLOOKUP searches along the first ROW and you give a row index: =HLOOKUP(value, range, row_index, FALSE)." },
    { term: "XLOOKUP", def: "=XLOOKUP(lookup_value, lookup_array, return_array). You give the two ranges directly, so there is no index number to miscount and the lookup column need not be first." },
    { term: "SUM / AVERAGE / MAX / MIN", def: "=SUM(B4:B20), =AVERAGE(B4:B20), =MAX(B4:B20), =MIN(B4:B20). Always give a range, never a list of individually typed numbers." },
    { term: "Counting functions", def: "COUNT counts cells containing NUMBERS. COUNTA counts cells that are not empty, text included. COUNTIF counts only cells meeting a condition: =COUNTIF(D4:D40,\"Pune\"). The conditional sum equivalent is =SUMIF(D4:D40,\"Pune\",F4:F40) — the criteria range, the criterion, then the range to add up." },
    { term: "ROUND vs INT", def: "=ROUND(B4,2) rounds to 2 decimal places, up or down as normal. =INT(B4) removes the decimal part entirely, so 7.9 becomes 7. INT is not rounding." },
    { term: "Formula vs function", def: "A formula is the expression you write yourself and always starts with = (=B4*C4). A function is a ready-made named operation supplied by the software (SUM, IF, VLOOKUP). A formula can contain functions." },
    // --- databases ---
    { term: "Database field data types", def: "Text/alphanumeric, numeric (integer, decimal, currency), date/time, Boolean/logical. Numeric sub-types set percentage and number of decimal places; Boolean displays as yes/no, true/false or a checkbox." },
    { term: "Why a phone number is TEXT", def: "It is never calculated with, and a numeric type would strip a leading zero and could not hold spaces, brackets or a + sign. Same reasoning for postcodes and ID codes." },
    { term: "Primary key vs foreign key", def: "A primary key is the field that uniquely identifies each record in a table and cannot be duplicated or left empty. A foreign key is a field in one table holding the primary key value of another table — it creates the relationship between them." },
    { term: "Flat file vs relational database", def: "Flat file = one single table: quick to set up, but data is repeated and can become inconsistent. Relational = several linked tables: no duplication, one change updates everywhere, but more complex to design." },
    { term: "Query operators and wildcards", def: "AND, OR, NOT, LIKE, >, <, =, >=, <=, <>. Wildcards match unknown characters — LIKE \"S*\" finds every entry starting with S. Use AND to narrow a search, OR to widen it." },
    { term: "Report header vs page header", def: "The report header prints ONCE at the very start of the report; the page header prints at the top of EVERY page. Same distinction for report footer and page footer. Read which one the task names." },
    // --- validation, verification, testing ---
    { term: "Validation vs verification", def: "Validation is an automatic computer check that data is SENSIBLE and of the right form. Verification is a check that data has been copied ACCURATELY from the source. Validation cannot tell whether data is true; verification cannot tell whether it is reasonable. A system needs both." },
    { term: "Validation check types", def: "Range (within stated limits), type (right data type), length (right number of characters), format (right pattern, e.g. two letters then four digits), presence (not left blank), character (only permitted characters), check digit (an extra calculated digit on a code such as a bar code)." },
    { term: "Verification methods", def: "Only two: visual checking — comparing what is on screen against the original source document — and double data entry, where the data is typed twice and the computer compares the two versions." },
    { term: "Normal, abnormal and extreme test data", def: "Normal data is inside the accepted range and should be ACCEPTED. Abnormal data is invalid — wrong type or outside the range — and should be REJECTED. Extreme data is the value exactly at the boundary of the accepted range and should be ACCEPTED." },
    { term: "Implementation methods", def: "Direct changeover — cheapest and fastest, but nothing to fall back on. Parallel running — old and new together, safe but expensive and duplicated. Pilot running — one branch or department first. Phased — one module at a time." },
    // --- networks ---
    { term: "Router", def: "Connects networks and devices to the internet, stores computer addresses, and routes data packets to the correct destination." },
    { term: "Hub vs switch", def: "A hub broadcasts incoming data to EVERY device on the network, so bandwidth is wasted and security is weaker. A switch reads the address and sends the data ONLY to the intended device." },
    { term: "NIC and bridge", def: "A network interface card is the hardware inside a device that lets it connect to a network. A bridge connects two networks, or two segments of one network, together." },
    { term: "LAN vs WLAN vs WAN", def: "LAN — one site or small geographical area. WLAN — a LAN using wireless access points instead of cabling. WAN — a large geographical area, using third-party or public communication links; the internet is the largest WAN." },
    { term: "Internet vs intranet vs extranet", def: "Internet — public and global. Intranet — private, internal to one organisation. Extranet — an intranet extended so specified external users (suppliers, customers) can be let in." },
    { term: "Wi-Fi vs Bluetooth", def: "Both are wireless. Bluetooth: short range, lower data transfer rate, pairs a small number of devices directly. Wi-Fi: longer range, much faster, connects many devices through a wireless access point." },
    // --- safety and security ---
    { term: "Phishing / pharming / smishing / vishing", def: "Phishing — a fake EMAIL or link asking for your details. Pharming — malicious code redirects you to a fake WEBSITE even when you type the address correctly. Smishing — the same trick by SMS. Vishing — by voice call or voicemail." },
    { term: "Firewall, SSL, encryption and 2FA", def: "A firewall monitors traffic entering and leaving a network and blocks what breaks the rules. SSL creates an encrypted link between the server and the client computer. Encryption scrambles the data itself so that intercepted data is meaningless without the key — it prevents understanding, not interception. Two-factor authentication proves identity twice with two different kinds of evidence — a password you KNOW plus a one-time code sent to a device you HAVE — so a stolen password alone is useless." },
    { term: "eSafety rules for social media", def: "Block and report unwanted users; never arrange to meet an online contact face to face; do not post inappropriate images; do not use inappropriate language; respect other people's personal data. Online gaming: never use your real name, never give out personal or financial data." },
    // --- web authoring ---
    { term: "The three web development layers", def: "Content layer — the content and structure of the page (HTML). Presentation layer — how elements are displayed and formatted (CSS). Behaviour layer — a scripting language controlling the elements. 0417 requires no scripting, only the definition." },
    { term: "Relative vs absolute file path", def: "A relative path locates a file from the current page's folder (images/logo.jpg). An absolute path gives the full location on one particular machine. Locally saved pages, objects and stylesheets must use RELATIVE paths, or every link breaks the moment the site is moved to a web server." },
    { term: "CSS style vs class, and the hierarchy", def: "A style attached to a tag (h1 { }) formats EVERY element of that type automatically. A class (.warning { }) formats only the elements where you write class=\"warning\"; class names are preceded by a full stop in the stylesheet. Hierarchy: an inline style attribute overrides an attached external stylesheet, and where several stylesheets are attached the one attached LAST takes precedence for rules of equal specificity." },
  ],

  questions: [
    // ---------- Paper 1: theory ----------
    {
      id: "iict-1", topic: "t1-systems",
      q: "A tablet computer stores the instructions it needs to start up, and also holds the app the user is currently running. Which statement correctly describes where each is held?",
      opts: [
        "Both are held in RAM, because RAM is faster than ROM",
        "The start-up instructions are in ROM, which is non-volatile; the running app is in RAM, which is volatile",
        "The start-up instructions are in RAM, which is non-volatile; the running app is in ROM, which is volatile",
        "Both are held on backing storage, and internal memory is only used for the operating system",
      ],
      a: "The start-up instructions are in ROM, which is non-volatile; the running app is in RAM, which is volatile",
      model: "ROM is read-only and non-volatile — its contents survive the power being switched off, which is exactly what start-up instructions need. RAM is read-and-write and volatile — its contents are lost when the power goes, which is fine for the app currently in use.\nThe third option reverses both properties. The fourth confuses internal memory with backing storage: backing storage is much larger and permanent, but far slower to access, so the processor cannot work directly from it.",
    },
    {
      id: "iict-2", topic: "t2-io-devices",
      q: "An examination board marks 40 000 multiple-choice answer sheets, each filled in by shading boxes in pencil. Which direct data entry device is designed for this?",
      opts: [
        "Optical character reader (OCR)",
        "Optical mark reader (OMR)",
        "Bar code reader",
        "Magnetic stripe reader",
      ],
      a: "Optical mark reader (OMR)",
      model: "An optical mark reader detects the POSITION of pencil marks on a pre-printed form, which is precisely how multiple-choice answer sheets and school registers are designed to be read. It is fast and highly accurate because it is only detecting whether a box is shaded, not interpreting shapes.\nOCR reads printed or handwritten CHARACTERS and converts them to editable text — its classic use is automated number plate recognition. A bar code reader reads a striped code identifying a product. A magnetic stripe reader reads the stripe on a card.",
    },
    {
      id: "iict-3", topic: "t2-io-devices",
      q: "A large architecture practice needs to produce accurate, full-size drawings of building plans on paper up to 1 metre wide, and to let designers draw directly onto the screen. Name one suitable output device and one suitable input device, and justify each choice. Do not use brand names. [4]",
      model: "Output device: a plotter.\nJustification: a plotter draws with a moving pen or head along continuous lines, so it produces the accurate, precise straight lines and curves that a building plan needs, and it takes very wide paper — up to and beyond 1 metre — which an ordinary office printer cannot.\n\nInput device: a graphics tablet with a stylus (a light pen or a touch screen used as an input device is also acceptable).\nJustification: it lets the designer draw freehand directly, with far finer control than a mouse, and pressure or position is captured accurately, which suits detailed design work.\n\nMark-scheme discipline: one named device plus one reason tied to THIS scenario for each. 'A printer, because it prints' scores nothing — the device must be named specifically and the reason must mention the width or the accuracy the plans require.",
    },
    {
      id: "iict-4", topic: "t3-storage",
      q: "A field researcher needs to carry three years of survey data between remote sites in a hot, dusty, frequently jolted vehicle, and must be able to find any single record quickly. Which storage medium is most suitable?",
      opts: [
        "Magnetic tape, because it has the greatest capacity per unit cost",
        "A solid-state drive, because it has no moving parts and allows direct access",
        "A portable magnetic hard disk drive, because it is cheap per gigabyte",
        "A rewritable CD, because it is light and can be written to many times",
      ],
      a: "A solid-state drive, because it has no moving parts and allows direct access",
      model: "Two requirements decide it. First, the physical conditions: an SSD has no moving parts, so vibration and jolting cannot damage a spinning platter or a moving read/write head, and it tolerates heat and dust better. Second, the access requirement: an SSD gives direct access, so any single record can be reached immediately.\nMagnetic tape is read SERIALLY — you must pass over everything before the record you want — so it suits whole-file backup, not fast lookup. A portable magnetic hard disk is cheaper but has moving parts that are vulnerable to exactly this treatment. A rewritable CD has far too little capacity for three years of data and a limited number of rewrites.",
    },
    {
      id: "iict-5", topic: "t4-networks",
      q: "A school replaces the hubs in its network with switches. Which statement explains the improvement?",
      opts: [
        "A switch connects the network to the internet, whereas a hub cannot",
        "A switch sends data only to the device it is addressed to, whereas a hub broadcasts it to every device",
        "A switch converts wireless signals to wired signals, whereas a hub cannot",
        "A switch stores computer addresses so data can be routed between different networks",
      ],
      a: "A switch sends data only to the device it is addressed to, whereas a hub broadcasts it to every device",
      model: "A hub simply repeats every incoming packet out of all its ports, so every device receives traffic meant for someone else. That wastes bandwidth, causes collisions and weakens security. A switch reads the destination address and forwards the data only to that device.\nThe distractors describe other hardware: connecting the network to the internet, storing addresses and routing between networks are the ROUTER's jobs; converting wireless to wired describes a wireless access point.",
    },
    {
      id: "iict-6", topic: "t4-networks",
      q: "A company has offices in Pune and Singapore. Each office has its own network; the two are joined so staff can share files, and visitors in the Pune office connect their laptops without cables. (a) Name the type of network within one office, the type of network joining the two offices, and the type used by the visitors. (b) Describe two things a router does. [5]",
      model: "(a)\nWithin one office: a LAN (local area network) — it covers a single site or small geographical area.\nJoining Pune and Singapore: a WAN (wide area network) — it covers a large geographical area and uses third-party or public communication links.\nFor the visitors' laptops: a WLAN (wireless local area network) — a LAN in which devices connect through wireless access points instead of cabling.\n\n(b) Any two of:\n• It connects networks and devices to the internet.\n• It stores computer addresses.\n• It routes data packets to their correct destination.\n\nTrap: do not say a router 'connects computers together' — that is a switch or a hub. The router's distinguishing job is directing data BETWEEN networks.",
    },
    {
      id: "iict-7", topic: "t5-effects",
      q: "A data-entry clerk spends seven hours a day typing. Identify two health problems this could cause. For each, give the cause and one strategy that would prevent it. [6]",
      model: "Problem 1: repetitive strain injury (RSI) in the wrists and fingers.\nCause: the same small movements — typing and clicking — repeated continuously for long periods, often with the wrists unsupported and bent.\nPrevention: use a wrist rest and an ergonomic keyboard so the wrists stay straight, and take regular short breaks to change the movement.\n\nProblem 2: back and neck problems.\nCause: sitting in a poor posture for hours, with the screen too low or the chair at the wrong height.\nPrevention: use an adjustable chair with proper back support and a footrest, and set the monitor so the top of the screen is at eye level.\n\n(Eye strain and headaches would also earn marks: caused by staring at a bright screen and by glare, prevented by an anti-glare screen or blinds, regular breaks looking away from the screen, and regular eye tests.)\n\nThe marks are paired — a cause and a prevention that match. Listing four ailments with no causes earns a fraction of the marks.",
    },
    {
      id: "iict-8", topic: "t6-applications",
      q: "A mining company uses an expert system to advise on where to drill for minerals. (a) Name three components of an expert system and state what each does. (b) Describe how the system produces its advice. [6]",
      model: "(a) Any three of:\n• Knowledge base — the store of facts and data gathered from human experts in the field.\n• Rules base — the set of rules, in the form of conditions and conclusions, applied to those facts.\n• Inference engine — the part that reasons: it matches the answers given against the rules base and knowledge base to work towards a conclusion.\n• User interface — how the questions are put to the user and the results are displayed.\n• Explanation system — tells the user HOW the system reached its conclusion and how confident it is.\n\n(b) The user is asked a series of questions through the interface. Each answer is passed to the inference engine, which searches the knowledge base and applies the rules base to it. The answers given determine which questions follow, so the search narrows. The system then outputs the possible solutions — here, the probability of finding particular minerals at a given site — and the explanation system justifies that conclusion.",
    },
    {
      id: "iict-9", topic: "t7-life-cycle",
      q: "A hospital is replacing the computer system that holds all patient medication records. Which method of implementation is most appropriate, and why?",
      opts: [
        "Direct changeover, because it is the fastest and cheapest method",
        "Parallel running, because the old system remains available as a fallback if the new one fails",
        "Pilot running, because the whole hospital must switch at the same moment",
        "Phased implementation, because there is only one module in the system",
      ],
      a: "Parallel running, because the old system remains available as a fallback if the new one fails",
      model: "Parallel running means the old and new systems operate side by side on the same data for a period. Outputs can be compared to prove the new system is correct, and if it fails, the old system is still running — nothing is lost. With patient medication records, where an error could cause serious harm, that safety net outweighs the cost.\nThe cost is real and should be acknowledged: the work is duplicated, so more staff time is needed. Direct changeover has no fallback at all, which is exactly what a hospital cannot accept. The reasons attached to pilot running and phased implementation in the other options are false — pilot running deliberately does NOT switch everything at once, and a records system of this size has many modules.",
    },
    {
      id: "iict-10", topic: "t7-life-cycle",
      q: "A form records a student's age, which must be from 11 to 18 inclusive. Give one item of normal test data, one item of abnormal test data and one item of extreme test data, and state the expected outcome for each. Then name and describe two validation checks the field should use. [6]",
      model: "Normal data: 15. Expected outcome — accepted, because it lies within the permitted range.\nAbnormal data: 25 (or the word 'twelve', or a blank entry). Expected outcome — rejected, with an error message, because it is outside the range or of the wrong type.\nExtreme data: 11 (or 18). Expected outcome — ACCEPTED, because it is at the very limit of the permitted range and the limits are inclusive.\n\nValidation checks:\n• Range check — the value entered must lie between 11 and 18 inclusive; anything outside is rejected.\n• Type check — the entry must be numeric, so text such as 'twelve' is rejected.\n(A presence check would also be creditable: the field cannot be left blank.)\n\nThe usual error is treating extreme data as data that should be rejected. Extreme data is valid — it is the boundary value, and the test proves the boundary was coded inclusively.",
    },
    {
      id: "iict-11", topic: "t8-safety-security",
      q: "A user types their bank's web address correctly, but malicious code on their computer sends them to a convincing fake site, where they enter their login details. What is this called?",
      opts: ["Phishing", "Pharming", "Smishing", "Shoulder surfing"],
      a: "Pharming",
      model: "Pharming is the redirection of a user to a fraudulent website by malicious code, even though the address was typed correctly — the user has done nothing careless, which is what makes it dangerous.\nPhishing arrives as a fake EMAIL or link inviting the user to click. Smishing is the same trick delivered by SMS, and vishing by voice call or voicemail. Shoulder surfing is a card-fraud method: watching someone enter a PIN or password. Defences against pharming include up-to-date anti-malware, checking for HTTPS and a valid digital certificate before entering details.",
    },
    {
      id: "iict-12", topic: "t8-safety-security",
      q: "A school is writing an eSafety guide for students who use social media and online gaming. Describe four rules the guide should contain, giving a reason for each. [8]",
      model: "Social media:\n1. Know how to block and report unwanted users. Reason: it stops contact from someone who is harassing you and brings it to the platform's attention rather than leaving you to handle it alone.\n2. Never arrange to meet an online contact face to face. Reason: people online may not be who they claim to be, so meeting places you at real physical risk.\n3. Do not post or forward inappropriate images, and do not use inappropriate language. Reason: once posted, material can be copied and redistributed and cannot be recalled, and it can damage your reputation and others'.\n4. Respect the confidentiality of other people's personal data. Reason: sharing someone else's details without consent exposes them to identity theft or unwanted contact.\n\nOnline gaming:\n5. Never use your real name as a username, and never give out personal or financial data in a game or its chat. Reason: usernames and chat are public, and personal or card details given there can be used for fraud.\n\nEach mark needs a rule AND a reason. A list of four bare rules is worth half the marks.",
    },
    {
      id: "iict-13", topic: "t9-audience",
      q: "A charity is producing an information leaflet about hygiene for children aged 6 to 8. (a) Describe three design decisions that show a clear sense of this audience, justifying each. (b) The designer wants to use photographs found through an internet search. Explain the copyright issue and how it should be resolved. [7]",
      model: "(a) Any three, each with the audience reason attached:\n• A large point size in a plain sans-serif font — young readers are still developing reading fluency, and a plain letterform is easier to decode than a decorative serif.\n• Short sentences and simple, everyday vocabulary — the reading age of a 6- to 8-year-old is limited, so complex terms would not be understood.\n• A high proportion of pictures to text, with bright colours — images carry the meaning for readers who cannot yet read confidently, and colour holds their attention.\n• Plenty of white space and a small number of ideas per page — a dense page is overwhelming at this age.\n\n(b) Copyright issue: images found on the internet are the property of the person who created them and are protected by copyright. Copying them into a leaflet — even for a charity, even without charge — is using someone else's work without permission and breaks copyright legislation.\nResolution: obtain permission from the copyright holder, or pay the licence fee, or use images that are explicitly licensed for reuse, or commission or take the photographs yourself. Acknowledge the source where the licence requires it.",
    },
    {
      id: "iict-14", topic: "t10-communication",
      q: "A manager emails an announcement to 200 customers and wants none of them to see the other recipients' addresses. Which field should the addresses be placed in?",
      opts: ["To", "Cc", "Bcc", "Subject"],
      a: "Bcc",
      model: "Blind carbon copy sends a copy to each address without any recipient being able to see the others. That protects the customers' privacy, keeps their addresses from being harvested for spam, and avoids the reply-all storm that follows a 200-address Cc.\nAddresses in To and in Cc are visible to every recipient — the difference between them is only that To marks the main recipient and Cc marks people being kept informed. The Subject field is not an address field at all.",
    },
    // ---------- Papers 2 & 3: shared practical skills ----------
    {
      id: "iict-15", topic: "p15-proofing",
      q: "A clerk types a delivery address from a paper form into a database. Explain the difference between validation and verification of this data, and explain why a system that uses only one of them is inadequate. Give one method of each. [6]",
      model: "Validation is an automatic check performed by the COMPUTER that the data entered is sensible and of the right form. Method: a format check on the postcode, so an entry that does not match the required pattern of letters and digits is rejected. (A presence check, length check, range check, type check or character check would equally do.)\n\nVerification is a check that the data entered MATCHES THE SOURCE it was copied from. Method: visual checking — the clerk compares what is on screen against the paper form. (Double data entry, where the data is typed twice and the computer compares the two versions, is the other method.)\n\nWhy both are needed: validation cannot tell whether the data is TRUE. A postcode belonging to a different customer is perfectly well formed, so it passes every validation check. Verification catches that, because it compares against the source. Conversely, verification cannot tell whether the value was reasonable in the first place — if the paper form itself contains an impossible date, faithfully copying it twice reproduces the error. Together they catch both classes of mistake.",
    },
    {
      id: "iict-16", topic: "p16-graphs-charts",
      q: "A task says: 'Create a pie chart showing the percentage of total sales taken by each of the six regions. Label each sector with its region name and its percentage to one decimal place. Do not display a legend. Extract the sector for the largest region.' List the steps and state the trap in each instruction. [6]",
      model: "1. Select the data: highlight the region-name column and the sales-total column. These are usually NOT next to each other, so select the first block, hold the modifier key and select the second — a non-contiguous selection. Trap: dragging across everything in between drags in columns the chart must not show.\n\n2. Insert a pie chart. Trap: a pie is only valid because the task is about parts of one whole; if it had asked to compare regions across two years, a bar chart would be required.\n\n3. Add sector labels showing the category name, and add percentages formatted to one decimal place. Trap: 'sector labels' and 'sector values' are different things — labels are the names, values are the numbers. Read which the task names, and set the decimal places exactly as specified.\n\n4. Delete the legend. Trap: most software adds one automatically. If the task says not to display one, an unwanted legend loses the mark — and once the sectors are labelled, the legend is redundant anyway.\n\n5. Extract (explode) the sector belonging to the region with the highest value. Trap: click once to select the whole series, then again to select only that single sector before dragging it out, or every sector separates.\n\n6. Add the chart title exactly as worded in the task, and add your name, centre number and candidate number electronically before printing.",
    },
    // ---------- Paper 2: document production, databases, presentations ----------
    {
      id: "iict-17", topic: "p17-document-production",
      q: "A three-page report must show, at the bottom of every page, the file name and path, the page number in the form 'Page 2 of 3', and the date the report was printed. It must also be printed double-sided and bound. Describe how to set this up, and explain what a gutter margin is for. [6]",
      model: "Setup:\n1. Open the FOOTER (not the body of the page) — anything placed there repeats automatically on every page, which is what 'on every page' requires.\n2. Insert the file information field, so the file name and path appear and update themselves if the file is renamed.\n3. Type the word 'Page', insert the automated page-number field, type 'of', and insert the automated total-number-of-pages field. Typing 1, 2, 3 by hand does not earn the mark and breaks as soon as a page is added.\n4. Insert the automated date field so it shows the date of printing rather than a date typed once.\n5. Align the footer contents consistently — to the left margin, right margin or centred within the margins, as the task specifies — and keep the alignment the same on every page.\n\nGutter margin: extra space added to the binding edge of the page, on top of the normal margin. Its purpose is to stop text disappearing into the fold or being obscured by the binding when the document is bound. On a double-sided document the gutter alternates edges so it always falls on the inside.",
    },
    {
      id: "iict-18", topic: "p18-databases",
      q: "A sports club database will store: Membership_Number (in the form MB0147), Date_Joined, Annual_Fee in rupees, Has_Paid, and Mobile_Number. For each field, state the data type you would set and justify your choice. [6]",
      model: "Membership_Number — TEXT (alphanumeric). It contains letters as well as digits, is never calculated with, and a numeric type would strip the leading zeros in 0147. This field is also the obvious primary key, since it uniquely identifies each member.\n\nDate_Joined — DATE/TIME. It allows the display format to be set (for example dd/mm/yyyy), lets the database sort members chronologically, and allows date arithmetic such as calculating length of membership.\n\nAnnual_Fee — NUMERIC, currency sub-type, set to 2 decimal places. It is used in calculations such as total income, and the currency sub-type displays the rupee symbol without it having to be typed into every record.\n\nHas_Paid — BOOLEAN/LOGICAL. There are only two possible states, so a Boolean field displayed as yes/no, true/false or a checkbox stores it in the least space, prevents inconsistent entries such as 'Y', 'yes' and 'paid', and makes querying unpaid members straightforward.\n\nMobile_Number — TEXT. It is never calculated with, it may begin with a zero or a + country code, and it may contain spaces — all of which a numeric field would destroy.\n\nThe justification carries the marks. 'Text, because it is text' scores nothing; name the property of the data that forces the choice.",
    },
    {
      id: "iict-19", topic: "p18-databases",
      q: "A relational database has a CUSTOMERS table and an ORDERS table. Customer_ID is the primary key of CUSTOMERS and also appears in ORDERS. Which statement is correct?",
      opts: [
        "Customer_ID in ORDERS is a second primary key, so orders cannot be duplicated",
        "Customer_ID in ORDERS is a foreign key, and it creates the relationship between the two tables",
        "Customer_ID in ORDERS makes the database a flat file, because the field appears twice",
        "Customer_ID must be removed from ORDERS to avoid storing the same data twice",
      ],
      a: "Customer_ID in ORDERS is a foreign key, and it creates the relationship between the two tables",
      model: "A foreign key is a field in one table that holds the primary key value of another table. It is exactly what links ORDERS to CUSTOMERS, so one customer's details are stored once but can be attached to any number of orders.\nIt is not a primary key in ORDERS: the same customer places many orders, so the value repeats, whereas a primary key must be unique. Nothing here makes the database a flat file — a flat file is a SINGLE table, and it is the flat-file design that would force the customer's name and address to be retyped on every order. Removing the field would break the link entirely and there would be no way to tell whose order it was.",
    },
    {
      id: "iict-20", topic: "p19-presentations",
      q: "A task requires a 12-slide presentation in which every slide carries the company logo in the top right, the company name in the footer, an automated slide number, and the same heading font and background colour. It must run unattended on a screen in a reception area. Describe how to do this efficiently, and state the two things that are wrong with formatting each slide by hand. [6]",
      model: "Method — do it once on the MASTER SLIDE:\n1. Open the master slide view.\n2. Place the logo in the top right of the master, positioned precisely; it then appears in the same place on all 12 slides.\n3. Add the company name to the master's footer placeholder.\n4. Insert the automated slide-number field on the master, so each slide numbers itself and renumbers if slides are moved, inserted or deleted.\n5. Format the master's heading and subheading placeholders with the required font, size and colour, and set the background colour on the master.\n6. Apply consistent transitions between slides and consistent animation effects, and add any alternative text required.\n7. Set the output to a looped on-screen carousel with automatic timings, since it must run unattended with nobody to advance it.\n\nWhat is wrong with formatting each slide by hand:\n• It is inconsistent — 12 hand-placed logos will not align identically, and hand-typed numbers become wrong the moment a slide is inserted or moved.\n• It is inefficient and unmaintainable — a single change to the house style means editing all 12 slides again, whereas one edit to the master updates everything.",
    },
    // ---------- Paper 3: spreadsheets and website authoring ----------
    {
      id: "iict-21", topic: "p20-spreadsheets",
      q: "In a spreadsheet, column D holds each student's total mark out of 80 (rows 4 to 43). A student passes with 40 or more. In cell E4, write a single formula that displays Pass or Fail, and that can be replicated down to E43. Then explain what would go wrong if the pass mark were typed into cell H1 and the formula referred to H1 without dollar signs. [5]",
      model: "Formula in E4:\n=IF(D4>=40,\"Pass\",\"Fail\")\n\nWhy it replicates correctly: D4 is a relative reference, so copying the formula down to E5, E6 and so on shifts it to D5, D6 and so on automatically — which is exactly what is wanted, because each row must test its own student's mark. The two text results are in quotation marks; without them the software looks for cells or ranges named Pass and Fail.\n\nIf the pass mark sat in H1 and the formula were =IF(D4>=H1,\"Pass\",\"Fail\"):\nH1 is a relative reference too, so replicating down changes it to H2, H3, H4 … Those cells are empty, so from row 5 onwards the formula compares each mark against nothing (treated as zero) and every remaining student is marked Pass. The result looks plausible, which is why this error survives to the printout.\n\nThe fix is to make the reference absolute — =IF(D4>=$H$1,\"Pass\",\"Fail\") — or to name cell H1 (for example PassMark) and write =IF(D4>=PassMark,\"Pass\",\"Fail\"), since a named cell behaves absolutely.",
    },
    {
      id: "iict-22", topic: "p20-spreadsheets",
      q: "A worksheet has a lookup table in cells A2:C9 of a sheet named Rates: column A holds the product code, column B the product name and column C the unit price. On the order sheet, cell B5 holds a product code. In cell C5, write a formula that displays the matching unit price, and that will still work when replicated down to C60. State two things that would break it. [5]",
      model: "Formula in C5:\n=VLOOKUP(B5,Rates!$A$2:$C$9,3,FALSE)\n\nReading it: look up the value in B5 in the FIRST column of the range A2:C9 on the Rates sheet, and return the entry from the third column of that range — the unit price. FALSE (0 also works) demands an exact match rather than the nearest one below.\n\nB5 is relative, so it steps down to B6, B7 … as the formula is replicated — correct, because each row looks up its own code. The table range is ABSOLUTE, so it stays anchored on A2:C9 for every row.\n\nTwo things that would break it:\n1. Writing the table range without dollar signs. Replicating down would slide it to A3:C10, A4:C11 and so on, so rows near the bottom would be searching a range that no longer contains the whole table — some lookups would fail and others would return the wrong price.\n2. Counting the column index from the wrong place. The index is counted from the FIRST column of the range you supplied, not from column A of the sheet and not from the column next to the lookup. Here column 1 is the code, 2 is the name, 3 is the price — so 3 is correct and 2 would return the product name.\n\n(Omitting FALSE is a third real risk: with an unsorted code list, an approximate match can return a neighbouring product's price. A named range in place of Rates!$A$2:$C$9 is also fully acceptable and is easier to read on a formulae printout.)",
    },
    {
      id: "iict-23", topic: "p20-spreadsheets",
      q: "Cell F4 contains =C4*$G$1 and is replicated into F5. What will cell F5 contain?",
      opts: ["=C4*$G$1", "=C5*$G$1", "=C5*$G$2", "=C4*$G$2"],
      a: "=C5*$G$1",
      model: "C4 has no dollar signs, so it is a relative reference: copying the formula down one row moves it down one row, to C5. $G$1 has a dollar sign on both the column letter and the row number, so it is absolute and does not move at all.\nThe result is =C5*$G$1 — each row multiplies its own value by the one shared rate in G1, which is exactly why the rate cell was locked. Option 1 would be the result if C4 had been written $C$4; options 3 and 4 would need the dollar signs to be absent from G1, which is the error that quietly wrecks a whole column.",
    },
    {
      id: "iict-24", topic: "p21-website-authoring",
      q: "You are building a page saved as index.htm. It must display 'Pune Book Fair' in the browser tab, be formatted by an external stylesheet saved as styles.css in a subfolder called css, declare the author, and contain a link that opens the fair's programme page (programme.htm, saved in the same folder) in a new window. Write the head section and the hyperlink, and explain why the stylesheet must be attached with a relative path. [6]",
      model: "Head section:\n<head>\n<title>Pune Book Fair</title>\n<meta charset=\"utf-8\">\n<meta name=\"author\" content=\"Your Name\">\n<link rel=\"stylesheet\" href=\"css/styles.css\">\n</head>\n\nThe title tag — not a heading in the body — is what displays in the browser tab. The metatag with the name attribute 'author' and its content attribute declares the author; the charset metatag declares the character encoding.\n\nHyperlink, placed in the body:\n<a href=\"programme.htm\" target=\"_blank\">Programme</a>\n\nBecause programme.htm sits in the same folder as index.htm, the file name alone is the whole relative path. The target attribute set to _blank opens it in a new window; _self would open it in the same window, and a name in place of _blank would open it in a window of that name.\n\nWhy the stylesheet path must be relative: a relative path locates the file from the position of the page that is asking for it, so css/styles.css keeps working wherever the whole folder structure is copied — onto a web server, onto a marker's machine, onto another drive. An absolute path records the full location on one particular computer; the moment the site is moved, that folder does not exist and the stylesheet is not found, so the page loads completely unstyled. The same reasoning applies to hyperlinks and images pointing at locally saved files.",
    },
  ],

  mistakes: [
    { mistake: "Using validation and verification as if they meant the same thing — writing 'verification checks the data is in the right range'.", fix: "Validation = the COMPUTER checks the data is sensible and correctly formed (range, type, length, format, presence, character). Verification = a check that the data MATCHES THE SOURCE, and there are only two methods: visual checking and double data entry. Learn the two lists separately." },
    { mistake: "Giving a benefit when the question asks for a feature or characteristic — 'a feature of a switch is that it is more secure'.", fix: "A feature is what the thing IS or DOES; a benefit is what the user gains. State the feature first, then, only if asked, the benefit: 'a switch sends data only to the addressed device (feature), so other users cannot see it (benefit)'." },
    { mistake: "Naming a software package or a hardware brand in an answer.", fix: "The syllabus states outright that no marks are awarded for brand names. Write the generic technical term every time: spreadsheet software, database management software, presentation software, laser printer, solid-state drive." },
    { mistake: "Answering with a vague noun where the mark scheme wants a named device or function — 'a printer', 'a scanner-type thing', 'a lookup'.", fix: "Name it exactly and to the level the scenario needs: not 'a printer' but 'a dot matrix printer'; not 'a reader' but 'an optical mark reader'; not 'a lookup' but 'VLOOKUP with an exact match'." },
    { mistake: "Replicating a formula that refers to a single shared cell without locking it, so the reference slides down the sheet.", fix: "Before you copy, ask of every reference: should this move with the row? If not, put dollar signs on both parts ($H$1) or use a named cell. The symptom is subtle — the top rows are right and the rest are quietly wrong." },
    { mistake: "Getting the VLOOKUP column index wrong, or leaving out the exact-match argument.", fix: "The index counts from the first column of the range YOU supplied, not from column A of the sheet. Count it on the printout before you type it. End the function with FALSE (or 0) so it will not return the nearest lower match." },
    { mistake: "Typing values into a formula instead of referring to cells — writing =450*0.18 rather than =C4*$G$1.", fix: "Formulae must use cell references so the model recalculates when the data changes; that is the whole point of a spreadsheet, and the formulae printout is where the examiner sees it. Never hard-code a number that appears somewhere on the sheet." },
    { mistake: "Printing a spreadsheet without showing the formulae, or with columns too narrow so cells show ##### or truncated labels.", fix: "Read the task: if it asks for a formulae printout, switch the display to formulae and widen every column until the full formula is visible. Check the print preview before printing, and set the print area, orientation and page count as instructed." },
    { mistake: "Forgetting to enter name, centre number and candidate number electronically on every practical printout.", fix: "Put them in a header or footer on the document, in the master slide footer for a presentation, in the report footer for a database report, and on the page for a web page — typed in, never handwritten. Unidentifiable evidence cannot be credited." },
    { mistake: "Confusing hub, switch, bridge and router, or describing a router as 'something that connects computers together'.", fix: "One sentence each: NIC connects a device to the network; hub broadcasts to all devices; switch sends only to the addressed device; bridge joins two networks or segments; router connects networks to the internet, stores addresses and routes packets." },
    { mistake: "Choosing text for a field that must be calculated with, or numeric for a phone number or ID code.", fix: "Ask two questions: will it ever be calculated with, and does it contain non-digits or a meaningful leading zero? Calculations mean numeric (with currency, decimal-place or percentage sub-type). Letters, spaces, + signs or leading zeros mean text. Two states mean Boolean." },
    { mistake: "Giving a generic answer that ignores the scenario — 'it is faster and cheaper' with no reference to the hospital, school or shop in the question.", fix: "Every 0417 theory question is set in a context on purpose. Name the context in your answer: 'a nurse can retrieve a patient's medication history in seconds during an emergency', not 'it is quick'. Apply, don't recite." },
  ],

  cheat: [
    {
      heading: "The three papers — and where the marks really are",
      bullets: [
        "Paper 1 Theory — written, 1 h 30 min, 80 marks, 40%. Multiple-choice, short-answer and structured questions, set on sections 1–21, all compulsory.",
        "Paper 2 Document Production, Databases and Presentations — practical, 2 h 15 min, 70 marks, 30%. Sections 17, 18 and 19, plus the skills of sections 11–16.",
        "Paper 3 Spreadsheets and Website Authoring — practical, 2 h 15 min, 70 marks, 30%. Sections 20 and 21, plus the skills of sections 11–16.",
        "The two practical papers are 60% of the grade between them. Revise them at least as hard as the theory.",
        "Paper 1 can examine sections 11–21 too — the 'know and understand' rows of the practical sections (file formats, house style, validation, primary keys, relative paths, the three web layers) are theory questions waiting to happen.",
        "In Papers 2 and 3 you have no internet and no email; source files are supplied. Work through each task's steps IN ORDER, and screenshot into the Evidence Document when prompted.",
      ],
    },
    {
      heading: "Spreadsheet functions — exact syntax",
      bullets: [
        "=IF(condition, value_if_true, value_if_false) — text results in quotation marks: =IF(D4>=40,\"Pass\",\"Fail\"). Nest a second IF in the false slot for three or more bands.",
        "=VLOOKUP(value, table_range, column_number, FALSE) — searches the FIRST column of the range; the column number counts from that range's first column; FALSE forces an exact match.",
        "=HLOOKUP(value, table_range, row_number, FALSE) — the same, searching along the first ROW. =XLOOKUP(value, lookup_range, return_range) — give the two ranges directly, no index to miscount.",
        "=SUM(B4:B20) · =AVERAGE(B4:B20) · =MAX(B4:B20) · =MIN(B4:B20) — always a range, never a typed list.",
        "Counting: =COUNT(range) counts numbers only · =COUNTA(range) counts non-empty cells · =COUNTIF(range,\"Pune\") counts those meeting a condition · =SUMIF(criteria_range,\"Pune\",sum_range) adds those meeting a condition. (The syllabus lists 'counting' generically; COUNTIF and SUMIF are the forms the practical papers habitually want.)",
        "=ROUND(B4,2) rounds to 2 decimal places · =INT(B4) chops the decimal off entirely, so 7.9 becomes 7.",
        "Order of operations: indices, then multiply/divide, then add/subtract — use brackets to force anything else, e.g. =(B4+C4)/2.",
      ],
    },
    {
      heading: "Absolute vs relative referencing — the $ decision",
      bullets: [
        "B4 — relative. Both the column and the row shift as the formula is replicated. Use it for the cell on this row.",
        "$B$4 — absolute. Neither shifts. Use it for a single shared value: a tax rate, a pass mark, a lookup table.",
        "$B4 — column locked, row free. B$4 — row locked, column free. Use these when replicating both across and down.",
        "A named cell or named range behaves absolutely, and it reads far better on a formulae printout: =D4*VATrate.",
        "Test before you copy: replicate one row down and look at what the reference became. Wrong dollar signs give plausible-looking numbers, which is why the error survives to the printout.",
        "Lookup table ranges are ALWAYS absolute (or named). This single habit rescues most of the VLOOKUP marks.",
      ],
    },
    {
      heading: "HTML quick reference",
      bullets: [
        "Skeleton: <html> … <head> … </head> <body> … </body> </html>. Head holds information ABOUT the page; body holds what is displayed.",
        "Head: <title>Text in the browser tab</title> · <meta charset=\"utf-8\"> · <meta name=\"description\" content=\"…\"> · also name=\"keywords\", name=\"author\", name=\"viewport\" · <link rel=\"stylesheet\" href=\"css/styles.css\"> using a RELATIVE path.",
        "Tables: <table> · <tr> row · <th> header cell · <td> data cell. Span with colspan=\"2\" or rowspan=\"3\"; size with width=\"600\" (pixels) or width=\"100%\".",
        "Hyperlinks: <a href=\"page2.htm\">…</a> local page · <a href=\"#top\">…</a> bookmark on this page · <a href=\"https://…\">…</a> website · <a href=\"mailto:info@site.com\">…</a> email · add target=\"_blank\" for a new window, target=\"_self\" for the same one.",
        "Bookmark: give the destination element an id, e.g. <h2 id=\"top\">, then link to #top. Images: <img src=\"logo.jpg\" alt=\"Fair logo\" width=\"200\">. Video: <video src=\"clip.mp4\" controls></video> — or autoplay, or omit controls, as specified.",
        "Structure and text: <div class=\"banner\"> to group and style a block · pre-defined tags h1, h2, h3, p, li · ordered list <ol>, unordered list <ul>.",
        "Relative paths only for locally saved pages, images and stylesheets — an absolute path names one folder on one machine and breaks as soon as the site moves.",
      ],
    },
    {
      heading: "CSS quick reference",
      bullets: [
        "Rule shape: selector { property: value; property: value; } — every declaration ends with a semicolon, the block is wrapped in braces.",
        "Tag style (applies to every element of that type): h1 { font-family: Arial, sans-serif; font-size: 36px; color: #000080; text-align: center; }",
        "Class (applies only where you write class=\"…\" ): .warning { background-color: #FF0000; color: #FFFFFF; } — the full stop before the name is what makes it a class.",
        "Background and font: background-color, background-image, font-family, font-size, color, text-align, font-weight: bold, font-style: italic.",
        "Tables: table, th, td { border: 2px solid #000000; border-collapse: collapse; padding: 5px; vertical-align: top; } — collapse joins the double borders into one.",
        "Comment: /* this is a comment */ — used to record the author and purpose at the top of the stylesheet. Save the file in cascading stylesheet format, with the .css extension.",
        "Hierarchy: an inline style attribute beats an attached stylesheet; where several stylesheets are attached, the one attached LAST wins for rules of equal specificity.",
        "Style vs class: a style is applied automatically to every element of that tag; a class is applied only to the elements you name it on.",
      ],
    },
    {
      heading: "Databases — structure, queries, reports",
      bullets: [
        "Data types: text/alphanumeric · numeric (integer, decimal, currency; sub-types for percentage and decimal places) · date/time · Boolean/logical (yes/no, true/false, checkbox).",
        "Text for anything with letters, spaces, + signs or a meaningful leading zero and never calculated with — phone numbers, postcodes, ID codes. Numeric only for what you calculate with.",
        "Primary key uniquely identifies each record. Foreign key is a field holding another table's primary key value — it makes the relationship.",
        "Flat file = one table, simple but repeats data. Relational = linked tables, no duplication, consistent updates.",
        "Query operators: AND (narrows) · OR (widens) · NOT · LIKE · > < = >= <= <> · wildcards for unknown characters. Sort on one criterion or several, ascending or descending.",
        "Report headers: REPORT header prints once at the start; PAGE header prints on every page. Same for the two footers. Show all data and labels in full — nothing truncated. Right-align numbers and align on the decimal point.",
      ],
    },
    {
      heading: "Networks and security — one line each",
      bullets: [
        "NIC connects a device to the network · hub broadcasts to all · switch sends only to the addressed device · bridge joins two networks or segments · router connects networks to the internet, stores addresses, routes packets.",
        "LAN one site · WLAN a LAN using wireless access points · WAN large area over third-party links. Internet public · intranet private and internal · extranet an intranet opened to specified outsiders.",
        "Bluetooth: short range, slower, few devices, direct pairing. Wi-Fi: longer range, faster, many devices, via an access point.",
        "Phishing = fake email · pharming = redirect to a fake site by malicious code · smishing = by SMS · vishing = by voice call. Card fraud = shoulder surfing, card cloning, key logging.",
        "Firewall filters traffic in and out of the network · SSL encrypts the link between server and client · encryption scrambles the data so intercepted data is meaningless · two-factor authentication adds something you HAVE to something you KNOW · digital certificate proves a site is who it claims to be.",
        "eSafety: block and report · never meet an online contact · no inappropriate images or language · respect others' data · no real name and no personal or financial data in online gaming.",
      ],
    },
    {
      heading: "Validation, verification and the systems life cycle",
      bullets: [
        "Validation (computer checks it is sensible): range · type · length · format · presence · character · check digit.",
        "Verification (checks it matches the source): visual checking, or double data entry. Only these two.",
        "Test data: NORMAL is inside the range and accepted · ABNORMAL is invalid and rejected · EXTREME sits exactly on the boundary and is ACCEPTED. Live data comes last.",
        "Analysis research methods: observation · interviews · questionnaires · examination of existing documents.",
        "Implementation: direct changeover (fast, cheap, no fallback) · parallel running (safe fallback, costly, duplicated) · pilot running (one branch first) · phased (one module at a time).",
        "Documentation: technical for the maintenance programmer (program listing, flowcharts, file structures, variables, validation routines); user for the end user (how to install, save, print, add and delete records, error messages, troubleshooting, FAQs, glossary).",
      ],
    },
    {
      heading: "Exam-day moves",
      bullets: [
        "Paper 1: read the command word. State/Give = a bare fact, no explanation. Describe = characteristics and main features. Explain = say WHY, with a reason. Compare = similarities and/or differences. Justify = support the choice with evidence.",
        "Count the marks and give that many distinct points. Two halves of the same point ('it is fast' and 'it is not slow') score once.",
        "Never write a brand name; never answer outside the scenario you were given.",
        "Papers 2 & 3: name, centre number and candidate number entered ELECTRONICALLY on every printout, before printing.",
        "Papers 2 & 3: work through the task steps in order, save with the exact file name given, and screenshot into the Evidence Document at every point you are prompted to.",
        "Before printing a spreadsheet: correct print orientation, correct number of pages, columns wide enough that nothing is cut off, and formulae shown if the task asks for a formulae printout.",
        "Before submitting a web page: print BOTH the browser view and the HTML view when both are asked for, and check every hyperlink and the attached stylesheet still work from a relative path.",
        "Deliberately omitted from this pack: grade boundaries, per-task mark tallies, and any claim that COUNTIF or SUMIF is named in the syllabus (the syllabus says 'counting'). Check your own copy of the 0417 syllabus before quoting any figure that is not listed at the top of this file.",
      ],
    },
  ],
};
