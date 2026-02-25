# Photographer Marketplace MVP - Professional UI Overhaul

## TL;DR

> Transform the current "childish" photographer marketplace into a professional platform with proper form validation, shadcn/ui components, and modern UX patterns.
>
> **Key Principle**: Keep it SIMPLE. Users can browse photographers without login. Onboarding should be minimal friction.
>
> **Deliverables:**
> - shadcn/ui component library (use any components needed)
> - React Hook Form + Zod validation for all forms
> - Sonner toast notification system
> - Rebuilt: Login, Register, Consultation forms
> - Simple Photographer Onboarding (username, location, specialties, price)
> - Enhanced: Search filters, Landing page polish
> - Mobile-first responsive design
>
> **Estimated Effort:** Large (18 tasks across 4 waves)
> **Parallel Execution:** YES - 4 waves
> **Critical Path:** Setup → Shared Schemas → Forms → Polish → Verification

---

## Context

### Original Request
User wants to fix the "childish" UI of their photographer marketplace. Current issues:
- No Zod validation on frontend (backend has it)
- Raw HTML form inputs (no shadcn/ui)
- No professional design system
- No toast notifications
- Forms feel unprofessional

### Interview Summary
**Key Discussions:**
- MVP scope: Consultation only (no booking platform)
- Target audience: Indian market (top cities)
- Must be simple and mobile-responsive
- Use modern tools: shadcn, Zod, proper validation
- **PRIORITY: Keep onboarding SIMPLE**
- **Users can browse photographers WITHOUT login**
- **Backend can be extended if needed**

**Research Findings:**
- Backend already has Zod validation (good foundation)
- Frontend uses Next.js 15 + Tailwind v4 + React 19
- NO shadcn/ui currently installed
- NO form validation library on frontend
- NO toast/notification system
- Forms use manual useState for each field
- Photographer model has: username, bio, location, specialties, priceFrom

---

## Work Objectives

### Core Objective
Rebuild the photographer marketplace frontend with professional UI components, proper form validation, and modern UX patterns. Backend can be extended if required for MVP functionality.

### Key Principles
1. **SIMPLICITY FIRST**: Minimal friction for users
2. **BROWSE WITHOUT LOGIN**: Photographer discovery is public
3. **SIMPLE ONBOARDING**: Only essential fields for photographers
4. **USE SHADCN**: Any shadcn/ui components needed
5. **EXTEND BACKEND IF NEEDED**: Don't compromise UX for backend constraints

### Concrete Deliverables
1. **shadcn/ui Setup**: All needed components installed
2. **Validation Infrastructure**: Shared Zod schemas, React Hook Form
3. **Toast System**: Sonner notifications
4. **Login Form**: Professional with validation
5. **Register Form**: Professional with validation (simple - email, password, name only)
6. **Consultation Form**: Professional with validation
7. **Photographer Onboarding**: Simple form (username, location, specialties, price)
8. **Search UI**: Enhanced filters with shadcn
9. **Mobile Responsive**: All screens work on mobile

### Definition of Done
- [ ] All forms have real-time validation
- [ ] All forms show field-level errors
- [ ] All async operations show toast notifications
- [ ] Users can browse photographers without login
- [ ] Photographer onboarding is simple (4 fields max)
- [ ] All pages pass mobile responsiveness check
- [ ] No TypeScript errors
- [ ] No console errors

### Must Have
- shadcn/ui components (any needed)
- Zod validation on all forms
- React Hook Form for state management
- Sonner toast notifications
- Mobile-first responsive design
- Browse photographers without authentication
- Simple photographer onboarding

### Must NOT Have (Guardrails)
- NO booking system UI (consultation only)
- NO dashboard UI for MVP
- NO payment integration
- NO file uploads in MVP
- NO dark mode (light theme only)
- NO complex onboarding (keep it simple)
- NO "any" TypeScript types in new code

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - Start Immediately):
├── Task 1: Install and configure shadcn/ui with all needed components
├── Task 2: Install validation libraries (zod, react-hook-form, @hookform/resolvers)
├── Task 3: Install Sonner toast library
├── Task 4: Create shared validation schemas
├── Task 5: Create reusable form components
└── Task 6: Create toast hook and provider

Wave 2 (Core Forms - MAX PARALLEL):
├── Task 7: Rebuild Login form
├── Task 8: Rebuild Register form (simple - no role selection)
├── Task 9: Rebuild Consultation form
├── Task 10: Create simple Photographer onboarding form
├── Task 11: Update layout.tsx with Toaster
└── Task 12: Add loading skeletons

Wave 3 (UI Polish):
├── Task 13: Enhance photographer search filters UI
├── Task 14: Polish landing page
├── Task 15: Update photographer profile page
├── Task 16: Add empty states and error boundaries
└── Task 17: Mobile responsiveness pass

Wave 4 (Verification):
├── Task 18: Integration testing
├── Task 19: Mobile QA
├── Task 20: Accessibility audit
└── Task 21: Final code review and cleanup

Wave FINAL (Independent Review):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review
├── Task F3: Real manual QA
└── Task F4: Scope fidelity check
```

---

## Form Specifications

### Login Form Fields
| Field | Type | Validation |
|-------|------|------------|
| email | email | required, valid email |
| password | password | required, min 6 chars |

### Register Form Fields (SIMPLE)
| Field | Type | Validation |
|-------|------|------------|
| fullName | text | required, min 2 chars |
| email | email | required, valid email |
| password | password | required, min 6 chars |
| confirmPassword | password | must match password (frontend only) |

**Note**: No role selection. All users register as "user" role by default. They can become photographers later via onboarding.

### Consultation Form Fields
| Field | Type | Validation |
|-------|------|------------|
| eventDate | date | required, future date |
| eventType | select | required |
| location | text | required, min 3 chars |
| phoneNumber | tel | required, valid phone |
| message | textarea | optional, max 500 chars |

**Note**: Backend CreateBookingSchema only has photographerId, eventDate, message. Frontend will combine eventType, location, phoneNumber into the message field before sending.

### Photographer Onboarding Form (SIMPLE)
| Field | Type | Validation |
|-------|------|------------|
| username | text | required, 3-30 chars, alphanumeric+underscore |
| location | select | required (Indian cities) |
| specialties | multi-select | optional, max 3 (keep it simple) |
| priceFrom | number | optional, positive number |

**Note**: Bio is optional - can be added later. Keep onboarding minimal!

---

## TODOs

### Wave 1: Foundation

- [ ] **1. Install and Configure shadcn/ui**

  **What to do:**
  - Initialize shadcn/ui in frontend
  - Install ALL needed components: button, card, input, label, select, textarea, badge, avatar, separator, skeleton, sheet, dialog, calendar, popover, command
  - Configure custom theme with brand colors

  **Acceptance Criteria:**
  - [ ] shadcn/ui initialized
  - [ ] All components installed
  - [ ] Build succeeds

  **Commit**: `chore(ui): initialize shadcn/ui`

- [ ] **2. Install Validation Libraries**

  **What to do:**
  - Install zod (^3.25.76), react-hook-form, @hookform/resolvers

  **Commit**: Group with Task 1

- [ ] **3. Install Sonner**

  **What to do:**
  - Install sonner for toasts

  **Commit**: Group with Task 1

- [ ] **4. Create Shared Validation Schemas**

  **What to do:**
  - Create `frontend/src/lib/validations/auth.ts` - LoginSchema, RegisterSchema
  - Create `frontend/src/lib/validations/photographer.ts` - PhotographerOnboardingSchema
  - Create `frontend/src/lib/validations/consultation.ts` - ConsultationSchema (frontend only, extends backend)
  - Export TypeScript types

  **Notes:**
  - RegisterSchema: fullName, email, password (no role!)
  - ConsultationSchema: eventDate, eventType, location, phoneNumber, message (frontend combines extras into message)
  - PhotographerOnboardingSchema: username, location, specialties, priceFrom (bio optional)

  **Commit**: `feat(validations): add shared zod schemas`

- [ ] **5. Create Reusable Form Components**

  **What to do:**
  - Create FormInput, FormSelect, FormTextarea, FormMultiSelect components
  - All integrate with react-hook-form
  - Show field-level errors

  **Commit**: `feat(forms): add reusable form components`

- [ ] **6. Create Toast Hook**

  **What to do:**
  - Create useToast hook with success/error/info helpers

  **Commit**: Group with Task 5

### Wave 2: Core Forms

- [ ] **7. Rebuild Login Form**

  **What to do:**
  - Rewrite login page with shadcn components
  - Use React Hook Form + Zod
  - Show field errors
  - Toast on success/error
  - Show password toggle

  **Commit**: `feat(auth): rebuild login form`

- [ ] **8. Rebuild Register Form (SIMPLE)**

  **What to do:**
  - Rewrite register page
  - Fields: fullName, email, password, confirmPassword
  - NO role selection (all users are "user" by default)
  - Password strength indicator
  - Toast on success + redirect

  **Commit**: `feat(auth): rebuild register form`

- [ ] **9. Rebuild Consultation Form**

  **What to do:**
  - Rewrite consultation page
  - Fields: eventDate, eventType, location, phoneNumber, message
  - Combine eventType, location, phoneNumber into message for backend
  - Toast on success

  **Commit**: `feat(consultation): rebuild consultation form`

- [ ] **10. Create Photographer Onboarding (SIMPLE)**

  **What to do:**
  - Create `/photographer/onboard/page.tsx`
  - Fields: username, location (select), specialties (multi-select, max 3), priceFrom
  - Username availability check
  - Toast on success + redirect to profile

  **Commit**: `feat(onboarding): add photographer onboarding`

- [ ] **11. Update Layout with Toaster**

  **What to do:**
  - Add Toaster to layout.tsx
  - Position: top-right

  **Commit**: Group with Task 12

- [ ] **12. Add Loading Skeletons**

  **What to do:**
  - Add loading.tsx for photographers list
  - Add loading.tsx for photographer profile

  **Commit**: `feat(ui): add loading skeletons`

### Wave 3: UI Polish

- [ ] **13. Enhance Search Filters**

  **What to do:**
  - Update photographers page
  - Use shadcn Select, Input, Badge
  - Mobile filter drawer (use shadcn Sheet)

  **Commit**: `feat(ui): enhance search filters`

- [ ] **14. Polish Landing Page**

  **What to do:**
  - Update landing page with shadcn components
  - Show featured photographers
  - CTA to browse (no login required)

  **Commit**: `feat(ui): polish landing page`

- [ ] **15. Update Photographer Profile**

  **What to do:**
  - Update profile page styling
  - Use shadcn Card, Badge
  - Show portfolio grid
  - CTA for consultation

  **Commit**: `feat(ui): update photographer profile`

- [ ] **16. Add Empty States**

  **What to do:**
  - Empty state for no search results
  - Empty state for no portfolio
  - Error boundary

  **Commit**: `feat(ui): add empty states`

- [ ] **17. Mobile Responsiveness**

  **What to do:**
  - Test all pages on mobile
  - Fix any issues

  **Commit**: `feat(ui): mobile responsiveness`

### Wave 4: Verification

- [ ] **18. Integration Testing**

  **What to do:**
  - Test all forms end-to-end
  - Verify validations work
  - Verify toasts work

- [ ] **19. Mobile QA**

  **What to do:**
  - Test on mobile viewports
  - Document issues

- [ ] **20. Accessibility Audit**

  **What to do:**
  - Run Lighthouse
  - Fix critical issues

- [ ] **21. Final Cleanup**

  **What to do:**
  - Remove console.logs
  - Fix lint errors
  - Build check

  **Commit**: `chore(cleanup): final cleanup`

---

## Indian Cities (Top 20 for MVP)

Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana

---

## Photography Specialties

Wedding, Portrait, Event, Commercial, Fashion, Nature, Real Estate, Food, Sports, Product, Newborn, Maternity, Corporate, Concert

---

## Success Criteria

- [ ] Users can browse photographers WITHOUT login
- [ ] Photographer onboarding is SIMPLE (4 fields)
- [ ] All forms have validation
- [ ] All forms show errors
- [ ] Toast notifications work
- [ ] Mobile responsive
- [ ] Build succeeds
- [ ] No TypeScript errors

---

## Backend Changes (If Needed)

The following backend changes may be needed to support the simplified MVP:

1. **User Registration**: Currently accepts fullName, email, password. This is fine - all users register as "user" role.

2. **Consultation/Booking**: Currently CreateBookingSchema accepts photographerId, eventDate, message. Frontend will combine eventType, location, phoneNumber into the message field. No backend change needed.

3. **Photographer Profile**: Backend already supports username, bio, location, specialties, priceFrom. Frontend onboarding will use these fields. No backend change needed.

**Conclusion**: No backend changes required for MVP! Frontend can work with existing APIs.
