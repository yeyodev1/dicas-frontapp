<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import GlobalConsultancyModal from '@/components/GlobalConsultancyModal.vue';

const route = useRoute();
const { locale } = useI18n();
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <transition 
        name="page-fade" 
        mode="out-in"
      >
        <!-- Adding key with locale forces transition on language change -->
        <component :is="Component" :key="route.fullPath + locale" />
      </transition>
    </RouterView>
    <GlobalConsultancyModal />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Page Transitions
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
