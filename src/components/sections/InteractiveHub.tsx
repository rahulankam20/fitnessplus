"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import Button from "@/components/ui/Button";

// Dynamic imports for Three.js canvases to skip SSR
const HologramCanvas = dynamic(
  () => import("@/components/three/HologramModel").then((mod) => {
    // Wrap it in a Three Canvas environment locally
    const { Canvas } = require("@react-three/fiber");
    const { Preload } = require("@react-three/drei");
    const THREE = require("three");
    
    return function DynamicHoloWrapper({ weight, height, goal }: any) {
      return (
        <div className="w-full h-full relative aspect-square md:aspect-video rounded-xl overflow-hidden glass border border-white/5">
          <Canvas
            camera={{ position: [0, 0, 3.2], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <mod.default weight={weight} height={height} goal={goal} />
            <Preload all />
          </Canvas>
          {/* Cyberpunk HUD Overlays */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-white/40 pointer-events-none space-y-1">
            <div>SYS_MODEL: HUMAN_GRID_v4.2</div>
            <div>STATUS: ONLINE</div>
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/40 pointer-events-none text-right">
            <div>SCANNING ACTIVE</div>
            <div className="text-red-500 animate-pulse">● REC_PROFILE</div>
          </div>
          {/* HUD Corner decors */}
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/10 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/10 pointer-events-none" />
        </div>
      );
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square md:aspect-video rounded-xl border border-white/5 bg-[#030303] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-gray-500 font-mono">INITIALIZING HOLOGRAPHIC SCANNER...</div>
        </div>
      </div>
    ),
  }
);

const ShowroomCanvas = dynamic(
  () => import("@/components/three/EquipmentShowroomScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square md:aspect-video rounded-xl border border-white/5 bg-[#030303] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-gray-500 font-mono">LOADING 3D SHOWROOM PEDESTAL...</div>
        </div>
      </div>
    ),
  }
);

interface InteractiveHubProps {
  setPrefilledMessage: (message: string) => void;
}

export default function InteractiveHub({ setPrefilledMessage }: InteractiveHubProps) {
  const [activeTab, setActiveTab] = useState<"planner" | "showroom">("planner");
  
  // Goal Planner States
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [goal, setGoal] = useState<"muscle" | "fat" | "fitness">("muscle");
  const [planApplied, setPlanApplied] = useState(false);

  // Equipment Showroom States
  const [showroomEquipment, setShowroomEquipment] = useState<"dumbbell" | "kettlebell" | "barbell">("barbell");

  // Dynamic calculations
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const bmiNumber = parseFloat(bmi);

  let bmiCategory = "";
  let bmiColor = "text-white";
  let bmiBorderGlow = "border-white/10";
  
  if (bmiNumber < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "text-blue-400";
    bmiBorderGlow = "shadow-[0_0_15px_rgba(96,165,250,0.15)] border-blue-500/20";
  } else if (bmiNumber >= 18.5 && bmiNumber <= 24.9) {
    bmiCategory = "Healthy Weight";
    bmiColor = "text-emerald-400";
    bmiBorderGlow = "shadow-[0_0_15px_rgba(52,211,153,0.15)] border-emerald-500/20";
  } else if (bmiNumber >= 25.0 && bmiNumber <= 29.9) {
    bmiCategory = "Overweight";
    bmiColor = "text-orange-400";
    bmiBorderGlow = "shadow-[0_0_15px_rgba(251,146,60,0.15)] border-orange-500/20";
  } else {
    bmiCategory = "Obese";
    bmiColor = "text-red-400";
    bmiBorderGlow = "shadow-[0_0_20px_rgba(248,113,113,0.2)] border-red-500/25";
  }

  const recommendations = {
    muscle: {
      program: "Strength & Progressive Overload hypertrophy program.",
      equipment: "Olympic Barbells, Heavy Free Weights, Cable Racks.",
      trainer: "Rohit Kapoor (Strength and Powerlifting Expert)",
      plan: "Pro Membership (includes 3x weekly training)",
      formMessage: `Hi! I calculated my profile on your 3D planner: Height ${height}cm, Weight ${weight}kg, BMI ${bmi} (${bmiCategory}). My goal is to BUILD MUSCLE. I'd like to sign up for a Pro plan and train with Rohit Kapoor.`,
    },
    fat: {
      program: "High Intensity Cardio & Metabolic Fat Burner Program.",
      equipment: "Cardio Zone (Treadmills, Rowers), Kettlebell circuits.",
      trainer: "Ananya Iyer (HIIT & Sustainable Weight Loss Coach)",
      plan: "Pro Membership (includes Custom Diet & HIIT guidance)",
      formMessage: `Hi! I calculated my profile on your 3D planner: Height ${height}cm, Weight ${weight}kg, BMI ${bmi} (${bmiCategory}). My goal is to LOSE FAT. I'd like to sign up for a Pro plan and get guidance from Ananya Iyer.`,
    },
    fitness: {
      program: "Functional strength, flexibility & athletic conditioning.",
      equipment: "Kettlebells, Pull-up Bars, Medicine Balls, Yoga Shala.",
      trainer: "Karan Joshi (Functional Movement & Recovery Specialist)",
      plan: "Basic Membership (with functional group classes)",
      formMessage: `Hi! I calculated my profile on your 3D planner: Height ${height}cm, Weight ${weight}kg, BMI ${bmi} (${bmiCategory}). My goal is GENERAL FITNESS & TONE. I'd like to get started with Karan Joshi.`,
    },
  }[goal];

  const handleApplyPlan = () => {
    setPrefilledMessage(recommendations.formMessage);
    setPlanApplied(true);
    setTimeout(() => setPlanApplied(false), 3000);

    // Scroll to contact form
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookEquipment = (equip: typeof showroomEquipment) => {
    const messages = {
      dumbbell: "Hi! I saw the 3D Dumbbells on your showroom and want to book a trial session focused on heavy free-weight arm/upper body training at your Kurla East gym.",
      kettlebell: "Hi! I am interested in kettlebell circuits and functional movement training. I saw the 3D Kettlebell in your showroom and want to book a session.",
      barbell: "Hi! I saw the 3D Olympic Barbell and support rack in your virtual showroom. I would like to schedule a trial workout to test your heavy lifting zones.",
    };
    setPrefilledMessage(messages[equip]);
    
    // Scroll to contact form
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const equipments = [
    {
      id: "barbell" as const,
      name: "Olympic Barbell & Rack",
      muscles: "Legs, Back, Full Body (Squats, Deadlifts, Clean & Press)",
      desc: "Industrial-grade chrome steel Olympic bar rated up to 600kg, sitting on a solid reinforced safety rack. Featuring premium bronze bushings for silky-smooth rotation.",
      tip: "Focus on driving your feet through the floor and lock your core before executing compound lifts like the deadlift.",
    },
    {
      id: "dumbbell" as const,
      name: "Hex Free-Weight Dumbbells",
      muscles: "Chest, Shoulders, Arms (Presses, Rows, Curls, Lateral Raises)",
      desc: "Heavy-duty rubberized hexagonal dumbbells from 2.5kg to 50kg. Contoured chrome handles ensure a slip-free grip during high-intensity lifting sets.",
      tip: "Keep a controlled, slower tempo on the eccentric (lowering) phase to maximize muscle fibers engagement.",
    },
    {
      id: "kettlebell" as const,
      name: "Cast Iron Kettlebell",
      muscles: "Hamstrings, Glutes, Core, Lower Back (Swings, Snatch, Goblets)",
      desc: "Single-cast solid iron kettlebells with flat powder-coat finishes. Highly durable and optimized for metabolic conditioning and functional athletic strength.",
      tip: "Initiate kettlebell swings through a hip hinge, snapping your hips forward powerfully instead of squatting or pulling with your arms.",
    },
  ];

  return (
    <SectionWrapper id="interactive-hub" className="gradient-dark relative">
      <div className="absolute inset-0 bg-radial-gradient-red opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            Virtual Experience
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <AnimatedText
              text="INTERACTIVE 3D HUB"
              as="h2"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              delay={0.1}
            />
            <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
              Visualize your fitness goals dynamically or interactively tour our premium equipment in full virtual 3D.
            </p>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl font-heading text-xs tracking-wider">
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-5 py-2.5 rounded-lg uppercase transition-all duration-300 ${
                activeTab === "planner"
                  ? "bg-red-600 text-white text-glow-subtle font-medium shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Goal & BMI Planner
            </button>
            <button
              onClick={() => setActiveTab("showroom")}
              className={`px-5 py-2.5 rounded-lg uppercase transition-all duration-300 ${
                activeTab === "showroom"
                  ? "bg-red-600 text-white text-glow-subtle font-medium shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3D Equipment Showroom
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "planner" ? (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Controls (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col justify-between glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-wide text-white mb-5">
                    CALCULATE YOUR STATS & PREVIEW GOALS
                  </h3>
                  
                  {/* Sliders */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs uppercase tracking-wider mb-2 font-mono">
                        <span className="text-gray-400">Height</span>
                        <span className="text-red-400 font-bold">{height} cm</span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs uppercase tracking-wider mb-2 font-mono">
                        <span className="text-gray-400">Weight</span>
                        <span className="text-red-400 font-bold">{weight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="150"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>
                  </div>

                  {/* Goal Buttons */}
                  <div className="mt-8">
                    <span className="block text-xs uppercase tracking-wider mb-3 font-mono text-gray-400">
                      Primary Fitness Goal
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {(["muscle", "fat", "fitness"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGoal(g)}
                          className={`py-3 px-3 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-300 border ${
                            goal === g
                              ? "bg-white/[0.08] text-white border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
                              : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 hover:text-white"
                          }`}
                        >
                          {g === "muscle" ? "Build Muscle" : g === "fat" ? "Lose Fat" : "Tone & Health"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BMI & Recommendation Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BMI Widget */}
                  <div className={`p-4 rounded-xl border bg-white/[0.01] transition-all duration-500 ${bmiBorderGlow}`}>
                    <span className="text-[10px] tracking-wider uppercase font-mono text-gray-500 block">Calculated BMI</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-heading text-4xl font-bold tracking-tight text-white">{bmi}</span>
                      <span className={`text-xs font-mono font-medium ${bmiColor}`}>{bmiCategory}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed font-sans">
                      BMI is a quick screen of body mass. A custom assessment will determine your true fat-to-muscle ratio.
                    </p>
                  </div>

                  {/* Program Recommendation Widget */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-mono text-gray-500 block">Recommendation</span>
                      <div className="text-white text-xs font-medium mt-1 font-sans">
                        <strong className="text-red-400 block font-heading tracking-wide">PROGRAM:</strong>
                        {recommendations.program}
                      </div>
                      <div className="text-gray-400 text-[11px] mt-2 leading-relaxed">
                        <strong className="text-white">Trainer:</strong> {recommendations.trainer}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    pulse
                    onClick={handleApplyPlan}
                    className="w-full justify-center"
                  >
                    {planApplied ? "✓ Profile Loaded below!" : "Claim Free Trial for this Program"}
                  </Button>
                  <p className="text-center text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-wide">
                    Pre-fills contact form with your calculated stats & schedules consultation.
                  </p>
                </div>
              </div>

              {/* 3D Canvas (5 Columns) */}
              <div className="lg:col-span-5 h-[350px] lg:h-auto min-h-[400px]">
                <HologramCanvas weight={weight} height={height} goal={goal} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="showroom"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Sidebar selectors (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col justify-between glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-wide text-white mb-6">
                    SELECT A 3D MACHINE OR TOOL
                  </h3>
                  
                  {/* Selector List */}
                  <div className="space-y-3">
                    {equipments.map((equip) => (
                      <button
                        key={equip.id}
                        onClick={() => setShowroomEquipment(equip.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                          showroomEquipment === equip.id
                            ? "bg-white/[0.04] border-red-500/40 shadow-[0_0_15px_rgba(255,0,0,0.06)]"
                            : "bg-white/[0.01] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-heading text-lg font-bold tracking-wide ${
                            showroomEquipment === equip.id ? "text-red-400" : "text-white"
                          }`}>
                            {equip.name}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {equip.id === "barbell" ? "3D_BAR" : equip.id === "dumbbell" ? "3D_DUMB" : "3D_KETTLE"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2 font-mono line-clamp-1">
                          Targets: {equip.muscles}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Equipment Details */}
                  {(() => {
                    const active = equipments.find((e) => e.id === showroomEquipment)!;
                    return (
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 border-t border-white/5 pt-5 space-y-4 font-sans"
                      >
                        <div>
                          <span className="text-[10px] tracking-wider uppercase font-mono text-gray-500 block mb-1">Equipment Specs</span>
                          <p className="text-gray-400 text-xs leading-relaxed">{active.desc}</p>
                        </div>
                        
                        <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/10">
                          <span className="text-[10px] tracking-wider uppercase font-mono text-red-400 block mb-1">Trainer Tip</span>
                          <p className="text-gray-300 text-xs italic leading-relaxed">
                            &quot;{active.tip}&quot;
                          </p>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    pulse
                    onClick={() => handleBookEquipment(showroomEquipment)}
                    className="w-full justify-center"
                  >
                    Inquire about {equipments.find((e) => e.id === showroomEquipment)!.name}
                  </Button>
                </div>
              </div>

              {/* 3D Model Scene (7 Columns) */}
              <div className="lg:col-span-7 h-[400px] lg:h-auto min-h-[400px] flex flex-col justify-between">
                <div className="flex-grow">
                  <ShowroomCanvas activeItem={showroomEquipment} />
                </div>
                <p className="text-center text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-3 animate-pulse">
                  ← Drag on 3D Viewport to Orbit Object • Scroll to Zoom →
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
