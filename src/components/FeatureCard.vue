<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: 'truth-table' | 'logic-laws' | 'exercises' | 'progress';
}

defineProps<Props>();
</script>

<template>
  <article class="feature-card">
    <div class="feature-card__icon" :class="`feature-card__icon--${icon}`">
      <svg
        v-if="icon === 'truth-table'"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M3 9h18M9 4v14" stroke="currentColor" stroke-width="1.5" />
        <path d="M14 13l1.7 1.7L19 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <svg
        v-else-if="icon === 'logic-laws'"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        v-else-if="icon === 'exercises'"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path d="M8 11l2 2 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>

      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 16.7l.9-5L4.8 8.2l5-.7L12 3Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h3 class="feature-card__title">{{ title }}</h3>
    <p class="feature-card__description">{{ description }}</p>
  </article>
</template>

<style scoped>
.feature-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  background: var(--color-white);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(15, 45, 141, 0.08);
  transform: translateY(-2px);
}

.feature-card__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue);
  background: var(--color-blue-light);
}

.feature-card__icon svg {
  width: 26px;
  height: 26px;
}

.feature-card__title {
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text-dark);
}

.feature-card__description {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-gray);
  margin: 0;
}
</style>
