<template>
  <div class="admin-page-container">
    <AdminPageHeader title="用户管理" description="管理系统用户和权限">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-1"><Plus /></el-icon>
          创建用户
        </el-button>
      </template>
    </AdminPageHeader>

    <el-card>
      <el-table :data="users" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="name" label="姓名" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column label="角色" width="130">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)" size="small">
              {{ roleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <AdminActionButtons
              :show-delete="row.role !== 'superadmin'"
              @edit="handleEdit(row)"
              @delete="handleDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '创建用户'"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
          <el-input v-model="form.password" type="password" show-password
            :placeholder="isEdit ? '留空则不修改' : '请输入密码'" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option v-if="isSuperAdmin" label="超级管理员" value="superadmin" />
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? '保存' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/format'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

definePageMeta({ layout: 'admin' })

const { formatDate } = useFormatDate()
const { isSuperAdmin } = usePermission()

const users = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'editor',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const roleLabel = (role: string) => {
  const map: Record<string, string> = { superadmin: '超级管理员', admin: '管理员', editor: '编辑' }
  return map[role] || role
}

const roleTagType = (role: string) => {
  const map: Record<string, string> = { superadmin: 'danger', admin: '', editor: 'info' }
  return (map[role] || '') as any
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/users')
    if (res.success) {
      users.value = res.data || []
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, { username: '', name: '', email: '', password: '', role: 'editor' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    username: row.username,
    name: row.name || '',
    email: row.email || '',
    password: '',
    role: row.role,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  submitting.value = true
  try {
    if (isEdit.value && editingId.value) {
      const body: any = { name: form.name, email: form.email, role: form.role }
      if (form.password) body.password = form.password
      const res = await $fetch(`/api/users/${editingId.value}`, { method: 'PUT', body })
      if (res.success) {
        ElMessage.success('用户更新成功')
        dialogVisible.value = false
        fetchUsers()
      }
    } else {
      const res = await $fetch('/api/users', {
        method: 'POST',
        body: { username: form.username, password: form.password, name: form.name, email: form.email, role: form.role },
      })
      if (res.success) {
        ElMessage.success('用户创建成功')
        dialogVisible.value = false
        fetchUsers()
      }
    }
  } catch (error: any) {
    ElMessage.error(error?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户「${row.name || row.username}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await $fetch(`/api/users/${row.id}`, { method: 'DELETE' })
    if (res.success) {
      ElMessage.success('用户已删除')
      fetchUsers()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error?.data?.message || '删除失败')
    }
  }
}

onMounted(() => fetchUsers())
</script>
