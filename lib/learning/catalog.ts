import type { LearningActivity } from "./activity";

/** Original bilingual starter collection. Review limitations are retained on each activity. */
export const ACTIVITY_CATALOG: LearningActivity[] = [
  {
    "id": "nursery-language-1",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "language",
    "title": {
      "en": "Picture partners",
      "hi": "चित्र के साथी"
    },
    "objective": {
      "en": "Name and match familiar objects.",
      "hi": "जानी-पहचानी चीज़ों के नाम बोलना और मिलाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Find the apple to match this apple: 🍎",
          "hi": "इस सेब का साथी ढूँढो: 🍎"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "apple"
      },
      {
        "instruction": {
          "en": "Find the ball to match this ball: ⚽",
          "hi": "इस गेंद का साथी ढूँढो: ⚽"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      }
    ],
    "offline": {
      "en": "Name three large objects in your room together.",
      "hi": "कमरे की तीन बड़ी चीज़ों के नाम साथ बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-language-2",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "language",
    "title": {
      "en": "Listen and find",
      "hi": "सुनो और ढूँढो"
    },
    "objective": {
      "en": "Connect spoken everyday words to pictures.",
      "hi": "रोज़ के बोले गए शब्दों को चित्रों से जोड़ना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Listen or read: cat. Find the cat.",
          "hi": "सुनो या पढ़ो: बिल्ली। बिल्ली ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      },
      {
        "instruction": {
          "en": "Listen or read: water. Find the water.",
          "hi": "सुनो या पढ़ो: पानी। पानी ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      }
    ],
    "offline": {
      "en": "Take turns naming a favourite toy without a screen.",
      "hi": "बिना स्क्रीन के बारी-बारी से पसंदीदा खिलौने का नाम बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-language-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "language",
    "title": {
      "en": "Rhyme time",
      "hi": "तुक का खेल"
    },
    "objective": {
      "en": "Notice endings in spoken words with adult help.",
      "hi": "बड़े की मदद से शब्दों के अंत की तुक सुनना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Say hat. Which word rhymes with hat: cat, tree, or ball?",
          "hi": "पानी बोलो। पानी से किसकी तुक मिलती है: नानी, घर या गेंद?"
        },
        "hint": {
          "en": "Say hat and cat slowly. Listen to the endings.",
          "hi": "पानी और नानी धीरे बोलो। अंत की आवाज़ सुनो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "rhyme"
      }
    ],
    "offline": {
      "en": "English: say sun and fun. Hindi: say राजा and बाजा. Enjoy the sounds together.",
      "hi": "हिंदी: राजा और बाजा बोलो। अंग्रेज़ी: sun और fun बोलो। साथ में आवाज़ों का आनंद लो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-language-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "language",
    "title": {
      "en": "Our plant story",
      "hi": "हमारे पौधे की कहानी"
    },
    "objective": {
      "en": "Put a simple pictured story in order with support.",
      "hi": "मदद से चित्रों की छोटी कहानी को क्रम में रखना।"
    },
    "interaction": "sequence",
    "steps": [
      {
        "instruction": {
          "en": "Our story starts with a little plant. Then we water it. Tap the pictures in that order.",
          "hi": "कहानी एक नन्हे पौधे से शुरू होती है। फिर हम उसे पानी देते हैं। चित्र इसी क्रम में चुनो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "seed",
            "picture": "🌱",
            "label": {
              "en": "Seedling",
              "hi": "नन्हा पौधा"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water the plant",
              "hi": "पौधे को पानी देना"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "seed|water"
      }
    ],
    "offline": {
      "en": "Tell a two-part story about something you did today.",
      "hi": "आज किए किसी काम की दो भागों वाली कहानी सुनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-language-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "language",
    "title": {
      "en": "Tell me about it",
      "hi": "इसके बारे में बताओ"
    },
    "objective": {
      "en": "Describe a picture in any words or gestures the child chooses.",
      "hi": "बच्चे के चुने शब्दों या इशारों से चित्र का वर्णन करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up something about it, or show with a gesture.",
          "hi": "एक चित्र चुनो। उसके बारे में अपने बड़े को कुछ बताओ या इशारा करो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Listen to each other describe a favourite thing. No recording needed.",
      "hi": "एक-दूसरे से पसंदीदा चीज़ का वर्णन सुनो। रिकॉर्डिंग की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-numeracy-1",
    "revision": 2,
    "placements": [
      "nursery"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Count the apples",
      "hi": "सेब गिनो"
    },
    "objective": {
      "en": "Count a set of 2 objects, touching each once.",
      "hi": "2 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "1",
              "hi": "1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "2",
              "hi": "2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3",
              "hi": "3"
            }
          }
        ],
        "feedback": {
          "en": "You counted 2 objects. You can count them again together.",
          "hi": "तुमने 2 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "2",
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-numeracy-2",
    "revision": 2,
    "placements": [
      "nursery"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Flower counter",
      "hi": "फूल गिनो"
    },
    "objective": {
      "en": "Count a set of 3 objects, touching each once.",
      "hi": "3 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "2",
              "hi": "2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3",
              "hi": "3"
            }
          },
          {
            "id": "4",
            "picture": "4",
            "label": {
              "en": "4",
              "hi": "4"
            }
          }
        ],
        "feedback": {
          "en": "You counted 3 objects. You can count them again together.",
          "hi": "तुमने 3 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "3",
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-numeracy-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Shape homes",
      "hi": "आकृतियों के घर"
    },
    "objective": {
      "en": "Match simple shapes by visible form.",
      "hi": "दिखने वाले आकार से सरल आकृतियाँ मिलाना।"
    },
    "interaction": "sorting",
    "steps": [
      {
        "instruction": {
          "en": "A round shape goes in the round home. Choose its home: 🔵",
          "hi": "गोल आकृति गोल घर में जाएगी। इसका घर चुनो: 🔵"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "round"
      },
      {
        "instruction": {
          "en": "A square goes in the square home. Choose its home: 🟦",
          "hi": "चौकोर आकृति चौकोर घर में जाएगी। इसका घर चुनो: 🟦"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "square"
      }
    ],
    "offline": {
      "en": "Look for round and square shapes at home without touching sharp objects.",
      "hi": "घर में बिना नुकीली चीज़ छुए गोल और चौकोर आकार खोजो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-numeracy-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Pattern train",
      "hi": "पैटर्न की रेल"
    },
    "objective": {
      "en": "Continue a repeating two-part visual pattern.",
      "hi": "दो हिस्सों का दोहराता चित्र पैटर्न आगे बढ़ाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "The train goes: 🍎 ⚽ 🍎 ⚽ 🍎 ... What comes next?",
          "hi": "रेल चलती है: 🍎 ⚽ 🍎 ⚽ 🍎 ... अब क्या आएगा?"
        },
        "hint": {
          "en": "Say apple, ball. Repeat those two words.",
          "hi": "सेब, गेंद बोलो। ये दो शब्द दोहराओ।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      }
    ],
    "offline": {
      "en": "Make an apple-ball pattern with drawings, then swap who continues it.",
      "hi": "सेब-गेंद के चित्रों का पैटर्न बनाओ, फिर बारी बदलकर उसे आगे बढ़ाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-numeracy-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Build a little garden",
      "hi": "छोटा बगीचा बनाओ"
    },
    "objective": {
      "en": "Construct and describe a grouping of objects.",
      "hi": "चीज़ों का समूह बनाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make a garden with dots and shapes. Tell your grown-up what you added.",
          "hi": "बिंदुओं और आकारों से बगीचा बनाओ। अपने बड़े को बताओ कि क्या जोड़ा।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Build a pretend garden with large toys or drawings.",
      "hi": "बड़े खिलौनों या चित्रों से कल्पना का बगीचा बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-discovery-1",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "discovery",
    "title": {
      "en": "Leaf detective",
      "hi": "पत्ते की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the leaf. Notice its shape.",
          "hi": "पत्ता ढूँढो। उसका आकार देखो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "leaf"
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-discovery-2",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "discovery",
    "title": {
      "en": "Animal neighbours",
      "hi": "आस-पास के जानवर"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which picture is an animal?",
          "hi": "कौन-सा चित्र जानवर का है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-discovery-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "discovery",
    "title": {
      "en": "Daylight explorer",
      "hi": "दिन के उजाले की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the sun. We look at its picture, never directly at the real sun.",
          "hi": "सूरज का चित्र ढूँढो। असली सूरज को सीधे कभी न देखें।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "sun"
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-discovery-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "discovery",
    "title": {
      "en": "Water observer",
      "hi": "पानी को देखो"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find water. Tell your grown-up where you have seen it.",
          "hi": "पानी ढूँढो। बड़े को बताओ कि उसे कहाँ देखा है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-discovery-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "discovery",
    "title": {
      "en": "Same and different",
      "hi": "एक जैसे और अलग"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "These are both animals: cat and dog. Pick either and say how they are different.",
          "hi": "बिल्ली और कुत्ता दोनों जानवर हैं। कोई एक चुनो और बताओ कि वे कैसे अलग हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-creative-1",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "creative",
    "title": {
      "en": "My colour sky",
      "hi": "मेरा रंगीन आकाश"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Tap the canvas to add marks. You can change colours or clear it. Make your own picture.",
          "hi": "चित्र में निशान बनाने के लिए खाने चुनो। रंग बदल सकते हो या मिटा सकते हो। अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-creative-2",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "creative",
    "title": {
      "en": "A house for a friend",
      "hi": "दोस्त का घर"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Tap the canvas to add marks. You can change colours or clear it. Make your own picture.",
          "hi": "चित्र में निशान बनाने के लिए खाने चुनो। रंग बदल सकते हो या मिटा सकते हो। अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-creative-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "creative",
    "title": {
      "en": "A pretend creature",
      "hi": "कल्पना का जीव"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Tap the canvas to add marks. You can change colours or clear it. Make your own picture.",
          "hi": "चित्र में निशान बनाने के लिए खाने चुनो। रंग बदल सकते हो या मिटा सकते हो। अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-creative-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "creative",
    "title": {
      "en": "My pattern picture",
      "hi": "मेरे पैटर्न का चित्र"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Tap the canvas to add marks. You can change colours or clear it. Make your own picture.",
          "hi": "चित्र में निशान बनाने के लिए खाने चुनो। रंग बदल सकते हो या मिटा सकते हो। अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-creative-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "creative",
    "title": {
      "en": "A celebration garden",
      "hi": "खुशी का बगीचा"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Tap the canvas to add marks. You can change colours or clear it. Make your own picture.",
          "hi": "चित्र में निशान बनाने के लिए खाने चुनो। रंग बदल सकते हो या मिटा सकते हो। अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "nursery-social-1",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "social",
    "title": {
      "en": "Feelings check-in",
      "hi": "मन की बात"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose how you feel, or choose any face to talk about. All feelings are welcome.",
          "hi": "अपना एहसास चुनो या बात करने के लिए कोई चेहरा चुनो। सभी भावनाएँ ठीक हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-social-2",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "social",
    "title": {
      "en": "Taking turns",
      "hi": "बारी-बारी का खेल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a picture for your turn. Then let your grown-up pick. You can pass.",
          "hi": "अपनी बारी में एक चित्र चुनो। फिर बड़े को चुनने दो। चाहो तो बारी छोड़ सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-social-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "social",
    "title": {
      "en": "A helping hand",
      "hi": "मदद का हाथ"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose something you could talk about with someone who needs help. Ask before helping.",
          "hi": "जिसे मदद चाहिए उससे बात करने के लिए एक चित्र चुनो। मदद से पहले पूछो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-social-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "social",
    "title": {
      "en": "Different favourites",
      "hi": "अलग-अलग पसंद"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose your favourite picture. Ask your grown-up theirs. They may choose differently.",
          "hi": "पसंदीदा चित्र चुनो। बड़े की पसंद पूछो। उनकी पसंद अलग हो सकती है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-social-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "social",
    "title": {
      "en": "A calm moment",
      "hi": "शांत पल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a calming picture. Breathe normally and look at it, or stop if you prefer.",
          "hi": "शांत लगने वाला चित्र चुनो। सामान्य साँस लेते हुए देखो या चाहो तो रुक जाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "nursery-real-world-1",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "real-world",
    "title": {
      "en": "Room treasure hunt",
      "hi": "कमरे में खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
          "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
      "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "nursery-real-world-2",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "real-world",
    "title": {
      "en": "Move like an animal",
      "hi": "जानवर जैसी चाल"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
          "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
      "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "nursery-real-world-3",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "real-world",
    "title": {
      "en": "Story together",
      "hi": "साथ में कहानी"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
          "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
      "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "nursery-real-world-4",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "real-world",
    "title": {
      "en": "Outdoor noticing",
      "hi": "बाहर देखकर खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
          "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
      "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "nursery-real-world-5",
    "revision": 1,
    "placements": [
      "nursery"
    ],
    "domain": "real-world",
    "title": {
      "en": "Large toy pattern",
      "hi": "बड़े खिलौनों का पैटर्न"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Use large safe toys or drawings to make a repeating pattern together.",
          "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Use large safe toys or drawings to make a repeating pattern together.",
      "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "lkg-language-1",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "language",
    "title": {
      "en": "Picture partners",
      "hi": "चित्र के साथी"
    },
    "objective": {
      "en": "Name and match familiar objects.",
      "hi": "जानी-पहचानी चीज़ों के नाम बोलना और मिलाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Find the apple to match this apple: 🍎",
          "hi": "इस सेब का साथी ढूँढो: 🍎"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "apple"
      },
      {
        "instruction": {
          "en": "Find the ball to match this ball: ⚽",
          "hi": "इस गेंद का साथी ढूँढो: ⚽"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Name three large objects in your room together.",
      "hi": "कमरे की तीन बड़ी चीज़ों के नाम साथ बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-language-2",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "language",
    "title": {
      "en": "Listen and find",
      "hi": "सुनो और ढूँढो"
    },
    "objective": {
      "en": "Connect spoken everyday words to pictures.",
      "hi": "रोज़ के बोले गए शब्दों को चित्रों से जोड़ना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Listen or read: cat. Find the cat.",
          "hi": "सुनो या पढ़ो: बिल्ली। बिल्ली ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      },
      {
        "instruction": {
          "en": "Listen or read: water. Find the water.",
          "hi": "सुनो या पढ़ो: पानी। पानी ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Take turns naming a favourite toy without a screen.",
      "hi": "बिना स्क्रीन के बारी-बारी से पसंदीदा खिलौने का नाम बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-language-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "language",
    "title": {
      "en": "Rhyme time",
      "hi": "तुक का खेल"
    },
    "objective": {
      "en": "Notice endings in spoken words with adult help.",
      "hi": "बड़े की मदद से शब्दों के अंत की तुक सुनना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Say hat. Which word rhymes with hat: cat, tree, or ball?",
          "hi": "पानी बोलो। पानी से किसकी तुक मिलती है: नानी, घर या गेंद?"
        },
        "hint": {
          "en": "Say hat and cat slowly. Listen to the endings.",
          "hi": "पानी और नानी धीरे बोलो। अंत की आवाज़ सुनो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "rhyme"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "English: say sun and fun. Hindi: say राजा and बाजा. Enjoy the sounds together.",
      "hi": "हिंदी: राजा और बाजा बोलो। अंग्रेज़ी: sun और fun बोलो। साथ में आवाज़ों का आनंद लो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-language-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "language",
    "title": {
      "en": "Our plant story",
      "hi": "हमारे पौधे की कहानी"
    },
    "objective": {
      "en": "Put a simple pictured story in order with support.",
      "hi": "मदद से चित्रों की छोटी कहानी को क्रम में रखना।"
    },
    "interaction": "sequence",
    "steps": [
      {
        "instruction": {
          "en": "Our story starts with a little plant. Then we water it. Later a flower grows. Tap the pictures in that order.",
          "hi": "कहानी एक नन्हे पौधे से शुरू होती है। फिर हम उसे पानी देते हैं। बाद में फूल खिलता है। चित्र इसी क्रम में चुनो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "seed",
            "picture": "🌱",
            "label": {
              "en": "Seedling",
              "hi": "नन्हा पौधा"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water the plant",
              "hi": "पौधे को पानी देना"
            }
          },
          {
            "id": "bloom",
            "picture": "🌼",
            "label": {
              "en": "A flower grows",
              "hi": "फूल खिलना"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "seed|water|bloom"
      }
    ],
    "offline": {
      "en": "Tell a two-part story about something you did today.",
      "hi": "आज किए किसी काम की दो भागों वाली कहानी सुनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-language-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "language",
    "title": {
      "en": "Tell me about it",
      "hi": "इसके बारे में बताओ"
    },
    "objective": {
      "en": "Describe a picture in any words or gestures the child chooses.",
      "hi": "बच्चे के चुने शब्दों या इशारों से चित्र का वर्णन करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up something about it, or show with a gesture.",
          "hi": "एक चित्र चुनो। उसके बारे में अपने बड़े को कुछ बताओ या इशारा करो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Listen to each other describe a favourite thing. No recording needed.",
      "hi": "एक-दूसरे से पसंदीदा चीज़ का वर्णन सुनो। रिकॉर्डिंग की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-numeracy-1",
    "revision": 2,
    "placements": [
      "lkg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Count the apples",
      "hi": "सेब गिनो"
    },
    "objective": {
      "en": "Count a set of 4 objects, touching each once.",
      "hi": "4 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3",
              "hi": "3"
            }
          },
          {
            "id": "4",
            "picture": "4",
            "label": {
              "en": "4",
              "hi": "4"
            }
          },
          {
            "id": "5",
            "picture": "5",
            "label": {
              "en": "5",
              "hi": "5"
            }
          }
        ],
        "feedback": {
          "en": "You counted 4 objects. You can count them again together.",
          "hi": "तुमने 4 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "4",
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3",
              "hi": "3"
            }
          },
          {
            "id": "4",
            "picture": "4",
            "label": {
              "en": "4",
              "hi": "4"
            }
          },
          {
            "id": "5",
            "picture": "5",
            "label": {
              "en": "5",
              "hi": "5"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-numeracy-2",
    "revision": 2,
    "placements": [
      "lkg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Flower counter",
      "hi": "फूल गिनो"
    },
    "objective": {
      "en": "Count a set of 6 objects, touching each once.",
      "hi": "6 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "5",
            "picture": "5",
            "label": {
              "en": "5",
              "hi": "5"
            }
          },
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          }
        ],
        "feedback": {
          "en": "You counted 6 objects. You can count them again together.",
          "hi": "तुमने 6 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "6",
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "5",
            "picture": "5",
            "label": {
              "en": "5",
              "hi": "5"
            }
          },
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-numeracy-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Shape homes",
      "hi": "आकृतियों के घर"
    },
    "objective": {
      "en": "Match simple shapes by visible form.",
      "hi": "दिखने वाले आकार से सरल आकृतियाँ मिलाना।"
    },
    "interaction": "sorting",
    "steps": [
      {
        "instruction": {
          "en": "A round shape goes in the round home. Choose its home: 🔵",
          "hi": "गोल आकृति गोल घर में जाएगी। इसका घर चुनो: 🔵"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "round"
      },
      {
        "instruction": {
          "en": "A square goes in the square home. Choose its home: 🟦",
          "hi": "चौकोर आकृति चौकोर घर में जाएगी। इसका घर चुनो: 🟦"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "square"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look for round and square shapes at home without touching sharp objects.",
      "hi": "घर में बिना नुकीली चीज़ छुए गोल और चौकोर आकार खोजो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-numeracy-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Pattern train",
      "hi": "पैटर्न की रेल"
    },
    "objective": {
      "en": "Continue a repeating two-part visual pattern.",
      "hi": "दो हिस्सों का दोहराता चित्र पैटर्न आगे बढ़ाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "The train goes: 🍎 ⚽ 🍎 ⚽ 🍎 ... What comes next?",
          "hi": "रेल चलती है: 🍎 ⚽ 🍎 ⚽ 🍎 ... अब क्या आएगा?"
        },
        "hint": {
          "en": "Say apple, ball. Repeat those two words.",
          "hi": "सेब, गेंद बोलो। ये दो शब्द दोहराओ।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Make an apple-ball pattern with drawings, then swap who continues it.",
      "hi": "सेब-गेंद के चित्रों का पैटर्न बनाओ, फिर बारी बदलकर उसे आगे बढ़ाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-numeracy-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Build a little garden",
      "hi": "छोटा बगीचा बनाओ"
    },
    "objective": {
      "en": "Construct and describe a grouping of objects.",
      "hi": "चीज़ों का समूह बनाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Build a pretend garden with large toys or drawings.",
      "hi": "बड़े खिलौनों या चित्रों से कल्पना का बगीचा बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-discovery-1",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Leaf detective",
      "hi": "पत्ते की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the leaf. Notice its shape.",
          "hi": "पत्ता ढूँढो। उसका आकार देखो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "leaf"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-discovery-2",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Animal neighbours",
      "hi": "आस-पास के जानवर"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which picture is an animal?",
          "hi": "कौन-सा चित्र जानवर का है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-discovery-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Daylight explorer",
      "hi": "दिन के उजाले की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the sun. We look at its picture, never directly at the real sun.",
          "hi": "सूरज का चित्र ढूँढो। असली सूरज को सीधे कभी न देखें।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "sun"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-discovery-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Water observer",
      "hi": "पानी को देखो"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find water. Tell your grown-up where you have seen it.",
          "hi": "पानी ढूँढो। बड़े को बताओ कि उसे कहाँ देखा है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-discovery-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Same and different",
      "hi": "एक जैसे और अलग"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "These are both animals: cat and dog. Pick either and say how they are different.",
          "hi": "बिल्ली और कुत्ता दोनों जानवर हैं। कोई एक चुनो और बताओ कि वे कैसे अलग हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-creative-1",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "creative",
    "title": {
      "en": "My colour sky",
      "hi": "मेरा रंगीन आकाश"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-creative-2",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "creative",
    "title": {
      "en": "A house for a friend",
      "hi": "दोस्त का घर"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-creative-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "creative",
    "title": {
      "en": "A pretend creature",
      "hi": "कल्पना का जीव"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-creative-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "creative",
    "title": {
      "en": "My pattern picture",
      "hi": "मेरे पैटर्न का चित्र"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-creative-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "creative",
    "title": {
      "en": "A celebration garden",
      "hi": "खुशी का बगीचा"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Try a repeating pattern of two colours.",
          "hi": "अपना चित्र बनाओ। दो रंगों का दोहराता पैटर्न आज़माओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "lkg-social-1",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "social",
    "title": {
      "en": "Feelings check-in",
      "hi": "मन की बात"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose how you feel, or choose any face to talk about. All feelings are welcome.",
          "hi": "अपना एहसास चुनो या बात करने के लिए कोई चेहरा चुनो। सभी भावनाएँ ठीक हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-social-2",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "social",
    "title": {
      "en": "Taking turns",
      "hi": "बारी-बारी का खेल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a picture for your turn. Then let your grown-up pick. You can pass.",
          "hi": "अपनी बारी में एक चित्र चुनो। फिर बड़े को चुनने दो। चाहो तो बारी छोड़ सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-social-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "social",
    "title": {
      "en": "A helping hand",
      "hi": "मदद का हाथ"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose something you could talk about with someone who needs help. Ask before helping.",
          "hi": "जिसे मदद चाहिए उससे बात करने के लिए एक चित्र चुनो। मदद से पहले पूछो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-social-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "social",
    "title": {
      "en": "Different favourites",
      "hi": "अलग-अलग पसंद"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose your favourite picture. Ask your grown-up theirs. They may choose differently.",
          "hi": "पसंदीदा चित्र चुनो। बड़े की पसंद पूछो। उनकी पसंद अलग हो सकती है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-social-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "social",
    "title": {
      "en": "A calm moment",
      "hi": "शांत पल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a calming picture. Breathe normally and look at it, or stop if you prefer.",
          "hi": "शांत लगने वाला चित्र चुनो। सामान्य साँस लेते हुए देखो या चाहो तो रुक जाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture again. Tell or show your grown-up one thing you notice.",
          "hi": "फिर एक चित्र चुनो। बड़े को एक बात बताओ या इशारे से दिखाओ जो तुमने देखी।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "lkg-real-world-1",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Room treasure hunt",
      "hi": "कमरे में खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
          "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
      "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "lkg-real-world-2",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Move like an animal",
      "hi": "जानवर जैसी चाल"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
          "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
      "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "lkg-real-world-3",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Story together",
      "hi": "साथ में कहानी"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
          "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
      "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "lkg-real-world-4",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Outdoor noticing",
      "hi": "बाहर देखकर खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
          "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
      "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "lkg-real-world-5",
    "revision": 1,
    "placements": [
      "lkg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Large toy pattern",
      "hi": "बड़े खिलौनों का पैटर्न"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Use large safe toys or drawings to make a repeating pattern together.",
          "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Use large safe toys or drawings to make a repeating pattern together.",
      "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "ukg-language-1",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "language",
    "title": {
      "en": "Picture partners",
      "hi": "चित्र के साथी"
    },
    "objective": {
      "en": "Name and match familiar objects.",
      "hi": "जानी-पहचानी चीज़ों के नाम बोलना और मिलाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Find the apple to match this apple: 🍎",
          "hi": "इस सेब का साथी ढूँढो: 🍎"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "apple"
      },
      {
        "instruction": {
          "en": "Find the ball to match this ball: ⚽",
          "hi": "इस गेंद का साथी ढूँढो: ⚽"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Name three large objects in your room together.",
      "hi": "कमरे की तीन बड़ी चीज़ों के नाम साथ बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-language-2",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "language",
    "title": {
      "en": "Listen and find",
      "hi": "सुनो और ढूँढो"
    },
    "objective": {
      "en": "Connect spoken everyday words to pictures.",
      "hi": "रोज़ के बोले गए शब्दों को चित्रों से जोड़ना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "Listen or read: cat. Find the cat.",
          "hi": "सुनो या पढ़ो: बिल्ली। बिल्ली ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      },
      {
        "instruction": {
          "en": "Listen or read: water. Find the water.",
          "hi": "सुनो या पढ़ो: पानी। पानी ढूँढो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Take turns naming a favourite toy without a screen.",
      "hi": "बिना स्क्रीन के बारी-बारी से पसंदीदा खिलौने का नाम बोलो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-language-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "language",
    "title": {
      "en": "Rhyme time",
      "hi": "तुक का खेल"
    },
    "objective": {
      "en": "Notice endings in spoken words with adult help.",
      "hi": "बड़े की मदद से शब्दों के अंत की तुक सुनना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Say hat. Which word rhymes with hat: cat, tree, or ball?",
          "hi": "पानी बोलो। पानी से किसकी तुक मिलती है: नानी, घर या गेंद?"
        },
        "hint": {
          "en": "Say hat and cat slowly. Listen to the endings.",
          "hi": "पानी और नानी धीरे बोलो। अंत की आवाज़ सुनो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "rhyme"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "rhyme",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "नानी"
            },
            "pictureHi": "👵"
          },
          {
            "id": "other",
            "picture": "🌳",
            "label": {
              "en": "Tree",
              "hi": "घर"
            },
            "pictureHi": "🏠"
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "English: say sun and fun. Hindi: say राजा and बाजा. Enjoy the sounds together.",
      "hi": "हिंदी: राजा और बाजा बोलो। अंग्रेज़ी: sun और fun बोलो। साथ में आवाज़ों का आनंद लो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-language-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "language",
    "title": {
      "en": "Our plant story",
      "hi": "हमारे पौधे की कहानी"
    },
    "objective": {
      "en": "Put a simple pictured story in order with support.",
      "hi": "मदद से चित्रों की छोटी कहानी को क्रम में रखना।"
    },
    "interaction": "sequence",
    "steps": [
      {
        "instruction": {
          "en": "Our story starts with a little plant. Then we water it. Later a flower grows. Tap the pictures in that order.",
          "hi": "कहानी एक नन्हे पौधे से शुरू होती है। फिर हम उसे पानी देते हैं। बाद में फूल खिलता है। चित्र इसी क्रम में चुनो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "seed",
            "picture": "🌱",
            "label": {
              "en": "Seedling",
              "hi": "नन्हा पौधा"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water the plant",
              "hi": "पौधे को पानी देना"
            }
          },
          {
            "id": "bloom",
            "picture": "🌼",
            "label": {
              "en": "A flower grows",
              "hi": "फूल खिलना"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "seed|water|bloom"
      }
    ],
    "offline": {
      "en": "Tell a two-part story about something you did today.",
      "hi": "आज किए किसी काम की दो भागों वाली कहानी सुनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-language-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "language",
    "title": {
      "en": "Tell me about it",
      "hi": "इसके बारे में बताओ"
    },
    "objective": {
      "en": "Describe a picture in any words or gestures the child chooses.",
      "hi": "बच्चे के चुने शब्दों या इशारों से चित्र का वर्णन करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up something about it, or show with a gesture.",
          "hi": "एक चित्र चुनो। उसके बारे में अपने बड़े को कुछ बताओ या इशारा करो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Listen to each other describe a favourite thing. No recording needed.",
      "hi": "एक-दूसरे से पसंदीदा चीज़ का वर्णन सुनो। रिकॉर्डिंग की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-numeracy-1",
    "revision": 2,
    "placements": [
      "ukg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Count the apples",
      "hi": "सेब गिनो"
    },
    "objective": {
      "en": "Count a set of 7 objects, touching each once.",
      "hi": "7 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          },
          {
            "id": "8",
            "picture": "8",
            "label": {
              "en": "8",
              "hi": "8"
            }
          }
        ],
        "feedback": {
          "en": "You counted 7 objects. You can count them again together.",
          "hi": "तुमने 7 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "7",
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          },
          {
            "id": "8",
            "picture": "8",
            "label": {
              "en": "8",
              "hi": "8"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          },
          {
            "id": "8",
            "picture": "8",
            "label": {
              "en": "8",
              "hi": "8"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-numeracy-2",
    "revision": 2,
    "placements": [
      "ukg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Flower counter",
      "hi": "फूल गिनो"
    },
    "objective": {
      "en": "Count a set of 10 objects, touching each once.",
      "hi": "10 चीज़ों के समूह में हर चीज़ को एक बार छूकर गिनना।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Point to one object for each number you say.",
          "hi": "हर संख्या बोलते समय एक चीज़ की ओर इशारा करो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "11",
            "picture": "11",
            "label": {
              "en": "11",
              "hi": "11"
            }
          }
        ],
        "feedback": {
          "en": "You counted 10 objects. You can count them again together.",
          "hi": "तुमने 10 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "10",
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "11",
            "picture": "11",
            "label": {
              "en": "11",
              "hi": "11"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      },
      {
        "instruction": {
          "en": "Count again. Choose a number and tell or show your grown-up what you notice about this group.",
          "hi": "फिर गिनो। एक संख्या चुनो और बड़े को बताओ या दिखाओ कि इस समूह में तुमने क्या देखा।"
        },
        "hint": {
          "en": "Touch each object once. You can show your idea by pointing.",
          "hi": "हर चीज़ को एक बार छुओ। इशारे से अपना विचार दिखा सकते हो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "11",
            "picture": "11",
            "label": {
              "en": "11",
              "hi": "11"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Count large safe toys together. Stop at a number the child is comfortable with.",
      "hi": "बड़े सुरक्षित खिलौने साथ गिनो। बच्चे को जितनी गिनती सहज लगे वहीं रुकें।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-numeracy-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Shape homes",
      "hi": "आकृतियों के घर"
    },
    "objective": {
      "en": "Match simple shapes by visible form.",
      "hi": "दिखने वाले आकार से सरल आकृतियाँ मिलाना।"
    },
    "interaction": "sorting",
    "steps": [
      {
        "instruction": {
          "en": "A round shape goes in the round home. Choose its home: 🔵",
          "hi": "गोल आकृति गोल घर में जाएगी। इसका घर चुनो: 🔵"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "round"
      },
      {
        "instruction": {
          "en": "A square goes in the square home. Choose its home: 🟦",
          "hi": "चौकोर आकृति चौकोर घर में जाएगी। इसका घर चुनो: 🟦"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "square"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "round",
            "picture": "⭕",
            "label": {
              "en": "Round",
              "hi": "गोल"
            }
          },
          {
            "id": "square",
            "picture": "⬜",
            "label": {
              "en": "Square",
              "hi": "चौकोर"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look for round and square shapes at home without touching sharp objects.",
      "hi": "घर में बिना नुकीली चीज़ छुए गोल और चौकोर आकार खोजो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-numeracy-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Pattern train",
      "hi": "पैटर्न की रेल"
    },
    "objective": {
      "en": "Continue a repeating two-part visual pattern.",
      "hi": "दो हिस्सों का दोहराता चित्र पैटर्न आगे बढ़ाना।"
    },
    "interaction": "matching",
    "steps": [
      {
        "instruction": {
          "en": "The train goes: 🍎 ⚽ 🍎 ⚽ 🍎 ... What comes next?",
          "hi": "रेल चलती है: 🍎 ⚽ 🍎 ⚽ 🍎 ... अब क्या आएगा?"
        },
        "hint": {
          "en": "Say apple, ball. Repeat those two words.",
          "hi": "सेब, गेंद बोलो। ये दो शब्द दोहराओ।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "ball"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Make an apple-ball pattern with drawings, then swap who continues it.",
      "hi": "सेब-गेंद के चित्रों का पैटर्न बनाओ, फिर बारी बदलकर उसे आगे बढ़ाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-numeracy-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "numeracy",
    "title": {
      "en": "Build a little garden",
      "hi": "छोटा बगीचा बनाओ"
    },
    "objective": {
      "en": "Construct and describe a grouping of objects.",
      "hi": "चीज़ों का समूह बनाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Build a pretend garden with large toys or drawings.",
      "hi": "बड़े खिलौनों या चित्रों से कल्पना का बगीचा बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-discovery-1",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Leaf detective",
      "hi": "पत्ते की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the leaf. Notice its shape.",
          "hi": "पत्ता ढूँढो। उसका आकार देखो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "leaf"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "apple",
            "picture": "🍎",
            "label": {
              "en": "Apple",
              "hi": "सेब"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-discovery-2",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Animal neighbours",
      "hi": "आस-पास के जानवर"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which picture is an animal?",
          "hi": "कौन-सा चित्र जानवर का है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "cat"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-discovery-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Daylight explorer",
      "hi": "दिन के उजाले की खोज"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find the sun. We look at its picture, never directly at the real sun.",
          "hi": "सूरज का चित्र ढूँढो। असली सूरज को सीधे कभी न देखें।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "sun"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-discovery-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Water observer",
      "hi": "पानी को देखो"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Find water. Tell your grown-up where you have seen it.",
          "hi": "पानी ढूँढो। बड़े को बताओ कि उसे कहाँ देखा है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "water"
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "ball",
            "picture": "⚽",
            "label": {
              "en": "Ball",
              "hi": "गेंद"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-discovery-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "discovery",
    "title": {
      "en": "Same and different",
      "hi": "एक जैसे और अलग"
    },
    "objective": {
      "en": "Observe an everyday feature and share a noticing.",
      "hi": "रोज़ की किसी चीज़ को देखकर अपनी बात साझा करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "These are both animals: cat and dog. Pick either and say how they are different.",
          "hi": "बिल्ली और कुत्ता दोनों जानवर हैं। कोई एक चुनो और बताओ कि वे कैसे अलग हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "cat",
            "picture": "🐈",
            "label": {
              "en": "Cat",
              "hi": "बिल्ली"
            }
          },
          {
            "id": "dog",
            "picture": "🐕",
            "label": {
              "en": "Dog",
              "hi": "कुत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Look with your grown-up for something similar in a safe place. Observe; no need to collect or taste.",
      "hi": "बड़े के साथ सुरक्षित जगह में मिलती-जुलती चीज़ देखो। केवल देखो; उठाने या चखने की ज़रूरत नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-creative-1",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "creative",
    "title": {
      "en": "My colour sky",
      "hi": "मेरा रंगीन आकाश"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-creative-2",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "creative",
    "title": {
      "en": "A house for a friend",
      "hi": "दोस्त का घर"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-creative-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "creative",
    "title": {
      "en": "A pretend creature",
      "hi": "कल्पना का जीव"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-creative-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "creative",
    "title": {
      "en": "My pattern picture",
      "hi": "मेरे पैटर्न का चित्र"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-creative-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "creative",
    "title": {
      "en": "A celebration garden",
      "hi": "खुशी का बगीचा"
    },
    "objective": {
      "en": "Choose, arrange, and explain an original picture.",
      "hi": "अपना चित्र चुनना, सजाना और उसके बारे में बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make your picture. Add two different shapes. Describe what each part means.",
          "hi": "अपना चित्र बनाओ। दो अलग आकार जोड़ो। बताओ कि हर हिस्सा क्या दर्शाता है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Continue your picture with crayons and paper, with a grown-up nearby.",
      "hi": "बड़े के पास रहकर कागज़ और रंगों से अपना चित्र आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "ukg-social-1",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "social",
    "title": {
      "en": "Feelings check-in",
      "hi": "मन की बात"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose how you feel, or choose any face to talk about. All feelings are welcome.",
          "hi": "अपना एहसास चुनो या बात करने के लिए कोई चेहरा चुनो। सभी भावनाएँ ठीक हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "happy",
            "picture": "🙂",
            "label": {
              "en": "Happy",
              "hi": "खुश"
            }
          },
          {
            "id": "sad",
            "picture": "😔",
            "label": {
              "en": "Sad",
              "hi": "उदास"
            }
          },
          {
            "id": "calm",
            "picture": "😌",
            "label": {
              "en": "Calm",
              "hi": "शांत"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-social-2",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "social",
    "title": {
      "en": "Taking turns",
      "hi": "बारी-बारी का खेल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a picture for your turn. Then let your grown-up pick. You can pass.",
          "hi": "अपनी बारी में एक चित्र चुनो। फिर बड़े को चुनने दो। चाहो तो बारी छोड़ सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-social-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "social",
    "title": {
      "en": "A helping hand",
      "hi": "मदद का हाथ"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose something you could talk about with someone who needs help. Ask before helping.",
          "hi": "जिसे मदद चाहिए उससे बात करने के लिए एक चित्र चुनो। मदद से पहले पूछो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-social-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "social",
    "title": {
      "en": "Different favourites",
      "hi": "अलग-अलग पसंद"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Choose your favourite picture. Ask your grown-up theirs. They may choose differently.",
          "hi": "पसंदीदा चित्र चुनो। बड़े की पसंद पूछो। उनकी पसंद अलग हो सकती है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-social-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "social",
    "title": {
      "en": "A calm moment",
      "hi": "शांत पल"
    },
    "objective": {
      "en": "Practise expressing preferences and respectful conversation.",
      "hi": "अपनी पसंद बताना और सम्मान से बात करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Pick a calming picture. Breathe normally and look at it, or stop if you prefer.",
          "hi": "शांत लगने वाला चित्र चुनो। सामान्य साँस लेते हुए देखो या चाहो तो रुक जाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "Thank you for sharing. People can feel or choose differently.",
          "hi": "अपनी बात बताने के लिए धन्यवाद। लोगों के भाव या चुनाव अलग हो सकते हैं।"
        }
      },
      {
        "instruction": {
          "en": "Choose a picture. Tell your grown-up why you chose it, using words or gestures.",
          "hi": "एक चित्र चुनो। शब्द या इशारे से बड़े को बताओ कि उसे क्यों चुना।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      },
      {
        "instruction": {
          "en": "Choose another picture to compare. What is the same or different? There can be more than one idea.",
          "hi": "तुलना के लिए दूसरा चित्र चुनो। क्या एक जैसा या अलग है? एक से अधिक विचार हो सकते हैं।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Spend a moment talking or playing together. No right feeling or favourite is required.",
      "hi": "थोड़ी देर साथ बात करो या खेलो। कोई खास भावना या पसंद ज़रूरी नहीं।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "ukg-real-world-1",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Room treasure hunt",
      "hi": "कमरे में खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
          "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, point to three large things in your room. Name or gesture about them.",
      "hi": "बड़े के साथ कमरे में तीन बड़ी चीज़ों की ओर इशारा करो। नाम बोलो या इशारे से बताओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "ukg-real-world-2",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Move like an animal",
      "hi": "जानवर जैसी चाल"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
          "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "In a clear safe space, choose an animal and move like it. Seated gestures count too.",
      "hi": "खाली सुरक्षित जगह में कोई जानवर चुनकर उसकी चाल बनाओ। बैठकर इशारे भी कर सकते हो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "ukg-real-world-3",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Story together",
      "hi": "साथ में कहानी"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
          "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Make a tiny story with a grown-up. Take turns with words, pictures, or gestures.",
      "hi": "बड़े के साथ छोटी कहानी बनाओ। बारी-बारी से शब्द, चित्र या इशारे जोड़ो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "ukg-real-world-4",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Outdoor noticing",
      "hi": "बाहर देखकर खोज"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
          "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "With a grown-up, look outside or through a window. Notice one colour and one shape.",
      "hi": "बड़े के साथ बाहर या खिड़की से देखो। एक रंग और एक आकार पहचानो।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "ukg-real-world-5",
    "revision": 1,
    "placements": [
      "ukg"
    ],
    "domain": "real-world",
    "title": {
      "en": "Large toy pattern",
      "hi": "बड़े खिलौनों का पैटर्न"
    },
    "objective": {
      "en": "Participate in caregiver-guided real-world play.",
      "hi": "बड़े की मदद से वास्तविक दुनिया के खेल में भाग लेना।"
    },
    "interaction": "offline",
    "steps": [
      {
        "instruction": {
          "en": "Use large safe toys or drawings to make a repeating pattern together.",
          "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Use large safe toys or drawings to make a repeating pattern together.",
      "hi": "बड़े सुरक्षित खिलौनों या चित्रों से साथ मिलकर दोहराता पैटर्न बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "ncf-foundational",
    "source": "https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "caregiver-reported"
  },
  {
    "id": "grade-1-explore-1",
    "revision": 2,
    "placements": [
      "school:1"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 1: Number garden",
      "hi": "कक्षा 1: संख्या का बगीचा"
    },
    "objective": {
      "en": "Count a group of 3 flowers, using one touch for each object.",
      "hi": "3 फूलों के समूह में हर फूल को एक बार छूकर गिनो।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Two",
              "hi": "दो"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Three",
              "hi": "तीन"
            }
          },
          {
            "id": "4",
            "picture": "4",
            "label": {
              "en": "Four",
              "hi": "चार"
            }
          }
        ],
        "feedback": {
          "en": "You counted 3 objects. You can count them again together.",
          "hi": "तुमने 3 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "3",
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-1-explore-2",
    "revision": 1,
    "placements": [
      "school:1"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 1: Story maker",
      "hi": "कक्षा 1: कहानी बनाओ"
    },
    "objective": {
      "en": "Arrange a beginning, middle and end.",
      "hi": "शुरुआत, बीच और अंत को क्रम में रखना।"
    },
    "interaction": "sequence",
    "steps": [
      {
        "instruction": {
          "en": "A seedling is watered; a flower grows. Choose that order.",
          "hi": "नन्हे पौधे को पानी मिलता है; फूल खिलता है। इस क्रम में चुनो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "seed",
            "picture": "🌱",
            "label": {
              "en": "Seedling",
              "hi": "नन्हा पौधा"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water the plant",
              "hi": "पौधे को पानी देना"
            }
          },
          {
            "id": "bloom",
            "picture": "🌼",
            "label": {
              "en": "A flower grows",
              "hi": "फूल खिलना"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "seed|water|bloom"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-1-explore-3",
    "revision": 1,
    "placements": [
      "school:1"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 1: Picture studio",
      "hi": "कक्षा 1: चित्र स्टूडियो"
    },
    "objective": {
      "en": "Create a picture and describe its shapes.",
      "hi": "चित्र बनाकर उसके आकार बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make a picture using the canvas.",
          "hi": "चित्र के खानों से अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-2-explore-1",
    "revision": 2,
    "placements": [
      "school:2"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 2: Number garden",
      "hi": "कक्षा 2: संख्या का बगीचा"
    },
    "objective": {
      "en": "Count a group of 6 flowers, using one touch for each object.",
      "hi": "6 फूलों के समूह में हर फूल को एक बार छूकर गिनो।"
    },
    "interaction": "counting",
    "steps": [
      {
        "instruction": {
          "en": "Tap each object once as you count. How many are there?",
          "hi": "हर चीज़ को एक बार छूकर गिनो। कितनी हैं?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "5",
            "picture": "5",
            "label": {
              "en": "5",
              "hi": "5"
            }
          },
          {
            "id": "6",
            "picture": "6",
            "label": {
              "en": "6",
              "hi": "6"
            }
          },
          {
            "id": "7",
            "picture": "7",
            "label": {
              "en": "7",
              "hi": "7"
            }
          }
        ],
        "feedback": {
          "en": "You counted 6 objects. You can count them again together.",
          "hi": "तुमने 6 चीज़ें गिनीं। साथ में फिर गिन सकते हो।"
        },
        "answer": "6",
        "countingObjects": [
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          }
        ]
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-04",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-2-explore-2",
    "revision": 1,
    "placements": [
      "school:2"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 2: Story maker",
      "hi": "कक्षा 2: कहानी बनाओ"
    },
    "objective": {
      "en": "Arrange a beginning, middle and end.",
      "hi": "शुरुआत, बीच और अंत को क्रम में रखना।"
    },
    "interaction": "sequence",
    "steps": [
      {
        "instruction": {
          "en": "A seedling is watered; a flower grows. Choose that order.",
          "hi": "नन्हे पौधे को पानी मिलता है; फूल खिलता है। इस क्रम में चुनो।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "seed",
            "picture": "🌱",
            "label": {
              "en": "Seedling",
              "hi": "नन्हा पौधा"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water the plant",
              "hi": "पौधे को पानी देना"
            }
          },
          {
            "id": "bloom",
            "picture": "🌼",
            "label": {
              "en": "A flower grows",
              "hi": "फूल खिलना"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "seed|water|bloom"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-2-explore-3",
    "revision": 1,
    "placements": [
      "school:2"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 2: Picture studio",
      "hi": "कक्षा 2: चित्र स्टूडियो"
    },
    "objective": {
      "en": "Create a picture and describe its shapes.",
      "hi": "चित्र बनाकर उसके आकार बताना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Make a picture using the canvas.",
          "hi": "चित्र के खानों से अपना चित्र बनाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "flower",
            "picture": "🌼",
            "label": {
              "en": "Flower",
              "hi": "फूल"
            }
          },
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-3-explore-1",
    "revision": 1,
    "placements": [
      "school:3"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 3: Pattern detective",
      "hi": "कक्षा 3: पैटर्न की खोज"
    },
    "objective": {
      "en": "Explain a repeating pattern.",
      "hi": "दोहराते पैटर्न को समझाना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "The pattern is 2, 4, 6, 8. We add 2 each time. What follows?",
          "hi": "पैटर्न 2, 4, 6, 8 है। हर बार 2 जोड़ते हैं। अगला क्या है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "12",
            "picture": "12",
            "label": {
              "en": "12",
              "hi": "12"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "10"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-3-explore-2",
    "revision": 1,
    "placements": [
      "school:3"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 3: Observation lab",
      "hi": "कक्षा 3: अवलोकन प्रयोगशाला"
    },
    "objective": {
      "en": "Separate noticing from interpretation.",
      "hi": "जो देखा उसे अपने अनुमान से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which statement can we observe in this picture: 🌼?",
          "hi": "इस चित्र में कौन-सी बात देख सकते हैं: 🌼?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "observe",
            "picture": "👁️",
            "label": {
              "en": "It has visible petals",
              "hi": "इसमें पंखुड़ियाँ दिखती हैं"
            }
          },
          {
            "id": "guess",
            "picture": "💭",
            "label": {
              "en": "It is the best-smelling flower",
              "hi": "इसकी खुशबू सबसे अच्छी है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "observe"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-3-explore-3",
    "revision": 1,
    "placements": [
      "school:3"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 3: Invent a habitat",
      "hi": "कक्षा 3: निवास की कल्पना"
    },
    "objective": {
      "en": "Design a place and explain a feature.",
      "hi": "जगह बनाकर उसकी विशेषता समझाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Draw a habitat, then explain one part to someone.",
          "hi": "एक निवास का चित्र बनाओ और किसी को उसका एक हिस्सा समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-4-explore-1",
    "revision": 1,
    "placements": [
      "school:4"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 4: Pattern detective",
      "hi": "कक्षा 4: पैटर्न की खोज"
    },
    "objective": {
      "en": "Explain a repeating pattern.",
      "hi": "दोहराते पैटर्न को समझाना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "The pattern is 2, 4, 6, 8. We add 2 each time. What follows?",
          "hi": "पैटर्न 2, 4, 6, 8 है। हर बार 2 जोड़ते हैं। अगला क्या है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "12",
            "picture": "12",
            "label": {
              "en": "12",
              "hi": "12"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "10"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-4-explore-2",
    "revision": 1,
    "placements": [
      "school:4"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 4: Observation lab",
      "hi": "कक्षा 4: अवलोकन प्रयोगशाला"
    },
    "objective": {
      "en": "Separate noticing from interpretation.",
      "hi": "जो देखा उसे अपने अनुमान से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which statement can we observe in this picture: 🌼?",
          "hi": "इस चित्र में कौन-सी बात देख सकते हैं: 🌼?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "observe",
            "picture": "👁️",
            "label": {
              "en": "It has visible petals",
              "hi": "इसमें पंखुड़ियाँ दिखती हैं"
            }
          },
          {
            "id": "guess",
            "picture": "💭",
            "label": {
              "en": "It is the best-smelling flower",
              "hi": "इसकी खुशबू सबसे अच्छी है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "observe"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-4-explore-3",
    "revision": 1,
    "placements": [
      "school:4"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 4: Invent a habitat",
      "hi": "कक्षा 4: निवास की कल्पना"
    },
    "objective": {
      "en": "Design a place and explain a feature.",
      "hi": "जगह बनाकर उसकी विशेषता समझाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Draw a habitat, then explain one part to someone.",
          "hi": "एक निवास का चित्र बनाओ और किसी को उसका एक हिस्सा समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-5-explore-1",
    "revision": 1,
    "placements": [
      "school:5"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 5: Pattern detective",
      "hi": "कक्षा 5: पैटर्न की खोज"
    },
    "objective": {
      "en": "Explain a repeating pattern.",
      "hi": "दोहराते पैटर्न को समझाना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "The pattern is 2, 4, 6, 8. We add 2 each time. What follows?",
          "hi": "पैटर्न 2, 4, 6, 8 है। हर बार 2 जोड़ते हैं। अगला क्या है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "9",
            "picture": "9",
            "label": {
              "en": "9",
              "hi": "9"
            }
          },
          {
            "id": "10",
            "picture": "10",
            "label": {
              "en": "10",
              "hi": "10"
            }
          },
          {
            "id": "12",
            "picture": "12",
            "label": {
              "en": "12",
              "hi": "12"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "10"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-5-explore-2",
    "revision": 1,
    "placements": [
      "school:5"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 5: Observation lab",
      "hi": "कक्षा 5: अवलोकन प्रयोगशाला"
    },
    "objective": {
      "en": "Separate noticing from interpretation.",
      "hi": "जो देखा उसे अपने अनुमान से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which statement can we observe in this picture: 🌼?",
          "hi": "इस चित्र में कौन-सी बात देख सकते हैं: 🌼?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "observe",
            "picture": "👁️",
            "label": {
              "en": "It has visible petals",
              "hi": "इसमें पंखुड़ियाँ दिखती हैं"
            }
          },
          {
            "id": "guess",
            "picture": "💭",
            "label": {
              "en": "It is the best-smelling flower",
              "hi": "इसकी खुशबू सबसे अच्छी है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "observe"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-5-explore-3",
    "revision": 1,
    "placements": [
      "school:5"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 5: Invent a habitat",
      "hi": "कक्षा 5: निवास की कल्पना"
    },
    "objective": {
      "en": "Design a place and explain a feature.",
      "hi": "जगह बनाकर उसकी विशेषता समझाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Draw a habitat, then explain one part to someone.",
          "hi": "एक निवास का चित्र बनाओ और किसी को उसका एक हिस्सा समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-6-explore-1",
    "revision": 1,
    "placements": [
      "school:6"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 6: Systems studio",
      "hi": "कक्षा 6: सिस्टम स्टूडियो"
    },
    "objective": {
      "en": "Explore input and output with a small simulation.",
      "hi": "छोटे अनुकरण में इनपुट और आउटपुट का संबंध देखना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Each solar panel makes 2 units in this simplified model. Choose a panel count, observe output, then explain the rule.",
          "hi": "इस सरल मॉडल में हर सौर पैनल 2 इकाई बनाता है। पैनल चुनो, आउटपुट देखो और नियम समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "1 panel",
              "hi": "1 पैनल"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "2 panels",
              "hi": "2 पैनल"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3 panels",
              "hi": "3 पैनल"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-6-explore-2",
    "revision": 1,
    "placements": [
      "school:6"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 6: Evidence lens",
      "hi": "कक्षा 6: साक्ष्य की नज़र"
    },
    "objective": {
      "en": "Distinguish evidence from a preference.",
      "hi": "साक्ष्य को पसंद से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which gives measurable evidence about a plant?",
          "hi": "पौधे के बारे में कौन-सी बात मापने योग्य साक्ष्य देती है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "evidence",
            "picture": "📏",
            "label": {
              "en": "Its height was 12 cm on Monday",
              "hi": "सोमवार को इसकी ऊँचाई 12 सेमी थी"
            }
          },
          {
            "id": "preference",
            "picture": "💭",
            "label": {
              "en": "I like it more than other plants",
              "hi": "मुझे यह दूसरे पौधों से अधिक पसंद है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "evidence"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-6-explore-3",
    "revision": 1,
    "placements": [
      "school:6"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 6: Design a solution",
      "hi": "कक्षा 6: समाधान की रचना"
    },
    "objective": {
      "en": "Sketch a design and identify an unanswered question.",
      "hi": "रचना का चित्र बनाकर एक अनसुलझा प्रश्न पहचानना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a shaded rest space. Explain who it helps and one thing you still need to check.",
          "hi": "छाँव वाली आराम की जगह बनाओ। बताओ किसे मदद मिलेगी और क्या जाँचना बाकी है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-7-explore-1",
    "revision": 1,
    "placements": [
      "school:7"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 7: Systems studio",
      "hi": "कक्षा 7: सिस्टम स्टूडियो"
    },
    "objective": {
      "en": "Explore input and output with a small simulation.",
      "hi": "छोटे अनुकरण में इनपुट और आउटपुट का संबंध देखना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Each solar panel makes 2 units in this simplified model. Choose a panel count, observe output, then explain the rule.",
          "hi": "इस सरल मॉडल में हर सौर पैनल 2 इकाई बनाता है। पैनल चुनो, आउटपुट देखो और नियम समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "1 panel",
              "hi": "1 पैनल"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "2 panels",
              "hi": "2 पैनल"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3 panels",
              "hi": "3 पैनल"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-7-explore-2",
    "revision": 1,
    "placements": [
      "school:7"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 7: Evidence lens",
      "hi": "कक्षा 7: साक्ष्य की नज़र"
    },
    "objective": {
      "en": "Distinguish evidence from a preference.",
      "hi": "साक्ष्य को पसंद से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which gives measurable evidence about a plant?",
          "hi": "पौधे के बारे में कौन-सी बात मापने योग्य साक्ष्य देती है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "evidence",
            "picture": "📏",
            "label": {
              "en": "Its height was 12 cm on Monday",
              "hi": "सोमवार को इसकी ऊँचाई 12 सेमी थी"
            }
          },
          {
            "id": "preference",
            "picture": "💭",
            "label": {
              "en": "I like it more than other plants",
              "hi": "मुझे यह दूसरे पौधों से अधिक पसंद है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "evidence"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-7-explore-3",
    "revision": 1,
    "placements": [
      "school:7"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 7: Design a solution",
      "hi": "कक्षा 7: समाधान की रचना"
    },
    "objective": {
      "en": "Sketch a design and identify an unanswered question.",
      "hi": "रचना का चित्र बनाकर एक अनसुलझा प्रश्न पहचानना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a shaded rest space. Explain who it helps and one thing you still need to check.",
          "hi": "छाँव वाली आराम की जगह बनाओ। बताओ किसे मदद मिलेगी और क्या जाँचना बाकी है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-8-explore-1",
    "revision": 1,
    "placements": [
      "school:8"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 8: Systems studio",
      "hi": "कक्षा 8: सिस्टम स्टूडियो"
    },
    "objective": {
      "en": "Explore input and output with a small simulation.",
      "hi": "छोटे अनुकरण में इनपुट और आउटपुट का संबंध देखना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Each solar panel makes 2 units in this simplified model. Choose a panel count, observe output, then explain the rule.",
          "hi": "इस सरल मॉडल में हर सौर पैनल 2 इकाई बनाता है। पैनल चुनो, आउटपुट देखो और नियम समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "1 panel",
              "hi": "1 पैनल"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "2 panels",
              "hi": "2 पैनल"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "3 panels",
              "hi": "3 पैनल"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-8-explore-2",
    "revision": 1,
    "placements": [
      "school:8"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 8: Evidence lens",
      "hi": "कक्षा 8: साक्ष्य की नज़र"
    },
    "objective": {
      "en": "Distinguish evidence from a preference.",
      "hi": "साक्ष्य को पसंद से अलग करना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Which gives measurable evidence about a plant?",
          "hi": "पौधे के बारे में कौन-सी बात मापने योग्य साक्ष्य देती है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "evidence",
            "picture": "📏",
            "label": {
              "en": "Its height was 12 cm on Monday",
              "hi": "सोमवार को इसकी ऊँचाई 12 सेमी थी"
            }
          },
          {
            "id": "preference",
            "picture": "💭",
            "label": {
              "en": "I like it more than other plants",
              "hi": "मुझे यह दूसरे पौधों से अधिक पसंद है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "evidence"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-8-explore-3",
    "revision": 1,
    "placements": [
      "school:8"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 8: Design a solution",
      "hi": "कक्षा 8: समाधान की रचना"
    },
    "objective": {
      "en": "Sketch a design and identify an unanswered question.",
      "hi": "रचना का चित्र बनाकर एक अनसुलझा प्रश्न पहचानना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a shaded rest space. Explain who it helps and one thing you still need to check.",
          "hi": "छाँव वाली आराम की जगह बनाओ। बताओ किसे मदद मिलेगी और क्या जाँचना बाकी है।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-9-explore-1",
    "revision": 1,
    "placements": [
      "school:9"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 9: Model workshop",
      "hi": "कक्षा 9: मॉडल कार्यशाला"
    },
    "objective": {
      "en": "Test a simplified model and describe its limits.",
      "hi": "सरल मॉडल परखकर उसकी सीमाएँ बताना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Model output is twice the input. Choose an input and observe. This does not model weather or losses. What would you add?",
          "hi": "मॉडल का आउटपुट इनपुट से दोगुना है। इनपुट चुनकर देखो। इसमें मौसम या हानि नहीं है। तुम क्या जोड़ोगे?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "Input 1",
              "hi": "इनपुट 1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Input 2",
              "hi": "इनपुट 2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Input 3",
              "hi": "इनपुट 3"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-9-explore-2",
    "revision": 1,
    "placements": [
      "school:9"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 9: Claim checkpoint",
      "hi": "कक्षा 9: दावे की जाँच"
    },
    "objective": {
      "en": "Identify the limits of a small observation.",
      "hi": "छोटे अवलोकन की सीमाएँ पहचानना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Three plants grew faster with more light. Which claim fits this evidence?",
          "hi": "तीन पौधे अधिक रोशनी में तेज़ बढ़े। कौन-सा दावा इस साक्ष्य के अनुसार है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "bounded",
            "picture": "🔎",
            "label": {
              "en": "These three plants grew faster in this observation",
              "hi": "इस अवलोकन में ये तीन पौधे तेज़ बढ़े"
            }
          },
          {
            "id": "absolute",
            "picture": "🌍",
            "label": {
              "en": "Every plant always grows faster in more light",
              "hi": "हर पौधा हमेशा अधिक रोशनी में तेज़ बढ़ता है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "bounded"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-9-explore-3",
    "revision": 1,
    "placements": [
      "school:9"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 9: Project canvas",
      "hi": "कक्षा 9: परियोजना का चित्र"
    },
    "objective": {
      "en": "Represent an idea and a testable next step.",
      "hi": "विचार और परखने योग्य अगला कदम दिखाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a useful project. Explain the problem, intended user, and one test you could run.",
          "hi": "उपयोगी परियोजना बनाओ। समस्या, उपयोगकर्ता और एक संभावित जाँच समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-10-explore-1",
    "revision": 1,
    "placements": [
      "school:10"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 10: Model workshop",
      "hi": "कक्षा 10: मॉडल कार्यशाला"
    },
    "objective": {
      "en": "Test a simplified model and describe its limits.",
      "hi": "सरल मॉडल परखकर उसकी सीमाएँ बताना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Model output is twice the input. Choose an input and observe. This does not model weather or losses. What would you add?",
          "hi": "मॉडल का आउटपुट इनपुट से दोगुना है। इनपुट चुनकर देखो। इसमें मौसम या हानि नहीं है। तुम क्या जोड़ोगे?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "Input 1",
              "hi": "इनपुट 1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Input 2",
              "hi": "इनपुट 2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Input 3",
              "hi": "इनपुट 3"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-10-explore-2",
    "revision": 1,
    "placements": [
      "school:10"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 10: Claim checkpoint",
      "hi": "कक्षा 10: दावे की जाँच"
    },
    "objective": {
      "en": "Identify the limits of a small observation.",
      "hi": "छोटे अवलोकन की सीमाएँ पहचानना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Three plants grew faster with more light. Which claim fits this evidence?",
          "hi": "तीन पौधे अधिक रोशनी में तेज़ बढ़े। कौन-सा दावा इस साक्ष्य के अनुसार है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "bounded",
            "picture": "🔎",
            "label": {
              "en": "These three plants grew faster in this observation",
              "hi": "इस अवलोकन में ये तीन पौधे तेज़ बढ़े"
            }
          },
          {
            "id": "absolute",
            "picture": "🌍",
            "label": {
              "en": "Every plant always grows faster in more light",
              "hi": "हर पौधा हमेशा अधिक रोशनी में तेज़ बढ़ता है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "bounded"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-10-explore-3",
    "revision": 1,
    "placements": [
      "school:10"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 10: Project canvas",
      "hi": "कक्षा 10: परियोजना का चित्र"
    },
    "objective": {
      "en": "Represent an idea and a testable next step.",
      "hi": "विचार और परखने योग्य अगला कदम दिखाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a useful project. Explain the problem, intended user, and one test you could run.",
          "hi": "उपयोगी परियोजना बनाओ। समस्या, उपयोगकर्ता और एक संभावित जाँच समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-11-explore-1",
    "revision": 1,
    "placements": [
      "school:11"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 11: Model workshop",
      "hi": "कक्षा 11: मॉडल कार्यशाला"
    },
    "objective": {
      "en": "Test a simplified model and describe its limits.",
      "hi": "सरल मॉडल परखकर उसकी सीमाएँ बताना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Model output is twice the input. Choose an input and observe. This does not model weather or losses. What would you add?",
          "hi": "मॉडल का आउटपुट इनपुट से दोगुना है। इनपुट चुनकर देखो। इसमें मौसम या हानि नहीं है। तुम क्या जोड़ोगे?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "Input 1",
              "hi": "इनपुट 1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Input 2",
              "hi": "इनपुट 2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Input 3",
              "hi": "इनपुट 3"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-11-explore-2",
    "revision": 1,
    "placements": [
      "school:11"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 11: Claim checkpoint",
      "hi": "कक्षा 11: दावे की जाँच"
    },
    "objective": {
      "en": "Identify the limits of a small observation.",
      "hi": "छोटे अवलोकन की सीमाएँ पहचानना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Three plants grew faster with more light. Which claim fits this evidence?",
          "hi": "तीन पौधे अधिक रोशनी में तेज़ बढ़े। कौन-सा दावा इस साक्ष्य के अनुसार है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "bounded",
            "picture": "🔎",
            "label": {
              "en": "These three plants grew faster in this observation",
              "hi": "इस अवलोकन में ये तीन पौधे तेज़ बढ़े"
            }
          },
          {
            "id": "absolute",
            "picture": "🌍",
            "label": {
              "en": "Every plant always grows faster in more light",
              "hi": "हर पौधा हमेशा अधिक रोशनी में तेज़ बढ़ता है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "bounded"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-11-explore-3",
    "revision": 1,
    "placements": [
      "school:11"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 11: Project canvas",
      "hi": "कक्षा 11: परियोजना का चित्र"
    },
    "objective": {
      "en": "Represent an idea and a testable next step.",
      "hi": "विचार और परखने योग्य अगला कदम दिखाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a useful project. Explain the problem, intended user, and one test you could run.",
          "hi": "उपयोगी परियोजना बनाओ। समस्या, उपयोगकर्ता और एक संभावित जाँच समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-12-explore-1",
    "revision": 1,
    "placements": [
      "school:12"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 12: Model workshop",
      "hi": "कक्षा 12: मॉडल कार्यशाला"
    },
    "objective": {
      "en": "Test a simplified model and describe its limits.",
      "hi": "सरल मॉडल परखकर उसकी सीमाएँ बताना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Model output is twice the input. Choose an input and observe. This does not model weather or losses. What would you add?",
          "hi": "मॉडल का आउटपुट इनपुट से दोगुना है। इनपुट चुनकर देखो। इसमें मौसम या हानि नहीं है। तुम क्या जोड़ोगे?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "Input 1",
              "hi": "इनपुट 1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Input 2",
              "hi": "इनपुट 2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Input 3",
              "hi": "इनपुट 3"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-12-explore-2",
    "revision": 1,
    "placements": [
      "school:12"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 12: Claim checkpoint",
      "hi": "कक्षा 12: दावे की जाँच"
    },
    "objective": {
      "en": "Identify the limits of a small observation.",
      "hi": "छोटे अवलोकन की सीमाएँ पहचानना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Three plants grew faster with more light. Which claim fits this evidence?",
          "hi": "तीन पौधे अधिक रोशनी में तेज़ बढ़े। कौन-सा दावा इस साक्ष्य के अनुसार है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "bounded",
            "picture": "🔎",
            "label": {
              "en": "These three plants grew faster in this observation",
              "hi": "इस अवलोकन में ये तीन पौधे तेज़ बढ़े"
            }
          },
          {
            "id": "absolute",
            "picture": "🌍",
            "label": {
              "en": "Every plant always grows faster in more light",
              "hi": "हर पौधा हमेशा अधिक रोशनी में तेज़ बढ़ता है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "bounded"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-12-explore-3",
    "revision": 1,
    "placements": [
      "school:12"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 12: Project canvas",
      "hi": "कक्षा 12: परियोजना का चित्र"
    },
    "objective": {
      "en": "Represent an idea and a testable next step.",
      "hi": "विचार और परखने योग्य अगला कदम दिखाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a useful project. Explain the problem, intended user, and one test you could run.",
          "hi": "उपयोगी परियोजना बनाओ। समस्या, उपयोगकर्ता और एक संभावित जाँच समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  },
  {
    "id": "grade-13-explore-1",
    "revision": 1,
    "placements": [
      "school:13"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 13: Model workshop",
      "hi": "कक्षा 13: मॉडल कार्यशाला"
    },
    "objective": {
      "en": "Test a simplified model and describe its limits.",
      "hi": "सरल मॉडल परखकर उसकी सीमाएँ बताना।"
    },
    "interaction": "simulation",
    "steps": [
      {
        "instruction": {
          "en": "Model output is twice the input. Choose an input and observe. This does not model weather or losses. What would you add?",
          "hi": "मॉडल का आउटपुट इनपुट से दोगुना है। इनपुट चुनकर देखो। इसमें मौसम या हानि नहीं है। तुम क्या जोड़ोगे?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "1",
            "picture": "1",
            "label": {
              "en": "Input 1",
              "hi": "इनपुट 1"
            }
          },
          {
            "id": "2",
            "picture": "2",
            "label": {
              "en": "Input 2",
              "hi": "इनपुट 2"
            }
          },
          {
            "id": "3",
            "picture": "3",
            "label": {
              "en": "Input 3",
              "hi": "इनपुट 3"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-13-explore-2",
    "revision": 1,
    "placements": [
      "school:13"
    ],
    "domain": "discovery",
    "title": {
      "en": "Grade 13: Claim checkpoint",
      "hi": "कक्षा 13: दावे की जाँच"
    },
    "objective": {
      "en": "Identify the limits of a small observation.",
      "hi": "छोटे अवलोकन की सीमाएँ पहचानना।"
    },
    "interaction": "investigation",
    "steps": [
      {
        "instruction": {
          "en": "Three plants grew faster with more light. Which claim fits this evidence?",
          "hi": "तीन पौधे अधिक रोशनी में तेज़ बढ़े। कौन-सा दावा इस साक्ष्य के अनुसार है?"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "bounded",
            "picture": "🔎",
            "label": {
              "en": "These three plants grew faster in this observation",
              "hi": "इस अवलोकन में ये तीन पौधे तेज़ बढ़े"
            }
          },
          {
            "id": "absolute",
            "picture": "🌍",
            "label": {
              "en": "Every plant always grows faster in more light",
              "hi": "हर पौधा हमेशा अधिक रोशनी में तेज़ बढ़ता है"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        },
        "answer": "bounded"
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "participated-in-all-steps"
  },
  {
    "id": "grade-13-explore-3",
    "revision": 1,
    "placements": [
      "school:13"
    ],
    "domain": "creative",
    "title": {
      "en": "Grade 13: Project canvas",
      "hi": "कक्षा 13: परियोजना का चित्र"
    },
    "objective": {
      "en": "Represent an idea and a testable next step.",
      "hi": "विचार और परखने योग्य अगला कदम दिखाना।"
    },
    "interaction": "creation",
    "steps": [
      {
        "instruction": {
          "en": "Sketch a useful project. Explain the problem, intended user, and one test you could run.",
          "hi": "उपयोगी परियोजना बनाओ। समस्या, उपयोगकर्ता और एक संभावित जाँच समझाओ।"
        },
        "hint": {
          "en": "Look closely. Ask your grown-up to name each picture with you.",
          "hi": "ध्यान से देखो। अपने बड़े के साथ हर चित्र का नाम बोलो।"
        },
        "items": [
          {
            "id": "leaf",
            "picture": "🍃",
            "label": {
              "en": "Leaf",
              "hi": "पत्ता"
            }
          },
          {
            "id": "sun",
            "picture": "☀️",
            "label": {
              "en": "Sun",
              "hi": "सूरज"
            }
          },
          {
            "id": "water",
            "picture": "💧",
            "label": {
              "en": "Water",
              "hi": "पानी"
            }
          }
        ],
        "feedback": {
          "en": "You noticed a connection. Let us explore the next one.",
          "hi": "तुमने एक संबंध देखा। अब अगला देखें।"
        }
      }
    ],
    "offline": {
      "en": "Explain your idea to someone, or continue on paper.",
      "hi": "अपना विचार किसी को समझाओ या कागज़ पर आगे बनाओ।"
    },
    "caregiver": {
      "en": "Stay nearby. Read or play the instruction, let the child choose, and stop when they have had enough. Use large safe objects; avoid small loose pieces.",
      "hi": "पास रहें। निर्देश पढ़ें या सुनाएँ, बच्चे को चुनने दें और मन भरने पर रुकें। बड़े सुरक्षित सामान लें; छोटे खुले टुकड़े न दें।"
    },
    "alignment": "general-exploration",
    "source": "Original curriculum-neutral guided exploration",
    "rights": "original-text-and-system-emoji",
    "review": {
      "status": "reviewed",
      "method": "source-grounded-editorial",
      "date": "2026-10-03",
      "checks": [
        "factual: observable everyday objects or explicitly open-ended creation",
        "developmental: one action, no timer, caregiver scaffolding, short session",
        "language: separate English and Hindi prompts; no inferred phoneme equivalents",
        "accessibility: named controls, spoken/text instructions, tap and keyboard",
        "rights: original prompts and system-rendered emoji"
      ],
      "limits": "Editorial review by the implementing agent; not a claim of independent educator validation or child usability research. Local speech availability varies."
    },
    "completion": "saved-creation"
  }
];
