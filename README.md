# Pixeliano — Photography Dashboard

A responsive photography gallery and its JWT-secured content API, built on React, Express, MongoDB, and Cloudinary.

**Live demo:** https://pixeliano.theharshdeepsingh.com/

## Overview

Pixeliano is the web half of a small photography publishing platform. The repository is a single Node package that contains both a React single-page front end and the Express/MongoDB API that backs it. The public-facing site renders a photo feed with infinite scroll, served from a server-paginated endpoint and delivered through Cloudinary's on-the-fly image transformations. The same API exposes a JWT-protected CRUD surface for posts and tags, which is consumed by a companion React Native admin app (a separate repository, `Pixeliano-admin-app`) that shares this backend.

## Problem statement

Publishing a photo feed needs two very different surfaces: a fast, public gallery that anyone can scroll, and a private, authenticated surface for the owner to create, edit, and remove posts and manage their media. Loading an entire image library into the browser at once does not scale, and mixing public reads with privileged writes in one unguarded API invites abuse. Pixeliano addresses this by serving the gallery from a paginated, read-only endpoint while gating all mutations and media operations behind authenticated, server-side handlers.

## Goals

- Render a smooth, responsive public photo gallery that loads incrementally rather than all at once.
- Page image data on the server so the client only fetches what it needs as the user scrolls.
- Offload image storage and delivery to Cloudinary, requesting size/quality-optimised variants per use.
- Expose a clean JSON REST API for full CRUD on posts and tags, with privileged routes protected by token authentication.
- Keep the backend organised along a clear route → controller → model boundary.

## Key features

- **Public photo gallery with infinite scroll.** The front end (`src/components/AllPosts`) appends pages of posts as the user nears the bottom of the page, using a scroll listener with a 500px pre-fetch threshold and a guard that stops once all posts are loaded or a request is already in flight.
- **Server-side pagination.** The listing endpoint (`GET /api/v1/listing/posts/:offset`) returns a fixed page size (`postsDeliveryLimit`, 10) plus the total count, so the client can decide when to stop requesting more.
- **Cloudinary on-the-fly delivery.** The front end builds transformation URLs (`w`, `h`, `q`) at render time — thumbnails are requested at low quality and the full-resolution image is fetched only when a post is opened in a modal.
- **JWT-protected CRUD API.** Post and tag routes are mounted behind an authentication middleware. Tokens are RS256-signed JWTs that are additionally AES-encrypted (via `crypto-js`) before being handed to the client, and decrypted/verified on every protected request.
- **User accounts with hashed credentials.** Registration, email-existence check, and sign-in are backed by bcrypt password hashing.
- **Tagging.** Posts carry tags stored in their own collection and resolved via aggregation; users can maintain a set of default tags.
- **Soft deletes.** Posts are never physically removed — deletion flips a `visible` flag, and all reads filter on it.
- **Request logging.** Each non-static request is persisted as an audit record, and structured logs are written via Winston.

## Architecture & key decisions

The project is a single npm package with two cooperating halves:

- **Front end** — Create React App (`src/`), SCSS for styling, React Router for the single dashboard route, and a thin Axios service that calls only the public listing endpoint.
- **Back end** — an Express app (`index.js`) organised by feature under `api/v1/<Feature>/` with a consistent **route → controller → model** split. Controllers handle the HTTP boundary and validation; models hold the Mongoose/aggregation logic; cross-cutting concerns (Cloudinary, JWT, password hashing) live in `services/`; auth, error handling, and request logging live in `middlewares/`. In production (`MODE=production`) the same Express process also serves the built React bundle and falls through to `index.html` for client-side routing.

Selected trade-offs:

- **Server-side pagination + infinite scroll, over client-side filtering.** Paging on the server keeps the initial payload small and lets the UI fetch on demand. The current implementation uses offset/skip pagination (`.limit(limit + offset).skip(offset)`), which is simple and perfectly adequate at this scale; for very large datasets a cursor/keyset approach would avoid the cost of skipping over growing offsets.
- **Read/write split between this web app and the admin app.** The web front end is intentionally read-only — it consumes a single public endpoint and renders the gallery. All mutating operations (create/update/delete posts, Cloudinary upload and deletion of media) are exposed by the backend behind JWT auth and are driven by the separate admin app. This keeps the public site free of privileged code paths.
- **Defence-in-depth on tokens, not media.** JWTs are RS256-signed and then AES-wrapped before transport, and passwords are bcrypt-hashed; the listing endpoint resolves its target account by AES-decrypting a configured secret rather than trusting a client parameter. Note that this encryption protects credentials and tokens — the image files themselves are stored and delivered by Cloudinary, not encrypted.
- **Cloudinary as the image tier.** Storage, transformation, and CDN delivery are delegated to Cloudinary. The backend talks to Cloudinary's REST API using both a signed-request instance (for uploads) and a basic-auth instance (for deletes); the front end only ever constructs delivery URLs.
- **Soft deletes and append-only media records.** Updates that swap an image delete the old Cloudinary asset and insert a fresh picture record, and post deletion is a `visible: false` toggle — favouring auditability over hard removal.

> An RSS feed-generation path exists in the codebase but is disabled by default (`isRSSActive: false`) and is not part of the running feature set.

## Tech stack

Derived from `package.json`:

- **Front end:** React 18, React Router DOM 5, Axios, Font Awesome, SCSS (`sass`), Create React App (`react-scripts`).
- **Back end:** Node.js, Express 4, Mongoose 5 (MongoDB), `body-parser`, `cors`, `morgan`.
- **Auth & crypto:** `jsonwebtoken` (RS256), `crypto-js` (AES), `bcrypt`.
- **Media:** Cloudinary REST API (called via Axios with signed and basic-auth instances).
- **Tooling:** `dotenv`, `winston` (logging), `prop-types`, Testing Library.

## Getting started

> Note: this repo does **not** follow the usual CRA script convention. `npm start` runs the Express server (port 8080), and `npm run react-start` runs the React dev server (port 3000). Local development needs both processes.

### Prerequisites

- Node.js (the package pins `engines.node` to `16.13.1`)
- A MongoDB instance
- A Cloudinary account
- An RSA key pair for RS256 JWT signing/verification

### Install

```bash
npm install
```

`postinstall` automatically runs `npm run build`, producing the production React bundle in `build/`.

### Environment variables

Create a `.env` file (it is git-ignored). The code reads, at minimum:

**Server**

- `MONGODB_URI` — MongoDB connection string (used when `MODE` is `herokudev` or `production`; otherwise a local default is used)
- `MODE` — runtime mode (`production` makes Express serve the built React app and enforce CORS origin checks)
- `PORT` — server port (defaults to `8080`)
- `CORS_ORIGIN` — allowed origin in production
- `PRIVATE_KEY` / `PUBLIC_KEY` — RSA key pair for RS256 JWTs
- `SECRET_TEXT` — JSON payload (`iv`, `key`, `encryptedData`) AES-decrypted to resolve the listing account
- `REACT_APP_CLOUDINARY_API_KEY` / `REACT_APP_CLOUDINARY_API_SECRET` — Cloudinary credentials used by the backend

**Front end** (build-time, `REACT_APP_*`)

- `REACT_APP_MODE`
- `REACT_APP_CLOUDINARY_API_KEY`, `REACT_APP_CLOUDINARY_API_SECRET`
- `REACT_APP_CLOUDINARY_API_URL`, `REACT_APP_CLOUDINARY_API_SECURE_DELIVERY_URL`
- `REACT_APP_CLOUDINARY_API_UPLOAD_PRESET`
- `REACT_APP_CLOUDINARY_API_GET_POSTS_LIMIT`

### Run (development)

In one terminal, start the API:

```bash
npm start          # node index.js — Express on http://localhost:8080
```

In another, start the React dev server (the CRA `proxy` field forwards `/api` to port 8080):

```bash
npm run react-start   # react-scripts start — http://localhost:3000
```

### Run (production)

```bash
npm run build         # build the React bundle
MODE=production npm start
```

With `MODE=production`, Express serves the static `build/` output and falls back to `index.html` for client-side routes, so a single process hosts both the API and the site.

### Tests

```bash
npm test              # react-scripts test (Testing Library is configured)
```

## Future scope

- Move from offset/skip pagination to cursor/keyset pagination for large libraries.
- Enable and finish the RSS feed-generation path that is currently dormant.
- Add automated tests around the API controllers and pagination logic.
- Use an `IntersectionObserver` for infinite scroll in place of a scroll-position listener.
- Tighten the API surface (the `instagram`/`rss` post flags and an `OPTIONS`/method allow-list hint at planned cross-posting features).

---

Built by Harshdeep Singh — https://theharshdeepsingh.com
