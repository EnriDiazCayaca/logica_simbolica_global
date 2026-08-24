<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
}

defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <label class="toggle">
    <span v-if="label" class="toggle__label">{{ label }}</span>
    <button
      type="button"
      class="toggle__track"
      :class="{ 'toggle__track--on': modelValue }"
      role="switch"
      :aria-checked="modelValue"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="toggle__thumb"></span>
    </button>
    <span class="toggle__state">{{ modelValue ? 'Activa' : 'Inactiva' }}</span>
  </label>
</template>

<style scoped>
.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle__label {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-text-dark);
  width: 18px;
}

.toggle__track {
  width: 42px;
  height: 22px;
  border-radius: 999px;
  background: #d9dee8;
  border: none;
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle__track--on {
  background: var(--color-blue);
}

.toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-white);
  transition: transform 0.2s ease;
}

.toggle__track--on .toggle__thumb {
  transform: translateX(20px);
}

.toggle__state {
  font-size: 13px;
  color: var(--color-text-gray);
  font-weight: 600;
}
</style>
