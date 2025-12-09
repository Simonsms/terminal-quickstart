<template>
  <div class="script-card">
    <!-- 顶部操作栏 -->
    <div class="card-actions">
      <el-button size="small" text @click.stop="handleEdit">
        <el-icon><Edit /></el-icon>
      </el-button>
      <el-button size="small" text type="danger" @click.stop="handleDelete">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>

    <!-- 图标 -->
    <div class="card-icon">
      <el-icon :size="32" color="#409EFF">
        <FolderOpened />
      </el-icon>
    </div>

    <!-- 标题 -->
    <h3 class="script-name">{{ script.name }}</h3>

    <!-- 描述 - 放在标题下方 -->
    <p v-if="script.description" class="script-description">
      {{ script.description }}
    </p>

    <!-- 目录路径 -->
    <p class="script-dir">{{ script.workingDir }}</p>

    <!-- 命令预览 -->
    <div class="command-preview">
      <el-icon :size="12"><Document /></el-icon>
      <code>{{ script.command }}</code>
    </div>

    <!-- 启动按钮 -->
    <el-button
      type="primary"
      @click.stop="handleExecute"
      :loading="executing"
      class="execute-btn"
    >
      <el-icon><CaretRight /></el-icon>
      <span>启动</span>
    </el-button>
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
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 220px;
}

.script-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color) 0%, #6366f1 100%);
  border-radius: 16px 16px 0 0;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.script-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 12px 40px var(--primary-glow);
  transform: translateY(-4px);
}

.script-card:hover::before {
  opacity: 1;
}

/* 操作按钮 - 右上角 */
.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.script-card:hover .card-actions {
  opacity: 1;
}

.card-actions :deep(.el-button) {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg-hover);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.card-actions :deep(.el-button:hover) {
  background: var(--bg-input);
  border-color: var(--border-hover);
}

.card-actions :deep(.el-button--danger:hover) {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

/* 图标 */
.card-icon {
  width: 56px;
  height: 56px;
  background: var(--primary-light);
  border: 1px solid var(--primary-color);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.script-card:hover .card-icon {
  transform: scale(1.05);
  box-shadow: 0 8px 24px var(--primary-glow);
}

/* 标题 */
.script-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

/* 描述 - 在标题下方 */
.script-description {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  margin: 0 0 12px 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 34px;
}

/* 目录路径 */
.script-dir {
  font-size: 12px;
  color: var(--highlight-path);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Consolas", "Monaco", monospace;
  font-weight: 500;
  margin: 0 0 10px 0;
}

/* 命令预览 */
.command-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 100%;
  margin-bottom: 0;
  margin-top: auto;
}

.command-preview code {
  font-size: 12px;
  color: var(--highlight-command);
  font-family: "Consolas", "Monaco", "Fira Code", monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.command-preview .el-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

/* 启动按钮 */
.execute-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px 20px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
}
</style>
