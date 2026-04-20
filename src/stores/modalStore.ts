import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const isConsultancyModalOpen = ref(false);
  const preselectedServiceId = ref<string | null>(null);
  const source = ref<string>('general');

  function openConsultancy(serviceId: string | null = null, from: string = 'general') {
    preselectedServiceId.value = serviceId;
    source.value = from;
    isConsultancyModalOpen.value = true;
  }

  function closeConsultancy() {
    isConsultancyModalOpen.value = false;
    preselectedServiceId.value = null;
  }

  return {
    isConsultancyModalOpen,
    preselectedServiceId,
    source,
    openConsultancy,
    closeConsultancy
  };
});
