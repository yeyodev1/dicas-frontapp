<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService, { type AppUser } from '@/services/user.service'

const users = ref<AppUser[]>([])
const loading = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const currentUserId = ref<string | null>(null)

const formError = ref('')
const formSuccess = ref('')
const submitting = ref(false)

const form = ref({ name: '', email: '', password: '', accountType: 'copywriter' })

onMounted(loadUsers)

async function loadUsers() {
  loading.value = true
  try {
    const res = await UserService.getUsers()
    // Using res.data.users because our backend response is { message, users }
    users.value = res.data.users
  } catch (err: any) {
    console.error('Error loading users:', err)
  } finally {
    // Delay slightly for smooth transition if it's too fast
    setTimeout(() => {
      loading.value = false
    }, 400)
  }
}

function openCreate() {
  isEditing.value = false
  currentUserId.value = null
  form.value = { name: '', email: '', password: '', accountType: 'copywriter' }
  showForm.value = true
  formError.value = ''
  formSuccess.value = ''
}

function openEdit(user: AppUser) {
  isEditing.value = true
  currentUserId.value = user._id
  form.value = { 
    name: user.name, 
    email: user.email, 
    password: '', 
    accountType: user.accountType 
  }
  showForm.value = true
  formError.value = ''
  formSuccess.value = ''
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  if (!form.value.name || !form.value.email) {
    formError.value = 'Name and email are required'
    return
  }
  
  if (!isEditing.value && !form.value.password) {
    formError.value = 'Password is required for new users'
    return
  }

  submitting.value = true
  formError.value = ''
  formSuccess.value = ''
  
  try {
    if (isEditing.value && currentUserId.value) {
      const updateData: any = { ...form.value }
      if (!updateData.password) delete updateData.password
      
      const res = await UserService.updateUser(currentUserId.value, updateData)
      const index = users.value.findIndex(u => u._id === currentUserId.value)
      if (index !== -1) users.value[index] = res.data.user
      
      formSuccess.value = `User updated successfully`
    } else {
      const res = await UserService.createUser(form.value as any)
      users.value.unshift(res.data.user)
      formSuccess.value = `User created successfully`
    }
    
    showForm.value = false
    form.value = { name: '', email: '', password: '', accountType: 'copywriter' }
  } catch (e: unknown) {
    formError.value = (e as { message?: string })?.message || 'Error processing request'
  } finally {
    submitting.value = false
  }
}

async function deleteUser(id: string) {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    await UserService.deleteUser(id)
    users.value = users.value.filter(u => u._id !== id)
    formSuccess.value = 'User deleted successfully'
  } catch (e: unknown) {
    alert((e as { message?: string })?.message || 'Error deleting user')
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Users Management</h1>
        <p>Control access levels and manage team members.</p>
      </div>
      <button class="btn-primary" @click="showForm ? (showForm = false) : openCreate()">
        <i class="fa-solid" :class="showForm ? 'fa-xmark' : 'fa-plus'"></i>
        {{ showForm ? 'Cancel' : 'New User' }}
      </button>
    </div>

    <!-- CREATE/EDIT FORM -->
    <Transition name="slide">
      <div v-if="showForm" class="form-container">
        <div class="form-card">
          <div class="card-header">
            <h3>{{ isEditing ? 'Update User Details' : 'Onboard New User' }}</h3>
            <p>{{ isEditing ? 'Modify credentials and permissions.' : 'Add a new member to the platform.' }}</p>
          </div>
          
          <div class="form-grid">
            <div class="field">
              <label>Full Name</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-user"></i>
                <input v-model="form.name" type="text" placeholder="e.g. Diego Reyes" />
              </div>
            </div>
            <div class="field">
              <label>Email Address</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-envelope"></i>
                <input v-model="form.email" type="email" placeholder="diego@dicasadvisor.org" />
              </div>
            </div>
            <div class="field">
              <label>{{ isEditing ? 'New Password (Optional)' : 'Secure Password' }}</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-lock"></i>
                <input v-model="form.password" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div class="field">
              <label>Role / Access Level</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-shield-halved"></i>
                <select v-model="form.accountType">
                  <option value="copywriter">Copywriter</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <p v-if="formError" class="error-text"><i class="fa-solid fa-circle-exclamation"></i> {{ formError }}</p>
            <button class="btn-submit" @click="handleSubmit" :disabled="submitting">
              <span v-if="submitting" class="loader-sm"></span>
              {{ submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Account') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="formSuccess" class="success-banner">
      <i class="fa-solid fa-circle-check"></i>
      {{ formSuccess }}
      <button class="close-banner" @click="formSuccess = ''">×</button>
    </div>

    <!-- USERS LIST / SKELETON -->
    <div class="table-container">
      <table class="modern-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Joined</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- SKELETON STATE -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="skeleton-row">
              <td>
                <div class="skeleton-user">
                  <div class="skeleton-avatar"></div>
                  <div class="skeleton-text short"></div>
                </div>
              </td>
              <td><div class="skeleton-text medium"></div></td>
              <td><div class="skeleton-badge"></div></td>
              <td><div class="skeleton-text tiny"></div></td>
              <td>
                <div class="skeleton-actions">
                  <div class="skeleton-btn"></div>
                  <div class="skeleton-btn"></div>
                </div>
              </td>
            </tr>
          </template>

          <!-- REAL DATA -->
          <template v-else>
            <tr v-for="user in users" :key="user._id" class="data-row">
              <td>
                <div class="user-info">
                  <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </td>
              <td class="user-email">{{ user.email }}</td>
              <td>
                <span :class="['badge-role', user.accountType]">
                  {{ user.accountType }}
                </span>
              </td>
              <td class="user-date">{{ formatDate(user.createdAt) }}</td>
              <td class="user-actions">
                <button class="btn-action edit" @click="openEdit(user)" title="Edit User">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-action delete" @click="deleteUser(user._id)" title="Delete User">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="!loading && users.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-users-slash"></i>
        </div>
        <h3>No users found</h3>
        <p>Start by adding your first team member.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: $white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;

  h1 { 
    font-family: $font-luxury; 
    font-size: 2.2rem; 
    background: linear-gradient(135deg, $white 0%, rgba($white, 0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.2rem;
  }
  p { font-family: $font-principal; font-size: 0.95rem; color: rgba($white, 0.4); }
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: $font-principal;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba($primary, 0.2);

  &:hover { 
    background: $primary-light; 
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($primary, 0.3);
  }
  i { font-size: 0.8rem; }
}

// FORM STYLES
.form-container { margin-bottom: 2.5rem; }

.form-card {
  background: rgba($white, 0.02);
  border: 1px solid rgba($white, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  
  .card-header {
    margin-bottom: 1.8rem;
    h3 { font-family: $font-luxury; font-size: 1.3rem; margin-bottom: 0.3rem; }
    p { font-size: 0.85rem; color: rgba($white, 0.4); }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba($white, 0.3);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    i {
      position: absolute;
      left: 1rem;
      font-size: 0.9rem;
      color: rgba($white, 0.2);
      transition: color 0.3s;
    }

    input, select {
      width: 100%;
      background: rgba($white, 0.03);
      border: 1px solid rgba($white, 0.1);
      border-radius: 10px;
      padding: 0.9rem 1rem 0.9rem 2.8rem;
      color: $white;
      font-family: $font-principal;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.3s;

      &::placeholder { color: rgba($white, 0.15); }
      &:focus {
        border-color: rgba($primary, 0.5);
        background: rgba($white, 0.05);
        box-shadow: 0 0 0 4px rgba($primary, 0.05);
        & + i { color: $primary; }
      }
    }
    
    select { cursor: pointer; appearance: none; }
    select option { background: #111; color: $white; }
  }
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba($white, 0.05);
}

.error-text {
  font-size: 0.85rem;
  color: #ff4d4d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: $white;
  color: #000;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) { background: $primary; color: $primary-dark; transform: scale(1.02); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.loader-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

// MESSAGES
.success-banner {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  animation: fadeIn 0.4s ease;

  .close-banner {
    margin-left: auto;
    background: none;
    border: none;
    color: inherit;
    font-size: 1.4rem;
    cursor: pointer;
    line-height: 1;
  }
}

// TABLE STYLES
.table-container {
  background: rgba($white, 0.01);
  border: 1px solid rgba($white, 0.05);
  border-radius: 20px;
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    padding: 1.2rem 1.5rem;
    text-align: left;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba($white, 0.25);
    background: rgba($white, 0.01);
    border-bottom: 1px solid rgba($white, 0.05);
  }

  td {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid rgba($white, 0.03);
    vertical-align: middle;
  }

  .text-center { text-align: center; }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(45deg, rgba($primary, 0.2), rgba($primary, 0.05));
  border: 1px solid rgba($primary, 0.1);
  color: $primary;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.user-name { font-weight: 600; color: $white; }
.user-email { color: rgba($white, 0.5); font-size: 0.9rem; }

.badge-role {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;

  &.admin { background: rgba($primary, 0.1); color: $primary; border: 1px solid rgba($primary, 0.1); }
  &.copywriter { background: rgba($white, 0.05); color: rgba($white, 0.4); border: 1px solid rgba($white, 0.05); }
}

.user-date { font-size: 0.8rem; color: rgba($white, 0.3); }

.user-actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba($white, 0.08);
  background: rgba($white, 0.02);
  color: rgba($white, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { transform: translateY(-2px); }
  &.edit:hover { color: $primary; border-color: rgba($primary, 0.3); background: rgba($primary, 0.05); }
  &.delete:hover { color: #ff4d4d; border-color: rgba(#ff4d4d, 0.3); background: rgba(#ff4d4d, 0.05); }
}

// SKELETON ANIMATION
.skeleton-row td { padding: 1.2rem 1.5rem; }

.skeleton-text, .skeleton-avatar, .skeleton-badge, .skeleton-btn {
  background: linear-gradient(90deg, rgba($white, 0.03) 25%, rgba($white, 0.06) 50%, rgba($white, 0.03) 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
  border-radius: 4px;
}

.skeleton-user { display: flex; align-items: center; gap: 1rem; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; }

.skeleton-text { height: 12px; }
.skeleton-text.short { width: 100px; }
.skeleton-text.medium { width: 160px; }
.skeleton-text.tiny { width: 60px; }

.skeleton-badge { width: 80px; height: 24px; border-radius: 50px; }

.skeleton-actions { display: flex; justify-content: center; gap: 0.8rem; }
.skeleton-btn { width: 36px; height: 36px; border-radius: 10px; }

@keyframes loading-skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.empty-state {
  padding: 5rem 2rem;
  text-align: center;
  
  .empty-icon {
    font-size: 3rem;
    color: rgba($white, 0.05);
    margin-bottom: 1.5rem;
  }
  h3 { font-family: $font-luxury; font-size: 1.5rem; margin-bottom: 0.5rem; color: rgba($white, 0.6); }
  p { color: rgba($white, 0.2); font-size: 0.9rem; }
}

// TRANSITIONS
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
