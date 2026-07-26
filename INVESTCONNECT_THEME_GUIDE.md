# InvestConnect (Investra) — Platform Theme & Design Guide

> [!IMPORTANT]
> **InvestConnect** (internally branded as **Investra**) is a role-based investment networking platform connecting **Investors**, **Entrepreneurs (Uddokta)**, and **Consultants** in a unified ecosystem. It is NOT a green/ecological conservation platform, though it uses a Forest Green color palette.

---

## 1. Core Platform Concept
The platform provides a centralized, subscription-gated marketplace where:
* **Investors** find and back high-growth startups, compare businesses side-by-side, bookmark opportunities, and hire consultants.
* **Entrepreneurs (Uddokta)** list business campaigns, publish pitches, track investor engagement analytics, and join mentoring sessions.
* **Consultants** host paid mentoring sessions, workshops, and pre-recorded courses, earning revenue with an 80/20 platform split.
* **Admins & Sub-Admins** manage subscriptions, content moderation, system analytics, and permissions.

---

## 2. Design System & Visual Guidelines
Keep the premium, clean, high-end "soft" corporate look. Never use harsh animations or chaotic grids.

* **Primary Palette**: `#064e3b` (Forest Green - representing stability, wealth, growth).
* **Accent Palette**: `#10b981` (Emerald Green - representing highlights, action buttons, progress indicators).
* **Backgrounds**: Clean light mode backgrounds (`#ffffff`, `#f8fafc`) with deep slate-gray text (`#1e293b`, `#0f172a`).
* **Interactive Elements**:
  * **Hover Glows**: Implement `SpotlightCard` with cursor-following radial light overlays (`rgba(16,185,129,0.08)`).
  * **Text Animations**: Use `ShinyText` with a gentle green sheen flow.
  * **Background Ornaments**: Use the canvas-based `WavyBackground` for subtle decorative lines on dark containers.

---

## 3. Key Pages & Routes
* `/`: Home Page (Pitches the portal for investors, entrepreneurs, and consultants).
* `/funds`: Investment Campaigns Directory (Startup proposals, target trackers, IRR%, and investment actions).
* `/impact`: Platform Metrics & Transparency (Aggregated funding figures, active telemetry campaigns, ESG audits, investment impact simulator).
* `/resources`: Knowledge Hub & Documentation (Guides for pitching, investor checklists, consultant setup, and subscription tier previews).
* `/about`: Our Story, Vetting Framework, Advisory Board.
