Role and operating rules

You are building a full-stack web application called **HomeRemedis** end to end — backend, frontend, containerization, CI/CD, and deployment. Work in the phases listed below, **in order**. Do not start a phase until the previous phase's tests pass. At the end of every phase:

1. Run the tests for that phase.
2. Show the test output.
3. If anything fails, fix it and re-run before moving on.
4. Summarize what was built and what is now verified working.

Do not skip ahead "to save time." A phase that isn't tested is not done.

---

## Project overview

HomeRemedis is a reference site with two linked content types:

- **Plants** — an encyclopedia of medicinal plants (name, scientific name, country/region of origin, native habitat, parts used, active compounds, uses, image, precautions).
- **Remedies** — home remedies with brewing/preparation method, organized by category (fever, cold, cough, digestion, skin, sleep, etc.), each referencing one or more Plants.

Users browse Plants (search/filter by name or origin) and browse Remedies (filter by category), and can navigate between a plant and the remedies that use it.

Include a visible disclaimer on every content page: *"For informational purposes only — not medical advice."* Do not let generated content state cure claims or dosing instructions; frame everything as traditional/folk usage.

## Tech stack

- Frontend: React (functional components, hooks, react-router)
- Backend: Node.js + Express
- Database: MongoDB (design it to work with a local MongoDB in Docker and MongoDB Atlas in production — same connection string pattern, just swap the env var)
- Image hosting: Cloudinary (free tier) — abstract this behind a small upload helper so it's swappable
- Containerization: Docker + docker-compose for local dev
- CI/CD: GitHub Actions
- Testing: Jest + Supertest (backend), React Testing Library (frontend), Playwright (end-to-end)

## Data model

`plants` collection:
```
{
  name: string,
  scientificName: string,
  countryOfOrigin: string,
  habitat: string,
  partsUsed: [string],
  activeCompounds: [string],
  uses: [string],
  imageUrl: string,
  precautions: string
}
```

`remedies` collection:
```
{
  title: string,
  categories: [string],       // e.g. ["fever", "cold"]
  plantIds: [ObjectId],       // references plants._id
  ingredients: [string],
  method: string,             // brewing/prep steps
  prepTimeMinutes: number,
  origin: string              // e.g. "Kerala household remedy", "Ayurvedic"
}
```

## API contract

```
GET  /api/plants                 -> list; supports ?search= and ?origin=
GET  /api/plants/:id             -> single plant + remedies that reference it
GET  /api/remedies               -> list; supports ?category=
GET  /api/remedies/:id           -> single remedy + its linked plants
GET  /api/categories             -> distinct category list, for building filter UI
POST /api/plants                 -> create (admin only, Phase 7)
POST /api/remedies               -> create (admin only, Phase 7)
```

---

## Phase 1 — Backend core + tests

Build the Express API against the data model and contract above, connected to a local MongoDB.

Include:
- Mongoose (or native driver) models for `plants` and `remedies`
- All GET routes above
- Input validation (e.g. reject bad ObjectIds with a 400, not a 500)
- A seed script that inserts ~15 sample plants and ~15 sample remedies with realistic cross-references

**Tests required before moving on (Jest + Supertest):**
- Each GET route returns 200 and the expected shape for valid input
- `/api/plants/:id` and `/api/remedies/:id` return 404 for a nonexistent id and 400 for a malformed id
- `?search=` and `?origin=` filters actually filter (test with seeded data)
- `?category=` filter on remedies works
- A plant's linked remedies and a remedy's linked plants resolve correctly

Do not proceed to Phase 2 until all of the above pass.

## Phase 2 — Frontend shell + tests

Build the React app:
- Routes: Plant list, Plant detail, Remedy list (with category filter chips), Remedy detail, Home
- Plant list: search box, grid of plant cards
- Remedy list: category filter, list of remedy cards
- Plant detail: full plant info + list of remedies that use it (linked)
- Remedy detail: method/ingredients + list of linked plants (linked)
- Loading and empty states for every list/detail view
- Disclaimer visible on every content page

**Tests required before moving on (React Testing Library):**
- Plant list renders cards from mocked API data
- Search input filters the visible list (or triggers the right API call — test whichever the implementation does)
- Category filter on remedy list shows only matching remedies
- Plant detail and remedy detail pages render linked content correctly
- Empty state renders when a list/detail API call returns nothing
- Error state renders when an API call fails

Do not proceed to Phase 3 until all of the above pass.

## Phase 3 — Integration + tests

Wire the frontend to the real backend (no more mocks). Add environment-based API base URL config so this works locally and in deployment.

**Tests required before moving on:**
- Re-run Phase 1 and Phase 2 test suites — both must still pass
- Add at least 3 integration tests that hit the real running backend from the frontend test environment (or via Supertest against the live Express app) covering: full plant list load, plant-to-remedy navigation data, and a failed request (backend down / bad id) rendering the frontend's error state

Do not proceed to Phase 4 until all of the above pass.

## Phase 4 — Docker + docker-compose

- Dockerfile for the Express API
- Dockerfile (or static build + serve) for the React app
- docker-compose.yml wiring: frontend, backend, and a MongoDB container, with the backend's Mongo connection string pointed at the compose Mongo service

**Verification required before moving on:**
- `docker-compose up` brings up all three services cleanly
- The seed script runs successfully against the composed MongoDB
- Re-run Phase 1 and Phase 3 test suites against the containerized backend — both must pass

Do not proceed to Phase 5 until this is verified.

## Phase 5 — CI/CD (GitHub Actions)

Add a workflow that, on every push:
1. Installs dependencies for backend and frontend
2. Runs the Phase 1 backend test suite
3. Runs the Phase 2 frontend test suite
4. Fails the workflow if either suite fails
5. Only on a successful run on the main branch, triggers deployment (Phase 6)

**Verification required before moving on:**
- Push a commit and confirm the workflow runs and reports pass/fail correctly
- Push a deliberately broken test and confirm the workflow correctly fails and blocks deployment, then revert it

Do not proceed to Phase 6 until this is verified.

## Phase 6 — Deployment (free tier)

- Backend: deploy to Render (free web service), connected to MongoDB Atlas (free cluster) instead of the local container
- Frontend: deploy to Vercel, pointed at the deployed backend URL
- Images: switch the upload helper from local/dev storage to Cloudinary (free tier)

**Verification required before moving on:**
- The deployed frontend URL loads and successfully calls the deployed backend
- Plant and remedy browsing, search, and filtering all work against the deployed, Atlas-backed database
- Re-run the Playwright suite (Phase 7) against the deployed URLs, not just localhost

## Phase 7 — End-to-end tests (Playwright) + optional admin CRUD

- Write Playwright tests covering the full user journeys: browse plants → search → open a plant → follow a linked remedy → browse remedies by category → open a remedy → follow a linked plant
- If time allows: add simple password-protected `POST /api/plants` and `POST /api/remedies` routes plus a minimal admin form in the frontend, with tests covering both the auth rejection path and the successful-create path

**Final acceptance criteria (all must pass together):**
- Backend unit/integration suite
- Frontend component suite
- Playwright end-to-end suite, run against the deployed environment
- CI workflow green on the current main branch

---

## Deliverable

At the end, provide:
- A short README covering: setup, environment variables needed, how to run locally with docker-compose, how tests are run, and the deployed URLs
- A summary of test coverage per phase
