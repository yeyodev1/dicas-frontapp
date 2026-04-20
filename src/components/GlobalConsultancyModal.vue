<script setup lang="ts">
import { computed } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import ServiceLeadForm from './ServiceLeadForm.vue';

const modalStore = useModalStore();

const isOpen = computed(() => modalStore.isConsultancyModalOpen);

const handleClose = () => {
  modalStore.closeConsultancy();
};
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <button class="close-btn" @click="handleClose">
          <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div class="modal-content">
          <ServiceLeadForm 
            :isGlobal="true" 
            :serviceTitle="''"
            :fields="[]"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 600px) {
    padding: 0;
  }
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 650px;
  margin: auto;
  z-index: 100;
  
  @media (max-width: 600px) {
    height: 100%;
    max-height: 100vh;
  }
}

.close-btn {
  position: absolute;
  top: -60px;
  right: 0;
  background: rgba($white, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba($white, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 101;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

  i { font-size: 1.2rem; }

  &:hover {
    background: $dicas-red;
    border-color: $dicas-red;
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 0 20px rgba($dicas-red, 0.4);
  }

  @media (max-width: 750px) {
    top: 15px;
    right: 15px;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
