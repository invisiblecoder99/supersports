<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p class="text-gray-600 mb-8">No charges were made.</p>
      <div class="space-x-4">
        <router-link to="/subscribe" class="btn btn-primary">Try Again</router-link>
        <router-link to="/" class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">Go Home</router-link>
      </div>
    </div>
  </div>
</template>
