<template>
  <div class="script-card">
    <div class="card-main">
      <div class="card-content">
        <div class="card-header">
          <div class="card-icon">
            <el-icon :size="20" color="#409EFF">
              <FolderOpened />
            </el-icon>
          </div>
          <div class="card-info">
            <h3 class="script-name">{{ script.name }}</h3>
            <p class="script-dir">{{ script.workingDir }}</p>
          </div>
          <div class="card-actions">
            <el-button size="small" text @click="handleEdit">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" text type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="command-preview">
          <el-icon :size="12" color="#8a8a8a">
            <Document />
          </el-icon>
          <code>{{ script.command }}</code>
        </div>

        <p v-if="script.description" class="script-description">
          {{ script.description }}
        </p>
      </div>

      <div class="card-execute">
        <el-button
          type="primary"
          size="small"
          @click="handleExecute"
          :loading="executing"
          class="execute-btn"
        >
          <el-icon><CaretRight /></el-icon>
          <span class="execute-text">启动</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  FolderOpened,
  Document,
  CaretRight,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import type { ScriptConfig } from "../types/script";

interface Props {
  script: ScriptConfig;
}

defineProps<Props>();

const emit = defineEmits<{
  execute: [];
  edit: [];
  delete: [];
}>();

const executing = ref(false);

const handleExecute = async () => {
  executing.value = true;
  try {
    emit("execute");
  } finally {
    setTimeout(() => {
      executing.value = false;
    }, 1000);
  }
};

const handleEdit = () => {
  emit("edit");
};

const handleDelete = () => {
  emit("delete");
};
</script>

<style scoped>
.script-card {
  background: linear-gradient(
    135deg,
    rgba(24, 24, 28, 0.9) 0%,
    rgba(20, 20, 24, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px 16px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.script-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.5) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.35s ease;
}

.script-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.script-card:hover::before {
  opacity: 1;
}

.card-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.card-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(99, 102, 241, 0.1) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.script-card:hover .card-icon {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(99, 102, 241, 0.2) 100%
  );
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.script-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.script-dir {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Consolas", "Monaco", monospace;
}

.card-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.script-card:hover .card-actions {
  opacity: 1;
}

.command-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
}

.command-preview code {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: "Consolas", "Monaco", "Fira Code", monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.script-description {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-execute {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.execute-btn {
  padding: 8px 16px;
  height: auto;
}

.execute-btn .execute-text {
  margin-left: 4px;
}

/* 操作按钮美化 */
.card-actions :deep(.el-button) {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.card-actions :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.card-actions :deep(.el-button--danger:hover) {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}
</style>
