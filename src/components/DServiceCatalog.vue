<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { servicesData } from '@/data/servicesData';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const activeCategory = ref<string | null>(null);

const toggleCategory = (id: string) => {
  activeCategory.value = activeCategory.value === id ? null : id;
};

// Animation Hooks
const beforeEnter = (el: any) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el: any, done: any) => {
  gsap.to(el, {
    height: 'auto',
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    onComplete: done
  });
};

const leave = (el: any, done: any) => {
  gsap.to(el, {
    height: '0',
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  });
};
</script>

<template>
  <section class="d-catalog" id="full-catalog">
    <div class="container">
      <div class="header">
        <h2 class="title">{{ t('catalog.title') }} <span class="accent">{{ t('catalog.accent') }}</span></h2>
        <p class="desc">{{ t('catalog.desc') }}</p>
      </div>

      <div class="catalog-grid">
        <div 
          v-for="service in servicesData" 
          :key="service.id"
          class="category-item"
          :class="{ 'is-active': activeCategory === service.id }"
        >
          <div class="category-header" @click="toggleCategory(service.id)">
            <h3 class="category-title">{{ service.title[locale as 'en' | 'es'] }}</h3>
            <span class="icon" :class="{ 'is-rotated': activeCategory === service.id }">+</span>
          </div>
          
          <transition 
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
            :css="false"
          >
            <div class="category-content" v-if="activeCategory === service.id">
              <ul class="service-list">
                <li v-for="(item, i) in service.features[locale as 'en' | 'es']" :key="i">{{ item }}</li>
              </ul>
              <div class="category-footer">
                <router-link :to="`/servicios/${service.id}`" class="cta-link">
                  {{ t('catalog.viewPage') }} <i class="fa-solid fa-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.d-catalog {
  padding: 8rem 2rem;
  background-color: #050505;
  color: $white;

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 4rem;

    .title {
      font-family: $font-luxury;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: 1rem;
      .accent { color: $primary; }
    }

    .desc {
      font-family: $font-principal;
      color: $text-secondary;
      font-size: 1.1rem;
    }
  }

  .catalog-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-item {
    background: rgba($white, 0.02);
    border: 1px solid rgba($white, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;

    &.is-active {
      background: rgba($white, 0.04);
      border-color: rgba($primary, 0.3);
    }

    .category-header {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;

      .category-title {
        font-family: $font-luxury;
        font-size: 1.25rem;
        margin: 0;
      }

      .icon {
        color: $primary;
        font-size: 1.5rem;
        font-weight: bold;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        
        &.is-rotated {
          transform: rotate(45deg);
          color: $dicas-red;
        }
      }
    }

    .category-content {
      padding: 0 2rem 2rem;
      overflow: hidden;
      
      .service-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.8rem;
        margin-bottom: 2rem;

        li {
          font-family: $font-principal;
          color: $text-secondary;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;

          &::before {
            content: '→';
            color: $primary;
            font-size: 0.8rem;
          }
        }
      }

      .category-footer {
        border-top: 1px solid rgba($white, 0.05);
        padding-top: 1.5rem;
        text-align: right;

        .cta-link {
          color: $primary;
          text-decoration: none;
          font-family: $font-principal;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;

          &:hover {
            color: $white;
            transform: translateX(5px);
          }
        }
      }
    }
  }
}
</style>
