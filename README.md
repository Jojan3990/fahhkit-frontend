# FahhKit Run Club — Frontend

React (Vite) frontend for the FahhKit Run Club website. Talks to the [FahhKit backend](../FahhKit) API — deployed separately.

## Development

```
npm install
npm run dev
```

Runs at `http://localhost:5173`. The backend must be running separately (see the FahhKit repo) — by default the app calls `http://localhost:8080`, set via `VITE_API_BASE_URL` in `.env`.

To point at a different backend locally, create `.env.local` (gitignored) and override:

```
VITE_API_BASE_URL=http://localhost:8080
```

## Deploying (Netlify)

1. Connect this repo in Netlify — it reads `netlify.toml` automatically (build command `npm run build`, publish dir `dist`, SPA redirect already configured).
2. In Netlify's site settings → **Environment variables**, set:
   ```
   VITE_API_BASE_URL=<production backend URL>
   ```
   (Vite bakes env vars in at build time, so this must be set in Netlify, not just locally.)
3. Trigger a deploy.

## Notes

- The backend's CORS policy currently allows all origins for REST endpoints, so no backend change is needed for the Netlify domain to call the API.
- If/when this app uses the backend's WebSocket endpoint (`/ws`), the Netlify domain will need to be added to the backend's `fks.allowed.origins` property.
