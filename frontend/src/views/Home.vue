<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Live Sports Streaming</h1>
        <p class="text-xl mb-8 opacity-90">Watch your favorite sports live, anytime, anywhere</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
          Get Started
        </router-link>
        <router-link v-else to="/subscribe" class="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
          View Plans
        </router-link>
      </div>
    </section>

    <!-- Live Now Section -->
    <section v-if="liveStreams.length > 0" class="py-12 bg-red-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-3 mb-6">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 class="text-2xl font-bold text-gray-900">Live Now</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StreamCard v-for="stream in liveStreams" :key="stream.id" :stream="stream" />
        </div>
      </div>
    </section>

    <!-- Upcoming Streams -->
    <section v-if="upcomingStreams.length > 0" class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Upcoming Streams</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StreamCard v-for="stream in upcomingStreams" :key="stream.id" :stream="stream" />
        </div>
      </div>
    </section>

    <!-- Seasons Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Browse Seasons</h2>
          <router-link to="/seasons" class="text-primary hover:underline">View All</router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SeasonCard v-for="season in seasons.slice(0, 4)" :key="season.id" :season="season" />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-dark text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Never Miss a Game</h2>
        <p class="text-lg mb-8 opacity-80">Subscribe now and get unlimited access to all live sports</p>
        <router-link to="/subscribe" class="btn btn-primary text-lg px-8 py-3">
          Choose Your Plan
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import api from '@/composables/useApi'
import StreamCard from '@/components/StreamCard.vue'
import SeasonCard from '@/components/SeasonCard.vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const liveStreams = ref([])
const upcomingStreams = ref([])
const seasons = ref([])

onMounted(async () => {
  try {
    const [streamsRes, seasonsRes] = await Promise.all([
      api.get('/streams'),
      api.get('/seasons')
    ])
    
    const allStreams = streamsRes.data
    liveStreams.value = allStreams.filter(s => s.isLive)
    upcomingStreams.value = allStreams.filter(s => !s.isLive && new Date(s.scheduledAt) > new Date()).slice(0, 6)
    seasons.value = seasonsRes.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
