<template>
  <router-link :to="`/watch/${stream.id}`" class="card group hover:border-primary-500 transition">
    <div class="relative">
      <img :src="stream.thumbnail || 'https://via.placeholder.com/400x225'" :alt="stream.title" class="w-full aspect-video object-cover">
      <div v-if="isLive" class="absolute top-3 left-3"><span class="badge badge-live">LIVE</span></div>
      <div v-else-if="stream.isFree" class="absolute top-3 left-3"><span class="badge badge-free">FREE</span></div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold group-hover:text-primary-400">{{ stream.title }}</h3>
      <p class="text-dark-400 text-sm">{{ stream.season?.name }}</p>
    </div>
  </router-link>
</template>
<script setup>
defineProps({ stream: Object, isLive: Boolean })
</script>
