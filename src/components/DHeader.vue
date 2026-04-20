<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const modalStore = useModalStore();
const { locale, t } = useI18n();

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const openConsultancy = () => {
  isMenuOpen.value = false;
  modalStore.openConsultancy(null, 'header');
};

const toggleLanguage = () => {
  const newLocale = locale.value === 'en' ? 'es' : 'en';
  locale.value = newLocale;
  localStorage.setItem('user_locale', newLocale);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// GSAP Mobile Menu Animation
watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    gsap.fromTo('.mobile-menu', 
      { x: '100%', opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
    );
    gsap.fromTo('.mm-link', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.3, ease: 'back.out(1.7)' }
    );
  } else {
    document.body.style.overflow = '';
    gsap.to('.mobile-menu', { x: '100%', opacity: 0, duration: 0.5, ease: 'power4.in' });
  }
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header :class="['d-header', { 'is-scrolled': isScrolled }]">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="@/assets/logo/logo-large.png" alt="Dicas Advisor Group" class="logo-img" />
      </router-link>
      
      <!-- DESKTOP NAV -->
      <nav class="nav-links">
        <router-link to="/" class="nav-link">{{ t('nav.home') }}</router-link>
        <a href="/#services" class="nav-link">{{ t('nav.services') }}</a>
        <a href="/#about" class="nav-link">{{ t('nav.about') }}</a>
        
        <div class="lang-switcher" @click="toggleLanguage">
          <span :class="{ active: locale === 'en' }">EN</span>
          <span class="separator">|</span>
          <span :class="{ active: locale === 'es' }">ES</span>
        </div>

        <button @click="openConsultancy" class="nav-link cta">{{ t('nav.cta') }}</button>
      </nav>

      <!-- MOBILE TOGGLE -->
      <button 
        class="mobile-toggle" 
        :class="{ 'is-open': isMenuOpen }" 
        @click="toggleMenu"
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- MOBILE MENU DRAWER -->
      <div v-show="isMenuOpen" class="mobile-menu" ref="menuRef">
        <nav class="mm-nav">
          <router-link to="/" class="mm-link" @click="closeMenu">{{ t('nav.home') }}</router-link>
          <a href="/#services" class="mm-link" @click="closeMenu">{{ t('nav.services') }}</a>
          <a href="/#about" class="mm-link" @click="closeMenu">{{ t('nav.about') }}</a>
          
          <div class="mm-divider"></div>
          
          <div class="mm-lang-switcher" @click="toggleLanguage">
            <span class="label">LANGUAGE:</span>
            <div class="switcher-btns">
              <button :class="{ active: locale === 'en' }">ENGLISH</button>
              <button :class="{ active: locale === 'es' }">ESPAÑOL</button>
            </div>
          </div>

          <button @click="openConsultancy" class="mm-cta">{{ t('nav.cta') }}</button>
        </nav>
        
        <div class="mm-footer">
          <p>© 2026 Dicas Advisor Group</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.d-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  padding: 1.5rem 0;

  &.is-scrolled {
    background: rgba($primary-dark, 0.85);
    backdrop-filter: blur(12px);
    padding: 1rem 0;
    border-bottom: 1px solid rgba($primary, 0.15);
  }

  .header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    .logo-img {
      height: 45px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
    }
  }

  .nav-links {
    display: flex;
    gap: 2.5rem;
    align-items: center;

    @media (max-width: 768px) {
      display: none; // Minimal approach for now, focus on desktop premium
    }
  }

  .lang-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba($white, 0.4);
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    background: rgba($white, 0.05);
    border: 1px solid rgba($white, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: rgba($white, 0.1);
      border-color: rgba($white, 0.2);
    }

    span {
      transition: color 0.3s ease;
      &.active {
        color: $primary;
      }
    }

    .separator {
      color: rgba($white, 0.1);
      font-weight: 300;
    }
  }

  .nav-link {
    text-decoration: none;
    color: $white;
    font-family: $font-principal;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 1px;
      background: $primary;
      transition: width 0.3s ease;
    }

    &:hover {
      color: $primary;
      &::after {
        width: 100%;
      }
    }

    &.cta {
      background: rgba($primary, 0.1);
      border: 1px solid $primary;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      transition: all 0.3s ease;

      &::after { display: none; }

      &:hover {
        background: $primary;
        color: $primary-dark;
        box-shadow: 0 0 20px rgba($primary, 0.3);
      }
    }
  }

  // MOBILE TOGGLE STYLES
  .mobile-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    z-index: 2000;

    @media (max-width: 768px) {
      display: flex;
    }

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: $white;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      transform-origin: center;
    }

    &.is-open {
      span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
      span:nth-child(2) { opacity: 0; transform: translateX(-20px); }
      span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
    }
  }

  // MOBILE MENU STYLES
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba($dicas-bg-dark, 0.95);
    backdrop-filter: blur(20px);
    z-index: 1500;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    .mm-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
      max-width: 300px;
    }

    .mm-link {
      font-family: $font-principal;
      font-size: 1.5rem;
      color: $white;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 700;
      transition: color 0.3s ease;

      &:hover { color: $primary; }
    }

    .mm-divider {
      width: 40px;
      height: 2px;
      background: $primary;
      margin: 1rem 0;
    }

    .mm-lang-switcher {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;

      .label {
        font-size: 0.7rem;
        color: rgba($white, 0.4);
        letter-spacing: 2px;
        font-weight: 800;
      }

      .switcher-btns {
        display: flex;
        background: rgba($white, 0.05);
        border: 1px solid rgba($white, 0.1);
        border-radius: 50px;
        padding: 5px;
        width: 100%;

        button {
          flex: 1;
          background: none;
          border: none;
          padding: 0.8rem;
          color: rgba($white, 0.5);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 50px;
          transition: all 0.3s ease;

          &.active {
            background: $primary;
            color: $primary-dark;
            box-shadow: 0 5px 15px rgba($primary, 0.3);
          }
        }
      }
    }

    .mm-cta {
      width: 100%;
      background: $secondary;
      color: $white;
      border: none;
      padding: 1.2rem;
      border-radius: 4px;
      font-family: $font-principal;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 1rem;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba($secondary, 0.2);
    }

    .mm-footer {
      position: absolute;
      bottom: 2rem;
      text-align: center;
      color: rgba($white, 0.3);
      font-size: 0.7rem;
      letter-spacing: 1px;
    }
  }
}
</style>
