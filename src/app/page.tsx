"use client";

import { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import InteractiveHub from "@/components/sections/InteractiveHub";
import Trainers from "@/components/sections/Trainers";
import Testimonials from "@/components/sections/Testimonials";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Pricing from "@/components/sections/Pricing";
import Gallery from "@/components/sections/Gallery";
import CallToAction from "@/components/sections/CallToAction";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

// ============================================
// Main Page - Assembles all website sections
// Single-page landing with smooth scroll nav
// ============================================

export default function Home() {
  const [prefilledMessage, setPrefilledMessage] = useState("");

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Services />
      <div className="section-divider" />
      <InteractiveHub setPrefilledMessage={setPrefilledMessage} />
      <div className="section-divider" />
      <Trainers />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <WhyChooseUs />
      <div className="section-divider" />
      <Pricing setPrefilledMessage={setPrefilledMessage} />
      <div className="section-divider" />
      <Gallery />
      <div className="section-divider" />
      <CallToAction />
      <ContactForm prefilledMessage={prefilledMessage} />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
