<template>
  <div class="snippet-card">
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
          <Document />
        </el-icon>
      </div>
      <h3 class="snippet-title">{{ snippet.title }}</h3>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 句子内容（最多显示3行） -->
      <p class="snippet-content">
        {{ snippet.content }}
      </p>

      <!-- 元信息 -->
      <div class="snippet-meta">
        <span v-if="snippet.category" class="meta-tag">
          <el-icon><Collection /></el-icon>
          {{ snippet.category }}
        </span>
        <span class="meta-usage">
          <el-icon><DataAnalysis /></el-icon>
          {{ snippet.usageCount }} 次
        </span>
      </div>
    </div>

    <!-- 复制按钮 -->
    <el-button
      type="primary"
      @click.stop="handleCopy"
      :loading="copying"
      class="copy-btn"
    >
      <el-icon v-if="!copied"><DocumentCopy /></el-icon>
      <el-icon v-else><Check /></el-icon>
      <span>{{ copied ? "✓ Copied!" : "Copy to Clipboard" }}</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Document,
  DocumentCopy,
  Edit,
  Delete,
  Collection,
  DataAnalysis,
  Check,
} from "@element-plus/icons-vue";
import type { SnippetConfig } from "../types/snippet";

interface Props {
  snippet: SnippetConfig;
}

defineProps<Props>();

const emit = defineEmits<{
  copy: [];
  edit: [];
  delete: [];
}>();

const copying = ref(false);
const copied = ref(false);

const handleCopy = async () => {
  copying.value = true;
  try {
    emit("copy");
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } finally {
    setTimeout(() => {
      copying.value = false;
    }, 300);
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
.snippet-card {
  background: var(--tokyo-bg-card);
  border: 1px solid var(--tokyo-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 260px;
  height: fit-content;
}

.snippet-card::before {
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

.snippet-card:hover {
  border-color: var(--tokyo-blue);
  box-shadow: 0 8px 30px rgba(122, 162, 247, 0.15);
  transform: translateY(-4px);
}

.snippet-card:hover::before {
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

.snippet-card:hover .card-actions {
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

.snippet-card:hover .icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 6px 16px var(--tokyo-glow-blue);
}

.snippet-title {
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

.snippet-content {
  font-size: 14px;
  font-weight: var(--font-weight-normal);
  color: var(--tokyo-text);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.snippet-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.meta-tag,
.meta-usage {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--tokyo-text-dim);
  padding: 4px 8px;
  background: var(--tokyo-bg-darker);
  border-radius: 6px;
  border: 1px solid var(--tokyo-border);
}

.meta-tag {
  color: var(--tokyo-purple);
}

.meta-usage {
  color: var(--tokyo-orange);
  margin-left: auto;
}

/* 复制按钮 */
.copy-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px 20px;
  height: auto;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.copy-btn.is-loading {
  opacity: 0.7;
}

/* 卡片入场动画 */
.snippet-card {
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
