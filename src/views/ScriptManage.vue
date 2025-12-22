<template>
  <div class="script-manage">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">Scripts</h2>
        <span class="script-count">{{ scriptStore.scriptCount }} total</span>
      </div>
      <el-button type="primary" @click="handleAdd" :icon="Plus">
        New Script
      </el-button>
    </div>

    <!-- 空状态 -->
    <div v-if="scriptStore.scripts.length === 0" class="empty-state">
      <div class="empty-icon">
        <el-icon :size="64">
          <FolderOpened />
        </el-icon>
      </div>
      <p class="empty-text">No scripts yet</p>
      <p class="empty-hint">Click "New Script" to create your first script</p>
    </div>

    <!-- 脚本网格 -->
    <div v-else class="script-grid">
      <ScriptCard
        v-for="(script, index) in scriptStore.scripts"
        :key="script.id"
        :script="script"
        :style="{ 'animation-delay': `${index * 0.05}s` }"
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
      await scriptStore.updateScript(editingScript.value.id, data);
    } else {
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
    ElMessage.success("Script executed successfully");
  } catch (error) {
    console.error("执行失败:", error);
    ElMessage.error("Execution failed");
  }
};

const handleDelete = async (script: ScriptConfig) => {
  try {
    await ElMessageBox.confirm(
      `Delete script "${script.name}"?`,
      "Confirm Delete",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      }
    );
    await scriptStore.deleteScript(script.id);
    ElMessage.success("Script deleted");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("Delete failed");
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
  background: var(--tokyo-bg-dark);
}

/* 背景装饰 */
.script-manage::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle at center,
    rgba(122, 162, 247, 0.05) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.script-manage > * {
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  animation: fadeIn 0.5s ease forwards;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  color: var(--tokyo-text-bright);
  margin: 0;
  letter-spacing: -0.02em;
}

.script-count {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--tokyo-text-muted);
  background: var(--tokyo-bg-card);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--tokyo-border);
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: fadeIn 0.6s ease forwards;
}

.empty-icon {
  width: 100px;
  height: 100px;
  background: var(--tokyo-bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tokyo-text-muted);
  border: 1px solid var(--tokyo-border);
}

.empty-text {
  font-size: 18px;
  color: var(--tokyo-text-dim);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.empty-hint {
  font-size: 14px;
  color: var(--tokyo-text-muted);
  margin: 0;
}

/* 脚本网格 */
.script-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  overflow-y: auto;
  padding-bottom: 20px;
  padding-right: 12px;
  align-content: start;
}

/* 通用动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
