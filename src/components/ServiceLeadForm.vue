<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import gsap from 'gsap';
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

const formData = reactive<Record<string, any>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
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
      alert('Por favor completa los datos de contacto.');
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
  
  // Simulation of CRM submission
  console.log('--- ENVIANDO DATOS AL CRM ---');
  console.log('Servicio:', props.serviceTitle);
  console.log('Payload:', JSON.stringify(formData, null, 2));
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  isSubmitting.value = false;
  showSuccess.value = true;
  
  gsap.from('.success-animation', {
    scale: 0.5,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  });
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
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input v-model="formData.email" type="email" placeholder="email@ejemplo.com" required />
            </div>
            <div class="form-group">
              <label>Celular</label>
              <input v-model="formData.phone" type="tel" placeholder="+1 (000) 000-0000" required />
            </div>
          </div>

          <!-- STEP 2: DYNAMIC FIELDS -->
          <div v-if="currentStep === 2" class="fields-grid">
            <div v-for="field in fields" :key="field.name" class="form-group">
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
            Continuar <i class="fa-solid fa-arrow-right"></i>
          </button>
          
          <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Enviar Solicitud <i class="fa-solid fa-paper-plane"></i></span>
            <span v-else>Enviando... <i class="fa-solid fa-circle-notch fa-spin"></i></span>
          </button>
        </div>
      </form>
    </div>

    <!-- SUCCESS MESSAGE -->
    <div v-else class="success-card success-animation">
      <div class="success-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2>¡Solicitud Recibida!</h2>
      <p>Gracias <strong>{{ formData.firstName }}</strong>, un experto de Dicas Advisor Group te contactará pronto para tu asesoría de <strong>{{ serviceTitle }}</strong>.</p>
      <router-link to="/" class="btn-primary">Volver al Inicio</router-link>
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
  backdrop-filter: blur(10px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);

  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
  }
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
    color: $text-secondary;
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba($white, 0.1);
    border-radius: 2px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $primary, $dicas-red);
      transition: width 0.4s ease;
    }
  }
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.85rem;
    color: rgba($white, 0.7);
    font-weight: 500;
  }

  input, select {
    background: rgba($white, 0.05);
    border: 1px solid rgba($white, 0.1);
    border-radius: 8px;
    padding: 0.8rem 1rem;
    color: $white;
    font-family: $font-principal;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary;
      background: rgba($white, 0.08);
      box-shadow: 0 0 10px rgba($primary, 0.2);
    }

    &::placeholder {
      color: rgba($white, 0.3);
    }
  }

  select option {
    background: #111;
    color: $white;
  }
}

.form-actions {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  button {
    flex: 1;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  .btn-primary {
    background: $primary;
    color: $primary-dark;
    border: none;

    &:hover:not(:disabled) {
      background: $white;
      transform: translateY(-2px);
    }
  }

  .btn-secondary {
    background: transparent;
    color: $white;
    border: 1px solid rgba($white, 0.2);

    &:hover {
      background: rgba($white, 0.05);
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
    font-size: 4rem;
    color: #4CAF50;
    margin-bottom: 2rem;
  }

  h2 {
    font-family: $font-luxury;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    
    strong { color: $white; }
  }

  .btn-primary {
    width: auto;
    display: inline-flex;
    padding: 1rem 3rem;
    text-decoration: none;
    border-radius: 8px;
    background: $primary;
    color: $primary-dark;
    font-weight: 600;
  }
}
</style>
