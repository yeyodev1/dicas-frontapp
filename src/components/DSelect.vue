<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as () => (string | { label: string; value: any; icon?: string })[],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecciona una opción'
  },
  icon: {
    type: String,
    default: 'fa-solid fa-list-ul'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const searchQuery = ref('');
const selectRef = ref<HTMLElement | null>(null);

const displayOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') return { label: opt, value: opt };
    return opt;
  });
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return displayOptions.value;
  const q = searchQuery.value.toLowerCase();
  return displayOptions.value.filter(opt => 
    opt.label.toLowerCase().includes(q)
  );
});

const selectedLabel = computed(() => {
  const selected = displayOptions.value.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : '';
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) searchQuery.value = '';
};

const selectOption = (value: any) => {
  emit('update:modelValue', value);
  emit('change', value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="d-select-wrapper" ref="selectRef" :class="{ 'is-open': isOpen, 'has-value': !!modelValue }">
    <label v-if="label" class="select-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    
    <div class="select-trigger" @click="toggleDropdown">
      <div class="trigger-content">
        <i v-if="icon" :class="icon" class="main-icon"></i>
        <span v-if="selectedLabel" class="value">{{ selectedLabel }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <i class="fa-solid fa-chevron-down chevron"></i>
    </div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <div v-if="searchable" class="search-container" @click.stop>
          <i class="fa-solid fa-magnifying-glass"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar..." 
            autofocus
          />
        </div>
        
        <ul class="options-list">
          <li 
            v-for="opt in filteredOptions" 
            :key="opt.value"
            @click="selectOption(opt.value)"
            :class="{ 'is-selected': opt.value === modelValue }"
          >
            <i v-if="opt.icon" :class="opt.icon"></i>
            <span>{{ opt.label }}</span>
            <i v-if="opt.value === modelValue" class="fa-solid fa-check check-icon"></i>
          </li>
          <li v-if="filteredOptions.length === 0" class="no-results">
            No se encontraron opciones
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.d-select-wrapper {
  position: relative;
  width: 100%;
}

.select-label {
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

.select-trigger {
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.1);
  padding: 1.1rem 1.4rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  min-height: 58px;

  &:hover {
    background: rgba($white, 0.08);
    border-color: rgba($primary, 0.3);
  }

  .trigger-content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: $font-principal;
    
    .main-icon {
      color: $primary;
      font-size: 1.1rem;
      opacity: 0.7;
    }

    .value { color: $white; font-weight: 500; font-size: 1rem; }
    .placeholder { color: rgba($white, 0.3); font-size: 1rem; }
  }

  .chevron {
    font-size: 0.8rem;
    color: rgba($white, 0.4);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

.is-open {
  .select-trigger {
    border-color: $primary;
    background: rgba($primary, 0.05);
    box-shadow: 0 0 20px rgba($primary, 0.1);
    
    .chevron { transform: rotate(180deg); color: $primary; }
  }
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: rgba(#0e0e0e, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 16px;
  z-index: 1000;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  overflow: hidden;
  animation: panelSlide 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.search-container {
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba($white, 0.05);

  i { color: rgba($white, 0.3); font-size: 0.9rem; }

  input {
    background: transparent;
    border: none;
    color: $white;
    font-family: $font-principal;
    font-size: 1rem;
    width: 100%;
    outline: none;

    &::placeholder { color: rgba($white, 0.2); }
  }
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 280px;
  overflow-y: auto;

  li {
    padding: 1.1rem 1.4rem;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: $font-principal;
    color: rgba($white, 0.7);
    font-size: 0.95rem;

    i { color: $primary; font-size: 1rem; opacity: 0.6; }

    &.is-selected {
      background: rgba($primary, 0.15);
      color: $white;
      font-weight: 600;
      
      .check-icon { margin-left: auto; opacity: 1; color: $primary; }
    }

    &:hover:not(.is-selected) {
      background: rgba($white, 0.05);
      color: $white;
      padding-left: 1.8rem;
    }
  }

  .no-results {
    padding: 2.5rem 1rem;
    text-align: center;
    color: rgba($white, 0.3);
    font-size: 0.9rem;
  }

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: rgba($white, 0.1); border-radius: 10px; }
}

@keyframes panelSlide {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
