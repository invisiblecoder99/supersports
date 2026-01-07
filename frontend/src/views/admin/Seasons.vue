<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Seasons</h1>
      <button @click="openModal()" class="btn btn-primary">Add Season</button>
    </div>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streams</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="season in seasons" :key="season.id">
            <td class="px-6 py-4">{{ season.name }}</td>
            <td class="px-6 py-4"><span :class="season.isActive ? 'badge bg-green-100 text-green-800' : 'badge bg-gray-100'">{{ season.isActive ? 'Active' : 'Inactive' }}</span></td>
            <td class="px-6 py-4">{{ season._count?.streams || 0 }}</td>
            <td class="px-6 py-4 space-x-2">
              <button @click="openModal(season)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deleteSeason(season.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="card max-w-lg w-full p-6">
        <h3 class="text-xl font-bold mb-4">{{ editingSeason ? 'Edit' : 'Add' }} Season</h3>
        <form @submit.prevent="saveSeason" class="space-y-4">
          <input v-model="form.name" placeholder="Season Name" required class="w-full px-4 py-2 border rounded-lg" />
          <input v-model="form.slug" placeholder="Slug (url-friendly)" required class="w-full px-4 py-2 border rounded-lg" />
          <textarea v-model="form.description" placeholder="Description" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <input v-model="form.thumbnail" placeholder="Thumbnail URL" class="w-full px-4 py-2 border rounded-lg" />
          <div class="grid grid-cols-2 gap-4">
            <input v-model="form.startDate" type="date" required class="px-4 py-2 border rounded-lg" />
            <input v-model="form.endDate" type="date" required class="px-4 py-2 border rounded-lg" />
          </div>
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

const seasons = ref([])
const showModal = ref(false)
const editingSeason = ref(null)
const form = reactive({ name: '', slug: '', description: '', thumbnail: '', startDate: '', endDate: '', isActive: true })

async function loadSeasons() {
  const res = await api.get('/seasons')
  seasons.value = res.data
}

function openModal(season = null) {
  editingSeason.value = season
  if (season) {
    Object.assign(form, { ...season, startDate: season.startDate?.split('T')[0], endDate: season.endDate?.split('T')[0] })
  } else {
    Object.assign(form, { name: '', slug: '', description: '', thumbnail: '', startDate: '', endDate: '', isActive: true })
  }
  showModal.value = true
}

async function saveSeason() {
  const data = { ...form, startDate: new Date(form.startDate).toISOString(), endDate: new Date(form.endDate).toISOString() }
  if (editingSeason.value) {
    await api.put(`/seasons/${editingSeason.value.id}`, data)
  } else {
    await api.post('/seasons', data)
  }
  showModal.value = false
  loadSeasons()
}

async function deleteSeason(id) {
  if (confirm('Delete this season?')) {
    await api.delete(`/seasons/${id}`)
    loadSeasons()
  }
}

onMounted(loadSeasons)
</script>
