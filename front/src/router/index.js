import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/Login.vue'
import SignIn from '@/views/auth/SignIn.vue'
import ConfirmAccount from '@/views/auth/ConfirmAccount.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import Home from '@/views/Home.vue'
import Flow from '@/views/Flow.vue'
import Admin from '@/views/admin/Admin.vue'
import AdminUser from '@/views/admin/User.vue'
import AdminProject from '@/views/admin/Project.vue'
import AdminHardware from '@/views/admin/Hardware.vue'
import User from '@/views/User.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: PageNotFound
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
      children: [
        {
          path: ':id',
          component: SignIn
        }
      ]
    },
    {
      path: '/confirm-account',
      name: 'confirm-account',
      component: ConfirmAccount
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/flow',
      name: 'flow',
      component: Flow
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: 'user',
          component: AdminUser
        },
        {
          path: 'project',
          component: AdminProject
        },
				{
          path: 'hardware',
          component: AdminHardware
        },
      ]
    },
  ]
})

export default router
