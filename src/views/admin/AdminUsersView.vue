<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService, { type AppUser } from '@/services/user.service'

const users = ref<AppUser[]>([])
const loading = ref(false)
const showForm = ref(false)
const formError = ref('')
const formSuccess = ref('')
const submitting = ref(false)

const form = ref({ name: '', email: '', password: '' })

onMounted(loadUsers)

async function loadUsers() {
  loading.value = true
  try {
    const res = await UserService.getUsers()
    users.value = res.data
  } finally {
    loading.value = false
  }
}

async function createUser() {
  if (!form.value.name || !form.value.email || !form.value.password) {
    formError.value = 'Completa todos los campos'
    return
  }
  submitting.value = true
  formError.value = ''
  formSuccess.value = ''
  try {
    const res = await UserService.createUser(form.value)
    users.value.unshift(res.data)
    form.value = { name: '', email: '', password: '' }
    showForm.value = false
    formSuccess.value = `Copywriter creado: ${res.data.email}`
  } catch (e: unknown) {
    formError.value = (e as { message?: string })?.message || 'Error al crear usuario'
  } finally {
    submitting.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1>Usuarios</h1>
        <p>Gestión de copywriters del blog</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : '+ Nuevo Copywriter' }}
      </button>
    </div>

    <Transition name="slide">
      <div v-if="showForm" class="create-form">
        <h3>Crear Copywriter</h3>
        <div class="form-grid">
          <div class="field">
            <label>Nombre</label>
            <input v-model="form.name" type="text" placeholder="Nombre completo" />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="email@ejemplo.com" />
          </div>
          <div class="field">
            <label>Contraseña temporal</label>
            <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" />
          </div>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="form-actions">
          <button class="btn-primary" @click="createUser" :disabled="submitting">
            {{ submitting ? 'Creando...' : 'Crear usuario' }}
          </button>
        </div>
      </div>
    </Transition>

    <p v-if="formSuccess" class="success-msg">✓ {{ formSuccess }}</p>

    <div v-if="loading" class="loading-state">Cargando usuarios...</div>

    <div v-else class="users-table-wrap">
      <table class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Creado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td class="user-name-cell">
              <div class="user-avatar-sm">{{ user.name.charAt(0).toUpperCase() }}</div>
              {{ user.name }}
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.accountType]">
                {{ user.accountType === 'admin' ? 'Admin' : 'Copywriter' }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="users.length === 0" class="empty-state">No hay usuarios registrados.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users-page { color: $white; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  h1 { font-family: $font-luxury; font-size: 1.8rem; color: $white; margin-bottom: 0.3rem; }
  p { font-family: $font-principal; font-size: 0.88rem; color: rgba($white, 0.4); }
}

.btn-primary {
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 0.7rem 1.3rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover { background: $primary-light; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.create-form {
  background: rgba($white, 0.03);
  border: 1px solid rgba($primary, 0.15);
  border-radius: 10px;
  padding: 1.8rem;
  margin-bottom: 2rem;

  h3 { font-family: $font-principal; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba($white, 0.5); margin-bottom: 1.2rem; }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label { font-family: $font-principal; font-size: 0.72rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba($white, 0.4); }

  input {
    background: rgba($white, 0.04);
    border: 1px solid rgba($white, 0.1);
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    color: $white;
    font-family: $font-principal;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    &::placeholder { color: rgba($white, 0.2); }
    &:focus { border-color: $primary; }
  }
}

.form-error { font-family: $font-principal; font-size: 0.82rem; color: #ef4444; margin-bottom: 0.8rem; }
.form-actions { display: flex; justify-content: flex-end; }

.success-msg {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: #10b981;
  background: rgba(#10b981, 0.08);
  border: 1px solid rgba(#10b981, 0.2);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.loading-state { font-family: $font-principal; color: rgba($white, 0.4); padding: 2rem 0; }

.users-table-wrap { overflow-x: auto; }

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-principal;

  th {
    text-align: left;
    padding: 0.7rem 1rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba($white, 0.35);
    border-bottom: 1px solid rgba($white, 0.08);
  }

  td {
    padding: 0.9rem 1rem;
    font-size: 0.88rem;
    color: rgba($white, 0.75);
    border-bottom: 1px solid rgba($white, 0.04);
  }

  tr:hover td { background: rgba($white, 0.02); }
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: $white !important;
  font-weight: 500;
}

.user-avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba($primary, 0.2);
  color: $primary;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;

  &.admin { background: rgba($primary, 0.15); color: $primary; }
  &.copywriter { background: rgba($white, 0.06); color: rgba($white, 0.5); }
}

.date-cell { font-size: 0.8rem; color: rgba($white, 0.35) !important; }
.empty-state { font-family: $font-principal; color: rgba($white, 0.3); padding: 2rem 0; text-align: center; }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
