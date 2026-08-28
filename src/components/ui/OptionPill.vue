<script setup lang="ts">
interface Props {
  label: string
  selected?: boolean
  state?: 'default' | 'correct' | 'incorrect'
}

withDefaults(defineProps<Props>(), {
  selected: false,
  state: 'default',
})

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    :class="[
      'w-full flex items-center gap-3.5 rounded-full px-5 py-3.5 text-sm font-bold text-left transition-all duration-150',
      'shadow-[0_3px_0_rgba(0,0,0,0.12)] active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.12)]',
      state === 'correct' && 'bg-emerald-500 text-white',
      state === 'incorrect' && 'bg-red-500 text-white',
      state === 'default' && !selected && 'bg-blue-600 text-white hover:bg-blue-700',
      state === 'default' && selected && 'bg-neutral-900 text-white ring-3 ring-blue-500/25',
    ]"
    @click="emit('select')"
  >
    <span
      :class="[
        'w-5 h-5 rounded-full shrink-0 transition-colors',
        state === 'correct' && 'bg-white/40',
        state === 'incorrect' && 'bg-white/40',
        state === 'default' && !selected && 'bg-white/50',
        state === 'default' && selected && 'bg-white',
      ]"
    />
    <span>{{ label }}</span>
  </button>
</template>
