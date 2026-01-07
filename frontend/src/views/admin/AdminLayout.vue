<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-dark text-white">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">SuperSports Admin</h2>
      </div>
      <nav class="p-4 space-y-2">
        <router-link to="/admin" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" exact-active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>
          Dashboard
        </router-link>
        <router-link to="/admin/seasons" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Seasons
        </router-link>
        <router-link to="/admin/streams" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Streams
        </router-link>
        <router-link to="/admin/plans" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          Plans
        </router-link>
        <router-link to="/admin/subscriptions" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          Subscriptions
        </router-link>
        <router-link to="/admin/users" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>
          Users
        </router-link>
        <router-link to="/admin/payments" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700" active-class="bg-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Payments
        </router-link>
        <div class="border-t border-gray-700 my-4"></div>
        <router-link to="/" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Site
        </router-link>
      </nav>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>
