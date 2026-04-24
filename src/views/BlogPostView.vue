<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import DHeader from '@/components/DHeader.vue'
import DFooter from '@/components/DFooter.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

async function load() {
  await blogStore.fetchPostBySlug(route.params.slug as string)
  if (blogStore.error) router.push('/blog')
}

onMounted(load)
watch(() => route.params.slug, load)

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="post-page">
    <DHeader />

    <div v-if="blogStore.loading" class="post-loading">
      <div class="spinner"></div>
    </div>

    <template v-else-if="blogStore.currentPost">
      <div class="post-hero" :style="blogStore.currentPost.coverImage ? `background-image: url(${blogStore.currentPost.coverImage})` : ''">
        <div class="post-hero-overlay">
          <div class="post-hero-content">
            <nav class="breadcrumb">
              <router-link to="/">Inicio</router-link>
              <span>/</span>
              <router-link to="/blog">Blog</router-link>
              <span>/</span>
              <span>{{ blogStore.currentPost.title }}</span>
            </nav>
            <div class="post-tags" v-if="blogStore.currentPost.tags?.length">
              <span v-for="tag in blogStore.currentPost.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <h1>{{ blogStore.currentPost.title }}</h1>
            <div class="post-meta">
              <span>Por {{ blogStore.currentPost.author?.name }}</span>
              <span>·</span>
              <span>{{ formatDate(blogStore.currentPost.publishedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <article class="post-article">
        <div class="post-excerpt">{{ blogStore.currentPost.excerpt }}</div>
        <div class="post-content" v-html="blogStore.currentPost.content"></div>
        <div class="post-footer">
          <router-link to="/blog" class="back-btn">← Volver al Blog</router-link>
        </div>
      </article>
    </template>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.post-page { background: $primary-dark; min-height: 100vh; }

.post-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 2px solid rgba($primary, 0.2);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.post-hero {
  min-height: 60vh;
  background: linear-gradient(135deg, rgba($primary, 0.1), rgba($secondary, 0.15));
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.post-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba($primary-dark, 0.95) 0%, rgba($primary-dark, 0.3) 100%);
  display: flex;
  align-items: flex-end;
}

.post-hero-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 2rem;
  width: 100%;
}

.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-family: $font-principal;
  font-size: 0.78rem;
  color: rgba($white, 0.4);
  margin-bottom: 1rem;

  a { color: rgba($white, 0.5); text-decoration: none; &:hover { color: $primary; } }
  span:last-child { color: rgba($white, 0.6); }
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  font-family: $font-principal;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
}

.post-hero-content h1 {
  font-family: $font-luxury;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: $white;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 0.8rem;
  font-family: $font-principal;
  font-size: 0.85rem;
  color: rgba($white, 0.5);
}

.post-article {
  max-width: 860px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
}

.post-excerpt {
  font-family: $font-luxury;
  font-size: 1.25rem;
  color: rgba($white, 0.75);
  line-height: 1.8;
  border-left: 3px solid $primary;
  padding-left: 1.5rem;
  margin-bottom: 3rem;
  font-style: italic;
}

.post-content {
  font-family: $font-principal;
  font-size: 1rem;
  color: rgba($white, 0.75);
  line-height: 1.9;

  :deep(h2) { font-family: $font-luxury; font-size: 1.8rem; color: $white; margin: 2.5rem 0 1rem; }
  :deep(h3) { font-family: $font-luxury; font-size: 1.4rem; color: $primary-light; margin: 2rem 0 0.8rem; }
  :deep(p) { margin-bottom: 1.5rem; }
  :deep(a) { color: $primary; }
  :deep(ul), :deep(ol) { padding-left: 1.5rem; margin-bottom: 1.5rem; li { margin-bottom: 0.5rem; } }
  :deep(strong) { color: $white; font-weight: 700; }
  :deep(blockquote) { border-left: 3px solid $primary; padding-left: 1.5rem; color: rgba($white, 0.6); font-style: italic; margin: 2rem 0; }
}

.post-footer { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba($white, 0.08); }

.back-btn {
  font-family: $font-principal;
  font-size: 0.88rem;
  color: rgba($white, 0.5);
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: $primary; }
}
</style>
