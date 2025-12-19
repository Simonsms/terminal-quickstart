<template>
  <div class="script-manage">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">脚本管理</h2>
        <span class="script-count"
          >共 {{ scriptStore.scriptCount }} 个脚本</span
        >
      </div>
      <el-button type="primary" @click="handleAdd" :icon="Plus">
        新建脚本
      </el-button>
    </div>

    <div v-if="scriptStore.scripts.length === 0" class="empty-state">
      <el-icon :size="80" color="#4a4a4a">
        <FolderOpened />
      </el-icon>
      <p class="empty-text">还没有添加任何脚本</p>
      <p class="empty-hint">点击右上角「新建脚本」开始添加</p>
    </div>

    <div v-else class="script-grid">
      <ScriptCard
        v-for="script in scriptStore.scripts"
        :key="script.id"
        :script="script"
        @execute="(commandId: string) => handleExecute(script.id, commandId)"
        @edit="handleEdit(script)"
        @delete="handleDelete(script)"
      />
    </div>

    <ScriptForm
      v-model:visible="formVisible"
      :edit-data="editingScript"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, FolderOpened } from "@element-plus/icons-vue";
import ScriptCard from "../components/ScriptCard.vue";
import ScriptForm from "../components/ScriptForm.vue";
import { useScriptStore } from "../stores/scriptStore";
import type { ScriptConfig, ScriptFormData } from "../types/script";

const scriptStore = useScriptStore();

const formVisible = ref(false);
const editingScript = ref<ScriptConfig | null>(null);

onMounted(async () => {
  await scriptStore.loadConfig();
});

const handleAdd = () => {
  editingScript.value = null;
  formVisible.value = true;
};

const handleEdit = (script: ScriptConfig) => {
  editingScript.value = script;
  formVisible.value = true;
};

const handleSubmit = async (data: ScriptFormData) => {
  try {
    if (editingScript.value) {
      // 更新
      await scriptStore.updateScript(editingScript.value.id, data);
    } else {
      // 新建
      await scriptStore.addScript(data);
    }
  } catch (error) {
    console.error("操作失败:", error);
    throw error;
  }
};

const handleExecute = async (scriptId: string, commandId: string) => {
  try {
    await scriptStore.executeScript(scriptId, commandId);
    ElMessage.success("脚本已启动");
  } catch (error) {
    console.error("执行失败:", error);
    ElMessage.error("启动失败，请检查配置");
  }
};

const handleDelete = async (script: ScriptConfig) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除脚本「${script.name}」吗？`,
      "删除确认",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      }
    );
    await scriptStore.deleteScript(script.id);
    ElMessage.success("删除成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};
</script>

<style scoped>
.script-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.script-count {
  font-size: 14px;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 4px 12px;
  border-radius: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.empty-text {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.script-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  overflow-y: auto;
  padding-bottom: 16px;
  padding-right: 8px;
  align-content: start;
}

/* 卡片入场动画 */
.script-grid > * {
  animation: scaleIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 为每个卡片添加延迟 */
.script-grid > *:nth-child(1) {
  animation-delay: 0.05s;
}
.script-grid > *:nth-child(2) {
  animation-delay: 0.1s;
}
.script-grid > *:nth-child(3) {
  animation-delay: 0.15s;
}
.script-grid > *:nth-child(4) {
  animation-delay: 0.2s;
}
.script-grid > *:nth-child(5) {
  animation-delay: 0.25s;
}
.script-grid > *:nth-child(6) {
  animation-delay: 0.3s;
}
.script-grid > *:nth-child(7) {
  animation-delay: 0.35s;
}
.script-grid > *:nth-child(8) {
  animation-delay: 0.4s;
}
</style>
