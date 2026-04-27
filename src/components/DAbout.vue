<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from 'vue-i18n';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);

const { t } = useI18n();

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
    }
  });

  tl.from(contentRef.value, {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from(imageRef.value, {
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.8');
});
</script>

<template>
  <section class="d-about" id="about" ref="sectionRef">
    <div class="container">
      <div class="about-grid">
        <div class="about-content" ref="contentRef">
          <span class="subtitle">{{ t('about.subtitle') }}</span>
          <h2 class="title">{{ t('about.title') }} <span class="accent">{{ t('about.accent') }}</span>.</h2>
          <p class="description">
            {{ t('about.description') }}
          </p>
          
          <div class="credentials">
            <div class="cred-item">
              <div class="cred-icon"><i class="fa-solid fa-file-signature"></i></div>
              <div class="cred-text">
                <strong>{{ t('about.cred1.title') }}</strong>
                <span>{{ t('about.cred1.text') }}</span>
              </div>
            </div>
            <div class="cred-item">
              <div class="cred-icon"><i class="fa-solid fa-user-doctor"></i></div>
              <div class="cred-text">
                <strong>{{ t('about.cred2.title') }}</strong>
                <span>{{ t('about.cred2.text') }}</span>
              </div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ t('about.stat1.number') }}</span>
              <span class="stat-label">{{ t('about.stat1.label') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ t('about.stat2.number') }}</span>
              <span class="stat-label">{{ t('about.stat2.label') }}</span>
            </div>
          </div>
          <button class="btn btn-primary">{{ t('about.cta') }}</button>
        </div>
        
        <div class="about-visual" ref="imageRef">
          <div class="image-wrapper">
             <div class="image-overlay"></div>
             <img 
               src="@/assets/images/diana-2.jpeg" 
               alt="Dicas Leadership" 
               class="about-img"
             />
             <div class="accent-box"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-about {
  padding: 10rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 5rem;
    align-items: center;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
      gap: 3.5rem;
    }
  }

  .about-content {
    .subtitle {
      color: var(--accent);
      font-family: $font-principal;
      font-size: 0.9rem;
      font-weight: 700;
      display: block;
      margin-bottom: 1.5rem;
    }

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 4vw, 4rem);
      line-height: 1.1;
      margin-bottom: 2.5rem;
      font-weight: 800;

      .accent { color: var(--accent); }
    }

    .description {
      font-family: $font-principal;
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1.1rem;
      margin-bottom: 3.5rem;
      max-width: 600px;
    }

    .credentials {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-bottom: 3.5rem;

      .cred-item {
        display: flex;
        align-items: flex-start;
        gap: 1.2rem;
        padding: 1.8rem;
        background: var(--surface-color);
        border-radius: 24px;
        border: 2px solid var(--border-color);
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--accent);
          background: var(--surface-card);
          transform: translateX(10px);
        }

        .cred-icon { font-size: 1.8rem; color: var(--accent); }
        .cred-text {
          display: flex;
          flex-direction: column;
          font-family: $font-principal;
          
          strong { color: var(--text-color); font-size: 1.1rem; margin-bottom: 4px; }
          span { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }
        }
      }
    }

    .stats-grid {
      display: flex;
      gap: 4rem;
      margin-bottom: 3.5rem;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        
        .stat-number {
          font-family: $font-luxury;
          font-size: 3rem;
          color: var(--accent);
          font-weight: 800;
        }
        
        .stat-label {
          font-family: $font-principal;
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
      }
    }
  }

  .about-visual {
    position: relative;
    
    .image-wrapper {
      position: relative;
      height: 650px;
      border-radius: 40px;
      overflow: hidden;
      box-shadow: var(--shadow-soft);

      [data-theme='dark'] & {
        box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      }
    }

    .about-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      transition: transform 0.6s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
      z-index: 2;
    }
  }

  .btn-primary {
    background: var(--accent);
    color: #FFFFFF;
    border: none;
    padding: 1.3rem 3.5rem;
    font-family: $font-principal;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: var(--radius-pill);
    box-shadow: 0 10px 25px rgba($primary, 0.2);

    &:hover {
      box-shadow: 0 15px 35px rgba($primary, 0.4);
      transform: translateY(-5px);
    }
  }
}
</style>
