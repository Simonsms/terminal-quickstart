<template>
  <div class="script-card">
    <!-- 操作按钮 -->
    <div class="card-actions">
      <el-button size="small" text @click.stop="handleEdit" class="action-btn">
        <el-icon><Edit /></el-icon>
      </el-button>
      <el-button size="small" text type="danger" @click.stop="handleDelete" class="action-btn">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>

    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="icon-wrapper">
        <el-icon :size="28">
          <FolderOpened />
        </el-icon>
      </div>
      <h3 class="script-name">{{ script.name }}</h3>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 描述 -->
      <p v-if="script.description" class="script-description">
        {{ script.description }}
      </p>

      <!-- 工作目录 -->
      <div class="info-row">
        <span class="info-label">Path</span>
        <code class="info-value path">{{ script.workingDir }}</code>
      </div>

      <!-- 命令预览 -->
      <div class="info-row">
        <span class="info-label">Command</span>
        <code class="info-value command">{{ commandPreviewText }}</code>
      </div>
    </div>

    <!-- 启动按钮 -->
    <el-dropdown
      v-if="commandList.length > 1"
      trigger="click"
      @command="handleCommandSelect"
      class="execute-dropdown"
    >
      <el-button type="primary" :loading="executing" class="execute-btn">
        <el-icon><CaretRight /></el-icon>
        <span>Execute</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="cmd in commandList"
            :key="cmd.id"
            :command="cmd.id"
          >
            <div class="dropdown-cmd-item">
              <span class="cmd-name">{{ cmd.name }}</span>
              <code class="cmd-code">{{ cmd.command }}</code>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button
      v-else
      type="primary"
      @click.stop="handleExecuteSingle"
      :loading="executing"
      class="execute-btn"
    >
      <el-icon><CaretRight /></el-icon>
      <span>Execute</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  FolderOpened,
  CaretRight,
  Edit,
  Delete,
  ArrowDown,
} from "@element-plus/icons-vue";
import type { ScriptConfig } from "../types/script";

interface Props {
  script: ScriptConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  execute: [commandId: string];
  edit: [];
  delete: [];
}>();

const executing = ref(false);

// 获取命令列表（兼容旧数据）
const commandList = computed(() => {
  if (props.script.commands && props.script.commands.length > 0) {
    return props.script.commands;
  }
  const oldScript = props.script as any;
  if (oldScript.command) {
    return [{ id: "legacy", name: "Default", command: oldScript.command }];
  }
  return [];
});

// 命令预览文字
const commandPreviewText = computed(() => {
  const cmds = commandList.value;
  if (cmds.length === 0) return "No command";
  if (cmds.length === 1) return cmds[0].command;
  return `${cmds[0].command} (+${cmds.length - 1})`;
});

// 单个命令时直接执行
const handleExecuteSingle = async () => {
  const cmd = commandList.value[0];
  if (!cmd) return;
  executing.value = true;
  try {
    emit("execute", cmd.id);
  } finally {
    setTimeout(() => {
      executing.value = false;
    }, 1000);
  }
};

// 多个命令时通过下拉选择
const handleCommandSelect = async (commandId: string) => {
  executing.value = true;
  try {
    emit("execute", commandId);
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
  background: var(--tokyo-bg-card);
  border: 1px solid var(--tokyo-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  height: fit-content;
}

.script-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--tokyo-blue) 0%, var(--tokyo-purple) 100%);
  border-radius: 12px 12px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.script-card:hover {
  border-color: var(--tokyo-blue);
  box-shadow: 0 8px 30px rgba(122, 162, 247, 0.15);
  transform: translateY(-4px);
}

.script-card:hover::before {
  opacity: 1;
}

/* 操作按钮 */
.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.script-card:hover .card-actions {
  opacity: 1;
}

.action-btn :deep(.el-button) {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--tokyo-bg-darker);
  border: 1px solid var(--tokyo-border);
  color: var(--tokyo-text-dim);
  transition: all 0.2s ease;
}

.action-btn :deep(.el-button:hover) {
  background: var(--tokyo-bg-hover);
  border-color: var(--tokyo-blue);
  color: var(--tokyo-blue);
}

.action-btn.el-button--text.is-type-danger :deep(.el-button:hover) {
  border-color: var(--tokyo-red);
  color: var(--tokyo-red);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--tokyo-blue) 0%, var(--tokyo-purple) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--tokyo-glow-blue);
  transition: all 0.3s ease;
}

.script-card:hover .icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 6px 16px var(--tokyo-glow-blue);
}

.script-name {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--tokyo-text-bright);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 卡片内容 */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.script-description {
  font-size: 13px;
  font-weight: var(--font-weight-normal);
  color: var(--tokyo-text-dim);
  line-height: 1.6;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 42px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: var(--tokyo-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--tokyo-text);
  background: var(--tokyo-bg-darker);
  padding: 8px 10px;
  border-radius: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid var(--tokyo-border);
}

.info-value.path {
  color: var(--tokyo-blue-bright);
}

.info-value.command {
  color: var(--tokyo-orange);
}

/* 启动按钮 */
.execute-btn {
  width: 100%;
  margin-top: auto;
  padding: 12px 20px;
  height: auto;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.execute-dropdown {
  width: 100%;
  margin-top: auto;
  flex-shrink: 0;
}

.execute-dropdown .execute-btn {
  margin-top: 0;
}

/* 下拉菜单项 */
.dropdown-cmd-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 2px 0;
}

.dropdown-cmd-item .cmd-name {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--tokyo-text-bright);
}

.dropdown-cmd-item .cmd-code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--tokyo-text-dim);
}

/* 卡片入场动画 */
.script-card {
  animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
