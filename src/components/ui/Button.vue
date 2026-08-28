<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary' && 'bg-[#0F2D8C] text-white hover:bg-[#0e2670] active:bg-[#0c215e] shadow-[0_6px_16px_rgba(15,45,140,0.22)] hover:shadow-[0_10px_24px_rgba(15,45,140,0.28)]',
      variant === 'secondary' && 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#0F2D8C]/20 hover:bg-neutral-50',
      variant === 'ghost' && 'text-neutral-600 hover:bg-neutral-100',
      variant === 'danger' && 'bg-red-100 text-red-700 hover:bg-red-200',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
    ]"
  >
    <slot />
  </button>
</template>
