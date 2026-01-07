import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null), token = ref(null), loading = ref(false)
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function initAuth() {
    const t = localStorage.getItem('token'), u = localStorage.getItem('user')
    if (t && u) { token.value = t; user.value = JSON.parse(u); api.defaults.headers.common['Authorization'] = `Bearer ${t}` }
  }

  async function login(email, password) {
    loading.value = true
    try {
      const res = await api.post('/api/auth/login', { email, password })
      token.value = res.data.token; user.value = res.data.user
      localStorage.setItem('token', res.data.token); localStorage.setItem('user', JSON.stringify(res.data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      return { success: true }
    } catch (e) { return { success: false, error: e.response?.data?.error || 'Login failed' } }
    finally { loading.value = false }
  }

  async function register(name, email, password) {
    loading.value = true
    try {
      const res = await api.post('/api/auth/register', { name, email, password })
      token.value = res.data.token; user.value = res.data.user
      localStorage.setItem('token', res.data.token); localStorage.setItem('user', JSON.stringify(res.data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      return { success: true }
    } catch (e) { return { success: false, error: e.response?.data?.error || 'Registration failed' } }
    finally { loading.value = false }
  }

  async function fetchProfile() {
    try { const res = await api.get('/api/auth/profile'); user.value = res.data; localStorage.setItem('user', JSON.stringify(res.data)) }
    catch { logout() }
  }

  function logout() { user.value = null; token.value = null; localStorage.removeItem('token'); localStorage.removeItem('user'); delete api.defaults.headers.common['Authorization'] }

  return { user, token, loading, isAuthenticated, isAdmin, initAuth, login, register, fetchProfile, logout }
})
