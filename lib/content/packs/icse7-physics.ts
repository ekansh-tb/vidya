// ICSE Class 7 Physics — Selina Concise, 7 chapters
// Verified May 2026 against icsesolutions, knowledgeboat.

import type { ExamPack } from "../exam-pack";

export const ICSE7_PHYSICS: ExamPack = {
  subjectId: "icse-physics",
  grade: 7,
  title: "Physics — Class 7 ICSE",
  context: "Selina Concise · 7 chapters · Wisdom World School Hadapsar",
  highlights: [
    { label: "Textbook", value: "Selina Concise Physics 7" },
    { label: "Chapters", value: "7" },
  ],
  reference: { label: "Selina Physics 7 (Shaalaa)", url: "https://www.shaalaa.com/textbook-solutions/selina-solutions-concise-physics-class-7-icse_41" },
  plan: [
    { title: "Walk the 7 chapters", hint: "Mark weak chapters" },
    { title: "20 must-know definitions", hint: "Flip the flashcards" },
    { title: "Practice questions", hint: "Mix of MCQ + short answer" },
    { title: "Common mistakes", hint: "Where students lose marks" },
    { title: "Exam-day cheat sheet", hint: "Read morning of test" },
  ],
  topics: [
    {
      id: "1-measure", num: 1, title: "Physical Quantities & Measurement",
      blurb: "SI units, area, volume, density, time.",
      syllabus: [
        "Physical quantity: numerical value + unit.",
        "Fundamental units (length m, mass kg, time s) vs derived units.",
        "Area = length × breadth; volume of cube = side³; cuboid = l×b×h; cylinder = πr²h.",
        "Volume by displacement (measuring cylinder).",
        "Density = mass / volume; units: g/cm³ or kg/m³. Float vs sink.",
        "Speed = distance / time; units: m/s, km/h.",
      ],
    },
    {
      id: "2-motion", num: 2, title: "Motion",
      blurb: "Rest, motion, types of motion, speed.",
      syllabus: [
        "Rest & motion are relative.",
        "Types: rectilinear (straight line), circular, oscillatory (to-fro), rotational, periodic.",
        "Uniform vs non-uniform motion.",
        "Distance vs displacement.",
        "Speed = distance ÷ time. Average speed = total dist ÷ total time.",
      ],
    },
    {
      id: "3-energy", num: 3, title: "Energy",
      blurb: "Forms, conversion, conservation.",
      syllabus: [
        "Energy = capacity to do work; unit Joule (J).",
        "Forms: mechanical (kinetic + potential), heat, light, sound, electrical, magnetic, chemical, nuclear, solar.",
        "Kinetic energy = ½ × m × v²; potential energy = m × g × h.",
        "Law of conservation: energy cannot be created or destroyed, only changed.",
        "Examples of conversions: hydroelectric (PE→KE→electrical), solar cell, dynamo.",
      ],
    },
    {
      id: "4-light", num: 4, title: "Light Energy",
      blurb: "Reflection, plane mirrors, refraction (intro).",
      syllabus: [
        "Luminous vs non-luminous; transparent / translucent / opaque.",
        "Reflection laws: (1) angle of incidence = angle of reflection (2) incident ray, reflected ray, normal lie in the same plane.",
        "Image in a plane mirror: virtual, erect, same size, laterally inverted, behind the mirror at equal distance.",
        "Regular vs diffused reflection.",
        "Refraction: bending of light when it passes from one medium to another (rarer ↔ denser).",
      ],
    },
    {
      id: "5-heat", num: 5, title: "Heat",
      blurb: "Temperature, thermometers, expansion.",
      syllabus: [
        "Heat is a form of energy. Temperature is degree of hotness (°C, K).",
        "Clinical (35°C–42°C, with kink) vs laboratory (−10°C to 110°C) thermometer.",
        "Conversion: K = °C + 273; °F = (9/5)°C + 32.",
        "Expansion: solids < liquids < gases. Anomalous expansion of water (4 °C is densest).",
        "Modes of heat transfer: conduction (solids), convection (fluids), radiation (no medium).",
      ],
    },
    {
      id: "6-sound", num: 6, title: "Sound",
      blurb: "Vibrations, propagation, pitch, loudness.",
      syllabus: [
        "Sound is produced by vibrations of objects.",
        "Sound needs a medium (solid, liquid, gas) — cannot travel through vacuum.",
        "Speed in air ≈ 332 m/s at 0 °C.",
        "Pitch depends on frequency (Hz); loudness depends on amplitude.",
        "Audible range for humans: 20 Hz to 20,000 Hz.",
        "Echo — reflected sound (needs ≥17 m distance at 0 °C for distinct echo).",
      ],
    },
    {
      id: "7-electricity", num: 7, title: "Electricity & Magnetism",
      blurb: "Cells, circuits, conductors, magnetism, electromagnet.",
      syllabus: [
        "Electric current = flow of charge. Cell (one) vs battery (cells joined).",
        "Conductors (metals, graphite) vs insulators (rubber, wood, plastic).",
        "Open vs closed circuit; switch as a make-or-break device.",
        "Magnetic poles always come in pairs (N and S). Like poles repel; unlike attract.",
        "Electromagnet — soft iron core wound with insulated wire; strength increases with current and turns; magnetism vanishes when current is switched off.",
      ],
    },
  ],

  flashcards: [
    { term: "Physical quantity", def: "Any quantity that can be measured; expressed as a number with a unit." },
    { term: "SI units", def: "International System of units — length (metre), mass (kilogram), time (second)." },
    { term: "Density", def: "Mass per unit volume; ρ = m/V. Units: g/cm³ or kg/m³." },
    { term: "Rectilinear motion", def: "Motion along a straight line." },
    { term: "Periodic motion", def: "Motion that repeats at equal intervals of time, e.g. pendulum." },
    { term: "Energy", def: "Capacity to do work; SI unit is the joule (J)." },
    { term: "Kinetic energy", def: "Energy of motion; KE = ½ m v²." },
    { term: "Potential energy", def: "Energy of position; PE = m g h." },
    { term: "Law of conservation of energy", def: "Energy can neither be created nor destroyed, only changed from one form to another." },
    { term: "Reflection of light", def: "Bouncing back of light from a polished surface; angle of incidence = angle of reflection." },
    { term: "Lateral inversion", def: "Left of object appears as right of image in a plane mirror (and vice versa)." },
    { term: "Refraction", def: "Bending of light as it passes from one transparent medium to another." },
    { term: "Heat", def: "A form of energy that flows from a hotter to a colder body." },
    { term: "Temperature", def: "Degree of hotness or coldness of a body, measured in °C or K." },
    { term: "Conduction", def: "Transfer of heat through a solid without bulk movement of particles." },
    { term: "Convection", def: "Transfer of heat through a fluid by actual movement of heated particles." },
    { term: "Radiation", def: "Transfer of heat as electromagnetic waves; needs no medium." },
    { term: "Pitch", def: "How shrill or deep a sound is; depends on frequency." },
    { term: "Loudness", def: "How strong or faint a sound is; depends on amplitude of the vibration." },
    { term: "Echo", def: "Sound heard after reflection from a distant obstacle, at least about 17 m away." },
    { term: "Electromagnet", def: "A temporary magnet made by passing electric current through a coil wound on a soft iron core." },
  ],

  questions: [
    { id: "ip-1", topic: "1-measure", q: "Density of an object with mass 60 g and volume 20 cm³?", opts: ["1 g/cm³", "2 g/cm³", "3 g/cm³", "4 g/cm³"], a: "3 g/cm³", model: "ρ = m/V = 60/20 = 3 g/cm³." },
    { id: "ip-2", topic: "1-measure", q: "SI unit of length?", opts: ["centimetre", "millimetre", "metre", "kilometre"], a: "metre", model: "Metre (m) is the SI base unit of length." },
    { id: "ip-3", topic: "2-motion", q: "A car travels 120 km in 3 hours. Average speed?", opts: ["20 km/h", "30 km/h", "40 km/h", "60 km/h"], a: "40 km/h", model: "Speed = distance / time = 120 / 3 = 40 km/h." },
    { id: "ip-4", topic: "2-motion", q: "Motion of the hands of a clock is an example of?", opts: ["Rectilinear", "Circular", "Oscillatory", "Random"], a: "Circular", model: "Hands move along a circular path." },
    { id: "ip-5", topic: "3-energy", q: "Unit of energy in SI?", opts: ["Newton", "Watt", "Joule", "Pascal"], a: "Joule", model: "1 joule = work done by 1 newton over 1 metre." },
    { id: "ip-6", topic: "3-energy", q: "Energy of a moving object is called?", opts: ["Potential energy", "Kinetic energy", "Chemical energy", "Heat"], a: "Kinetic energy", model: "Energy due to motion = kinetic; due to position = potential." },
    { id: "ip-7", topic: "4-light", q: "An image in a plane mirror is?", opts: ["Real and inverted", "Virtual, erect, laterally inverted", "Real and erect", "Smaller than the object"], a: "Virtual, erect, laterally inverted", model: "Plane-mirror image: same size, erect, virtual, left-right swap." },
    { id: "ip-8", topic: "4-light", q: "First law of reflection states?", opts: ["i + r = 90°", "i = 2r", "i = r", "i = r + 90°"], a: "i = r", model: "Angle of incidence equals angle of reflection." },
    { id: "ip-9", topic: "5-heat", q: "Convert 100 °C to Kelvin.", opts: ["100 K", "173 K", "273 K", "373 K"], a: "373 K", model: "K = °C + 273 → 100 + 273 = 373 K." },
    { id: "ip-10", topic: "5-heat", q: "How does heat travel through a vacuum?", opts: ["Conduction", "Convection", "Radiation", "It cannot"], a: "Radiation", model: "Radiation needs no medium (e.g. Sun → Earth)." },
    { id: "ip-11", topic: "6-sound", q: "Sound cannot travel through?", opts: ["Air", "Water", "Steel", "Vacuum"], a: "Vacuum", model: "Sound needs a medium to propagate; vacuum has none." },
    { id: "ip-12", topic: "6-sound", q: "Human audible range?", opts: ["1–100 Hz", "20–20,000 Hz", "100–10,000 Hz", "above 20 kHz"], a: "20–20,000 Hz", model: "Below 20 Hz = infrasonic, above 20 kHz = ultrasonic." },
    { id: "ip-13", topic: "6-sound", q: "Pitch of a sound depends on?", opts: ["Amplitude", "Frequency", "Wavelength only", "Speed of light"], a: "Frequency", model: "High frequency → high pitch (shrill). Low → deep." },
    { id: "ip-14", topic: "7-electricity", q: "Which is a conductor?", opts: ["Rubber", "Wood", "Plastic", "Copper"], a: "Copper", model: "Metals (Cu, Al) conduct electricity; rubber/wood/plastic insulate." },
    { id: "ip-15", topic: "7-electricity", q: "Two like magnetic poles will?", opts: ["Attract", "Repel", "Stay neutral", "Stick together"], a: "Repel", model: "Like poles repel, unlike attract — fundamental rule of magnetism." },
    { id: "ip-16", topic: "7-electricity", q: "Best core material for a strong electromagnet?", opts: ["Hard steel", "Soft iron", "Copper", "Aluminium"], a: "Soft iron", model: "Soft iron magnetises and demagnetises easily — ideal for electromagnets." },
  ],

  mistakes: [
    { mistake: "Forgetting to write units after a numerical answer.", fix: "Always close the answer with its unit — m, kg, s, J, °C." },
    { mistake: "Confusing distance with displacement.", fix: "Distance = total path. Displacement = straight-line from start to end (with direction)." },
    { mistake: "Writing °C and K interchangeably.", fix: "Use the conversion: K = °C + 273. They are different scales." },
    { mistake: "Saying sound travels through vacuum.", fix: "Sound needs a medium. In vacuum, no particles vibrate, so no sound." },
    { mistake: "Mixing pitch and loudness.", fix: "Pitch ↔ frequency. Loudness ↔ amplitude. Two independent properties." },
    { mistake: "Using hard steel for an electromagnet.", fix: "Use soft iron — it magnetises/demagnetises easily. Hard steel makes a permanent magnet." },
  ],

  cheat: [
    {
      heading: "Formulas to know",
      bullets: [
        "Density ρ = m / V (units g/cm³ or kg/m³).",
        "Speed = distance / time. Average = total distance / total time.",
        "KE = ½ m v². PE = m g h.",
        "Volume cuboid = l × b × h; cylinder = πr²h.",
      ],
    },
    {
      heading: "Reflection rules",
      bullets: [
        "Angle of incidence = angle of reflection.",
        "Incident ray, normal, and reflected ray lie in the same plane.",
        "Plane-mirror image: same size, erect, virtual, laterally inverted, behind the mirror at equal distance.",
      ],
    },
    {
      heading: "Heat",
      bullets: [
        "K = °C + 273.",
        "Conduction (solids), convection (fluids), radiation (no medium needed).",
        "Solids expand the least, gases the most. Water anomalous at 0–4 °C.",
      ],
    },
    {
      heading: "Sound",
      bullets: [
        "Sound = mechanical wave; needs a medium.",
        "Speed in air ≈ 332 m/s.",
        "Pitch from frequency. Loudness from amplitude.",
        "Echo requires reflector ~17 m away (at 0 °C).",
      ],
    },
    {
      heading: "Electricity & magnetism",
      bullets: [
        "Conductors: metals + graphite. Insulators: rubber, plastic, wood, glass.",
        "Like poles repel, unlike attract.",
        "Electromagnet strength rises with current and with number of turns.",
      ],
    },
    {
      heading: "Exam moves",
      bullets: [
        "Label every diagram with arrows + names.",
        "State formula → substitute → final value + unit.",
        "Underline keywords in the question before answering.",
      ],
    },
  ],
};
