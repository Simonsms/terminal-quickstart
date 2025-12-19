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
      <code>{{ commandPreviewText }}</code>
    </div>

    <!-- 启动按钮 - 根据命令数量显示不同交互 -->
    <el-dropdown
      v-if="commandList.length > 1"
      trigger="click"
      @command="handleCommandSelect"
      class="execute-dropdown"
    >
      <el-button type="primary" :loading="executing" class="execute-btn">
        <el-icon><CaretRight /></el-icon>
        <span>启动</span>
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
      <span>启动</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  FolderOpened,
  Document,
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
  // 如果有 commands 数组，直接使用
  if (props.script.commands && props.script.commands.length > 0) {
    return props.script.commands;
  }
  // 兼容旧数据：如果有 command 字段，转换为数组格式
  const oldScript = props.script as any;
  if (oldScript.command) {
    return [{ id: "legacy", name: "默认", command: oldScript.command }];
  }
  return [];
});

// 命令预览文字：显示第一个命令或命令数量
const commandPreviewText = computed(() => {
  const cmds = commandList.value;
  if (cmds.length === 0) return "未配置命令";
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
  overflow: hidden;
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

/* 下拉菜单容器 */
.execute-dropdown {
  width: 100%;
  margin-top: 12px;
}

.execute-dropdown .execute-btn {
  margin-top: 0;
}

/* 下拉菜单项样式 */
.dropdown-cmd-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 0;
}

.dropdown-cmd-item .cmd-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.dropdown-cmd-item .cmd-code {
  font-size: 12px;
  color: #6b7280;
  font-family: "Consolas", "Monaco", monospace;
}
</style>

<!-- 全局样式覆盖下拉菜单 -->
<style>
.el-dropdown-menu {
  background: #1e1e2e !important;
  border: 1px solid #3a3a4a !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}

.el-dropdown-menu__item {
  color: #e0e0e0 !important;
}

.el-dropdown-menu__item:hover {
  background: #2a2a3e !important;
  color: #fff !important;
}

.el-dropdown-menu .dropdown-cmd-item .cmd-name {
  color: #f0f0f0;
}

.el-dropdown-menu .dropdown-cmd-item .cmd-code {
  color: #9ca3af;
}

.el-popper.is-light {
  background: #1e1e2e !important;
  border: 1px solid #3a3a4a !important;
}

.el-popper.is-light .el-popper__arrow::before {
  background: #1e1e2e !important;
  border-color: #3a3a4a !important;
}
</style>
