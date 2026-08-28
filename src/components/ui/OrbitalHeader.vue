<script setup lang="ts">
import OrbitalCanvas from '@/components/effects/OrbitalCanvas.vue'
defineProps<{ icon?: string, kicker?: string, title: string, subtitle?: string, gradient?: string }>()
</script>

<template>
  <div class="relative overflow-hidden rounded-[20px] bg-[#020617] border border-white/10">
    <div class="absolute inset-0">
      <div class="absolute inset-0" :class="gradient || 'bg-gradient-to-br from-[#0F2D8C] via-[#1e1b9e] to-[#020617]'" />
      <div class="absolute inset-0 opacity-50" style="background: radial-gradient(600px 300px at 30% 20%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(500px 300px at 85% 15%, rgba(236,72,153,0.22), transparent 60%);" />
      <div class="absolute inset-0 orbital-grid opacity-[0.06]" />
    </div>
    <div class="absolute inset-0 opacity-[0.35]"><OrbitalCanvas /></div>
    <div class="relative px-6 sm:px-8 py-8 sm:py-9">
      <div class="flex items-start gap-4">
        <div v-if="icon" class="w-12 h-12 rounded-xl bg-white/10 glass border border-white/15 grid place-items-center text-white font-black text-lg shadow-lg shrink-0">{{ icon }}</div>
        <div>
          <div v-if="kicker" class="text-[11px] font-bold tracking-[0.16em] uppercase text-white/60 mb-1">{{ kicker }}</div>
          <h1 class="text-2xl sm:text-[28px] font-black tracking-tight text-white leading-tight">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-white/70 mt-1.5 max-w-2xl leading-relaxed">{{ subtitle }}</p>
          <div class="mt-3 flex flex-wrap gap-1.5"><slot name="chips" /></div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2"><slot /></div>
    </div>
    <div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
</template>
