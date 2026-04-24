<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore, type PostFormData } from '@/stores/blog'
import BlogService from '@/services/blog.service'
import BlogEditor from '@/components/BlogEditor.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const postId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!postId.value)

const form = ref<PostFormData>({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [],
  status: 'draft',
})
const tagsInput = ref('')
const saving = ref(false)
const error = ref('')

const coverFileInput = ref<HTMLInputElement | null>(null)
const coverUploading = ref(false)
const coverError = ref('')
const isDragging = ref(false)
const coverPublicId = ref('')

const slugPreview = computed(() =>
  form.value.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
)

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await BlogService.getAdminPosts()
      const post = res.data.find(p => p._id === postId.value)
      if (post) {
        form.value = {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          tags: post.tags || [],
          status: post.status,
        }
        tagsInput.value = post.tags?.join(', ') || ''
      }
    } catch {}
  }
})

async function uploadCover(file: File) {
  if (!file.type.startsWith('image/')) {
    coverError.value = 'Solo se permiten imágenes'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    coverError.value = 'Máximo 10 MB'
    return
  }
  coverUploading.value = true
  coverError.value = ''
  try {
    const formData = new FormData()
    formData.append('image', file)
    const token = localStorage.getItem('access_token')
    const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8100/api'
    const res = await fetch(`${base}/upload/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error((await res.json()).message || 'Error al subir')
    const data = await res.json()
    form.value.coverImage = data.url
    coverPublicId.value = data.publicId || ''
  } catch (err: unknown) {
    coverError.value = (err as Error).message || 'Error al subir imagen'
  } finally {
    coverUploading.value = false
  }
}

function onCoverFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadCover(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadCover(file)
}

async function removeCover() {
  if (coverPublicId.value) {
    try {
      const token = localStorage.getItem('access_token')
      const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8100/api'
      await fetch(`${base}/upload/image`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: coverPublicId.value }),
      })
    } catch {}
    coverPublicId.value = ''
  }
  form.value.coverImage = ''
  coverError.value = ''
  if (coverFileInput.value) coverFileInput.value.value = ''
}

async function save() {
  if (!form.value.title || !form.value.excerpt || !form.value.content) {
    error.value = 'Título, extracto y contenido son requeridos'
    return
  }
  saving.value = true
  error.value = ''
  form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  try {
    if (isEdit.value) {
      await blogStore.updatePost(postId.value!, form.value)
    } else {
      await blogStore.createPost(form.value)
    }
    router.push('/editor/posts')
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="post-edit-page">
    <div class="page-header">
      <div>
        <h1>{{ isEdit ? 'Editar artículo' : 'Nuevo artículo' }}</h1>
        <p v-if="slugPreview" class="slug-preview">URL: /blog/{{ slugPreview }}</p>
      </div>
      <div class="header-actions">
        <router-link to="/editor/posts" class="btn-cancel">Cancelar</router-link>
        <button class="btn-save" @click="save" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>

    <div class="form-layout">
      <div class="form-main">
        <div class="field">
          <label>Título *</label>
          <input v-model="form.title" type="text" placeholder="Título del artículo" />
        </div>
        <div class="field">
          <label>Extracto * <span class="char-count">{{ form.excerpt?.length || 0 }}/300</span></label>
          <textarea v-model="form.excerpt" rows="3" maxlength="300" placeholder="Resumen corto del artículo (máx 300 caracteres)"></textarea>
        </div>
        <div class="field field-content">
          <label>Contenido *</label>
          <BlogEditor v-model="form.content" />
        </div>
      </div>

      <div class="form-sidebar">

        <!-- COVER IMAGE -->
        <div class="sidebar-card cover-card">
          <h3>Imagen de portada</h3>

          <div v-if="form.coverImage" class="cover-preview-wrap">
            <img :src="form.coverImage" alt="Portada" class="cover-preview-img" />
            <div class="cover-preview-actions">
              <button class="cover-action-btn" @click="coverFileInput?.click()" :disabled="coverUploading">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                {{ coverUploading ? 'Subiendo...' : 'Cambiar' }}
              </button>
              <button class="cover-action-btn cover-remove-btn" @click="removeCover">
                <i class="fa-solid fa-trash"></i>
                Eliminar
              </button>
            </div>
          </div>

          <div
            v-else
            class="cover-dropzone"
            :class="{ 'is-dragging': isDragging, 'is-uploading': coverUploading }"
            @click="coverFileInput?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div v-if="coverUploading" class="dropzone-uploading">
              <div class="upload-spinner"></div>
              <p>Subiendo a Cloudinary...</p>
            </div>
            <div v-else class="dropzone-idle">
              <div class="dropzone-icon">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <p class="dropzone-text">Arrastra una imagen aquí</p>
              <p class="dropzone-sub">o haz clic para seleccionar</p>
              <p class="dropzone-hint">JPG, PNG, WebP · Máx 10 MB</p>
            </div>
          </div>

          <p v-if="coverError" class="cover-error">{{ coverError }}</p>

          <div class="cover-url-fallback">
            <label>O pega una URL</label>
            <input
              v-model="form.coverImage"
              type="url"
              placeholder="https://..."
              @input="coverError = ''"
            />
          </div>

          <input
            ref="coverFileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style="display:none"
            @change="onCoverFileChange"
          />
        </div>

        <!-- STATUS -->
        <div class="sidebar-card">
          <h3>Publicación</h3>
          <div class="field">
            <label>Estado</label>
            <select v-model="form.status">
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <!-- TAGS -->
        <div class="sidebar-card">
          <h3>Etiquetas</h3>
          <div class="field">
            <label>Separadas por coma</label>
            <input v-model="tagsInput" type="text" placeholder="tax, finanzas, negocios" />
          </div>
          <div v-if="tagsInput" class="tags-preview">
            <span v-for="tag in tagsInput.split(',').filter(t => t.trim())" :key="tag" class="tag">{{ tag.trim() }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-edit-page { color: $white; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 { font-family: $font-luxury; font-size: 1.8rem; color: $white; margin-bottom: 0.3rem; }
}

.slug-preview { font-family: $font-principal; font-size: 0.78rem; color: rgba($white, 0.3); }
.header-actions { display: flex; gap: 0.8rem; align-items: center; }

.btn-cancel {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: rgba($white, 0.5);
  text-decoration: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  border: 1px solid rgba($white, 0.1);
  transition: all 0.2s;
  &:hover { border-color: rgba($white, 0.2); color: $white; }
}

.btn-save {
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) { background: $primary-light; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.form-error {
  font-family: $font-principal;
  font-size: 0.85rem;
  color: #ef4444;
  background: rgba(#ef4444, 0.08);
  border: 1px solid rgba(#ef4444, 0.2);
  padding: 0.7rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
  @media (max-width: 960px) { grid-template-columns: 1fr; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;

  label {
    font-family: $font-principal;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba($white, 0.4);
    display: flex;
    justify-content: space-between;
  }

  input, textarea, select {
    background: rgba($white, 0.04);
    border: 1px solid rgba($white, 0.1);
    border-radius: 6px;
    padding: 0.8rem 1rem;
    color: $white;
    font-family: $font-principal;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
    &::placeholder { color: rgba($white, 0.2); }
    &:focus { border-color: $primary; }
  }
  select option { background: #1a1a1a; }
}

.field-content { margin-bottom: 0; }
.char-count { color: rgba($white, 0.25); font-weight: 400; letter-spacing: 0; text-transform: none; font-size: 0.72rem; }

.sidebar-card {
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.08);
  border-radius: 10px;
  padding: 1.3rem;
  margin-bottom: 1.2rem;

  h3 {
    font-family: $font-principal;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba($white, 0.4);
    margin-bottom: 1rem;
  }
}

.cover-card { padding: 1.3rem; }

.cover-dropzone {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px dashed rgba($white, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba($white, 0.02);
  overflow: hidden;
  margin-bottom: 1rem;

  &:hover {
    border-color: rgba($primary, 0.4);
    background: rgba($primary, 0.03);
  }

  &.is-dragging {
    border-color: $primary;
    background: rgba($primary, 0.06);
    transform: scale(1.01);
  }

  &.is-uploading { cursor: not-allowed; }
}

.dropzone-idle { text-align: center; padding: 1rem; }

.dropzone-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba($primary, 0.1);
  border: 1px solid rgba($primary, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.8rem;

  i { font-size: 1.3rem; color: $primary; }
}

.dropzone-text {
  font-family: $font-principal;
  font-size: 0.88rem;
  color: rgba($white, 0.6);
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.dropzone-sub {
  font-family: $font-principal;
  font-size: 0.78rem;
  color: rgba($white, 0.35);
  margin-bottom: 0.6rem;
}

.dropzone-hint {
  font-family: $font-principal;
  font-size: 0.68rem;
  color: rgba($white, 0.2);
  letter-spacing: 0.5px;
}

.dropzone-uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;

  p { font-family: $font-principal; font-size: 0.82rem; color: rgba($white, 0.5); }
}

.upload-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba($primary, 0.2);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.cover-preview-wrap {
  width: 100%;
  margin-bottom: 0.8rem;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.cover-preview-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

.cover-preview-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.cover-action-btn {
  flex: 1;
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.1);
  color: rgba($white, 0.6);
  padding: 0.5rem;
  border-radius: 6px;
  font-family: $font-principal;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba($primary, 0.1);
    border-color: rgba($primary, 0.3);
    color: $primary;
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }

  &.cover-remove-btn:hover {
    background: rgba(#ef4444, 0.08);
    border-color: rgba(#ef4444, 0.3);
    color: #ef4444;
  }
}

.cover-error {
  font-family: $font-principal;
  font-size: 0.8rem;
  color: #ef4444;
  margin-bottom: 0.6rem;
}

.cover-url-fallback {
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-family: $font-principal;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba($white, 0.25);
  }

  input {
    background: rgba($white, 0.03);
    border: 1px solid rgba($white, 0.07);
    border-radius: 6px;
    padding: 0.6rem 0.8rem;
    color: rgba($white, 0.6);
    font-family: $font-principal;
    font-size: 0.82rem;
    outline: none;
    transition: border-color 0.2s;
    &::placeholder { color: rgba($white, 0.15); }
    &:focus { border-color: rgba($primary, 0.3); }
  }
}

.tags-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.6rem; }

.tag {
  font-family: $font-principal;
  font-size: 0.7rem;
  font-weight: 600;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
}
</style>
