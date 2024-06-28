import '@/assets/tailwind.css'
import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css';

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
const app = createApp(App)
app.config.globalProperties.$baseUrl = import.meta.env.VITE_BASE_URL;
app.use(router)
app.use(Toast);
app.mount('#app')