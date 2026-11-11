<div align="center">

<img src="public/PraveoIndia_Logo_SVG.svg" alt="PRAVEO India" width="120" />

# PRAVEO 🚚✨

### *More than food. It's your vybe.*

**Five food concepts. One PRAVEO standard.**
Fresh prep • Bold flavours • Right where you need them.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-149ECA?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-private-grey)]()

</div>

---

## 🌮 What is PRAVEO?

**PRAVEO India** is a chain of food trucks built on one idea — *one brand, five moods*. Every cart does **one thing really well**, and wears **one colour**, so you can spot it from across the street.

This repository contains the official **landing page** — a fast, animated, theme-aware single-page experience built with Next.js.

## 🎨 Pick your vybe — the five carts

| Cart | Subtitle | Tagline | Best found near |
|------|----------|---------|-----------------|
| 🟢 **PRO** | High protein food | *Protein that tastes good.* | Gyms, fitness centres, sports zones |
| 🔴 **BITE** | Burgers • fries • wraps | *Follow the crave.* | Markets, colleges, evening hotspots |
| 🟣 **SHAKE** | Shakes • smoothies • fruits | *Blend your mood.* | Colleges, parks, active streets |
| 🟤 **BREW** | Coffee • tea | *Make it a good day.* | Office zones, commercial districts |
| 🟡 **FRESH** | Fresh food • salads • bowls | *Keep it fresh.* | Parks, wellness areas, lifestyle zones |

Hover a concept and the **entire site re-themes itself** to that cart's colour — powered by CSS custom properties (`--c` / `--on`) and a scroll-sync engine.

## ✨ Features

- 🎬 **Preloader + hero timeline** — cinematic first impression
- 🧭 **Scroll-driven storytelling** — GSAP animations, Lenis smooth scrolling
- 🚛 **Scroll progress truck** — a mascot truck drives along the page as you scroll
- 🎨 **Concept accent theming** — pick a cart, the whole page changes colour
- 🌗 **Dark / light mode** — `next-themes`, follows system by default
- 🖱️ **Advanced custom cursor** with hover states
- 📬 **"Landing soon" notify form** — server-side email via Nodemailer API routes
- ⚡ **Next.js 16 + React 19** — App Router, Turbopack, font optimization
- 🧱 **shadcn/ui** component primitives with Base UI
- ♿ **Reduced-motion aware** — `MotionConfig reducedMotion="user"`

## 🛠️ Tech stack

| Layer | Tools |
|-------|-------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS 4 · CSS variables · tw-animate-css |
| Animation | GSAP · Motion · Lenis · react-fast-marquee |
| UI | shadcn · Base UI · Lucide icons · Embla carousel |
| Email | Nodemailer (SMTP) via `/api/notify` |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (Gmail app password etc.)
cp .env.example .env
#    → open .env and fill SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
#    ⚠️ never commit .env

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000** — the PRAVEO experience loads with a preloader, then smooth-scrolls you through the brand story.

### Production

```bash
npm run build
npm start
```

## 📬 Notify API

The landing page collects emails so fans know **where the first cart shows up**.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notify` | `POST` | Sends a notification email via SMTP (Nodemailer) |
| `/api/notify/preview` | `GET` | Preview the email template without sending |

Configure credentials in `.env` (see `.env.example`). Gmail users: create an **App Password** (2FA required), don't use your real password.

## 🗂️ Project structure

```
site-main/
├── app/
│   ├── api/notify/          # Email notify API + preview route
│   ├── layout.tsx           # Fonts, theme provider, smooth scroll, preloader
│   ├── page.tsx             # Landing page composition
│   ├── globals.css          # Theme tokens + concept accent colours
│   └── icon.svg             # Favicon
├── components/
│   ├── Hero / Stats / CartStreet / MascotCrew   # Story sections
│   ├── ConceptPicker / HowItWorks / Standard    # Brand sections
│   ├── NotifyForm / FindSection / Footer        # CTA + footer
│   ├── Preloader / SmoothScroll / ScrollProgressTruck
│   ├── ThemeToggle / MobileMenu / Ribbon / Header
│   └── ui/ + globals/     # shadcn primitives & cursor system
├── lib/
│   ├── concepts.ts         # The five PRAVEO concepts + accent engine
│   └── utils.ts
├── hooks/                  # Client-side hooks
└── public/                 # Logo & static assets
```

## 🧭 Sections on the page

1. **Ribbon** — announcement strip
2. **Hero** — brand statement with timeline reveal
3. **Stats** — animated counters
4. **Concept Picker** — *"Pick your vybe"* (re-themes the site)
5. **Cart Street** — scroll-driven cart parade
6. **Mascot Crew** — the characters behind the carts
7. **How It Works** — the PRAVEO model
8. **The Standard** — quality promise
9. **Find Us** — where carts show up
10. **Notify** — *"PRAVEO is landing soon"* email capture
11. **Footer**

## 🔮 Roadmap

- [ ] Live cart locations & map
- [ ] Menu pages per concept
- [ ] Online ordering
- [ ] Franchise / partner onboarding

## 📄 License

Private & proprietary — © 2026 PRAVEO India. All rights reserved.

<div align="center">

**PRAVEO** — *More than food. It's your vybe.* 🚚

</div>
