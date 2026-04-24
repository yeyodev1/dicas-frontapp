<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBlogStore } from '@/stores/blog'
import UserService from '@/services/user.service'

const userStore = useUserStore()
const blogStore = useBlogStore()
const userCount = ref(0)

onMounted(async () => {
  await blogStore.fetchAdminPosts()
  try {
    const res = await UserService.getUsers()
    userCount.value = res.data.filter(u => u.accountType === 'copywriter').length
  } catch {}
})

const totalPosts = () => blogStore.adminPosts.length
const published = () => blogStore.adminPosts.filter(p => p.status === 'published').length
const drafts = () => blogStore.adminPosts.filter(p => p.status === 'draft').length
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Bienvenido, {{ userStore.name || 'Admin' }}</h1>
      <p>Panel de administración de Dicas Advisor Group</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ totalPosts() }}</div>
        <div class="stat-label">Total Posts</div>
      </div>
      <div class="stat-card stat-published">
        <div class="stat-value">{{ published() }}</div>
        <div class="stat-label">Publicados</div>
      </div>
      <div class="stat-card stat-draft">
        <div class="stat-value">{{ drafts() }}</div>
        <div class="stat-label">Borradores</div>
      </div>
      <div class="stat-card stat-users">
        <div class="stat-value">{{ userCount }}</div>
        <div class="stat-label">Copywriters</div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Acciones rápidas</h2>
      <div class="actions-row">
        <router-link to="/admin/posts/new" class="action-btn">+ Nuevo post</router-link>
        <router-link to="/admin/users" class="action-btn action-secondary">+ Nuevo copywriter</router-link>
        <router-link to="/blog" target="_blank" class="action-btn action-secondary">Ver blog público →</router-link>
      </div>
    </div>

    <div class="recent-posts" v-if="blogStore.adminPosts.length">
      <h2>Posts recientes</h2>
      <div class="posts-list">
        <div v-for="post in blogStore.adminPosts.slice(0, 5)" :key="post._id" class="post-row">
          <div class="post-info">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-author">{{ post.author?.name }}</span>
          </div>
          <div class="post-right">
            <span :class="['status-badge', post.status]">{{ post.status === 'published' ? 'Publicado' : 'Borrador' }}</span>
            <router-link :to="`/admin/posts/${post._id}/edit`" class="edit-link">Editar</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard { color: $white; }

.page-header {
  margin-bottom: 2.5rem;

  h1 { font-family: $font-luxury; font-size: 2rem; color: $white; margin-bottom: 0.3rem; }
  p { font-family: $font-principal; font-size: 0.9rem; color: rgba($white, 0.4); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba($white, 0.04);
  border: 1px solid rgba($primary, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;

  &.stat-published { border-color: rgba(#10b981, 0.2); }
  &.stat-draft { border-color: rgba($white, 0.08); }
  &.stat-users { border-color: rgba($primary, 0.2); }
}

.stat-value {
  font-family: $font-luxury;
  font-size: 2.8rem;
  color: $primary;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-family: $font-principal;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba($white, 0.4);
}

.quick-actions, .recent-posts {
  margin-bottom: 3rem;

  h2 {
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba($white, 0.4);
    margin-bottom: 1rem;
  }
}

.actions-row {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.action-btn {
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 0.7rem 1.3rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: $primary-light; }

  &.action-secondary {
    background: rgba($white, 0.05);
    color: rgba($white, 0.7);
    border: 1px solid rgba($white, 0.1);

    &:hover { border-color: rgba($primary, 0.3); color: $primary; background: rgba($primary, 0.05); }
  }
}

.posts-list { display: flex; flex-direction: column; gap: 0.5rem; }

.post-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.2rem;
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.06);
  border-radius: 8px;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.post-title {
  font-family: $font-principal;
  font-size: 0.9rem;
  color: $white;
  font-weight: 500;
}

.post-author {
  font-family: $font-principal;
  font-size: 0.75rem;
  color: rgba($white, 0.35);
}

.post-right { display: flex; align-items: center; gap: 1rem; }

.status-badge {
  font-family: $font-principal;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.7rem;
  border-radius: 50px;

  &.published { background: rgba(#10b981, 0.15); color: #10b981; }
  &.draft { background: rgba($white, 0.06); color: rgba($white, 0.4); }
}

.edit-link {
  font-family: $font-principal;
  font-size: 0.8rem;
  color: $primary;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}
</style>
