<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';

const titleRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);
const ctaRef = ref<HTMLElement | null>(null);
const ceoRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from(ceoRef.value, {
    x: 100,
    opacity: 0,
    duration: 1.8,
  })
  .from(titleRef.value, {
    x: -100,
    opacity: 0,
    duration: 1.5,
  }, '-=1.2')
  .from(subtitleRef.value, {
    y: 30,
    opacity: 0,
    duration: 1
  }, '-=1')
  .from(ctaRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 1
  }, '-=0.8');
});
</script>

<template>
  <section class="d-hero" id="hero">
    <div class="hero-background">
      <div class="gradient-overlay"></div>
      <div class="noise-overlay"></div>
    </div>
    
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title" ref="titleRef">
          Everything <span class="accent">in one place</span> for your life & business.
        </h1>
        <p class="hero-subtitle" ref="subtitleRef">
          Dicas Advisor Group: Your personal, family, and business partner. We offer specialized solutions in Finance, Health, Immigration, and Real Estate.
        </p>
        <div class="hero-actions" ref="ctaRef">
          <a href="https://wa.me/your-number" target="_blank" class="btn btn-primary">Connect on WhatsApp</a>
          <button class="btn btn-outline">Our Services</button>
        </div>
      </div>

      <div class="hero-visual" ref="ceoRef">
        <div class="ceo-image-wrapper">
          <img 
            src="https://res.cloudinary.com/dvq6znk71/image/upload/v1776361560/dicas/ceo/dicas/ceo/WhatsApp_Image_Apr_10_2026__2_.jpg" 
            alt="Dicas CEO" 
            class="ceo-img"
          />
          <div class="image-glow"></div>
        </div>
      </div>
    </div>
    
    <div class="hero-scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span>Scroll To Explore</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: $dicas-bg-dark;
  color: $white;
  padding: 80px 2rem 0;

  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
    gap: 4rem;
    position: relative;
    z-index: 10;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
      text-align: center;
      padding-top: 2rem;
    }
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .gradient-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 80% 20%, rgba($dicas-red, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 10% 80%, rgba($primary, 0.1) 0%, transparent 40%);
    }

    .noise-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.05;
      background-image: url('https://grainy-gradients.vercel.app/noise.svg');
    }
  }

  .hero-content {
    max-width: 800px;

    .hero-title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 6vw, 5rem);
      line-height: 1.1;
      margin-bottom: 2rem;
      font-weight: 700;

      .accent {
        color: $primary;
        display: block;
      }
    }

    .hero-subtitle {
      font-family: $font-principal;
      font-size: clamp(1.1rem, 2vw, 1.4rem);
      color: $text-secondary;
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1.5rem;

      @media (max-width: 968px) {
        justify-content: center;
      }

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
      }
    }
  }

  .hero-visual {
    position: relative;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    @media (max-width: 968px) {
      height: 50vh;
    }

    .ceo-image-wrapper {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;

      .ceo-img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
        z-index: 5;
        filter: drop-shadow(0 0 20px rgba($primary, 0.2));
      }

      .image-glow {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50%;
        background: linear-gradient(to top, $dicas-bg-dark, transparent);
        z-index: 6;
      }
    }
  }

  .btn {
    padding: 1rem 2.5rem;
    border-radius: 4px;
    font-family: $font-principal;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

    &-primary {
      background: $primary;
      color: $primary-dark;
      border: none;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba($primary, 0.4);
      }
    }

    &-outline {
      background: transparent;
      color: $white;
      border: 1px solid rgba($white, 0.3);

      &:hover {
        background: rgba($white, 0.05);
        border-color: $white;
        transform: translateY(-5px);
      }
    }
  }

  .hero-scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    opacity: 0.6;
    z-index: 10;

    span {
      font-family: $font-principal;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .mouse {
      width: 20px;
      height: 35px;
      border: 2px solid $white;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      
      .wheel {
        width: 3px;
        height: 6px;
        background: $primary;
        border-radius: 2px;
        margin-top: 6px;
        animation: scrollWheel 2s infinite;
      }
    }
  }
}

@keyframes scrollWheel {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}
</style>
