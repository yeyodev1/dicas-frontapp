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
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadMore = () => {
  blogStore.loadNextPage()
}
</script>

<template>
  <div class="blog-page">
    <DHeader />

    <main>
      <section class="blog-hero">
        <div class="hero-bg-accent"></div>
        <div class="container">
          <span class="badge">NUESTRO BLOG</span>
          <h1>Explora, Aprende y <span>Evoluciona</span></h1>
          <p>Artículos estratégicos, guías y noticias exclusivas del equipo Dicas Advisor Group.</p>
        </div>
      </section>

      <section class="blog-content">
        <!-- Initial Loading -->
        <div v-if="blogStore.loading && !blogStore.posts.length" class="blog-loading">
          <div class="spinner"></div>
          <p>Cargando artículos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!blogStore.loading && blogStore.posts.length === 0" class="blog-empty">
          <div class="empty-icon">
            <i class="fa-solid fa-feather-pointed"></i>
          </div>
          <h3>Próximamente...</h3>
          <p>Nuestro equipo está preparando contenido de alto valor para ti. ¡Vuelve pronto!</p>
        </div>

        <!-- Posts Grid -->
        <div v-else class="posts-wrapper">
          <div class="posts-grid">
            <article v-for="post in blogStore.posts" :key="post._id" class="post-card">
              <router-link :to="`/blog/${post.slug}`" class="card-link">
                <div class="card-cover">
                  <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" loading="lazy" />
                  <div v-else class="cover-placeholder">
                    <i class="fa-solid fa-image"></i>
                  </div>
                  <div class="card-date-badge">
                    {{ formatDate(post.publishedAt || post.createdAt).split(' de ')[0] }}
                    <span>{{ formatDate(post.publishedAt || post.createdAt).split(' de ')[1]?.substring(0, 3).toUpperCase() }}</span>
                  </div>
                </div>
                
                <div class="card-body">
                  <div class="card-tags" v-if="post.tags?.length">
                    <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                  <h2 class="card-title">{{ post.title }}</h2>
                  <p class="card-excerpt">{{ post.excerpt }}</p>
                  
                  <div class="card-footer">
                    <div class="author-info">
                      <div class="author-avatar">{{ post.author?.name?.charAt(0) }}</div>
                      <span class="card-author">{{ post.author?.name }}</span>
                    </div>
                    <span class="read-more">Leer más <i class="fa-solid fa-arrow-right-long"></i></span>
                  </div>
                </div>
              </router-link>
            </article>
          </div>

          <!-- Pagination / Load More -->
          <div v-if="blogStore.hasMore" class="pagination-area">
            <button 
              @click="loadMore" 
              class="load-more-btn"
              :disabled="blogStore.loadingMore"
            >
              <template v-if="blogStore.loadingMore">
                <span class="mini-spinner"></span> Cargando...
              </template>
              <template v-else>
                Cargar más artículos
              </template>
            </button>
          </div>
        </div>
      </section>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.blog-page {
  background: var(--bg-color);
  min-height: 100vh;
}

.blog-hero {
  position: relative;
  padding: 12rem 2rem 6rem;
  text-align: center;
  overflow: hidden;

  .hero-bg-accent {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px;
    height: 500px;
    background: radial-gradient(circle, rgba($primary, 0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
  }

  .badge {
    display: inline-block;
    padding: 0.5rem 1.2rem;
    background: rgba($primary, 0.1);
    color: var(--accent);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    border: 1px solid rgba($primary, 0.2);
  }

  h1 {
    font-family: $font-luxury;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    color: var(--text-color);
    margin-bottom: 1.5rem;
    line-height: 1.1;

    span {
      color: var(--accent);
      background: linear-gradient(135deg, var(--accent), #f1c40f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  p {
    font-family: $font-principal;
    color: var(--text-secondary);
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.blog-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2rem 8rem;
}

.blog-loading, .blog-empty {
  text-align: center;
  padding: 6rem 2rem;
  background: var(--surface-color);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  
  .empty-icon {
    font-size: 3rem;
    color: var(--accent);
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  h3 {
    font-family: $font-luxury;
    font-size: 2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
    font-family: $font-principal;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba($primary, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.post-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: var(--accent);

    .card-cover img { transform: scale(1.05); }
    .read-more i { transform: translateX(5px); }
  }
}

.card-link { text-decoration: none; display: flex; flex-direction: column; height: 100%; }

.card-cover {
  position: relative;
  height: 240px;
  overflow: hidden;

  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    transition: transform 0.6s ease;
  }

  .cover-placeholder {
    width: 100%;
    height: 100%;
    background: var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--text-secondary);
  }

  .card-date-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: white;
    padding: 0.6rem 0.8rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 800;
    color: $primary-dark;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    line-height: 1;

    span {
      font-size: 0.65rem;
      color: var(--accent);
      margin-top: 2px;
    }
  }
}

.card-body { 
  padding: 2rem; 
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;

  .tag {
    font-family: $font-principal;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--accent);
    background: rgba($primary, 0.05);
    padding: 0.3rem 0.8rem;
    border-radius: 50px;
    border: 1px solid rgba($primary, 0.1);
  }
}

.card-title {
  font-family: $font-luxury;
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.card-excerpt {
  font-family: $font-principal;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .author-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .author-avatar {
      width: 32px;
      height: 32px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .card-author {
      font-family: $font-principal;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  .read-more {
    font-family: $font-principal;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i { transition: transform 0.3s ease; }
  }
}

.pagination-area {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
}

.load-more-btn {
  background: var(--text-color);
  color: var(--bg-color);
  border: none;
  padding: 1.2rem 3rem;
  border-radius: var(--radius-pill);
  font-family: $font-principal;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    background: var(--accent);
    color: white;
    box-shadow: 0 15px 40px rgba($primary, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.mini-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>
