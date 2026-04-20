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
              
              <!-- NUEVA SECCION: FEATURES -->
              <div class="features-grid" v-if="service.features && service.features.length > 0">
                <h3 class="subsection-title">Lo que <span class="gold">incluimos</span></h3>
                <div class="features-container">
                  <div v-for="(feat, i) in service.features" :key="i" class="feature-item">
                    <div class="check-icon">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <span>{{ feat }}</span>
                  </div>
                </div>
              </div>

              <div class="strategic-banner">
                <div class="banner-content">
                  <span class="eyebrow">Dicas Advisor Group</span>
                  <h3>Todo en un solo <span class="accent">lugar</span></h3>
                  <p>Consolida tu vida personal, negocio y familia con una asesoría integral de 360°.</p>
                </div>
              </div>

              <div class="trust-indicators">
                <div class="indicator">
                  <i class="fa-solid fa-shield-check"></i>
                  <div class="text">
                    <strong>Privacidad Total</strong>
                    <span>Tus datos están protegidos bajo protocolos de alta seguridad.</span>
                  </div>
                </div>
                <div class="indicator">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  <div class="text">
                    <strong>Respuesta Rápida</strong>
                    <span>Compromiso de contacto en menos de 24 horas hábiles.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-card-container">
              <div class="advisor-match-notice">
                <i class="fa-solid fa-user-tie"></i>
                <span>Te asignaremos al mejor especialista para este caso</span>
              </div>
              <ServiceLeadForm 
                :fields="service.specificFields" 
                :serviceTitle="service.title" 
              />
            </div>
          </div>
        </div>

        <!-- DISCLAIMERS -->
        <div class="container disclaimers-section">
          <div class="disclaimer-alert">
            <i class="fa-solid fa-circle-info"></i>
            <div class="disclaimer-content">
              <p><strong>Aviso Importante:</strong> No somos abogados ni contadores públicos certificados. Los servicios de inmigración son de asistencia administrativa. Los servicios de seguros están sujetos a elegibilidad. El registro de marca está sujeto a aprobación gubernamental. La información se basa en los datos proporcionados por el cliente.</p>
            </div>
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
    font-size: 1.15rem;
    line-height: 1.9;
    color: rgba($white, 0.7);
    margin-bottom: 4rem;
  }

  .subsection-title {
    font-family: $font-luxury;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    .gold { color: $primary; }
  }

  .features-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.2rem;
    margin-bottom: 4rem;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      background: rgba($white, 0.03);
      padding: 1.2rem 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba($white, 0.05);
      transition: all 0.3s ease;

      &:hover {
        background: rgba($primary, 0.05);
        border-color: rgba($primary, 0.2);
        transform: translateX(5px);
      }

      .check-icon {
        width: 32px;
        height: 32px;
        background: rgba($primary, 0.1);
        color: $primary;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        flex-shrink: 0;
      }

      span {
        font-size: 0.95rem;
        color: rgba($white, 0.8);
      }
    }
  }

  .strategic-banner {
    background: linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($dicas-red, 0.05) 100%);
    border: 1px solid rgba($primary, 0.2);
    border-radius: 20px;
    padding: 3rem;
    margin-bottom: 4rem;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba($primary, 0.1), transparent 70%);
      pointer-events: none;
    }

    .banner-content {
      position: relative;
      z-index: 1;

      .eyebrow {
        font-family: $font-principal;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: $primary;
        margin-bottom: 1rem;
        display: block;
      }

      h3 {
        font-family: $font-luxury;
        font-size: 2.2rem;
        margin-bottom: 1rem;
        .accent { color: $primary; }
      }

      p {
        color: rgba($white, 0.6);
        max-width: 500px;
        line-height: 1.6;
      }
    }
  }

  .trust-indicators {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba($white, 0.1);

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    .indicator {
      display: flex;
      gap: 1.5rem;

      i {
        font-size: 1.8rem;
        color: $primary;
        margin-top: 0.3rem;
      }

      .text {
        strong {
          display: block;
          font-family: $font-luxury;
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
        }
        span {
          font-size: 0.85rem;
          color: rgba($white, 0.5);
          line-height: 1.5;
        }
      }
    }
  }
}

.form-card-container {
  position: sticky;
  top: 100px;

  .advisor-match-notice {
    background: rgba($white, 0.05);
    padding: 1rem 1.5rem;
    border-radius: 12px 12px 0 0;
    border: 1px solid rgba($white, 0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.8rem;
    color: rgba($white, 0.6);

    i { color: $primary; }
  }
}

.disclaimers-section {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid rgba($white, 0.05);

  .disclaimer-alert {
    background: rgba($white, 0.02);
    border: 1px solid rgba($white, 0.05);
    padding: 2rem;
    border-radius: 15px;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;

    i {
      color: rgba($white, 0.2);
      font-size: 1.5rem;
      margin-top: 0.2rem;
    }

    .disclaimer-content {
      font-size: 0.85rem;
      color: rgba($white, 0.4);
      line-height: 1.8;

      strong { color: rgba($white, 0.6); }
    }
  }
}
</style>
