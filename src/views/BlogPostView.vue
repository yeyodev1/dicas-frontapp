<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import DHeader from '@/components/DHeader.vue'
import DFooter from '@/components/DFooter.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const blogStore = useBlogStore()
const { t } = useI18n()

onMounted(() => {
  blogStore.fetchPostBySlug(props.slug)
})

const post = computed(() => blogStore.currentPost)

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="blog-post-page">
    <DHeader />

    <main v-if="blogStore.loading && !post" class="post-loading">
      <div class="spinner"></div>
      <p>Cargando artículo...</p>
    </main>

    <main v-else-if="post" class="post-article">
      <header class="post-header">
        <div class="container">
          <router-link to="/blog" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Volver al Blog
          </router-link>
          
          <div class="header-meta">
            <div class="tags" v-if="post.tags?.length">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            
            <div class="post-info">
              <div class="author">
                <div class="avatar">{{ post.author?.name?.charAt(0) }}</div>
                <div class="details">
                  <span class="name">{{ post.author?.name }}</span>
                  <span class="date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                </div>
              </div>
              <div class="share-btns">
                <button class="share-btn"><i class="fa-brands fa-facebook-f"></i></button>
                <button class="share-btn"><i class="fa-brands fa-twitter"></i></button>
                <button class="share-btn"><i class="fa-brands fa-linkedin-in"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div class="post-cover" v-if="post.coverImage">
          <img :src="post.coverImage" :alt="post.title" />
        </div>
      </header>

      <div class="post-body container">
        <div class="post-content" v-html="post.content"></div>
        
        <footer class="post-footer">
          <div class="tags-bottom" v-if="post.tags?.length">
            <span v-for="tag in post.tags" :key="tag" class="tag-pill">#{{ tag }}</span>
          </div>
          
          <div class="author-card">
            <div class="card-avatar">{{ post.author?.name?.charAt(0) }}</div>
            <div class="card-text">
              <h4>{{ post.author?.name }}</h4>
              <p>Escrito por el equipo de expertos de Dicas Advisor Group, comprometidos con tu éxito y el de tu negocio.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>

    <main v-else-if="blogStore.error" class="post-error">
      <div class="error-content">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h2>{{ blogStore.error }}</h2>
        <p>No pudimos encontrar el artículo que buscas.</p>
        <router-link to="/blog" class="btn-primary">Explorar el Blog</router-link>
      </div>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.blog-post-page {
  background: var(--bg-color);
  min-height: 100vh;
}

.post-loading, .post-error {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba($primary, 0.1);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
    margin-bottom: 2rem;
  }

  i { font-size: 4rem; color: var(--accent); margin-bottom: 1.5rem; opacity: 0.5; }
  h2 { font-family: $font-luxury; color: var(--text-color); margin-bottom: 1rem; }
  p { color: var(--text-secondary); margin-bottom: 2rem; }
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.post-header {
  padding-top: 10rem;
  
  .back-link {
    text-decoration: none;
    color: var(--accent);
    font-family: $font-principal;
    font-weight: 700;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 3rem;
    transition: transform 0.3s ease;

    &:hover { transform: translateX(-5px); }
  }

  .header-meta {
    margin-bottom: 4rem;
  }

  .tags {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 1.5rem;

    .tag {
      background: rgba($primary, 0.05);
      color: var(--accent);
      padding: 0.4rem 1rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 1px solid rgba($primary, 0.1);
    }
  }

  .post-title {
    font-family: $font-luxury;
    font-size: clamp(2.5rem, 6vw, 4rem);
    color: var(--text-color);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .post-excerpt {
    font-family: $font-principal;
    font-size: 1.25rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 3rem;
    opacity: 0.8;
  }

  .post-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-top: 1px solid var(--border-color);

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        width: 48px;
        height: 48px;
        background: var(--accent);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1.1rem;
      }

      .details {
        display: flex;
        flex-direction: column;

        .name { font-weight: 700; color: var(--text-color); font-size: 1rem; }
        .date { font-size: 0.85rem; color: var(--text-secondary); }
      }
    }

    .share-btns {
      display: flex;
      gap: 0.8rem;

      .share-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid var(--border-color);
        background: var(--surface-color);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          transform: translateY(-3px);
        }
      }
    }
  }
}

.post-cover {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 4rem;
  height: 600px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.15);

  @media (max-width: 1200px) {
    border-radius: 0;
  }

  @media (max-width: 768px) {
    height: 400px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.post-body {
  padding-bottom: 10rem;
}

.post-content {
  font-family: $font-principal;
  font-size: 1.15rem;
  line-height: 1.9;
  color: var(--text-color);
  opacity: 0.9;

  :deep(p) { margin-bottom: 2rem; }
  :deep(h2) { 
    font-family: $font-luxury; 
    font-size: 2.2rem; 
    margin: 4rem 0 1.5rem; 
    color: var(--text-color);
  }
  :deep(h3) { 
    font-family: $font-luxury; 
    font-size: 1.8rem; 
    margin: 3rem 0 1.2rem; 
    color: var(--text-color);
  }
  :deep(ul, ol) { 
    margin-bottom: 2rem; 
    padding-left: 1.5rem;
    li { margin-bottom: 0.8rem; }
  }
  :deep(blockquote) {
    border-left: 4px solid var(--accent);
    padding: 2rem;
    background: var(--surface-color);
    margin: 3rem 0;
    font-style: italic;
    font-size: 1.4rem;
    color: var(--text-color);
    border-radius: 0 20px 20px 0;
  }
  :deep(img) {
    width: 100%;
    height: auto;
    border-radius: 20px;
    margin: 3rem 0;
  }
}

.post-footer {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid var(--border-color);

  .tags-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 4rem;

    .tag-pill {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
    }
  }

  .author-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    background: var(--surface-color);
    padding: 3rem;
    border-radius: 24px;
    border: 1px solid var(--border-color);

    @media (max-width: 600px) {
      flex-direction: column;
      text-align: center;
      padding: 2rem;
    }

    .card-avatar {
      width: 100px;
      height: 100px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 800;
      flex-shrink: 0;
    }

    .card-text {
      h4 { font-family: $font-luxury; font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--text-color); }
      p { color: var(--text-secondary); line-height: 1.6; }
    }
  }
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: white;
  text-decoration: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba($primary, 0.3);
  }
}
</style>
