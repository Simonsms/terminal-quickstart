import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type ThemeType = 'dark' | 'light';

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 获取保存的主题，默认为 dark
  const getInitialTheme = (): ThemeType => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark';
  };

  const theme = ref<ThemeType>(getInitialTheme());

  // 应用主题到 document
  const applyTheme = (newTheme: ThemeType) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  // 设置主题
  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme;
  };

  // 监听主题变化，保存到 localStorage 并应用
  watch(theme, (newTheme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  }, { immediate: true });

  return {
    theme,
    toggleTheme,
    setTheme,
  };
});
