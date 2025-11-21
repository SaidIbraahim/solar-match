# SolarMatch

SolarMatch is an AI-assisted solar sizing assistant focused on Puntland, Somalia. It provides a no-math interface for households, shops, and clinics to select appliances with icons, calculates a right-sized solar PV plan, estimates cost, savings, CO₂ impact, and lists nearby solar retailers.

## Project structure

```
/frontend   # Next.js 15 + Tailwind UI
/backend    # Express + TypeScript calculation API
/database   # Supabase/Postgres schema
/scripts    # Helper scripts (seed, deployment hooks)
package.json
```

## Key features

- Visual profile + appliance selection with Somali-friendly copy
- Deterministic solar sizing logic (panel wattage, battery Ah, cost, ROI, CO₂)
- Retailer list with distance, contact, and selectable partners for the plan
- PDF export for sharing with installers
- Optional save endpoint that prepares Supabase integration

## Getting started

```bash
# Install shared dev dependency
npm install

# Install frontend/backend packages
cd frontend && npm install
cd ../backend && npm install

# Start everything (frontend on localhost:3000, backend on 4000)
cd ..
npm run dev
```

Environment variables:

```
backend/env.example  # copy to backend/.env (or env.local)
  PORT=4000
  SUPABASE_URL=your-project-url
  SUPABASE_SERVICE_ROLE_KEY=service-role

frontend/.env.local
  NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Scripts

- `npm run dev` – runs backend API and frontend UI together
- `npm run dev:backend` / `npm run dev:frontend` – run individually
- `npm run build` – builds backend (tsc) then Next.js app
- `npm --prefix backend run seed` – seed Supabase with appliances and retailers

### Database

- `database/schema.sql` defines Users, AppliancePresets, Retailers, and SavedPlans tables.

## Next steps

- Connect backend `save-plan` endpoint to Supabase.
- Add AI explanation endpoint powered by GPT-5.1 for localized narratives.
- Integrate bill scanning (OCR) and real-time irradiance data per roadmap.

