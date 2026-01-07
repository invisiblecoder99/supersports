<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">All Seasons</h1>
    
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
    
    <div v-else-if="seasons.length === 0" class="text-center py-12 text-gray-500">
      No seasons available yet.
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SeasonCard v-for="season in seasons" :key="season.id" :season="season" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'
import SeasonCard from '@/components/SeasonCard.vue'

const seasons = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/seasons')
    seasons.value = response.data
  } catch (error) {
    console.error('Failed to load seasons:', error)
  } finally {
    loading.value = false
  }
})
</script>
