<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DHeader from '@/components/DHeader.vue';
import DFooter from '@/components/DFooter.vue';
import gsap from 'gsap';

const { t } = useI18n();
const router = useRouter();
const isLoading = ref(true);

const handleIframeLoad = () => {
  isLoading.value = false;
  gsap.from('.booking-container', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out'
  });
};

const handleMessage = (event: MessageEvent) => {
  // GHL widgets often send messages on completion
  // You might need to check the exact event data from GHL documentation or testing
  if (event.data === 'booking_complete' || (typeof event.data === 'string' && event.data.includes('booking'))) {
    router.push('/gracias');
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
  
  // Append GHL script for iframe responsiveness/functionality
  const script = document.createElement('script');
  script.src = 'https://api.leadconnectorhq.com/js/form_embed.js';
  script.type = 'text/javascript';
  document.body.appendChild(script);

  gsap.from('.header-section', {
    opacity: 0,
    y: -20,
    duration: 1,
    ease: 'power3.out'
  });
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
  // Optional: remove script if needed, but usually safe to leave or let it be
});
</script>

<template>
  <div class="booking-page">
    <DHeader />
    
    <main class="booking-main">
      <div class="container">
        <div class="header-section">
          <span class="badge">{{ t('booking.badge') }}</span>
          <h1 class="title">{{ t('booking.title') }}</h1>
          <p class="subtitle">{{ t('booking.subtitle') }}</p>
        </div>

        <div class="booking-wrapper">
          <div v-if="isLoading" class="loader-overlay">
            <div class="spinner"></div>
            <p>{{ t('common.loading') }}</p>
          </div>
          
          <div class="booking-container">
            <iframe 
              src="https://api.leadconnectorhq.com/widget/booking/OL2D8kquxIzDIvBjZP0S" 
              style="width: 100%; border:none; overflow: hidden; min-height: 700px;" 
              scrolling="no" 
              id="OL2D8kquxIzDIvBjZP0S_1776892127345"
              @load="handleIframeLoad"
            ></iframe>
          </div>
        </div>

        <div class="footer-notice">
          <i class="fa-solid fa-lock"></i> {{ t('booking.secureNotice') }}
        </div>
      </div>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.booking-page {
  background: #050505;
  min-height: 100vh;
  color: white;
}

.booking-main {
  padding: 8rem 2rem 6rem;

  .container {
    max-width: 900px;
    margin: 0 auto;
  }
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;

  .badge {
    display: inline-block;
    padding: 0.5rem 1.2rem;
    background: rgba($primary, 0.1);
    border: 1px solid rgba($primary, 0.2);
    border-radius: 50px;
    color: $primary;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }

  .title {
    font-family: $font-luxury;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    margin-bottom: 1rem;
    background: linear-gradient(to bottom, $white, rgba($white, 0.7));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.1rem;
    color: rgba($white, 0.6);
    max-width: 600px;
    margin: 0 auto;
  }
}

.booking-wrapper {
  position: relative;
  background: rgba($white, 0.02);
  border: 1px solid rgba($white, 0.05);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  min-height: 700px;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: #050505;
  z-index: 10;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba($primary, 0.1);
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    font-family: $font-principal;
    font-size: 0.9rem;
    color: rgba($white, 0.4);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer-notice {
  text-align: center;
  margin-top: 3rem;
  font-size: 0.85rem;
  color: rgba($white, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  i { color: $primary; }
}
</style>
