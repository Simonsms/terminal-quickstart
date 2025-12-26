import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SnippetConfig, SnippetFormData } from "../types/snippet";
import type { AppConfig } from "../types/script";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

/**
 * 句子片段管理 Store
 */
export const useSnippetStore = defineStore("snippet", () => {
  // 状态
  const snippets = ref<SnippetConfig[]>([]);
  const isLoading = ref(false);
  const searchQuery = ref("");
  const selectedCategory = ref<string | null>(null);

  // 计算属性
  const snippetCount = computed(() => snippets.value.length);

  // 所有唯一分类
  const categories = computed(() => {
    const cats = snippets.value
      .map((s) => s.category)
      .filter((c): c is string => !!c);
    return Array.from(new Set(cats)).sort();
  });

  // 过滤后的句子列表
  const filteredSnippets = computed(() => {
    let result = snippets.value;

    // 按分类过滤
    if (selectedCategory.value) {
      result = result.filter((s) => s.category === selectedCategory.value);
    }

    // 按搜索词过滤
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.content.toLowerCase().includes(query) ||
          (s.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // 按使用次数降序排序
    return result.sort((a, b) => b.usageCount - a.usageCount);
  });

  /**
   * 生成唯一 ID
   */
  const generateId = (): string => {
    return `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * 加载配置
   */
  const loadConfig = async () => {
    try {
      isLoading.value = true;
      const config = await invoke<AppConfig>("load_config");
      snippets.value = config.snippets || [];
    } catch (error) {
      console.error("加载配置失败:", error);
      snippets.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 保存配置（需要从 scriptStore 获取 scripts 数据）
   */
  const saveConfig = async () => {
    try {
      const { useScriptStore } = await import("./scriptStore");
      const scriptStore = useScriptStore();

      const config: AppConfig = {
        theme: "dark",
        scripts: scriptStore.scripts,
        snippets: snippets.value,
        terminalType: scriptStore.terminalType,
        version: "1.0.0",
      };
      await invoke("save_config", { config });
    } catch (error) {
      console.error("保存配置失败:", error);
      throw error;
    }
  };

  /**
   * 添加句子
   */
  const addSnippet = async (data: SnippetFormData) => {
    const now = Date.now();
    const newSnippet: SnippetConfig = {
      id: generateId(),
      title: data.title,
      content: data.content,
      category: data.category,
      description: data.description,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    };
    snippets.value.push(newSnippet);
    await saveConfig();
    return newSnippet;
  };

  /**
   * 更新句子
   */
  const updateSnippet = async (id: string, updates: SnippetFormData) => {
    const index = snippets.value.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("句子不存在");
    }
    snippets.value[index] = {
      ...snippets.value[index],
      title: updates.title,
      content: updates.content,
      category: updates.category,
      description: updates.description,
      updatedAt: Date.now(),
    };
    await saveConfig();
  };

  /**
   * 删除句子
   */
  const deleteSnippet = async (id: string) => {
    const index = snippets.value.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("句子不存在");
    }
    snippets.value.splice(index, 1);
    await saveConfig();
  };

  /**
   * 增加使用次数
   */
  const incrementUsageCount = async (id: string) => {
    const snippet = snippets.value.find((s) => s.id === id);
    if (snippet) {
      snippet.usageCount++;
      await saveConfig();
    }
  };

  /**
   * 复制到剪贴板
   */
  const copyToClipboard = async (id: string): Promise<void> => {
    const snippet = snippets.value.find((s) => s.id === id);
    if (!snippet) {
      throw new Error("句子不存在");
    }

    // 使用 Tauri Clipboard Plugin
    await writeText(snippet.content);

    // 增加使用次数
    await incrementUsageCount(id);
  };

  return {
    // 状态
    snippets,
    isLoading,
    searchQuery,
    selectedCategory,
    // 计算属性
    snippetCount,
    categories,
    filteredSnippets,
    // 方法
    loadConfig,
    saveConfig,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    copyToClipboard,
  };
});
