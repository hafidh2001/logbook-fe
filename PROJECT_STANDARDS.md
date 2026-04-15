# Project Standards Guide

**Author:** Hafidh Ahmad Fauzan  
**GitHub:** [https://github.com/hafidh2001](https://github.com/hafidh2001)

## Overview
This document outlines the coding standards, architectural decisions, and best practices for the CP-Antrean-Truck project. Following these standards ensures consistency, maintainability, and scalability across the codebase.

## Project Description
CP-Antrean-Truck is a mobile-first React application for warehouse staff to manage truck queues and production codes.

### Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication

### Key Features
- Truck queue management
- Production code tracking per truck
- Production code entry with jebolan management
- Gate assignment for trucks
- Real-time updates with optimistic UI
- Mobile-first responsive design

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Folder Usage Guidelines](#2-folder-usage-guidelines)
3. [Import Standards](#3-import-standards)
4. [Type Declaration Standards](#4-type-declaration-standards)
5. [Naming Conventions](#5-naming-conventions)
6. [Module Boundaries](#6-module-boundaries)
7. [Best Practices](#7-best-practices)
8. [Module Naming Convention](#8-module-naming-convention)
9. [Data Flow and localStorage Management](#9-data-flow-and-localstorage-management)
10. [Authentication & Encryption](#10-authentication--encryption)
11. [API Integration Standards](#11-api-integration-and-loading-state-standards)
12. [Form Standards (React Hook Form + Zod)](#12-form-standards)
13. [Environment Configuration](#13-environment-configuration)
14. [Common Pitfalls to Avoid](#14-common-pitfalls-to-avoid)
15. [BaseTable Cell Pattern Standards](#15-basetable-cell-pattern-standards)

## 1. Project Structure

```
src/
├── pages/              # React page components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── services/           # API communication layer
├── functions/          # Business logic & helpers
├── utils/              # Pure utility functions
├── hooks/              # Custom React hooks
├── constants/          # App constants
├── components/         # Reusable UI components
└── assets/             # Static assets (images, icons, fonts)
```

### Key Principles:
- **Modular Organization**: Group related files by feature/module
- **Clear Separation**: Business logic in `/functions`, utilities in `/utils`
- **Type Safety**: All modules have corresponding type definitions in `/types`
- **Single Responsibility**: Each file has one clear purpose

## 2. Folder Usage Guidelines

### When to use each folder:

#### `/pages`
- React components that represent full pages/routes
- Each page should have its own folder
- Page-specific components go in `_components` subfolder
- Example: `WarehouseDetailPage.tsx`, `HomePage.tsx`
- **All pages must be exported from `/pages/index.ts` using lazy loading pattern**

### Page Export Pattern (Lazy Loading)
All pages must be exported from `/pages/index.ts` using the `lazyLoad` utility for code splitting:

```typescript
// /pages/index.ts
import { lazyLoad } from '@/components/LazyLoad';

export const ExamplePage = lazyLoad(() => import('./example/example/ExamplePage'));
export const ExampleDetailPage = lazyLoad(() => import('./example/exampleDetail/ExampleDetailPage'));
```

### Page Import Pattern
Pages should be imported from `@/pages` in App.tsx, NOT from the direct file path:

```typescript
// ✅ Good - import from @/pages
import { ExamplePage } from '@/pages';

// ❌ Bad - direct import from file path
import ExamplePage from '@/pages/example/example/ExamplePage';
```

### Important Notes
- **DO NOT delete the `/pages/example/` directory** - These are reference implementations that serve as a template for creating new pages
- When adding new pages, always follow the same pattern as the example pages

#### `/store`
- Zustand state management stores
- One store per page/module for isolation
- Named as `[module]Store.ts`
- Example: `warehouseDetailStore.ts`, `homeStore.ts`

#### `/types`
- TypeScript interfaces, types, and enums
- Organized by module/feature
- Shared types go in root `types/index.ts`
- Module-specific types in `types/[module]/`
- Example: `types/warehouseDetail/index.ts`

#### `/services`
- API calls and external service integrations
- HTTP request logic
- Data transformation for API
- Example: `warehouseApi.ts`, `authService.ts`

#### `/functions`
- Business logic functions
- Data processing and transformation
- Complex calculations
- Encryption/decryption logic
- Type guards and validators
- Example: `decrypt.ts`, `warehouseHelpers.ts`, `calculatePrice.ts`

#### `/utils`
- Pure utility functions (no business logic)
- Route configuration
- General-purpose helpers
- No side effects
- Example: `routes.ts`, `formatDate.ts`, `classNames.ts`

#### `/hooks`
- Custom React hooks
- Reusable stateful logic
- Must start with "use"
- Example: `useModal.ts`, `useDebounce.ts`, `useLocalStorage.ts`

#### `/constants`
- Application constants
- Configuration values
- Enum-like objects
- Magic numbers/strings
- Example: `warehouse.ts`, `apiEndpoints.ts`, `colors.ts`

#### `/components`
- Shared React components
- UI components used across multiple pages
- Should be generic and reusable
- Example: `ui/button.tsx`, `layout/AppWrapper.tsx`

### Decision Flow:
1. **Is it a full page?** → `/pages`
2. **Is it state management?** → `/store`
3. **Is it a type definition?** → `/types`
4. **Is it an API call?** → `/services`
5. **Is it business logic or data processing?** → `/functions`
6. **Is it a pure utility with no business logic?** → `/utils`
7. **Is it a reusable React hook?** → `/hooks`
8. **Is it a constant value?** → `/constants`
9. **Is it a reusable UI component?** → `/components`

#### `/src/assets/images`
- Menyimpan file SVG atau image yang perlu dikonversi menjadi komponen JSX
- **Logo.tsx**: File untuk logo proyek, ikuti pola deklarasi JSX
- **Icon.tsx**: File terpusat untuk membungkus icon dari library pihak ketiga (e.g., lucide-react, feather-icons)

### Icon Management Pattern
Semua icon dari library pihak ketiga HARUS didaftarkan di `/src/assets/images/Icon.tsx` terlebih dahulu sebelum digunakan. Pattern ini memastikan:
- Konsistensi penggunaan icon di seluruh proyek
- Mudah dalam manajemen perubahan icon (change management)

```tsx
// /src/assets/images/Icon.tsx
import {
  PieChart,
  User,
  Lock,
  // ... icon lain dari library
} from "lucide-react";

export const icons = {
  PieChart,
  User,
  Lock,
  // ... export semua icon yang sudah didaftarkan
};
```

### Cara Menggunakan Icon
```tsx
// ✅ Good - import dari Icon.tsx
import { icons } from "@/assets/images/Icon";

const MyComponent = () => (
  <icons.User className="h-5 w-5" />
);

// ❌ Bad - import langsung dari library
import { User } from "lucide-react";

const MyComponent = () => (
  <User className="h-5 w-5" />
);
```

**Note:** Untuk custom SVG yang dibuat sendiri, tetap gunakan pola `Logo.tsx` dengan mendeklarasikan langsung sebagai komponen React.

### Contoh Deklarasi JSX untuk Images:
```tsx
import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="..."
    height="..."
    viewBox="0 0 ..."
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* SVG content */}
  </svg>
);
```

## 2. Import Standards

### Order of Imports
1. External libraries (React, Zustand, etc.)
2. Types from the same module
3. Types from other modules (only if necessary)
4. Utilities and services
5. Components

### Example:
```typescript
// External libraries
import { create } from 'zustand';

// Module-specific types
import type { WarehouseDetailStore } from '@/types/warehouseDetail/store';

// Shared types (only what's needed)
import { ElementTypeEnum } from '@/types';

// Services and utilities
import { warehouseApi } from '@/services/warehouseApi';
import { decryptAES } from '@/utils/decrypt';
```

## 3. Type Declaration Standards

### Store Types
- Each module should have its own store interface in `types/[module]/store.ts`
- Import only the types you actually use in the implementation
- Use `type` imports when possible to avoid runtime overhead

### Shared Types
- Common enums and interfaces go in `@/types/index.ts`
- Module-specific types go in `@/types/[module]/index.ts`

### Global Types (`/src/types/index.ts`)
Types yang bersifat global (digunakan di banyak tempat) dan tidak perlu bikin direktori sendiri, taruh di `/src/types/index.ts`. Ini seperti enum di bahasa lain.

```typescript
// /src/types/index.ts

// Nullable type - untuk field yang bisa null
export type Nullable<T> = T | null;

// BasicSelectOpt - untuk option di select component
export type BasicSelectOpt = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

// Contoh penggunaan Nullable
export type TPpds = {
  no: number;
  displayName: string;
  username: string;
  email: Nullable<string>; // sama dengan string | null
  phone: string;
  stage: Nullable<string>; // bisa string atau null
  logbook: number;
};

// Contoh penggunaan BasicSelectOpt untuk select options
export const stageOptions: BasicSelectOpt[] = [
  { value: "", label: "Semua Stage" },
  { value: "Radiologi", label: "Radiologi" },
  { value: "Stase Rekon I", label: "Stase Rekon I" },
];
```

### Kenapa Gunakan Nullable dan BasicSelectOpt?

| Cara Lama | Cara Baru | Keterangan |
|-----------|-----------|------------|
| `string \| null` | `Nullable<string>` | Lebih readable dan konsisten |
| Custom interface untuk select | `BasicSelectOpt` | Standar untuk semua select component |

## 4. Naming Conventions

### Files
- Components: PascalCase (e.g., `WarehouseDetailPage.tsx`)
- Stores: camelCase with "Store" suffix (e.g., `warehouseDetailStore.ts`)
- Types: camelCase folders, PascalCase interfaces
- Utils: camelCase (e.g., `decrypt.ts`)

### Types/Interfaces
- Interfaces: Prefix with "I" (e.g., `IWarehouse`)
- Types: Prefix with "T" (e.g., `TAnyStorageUnit`)
- Enums: Suffix with "Enum" (e.g., `StorageTypeEnum`)

## 5. Module Boundaries

### Warehouse Detail Module
- Purpose: Authenticated editing of warehouse layouts
- Store: `warehouseDetailStore`
- Types: `/types/warehouseDetail/`
- Dependencies: Can import from shared services and utils

### Warehouse View Module
- Purpose: Public read-only display
- Store: `warehouseViewStore`
- Types: `/types/warehouseView/`
- Dependencies: Minimal, only what's needed for display

## 6. Best Practices

### Imports
- Only import what you use
- Prefer named imports over default imports
- Use type imports for TypeScript types: `import type { ... }`

### State Management
- Each page/module has its own store
- Stores should be self-contained
- Clean up state on unmount with `reset()` method

### Type Safety
- Always define return types for functions
- Use proper type assertions when necessary
- Avoid `any` type

### Code Organization
- Keep related code together (by feature/module)
- Shared code goes in appropriate shared folders
- Page-specific code stays in page folders

## 7. Module Naming Convention

### Page Organization by Role
Pages are organized under role directories, but module naming follows functionality:

```
/pages/[role]/[moduleName]/
```

Examples:
- `/pages/admin/warehouseDetail/` → Module: warehouseDetail
- `/pages/admin/warehouseView/` → Module: warehouseView  
- `/pages/kerani/antreanTruck/` → Module: antreanTruck

### Store and Types Naming
Store and types use the module name, NOT the role name:

```
/store/[moduleName]Store.ts
/types/[moduleName]/
```

Examples:
- `/store/antreanTruckStore.ts` (NOT keraniStore.ts)
- `/types/antreanTruck/` (NOT /types/kerani/)

### URL Routing
URLs should NOT include role names:

```typescript
// ✅ Good
static get antreanTruck() {
  return `/antrean-truck` as const;
}

// ❌ Bad
static get antreanTruck() {
  return `/kerani/antrean-truck` as const;
}
```

### Import Examples
```typescript
// Importing from antreanTruck module (under kerani role)
import { AntreanTruckPage } from '@/pages/kerani/antreanTruck';
import { useAntreanTruckStore } from '@/store/antreanTruckStore';
import type { IAntreanCard } from '@/types/antreanTruck';
```

## 8. Data Flow and localStorage Management

### Mock Data Structure
All mock data is centralized in `/data/kerani-mock-data.json` containing:
- `antreanTruck`: List of trucks in queue
- `productionCodes`: Production codes by nopol (license plate)

### localStorage Keys Convention
```
antrean-truck-data              # List of trucks in queue
production-codes-{nopol}        # Production codes for specific truck
production-code-entry-{nopol}-{id}  # Entry data for specific production code
```

### Data Flow
1. **Initial Load**: Mock data is loaded into localStorage if not present
2. **AntreanTruck Page**: Reads from `antrean-truck-data`
3. **ProductionCode Page**: Reads from `production-codes-{nopol}`
4. **ProductionCodeEntry Page**: 
   - Reads production code data from `production-codes-{nopol}`
   - Saves entry data to `production-code-entry-{nopol}-{id}`
   - Updates completed_entries in parent data

### Store Responsibilities
- **antreanTruckStore**: Manages truck queue list
- **productionCodeStore**: Manages production codes for a specific truck
- Both stores handle localStorage initialization and persistence

### Best Practices for localStorage
- Always initialize with mock data if localStorage is empty
- Use consistent key naming convention
- Update parent data when child data changes
- Clear data appropriately on logout/reset

## 9. Authentication & Session Management

### JWT + Cookie Authentication Flow
This project uses JWT tokens stored in cookies for authentication.

### Token Structure
- **access_token**: JWT token with 15 minutes expiry
- **refresh_token**: JWT token with 7 days expiry for refreshing access token

### File Structure
```
/functions/jwt.ts          # JWT utility functions
/store/authStore.ts         # Auth state management
/components/auth/ProtectedRoute.tsx  # Route guard for protected pages
/components/auth/GuestRoute.tsx      # Route guard for guest pages (login)
/components/ui/LogoutModal.tsx      # Logout confirmation modal
/data/auth.ts               # Mock user data for development
```

### JWT Utility Functions (jwt.ts)
```typescript
// Generate JWT tokens
jwtService.generateTokens(payload: JWTPayload): Promise<{ accessToken, refreshToken }>

// Set tokens in cookies
jwtService.setTokens(accessToken: string, refreshToken: string): void

// Get tokens from cookies
jwtService.getTokens(): { accessToken?: string, refreshToken?: string }

// Verify and decode JWT token
jwtService.verifyToken(token: string): Promise<JWTPayload | null>

// Get current user from valid token
jwtService.getCurrentUser(): Promise<JWTPayload | null>

// Clear all auth cookies
jwtService.clearTokens(): void

// Refresh access token using refresh token
jwtService.refreshAccessToken(): Promise<boolean>
```

### Auth Store (authStore.ts)
```typescript
// State
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Actions
interface AuthActions {
  init: () => Promise<void>;      // Initialize auth state from cookies
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
}
```

### Authentication Flow

#### 1. App Initialization
```typescript
// App.tsx
const { init } = useAuthStore();

useEffect(() => {
  init(); // Check cookies and restore session on app load
}, [init]);
```

#### 2. Login Flow
```typescript
// LoginPage calls authStore.login()
const login = async (username: string, password: string) => {
  // 1. Validate against mock data or API
  // 2. Generate JWT tokens
  // 3. Store in cookies
  // 4. Update store state
  // 5. Redirect to dashboard
};
```

#### 3. Route Protection
```typescript
// ProtectedRoute - for pages requiring authentication
<ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
  <AdminLayout>
    <PageContent />
  </AdminLayout>
</ProtectedRoute>

// GuestRoute - for pages requiring no authentication (login page)
<GuestRoute>
  <LoginPage />
</GuestRoute>
```

#### 4. Logout Flow
```typescript
// Click logout in sidebar → Show LogoutModal
// Confirm logout → Clear cookies → Navigate to login
const handleLogout = async () => {
  await logout();
  navigate(ROUTES.login);
};
```

### Routing Rules
1. `/` → Redirects to `/admin/dashboard`
2. Unauthenticated user accessing protected route → Redirect to `/auth/login`
3. Authenticated user accessing login page → Redirect to `/admin/dashboard`
4. All `/admin/*` routes require `INSTITUTION` role

### Security Best Practices
- JWT tokens are HttpOnly equivalent (set via document.cookie)
- Always validate token presence before API calls
- Clear tokens on logout
- Use role-based access control for protected routes
- Never store sensitive data in localStorage for auth tokens

### Environment Variables
```bash
VITE_JWT_SECRET=your_jwt_secret_key_here
```

## 10. API Integration and Loading State Standards

### Store State Management
All stores that perform API calls must include these standard states:
```typescript
interface StandardApiStore {
  isLoading: boolean;      // Always start with true for pages with API calls
  error: string | null;    // Error message if API fails
  hasInitialized: boolean; // Prevents double fetching
}
```

### Page Component Pattern
Pages using API calls must follow this pattern to prevent double fetching and loading race conditions:

```typescript
export function SomePage() {
  const { data, isLoading, error, hasInitialized, loadDataFromApi, reset } = useStore();

  useEffect(() => {
    const loadData = async () => {
      if (!hasInitialized) {
        // Get encrypted data from URL query params
        const searchParams = new URLSearchParams(location.search);
        const encryptedData = searchParams.get('key');
        
        if (!encryptedData) {
          navigate(ROUTES.base);
          return;
        }
        
        await loadDataFromApi(encryptedData);
      }
    };
    
    loadData();
  }, [hasInitialized, location.search, navigate]); // ❌ Do NOT include API functions in dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Early returns for loading and error states
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return <MainComponent data={data} />;
}
```

### Simple Rules for API Integration:
1. **Simple guard**: Only check `hasInitialized` in store function
2. **Empty dependency array**: Use `[]` in useEffect, no other dependencies  
3. **Early returns**: Use if/return pattern in page components
4. **Cleanup**: Call `reset()` on unmount

### Import Management Rules:
1. **Only import what you use**: Remove any unused imports immediately
2. **No unused hooks**: Don't import `useRef`, `useState`, etc. if not actually used
3. **Clean imports after refactoring**: When changing patterns (e.g., ref → store state), remove old imports
4. **TypeScript warnings**: Always fix "declared but never read" warnings
5. **Import ordering**: Follow the established import order pattern

### Store Implementation Pattern:
```typescript
export const useModuleStore = create<ModuleStore>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  loadDataFromApi: async (encryptedData: string) => {
    if (get().hasInitialized) return;

    set({ isLoading: true, error: null });
    
    try {
      const decrypted = await decryptAES<DecryptData>(encryptedData);
      const data = await api.getData(decrypted.user_token);
      
      set({ 
        data, 
        isLoading: false,
        hasInitialized: true
      });
    } catch (error) {
      set({
        data: [],
        isLoading: false,
        error: error.message,
        hasInitialized: true
      });
    }
  },

  reset: () => set({
    data: [],
    isLoading: false,
    error: null,
    hasInitialized: false
  })
}));

## 12. Form Standards (React Hook Form + Zod + Shadcn UI)

### Overview
All forms in the project must use:
- **React Hook Form** for form state management
- **Zod** for validation schema
- **Shadcn UI components** for form UI (Input, Button, Checkbox, etc.)

This ensures type-safe, consistent form handling and unified UI across the application.

### Required Packages
```bash
bun add react-hook-form zod @hookform/resolvers
bun add @radix-ui/react-checkbox @radix-ui/react-label
```

### Available Shadcn Form Components
All form UI components are located in `/src/components/ui/`:

| Component | File | Usage |
|-----------|------|-------|
| Input | `input.tsx` | Text input fields |
| Button | `button.tsx` | Submit/action buttons |
| Checkbox | `checkbox.tsx` | Checkbox fields |
| FormField | `form.tsx` | Wraps label, input, and error |
| FormLabel | `form.tsx` | Label for form fields |
| FormControl | `form.tsx` | Control wrapper |
| FormMessage | `form.tsx` | Error message display |

### Schema Definition
Define validation schemas using Zod at the top of the form component file:

```typescript
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi").min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

### Form Component Pattern (Shadcn)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  field1: z.string().min(1, "Field 1 harus diisi"),
  field2: z.string().min(1, "Field 2 harus diisi"),
});

type FormData = z.infer<typeof formSchema>;

export const MyFormPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field1: "",
      field2: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // TODO: Implement submit logic
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form field with Shadcn */}
      <FormField error={errors.field1?.message}>
        <FormLabel htmlFor="field1">Field 1</FormLabel>
        <FormControl>
          <Input id="field1" placeholder="Enter value" {...register("field1")} />
        </FormControl>
        <FormMessage />
      </FormField>

      {/* Checkbox field */}
      <FormField className="flex items-center gap-2">
        <Checkbox id="rememberMe" {...register("rememberMe")} />
        <FormLabel htmlFor="rememberMe" className="font-normal">
          Remember me
        </FormLabel>
      </FormField>

      {/* Submit button */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Memuat..." : "Submit"}
      </Button>
    </form>
  );
};
```

### Best Practices
1. **Use Shadcn components**: Always use `Input`, `Button`, `Checkbox` from shadcn instead of native HTML elements
2. **Use Form components**: Wrap fields with `FormField`, `FormLabel`, `FormControl`, `FormMessage`
3. **Define schema at module level**: Place Zod schema outside the component for reusability
4. **Use type inference**: Use `z.infer<typeof schema>` to derive TypeScript types
5. **Provide default values**: Initialize form with appropriate default values
6. **Display validation errors**: Use `<FormMessage />` to show error messages
7. **Handle loading state**: Disable submit button and show loading indicator via `isLoading`
8. **Use descriptive error messages**: Write error messages in Indonesian for consistency
9. **Pass form data as object**: Function parameters should accept the entire form data object, not individual fields

### Clean Architecture - Function Parameters
Functions that receive form data should accept the **entire form object**, not individual fields. This ensures:
- **Type safety**: TypeScript knows exactly what fields are expected
- **Scalability**: Adding new fields doesn't require changing function signatures
- **Readability**: Clean, maintainable code

```typescript
// ✅ Good - Accept object, type-safe via inference
const onSubmit = async (data: LoginFormData) => {
  await login(data); // data is already typed by Zod inference
};

// ❌ Bad - Individual parameters, not scalable
const onSubmit = async (data: LoginFormData) => {
  await login(data.username, data.password); // Requires transform if API needs object
};
```

### When Transformation is Needed
Only transform data when API/service requires different structure:

```typescript
// ✅ Good - Direct pass when structure matches
await login(data);

// ✅ Good - Transform only when needed
await api.createUser({
  ...data,
  createdAt: new Date().toISOString(), // Add computed field
});
```

### Validation Rules
- String fields: Use `.min(1, "Pesan error")` for required fields
- Email fields: Use `.email()` for email validation
- Optional fields: Use `.optional()` and handle accordingly
- Custom validation: Chain `.refine()` for complex validation logic

### Error Styling
```typescript
// Apply error border color
className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0062A3] focus:border-transparent ${
  errors.fieldName ? "border-red-500" : "border-gray-300"
}`}
```

## 13. Environment Configuration

### Required Environment Variables
All environment variables must be prefixed with `VITE_` to be accessible in the frontend:

```bash
# .env file structure
# Decrypt Configuration
VITE_DECRYPT_SECRET_KEY=your_secret_key_here

# API Configuration
VITE_API_URL=https://your-api-domain.com/cp_fifo/index.php?r=Api
VITE_API_TOKEN=your_api_token_here
```

### Environment Files
- `.env` - Local development environment (never commit)
- `.env.example` - Example configuration (commit this)
- `.env.production` - Production environment (managed by DevOps)

### TypeScript Support
Environment variables are typed in `/src/env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_DECRYPT_SECRET_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_API_TOKEN: string
}
```

### Usage in Code
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;
```

## 15. BaseTable Cell Pattern Standards

### Overview
All pages using `BaseTable` component must follow this cell rendering pattern for consistency across the codebase.

### Required Cell Pattern
Always use `row.original` to access cell data, never use `getValue()`:

```typescript
// ✅ Good - Using row.original
cell: ({ row: { original } }) => (
  <span className="font-medium">{original.fieldName ?? "-"}</span>
)

// ❌ Bad - Using getValue
cell: ({ getValue }) => (
  <span className="font-medium">{getValue() as string}</span>
)
```

### Null Handling
Always use null coalescing (`??`) to display a fallback value when data is null or undefined:

```typescript
// ✅ Good - Proper null handling
cell: ({ row: { original } }) => (
  <span className="font-medium">{original.name ?? "-"}</span>
)

// ✅ Good - Number fallback
cell: ({ row: { original } }) => (
  <span>{original.totalScored ?? 0}</span>
)

// ❌ Bad - No fallback
cell: ({ row: { original } }) => (
  <span>{original.name}</span>  // Can render "null" or "undefined"
)
```

### Standard Cell Templates

#### Simple Text Field
```typescript
cell: ({ row: { original } }) => (
  <span className="font-medium">{original.fieldName ?? "-"}</span>
)
```

#### Nullable Text Field
```typescript
cell: ({ row: { original } }) => {
  return original.fieldName ? (
    <span>{original.fieldName}</span>
  ) : (
    <span className="text-gray-400">-</span>
  );
}
```

#### Truncated Text with Tooltip
```typescript
cell: ({ row: { original } }) => {
  return original.notes ? (
    <span className="truncate block max-w-[180px]" title={original.notes}>
      {original.notes}
    </span>
  ) : (
    <span className="text-gray-400">-</span>
  );
}
```

#### Badge/Tag Display
```typescript
cell: ({ row: { original } }) => {
  return original.stase ? (
    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
      {original.stase}
    </span>
  ) : (
    <span className="text-gray-400">-</span>
  );
}
```

#### Icon with Text
```typescript
cell: ({ row: { original } }) => {
  return original.hospital ? (
    <span className="flex items-center gap-1">
      <icons.MapPin className="h-3 w-3 text-gray-400" />
      {original.hospital}
    </span>
  ) : (
    <span className="text-gray-400">-</span>
  );
}
```

#### Status Badge
```typescript
cell: ({ row: { original } }) => getStatusBadge(original.status)
```

### Example Column Definition
```typescript
const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "displayName",
    header: "Nama",
    size: 180,
    cell: ({ row: { original } }) => (
      <span className="font-medium">{original.displayName ?? "-"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 180,
    cell: ({ row: { original } }) => {
      return original.email ? (
        <span>{original.email}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    size: 150,
    cell: ({ row: { original } }) => {
      return original.code ? (
        <span className="font-mono text-sm">{original.code}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
];
```

### Key Principles
1. **Always destructure `row.original`** - Never use `getValue()` directly
2. **Always provide fallback** - Use `?? "-"` or `?? 0` for null values
3. **Consistent styling** - Follow the same pattern for similar field types
4. **Handle null explicitly** - Check nullable fields before rendering

## 14. Common Pitfalls to Avoid

### ❌ DON'T: Hardcode sensitive data
```typescript
// Bad
const API_TOKEN = 'dctfvgybefvgyabdfhwuvjlnsd';
```

### ✅ DO: Use environment variables
```typescript
// Good
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
```

### ❌ DON'T: Create standalone type files
```typescript
// Bad: /src/types/antrean.ts
export interface IAntrean { ... }
```

### ✅ DO: Organize types by module
```typescript
// Good: /src/types/antreanTruck/index.ts
export interface IAntrean { ... }
```

### ❌ DON'T: Mix business logic in utils
```typescript
// Bad: /src/utils/calculatePrice.ts
export function calculateWarehousePrice() { ... }
```

### ✅ DO: Put business logic in functions folder
```typescript
// Good: /src/functions/warehouseCalculations.ts
export function calculateWarehousePrice() { ... }
```

### ❌ DON'T: Use any type
```typescript
// Bad
const handleData = (data: any) => { ... }
```

### ✅ DO: Define proper types
```typescript
// Good
const handleData = (data: IWarehouseData) => { ... }
```

### ❌ DON'T: Forget cleanup in components
```typescript
// Bad
useEffect(() => {
  loadData();
}, []);
```

### ✅ DO: Clean up on unmount
```typescript
// Good
useEffect(() => {
  return () => store.reset();
}, []);
```

## Important Notes

### API Response Handling
1. **Always handle double-encoded JSON**: Some API responses may be double-encoded
2. **Check for error property**: API errors are returned as `{ error: "message" }`
3. **Transform data at the service layer**: Keep components clean

### State Management Rules
1. **One store per module**: Don't share stores between unrelated features
2. **Reset on unmount**: Always clean up store state when leaving a page
3. **Use hasInitialized pattern**: Prevent double API calls in React StrictMode

### Security Best Practices
1. **Never commit .env files**: Only .env.example should be in version control
2. **Validate decrypted data**: Always validate structure after decryption
3. **Use HTTPS**: All API calls must use secure connections

### Performance Guidelines
1. **Lazy load pages**: Use React.lazy for route components
2. **Batch API calls**: Use Promise.all for parallel requests
3. **Implement proper loading states**: Show skeleton screens during data fetch

### UI/UX Standards

#### State Management Patterns
```typescript
// ✅ Optimistic Updates
const handleUpdate = async (data) => {
  // Update UI immediately
  setLocalState(data);
  
  try {
    await api.update(data);
  } catch (error) {
    // Rollback on error
    setLocalState(previousData);
    showToast('Update failed', 'error');
  }
};

// ✅ Loading States
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```

#### Mobile-First Design
```typescript
// ✅ Responsive Container
<div className="max-w-md mx-auto h-screen">
  {/* Mobile-optimized content */}
</div>

// ✅ Touch-Friendly Buttons
<button className="min-h-[44px] px-4 py-2">
  Click Me
</button>
```

#### Toast Notifications
```typescript
// ✅ Toast Implementation
import { showToast } from '@/utils/toast';

// Success notification
showToast('Operation successful', 'success');

// Error notification
showToast('Something went wrong', 'error');

// Custom duration
showToast('Processing...', 'success', { duration: 5000 });
```

### Code Quality Checklist
- [ ] Follows project structure standards
- [ ] TypeScript types properly defined
- [ ] No hardcoded values (use constants/env vars)
- [ ] Proper error handling implemented
- [ ] Loading states for async operations
- [ ] Mobile responsive design
- [ ] No console.log statements
- [ ] Imports are organized and used
- [ ] Components follow naming conventions
- [ ] Store includes reset method

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Build passes without warnings
- [ ] All console.logs removed
- [ ] API endpoints point to production
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Mobile responsive
- [ ] Performance optimized