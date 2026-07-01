<template>
  <div class="admin-page-container">
    <AdminPageHeader title="个人资料" description="管理您的个人信息" />

    <el-card>
      
      <el-form
        ref="profileFormRef"
        :model="profileForm"
        :rules="formRules"
        label-width="100px"
        class="max-w-2xl mx-auto"
      >
        <div class="text-center mb-8">
          <el-avatar :size="120" :src="profileForm.avatar" class="bg-blue-100 text-blue-600">
            {{ (profileForm.name?.[0] || profileForm.username?.[0] || '管').toUpperCase() }}
          </el-avatar>
          <div class="mt-4">
            <el-upload
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              accept="image/*"
            >
              <el-button size="small">更换头像</el-button>
            </el-upload>
          </div>
        </div>
        
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" placeholder="请输入登录用户名" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" placeholder="请输入您的姓名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" type="email" placeholder="请输入邮箱地址" />
        </el-form-item>
        
        <el-divider content-position="left">修改密码</el-divider>
        
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="profileForm.oldPassword" type="password" placeholder="如需修改密码请输入旧密码" show-password />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="profileForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="profileForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="loading">保存更改</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, UploadUserFile, UploadRawFile, FormRules } from 'element-plus'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '个人资料 - 后台管理'
})

const { user, updateUser } = useAuth()
const profileFormRef = ref<FormInstance>()
const loading = ref(false)

const profileForm = reactive({
  id: 0,
  username: '',
  name: '',
  email: '',
  avatar: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const validateConfirmPassword = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && value !== profileForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validatePasswordLength = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && value.length < 6) {
    callback(new Error('密码长度至少6位'))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  newPassword: [
    { validator: validatePasswordLength, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const loadProfile = async () => {
  try {
    const response = await $fetch('/api/auth/profile')
    if (response.success && response.data) {
      Object.assign(profileForm, response.data)
      updateUser(response.data)
      profileForm.oldPassword = ''
      profileForm.newPassword = ''
      profileForm.confirmPassword = ''
    }
  } catch (error) {
    console.error('加载用户信息失败', error)
    ElMessage.error('加载用户信息失败')
  }
}

const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = async (options: { file: File }) => {
  const formData = new FormData()
  formData.append('file', options.file)
  
  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success && response.data) {
      profileForm.avatar = response.data.url
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(response.message || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败', error)
    ElMessage.error('头像上传失败')
  }
}

const handleSave = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 准备提交数据
        const submitData: Record<string, string> = {
          username: profileForm.username,
          name: profileForm.name,
          email: profileForm.email,
          avatar: profileForm.avatar
        }

        // 如果修改了密码
        if (profileForm.newPassword) {
          submitData.oldPassword = profileForm.oldPassword
          submitData.newPassword = profileForm.newPassword
        }
        
        const response = await $fetch('/api/auth/profile', {
          method: 'PUT',
          body: submitData
        })
        
        if (response.success) {
          ElMessage.success('保存成功')
          updateUser(response.data)
          profileForm.oldPassword = ''
          profileForm.newPassword = ''
          profileForm.confirmPassword = ''
        } else {
          ElMessage.error(response.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败', error)
        const err = error as { data?: { message?: string } }
        ElMessage.error(err?.data?.message || '保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleReset = () => {
  loadProfile()
}

onMounted(() => {
  // 如果本地有用户信息，先用本地的
  if (user.value) {
    Object.assign(profileForm, user.value)
    // 清空密码字段
    profileForm.oldPassword = ''
    profileForm.newPassword = ''
    profileForm.confirmPassword = ''
  }
  // 然后从服务端加载最新的
  loadProfile()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>