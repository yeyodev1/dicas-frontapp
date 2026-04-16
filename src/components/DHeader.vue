<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

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
      <div class="logo">
        <img src="@/assets/logo/logo-large.png" alt="Dicas Advisor Group" class="logo-img" />
      </div>
      
      <nav class="nav-links">
        <a href="#hero" class="nav-link">Home</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="#about" class="nav-link">About</a>
        <a href="#contact" class="nav-link cta">Contact</a>
      </nav>
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
}
</style>
