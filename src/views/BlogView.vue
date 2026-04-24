<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import DHeader from '@/components/DHeader.vue'
import DFooter from '@/components/DFooter.vue'

const blogStore = useBlogStore()

onMounted(() => {
  blogStore.fetchPosts()
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="blog-page">
    <DHeader />

    <main>
      <section class="blog-hero">
        <h1>Blog</h1>
        <p>Artículos, guías y noticias del equipo Dicas Advisor</p>
      </section>

      <section class="blog-content">
        <div v-if="blogStore.loading" class="blog-loading">
          <div class="spinner"></div>
          <p>Cargando artículos...</p>
        </div>

        <div v-else-if="blogStore.posts.length === 0" class="blog-empty">
          <p>Próximamente... el blog está en preparación.</p>
        </div>

        <div v-else class="posts-grid">
          <article v-for="post in blogStore.posts" :key="post._id" class="post-card">
            <router-link :to="`/blog/${post.slug}`" class="card-link">
              <div class="card-cover">
                <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" />
                <div v-else class="cover-placeholder"></div>
              </div>
              <div class="card-body">
                <div class="card-tags" v-if="post.tags?.length">
                  <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <h2 class="card-title">{{ post.title }}</h2>
                <p class="card-excerpt">{{ post.excerpt }}</p>
                <div class="card-meta">
                  <span class="card-author">{{ post.author?.name }}</span>
                  <span class="card-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                </div>
                <span class="read-more">Leer artículo →</span>
              </div>
            </router-link>
          </article>
        </div>
      </section>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.blog-page {
  background: $primary-dark;
  min-height: 100vh;
}

.blog-hero {
  padding: 10rem 2rem 5rem;
  text-align: center;
  background-image: radial-gradient(ellipse at 50% 0%, rgba($primary, 0.1) 0%, transparent 60%);

  h1 {
    font-family: $font-luxury;
    font-size: clamp(3rem, 7vw, 5rem);
    color: $white;
    margin-bottom: 1rem;
  }

  p {
    font-family: $font-principal;
    color: rgba($white, 0.5);
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
}

.blog-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
}

.blog-loading, .blog-empty {
  text-align: center;
  padding: 4rem;
  font-family: $font-principal;
  color: rgba($white, 0.4);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba($primary, 0.2);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.post-card {
  background: rgba($white, 0.03);
  border: 1px solid rgba($primary, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba($primary, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
}

.card-link { text-decoration: none; display: block; }

.card-cover {
  height: 200px;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba($primary, 0.15), rgba($secondary, 0.15));
}

.card-body { padding: 1.5rem; }

.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
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

.card-title {
  font-family: $font-luxury;
  font-size: 1.3rem;
  color: $white;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.card-excerpt {
  font-family: $font-principal;
  font-size: 0.88rem;
  color: rgba($white, 0.55);
  line-height: 1.7;
  margin-bottom: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-family: $font-principal;
  font-size: 0.78rem;
  color: rgba($white, 0.35);
  margin-bottom: 1rem;
}

.read-more {
  font-family: $font-principal;
  font-size: 0.82rem;
  font-weight: 600;
  color: $primary;
  letter-spacing: 0.5px;
}
</style>
