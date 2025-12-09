<template>
  <div class="settings-view">
    <div class="page-header">
      <h2 class="page-title">设置</h2>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h3 class="section-title">外观</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">主题</span>
            <p class="setting-description">选择应用程序的外观主题</p>
          </div>
          <div class="setting-value">
            <div class="theme-switcher">
              <button
                class="theme-btn"
                :class="{ active: theme === 'light' }"
                @click="setTheme('light')"
              >
                <el-icon :size="16"><Sunny /></el-icon>
                <span>浅色</span>
              </button>
              <button
                class="theme-btn"
                :class="{ active: theme === 'dark' }"
                @click="setTheme('dark')"
              >
                <el-icon :size="16"><Moon /></el-icon>
                <span>深色</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
import { FolderOpened, Sunny, Moon } from "@element-plus/icons-vue";
import { useThemeStore } from "../stores/themeStore";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { setTheme } = themeStore;

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
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
}

.settings-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
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
  border-bottom: 1px solid var(--border-color);
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
  color: var(--highlight-path);
  background: var(--bg-input);
  padding: 6px 10px;
  border-radius: 6px;
  font-family: "Consolas", "Monaco", monospace;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.version-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 主题切换样式 */
.theme-switcher {
  display: flex;
  gap: 8px;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.theme-btn.active {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.theme-btn.active:hover {
  background: var(--primary-light);
}
</style>
