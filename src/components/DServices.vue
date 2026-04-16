<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesRef = ref<HTMLElement | null>(null);
const cardsRef = ref<HTMLElement[]>([]);

const setCardRef = (el: any) => {
  if (el) cardsRef.value.push(el);
};

onMounted(() => {
  gsap.from(cardsRef.value, {
    scrollTrigger: {
      trigger: servicesRef.value,
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });
});

const services = [
  {
    title: 'Financial Advisory',
    description: 'Bespoke wealth management and financial planning tailored to your unique objectives.',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
  },
  {
    title: 'Strategic Consulting',
    description: 'Transformative business strategies to drive growth, efficiency, and long-term sustainability.',
    icon: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4 0v2m0 4v12m-4-8h8'
  },
  {
    title: 'Risk Management',
    description: 'Comprehensive risk assessment and mitigation strategies to protect your assets and reputation.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    title: 'Asset Protection',
    description: 'Ensuring your legacy is preserved through proactive legal and financial safeguarding.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  }
];
</script>

<template>
  <section class="d-services" id="services" ref="servicesRef">
    <div class="container">
      <div class="section-header">
        <span class="subtitle">What we offer</span>
        <h2 class="title">Our Expertise</h2>
        <div class="divider"></div>
      </div>

      <div class="services-grid">
        <div 
          v-for="(service, index) in services" 
          :key="index" 
          class="service-card"
          :ref="setCardRef"
        >
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path :d="service.icon" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">{{ service.title }}</h3>
          <p class="card-description">{{ service.description }}</p>
          <a href="#" class="card-link">Learn More <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-services {
  padding: 10rem 2rem;
  background-color: $dicas-bg-dark;
  color: $white;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 5rem;

    .subtitle {
      font-family: $font-principal;
      color: $primary;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-size: 0.8rem;
      font-weight: 600;
      display: block;
      margin-bottom: 1rem;
    }

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: 1.5rem;
    }

    .divider {
      width: 60px;
      height: 3px;
      background: $primary;
      margin: 0 auto;
    }
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .service-card {
    background: rgba($white, 0.03);
    border: 1px solid rgba($white, 0.08);
    padding: 3rem 2rem;
    border-radius: 8px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, $primary, transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    &:hover {
      background: rgba($white, 0.06);
      border-color: rgba($primary, 0.3);
      transform: translateY(-10px);

      &::before {
        transform: translateX(100%);
      }

      .card-icon {
        color: $primary;
        transform: scale(1.1);
      }

      .card-link .arrow {
        transform: translateX(5px);
      }
    }

    .card-icon {
      width: 50px;
      height: 50px;
      color: rgba($white, 0.8);
      margin-bottom: 2rem;
      transition: all 0.3s ease;

      svg { width: 100%; height: 100%; }
    }

    .card-title {
      font-family: $font-luxury;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .card-description {
      font-family: $font-principal;
      color: $text-secondary;
      line-height: 1.6;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .card-link {
      text-decoration: none;
      color: $primary;
      font-family: $font-principal;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .arrow {
        transition: transform 0.3s ease;
      }
    }
  }
}
</style>
