# Wedding Website - Technical Documentation

This document provides comprehensive technical details for developers working on this wedding website project.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration System](#configuration-system)
5. [Database Schema](#database-schema)
6. [Frontend Components](#frontend-components)
7. [API Routes](#api-routes)
8. [Authentication & Security](#authentication--security)
9. [RSVP System](#rsvp-system)
10. [Admin Dashboard](#admin-dashboard)
11. [Styling System](#styling-system)
12. [Deployment](#deployment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
├─────────────────────────────────────────────────────────────────┤
│  Public Pages          │  Guest Pages           │  Admin Pages  │
│  - / (index)           │  - /rsvp/[code]        │  - /admin     │
│  - Read-only view      │  - Personalized view   │  - /admin/login│
│  - No RSVP form        │  - Can RSVP + message  │  - Protected   │
└────────────┬───────────┴───────────┬───────────┴───────┬────────┘
             │                       │                   │
             ▼                       ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ASTRO SERVER (Vercel)                        │
│  - Server-side rendering (output: 'server')                      │
│  - API routes at /api/*                                          │
│  - HMAC-signed cookie auth for admin                             │
│  - All DB access is server-side only                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          TURSO (libSQL)                           │
│  - SQLite database over HTTP                                     │
│  - Auto-migrating schema (version-tracked)                       │
│  - No client-side credentials exposed                            │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Public Visitor** → `/ (index.astro)` → Static wedding info, no RSVP capability
2. **Invited Guest** → `/rsvp/[code]` → Personalized page with RSVP form + message posting
3. **Admin** → `/admin/login` → HMAC-signed cookie auth → `/admin` dashboard

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Astro | 5.x | SSR + Static site generation |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Database | Turso (libSQL) | - | SQLite database over HTTP |
| Deployment | Vercel | - | Serverless hosting |
| Language | TypeScript | 5.x | Type safety |

### Key Dependencies

```json
{
  "@astrojs/vercel": "Vercel deployment adapter",
  "@libsql/client": "Turso/libSQL database client",
  "@tailwindcss/vite": "Tailwind CSS integration",
  "tailwindcss": "CSS framework",
  "tslib": "TypeScript runtime helpers"
}
```

---

## Project Structure

```
wedding_website_v2/
├── public/
│   ├── favicon.svg                    # Site favicon
│   └── images/
│       ├── hero/                      # Hero section images
│       ├── gallery/                   # Photo gallery images
│       └── registry/                  # Registry item images
│
├── src/
│   ├── components/
│   │   ├── Hero.astro                 # Full-screen hero with parallax
│   │   ├── Countdown.astro            # Live countdown timer
│   │   ├── CoupleDetails.astro        # Names, parents, story
│   │   ├── EventsTimeline.astro       # Vertical timeline of events
│   │   ├── Venue.astro                # Google Maps integration
│   │   ├── Gallery.astro              # Photo grid with lightbox
│   │   ├── MessageBoard.astro         # Guest wishes display/form
│   │   ├── Registry.astro             # Gift registry
│   │   └── RSVP.astro                 # RSVP form component
│   │
│   ├── layouts/
│   │   └── Layout.astro               # Main HTML layout with nav
│   │
│   ├── lib/
│   │   ├── db.ts                      # Turso client, schema, query functions
│   │   └── auth.ts                    # Session tokens, rate limiting
│   │
│   ├── pages/
│   │   ├── index.astro                # Public wedding page
│   │   ├── rsvp/
│   │   │   └── [code].astro           # Dynamic guest RSVP page
│   │   ├── admin/
│   │   │   ├── index.astro            # Admin dashboard
│   │   │   └── login.astro            # Admin login page
│   │   └── api/
│   │       ├── messages.ts            # Public messages API
│   │       ├── rsvp.ts                # RSVP submission API
│   │       └── admin/
│   │           ├── login.ts           # Admin authentication
│   │           ├── logout.ts          # Admin logout
│   │           ├── guests.ts          # Guest management API
│   │           ├── messages.ts        # Message moderation API
│   │           └── sql.ts             # Ad-hoc SQL endpoint
│   │
│   ├── styles/
│   │   └── global.css                 # Global styles + CSS variables
│   │
│   └── config.ts                      # Wedding configuration
│
├── .env.example                       # Environment template
├── astro.config.mjs                   # Astro configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
└── README.md                          # User documentation
```

---

## Configuration System

### `src/config.ts`

Central configuration file for all wedding details. Edit this file to customize the website.

```typescript
export const config = {
  // Couple information
  couple: {
    person1: { name, fullName, parents },
    person2: { name, fullName, parents }
  },

  // Wedding date (ISO format)
  weddingDate: "2025-06-15T10:00:00",

  // Events timeline
  events: [
    {
      id: "ceremony",
      title: "Holy Matrimony",
      time: "10:00 AM",
      endTime: "11:30 AM",
      venue: "St. Mary's Cathedral",
      address: "123 Church Street",
      description: "Join us as we exchange our vows",
      icon: "church",           // church | utensils | party | default
      mapsEmbed: "https://...", // Google Maps embed URL
      mapsLink: "https://...",  // Google Maps link
      dressCode: "Formal"       // Optional
    }
  ],

  // Theme (sage | dustyRose | slateGold | navy | custom)
  themePalette: "sage",
  customColors: { ... },

  // Image arrays
  gallery: [{ src, alt }],
  heroImages: [{ src, alt }],

  // Registry settings
  registry: {
    enabled: true,
    message: "...",
    items: [{ id, name, description, link, targetAmount, external }]
  },

  // Message board settings
  messageBoard: { enabled, title, subtitle },

  // RSVP settings
  rsvp: {
    deadline: "2025-05-15",
    askDietaryRestrictions: true,
    askSongRequest: true
  },

  // Site meta
  site: { title, description, ogImage }
};
```

### Color Palettes

```typescript
export const colorPalettes = {
  sage: {
    primary: "#87A878",     // Main accent color
    secondary: "#F5F1EB",   // Background sections
    accent: "#C9A962",      // Gold accent
    background: "#FDFCFA",  // Page background
    text: "#2D3748",        // Primary text
    textLight: "#718096"    // Secondary text
  },
  // dustyRose, slateGold, navy also defined
};
```

### Environment Variables

```bash
# .env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=your-random-secret
PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | Description | Required | Client-exposed |
|----------|-------------|----------|----------------|
| `TURSO_DATABASE_URL` | Turso database URL | Yes | No |
| `TURSO_AUTH_TOKEN` | Turso auth token | Yes | No |
| `ADMIN_PASSWORD` | Admin login password | Yes | No |
| `ADMIN_SESSION_SECRET` | HMAC signing key for sessions | Yes | No |
| `PUBLIC_SITE_URL` | Full site URL for guest links | Yes | Yes (prefix) |

---

## Database Schema

The database uses **Turso (SQLite)** with auto-migrating schema. Tables are created automatically on first request via `ensureSchema()` in `src/lib/db.ts`.

### Schema Version Tracking

```sql
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY
);
```

Migrations are defined in `src/lib/db.ts` as a `MIGRATIONS` record keyed by version number. The system checks the current version on startup and runs any pending migrations.

### Tables

#### `guests`

Primary table for invited guests and their RSVP status.

```sql
CREATE TABLE guests (
  id TEXT PRIMARY KEY,                -- UUID (generated server-side)
  unique_code TEXT UNIQUE NOT NULL,   -- 8-char code for /rsvp/[code] URLs
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT DEFAULT 'pending', -- pending | yes | no
  max_plus_ones INTEGER DEFAULT 0,    -- Allocated by couple (from CSV)
  attending_count INTEGER DEFAULT 0,  -- Actual attending count
  dietary_notes TEXT,
  song_request TEXT,
  invited_to TEXT DEFAULT 'both',     -- ceremony | reception | both
  guest_side TEXT DEFAULT 'both',     -- groom | bride | both
  attending_events TEXT DEFAULT '[]', -- JSON array of event IDs
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

**Key fields:**
- `unique_code`: 8-character cryptographically-generated code for `/rsvp/[code]` URLs
- `max_plus_ones`: Number of additional guests allocated (set via CSV import)
- `attending_count`: Total people attending (1 = just guest, 2+ = with plus ones)
- `attending_events`: Stored as JSON string (SQLite has no native array type), parsed via `parseJsonArray()`
- `guest_side`: Which side of the couple the guest belongs to (for splitting invitation duties)

#### `messages`

Guest wishes/messages displayed on the website.

```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_visible INTEGER DEFAULT 1,  -- SQLite boolean (0/1)
  created_at TEXT DEFAULT (datetime('now'))
);
```

#### `registry_items` (Optional)

For custom gift registry management.

```sql
CREATE TABLE registry_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link TEXT,
  target_amount REAL,
  current_amount REAL DEFAULT 0,
  is_claimed INTEGER DEFAULT 0,
  claimed_by_guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### SQLite vs PostgreSQL Notes

| PostgreSQL (old) | SQLite (current) |
|---|---|
| `UUID` type | `TEXT` with `crypto.randomUUID()` |
| `TIMESTAMP WITH TIME ZONE` | `TEXT` (ISO 8601 via `datetime('now')`) |
| `TEXT[]` (arrays) | `TEXT` (JSON strings, e.g. `'["ceremony"]'`) |
| `DECIMAL(10,2)` | `REAL` |
| `BOOLEAN` | `INTEGER` (0/1) |
| RLS policies | Not needed — all access is server-side |

### Modifying the Schema

To evolve the schema:

1. Increment `SCHEMA_VERSION` in `src/lib/db.ts`
2. Add a new entry in the `MIGRATIONS` record with the new version number
3. Write `ALTER TABLE` or `CREATE TABLE` statements as needed
4. Deploy — migrations run automatically on first request

---

## Frontend Components

### Component Hierarchy

```
Layout.astro
├── Navigation (fixed, transparent → solid on scroll)
├── Mobile Menu (slide-in)
├── <slot /> (page content)
└── Footer

index.astro / rsvp/[code].astro
├── Hero.astro
├── Countdown.astro
├── CoupleDetails.astro
├── EventsTimeline.astro
├── Venue.astro
├── Gallery.astro
├── MessageBoard.astro
├── Registry.astro
└── RSVP.astro
```

### Component Props

#### `MessageBoard.astro`
```typescript
interface Props {
  guestCode?: string;  // If provided, shows message form
  guestName?: string;  // Pre-fills name in form
}
```

#### `RSVP.astro`
```typescript
interface Props {
  guestCode?: string;    // Required for form submission
  guestName?: string;    // Pre-filled, readonly
  guestEmail?: string;   // Pre-filled
  invitedTo?: string;    // 'ceremony' | 'reception' | 'both'
  maxPlusOnes?: number;  // Determines form type
}
```

**RSVP Form Logic:**
- If `maxPlusOnes > 0`: Shows dropdown "How many people attending?" (0 to 1+maxPlusOnes)
- If `maxPlusOnes = 0`: Shows radio buttons "Will you be attending?" (yes/no)

### Animation System

Scroll-triggered animations using Intersection Observer:

```css
/* Base state */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 800ms, transform 800ms;
}

/* Visible state (added by JS) */
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Animation classes:**
- `.animate-on-scroll` - Fade up
- `.slide-from-left` - Slide from left
- `.slide-from-right` - Slide from right
- `.scale-up` - Scale from 0.9 to 1
- `.stagger-children` - Stagger child animations

### Lightbox (Gallery)

Built-in lightbox for photo gallery:
- Click image to open
- Arrow keys for navigation
- ESC to close
- Click outside to close

---

## API Routes

All API routes are in `src/pages/api/` and use `export const prerender = false;` for SSR.

### Public APIs

#### `GET /api/messages`

Fetch visible messages with pagination.

```typescript
// Query params
?page=0&limit=10

// Response
{
  messages: [
    { id, guest_name, content, created_at }
  ],
  hasMore: boolean
}
```

#### `POST /api/messages`

Submit a new message (requires valid guest code). Max 1000 characters.

```typescript
// Request body
{
  guestCode: string,  // Required - validates guest exists
  name: string,
  message: string     // Max 1000 chars
}

// Response
{ success: true } | { error: string }
```

#### `GET /api/rsvp?code=xxx`

Fetch guest info by unique code.

```typescript
// Response
{
  name, email, invitedTo, rsvpStatus,
  maxPlusOnes, attendingCount,
  dietaryNotes, songRequest, attendingEvents
}
```

#### `POST /api/rsvp`

Submit RSVP response. Input validation enforced.

```typescript
// Request body
{
  guestCode: string,
  attending: 'yes' | 'no',
  attendingCount: number,     // Total people (validated against maxPlusOnes)
  events: string[],           // ['ceremony', 'reception']
  dietary: string,            // Max 500 chars
  songRequest: string,        // Max 200 chars
  email: string
}

// Validation
- attendingCount cannot exceed 1 + max_plus_ones
- If attending='no', attendingCount is set to 0
- dietary max 500 chars, songRequest max 200 chars
```

### Admin APIs

All admin APIs verify the HMAC-signed session cookie via `isAuthenticated()` from `src/lib/auth.ts`.

#### `POST /api/admin/login`

Rate-limited: 5 attempts per IP per 15 minutes.

```typescript
// Request
{ password: string }

// Success: Sets HttpOnly HMAC-signed cookie, returns { success: true }
// Failure: Returns { error: 'Invalid password' } (401)
// Rate limited: Returns { error: 'Too many login attempts...' } (429)
```

#### `POST /api/admin/logout`

Clears authentication cookie.

#### `GET /api/admin/guests`

```typescript
// Default: Returns all guests
{ guests: Guest[] }

// With ?action=stats
{ total, confirmed, declined, pending, totalGuests }
```

#### `POST /api/admin/guests`

```typescript
// Import from CSV
{
  action: 'import',
  guests: [{ name, email, phone, guest_side, invited_to, max_plus_ones }]
}

// Add single guest
{
  action: 'add',
  guest: { name, email, phone, guest_side, invited_to, max_plus_ones }
}
```

#### `DELETE /api/admin/guests`

```typescript
{ id: string }  // Guest ID to delete
```

#### `GET /api/admin/messages`

Returns all messages (including hidden).

#### `POST /api/admin/messages`

Admin can add messages on behalf of guests. Max 1000 characters.

```typescript
{ guest_name: string, content: string }
```

#### `PATCH /api/admin/messages`

Toggle message visibility.

```typescript
{ id: string, is_visible: boolean }
```

#### `DELETE /api/admin/messages`

```typescript
{ id: string }
```

#### `POST /api/admin/sql`

Execute arbitrary SQL queries (admin only). Useful for ad-hoc data inspection and schema alterations.

```typescript
// Request
{
  sql: string,
  args?: (string | number | null)[]  // Parameterized query args
}

// Response
{
  columns: string[],
  rows: Record<string, unknown>[],
  rowsAffected: number
}
```

**Example usage:**
```bash
curl -X POST /api/admin/sql \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT COUNT(*) as count FROM guests WHERE rsvp_status = ?", "args": ["yes"]}'
```

---

## Authentication & Security

### Admin Authentication Flow

1. User visits `/admin/login`
2. Enters password (timing-safe comparison against `ADMIN_PASSWORD` env var)
3. Rate limiting checked (5 attempts per IP per 15 min window)
4. On success: HMAC-signed session token created:
   ```
   token = timestamp + '.' + HMAC-SHA256(timestamp, ADMIN_SESSION_SECRET)
   ```
5. Token set as `admin_auth` cookie:
   - `httpOnly: true` (not accessible via JS)
   - `secure: true` (HTTPS only in production)
   - `sameSite: 'strict'`
   - `maxAge: 86400` (24 hours)

### Session Verification

On every admin request, `isAuthenticated()` from `src/lib/auth.ts`:
1. Reads the `admin_auth` cookie
2. Splits into `timestamp.signature`
3. Recomputes HMAC with the secret and compares (timing-safe)
4. Checks the timestamp hasn't expired (24-hour window)

### Protected Routes

Admin pages check authentication in frontmatter:

```astro
---
import { isAuthenticated } from '../../lib/auth';

if (!isAuthenticated(Astro.cookies)) {
  return Astro.redirect('/admin/login');
}
---
```

Admin API routes check at the top of each handler:

```typescript
import { isAuthenticated } from '../../../lib/auth';

if (!isAuthenticated(cookies)) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
```

### Guest "Authentication"

Guests don't have traditional auth. Instead:
- Each guest has a `unique_code` (8 chars, cryptographically generated)
- URL `/rsvp/abc12345` loads that guest's personalized page
- Code is validated on every API call (messages, RSVP)
- Codes are generated with `crypto.getRandomValues()` (not `Math.random()`)

### Security Measures Summary

| Measure | Implementation | File |
|---------|---------------|------|
| HMAC-signed sessions | `timestamp.signature` tokens | `src/lib/auth.ts` |
| Timing-safe password check | `crypto.timingSafeEqual()` | `src/lib/auth.ts` |
| Rate limiting (admin login) | In-memory, 5 per IP per 15 min | `src/lib/auth.ts` |
| Cryptographic guest codes | `crypto.getRandomValues()` | `src/lib/db.ts` |
| Input validation | Max lengths on messages/dietary/songs | API routes |
| Server-only DB credentials | No `PUBLIC_` prefix on Turso vars | `.env` |
| No client-side DB access | All queries go through API routes | Architecture |

---

## RSVP System

### Guest Flow

1. Guest receives unique link: `https://site.com/rsvp/abc12345`
2. Page loads guest data from database
3. Welcome banner shows their name
4. All sections visible, plus:
   - Message form (can post wishes)
   - RSVP form (can submit response)

### Plus Ones Logic

- `max_plus_ones` is set per-guest in CSV import
- Guest sees different UI based on their allocation:

```
max_plus_ones = 0:
┌─────────────────────────────────┐
│ Will you be attending?          │
│ [Joyfully Accept] [Decline]     │
└─────────────────────────────────┘

max_plus_ones = 2:
┌─────────────────────────────────┐
│ How many people will attend?    │
│ You have been allocated 2       │
│ additional guests.              │
│ [Dropdown: 0-3 people]          │
└─────────────────────────────────┘
```

### RSVP Data Flow

```
Guest submits RSVP
        │
        ▼
POST /api/rsvp
        │
        ├─► Validate guest exists (by code)
        │
        ├─► Validate input lengths (dietary ≤500, song ≤200)
        │
        ├─► Validate attendingCount <= 1 + max_plus_ones
        │
        ├─► Update guest record:
        │   - rsvp_status = 'yes' | 'no'
        │   - attending_count = N
        │   - dietary_notes, song_request, etc.
        │   - updated_at = now
        │
        └─► Return success/error
```

---

## Admin Dashboard

### Layout

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR           │  MAIN CONTENT                   │
│                    │                                 │
│  Wedding Admin     │  [Dashboard | Guests | ...]    │
│  ─────────────     │                                 │
│  Dashboard         │  Stats cards / Tables / Forms   │
│  Guests            │                                 │
│  Send Invites      │                                 │
│  Messages          │                                 │
│  Import CSV        │                                 │
│                    │                                 │
│  View Website      │                                 │
│  Logout            │                                 │
└──────────────────────────────────────────────────────┘
```

### Features

#### Dashboard Tab
- Stats cards: Total invited, Confirmed, Pending, Declined, Total attending
- Recent RSVPs table (last 10)

#### Guests Tab
- Full guest list table with filtering
- **Filters**: By side (groom/bride/both), by RSVP status, search by name
- Columns: Name, Side, Phone, +1s, Attending, RSVP Status, Unique Link
- Color-coded side badges (blue=groom, pink=bride, purple=both)
- Copy link button for each guest
- Delete guest action
- Add Guest button → Modal form (includes Guest Side field)

#### Send Invites Tab (WhatsApp)
- **Message Template**: Editable textarea with `{name}` and `{link}` placeholders
- Template saved to localStorage
- **Filters**: By guest side, by phone availability
- Guest table with "Send" (opens wa.me link) and "Copy" buttons
- Green WhatsApp-branded send button opens pre-filled message

#### Messages Tab
- All messages (including hidden)
- Toggle visibility checkbox
- Delete button
- Add Message button → Modal form

#### Import CSV Tab
- File upload area
- CSV preview table
- Import button
- Sample format display

### CSV Import Format

```csv
name,email,phone,guest_side,invited_to,max_plus_ones
John Doe,john@example.com,+1234567890,groom,both,1
Jane Smith,jane@example.com,,bride,ceremony,0
Bob Johnson,,+0987654321,both,reception,2
```

**Columns:**
- `name` (required)
- `email` (optional)
- `phone` (optional) - Required for WhatsApp invitations
- `guest_side`: `groom` | `bride` | `both` (default: both) - For splitting invitation duties
- `invited_to`: `ceremony` | `reception` | `both` (default: both)
- `max_plus_ones`: Number (default: 0)

---

## Styling System

### CSS Architecture

```
global.css
├── @import "tailwindcss"
├── @theme { CSS variables }
├── Base styles (html, body, typography)
├── Animation classes
├── Utility classes (.text-primary, .bg-secondary, etc.)
├── Component styles (buttons, forms, cards)
└── Section-specific styles (hero, timeline, gallery)
```

### CSS Variables

```css
@theme {
  --color-primary: #87A878;
  --color-secondary: #F5F1EB;
  --color-accent: #C9A962;
  --color-background: #FDFCFA;
  --color-text: #2D3748;
  --color-text-light: #718096;

  --font-serif: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Montserrat", system-ui, sans-serif;

  --ease-elegant: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-slow: 800ms;
  --duration-normal: 500ms;
  --duration-fast: 300ms;
}
```

### Responsive Breakpoints

Using Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile-first approach:** Base styles for mobile, add complexity at larger breakpoints.

### Key Component Classes

```css
.section { padding: clamp(4rem, 10vh, 8rem) 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.btn { padding: 0.75rem 2rem; text-transform: uppercase; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-outline { border: 1px solid var(--color-primary); }
.form-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; }
```

---

## Deployment

### Build Command

```bash
npm run build
```

Output: `.vercel/output/` directory (via Vercel adapter)

### Environment Variables (Production)

```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_PASSWORD=secure-random-password
ADMIN_SESSION_SECRET=your-random-secret
PUBLIC_SITE_URL=https://your-domain.com
```

### Platform-Specific

#### Vercel (Primary)
```json
// vercel.json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

#### Railway / Render
- Set build command: `npm run build`
- Set start command: `node dist/server/entry.mjs`
- Add environment variables in dashboard

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

---

## Common Tasks

### Adding a New Section

1. Create component in `src/components/NewSection.astro`
2. Import and add to `src/pages/index.astro`
3. Add to `src/pages/rsvp/[code].astro`
4. Add navigation link in `src/layouts/Layout.astro`

### Changing Colors

1. Edit `themePalette` in `src/config.ts`
2. Or set to `"custom"` and edit `customColors`
3. Update CSS variables in `src/styles/global.css` if needed

### Adding a New API Endpoint

1. Create file in `src/pages/api/`
2. Export `GET`, `POST`, `PATCH`, `DELETE` as needed
3. Add `export const prerender = false;`
4. Import `isAuthenticated` from `../../lib/auth` if admin route

### Modifying Database Schema

1. Increment `SCHEMA_VERSION` in `src/lib/db.ts`
2. Add new migration statements in the `MIGRATIONS` record
3. Update TypeScript types in `src/lib/db.ts`
4. Update affected components and APIs
5. Deploy — migrations run automatically on first request

### Running Ad-hoc SQL

Use the admin SQL endpoint:

```bash
# Via curl (must have valid admin cookie)
curl -X POST https://your-site.com/api/admin/sql \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_auth=your-session-token" \
  -d '{"sql": "SELECT * FROM guests WHERE rsvp_status = ?", "args": ["yes"]}'
```

Or build a simple UI in the admin dashboard to call `POST /api/admin/sql`.

---

## Troubleshooting

### "Cannot find module tslib"
```bash
npm install tslib
```

### RSVP not submitting
- Check browser console for errors
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env`
- Check that the Turso database is accessible (try `turso db shell your-db`)

### Admin login not working
- Verify `ADMIN_PASSWORD` in `.env`
- Verify `ADMIN_SESSION_SECRET` is set (required for signing cookies)
- Check cookie is being set (DevTools → Application → Cookies)
- Ensure not using HTTP on production (secure cookie requires HTTPS)
- If rate-limited, wait 15 minutes or restart the server (resets in-memory counters)

### Images not loading
- Verify files exist in `public/images/`
- Check file paths in `config.ts` match actual files
- Images use `onerror` handlers to hide on 404

### Database tables not created
- Tables auto-create on first request — visit any page to trigger
- Check Turso credentials are correct
- Check server logs for migration errors

---

## Known Issues / Technical Debt

Low priority items for future improvement:

### 1. No CSRF Protection

Form submissions don't include CSRF tokens. The cookie-based authentication with `httpOnly` and `sameSite: 'strict'` provides protection against most CSRF attacks, but a token would add defense in depth.

### 2. Rate Limiting Resets on Cold Start

The admin login rate limiter uses in-memory storage, which resets when the Vercel serverless function cold starts. For stronger protection, consider using a persistent store (e.g., Turso itself or an edge KV store).

### 3. No Content-Security-Policy Headers

CSP headers are not currently set. Consider adding them for additional XSS protection.

---

## Future Improvements

Potential enhancements for future development:

1. **Email Notifications**: Send confirmation emails on RSVP
2. **Photo Upload**: Allow guests to upload photos
3. **QR Codes**: Generate QR codes for invitation links
4. **Multi-language**: i18n support for bilingual weddings
5. **Analytics**: Track page views, RSVP conversion rates
6. **Export**: CSV export of guest list and RSVPs
7. **Reminders**: Automated RSVP reminder emails
8. ~~**WhatsApp Integration**: Send invitations via WhatsApp~~ ✅ Implemented
9. ~~**Guest Side Tracking**: Track groom/bride side for delegation~~ ✅ Implemented
10. ~~**Security Hardening**: Signed sessions, rate limiting, input validation~~ ✅ Implemented
11. ~~**Database Migration**: Move from Supabase to Turso~~ ✅ Implemented

---

*Last updated: February 2026*
