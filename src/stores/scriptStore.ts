import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ScriptConfig, AppConfig } from '../types/script';
import { invoke } from '@tauri-apps/api/core';

/**
 * 脚本管理 Store
 */
export const useScriptStore = defineStore('script', () => {
  // 状态
  const scripts = ref<ScriptConfig[]>([]);
  const currentEditingScript = ref<ScriptConfig | null>(null);
  const isLoading = ref(false);

  // 计算属性
  const scriptCount = computed(() => scripts.value.length);

  /**
   * 生成唯一 ID
   */
  const generateId = (): string => {
    return `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * 加载配置
   */
  const loadConfig = async () => {
    try {
      isLoading.value = true;
      const config = await invoke<AppConfig>('load_config');
      scripts.value = config.scripts || [];
    } catch (error) {
      console.error('加载配置失败:', error);
      scripts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 保存配置
   */
  const saveConfig = async () => {
    try {
      const config: AppConfig = {
        theme: 'dark',
        scripts: scripts.value,
        version: '1.0.0',
      };
      await invoke('save_config', { config });
    } catch (error) {
      console.error('保存配置失败:', error);
      throw error;
    }
  };

  /**
   * 添加脚本
   */
  const addScript = async (scriptData: Omit<ScriptConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newScript: ScriptConfig = {
      ...scriptData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    scripts.value.push(newScript);
    await saveConfig();
    return newScript;
  };

  /**
   * 更新脚本
   */
  const updateScript = async (id: string, updates: Partial<ScriptConfig>) => {
    const index = scripts.value.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('脚本不存在');
    }
    scripts.value[index] = {
      ...scripts.value[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await saveConfig();
  };

  /**
   * 删除脚本
   */
  const deleteScript = async (id: string) => {
    const index = scripts.value.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('脚本不存在');
    }
    scripts.value.splice(index, 1);
    await saveConfig();
  };

  /**
   * 获取脚本详情
   */
  const getScript = (id: string): ScriptConfig | undefined => {
    return scripts.value.find(s => s.id === id);
  };

  /**
   * 设置当前编辑的脚本
   */
  const setEditingScript = (script: ScriptConfig | null) => {
    currentEditingScript.value = script;
  };

  /**
   * 执行脚本
   */
  const executeScript = async (id: string) => {
    const script = getScript(id);
    if (!script) {
      throw new Error('脚本不存在');
    }
    try {
      await invoke('execute_script', {
        workingDir: script.workingDir,
        command: script.command,
      });
    } catch (error) {
      console.error('执行脚本失败:', error);
      throw error;
    }
  };

  return {
    // 状态
    scripts,
    currentEditingScript,
    isLoading,
    // 计算属性
    scriptCount,
    // 方法
    loadConfig,
    saveConfig,
    addScript,
    updateScript,
    deleteScript,
    getScript,
    setEditingScript,
    executeScript,
  };
});
