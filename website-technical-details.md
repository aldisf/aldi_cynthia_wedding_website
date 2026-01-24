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
8. [Authentication](#authentication)
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
│                      ASTRO SERVER (Node.js)                      │
│  - Server-side rendering (output: 'server')                      │
│  - API routes at /api/*                                          │
│  - Cookie-based admin auth                                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
│  - PostgreSQL database                                           │
│  - Row Level Security (RLS)                                      │
│  - Real-time subscriptions (optional)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Public Visitor** → `/ (index.astro)` → Static wedding info, no RSVP capability
2. **Invited Guest** → `/rsvp/[code]` → Personalized page with RSVP form + message posting
3. **Admin** → `/admin/login` → Cookie auth → `/admin` dashboard

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Astro | 5.x | SSR + Static site generation |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Database | Supabase | - | PostgreSQL + Auth + API |
| Runtime | Node.js | 18+ | Server adapter |
| Language | TypeScript | 5.x | Type safety |

### Key Dependencies

```json
{
  "@astrojs/node": "Server adapter for Node.js deployment",
  "@supabase/supabase-js": "Supabase client library",
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
│   │   └── supabase.ts                # Database client + helpers
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
│   │           └── messages.ts        # Message moderation API
│   │
│   ├── styles/
│   │   └── global.css                 # Global styles + CSS variables
│   │
│   └── config.ts                      # Wedding configuration
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     # Database schema
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
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=your-secure-password
PUBLIC_SITE_URL=https://your-domain.com
```

---

## Database Schema

### Tables

#### `guests`

Primary table for invited guests and their RSVP status.

```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_code VARCHAR(20) UNIQUE NOT NULL,  -- For personalized URLs
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  rsvp_status VARCHAR(20) DEFAULT 'pending', -- pending | yes | no
  max_plus_ones INTEGER DEFAULT 0,           -- Allocated by couple
  attending_count INTEGER DEFAULT 0,         -- Actual attending (0 = not coming)
  dietary_notes TEXT,
  song_request VARCHAR(255),
  invited_to VARCHAR(20) DEFAULT 'both',     -- ceremony | reception | both
  guest_side VARCHAR(20) DEFAULT 'both',     -- groom | bride | both (for splitting invitation duties)
  attending_events TEXT[] DEFAULT '{}',      -- Which events they'll attend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key fields:**
- `unique_code`: 8-character alphanumeric code for `/rsvp/[code]` URLs
- `max_plus_ones`: Number of additional guests allocated (set via CSV import)
- `attending_count`: Total people attending (1 = just guest, 2+ = with plus ones)
- `rsvp_status`: Derived from attending_count (yes if > 0, no if submitted as 0)
- `guest_side`: Which side of the couple the guest belongs to (for splitting invitation duties)

#### `messages`

Guest wishes/messages displayed on the website.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,  -- Admin can hide messages
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `registry_items` (Optional)

For custom gift registry management.

```sql
CREATE TABLE registry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  target_amount DECIMAL(10, 2),
  current_amount DECIMAL(10, 2) DEFAULT 0,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by_guest_id UUID REFERENCES guests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security

All tables have RLS enabled. Current policies allow:
- Public read access to guests (for RSVP lookup)
- Public read access to visible messages
- Insert/update access for RSVP submissions

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

Submit a new message (requires valid guest code).

```typescript
// Request body
{
  guestCode: string,  // Required - validates guest exists
  name: string,
  message: string
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

Submit RSVP response.

```typescript
// Request body
{
  guestCode: string,
  attending: 'yes' | 'no',
  attendingCount: number,     // Total people (validated against maxPlusOnes)
  events: string[],           // ['ceremony', 'reception']
  dietary: string,
  songRequest: string,
  email: string
}

// Validation
- attendingCount cannot exceed 1 + max_plus_ones
- If attending='no', attendingCount is set to 0
```

### Admin APIs

All admin APIs check for `admin_auth` cookie set to `'authenticated'`.

#### `POST /api/admin/login`

```typescript
// Request
{ password: string }

// Success: Sets HttpOnly cookie, returns { success: true }
// Failure: Returns { error: 'Invalid password' }
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
  guests: [{ name, email, phone, invited_to, max_plus_ones }]
}

// Add single guest
{
  action: 'add',
  guest: { name, email, phone, invited_to, max_plus_ones }
}
```

#### `DELETE /api/admin/guests`

```typescript
{ id: string }  // Guest UUID to delete
```

#### `GET /api/admin/messages`

Returns all messages (including hidden).

#### `POST /api/admin/messages`

Admin can add messages on behalf of guests.

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

---

## Authentication

### Admin Authentication Flow

1. User visits `/admin/login`
2. Enters password (compared against `ADMIN_PASSWORD` env var)
3. On success: `admin_auth` cookie set with value `'authenticated'`
4. Cookie settings:
   - `httpOnly: true` (not accessible via JS)
   - `secure: true` (HTTPS only in production)
   - `sameSite: 'strict'`
   - `maxAge: 86400` (24 hours)

### Protected Routes

Admin pages check authentication in frontmatter:

```astro
---
const authCookie = Astro.cookies.get('admin_auth');
if (authCookie?.value !== 'authenticated') {
  return Astro.redirect('/admin/login');
}
---
```

### Guest "Authentication"

Guests don't have traditional auth. Instead:
- Each guest has a `unique_code` (8 chars, alphanumeric)
- URL `/rsvp/abc12345` loads that guest's personalized page
- Code is validated on every API call (messages, RSVP)

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

**Old System (removed):** Global setting for max plus ones.

**New System:**
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
        ├─► Validate guest exists
        │
        ├─► Validate attendingCount <= 1 + max_plus_ones
        │
        ├─► Update guest record:
        │   - rsvp_status = 'yes' | 'no'
        │   - attending_count = N
        │   - dietary_notes, song_request, etc.
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
│  📊 Dashboard      │  Stats cards / Tables / Forms   │
│  👥 Guests         │                                 │
│  📱 Send Invites   │                                 │
│  💬 Messages       │                                 │
│  📤 Import CSV     │                                 │
│                    │                                 │
│  🔗 View Website   │                                 │
│  🚪 Logout         │                                 │
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

Output: `dist/` directory with Node.js server

### Start Command

```bash
node dist/server/entry.mjs
```

### Environment Variables (Production)

```bash
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=secure-random-password
PUBLIC_SITE_URL=https://your-domain.com
HOST=0.0.0.0
PORT=4321
```

### Platform-Specific

#### Vercel
```json
// vercel.json (if needed)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
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
4. Use `Astro.cookies` for auth if admin route

### Modifying Database Schema

1. Update `supabase/migrations/001_initial_schema.sql`
2. Update `src/lib/supabase.ts` types
3. Run migration in Supabase SQL Editor
4. Update affected components and APIs

---

## Troubleshooting

### "Cannot find module tslib"
```bash
npm install tslib
```

### RSVP not submitting
- Check browser console for errors
- Verify Supabase URL and key in `.env`
- Check RLS policies allow updates

### Admin login not working
- Verify `ADMIN_PASSWORD` in `.env`
- Check cookie is being set (DevTools → Application → Cookies)
- Ensure not using HTTP on production (secure cookie)

### Images not loading
- Verify files exist in `public/images/`
- Check file paths in `config.ts` match actual files
- Images use `onerror` handlers to hide on 404

---

## Known Issues / Technical Debt

Low priority items for future improvement:

### 1. Admin Session Cookie Missing Explicit Path

**Files:** `src/pages/api/admin/login.ts`

The admin authentication cookie should include an explicit `path: '/'` option to ensure it's sent with all requests. Currently relies on browser defaults.

### 2. No CSRF Protection

Form submissions don't include CSRF tokens. While the cookie-based authentication with `httpOnly` and `sameSite: 'strict'` provides some protection, a CSRF token would add another layer of security for sensitive operations like deleting guests.

### 3. No Rate Limiting on Public API Endpoints

**Files:** `src/pages/api/messages.ts`, `src/pages/api/rsvp.ts`

Public endpoints like `POST /api/messages` and `POST /api/rsvp` don't have rate limiting implemented. For production use, consider:
- Adding rate limiting middleware
- Implementing CAPTCHA for message submissions
- Using Supabase Edge Functions with built-in rate limiting

### 4. Service Role Key Not Used for Admin Operations

Admin operations currently use the anon key with permissive RLS policies. For better security, consider:
- Using a Supabase service role key (with `service_role` secret) for admin API routes
- Implementing more restrictive RLS policies for the anon key
- This would require a server-side environment variable (not `PUBLIC_`)

---

## Future Improvements

Potential enhancements for future development:

1. **Email Notifications**: Send confirmation emails on RSVP
2. **Real-time Updates**: Use Supabase real-time for live message board
3. **Photo Upload**: Allow guests to upload photos
4. **QR Codes**: Generate QR codes for invitation links
5. **Multi-language**: i18n support for bilingual weddings
6. **Analytics**: Track page views, RSVP conversion rates
7. **Export**: CSV export of guest list and RSVPs
8. **Reminders**: Automated RSVP reminder emails
9. ~~**WhatsApp Integration**: Send invitations via WhatsApp~~ ✅ Implemented
10. ~~**Guest Side Tracking**: Track groom/bride side for delegation~~ ✅ Implemented

---

*Last updated: January 2026*

