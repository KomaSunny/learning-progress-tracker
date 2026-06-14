# Frontend

Frontend app for the learning record project.

Stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- pnpm

## Setup

Install dependencies:

```bash
pnpm install
```

If PowerShell blocks `pnpm`, use `pnpm.cmd`:

```bash
pnpm.cmd install
```

## Environment Variables

The backend API base URL is configured with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Create `.env.local` from `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` is for local development and must not be committed.

## JWT Storage Policy

The frontend stores the JWT returned from the backend login API in `LocalStorage`.

Storage key:

```text
access_token
```

Save:

```ts
localStorage.setItem("access_token", accessToken);
```

Read:

```ts
const token = localStorage.getItem("access_token");
```

Remove:

```ts
localStorage.removeItem("access_token");
```

JWT issuing and verification are handled by the backend.

## Development

Start the dev server:

```bash
pnpm dev
```

If PowerShell blocks `pnpm`, use:

```bash
pnpm.cmd dev
```

Open:

```text
http://localhost:3000
```

## Checks

Lint:

```bash
pnpm lint
```

Build:

```bash
pnpm build
```

If PowerShell blocks `pnpm`, use:

```bash
pnpm.cmd lint
pnpm.cmd build
```
