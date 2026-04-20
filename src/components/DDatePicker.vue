<script setup lang="ts">
import { ref, watch } from 'vue';
import DSelect from './DSelect.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Fecha de Nacimiento'
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const day = ref('');
const month = ref('');
const year = ref('');

const days = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString().padStart(2, '0') }));
const months = [
  { label: 'Enero', value: '01' },
  { label: 'Febrero', value: '02' },
  { label: 'Marzo', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Mayo', value: '05' },
  { label: 'Junio', value: '06' },
  { label: 'Julio', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Septiembre', value: '09' },
  { label: 'Octubre', value: '10' },
  { label: 'Noviembre', value: '11' },
  { label: 'Diciembre', value: '12' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => ({ label: (currentYear - i).toString(), value: (currentYear - i).toString() }));

// Sync state if modelValue changes externally
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.includes('-')) {
    const parts = newVal.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      year.value = y || '';
      month.value = m || '';
      day.value = d || '';
    }
  }
}, { immediate: true });

// Emit updates when any part changes
watch([day, month, year], ([d, m, y]) => {
  if (d && m && y) {
    emit('update:modelValue', `${y}-${m}-${d}`);
  } else {
    emit('update:modelValue', '');
  }
});

</script>

<template>
  <div class="d-date-picker">
    <label class="date-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    
    <div class="selectors-grid">
      <div class="selector-col day">
        <DSelect 
          v-model="day" 
          :options="days" 
          placeholder="Día"
          icon="fa-solid fa-calendar-day"
          :searchable="false"
        />
      </div>
      <div class="selector-col month">
        <DSelect 
          v-model="month" 
          :options="months" 
          placeholder="Mes"
          icon="fa-solid fa-calendar-days"
          :searchable="false"
        />
      </div>
      <div class="selector-col year">
        <DSelect 
          v-model="year" 
          :options="years" 
          placeholder="Año"
          icon="fa-solid fa-calendar"
          :searchable="true"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.d-date-picker {
  width: 100%;
}

.date-label {
  display: block;
  font-family: $font-principal;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba($white, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;

  .required { color: $dicas-red; }
}

.selectors-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.2fr;
  gap: 10px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

.selector-col {
  min-width: 0; // Prevent flex/grid overflow
}
</style>
