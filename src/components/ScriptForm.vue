<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑脚本' : '新建脚本'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="脚本名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="例如：启动前端项目"
          clearable
        />
      </el-form-item>

      <el-form-item label="工作目录" prop="workingDir">
        <el-input
          v-model="formData.workingDir"
          placeholder="例如：C:\projects\my-project"
          clearable
        >
          <template #append>
            <el-button @click="selectDirectory" :icon="FolderOpened">
              浏览
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="启动命令" prop="command">
        <el-input
          v-model="formData.command"
          placeholder="例如：npm run dev"
          clearable
        />
      </el-form-item>

      <el-form-item label="描述信息" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="添加一些描述信息（可选）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { FolderOpened } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { ScriptFormData, ScriptConfig } from '../types/script';
import { invoke } from '@tauri-apps/api/core';

interface Props {
  visible: boolean;
  editData?: ScriptConfig | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [data: ScriptFormData];
}>();

const dialogVisible = ref(props.visible);
const formRef = ref<FormInstance>();
const submitting = ref(false);

const isEdit = ref(false);

const formData = ref<ScriptFormData>({
  name: '',
  workingDir: '',
  command: '',
  description: '',
});

const rules: FormRules = {
  name: [
    { required: true, message: '请输入脚本名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  workingDir: [
    { required: true, message: '请选择工作目录', trigger: 'blur' },
  ],
  command: [
    { required: true, message: '请输入启动命令', trigger: 'blur' },
  ],
};

// 监听 visible 变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val;
  if (val && props.editData) {
    isEdit.value = true;
    formData.value = {
      name: props.editData.name,
      workingDir: props.editData.workingDir,
      command: props.editData.command,
      description: props.editData.description || '',
    };
  } else {
    isEdit.value = false;
    resetForm();
  }
});

watch(dialogVisible, (val) => {
  emit('update:visible', val);
});

const selectDirectory = async () => {
  try {
    const selected = await invoke<string>('select_directory');
    if (selected) {
      formData.value.workingDir = selected;
    }
  } catch (error) {
    console.error('选择目录失败:', error);
    ElMessage.error('选择目录失败');
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        emit('submit', { ...formData.value });
        ElMessage.success(isEdit.value ? '保存成功' : '添加成功');
        handleClose();
      } catch (error) {
        console.error('提交失败:', error);
        ElMessage.error('操作失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

const handleClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: '',
    workingDir: '',
    command: '',
    description: '',
  };
  formRef.value?.resetFields();
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
