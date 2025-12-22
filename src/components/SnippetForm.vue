<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑句子' : '新建句子'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="例如：常用回复、代码片段"
          clearable
        />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="6"
          placeholder="输入要保存的句子内容..."
          show-word-limit
          maxlength="5000"
        />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-autocomplete
          v-model="formData.category"
          :fetch-suggestions="fetchCategorySuggestions"
          placeholder="选择或输入分类（可选）"
          clearable
          class="full-width"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="2"
          placeholder="添加一些描述信息（可选）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { SnippetFormData, SnippetConfig } from "../types/snippet";

interface Props {
  visible: boolean;
  snippet?: SnippetConfig | null;
  categories?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  snippet: null,
  categories: () => [],
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  submit: [data: SnippetFormData];
}>();

const formRef = ref<FormInstance>();
const submitting = ref(false);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const isEdit = computed(() => !!props.snippet);

const formData = ref<SnippetFormData>({
  title: "",
  content: "",
  category: "",
  description: "",
});

const rules: FormRules<SnippetFormData> = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 1, max: 100, message: "标题长度应在 1 到 100 个字符之间", trigger: "blur" },
  ],
  content: [
    { required: true, message: "请输入内容", trigger: "blur" },
    { min: 1, max: 5000, message: "内容长度应在 1 到 5000 个字符之间", trigger: "blur" },
  ],
  category: [
    { max: 30, message: "分类长度不能超过 30 个字符", trigger: "blur" },
  ],
};

// 监听 snippet 变化，更新表单数据
watch(
  () => props.snippet,
  (newSnippet) => {
    if (newSnippet) {
      formData.value = {
        title: newSnippet.title,
        content: newSnippet.content,
        category: newSnippet.category || "",
        description: newSnippet.description || "",
      };
    } else {
      // 重置表单
      formData.value = {
        title: "",
        content: "",
        category: "",
        description: "",
      };
    }
  },
  { immediate: true }
);

// 分类自动补全建议
const fetchCategorySuggestions = (queryString: string, cb: any) => {
  const suggestions = props.categories.map((cat) => ({ value: cat }));
  const results = queryString
    ? suggestions.filter((item) =>
        item.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : suggestions;
  cb(results);
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    emit("submit", {
      ...formData.value,
      category: formData.value.category || undefined,
      description: formData.value.description || undefined,
    });
    handleClose();
  } finally {
    submitting.value = false;
  }
};

const handleClose = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
