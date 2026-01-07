<template><div class="min-h-screen bg-dark-950"><router-view /></div></template>
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
onMounted(() => useAuthStore().initAuth())
</script>
