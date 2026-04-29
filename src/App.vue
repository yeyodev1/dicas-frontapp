<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import GlobalConsultancyModal from '@/components/GlobalConsultancyModal.vue';
import DWhatsApp from '@/components/DWhatsApp.vue';
import { useThemeStore } from '@/stores/themeStore';

const route = useRoute();
const { locale } = useI18n();
useThemeStore();
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
    <DWhatsApp />
  </div>
</template>

<style lang="scss">
// Global Reset & Base
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Page Transitions - Premium Scale Fade
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-10px);
}
</style>
