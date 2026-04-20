<script setup lang="ts">
import GlobalConsultancyModal from '@/components/GlobalConsultancyModal.vue';
</script>

<template>
  <div class="app-container">
    <RouterView />
    <GlobalConsultancyModal />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
