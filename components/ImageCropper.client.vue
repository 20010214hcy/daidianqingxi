<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="uploadImage"
      accept="image/*"
    >
      <img v-if="modelValue" :src="modelValue" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div v-if="modelValue" class="mt-3">
      <el-button type="danger" link size="small" @click="clearImage">移除图片</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  },
  aspectRatio: {
    type: Array,
    default: () => [1, 1]
  }
})

const emit = defineEmits(['update:modelValue'])

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
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  return true
}

const uploadImage = async (options: any) => {
  const { file } = options
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await $fetch('/api/upload', {
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

const clearImage = async () => {
  if (props.modelValue) {
    await deleteOldImage(props.modelValue)
  }
  emit('update:modelValue', '')
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 6px;
  object-fit: cover;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
