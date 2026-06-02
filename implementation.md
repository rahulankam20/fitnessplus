# Fitness Plus Gym – Immersive 3D Website

Build a cinematic, production-ready 3D gym website for **Fitness Plus Gym – Kurla East, Mumbai** using Next.js App Router, Tailwind CSS, Framer Motion, and React Three Fiber + Drei.

---

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS Version**: The user explicitly requested Tailwind CSS. I will use **Tailwind CSS v4** (latest, shipped with `create-next-app@latest`). Please confirm.

> [!IMPORTANT]
> **No External 3D Models**: All 3D objects (dumbbell, kettlebell, geometric shapes) will be built from **primitive geometries** (cylinders, spheres, tori) with realistic metallic materials. No `.glb` files need to be sourced or downloaded.

> [!WARNING]
> **Performance on Low-End Devices**: The 3D hero section with particles, dynamic lighting, and parallax will be GPU-intensive. I'll implement a performance fallback that disables particles and reduces quality on mobile/low-end devices.

---

## Proposed Changes

### 1. Project Scaffolding

#### Command
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

#### Additional Dependencies
```bash
npm install three @react-three/fiber @react-three/drei framer-motion
npm install -D @types/three
```

---

### 2. Folder Structure

```
c:\gym website\
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata, global providers)
│   │   ├── page.tsx            # Main landing page (assembles all sections)
│   │   ├── globals.css         # Tailwind directives + custom CSS variables
│   │   └── loading.tsx         # Heartbeat/pulse loading animation
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable CTA button (glow + pulse)
│   │   │   ├── Card.tsx        # Glassmorphism tilt card
│   │   │   ├── SectionWrapper.tsx  # Scroll-triggered section container
│   │   │   └── AnimatedText.tsx    # Staggered text reveal component
│   │   ├── sections/
│   │   │   ├── Hero.tsx        # Hero section (3D canvas + overlay)
│   │   │   ├── About.tsx       # About / philosophy section
│   │   │   ├── Services.tsx    # Services grid with animated cards
│   │   │   ├── WhyChooseUs.tsx # Benefits with icon animations
│   │   │   ├── CallToAction.tsx # Final CTA banner
│   │   │   └── Footer.tsx      # Footer with location + socials
│   │   └── three/
│   │       ├── HeroScene.tsx   # Main 3D scene (Canvas wrapper)
│   │       ├── Dumbbell.tsx    # 3D dumbbell model (primitives)
│   │       ├── Kettlebell.tsx  # 3D kettlebell model (primitives)
│   │       ├── Particles.tsx   # Floating particle system
│   │       ├── Lighting.tsx    # Scene lighting setup
│   │       └── GeometricShapes.tsx # Abstract transition shapes
│   └── lib/
│       └── constants.ts        # Brand colors, text content, config
├── public/
│   └── (empty – no external assets needed)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

### 3. Component Breakdown

---

#### Root Layout & Page

##### [NEW] [layout.tsx](file:///c:/gym%20website/src/app/layout.tsx)
- Import Google Font (`Oswald` for headings, `Inter` for body) via `next/font/google`
- Set HTML metadata (title, description, Open Graph tags)
- Apply dark background globally
- Wrap children in Framer Motion `AnimatePresence`

##### [NEW] [page.tsx](file:///c:/gym%20website/src/app/page.tsx)
- Assemble all sections in order: Hero → About → Services → WhyChooseUs → CTA → Footer
- Use `dynamic()` import for Hero (3D scene) with `ssr: false` to avoid SSR issues with Three.js

##### [NEW] [loading.tsx](file:///c:/gym%20website/src/app/loading.tsx)
- Heartbeat-style pulse animation using Framer Motion
- Dark background, centered red pulsing circle

##### [NEW] [globals.css](file:///c:/gym%20website/src/app/globals.css)
- Tailwind directives (`@import "tailwindcss"`)
- Custom CSS variables for neon glow, glassmorphism
- Custom utilities for text-glow, box-glow effects
- Smooth scrolling behavior

---

#### UI Components (Reusable)

##### [NEW] [Button.tsx](file:///c:/gym%20website/src/components/ui/Button.tsx)
- Variants: `primary` (red glow), `secondary` (outline)
- Framer Motion: `whileHover` scale 1.05, `whileTap` scale 0.95
- Infinite subtle pulse animation on primary CTA
- Red glow shadow effect via Tailwind

##### [NEW] [Card.tsx](file:///c:/gym%20website/src/components/ui/Card.tsx)
- Glassmorphism panel (backdrop-blur, semi-transparent bg)
- Mouse-tracking tilt effect using `onMouseMove` + CSS transform
- Framer Motion hover lift animation
- Glowing red border on hover

##### [NEW] [SectionWrapper.tsx](file:///c:/gym%20website/src/components/ui/SectionWrapper.tsx)
- Wraps each page section
- Uses Framer Motion `useInView` for scroll-triggered fade-in + slide-up
- Configurable delay and direction

##### [NEW] [AnimatedText.tsx](file:///c:/gym%20website/src/components/ui/AnimatedText.tsx)
- Split text into words/characters
- Staggered reveal animation using Framer Motion variants
- Supports heading and paragraph styles

---

#### Section Components

##### [NEW] [Hero.tsx](file:///c:/gym%20website/src/components/sections/Hero.tsx)
- Full-viewport height container
- Dynamically imports `HeroScene` (Canvas) with `ssr: false`
- Overlay with:
  - Animated headline: "YOUR FITNESS GOALS. OUR MISSION."
  - Subtext: "Empowering Wellness Journeys"
  - CTA Button: "Book a Session Now"
- Mouse position tracking for parallax overlay effect
- Scroll indicator animation at bottom

##### [NEW] [About.tsx](file:///c:/gym%20website/src/components/sections/About.tsx)
- Two-column layout (text + decorative element)
- AnimatedText for gym philosophy
- Subtle gradient divider
- Key stats (members count, years, trainers) with count-up animation

##### [NEW] [Services.tsx](file:///c:/gym%20website/src/components/sections/Services.tsx)
- Grid of 4 service cards (Strength, Cardio, Personal Training, Weight Loss)
- Each card uses the `Card` component with:
  - Icon (emoji or SVG)
  - Title + description
  - Hover tilt effect
- Staggered entrance animation

##### [NEW] [WhyChooseUs.tsx](file:///c:/gym%20website/src/components/sections/WhyChooseUs.tsx)
- 4-6 benefit items in a responsive grid
- Animated icons (scale + rotate on scroll reveal)
- Items: Expert Trainers, Modern Equipment, Flexible Hours, Proven Results, Supportive Community, Affordable Plans

##### [NEW] [CallToAction.tsx](file:///c:/gym%20website/src/components/sections/CallToAction.tsx)
- Full-width banner with gradient background
- Large heading: "Start Your Fitness Journey Today"
- CTA button with enhanced glow effect
- Subtle particle/shape background effect

##### [NEW] [Footer.tsx](file:///c:/gym%20website/src/components/sections/Footer.tsx)
- Dark footer with brand info
- Location: Kurla East, Mumbai, Maharashtra
- Instagram link: @fitnessplusthegym_kurlaeast
- Copyright notice

---

#### 3D Components (React Three Fiber)

##### [NEW] [HeroScene.tsx](file:///c:/gym%20website/src/components/three/HeroScene.tsx)
- `<Canvas>` wrapper with camera config (fov: 45, position)
- `<Suspense>` with fallback
- Contains: Dumbbell, Particles, Lighting
- Mouse-based camera parallax via `useFrame` + pointer state
- Performance monitor: reduce quality on frame drops

##### [NEW] [Dumbbell.tsx](file:///c:/gym%20website/src/components/three/Dumbbell.tsx)
- Built from primitives:
  - Central bar: cylinder (thin, long)
  - Weight plates: 4 cylinders (short, wide) at each end, stacked
  - Collars: thin cylinders
- Material: `MeshStandardMaterial` with metalness: 0.9, roughness: 0.2
- Colors: dark gunmetal for plates, silver for bar
- Auto-rotation animation via `useFrame`
- Subtle float/bob animation

##### [NEW] [Kettlebell.tsx](file:///c:/gym%20website/src/components/three/Kettlebell.tsx)
- Built from primitives:
  - Body: sphere (bottom-heavy)
  - Handle: torus (half-ring on top)
  - Base: flattened cylinder
- Same metallic material as dumbbell
- Used in Services section as decorative element

##### [NEW] [Particles.tsx](file:///c:/gym%20website/src/components/three/Particles.tsx)
- ~200 floating particles using `Points` + `PointMaterial` from Drei
- Random positions in a sphere volume
- Subtle drift animation via `useFrame`
- Red-tinted with low opacity (dust/sweat effect)

##### [NEW] [Lighting.tsx](file:///c:/gym%20website/src/components/three/Lighting.tsx)
- Ambient light (low intensity, warm)
- Directional key light (soft white, from top-right)
- Point light (red, for rim lighting effect)
- Optional spot light for dramatic effect

##### [NEW] [GeometricShapes.tsx](file:///c:/gym%20website/src/components/three/GeometricShapes.tsx)
- Abstract floating shapes (octahedron, icosahedron, torus)
- Wireframe or semi-transparent material
- Slow rotation animation
- Used as transition elements between sections

---

#### Configuration & Utilities

##### [NEW] [constants.ts](file:///c:/gym%20website/src/lib/constants.ts)
- Brand colors, section content, service data
- Navigation items
- Social links

##### [MODIFY] [tailwind.config.ts](file:///c:/gym%20website/tailwind.config.ts)
- Extend theme with custom colors (brand red, dark variants)
- Add custom animations (pulse-glow, float, tilt)
- Configure font families

##### [MODIFY] [next.config.ts](file:///c:/gym%20website/next.config.ts)
- Configure `transpilePackages` for Three.js if needed
- Enable webpack optimizations

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Primitive 3D models** (no .glb) | Zero external dependencies, fast loading, full control over materials |
| **Dynamic import for 3D** (`ssr: false`) | Three.js requires `window` — must skip SSR |
| **Framer Motion for UI, R3F `useFrame` for 3D** | Clean separation of animation concerns |
| **Glassmorphism cards** | Modern, premium feel matching the dark theme |
| **Component-level code splitting** | Only load 3D scene when visible |
| **CSS variables for glow effects** | Reusable, maintainable, performant |
| **Oswald + Inter fonts** | Athletic/condensed heading + clean readable body |

---

## Open Questions

> [!NOTE]
> **No blockers identified.** The plan is self-contained and can proceed as-is. All 3D objects will be built from primitives (no external models needed).

---

## Verification Plan

### Automated Tests
```bash
npm run build    # Ensure production build succeeds
npm run lint     # Check for lint errors
```

### Manual Verification (Browser)
- Launch dev server (`npm run dev`)
- Open in browser and verify:
  - 3D dumbbell renders and rotates in hero section
  - Particles float in background
  - Mouse movement creates parallax effect
  - Scroll triggers section animations
  - Cards tilt on hover
  - CTA button pulses and glows
  - Mobile responsiveness (resize browser)
  - Performance (check for frame drops)

### Browser Recording
- Record a full scroll-through of the website showing all animations and interactions
