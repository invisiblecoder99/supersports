<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Subscription Plans</h1>
      <button @click="openModal()" class="btn btn-primary">Add Plan</button>
    </div>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="plan in plans" :key="plan.id">
            <td class="px-6 py-4">{{ plan.name }}</td>
            <td class="px-6 py-4">{{ plan.type }}</td>
            <td class="px-6 py-4">${{ plan.price }}</td>
            <td class="px-6 py-4"><span :class="plan.isActive ? 'badge bg-green-100 text-green-800' : 'badge bg-gray-100'">{{ plan.isActive ? 'Active' : 'Inactive' }}</span></td>
            <td class="px-6 py-4 space-x-2">
              <button @click="openModal(plan)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deletePlan(plan.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="card max-w-lg w-full p-6">
        <h3 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Plan</h3>
        <form @submit.prevent="savePlan" class="space-y-4">
          <input v-model="form.name" placeholder="Plan Name" required class="w-full px-4 py-2 border rounded-lg" />
          <select v-model="form.type" required class="w-full px-4 py-2 border rounded-lg">
            <option value="monthly">Monthly</option>
            <option value="seasonal">Seasonal</option>
          </select>
          <input v-model.number="form.price" type="number" step="0.01" placeholder="Price" required class="w-full px-4 py-2 border rounded-lg" />
          <input v-model.number="form.duration" type="number" placeholder="Duration (days)" required class="w-full px-4 py-2 border rounded-lg" />
          <textarea v-model="form.description" placeholder="Description" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <select v-if="form.type === 'seasonal'" v-model="form.seasonId" class="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Season (optional)</option>
            <option v-for="s in seasons" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <label class="flex items-center gap-2"><input v-model="form.isActive" type="checkbox" /> Active</label>
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="showModal = false" class="btn bg-gray-200">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/composables/useApi'

const plans = ref([])
const seasons = ref([])
const showModal = ref(false)
const editing = ref(null)
const form = reactive({ name: '', type: 'monthly', price: 0, duration: 30, description: '', seasonId: '', isActive: true })

async function load() {
  const [plansRes, seasonsRes] = await Promise.all([api.get('/plans'), api.get('/seasons')])
  plans.value = plansRes.data
  seasons.value = seasonsRes.data
}

function openModal(plan = null) {
  editing.value = plan
  if (plan) Object.assign(form, plan)
  else Object.assign(form, { name: '', type: 'monthly', price: 0, duration: 30, description: '', seasonId: '', isActive: true })
  showModal.value = true
}

async function savePlan() {
  if (editing.value) await api.put(`/plans/${editing.value.id}`, form)
  else await api.post('/plans', form)
  showModal.value = false
  load()
}

async function deletePlan(id) {
  if (confirm('Delete?')) { await api.delete(`/plans/${id}`); load() }
}

onMounted(load)
</script>
