<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
    
    <template v-else-if="stream">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-black rounded-lg overflow-hidden mb-6">
            <div v-if="!hasAccess && !stream.isFree" class="aspect-video flex items-center justify-center bg-gray-900">
              <div class="text-center text-white p-8">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <h3 class="text-xl font-semibold mb-2">Subscription Required</h3>
                <p class="text-gray-400 mb-4">Subscribe to watch this stream</p>
                <router-link to="/subscribe" class="btn btn-primary">View Plans</router-link>
              </div>
            </div>
            <div v-else-if="!stream.isLive && !streamUrl" class="aspect-video flex items-center justify-center bg-gray-900">
              <div class="text-center text-white p-8">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-xl font-semibold mb-2">Stream Not Live</h3>
                <p class="text-gray-400">Scheduled for {{ formatDate(stream.scheduledAt) }}</p>
              </div>
            </div>
            <video v-else ref="videoPlayer" class="w-full aspect-video" controls autoplay></video>
          </div>
          <div class="card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span v-if="stream.isLive" class="badge badge-live">LIVE</span>
                  <span v-if="stream.isFree" class="badge bg-green-100 text-green-800">FREE</span>
                </div>
                <h1 class="text-2xl font-bold">{{ stream.title }}</h1>
              </div>
            </div>
            <p v-if="stream.description" class="text-gray-600 mb-4">{{ stream.description }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span v-if="stream.season">Season: <router-link :to="'/seasons/' + stream.season.id" class="text-primary hover:underline">{{ stream.season.name }}</router-link></span>
              <span>Scheduled: {{ formatDate(stream.scheduledAt) }}</span>
            </div>
          </div>
        </div>
        <div class="lg:col-span-1">
          <div class="card h-[600px] flex flex-col">
            <div class="p-4 border-b border-gray-200">
              <h3 class="font-semibold flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Live Chat
                <span class="text-xs text-gray-500">({{ chatMessages.length }} messages)</span>
              </h3>
            </div>
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
              <div v-if="chatMessages.length === 0" class="text-center text-gray-400 py-8">No messages yet. Be the first to chat!</div>
              <div v-for="msg in chatMessages" :key="msg.id" class="flex gap-2">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">{{ getInitial(msg.user) }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline gap-2">
                    <span class="font-medium text-sm">{{ msg.user?.name || 'Anonymous' }}</span>
                    <span class="text-xs text-gray-400">{{ formatTime(msg.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-gray-700 break-words">{{ msg.message }}</p>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200">
              <div v-if="!authStore.isAuthenticated" class="text-center text-sm text-gray-500">
                <router-link to="/login" class="text-primary hover:underline">Sign in</router-link> to join the chat
              </div>
              <form v-else class="flex gap-2" @submit.prevent="sendMessage">
                <input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm" :disabled="sendingMessage" maxlength="500" />
                <button type="submit" :disabled="!newMessage.trim() || sendingMessage" class="btn btn-primary px-4 py-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div v-else class="text-center py-12 text-gray-500">Stream not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/composables/useApi'
import Hls from 'hls.js'

const route = useRoute()
const authStore = useAuthStore()

const stream = ref(null)
const streamUrl = ref(null)
const loading = ref(true)
const hasAccess = ref(false)
const videoPlayer = ref(null)
const chatContainer = ref(null)
const chatMessages = ref([])
const newMessage = ref('')
const sendingMessage = ref(false)
let chatPollInterval = null
let hls = null

function formatDate(date) {
  return new Date(date).toLocaleString()
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getInitial(user) {
  return user?.name?.charAt(0).toUpperCase() || 'U'
}

async function initPlayer() {
  if (!streamUrl.value || !videoPlayer.value) return
  if (Hls.isSupported()) {
    hls = new Hls()
    hls.loadSource(streamUrl.value)
    hls.attachMedia(videoPlayer.value)
  } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.value.src = streamUrl.value
  }
}

async function loadChatMessages() {
  try {
    const response = await api.get('/streams/' + route.params.id + '/chat')
    chatMessages.value = response.data
  } catch (error) {
    console.error('Failed to load chat:', error)
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || sendingMessage.value) return
  sendingMessage.value = true
  try {
    const response = await api.post('/streams/' + route.params.id + '/chat', { message: newMessage.value.trim() })
    chatMessages.value.push(response.data)
    newMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sendingMessage.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

watch(streamUrl, () => {
  if (streamUrl.value) setTimeout(initPlayer, 100)
})

watch(chatMessages, () => scrollToBottom(), { deep: true })

onMo
