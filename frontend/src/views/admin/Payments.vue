<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Payments</h1>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="payment in payments" :key="payment.id">
            <td class="px-6 py-4">{{ payment.user?.email }}</td>
            <td class="px-6 py-4">${{ payment.amount }} {{ payment.currency }}</td>
            <td class="px-6 py-4">{{ payment.provider }}</td>
            <td class="px-6 py-4">
              <span :class="statusClass(payment.status)" class="badge">{{ payment.status }}</span>
            </td>
            <td class="px-6 py-4">{{ new Date(payment.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'

const payments = ref([])

function statusClass(status) {
  switch(status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100'
  }
}

onMounted(async () => {
  const res = await api.get('/subscriptions/payments')
  payments.value = res.data
})
</script>
