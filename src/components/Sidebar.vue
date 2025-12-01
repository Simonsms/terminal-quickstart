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
  background: linear-gradient(180deg, #12121a 0%, #0d0d12 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
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
    rgba(59, 130, 246, 0.08) 0%,
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
    rgba(59, 130, 246, 0.2) 0%,
    rgba(99, 102, 241, 0.2) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
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
  background: linear-gradient(135deg, #ffffff 0%, #a0a0aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 0 2px 2px 0;
  transition: height 0.25s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
}

.nav-item:hover::before {
  height: 20px;
}

.nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(99, 102, 241, 0.1) 100%
  );
  color: #fff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
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
