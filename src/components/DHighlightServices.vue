<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useModalStore } from '@/stores/modalStore';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const cardItems = ref<HTMLElement[]>([]);

const router = useRouter();
const modalStore = useModalStore();

const openGlobalConsultancy = () => {
  modalStore.openConsultancy(null, 'highlights');
};

const navigateToService = (id: string) => {
  router.push(`/servicios/${id}`);
};

onMounted(async () => {
  await nextTick();
  
  if (cardItems.value && cardItems.value.length > 0) {
    gsap.fromTo(cardItems.value, 
      { 
        y: 40, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom-=100px',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Refresh ScrollTrigger after all assets are loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

const coreServices = [
  {
    id: 'medicare-seguros',
    title: 'Medicare & Medicaid',
    tag: 'Salud',
    icon: 'fa-solid fa-file-medical',
    featured: true
  },
  {
    id: 'taxes-contabilidad',
    title: 'Taxes para Independientes',
    tag: 'Impuestos',
    icon: 'fa-solid fa-file-invoice-dollar',
    featured: true
  },
  {
    id: 'payroll',
    title: 'Payroll para Negocios',
    tag: 'Empresarial',
    icon: 'fa-solid fa-users-gear',
    featured: true
  },
  {
    id: 'inmigracion',
    title: 'Inmigración',
    tag: 'Legal',
    icon: 'fa-solid fa-passport',
    featured: true
  },
  {
    id: 'servicios-empresariales',
    title: 'Creación de LLC',
    tag: 'Negocios',
    icon: 'fa-solid fa-building',
    featured: true
  },
  {
    id: 'registro-marca',
    title: 'Registro de Marca',
    tag: 'Premium',
    icon: 'fa-solid fa-trademark',
    featured: true
  },
  {
    id: 'bienes-raices',
    title: 'Realtor en NJ',
    tag: 'Inmobiliaria',
    icon: 'fa-solid fa-house-chimney',
    featured: true
  }
];
</script>

<template>
  <section class="d-highlights" id="services" ref="sectionRef">
    <div class="container">
      <div class="header">
        <span class="badge">Estrategia Premium</span>
        <h2 class="title">Servicios <span class="accent">Principales</span></h2>
        <p class="desc">Impulsa tu vida y tu negocio con nuestras soluciones estrella.</p>
      </div>

      <div class="grid">
        <div 
          v-for="(s, i) in coreServices" 
          :key="i"
          class="card"
          ref="cardItems"
          :class="{ 'featured': i === 0 || i === 5 }"
          @click="navigateToService(s.id)"
        >
          <div class="content">
            <div class="icon-box">
              <i :class="s.icon"></i>
            </div>
            <span class="tag">{{ s.tag }}</span>
            <h3 class="card-title">{{ s.title }}</h3>
          </div>
          <div class="card-footer">
            <span class="more">Ver detalles</span>
            <span class="arrow">→</span>
          </div>
          <div class="glow"></div>
        </div>
      </div>

      <div class="footer-cta">
        <button @click="openGlobalConsultancy" class="btn-primary-glow">
          ¿No sabes qué servicio elegir? Obten una asesoría integral <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-highlights {
  padding: 8rem 2rem;
  background: #050505;
  color: $white;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 5rem;

    .badge {
      font-family: $font-principal;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: $primary;
      background: rgba($primary, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 1.5rem;
    }

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 1rem;

      .accent { color: $primary; }
    }

    .desc {
      font-family: $font-principal;
      color: $text-secondary;
      font-size: 1.2rem;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: #111;
    border: 1px solid rgba($white, 0.05);
    padding: 2.5rem;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &.featured {
      border-color: rgba($primary, 0.2);
      &::after {
        content: '\f06d  Popular'; // Fire icon
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        position: absolute;
        top: 20px;
        right: 20px;
        font-family: $font-principal;
        font-size: 0.6rem;
        background: $dicas-red;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        color: white;
      }
    }

    &:hover {
      background: #1a1a1a;
      border-color: rgba($primary, 0.4);
      transform: translateY(-5px);

      .icon-box { color: $primary; transform: scale(1.1); }
      .arrow { transform: translateX(5px); }
      .glow { opacity: 1; }
    }

    .icon-box {
      width: 48px;
      height: 48px;
      margin-bottom: 2rem;
      color: #666;
      font-size: 2.5rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tag {
      font-family: $font-principal;
      font-size: 0.7rem;
      text-transform: uppercase;
      color: $primary;
      letter-spacing: 1px;
      font-weight: 700;
      margin-bottom: 0.8rem;
      display: block;
    }

    .card-title {
      font-family: $font-luxury;
      font-size: 1.8rem;
      line-height: 1.2;
      margin-bottom: 2rem;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: $font-principal;
      font-size: 0.9rem;
      color: rgba($white, 0.5);

      .arrow { transition: transform 0.3s ease; }
    }

    .glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba($primary, 0.05), transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
  }

  .footer-cta {
    margin-top: 5rem;
    display: flex;
    justify-content: center;

    .btn-primary-glow {
      background: linear-gradient(135deg, $primary, $dicas-gold-dark);
      color: $primary-dark;
      border: none;
      padding: 1.5rem 3rem;
      border-radius: 50px;
      font-family: $font-principal;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 10px 40px rgba($primary, 0.2);

      i { transition: transform 0.3s ease; }

      &:hover {
        transform: scale(1.05) translateY(-5px);
        box-shadow: 0 15px 50px rgba($primary, 0.3);
        i { transform: translateX(5px); }
      }

      @media (max-width: 600px) {
        width: 100%;
        font-size: 0.95rem;
        padding: 1.2rem;
        text-align: center;
      }
    }
  }
}
</style>
