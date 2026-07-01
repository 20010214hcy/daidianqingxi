<template>
  <div class="admin-page-container">
    <AdminPageHeader title="留言管理" description="管理用户的留言和咨询" />

    <el-card>
      <AdminMobileList :empty="!loading && messages.length === 0" v-loading="loading">
        <!-- 桌面端表格 -->
        <el-table :data="messages" style="width: 100%" stripe>
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="phone" label="电话" width="140" />
          <el-table-column prop="subject" label="主题" min-width="200">
            <template #default="{ row }">
              {{ row.subject || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="提交时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <AdminActionButtons :show-edit="false" show-view @view="viewMessage(row)" @delete="deleteMessage(row)" />
            </template>
          </el-table-column>
        </el-table>

        <!-- 移动端卡片列表 -->
        <template #mobile>
          <AdminMobileCard
            v-for="msg in messages"
            :key="msg.id"
            :title="msg.name"
            :subtitle="msg.company || '个人客户'"
            :status="getStatusLabel(msg.status)"
            :status-type="getStatusType(msg.status)"
            :tags="[
              { label: '电话', value: msg.phone },
              { label: '邮箱', value: msg.email || '-' },
              { label: '提交时间', value: formatDate(msg.createdAt) }
            ]"
            clickable
            @click="viewMessage(msg)"
          >
            <template #actions>
              <el-button size="small" @click="viewMessage(msg)">
                <el-icon class="mr-1"><View /></el-icon>
                查看
              </el-button>
              <el-button size="small" type="danger" @click="deleteMessage(msg)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </AdminMobileCard>
        </template>
      </AdminMobileList>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 查看/回复弹窗 -->
    <el-dialog
      v-model="showViewModal"
      title="查看留言"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="space-y-4">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentMessage?.name }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ currentMessage?.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentMessage?.email || '-' }}</el-descriptions-item>
          <el-descriptions-item label="公司">{{ currentMessage?.company || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div>
          <p class="text-sm text-slate-500 mb-1">主题</p>
          <p class="font-medium text-slate-800">{{ currentMessage?.subject || '-' }}</p>
        </div>

        <div>
          <p class="text-sm text-slate-500 mb-1">留言内容</p>
          <p class="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">{{ currentMessage?.content }}</p>
        </div>

        <el-divider />

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">回复内容</label>
          <el-input
            v-model="replyContent"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showViewModal = false">关闭</el-button>
          <el-button type="primary" :loading="replying" @click="handleReply">回复</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/format'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Delete } from '@element-plus/icons-vue'

interface Message {
  id: number
  name: string
  phone: string
  email?: string
  company?: string
  subject?: string
  content: string
  status: string
  reply?: string
  createdAt: string
}

useHead({
  title: '留言管理 - 后台管理'
})

definePageMeta({
  layout: 'admin'
})

const { formatDate } = useFormatDate()

const messages = ref<Message[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showViewModal = ref(false)
const currentMessage = ref<Message | null>(null)
const replyContent = ref('')
const replying = ref(false)

// 获取留言列表
const fetchMessages = async () => {
  loading.value = true
  try {
    const response: any = await $fetch(`/api/messages?page=${currentPage.value}&pageSize=${pageSize.value}`)
    if (response?.success) {
      messages.value = response.data.list || response.data || []
      total.value = response.data.pagination?.total || 0
    }
  } catch (error) {
    console.error('获取留言列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMessages()
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchMessages()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchMessages()
}

const viewMessage = (message: Message) => {
  currentMessage.value = message
  replyContent.value = message.reply || ''
  showViewModal.value = true
}

const deleteMessage = async (row: Message) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await $fetch(`/api/messages/${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    await fetchMessages()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除留言失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleReply = async () => {
  if (!currentMessage.value) return

  replying.value = true
  try {
    await $fetch(`/api/messages/${currentMessage.value.id}`, {
      method: 'PUT',
      body: {
        reply: replyContent.value,
        status: 'replied'
      }
    })

    showViewModal.value = false
    ElMessage.success('回复成功')
    await fetchMessages()
  } catch (error) {
    console.error('回复留言失败:', error)
    ElMessage.error('回复失败')
  } finally {
    replying.value = false
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: '待处理',
    replied: '已回复',
    closed: '已关闭'
  }
  return labels[status] || status
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    replied: 'success',
    closed: 'info'
  }
  return types[status] || 'info'
}
</script>
