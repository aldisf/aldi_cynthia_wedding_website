# Wedding Website

A modern, elegant wedding website with RSVP management, guest messaging, and admin dashboard.

## Features

- **Hero Section** - Full-screen prewedding photo with couple names
- **Countdown Timer** - Live countdown to your wedding day
- **Couple Details** - Names, parents, and love story
- **Events Timeline** - Visual timeline of wedding events
- **Venue & Maps** - Google Maps integration
- **Photo Gallery** - Masonry grid with lightbox
- **Message Board** - Guests can leave wishes (requires invitation link)
- **Wedding Registry** - Gift registry with external links
- **RSVP System** - Unique invitation links for each guest
- **Admin Dashboard** - Manage guests, RSVPs, and messages

## Tech Stack

- **Astro** - Static site generator with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Turso** - SQLite database (libSQL) — fast, always-on, serverless
- **Vercel** - Deployment platform

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Turso Database

1. Create a free account at [turso.tech](https://turso.tech)
2. Install the Turso CLI and create a database:
   ```bash
   turso db create wedding
   turso db show wedding --url    # Copy the URL
   turso db tokens create wedding  # Copy the token
   ```
3. No manual schema setup needed — tables are auto-created on first request

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_SESSION_SECRET=your-random-secret-here
PUBLIC_SITE_URL=https://your-domain.com
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Customize Your Wedding Details

Edit `src/config.ts` to set:

- Couple names and parents
- Wedding date
- Event timeline (ceremony, reception, etc.)
- Venue addresses and Google Maps embeds
- Theme colors
- Registry items

### 5. Add Your Photos

Place your photos in the `public/images/` directory:

```
public/images/
├── hero/
│   └── hero1.jpg, hero2.jpg, ...
├── gallery/
│   └── photo1.jpg, photo2.jpg, ...
├── person1.jpg (groom photo)
├── person2.jpg (bride photo)
└── og-image.jpg (social sharing image)
```

### 6. Run Locally

#### Development Mode

Start the development server with hot reloading:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

#### Production Preview

Build and preview the production version locally:

```bash
npm run build
npm run preview
```

#### Environment Variables for Local Development

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Your Turso database URL | Yes |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Yes |
| `ADMIN_PASSWORD` | Password for admin dashboard | Yes |
| `ADMIN_SESSION_SECRET` | Secret key for signing session cookies | Yes |
| `PUBLIC_SITE_URL` | Full URL of your site (for generating guest links) | Yes |

## Admin Dashboard

Access the admin panel at `/admin/login` with your `ADMIN_PASSWORD`.

### Features:

- **Dashboard** - RSVP statistics at a glance
- **Guests** - View all guests, filter by side/status, copy unique invitation links
- **Send Invites** - Send WhatsApp invitations with customizable message templates
- **Messages** - Moderate guest messages (show/hide/delete)
- **Import CSV** - Bulk import guests from CSV file
- **SQL Console** - Run ad-hoc SQL queries via `POST /api/admin/sql`

### CSV Format for Guest Import

```csv
name,email,phone,guest_side,invited_to,max_plus_ones
John Doe,john@example.com,+1234567890,groom,both,1
Jane Smith,jane@example.com,,bride,ceremony,0
Bob Johnson,,+0987654321,both,reception,2
```

- `guest_side`: Which side of the couple (`groom`, `bride`, or `both` - default: both)
- `max_plus_ones`: Number of additional guests this person can bring (0 = no plus ones)

## Sending Invitations via WhatsApp

The admin dashboard includes a **Send Invites** feature for WhatsApp:

1. Go to Admin → **Send Invites** tab
2. Configure your message template using placeholders:
   - `{name}` - Guest's name
   - `{link}` - Their unique RSVP link
3. Filter guests by side (groom/bride) to split duties with your partner
4. Click the green **Send** button to open WhatsApp with the pre-filled message
5. Click send in WhatsApp Web/App

### Example Template

```
Hi {name}! 💒

You are cordially invited to our wedding! Please RSVP here:
{link}

We hope to see you there! 💕
```

## Security

- **Server-side only database access** — Turso credentials are never exposed to the client
- **HMAC-signed session cookies** — Admin sessions use cryptographically signed tokens (not static strings)
- **Timing-safe password comparison** — Prevents timing attacks on admin login
- **Cryptographic guest codes** — Generated with `crypto.getRandomValues()` (not `Math.random()`)
- **Rate limiting** — Admin login is rate-limited to 5 attempts per IP per 15 minutes
- **Input validation** — Messages (1000 chars), dietary notes (500 chars), song requests (200 chars)

## Deployment

### Prerequisites

1. Have a Turso database created with URL and auth token
2. Have all environment variables ready
3. Build the project: `npm run build`

---

### Vercel (Recommended)

Vercel works out of the box with Astro.

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in **Settings > Environment Variables**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `PUBLIC_SITE_URL` (set to your Vercel domain)
4. Deploy!

---

### Netlify

1. Push your code to GitHub
2. Import project to [Netlify](https://netlify.com)
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables in **Site settings > Environment variables**
5. Deploy!

---

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Railway auto-detects the build settings
5. Your site will be available at `your-project.up.railway.app`

---

### Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure settings:
   - **Build command:** `npm run build`
   - **Start command:** `node dist/server/entry.mjs`
4. Add environment variables
5. Deploy!

---

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t wedding-website .

# Run the container
docker run -p 4321:4321 \
  -e TURSO_DATABASE_URL=libsql://your-db.turso.io \
  -e TURSO_AUTH_TOKEN=your-token \
  -e ADMIN_PASSWORD=your-password \
  -e ADMIN_SESSION_SECRET=your-secret \
  -e PUBLIC_SITE_URL=https://your-domain.com \
  wedding-website
```

**Dockerfile** (create in project root if not present):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4321
ENV HOST=0.0.0.0
CMD ["node", "dist/server/entry.mjs"]
```

---

### Self-Hosted (VPS/Server)

1. Clone the repository to your server
2. Install dependencies: `npm ci`
3. Create `.env` file with your variables
4. Build the project: `npm run build`
5. Start with process manager (recommended):

```bash
# Using PM2
npm install -g pm2
pm2 start dist/server/entry.mjs --name wedding-website

# Or using systemd (create service file)
sudo systemctl start wedding-website
```

6. Set up reverse proxy (Nginx/Caddy) to point to port 4321

## Theme Customization

### Color Palettes

Edit `themePalette` in `src/config.ts`:

| Palette | Description |
|---------|-------------|
| `sage` | Sage green & cream (default) |
| `dustyRose` | Soft pink & warm tones |
| `slateGold` | Elegant slate & gold |
| `navy` | Classic navy & gold |
| `custom` | Use your own colors |

### Custom Colors

Set `themePalette: "custom"` and edit `customColors`:

```typescript
customColors: {
  primary: "#your-color",
  secondary: "#your-color",
  accent: "#your-color",
  background: "#your-color",
  text: "#your-color",
  textLight: "#your-color",
}
```

## Sending Invitations

After importing guests:

1. Go to Admin > Guests
2. Copy each guest's unique link
3. Send via email, WhatsApp, or printed card

Each link looks like: `https://your-site.com/rsvp/abc12345`

When guests visit their link, they can:
- RSVP for themselves and plus-ones
- Leave a message for you
- See all wedding details

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
wedding_website_v2/
├── public/
│   └── images/           # Your photos go here
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── lib/
│   │   ├── db.ts         # Turso database client + query functions
│   │   └── auth.ts       # Admin session auth + rate limiting
│   ├── pages/
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── rsvp/[code].astro  # Guest RSVP pages
│   │   └── index.astro   # Main wedding page
│   ├── styles/
│   │   └── global.css    # Global styles
│   └── config.ts         # Wedding configuration
├── .env.example          # Environment template
└── astro.config.mjs      # Astro configuration
```

## Support

For issues or questions, please create an issue in this repository.

---

Made with love for your special day!
