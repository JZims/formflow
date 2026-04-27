# Live Collaborative Form Builder — Agent Instructions

## Overview

Scaffold a full-stack Next.js application called `formflow`. This is a live collaborative form builder where users can create structured forms, share them via link, and collaborators see structural edits and responses update in real time without refreshing.

The goal is a working, deployable starting point — not a production app. Prioritize clean architecture, strict typing, and modern patterns over feature completeness.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Real-time | Supabase Realtime (WebSocket) |
| Validation | Zod |
| Drag & Drop | dnd-kit |
| Testing | Jest + React Testing Library |
| Deployment target | Vercel |

---

## Project Structure

Generate the following directory structure:

```
formflow/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Landing / form list
│   ├── forms/
│   │   ├── [formId]/
│   │   │   ├── page.tsx                  # Public form fill view
│   │   │   └── edit/
│   │   │       └── page.tsx              # Form builder / editor view
│   │   └── new/
│   │       └── page.tsx                  # Create new form
│   └── responses/
│       └── [formId]/
│           └── page.tsx                  # Response aggregation view
├── components/
│   ├── builder/
│   │   ├── FieldList.tsx                 # dnd-kit sortable field list
│   │   ├── FieldItem.tsx                 # Individual draggable field
│   │   ├── FieldEditor.tsx               # Edit panel for a selected field
│   │   └── AddFieldMenu.tsx              # Dropdown to add new field types
│   ├── renderer/
│   │   ├── FormRenderer.tsx              # Schema-driven form renderer
│   │   └── fields/
│   │       ├── TextField.tsx
│   │       ├── SelectField.tsx
│   │       ├── CheckboxField.tsx
│   │       └── TextareaField.tsx
│   ├── presence/
│   │   └── PresenceAvatars.tsx           # Live collaborator indicators
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Badge.tsx
├── lib/
│   ├── supabase.ts                       # Supabase client init
│   ├── prisma.ts                         # Prisma client singleton
│   └── validators/
│       ├── form.ts                       # Zod schemas for Form
│       └── field.ts                      # Zod schemas for Field
├── prisma/
│   └── schema.prisma
├── app/api/
│   ├── forms/
│   │   ├── route.ts                      # GET list, POST create
│   │   └── [formId]/
│   │       ├── route.ts                  # GET, PATCH, DELETE form
│   │       └── fields/
│   │           └── route.ts              # POST add field, GET fields
│   └── responses/
│       └── [formId]/
│           └── route.ts                  # POST submit, GET aggregate
├── types/
│   └── index.ts                          # Shared TypeScript types
├── hooks/
│   ├── useFormSync.ts                    # Supabase realtime subscription hook
│   └── useOptimistic.ts                  # Generic optimistic update hook
└── __tests__/
    ├── validators/
    │   └── field.test.ts
    └── components/
        └── FormRenderer.test.tsx
```

---

## Data Model

Generate the following `prisma/schema.prisma`:

```prisma
model Form {
  id          String    @id @default(cuid())
  title       String
  description String?
  shareToken  String    @unique @default(cuid())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  fields      Field[]
  responses   Response[]
}

model Field {
  id           String      @id @default(cuid())
  formId       String
  form         Form        @relation(fields: [formId], references: [id], onDelete: Cascade)
  type         FieldType
  label        String
  placeholder  String?
  required     Boolean     @default(false)
  order        Int
  options      String[]    # For select/checkbox types
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  answers      Answer[]
}

model Response {
  id        String   @id @default(cuid())
  formId    String
  form      Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  answers   Answer[]
}

model Answer {
  id         String   @id @default(cuid())
  responseId String
  response   Response @relation(fields: [responseId], references: [id], onDelete: Cascade)
  fieldId    String
  field      Field    @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  value      String
}

enum FieldType {
  TEXT
  TEXTAREA
  SELECT
  CHECKBOX
}
```

---

## Shared Types

Generate `types/index.ts` with strict types derived from the Prisma schema. Include:

```ts
export type FieldType = "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  order: number
  options: string[]
}

export interface FormSchema {
  id: string
  title: string
  description?: string
  shareToken: string
  fields: FormField[]
}

export interface FieldUpdate {
  label?: string
  placeholder?: string
  required?: boolean
  order?: number
  options?: string[]
}

export interface AggregatedResponse {
  fieldId: string
  label: string
  type: FieldType
  answers: string[]
}
```

---

## Zod Validators

Generate `lib/validators/field.ts`:

```ts
import { z } from "zod"

export const FieldTypeSchema = z.enum(["TEXT", "TEXTAREA", "SELECT", "CHECKBOX"])

export const CreateFieldSchema = z.object({
  type: FieldTypeSchema,
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  order: z.number().int().min(0),
  options: z.array(z.string()).default([]),
})

export const UpdateFieldSchema = CreateFieldSchema.partial()

export const CreateFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
})
```

---

## Real-time Hook

Generate `hooks/useFormSync.ts`. This hook:
- Accepts a `formId: string`
- Subscribes to Supabase Realtime changes on the `fields` table filtered by `formId`
- Returns `{ fields, isConnected }` where `fields` is kept in sync with live DB changes
- Cleans up the subscription on unmount
- Uses `useReducer` internally to handle INSERT, UPDATE, DELETE events from Supabase

```ts
// Scaffold this hook with the above requirements.
// Use the Supabase JS v2 client from lib/supabase.ts.
// The channel should be named `form-fields-${formId}`.
// Handle all three postgres_changes event types.
```

---

## Optimistic Update Hook

Generate `hooks/useOptimistic.ts` — a generic hook for optimistic UI:

```ts
// useOptimistic<T>(initialItems: T[], keyFn: (item: T) => string)
// Returns: { items, addOptimistic, updateOptimistic, removeOptimistic, revert }
// Each mutation applies immediately to local state.
// revert() restores to the last confirmed server state.
// This should be fully generic and not coupled to any specific data type.
```

---

## Key Components to Scaffold

### `components/builder/FieldList.tsx`
- Use `@dnd-kit/core` and `@dnd-kit/sortable`
- Accepts `fields: FormField[]` and `onReorder: (fields: FormField[]) => void`
- Each field is a `SortableContext` item
- On drag end, compute new `order` values and call `onReorder`
- Strictly typed — no `any`

### `components/renderer/FormRenderer.tsx`
- Accepts `schema: FormSchema` and `onSubmit: (answers: Record<string, string>) => void`
- Renders each field dynamically based on `field.type`
- Manages controlled state for all field values internally
- Validates required fields before calling `onSubmit`
- All inputs must have associated `<label>` elements with correct `htmlFor` and `aria-required`

### `components/presence/PresenceAvatars.tsx`
- Accepts `presenceState: Record<string, { name: string; color: string }>` from Supabase Presence
- Renders stacked avatar circles (initials-based, colored)
- Shows a count badge if more than 3 users are present (e.g. "+2")
- Fully accessible with `aria-label` on each avatar

---

## API Routes

### `app/api/forms/route.ts`
- `GET` — return all forms (id, title, description, field count, createdAt)
- `POST` — validate body with `CreateFormSchema`, create form in DB, return full form object

### `app/api/forms/[formId]/route.ts`
- `GET` — return form with all fields ordered by `order` ASC
- `PATCH` — partial update (title, description)
- `DELETE` — delete form and cascade

### `app/api/forms/[formId]/fields/route.ts`
- `GET` — return fields for form
- `POST` — validate with `CreateFieldSchema`, append field at end of order, return created field

### `app/api/responses/[formId]/route.ts`
- `POST` — accept `{ answers: { fieldId: string, value: string }[] }`, create `Response` + `Answer` records
- `GET` — return aggregated answers grouped by field: `AggregatedResponse[]`

All routes should return typed responses and handle errors with appropriate HTTP status codes.

---

## Environment Variables

Generate a `.env.example`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/formflow
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Tests to Generate

### `__tests__/validators/field.test.ts`
- Test `CreateFieldSchema` with valid input
- Test rejection of empty label
- Test that `options` defaults to `[]`
- Test `UpdateFieldSchema` accepts partial input

### `__tests__/components/FormRenderer.test.tsx`
- Renders all field types from a mock schema
- Required field validation prevents submit with empty value
- `onSubmit` is called with correct answer map on valid submission

---

## README

Generate a `README.md` that includes:
- Project description (2–3 sentences)
- Local setup instructions (clone, install, env setup, prisma migrate, dev server)
- Architecture notes covering: the schema-driven renderer approach, real-time sync strategy via Supabase, and the optimistic update pattern
- A "Known limitations / next steps" section

---

## Constraints & Notes for the Agent

- Use **TypeScript strict mode** throughout — no implicit `any`
- All API responses should be typed with a shared response wrapper if possible
- Do **not** install an auth library — skip auth entirely to keep scope tight
- Use **Server Components** by default; add `"use client"` only where interactivity requires it
- Tailwind only — no additional CSS frameworks or CSS modules
- `dnd-kit` only for drag and drop — do not use `react-beautiful-dnd`
- Keep components small and single-responsibility
- Do not generate placeholder/lorem ipsum content — leave UI states empty or use meaningful defaults
