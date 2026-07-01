<template>
  <div style="border: 1px solid #ccc; border-radius: 4px;">
    <Toolbar
      style="border-bottom: 1px solid #ccc;"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 400px; overflow-y: hidden;"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";

import { ref, shallowRef, onBeforeUnmount, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const editorRef = shallowRef();
const valueHtml = ref(props.modelValue);
const mode = ref("default");

const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      server: "/api/upload",
      fieldName: "file",
      maxFileSize: 10 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ["image/*"],
      customInsert(res: any, insertFn: any) {
        const url = res.data?.url || res.url;
        insertFn(url, "", url);
      },
    },
  },
};

const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

const handleChange = () => {
  emit("update:modelValue", valueHtml.value);
  emit("change", valueHtml.value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal;
    }
  }
);

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style scoped>
/* 自定义样式可以在这里写 */
</style>
