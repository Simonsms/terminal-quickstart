import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  ScriptConfig,
  AppConfig,
  CommandConfig,
  ScriptFormData,
  TerminalType,
} from "../types/script";
import { invoke } from "@tauri-apps/api/core";

/**
 * 脚本管理 Store
 */
export const useScriptStore = defineStore("script", () => {
  // 状态
  const scripts = ref<ScriptConfig[]>([]);
  const currentEditingScript = ref<ScriptConfig | null>(null);
  const isLoading = ref(false);
  const terminalType = ref<TerminalType>("powershell7");

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
      const config = await invoke<AppConfig>("load_config");
      scripts.value = config.scripts || [];
      terminalType.value = config.terminalType || "powershell7";
    } catch (error) {
      console.error("加载配置失败:", error);
      scripts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 保存配置（需要从 snippetStore 获取 snippets 数据）
   */
  const saveConfig = async () => {
    try {
      const { useSnippetStore } = await import("./snippetStore");
      const snippetStore = useSnippetStore();

      const config: AppConfig = {
        theme: "dark",
        scripts: scripts.value,
        snippets: snippetStore.snippets,
        terminalType: terminalType.value,
        version: "1.0.0",
      };
      await invoke("save_config", { config });
    } catch (error) {
      console.error("保存配置失败:", error);
      throw error;
    }
  };

  /**
   * 设置终端类型
   */
  const setTerminalType = async (type: TerminalType) => {
    terminalType.value = type;
    await saveConfig();
  };

  /**
   * 生成命令ID
   */
  const generateCommandId = (): string => {
    return `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  };

  /**
   * 添加脚本
   */
  const addScript = async (scriptData: ScriptFormData) => {
    const now = Date.now();
    // 给每个命令生成ID
    const commandsWithId: CommandConfig[] = scriptData.commands.map((cmd) => ({
      id: cmd.id || generateCommandId(),
      name: cmd.name,
      command: cmd.command,
    }));
    const newScript: ScriptConfig = {
      name: scriptData.name,
      workingDir: scriptData.workingDir,
      description: scriptData.description,
      icon: scriptData.icon,
      commands: commandsWithId,
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
  const updateScript = async (id: string, updates: ScriptFormData) => {
    const index = scripts.value.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("脚本不存在");
    }
    // 给每个命令确保有ID
    const commandsWithId: CommandConfig[] = updates.commands.map((cmd) => ({
      id: cmd.id || generateCommandId(),
      name: cmd.name,
      command: cmd.command,
    }));
    scripts.value[index] = {
      ...scripts.value[index],
      name: updates.name,
      workingDir: updates.workingDir,
      description: updates.description,
      icon: updates.icon,
      commands: commandsWithId,
      updatedAt: Date.now(),
    };
    await saveConfig();
  };

  /**
   * 删除脚本
   */
  const deleteScript = async (id: string) => {
    const index = scripts.value.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("脚本不存在");
    }
    scripts.value.splice(index, 1);
    await saveConfig();
  };

  /**
   * 获取脚本详情
   */
  const getScript = (id: string): ScriptConfig | undefined => {
    return scripts.value.find((s) => s.id === id);
  };

  /**
   * 设置当前编辑的脚本
   */
  const setEditingScript = (script: ScriptConfig | null) => {
    currentEditingScript.value = script;
  };

  /**
   * 执行脚本（传入脚本ID和命令ID）
   */
  const executeScript = async (scriptId: string, commandId: string) => {
    const script = getScript(scriptId);
    if (!script) {
      throw new Error("脚本不存在");
    }
    const cmd = script.commands.find((c) => c.id === commandId);
    if (!cmd) {
      throw new Error("命令不存在");
    }
    try {
      await invoke("execute_script", {
        workingDir: script.workingDir,
        command: cmd.command,
        terminalType: terminalType.value,
      });
    } catch (error) {
      console.error("执行脚本失败:", error);
      throw error;
    }
  };

  return {
    // 状态
    scripts,
    currentEditingScript,
    isLoading,
    terminalType,
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
    setTerminalType,
    executeScript,
  };
});
