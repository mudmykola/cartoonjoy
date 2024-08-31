import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/tailwindcss/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.config.globalProperties.$appVersion = import.meta.env.VITE_APP_VERSION;
app.mount('#app');
