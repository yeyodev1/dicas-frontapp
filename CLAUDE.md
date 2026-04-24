# Dicas Frontapp — Claude Context

## Project
Dicas Advisor Group frontend. Vue 3 + TypeScript + Pinia + Vue Router + SCSS. Domain: **dicasadvisor.org**.

## Backend
Companion repo at `../dicas-backapp`. Express + TypeScript + Mongoose. Runs on port **8100**. API base: `http://localhost:8100/api`.

## Stack
- Vue 3 Composition API (`<script setup lang="ts">`)
- Pinia stores: `user`, `modal`, `lead`, `blog`
- Vue Router 4 (history mode)
- Axios via `APIBase` class in `src/services/httpBase.ts`
- SCSS with global variables injected by Vite (`@use "@/styles/index.scss" as *`)

## SCSS Variables (global, no import needed in components)
- `$primary` → #C5A467 (gold)
- `$primary-dark` → #0A0A0A (near black)
- `$primary-light` → #E2CC91
- `$secondary` → #8B1D22 (red)
- `$white` → #fefefe
- `$font-principal` → Montserrat
- `$font-luxury` → Playfair Display
- `$font-secondary` → Inter

## Auth
- JWT stored in `localStorage` as `access_token`
- Payload: `{ userId, email, accountType: 'admin' | 'copywriter', iat, exp }`
- Admin: `admin@dicasadvisor.org` / `123456789`
- User store (`src/stores/user.ts`) hydrates from JWT on app load

## Roles
- **admin**: full access — all posts, users management, publish toggle
- **copywriter**: own posts only, no user management

## Routes
| Path | Access |
|------|--------|
| `/` | public |
| `/blog` | public |
| `/blog/:slug` | public |
| `/login` | public (redirects if authenticated) |
| `/admin` | requiresAuth + admin role |
| `/admin/posts` | admin |
| `/admin/posts/new` | admin |
| `/admin/posts/:id/edit` | admin |
| `/admin/users` | admin |
| `/editor/posts` | requiresAuth (any role) |
| `/editor/posts/new` | requiresAuth |
| `/editor/posts/:id/edit` | requiresAuth |

## Blog Feature (added 2026-04-24)
- Backend: User model, Post model, auth/user/post services+controllers+routes
- Frontend: DBlogSection (home preview), BlogView, BlogPostView, Admin panel (4 views), Editor panel (3 views)
- Seed script: `ts-node src/scripts/seed.ts` in dicas-backapp — creates admin user

## Services pattern
```ts
import APIBase from '@/services/httpBase'
class MyService extends APIBase {
  doSomething() { return this.get('/endpoint') }
}
export default new MyService()
```

## Key files
- `src/stores/user.ts` — auth state + JWT decode
- `src/stores/blog.ts` — blog posts state
- `src/services/auth.service.ts` — login
- `src/services/blog.service.ts` — blog CRUD
- `src/services/user.service.ts` — user management
- `src/components/DBlogSection.vue` — blog preview on Home
- `src/views/admin/AdminView.vue` — admin layout shell
- `src/views/editor/EditorView.vue` — copywriter layout shell
