<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="card max-w-md w-full p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Create Account</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="********"
          />
          <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="********"
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="btn btn-primary w-full py-3"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      
      <p class="text-center mt-6 text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-primary hover:underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form.name, form.email, form.password)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
