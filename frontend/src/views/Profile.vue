<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Profile</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-6">Account Information</h2>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div v-if="message" :class="messageType === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'" class="p-3 rounded-lg text-sm">{{ message }}</div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input v-model="form.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" disabled class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
            </div>
            <div class="border-t pt-4 mt-4">
              <h3 class="font-medium mb-4">Change Password</h3>
              <div class="space-y-4">
                <input v-model="form.currentPassword" type="password" placeholder="Current Password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input v-model="form.newPassword" type="password" placeholder="New Password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <button type="submit" :disabled="saving" class="btn btn-primary">{{ saving ? 'Saving...' : 'Save Changes' }}</button>
          </form>
        </div>
      </div>
      <div class="space-y-6">
        <div class="card p-6">
          <h3 class="font-bold mb-4">Quick Links</h3>
          <router-link to="/my-subscriptions" class="block text-primary hover:underline">My Subscriptions</router-link>
          <router-link to="/subscribe" class="block text-primary hover:underline mt-2">View Plans</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/composables/useApi'

const authStore = useAuthStore()
const form = reactive({ name: '', email: '', currentPassword: '', newPassword: '' })
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

async function updateProfile() {
  saving.value = true
  message.value = ''
  try {
    const data = { name: form.name }
    if (form.currentPassword && form.newPassword) {
      data.currentPassword = form.currentPassword
      data.newPassword = form.newPassword
    }
    await api.put('/auth/profile', data)
    messageType.value = 'success'
    message.value = 'Profile updated'
    form.currentPassword = ''
    form.newPassword = ''
  } catch (err) {
    messageType.value = 'error'
    message.value = err.response?.data?.error || 'Update failed'
  } finally { saving.value = false }
}

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name
    form.email = authStore.user.email
  }
})
</script>
