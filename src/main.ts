import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./style.css";
import App from "./App.vue";
import { useThemeStore } from "./stores/themeStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);

// 初始化主题 - 必须在 pinia 挂载后调用
useThemeStore();

app.mount("#app");
