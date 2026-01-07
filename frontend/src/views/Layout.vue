<template>
  <div class="min-h-screen">
    <nav class="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <router-link to="/" class="text-2xl font-bold text-primary-500">SuperSports</router-link>
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-dark-300 hover:text-white">Home</router-link>
          <router-link to="/seasons" class="text-dark-300 hover:text-white">Seasons</router-link>
          <router-link to="/subscribe" class="text-dark-300 hover:text-white">Subscribe</router-link>
          <template v-if="auth.isAuthenticated">
            <router-link v-if="auth.isAdmin" to="/admin" class="btn btn-secondary text-sm">Admin</router-link>
            <router-link to="/profile" class="text-dark-300 hover:text-white">{{ auth.user?.name }}</router-link>
            <button @click="logout" class="text-red-400 hover:text-red-300">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-dark-300 hover:text-white">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Sign Up</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main><router-view /></main>
    <footer class="bg-dark-900 border-t border-dark-700 mt-16 py-8 text-center text-dark-400">© 2024 SuperSports</footer>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore(), router = useRouter()
function logout() { auth.logout(); router.push('/') }
</script>
