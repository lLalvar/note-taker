# Note Taker API - Cloudflare Worker

Backend API for the Note Taker app, built with Cloudflare Workers.

## 📁 Project Structure

```
cloudflare-worker/
├── src/
│   ├── index.ts          # Main router and entry point
│   ├── routes/           # API route handlers
│   │   ├── email.ts      # Email sending functionality
│   │   └── health.ts      # Health check endpoint
│   ├── utils/            # Utility functions
│   │   └── cors.ts       # CORS helpers
│   └── types/            # TypeScript type definitions
│       └── index.ts      # Shared types
├── package.json
├── wrangler.jsonc        # Cloudflare Workers configuration
└── tsconfig.json
```

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Set Environment Secrets

```bash
npx wrangler secret put RESEND_API_KEY
```

### Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:8787`

### Deploy

```bash
npm run deploy
```

## 📡 API Endpoints

### Health Check

- **GET** `/api/health`
- Returns API health status

### Email

- **POST** `/api/email`
- Sends email via Resend API
- Body: `{ email, resetToken, userName?, type? }`

## 🔧 Adding New Routes

1. Create a new file in `src/routes/` (e.g., `src/routes/notes.ts`)
2. Export a handler function: `export async function handleNotes(request: Request, env: Env): Promise<Response>`
3. Add the route in `src/index.ts`:

```typescript
if (path === '/api/notes' && request.method === 'GET') {
	return handleNotes(request, env);
}
```

## 📦 Dependencies

- **axios**: HTTP client for API requests
- **resend**: Email service (via axios)

## 🔒 Environment Variables

- `RESEND_API_KEY`: Resend API key for sending emails

Add more environment variables in:

- `src/types/index.ts` - Add to `Env` interface
- `wrangler.jsonc` - Configure as secrets or vars
