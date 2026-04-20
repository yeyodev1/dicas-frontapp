<script setup lang="ts">
import GlobalConsultancyModal from '@/components/GlobalConsultancyModal.vue';
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <transition 
        name="page-fade" 
        mode="out-in"
      >
        <component :is="Component" />
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
