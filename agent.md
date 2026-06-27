# Antigravity Agent Guidelines & Frontend Architecture

You are **Antigravity**, a senior AI coding assistant. Follow this document strictly whenever working on the **Dentist Patient Management System** frontend.

---

## 1. Quota & Context Limit Rule (CRITICAL)
> [!WARNING]
> **Resource/Quota Limit Rule:** If the current conversation's token consumption, step count, or platform-allocated resource quota reaches **70% usage (meaning only 30% quota remains)**, you **must immediately output a clear warning** to the user:
> *"WARNING: Antigravity quota is at 70% usage (30% remaining). Please review the task status and let me know how to proceed before running further commands."*

---

## 2. Core Stack & Style Rules
- **Framework:** Next.js 16+ (App Router only - no Pages Router).
- **Language:** TypeScript (strict mode).
- **Styling:** Tailwind CSS v4 (tokens configured in `@theme` blocks inside `globals.css`).
- **UI & Icons:** Shadcn UI + Radix UI primitives. Lucide React for UI icons; react-icons allowed **only** for brand logos.
- **Animations:** Motion (`motion/react`).
- **Forms & Validation:** React Hook Form + Zod.

---

## 3. Centralized API & Hooks Directory Structure
- **API Client:** Use `src/api/` as the single source of truth for centralized API configurations:
  - `src/api/axios.instance.ts` - Main Axios instance with `withCredentials: true`.
  - `src/api/axios.interceptor.ts` - Compatibility wrapper.
  - `src/api/error-handler.ts` - Normalizes errors.
  - `src/api/endpoints.ts` - Registry containing all API endpoint constants.
  - `src/api/client.ts` - Centralized `apiClient` instance.
- **Hooks Folder:** All current and new React Query hooks for API integration must be created in `src/hooks/hooks/` (e.g. `src/hooks/hooks/auth/`, `src/hooks/hooks/dentist/`, `src/hooks/hooks/user/`).
- **Deprecated Folders:**
  - `src/lib/api/` - **Deprecated** and ignored. Do not import from or modify this folder.
  - `src/hooks/dentist/` (and other old folders outside `src/hooks/hooks/`) - **Deprecated**. Do not add new features here. They are kept temporarily to avoid compilation errors until the migration is fully completed.

---

## 4. Backend Error Contract & Frontend Integration
The backend error handler (`globalErrorHandler.ts`) returns a response of type:
```typescript
interface CustomErrorResponse {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
  errorDetails?: unknown;
  stack?: string;
}
```

The frontend handler in `src/api/error-handler.ts` normalizes all network errors into the `AppError` type:
```typescript
export interface BackendErrorSource {
  field: string;
  message: string;
}

export interface AppError {
  success: false;
  message: string;
  statusCode: number;
  errors?: BackendErrorSource[];
  errorDetails?: unknown;
  stack?: string;
}
```
When handling errors in components or hooks, access:
1. `error.message` for the general error description.
2. `error.errors` (if present) for specific form field-level validation errors.

---

## 5. Directory Mapping & File Organization
- **Global UI components:** `src/components/ui/` (Shadcn primitives)
- **Shared layouts:** `src/components/layout/` (Sidebar, Topbar)
- **Page structures:** `src/app/`
- **Domain Modules:** `src/modules/<role>/<feature>/` (for feature-specific hooks, services, schemas, and types).

---

## 6. Execution Safeguards
1. **Never perform arbitrary refactoring:** Only make changes when explicitly prompted or requested.
2. **Never duplicate code:** Always search `src/components` and existing modules before creating new hooks or components.
3. **No `../../../` imports:** Always use `@/` alias for all imports.

---

## 7. URL State & Deep-Linking Guidelines
- **Prefer URL/Query parameters for significant UI states:** When implementing features, prefer meaningful action-based URLs, query parameters, route states, or deep-linking patterns whenever they improve navigation, state management, debugging, user experience, or system understanding.
  - Examples:
    - `/auth?modal=signin`
    - `/auth?modal=signup`
    - `/projects?action=create`
    - `/dashboard?tab=settings`
- **Reflection of UI states:** If a user action opens a modal, drawer, tab, wizard, or other significant UI state, consider whether that state should be reflected in the URL so it can be shared, restored after refresh, tracked, and understood more easily by both users and AI agents.
- **Avoid unnecessary parameters:** Do not add query parameters unnecessarily. Use them only when they provide clear value. Always choose clean, descriptive, and action-oriented naming conventions.
- **Workflow design thinking:** Think beyond the UI interaction itself. Consider URL state, navigation behavior, browser history, refresh persistence, deep-linking, analytics, debugging, and future maintainability.

