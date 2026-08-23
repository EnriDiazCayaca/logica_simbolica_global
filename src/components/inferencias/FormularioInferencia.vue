<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InferenciaRequest } from '@/types/inferencias'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: InferenciaRequest): void
}>()

const premisasText = ref('')
const conclusionText = ref('')

const isFormEmpty = computed(() => {
  return premisasText.value.trim() === '' || conclusionText.value.trim() === ''
})

const handleSubmit = () => {
  if (isFormEmpty.value || props.isLoading) return

  const premisas = premisasText.value
    .split('\n')
    .map(p => p.trim())
    .filter(p => p !== '')

  emit('submit', {
    premisas,
    conclusion: conclusionText.value.trim()
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-2">
      <label for="premisas" class="block text-sm font-medium text-neutral-700">
        Premisas (una por línea)
      </label>
      <textarea
        id="premisas"
        v-model="premisasText"
        rows="4"
        :disabled="isLoading"
        placeholder="Ej: p -> q&#10;p"
        class="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      ></textarea>
    </div>

    <div class="space-y-2">
      <label for="conclusion" class="block text-sm font-medium text-neutral-700">
        Conclusión
      </label>
      <input
        id="conclusion"
        v-model="conclusionText"
        type="text"
        :disabled="isLoading"
        placeholder="Ej: q"
        class="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm placeholder-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      />
    </div>

    <div class="flex justify-end">
      <Button
        type="submit"
        variant="primary"
        :disabled="isFormEmpty || isLoading"
      >
        <span v-if="isLoading">Procesando...</span>
        <span v-else>Demostrar</span>
      </Button>
    </div>
  </form>
</template>
