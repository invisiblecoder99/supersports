<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p class="text-gray-600 mb-8">Your subscription is now active.</p>
      <div class="space-x-4">
        <router-link to="/" class="btn btn-primary">Start Watching</router-link>
        <router-link to="/my-subscriptions" class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">View Subscriptions</router-link>
      </div>
    </div>
  </div>
</template>
