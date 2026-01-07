<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Users</h1>
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <select v-model="user.role" @change="updateRole(user)" class="border rounded px-2 py-1">
                <option value="user">User</option>
                <option value="vip">VIP</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td class="px-6 py-4">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
            <td class="px-6 py-4">
              <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'

const users = ref([])

async function load() {
  const res = await api.get('/auth/users')
  users.value = res.data
}

async function updateRole(user) {
  await api.put(`/auth/users/${user.id}/role`, { role: user.role })
}

async function deleteUser(id) {
  if (confirm('Delete user?')) { await api.delete(`/auth/users/${id}`); load() }
}

onMounted(load)
</script>
