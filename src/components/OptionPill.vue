<script setup lang="ts">
interface Props {
  label: string;
  selected?: boolean;
  state?: 'default' | 'correct' | 'incorrect';
}

withDefaults(defineProps<Props>(), {
  selected: false,
  state: 'default',
});

const emit = defineEmits<{ select: [] }>();
</script>

<template>
  <button
    type="button"
    class="option-pill"
    :class="[
      { 'option-pill--selected': selected },
      state !== 'default' ? `option-pill--${state}` : '',
    ]"
    @click="emit('select')"
  >
    <span class="option-pill__dot" aria-hidden="true"></span>
    <span class="option-pill__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.option-pill {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  border-radius: 999px;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-align: left;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.12s ease, background 0.2s ease, box-shadow 0.12s ease;
}

.option-pill:hover {
  background: var(--color-blue-hover);
}

.option-pill:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
}

.option-pill__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}

.option-pill--selected {
  background: var(--color-navy);
  box-shadow: 0 0 0 3px rgba(15, 45, 141, 0.25);
}

.option-pill--selected .option-pill__dot {
  background: var(--color-white);
}

.option-pill--correct {
  background: #1f9d55;
}

.option-pill--incorrect {
  background: #d64545;
}
</style>
