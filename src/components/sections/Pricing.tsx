"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import Button from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/constants";

interface PricingProps {
  setPrefilledMessage: (message: string) => void;
}

// ============================================
// PricingCard - Individual pricing tier card
// ============================================

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof PRICING_PLANS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.2,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative group ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
    >
      {plan.highlighted && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-red-500/40 via-red-500/10 to-red-900/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div
        className={`relative glass-card rounded-2xl p-6 md:p-8 h-full flex flex-col ${
          plan.highlighted ? "border-red-500/30 bg-white/[0.06]" : ""
        }`}
      >
        {plan.badge && (
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold ${
              plan.highlighted
                ? "bg-red-600 text-white"
                : "bg-white/10 text-white/60 border border-white/10"
            }`}
          >
            {plan.badge}
          </div>
        )}

        <h3 className="font-heading text-2xl font-bold text-white tracking-wider mt-2 mb-2">
          {plan.name}
        </h3>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{plan.description}</p>

        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-gray-400 text-lg">Rs</span>
          <span
            className={`font-heading text-5xl md:text-6xl font-bold tracking-tight ${
              plan.highlighted ? "text-red-500 text-glow-subtle" : "text-white"
            }`}
          >
            {plan.price}
          </span>
          <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        <ul className="space-y-3 mb-8 flex-grow">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span
                className={`mt-0.5 text-xs ${
                  plan.highlighted ? "text-red-500" : "text-red-400/60"
                }`}
              >
                +
              </span>
              <span className="text-gray-400 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.highlighted ? "primary" : "secondary"}
          size="md"
          href="#contact"
          pulse={plan.highlighted}
          className="w-full justify-center"
        >
          {plan.highlighted ? "Get Started" : "Choose Plan"}
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// Pricing Section - Membership tiers grid
// ============================================

export default function Pricing({ setPrefilledMessage }: PricingProps) {
  return (
    <SectionWrapper id="pricing" className="relative">
      <div className="absolute inset-0 gradient-radial-red pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            Membership Plans
          </span>
        </motion.div>

        <div className="mb-4">
          <AnimatedText
            text="CHOOSE YOUR PLAN"
            as="h2"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            delay={0.1}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-base md:text-lg max-w-xl mb-14"
        >
          Flexible plans designed for every fitness level. No hidden fees, cancel anytime.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-start">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Dynamic Cost Configurator Tool */}
        <PricingCalculator setPrefilledMessage={setPrefilledMessage} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-xs tracking-wider mt-10 uppercase"
        >
          All plans include a free onboarding session and GST.
        </motion.p>
      </div>
    </SectionWrapper>
  );
}

// ============================================
// PricingCalculator - Interactive Custom Plan Cost Configurator
// ============================================

function PricingCalculator({ setPrefilledMessage }: { setPrefilledMessage: (msg: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "elite">("pro");
  const [months, setMonths] = useState<1 | 3 | 6 | 12>(3);
  const [hasTrainer, setHasTrainer] = useState(false);
  const [hasDiet, setHasDiet] = useState(false);
  const [hasRecovery, setHasRecovery] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);

  const planDetails = {
    basic: { name: "Basic", price: 1499 },
    pro: { name: "Pro", price: 2999 },
    elite: { name: "Elite", price: 4999 },
  }[selectedPlan];

  // Calculate pricing
  const addOnsCost = (hasTrainer ? 2000 : 0) + (hasDiet ? 600 : 0) + (hasRecovery ? 1000 : 0);
  const rawMonthly = planDetails.price + addOnsCost;

  // Discounts
  const discountPct = { 1: 0, 3: 10, 6: 15, 12: 25 }[months];
  const discountAmt = Math.round(rawMonthly * (discountPct / 100));
  const netMonthly = rawMonthly - discountAmt;
  const netTotal = netMonthly * months;
  const savedTotal = discountAmt * months;

  const handleLockIn = () => {
    const addOnsList = [];
    if (hasTrainer) addOnsList.push("Personal Training");
    if (hasDiet) addOnsList.push("Diet Guidance");
    if (hasRecovery) addOnsList.push("VIP Recovery Access");

    const message = `Hi! I created a custom gym package: Plan: ${planDetails.name}, Contract: ${months} Months, Add-ons: ${
      addOnsList.length > 0 ? addOnsList.join(", ") : "None"
    }. Calculated Price: Rs. ${netMonthly}/mo (Total: Rs. ${netTotal}). Please lock in this package for me!`;

    setPrefilledMessage(message);
    setLockedIn(true);
    setTimeout(() => setLockedIn(false), 3000);

    // Scroll to contact
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-16 glass-card p-6 md:p-8 rounded-2xl border border-red-500/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h3 className="font-heading text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
          Build a Custom Package & Calculate Savings
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Customize your contract and add services to unlock multi-month discounts up to 25% off.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Options (7 columns) */}
        <div className="lg:col-span-7 space-y-6 font-sans">
          {/* Base Plan Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              1. Choose Base Plan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["basic", "pro", "elite"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlan(p)}
                  className={`py-3 px-2 rounded-lg text-center border transition-all duration-300 font-heading tracking-wide ${
                    selectedPlan === p
                      ? "bg-white/[0.06] text-white border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.06)]"
                      : "bg-white/[0.01] text-gray-500 border-white/5 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <span className="block text-sm font-bold uppercase">{p}</span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">Rs.{p === "basic" ? "1,499" : p === "pro" ? "2,999" : "4,999"}/mo</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contract Duration */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              2. Contract Duration
            </label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {([1, 3, 6, 12] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-3 px-1 rounded-lg border transition-all duration-300 ${
                    months === m
                      ? "bg-white/[0.06] text-white border-red-500/50 font-bold shadow-[0_0_15px_rgba(255,0,0,0.06)]"
                      : "bg-white/[0.01] text-gray-500 border-white/5 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <span className="block text-sm font-heading">{m} {m === 1 ? "Month" : "Months"}</span>
                  <span className="block text-[10px] text-red-400 font-mono mt-0.5">
                    {m === 1 ? "0%" : m === 3 ? "10%" : m === 6 ? "15%" : "25%"} OFF
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              3. Premium Add-ons (Optional)
            </label>
            <div className="space-y-2.5">
              {[
                {
                  id: "trainer",
                  name: "Certified Personal Trainer",
                  cost: 2000,
                  desc: "One-on-one sessions for form, guidance, and drive.",
                  state: hasTrainer,
                  setter: setHasTrainer,
                },
                {
                  id: "diet",
                  name: "Personalized Nutrition Coach & Diet Charts",
                  cost: 600,
                  desc: "Monthly body composition checks + tailored diets.",
                  state: hasDiet,
                  setter: setHasDiet,
                },
                {
                  id: "recovery",
                  name: "VIP Recovery Zone Access (Sauna/Spa/Physio)",
                  cost: 1000,
                  desc: "Post-workout muscle relief and injury prevention checkups.",
                  state: hasRecovery,
                  setter: setHasRecovery,
                },
              ].map((addon) => (
                <label
                  key={addon.id}
                  className={`flex items-start gap-4 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                    addon.state ? "bg-white/[0.03] border-white/15" : "bg-transparent border-white/5 hover:border-white/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={addon.state}
                    onChange={(e) => addon.setter(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-500"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>{addon.name}</span>
                      <span className="text-red-400 font-mono">+Rs.{addon.cost}/mo</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{addon.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Cost breakdown (5 columns) */}
        <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="font-heading text-lg font-bold tracking-wider text-white border-b border-white/5 pb-2 mb-4 uppercase">
              Cost Summary
            </h4>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Base Plan ({planDetails.name})</span>
                <span className="text-white font-mono">Rs.{planDetails.price} / mo</span>
              </div>
              
              {addOnsCost > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Services Add-ons</span>
                  <span className="text-white font-mono">+Rs.{addOnsCost} / mo</span>
                </div>
              )}

              {discountAmt > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Contract Discount ({discountPct}%)</span>
                  <span className="font-mono">-Rs.{discountAmt} / mo</span>
                </div>
              )}

              <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                <span className="text-white font-bold uppercase text-sm">Monthly Total</span>
                <div className="text-right">
                  <span className="font-heading text-3xl font-bold text-red-500 text-glow-subtle">
                    Rs.{netMonthly}
                  </span>
                  <span className="text-gray-500 text-[10px] block">/ month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-4">
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>Full Contract ({months} mo)</span>
              <span className="text-white font-bold font-sans">Rs.{netTotal}</span>
            </div>

            {savedTotal > 0 && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/10 rounded-lg text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">
                  Total Contract Savings
                </span>
                <span className="text-base font-heading text-emerald-400 font-bold">
                  Rs.{savedTotal} Saved!
                </span>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              pulse
              onClick={handleLockIn}
              className="w-full justify-center text-glow-subtle"
            >
              {lockedIn ? "✓ Package Confirmed!" : "Lock In This Package Price"}
            </Button>
            <span className="block text-center text-[10px] text-gray-500 uppercase tracking-wider font-mono">
              Apply package to secure rate for your visit.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
