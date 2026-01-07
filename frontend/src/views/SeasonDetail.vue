<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
    
    <template v-else-if="season">
      <!-- Season Header -->
      <div class="card p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-6">
          <img 
            v-if="season.thumbnail" 
            :src="season.thumbnail" 
            :alt="season.name"
            class="w-full md:w-64 h-48 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{{ season.name }}</h1>
            <p class="text-gray-600 mb-4">{{ season.description }}</p>
            <div class="flex items-center gap-4">
              <span class="badge badge-primary">{{ season._count?.streams || 0 }} Streams</span>
              <span v-if="hasAccess" class="badge bg-green-100 text-green-800">You have access</span>
            </div>
            <div v-if="!hasAccess" class="mt-4">
              <router-link to="/subscribe" class="btn btn-primary">
                Subscribe to Watch
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Streams List -->
      <h2 class="text-2xl font-bold mb-4">Streams</h2>
      
      <div v-if="streams.length === 0" class="text-center py-12 text-gray-500">
        No streams in this season yet.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StreamCard v-for="stream in streams" :key="stream.id" :stream="stream" />
      </div>
    </template>
    
    <div v-else class="text-center py-12 text-gray-500">
      Season not found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/composables/useApi'
import StreamCard from '@/components/StreamCard.vue'

const route = useRoute()
const authStore = useAuthStore()

const season = ref(null)
const streams = ref([])
const loading = ref(true)
const userSubscriptions = ref([])

const hasAccess = computed(() => {
  if (!authStore.isAuthenticated) return false
  
  // Check for monthly subscription
  const hasMonthly = userSubscriptions.value.some(sub => 
    sub.plan?.type === 'monthly' && sub.status === 'active'
  )
  if (hasMonthly) return true
  
  // Check for seasonal subscription to this season
  return userSubscriptions.value.some(sub => 
    sub.seasonId === season.value?.id && sub.status === 'active'
  )
})

onMounted(async () => {
  try {
    const [seasonRes, streamsRes] = await Promise.all([
      api.get(`/seasons/${route.params.id}`),
      api.get(`/seasons/${route.params.id}/streams`)
    ])
    
    season.value = seasonRes.data
    streams.value = streamsRes.data
    
    if (authStore.isAuthenticated) {
      const subsRes = await api.get('/subscriptions/my')
      userSubscriptions.value = subsRes.data
    }
  } catch (error) {
    console.error('Failed to load season:', error)
  } finally {
    loading.value = false
  }
})
</script>
