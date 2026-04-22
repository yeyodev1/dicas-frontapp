<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLeadStore } from '@/stores/leadStore';
import DHeader from '@/components/DHeader.vue';
import DFooter from '@/components/DFooter.vue';
import gsap from 'gsap';

const { t } = useI18n();
const leadStore = useLeadStore();

onMounted(() => {
  leadStore.clear(); // Funnel completed
  const tl = gsap.timeline();
  
  tl.from('.success-icon', {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  })
  .from('.title', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.message', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.actions', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6');
});
</script>

<template>
  <div class="thank-you-page">
    <DHeader />
    
    <main class="content">
      <div class="container">
        <div class="success-card">
          <div class="success-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          
          <h1 class="title">{{ t('success.title') }}</h1>
          <p class="message">{{ t('success.message') }}</p>
          
          <div class="actions">
            <router-link to="/" class="btn-primary">
              {{ t('success.return') }}
            </router-link>
          </div>
          
          <div class="next-steps">
            <h3>{{ t('success.nextStepsTitle') }}</h3>
            <div class="steps-grid">
              <div class="step-item">
                <div class="num">01</div>
                <p>{{ t('success.step1') }}</p>
              </div>
              <div class="step-item">
                <div class="num">02</div>
                <p>{{ t('success.step2') }}</p>
              </div>
              <div class="step-item">
                <div class="num">03</div>
                <p>{{ t('success.step3') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <DFooter />
  </div>
</template>

<style lang="scss" scoped>
.thank-you-page {
  background: #050505;
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem;

  .container {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }
}

.success-card {
  text-align: center;
  background: linear-gradient(135deg, rgba($white, 0.05) 0%, rgba($white, 0.02) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.1);
  padding: 4rem 2rem;
  border-radius: 32px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);

  @media (min-width: 768px) {
    padding: 6rem 4rem;
  }

  .success-icon {
    font-size: 5rem;
    color: $alert-success;
    margin-bottom: 2.5rem;
    filter: drop-shadow(0 0 30px rgba($alert-success, 0.3));
  }

  .title {
    font-family: $font-luxury;
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: 1.5rem;
    background: linear-gradient(to bottom, $white, rgba($white, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .message {
    font-size: 1.2rem;
    color: rgba($white, 0.7);
    line-height: 1.8;
    max-width: 550px;
    margin: 0 auto 3.5rem;
  }

  .btn-primary {
    display: inline-flex;
    padding: 1.2rem 3rem;
    background: $white;
    color: $primary-dark;
    border-radius: 50px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba($white, 0.2);
    }
  }
}

.next-steps {
  margin-top: 5rem;
  padding-top: 4rem;
  border-top: 1px solid rgba($white, 0.1);

  h3 {
    font-family: $font-principal;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: $primary;
    margin-bottom: 3rem;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;

    .step-item {
      text-align: left;
      
      .num {
        font-family: $font-luxury;
        font-size: 1.5rem;
        color: rgba($white, 0.2);
        margin-bottom: 1rem;
      }

      p {
        font-size: 0.95rem;
        color: rgba($white, 0.5);
        line-height: 1.6;
      }
    }
  }
}
</style>
