<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';

const activeCategory = ref<number | null>(null);

const toggleCategory = (index: number) => {
  activeCategory.value = activeCategory.value === index ? null : index;
};

// Animation Hooks
const beforeEnter = (el: any) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el: any, done: any) => {
  gsap.to(el, {
    height: 'auto',
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    onComplete: done
  });
};

const leave = (el: any, done: any) => {
  gsap.to(el, {
    height: '0',
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  });
};

const serviceCategories = [
  {
    title: 'Taxes & Contabilidad',
    items: [
      'Preparación de impuestos personales (1040)',
      'Taxes para independientes (1099 / Schedule C)',
      'Enmiendas de impuestos (1040X)',
      'Aplicación y renovación de ITIN',
      'Planificación tributaria',
      'Bookkeeping (contabilidad mensual)',
      'Reportes de ingresos y gastos',
      'Asistencia con cartas del IRS'
    ]
  },
  {
    title: 'Payroll (NUEVO <i class="fa-solid fa-briefcase"></i>)',
    items: [
      'Procesamiento de nómina para pequeños negocios',
      'Cálculo de salarios y retenciones',
      'Preparación de formularios (W-2, 1099)',
      'Reportes de payroll',
      'Asesoría básica de cumplimiento'
    ]
  },
  {
    title: 'Seguros & Beneficios de Salud',
    items: [
      'Inscripción en GetCoveredNJ',
      'Ayuda para aplicar a Medicare',
      'Seguro de salud (Marketplace)',
      'Seguro dental, visión y audición',
      'Seguro de accidentes y cáncer',
      'Asistencia con Medicare (ESPECIALIDAD PRINCIPAL)',
      'Evaluación de elegibilidad',
      'Asistencia con Medicaid',
      'Renovaciones y cambios de plan'
    ]
  },
  {
    title: 'Servicios de Inmigración (Non-Attorney)',
    items: [
      'Peticiones familiares (I-130)',
      'Ajuste de estatus (I-485)',
      'Permiso de trabajo (I-765)',
      'Affidavit of Support (I-864 / I-864A)',
      'Ciudadanía (N-400)',
      'Procesos consulares (NVC / DS-260)',
      'Solicitudes FOIA',
      'Preparación de paquetes para USCIS'
    ]
  },
  {
    title: 'Notaría y Documentos',
    items: [
      'Notarización de documentos',
      'Poderes (Power of Attorney)',
      'Traducciones (Español ↔ Inglés)',
      'Apostillas'
    ]
  },
  {
    title: 'Servicios Empresariales',
    items: [
      'Consultoría inicial',
      'Creación de LLC',
      'Registro de negocio',
      'Obtención de EIN',
      'Estructura de negocio'
    ]
  },
  {
    title: 'Registro de Marca (Trademark) <i class="fa-solid fa-brain"></i>',
    items: [
      'Búsqueda de disponibilidad de nombre',
      'Registro de marca en USPTO',
      'Preparación de solicitud',
      'Seguimiento del proceso',
      'Orientación para protección de marca'
    ]
  },
  {
    title: 'Crédito y Finanzas Personales',
    items: [
      'Educación de crédito',
      'Asesoría para mejorar crédito',
      'Preparación para compra de vivienda'
    ]
  },
  {
    title: 'Bienes Raíces (Real Estate)',
    items: [
      'Compra de vivienda en New Jersey',
      'Asesoría para primeros compradores',
      'Evaluación de elegibilidad financiera',
      'Orientación durante todo el proceso',
      'Realtor licenciada en NJ'
    ]
  },
  {
    title: 'Servicios Médicos Administrativos',
    items: [
      'Asistencia con facturación médica',
      'Revisión de facturas médicas',
      'Orientación en seguros médicos',
      'Certificada en Medical Billing and Coding'
    ]
  },
  {
    title: 'Ministro de Bodas <i class="fa-solid fa-ring"></i>',
    items: [
      'Oficiante de bodas civiles',
      'Ceremonias personalizadas',
      'Firma de documentos matrimoniales'
    ]
  },
  {
    title: 'Multiservicios Generales',
    items: [
      'Llenado de formularios',
      'Cartas formales (escuela, corte, inmigración)',
      'Aplicaciones gubernamentales',
      'Asistencia general administrativa'
    ]
  }
];
</script>

<template>
  <section class="d-catalog" id="full-catalog">
    <div class="container">
      <div class="header">
        <h2 class="title">Catálogo <span class="accent">Completo</span></h2>
        <p class="desc">Todo lo que necesitas en un solo lugar.</p>
      </div>

      <div class="catalog-grid">
        <div 
          v-for="(cat, index) in serviceCategories" 
          :key="index"
          class="category-item"
          :class="{ 'is-active': activeCategory === index }"
        >
          <div class="category-header" @click="toggleCategory(index)">
            <h3 class="category-title" v-html="cat.title"></h3>
            <span class="icon" :class="{ 'is-rotated': activeCategory === index }">+</span>
          </div>
          
          <transition 
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
            :css="false"
          >
            <div class="category-content" v-if="activeCategory === index">
              <ul class="service-list">
                <li v-for="(item, i) in cat.items" :key="i">{{ item }}</li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-catalog {
  padding: 8rem 2rem;
  background-color: #050505;
  color: $white;

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 4rem;

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: 1rem;
      .accent { color: $primary; }
    }

    .desc {
      font-family: $font-principal;
      color: $text-secondary;
      font-size: 1.1rem;
    }
  }

  .catalog-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-item {
    background: rgba($white, 0.02);
    border: 1px solid rgba($white, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;

    &.is-active {
      background: rgba($white, 0.04);
      border-color: rgba($primary, 0.3);
    }

    .category-header {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;

      .category-title {
        font-family: $font-luxury;
        font-size: 1.25rem;
        margin: 0;
      }

      .icon {
        color: $primary;
        font-size: 1.5rem;
        font-weight: bold;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        
        &.is-rotated {
          transform: rotate(45deg);
          color: $dicas-red;
        }
      }
    }

    .category-content {
      padding: 0 2rem 2rem;
      overflow: hidden;
      
      .service-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.8rem;

        li {
          font-family: $font-principal;
          color: $text-secondary;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;

          &::before {
            content: '→';
            color: $primary;
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}
</style>
