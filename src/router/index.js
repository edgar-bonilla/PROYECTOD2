import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AppAutomoviles from '../views/AppAutomoviles.vue';
import AppFabricantes from '../views/AppFabricantes.vue';
import AppDisenadores from '../views/AppDisenadores.vue';

const routes = [
  { path: '/', redirect: '/home' }, // Redirigir la raíz a /home
  { path: '/home', component: HomePage },
  { path: '/automoviles', component: AppAutomoviles },
  { path: '/fabricantes', component: AppFabricantes },
  { path: '/disenadores', component: AppDisenadores },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
