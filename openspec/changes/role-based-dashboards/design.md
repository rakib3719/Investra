## Context

Investra uses Next.js (App Router), Tailwind CSS v4, and React Query with cookie-based JWT authentication connecting to a NestJS backend. While authentication and public marketing pages are implemented, the protected route `/dashboard/[role]` currently renders only a basic placeholder.

This technical design outlines the component hierarchy, navigation architecture, and data visualization patterns needed to deliver the five role portals (`investor`, `entrepreneur`, `consultant`, `admin`, `sub_admin`) as defined in the Investra Software Design Document and brand identity guidelines.

## Goals / Non-Goals

**Goals:**
- Provide a responsive, glassmorphic `DashboardShell` containing role-adaptive navigation, header controls, notifications, and KYC verification alerts.
- Deliver feature-rich dashboard views for each role:
  - **Investor**: Portfolio telemetry, deal flow explorer, side-by-side comparison, bookmarks, and consultant bookings.
  - **Entrepreneur**: Funding campaign progress, campaign creator wizard, pitch deck management, investor inquiries inbox, and mentorship bookings.
  - **Consultant**: 80/20 earnings split tracker, 1-on-1 consultation calendar with Zoom/Google Meet links, workshop/course management, and rate configuration.
  - **Admin & Sub-Admin**: System telemetry, user management, subscription plan feature gate configuration, KYC verification review queue, and transaction monitor.
- Implement responsive data presentation (metric stat cards, progress bars, interactive filters, data tables).
- Maintain brand aesthetic: Midnight Navy (`#182B45`), Steel Blue (`#263F6A`), Forest Green (`#193725` / `#064e3b`), Emerald (`#10b981`), Glassmorphism, and Outfit/Plus Jakarta Sans typography.

**Non-Goals:**
- Direct payment gateway webhook handling (handled by backend NestJS Stripe/SSLCommerz services).
- Native WebRTC video streaming implementation (external Zoom/Google Meet links are utilized per SDD).

## Decisions

### 1. Polymorphic Dashboard Shell Architecture
- **Decision**: Create a single, modular `DashboardShell` component that accepts role configuration metadata (nav items, badges, actions) rather than duplicating layouts across roles.
- **Rationale**: Eliminates duplicate code for header, user menu, KYC banners, mobile sidebar drawers, and notifications.
- **Alternatives Considered**: Creating 5 completely disjoint layout trees. Rejected due to code duplication and inconsistent header/profile behaviors.

### 2. URL-Synchronized Tab Sub-Views
- **Decision**: Implement dashboard feature modules as sub-views coordinated via URL query parameters (`/dashboard/[role]?tab=...`) and client view components.
- **Rationale**: Enables bookmarkable, shareable links, rapid client-side transitions without layout unmounting, and preserves active auth session state.
- **Alternatives Considered**: Nested Next.js App Router subdirectories (`/dashboard/[role]/deals/page.tsx`). Tabbed sub-views inside the page with query sync provide smoother client UX and shared filter state.

### 3. Progressive Data Layer with Graceful API Fallbacks
- **Decision**: Wire dashboard telemetry and profile data to live user context (`useAuth`) and backend endpoints (`/auth/me`, `/profile`), with rich deterministic mock state for in-development campaign/booking CRUD operations.
- **Rationale**: Allows immediate end-to-end visual validation and interaction while backend API endpoints are being incrementally expanded.

## Risks / Trade-offs

- **[Risk]** Large tables (e.g. startup comparison, user lists) may overflow on small mobile screens.
  - **Mitigation**: Implement responsive card layouts on mobile (`< 768px`) and horizontal smooth-scrolling containers with frozen column headers on desktop.
- **[Risk]** Unauthorized role route tampering.
  - **Mitigation**: `RequireAuth` verifies authenticated session, and `DashboardShell` automatically enforces role redirection if `params.role !== user.role.toLowerCase()`.
