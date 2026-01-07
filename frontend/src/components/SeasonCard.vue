<template>
  <router-link :to="`/season/${season.slug}`" class="card group hover:border-primary-500 transition">
    <div class="relative">
      <img :src="season.thumbnail || 'https://via.placeholder.com/400x225'" :alt="season.name" class="w-full aspect-video object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent"></div>
      <div class="absolute bottom-3 left-3"><h3 class="font-bold text-lg">{{ season.name }}</h3></div>
    </div>
    <div class="p-4">
      <p class="text-dark-400 text-sm mb-2">{{ season.description || 'No description' }}</p>
      <span class="text-dark-500 text-sm">{{ season._count?.streams || 0 }} streams</span>
    </div>
  </router-link>
</template>
<script setup>
defineProps({ season: Object })
</script>
