// ============================================
// Fitness Plus Gym - Brand and content constants
// ============================================

export const BRAND = {
  name: "FITNESS PLUS",
  tagline: "Empowering Wellness Journeys",
  headline: "YOUR FITNESS GOALS.\nOUR MISSION.",
  subheading: "Empowering Wellness Journeys",
  cta: "Book a Session Now",
  location: "Kurla East, Mumbai, Maharashtra",
  instagram: "@fitnessplusthegym_kurlaeast",
  instagramUrl: "https://instagram.com/fitnessplusthegym_kurlaeast",
  phone: "+91 98765 43210",
  email: "info@fitnessplus.in",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Trainers", href: "#trainers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    id: "strength",
    title: "Strength Training",
    description:
      "Build raw power with expert-guided strength programs. From deadlifts to bench press, forge your strongest self with progressive overload training.",
    icon: "ST",
    gradient: "from-red-600/20 to-red-900/10",
  },
  {
    id: "cardio",
    title: "Cardio Programs",
    description:
      "Ignite your cardiovascular endurance with high-intensity interval training, treadmill sprints, and heart-pumping group sessions.",
    icon: "CD",
    gradient: "from-orange-600/20 to-red-900/10",
  },
  {
    id: "personal",
    title: "Personal Training",
    description:
      "One-on-one sessions with certified trainers who design custom programs based on your body type, goals, and timeline.",
    icon: "PT",
    gradient: "from-rose-600/20 to-red-900/10",
  },
  {
    id: "weight-loss",
    title: "Weight Loss Programs",
    description:
      "Science-backed fat loss programs combining nutrition guidance, HIIT workouts, and accountability tracking for visible results.",
    icon: "WL",
    gradient: "from-amber-600/20 to-red-900/10",
  },
] as const;

export const STATS = [
  { value: 500, suffix: "+", label: "Active Members" },
  { value: 10, suffix: "+", label: "Years of Excellence" },
  { value: 25, suffix: "+", label: "Expert Trainers" },
  { value: 15, suffix: "k+", label: "Transformations" },
] as const;

export const BENEFITS = [
  {
    title: "Expert Trainers",
    description: "Certified professionals with years of real-world training experience.",
    icon: "ET",
  },
  {
    title: "Modern Equipment",
    description: "Top-tier machines and free weights from leading global brands.",
    icon: "ME",
  },
  {
    title: "Flexible Hours",
    description: "Open 5 AM to 11 PM, 7 days a week. Train on your schedule.",
    icon: "FH",
  },
  {
    title: "Proven Results",
    description: "Thousands of success stories and body transformations.",
    icon: "PR",
  },
  {
    title: "Supportive Community",
    description: "A welcoming, motivating environment for all fitness levels.",
    icon: "SC",
  },
  {
    title: "Affordable Plans",
    description: "Premium fitness experience without the premium price tag.",
    icon: "AP",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Arjun Mehta",
    membership: "Elite Member",
    quote:
      "Fitness Plus completely transformed my lifestyle. Lost 18 kg in 6 months with their personal training program. The trainers genuinely care about your progress.",
    rating: 5,
    avatar: "AM",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    membership: "Pro Member",
    quote:
      "The community here is incredible. Every morning I look forward to my workout. The equipment is top-notch and the trainers push you just the right amount.",
    rating: 5,
    avatar: "PS",
  },
  {
    id: "t3",
    name: "Rajesh Patel",
    membership: "Elite Member",
    quote:
      "Best gym in Kurla East, hands down. I've been a member for 3 years and the consistency of quality is unmatched. Worth every rupee.",
    rating: 5,
    avatar: "RP",
  },
  {
    id: "t4",
    name: "Sneha Desai",
    membership: "Basic Member",
    quote:
      "As a beginner, I was nervous about joining. But the staff at Fitness Plus made me feel so welcome. The flexible hours fit perfectly around my job.",
    rating: 4,
    avatar: "SD",
  },
  {
    id: "t5",
    name: "Vikram Singh",
    membership: "Pro Member",
    quote:
      "I trained at 5 different gyms in Mumbai before finding Fitness Plus. The atmosphere, equipment, and coaching here is leagues above the rest.",
    rating: 5,
    avatar: "VS",
  },
] as const;

export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "1,499",
    period: "/month",
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Full gym access (6 AM - 11 PM)",
      "Locker and shower facility",
      "Basic fitness assessment",
      "Access to cardio zone",
      "Community group sessions",
    ],
    highlighted: false,
    badge: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "2,999",
    period: "/month",
    description: "For dedicated athletes who want structured guidance",
    features: [
      "Everything in Basic",
      "Personal trainer (3x/week)",
      "Custom workout plan",
      "Diet and nutrition guidance",
      "Monthly body composition",
      "Priority equipment access",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "elite",
    name: "Elite",
    price: "4,999",
    period: "/month",
    description: "The ultimate transformation package - no limits",
    features: [
      "Everything in Pro",
      "Daily personal training",
      "Advanced body analytics",
      "Supplement consultation",
      "Recovery and physiotherapy",
      "VIP lounge access",
      "Guest passes (2/month)",
    ],
    highlighted: false,
    badge: "Premium",
  },
] as const;

export const TRAINERS = [
  {
    id: "trainer1",
    name: "Rohit Kapoor",
    specialty: "Strength and Powerlifting",
    experience: "8+ years",
    bio: "NSCA certified. Specializes in progressive overload training and competition prep. Former national-level powerlifter.",
    avatar: "RK",
    certifications: ["NSCA-CPT", "CrossFit L2"],
  },
  {
    id: "trainer2",
    name: "Ananya Iyer",
    specialty: "HIIT and Weight Loss",
    experience: "6+ years",
    bio: "ACE certified personal trainer. Expert in metabolic conditioning and sustainable fat loss programs.",
    avatar: "AI",
    certifications: ["ACE-CPT", "Nutrition Coach"],
  },
  {
    id: "trainer3",
    name: "Karan Joshi",
    specialty: "Functional Training",
    experience: "5+ years",
    bio: "Functional movement specialist. Focuses on mobility, injury prevention, and sport-specific conditioning.",
    avatar: "KJ",
    certifications: ["FMS Certified", "TRX Qualified"],
  },
  {
    id: "trainer4",
    name: "Meera Nair",
    specialty: "Yoga and Recovery",
    experience: "10+ years",
    bio: "RYT-500 certified yoga instructor. Blends traditional yoga with modern recovery science for athletic performance.",
    avatar: "MN",
    certifications: ["RYT-500", "Rehab Specialist"],
  },
] as const;

export const COLORS = {
  primary: "#000000",
  secondary: "#FF0000",
  accent: "#ff2d2d",
  glow: "rgba(255, 0, 0, 0.6)",
  glowSoft: "rgba(255, 0, 0, 0.15)",
  darkBg: "#050505",
  cardBg: "rgba(255, 255, 255, 0.03)",
  cardBorder: "rgba(255, 255, 255, 0.06)",
} as const;
