# FormFlow - Live Collaborative Form Builder

FormFlow is a real-time collaborative form builder built with Next.js 14, TypeScript, and Supabase. Create forms with a drag-and-drop interface, share them with collaborators, and watch responses come in live without needing to refresh.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Real-time:** Supabase Realtime (WebSocket)
- **Validation:** Zod
- **Drag & Drop:** dnd-kit
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel-ready

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account (for real-time features)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd formflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Schema-Driven Form Renderer

FormFlow separates form structure from presentation. The `FormSchema` type defines form metadata and fields, while the `FormRenderer` component dynamically renders fields based on their type. This approach makes it easy to:
- Add new field types without modifying the renderer
- Persist form definitions in the database
- Share form schemas between builder and viewer

### Real-time Sync Strategy

Supabase Realtime provides WebSocket-based PostgreSQL change notifications. The `useFormSync` hook subscribes to field changes for a specific form and maintains a local state that updates instantly when collaborators make changes. This enables:
- Live field reordering without page refresh
- Concurrent editing awareness
- Automatic schema consistency across clients

### Optimistic Update Pattern

The `useOptimistic` hook provides a generic pattern for immediate UI feedback. When users make changes, the UI updates instantly while the request sends to the server. If it fails, the UI reverts to the last confirmed state. This pattern is applied throughout for smooth user experience.

## Project Structure

```
formflow/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── forms/               # Form CRUD operations
│   │   └── responses/           # Response submission & aggregation
│   └── forms/[formId]/          # Form pages (view & edit)
├── components/                   # React components
│   ├── builder/                 # Form building components
│   ├── renderer/                # Form rendering components
│   ├── presence/                # Real-time collaboration UI
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom React hooks
│   ├── useFormSync.ts          # Real-time field sync
│   └── useOptimistic.ts        # Optimistic updates
├── lib/                         # Library utilities
│   ├── prisma.ts               # Prisma client
│   ├── supabase.ts             # Supabase client
│   └── validators/             # Zod schemas
├── prisma/                      # Database schema
├── types/                       # Shared TypeScript types
└── __tests__/                   # Test files
```

## API Routes

### Forms
- `GET /api/forms` - List all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[formId]` - Get form with fields
- `PATCH /api/forms/[formId]` - Update form metadata
- `DELETE /api/forms/[formId]` - Delete form

### Form Fields
- `GET /api/forms/[formId]/fields` - Get form fields
- `POST /api/forms/[formId]/fields` - Add new field

### Responses
- `POST /api/responses/[formId]` - Submit form response
- `GET /api/responses/[formId]` - Get aggregated responses

## Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Testing & Quality
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint

# Database
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Apply migrations
```

## Known Limitations & Next Steps

### Current Limitations
- No authentication/authorization (forms are public via share link)
- No file uploads or nested fields
- Limited form field types (TEXT, TEXTAREA, SELECT, CHECKBOX)
- No form versioning or response export
- Presence tracking is not implemented (UI component exists)

### Potential Improvements
1. **Authentication & Access Control**
   - User accounts and form ownership
   - Role-based permissions (viewer, editor, admin)
   - Share tokens with expiration

2. **Extended Field Types**
   - Date/time picker
   - File upload
   - Rating/scale
   - Matrix/multi-row fields
   - Custom HTML blocks

3. **Response Management**
   - CSV/Excel export
   - Response filtering and search
   - Conditional field logic
   - Webhook integrations

4. **Collaboration Features**
   - Real-time presence cursors
   - Comment threads on fields
   - Form version history with rollback
   - Activity log

5. **Analysis & Insights**
   - Response analytics dashboard
   - Chart visualizations
   - Cross-field analysis
   - Skip/abandon rate tracking

6. **Performance**
   - Pagination for large response sets
   - Field-level caching
   - Image optimization
   - Database indexing optimization

## Contributing

This is a scaffolding template. Feel free to extend it with the features and improvements needed for your use case.

## License

MIT
