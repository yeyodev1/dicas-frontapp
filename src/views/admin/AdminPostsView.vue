<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
const confirmDeleteId = ref<string | null>(null)
const togglingId = ref<string | null>(null)

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

async function togglePublish(id: string) {
  togglingId.value = id
  try {
    await blogStore.togglePublish(id)
  } finally {
    togglingId.value = null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="posts-page">
    <div class="page-header">
      <div>
        <h1>Posts</h1>
        <p>Todos los artículos del blog</p>
      </div>
      <router-link to="/admin/posts/new" class="btn-primary">+ Nuevo post</router-link>
    </div>

    <div v-if="blogStore.loading" class="loading-state">Cargando posts...</div>

    <div v-else-if="blogStore.adminPosts.length === 0" class="empty-state">
      No hay posts aún. <router-link to="/admin/posts/new">Crea el primero</router-link>
    </div>

    <div v-else class="posts-table-wrap">
      <table class="posts-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in blogStore.adminPosts" :key="post._id">
            <td class="title-cell">
              <span class="post-title">{{ post.title }}</span>
              <span class="post-slug">/blog/{{ post.slug }}</span>
            </td>
            <td class="author-cell">{{ post.author?.name }}</td>
            <td>
              <span :class="['status-badge', post.status]">
                {{ post.status === 'published' ? 'Publicado' : 'Borrador' }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(post.createdAt) }}</td>
            <td class="actions-cell">
              <button
                class="action-toggle"
                :class="{ 'is-published': post.status === 'published' }"
                @click="togglePublish(post._id)"
                :disabled="togglingId === post._id"
              >
                {{ post.status === 'published' ? 'Despublicar' : 'Publicar' }}
              </button>
              <router-link :to="`/admin/posts/${post._id}/edit`" class="action-edit">Editar</router-link>
              <button
                :class="['action-delete', { 'confirming': confirmDeleteId === post._id }]"
                @click="deletePost(post._id)"
              >
                {{ confirmDeleteId === post._id ? '¿Seguro?' : 'Eliminar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.posts-page { color: $white; }

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
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { background: $primary-light; }
}

.loading-state, .empty-state {
  font-family: $font-principal;
  color: rgba($white, 0.4);
  padding: 3rem 0;
  text-align: center;

  a { color: $primary; }
}

.posts-table-wrap { overflow-x: auto; }

.posts-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-principal;

  th {
    text-align: left;
    padding: 0.7rem 1rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba($white, 0.35);
    border-bottom: 1px solid rgba($white, 0.08);
  }

  td {
    padding: 0.9rem 1rem;
    font-size: 0.88rem;
    color: rgba($white, 0.75);
    border-bottom: 1px solid rgba($white, 0.04);
    vertical-align: middle;
  }

  tr:hover td { background: rgba($white, 0.02); }
}

.title-cell { max-width: 320px; }

.post-title {
  display: block;
  color: $white;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.post-slug {
  display: block;
  font-size: 0.75rem;
  color: rgba($white, 0.3);
}

.author-cell { color: rgba($white, 0.55) !important; font-size: 0.83rem !important; }
.date-cell { color: rgba($white, 0.35) !important; font-size: 0.8rem !important; white-space: nowrap; }

.status-badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.7rem;
  border-radius: 50px;

  &.published { background: rgba(#10b981, 0.15); color: #10b981; }
  &.draft { background: rgba($white, 0.06); color: rgba($white, 0.4); }
}

.actions-cell { white-space: nowrap; display: flex; gap: 0.5rem; align-items: center; }

.action-toggle, .action-edit, .action-delete {
  font-family: $font-principal;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  text-decoration: none;
  background: none;
  display: inline-block;
}

.action-toggle {
  color: rgba($white, 0.5);
  border-color: rgba($white, 0.1);
  &:hover { border-color: rgba(#10b981, 0.4); color: #10b981; }
  &.is-published:hover { border-color: rgba($white, 0.2); color: rgba($white, 0.6); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
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
