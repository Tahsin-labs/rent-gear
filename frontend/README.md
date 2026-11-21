# GearUp Frontend

Next.js App Router frontend for GearUp peer-to-peer gear sharing and rental platform.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Lucide Icons, Sonner
- **State & Data Fetching**: TanStack Query (React Query v5)
- **Forms & Validation**: React Hook Form, Zod
- **Auth & Security**: JWT cookie-based session, `jose`, Next.js Middleware route protection
- **Media**: Cloudinary (unsigned client-side uploads with size & type validation)
- **Payment**: SSLCommerz redirect & callback integration

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend Express API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend application origin | `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned preset | `gearup_preset` |
| `JWT_SECRET` | Secret key matching backend `JWT_ACCESS_SECRET` | `your_jwt_secret` |

---

## Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Typecheck codebase
npm run lint
npx tsc --noEmit
```

---

## Directory Structure
- `src/app/(auth)/`: Authentication pages (`/login`, `/register`)
- `src/app/(public)/`: Public discovery pages
- `src/app/dashboard/`: Role-gated dashboards (`customer`, `provider`, `admin`)
- `src/app/payment/`: SSLCommerz payment callback pages (`success`, `fail`, `cancel`)
- `src/components/ui/`: shadcn/ui components
- `src/components/shared/`: Shared components (`Navbar`, `Footer`, `ImageUploader`, `StatusBadge`, `EmptyState`, etc.)
- `src/hooks/`: TanStack Query hooks & mutations
- `src/lib/api/`: Fetch API client and typed endpoints
- `src/lib/validations/`: Zod schemas
- `src/middleware.ts`: Role-based route guard and redirection
