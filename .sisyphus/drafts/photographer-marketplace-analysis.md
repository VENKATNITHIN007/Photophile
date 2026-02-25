# Draft: Photographer Marketplace MVP - Analysis & Planning

## Project Overview
**LensLoom** - A photographer marketplace platform where:
- Photographers list themselves and add portfolios
- Each photographer gets a subdomain landing page (`username.lensloom.com`)
- Users search photographers by Indian cities, specialty, location
- Users can book/consult photographers (MVP: phone number consultation only)
- No dashboard or booking platform in MVP - consultation happens externally

---

## Current Tech Stack

### Backend (Express.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod (exists in backend!)
- **Auth**: JWT with HTTP-only cookies
- **File Uploads**: Multer + Cloudinary
- **API Structure**: RESTful with `/api/v1` prefix

### Frontend (Next.js 15 + React 19)
- **Framework**: Next.js 15.5.12 with App Router
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4 (new version!)
- **HTTP Client**: Axios
- **Auth**: JWT via HTTP-only cookies
- **NO shadcn/ui installed** - using raw HTML inputs
- **NO form validation library** - manual validation only
- **NO toast notifications** - inline error messages only

---

## Critical Issues Identified

### 1. **NO shadcn/ui Components**
- Currently using raw HTML `<input>`, `<select>`, `<textarea>` elements
- No consistent design system
- Forms look "childish" as user mentioned
- No professional component library

### 2. **NO Form Validation on Frontend**
- Backend has Zod validation (good!)
- Frontend has ZERO validation
- Manual validation in `book/[photographerId]/page.tsx` only
- No real-time field validation
- No error message display per field

### 3. **NO Toast/Notification System**
- Success/error messages inline only
- No global notification system
- Poor UX for async operations

### 4. **Inconsistent Styling**
- Mix of custom colors (brand-obsidian, brand-cyan) and default Tailwind
- No design tokens consistency
- Forms use basic gray/blue styling

### 5. **NO React Hook Form**
- All forms use manual `useState` for each field
- No form state management
- No form reset functionality
- No dirty/pristine tracking

### 6. **Type Safety Issues**
- `// @ts-expect-error` comments in dashboard
- Inconsistent type definitions between frontend/backend

---

## Current Forms Analysis

### 1. Login Form (`/login/page.tsx`)
**Issues:**
- Raw HTML inputs
- No client-side validation
- No "show password" toggle
- Basic error display (red box)
- No loading state on input

### 2. Register Form (`/register/page.tsx`)
**Issues:**
- Same as login
- No password strength indicator
- No email validation
- No confirm password field
- Role selection is basic select

### 3. Booking Form (`/book/[photographerId]/page.tsx`)
**Issues:**
- Manual validation only
- Date validation in submit handler
- No field-level error messages
- No form persistence

### 4. User Dashboard Profile Form
**Issues:**
- No validation
- No success toast
- Inline success message only

### 5. Photographer Dashboard Forms
**Issues:**
- Portfolio add form - no validation
- Profile edit form - no validation
- No error handling per field

---

## Backend Validation (Good!)

The backend already has Zod validation:

### `auth.validation.ts`
```typescript
- LoginSchema: email (valid email), password (min 6)
- RegisterSchema: fullName (min 1), email, password (min 6)
- UpdateProfileSchema: fullName, phoneNumber, avatar (URL)
```

### `photographer.validation.ts`
```typescript
- CreatePhotographerProfileSchema: userId, username (3-30 chars, regex), bio, location, specialties, priceFrom
- UpdatePhotographerProfileSchema: bio, location, specialties, priceFrom
```

---

## MVP Scope Clarification

### IN SCOPE (MVP):
1. **Landing Page** - Professional hero, featured photographers
2. **Photographer Search** - Filter by location, specialty, price
3. **Photographer Profile Pages** - Public profile with portfolio
4. **User Registration/Login** - With proper validation
5. **Consultation Flow** - Simple contact form (phone/email)
6. **Photographer Onboarding** - Create profile after registration
7. **Responsive Design** - Mobile-first approach

### OUT OF SCOPE (MVP):
1. **Booking System** - Backend exists but hide from MVP
2. **Dashboard** - Backend exists but hide from MVP
3. **Payment Integration**
4. **Real-time Chat**
5. **Reviews System** - Display only, no submission in MVP
6. **Admin Panel**

---

## Best Practices to Implement

### 1. shadcn/ui Setup
- Initialize with Next.js 15 + Tailwind v4
- Install form components: Input, Select, Textarea, Button, Card, Dialog
- Install UI components: Toast/Sonner, Avatar, Badge, Separator
- Configure custom theme for brand colors

### 2. Form Validation Architecture
- **Zod** for schema validation (share schemas between frontend/backend)
- **React Hook Form** for form state management
- **@hookform/resolvers** for Zod integration
- Real-time validation with debounce
- Field-level error messages
- Form-level error summary

### 3. Professional UI Patterns
- Consistent spacing (use design tokens)
- Proper focus states
- Loading skeletons
- Empty states
- Error boundaries
- Mobile-responsive forms

### 4. Toast Notifications
- **Sonner** for toast notifications
- Success/error/warning variants
- Auto-dismiss with progress
- Action buttons in toasts

### 5. Code Organization
```
frontend/src/
├── components/ui/          # shadcn components
├── components/forms/       # Form components with validation
├── components/feedback/    # Toast, alerts, loading states
├── lib/validations/        # Zod schemas (shared types)
├── lib/utils.ts            # cn() utility
├── hooks/use-toast.ts      # Toast hook
└── app/
    ├── (auth)/             # Auth group
    ├── (public)/           # Public pages
    └── api/                # API routes (if needed)
```

---

## Technical Decisions

### Form Strategy:
- Use **React Hook Form** + **Zod** for all forms
- Client-side validation for immediate feedback
- Server-side validation for security (already exists)
- Display field-level errors inline
- Display form-level errors at top
- Use Sonner for success notifications

### UI Strategy:
- shadcn/ui components as base
- Customize with brand colors (obsidian, cyan, teal)
- Mobile-first responsive design
- Accessible by default (ARIA labels, keyboard nav)

### Validation Strategy:
- Share Zod schemas between frontend/backend
- Real-time validation on blur
- Debounced async validation for unique fields (username, email)
- Clear error messages with suggestions

---

## Files to Create/Modify

### New Files:
1. `frontend/src/components/ui/*` - shadcn components
2. `frontend/src/components/forms/form-input.tsx` - Reusable input with validation
3. `frontend/src/components/forms/form-select.tsx` - Reusable select
4. `frontend/src/components/forms/form-textarea.tsx` - Reusable textarea
5. `frontend/src/lib/validations/auth.ts` - Shared auth schemas
6. `frontend/src/lib/validations/photographer.ts` - Shared photographer schemas
7. `frontend/src/lib/validations/booking.ts` - Shared booking schemas
8. `frontend/src/hooks/use-toast.ts` - Toast hook

### Modified Files:
1. `frontend/src/app/login/page.tsx` - New form with validation
2. `frontend/src/app/register/page.tsx` - New form with validation
3. `frontend/src/app/book/[photographerId]/page.tsx` - New form with validation
4. `frontend/src/app/photographers/page.tsx` - Better filters UI
5. `frontend/src/app/page.tsx` - Polish landing page
6. `frontend/src/app/layout.tsx` - Add Toaster component

---

## Indian Cities for Location Filter

Top cities to include in location filter:
- Mumbai
- Delhi
- Bangalore
- Hyderabad
- Chennai
- Kolkata
- Pune
- Ahmedabad
- Jaipur
- Lucknow
- Kanpur
- Nagpur
- Indore
- Thane
- Bhopal
- Visakhapatnam
- Pimpri-Chinchwad
- Patna
- Vadodara
- Ghaziabad

---

## Photography Specialties

Specialties for filter:
- Wedding
- Portrait
- Event
- Commercial
- Fashion
- Nature/Wildlife
- Real Estate
- Food
- Sports
- Documentary
- Product
- Newborn/Baby
- Maternity
- Corporate
- Concert

---

## Next Steps

1. Install shadcn/ui with Next.js 15 + Tailwind v4
2. Set up form validation infrastructure
3. Rebuild login form as reference implementation
4. Rebuild register form
5. Rebuild booking/consultation form
6. Polish search/filter UI
7. Add toast notifications
8. Mobile responsiveness pass
9. Final QA and testing
