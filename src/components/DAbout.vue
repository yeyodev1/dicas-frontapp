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
              <span class="stat-number">12+</span>
              <span class="stat-label">{{ t('about.stat1.label') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">NJ</span>
              <span class="stat-label">{{ t('about.stat2.label') }}</span>
            </div>
          </div>
          <button class="btn btn-primary">{{ t('about.cta') }}</button>
        </div>
        
        <div class="about-visual" ref="imageRef">
          <div class="image-wrapper">
             <div class="image-overlay"></div>
             <img 
               src="https://res.cloudinary.com/dvq6znk71/image/upload/v1776361560/dicas/ceo/dicas/ceo/WhatsApp_Image_Apr_10_2026__3_.jpg" 
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
  background-color: #080808;
  color: $white;
  overflow: hidden;

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
      color: $primary;
      font-family: $font-principal;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: 600;
      display: block;
      margin-bottom: 1.5rem;
    }

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      line-height: 1.2;
      margin-bottom: 2rem;

      .accent { color: $primary; }
    }

    .description {
      font-family: $font-principal;
      color: $text-secondary;
      line-height: 1.8;
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }

    .credentials {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;

      .cred-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba($white, 0.03);
        border-radius: 8px;
        border-left: 3px solid $primary;

        .cred-icon { font-size: 1.5rem; }
        .cred-text {
          display: flex;
          flex-direction: column;
          font-family: $font-principal;
          
          strong { color: $white; font-size: 1rem; }
          span { color: $text-secondary; font-size: 0.85rem; }
        }
      }
    }

    .stats-grid {
      display: flex;
      gap: 3rem;
      margin-bottom: 3rem;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        
        .stat-number {
          font-family: $font-luxury;
          font-size: 2.5rem;
          color: $primary;
          font-weight: 700;
        }
        
        .stat-label {
          font-family: $font-principal;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: rgba($white, 0.5);
          letter-spacing: 1px;
        }
      }
    }
  }

  .about-visual {
    position: relative;
    
    .image-wrapper {
      position: relative;
      height: 600px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    }

    .about-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba($primary-dark, 0.6), transparent);
      z-index: 2;
    }

    .accent-box {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 100px;
      height: 100px;
      border-top: 4px solid $primary;
      border-left: 4px solid $primary;
      z-index: 3;
    }
  }

  .btn-primary {
    background: $primary;
    color: $primary-dark;
    border: none;
    padding: 1.2rem 3rem;
    font-family: $font-principal;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 15px 40px rgba($primary, 0.3);
      transform: translateY(-3px);
    }
  }
}
</style>
