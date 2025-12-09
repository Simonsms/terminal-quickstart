<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import ScriptManage from "./views/ScriptManage.vue";
import SettingsView from "./views/SettingsView.vue";

const currentView = ref("scripts");

const handleMenuChange = (menuId: string) => {
  currentView.value = menuId;
};
</script>

<template>
  <div class="app-container">
    <Sidebar @menu-change="handleMenuChange" />
    <main class="main-content">
      <ScriptManage v-if="currentView === 'scripts'" />
      <SettingsView v-else-if="currentView === 'settings'" />
      <div v-else class="coming-soon">
        <h2>功能开发中...</h2>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bg-dark);
  overflow: hidden;
}

.main-content {
  flex: 1;
  background: var(--bg-dark);
  overflow: hidden;
  position: relative;
}

/* 背景装饰 */
.main-content::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
  pointer-events: none;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 12px;
}

.coming-soon h2 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
