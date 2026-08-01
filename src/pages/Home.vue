<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 p-8 font-sans">
    <div class="max-w-5xl mx-auto space-y-12">
      <header class="text-center space-y-4 pt-12">
        <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider">
          Powered by Vue 3 + Vite
        </span>
        <h1 class="text-5xl font-extrabold tracking-tight text-blue-900">
          Lógica Simbólica Global
        </h1>
        <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
          Plataforma colaborativa desarrollada por el aula. Selecciona el módulo de tu equipo para comenzar a programar.
        </p>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="team in teams"
          :key="team.id"
          :to="`/${team.id}`"
          class="group block"
        >
          <div class="h-full p-6 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all space-y-4 flex flex-col justify-between">
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-neutral-800 group-hover:text-blue-700 transition-colors">
                {{ team.name }}
              </h2>
              <p class="text-neutral-500 text-sm leading-relaxed">
                {{ team.desc }}
              </p>
            </div>
            <div class="mt-4 pt-4 border-t border-neutral-100 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
              Ir al módulo <span class="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        </router-link>
      </main>

      <footer class="text-center text-sm text-neutral-400 pt-12 border-t border-neutral-200">
        Proyecto EO - Liderado por Enri - Fecha Límite: 21 de Agosto de 2026
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const teams = [
  { id: "fundamentos", name: "1. Fundamentos del Lenguaje", desc: "Enunciados vs Proposiciones, Valores de verdad." },
  { id: "tablas", name: "2. Conectivos y Tablas de Verdad", desc: "Funciones veritativas, tautología, contingencia." },
  { id: "condicionales", name: "3. Transformaciones Condicionales", desc: "Conversa, Inversa, Contrapositiva." },
  { id: "inferencias", name: "4. Inferencias Lógicas Básicas", desc: "Modus Ponens, Tollens, Silogismos." },
  { id: "derivaciones", name: "5. Validaciones y Derivaciones", desc: "Método abreviado, derivación formal." },
  { id: "conjuntos", name: "6. Teoría de Conjuntos", desc: "Diagramas de Venn, operaciones con conjuntos." },
]
</script>
