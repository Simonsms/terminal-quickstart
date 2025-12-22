<template>
  <div class="sidebar">
    <!-- Logo 和标题 -->
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <div class="logo-icon">
          <el-icon :size="32">
            <Monitor />
          </el-icon>
        </div>
        <div class="logo-glow"></div>
      </div>
      <h1 class="app-title">Terminal Quick</h1>
      <p class="app-subtitle">Script Launcher</p>
    </div>

    <!-- 导航菜单 -->
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
        <div v-if="activeMenu === item.id" class="active-indicator"></div>
      </div>
    </nav>

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-gradient"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Monitor, Setting, Document } from "@element-plus/icons-vue";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { id: "scripts", label: "Scripts", icon: Monitor },
  { id: "snippets", label: "Snippets", icon: Document },
  { id: "settings", label: "Settings", icon: Setting },
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
  width: 280px;
  height: 100vh;
  background: var(--tokyo-bg-darker);
  border-right: 1px solid var(--tokyo-border);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 侧边栏整体渐变背景 */
.sidebar::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(122, 162, 247, 0.08) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 0;
}

.sidebar > * {
  position: relative;
  z-index: 1;
}

/* 头部区域 */
.sidebar-header {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--tokyo-border);
}

.logo-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--tokyo-blue) 0%, var(--tokyo-purple) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 8px 24px var(--tokyo-glow-blue);
  position: relative;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    var(--tokyo-glow-blue) 0%,
    transparent 70%
  );
  border-radius: 50%;
  z-index: 1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.app-title {
  font-size: 22px;
  font-weight: var(--font-weight-bold);
  color: var(--tokyo-text-bright);
  margin-bottom: 6px;
  text-align: center;
  letter-spacing: -0.01em;
}

.app-subtitle {
  font-size: 13px;
  color: var(--tokyo-text-muted);
  font-weight: var(--font-weight-normal);
  text-align: center;
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--tokyo-text-dim);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--tokyo-blue) 0%, var(--tokyo-purple) 100%);
  transform: scaleY(0);
  transition: transform 0.25s ease;
  border-radius: 0 2px 2px 0;
}

.nav-item:hover {
  background: var(--tokyo-bg-card);
  color: var(--tokyo-text-bright);
}

.nav-item:hover::before {
  transform: scaleY(0.6);
}

.nav-item.active {
  background: var(--tokyo-bg-card);
  color: var(--tokyo-blue);
  box-shadow: 0 4px 12px rgba(122, 162, 247, 0.1);
}

.nav-item.active::before {
  transform: scaleY(1);
}

.nav-label {
  flex: 1;
  font-size: 15px;
  font-weight: var(--font-weight-medium);
}

.active-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tokyo-blue) 0%, var(--tokyo-purple) 100%);
  box-shadow: 0 0 8px var(--tokyo-glow-blue);
}

/* 底部装饰 */
.sidebar-footer {
  position: relative;
  height: 100px;
  overflow: hidden;
}

.footer-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(122, 162, 247, 0.05) 0%,
    transparent 100%
  );
}
</style>
