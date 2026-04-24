<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.hydrate()
  if (!userStore.isAuthenticated) {
    router.push('/login')
  }
})

function logout() {
  userStore.clear()
  router.push('/login')
}
</script>

<template>
  <div class="editor-shell">
    <aside class="editor-sidebar">
      <div class="sidebar-top">
        <img src="@/assets/logo/logo-large.png" alt="Dicas" class="sidebar-logo" />
        <div class="sidebar-badge">Sala de Redacción</div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/editor/posts" active-class="is-active" class="nav-item">
          <i class="fa-solid fa-file-lines nav-icon"></i> Mis Posts
        </router-link>
        <router-link to="/editor/posts/new" active-class="is-active" class="nav-item">
          <i class="fa-solid fa-pen nav-icon"></i> Nuevo Post
        </router-link>
        <router-link to="/blog" target="_blank" class="nav-item nav-external">
          <i class="fa-solid fa-arrow-up-right-from-square nav-icon"></i> Ver Blog
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <div class="user-info">
          <div class="user-avatar">{{ userStore.name?.charAt(0)?.toUpperCase() || 'C' }}</div>
          <div class="user-details">
            <p class="user-name">{{ userStore.name || userStore.email }}</p>
            <p class="user-role">Copywriter</p>
          </div>
        </div>
        <button class="logout-btn" @click="logout">Cerrar sesión</button>
      </div>
    </aside>

    <main class="editor-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.editor-shell {
  display: flex;
  min-height: 100vh;
  background: #0d1117;
}

.editor-sidebar {
  width: 240px;
  min-height: 100vh;
  background: rgba($primary-dark, 0.95);
  border-right: 1px solid rgba($primary, 0.12);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-top {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba($primary, 0.1);
}

.sidebar-logo {
  height: 36px;
  object-fit: contain;
  display: block;
  margin-bottom: 0.8rem;
}

.sidebar-badge {
  font-family: $font-principal;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba($white, 0.4);
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-family: $font-principal;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba($white, 0.55);
  transition: all 0.2s;

  .nav-icon {
    width: 16px;
    font-size: 0.85rem;
    text-align: center;
    color: rgba($white, 0.35);
    transition: color 0.2s;
    flex-shrink: 0;
  }

  &:hover, &.is-active {
    background: rgba($primary, 0.08);
    color: $white;
    border-left: 2px solid $primary;
    padding-left: calc(1rem - 2px);

    .nav-icon { color: $primary; }
  }

  &.nav-external { margin-top: 1rem; border-top: 1px solid rgba($white, 0.05); padding-top: 1rem; }
}

.sidebar-bottom {
  padding: 1.5rem;
  border-top: 1px solid rgba($primary, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba($white, 0.1);
  color: $white;
  font-family: $font-principal;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name { font-family: $font-principal; font-size: 0.85rem; color: $white; font-weight: 600; }
.user-role { font-family: $font-principal; font-size: 0.72rem; color: rgba($white, 0.35); }

.logout-btn {
  width: 100%;
  background: rgba($white, 0.04);
  border: 1px solid rgba($white, 0.08);
  color: rgba($white, 0.5);
  padding: 0.6rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(#ef4444, 0.1); border-color: rgba(#ef4444, 0.3); color: #ef4444; }
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem;
}
</style>
