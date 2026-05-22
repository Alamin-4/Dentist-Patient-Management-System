# Dental/Patient Management Platform — Project Rules

You are working on an enterprise dental/patient management platform.
Read this file completely before generating any code, file, or component.

---

## STACK (Strict — Do Not Substitute)

- **Framework:** Next.js 16+ (App Router only — never Pages Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (use v4 syntax — see "Tailwind v4 Rules" below)
- **UI Library:** Shadcn UI + Radix UI primitives
- **Animation:** Motion (formerly Framer Motion) — import from `motion/react`
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React only
- **Notifications:** React Hot Toast
- **State:** Context API for global UI/auth state, React Query for server state, local state for component state

Never introduce new libraries without asking first.

---

## TAILWIND V4 RULES

This project uses **Tailwind CSS v4**, not v3. Key differences:

- No `tailwind.config.js` content array — config is in `@theme` blocks in CSS.
- Design tokens are defined as CSS variables inside `@theme` in `globals.css`.
- Use the new `@import "tailwindcss"` syntax (not `@tailwind base/components/utilities`).
- Container queries and `@starting-style` are first-class.
- Custom utilities go in `@utility` blocks, not `@layer utilities`.

When generating Tailwind classes, use v4-compatible syntax. If unsure whether
a class exists in v4, ask before using it.

---

## PROJECT STRUCTURE (Strict — Do Not Deviate)

ALWAYS follow this structure. NEVER create new top-level folders.
NEVER create files outside this structure.


src/
├── app/
│   ├── (marketing)/        # Public pages
│   ├── (auth)/             # Login, register, etc.
│   └── (dashboard)/        # Protected dashboards
│       ├── patient/
│       ├── dentist/
│       └── admin/
├── modules/                # Feature modules by domain
│   ├── auth/
│   ├── patient/<feature>/{components,hooks,services,schemas,types}
│   ├── dentist/<feature>/{components,hooks,services,schemas,types}
│   ├── admin/<feature>/{components,hooks,services,schemas,types}
│   └── shared/
├── components/
│   ├── ui/                 # Shadcn primitives only
│   ├── layout/             # Shells, sidebar, topbar
│   ├── forms/              # Reusable form primitives
│   ├── feedback/           # Skeletons, spinners, error states
│   ├── data-display/       # Tables, cards, pagination
│   └── common/             # Logo, avatar, theme toggle
├── lib/
│   ├── api/                # API client, endpoints, interceptors
│   ├── auth/               # Session, permissions, role guard
│   ├── utils/
│   ├── hooks/              # Generic reusable hooks
│   └── constants/
├── config/                 # site, navigation, env, theme
├── context/                # Auth, theme, sidebar contexts
├── providers/
├── styles/
├── types/
└── middleware.ts


### Where to put things — decision rules

- **Generic UI primitive (Button, Input):** `src/components/ui/`
- **Layout shell (Sidebar, Topbar):** `src/components/layout/`
- **Form helpers used everywhere:** `src/components/forms/`
- **Skeleton, spinner, error state:** `src/components/feedback/`
- **Used by ONE feature only (e.g., AppointmentCard):** `src/modules/<role>/<feature>/components/`
- **Used by ONE page only:** colocate in `_components/` next to the page
- **Generic hook:** `src/lib/hooks/`
- **Feature-specific hook:** `src/modules/<role>/<feature>/hooks/`
- **API call:** `src/modules/<role>/<feature>/services/`
- **Zod schema:** `src/modules/<role>/<feature>/schemas/`

### CRITICAL RULES

1. **Never create folders outside this structure.** If unsure where a file goes, ASK before creating it.
2. **Never duplicate components.** Before creating, search the codebase to see if it already exists.
3. **Components flow down only:** `modules/` → `components/` → `lib/`. Never reverse.
4. **No `../../../` imports.** Always use `@/` alias.

---

## DESIGN SYSTEM

The design system is the source of truth. Reference these files:

- **Color palette:** `.claude/design/colors.md`
- **Typography:** `.claude/design/typography.md`
- **Spacing & radii:** `.claude/design/spacing.md`

### Design Rules

- **Never hardcode colors.** Use design tokens via Tailwind classes that map to CSS variables (e.g., `bg-primary`, `text-foreground`).
- **Never hardcode font sizes.** Use the typography scale via Typography component or Tailwind text utilities tied to tokens.
- **Never hardcode spacing.** Use the spacing scale (Tailwind defaults that map to our tokens).
- **All interactive components must be keyboard-accessible** (Radix handles this by default — don't fight it).

---

## COMPONENT RULES

- All components use TypeScript with explicit prop interfaces.
- File naming: `kebab-case.tsx` for files, `PascalCase` for components.
- Hook naming: `use-kebab-case.ts`.
- Client components MUST start with `'use client'` directive.
- Default to Server Components; only mark client when needed (state, effects, browser APIs).

### Every component must have:

1. A proper TypeScript interface for props.
2. A default export OR named export — be consistent within a module.
3. Sensible default values where applicable.
4. Loading state if it fetches data.
5. Error state if it can fail.
6. Empty state if it renders lists.

---

## SKELETON LOADING

EVERY data-fetching component must have a matching skeleton component.

- **Location:** Skeleton lives in the same folder as the component it represents.
- **Naming:** `appointment-card.tsx` → `appointment-card-skeleton.tsx`
- **Base primitive:** Use `<Skeleton>` from `@/components/feedback/skeleton`.
- **Match real layout:** Skeleton must mirror the actual component's dimensions and spacing so there's no layout shift.
- **Page-level skeletons:** Use Next.js `loading.tsx` convention — must call a skeleton component, never render `"Loading..."` text.
- **Inline skeletons:** Use during React Query `isPending` states.

NEVER use a generic spinner where a skeleton fits. Spinners are only for
button states, full-page auth checks, and modal submissions.

---

## ERROR HANDLING

### API & Async Errors

- Use the central error handler in `src/lib/api/error-handler.ts`.
- Surface user-facing errors via React Hot Toast.
- Never display raw error messages from the server — map to user-friendly strings.

### Component Errors

- Every dashboard route group has an `error.tsx` boundary.
- Forms display field-level errors via React Hook Form + Zod.
- Failed mutations show toast + revert optimistic updates.

### Empty States

- Lists must render an `<EmptyState>` component when no data exists.
- Never render `null` or blank space for empty data.

---

## FORM RULES

- Always use the `<Form>` wrapper from `@/components/forms/form-wrapper`.
- Always validate with a Zod schema co-located in the module's `schemas/` folder.
- Use `<FormField>` for all inputs — never raw `<input>`.
- Submit button must show loading state during mutation.
- On success: toast + redirect/close. On error: toast with mapped message.

---

## WHAT TO DO WHEN UNCERTAIN

If you're unsure about ANY of these:

- Where a file belongs
- Whether a component already exists
- Whether to use Server or Client component
- Which Tailwind v4 class to use
- Whether a design token exists

**STOP and ASK.** Do not guess. Do not create extra files.
Do not create files outside the structure above.

---

## EXISTING CODE

I already have some pages and components built. Before creating anything new:

1. Read the existing related files.
2. Match the style, naming, and patterns of existing code.
3. Never overwrite my existing design without explicit confirmation.
4. If my existing code conflicts with these rules, flag it and ask before "fixing" it.