# RatedDocs — Dental & Patient Management Platform

RatedDocs is a premium, enterprise-grade Dental & Patient Management Platform designed to connect patients with verified, top-tier dentists. The application is built using a modern React & Next.js architecture, utilizing a robust 3-Phase Dentist Verification workflow, specialized Zustand state management, role-based middleware authentication, and Progressive Web App (PWA) capabilities.

---

## 🚀 Key Modules & Feature Highlights

RatedDocs is divided into three primary portals: **Patients**, **Dentists (Doctors)**, and **Admins**.

### 1. Dentist (Doctor) Dashboard
A comprehensive space for dentists to manage their practices, patients, and verification status:
*   **Verification Workflow:** A secure, multi-phase verification portal containing:
    *   **Phase 1:** Dental license input, professional details, headshot upload, and verification matching.
    *   **Phase 2:** Sterilization protocols checklist, detailed procedures & pricing configuration, and dentist guarantee details.
    *   **Phase 3:** Implant documentation, clinical depth information, and document uploads.
*   **Booking Management:** Dynamic booking dashboard equipped with tabs (upcoming, completed, cancelled), live search, local storage tab persistence, and treatment plan modal integration.
*   **Patient Management:** Patient directory list, details search, and custom profile drawers displaying full patient medical context.
*   **Referrals & Consultations:** Referral stats tracking and history, interactive consultation step setups, and customized loading skeletons.
*   **Profile & Settings:** Self-management portal for password changes, professional detail updates, and payment details configuration.

### 2. Admin Dashboard
An control center for platform administration and quality assurance:
*   **Dentist Verification Queue:** Dedicated system for admins to audit and verify incoming dentist licenses and sterilization credentials.
*   **KOL (Key Opinion Leader) Management:** Directory of key dentists, status toggling (deactivate/activate), and filtering systems.
*   **Anti-Collusion & Review Auditing:** Advanced anti-collusion mechanisms and fraud detection to safeguard the platform's review system integrity.
*   **SEO Review Pages:** Tools for monitoring and configuring public-facing SEO doctor review pages.
*   **Global Settings:** Central control for RDV (RatedDocs Verification) score weights, platform fees, and system-wide announcements.

### 3. Patient Portal & Public Pages
An interactive, high-performance interface for patients:
*   **Find Dentist:** High-fidelity directory listing with custom search filters and interactive geographic location mapping powered by Leaflet.
*   **Step-by-step Consultations:** A seamless 7-step wizard facilitating online dentist consultations and appointment bookings.

---

## 🛠 Technology Stack

| Technology | Purpose | Key Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | High-performance React framework using Server/Client components |
| **Styling** | Tailwind CSS v4 | Uses modern `@theme` blocks inside CSS (no `tailwind.config.js`) |
| **State Management**| Zustand + React Query | Split stores for UI/Data/Verification states + synchronized server state |
| **Forms & Validation**| React Hook Form + Zod | Schema-based client-side validation and form handling |
| **Map Engine** | Leaflet & React Leaflet | Interactive maps for finding nearby verified clinics |
| **Animations** | Motion (Framer Motion) | Imported from `motion/react` for micro-interactions and transitions |
| **Icons** | Lucide React | Clean, consistent SVG icon set |
| **PWA Core** | Next PWA / Service Workers| Offline capabilities and app installation prompt support |

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── (marketing)/        # Public landing pages, About Us, Search & Booking
│   ├── (auth)/             # Auth paths (Admin Login, Doctor Login, Doctor Register)
│   ├── (dashboard)/        # Role-based secure dashboards
│   │   ├── patient/        # Patient Dashboard
│   │   └── dentist/        # Dentist Dashboard
│   └── (admin dashboard)/  # Admin Dashboard & modules
├── app/modules/            # Modular feature components split by domain
│   ├── auth/               # Login & Registration sub-components
│   ├── admin/              # Admin pages (Anti-collusion, KOL management, Settings)
│   ├── dentist/            # Dentist pages (Verification phases, Booking, Patient lists)
│   └── shared/             # Universally shared modular code
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn UI primitives (buttons, inputs, cards, etc.)
│   ├── layout/             # Topbar, Sidebars, Shells
│   ├── forms/              # Custom wrappers and Form Fields
│   └── feedback/           # Skeleton loaders, spinners, error pages
├── lib/
│   ├── api/                # Axios instance, endpoints registry, error handlers
│   ├── auth/               # Role helpers, access controls
│   └── hooks/              # Generic hooks (e.g. store connectors)
├── store/                  # Zustand global state slices
│   └── slices/             # uiSlice, dataSlice, verificationSlice
└── middleware.ts           # Token verification & Role-Based Access Control (RBAC)
```

---

## 🔒 Security & Router Guarding

Access control is enforced at the edge using Next.js **Middleware**:
1.  **JWT Verification:** Validates the custom `rateddocs_access_token` cookie against the backend authentication API.
2.  **Role Guarding (RBAC):** Restricts route groups (`/admin`, `/dentist`, `/patient`) to their respective authenticated roles.
3.  **Fallback Auditing:** Uses client-side token parsing and role caching as a fallback mechanism if the primary authentication API is temporarily unreachable.
4.  **Auto-Redirects:** Instantly routes authenticated users away from public auth paths (e.g. `/doctor-login` -> `/dentist` dashboard).

---

## 📦 State Management & Store Splitting

To ensure high performance and prevent unnecessary re-renders, the global state is split into logical slices inside **Zustand**:

*   **`useVerificationStore`:** Manages active verification steps, state progress, and phase validation.
*   **`useDataStoreForVerification`:** Stores multi-step dentist registration data, sterilization checklists, and procedure pricings.
*   **`useUiStoreForVerification`:** Controls state for modals, active prompts, and navigation overrides.

---

## 📱 Progressive Web App (PWA) & HTTPS

RatedDocs is configured as a Progressive Web App (PWA) with full support for mobile/desktop installs and offline access.
*   **SSL Requirement:** Browsers strictly require HTTPS for Service Worker registration.
*   **Deployment Configuration:** A dedicated Caddy/Docker configuration is provided to automatically provision Let's Encrypt SSL certificates, serving as a reverse proxy on AWS EC2 instances.

---

## 🛠️ Getting Started & Running Locally

### 1. Installation
Clone the repository and install the dependencies:
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://3.99.158.129:8004/api/v1
```

### 3. Run Development Server
```bash
pnpm dev
```
The application will be running locally at [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
pnpm build
pnpm start
```
