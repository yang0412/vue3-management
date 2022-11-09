import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import plugin from "./plugin";
import i18n from "./locale";

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
const app = createApp(App).use(store).use(router).use(i18n).use(plugin);

app.mount("#app");
