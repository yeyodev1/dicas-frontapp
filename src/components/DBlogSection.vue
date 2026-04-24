<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

onMounted(() => {
  blogStore.fetchPosts()
})

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es', { month: 'short', day: 'numeric', year: 'numeric' })
}

function truncate(text: string, max = 120) {
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>

<template>
  <section v-if="!blogStore.loading && blogStore.posts.length > 0" id="blog" class="blog-section">
    <div class="blog-container">
      <div class="section-header">
        <span class="section-eyebrow">Nuestro Blog</span>
        <h2 class="section-title">Últimas Publicaciones</h2>
        <p class="section-subtitle">Artículos, guías y noticias para tu bienestar financiero y legal</p>
      </div>

      <div class="posts-grid">
        <article v-for="post in blogStore.posts.slice(0, 3)" :key="post._id" class="post-card">
          <router-link :to="`/blog/${post.slug}`" class="card-inner">
            <div class="card-cover">
              <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" />
              <div v-else class="cover-gradient"></div>
            </div>
            <div class="card-body">
              <div class="card-tags" v-if="post.tags?.length">
                <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-excerpt">{{ truncate(post.excerpt) }}</p>
              <div class="card-footer">
                <span class="card-author">{{ post.author?.name }}</span>
                <span class="card-date">{{ formatDate(post.publishedAt) }}</span>
              </div>
            </div>
          </router-link>
        </article>
      </div>

      <div class="blog-cta">
        <router-link to="/blog" class="cta-link">Ver todos los artículos →</router-link>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.blog-section {
  padding: 7rem 2rem;
  background: linear-gradient(180deg, #050505 0%, rgba($primary, 0.03) 50%, #050505 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba($primary, 0.2), transparent);
  }
}

.blog-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-eyebrow {
  display: inline-block;
  font-family: $font-principal;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: $primary;
  margin-bottom: 1rem;
}

.section-title {
  font-family: $font-luxury;
  font-size: clamp(2rem, 4vw, 3rem);
  color: $white;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-family: $font-principal;
  font-size: 1rem;
  color: rgba($white, 0.45);
  max-width: 500px;
  margin: 0 auto;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.8rem;
  margin-bottom: 3.5rem;
}

.post-card {
  background: rgba($white, 0.02);
  border: 1px solid rgba($primary, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba($primary, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
}

.card-inner { text-decoration: none; display: block; }

.card-cover {
  height: 190px;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  &:hover img { transform: scale(1.04); }
}

.cover-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba($primary, 0.12) 0%, rgba($secondary, 0.12) 100%);
}

.card-body { padding: 1.5rem; }

.card-tags {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}

.tag {
  font-family: $font-principal;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $primary;
  background: rgba($primary, 0.08);
  padding: 0.15rem 0.55rem;
  border-radius: 50px;
  border: 1px solid rgba($primary, 0.15);
}

.card-title {
  font-family: $font-luxury;
  font-size: 1.2rem;
  color: $white;
  line-height: 1.4;
  margin-bottom: 0.8rem;
}

.card-excerpt {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: rgba($white, 0.5);
  line-height: 1.7;
  margin-bottom: 1.2rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-family: $font-principal;
  font-size: 0.75rem;
  color: rgba($white, 0.3);
}

.blog-cta {
  text-align: center;
}

.cta-link {
  font-family: $font-principal;
  font-size: 0.9rem;
  font-weight: 600;
  color: $primary;
  text-decoration: none;
  border: 1px solid rgba($primary, 0.3);
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba($primary, 0.1);
    border-color: $primary;
    box-shadow: 0 8px 25px rgba($primary, 0.2);
  }
}
</style>
