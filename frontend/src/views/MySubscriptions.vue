<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Subscriptions</h1>
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
    <div v-else-if="subscriptions.length === 0" class="text-center py-12">
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Subscriptions Yet</h3>
      <p class="text-gray-500 mb-4">Subscribe to start watching</p>
      <router-link to="/subscribe" class="btn btn-primary">View Plans</router-link>
    </div>
    <div v-else class="space-y-4">
      <div v-for="sub in subscriptions" :key="sub.id" class="card p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold">{{ sub.plan?.name }}</h3>
              <span :class="statusClass(sub.status)" class="badge">{{ sub.status }}</span>
            </div>
            <p class="text-gray-600 text-sm">{{ sub.plan?.type === 'monthly' ? 'Monthly' : 'Season Pass' }}</p>
          </div>
          <div class="text-right text-sm text-gray-500">
            <p>Started: {{ formatDate(sub.startDate) }}</p>
            <p>Expires: {{ formatDate(sub.endDate) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'

const subscriptions = ref([])
const loading = ref(true)

function formatDate(date) { return new Date(date).toLocaleDateString() }
function statusClass(status) {
  return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  try {
    const response = await api.get('/subscriptions/my')
    subscriptions.value = response.data
  } catch (error) { console.error(error) }
  finally { loading.value = false }
})
</script>
