<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold mb-4">Choose Your Plan</h1>
      <p class="text-gray-600">Get unlimited access to live sports streaming</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <div v-else>
      <!-- Monthly Plans -->
      <div v-if="monthlyPlans.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Monthly Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="plan in monthlyPlans" :key="plan.id" class="card p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="text-3xl font-bold text-primary mb-4">
              ${{ plan.price }}<span class="text-sm text-gray-500">/month</span>
            </div>
            <p class="text-gray-600 mb-4">{{ plan.description }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="feature in parseFeatures(plan.features)" :key="feature" class="flex items-center gap-2 text-sm">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ feature }}
              </li>
            </ul>
            <button @click="selectPlan(plan)" class="btn btn-primary w-full">Subscribe Now</button>
          </div>
        </div>
      </div>

      <!-- Seasonal Plans -->
      <div v-if="seasonalPlans.length > 0">
        <h2 class="text-2xl font-bold mb-6">Season Passes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="plan in seasonalPlans" :key="plan.id" class="card p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="text-3xl font-bold text-primary mb-4">${{ plan.price }}</div>
            <p class="text-gray-600 mb-4">{{ plan.description }}</p>
            <button @click="selectPlan(plan)" class="btn btn-primary w-full">Get Season Pass</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="selectedPlan" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="card max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Complete Payment</h3>
          <button @click="selectedPlan = null" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <p class="font-medium">{{ selectedPlan.name }}</p>
          <p class="text-2xl font-bold text-primary">${{ selectedPlan.price }}</p>
        </div>
        <div class="space-y-3">
          <button @click="checkout('stripe')" :disabled="processing" class="btn w-full py-3 bg-blue-600 hover:bg-blue-700 text-white">Pay with Card</button>
          <button @click="checkout('btcpay')" :disabled="processing" class="btn w-full py-3 bg-orange-500 hover:bg-orange-600 text-white">Pay with Bitcoin</button>
          <button @click="checkout('nowpayments')" :disabled="processing" class="btn w-full py-3 bg-purple-600 hover:bg-purple-700 text-white">Pay with Crypto</button>
        </div>
        <p v-if="error" class="mt-4 text-red-600 text-sm text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/composables/useApi'

const router = useRouter()
const authStore = useAuthStore()
const plans = ref([])
const loading = ref(true)
const selectedPlan = ref(null)
const processing = ref(false)
const error = ref('')

const monthlyPlans = computed(() => plans.value.filter(p => p.type === 'monthly'))
const seasonalPlans = computed(() => plans.value.filter(p => p.type === 'seasonal'))

function parseFeatures(features) {
  try { return features ? JSON.parse(features) : [] } catch { return [] }
}

function selectPlan(plan) {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  selectedPlan.value = plan
}

async function checkout(provider) {
  processing.value = true
  error.value = ''
  try {
    const response = await api.post('/subscriptions/checkout', { planId: selectedPlan.value.id, provider })
    if (response.data.url) window.location.href = response.data.url
  } catch (err) {
    error.value = err.response?.data?.error || 'Payment failed'
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/plans')
    plans.value = response.data.filter(p => p.isActive)
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})
</script>
