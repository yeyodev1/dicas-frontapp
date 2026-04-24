<script setup lang="ts">
import DHeader from '@/components/DHeader.vue';
import DHero from '@/components/DHero.vue';
import DHighlightServices from '@/components/DHighlightServices.vue';
import DAbout from '@/components/DAbout.vue';
import DServiceCatalog from '@/components/DServiceCatalog.vue';
import DFooter from '@/components/DFooter.vue';
import DBlogSection from '@/components/DBlogSection.vue';
import { useSEO } from '@/composables/useSEO';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useSEO({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  path: '/',
})
</script>

<template>
  <div class="home-view">
    <DHeader />
    <main>
      <DHero />
      <div class="strategy-banner">
        <p>{{ t('home.banner') }}</p>
      </div>
      <DHighlightServices />
      <DAbout />
      <DServiceCatalog />
      <DBlogSection />
    </main>
    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  overflow-x: hidden;
  background-color: #050505;
}

.strategy-banner {
  background: $primary;
  color: $primary-dark;
  padding: 2rem;
  text-align: center;
  font-family: $font-luxury;
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
