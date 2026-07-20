Based on my thorough analysis of the codebase, here's a comprehensive bug report and quality assessment:
🔴 Critical Bugs
1. Three.js Canvas Memory Leaks & Cleanup Issues
- Files: HeroScene.tsx, EquipmentShowroomScene.tsx, HologramModel.tsx, all 3D components
- Issue: No dispose() on geometries/materials when components unmount. Three.js objects accumulate in memory.
- Impact: Memory leaks on page navigation, especially with dynamic imports (ssr: false)
2. SSR Hydration Mismatches with Dynamic Imports
- Files: Hero.tsx:10-17, InteractiveHub.tsx:11-79
- Issue: Dynamic imports with ssr: false but loading fallbacks render different DOM structure than client
- Impact: Hydration errors, layout shift on first paint
3. Missing useEffect Cleanup for Event Listeners
- Files: Navbar.tsx:16-20, ScrollToTop.tsx:13-19, HeroScene.tsx:50-59, Testimonials.tsx:106-112
- Issue: Some listeners use passive options, others don't. Inconsistent cleanup patterns.
4. Race Conditions in InteractiveHub BMI Calculator
- File: InteractiveHub.tsx:98-145
- Issue: recommendations object recreated on every render; formMessage uses stale bmi/bmiCategory values due to closure
- Impact: Wrong data sent to contact form
5. Three.js Scene Graph Anti-Patterns
- Files: HeroScene.tsx:100, EquipmentShowroomScene.tsx:81-89
- Issue: CameraRig and OrbitControls return null but registered as children in Canvas - invalid React Three Fiber pattern
- Impact: Console warnings, potential rendering issues
🟠 High-Priority Issues
6. Performance: Excessive Re-renders from Framer Motion
- Files: All section components using whileInView + motion.div
- Issue: Each section creates separate useInView observers; no shared intersection observer
- Impact: 15+ intersection observers running simultaneously
7. Particle System Not Optimized
- File: Particles.tsx:21-74
- Issue: 300 particles with frustumCulled={false} forces GPU to process all particles always
- Fix: Enable frustum culling, reduce count on mobile, use BufferGeometry directly
8. Memory Leak in HologramModel Material Creation
- File: HologramModel.tsx:53-75
- Issue: useMemo creates new THREE.Material instances on every modifiers change but never disposes old ones
- Impact: GPU memory leak when goal/weight/height changes
9. Contact Form No Actual Submission Logic
- File: ContactForm.tsx:43-52
- Issue: handleSubmit only clears form and shows success - no API call
- Impact: Form is non-functional
10. Gallery Images Will 404
- File: Gallery.tsx:12-41
- Issue: References /gallery/gym-*.webp but public/ folder is empty
- Impact: Broken images in production
🟡 Medium-Priority Issues
11. Inconsistent TypeScript Types
- Files: Multiple
- Issues:
- Button.tsx:10-18: onClick?: () => void should be React.MouseEventHandler
- Card.tsx:10-15: glowColor?: string should be typed
- InteractiveHub.tsx:81-83: as const on array but showroomEquipment state not typed as const
12. Magic Numbers Throughout 3D Components
- Files: All /three/ components
- Examples: position={[0, -0.65, 0]}, scale={1.3}, distance={20}, decay={2}
- Impact: Hard to maintain, adjust, or theme
13. Duplicate Gradient/Color Definitions
- Files: globals.css:104-117, constants.ts:242-251, inline styles throughout
- Issue: Same colors defined in 3+ places (CSS vars, JS constants, Tailwind classes)
14. Accessibility Issues
- Files: Navbar.tsx, Testimonials.tsx, ContactForm.tsx
- Issues:
- Mobile menu button missing aria-expanded
- Testimonial scroll buttons: <span aria-hidden="true">{">"}</span> - announcer-unfriendly
- Form inputs missing aria-describedby for validation
15. ScrollToTop Uses Deprecated Pattern
- File: ScrollToTop.tsx:21-23
- Issue: window.scrollTo({ behavior: "smooth" }) - should use scrollTo({ top: 0, behavior: "smooth" })
🟢 Low-Priority / Code Quality
16. Dead Code / Unused Imports
- File: InteractiveHub.tsx:14 - AnimatePresence imported but only used once
- File: HeroScene.tsx:3 - Suspense imported but fallback is null
17. Inconsistent Animation Easing
- Files: Multiple
- Values used: [0.25, 0.46, 0.45, 0.94], "easeOut", "easeInOut", spring configs vary
- Impact: Inconsistent feel
18. Hardcoded Breakpoints Instead of Tailwind
- Files: InteractiveHub.tsx:264, Pricing.tsx:148
- Examples: lg:col-span-7, lg:col-span-5 - works but not responsive-first
19. No Error Boundaries
- Impact: Three.js errors crash entire page instead of graceful fallback
20. Constants File Too Large
- File: constants.ts:251 lines
- Should split: brand.ts, navigation.ts, services.ts, pricing.ts, trainers.ts, testimonials.ts
📦 Dependency & Config Issues
21. Next.js Version Mismatch Risk
- package.json: "next": "16.2.3" - Next 16 is not released yet (current stable is 14.x)
- Impact: Likely using canary/unstable version
22. React 19 with Framer Motion Compatibility
- package.json: "react": "19.2.4", "framer-motion": "^12.38.0"
- Risk: Framer Motion 12 may not fully support React 19
23. Tailwind v4 Config Missing
- postcss.config.mjs: Uses @tailwindcss/postcss but no tailwind.config.ts exists
- globals.css: Uses @import "tailwindcss" (v4 syntax) but no theme config
24. No Bundle Analysis or Performance Budget
- Missing: webpack-bundle-analyzer, @next/bundle-analyzer, Lighthouse CI
🔧 Recommended Fixes Priority Order
Priority
P0
P0
P0
P0
P1
P1
P1
P1
P2
P2
P2
P3
P3
📊 Code Health Summary
Metric
TypeScript Strict Mode
ESLint Config
Component Reusability
3D Architecture
Performance Awareness
Accessibility
Testing
Documentation
The codebase shows strong UI/UX implementation with impressive 3D work, but has significant technical debt in the Three.js integration layer and missing production-hardening (error boundaries, form submission, asset management).