# Fitness Plus Gym Website

A cinematic single-page gym landing site for Fitness Plus Gym in Kurla East, Mumbai, built with Next.js 16, Tailwind CSS v4, Framer Motion, and React Three Fiber.

## Features

- App Router project using the `src/` layout recommended for modern Next.js apps
- Immersive 3D hero scene built from primitive geometries only
- Animated sections for services, trainers, testimonials, pricing, gallery, CTA, and contact
- Local gallery assets in `public/gallery`
- Google fonts loaded through `next/font`
- SEO metadata plus `robots.ts` and `sitemap.ts`

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Three.js
- React Three Fiber and Drei
- TypeScript

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    loading.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    sections/
    three/
    ui/
  lib/
    constants.ts
public/
  gallery/
```

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm.cmd run lint
npm.cmd run build
```

Note: the build output is configured to use `.next-build/` to avoid conflicts with locked `.next/` artifacts during local development on Windows.

## Implementation Notes

The original implementation plan lives in [`implementation.md`](./implementation.md). The current codebase now includes the planned 3D hero, animated sections, contact flow, and supporting metadata/routes.
