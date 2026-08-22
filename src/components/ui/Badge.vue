<script setup lang="ts">
interface Props {
  variant?: 'blue' | 'green' | 'yellow' | 'red'
}

withDefaults(defineProps<Props>(), {
  variant: 'blue'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'blue' && 'bg-blue-100 text-blue-700',
      variant === 'green' && 'bg-green-100 text-green-700',
      variant === 'yellow' && 'bg-yellow-100 text-yellow-700',
      variant === 'red' && 'bg-red-100 text-red-700',
    ]"
  >
    <slot />
  </span>
</template>
