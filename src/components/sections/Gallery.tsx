"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import Image from "next/image";

// ============================================
// Gallery data â€“ gym atmosphere images
// ============================================

const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Weight Room",
    subtitle: "Premium Equipment",
    image: "/gallery/gym-weights.webp",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "g2",
    title: "Cardio Zone",
    subtitle: "Endurance Training",
    image: "/gallery/gym-cardio.webp",
    span: "",
  },
  {
    id: "g3",
    title: "Personal Training",
    subtitle: "Expert Guidance",
    image: "/gallery/gym-training.webp",
    span: "",
  },
  {
    id: "g4",
    title: "Community",
    subtitle: "Stronger Together",
    image: "/gallery/gym-community.webp",
    span: "md:col-span-2",
  },
];

// ============================================
// GalleryItem â€“ Individual image card
// ============================================

function GalleryItem({
  item,
  index,
}: {
  item: (typeof GALLERY_ITEMS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative overflow-hidden rounded-xl group cursor-pointer ${item.span}`}
    >
      {/* Image */}
      <div className="relative w-full h-64 md:h-full min-h-[250px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Gradient overlay â€“ always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay with red tint */}
      <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-red-500/30 transition-colors duration-500" />

      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-red-400/80 mb-1">
            {item.subtitle}
          </div>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-white tracking-wide">
            {item.title}
          </h3>
        </motion.div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 rounded-tr-lg" />
    </motion.div>
  );
}

// ============================================
// Gallery Section â€“ Gym atmosphere showcase
// ============================================

export default function Gallery() {
  return (
    <SectionWrapper id="gallery" className="gradient-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            Our Space
          </span>
        </motion.div>

        {/* Heading */}
        <div className="mb-4">
          <AnimatedText
            text="THE GYM EXPERIENCE"
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
          Step inside Fitness Plus â€” where modern equipment meets an unbeatable atmosphere.
        </motion.p>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[250px]">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
