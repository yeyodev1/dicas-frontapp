<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { servicesData } from '@/data/servicesData';
import DHeader from '@/components/DHeader.vue';
import DFooter from '@/components/DFooter.vue';
import ServiceLeadForm from '@/components/ServiceLeadForm.vue';
import gsap from 'gsap';

const route = useRoute();
const router = useRouter();

const service = computed(() => {
  return servicesData.find(s => s.id === route.params.id);
});

onMounted(() => {
  if (!service.value) {
    router.push('/');
    return;
  }

  // Entrance animations
  gsap.from('.service-hero-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.form-section', {
    x: 100,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });
});
</script>

<template>
  <div class="service-detail-page" v-if="service">
    <DHeader />
    
    <main>
      <!-- HERO SECTION -->
      <section class="service-hero">
        <div class="hero-overlay"></div>
        <div class="container">
          <div class="service-hero-content">
            <div class="category-badge">{{ service.category }}</div>
            <h1 class="service-title">
              <i :class="service.icon"></i>
              {{ service.title }}
            </h1>
            <p class="service-tagline">{{ service.shortDesc }}</p>
          </div>
        </div>
      </section>

      <!-- CONTENT SECTION -->
      <section class="service-main">
        <div class="container grid-layout">
          <div class="info-section">
            <div class="content-block">
              <h2 class="section-title">Sobre el <span class="accent">Servicio</span></h2>
              <p class="long-desc">{{ service.longDesc }}</p>
              
              <div class="benefits-list">
                <h3>¿Por qué elegirnos?</h3>
                <ul>
                  <li><i class="fa-solid fa-check"></i> Asesoría personalizada 1-a-1.</li>
                  <li><i class="fa-solid fa-check"></i> Expertos certificados en New Jersey.</li>
                  <li><i class="fa-solid fa-check"></i> Preparación para integración con CRM.</li>
                  <li><i class="fa-solid fa-check"></i> Soporte bilingüe completo.</li>
                </ul>
              </div>

              <div class="trust-badges">
                <div class="badge">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Privacidad Total</span>
                </div>
                <div class="badge">
                  <i class="fa-solid fa-bolt"></i>
                  <span>Procesos Agiles</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <ServiceLeadForm 
              :fields="service.specificFields" 
              :serviceTitle="service.title" 
            />
          </div>
        </div>
      </section>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.service-detail-page {
  background: #050505;
  color: $white;
  min-height: 100vh;
}

.service-hero {
  position: relative;
  padding: 12rem 2rem 8rem;
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1454165833767-027eeef1596e?auto=format&fit=crop&q=80&w=2000');
  background-size: cover;
  background-position: center;
  text-align: center;

  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(to top, #050505, transparent);
  }

  .container {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
  }

  .category-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: rgba($primary, 0.1);
    border: 1px solid $primary;
    color: $primary;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 2rem;
  }

  .service-title {
    font-family: $font-luxury;
    font-size: clamp(3rem, 8vw, 5rem);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    i {
      font-size: 0.7em;
      color: $primary;
    }
  }

  .service-tagline {
    font-size: 1.2rem;
    color: rgba($white, 0.7);
    max-width: 700px;
    margin: 0 auto;
  }
}

.service-main {
  padding: 4rem 2rem 10rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .grid-layout {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 5rem;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 4rem;
    }
  }
}

.info-section {
  .section-title {
    font-family: $font-luxury;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    .accent { color: $primary; }
  }

  .long-desc {
    font-size: 1.1rem;
    line-height: 1.8;
    color: $text-secondary;
    margin-bottom: 3rem;
  }

  .benefits-list {
    background: rgba($white, 0.02);
    border: 1px solid rgba($white, 0.05);
    padding: 2.5rem;
    border-radius: 15px;
    margin-bottom: 3rem;

    h3 {
      font-family: $font-luxury;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    ul {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 1.2rem;

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: $text-secondary;

        i {
          color: $primary;
          font-size: 0.9rem;
        }
      }
    }
  }

  .trust-badges {
    display: flex;
    gap: 2rem;

    .badge {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: rgba($white, 0.4);
      font-size: 0.85rem;
      font-weight: 500;

      i {
        color: $primary;
        font-size: 1.2rem;
      }
    }
  }
}
</style>
