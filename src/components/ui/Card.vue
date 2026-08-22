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
      'bg-white rounded-xl border border-neutral-200 p-6 transition-all duration-200',
      hoverable && 'hover:shadow-md hover:border-blue-400 cursor-pointer'
    ]"
  >
    <slot />
  </div>
</template>
