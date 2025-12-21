# Draft: The MIRA Tech Stack Reveal

**Platform**: Twitter/X Thread & LinkedIn Post
**Goal**: Establish technical credibility and meaningful "Build in Public" context.

---

## 🧵 Twitter/X Thread

1/5
I'm building MIRA: A premium streaming platform for short cinema. 🎬
Think "Netflix for independent films", but with a focus on curation over algorithms.

The Tech Stack is bleeding edge:
⚡️ Next.js 16 (App Router)
⚛️ React 19
🎨 Tailwind CSS v4
📹 Mux (Video)
🐘 Prisma + Postgres

Here is why I chose this stack 👇
#buildinpublic #nextjs #webdev

2/5
**Why Next.js 16 & React 19?**
I wanted to future-proof the codebase.
Server Actions have completely replaced my old API routes for form handling (like uploading films).
It’s cleaner, type-safe, and feels like "PHP in 2025" (in a good way).

3/5
**Why Mux?**
Video engineering is HARD. Encoding, adaptive bitrate, global CDN... doing this yourself is a nightmare.
Mux handles all of it.
I just post a video file, they give me a `playbackId`, and I get a Netflix-quality stream.
Zero infrastructure headache.

4/5
**Why Tailwind v4?**
Speed.
The new engine is instantaneous. No more separate `postcss` config hell.
I'm combining it with `shadcn/ui` for the admin dashboard, and I saved roughly 20 hours of UI work this week alone.

5/5
I'll be documenting the entire build process here.
Next up: How I solved the "Trailer vs Main Film" data modeling problem.

Follow along if you like:
- Next.js / React tips
- Video streaming tech
- Indie hacking reality

👋

---

## 💼 LinkedIn Version

**Header**: Why I'm betting on Next.js 16 and Mux for my new Streaming Platform 🎬

I've officially started building **MIRA**, a premium streaming platform dedicated to curated short films and documentaries.

When analyzing the requirements for a "Netflix-quality" experience for independent cinema, I had to make some hard technical choices. As a solo founder/engineer, efficiency and performance are my only leverage.

Here is the "Bleeding Edge" stack I chose, and more importantly—**WHY**:

### 1. The Core: Next.js 16 + React 19
I decided to skip the stable/legacy patterns and build directly on the future.
*   **Server Actions**: These have completely replaced my need for a separate API layer for things like form submissions and asset uploads. The code is collocated, type-safe, and drastically reduces context switching.
*   **React 19 Primitives**: Leveraging the new `use` hooks and deeper improved hydration has made the app feel practically native.

### 2. The Video Engine: Mux
This was the most critical decision. Building your own transcoding pipeline with AWS MediaConvert/Elastic Transcoder is a trap for early-stage startups.
it steals weeks of dev time on "plumbing" rather than "product".
*   **Decision**: I integrated @Mux.
*   **Result**: I upload a raw file, and Mux handles adaptive bitrate encoding, global CDN delivery, and player analytics instantly. I treat video infrastructure as code, not operations.

### 3. The UI: Tailwind v4
This update is massive. The new engine is effectively instant, and moving away from a complex PostCSS configuration has simplified my build pipeline significantly. Combined with Shadcn/UI, I'm shipping complex admin interfaces in hours, not days.

### 🚀 Building in Public
I believe the best way to learn is to show your work—bugs and all. I'll be documenting the entire process of building MIRA, from database schema design (Prisma) to solving complex video curation flows.

Follow along if you're interested in:
*   Real-world production usage of Next.js 16
*   Video streaming architecture
*   The journey of building a vertical streaming platform

#softwareengineering #nextjs #react #video #buildinpublic #startup #webdev
