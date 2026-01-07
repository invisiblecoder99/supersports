<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Subscriptions</h1>
      <button @click="showGrantModal = true" class="btn btn-primary">Grant Access</button>
    </div>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="sub in subscriptions" :key="sub.id">
            <td class="px-6 py-4">{{ sub.user?.email }}</td>
            <td class="px-6 py-4">{{ sub.plan?.name }}</td>
            <td class="px-6 py-4"><span :class="sub.status === 'active' ? 'badge bg-green-100 text-green-800' : 'badge bg-gray-100'">{{ sub.status }}</span></td>
            <td class="px-6 py-4">{{ new Date(sub.endDate).toLocaleDateString() }}</td>
            <td class="px-6 py-4">
              <button @click="cancelSub(sub.id)" class="text-red-600 hover:underline">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Grant Modal -->
    <div v-if="showGrantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="card max-w-lg w-full p-6">
        <h3 class="text-xl font-bold mb-4">Grant Subscription Access</h3>
        <form @submit.prevent="grantAccess" class="space-y-4">
          <input v-model="grantForm.email" type="email" placeholder="User Email" required class="w-full px-4 py-2 border rounded-lg" />
          <select v-model="grantForm.planId" required class="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Plan</option>
            <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <input v-model.number="grantForm.days" type="number" placeholder="Days" required class="w-full px-4 py-2 border rounded-lg" />
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary">Grant</button>
            <button type="button" @click="showGrantModal = false" class="btn bg-gray-200">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/composables/useApi'

const subscriptions = ref([])
const plans = ref([])
const showGrantModal = ref(false)
const grantForm = reactive({ email: '', planId: '', days: 30 })

async function load() {
  const [subsRes, plansRes] = await Promise.all([api.get('/subscriptions/admin/all'), api.get('/plans')])
  subscriptions.value = subsRes.data
  plans.value = plansRes.data
}

async function grantAccess() {
  await api.post('/subscriptions/grant', grantForm)
  showGrantModal.value = false
  load()
}

async function cancelSub(id) {
  if (confirm('Cancel?')) { await api.delete(`/subscriptions/${id}`); load() }
}

onMounted(load)
</script>
