<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import gsap from 'gsap';
import { countries, type Country } from '@/data/countries';
import type { ServiceField } from '@/data/servicesData';

const props = defineProps({
  fields: {
    type: Array as () => ServiceField[],
    required: true
  },
  serviceTitle: {
    type: String,
    required: true
  }
});

const currentStep = ref(1);
const isSubmitting = ref(false);
const showSuccess = ref(false);
const hasCompany = ref(false);

// Country Selector Logic
const countrySearch = ref('');
const showCountryDropdown = ref(false);
const selectedCountry = ref<Country>((countries.find(c => c.code === 'US') as Country) || countries[0]);

const filteredCountries = computed(() => {
  if (!countrySearch.value) return countries;
  const q = countrySearch.value.toLowerCase();
  return countries.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.dial_code.includes(q) ||
    c.code.toLowerCase().includes(q)
  );
});

const selectCountry = (country: Country) => {
  selectedCountry.value = country;
  formData.countryCode = country.dial_code;
  showCountryDropdown.value = false;
  countrySearch.value = '';
};

const detectLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country_code) {
      const found = countries.find(c => c.code === data.country_code);
      if (found) selectCountry(found);
    }
  } catch (e) {
    console.warn('Geolocation detection failed, falling back to US');
  }
};

onMounted(() => {
  detectLocation();
  
  // Close dropdown when clicking outside
  window.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.country-selector-wrapper')) {
      showCountryDropdown.value = false;
    }
  });
});

const formData = reactive<Record<string, any>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+1',
  companyName: '',
});

// Initialize dynamic fields
props.fields.forEach(field => {
  formData[field.name] = '';
});

const progressWidth = computed(() => {
  return currentStep.value === 1 ? '50%' : '100%';
});

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Por favor completa los datos obligatorios.');
      return;
    }
    
    gsap.to('.step-content', {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        currentStep.value = 2;
        gsap.fromTo('.step-content', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
      }
    });
  }
};

const prevStep = () => {
  gsap.to('.step-content', {
    opacity: 0,
    x: 20,
    duration: 0.3,
    onComplete: () => {
      currentStep.value = 1;
      gsap.fromTo('.step-content', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 });
    }
  });
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  const serviceSlug = props.serviceTitle.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '');

  const fullPayload = {
    ...formData,
    country: selectedCountry.value.name,
    fullPhone: `${formData.countryCode}${formData.phone}`,
    service: props.serviceTitle,
    source: 'Dicas Website',
    tags: ['dicas_web_lead', `service_${serviceSlug}`],
    submittedAt: new Date().toISOString()
  };

  try {
    const webhookUrl = import.meta.env.VITE_CRM_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/a2wjRz4sU27JY00bUoHZ/webhook-trigger/e1d506dd-5052-404f-9af0-29676473c345';
    await axios.post(webhookUrl, fullPayload);
    
    showSuccess.value = true;
    gsap.from('.success-animation', {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  } catch (error) {
    console.error('CRM Submission Error:', error);
    alert('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="lead-form-container">
    <div class="form-card" v-if="!showSuccess">
      <div class="form-header">
        <h3 class="form-title">Consulta <span class="accent">Profesional</span></h3>
        <p class="form-subtitle">Completa los datos para coordinar tu asesoría de {{ serviceTitle }}.</p>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="form-body">
        <div class="step-content">
          <!-- STEP 1: CONTACT -->
          <div v-if="currentStep === 1" class="fields-grid">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="formData.firstName" type="text" placeholder="Tu nombre" required />
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input v-model="formData.lastName" type="text" placeholder="Tus apellidos" required />
            </div>
            <div class="form-group full-width">
              <label>Correo Electrónico</label>
              <input v-model="formData.email" type="email" placeholder="email@ejemplo.com" required />
            </div>
            
            <!-- SMART COUNTRY SELECTOR -->
            <div class="form-group full-width country-selector-wrapper">
              <label>País / Código de Marcado</label>
              <div class="custom-select" @click.stop="showCountryDropdown = !showCountryDropdown">
                <div class="selected-value">
                  <span class="flag">{{ selectedCountry.flag }}</span>
                  <span class="name">{{ selectedCountry.name }}</span>
                  <span class="dial">({{ selectedCountry.dial_code }})</span>
                  <i class="fa-solid fa-chevron-down ms-auto"></i>
                </div>
                
                <transition name="fade">
                  <div v-if="showCountryDropdown" class="dropdown-panel" @click.stop>
                    <div class="search-box">
                      <i class="fa-solid fa-magnifying-glass"></i>
                      <input 
                        v-model="countrySearch" 
                        type="text" 
                        placeholder="Buscar país o código..."
                        autofocus
                      />
                    </div>
                    <ul class="country-list">
                      <li 
                        v-for="c in filteredCountries" 
                        :key="c.code" 
                        @click="selectCountry(c)"
                        :class="{ active: c.code === selectedCountry.code }"
                      >
                        <span class="flag">{{ c.flag }}</span>
                        <span class="name">{{ c.name }}</span>
                        <span class="dial">{{ c.dial_code }}</span>
                      </li>
                      <li v-if="filteredCountries.length === 0" class="no-results">
                        No se encontraron resultados
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>Celular (con lada local si aplica)</label>
              <div class="phone-input-wrapper">
                <span class="prefix">{{ selectedCountry.dial_code }}</span>
                <input v-model="formData.phone" type="tel" placeholder="0000 0000" required />
              </div>
            </div>

            <div class="form-group full-width checkbox-group">
              <label class="checkbox-container">
                <input type="checkbox" v-model="hasCompany">
                <span class="checkmark"></span>
                Tengo una empresa / Negocio
              </label>
            </div>

            <transition name="fade-slide">
              <div v-if="hasCompany" class="form-group full-width">
                <label>Nombre de la Empresa</label>
                <input v-model="formData.companyName" type="text" placeholder="Nombre legal o comercial" />
              </div>
            </transition>
          </div>

          <!-- STEP 2: DYNAMIC FIELDS -->
          <div v-if="currentStep === 2" class="fields-grid">
            <div v-for="field in fields" :key="field.name" class="form-group" :class="{ 'full-width': field.type === 'text' }">
              <label>{{ field.label }}</label>
              
              <select v-if="field.type === 'select'" v-model="formData[field.name]" :required="field.required">
                <option value="" disabled>Selecciona una opción</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              
              <input v-else v-model="formData[field.name]" :type="field.type" :placeholder="field.placeholder" :required="field.required" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button v-if="currentStep === 2" type="button" @click="prevStep" class="btn-secondary" :disabled="isSubmitting">
            Atrás
          </button>
          
          <button v-if="currentStep === 1" type="button" @click="nextStep" class="btn-primary">
            Siguiente Paso <i class="fa-solid fa-arrow-right"></i>
          </button>
          
          <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Enviar Solicitud <i class="fa-solid fa-paper-plane"></i></span>
            <span v-else>Procesando... <i class="fa-solid fa-circle-notch fa-spin"></i></span>
          </button>
        </div>
      </form>
    </div>

    <!-- SUCCESS MESSAGE -->
    <div v-else class="success-card success-animation">
      <div class="success-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2>¡Solicitud Enviada!</h2>
      <p>Hemos recibido tus datos correctamente. Un asesor experto en <strong>{{ serviceTitle }}</strong> se pondrá en contacto contigo en breve.</p>
      <router-link to="/" class="btn-primary">Finalizar</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lead-form-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.form-card, .success-card {
  background: rgba($white, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);

  @media (max-width: 600px) {
    padding: 2.5rem 1.5rem;
  }
}

.country-selector-wrapper {
  position: relative;

  .custom-select {
    background: rgba($white, 0.05);
    border: 1px solid rgba($white, 0.1);
    border-radius: 8px;
    padding: 0.8rem 1.2rem;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:hover { border-color: $primary; }

    .selected-value {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: $font-principal;

      .flag { font-size: 1.2rem; }
      .dial { color: $primary; font-weight: 600; }
      .ms-auto { margin-left: auto; font-size: 0.8rem; opacity: 0.5; }
    }
  }

  .dropdown-panel {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    background: #1a1a1a;
    border: 1px solid rgba($white, 0.1);
    border-radius: 12px;
    z-index: 100;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    overflow: hidden;

    .search-box {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba($white, 0.05);

      i { opacity: 0.5; }
      input {
        background: transparent;
        border: none;
        color: white;
        width: 100%;
        outline: none;
        font-family: $font-principal;
      }
    }

    .country-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 250px;
      overflow-y: auto;

      li {
        padding: 0.8rem 1.2rem;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover { background: rgba($primary, 0.1); }
        &.active { background: rgba($primary, 0.2); border-left: 3px solid $primary; }

        .flag { font-size: 1.2rem; }
        .name { flex: 1; font-size: 0.9rem; }
        .dial { color: $primary; font-size: 0.8rem; font-weight: bold; }
      }

      .no-results {
        padding: 2rem;
        text-align: center;
        opacity: 0.5;
        font-size: 0.9rem;
      }
    }
  }
}

.phone-input-wrapper {
  display: flex;
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within { border-color: $primary; }

  .prefix {
    padding: 0.8rem 1.2rem;
    background: rgba($white, 0.05);
    color: $primary;
    font-weight: 700;
    font-family: $font-principal;
    border-right: 1px solid rgba($white, 0.1);
    display: flex;
    align-items: center;
  }

  input {
    background: transparent;
    border: none;
    flex: 1;
    padding: 0.8rem 1.2rem;
    color: white;
    outline: none;
  }
}

.checkbox-group {
  margin-top: 0.5rem;
  
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: rgba($white, 0.8);
    user-select: none;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      height: 20px;
      width: 20px;
      background-color: rgba($white, 0.1);
      border: 1px solid rgba($white, 0.2);
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;

      &::after {
        content: "";
        position: absolute;
        display: none;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid $primary-dark;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }

    &:hover .checkmark {
      border-color: $primary;
    }

    input:checked ~ .checkmark {
      background-color: $primary;
      border-color: $primary;
      &::after { display: block; }
    }
  }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.full-width {
  grid-column: span 2;
  @media (max-width: 500px) { grid-column: span 1; }
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;

  .form-title {
    font-family: $font-luxury;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    .accent { color: $primary; }
  }

  .form-subtitle {
    font-family: $font-principal;
    font-size: 0.95rem;
    color: $text-secondary;
    margin-bottom: 2rem;
  }

  .progress-bar {
    height: 4px;
    background: rgba($white, 0.05);
    border-radius: 10px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $primary, $dicas-red);
      transition: width 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  }
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  label {
    font-family: $font-principal;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba($white, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  input, select {
    background: rgba($white, 0.05);
    border: 1px solid rgba($white, 0.1);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: white;
    font-family: $font-principal;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary;
      background: rgba($white, 0.08);
      box-shadow: 0 0 15px rgba($primary, 0.1);
    }

    &::placeholder {
      color: rgba($white, 0.2);
    }
  }

  select {
    cursor: pointer;
    option {
      background: #111;
      color: white;
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;

  button {
    flex: 1;
    padding: 1.2rem;
    border-radius: 12px;
    font-family: $font-principal;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-primary {
    background: linear-gradient(135deg, $primary, $dicas-gold-dark);
    color: $primary-dark;
    border: none;

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba($primary, 0.3);
    }
  }

  .btn-secondary {
    background: transparent;
    border: 1px solid rgba($white, 0.2);
    color: white;

    &:hover:not(:disabled) {
      background: rgba($white, 0.05);
      border-color: $white;
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.success-card {
  text-align: center;

  .success-icon {
    font-size: 5rem;
    color: $alert-success;
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 20px rgba($alert-success, 0.3));
  }

  h2 {
    font-family: $font-luxury;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-family: $font-principal;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: 3rem;
  }

  .btn-primary {
    max-width: 250px;
    margin: 0 auto;
    text-decoration: none;
  }
}

.ms-auto { margin-left: auto; }

</style>
