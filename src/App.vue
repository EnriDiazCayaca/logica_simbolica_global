<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased">
    <AppNavBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppNavBar from '@/components/layout/AppNavBar.vue'
</script>
