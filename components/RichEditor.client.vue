<template>
  <div class="rich-editor">
    <Editor
      v-model="content"
      :init="editorConfig"
      :disabled="disabled"
      @init="onEditorInit"
    />
    <!-- 隐藏的文件上传 input -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/autosave'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  height: { type: Number, default: 400 },
})

const emit = defineEmits(['update:modelValue', 'change'])

const content = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const fileInput = ref<HTMLInputElement>()
let editorInstance: any = null

// 编辑器初始化完成后注册自定义按钮
const onEditorInit = (_event: any, editor: any) => {
  editorInstance = editor
}

// 选择文件后上传并插入
const onFileSelected = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file || !editorInstance) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res: any = await $fetch('/api/upload', { method: 'POST', body: formData })
    const url = res?.data?.url || res?.url
    if (url) {
      editorInstance.insertContent(`<img src="${url}" alt="${file.name}" style="max-width:100%;" />`)
    }
  } catch (err) {
    console.error('图片上传失败:', err)
  }

  // 清空 input
  if (fileInput.value) fileInput.value.value = ''
}

// 点击自定义图片按钮
const triggerUpload = () => {
  fileInput.value?.click()
}

const editorConfig = {
  base_url: '/tinymce',
  suffix: '.min',
  language: 'zh_CN',
  language_url: '/tinymce/langs/zh_CN.js',
  height: props.height,
  menubar: false,
  branding: false,
  promotion: false,
  skin: 'oxide',
  content_css: 'default',
  content_style: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: #303133;
      padding: 16px 20px;
    }
    h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; color: #1a1a2e; }
    h2 { font-size: 22px; font-weight: 700; margin: 20px 0 10px; color: #1a1a2e; }
    h3 { font-size: 18px; font-weight: 700; margin: 16px 0 8px; color: #1a1a2e; }
    p { margin: 8px 0; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    blockquote {
      border-left: 4px solid #1a73e8;
      padding: 12px 16px;
      margin: 12px 0;
      color: #606266;
      background: #f5f7fa;
      border-radius: 0 4px 4px 0;
    }
    a { color: #1a73e8; }
  `,
  // 注意：不包含 image 插件！
  plugins: 'advlist autolink lists link charmap preview anchor searchreplace visualblock code codesample fullscreen insertdatetime media table wordcount autosave',
  toolbar: 'undo redo | styles | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link customimage media | table blockquote codesample | fullscreen code',
  // 注册自定义图片按钮
  setup: (editor: any) => {
    editor.ui.registry.addButton('customimage', {
      icon: 'image',
      tooltip: '插入图片',
      onAction: () => {
        triggerUpload()
      },
    })
  },
  toolbar_sticky: true,
  toolbar_sticky_offset: 0,
  automatic_uploads: true,
  paste_data_images: true,
  table_default_styles: { 'border-collapse': 'collapse', width: '100%' },
  table_responsive_width: true,
  link_default_target: '_blank',
  link_assume_external_targets: true,
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'SQL', value: 'sql' },
    { text: 'Bash', value: 'bash' },
  ],
  style_formats: [
    { title: '标题 1', format: 'h1' },
    { title: '标题 2', format: 'h2' },
    { title: '标题 3', format: 'h3' },
    { title: '正文', format: 'p' },
  ],
  autosave_interval: '30s',
  autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
  autosave_restore_when_empty: false,
}
</script>

<style scoped>
.rich-editor { width: 100%; }

:deep(.tox-tinymce) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.tox .tox-toolbar) {
  background: #fafafa;
}

:deep(.tox .tox-tbtn) {
  border-radius: 4px;
}

:deep(.tox .tox-tbtn:hover) {
  background: #ecf5ff;
}

:deep(.tox .tox-tbtn--enabled) {
  background: #ecf5ff;
  color: #409eff;
}
</style>
