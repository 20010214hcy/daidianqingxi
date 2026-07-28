<template>
  <div style="padding: 20px; max-width: 800px;">
    <h2>剪贴板调试工具</h2>
    <p>从 Word 复制一张图片，然后在此页面按 Ctrl+V</p>

    <div
      style="border: 2px dashed #ccc; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px;"
      @paste="handlePaste"
    >
      <p style="font-size: 16px;">在此区域按 Ctrl+V 粘贴</p>
    </div>

    <div v-if="results.length > 0">
      <h3>剪贴板内容分析：</h3>
      <div v-for="(r, i) in results" :key="i" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <strong>类型：</strong> {{ r.type }}<br/>
        <strong>格式：</strong> {{ r.kind }}<br/>
        <div v-if="r.preview">
          <strong>预览：</strong><br/>
          <pre style="white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow: auto; font-size: 12px;">{{ r.preview }}</pre>
        </div>
        <div v-if="r.imageSrc">
          <strong>图片：</strong><br/>
          <img :src="r.imageSrc" style="max-width: 200px; border: 1px solid #ddd; margin-top: 8px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const results = ref<any[]>([])

const handlePaste = async (e: ClipboardEvent) => {
  e.preventDefault()
  results.value = []

  const items = e.clipboardData?.items
  if (!items) {
    results.value = [{ type: '无数据', kind: 'N/A', preview: 'clipboardData.items 为空' }]
    return
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const entry: any = {
      type: item.type,
      kind: item.kind,
      preview: null,
      imageSrc: null
    }

    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        entry.preview = `文件大小: ${file.size} bytes, 类型: ${file.type}`
        const reader = new FileReader()
        reader.onload = (ev) => {
          entry.imageSrc = ev.target?.result
        }
        reader.readAsDataURL(file)
      }
    } else {
      const blob = item.getAsFile()
      if (blob) {
        const text = await blob.text()
        entry.preview = text.substring(0, 500)
      } else {
        entry.preview = '(无法读取内容)'
      }
    }

    results.value.push(entry)
  }

  // 也用 Clipboard API 试试
  try {
    const clipItems = await navigator.clipboard.read()
    for (const clipItem of clipItems) {
      results.value.push({
        type: 'Clipboard API',
        kind: 'types: ' + clipItem.types.join(', '),
        preview: null,
        imageSrc: null
      })
    }
  } catch (err) {
    results.value.push({
      type: 'Clipboard API',
      kind: '错误',
      preview: String(err),
      imageSrc: null
    })
  }
}
</script>
