<template>
  <div class="tiptap-editor">
    <!-- 工具栏 -->
    <div class="tiptap-toolbar" v-if="editor">
      <button
        v-for="item in toolbarItems"
        :key="item.name"
        class="tiptap-btn"
        :class="{ 'is-active': item.isActive?.() }"
        :title="item.title"
        @click="item.action"
        :disabled="item.disabled?.()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(d, i) in item.icon" :key="i" :d="d" />
        </svg>
      </button>

      <!-- 图片上传 -->
      <button class="tiptap-btn" title="插入图片" @click="triggerImageUpload">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </button>
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />
    </div>

    <!-- 编辑器内容 -->
    <EditorContent :editor="editor" class="tiptap-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入内容...' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const imageInput = ref<HTMLInputElement>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({ inline: false, allowBase64: true }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    Placeholder.configure({ placeholder: props.placeholder }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
})

// 同步外部值
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, false)
  }
})

// 工具栏配置
const toolbarItems = computed(() => {
  if (!editor.value) return []
  const e = editor.value
  return [
    {
      name: 'bold', title: '加粗',
      icon: ['M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z', 'M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z'],
      action: () => e.chain().focus().toggleBold().run(),
      isActive: () => e.isActive('bold'),
      disabled: () => !e.can().chain().focus().toggleBold().run(),
    },
    {
      name: 'italic', title: '斜体',
      icon: ['M19 4h-9', 'M14 20H5', 'M15 4L9 20'],
      action: () => e.chain().focus().toggleItalic().run(),
      isActive: () => e.isActive('italic'),
      disabled: () => !e.can().chain().focus().toggleItalic().run(),
    },
    {
      name: 'underline', title: '下划线',
      icon: ['M6 3v7a6 6 0 006 6 6 6 0 006-6V3', 'M4 21h16'],
      action: () => e.chain().focus().toggleUnderline().run(),
      isActive: () => e.isActive('underline'),
      disabled: () => false,
    },
    {
      name: 'strike', title: '删除线',
      icon: ['M16 4H9a3 3 0 00-2.83 4', 'M14 12a4 4 0 010 8H6', 'M4 12h16'],
      action: () => e.chain().focus().toggleStrike().run(),
      isActive: () => e.isActive('strike'),
      disabled: () => !e.can().chain().focus().toggleStrike().run(),
    },
    { name: 'divider1', icon: [], action: () => {}, isActive: () => false },
    {
      name: 'h1', title: '标题1',
      icon: ['M4 12h8', 'M4 18V6', 'M12 18V6', 'M17 12l3-2v8'],
      action: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => e.isActive('heading', { level: 1 }),
      disabled: () => false,
    },
    {
      name: 'h2', title: '标题2',
      icon: ['M4 12h8', 'M4 18V6', 'M12 18V6', 'M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1'],
      action: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => e.isActive('heading', { level: 2 }),
      disabled: () => false,
    },
    {
      name: 'h3', title: '标题3',
      icon: ['M4 12h8', 'M4 18V6', 'M12 18V6', 'M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 01-2 2', 'M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 00-2-2'],
      action: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => e.isActive('heading', { level: 3 }),
      disabled: () => false,
    },
    { name: 'divider2', icon: [], action: () => {}, isActive: () => false },
    {
      name: 'bulletList', title: '无序列表',
      icon: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
      action: () => e.chain().focus().toggleBulletList().run(),
      isActive: () => e.isActive('bulletList'),
      disabled: () => false,
    },
    {
      name: 'orderedList', title: '有序列表',
      icon: ['M10 6h11', 'M10 12h11', 'M10 18h11', 'M3 5l2-1v6', 'M4 11H2l3-2', 'M3 17l2 1-2 1'],
      action: () => e.chain().focus().toggleOrderedList().run(),
      isActive: () => e.isActive('orderedList'),
      disabled: () => false,
    },
    {
      name: 'blockquote', title: '引用',
      icon: ['M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z', 'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z'],
      action: () => e.chain().focus().toggleBlockquote().run(),
      isActive: () => e.isActive('blockquote'),
      disabled: () => false,
    },
    { name: 'divider3', icon: [], action: () => {}, isActive: () => false },
    {
      name: 'alignLeft', title: '左对齐',
      icon: ['M17 10H3', 'M21 6H3', 'M21 14H3', 'M17 18H3'],
      action: () => e.chain().focus().setTextAlign('left').run(),
      isActive: () => e.isActive({ textAlign: 'left' }),
      disabled: () => false,
    },
    {
      name: 'alignCenter', title: '居中',
      icon: ['M18 10H6', 'M21 6H3', 'M21 14H3', 'M18 18H6'],
      action: () => e.chain().focus().setTextAlign('center').run(),
      isActive: () => e.isActive({ textAlign: 'center' }),
      disabled: () => false,
    },
    {
      name: 'alignRight', title: '右对齐',
      icon: ['M21 10H7', 'M21 6H3', 'M21 14H3', 'M21 18H7'],
      action: () => e.chain().focus().setTextAlign('right').run(),
      isActive: () => e.isActive({ textAlign: 'right' }),
      disabled: () => false,
    },
    { name: 'divider4', icon: [], action: () => {}, isActive: () => false },
    {
      name: 'hardBreak', title: '换行',
      icon: ['M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z', 'M13 2v7h7'],
      action: () => e.chain().focus().setHardBreak().run(),
      isActive: () => false,
      disabled: () => false,
    },
    {
      name: 'undo', title: '撤销',
      icon: ['M3 7v6h6', 'M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13'],
      action: () => e.chain().focus().undo().run(),
      isActive: () => false,
      disabled: () => !e.can().chain().focus().undo().run(),
    },
    {
      name: 'redo', title: '重做',
      icon: ['M21 7v6h-6', 'M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13'],
      action: () => e.chain().focus().redo().run(),
      isActive: () => false,
      disabled: () => !e.can().chain().focus().redo().run(),
    },
  ]
})

// 图片上传
const triggerImageUpload = () => imageInput.value?.click()

const handleImageUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res: any = await $fetch('/api/upload', { method: 'POST', body: formData })
    const url = res?.data?.url || res?.url
    if (url && editor.value) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  } catch (err) {
    console.error('图片上传失败:', err)
  }

  if (imageInput.value) imageInput.value.value = ''
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style>
/* Tiptap 编辑器样式 - 非 scoped 以便渲染内容也生效 */
.tiptap-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.tiptap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: #606266;
  transition: all 0.15s;
}

.tiptap-btn:hover { background: #ecf5ff; color: #409eff; }
.tiptap-btn.is-active { background: #ecf5ff; color: #409eff; }
.tiptap-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tiptap-btn svg { width: 16px; height: 16px; }

/* 分隔线 */
.tiptap-btn[title=""] {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  cursor: default;
  padding: 0;
  margin: 0 4px;
}

.tiptap-btn[title=""]:hover { background: #dcdfe6; }

/* 编辑区域 */
.tiptap-content {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

.tiptap-content .tiptap {
  padding: 16px 20px;
  outline: none;
  min-height: 380px;
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
}

/* Placeholder */
.tiptap-content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* 内容样式 */
.tiptap-content .tiptap h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; color: #1a1a2e; }
.tiptap-content .tiptap h2 { font-size: 22px; font-weight: 700; margin: 20px 0 10px; color: #1a1a2e; }
.tiptap-content .tiptap h3 { font-size: 18px; font-weight: 700; margin: 16px 0 8px; color: #1a1a2e; }
.tiptap-content .tiptap p { margin: 8px 0; }
.tiptap-content .tiptap ul { list-style: disc; padding-left: 24px; margin: 8px 0; }
.tiptap-content .tiptap ol { list-style: decimal; padding-left: 24px; margin: 8px 0; }
.tiptap-content .tiptap blockquote {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 12px 0;
  color: #606266;
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
}
.tiptap-content .tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 12px 0;
}
.tiptap-content .tiptap a { color: #409eff; text-decoration: underline; }
.tiptap-content .tiptap a:hover { color: #66b1ff; }

/* 渲染页面也能用的样式 */
.w-e-text-container { display: none; }
</style>
