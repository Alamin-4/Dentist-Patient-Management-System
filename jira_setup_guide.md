# RatedDocs — Jira Project Setup & Ticket Guide

---

## PART 1: JIRA PROJECT SETUP

### Step 1 — Create the Project
1. Go to **Jira** → **Projects** → **Create project**
2. Choose **Scrum** template → Click **Select**
3. Fill in:
   - **Project name:** `RatedDocs Platform`
   - **Key:** `RDP`
   - **Project lead:** (yourself)
4. Click **Create project**

### Step 2 — Configure Issue Types
Go to **Project Settings → Issue Types**. Ensure these exist:
- Epic
- Story
- Task
- Sub-task
- Bug

### Step 3 — Set Up Workflow Statuses
Go to **Project Settings → Workflows → Edit**.
Add these columns to your board:

| Column | Meaning |
|--------|---------|
| **Backlog** | Not yet started |
| **To Do** | Ready to be picked up |
| **In Progress** | Actively being worked on |
| **In Review** | PR open / code review |
| **Ready for QA** | Deployed to staging, awaiting test |
| **QA In Progress** | QA tester actively testing |
| **Done** | Shipped and verified |
| **Blocked** | Stuck, needs attention |

### Step 4 — Create Labels
Go to **Project Settings → Labels** and add:
`frontend`, `backend`, `auth`, `patient`, `dentist`, `admin`, `api`, `ui`, `critical`, `qa-ready`, `blocked`

### Step 5 — Add Your QA Tester
1. **Project Settings → Access → Invite people**
2. Role: **Developer** (allows bug creation and status transitions)
3. Share the link to the **QA Board View** (filtered to `Ready for QA`)

### Step 6 — Create a QA Board Filter (Saved Filter)
1. Go to **Issues → Advanced search (JQL)**
2. Paste: `project = RDP AND status = "Ready for QA" ORDER BY priority DESC`
3. **Save as:** `QA Testing Queue`
4. Share with your QA tester

---

## PART 2: EPICS

Create these 7 Epics first — all other tickets link to them.

| Epic Key | Epic Name | Status |
|----------|-----------|--------|
| EPIC-1 | 🔐 Authentication & Onboarding | ✅ Done |
| EPIC-2 | 🏥 Marketing & Find-a-Dentist | 🔄 In Progress |
| EPIC-3 | 🦷 Dentist Dashboard | 🔄 In Progress |
| EPIC-4 | 🧑‍⚕️ Patient Dashboard | 🔄 In Progress |
| EPIC-5 | 🛡️ Admin Dashboard | 🔄 In Progress |
| EPIC-6 | ⚙️ Backend API & Infrastructure | 🔄 In Progress |
| EPIC-7 | 🧪 QA, Testing & Polish | 📋 To Do |

---

## PART 3: TICKETS BY EPIC

---

### EPIC-1: 🔐 Authentication & Onboarding

---

**[STORY] RDP-101 — User Registration & Login**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `frontend` `backend` `auth`
- **Description:**
  As a new user, I want to register and log in using email/password or social providers so I can access the platform.
- **Acceptance Criteria:**
  - [ ] Email/password registration with validation
  - [ ] OTP email verification on signup
  - [ ] Google OAuth login
  - [ ] JWT HttpOnly cookie session management
  - [ ] Redirect to correct dashboard by role (patient/dentist/admin)
  - [ ] Show error messages for invalid credentials

---

**[STORY] RDP-102 — Dentist Professional Registration Flow**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `frontend` `dentist` `auth`
- **Description:**
  As a dentist, I want to complete a multi-step professional registration (personal info → professional details) so I can access my dashboard.
- **Acceptance Criteria:**
  - [ ] Multi-step form with step indicators
  - [ ] Professional info: specialty, license, country, clinic name
  - [ ] Form validation with backend error mapping
  - [ ] Redirect to `/dentist` after successful submission
  - [ ] Edit mode for profile settings page

---

**[TASK] RDP-103 — OTP Verification Email Flow**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `backend` `auth`
- **Description:** Implement OTP generation and email delivery for new signups. Disable redundant "verify email link" emails; keep only OTP-based verification.

---

**[TASK] RDP-104 — Role-Based Route Protection**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `frontend` `auth`
- **Description:** Middleware and layout-level guards to restrict `/dentist`, `/patient`, and `/admin` routes based on authenticated user role.

---

### EPIC-2: 🏥 Marketing & Find-a-Dentist

---

**[STORY] RDP-201 — Dentist Directory Search**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `frontend` `backend` `api`
- **Description:**
  As a visitor, I want to search for dentists by name or specialty, filter by country/city/rating, and view results on a list or map.
- **Acceptance Criteria:**
  - [ ] Search input filters by dentist name or specialty only (no price/procedure in search bar)
  - [ ] Sidebar filters: Country, City, RDV Score, Rating, Verified Only, Languages, Availability
  - [ ] Procedure and Price Range filters removed from UI and backend query
  - [ ] Map view with dentist pins
  - [ ] Mobile-responsive filter sheet
  - [ ] Pagination on results

---

**[STORY] RDP-202 — Dentist Comparison Feature**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `frontend` `dentist`
- **Description:**
  As a patient, I want to select up to 3 dentists and compare them side-by-side so I can make an informed choice.
- **Acceptance Criteria:**
  - [ ] Only VERIFIED dentists can be compared
  - [ ] Unverified dentist shows a professional "Verification Required" modal
  - [ ] Comparison table: RDV Score, Rating, Location, Languages, Estimate Range
  - [ ] No hardcoded mock data — all values from API
  - [ ] Comparison modal only accessible to logged-in users

---

**[STORY] RDP-203 — Dentist Profile Page**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `dentist`
- **Description:**
  As a visitor, I want to view a full dentist profile page with their details, reviews, procedures, and a consultation request option.
- **Acceptance Criteria:**
  - [ ] Profile photo, name, specialty, clinic, location displayed
  - [ ] Verified badge shown for VERIFIED dentists
  - [ ] Procedure list with prices
  - [ ] Patient reviews section
  - [ ] Consultation request form for CLAIMED dentists
  - [ ] Direct booking flow for VERIFIED dentists

---

**[STORY] RDP-204 — Claim a Dentist Profile**
- **Priority:** Medium
- **Status:** ✅ Done
- **Labels:** `frontend` `backend` `dentist`
- **Description:**
  As a dentist, I want to claim an existing directory profile so I can manage it and get verified.
- **Acceptance Criteria:**
  - [ ] Email OTP verification before claim
  - [ ] Claim form with professional details
  - [ ] Stripe payment flow to upgrade status to CLAIMED
  - [ ] Redirect to profile claim page after submission

---

**[TASK] RDP-205 — Add Dentist to Directory (User-Submitted)**
- **Priority:** Medium
- **Status:** ✅ Done
- **Labels:** `frontend` `backend`
- **Description:** Allow users to submit a new dentist entry (name, clinic, city, country, specialty) that becomes a claimable UNVERIFIED profile.

---

**[STORY] RDP-206 — Home Page & Marketing Sections**
- **Priority:** Medium
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `ui`
- **Description:**
  As a visitor, I want to see a compelling landing page with verified dentist highlights, search entry point, and value propositions.
- **Acceptance Criteria:**
  - [ ] Hero section with search bar
  - [ ] Verified dentist showcase cards (no hardcoded data)
  - [ ] About Us page
  - [ ] Blog/articles page (cards must remain visible — no fade-out animation bugs)
  - [ ] Guarantee page
  - [ ] Responsive on all screen sizes

---

### EPIC-3: 🦷 Dentist Dashboard

---

**[STORY] RDP-301 — Dentist Overview Dashboard**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `dentist`
- **Description:**
  As a dentist, I want a dashboard overview showing key metrics (appointments, patients, revenue) when I log in.
- **Acceptance Criteria:**
  - [ ] Skeleton loading states while data fetches
  - [ ] Patient count card
  - [ ] Upcoming bookings card
  - [ ] Revenue summary
  - [ ] Quick links to key sections

---

**[STORY] RDP-302 — Dentist Verification Flow**
- **Priority:** Critical
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `backend` `dentist`
- **Description:**
  As a dentist, I want to go through a 3-phase verification process (License → Operations → Clinic Depth) to become VERIFIED.
- **Acceptance Criteria:**
  - [ ] Phase progress indicator shown in dashboard
  - [ ] License verification step
  - [ ] Operations verification step
  - [ ] Clinic depth verification step (map picker for coordinates)
  - [ ] Status updates to VERIFIED after admin approval
  - [ ] Verified badge appears on profile

---

**[STORY] RDP-303 — Patient Management**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `frontend` `backend` `dentist` `patient`
- **Description:**
  As a dentist, I want to view and manage my patient list with their records, bookings, and treatment history.
- **Acceptance Criteria:**
  - [ ] Patient list fetched from API (no mock/JSON data)
  - [ ] Skeleton loading states
  - [ ] Patient detail view with records
  - [ ] TanStack Query for data management

---

**[STORY] RDP-304 — Bookings & Appointments**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `dentist`
- **Description:**
  As a dentist, I want to view, confirm, and manage appointment bookings from patients.
- **Acceptance Criteria:**
  - [ ] Booking list with status filters
  - [ ] Accept / Decline / Complete actions
  - [ ] Date and time display
  - [ ] Patient name and procedure info

---

**[STORY] RDP-305 — Pricing & Procedures Management**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `backend` `dentist`
- **Description:**
  As a dentist, I want to add, edit, and manage my procedure pricing so patients can see accurate cost estimates.
- **Acceptance Criteria:**
  - [ ] Add procedure with price
  - [ ] Edit/delete existing procedures
  - [ ] Price stored and reflected in directory listing
  - [ ] Active/inactive toggle per procedure

---

**[STORY] RDP-306 — Consultation Requests**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `dentist`
- **Description:**
  As a dentist, I want to view incoming consultation requests from patients and respond to them.
- **Acceptance Criteria:**
  - [ ] List of PENDING requests
  - [ ] View patient details and message
  - [ ] Accept or decline with response
  - [ ] Email notification on new request

---

**[STORY] RDP-307 — Dentist Settings & Profile Edit**
- **Priority:** Medium
- **Status:** ✅ Done
- **Labels:** `frontend` `dentist`
- **Description:**
  As a dentist, I want to edit my profile information (photo, bio, contact, location) from my settings page.
- **Acceptance Criteria:**
  - [ ] Edit mode toggle (inputs disabled by default)
  - [ ] Country/city dynamically populated from shared config
  - [ ] Profile photo upload
  - [ ] Save changes with success/error feedback

---

**[STORY] RDP-308 — Referrals & Support**
- **Priority:** Low
- **Status:** 📋 To Do
- **Labels:** `frontend` `dentist`
- **Description:** Referral program tracking and support request submission from within the dentist dashboard.

---

### EPIC-4: 🧑‍⚕️ Patient Dashboard

---

**[STORY] RDP-401 — Patient Overview Dashboard**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `patient`
- **Description:**
  As a patient, I want a personalized dashboard showing my upcoming bookings, saved dentists, and recent activity.
- **Acceptance Criteria:**
  - [ ] Welcome section with patient name
  - [ ] Upcoming appointments widget
  - [ ] Saved/favorited dentist cards
  - [ ] Quick links to find a dentist, bookings, documents

---

**[STORY] RDP-402 — My Bookings**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `patient`
- **Description:**
  As a patient, I want to view all my past and upcoming bookings with status, dentist details, and the ability to cancel.
- **Acceptance Criteria:**
  - [ ] Booking list fetched from API (no mock data)
  - [ ] Filter by upcoming / past / cancelled
  - [ ] Cancel appointment action
  - [ ] Booking detail view

---

**[STORY] RDP-403 — Travel Checklist**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `frontend` `patient`
- **Description:**
  As a patient traveling for dental care, I want a checklist of items to prepare (documents, insurance, accommodation) to feel ready for my trip.
- **Acceptance Criteria:**
  - [ ] Predefined checklist items
  - [ ] Mark items as complete
  - [ ] Progress indicator
  - [ ] Persist state per user

---

**[STORY] RDP-404 — Documents & Medical Records**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `frontend` `patient`
- **Description:**
  As a patient, I want to upload and view my dental documents (X-rays, reports) in a secure document vault.
- **Acceptance Criteria:**
  - [ ] Upload documents
  - [ ] View/download uploaded files
  - [ ] Categorize by type
  - [ ] Secure access (patient-only)

---

**[STORY] RDP-405 — KOL Directory (Patient)**
- **Priority:** Low
- **Status:** 📋 To Do
- **Labels:** `frontend` `patient`
- **Description:** Patient-facing KOL (Key Opinion Leader) directory for dental influencer recommendations.

---

**[STORY] RDP-406 — Patient Messages**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `frontend` `patient`
- **Description:** Secure messaging between patient and their dentist within the platform.

---

**[STORY] RDP-407 — Patient Settings**
- **Priority:** Medium
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `patient`
- **Description:**
  As a patient, I want to update my personal information, notification preferences, and account settings.
- **Acceptance Criteria:**
  - [ ] Edit personal details
  - [ ] Change password
  - [ ] Notification preferences
  - [ ] Delete account option

---

### EPIC-5: 🛡️ Admin Dashboard

---

**[STORY] RDP-501 — Admin Overview**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `admin`
- **Description:**
  As an admin, I want a high-level overview of platform metrics (total dentists, patients, revenue, pending verifications).

---

**[STORY] RDP-502 — Dentist Directory Management**
- **Priority:** Critical
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `admin`
- **Description:**
  As an admin, I want to view, edit, verify, and manage all dentist directory profiles on the platform.
- **Acceptance Criteria:**
  - [ ] Full dentist list with search and filter
  - [ ] Dentist detail page with all profile data
  - [ ] Approve/Reject verification requests
  - [ ] Change dentist status (UNVERIFIED → CLAIMED → VERIFIED)
  - [ ] View verification phase progress

---

**[STORY] RDP-503 — Patient Management (Admin)**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `admin`
- **Description:**
  As an admin, I want to view and manage all patient accounts on the platform.
- **Acceptance Criteria:**
  - [ ] Patient list with search
  - [ ] View individual patient records
  - [ ] Suspend/activate account

---

**[STORY] RDP-504 — Bookings Overview (Admin)**
- **Priority:** High
- **Status:** 📋 To Do
- **Labels:** `frontend` `admin`
- **Description:** Admin view of all platform bookings with filtering by status, date, and dentist.

---

**[STORY] RDP-505 — Payments & Revenue**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `admin` `backend`
- **Description:**
  As an admin, I want to see Stripe payment history, subscription status, and revenue metrics.
- **Acceptance Criteria:**
  - [ ] Stripe payment records list
  - [ ] Membership plan per dentist
  - [ ] Revenue chart by month

---

**[STORY] RDP-506 — Procedures & Specialties Management**
- **Priority:** Medium
- **Status:** 🔄 In Progress
- **Labels:** `frontend` `admin`
- **Description:**
  As an admin, I want to create and manage global procedures and specialties that dentists can use when setting up their profiles.
- **Acceptance Criteria:**
  - [ ] Add/edit/delete global procedures
  - [ ] Assign procedures to specialties
  - [ ] Unique keys per procedure (no duplicate errors)

---

**[STORY] RDP-507 — Reviews & Ratings Management**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `frontend` `admin`
- **Description:** Admin moderation of patient reviews — approve, flag, or remove reviews on dentist profiles.

---

**[STORY] RDP-508 — KOL Management (Admin)**
- **Priority:** Low
- **Status:** 📋 To Do
- **Labels:** `frontend` `admin`
- **Description:** Admin management of Key Opinion Leader profiles for the directory feature.

---

**[STORY] RDP-509 — Anti-Collusion System**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `admin` `backend`
- **Description:** Tools and rules to detect and prevent fake reviews or collusion between dentists and reviewers.

---

**[STORY] RDP-510 — SEO Review Management**
- **Priority:** Low
- **Status:** 📋 To Do
- **Labels:** `admin` `frontend`
- **Description:** Admin page to review and manage SEO metadata for dentist directory pages.

---

### EPIC-6: ⚙️ Backend API & Infrastructure

---

**[TASK] RDP-601 — Backend Authentication System**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `backend` `auth`
- **Description:** Manual JWT-based auth (HttpOnly cookies, bcrypt, OTP flow). Migrated away from Better Auth.

---

**[TASK] RDP-602 — Dentist Directory API**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `backend` `api`
- **Description:** `GET /dentists/directory` with search (name, specialty), filters (city, country, verified, rating, RDV score). Price and procedure filters removed.

---

**[TASK] RDP-603 — Dentist Verification API**
- **Priority:** Critical
- **Status:** 🔄 In Progress
- **Labels:** `backend` `api`
- **Description:** 3-phase verification endpoints (License, Operations, Clinic Depth). Admin approval flow to promote to VERIFIED status.

---

**[TASK] RDP-604 — Consultation Request API**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `backend` `api`
- **Description:** `POST /dentists/:slug/consultation` — creates intake + consultation record, sends email notifications. VERIFIED dentists blocked (use booking flow instead).

---

**[TASK] RDP-605 — Stripe Payment Integration**
- **Priority:** Critical
- **Status:** 🔄 In Progress
- **Labels:** `backend` `api`
- **Description:** Stripe checkout for dentist profile claiming. Webhook to promote UNVERIFIED → CLAIMED on payment success and assign membership plan.

---

**[TASK] RDP-606 — Bookings API**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `backend` `api`
- **Description:** Full CRUD for appointment bookings. Status machine: PENDING → CONFIRMED → COMPLETED / CANCELLED.

---

**[TASK] RDP-607 — Patient Records API**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `backend` `api`
- **Description:** Prisma endpoints for patient record management (list, view, create, update). Replaces mock/JSON data.

---

**[TASK] RDP-608 — Email Notification System**
- **Priority:** High
- **Status:** 🔄 In Progress
- **Labels:** `backend`
- **Description:** Transactional emails via configured SMTP/SendGrid: OTP, consultation requests, booking confirmations, verification updates.

---

**[TASK] RDP-609 — Environment & Deployment Config**
- **Priority:** Critical
- **Status:** ✅ Done
- **Labels:** `backend`
- **Description:** `.env` configuration finalized for backend (DB, JWT, Stripe, email). Backend server stable on `pnpm dev`.

---

**[TASK] RDP-610 — TypeScript Build Stability**
- **Priority:** High
- **Status:** ✅ Done
- **Labels:** `backend` `frontend`
- **Description:** Resolved all `tsc --noEmit` errors across both frontend and backend projects. Strict type checking maintained.

---

### EPIC-7: 🧪 QA, Testing & Polish

---

**[STORY] RDP-701 — Authentication Flow QA**
- **Priority:** Critical
- **Status:** 📋 Ready for QA
- **Labels:** `qa-ready` `auth`
- **Description:**
  Test all authentication paths end-to-end.
- **Test Cases:**
  - [ ] Register with email → OTP received → verify → redirect to correct dashboard
  - [ ] Register with existing email → shows conflict error
  - [ ] Login with wrong password → shows error
  - [ ] Google OAuth login → correct role redirect
  - [ ] Session persists on page refresh
  - [ ] Logout clears session and redirects to home

---

**[STORY] RDP-702 — Dentist Directory & Search QA**
- **Priority:** High
- **Status:** 📋 Ready for QA
- **Labels:** `qa-ready`
- **Description:**
  Test the find-a-dentist search and filter functionality.
- **Test Cases:**
  - [ ] Search by dentist name returns correct results
  - [ ] Search by specialty returns correct results
  - [ ] Filter by country shows only dentists in that country
  - [ ] Filter by city works when country is selected
  - [ ] "Verified Only" toggle shows only VERIFIED dentists
  - [ ] Rating filter returns dentists above minimum stars
  - [ ] Map view shows pins for all results
  - [ ] Mobile filter sheet opens and applies correctly
  - [ ] Price Range and Procedure filters are NOT present in UI

---

**[STORY] RDP-703 — Dentist Comparison QA**
- **Priority:** High
- **Status:** 📋 Ready for QA
- **Labels:** `qa-ready`
- **Description:**
  Test the dentist comparison modal feature.
- **Test Cases:**
  - [ ] Clicking compare on UNVERIFIED dentist shows "Verification Required" modal
  - [ ] VERIFIED dentist can be added to compare list
  - [ ] Maximum 3 dentists in compare list
  - [ ] Comparison table shows live API data (no hardcoded values)
  - [ ] Location shows "—" if no location data (not "Location not specified")
  - [ ] Languages shows "—" if none (not "English")
  - [ ] Modal closes cleanly and resets state

---

**[STORY] RDP-704 — Dentist Dashboard QA**
- **Priority:** High
- **Status:** 📋 To Do
- **Labels:** `qa-ready` `dentist`
- **Description:**
  Test key dentist dashboard flows.
- **Test Cases:**
  - [ ] Patient list loads from API
  - [ ] Skeleton loading state displays before data loads
  - [ ] Procedures can be added and edited
  - [ ] Profile edits save correctly
  - [ ] Settings edit-mode toggle works (inputs disabled by default)

---

**[TASK] RDP-705 — Cross-Browser & Mobile Responsiveness**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `qa-ready` `frontend`
- **Description:** Verify all major flows on Chrome, Firefox, Safari, and mobile (iOS/Android). Check navbar, filter sheet, modals, and dashboards.

---

**[TASK] RDP-706 — Performance Audit**
- **Priority:** Medium
- **Status:** 📋 To Do
- **Labels:** `frontend`
- **Description:** Run Lighthouse audit on key pages (home, find-dentists, dentist profile). Target: Performance > 80, Accessibility > 90.

---

## PART 4: QA TESTER QUICK REFERENCE

### What to Test First (Priority Order)
1. `RDP-701` — Auth flows (most critical)
2. `RDP-702` — Directory search
3. `RDP-703` — Dentist comparison
4. `RDP-704` — Dentist dashboard
5. `RDP-705` — Mobile responsiveness

### How to File a Bug in Jira
1. Click **Create** → Issue type: **Bug**
2. Fill in:
   - **Summary:** `[BUG] Short description of issue`
   - **Environment:** Browser + OS + screen size
   - **Steps to Reproduce:** Numbered steps
   - **Expected Result:** What should happen
   - **Actual Result:** What actually happened
   - **Severity:** Critical / High / Medium / Low
   - **Attachments:** Screenshot or screen recording
3. Link the bug to the parent Story ticket (e.g., `RDP-702`)
4. Set status to **In Progress** (assigned to developer)

### JQL Queries for QA Dashboard

**All tickets ready for QA:**
```
project = RDP AND status = "Ready for QA" ORDER BY priority DESC
```

**All open bugs:**
```
project = RDP AND issuetype = Bug AND status != Done ORDER BY priority DESC
```

**What's In Progress right now:**
```
project = RDP AND status = "In Progress" ORDER BY updated DESC
```

**Blocked items:**
```
project = RDP AND status = Blocked
```

---

## PART 5: CURRENT PROGRESS SUMMARY

| Status | Count | Tickets |
|--------|-------|---------|
| ✅ Done | ~15 | RDP-101,102,103,104,201,204,205,303,307,601,602,604,607,609,610 |
| 🔄 In Progress | ~14 | RDP-203,206,301,302,304,305,306,401,402,407,501,502,503,505,506,603,605,606,608 |
| 📋 Ready for QA | 3 | RDP-701,702,703 |
| 📋 To Do / Backlog | ~12 | RDP-308,403,404,405,406,504,507,508,509,510,704,705,706 |
| 🚫 Blocked | 0 | — |

---

## PART 6: SPRINT SUGGESTION

### Sprint 1 — "Core QA & Auth Polish" (Current Sprint)
- RDP-701 (Auth QA)
- RDP-702 (Directory QA)
- RDP-703 (Compare QA)
- RDP-203 (Dentist Profile Page — complete)
- RDP-605 (Stripe — complete payment webhook)

### Sprint 2 — "Dashboard Completion"
- RDP-302 (Dentist Verification Flow)
- RDP-304 (Bookings)
- RDP-305 (Pricing & Procedures)
- RDP-401 (Patient Dashboard)
- RDP-402 (My Bookings)
- RDP-704 (Dashboard QA)

### Sprint 3 — "Admin & Polish"
- RDP-502 (Admin Directory Management)
- RDP-505 (Payments)
- RDP-403 (Travel Checklist)
- RDP-404 (Documents)
- RDP-705 (Cross-Browser QA)
- RDP-706 (Performance Audit)
