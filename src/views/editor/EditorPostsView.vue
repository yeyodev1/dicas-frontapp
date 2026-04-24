<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
const confirmDeleteId = ref<string | null>(null)

onMounted(() => blogStore.fetchAdminPosts())

async function deletePost(id: string) {
  if (confirmDeleteId.value !== id) {
    confirmDeleteId.value = id
    return
  }
  try {
    await blogStore.deletePost(id)
    confirmDeleteId.value = null
  } catch {}
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="my-posts-page">
    <div class="page-header">
      <div>
        <h1>Mis Posts</h1>
        <p>Artículos que has escrito</p>
      </div>
      <router-link to="/editor/posts/new" class="btn-primary">+ Nuevo post</router-link>
    </div>

    <div v-if="blogStore.loading" class="loading-state">Cargando tus posts...</div>

    <div v-else-if="blogStore.adminPosts.length === 0" class="empty-state">
      Todavía no tienes posts. <router-link to="/editor/posts/new">Escribe el primero</router-link>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in blogStore.adminPosts" :key="post._id" class="post-row">
        <div class="post-main">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-meta">
            <span :class="['status-badge', post.status]">{{ post.status === 'published' ? 'Publicado' : 'Borrador' }}</span>
            <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
        <div class="post-actions">
          <router-link :to="`/editor/posts/${post._id}/edit`" class="action-edit">Editar</router-link>
          <button
            :class="['action-delete', { confirming: confirmDeleteId === post._id }]"
            @click="deletePost(post._id)"
          >
            {{ confirmDeleteId === post._id ? '¿Seguro?' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-posts-page { color: $white; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  h1 { font-family: $font-luxury; font-size: 1.8rem; color: $white; margin-bottom: 0.3rem; }
  p { font-family: $font-principal; font-size: 0.88rem; color: rgba($white, 0.4); }
}

.btn-primary {
  background: $primary;
  color: $primary-dark;
  padding: 0.7rem 1.3rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  &:hover { background: $primary-light; }
}

.loading-state, .empty-state {
  font-family: $font-principal;
  color: rgba($white, 0.4);
  padding: 3rem 0;
  text-align: center;
  a { color: $primary; }
}

.posts-list { display: flex; flex-direction: column; gap: 1rem; }

.post-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.06);
  border-radius: 10px;
  padding: 1.3rem 1.5rem;
  gap: 1rem;
  transition: border-color 0.2s;
  &:hover { border-color: rgba($primary, 0.15); }
}

.post-main { flex: 1; min-width: 0; }

.post-title {
  font-family: $font-principal;
  font-size: 1rem;
  font-weight: 600;
  color: $white;
  margin-bottom: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-excerpt {
  font-family: $font-principal;
  font-size: 0.82rem;
  color: rgba($white, 0.4);
  margin-bottom: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta { display: flex; align-items: center; gap: 1rem; }

.status-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  &.published { background: rgba(#10b981, 0.15); color: #10b981; }
  &.draft { background: rgba($white, 0.06); color: rgba($white, 0.4); }
}

.post-date { font-family: $font-principal; font-size: 0.78rem; color: rgba($white, 0.3); }

.post-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

.action-edit, .action-delete {
  font-family: $font-principal;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  background: none;
  text-decoration: none;
  transition: all 0.2s;
}

.action-edit {
  color: $primary;
  border-color: rgba($primary, 0.2);
  &:hover { background: rgba($primary, 0.08); }
}

.action-delete {
  color: rgba($white, 0.4);
  border-color: rgba($white, 0.08);
  &:hover { color: #ef4444; border-color: rgba(#ef4444, 0.3); }
  &.confirming { color: #ef4444; border-color: rgba(#ef4444, 0.4); background: rgba(#ef4444, 0.08); }
}
</style>
