<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Completa todos los campos'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await AuthService.login(email.value, password.value)
    const { access_token, user } = res.data
    localStorage.setItem('access_token', access_token)
    userStore.setUser({ id: user.id, name: user.name, email: user.email, role: user.accountType })
    if (user.accountType === 'admin') {
      router.push('/admin')
    } else {
      router.push('/editor')
    }
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <img src="@/assets/logo/logo-large.png" alt="Dicas Advisor Group" />
      </div>

      <h1 class="login-title">Acceso al Panel</h1>
      <p class="login-subtitle">Solo para colaboradores autorizados</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" autocomplete="email" />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Verificando...</span>
          <span v-else>Ingresar</span>
        </button>
      </form>

      <router-link to="/" class="back-link">← Volver al sitio</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: $primary-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-image: radial-gradient(ellipse at 50% 0%, rgba($primary, 0.08) 0%, transparent 70%);
}

.login-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba($primary, 0.15);
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.login-logo img {
  height: 48px;
  object-fit: contain;
  margin-bottom: 2rem;
}

.login-title {
  font-family: $font-luxury;
  font-size: 1.8rem;
  color: $white;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: rgba($white, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-family: $font-principal;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba($white, 0.5);
  }

  input {
    background: rgba($white, 0.04);
    border: 1px solid rgba($white, 0.1);
    border-radius: 6px;
    padding: 0.9rem 1rem;
    color: $white;
    font-family: $font-principal;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder { color: rgba($white, 0.25); }
    &:focus { border-color: $primary; }
  }
}

.login-error {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: #ef4444;
  background: rgba(#ef4444, 0.08);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(#ef4444, 0.2);
}

.login-btn {
  margin-top: 0.5rem;
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: $primary-light;
    box-shadow: 0 8px 25px rgba($primary, 0.35);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.back-link {
  display: block;
  margin-top: 2rem;
  font-family: $font-principal;
  font-size: 0.8rem;
  color: rgba($white, 0.35);
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: $primary; }
}
</style>
