<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <p class="text-gray-500 text-sm">Total Users</p>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>
      <div class="card p-6">
        <p class="text-gray-500 text-sm">Active Subscriptions</p>
        <p class="text-3xl font-bold">{{ stats.activeSubscriptions }}</p>
      </div>
      <div class="card p-6">
        <p class="text-gray-500 text-sm">Total Seasons</p>
        <p class="text-3xl font-bold">{{ stats.seasons }}</p>
      </div>
      <div class="card p-6">
        <p class="text-gray-500 text-sm">Total Revenue</p>
        <p class="text-3xl font-bold text-green-600">${{ stats.totalRevenue?.toFixed(2) || '0.00' }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="font-bold mb-4">Quick Actions</h3>
        <div class="space-y-2">
          <router-link to="/admin/streams" class="block text-primary hover:underline">Manage Streams</router-link>
          <router-link to="/admin/seasons" class="block text-primary hover:underline">Manage Seasons</router-link>
          <router-link to="/admin/subscriptions" class="block text-primary hover:underline">Grant Access</router-link>
        </div>
      </div>
      <div class="card p-6">
        <h3 class="font-bold mb-4">System Info</h3>
        <p class="text-sm text-gray-600">Streams: {{ stats.streams }}</p>
        <p class="text-sm text-gray-600">Seasons: {{ stats.seasons }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'

const stats = ref({ users: 0, activeSubscriptions: 0, seasons: 0, streams: 0, totalRevenue: 0 })

onMounted(async () => {
  try {
    const response = await api.get('/stats')
    stats.value = response.data
  } catch (error) { console.error(error) }
})
</script>
