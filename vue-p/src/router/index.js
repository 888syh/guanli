import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'
import { getUserRole } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const role = getUserRole();
      
      // 严格检查角色是否存在且有效
      if (role && ['admin', 'user'].includes(role)) {
        next();
      } else {
        next('/');
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router