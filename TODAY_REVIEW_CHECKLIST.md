# 🚀 Investra - Daily Feature Review & Verification Checklist
> **Date:** October 25, 2026
> **Target Branch:** `feat/chat`
> **Commit Summary:**
> 1. `4030f10` - **1-on-1 Consultations System (Slot Management, Booking Modal, Video Meet Link, 10% Revenue Split, Earnings)**
> 2. `3faa280` - **Real-Time Notification Center (In-App Bell Dropdown, Socket Delivery, Email Notifications, Event Triggers)**
> 3. `4c5c8d3` - **Granular Sub-Admin Permissions & Policy-Based Access Control (PBAC)**

---

## 📋 Table of Contents
1. [Prerequisites & Test Setup](#0-prerequisites--test-setup)
2. [Module 1: 1-on-1 Expert Advisory & Consultations](#1-module-1-1-on-1-expert-advisory--consultations)
3. [Module 2: In-App Real-Time Notification Center](#2-module-2-in-app-real-time-notification-center)
4. [Module 3: Sub-Admin Granular Permissions & PBAC](#3-module-3-sub-admin-granular-permissions--pbac)
5. [Summary of Verification Sign-off](#4-summary-of-verification-sign-off)

---

## 0. Prerequisites & Test Setup

- [x] **Database & Migrations Up-to-date:**
  ```bash
  cd backend && npx prisma generate && npx prisma db push
  ```
- [ ] **Seed Demo Slots for Consultants (Optional but Recommended):**
  ```bash
  cd backend && node prisma/seed-slots.js
  ```
- [ ] **Backend Server Running:**
  ```bash
  cd backend && npm run start:dev
  ```
  *(Runs on http://localhost:5000 or your configured PORT)*
- [ ] **Frontend Server Running:**
  ```bash
  cd frontend && npm run dev
  ```
  *(Runs on http://localhost:3000)*

---

## 1. Module 1: 1-on-1 Expert Advisory & Consultations
**Commits:** `4030f10`
**Purpose:** Enable verified consultants to publish available calendar slots, allow clients (Entrepreneurs/Investors) to book 1-on-1 advisory sessions, generate video meeting rooms, calculate 10% platform fee / 90% consultant payout, and track session status.

### A. Consultant Experience (Slot Management & Calendar)
- [ ] **1. Login as a Consultant:** Log in with a consultant account and navigate to `/dashboard?section=calendar`.
- [ ] **2. Calendar View Loading:** Confirm the "Consultant Session & Slot Manager" page loads with tabs:
  - `Upcoming Sessions`
  - `Slot Availability Settings`
  - `Session History / Completed`
- [ ] **3. Slot Availability Creation:**
  - [ ] Click **"Add New Time Slot"** / **"Create Slots"**.
  - [ ] Select Date (e.g., tomorrow's date).
  - [ ] Select Start Time & End Time (e.g., 10:00 AM - 11:00 AM).
  - [ ] Set Hourly/Session Rate (e.g., $150 USD).
  - [ ] Submit form -> verify success toast appears.
  - [ ] Confirm new slot shows as **"AVAILABLE"** in the list.
- [ ] **4. Slot Deletion / Toggle:**
  - [ ] Click delete/remove on an unbooked slot.
  - [ ] Verify slot is removed from the active list.
- [ ] **5. Manage Booked Sessions & Dynamic Meeting Link Flow:**
  - [ ] View an incoming booking in "Upcoming Sessions".
  - [ ] Verify Client details (Name, Email, Booked Topic, Notes) are visible.
  - [ ] Notice the session starts with **"Link Needed"** badge and Amber alert: **"Action Required: Add Meeting Link for this Session"** (no fake or hardcoded static link).
  - [ ] Consultant pastes custom Google Meet or Zoom URL (e.g., `https://meet.google.com/abc-defg-hij`).
  - [ ] Click **"Save & Send to Client"** -> verify success toast: *"Meeting link saved and sent to client!"*.
  - [ ] Notice badge updates to **"Link Active"** with "Change Link", "Copy Link", and "Join Meeting Room" button.
  - [ ] Verify the client instantly receives a real-time notification & email: *"Meeting Link Ready: 1-on-1 Session with [Advisor Name]"*.
  - [ ] Test status changes: "Mark as Completed" or "Cancel Session".

### B. Consultant Experience (Earnings & Financial Split)
- [ ] **6. Navigate to Earnings:** Go to `/dashboard?section=earnings`.
- [ ] **7. Metrics Breakdown:**
  - [ ] Check **Total Gross Revenue** (100% of booking fees).
  - [ ] Check **Platform Commission** (10% retained by Investra).
  - [ ] Check **Net Payout / Withdrawable Balance** (90% to consultant).
- [ ] **8. Recent Transactions Table:**
  - [ ] Verify each session row shows Session ID, Client Name, Gross Amount, 10% Fee deduction, and Net amount.

### C. Client Experience (Discovery & Booking Flow)
- [ ] **9. Public Directory:** Open `/consultants` in an incognito window or as an Entrepreneur/Investor.
- [ ] **10. Consultant Card & Profile:**
  - [ ] Verify consultant cards display name, badge, rating, hourly rate, and "Book 1-on-1 Session" button.
- [ ] **11. Open Booking Modal:**
  - [ ] Click "Book 1-on-1 Session" on a consultant.
  - [ ] Verify `BookSessionModal` opens smoothly with consultant summary.
- [ ] **12. Slot Selection:**
  - [ ] Select an available calendar date.
  - [ ] Select an available time slot from the pill buttons.
  - [ ] Slot should highlight with selected state.
- [ ] **13. Form Submission:**
  - [ ] Fill in **Session Topic** (e.g., "Seed Round Pitch Deck Strategy").
  - [ ] Fill in **Notes / Questions** for the advisor.
  - [ ] Verify price breakdown shows (Total Fee, duration).
  - [ ] Click **"Confirm & Book Session"**.
  - [ ] Verify confirmation screen / toast appears.
- [ ] **14. Slot Locking:**
  - [ ] Reopen the booking modal for the same consultant.
  - [ ] Verify that the booked slot is now unavailable / disabled so double-booking is impossible.

### D. Client Hub (My Consultations Page)
- [ ] **15. Entrepreneur / Investor Dashboard Navigation:**
  - [ ] Log in as the client who booked the session.
  - [ ] In sidebar, click **"1-on-1 Consultations"** (or go to `/dashboard?section=consultations`).
- [ ] **16. Booked Sessions Display:**
  - [ ] Verify the newly booked session appears with:
    - Consultant profile picture & headline
    - Scheduled Date & Time
    - Topic & Client Notes
    - Fee Paid ($)
    - Status Badges: "Confirmed" + **"Link Pending"** (until consultant provides link)
- [ ] **17. Dynamic Video Room Link & Transition:**
  - [ ] Initially (before advisor provides link), verify the card displays:
    - Amber badge: **"Link Pending"**
    - Message: *"Advisor will provide Google Meet or Zoom link before your session. You will be notified as soon as it is posted."*
  - [ ] Once the advisor submits a Google Meet / Zoom link from their calendar dashboard:
    - Receive real-time notification alert.
    - Card updates to **"Room Ready"** badge.
    - Displays exact meeting link with **Copy Link** and green **"Join Meeting Room"** button.
  - [ ] Click the **Copy link** icon -> verify clipboard toast.
  - [ ] Click **"Join Meeting Room"** -> verify external Google Meet / Zoom link opens in new tab.

---

## 2. Module 2: In-App Real-Time Notification Center
**Commits:** `3faa280`
**Purpose:** Unified notification bell dropdown across all user dashboards and public navigation with real-time WebSocket delivery, unread counter badge, mark-as-read, delete, and multi-feature event triggers.

### A. UI & Dropdown Interaction
- [ ] **1. Notification Bell Visibility:**
  - [ ] Log in to any role (Admin, Consultant, Entrepreneur, Investor).
  - [ ] Look at top-right navbar / shell header -> Verify the Bell icon exists.
- [ ] **2. Unread Badge Counter:**
  - [ ] If unread notifications exist, check if red/emerald badge shows count (e.g. `3`).
  - [ ] If 0 unread, verify no distracting badge is shown.
- [ ] **3. Dropdown Opening:**
  - [ ] Click Bell icon -> Verify dropdown smoothly animates open.
  - [ ] Click outside dropdown -> Verify dropdown closes cleanly.
- [ ] **4. Tab Filtering:**
  - [ ] Click **"All"** tab -> displays all recent notifications.
  - [ ] Click **"Unread"** tab -> displays only unread notifications.
- [ ] **5. Mark Single Notification as Read:**
  - [ ] Hover over an unread notification.
  - [ ] Click checkmark icon ("Mark as read").
  - [ ] Verify notification styling changes from unread highlight to standard read state.
  - [ ] Verify unread badge count decreases by 1.
- [ ] **6. Mark All as Read:**
  - [ ] Click **"Mark all as read"** at top of dropdown.
  - [ ] Verify badge resets to 0.
  - [ ] Verify success toast notification appears.
- [ ] **7. Delete Notification:**
  - [ ] Hover over a notification and click the trash icon.
  - [ ] Verify notification is immediately removed from list.
- [ ] **8. Action URL Redirection:**
  - [ ] Click any notification with an action link (e.g. "View KYC", "View Session").
  - [ ] Verify dropdown closes and browser routes to corresponding page.

### B. Event Triggers & Dual Delivery (WebSocket + Email)
- [ ] **9. KYC Status Event:**
  - [ ] As Admin, approve or reject a user's KYC submission.
  - [ ] As that user, verify real-time toast alert pops up immediately without page refresh.
  - [ ] Check notification dropdown -> verify "KYC Approved" / "KYC Rejected" entry.
- [ ] **10. Consultation Booking Event:**
  - [ ] Book a consultation as an investor/entrepreneur.
  - [ ] Verify consultant receives real-time notification: "New 1-on-1 Session Booked".
  - [ ] Verify client receives confirmation notification: "Session Confirmed".
- [ ] **11. Term Sheet / Commitment Event:**
  - [ ] Submit an investment commitment / term sheet.
  - [ ] Verify entrepreneur receives real-time notification alert.
- [ ] **12. Course Enrollment Event:**
  - [ ] Enroll in a consultant course.
  - [ ] Verify consultant receives "New Course Student Enrolled" notification.

---

## 3. Module 3: Sub-Admin Granular Permissions & PBAC
**Commits:** `4c5c8d3`
**Purpose:** Policy-Based Access Control allowing Super Admin to provision sub-admins with granular departmental permissions (KYC, Users, Campaigns, Subscriptions, Analytics, Categories) while locking sensitive modules and preventing privilege escalation.

### A. Super Admin Sub-Admin Management Center
- [ ] **1. Navigation:**
  - [ ] Log in as Super Admin (`role: 'ADMIN'`).
  - [ ] In sidebar, click **"Sub-Admin Governance"** (or visit `/dashboard?section=subadmins`).
  - [ ] Verify page loads with title: **"Sub-Admin Permission Matrix"** and **"PBAC Governance"**.
- [ ] **2. Provision New Sub-Admin Modal:**
  - [ ] Click **"Provision New Sub-Admin"** button.
  - [ ] Modal opens with fields:
    - First Name, Last Name
    - Business Email
    - Password (with show/hide toggle)
    - Department (e.g., "Compliance & Legal", "Deal Review")
    - Internal Audit Notes
    - Granular Permissions Checkboxes:
      - `[ ] User Management & Moderation`
      - `[ ] Identity & KYC Moderation Vault`
      - `[ ] Campaign & Deal Moderation`
      - `[ ] Subscriptions & Pricing Tiers`
      - `[ ] Analytics, Telemetry & Payouts`
      - `[ ] Marketplace Verticals & Categories`
  - [ ] Test **"Select All"** and **"Clear"** helper buttons.
  - [ ] Select specific permissions (e.g., only `KYC_MODERATION` and `USER_MANAGEMENT`).
  - [ ] Submit form -> verify success toast and new sub-admin appears in table.

- [ ] **3. Sub-Admin Directory Table:**
  - [ ] Check table columns: Administrator, Department, Assigned Permissions, Status, Actions.
  - [ ] Verify assigned permissions display as colored badges with appropriate module icons.
  - [ ] Verify Status shows "Active".

- [ ] **4. Edit Permissions Modal:**
  - [ ] Click **"Edit Permissions"** on a sub-admin.
  - [ ] Modal opens pre-populated with current permissions.
  - [ ] Toggle a permission (e.g., add `CAMPAIGN_MANAGEMENT`).
  - [ ] Save changes -> verify table updates immediately with new badge.

- [ ] **5. Revoke / Suspend Sub-Admin:**
  - [ ] Click **"Revoke Access"** (trash icon) on a test sub-admin.
  - [ ] Confirm warning dialog appears asking for confirmation.
  - [ ] Confirm revocation -> verify user is removed from sub-admin table.

### B. PBAC Enforcement & Access Gating Verification
- [ ] **6. Sub-Admin Login & Sidebar Filtering:**
  - [ ] Log out of Super Admin.
  - [ ] Log in with the newly created Sub-Admin account (e.g., has only `KYC_MODERATION` permission).
  - [ ] Inspect the Admin Sidebar:
    - [ ] `Overview` should be visible.
    - [ ] `KYC Verification` should be visible.
    - [ ] `Campaigns` should be **HIDDEN**.
    - [ ] `Subscriptions` should be **HIDDEN**.
    - [ ] `Marketplace Verticals` should be **HIDDEN**.
    - [ ] `Visitors / Telemetry` should be **HIDDEN**.
    - [ ] `Sub-Admin Governance` should be **STRICTLY HIDDEN**.
    - [ ] `Platform Settings` should be **STRICTLY HIDDEN**.
- [ ] **7. Direct URL Tamper Prevention (Frontend Route Guard):**
  - [ ] Manually change URL to `/dashboard?section=campaigns` (without permission).
  - [ ] Verify user is blocked / redirected or sees an "Access Denied / Insufficient Permissions" screen.
  - [ ] Manually change URL to `/dashboard?section=subadmins`.
  - [ ] Verify Sub-Admin CANNOT view or access the sub-admin provisioning page.
- [ ] **8. Backend API PBAC Guard Enforcement:**
  - [ ] Attempt an API call to `/api/campaigns/review` using the Sub-Admin token without campaign permission.
  - [ ] Verify backend returns **`403 Forbidden`** (`ForbiddenException`).
  - [ ] Attempt an API call to `/api/kyc/review` using the Sub-Admin token with KYC permission.
  - [ ] Verify request succeeds (**`200 OK`**).

---

## 4. Summary of Verification Sign-off

| Module | Features Tested | Status | Notes / Issues Found |
| :--- | :--- | :---: | :--- |
| **Module 1** | 1-on-1 Consultation Booking & Slots | ⏳ Pending Review | |
| **Module 1** | 10% Revenue Split & Consultant Earnings | ⏳ Pending Review | |
| **Module 1** | Video Meet Link & Client Consultations Hub | ⏳ Pending Review | |
| **Module 2** | Notification Bell & Dropdown Interaction | ⏳ Pending Review | |
| **Module 2** | Real-time WebSocket & Multi-Event Triggers | ⏳ Pending Review | |
| **Module 3** | Super Admin Sub-Admin Matrix & Provisioning | ⏳ Pending Review | |
| **Module 3** | Granular PBAC Frontend Gating & Backend Guard | ⏳ Pending Review | |

---
*Generated for review by Investra Engineering Team. Mark checkboxes `[x]` as you complete each test step.*
