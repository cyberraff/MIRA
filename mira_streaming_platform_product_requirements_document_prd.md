# MIRA – Product Requirements Document (PRD)

## 1. Product Overview

### Product Name
**MIRA**

### Product Description
MIRA is a premium streaming platform focused on **curated short films and documentaries**. Unlike mainstream streaming platforms that prioritize volume, MIRA prioritizes **quality, storytelling, and intentional curation**. The platform is designed to showcase independent filmmakers, emerging voices, and thought-provoking documentaries in a clean, cinematic, and distraction-free environment.

### Vision
To become the go-to digital home for meaningful short-form cinema and documentaries, empowering creators and inspiring audiences through curated storytelling.

### Mission
- Give independent filmmakers a premium platform for visibility
- Provide audiences with carefully curated, high-quality short films
- Deliver a cinematic streaming experience optimized for discovery and immersion

---

## 2. Problem Statement

### Current Problems in the Market
- Existing streaming platforms focus heavily on long-form and mainstream content
- Short films and documentaries are hard to discover
- Independent creators lack premium platforms tailored to short-form cinema
- Many platforms overwhelm users with too much content and poor curation
- Poor streaming UX for short films (ads, clutter, low-quality playback)

### How MIRA Solves This
- Strong editorial curation instead of algorithm overload
- Short-form-first design philosophy
- High-quality video streaming with minimal distractions
- Clear storytelling metadata and context for each film

---

## 3. Target Audience

### Primary Users
- Film enthusiasts
- Documentary lovers
- Students of film and media
- Creatives, writers, artists
- Viewers who prefer meaningful short-form content

### Secondary Users
- Independent filmmakers
- Documentary producers
- Curators and film critics

---

## 4. User Personas

### Persona 1: The Curious Viewer
- Wants high-quality short films
- Limited time, prefers 10–40 minute content
- Values thoughtful curation

### Persona 2: The Film Enthusiast
- Actively seeks independent cinema
- Interested in directors, themes, and collections
- Likely to share films and collections

### Persona 3: The Curator (Admin)
- Uploads films
- Organizes collections
- Manages featured content

---

## 5. Core Features (MVP)

### 5.1 User Authentication
- Email/password authentication
- OAuth (Google) – optional for MVP
- Secure cookie-based sessions

### 5.2 Film Library
- Browse curated list of films
- Categories (e.g., Documentary, Experimental, Culture, Society)
- Film metadata:
  - Title
  - Description
  - Duration
  - Director / Creator
  - Year
  - Genre / Tags
  - Language & subtitles

### 5.3 Film Detail Page
- Film synopsis
- Creator information
- Runtime
- Watch button
- Related films

### 5.4 Video Playback
- Secure streaming via third-party video provider
- Adaptive bitrate streaming (HLS)
- Fullscreen support
- Resume playback from last watched position

### 5.5 Watch Progress Tracking
- Automatically save playback progress
- Resume from last timestamp
- Track completed vs in-progress films

### 5.6 Collections & Curation
- Curated collections (e.g., “Voices from Africa”, “Environmental Stories”)
- Manual ordering of films in collections
- Featured collections on homepage

### 5.7 User Profile
- Watch history
- Saved films (favorites)
- Continue watching section

---

## 6. Admin / Curation Features

### 6.1 Admin Dashboard
- Secure admin access
- Manage films
- Manage collections
- Feature/unfeature films

### 6.2 Film Management
- Upload video via video provider
- Add/edit metadata
- Set film visibility (public/private)

### 6.3 Collection Management
- Create collections
- Add/remove films
- Order films within collections

---

## 7. Non-Functional Requirements

### Performance
- Fast initial page load
- Optimized streaming with CDN

### Security
- Secure video access (signed URLs or tokens)
- Protected watch routes
- Secure authentication & sessions

### Scalability
- Ability to handle increasing video views
- Stateless backend architecture

### Accessibility
- Keyboard navigation
- Subtitles support
- Responsive across devices

---

## 8. Tech Stack Requirements

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion

### Backend
- Next.js API Routes / Route Handlers
- Serverless architecture

### Database
- PostgreSQL
- Prisma ORM

### Video Streaming
- Mux (preferred) or Cloudflare Stream

### Authentication
- NextAuth (Auth.js)

### Hosting
- Vercel (Frontend + API)
- Supabase or Neon (Database)

---

## 9. Data Models (High-Level)

### User
- id
- email
- name
- role (user/admin)

### Film
- id
- title
- description
- duration
- videoAssetId
- visibility

### Collection
- id
- title
- description

### WatchProgress
- userId
- filmId
- lastTimestamp
- completed

---

## 10. Success Metrics (KPIs)

- Average watch time per user
- Film completion rate
- Daily active users
- Collection engagement
- Retention rate

---

## 11. Future Enhancements (Post-MVP)

- Subscription plans
- Creator profiles & payouts
- Film ratings & reviews
- Recommendations engine
- Offline viewing (mobile)
- Community features (comments, discussions)

---

## 12. MVP Scope Summary

### Included in MVP
- Curated film streaming
- User authentication
- Watch progress tracking
- Admin curation tools

### Excluded from MVP
- Payments
- Creator monetization
- Public uploads
- Social features

---

## 13. Final Notes for AI Code Generation

- Prioritize clean, minimal UI
- Focus on cinematic experience
- No ads
- No autoplay chaos
- Content-first design

**MIRA is about intention, quality, and storytelling.**

