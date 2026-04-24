import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded?.accountType || null
  } catch {
    return null
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/servicios/:id',
    name: 'ServiceDetail',
    component: () => import('../views/ServiceDetailView.vue'),
    props: true,
    meta: { title: 'Servicio' }
  },
  {
    path: '/agendar',
    name: 'Booking',
    component: () => import('../views/BookingView.vue'),
    meta: { title: 'Agendar Cita' }
  },
  {
    path: '/gracias',
    name: 'ThankYou',
    component: () => import('../views/ThankYouView.vue'),
    meta: { title: 'Gracias' }
  },

  // Auth
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Iniciar sesión' }
  },

  // Public blog
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogView.vue'),
    meta: { title: 'Blog' }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('../views/BlogPostView.vue'),
    props: true,
    meta: { title: 'Artículo' }
  },

  // Admin panel
  {
    path: '/admin',
    component: () => import('../views/admin/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: () => import('../views/admin/AdminPostsView.vue'),
        meta: { title: 'Posts' }
      },
      {
        path: 'posts/new',
        name: 'AdminPostNew',
        component: () => import('../views/admin/AdminPostEditView.vue'),
        meta: { title: 'Nuevo Post' }
      },
      {
        path: 'posts/:id/edit',
        name: 'AdminPostEdit',
        component: () => import('../views/admin/AdminPostEditView.vue'),
        props: true,
        meta: { title: 'Editar Post' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/AdminUsersView.vue'),
        meta: { title: 'Usuarios' }
      },
    ]
  },

  // Editor (copywriter) panel
  {
    path: '/editor',
    component: () => import('../views/editor/EditorView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/editor/posts'
      },
      {
        path: 'posts',
        name: 'EditorPosts',
        component: () => import('../views/editor/EditorPostsView.vue'),
        meta: { title: 'Mis Posts' }
      },
      {
        path: 'posts/new',
        name: 'EditorPostNew',
        component: () => import('../views/editor/EditorPostEditView.vue'),
        meta: { title: 'Nuevo Artículo' }
      },
      {
        path: 'posts/:id/edit',
        name: 'EditorPostEdit',
        component: () => import('../views/editor/EditorPostEditView.vue'),
        props: true,
        meta: { title: 'Editar Artículo' }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const hasToken = !!token
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta?.requiresAdmin)

  if (requiresAuth && !hasToken) {
    return next({ path: '/login', replace: true })
  }

  if (requiresAdmin && hasToken) {
    const role = decodeJwtRole(token!)
    if (role !== 'admin') {
      return next({ path: '/editor', replace: true })
    }
  }

  if (to.path === '/login' && hasToken) {
    const role = decodeJwtRole(token!)
    return next({ path: role === 'admin' ? '/admin' : '/editor', replace: true })
  }

  next()
})

export default router
