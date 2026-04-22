<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
import { countries, type Country } from '@/data/countries';
import type { ServiceField } from '@/data/servicesData';
import { useRoute } from 'vue-router';
import { useLeadStore } from '@/stores/leadStore';
import DSelect from './DSelect.vue';
import DDatePicker from './DDatePicker.vue';

const props = defineProps({
  fields: {
    type: Array as () => ServiceField[],
    default: () => []
  },
  serviceTitle: {
    type: String,
    default: ''
  },
  isGlobal: {
    type: Boolean,
    default: false
  }
});

import { servicesData } from '@/data/servicesData';

const { t, locale } = useI18n();
const currentStep = ref(1);
const isSubmitting = ref(false);
const showSuccess = ref(false);
const hasSentContact = ref(false); // Safety flag to prevent double contact leads

const route = useRoute();
const leadStore = useLeadStore();

const formData = reactive<Record<string, any>>({
  // Step 1: Contact
  firstName: leadStore.firstName,
  lastName: leadStore.lastName,
  email: leadStore.email,
  phone: leadStore.phone,
  countryCode: leadStore.selectedCountryCode === 'US' ? '+1' : '+1', // Simplified for now
  zipCode: leadStore.zipCode,
  companyName: leadStore.companyName,
  
  // Step 2: Service Selection (Global only)
  selectedServiceId: '',
  qConsultationPurpose: '',
  
  // Step 1 extra state
  hasCompany: leadStore.hasCompany,
  
  // Step 3: Qualification (The "Big 5")
  qBilling: '', // > $5.5k
  qStatus: '',  // SSN, ITIN, etc
  qPurpose: '', // Personal vs Business
  qLocation: '', // NJ focus
  qUrgency: '',  // Timeframe
});


// Sync with store
watch(formData, (newVal) => {
  leadStore.firstName = newVal.firstName;
  leadStore.lastName = newVal.lastName;
  leadStore.email = newVal.email;
  leadStore.phone = newVal.phone;
  leadStore.birthDate = newVal.birthDate;
  leadStore.zipCode = newVal.zipCode;
  leadStore.companyName = newVal.companyName;
  leadStore.hasCompany = newVal.hasCompany;
  leadStore.saveToStorage();
}, { deep: true });

const consultationOptions = computed(() => [
  t('services.taxes.title'),
  t('services.llc.title'),
  t('services.llc.tag'),
  t('services.immigration.title'),
  t('services.medicare.title'),
  t('common.other')
]);

const statusOptions = computed(() => [
  { label: t('form.options.resident'), value: 'Ciudadano/Residente' },
  { label: t('form.options.ssn'), value: 'SSN' },
  { label: t('form.options.itin'), value: 'ITIN' },
  { label: t('form.options.inProcess'), value: 'En Proceso' },
  { label: t('form.options.none'), value: 'Ninguno' }
]);

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
  leadStore.loadFromStorage();
  
  // Sync formData with restored store values
  formData.firstName = leadStore.firstName;
  formData.lastName = leadStore.lastName;
  formData.email = leadStore.email;
  formData.phone = leadStore.phone;
  formData.zipCode = leadStore.zipCode;
  formData.companyName = leadStore.companyName;
  formData.hasCompany = leadStore.hasCompany;

  detectLocation();

  // Contextual Auto-selection - CRITICAL: use correct mapping
  const serviceId = route.params.id as string;
  const matchedService = servicesData.find(s => s.id === serviceId);
  if (matchedService) {
    formData.selectedServiceId = matchedService.id;
    
    // Auto-select Consultation Purpose based on service ID mapping
    const purposeMapping: Record<string, string> = {
      'taxes-contabilidad': 'Contabilidad y Tax Prep',
      'medicare-seguros': 'Seguros / Notaría',
      'inmigracion': 'Inmigración / Trámites Legales',
      'payroll': 'Contabilidad y Tax Prep',
      'notaria': 'Seguros / Notaría',
      'servicios-empresariales': 'Apertura de Empresa (LLC/Corp)',
      'registro-marca': 'Apertura de Empresa (LLC/Corp)',
      'credito-finanzas': 'Otro Apoyo Administrativo',
      'bienes-raices': 'Otro Apoyo Administrativo',
      'medico-administrativo': 'Otro Apoyo Administrativo',
      'ministro-bodas': 'Seguros / Notaría',
      'multiservicios': 'Otro Apoyo Administrativo'
    };
    
    if (purposeMapping[matchedService.id]) {
      formData.qConsultationPurpose = purposeMapping[matchedService.id];
    }
  }
  
  window.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.country-selector-wrapper')) {
      showCountryDropdown.value = false;
    }
  });
});

// Deduplicate dynamic fields
const filteredFields = computed(() => {
  const step1Fields = ['dob', 'birthdate', 'zipcode', 'companyname'];
  return props.fields.filter(f => !step1Fields.includes(f.name.toLowerCase()));
});

// Initialize dynamic fields
props.fields.forEach(field => {
  formData[field.name] = '';
});

// Capture Contact Lead (Webhook 1)
const sendContactLead = async () => {
  if (hasSentContact.value) return; // Only send once
  
  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    fullPhone: `${selectedCountry.value.dial_code}${formData.phone}`,
    service: props.serviceTitle,
    source: 'Dicas Website (Partial)',
    tags: ['dicas_web_lead', 'partial_contact'],
    submittedAt: new Date().toISOString()
  };

  try {
    const contactUrl = import.meta.env.VITE_CRM_CONTACT_URL || 'https://services.leadconnectorhq.com/hooks/a2wjRz4sU27JY00bUoHZ/webhook-trigger/e1d506dd-5052-404f-9af0-29676473c345';
    await axios.post(contactUrl, payload);
    hasSentContact.value = true;
    console.log('Initial contact captured successfully.');
  } catch (error) {
    console.error('Contact Capture Error:', error);
  }
};

const totalSteps = computed(() => {
  return props.isGlobal ? 3 : 2;
});

const progressWidth = computed(() => {
  return `${(currentStep.value / totalSteps.value) * 100}%`;
});

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert(t('form.validationAlert'));
      return;
    }
    // Trigger first webhook
    sendContactLead();
  }
  
  if (currentStep.value < 3) {
    gsap.to('.step-content', {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        currentStep.value++;
        gsap.fromTo('.step-content', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
      }
    });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    gsap.to('.step-content', {
      opacity: 0,
      x: 20,
      duration: 0.3,
      onComplete: () => {
        currentStep.value--;
        gsap.fromTo('.step-content', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 });
      }
    });
  }
};

// Automated Lead Scoring System based on the "Big 5"
const calculateLeadScore = () => {
  let score = 0;
  
  // Q1: Billing (Critical)
  if (formData.qBilling === 'Sí') score += 40;
  else if (formData.qBilling === 'No') score += 10;

  // Q2: Status
  if (['Ciudadano/Residente', 'SSN', 'ITIN'].includes(formData.qStatus)) score += 20;
  else if (formData.qStatus === 'En Proceso') score += 10;

  // Q4: Location (NJ Focus)
  if (formData.qLocation === 'Sí, reside en NJ') score += 20;
  else if (formData.qLocation === 'No, reside en otro estado') score += 10;

  // Q5: Urgency
  if (formData.qUrgency === '< 48 horas') score += 20;
  else if (formData.qUrgency === '1-2 semanas') score += 10;

  let status = 'COLD';
  if (score >= 80) status = 'HIGHT_PRIME_VIP';
  else if (score >= 50) status = 'WARM_QUALIFIED';
  else status = 'COLD_RETAIN';

  return { score, status, isQualified: score >= 50 };
};

// Helper to generate a professional summary with emojis
const generateSummary = (scoring: any) => {
  const service = servicesData.find(s => s.id === formData.selectedServiceId)?.title || props.serviceTitle || 'General';
  
  let summary = `🚨 NEW LEAD QUALIFICATION: ${scoring.status}\n`;
  summary += `📈 SCORE: ${scoring.score}/100\n\n`;
  
  summary += `👤 PERS: ${formData.firstName} ${formData.lastName}\n`;
  summary += `📧 MAIL: ${formData.email}\n`;
  summary += `📱 TEL: ${selectedCountry.value.dial_code}${formData.phone}\n`;
  if (formData.zipCode) summary += `📮 ZIP: ${formData.zipCode}\n`;
  summary += `💼 SERV: ${service}\n`;
  summary += `📝 MOTIVO: ${formData.qConsultationPurpose || 'Consulta General'}\n`;
  
  if (formData.hasCompany && formData.companyName) {
    summary += `🏢 CORP: ${formData.companyName}\n`;
  }

  summary += `\n--- ⚖️ QUALIFICATION DATA ---\n`;
  summary += `💰 Facturación > $5.5k: ${formData.qBilling}\n`;
  summary += `🪪 Estatus Legal: ${formData.qStatus}\n`;
  summary += `📂 Tipo Trámite: ${formData.qPurpose}\n`;
  summary += `📍 Ubicación NJ: ${formData.qLocation}\n`;
  summary += `⚡ Urgencia: ${formData.qUrgency}\n`;
  
  return summary;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  const scoring = calculateLeadScore();

  const serviceSlug = props.serviceTitle.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '');

  const crmTags = ['dicas_web_lead', `service_${serviceSlug}`];
  if (formData.urgency === 'critical') crmTags.push('urgency_critical_hot');
  if (formData.budget === 'corporate') crmTags.push('high_value_deal');
  if (formData.wantsExpert) crmTags.push('meeting_request');
  crmTags.push(`status_${scoring.status.toLowerCase()}`);

  const fullPayload = {
    ...formData,
    leadScore: scoring.score,
    qualificationStatus: scoring.status,
    isQualified: scoring.isQualified,
    country: selectedCountry.value.name,
    fullPhone: `${formData.countryCode}${formData.phone}`,
    service: props.serviceTitle,
    nota: generateSummary(scoring),
    source: 'Dicas Website (Qualified)',
    tags: crmTags,
    submittedAt: new Date().toISOString()
  };

  try {
    const qualifyUrl = import.meta.env.VITE_CRM_QUALIFY_URL || 'https://services.leadconnectorhq.com/hooks/a2wjRz4sU27JY00bUoHZ/webhook-trigger/56365246-d21e-42a3-8c33-578c489ed034';
    await axios.post(qualifyUrl, fullPayload);
    
    showSuccess.value = true;
    leadStore.clear(); // Clear draft on success
    
    // Smooth scroll to top of form/modal
    nextTick(() => {
      const container = document.querySelector('.form-card') || document.querySelector('.success-card');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    gsap.from('.success-card', {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power4.out'
    });
  } catch (error) {
    console.error('Qualify Submission Error:', error);
    alert('An error occurred while sending your request. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="lead-form-container">
    <div class="form-card" v-if="!showSuccess">
      <div class="form-header">
        <div class="matching-badge">
          <i class="fa-solid fa-user-tie"></i> {{ t('form.matchingBadge') }}
        </div>
        <h3 class="form-title">{{ t('form.title').split(' ')[0] }} <span class="accent">{{ t('form.title').split(' ').slice(1).join(' ') }}</span></h3>
        <p class="form-subtitle">{{ t('form.subtitle') }}</p>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="form-body">
        <div class="step-content">
          <!-- STEP 1: CONTACT -->
          <div v-if="currentStep === 1" class="fields-grid">
            <div class="form-group">
              <label>{{ t('form.firstName') }}</label>
              <input v-model="formData.firstName" type="text" :placeholder="t('form.firstName')" required />
            </div>
            <div class="form-group">
              <label>{{ t('form.lastName') }}</label>
              <input v-model="formData.lastName" type="text" :placeholder="t('form.lastName')" required />
            </div>
            <div class="form-group full-width">
              <label>{{ t('form.email') }}</label>
              <input v-model="formData.email" type="email" placeholder="email@example.com" required />
            </div>

            <div class="form-group full-width">
              <label>{{ t('form.zipCode') }}</label>
              <input v-model="formData.zipCode" type="text" placeholder="Ej: 07001" />
            </div>
            
            <!-- SMART COUNTRY SELECTOR -->
            <div class="form-group full-width country-selector-wrapper">
              <label>{{ t('form.countryLabel') }}</label>
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
                        :placeholder="t('form.searchPlaceholder')"
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
                        {{ t('form.noResults') }}
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>{{ t('form.phoneLabel') }}</label>
              <div class="phone-input-wrapper">
                <span class="prefix">{{ selectedCountry.dial_code }}</span>
                <input v-model="formData.phone" type="tel" placeholder="0000 0000" required />
              </div>
            </div>

            <div class="form-group full-width checkbox-group">
              <label class="checkbox-container">
                <input type="checkbox" v-model="formData.hasCompany">
                <span class="checkmark"></span>
                {{ t('form.hasCompany') }}
              </label>
            </div>

            <transition name="fade-slide">
              <div v-if="formData.hasCompany" class="form-group full-width">
                <label>{{ t('form.companyName') }}</label>
                <input v-model="formData.companyName" type="text" :placeholder="t('form.companyPlaceholder')" />
              </div>
            </transition>
          </div>

          <!-- STEP 2: SERVICE SELECTION / SPECIFIC FIELDS -->
          <div v-if="currentStep === 2" class="fields-grid section-transition">
            <div v-if="isGlobal && !serviceTitle" class="form-group full-width">
              <DSelect 
                v-model="formData.selectedServiceId" 
                :label="t('form.serviceSelection')"
                :options="servicesData.map(s => ({ label: (s.title[locale as 'en' | 'es'] || s.title['en'] || '') as string, value: s.id }))"
                :placeholder="t('form.serviceSelection')"
                icon="fa-solid fa-briefcase"
                required
              />
            </div>

            <div class="form-group full-width">
              <DSelect 
                v-model="formData.qConsultationPurpose" 
                :label="t('form.consultationPurpose')"
                :options="consultationOptions"
                :placeholder="t('form.consultationPurpose')"
                icon="fa-solid fa-comment-dots"
                required
              />
            </div>
            
            <div 
              v-for="field in filteredFields" 
              :key="field.name" 
              class="form-group full-width"
            >
              <DSelect 
                v-if="field.type === 'select'"
                v-model="formData[field.name]"
                :label="field.label[locale] || field.label['en']"
                :options="field.options ? (field.options[locale as 'en' | 'es'] || field.options['en'] || []) : []"
                :placeholder="field.placeholder ? (field.placeholder[locale] || field.placeholder['en']) : '...'"
                :required="field.required"
              />
              
              <DDatePicker
                v-else-if="field.type === 'date'"
                v-model="formData[field.name]"
                :label="field.label[locale] || field.label['en']"
                :required="field.required"
              />

              <template v-else>
                <label>{{ field.label[locale] || field.label['en'] }}<span v-if="field.required" class="required">*</span></label>
                <input v-model="formData[field.name]" :type="field.type" :placeholder="field.placeholder ? (field.placeholder[locale] || field.placeholder['en']) : ''" :required="field.required" />
              </template>
            </div>
          </div>

          <!-- STEP 3: QUALIFICATION QUESTIONS -->
          <div v-if="currentStep === 3" class="qualification-questions">
            <div class="analysis-group">
              <label class="group-label">{{ t('form.questions.billing') }}</label>
              <div class="selection-cards columns-2">
                <div class="card mini" :class="{ active: formData.qBilling === 'Sí' }" @click="formData.qBilling = 'Sí'">
                  <i class="fa-solid fa-check"></i> <span>{{ t('form.options.yes') }}</span>
                </div>
                <div class="card mini" :class="{ active: formData.qBilling === 'No' }" @click="formData.qBilling = 'No'">
                  <i class="fa-solid fa-xmark"></i> <span>{{ t('form.options.no') }}</span>
                </div>
              </div>
            </div>

            <div class="analysis-group">
              <DSelect 
                v-model="formData.qStatus" 
                :label="t('form.questions.status')"
                :options="statusOptions"
                :placeholder="t('form.questions.status')"
                icon="fa-solid fa-id-card-clip"
                required
              />
            </div>

            <div class="analysis-group">
              <label class="group-label">{{ t('form.questions.purpose') }}</label>
              <div class="selection-cards columns-2">
                <div class="card mini" :class="{ active: formData.qPurpose === 'Personal' }" @click="formData.qPurpose = 'Personal'">
                  <i class="fa-solid fa-user"></i> <span>{{ t('form.options.personal') }}</span>
                </div>
                <div class="card mini" :class="{ active: formData.qPurpose === 'Negocio/LLC' }" @click="formData.qPurpose = 'Negocio/LLC'">
                  <i class="fa-solid fa-building"></i> <span>{{ t('form.options.business') }}</span>
                </div>
              </div>
            </div>

            <div class="analysis-group">
              <label class="group-label">{{ t('form.questions.location') }}</label>
              <div class="selection-cards columns-2">
                <div class="card mini" :class="{ active: formData.qLocation === 'Sí, reside en NJ' }" @click="formData.qLocation = 'Sí, reside en NJ'">
                  <i class="fa-solid fa-location-dot"></i> <span>{{ t('form.options.inNJ') }}</span>
                </div>
                <div class="card mini" :class="{ active: formData.qLocation === 'No, reside en otro estado' }" @click="formData.qLocation = 'No, reside en otro estado'">
                  <i class="fa-solid fa-map"></i> <span>{{ t('form.options.otherState') }}</span>
                </div>
              </div>
            </div>

            <div class="analysis-group">
              <label class="group-label">{{ t('form.questions.urgency') }}</label>
              <div class="selection-cards">
                <div class="card mini" :class="{ active: formData.qUrgency === '< 48 horas' }" @click="formData.qUrgency = '< 48 horas'">
                  <div class="dot red"></div> <span>{{ t('form.options.urgent') }}</span>
                </div>
                <div class="card mini" :class="{ active: formData.qUrgency === '1-2 semanas' }" @click="formData.qUrgency = '1-2 semanas'">
                  <div class="dot gold"></div> <span>{{ t('form.options.nextWeeks') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button v-if="currentStep > 1" type="button" @click="prevStep" class="btn-secondary" :disabled="isSubmitting">
            {{ t('form.back') }}
          </button>
          
          <button v-if="currentStep < totalSteps" type="button" @click="nextStep" class="btn-primary">
            {{ t('form.next') }} <i class="fa-solid fa-arrow-right"></i>
          </button>
          
          <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">{{ t('form.submit') }} <i class="fa-solid fa-paper-plane"></i></span>
            <span v-else>{{ t('common.submitting') }} <i class="fa-solid fa-circle-notch fa-spin"></i></span>
          </button>
        </div>
      </form>
    </div>

    <!-- SUCCESS MESSAGE -->
    <div v-else class="success-card section-transition">
      <div class="success-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2>{{ t('form.successTitle') }}</h2>
      <p v-html="t('form.successDesc', { service: serviceTitle })"></p>
      <router-link to="/" class="btn-return-home">{{ t('form.returnHome') }}</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lead-form-container {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}

// BASE STYLES: MOBILE FIRST
.form-card, .success-card {
  background: linear-gradient(135deg, rgba($white, 0.05) 0%, rgba($white, 0.02) 100%);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba($white, 0.1);
  border-radius: 20px;
  padding: 2rem 1.2rem;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  position: relative;
  overflow: visible; // Allow select dropdowns to overflow if container is auto-height

  @media (min-width: 768px) {
    padding: 4rem 3rem;
    border-radius: 30px;
  }
}

.form-header {
  margin-bottom: 1.5rem;
  text-align: center;

  .matching-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba($primary, 0.1);
    border: 1px solid rgba($primary, 0.2);
    padding: 0.5rem 1.2rem;
    border-radius: 50px;
    color: $primary;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 2rem;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
      margin-bottom: 2.5rem;
    }
  }

  .form-title {
    font-family: $font-luxury;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: $white;

    @media (min-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 0.8rem;
    }

    .accent { 
      color: $primary; 
      background: linear-gradient(to bottom, $primary, $dicas-gold-dark);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .form-subtitle {
    font-size: 0.95rem;
    color: rgba($white, 0.7);
    margin-bottom: 1.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 2.5rem;
    }
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
  grid-template-columns: 1fr; // Mobile: 1 Column
  gap: 1.2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; // Desktop: 2 Columns
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &.full-width {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }

  label {
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 700;
    color: rgba($white, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;

    @media (min-width: 768px) {
      font-size: 0.85rem;
    }

    .required { color: $dicas-red; margin-left: 4px; }
  }

  input {
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

    &::placeholder { color: rgba($white, 0.2); }
  }
}

.qualification-questions {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    gap: 2.5rem;
  }

  .analysis-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .group-label {
      font-family: $font-principal;
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba($white, 0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
}

.selection-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;

  @media (min-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  &.columns-2 {
    grid-template-columns: 1fr;
    @media (min-width: 500px) { grid-template-columns: repeat(2, 1fr); }
  }

  .card {
    background: rgba($white, 0.03);
    border: 1px solid rgba($white, 0.08);
    border-radius: 12px;
    padding: 1.2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-align: center;

    i { font-size: 1.3rem; color: $primary; opacity: 0.5; }
    span { font-size: 0.85rem; color: rgba($white, 0.7); }

    &.mini {
      flex-direction: row;
      justify-content: flex-start;
      padding: 0.8rem 1.2rem;
    }

    &:hover {
      background: rgba($white, 0.06);
      border-color: rgba($primary, 0.3);
      transform: translateY(-2px);
    }

    &.active {
      background: rgba($primary, 0.1);
      border-color: $primary;
      i { opacity: 1; transform: scale(1.1); }
      span { color: $white; font-weight: 700; }
    }
  }
}

.form-actions {
  display: flex;
  flex-direction: column-reverse; // Stack buttons on mobile
  gap: 1rem;
  margin-top: 2rem;

  @media (min-width: 600px) {
    flex-direction: row;
  }

  button {
    width: 100%;
    padding: 1.1rem;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    @media (min-width: 600px) { flex: 1; }
  }

  .btn-primary {
    background: linear-gradient(135deg, $primary, $dicas-gold-dark);
    color: $primary-dark;
    border: none;
    &:hover:not(:disabled) { box-shadow: 0 10px 20px rgba($primary, 0.2); transform: translateY(-2px); }
  }

  .btn-secondary {
    background: transparent;
    border: 1px solid rgba($white, 0.1);
    color: white;
    &:hover { background: rgba($white, 0.05); }
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
    .selected-value {
      display: flex;
      align-items: center;
      gap: 10px;
      color: $white;
      font-family: $font-principal;
      font-size: 0.95rem;

      .dial { color: $primary; font-weight: 700; }
      .ms-auto { opacity: 0.5; font-size: 0.8rem; }
    }
  }

  .dropdown-panel {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    background: #1a1a1a;
    border: 1px solid rgba($white, 0.2);
    border-radius: 16px;
    z-index: 10000;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    overflow: hidden;

    .search-box {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba($white, 0.1);
      background: rgba($white, 0.02);

      i { color: $primary; opacity: 0.7; }
      input {
        background: transparent;
        border: none;
        color: white;
        width: 100%;
        outline: none;
        font-family: $font-principal;
        font-size: 0.95rem;
        &::placeholder { color: rgba($white, 0.3); }
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
        transition: all 0.2s ease;
        border-bottom: 1px solid rgba($white, 0.05);

        &:last-child { border-bottom: none; }

        &:hover { background: rgba($primary, 0.15); }
        &.active { background: rgba($primary, 0.25); border-left: 3px solid $primary; }

        .flag { font-size: 1.2rem; }
        .name { flex: 1; font-size: 0.9rem; color: $white; font-weight: 500; }
        .dial { color: $primary; font-size: 0.85rem; font-weight: 700; opacity: 0.9; }
      }

      .no-results {
        padding: 2rem;
        text-align: center;
        color: rgba($white, 0.5);
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
  .prefix {
    padding: 0.8rem 1rem;
    background: rgba($white, 0.05);
    color: $primary;
    border-right: 1px solid rgba($white, 0.1);
  }
  input { background: transparent; border: none; flex: 1; padding: 0.8rem 1rem; color: white; outline: none; }
}

.checkbox-group {
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: rgba($white, 0.8);
    .checkmark {
      height: 20px;
      width: 20px;
      background: rgba($white, 0.05);
      border: 1px solid rgba($white, 0.1);
      border-radius: 4px;
      position: relative;
    }
    input:checked ~ .checkmark {
      background: $primary;
      &::after { content: '✓'; position: absolute; left: 4px; top: -1px; color: $primary-dark; font-weight: bold; }
    }
    input { display: none; }
  }
}

.success-card {
  text-align: center;
  padding: 4rem 2rem;
  
  .success-icon { 
    font-size: 5rem; 
    color: $alert-success; 
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 30px rgba($alert-success, 0.4));
  }
  
  h2 { 
    font-family: $font-luxury; 
    font-size: 2.5rem; 
    margin-bottom: 1rem; 
    color: white; 
  }
  
  p { 
    color: rgba($white, 0.8); 
    margin-bottom: 3rem; 
    line-height: 1.8;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-return-home {
    display: inline-flex;
    padding: 1.2rem 2.5rem;
    background: rgba($white, 0.1);
    border: 1px solid rgba($white, 0.2);
    border-radius: 50px;
    color: $white !important;
    text-decoration: none;
    font-family: $font-principal;
    font-weight: 700;
    transition: all 0.3s ease;

    &:hover {
      background: $white;
      color: $primary-dark !important;
      transform: translateY(-3px);
    }
  }
}

.ms-auto { margin-left: auto; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

</style>
