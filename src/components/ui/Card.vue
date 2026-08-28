<script setup lang="ts">
interface Props {
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false
})
</script>

<template>
  <div
    :class="[
      'bg-white rounded-[16px] border border-neutral-200 p-6 transition-all duration-200',
      hoverable && 'hover:shadow-[0_10px_30px_rgba(15,45,140,0.08)] hover:border-[#0F2D8C]/20 hover:-translate-y-0.5 cursor-pointer'
    ]"
  >
    <slot />
  </div>
</template>
