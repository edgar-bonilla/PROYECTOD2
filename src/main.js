import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);


app.config.globalProperties.$url = import.meta.env.VITE_API_URL || 'http://localhost:8888';

app.use(router).mount('#app');
