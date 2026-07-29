<template>
  <div class="rich-editor">
    <Editor
      v-model="content"
      :init="editorConfig"
      :disabled="disabled"
      @onSelectionChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'

// TinyMCE 核心
import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/models/dom'

// 插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
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
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/autosave'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  height: { type: Number, default: 400 },
})

const emit = defineEmits(['update:modelValue', 'change'])

const content = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  },
})

const handleChange = () => {
  emit('change', content.value)
}

// 图片上传处理
const handleImageUpload = (blobInfo: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res: any) => {
        const url = res?.data?.url || res?.url
        if (url) {
          resolve(url)
        } else {
          reject('上传失败：未获取到URL')
        }
      })
      .catch((err) => {
        reject('图片上传失败: ' + err.message)
      })
  })
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
  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblock code codesample fullscreen insertdatetime media table wordcount emoticons autosave',
  toolbar: [
    'undo redo | styles | bold italic underline strikethrough | forecolor backcolor',
    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table blockquote codesample | emoticons | fullscreen code',
  ],
  toolbar_sticky: true,
  toolbar_sticky_offset: 0,
  z_index: 9999,
  // 图片上传
  images_upload_handler: handleImageUpload,
  automatic_uploads: true,
  // 粘贴处理
  paste_data_images: true,
  // 表格
  table_default_styles: { 'border-collapse': 'collapse', width: '100%' },
  table_responsive_width: true,
  // 链接
  link_default_target: '_blank',
  link_assume_external_targets: true,
  // 代码块
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
  // 样式选择
  style_formats: [
    { title: '标题 1', format: 'h1' },
    { title: '标题 2', format: 'h2' },
    { title: '标题 3', format: 'h3' },
    { title: '正文', format: 'p' },
  ],
  // 自动保存
  autosave_interval: '30s',
  autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  // 快捷键
  setup: (editor: any) => {
    editor.on('init', () => {
      // 初始化完成
    })
  },
}
</script>

<style scoped>
.rich-editor {
  width: 100%;
}

/* 覆盖 TinyMCE 默认样式，适配 Element Plus */
:deep(.tox-tinymce) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.tox .tox-toolbar) {
  background: #fafafa;
}

:deep(.tox .tox-toolbar__group) {
  border: none;
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
