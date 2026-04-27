<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/stores/themeStore';
import gsap from 'gsap';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const activeSection = ref('hero');
const modalStore = useModalStore();
const themeStore = useThemeStore();
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

// GSAP Mobile Menu Animations
const onMenuEnter = (el: Element, done: () => void) => {
  document.body.style.overflow = 'hidden';
  const tl = gsap.timeline({ onComplete: done });
  
  tl.fromTo(el, 
    { x: '100%', opacity: 0 },
    { x: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
  );
  
  tl.fromTo('.mm-link', 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' },
    '-=0.3'
  );
};

const onMenuLeave = (el: Element, done: () => void) => {
  document.body.style.overflow = '';
  const tl = gsap.timeline({ onComplete: done });
  
  // Stagger links out first
  tl.to('.mm-link', {
    y: -20,
    opacity: 0,
    duration: 0.3,
    stagger: {
      each: 0.05,
      from: 'end'
    },
    ease: 'power2.in'
  });
  
  // Slide drawer out
  tl.to(el, {
    x: '100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power4.in'
  }, '-=0.1');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  // Intersection Observer for active sections
  const sections = ['hero', 'services', 'about'];
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
      }
    });
  }, observerOptions);

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
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
        <router-link to="/" class="nav-link" :class="{ active: activeSection === 'hero' }">{{ t('nav.home') }}</router-link>
        <a href="/#services" class="nav-link" :class="{ active: activeSection === 'services' }">{{ t('nav.services') }}</a>
        <a href="/#about" class="nav-link" :class="{ active: activeSection === 'about' }">{{ t('nav.about') }}</a>
        
        <div class="lang-switcher" @click="toggleLanguage">
          <span :class="{ active: locale === 'en' }">EN</span>
          <span class="separator">|</span>
          <span :class="{ active: locale === 'es' }">ES</span>
        </div>

        <button class="theme-toggle" @click="themeStore.toggleTheme" :aria-label="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`" :title="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`">
          <transition name="scale-fade" mode="out-in">
            <i v-if="themeStore.theme === 'dark'" class="fa-solid fa-sun"></i>
            <i v-else class="fa-solid fa-moon"></i>
          </transition>
        </button>

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
      <Transition 
        :css="false"
        @enter="onMenuEnter"
        @leave="onMenuLeave"
      >
        <div v-if="isMenuOpen" class="mobile-menu">
          <nav class="mm-nav">
            <router-link to="/" class="mm-link" :class="{ active: activeSection === 'hero' }" @click="closeMenu">{{ t('nav.home') }}</router-link>
            <a href="/#services" class="mm-link" :class="{ active: activeSection === 'services' }" @click="closeMenu">{{ t('nav.services') }}</a>
            <a href="/#about" class="mm-link" :class="{ active: activeSection === 'about' }" @click="closeMenu">{{ t('nav.about') }}</a>
            
            <div class="mm-divider"></div>

            <div class="mm-theme-toggle">
              <span class="label">{{ themeStore.theme === 'light' ? 'LIGHT MODE' : 'DARK MODE' }}</span>
              <button class="toggle-btn" @click="themeStore.toggleTheme">
                <i v-if="themeStore.theme === 'dark'" class="fa-solid fa-sun"></i>
                <i v-else class="fa-solid fa-moon"></i>
              </button>
            </div>
            
            <div class="mm-lang-switcher">
              <span class="label">{{ t('header.languageLabel') }}</span>
              <div class="switcher-btns">
                <button @click="toggleLanguage" :class="{ active: locale === 'en' }">{{ t('header.en') }}</button>
                <button @click="toggleLanguage" :class="{ active: locale === 'es' }">{{ t('header.es') }}</button>
              </div>
            </div>

            <button @click="openConsultancy" class="mm-cta">{{ t('nav.cta') }}</button>
          </nav>
          
          <div class="mm-footer">
            <p>&copy; {{ new Date().getFullYear() }} Dicas Advisor Group. {{ t('footer.rights') }}</p>
          </div>
        </div>
      </Transition>
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
    background: var(--header-bg);
    backdrop-filter: blur(var(--header-blur));
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);
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
      height: 65px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(0,0,0,0.15));
      transition: all 0.3s ease;

      @media (max-width: 768px) {
        height: 50px;
      }
    }
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .lang-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;

    &:hover {
      background: var(--border-color);
    }

    span {
      transition: color 0.3s ease;
      &.active {
        color: var(--accent);
      }
    }

    .separator {
      color: var(--border-color);
      font-weight: 300;
    }
  }

  .theme-toggle {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: all 0.3s ease;

    &:hover {
      background: var(--border-color);
      transform: translateY(-2px);
    }

    i {
      display: block;
    }
  }

  .nav-link {
    text-decoration: none;
    color: var(--header-link);
    font-family: $font-principal;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
    transition: color 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--accent);
      transition: width 0.3s ease;
    }

    &:hover, &.active {
      color: var(--accent);
      &::after {
        width: 100%;
      }
    }

    &.cta {
      background: var(--accent);
      color: #FFFFFF;
      border: 1px solid var(--accent);
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      font-weight: 700;
      transition: all 0.3s ease;

      &::after { display: none; }

      &:hover {
        background: transparent;
        color: var(--accent);
        box-shadow: 0 5px 15px rgba($primary, 0.2);
      }
    }
  }

  // Transitions
  .scale-fade-enter-active, .scale-fade-leave-active {
    transition: all 0.3s ease;
  }
  .scale-fade-enter-from, .scale-fade-leave-to {
    opacity: 0;
    transform: scale(0.5) rotate(45deg);
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
      background: var(--text-color);
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
    background: var(--bg-color);
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
      gap: 1.5rem;
      width: 100%;
      max-width: 300px;
    }

    .mm-link {
      font-family: $font-principal;
      font-size: 1.5rem;
      color: var(--text-color);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 700;
      transition: color 0.3s ease;

      &:hover, &.active { color: var(--accent); }
    }

    .mm-divider {
      width: 40px;
      height: 2px;
      background: var(--accent);
      margin: 0.5rem 0;
    }

    .mm-theme-toggle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.5rem;

      .label {
        font-size: 0.6rem;
        color: var(--text-secondary);
        letter-spacing: 2px;
        font-weight: 800;
      }

      .toggle-btn {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
      }
    }

    .mm-lang-switcher {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      width: 100%;

      .label {
        font-size: 0.6rem;
        color: var(--text-secondary);
        letter-spacing: 2px;
        font-weight: 800;
      }

      .switcher-btns {
        display: flex;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 50px;
        padding: 5px;
        width: 100%;

        button {
          flex: 1;
          background: none;
          border: none;
          padding: 0.8rem;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 50px;
          transition: all 0.3s ease;

          &.active {
            background: var(--accent);
            color: #FFFFFF;
            box-shadow: 0 5px 15px rgba($primary, 0.2);
          }
        }
      }
    }

    .mm-cta {
      width: 100%;
      background: $secondary;
      color: #FFFFFF;
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
      color: var(--text-secondary);
      font-size: 0.7rem;
      letter-spacing: 1px;
    }
  }
}
</style>
