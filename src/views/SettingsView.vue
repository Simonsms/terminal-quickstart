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
        <h3 class="section-title">启动</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">开机自启动</span>
            <p class="setting-description">系统启动时自动运行应用程序</p>
          </div>
          <div class="setting-value">
            <el-switch
              v-model="autostart"
              :loading="autostartLoading"
              @change="handleAutostartChange"
            />
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3 class="section-title">终端</h3>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">默认终端类型</span>
            <p class="setting-description">选择执行脚本时使用的终端环境</p>
          </div>
          <div class="setting-value">
            <div class="terminal-switcher">
              <button
                class="terminal-btn"
                :class="{ active: terminalType === 'powershell7' }"
                @click="handleTerminalChange('powershell7')"
              >
                <span class="terminal-icon">⚡</span>
                <span>PowerShell 7</span>
              </button>
              <button
                class="terminal-btn"
                :class="{ active: terminalType === 'zsh-starship' }"
                @click="handleTerminalChange('zsh-starship')"
              >
                <span class="terminal-icon">🚀</span>
                <span>Zsh + Starship</span>
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
import { ElMessage } from "element-plus";
import { FolderOpened, Sunny, Moon } from "@element-plus/icons-vue";
import { useThemeStore } from "../stores/themeStore";
import { useScriptStore } from "../stores/scriptStore";
import { storeToRefs } from "pinia";
import type { TerminalType } from "../types/script";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { setTheme } = themeStore;

const scriptStore = useScriptStore();
const { terminalType } = storeToRefs(scriptStore);

const configPath = ref<string>("");
const autostart = ref(false);
const autostartLoading = ref(false);

onMounted(async () => {
  // 加载脚本配置（包含终端类型设置）
  await scriptStore.loadConfig();

  try {
    configPath.value = await invoke<string>("get_config_file_path");
  } catch (error) {
    console.error("获取配置路径失败:", error);
    configPath.value = "获取失败";
  }

  // 获取开机自启动状态
  try {
    autostart.value = await invoke<boolean>("get_autostart_status");
  } catch (error) {
    console.error("获取自启动状态失败:", error);
  }
});

const handleAutostartChange = async (enabled: boolean) => {
  autostartLoading.value = true;
  try {
    await invoke("set_autostart", { enabled });
    ElMessage.success(enabled ? "已开启开机自启动" : "已关闭开机自启动");
  } catch (error) {
    console.error("设置自启动失败:", error);
    ElMessage.error("设置失败");
    // 恢复原状态
    autostart.value = !enabled;
  } finally {
    autostartLoading.value = false;
  }
};

const openConfigFolder = async () => {
  try {
    await invoke("open_config_folder");
  } catch (error) {
    console.error("打开目录失败:", error);
  }
};

const handleTerminalChange = async (type: TerminalType) => {
  try {
    await scriptStore.setTerminalType(type);
    ElMessage.success(
      `已切换到 ${type === "powershell7" ? "PowerShell 7" : "Zsh + Starship"}`
    );
  } catch (error) {
    console.error("设置终端类型失败:", error);
    ElMessage.error("设置失败");
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

/* 终端切换样式 */
.terminal-switcher {
  display: flex;
  gap: 8px;
}

.terminal-btn {
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

.terminal-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.terminal-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(var(--primary-rgb, 64, 158, 255), 0.4);
}

.terminal-btn.active:hover {
  background: var(--primary-color);
  opacity: 0.9;
}

.terminal-icon {
  font-size: 16px;
}
</style>
