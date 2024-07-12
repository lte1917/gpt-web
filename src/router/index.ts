import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'Root',
    component: ChatLayout,
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/register/index.vue'),
	},
	{
		path: '/forgetPassword',
		name: 'forgetPassword',
		component: () => import('@/views/forgetPassword/index.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
	},
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/homepage/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
