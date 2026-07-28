<template>
  <div class="image-cropper-wrapper">
    <!-- 已有图片 -->
    <div v-if="modelValue" class="image-preview">
      <img :src="modelValue" class="avatar" />
      <div class="image-actions">
        <el-upload
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="uploadImage"
          accept="image/*"
        >
          <el-button size="small" type="primary">更换</el-button>
        </el-upload>
        <el-button size="small" type="danger" @click="clearImage">删除</el-button>
      </div>
    </div>

    <!-- 无图片时显示上传区 -->
    <div v-else class="upload-zone">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="uploadImage"
        accept="image/*"
        drag
      >
        <div class="upload-content">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <div class="upload-text">点击或拖拽图片到此区域</div>
        </div>
      </el-upload>
      <div class="paste-area">
        <el-button size="small" @click="triggerPaste">
          <el-icon class="mr-1"><CopyDocument /></el-icon>
          从剪贴板粘贴
        </el-button>
        <span class="paste-tip">也可以 Ctrl+V 粘贴（支持 Word/截图/网页图片）</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, CopyDocument } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleGlobalPaste = async (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items || items.length === 0) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file && file.size > 0) {
        // 只接受图片类型，或者无类型但有内容的文件
        if (file.type.startsWith('image/') || file.type === '') {
          e.preventDefault()
          ElMessage.info(`检测到图片: ${file.type || '未知类型'}, 大小: ${(file.size / 1024).toFixed(1)}KB, 正在上传...`)
          await uploadFile(file)
          return
        }
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('paste', handleGlobalPaste as EventListener, true)
})

onUnmounted(() => {
  document.removeEventListener('paste', handleGlobalPaste as EventListener, true)
})

const triggerPaste = async () => {
  try {
    const items = await navigator.clipboard.read()
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type)
          const ext = type.split('/')[1] || 'png'
          await uploadFile(new File([blob], `image.${ext}`, { type }))
          return
        }
      }
    }
    ElMessage.info('剪贴板中没有图片')
  } catch (err) {
    ElMessage.info('请直接按 Ctrl+V 粘贴图片')
  }
}

const deleteOldImage = async (url: string) => {
  if (!url) return
  try {
    await $fetch('/api/upload', {
      method: 'DELETE',
      body: { url }
    })
  } catch (error) {
    console.error('删除旧图片失败:', error)
  }
}

const beforeUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  return true
}

const uploadFile = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    if (response.success) {
      if (props.modelValue) {
        await deleteOldImage(props.modelValue)
      }
      emit('update:modelValue', response.data.url)
      ElMessage.success('图片上传成功!')
    } else {
      ElMessage.error('图片上传失败!')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('图片上传失败，请重试!')
  }
}

const uploadImage = async (options: any) => {
  await uploadFile(options.file)
}

const clearImage = async () => {
  if (props.modelValue) {
    await deleteOldImage(props.modelValue)
  }
  emit('update:modelValue', '')
}
</script>

<style scoped>
.image-cropper-wrapper {
  display: inline-block;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--el-border-color);
}

.image-actions {
  display: flex;
  gap: 8px;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-text {
  font-size: 12px;
  color: #8c939d;
  margin-top: 8px;
}

.paste-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.paste-tip {
  font-size: 12px;
  color: #8c939d;
}
</style>
