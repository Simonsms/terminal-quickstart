<template>
  <div class="settings-view">
    <div class="page-header">
      <h2 class="page-title">设置</h2>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h3 class="section-title">数据存储</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">配置文件路径</span>
            <p class="setting-description">您的脚本配置数据存储在此位置</p>
          </div>
          <div class="setting-value">
            <code class="config-path">{{ configPath || "加载中..." }}</code>
            <el-button size="small" @click="openConfigFolder">
              <el-icon><FolderOpened /></el-icon>
              打开目录
            </el-button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3 class="section-title">关于</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">版本</span>
          </div>
          <div class="setting-value">
            <span class="version-text">v1.0.0</span>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Terminal QuickStart</span>
            <p class="setting-description">
              终端命令快捷启动工具，帮助开发者快速启动项目
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { FolderOpened } from "@element-plus/icons-vue";

const configPath = ref<string>("");

onMounted(async () => {
  try {
    configPath.value = await invoke<string>("get_config_file_path");
  } catch (error) {
    console.error("获取配置路径失败:", error);
    configPath.value = "获取失败";
  }
});

const openConfigFolder = async () => {
  try {
    await invoke("open_config_folder");
  } catch (error) {
    console.error("打开目录失败:", error);
  }
};
</script>

<style scoped>
.settings-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
  overflow: hidden;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #c0c0cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
}

.settings-section {
  background: rgba(24, 24, 28, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-description {
  font-size: 12px;
  color: var(--text-muted);
  margin: 4px 0 0 0;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-path {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 6px;
  font-family: "Consolas", "Monaco", monospace;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.version-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
