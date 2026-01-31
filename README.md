# Family Tree Application

A web-based family tree application with multi-language support (RTL/LTR), privacy controls, and sharing capabilities. Built with Next.js 15 for future mobile app compatibility.

## Tech Stack

### Frontend
- **Next.js 15** with App Router + TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for component library (modern, accessible components)
- **React Flow** for family tree visualization
- **next-intl** for internationalization (RTL/LTR support)

### Backend
- **Next.js API Routes** (serverless functions)
- **Prisma ORM** for database management
- **PostgreSQL** for relational data
- **NextAuth.js v5** for authentication (email + OAuth)

## Features Implemented

### Phase 1: Project Setup & Foundation ✅
- Next.js 15 project with TypeScript and Tailwind CSS
- Directory structure for scalable development
- ESLint and build configuration

### Phase 2: Database Schema Design ✅
- Complete Prisma schema with all models:
  - User, Account, Session (NextAuth)
  - Tree, Person, Event, Spouse, Note
  - TreeAccess for sharing
  - Enums: Gender, EventType, AccessLevel

### Phase 3: Authentication System ✅
- NextAuth configuration with credentials provider
- Google OAuth support (configured, needs credentials)
- User registration API endpoint
- Login and signup pages

### Phase 4: Internationalization (i18n) ✅
- Multi-language setup (English, Turkish, Arabic)
- RTL support for Arabic
- Locale routing with next-intl
- Translation files for all major features

### Phase 5: Core Features Implementation ✅
- **Family Tree Visualization**: Interactive tree with React Flow
- **Person Management**: Full CRUD operations with forms
- **Events Management**: Add events to persons
- **Notes Feature**: Private and public notes
- **Privacy Controls**: Per-person toggle, hide living people option
- **Sharing Features**: Share tokens, invite by email

### Phase 6: UI Components ✅
- Dashboard page with tree listing
- Tree view page with visualization
- Person detail view
- Settings page
- Navigation with language switcher
- Responsive design

### Phase 7: API Routes ✅
- `/api/auth/[...nextauth]` - NextAuth
- `/api/auth/register` - User registration
- `/api/trees` - Tree CRUD
- `/api/trees/[id]` - Single tree operations
- `/api/trees/[id]/people` - Person CRUD
- `/api/trees/[id]/share` - Share settings
- `/api/trees/[id]/invite` - Invite users
- `/api/trees/[id]/export` - Export tree (JSON, CSV, GEDCOM)
- `/api/people/[id]` - Person operations
- `/api/people/[id]/events` - Events CRUD
- `/api/people/[id]/notes` - Notes CRUD

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database connection:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/family_tree"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npm run db:push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
family-tree/
├── prisma/
│   └── schema.prisma          # Database schema
├── messages/                  # Translation files
│   ├── en.json
│   ├── tr.json
│   └── ar.json
├── src/
│   ├── [locale]/             # Localized pages
│   │   ├── dashboard/
│   │   ├── trees/
│   │   │   └── [id]/
│   │   ├── login/
│   │   ├── signup/
│   │   └── settings/
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── trees/
│   │   └── people/
│   ├── components/
│   │   ├── tree/            # Tree visualization
│   │   ├── person/          # Person components
│   │   ├── share/           # Sharing dialogs
│   │   ├── ui/              # shadcn components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # NextAuth config
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── i18n.ts              # i18n configuration
└── public/                   # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio

## Language Support

The application supports:
- **English (en)** - Default, LTR
- **Turkish (tr)** - LTR
- **Arabic (ar)** - RTL with proper layout mirroring

## Privacy Features

1. **Per-Person Privacy Toggle**: Mark individuals as public or private
2. **Hide Living People**: Automatically hide living people in shared views
3. **Role-Based Access**: Owner, Editor, and Viewer roles
4. **Share Tokens**: Generate unique shareable links
5. **Email Invitations**: Invite collaborators with specific permissions

## Export Formats

- **JSON**: Full data export with all relationships
- **CSV**: Simple tabular format for spreadsheets
- **GEDCOM**: Standard genealogy format for importing into other tools

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database Options
- **Supabase**: Free PostgreSQL with connection pooling
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple PostgreSQL hosting

## Future Enhancements

- Photo upload with cloud storage
- Advanced search and filtering
- Multiple tree layouts (pedigree, descendants)
- GEDCOM import
- Mobile app (React Native) sharing TypeScript types
- Print-friendly tree views
- DNA test integration

## License

MIT
