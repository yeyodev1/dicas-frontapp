<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';

const { locale } = useI18n();
const isVisible = ref(false);
const whatsappNumber = "12012829103"; // USA Number updated by client

const getMessage = () => {
  return locale.value === 'es' 
    ? "¡Hola! Quisiera obtener más información sobre sus servicios de asesoría."
    : "Hello! I would like to get more information about your advisory services.";
};

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getMessage())}`;

onMounted(() => {
  // Reveal button after a delay
  setTimeout(() => {
    isVisible.value = true;
    gsap.from('.whatsapp-fab', {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    });
  }, 2000);
});
</script>

<template>
  <div v-if="isVisible" class="whatsapp-container">
    <a :href="whatsappUrl" target="_blank" class="whatsapp-fab" aria-label="WhatsApp">
      <div class="pulse"></div>
      <i class="fa-brands fa-whatsapp"></i>
      <div class="tooltip">
        {{ locale === 'es' ? '¿Cómo podemos ayudarte?' : 'How can we help you?' }}
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.whatsapp-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
}

.whatsapp-fab {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.1) rotate(5deg);
    background-color: #22c35e;
    
    .tooltip {
      opacity: 1;
      transform: translateX(-120%) translateY(-50%);
    }
  }

  i {
    z-index: 2;
  }

  .pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #25d366;
    border-radius: 50%;
    z-index: 1;
    opacity: 0.6;
    animation: pulse 2s infinite;
  }

    .tooltip {
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateX(-110%) translateY(-50%);
    background: var(--surface-color);
    color: var(--text-color);
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: $font-principal;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 1px solid var(--border-color);

    &::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 6px solid var(--surface-color);
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
