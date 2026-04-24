<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const linkUrl = ref('')
const imageUrl = ref('')
const showLinkDialog = ref(false)
const showImageDialog = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder: 'Escribe el contenido del artículo aquí...' }),
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, { emitUpdate: false })
  }
})

function setLink() {
  if (!linkUrl.value) {
    editor.value?.chain().focus().unsetLink().run()
  } else {
    editor.value?.chain().focus().setLink({ href: linkUrl.value }).run()
  }
  linkUrl.value = ''
  showLinkDialog.value = false
}

function insertImage() {
  if (imageUrl.value) {
    editor.value?.chain().focus().setImage({ src: imageUrl.value }).run()
    imageUrl.value = ''
    showImageDialog.value = false
  }
}

async function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const formData = new FormData()
    formData.append('image', file)
    const token = localStorage.getItem('access_token')
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100/api'}/upload/image`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
    )
    if (!res.ok) throw new Error((await res.json()).message || 'Error al subir')
    const data = await res.json()
    editor.value?.chain().focus().setImage({ src: data.url }).run()
    showImageDialog.value = false
  } catch (err: unknown) {
    uploadError.value = (err as Error).message || 'Error al subir imagen'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function openLinkDialog() {
  linkUrl.value = editor.value?.getAttributes('link').href || ''
  showLinkDialog.value = true
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="blog-editor">
    <!-- TOOLBAR -->
    <div v-if="editor" class="editor-toolbar">
      <!-- History -->
      <div class="toolbar-group">
        <button class="tool-btn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="Deshacer">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
        <button class="tool-btn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="Rehacer">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Headings -->
      <div class="toolbar-group">
        <button
          class="tool-btn tool-text"
          :class="{ active: editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          title="Título 1"
        >H1</button>
        <button
          class="tool-btn tool-text"
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          title="Título 2"
        >H2</button>
        <button
          class="tool-btn tool-text"
          :class="{ active: editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          title="Título 3"
        >H3</button>
        <button
          class="tool-btn tool-text"
          :class="{ active: editor.isActive('paragraph') && !editor.isActive('heading') }"
          @click="editor.chain().focus().setParagraph().run()"
          title="Párrafo"
        >P</button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Formatting -->
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
          title="Negrita"
        ><i class="fa-solid fa-bold"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
          title="Cursiva"
        ><i class="fa-solid fa-italic"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
          title="Subrayado"
        ><i class="fa-solid fa-underline"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
          title="Tachado"
        ><i class="fa-solid fa-strikethrough"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('code') }"
          @click="editor.chain().focus().toggleCode().run()"
          title="Código inline"
        ><i class="fa-solid fa-code"></i></button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: editor.isActive({ textAlign: 'left' }) }"
          @click="editor.chain().focus().setTextAlign('left').run()"
          title="Alinear izquierda"
        ><i class="fa-solid fa-align-left"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive({ textAlign: 'center' }) }"
          @click="editor.chain().focus().setTextAlign('center').run()"
          title="Centrar"
        ><i class="fa-solid fa-align-center"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive({ textAlign: 'right' }) }"
          @click="editor.chain().focus().setTextAlign('right').run()"
          title="Alinear derecha"
        ><i class="fa-solid fa-align-right"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive({ textAlign: 'justify' }) }"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          title="Justificar"
        ><i class="fa-solid fa-align-justify"></i></button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
          title="Lista con viñetas"
        ><i class="fa-solid fa-list-ul"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
          title="Lista numerada"
        ><i class="fa-solid fa-list-ol"></i></button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Blocks -->
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
          title="Cita"
        ><i class="fa-solid fa-quote-left"></i></button>
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          title="Bloque de código"
        ><i class="fa-solid fa-terminal"></i></button>
        <button
          class="tool-btn"
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="Línea separadora"
        ><i class="fa-solid fa-minus"></i></button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Link & Image -->
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: editor.isActive('link') }"
          @click="openLinkDialog"
          title="Insertar enlace"
        ><i class="fa-solid fa-link"></i></button>
        <button
          class="tool-btn"
          @click="showImageDialog = true"
          title="Insertar imagen"
        ><i class="fa-solid fa-image"></i></button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Clear -->
      <div class="toolbar-group">
        <button
          class="tool-btn tool-danger"
          @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
          title="Limpiar formato"
        ><i class="fa-solid fa-eraser"></i></button>
      </div>
    </div>

    <!-- LINK DIALOG -->
    <Transition name="dialog">
      <div v-if="showLinkDialog" class="inline-dialog">
        <input v-model="linkUrl" type="url" placeholder="https://..." @keyup.enter="setLink" @keyup.escape="showLinkDialog = false" autofocus />
        <button class="dialog-btn" @click="setLink">Aplicar</button>
        <button class="dialog-btn dialog-cancel" @click="showLinkDialog = false">Cancelar</button>
      </div>
    </Transition>

    <!-- IMAGE DIALOG -->
    <Transition name="dialog">
      <div v-if="showImageDialog" class="inline-dialog image-dialog">
        <div class="image-dialog-tabs">
          <label class="upload-tab">
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style="display:none"
              @change="handleFileUpload"
            />
            <button class="dialog-btn upload-btn" :disabled="uploading" @click="fileInput?.click()">
              <i class="fa-solid fa-upload"></i>
              {{ uploading ? 'Subiendo...' : 'Subir archivo' }}
            </button>
          </label>
          <span class="dialog-sep">o</span>
          <input v-model="imageUrl" type="url" placeholder="Pegar URL de imagen..." @keyup.enter="insertImage" @keyup.escape="showImageDialog = false" />
          <button class="dialog-btn" @click="insertImage" :disabled="!imageUrl">Insertar URL</button>
          <button class="dialog-btn dialog-cancel" @click="showImageDialog = false; uploadError = ''">Cancelar</button>
        </div>
        <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
      </div>
    </Transition>

    <!-- EDITOR AREA -->
    <EditorContent :editor="editor" class="editor-area" />

    <!-- Word count -->
    <div v-if="editor" class="editor-footer">
      <span>{{ editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length }} palabras</span>
      <span>{{ editor.getText().length }} caracteres</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-editor {
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: rgba($primary, 0.4);
  }
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 0.8rem;
  background: rgba($white, 0.03);
  border-bottom: 1px solid rgba($white, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: rgba($white, 0.08);
  margin: 0 0.3rem;
}

.tool-btn {
  background: none;
  border: 1px solid transparent;
  color: rgba($white, 0.5);
  width: 30px;
  height: 30px;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  padding: 0;

  &:hover:not(:disabled) {
    background: rgba($white, 0.07);
    color: $white;
    border-color: rgba($white, 0.1);
  }

  &.active {
    background: rgba($primary, 0.15);
    color: $primary;
    border-color: rgba($primary, 0.3);
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  &.tool-text {
    font-family: $font-principal;
    font-size: 0.72rem;
    font-weight: 700;
    width: 28px;
  }

  &.tool-danger:hover {
    color: #ef4444;
    background: rgba(#ef4444, 0.08);
    border-color: rgba(#ef4444, 0.2);
  }
}

.inline-dialog {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  background: rgba($primary, 0.05);
  border-bottom: 1px solid rgba($primary, 0.15);

  input {
    flex: 1;
    background: rgba($white, 0.06);
    border: 1px solid rgba($white, 0.12);
    border-radius: 5px;
    padding: 0.4rem 0.7rem;
    color: $white;
    font-family: $font-principal;
    font-size: 0.85rem;
    outline: none;
    &::placeholder { color: rgba($white, 0.25); }
    &:focus { border-color: $primary; }
  }
}

.dialog-btn {
  background: $primary;
  color: $primary-dark;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 5px;
  font-family: $font-principal;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &.dialog-cancel {
    background: rgba($white, 0.06);
    color: rgba($white, 0.6);
    &:hover { background: rgba($white, 0.1); }
  }
}

.image-dialog { flex-direction: column; align-items: stretch; gap: 0.6rem; }

.image-dialog-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dialog-sep {
  font-family: $font-principal;
  font-size: 0.75rem;
  color: rgba($white, 0.25);
  flex-shrink: 0;
}

.upload-btn {
  background: rgba($white, 0.07);
  color: rgba($white, 0.7);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  i { font-size: 0.8rem; }

  &:hover:not(:disabled) { background: rgba($primary, 0.15); color: $primary; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.upload-error {
  font-family: $font-principal;
  font-size: 0.8rem;
  color: #ef4444;
  margin: 0;
}

.dialog-enter-active, .dialog-leave-active { transition: all 0.15s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; transform: translateY(-4px); }

.editor-area {
  min-height: 420px;
  cursor: text;

  :deep(.tiptap) {
    padding: 1.2rem 1.4rem;
    min-height: 420px;
    outline: none;
    font-family: $font-principal;
    font-size: 0.95rem;
    line-height: 1.8;
    color: rgba($white, 0.85);

    p { margin-bottom: 1rem; }

    h1 {
      font-family: $font-luxury;
      font-size: 2rem;
      color: $white;
      margin: 1.5rem 0 0.8rem;
      line-height: 1.2;
    }

    h2 {
      font-family: $font-luxury;
      font-size: 1.5rem;
      color: $white;
      margin: 1.4rem 0 0.7rem;
      border-bottom: 1px solid rgba($primary, 0.2);
      padding-bottom: 0.4rem;
    }

    h3 {
      font-family: $font-luxury;
      font-size: 1.2rem;
      color: $primary-light;
      margin: 1.2rem 0 0.6rem;
    }

    strong { color: $white; font-weight: 700; }

    em { color: rgba($white, 0.8); }

    u { text-decoration-color: rgba($primary, 0.6); }

    s { color: rgba($white, 0.4); }

    code {
      background: rgba($white, 0.08);
      color: $primary-light;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.88rem;
      font-family: 'Courier New', monospace;
    }

    pre {
      background: rgba($white, 0.05);
      border: 1px solid rgba($white, 0.08);
      border-radius: 8px;
      padding: 1rem 1.2rem;
      overflow-x: auto;
      margin: 1.2rem 0;

      code {
        background: none;
        color: #a8e6a3;
        padding: 0;
        font-size: 0.88rem;
      }
    }

    blockquote {
      border-left: 3px solid $primary;
      padding-left: 1.2rem;
      margin: 1.2rem 0;
      color: rgba($white, 0.6);
      font-style: italic;
    }

    ul {
      list-style: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
      li { margin-bottom: 0.4rem; }
    }

    ol {
      list-style: decimal;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
      li { margin-bottom: 0.4rem; }
    }

    a {
      color: $primary;
      text-decoration: underline;
      text-underline-offset: 3px;
      &:hover { color: $primary-light; }
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1rem 0;
      border: 1px solid rgba($white, 0.08);
    }

    hr {
      border: none;
      border-top: 1px solid rgba($white, 0.1);
      margin: 2rem 0;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: rgba($white, 0.2);
      pointer-events: none;
      float: left;
      height: 0;
    }
  }
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid rgba($white, 0.05);
  font-family: $font-principal;
  font-size: 0.72rem;
  color: rgba($white, 0.25);
}
</style>
