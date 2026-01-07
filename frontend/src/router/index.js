import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/Layout.vue'), children: [
    { path: '', name: 'Home', component: () => import('../views/Home.vue') },
    { path: 'seasons', name: 'Seasons', component: () => import('../views/Seasons.vue') },
    { path: 'season/:slug', name: 'SeasonDetail', component: () => import('../views/SeasonDetail.vue') },
    { path: 'watch/:streamId', name: 'Watch', component: () => import('../views/Watch.vue') },
    { path: 'subscribe/:seasonId?', name: 'Subscribe', component: () => import('../views/Subscribe.vue') },
    { path: 'profile', name: 'Profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },
    { path: 'my-subscriptions', name: 'MySubscriptions', component: () => import('../views/MySubscriptions.vue'), meta: { requiresAuth: true } },
    { path: 'payment/success', name: 'PaymentSuccess', component: () => import('../views/PaymentSuccess.vue') },
    { path: 'payment/cancel', name: 'PaymentCancel', component: () => import('../views/PaymentCancel.vue') },
  ]},
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/admin', component: () => import('../views/admin/AdminLayout.vue'), meta: { requiresAuth: true, requiresAdmin: true }, children: [
    { path: '', name: 'AdminDashboard', component: () => import('../views/admin/Dashboard.vue') },
    { path: 'seasons', name: 'AdminSeasons', component: () => import('../views/admin/Seasons.vue') },
    { path: 'streams', name: 'AdminStreams', component: () => import('../views/admin/Streams.vue') },
    { path: 'plans', name: 'AdminPlans', component: () => import('../views/admin/Plans.vue') },
    { path: 'subscriptions', name: 'AdminSubscriptions', component: () => import('../views/admin/Subscriptions.vue') },
    { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/Users.vue') },
    { path: 'payments', name: 'AdminPayments', component: () => import('../views/admin/Payments.vue') },
  ]},
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) next({ name: 'Login', query: { redirect: to.fullPath } })
  else if (to.meta.requiresAdmin && !auth.isAdmin) next({ name: 'Home' })
  else next()
})

export default router
