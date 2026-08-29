<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="inline-flex items-center gap-2.5 cursor-pointer select-none">
    <span v-if="label" class="text-sm font-semibold text-neutral-700 w-5">{{ label }}</span>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :class="[
        'relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0',
        modelValue ? 'bg-blue-600' : 'bg-neutral-300'
      ]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        :class="[
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          modelValue && 'translate-x-4'
        ]"
      />
    </button>
    <span class="text-xs text-neutral-400 font-medium">{{ modelValue ? 'Activa' : 'Inactiva' }}</span>
  </label>
</template>
