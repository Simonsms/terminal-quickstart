<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="app-logo">
        <el-icon :size="32" color="#409EFF">
          <Monitor />
        </el-icon>
      </div>
      <h1 class="app-title">Terminal Quick</h1>
      <p class="app-subtitle">终端快捷启动</p>
    </div>

    <nav class="nav-menu">
      <div
        v-for="item in menuItems"
        :key="item.id"
        :class="['nav-item', { active: activeMenu === item.id }]"
        @click="handleMenuClick(item.id)"
      >
        <el-icon :size="20">
          <component :is="item.icon" />
        </el-icon>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Monitor, Setting } from "@element-plus/icons-vue";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { id: "scripts", label: "脚本管理", icon: Monitor },
  { id: "settings", label: "设置", icon: Setting },
];

const activeMenu = ref("scripts");

const emit = defineEmits<{
  menuChange: [menuId: string];
}>();

const handleMenuClick = (menuId: string) => {
  activeMenu.value = menuId;
  emit("menuChange", menuId);
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-dark) 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: relative;
}

/* 微光效果 */
.sidebar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: radial-gradient(
    ellipse at 50% 0%,
    var(--primary-light) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.sidebar-header {
  padding: 0 24px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(
    135deg,
    var(--primary-light) 0%,
    var(--primary-light) 100%
  );
  border: 1px solid var(--primary-color);
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px var(--primary-glow);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.app-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 400;
}

.nav-menu {
  flex: 1;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  margin-bottom: 6px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-secondary);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, #6366f1 100%);
  border-radius: 0 2px 2px 0;
  transition: height 0.25s ease;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item:hover::before {
  height: 20px;
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary-color);
  box-shadow: 0 4px 20px var(--primary-glow);
}

.nav-item.active::before {
  height: 24px;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
}
</style>
