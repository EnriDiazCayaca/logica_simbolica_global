<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="app">
    <NavBar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}
</style>
