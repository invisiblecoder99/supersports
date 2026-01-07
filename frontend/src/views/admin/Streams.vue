<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Streams</h1>
      <button @click="openModal()" class="btn btn-primary">Add Stream</button>
    </div>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Season</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="stream in streams" :key="stream.id">
            <td class="px-6 py-4">{{ stream.title }}</td>
            <td class="px-6 py-4">{{ stream.season?.name }}</td>
            <td class="px-6 py-4">
              <span v-if="stream.isLive" class="badge badge-live">LIVE</span>
              <span v-else-if="stream.isFree" class="badge bg-green-100 text-green-800">FREE</span>
              <span v-else class="badge bg-gray-100">Scheduled</span>
            </td>
            <td class="px-6 py-4 space-x-2">
              <button @click="toggleLive(stream)" class="text-orange-600 hover:underline">{{ stream.isLive ? 'Stop' : 'Go Live' }}</button>
              <button @click="openModal(stream)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deleteStream(stream.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Stream</h3>
        <form @submit.prevent="saveStream" class="space-y-4">
          <input v-model="form.title" placeholder="Stream Title" required class="w-full px-4 py-2 border rounded-lg" />
          <select v-model="form.seasonId" required class="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Season</option>
            <option v-for="s in seasons" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <textarea v-model="form.description" placeholder="Description" class="w-full px-4 py-2 border rounded-lg"></textarea>
          <input v-model="form.streamUrl" placeholder="Stream URL (HLS m3u8)" required class="w-full px-4 py-2 border rounded-lg" />
          <input v-model="form.thumbnail" placeholder="Thumbnail URL" class="w-full px-4 py-2 border rounded-lg" />
          <input v-model="form.scheduledAt" type="datetime-local" class="w-full px-4 py-2 border rounded-lg" />
          <div class="flex gap-4">
            <label class="flex items-center gap-2"><input v-model="form.isFree" type="checkbox" /> Free</label>
            <label class="flex items-center gap-2"><input v-model="form.isLive" type="checkbox" /> Live</label>
          </div>
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

const streams = ref([])
const seasons = ref([])
const showModal = ref(false)
const editing = ref(null)
const form = reactive({ title: '', seasonId: '', description: '', streamUrl: '', thumbnail: '', scheduledAt: '', isFree: false, isLive: false })

async function load() {
  const [streamsRes, seasonsRes] = await Promise.all([api.get('/streams/admin/all'), api.get('/seasons')])
  streams.value = streamsRes.data
  seasons.value = seasonsRes.data
}

function openModal(stream = null) {
  editing.value = stream
  if (stream) {
    Object.assign(form, { ...stream, scheduledAt: stream.scheduledAt?.slice(0, 16) })
  } else {
    Object.assign(form, { title: '', seasonId: '', description: '', streamUrl: '', thumbnail: '', scheduledAt: '', isFree: false, isLive: false })
  }
  showModal.value = true
}

async function saveStream() {
  const data = { ...form, scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null }
  if (editing.value) {
    await api.put(`/streams/${editing.value.id}`, data)
  } else {
    await api.post('/streams', data)
  }
  showModal.value = false
  load()
}

async function toggleLive(stream) {
  await api.patch(`/streams/${stream.id}/live`)
  load()
}

async function deleteStream(id) {
  if (confirm('Delete this stream?')) {
    await api.delete(`/streams/${id}`)
    load()
  }
}

onMounted(load)
</script>
