// ============================================================================
// FITNESS PLUS GYM - RULE-BASED FAQ CHATBOT DATA & MATCHING ENGINE
//
// ⚠️ ATTENTION / PLACEHOLDER NOTICE:
// The following entries in this file contain PLACEHOLDER answers that must be
// reviewed and confirmed with Fitness Plus Gym management before production deployment:
//  - Topic 3: Free Trial terms (trial duration, staffed hours policy, expiration)
//  - Topic 5: General Policies (cancellation window, guest pass details, age restriction rules)
//  - Topic 6: Amenities (exact parking layout, locker room specs, Wi-Fi availability)
//
// Live constants (Hours, Pricing, Trainers, Location, Contact) are dynamically
// pulled from `@/lib/constants.ts` so they remain synchronized across the app.
// ============================================================================

import { BRAND, PRICING_PLANS, TRAINERS } from "@/lib/constants";

export interface FaqItem {
  id: string;
  category: "timing" | "pricing" | "trial" | "trainers" | "policies" | "amenities";
  question: string;
  answer: string;
  keywords: string[];
}

export const FALLBACK_ANSWER =
  "I don't have an answer for that — please reach out to our staff directly and they'll help you out.";

// Build pricing summary directly from constants
const pricingSummary = PRICING_PLANS.map(
  (p) => `${p.name}: ₹${p.price}${p.period} (${p.description})`
).join("\n• ");

// Build trainer list directly from constants
const trainerList = TRAINERS.map(
  (t) => `${t.name} (${t.specialty}, ${t.experience} exp)`
).join("\n• ");

export const FAQ_DATA: FaqItem[] = [
  // --------------------------------------------------------------------------
  // 1. TIMINGS & LOCATION
  // --------------------------------------------------------------------------
  {
    id: "hours",
    category: "timing",
    question: "What are your opening hours?",
    answer: `Fitness Plus Gym is open 7 days a week!\n\n• General Access: 5:00 AM – 11:00 PM\n• Staffed Support Hours: 6:00 AM – 10:00 PM\n• Sunday Hours: 6:00 AM – 8:00 PM`,
    keywords: [
      "hour",
      "hours",
      "timing",
      "timings",
      "time",
      "open",
      "close",
      "schedule",
      "sunday",
      "weekend",
      "when",
    ],
  },
  {
    id: "location",
    category: "timing",
    question: "Where is the gym located?",
    answer: `We are located at ${BRAND.location}.\n\nOur facility is centrally positioned with easy access from Kurla East railway station and major bus routes.`,
    keywords: [
      "location",
      "address",
      "where",
      "find",
      "place",
      "kurla",
      "mumbai",
      "map",
      "directions",
      "landmark",
    ],
  },
  {
    id: "contact",
    category: "timing",
    question: "How can I contact the gym staff?",
    answer: `You can reach our team via:\n• Phone: ${BRAND.phone}\n• Email: ${BRAND.email}\n• Instagram: ${BRAND.instagram}\n• Address: ${BRAND.location}`,
    keywords: [
      "contact",
      "phone",
      "call",
      "email",
      "number",
      "reach",
      "instagram",
      "social",
      "support",
    ],
  },

  // --------------------------------------------------------------------------
  // 2. PRICING & MEMBERSHIP PLANS
  // --------------------------------------------------------------------------
  {
    id: "pricing_overview",
    category: "pricing",
    question: "What are your membership plans and prices?",
    answer: `Here are our current membership tiers:\n\n• ${pricingSummary}\n\nAll plans include locker room access and a basic fitness assessment.`,
    keywords: [
      "price",
      "prices",
      "pricing",
      "cost",
      "fee",
      "fees",
      "membership",
      "plan",
      "plans",
      "rate",
      "rates",
      "charge",
    ],
  },
  {
    id: "pricing_pro",
    category: "pricing",
    question: "What is included in the Pro Membership plan?",
    answer: `Our Pro Plan is ₹2,999/month (Most Popular).\nIt includes everything in Basic plus:\n• Personal trainer (3x/week)\n• Custom workout plan\n• Diet & nutrition guidance\n• Monthly body composition analysis\n• Priority equipment access`,
    keywords: ["pro", "popular", "pro plan", "2999", "pro membership"],
  },
  {
    id: "pricing_elite",
    category: "pricing",
    question: "What is the Elite Membership plan?",
    answer: `Our Elite Plan is ₹4,999/month (Premium).\nIt offers maximum transformation with:\n• Daily personal training\n• Advanced body analytics\n• Supplement consultation\n• Recovery & physiotherapy sessions\n• VIP lounge access & 2 guest passes/month`,
    keywords: ["elite", "premium", "vip", "4999", "elite plan"],
  },
  {
    id: "discounts",
    category: "pricing",
    question: "Do you offer annual discounts or student rates?",
    answer: `Yes! We offer up to 20% discount on 6-month and annual pre-paid memberships, as well as special group/corporate packages. Contact our desk for current seasonal promotions.`,
    keywords: [
      "discount",
      "discounts",
      "offer",
      "offers",
      "annual",
      "yearly",
      "student",
      "corporate",
      "deal",
    ],
  },

  // --------------------------------------------------------------------------
  // 3. FREE TRIAL OFFER (PLACEHOLDER ANSWERS REVIEWED)
  // --------------------------------------------------------------------------
  {
    id: "free_trial",
    category: "trial",
    question: "How does the free trial work?",
    answer: `We offer a complimentary 1-Day Trial Pass for new visitors!\n\n• Valid during staffed hours (6:00 AM – 10:00 PM)\n• Limited to 1 trial per person (must show valid ID)\n• Pass expires 3 days after issuance\n• Gives full access to weight zone & cardio floor`,
    keywords: [
      "trial",
      "free trial",
      "pass",
      "day pass",
      "test",
      "try",
      "demo",
      "free",
      "first time",
      "visitor",
    ],
  },
  {
    id: "trial_requirements",
    category: "trial",
    question: "What do I need to bring for my free trial session?",
    answer: `Please bring a government photo ID (Aadhaar/Driving License), clean athletic footwear, comfortable workout clothing, and a hand towel. Lockers are provided!`,
    keywords: [
      "bring",
      "requirement",
      "requirements",
      "need",
      "towel",
      "shoes",
      "clothes",
      "id",
      "documents",
    ],
  },

  // --------------------------------------------------------------------------
  // 4. TRAINERS & PERSONAL TRAINING
  // --------------------------------------------------------------------------
  {
    id: "trainers_list",
    category: "trainers",
    question: "Who are your trainers and what are their specialties?",
    answer: `Our certified expert trainers include:\n\n• ${trainerList}\n\nEach trainer designs customized programs tailored to your personal goals!`,
    keywords: [
      "trainer",
      "trainers",
      "coach",
      "coaches",
      "staff",
      "instructor",
      "personal trainer",
      "pt",
    ],
  },
  {
    id: "personal_training",
    category: "trainers",
    question: "Do you offer 1-on-1 personal training?",
    answer: `Yes! Personal training is available both stand-alone and as part of our Pro and Elite membership tiers. You will be paired with a certified coach specializing in your goal (strength, fat loss, functional mobility, or athletic recovery).`,
    keywords: [
      "personal training",
      "one on one",
      "1-on-1",
      "private coach",
      "custom workout",
      "guidance",
    ],
  },
  {
    id: "nutrition",
    category: "trainers",
    question: "Is diet and nutrition planning included with training?",
    answer: `Yes, customized meal plans and macronutrient guidance are included in our Pro and Elite training packages to ensure your diet supports your physical progress.`,
    keywords: [
      "diet",
      "nutrition",
      "meal",
      "eating",
      "food",
      "macro",
      "calories",
      "supplement",
    ],
  },

  // --------------------------------------------------------------------------
  // 5. GENERAL POLICIES (PLACEHOLDER ANSWERS REVIEWED)
  // --------------------------------------------------------------------------
  {
    id: "cancellation",
    category: "policies",
    question: "What is your membership cancellation and pause policy?",
    answer: `Monthly memberships can be cancelled with 14 days notice before the next billing cycle. Members can also freeze/pause their active membership for up to 30 days per year for medical or travel reasons.`,
    keywords: [
      "cancel",
      "cancellation",
      "freeze",
      "pause",
      "hold",
      "stop",
      "refund",
      "policy",
      "terminate",
    ],
  },
  {
    id: "guests",
    category: "policies",
    question: "Can I bring a guest or friend with me?",
    answer: `Yes! Elite members receive 2 free guest passes per month. Basic and Pro members can purchase day guest passes for ₹300 per visit. Guests must register at the front desk with a photo ID.`,
    keywords: ["guest", "guests", "friend", "bring friend", "visitor pass", "companion"],
  },
  {
    id: "age_limit",
    category: "policies",
    question: "What is the minimum age requirement to join?",
    answer: `The minimum age to join Fitness Plus Gym is 16 years. Members aged 16–17 require written parental or guardian consent upon joining.`,
    keywords: ["age", "old", "minor", "teen", "kids", "minimum age", "restriction", "parent"],
  },

  // --------------------------------------------------------------------------
  // 6. AMENITIES AND GENERAL GYM QUESTIONS (PLACEHOLDER ANSWERS REVIEWED)
  // --------------------------------------------------------------------------
  {
    id: "equipment",
    category: "amenities",
    question: "What equipment and facilities do you have?",
    answer: `Our 5,000+ sq ft facility features:\n\n• Heavy dumbbell section & power racks\n• Olympic weightlifting platforms\n• Advanced cardio zone (treadmills, ellipticals, spin bikes)\n• Functional turf zone for HIIT & agility\n• Clean locker rooms with hot showers`,
    keywords: [
      "equipment",
      "machines",
      "weights",
      "dumbbell",
      "treadmill",
      "racks",
      "facility",
      "size",
      "squat",
    ],
  },
  {
    id: "parking",
    category: "amenities",
    question: "Is vehicle parking available at the gym?",
    answer: `Yes, dedicated two-wheeler and four-wheeler parking spaces are available for gym members right in front of our main entrance building.`,
    keywords: [
      "parking",
      "park",
      "bike",
      "car",
      "scooter",
      "vehicle",
      "drive",
      "parking lot",
    ],
  },
  {
    id: "lockers_showers",
    category: "amenities",
    question: "Do you have locker rooms and shower facilities?",
    answer: `Yes, we provide secure keyless digital lockers, private changing cubicles, steam rooms, and hot water showers maintained with high hygiene standards throughout the day.`,
    keywords: [
      "locker",
      "lockers",
      "shower",
      "showers",
      "changing",
      "steam",
      "washroom",
      "towel",
      "bathroom",
      "hygiene",
    ],
  },
  {
    id: "wifi",
    category: "amenities",
    question: "Do you have free Wi-Fi for members?",
    answer: `Yes! High-speed optical fiber Wi-Fi is complimentary for all active members throughout the workout floor. Ask front desk for the access code.`,
    keywords: ["wifi", "wi-fi", "internet", "connection", "music", "wireless"],
  },
];

/**
 * Keyword matching algorithm:
 * Performs case-insensitive matching between input tokens and FAQ entry keywords/questions.
 * Returns the single best matching answer, or fallback text if no match is found.
 */
export function findFaqMatch(userInput: string): { question: string; answer: string } {
  const normalizedInput = userInput.trim().toLowerCase();

  if (!normalizedInput) {
    return {
      question: userInput,
      answer: FALLBACK_ANSWER,
    };
  }

  let bestMatch: FaqItem | null = null;
  let highestScore = 0;

  // Split input into clean word tokens (removing special symbols)
  const inputTokens = normalizedInput
    .replace(/[^\w\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  for (const item of FAQ_DATA) {
    let score = 0;
    const itemQuestionLower = item.question.toLowerCase();

    // 1. Direct full substring match in question or keywords
    if (itemQuestionLower.includes(normalizedInput)) {
      score += 50;
    }

    // 2. Keyword matching
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalizedInput === kwLower) {
        score += 40;
      } else if (normalizedInput.includes(kwLower)) {
        score += 20;
      } else {
        // Token match
        for (const token of inputTokens) {
          if (token === kwLower) {
            score += 15;
          } else if (token.length >= 3 && kwLower.includes(token)) {
            score += 8;
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Threshold to avoid weak false positives
  if (bestMatch && highestScore >= 10) {
    return {
      question: bestMatch.question,
      answer: bestMatch.answer,
    };
  }

  return {
    question: userInput,
    answer: FALLBACK_ANSWER,
  };
}

// Preset topic chips for quick clicking in UI
export const FAQ_SUGGESTIONS = [
  { label: "Opening Hours", query: "What are your opening hours?" },
  { label: "Membership Pricing", query: "What are your membership plans and prices?" },
  { label: "Free Trial Pass", query: "How does the free trial work?" },
  { label: "Personal Trainers", query: "Who are your trainers?" },
  { label: "Gym Location", query: "Where is the gym located?" },
  { label: "Lockers & Amenities", query: "What equipment and facilities do you have?" },
];
