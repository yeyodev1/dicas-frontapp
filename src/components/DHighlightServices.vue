<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const cardsRef = ref<HTMLElement[]>([]);

const setCardRef = (el: any) => {
  if (el) cardsRef.value.push(el);
};

onMounted(() => {
  gsap.from(cardsRef.value, {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });
});

const coreServices = [
  {
    title: 'Medicare & Medicaid',
    tag: 'Salud',
    icon: 'fa-solid fa-file-medical',
    featured: true
  },
  {
    title: 'Taxes para Independientes',
    tag: 'Impuestos',
    icon: 'fa-solid fa-file-invoice-dollar',
    featured: true
  },
  {
    title: 'Payroll para Negocios',
    tag: 'Empresarial',
    icon: 'fa-solid fa-users-gear',
    featured: true
  },
  {
    title: 'Inmigración',
    tag: 'Legal',
    icon: 'fa-solid fa-passport',
    featured: true
  },
  {
    title: 'Creación de LLC',
    tag: 'Negocios',
    icon: 'fa-solid fa-building',
    featured: true
  },
  {
    title: 'Registro de Marca',
    tag: 'Premium',
    icon: 'fa-solid fa-trademark',
    featured: true
  },
  {
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
          :ref="setCardRef"
          :class="{ 'featured': i === 0 || i === 5 }"
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
}
</style>
