---
name: Blog Feature Implementation
description: Complete blog + user management system built for dicas-frontapp and dicas-backapp on 2026-04-24
type: project
---

Complete blog feature implemented across both repos.

**Why:** Client needs a blog to publish advisory content. Copywriters write posts, admin manages all.

**How to apply:** When touching blog or auth code, check this context for patterns and file locations.

## Backend (dicas-backapp)
- `src/models/User.model.ts` — User (email, password, name, accountType: admin|copywriter)
- `src/models/Post.model.ts` — Post (title, slug, excerpt, content, coverImage, author, status, tags)
- `src/services/auth.service.ts` — login → JWT (7d, payload: userId/email/accountType)
- `src/services/user.service.ts` — createUser (copywriter only), listUsers
- `src/services/post.service.ts` — CRUD + togglePublish + slug generation
- `src/controllers/` — auth, user, post controllers
- `src/routes/` — auth.routes, user.routes, post.routes (registered in index.ts)
- `src/middlewares/role.middleware.ts` — requireAdmin middleware
- `src/scripts/seed.ts` — seeds admin@dicasadvisor.org / 123456789 → run: `ts-node src/scripts/seed.ts`
- `.env` — added JWT_SECRET=dicas_jwt_secret_2024_secure_key

## API Endpoints
- POST /api/auth/login
- GET/POST /api/users (admin only)
- GET /api/blog (public, published only)
- GET /api/blog/admin/all (auth, admin=all / copywriter=own)
- GET /api/blog/:slug (public)
- POST /api/blog (auth)
- PUT /api/blog/:id (auth, owner or admin)
- DELETE /api/blog/:id (auth, owner or admin)
- PATCH /api/blog/:id/publish (admin only)

## Frontend (dicas-frontapp)
- `src/stores/user.ts` — updated: role field, isAdmin getter, JWT decode in hydrate()
- `src/stores/blog.ts` — posts, adminPosts, currentPost, CRUD actions
- `src/services/auth.service.ts` — login
- `src/services/blog.service.ts` — blog CRUD
- `src/services/user.service.ts` — user management
- `src/views/LoginView.vue` — login page
- `src/views/BlogView.vue` — public blog listing
- `src/views/BlogPostView.vue` — single post
- `src/views/admin/AdminView.vue` — admin shell (sidebar + router-view)
- `src/views/admin/AdminDashboardView.vue` — stats + recent posts
- `src/views/admin/AdminUsersView.vue` — user list + create copywriter
- `src/views/admin/AdminPostsView.vue` — all posts table + publish toggle
- `src/views/admin/AdminPostEditView.vue` — create/edit post form
- `src/views/editor/EditorView.vue` — copywriter shell
- `src/views/editor/EditorPostsView.vue` — my posts
- `src/views/editor/EditorPostEditView.vue` — write/edit post
- `src/components/DBlogSection.vue` — blog preview in home (3 latest posts)
- `src/router/index.ts` — updated with all new routes + role guards
- `src/views/HomeView.vue` — DBlogSection added before footer
